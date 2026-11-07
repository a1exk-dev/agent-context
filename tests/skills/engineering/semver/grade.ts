// Grade script of the semver output tests. It grades one saved run folder
// in 2 steps:
//
// 1. `script`: stops on LIMIT_HIT, grades the script statements with the
//    checks of assertions.ts, and writes script-grading.json with the list
//    of the llm statements for the grader subagent.
// 2. `merge`: reads llm-grading.json of the grader subagent and
//    confirmers.json of the confirmers, and writes grading.json.

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
    type ClaudeEvent,
    parseJsonLines,
    toolCalls,
    writeJson,
} from "../../writing/agent-instructions/eval-lib.ts";
import { checks, type Run, type Verdict } from "./assertions.ts";
import type { Statement } from "./eval-lib.ts";

const USAGE = `Grade one run of the semver output tests.

Usage:
  bun grade.ts script <run-dir>   grade the script statements, write script-grading.json
  bun grade.ts merge <run-dir>    merge llm-grading.json and confirmers.json into grading.json

<run-dir> is <iteration>/eval-<name>/<configuration>/run-1.
Exit code: 0 when the step wrote its file, 1 when the run has LIMIT_HIT and
needs a new run, 2 when the step could not run.`;

class GradeError extends Error {}

type ScriptGrading =
    | { status: "LIMIT_HIT" }
    | {
          status: "graded";
          script: ({ id: string; text: string } & Verdict)[];
          llm: { id: string; text: string; grader: string; list: null }[];
      };

type ChecklistItem = { item: string; answer: "yes" | "no"; quote: string };
type LlmGrading = { statements: { id: string; checklist: ChecklistItem[] }[] };
type Confirmers = Record<string, { agrees: boolean; reason?: string }[]>;

function readJson<T>(path: string): T {
    try {
        return JSON.parse(readFileSync(path, "utf8")) as T;
    } catch (error) {
        throw new GradeError(`Cannot read ${path}: ${error}`);
    }
}

// The saved files of a run folder. The calls are those of the main agent.
function readRun(runDir: string): Run {
    const outputs = join(runDir, "outputs");
    const events = parseJsonLines<ClaudeEvent>(
        readFileSync(join(runDir, "transcript.jsonl"), "utf8"),
    );
    return {
        before: readJson(join(outputs, "git-before.json")),
        after: readJson(join(outputs, "git-after.json")),
        calls: events
            .filter((event) => !event.parent_tool_use_id)
            .flatMap(toolCalls),
        prsBefore: readJson(join(outputs, "prs-before.json")),
        prsAfter: readJson(join(outputs, "prs.json")),
        ghCalls: parseJsonLines<string[]>(
            readFileSync(join(outputs, "gh-calls.txt"), "utf8"),
        ),
        report: readFileSync(join(outputs, "report.md"), "utf8"),
    };
}

function scriptStep(runDir: string): number {
    if (existsSync(join(runDir, "LIMIT_HIT"))) {
        writeJson(join(runDir, "script-grading.json"), { status: "LIMIT_HIT" });
        console.error(
            `${runDir} has LIMIT_HIT. Do not grade it. Run it again.`,
        );
        return 1;
    }
    const { assertions } = readJson<{ assertions: Statement[] }>(
        join(runDir, "../../eval_metadata.json"),
    );
    const run = readRun(runDir);
    const grading: ScriptGrading = { status: "graded", script: [], llm: [] };
    for (const { id, text, grader, check, args } of assertions) {
        if (grader === "llm") {
            grading.llm.push({ id, text, grader, list: null });
            continue;
        }
        const fn = checks[check ?? ""];
        if (!fn)
            throw new GradeError(`No script check "${check}" for [${id}].`);
        grading.script.push({ id, text, ...fn(run, args ?? {}) });
    }
    writeJson(join(runDir, "script-grading.json"), grading);
    return 0;
}

// The grader passes a statement when it answers yes for each checklist
// item. A failed statement fails only when at least 1 of its 2 confirmers
// agrees.
function llmVerdict(
    id: string,
    llm: LlmGrading,
    confirmers: Confirmers,
): Verdict {
    const answer = llm.statements.find((item) => item.id === id);
    if (!answer || answer.checklist.length === 0)
        throw new GradeError(`llm-grading.json has no checklist for [${id}].`);
    const no = answer.checklist.filter((item) => item.answer !== "yes");
    const total = answer.checklist.length;
    if (no.length === 0)
        return { passed: true, evidence: `yes: ${total} of ${total} items` };
    const votes = confirmers[id] ?? [];
    if (votes.length < 2)
        throw new GradeError(
            `confirmers.json has ${votes.length} answers for the failed statement [${id}]. Start 2 confirmers.`,
        );
    const agree = votes.filter((vote) => vote.agrees).length;
    const evidence = no
        .map((item) => `no: ${item.item} "${item.quote}"`)
        .join("\n");
    return {
        passed: agree === 0,
        evidence: `${evidence}\n${agree} of ${votes.length} confirmers agree.`,
    };
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
            ...llmVerdict(id, llm, confirmers),
        })),
    ];
    const passed = expectations.filter((item) => item.passed);
    const failed = expectations.filter((item) => !item.passed);
    writeJson(join(runDir, "grading.json"), {
        expectations,
        passed: passed.map((item) => item.id),
        failed: failed.map((item) => item.id),
        summary: {
            passed: passed.length,
            failed: failed.length,
            total: expectations.length,
            pass_rate: expectations.length
                ? passed.length / expectations.length
                : 0,
        },
    });
}

function main(argv: string[]): number {
    const [step = "", runDir, ...rest] = argv;
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

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
