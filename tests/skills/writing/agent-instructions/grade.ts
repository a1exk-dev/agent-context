// Grade script of the agent-instructions output tests. It grades one saved
// run folder in 2 steps:
//
// 1. `script`: stops on LIMIT_HIT or INCOMPLETE, grades the script
//    statements, and writes script-grading.json with the lists for the LLM
//    grader.
// 2. `merge`: reads llm-grading.json of the grader subagent and
//    confirmers.json of the confirmers, and writes grading.json.
//
// Runs with Bun or Node.js 22.18 or later.

import { spawnSync } from "node:child_process";
import {
    existsSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import {
    type FileChange,
    type Finding,
    type Pointer,
    type Run,
    type Subagent,
    scriptStatements,
    statementLists,
    type Verdict,
} from "./assertions.ts";
import {
    type ClaudeEvent,
    HERE,
    type OpenCodeSession,
    parseJsonLines,
    resultText,
    SKILL,
    type Statement,
    toolCalls,
    writeJson,
} from "./eval-lib.ts";

const USAGE = `Grade one run of the agent-instructions output tests.

Usage:
  bun grade.ts script <run-dir>   grade the script statements, write script-grading.json
  bun grade.ts merge <run-dir>    merge llm-grading.json and confirmers.json into grading.json

<run-dir> is <iteration>/eval-<name>/<configuration>/run-1.
Exit code: 0 when the step wrote its file, 1 when the run has LIMIT_HIT or
INCOMPLETE and needs a new run, 2 when the step could not run.`;

class GradeError extends Error {}

type Metadata = {
    prompt: string;
    setup?: { overlay?: string | null };
    assertions: Statement[];
    known_mistakes?: unknown;
};

type ScriptGrading =
    | { status: "LIMIT_HIT" | "INCOMPLETE" }
    | {
          status: "graded";
          script: ({ id: string; text: string } & Verdict)[];
          llm: { id: string; text: string; grader: string; list: unknown }[];
      };

type ChecklistItem = { item: string; answer: "yes" | "no"; quote: string };
type LlmGrading = { statements: { id: string; checklist: ChecklistItem[] }[] };
type Confirmers = Record<string, { agrees: boolean; reason?: string }[]>;

function main(argv: string[]): number {
    const [step, runDir, ...rest] = argv;
    if (step === "--help" || step === "-h") {
        console.log(USAGE);
        return 0;
    }
    try {
        if (!runDir || rest.length > 0 || !["script", "merge"].includes(step))
            throw new GradeError("Give the step and one run folder.");
        if (step === "script") return scriptStep(resolve(runDir));
        mergeStep(resolve(runDir));
        return 0;
    } catch (error) {
        if (!(error instanceof GradeError)) throw error;
        console.error(`${USAGE}\nerror: ${error.message}`);
        return 2;
    }
}

function readJson<T>(path: string): T {
    try {
        return JSON.parse(readFileSync(path, "utf8")) as T;
    } catch (error) {
        throw new GradeError(`Cannot read ${path}: ${error}`);
    }
}

function scriptStep(runDir: string): number {
    for (const status of ["LIMIT_HIT", "INCOMPLETE"] as const) {
        if (!existsSync(join(runDir, status))) continue;
        writeJson(join(runDir, "script-grading.json"), { status });
        console.error(
            `${runDir} has ${status}. Do not grade it. Run it again.`,
        );
        return 1;
    }
    const metadata = readJson<Metadata>(
        join(runDir, "../../eval_metadata.json"),
    );
    const run = readRun(runDir, metadata);
    const grading: ScriptGrading = { status: "graded", script: [], llm: [] };
    for (const { id, text, grader } of metadata.assertions) {
        if (grader === "script") {
            const check = scriptStatements[id];
            if (!check) throw new GradeError(`No script check for [${id}].`);
            grading.script.push({ id, text, ...check(run) });
        } else {
            const list = statementLists[id]?.(run) ?? null;
            grading.llm.push({ id, text, grader, list });
        }
    }
    writeJson(join(runDir, "script-grading.json"), grading);
    return 0;
}

function mergeStep(runDir: string) {
    const grading = readJson<ScriptGrading>(
        join(runDir, "script-grading.json"),
    );
    if (grading.status !== "graded")
        throw new GradeError(`The run has ${grading.status}. Run it again.`);
    const llm =
        grading.llm.length === 0
            ? { statements: [] }
            : readJson<LlmGrading>(join(runDir, "llm-grading.json"));
    const confirmersPath = join(runDir, "confirmers.json");
    const confirmers: Confirmers = existsSync(confirmersPath)
        ? readJson<Confirmers>(confirmersPath)
        : {};
    const expectations = [
        ...grading.script.map((item) => ({ ...item, grader: "script" })),
        ...grading.llm.map(({ id, text, grader }) => ({
            id,
            text,
            grader,
            ...llmVerdict(id, grader, llm, confirmers),
        })),
    ];
    const order = (id: string) =>
        [...grading.script, ...grading.llm].findIndex((item) => item.id === id);
    expectations.sort((a, b) => order(a.id) - order(b.id));
    const counted = expectations.filter((item) => item.grader !== "advisory");
    const passed = counted.filter((item) => item.passed).map((item) => item.id);
    const failed = counted
        .filter((item) => !item.passed)
        .map((item) => item.id);
    writeJson(join(runDir, "grading.json"), {
        expectations,
        passed,
        failed,
        advisory: expectations
            .filter((item) => item.grader === "advisory")
            .map((item) => item.id),
        summary: {
            passed: passed.length,
            failed: failed.length,
            total: counted.length,
            pass_rate: counted.length ? passed.length / counted.length : 0,
        },
    });
}

// The grader passes a statement when it answers yes for each checklist item.
// A failed `llm` statement fails only when at least 1 of its 2 confirmers
// agrees. An advisory statement keeps the verdict of the grader.
function llmVerdict(
    id: string,
    grader: string,
    llm: LlmGrading,
    confirmers: Confirmers,
): Verdict {
    const answer = llm.statements.find((item) => item.id === id);
    if (!answer || answer.checklist.length === 0)
        throw new GradeError(`llm-grading.json has no checklist for [${id}].`);
    const no = answer.checklist.filter((item) => item.answer !== "yes");
    if (no.length === 0) {
        const total = answer.checklist.length;
        return { passed: true, evidence: `yes: ${total} of ${total} items` };
    }
    const evidence = no
        .map((item) => `no: ${item.item} "${item.quote}"`)
        .join("\n");
    if (grader === "advisory") return { passed: false, evidence };
    const votes = confirmers[id] ?? [];
    if (votes.length < 2)
        throw new GradeError(
            `confirmers.json has ${votes.length} answers for the failed statement [${id}]. Start 2 confirmers.`,
        );
    const agree = votes.filter((vote) => vote.agrees).length;
    return {
        passed: agree === 0,
        evidence: `${evidence}\n${agree} of ${votes.length} confirmers agree.`,
    };
}

// Builds the Run of a saved run folder: the changes, the check-script
// findings and pointers on added lines, and the main agent's messages.
function readRun(runDir: string, metadata: Metadata): Run {
    const outputs = join(runDir, "outputs");
    const diff = readFileSync(join(outputs, "changes.diff"), "utf8");
    const changes = parseDiff(diff, (path) =>
        readFileSync(join(outputs, "files", path), "utf8"),
    );
    const glossary = glossaryPath(outputs, metadata);
    const checked = runCheckScript(outputs, changes, glossary);
    const timing = readTiming(runDir);
    const tmp = savedFiles(join(outputs, "tmp"), timing.tmp_dir);
    const onAdded = <T extends { path: string; line: number }>(item: T) =>
        changes
            .find((change) => change.path === item.path)
            ?.added.has(item.line) ?? false;
    return {
        prompt: metadata.prompt,
        knownMistakes: metadata.known_mistakes ?? null,
        changes,
        findings: checked.findings.filter(onAdded),
        pointers: checked.pointers.filter(onAdded),
        glossary: glossary ? readFileSync(glossary, "utf8") : null,
        workDir: timing.work_dir ?? "",
        ...runRecord(runDir),
        dropped: (path, reports) =>
            droppedFindings(join(outputs, "files"), path, reports),
        saved: [...tmp.keys()],
        readSaved: (path) => {
            const local = tmp.get(path);
            return local === undefined ? null : readFileSync(local, "utf8");
        },
        blockingCounts: (copy, reports) => blockingCounts(tmp, copy, reports),
    };
}

// The files that the run left in its TMPDIR, which the eval runner copies to
// outputs/tmp/: the absolute path that the run used, and the saved copy.
function savedFiles(
    folder: string,
    tmpDir: string | undefined,
): Map<string, string> {
    const files = new Map<string, string>();
    if (!tmpDir || !existsSync(folder)) return files;
    for (const path of readdirSync(folder, { recursive: true }) as string[]) {
        const local = join(folder, path);
        if (statSync(local).isFile()) files.set(`${tmpDir}/${path}`, local);
    }
    return files;
}

// The glossary of the run: CONTEXT.md as the run left it.
function glossaryPath(outputs: string, metadata: Metadata): string | null {
    const places = [
        join(outputs, "files"),
        ...(metadata.setup?.overlay
            ? [join(HERE, metadata.setup.overlay)]
            : []),
        join(HERE, "project"),
    ];
    for (const place of places) {
        const path = join(place, "CONTEXT.md");
        if (existsSync(path)) return path;
    }
    return null;
}

// Runs the check script of the Skill on each changed Markdown file in
// outputs/files/. The eval has no copy of the rules.
function runCheckScript(
    outputs: string,
    changes: FileChange[],
    glossary: string | null,
): { findings: Finding[]; pointers: Pointer[] } {
    const files = join(outputs, "files");
    const paths = changes
        .filter(
            (change) => change.after !== null && change.path.endsWith(".md"),
        )
        .map((change) => join(files, change.path));
    if (paths.length === 0) return { findings: [], pointers: [] };
    const result = spawnSync(
        process.execPath,
        [
            join(SKILL, "scripts/check.ts"),
            ...paths,
            "--project",
            files,
            "--glossary",
            glossary ?? "none",
        ],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (result.status !== 0 && result.status !== 1)
        throw new GradeError(`The check script failed: ${result.stderr}`);
    const output = JSON.parse(result.stdout) as {
        findings: Finding[];
        pointers: Pointer[];
    };
    const local = <T extends { path: string }>(item: T) => ({
        ...item,
        path: relative(files, item.path),
    });
    return {
        findings: output.findings.map(local),
        pointers: output.pointers.map(local),
    };
}

// Parses a unified diff. `read` gives the new text of a file that is not
// deleted. The old text comes from the new text and the hunks.
function parseDiff(diff: string, read: (path: string) => string): FileChange[] {
    const changes: FileChange[] = [];
    const all = diff.split("\n");
    let change: FileChange | undefined;
    let oldLine = 0;
    let newLine = 0;
    for (let index = 0; index < all.length; index++) {
        const line = all[index];
        if (line.startsWith("--- ") && all[index + 1]?.startsWith("+++ ")) {
            const from = diffPath(line);
            const to = diffPath(all[index + 1]);
            index++;
            change = {
                path: (to ?? from) as string,
                status:
                    from === null
                        ? "added"
                        : to === null
                          ? "deleted"
                          : "modified",
                added: new Map(),
                removed: [],
                before: null,
                after: null,
            };
            changes.push(change);
            continue;
        }
        const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
        if (hunk) {
            oldLine = Number(hunk[1]);
            newLine = Number(hunk[2]);
            continue;
        }
        if (!change) continue;
        if (line.startsWith("+")) {
            change.added.set(newLine++, line.slice(1));
        } else if (line.startsWith("-")) {
            change.removed.push({ line: oldLine++, text: line.slice(1) });
        } else if (line.startsWith(" ")) {
            oldLine++;
            newLine++;
        }
    }
    for (const item of changes) {
        if (item.status !== "deleted") item.after = read(item.path);
        item.before = item.status === "added" ? null : oldText(item);
    }
    return changes;
}

// Git writes a/ and b/, or c/, i/, w/, and o/ with diff.mnemonicPrefix.
function diffPath(line: string): string | null {
    const path = line.slice(4).split("\t")[0];
    if (path === "/dev/null") return null;
    return path.replace(/^(?:a|b|c|i|o|w)\//, "");
}

// The old text of a file: the new lines without the added ones, with each
// removed line at its old line number.
function oldText(change: FileChange): string {
    const kept = (change.after ?? "")
        .split("\n")
        .filter((_, index) => !change.added.has(index + 1));
    for (const { line, text } of change.removed) kept.splice(line - 1, 0, text);
    return kept.join("\n");
}

function readTiming(runDir: string): {
    work_dir?: string;
    tmp_dir?: string;
    session_id?: string;
} {
    const timing = join(runDir, "timing.json");
    return existsSync(timing) ? readJson(timing) : {};
}

// The run record: the assistant messages of the main agent, each with its
// tool calls, and the subagents that the main agent started. `at` orders the
// calls, the starts, and the reports. Claude Code: the event number in
// transcript.jsonl. OpenCode: the time of the tool call in sessions/.
function runRecord(runDir: string): Pick<Run, "messages" | "subagents"> {
    const sessionId = readTiming(runDir).session_id;
    return sessionId ? openCodeRecord(runDir, sessionId) : claudeRecord(runDir);
}

const isSubagentStart = (name: string) =>
    ["agent", "task"].includes(name.toLowerCase());

function claudeRecord(runDir: string): Pick<Run, "messages" | "subagents"> {
    const events = parseJsonLines<ClaudeEvent>(
        readFileSync(join(runDir, "transcript.jsonl"), "utf8"),
    );
    const messages = new Map<string, Run["messages"][number]>();
    const agents = new Map<string, Subagent & { error: boolean }>();
    events.forEach((event, at) => {
        const content = event.message?.content;
        const blocks = Array.isArray(content) ? content : [];
        const parent = event.parent_tool_use_id;
        if (event.type === "assistant" && parent) {
            const agent = agents.get(parent);
            if (!agent) return;
            agent.calls.push(...toolCalls(event));
            for (const block of blocks)
                if (block.type === "text" && block.text?.trim())
                    agent.report = block.text;
        } else if (event.type === "assistant") {
            const id = event.message?.id ?? `event-${at}`;
            const message = messages.get(id) ?? { id, calls: [] };
            messages.set(id, message);
            for (const block of blocks) {
                if (block.type !== "tool_use") continue;
                const call = {
                    name: block.name ?? "",
                    input: block.input ?? {},
                    at,
                };
                message.calls.push(call);
                if (!isSubagentStart(call.name)) continue;
                agents.set(block.id ?? `event-${at}`, {
                    ...subagentInput(call.input),
                    message: id,
                    start: at,
                    end: Number.POSITIVE_INFINITY,
                    failed: true,
                    error: false,
                    report: "",
                    calls: [],
                });
            }
        } else if (event.type === "user" && !parent) {
            for (const block of blocks) {
                const agent = agents.get(block.tool_use_id ?? "");
                if (block.type !== "tool_result" || !agent) continue;
                // A background start returns at once. Its report comes
                // later, with a task_notification event.
                if (
                    resultText(block.content).startsWith("Async agent launched")
                )
                    continue;
                agent.end = at;
                agent.error = block.is_error === true;
            }
        } else if (event.subtype === "task_notification") {
            const agent = agents.get(event.tool_use_id ?? "");
            if (!agent) return;
            agent.end = at;
            agent.error = event.status !== "completed";
        }
    });
    const subagents = [...agents.values()].map(({ error, ...agent }) => ({
        ...agent,
        failed:
            error ||
            agent.end === Number.POSITIVE_INFINITY ||
            !agent.report.trim(),
    }));
    return { messages: [...messages.values()], subagents };
}

function openCodeRecord(
    runDir: string,
    sessionId: string,
): Pick<Run, "messages" | "subagents"> {
    const session = (id: string) =>
        readJson<OpenCodeSession>(join(runDir, "sessions", `${id}.json`));
    const subagents: Subagent[] = [];
    const messages = session(sessionId)
        .messages.filter((message) => message.info.role === "assistant")
        .map((message, index) => {
            const id = message.info.id ?? `message-${index}`;
            const created = message.info.time?.created ?? index;
            const parts = message.parts.filter((part) => part.type === "tool");
            for (const part of parts) {
                if (!isSubagentStart(part.tool ?? "")) continue;
                const state = part.state ?? {};
                const childId = state.metadata?.sessionId;
                const child = childId
                    ? session(childId).messages.filter(
                          (item) => item.info.role === "assistant",
                      )
                    : [];
                const childParts = child.flatMap((item) => item.parts);
                const report =
                    childParts
                        .filter(
                            (item) => item.type === "text" && item.text?.trim(),
                        )
                        .at(-1)?.text ?? "";
                subagents.push({
                    ...subagentInput(state.input ?? {}),
                    message: id,
                    start: state.time?.start ?? created,
                    end: state.time?.end ?? Number.POSITIVE_INFINITY,
                    failed: state.status !== "completed" || !report.trim(),
                    report,
                    calls: childParts
                        .filter((item) => item.type === "tool")
                        .map((item) => ({
                            name: item.tool ?? "",
                            input: item.state?.input ?? {},
                        })),
                });
            }
            return {
                id,
                calls: parts.map((part) => ({
                    name: part.tool ?? "",
                    input: part.state?.input ?? {},
                    at: part.state?.time?.start ?? created,
                })),
            };
        });
    return { messages, subagents };
}

function subagentInput(input: Record<string, unknown>) {
    return {
        prompt: String(input.prompt ?? ""),
        type: String(input.subagent_type ?? ""),
    };
}

// The number of findings that the report form of the check script drops
// from the reports of one file, or null when the run deleted the file.
function droppedFindings(
    files: string,
    path: string,
    reports: string[],
): number | null {
    const file = join(files, path);
    if (reports.length === 0 || !existsSync(file)) return null;
    const folder = mkdtempSync(join(tmpdir(), "grade-reports-"));
    try {
        const paths = reports.map((report, index) => {
            const reportPath = join(folder, `report-${index + 1}.md`);
            writeFileSync(reportPath, report);
            return reportPath;
        });
        return reportForm(file, paths).dropped.length;
    } finally {
        rmSync(folder, { recursive: true });
    }
}

// The number of blocking findings of each saved reviewer report, from the
// report form against the saved copy of its round. Each path is one that
// the run used, and each file is in `saved`.
function blockingCounts(
    saved: Map<string, string>,
    copy: string,
    reports: string[],
): Map<string, number> {
    const local = (path: string) => {
        const file = saved.get(path);
        if (file === undefined)
            throw new GradeError(`The run saved no file ${path}.`);
        return file;
    };
    const { blocking } = reportForm(local(copy), reports.map(local));
    return new Map(
        reports.map((report) => [
            report,
            blocking.filter((finding) => finding.report === local(report))
                .length,
        ]),
    );
}

// Runs the report form of the check script on reviewer reports.
function reportForm(
    file: string,
    reports: string[],
): { blocking: { report: string }[]; dropped: unknown[] } {
    const result = spawnSync(
        process.execPath,
        [
            join(SKILL, "scripts/check.ts"),
            "--reports",
            "--file",
            file,
            ...reports,
        ],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (result.status !== 0 && result.status !== 1)
        throw new GradeError(
            `The report form of the check script failed: ${result.stderr}`,
        );
    return JSON.parse(result.stdout);
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
