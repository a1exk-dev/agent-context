import { spawnSync } from "node:child_process";
import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { scriptStatements } from "./assertions.ts";

const script = join(import.meta.dirname, "grade.ts");

type Statement = { id: string; text: string; grader: string };
type File = { path: string; before: string | null; after: string | null };

const statement = (id: string, grader = "script"): Statement => ({
    id,
    text: `Statement ${id}.`,
    grader,
});

// A sentence of 26 words, one more than the limit of the check script.
const long =
    "Run the full test suite with make test before you push a branch, and read each failure in the log before you change the code again.";

const agents = (rules: string) =>
    `# Agent rules\n\n## Before a commit\n\n${rules}\n`;

// The unified diff of one file, as `changes.diff` gives it.
function diff({ path, before, after }: File): string {
    const folder = mkdtempSync(join(tmpdir(), "grade-diff-"));
    const side = (name: string, text: string | null) => {
        const file = join(folder, name);
        writeFileSync(file, text ?? "");
        return file;
    };
    const result = spawnSync(
        "diff",
        [
            "-u",
            "--label",
            before === null ? "/dev/null" : `a/${path}`,
            "--label",
            after === null ? "/dev/null" : `b/${path}`,
            side("before", before),
            side("after", after),
        ],
        { encoding: "utf8" },
    );
    rmSync(folder, { recursive: true });
    return `diff --git a/${path} b/${path}\n${result.stdout}`;
}

// Saves a run folder of one output test, as the eval runners save it.
function runFolder(
    statements: Statement[],
    files: File[],
    options: { limitHit?: boolean; record?: RunRecord } = {},
): string {
    const evalDir = join(
        mkdtempSync(join(tmpdir(), "grade-")),
        "eval-03-edit-agents-md",
    );
    const runDir = join(evalDir, "with_skill", "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(join(outputs, "files"), { recursive: true });
    writeFileSync(
        join(evalDir, "eval_metadata.json"),
        JSON.stringify({
            eval_id: 3,
            eval_name: "03-edit-agents-md",
            prompt: "Add a rule to AGENTS.md.",
            setup: { overlay: null, remove: [] },
            assertions: statements,
            known_mistakes: null,
        }),
    );
    writeFileSync(join(outputs, "changes.diff"), files.map(diff).join(""));
    for (const file of files) {
        if (file.after === null) continue;
        const path = join(outputs, "files", file.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, file.after);
    }
    writeFileSync(join(outputs, "report.md"), "Done.\n");
    const record = options.record ?? { transcript: [] };
    writeFileSync(
        join(runDir, "transcript.jsonl"),
        (record.transcript ?? [])
            .map((event) => JSON.stringify(event))
            .join("\n"),
    );
    writeFileSync(
        join(runDir, "timing.json"),
        JSON.stringify({
            work_dir: WORK,
            tmp_dir: TMP,
            session_id: record.sessionId,
        }),
    );
    for (const [path, text] of Object.entries(record.saved ?? {})) {
        const saved = join(outputs, "tmp", path.slice(TMP.length + 1));
        mkdirSync(dirname(saved), { recursive: true });
        writeFileSync(saved, text);
    }
    if (record.sessions) {
        mkdirSync(join(runDir, "sessions"));
        for (const [id, session] of Object.entries(record.sessions))
            writeFileSync(
                join(runDir, "sessions", `${id}.json`),
                JSON.stringify(session),
            );
    }
    if (options.limitHit) writeFileSync(join(runDir, "LIMIT_HIT"), "");
    return runDir;
}

function grade(step: "script" | "merge", runDir: string) {
    const result = spawnSync(process.execPath, [script, step, runDir], {
        encoding: "utf8",
    });
    return {
        code: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

describe("grade script, script step", () => {
    it("grades no statement of a run that hit the usage limit", () => {
        const runDir = runFolder(
            [statement("7")],
            [{ path: "AGENTS.md", before: null, after: agents(long) }],
            { limitHit: true },
        );
        const result = grade("script", runDir);
        expect(result.code).toBe(1);
        expect(result.stderr).toMatch(/LIMIT_HIT/);
        expect(readJson(join(runDir, "script-grading.json"))).toEqual({
            status: "LIMIT_HIT",
        });
    });

    it("fails statement 7 for a 26-word sentence on an added line", () => {
        const runDir = runFolder(
            [statement("7")],
            [
                {
                    path: "AGENTS.md",
                    before: agents("Use pnpm."),
                    after: agents(`Use pnpm.\n\n${long}`),
                },
            ],
        );
        expect(grade("script", runDir).code).toBe(0);
        const grading = readJson(join(runDir, "script-grading.json"));
        expect(grading.status).toBe("graded");
        expect(grading.script).toEqual([
            {
                id: "7",
                text: "Statement 7.",
                passed: false,
                evidence: expect.stringContaining(
                    `AGENTS.md:7: The sentence has 26 words. "${long}"`,
                ),
            },
        ]);
    });

    it("passes statement 7 when the 26-word sentence is on an unchanged line", () => {
        const runDir = runFolder(
            [statement("7")],
            [
                {
                    path: "AGENTS.md",
                    before: agents(long),
                    after: agents(`${long}\n\nUse pnpm.`),
                },
            ],
        );
        expect(grade("script", runDir).code).toBe(0);
        const grading = readJson(join(runDir, "script-grading.json"));
        expect(grading.script).toEqual([
            {
                id: "7",
                text: "Statement 7.",
                passed: true,
                evidence: "No sentence over 25 words on an added line.",
            },
        ]);
    });
});

describe("grade script, 8b list", () => {
    // From run 08 of #145: the run changed the line, but the sentence was on
    // a removed line word for word.
    const kept =
        "Most of the business logic lives in `src/`, the API routes live in `src/routes/`, and shared types live in `src/types/`.";
    const pointer = "When you deploy, read `docs/agents/deploy.md`.";

    it("gives only the added sentences whose text is not on a removed line", () => {
        const runDir = runFolder(
            [statement("8b", "llm")],
            [
                {
                    path: "AGENTS.md",
                    before: agents(`${kept} Run \`make lint\`.`),
                    after: agents(`${kept}\n\n${pointer}`),
                },
            ],
        );
        expect(grade("script", runDir).code).toBe(0);
        const [item] = readJson(join(runDir, "script-grading.json")).llm;
        expect(item.list.map((entry: { text: string }) => entry.text)).toEqual([
            pointer,
        ]);
    });
});

describe("grade script, merge step", () => {
    const statements = [
        statement("7"),
        statement("3.1", "llm"),
        statement("4.1", "llm"),
        statement("8b", "advisory"),
    ];
    const files = [
        {
            path: "AGENTS.md",
            before: agents("Use pnpm."),
            after: agents("Use pnpm.\n\nRun `make test`."),
        },
    ];
    const yes = { item: "Item", answer: "yes", quote: "Use pnpm." };
    const no = { item: "Item", answer: "no", quote: "Run `make test`." };

    function merged(confirmers: Record<string, { agrees: boolean }[]>) {
        const runDir = runFolder(statements, files);
        grade("script", runDir);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({
                statements: [
                    { id: "3.1", checklist: [yes, no] },
                    { id: "4.1", checklist: [yes] },
                    { id: "8b", checklist: [no] },
                ],
            }),
        );
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify(confirmers),
        );
        const result = grade("merge", runDir);
        return { ...result, runDir };
    }

    it("shows an advisory statement but leaves it out of the pass count", () => {
        const result = merged({
            "3.1": [{ agrees: true }, { agrees: false }],
        });
        expect(result.code).toBe(0);
        const grading = readJson(join(result.runDir, "grading.json"));
        expect(grading.passed).toEqual(["7", "4.1"]);
        expect(grading.failed).toEqual(["3.1"]);
        expect(grading.advisory).toEqual(["8b"]);
        expect(
            grading.expectations.find(
                (item: { id: string }) => item.id === "8b",
            ),
        ).toEqual({
            id: "8b",
            text: "Statement 8b.",
            grader: "advisory",
            passed: false,
            evidence: 'no: Item "Run `make test`."',
        });
        expect(grading.summary).toEqual({
            passed: 2,
            failed: 1,
            total: 3,
            pass_rate: 2 / 3,
        });
    });

    it("passes a failed LLM statement when no confirmer agrees", () => {
        const result = merged({
            "3.1": [{ agrees: false }, { agrees: false }],
        });
        const grading = readJson(join(result.runDir, "grading.json"));
        expect(grading.failed).toEqual([]);
        expect(grading.summary.passed).toBe(3);
    });

    it("passes an LLM statement whose script list is empty with an empty checklist", () => {
        const runDir = runFolder([statement("8b", "llm")], files);
        grade("script", runDir);
        expect(
            readJson(join(runDir, "script-grading.json")).llm[0].list,
        ).toEqual([]);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({ statements: [{ id: "8b", checklist: [] }] }),
        );
        expect(grade("merge", runDir).code).toBe(0);
        const grading = readJson(join(runDir, "grading.json"));
        expect(grading.passed).toEqual(["8b"]);
        expect(grading.expectations[0].evidence).toBe(
            "The list of the script is empty.",
        );
    });

    it("stops when a failed LLM statement has no confirmer answers", () => {
        const result = merged({});
        expect(result.code).toBe(2);
        expect(result.stderr).toMatch(/3\.1/);
    });
});

