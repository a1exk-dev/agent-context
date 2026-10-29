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
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
    type FileChange,
    type Finding,
    type Pointer,
    type Run,
    scriptStatements,
    statementLists,
    type Verdict,
} from "./assertions.ts";
import {
    type ClaudeEvent,
    HERE,
    type OpenCodeSession,
    parseJsonLines,
    SKILL,
    type Statement,
    type ToolCall,
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
        messages: mainMessages(runDir),
    };
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

function diffPath(line: string): string | null {
    const path = line.slice(4).split("\t")[0];
    if (path === "/dev/null") return null;
    return path.replace(/^[ab]\//, "");
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

// The assistant messages of the main agent, each with its tool calls.
// Claude Code: transcript.jsonl, one message for each message id. OpenCode:
// the parent session in sessions/.
function mainMessages(runDir: string): { calls: ToolCall[] }[] {
    const timing = join(runDir, "timing.json");
    const sessionId = existsSync(timing)
        ? (readJson<{ session_id?: string }>(timing).session_id ?? null)
        : null;
    if (sessionId) {
        const session = readJson<OpenCodeSession>(
            join(runDir, "sessions", `${sessionId}.json`),
        );
        return session.messages
            .filter((message) => message.info.role === "assistant")
            .map((message) => ({
                calls: message.parts
                    .filter((part) => part.type === "tool")
                    .map((part) => ({
                        name: part.tool ?? "",
                        input: part.state?.input ?? {},
                    })),
            }));
    }
    const events = parseJsonLines<ClaudeEvent>(
        readFileSync(join(runDir, "transcript.jsonl"), "utf8"),
    );
    const messages = new Map<string, { calls: ToolCall[] }>();
    events.forEach((event, index) => {
        if (event.type !== "assistant" || event.parent_tool_use_id) return;
        const key = event.message?.id ?? `event-${index}`;
        const message = messages.get(key) ?? { calls: [] };
        message.calls.push(...toolCalls(event));
        messages.set(key, message);
    });
    return [...messages.values()];
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
