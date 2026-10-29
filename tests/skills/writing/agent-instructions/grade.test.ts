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
type AgentOptions = {
    report?: string;
    calls?: Call[];
    failed?: number[];
    during?: () => void;
    handBack?: boolean;
};

const REVIEWERS = [
    "loading reviewer",
    "ASD-STE100 reviewer",
    "ISO 24495-1 reviewer",
];
const TASKS = [
    "Make release 1.2.0.",
    "Make release 2.0.0.",
    "Make a feature branch.",
];

const reviewerPrompt = (name: string, file = "AGENTS.md") =>
    `You are the ${name} for an Agent instruction.\nCheck class: ${name}\nThis task is read-only.\n\nFile under review: ${WORK}/${file}\n`;
const readerPrompt = (task: string, file = "AGENTS.md") =>
    `Check class: reader\nThis task is a dry run.\n\nInstruction file: ${WORK}/${file}\nProject folder: ${WORK}\nTask: ${task}\n`;
const confirmerPrompt = (report: string, file = "AGENTS.md") =>
    `Check class: confirmer\nThis task is read-only.\n\nFile under review: ${WORK}/${file}\nReport: ${report}\nFindings: 1. "rule" "text"\n`;
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
                for (const item of options.calls ?? [read()])
                    assistant(toolUseId, [
                        {
                            type: "tool_use",
                            id: id("toolu"),
                            name: item.name,
                            input: item.input,
                        },
                    ]);
                const report = options.report ?? REPORT;
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
                                ...(options.calls ?? [read()]).map((item) =>
                                    part(item.name.toLowerCase(), item.input),
                                ),
                                ...(fail
                                    ? []
                                    : [
                                          {
                                              type: "text",
                                              text: options.report ?? REPORT,
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

const reviewReports = (round: number) =>
    REVIEWERS.map((_, index) => `${DIR}/round-${round}/report-${index + 1}.md`);
const reportForm = (file = "AGENTS.md", round = 1) =>
    `${CHECK} --reports --file ${WORK}/${file} ${reviewReports(round).join(" ")} > ${DIR}/round-${round}/form.json`;
const readerReports = (round: number) =>
    TASKS.map(
        (_, index) => `${DIR}/reader-round-${round}/reader-${index + 1}.md`,
    );
const closedLists = (round: number) =>
    [1, 2].map((task) => `${DIR}/reader-round-${round}/closed-list-${task}.md`);
const readerForm = (file = "AGENTS.md", round = 1) =>
    `${CHECK} --reports --file ${WORK}/${file} --copy ${DIR}/copy.md --tasks ${DIR}/tasks.json ${readerReports(round).join(" ")} > ${DIR}/reader-round-${round}/form.json`;

// Saves the copy of a review round and its reviewer reports, as review.md
// tells.
function saveReviewRound(
    run: Builder,
    round = 1,
    reports = [REPORT, REPORT, REPORT],
    file = "AGENTS.md",
) {
    run.save(`${DIR}/round-${round}/${file}`, BEFORE);
    reviewReports(round).forEach((path, index) => {
        run.save(path, reports[index]);
    });
}

type RoundOptions = {
    round?: number;
    file?: string;
    reports?: string[];
    closed?: string[];
    calls?: Call[];
    vote?: (run: Builder) => void;
};

// One review round of one file, as review.md tells: the copy, the check
// script, the 3 reviewers in one message, the saved reports and the report
// form, the vote, then the correction.
const reviewRound = (run: Builder, options: RoundOptions = {}) => {
    const { round = 1, file = "AGENTS.md" } = options;
    saveReviewRound(run, round, options.reports, file);
    run.bash(
        `${CHECK} ${WORK}/${file} --project ${WORK} --glossary none > ${DIR}/round-${round}/script.json`,
    )
        .agents(REVIEWERS.map((name) => reviewerPrompt(name, file)))
        .bash(reportForm(file, round));
    options.vote?.(run);
    return run.edit(file);
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

const PROCESS = ["1", "2", "3a", "3c", "4"];

// Grades the process statements of a run and gives the verdict of each id.
function processVerdicts(record: RunRecord, ids = PROCESS) {
    const runDir = runFolder(
        ids.map((id) => statement(id)),
        [
            {
                path: "AGENTS.md",
                before: agents("Use pnpm."),
                after: agents("Use pnpm.\n\nRun `make test`."),
            },
        ],
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
        it(`passes each process statement of a ${platform} run that obeys review.md`, () => {
            const run = start();
            reviewRound(run);
            readerRound(run);
            const verdicts = processVerdicts(run.record());
            expect(passed(verdicts)).toEqual(PROCESS);
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
    }

    it("takes the report of a subagent from its hand-back tool result", () => {
        const run = claude();
        saveReviewRound(run, 1, [BLOCKING_REPORT, REPORT, REPORT]);
        run.agents(
            REVIEWERS.map((name) => reviewerPrompt(name)),
            { handBack: true, report: BLOCKING_REPORT },
        )
            .bash(reportForm())
            .agents(
                [1, 2].map(() => confirmerPrompt(`${DIR}/round-1/report-1.md`)),
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
            REVIEWERS.map((name) => reviewerPrompt(name)),
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

    it("fails [1] for reviewers of one file in different messages", () => {
        const run = claude();
        saveReviewRound(run);
        for (const name of REVIEWERS) run.agents([reviewerPrompt(name)]);
        run.bash(reportForm()).edit();
        readerRound(run);
        expect(processVerdicts(run.record())["1"].passed).toBe(false);
    });

    // A review round whose loading report has a blocking finding, with
    // `count` confirmers for that report and `others` for the next report.
    const blockingVote = (count: number, others = 0) => {
        const run = claude();
        const [loading, ste] = reviewReports(1);
        reviewRound(run, {
            reports: [BLOCKING_REPORT, REPORT, REPORT],
            vote: (round) =>
                round.agents(
                    [
                        ...Array(count).fill(confirmerPrompt(loading)),
                        ...Array(others).fill(confirmerPrompt(ste)),
                    ],
                    { report: "1. yes: The sentence is passive." },
                ),
        });
        readerRound(run);
        return processVerdicts(run.record())["1"];
    };

    it("passes [1] for 2 confirmers of a report with a blocking finding", () => {
        expect(blockingVote(2)).toMatchObject({ passed: true });
    });

    it("fails [1] for 1 confirmer of a report with a blocking finding", () => {
        expect(blockingVote(1)).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Review round 1: the report ${DIR}/round-1/report-1.md has 1 blocking findings and 1 confirmers.`,
            ),
        });
    });

    it("fails [1] for a confirmer of a report with no blocking finding", () => {
        expect(blockingVote(2, 1)).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Review round 1: the report ${DIR}/round-1/report-2.md has 0 blocking findings and 1 confirmers.`,
            ),
        });
    });

    it("fails [1] when a report file of the report form is missing", () => {
        const run = claude();
        saveReviewRound(run);
        run.agents(REVIEWERS.map((name) => reviewerPrompt(name)))
            .bash(reportForm().replace("report-3.md", "report-9.md"))
            .edit();
        readerRound(run);
        expect(processVerdicts(run.record())["1"]).toMatchObject({
            passed: false,
            evidence: expect.stringContaining(
                `Review round 1: the report file ${DIR}/round-1/report-9.md is missing.`,
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

    it("passes [1] when the run starts one new subagent for a failed reviewer", () => {
        const run = claude();
        saveReviewRound(run);
        run.agents(
            REVIEWERS.map((name) => reviewerPrompt(name)),
            { failed: [2] },
        )
            .agents([reviewerPrompt(REVIEWERS[2])])
            .bash(reportForm())
            .edit();
        readerRound(run);
        const verdicts = processVerdicts(run.record());
        expect(verdicts["1"].passed).toBe(true);
        expect(verdicts["4"].evidence).toBe(
            "1 review rounds and 1 reader-test rounds.",
        );
    });

    it("fails [1] when the run starts no new subagent for a failed reviewer", () => {
        const run = claude();
        run.agents(
            REVIEWERS.map((name) => reviewerPrompt(name)),
            { failed: [2] },
        )
            .bash(reportForm())
            .edit();
        readerRound(run);
        expect(processVerdicts(run.record())["1"].evidence).toMatch(
            /no new subagent/,
        );
    });

    it("fails [2] and [3c] when the run corrects the file before the report form", () => {
        const run = claude();
        run.agents(REVIEWERS.map((name) => reviewerPrompt(name)))
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

    it("grades the rounds of a run that did the checks itself", () => {
        const run = claude();
        const save = (title: string) =>
            run.bash(
                `cat > /tmp/r/${title.length}.md <<'EOF'\n${title}\n${REPORT}EOF`,
            );
        for (let round = 1; round <= 4; round++) {
            for (const name of ["loading", "ASD-STE100", "ISO 24495-1"])
                save(`Round ${round}: ${name} review`);
            run.bash(reportForm()).edit();
        }
        const verdicts = processVerdicts(run.record(), ["2", "4"]);
        expect(verdicts["2"].passed).toBe(true);
        expect(verdicts["4"]).toMatchObject({
            passed: false,
            evidence: "4 review rounds and 0 reader-test rounds.",
        });
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