// The project folder of the saved runs, the TMPDIR of the runs, and the
// folder that the run made with `mktemp -d` for the rounds.
const WORK = "/work/project";
const TMP = "/work/tmp";
const DIR = `${TMP}/tmp.Ab12Cd34`;
const CHECK = `node ${WORK}/.claude/skills/agent-instructions/scripts/check.ts`;

type RunRecord = {
    transcript?: unknown[];
    sessions?: Record<string, unknown>;
    sessionId?: string;
    saved?: Record<string, string>;
};
type Call = { name: string; input: Record<string, unknown> };
// The calls and the report of each subagent, or a function that gives them
// for the index of the subagent in the message.
type AgentOptions = {
    report?: string | ((index: number) => string);
    calls?: Call[] | ((index: number) => Call[]);
    failed?: number[];
    during?: () => void;
    handBack?: boolean;
};

const callsOf = (options: AgentOptions, index: number) =>
    typeof options.calls === "function"
        ? options.calls(index)
        : (options.calls ?? [read()]);
const reportOf = (options: AgentOptions, index: number) =>
    typeof options.report === "function"
        ? options.report(index)
        : (options.report ?? REPORT);

const REVIEWERS = [
    "loading reviewer",
    "ASD-STE100 reviewer",
    "ISO 24495-1 reviewer",
];
// The report folder of each reviewer, in the sequence of REVIEWERS.
const FOLDERS = ["loading", "ste", "iso"];
const TASKS = [
    "Make release 1.2.0.",
    "Make release 2.0.0.",
    "Make a feature branch.",
];

// The saved report of reviewer `index` for one file of a review round.
const reportPath = (round: number, index: number, file = "AGENTS.md") =>
    `${DIR}/round-${round}/${FOLDERS[index]}/${file}.md`;

type ReviewerOptions = { round?: number; changes?: string[]; folder?: boolean };

// The reviewer prompt of review.md: the review target, the changed files of
// the round, and the report folder of the reviewer.
const reviewerPrompt = (
    index: number,
    { round = 1, changes = ["AGENTS.md"], folder = true }: ReviewerOptions = {},
) =>
    [
        `You are the ${REVIEWERS[index]} for Agent instructions.`,
        `Check class: ${REVIEWERS[index]}`,
        "This task is read-only.",
        "",
        `Review target: ${WORK}/AGENTS.md`,
        `Changes: ${changes.map((file) => `${WORK}/${file}: "Before a commit"`).join("; ")}`,
        ...(folder
            ? [`Report folder: ${DIR}/round-${round}/${FOLDERS[index]}/`]
            : []),
        "",
    ].join("\n");
const readerPrompt = (task: string, file = "AGENTS.md") =>
    `Check class: reader\nThis task is a dry run.\n\nInstruction file: ${WORK}/${file}\nProject folder: ${WORK}\nTask: ${task}\n`;
const confirmerPrompt = (reports: string[]) =>
    `Check class: confirmer\nThis task is read-only.\n\nReports: ${reports.join(" ")}\nFindings: 1. ${WORK}/AGENTS.md "rule" "text"\n`;
const stepConfirmerPrompt = (report: string, file = "AGENTS.md") =>
    `Check class: confirmer\nThis task is read-only.\n\nInstruction file: ${WORK}/${file}\nProject folder: ${WORK}\nTask: ${TASKS[0]}\nReport: ${report}\nSteps: 1. "Run make test." "Run \`make test\`."\n`;

// A reviewer report with one finding. Its Text quote is not in the file, so
// the report form drops it.
const REPORT =
    'Blocking checklist:\n\n- Rule: "Each sentence has a maximum of 25 words."\n- Text: "This text is not in the file."\n- Problem: The sentence is long.\n- Correction: Write a short sentence.\n';
// A reviewer report with one blocking finding whose quotes are in the copy
// of the round and in the rule files.
const BLOCKING_REPORT =
    '- Rule: 3.6 "Use the active voice (rule 3.6)."\n- Text: "Use pnpm."\n- Problem: The sentence is in the passive voice.\n- Correction: Use pnpm.\n';
// The closed lists of the 2 typical reader tasks.
const CLOSED_YES = '1. yes: "Run make test." - "Run `make test`."\n';
const CLOSED_NO = '1. no: "Run make test." - "Run `make test`."\n';
const READER_REPORT =
    'Part 1: Steps\n1. Run make test.\nPart 2: Used parts\n1. "Run `make test`."\nPart 3: Unclear parts\nNone\n';
// The tool result of a Claude Code subagent that gives its report only to
// the main agent, as run records 01 and 08 of #145 show: a frame line, the
// report with each line indented, and the agent id line.
const handBack = (report: string) =>
    `[Subagent hand-back] The text below is the final report of a subagent this session delegated to. The harness indents every line of the report. The report follows:\n${report
        .split("\n")
        .map((line) => (line ? `  ${line}` : "  "))
        .join(
            "\n",
        )}\nagentId: adcba5bdadce0406b (use SendMessage with to: 'adcba5bdadce0406b' to continue this agent)\n<usage>subagent_tokens: 40375\ntool_uses: 7</usage>`;
const read = (file = "AGENTS.md"): Call => ({
    name: "Read",
    input: { file_path: `${WORK}/${file}` },
});

// The tools that the main agent uses on one platform.
type Builder = {
    agents(prompts: string[], options?: AgentOptions): Builder;
    bash(command: string): Builder;
    edit(file?: string): Builder;
    write(path: string, text: string): Builder;
    save(path: string, text: string): Builder;
    record(): RunRecord;
};

// A Claude Code transcript.jsonl.
function claude(): Builder {
    const events: unknown[] = [];
    const saved: Record<string, string> = {};
    let next = 0;
    const id = (prefix: string) => `${prefix}-${++next}`;
    const assistant = (parent: string | null, content: unknown[]) =>
        events.push({
            type: "assistant",
            parent_tool_use_id: parent,
            message: { id: id("msg"), content },
        });
    const result = (toolUseId: string, text: string, error = false) =>
        events.push({
            type: "user",
            parent_tool_use_id: null,
            message: {
                content: [
                    {
                        type: "tool_result",
                        tool_use_id: toolUseId,
                        is_error: error,
                        content: [{ type: "text", text }],
                    },
                ],
            },
        });
    const call = (name: string, input: Record<string, unknown>) => {
        const toolUseId = id("toolu");
        assistant(null, [{ type: "tool_use", id: toolUseId, name, input }]);
        result(toolUseId, "Done.");
        return builder;
    };
    const builder: Builder = {
        agents(prompts, options = {}) {
            const message = id("msg");
            const ids = prompts.map((prompt) => {
                const toolUseId = id("toolu");
                events.push({
                    type: "assistant",
                    parent_tool_use_id: null,
                    message: {
                        id: message,
                        content: [
                            {
                                type: "tool_use",
                                id: toolUseId,
                                name: "Agent",
                                input: {
                                    description: "Check",
                                    subagent_type: "general-purpose",
                                    prompt,
                                },
                            },
                        ],
                    },
                });
                return toolUseId;
            });
            options.during?.();
            ids.forEach((toolUseId, index) => {
                const fail = options.failed?.includes(index) ?? false;
                for (const item of callsOf(options, index))
                    assistant(toolUseId, [
                        {
                            type: "tool_use",
                            id: id("toolu"),
                            name: item.name,
                            input: item.input,
                        },
                    ]);
                const report = reportOf(options, index);
                if (!fail && !options.handBack)
                    assistant(toolUseId, [{ type: "text", text: report }]);
                result(
                    toolUseId,
                    fail
                        ? "Error."
                        : options.handBack
                          ? handBack(report)
                          : "Report.",
                    fail,
                );
            });
            return builder;
        },
        bash: (command) => call("Bash", { command }),
        edit: (file = "AGENTS.md") =>
            call("Edit", { file_path: `${WORK}/${file}` }),
        write(path, text) {
            saved[path] = text;
            return call("Write", { file_path: path, content: text });
        },
        save(path, text) {
            saved[path] = text;
            return builder;
        },
        record: () => ({ transcript: events, saved }),
    };
    return builder;
}

// The OpenCode session exports of a run in sessions/.
function openCode(): Builder {
    const messages: unknown[] = [];
    const sessions: Record<string, unknown> = {};
    const saved: Record<string, string> = {};
    let time = 1000;
    const part = (tool: string, input: Record<string, unknown>) => ({
        type: "tool",
        tool,
        state: {
            status: "completed",
            input,
            time: { start: ++time, end: ++time },
        },
    });
    const message = (parts: unknown[]) =>
        messages.push({
            info: {
                id: `msg_${messages.length}`,
                role: "assistant",
                time: { created: time },
                finish: "tool-calls",
            },
            parts,
        });
    const call = (tool: string, input: Record<string, unknown>) => {
        message([part(tool, input)]);
        return builder;
    };
    const builder: Builder = {
        agents(prompts, options = {}) {
            const start = ++time;
            const parts = prompts.map((prompt, index) => {
                const fail = options.failed?.includes(index) ?? false;
                const child = `ses_child${Object.keys(sessions).length}`;
                sessions[child] = {
                    info: { id: child, directory: WORK },
                    messages: [
                        {
                            info: { id: `${child}_1`, role: "assistant" },
                            parts: [
                                ...callsOf(options, index).map((item) =>
                                    part(item.name.toLowerCase(), item.input),
                                ),
                                ...(fail
                                    ? []
                                    : [
                                          {
                                              type: "text",
                                              text: reportOf(options, index),
                                          },
                                      ]),
                            ],
                        },
                    ],
                };
                return {
                    type: "tool",
                    tool: "task",
                    state: {
                        status: fail ? "error" : "completed",
                        input: {
                            description: "Check",
                            subagent_type: "general",
                            prompt,
                        },
                        metadata: { sessionId: child },
                        time: { start, end: start + 500 },
                    },
                };
            });
            message(parts);
            time = start + 500;
            return builder;
        },
        bash: (command) => call("bash", { command }),
        edit: (file = "AGENTS.md") =>
            call("edit", { filePath: `${WORK}/${file}` }),
        write(path, text) {
            saved[path] = text;
            return call("write", { filePath: path, content: text });
        },
        save(path, text) {
            saved[path] = text;
            return builder;
        },
        record: () => ({
            saved,
            sessionId: "ses_main",
            sessions: {
                ses_main: {
                    info: { id: "ses_main", directory: WORK },
                    messages,
                },
                ...sessions,
            },
        }),
    };
    return builder;
}

// The text of AGENTS.md before the run, and the copy of each round.
const BEFORE = agents("Use pnpm.");

// The changed files of a run: AGENTS.md alone, AGENTS.md with a new file,
// and AGENTS.md with a new pointer.
const ONE_FILE: File[] = [
    {
        path: "AGENTS.md",
        before: BEFORE,
        after: agents("Use pnpm.\n\nRun `make test`."),
    },
];
const DEPLOY = "docs/agents/deploy.md";
const TWO_FILES: File[] = [
    ...ONE_FILE,
    { path: DEPLOY, before: null, after: "# Deploy\n\nRun `make deploy`.\n" },
];
const TESTING = "docs/agents/testing.md";
const POINTER: File[] = [
    {
        path: "AGENTS.md",
        before: BEFORE,
        after: agents(`Use pnpm.\n\nBefore you test, read \`${TESTING}\`.`),
    },
];

const reportForm = (file = "AGENTS.md", round = 1) =>
    `${CHECK} --reports --file ${WORK}/${file} ${FOLDERS.map((_, index) => reportPath(round, index, file)).join(" ")} > ${DIR}/round-${round}/form.json`;
const readerReports = (round: number) =>
    TASKS.map(
        (_, index) => `${DIR}/reader-round-${round}/reader-${index + 1}.md`,
    );
const closedLists = (round: number) =>
    [1, 2].map((task) => `${DIR}/reader-round-${round}/closed-list-${task}.md`);
const readerForm = (file = "AGENTS.md", round = 1) =>
    `${CHECK} --reports --file ${WORK}/${file} --copy ${DIR}/copy.md --tasks ${DIR}/tasks.json ${readerReports(round).join(" ")} > ${DIR}/reader-round-${round}/form.json`;

// Saves the copy of each file of a review round and the report of each
// reviewer for each file, as review.md tells. `reports` gives the report
// text of each reviewer.
function saveReviewRound(
    run: Builder,
    round = 1,
    files = ["AGENTS.md"],
    reports = [REPORT, REPORT, REPORT],
) {
    for (const file of files) {
        run.save(`${DIR}/round-${round}/${file}`, BEFORE);
        reports.forEach((text, index) => {
            run.save(reportPath(round, index, file), text);
        });
    }
}

type ReviewerStart = {
    round?: number;
    files?: string[];
    indexes?: number[];
    reads?: (index: number) => string[];
    failed?: number[];
    folder?: boolean;
    handBack?: boolean;
};

// Starts reviewers in one message. Each one reads the files of the round
// and `reads`, saves its report of each file with a Write call, and gives
// the saved paths in its last message.
function startReviewers(run: Builder, options: ReviewerStart = {}) {
    const { round = 1, files = ["AGENTS.md"], indexes = [0, 1, 2] } = options;
    return run.agents(
        indexes.map((index) =>
            reviewerPrompt(index, {
                round,
                changes: files,
                folder: options.folder,
            }),
        ),
        {
            calls: (n) => [
                ...(options.reads?.(indexes[n]) ?? files).map((file) =>
                    read(file),
                ),
                ...files.map((file) => ({
                    name: "Write",
                    input: {
                        file_path: reportPath(round, indexes[n], file),
                        content: REPORT,
                    },
                })),
            ],
            report: (n) =>
                files
                    .map((file) => reportPath(round, indexes[n], file))
                    .join("\n"),
            failed: options.failed,
            handBack: options.handBack,
        },
    );
}

type RoundOptions = {
    round?: number;
    files?: string[];
    file?: string;
    reports?: string[];
    reads?: (index: number) => string[];
    closed?: string[];
    calls?: Call[];
    vote?: (run: Builder) => void;
};

// One review round, as review.md tells: the copy of each file, the check
// script, the 3 reviewers in one message, the saved reports, the report
// form of each file, the vote, then the corrections.
const reviewRound = (run: Builder, options: RoundOptions = {}) => {
    const { round = 1, files = ["AGENTS.md"] } = options;
    saveReviewRound(run, round, files, options.reports);
    run.bash(
        `${CHECK} ${files.map((file) => `${WORK}/${file}`).join(" ")} --project ${WORK} --glossary none > ${DIR}/round-${round}/script.json`,
    );
    startReviewers(run, { round, files, reads: options.reads });
    for (const file of files) run.bash(reportForm(file, round));
    options.vote?.(run);
    for (const file of files) run.edit(file);
    return run;
};

// One reader-test round of one file: the copy, the 3 readers in one message,
// the saved reports and the report form for reader reports, the closed
// lists, the vote, then the correction.
const readerRound = (run: Builder, options: RoundOptions = {}) => {
    const { round = 1, file = "AGENTS.md" } = options;
    run.save(`${DIR}/reader-round-${round}/${file}`, BEFORE);
    run.agents(
        TASKS.map((task) => readerPrompt(task, file)),
        { report: READER_REPORT, calls: options.calls },
    );
    for (const path of readerReports(round)) run.save(path, READER_REPORT);
    run.bash(readerForm(file, round));
    const closed = options.closed ?? [CLOSED_YES, CLOSED_YES];
    closedLists(round).forEach((path, index) => {
        if (closed[index] !== undefined) run.save(path, closed[index]);
    });
    options.vote?.(run);
    return run.edit(file);
};

// Starts confirmers in groups of 3, one message for each group.
function startConfirmers(run: Builder, reports: string[][]) {
    for (let index = 0; index < reports.length; index += 3)
        run.agents(reports.slice(index, index + 3).map(confirmerPrompt), {
            report: "1. yes: The sentence is passive.",
        });
}

const PROCESS = ["1", "2", "3a", "3c", "4"];

// Grades the process statements of a run and gives the verdict of each id.
function processVerdicts(record: RunRecord, ids = PROCESS, files = ONE_FILE) {
    const runDir = runFolder(
        ids.map((id) => statement(id)),
        files,
        { record },
    );
    const result = grade("script", runDir);
    expect(result.stderr).toBe("");
    expect(result.code).toBe(0);
    const grading = readJson(join(runDir, "script-grading.json"));
    return Object.fromEntries(
        grading.script.map(
            (item: { id: string; passed: boolean; evidence: string }) => [
                item.id,
                item,
            ],
        ),
    ) as Record<string, { passed: boolean; evidence: string }>;
}

const passed = (verdicts: Record<string, { passed: boolean }>) =>
    Object.keys(verdicts)
        .toSorted()
        .filter((id) => verdicts[id].passed);

describe("process statements", () => {
    for (const [platform, start] of [
        ["Claude Code", claude],
        ["OpenCode", openCode],
    ] as const) {
        // [1] of a run whose reviewers give blocking findings: `reports`
        // gives the report text of each reviewer for each file, and
        // `confirmers` the Reports paths of each confirmer.
        const blockingVote = (
            reports: string[],
            confirmers: string[][],
            files = ONE_FILE,
        ) => {
            const run = start();
            reviewRound(run, {
                files: files.map((file) => file.path),
                reports,
                vote: (round) => startConfirmers(round, confirmers),
            });
            readerRound(run);
            return processVerdicts(run.record(), PROCESS, files)["1"];
        };
        const [loading, ste] = [reportPath(1, 0), reportPath(1, 1)];
        const blocking = [BLOCKING_REPORT, REPORT, REPORT];

        it(`passes each process statement of a ${platform} run that obeys review.md`, () => {
            const run = start();
            reviewRound(run);
            readerRound(run);
            const verdicts = processVerdicts(run.record());
            expect(passed(verdicts)).toEqual(PROCESS);
            expect(verdicts["1"].evidence).toBe(
                "1 review rounds with 1 reviewer of each class in one message, a report of each reviewer for each file, 2 confirmers for each reviewer with blocking findings, and no file change before the last report.",
            );
            expect(verdicts["2"].evidence).toMatch(
                /Review round 1, AGENTS\.md: the report form ran\. 3 dropped findings in 3 reports/,
            );
        });

        it(`fails [3a] for a ${platform} reader that runs a Bash redirect`, () => {
            const run = start();
            reviewRound(run);
            readerRound(run, {
                calls: [
                    read(),
                    {
                        name: "Bash",
                        input: { command: "cat AGENTS.md > /tmp/x" },
                    },
                ],
            });
            const verdicts = processVerdicts(run.record());
            expect(verdicts["3a"].passed).toBe(false);
            expect(verdicts["3a"].evidence).toContain(
                'runs "cat AGENTS.md > /tmp/x"',
            );
        });

        it(`passes [1] and [2] for ${platform} reviewers of 2 files with 6 reports`, () => {
            const run = start();
            reviewRound(run, { files: ["AGENTS.md", DEPLOY] });
            readerRound(run);
            const verdicts = processVerdicts(run.record(), PROCESS, TWO_FILES);
            expect(passed(verdicts)).toEqual(PROCESS);
            expect(verdicts["2"].evidence).toMatch(
                /Review round 1, docs\/agents\/deploy\.md: the report form ran\. 3 dropped findings in 3 reports/,
            );
        });

        it(`passes [1] for ${platform} reviewers that read the pointer targets`, () => {
            const run = start();
            reviewRound(run, { reads: () => ["AGENTS.md", TESTING] });
            readerRound(run);
            expect(
                processVerdicts(run.record(), PROCESS, POINTER)["1"].passed,
            ).toBe(true);
        });

        it(`fails [1] for a ${platform} reviewer that did not read a pointer target`, () => {
            const run = start();
            reviewRound(run, {
                reads: (index) =>
                    index === 1 ? ["AGENTS.md"] : ["AGENTS.md", TESTING],
            });
            readerRound(run);
            expect(
                processVerdicts(run.record(), PROCESS, POINTER)["1"],
            ).toMatchObject({
                passed: false,
                evidence: `Review round 1: the ASD-STE100 reviewer did not read ${TESTING}.`,
            });
        });

        it(`fails [1] for ${platform} reviewers that did not read a file of the round`, () => {
            const run = start();
            reviewRound(run, {
                files: ["AGENTS.md", DEPLOY],
                reads: (index) =>
                    index === 2 ? ["AGENTS.md"] : ["AGENTS.md", DEPLOY],
            });
            readerRound(run);
            expect(
                processVerdicts(run.record(), PROCESS, TWO_FILES)["1"],
            ).toMatchObject({
                passed: false,
                evidence: `Review round 1: the ISO 24495-1 reviewer did not read ${DEPLOY}.`,
            });
        });

        it(`fails [1] for ${platform} reviewers that start 3 for each file`, () => {
            const run = start();
            saveReviewRound(run, 1, ["AGENTS.md", DEPLOY]);
            startReviewers(run, { files: ["AGENTS.md"] });
            startReviewers(run, { files: [DEPLOY] });
            run.bash(reportForm()).bash(reportForm(DEPLOY)).edit();
            readerRound(run);
            const verdict = processVerdicts(run.record(), PROCESS, TWO_FILES)[
                "1"
            ];
            expect(verdict.passed).toBe(false);
            expect(verdict.evidence).toContain(
                "Review round 1: 2 subagents of the loading reviewer, and the first did not fail.",
            );
        });

        it(`fails [1] for ${platform} reviewers of one round in different messages`, () => {
            const run = start();
            saveReviewRound(run);
            for (const index of [0, 1, 2])
                startReviewers(run, { indexes: [index] });
            run.bash(reportForm()).edit();
            readerRound(run);
            expect(processVerdicts(run.record())["1"]).toMatchObject({
                passed: false,
                evidence:
                    "Review round 1: the reviewers of the round start in different messages.",
            });
        });

        it(`fails [1] for a ${platform} run without the report of one reviewer`, () => {
            const run = start();
            reviewRound(run);
            readerRound(run);
            const record = run.record();
            delete record.saved?.[reportPath(1, 2)];
            expect(processVerdicts(record)["1"]).toMatchObject({
                passed: false,
                evidence: expect.stringContaining(
                    "Review round 1: AGENTS.md has no report of the ISO 24495-1 reviewer.",
                ),
            });
        });

        it(`fails [1] for a ${platform} reviewer prompt without a report folder`, () => {
            const run = start();
            saveReviewRound(run);
            startReviewers(run, { indexes: [0, 1] });
            startReviewers(run, { indexes: [2], folder: false });
            run.bash(reportForm()).edit();
            readerRound(run);
            expect(processVerdicts(run.record())["1"]).toMatchObject({
                passed: false,
                evidence: expect.stringContaining(
                    "The ISO 24495-1 reviewer subagent has no report folder.",
                ),
            });
        });

        it(`passes [1] for 2 ${platform} confirmers of a reviewer with blocking findings`, () => {
            expect(
                blockingVote(blocking, [[loading], [loading]]),
            ).toMatchObject({ passed: true });
        });

        it(`passes [1] for 2 ${platform} confirmers that give the blocking reports of 2 files`, () => {
            const both = [loading, reportPath(1, 0, DEPLOY)];
            expect(
                blockingVote(blocking, [both, both], TWO_FILES),
            ).toMatchObject({ passed: true });
        });

        it(`fails [1] for ${platform} confirmers that leave out a blocking report of their reviewer`, () => {
            expect(
                blockingVote(blocking, [[loading], [loading]], TWO_FILES),
            ).toMatchObject({
                passed: false,
                evidence: `Review round 1: a confirmer of the loading reviewer does not give ${reportPath(1, 0, DEPLOY)}.\nReview round 1: a confirmer of the loading reviewer does not give ${reportPath(1, 0, DEPLOY)}.`,
            });
        });

        it(`fails [1] for 1 ${platform} confirmer of a reviewer with blocking findings`, () => {
            expect(blockingVote(blocking, [[loading]])).toMatchObject({
                passed: false,
                evidence:
                    "Review round 1: the loading reviewer has 1 blocking findings and 1 confirmers.",
            });
        });

        it(`fails [1] for a ${platform} confirmer of a reviewer without blocking findings`, () => {
            expect(
                blockingVote(blocking, [[loading], [loading], [ste]]),
            ).toMatchObject({
                passed: false,
                evidence:
                    "Review round 1: the ASD-STE100 reviewer has 0 blocking findings and 1 confirmers.",
            });
        });

        it(`fails [1] for 4 ${platform} confirmers of one reviewer`, () => {
            expect(
                blockingVote(blocking, Array(4).fill([loading])),
            ).toMatchObject({
                passed: false,
                evidence:
                    "Review round 1: the loading reviewer has 1 blocking findings and 4 confirmers.",
            });
        });

        it(`fails [1] for a ${platform} confirmer that gives the reports of 2 reviewers`, () => {
            expect(
                blockingVote(blocking, [[loading], [loading, ste]]),
            ).toMatchObject({
                passed: false,
                evidence: expect.stringContaining(
                    "Review round 1: a confirmer gives the reports of 2 reviewers.",
                ),
            });
        });

        it(`fails [1] for 7 ${platform} confirmers in a review round`, () => {
            const all = [0, 1, 2].map((index) => reportPath(1, index));
            expect(
                blockingVote(
                    [BLOCKING_REPORT, BLOCKING_REPORT, BLOCKING_REPORT],
                    [
                        all[0],
                        all[0],
                        all[0],
                        all[1],
                        all[1],
                        all[2],
                        all[2],
                    ].map((path) => [path]),
                ),
            ).toMatchObject({
                passed: false,
                evidence: expect.stringContaining(
                    "Review round 1 has 7 confirmers.",
                ),
            });
        });

        it(`passes [1] when the ${platform} run starts one new subagent for a failed reviewer`, () => {
            const run = start();
            saveReviewRound(run);
            startReviewers(run, { failed: [2] });
            startReviewers(run, { indexes: [2] });
            run.bash(reportForm()).edit();
            readerRound(run);
            const verdicts = processVerdicts(run.record());
            expect(verdicts["1"].passed).toBe(true);
            expect(verdicts["4"].evidence).toBe(
                "1 review rounds and 1 reader-test rounds.",
            );
        });

        it(`passes [1] when the ${platform} run saves the report of a reviewer that failed 2 times`, () => {
            const run = start();
            saveReviewRound(run);
            startReviewers(run, { failed: [2] });
            startReviewers(run, { indexes: [2], failed: [0] });
            run.write(
                reportPath(1, 2),
                `Round 1: ISO 24495-1 review, AGENTS.md\n${REPORT}`,
            )
                .bash(reportForm())
                .edit();
            expect(processVerdicts(run.record(), ["1"])["1"].passed).toBe(true);
        });

        it(`fails [1] when the ${platform} run starts no new subagent for a failed reviewer`, () => {
            const run = start();
            saveReviewRound(run);
            startReviewers(run, { failed: [2] });
            run.bash(reportForm()).edit();
            readerRound(run);
            expect(processVerdicts(run.record())["1"].evidence).toBe(
                "Review round 1: the ISO 24495-1 reviewer subagent failed, and the run started no new subagent.",
            );
        });

        it(`passes round 2 of a ${platform} run for the one changed file of 2`, () => {
            const run = start();
            reviewRound(run, { files: ["AGENTS.md", DEPLOY] });
            reviewRound(run, { round: 2 });
            readerRound(run);
            const verdicts = processVerdicts(run.record(), PROCESS, TWO_FILES);
            expect(passed(verdicts)).toEqual(PROCESS);
            expect(verdicts["2"].evidence).toMatch(
                /Review round 2, AGENTS\.md: the report form ran/,
            );
            expect(verdicts["2"].evidence).not.toMatch(/Review round 2, docs/);
        });

        it(`grades the rounds of a ${platform} run that did the checks itself`, () => {
            const run = start();
            for (let round = 1; round <= 4; round++) {
                run.save(`${DIR}/round-${round}/AGENTS.md`, BEFORE);
                for (const index of [0, 1, 2])
                    run.write(
                        reportPath(round, index),
                        `Round ${round}: ${REVIEWERS[index].replace(" reviewer", "")} review, AGENTS.md\n${REPORT}`,
                    );
                run.bash(reportForm("AGENTS.md", round)).edit();
            }
            const verdicts = processVerdicts(run.record(), ["1", "2", "4"]);
            expect(verdicts["1"].passed).toBe(true);
            expect(verdicts["2"].passed).toBe(true);
            expect(verdicts["4"]).toMatchObject({
                passed: false,
                evidence: "4 review rounds and 0 reader-test rounds.",
            });
        });
    }

    it("takes the report of a subagent from its hand-back tool result", () => {
        const run = claude();
        saveReviewRound(
            run,
            1,
            ["AGENTS.md"],
            [BLOCKING_REPORT, REPORT, REPORT],
        );
        startReviewers(run, { handBack: true })
            .bash(reportForm())
            .agents(
                [1, 2].map(() => confirmerPrompt([reportPath(1, 0)])),
                { handBack: true, report: "1. yes: The text is passive." },
            )
            .edit();
        readerRound(run);
        const verdicts = processVerdicts(run.record());
        expect(passed(verdicts)).toEqual(PROCESS);
    });

    it("fails [3a] for a reader that writes a file", () => {
        const run = claude();
        reviewRound(run);
        readerRound(run, {
            calls: [{ name: "Write", input: { file_path: "/tmp/notes.md" } }],
        });
        expect(processVerdicts(run.record())["3a"].passed).toBe(false);
    });

    it("passes [3a] for a reader that runs only read-only commands", () => {
        const run = claude();
        reviewRound(run);
        readerRound(run, {
            calls: [
                {
                    name: "Bash",
                    input: {
                        command:
                            "grep -n release AGENTS.md | head -5; sed -n '1,20p' AGENTS.md && git log --oneline -3",
                    },
                },
            ],
        });
        expect(processVerdicts(run.record())["3a"].passed).toBe(true);
    });

    // Reader commands from the run records 01 and 08 of #145.
    it.each([
        `cd ${WORK} && ls -R .claude docs 2>/dev/null; git branch -a; git log --oneline --all | head`,
        `ls -a ${WORK}; cat ${WORK}/package.json ${WORK}/Makefile 2>&1`,
        `cd ${WORK}; cat CHANGELOG.md; echo ----; git branch; git remote -v; pwd`,
        "git branch --list && git ls-files docs && git rev-parse --show-toplevel",
        // Run records 05 and 02 of #145, round 2.
        'for f in Makefile package.json CONTEXT.md; do echo "== $f"; cat $f; done',
        `ls -a && grep -n '"version"' package.json; git branch -a; git tag 2>/dev/null; git log --oneline -5`,
        "git tag -l && git tag --list",
        "for f in a.md b.md\ndo\n  head -5 $f\ndone | wc -l",
    ])("passes [3a] for the read-only reader command %s", (command) => {
        const run = claude();
        reviewRound(run);
        readerRound(run, { calls: [{ name: "Bash", input: { command } }] });
        expect(processVerdicts(run.record())["3a"].passed).toBe(true);
    });

    it.each([
        "echo text > notes.md",
        "cat AGENTS.md 2>/tmp/errors",
        "git branch -D feature/coupons",
        "git remote add origin https://example.com/repo.git",
        "git rev-parse HEAD > /tmp/head; echo done",
        "for f in a.md b.md; do rm $f; done",
        "for f in a.md; do cat $f; done; for g in b.md; do cat $g",
        "do cat a.md; done",
        "for 1f in a.md; do cat $1f; done",
        "git tag v1.0.0",
        "git tag -d v1.0.0",
    ])("fails [3a] for the reader command %s", (command) => {
        const run = claude();
        reviewRound(run);
        readerRound(run, { calls: [{ name: "Bash", input: { command } }] });
        expect(processVerdicts(run.record())["3a"].passed).toBe(false);
    });

    it("fails [4] for a run with 4 review rounds", () => {
        const run = claude();
        for (let round = 1; round <= 4; round++) reviewRound(run, { round });
        readerRound(run);
        const verdicts = processVerdicts(run.record());
        expect(verdicts["4"]).toMatchObject({
            passed: false,
            evidence: "4 review rounds and 1 reader-test rounds.",
        });
        expect(verdicts["1"].passed).toBe(true);
    });

    it("fails [1] for a subagent whose prompt has no class line", () => {
        const run = claude();
        reviewRound(run);
        run.agents(["Review the file AGENTS.md."]);
        readerRound(run);
        const verdicts = processVerdicts(run.record());
        expect(verdicts["1"].passed).toBe(false);
        expect(verdicts["1"].evidence).toMatch(/no class line/);
    });

    it("fails [1] for a file change before the last report of a round", () => {
        const run = claude();
        saveReviewRound(run);
        run.agents(
            [0, 1, 2].map((index) => reviewerPrompt(index)),
            { during: () => run.edit() },
        )
            .bash(reportForm())
            .edit();
        readerRound(run);
        const verdicts = processVerdicts(run.record());
        expect(verdicts["1"].passed).toBe(false);
        expect(verdicts["1"].evidence).toMatch(
            /Review round 1: Edit changes AGENTS\.md before the last report/,
        );
    });

    it("fails [1] when a report file of the report form is missing", () => {
        const run = claude();
        saveReviewRound(run);
        startReviewers(run)
            .bash(reportForm().replace("iso/AGENTS.md.md", "iso/missing.md"))
            .edit();
        readerRound(run);
        expect(processVerdicts(run.record())["1"]).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Review round 1: the report file ${DIR}/round-1/iso/missing.md is missing.`,
            ),
        });
    });

    // A reader-test round whose first closed list has `first`, with `count`
    // confirmers for that list and `others` for the second list.
    const stepVote = (first: string, count: number, others = 0) => {
        const run = claude();
        const [one, two] = closedLists(1);
        reviewRound(run);
        readerRound(run, {
            closed: [first, CLOSED_YES],
            vote: (round) =>
                round.agents(
                    [
                        ...Array(count).fill(stepConfirmerPrompt(one)),
                        ...Array(others).fill(stepConfirmerPrompt(two)),
                    ],
                    { report: "1. yes: The step does not run the tests." },
                ),
        });
        return processVerdicts(run.record())["3a"];
    };

    it("passes [3a] for 2 confirmers of a closed list with a no", () => {
        expect(stepVote(CLOSED_NO, 2)).toMatchObject({ passed: true });
    });

    it("fails [3a] for 1 confirmer of a closed list with a no", () => {
        expect(stepVote(CLOSED_NO, 1)).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Reader-test round 1: the closed list ${DIR}/reader-round-1/closed-list-1.md has 1 "no" answers and 1 confirmers.`,
            ),
        });
    });

    it("fails [3a] for a confirmer of a closed list with no no", () => {
        expect(stepVote(CLOSED_NO, 2, 1)).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Reader-test round 1: the closed list ${DIR}/reader-round-1/closed-list-2.md has 0 "no" answers and 1 confirmers.`,
            ),
        });
    });

    it("fails [3a] when a closed list is missing", () => {
        const run = claude();
        reviewRound(run);
        readerRound(run, { closed: [CLOSED_YES] });
        expect(processVerdicts(run.record())["3a"]).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                "Reader-test round 1: 1 closed lists for 1 files. Each file has 2 typical tasks.",
            ),
        });
    });

    it("fails [2] and [3c] when the run corrects the file before the report form", () => {
        const run = claude();
        startReviewers(run)
            .edit()
            .bash(reportForm())
            .agents(
                TASKS.map((task) => readerPrompt(task)),
                {
                    report: READER_REPORT,
                },
            )
            .edit();
        const verdicts = processVerdicts(run.record());
        expect(verdicts["2"].passed).toBe(false);
        expect(verdicts["2"].evidence).toMatch(
            /Review round 1, AGENTS\.md: no report form before the correction/,
        );
        expect(verdicts["3c"].passed).toBe(false);
    });
});

// Grades one script statement of a run with the given files.
function scriptVerdict(id: string, files: File[]) {
    const runDir = runFolder([statement(id)], files);
    expect(grade("script", runDir).code).toBe(0);
    return readJson(join(runDir, "script-grading.json")).script[0];
}

describe("script statements", () => {
    // From run 01 of #145: the fail rules name the release branch by its
    // name pattern.
    it("passes [1.5] for fail rules that name the branch release/<version>", () => {
        const skillMd = [
            "# Release",
            "",
            "When a step of this skill fails, read `references/failed-step.md` before your next action.",
            "",
            "When you open the pull request, read `references/pull-request-text.md` to write its text.",
            "",
            "1. Run `make test`.",
            "2. Run `git push -u origin release/<version>`.",
            "3. Run `gh pr create`.",
            "",
        ].join("\n");
        const failed = [
            "# Failed step",
            "",
            "## When a step of the release skill fails",
            "",
            "- Stop. Do not do the next step.",
            "- If the branch `release/<version>` exists, keep it.",
            "- Tell the user the number and the section of the step that failed.",
            "",
        ].join("\n");
        const template =
            "# Pull request text\n\n## Summary\n\n## Changes\n\n## Version\n";
        const added = (path: string, after: string) => ({
            path: `.claude/skills/release/${path}`,
            before: null,
            after,
        });
        expect(
            scriptVerdict("1.5", [
                added("SKILL.md", skillMd),
                added("references/failed-step.md", failed),
                added("references/pull-request-text.md", template),
            ]),
        ).toMatchObject({ passed: true });
    });

    // From run 09 of #145: loading-rules.md tells the author to write a new
    // heading with the condition in the old place of a moved section.
    it("passes [9.2] for a moved section whose old place has a new heading", () => {
        const deploy = [
            "## Deploy",
            "",
            "1. Read `CHANGELOG.md` and find the version to deploy.",
            "2. Run `make deploy`.",
            "3. Tell the user the version.",
            "",
        ].join("\n");
        const before = `# Agent rules\n\n## Before a commit\n\nUse pnpm.\n\n${deploy}\n## Security\n\nKeep secrets out of Git.\n`;
        const after = before.replace(
            deploy,
            "## When the user asks for a deploy\n\nWhen the user asks for a deploy, read `docs/agents/deploy.md`.\n",
        );
        expect(
            scriptVerdict("9.2", [
                { path: "AGENTS.md", before, after },
                {
                    path: "docs/agents/deploy.md",
                    before: null,
                    after: `# Deploy\n\n${deploy}`,
                },
            ]),
        ).toMatchObject({ passed: true });
    });

    it("has one function for each script statement id in evals.json", () => {
        const evals: { assertions: Statement[] }[] = readJson(
            join(import.meta.dirname, "evals.json"),
        ).evals;
        const ids = new Set(
            evals.flatMap((ev) =>
                ev.assertions
                    .filter((item) => item.grader === "script")
                    .map((item) => item.id),
            ),
        );
        expect(Object.keys(scriptStatements).toSorted()).toEqual(
            [...ids].toSorted(),
        );
    });
});
