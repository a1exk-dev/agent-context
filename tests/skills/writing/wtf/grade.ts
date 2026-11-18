// Grade script of the wtf output tests. It grades one saved run folder in 2
// steps:
//
// 1. `script`: stops on LIMIT_HIT, stops when a copy turn changed its
//    message, grades the script statements with the checks of
//    assertions.ts, and writes script-grading.json with the list of the llm
//    statements for the grader subagent.
// 2. `merge`: reads llm-grading.json of the grader subagent and
//    confirmers.json of the Confirmers, and writes grading.json. This step
//    is the merge step of the human-communication output tests.

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
    type ClaudeEvent,
    parseJsonLines,
    writeJson,
} from "../agent-instructions/eval-lib.ts";
import type { Statement } from "../human-communication/eval-lib.ts";
import { GradeError, mergeStep } from "../human-communication/grade.ts";
import {
    checks,
    copyProblems,
    type Run,
    rewriteText,
    words,
} from "./assertions.ts";

export { GradeError, mergeStep };

const USAGE = `Grade one run of the wtf output tests.

Usage:
  bun grade.ts script <run-dir>   grade the script statements, write script-grading.json
  bun grade.ts merge <run-dir>    merge llm-grading.json and confirmers.json into grading.json

<run-dir> is <iteration>/eval-<name>/<configuration>/run-1.
Exit code: 0 when the step wrote its file, 1 when the run does not count
and needs a new run, 2 when the step could not run.`;

function readJson<T>(path: string): T {
    try {
        return JSON.parse(readFileSync(path, "utf8")) as T;
    } catch (error) {
        throw new GradeError(`Cannot read ${path}: ${error}`);
    }
}

const readText = (path: string) =>
    existsSync(path) ? readFileSync(path, "utf8") : "";

// The folders of the copy turns of a run, one for each message.
const copyDirs = (runDir: string, messages: string[]) =>
    messages.map((_, i) => join(runDir, `copy-${i + 1}`));

export function scriptStep(runDir: string): number {
    const { messages, assertions } = readJson<{
        messages: string[];
        assertions: Statement[];
    }>(join(runDir, "../../eval_metadata.json"));
    const turns = copyDirs(runDir, messages);
    if ([...turns, runDir].some((dir) => existsSync(join(dir, "LIMIT_HIT")))) {
        writeJson(join(runDir, "script-grading.json"), { status: "LIMIT_HIT" });
        console.error(
            `${runDir} has LIMIT_HIT. Do not grade it. Run it again.`,
        );
        return 1;
    }
    const replies = turns.map((dir) =>
        readText(join(dir, "outputs/report.md")),
    );
    const problems = copyProblems(messages, replies);
    if (problems.length > 0) {
        writeJson(join(runDir, "script-grading.json"), {
            status: "COPY_CHANGED",
            problems,
        });
        console.error(
            `${runDir} does not count, because a copy turn changed its message. Run it again.`,
        );
        return 1;
    }
    const outputs = join(runDir, "outputs");
    const run: Run = {
        messages,
        rewrite: rewriteText(
            parseJsonLines<ClaudeEvent>(
                readText(join(runDir, "transcript.jsonl")),
            ),
        ),
        before: readJson(join(outputs, "git-before.json")),
        after: readJson(join(outputs, "git-after.json")),
    };
    const script = [];
    const llm = [];
    for (const { id, text, grader, check, args } of assertions) {
        if (grader === "llm") {
            llm.push({ id, text, grader, list: null });
            continue;
        }
        const fn = checks[check ?? ""];
        if (!fn)
            throw new GradeError(`No script check "${check}" for [${id}].`);
        script.push({ id, text, ...fn(run, args ?? {}) });
    }
    writeJson(join(runDir, "script-grading.json"), {
        status: "graded",
        script,
        llm,
        words: {
            messages: messages.map((message) => words(message).length),
            rewrite: words(run.rewrite).length,
        },
    });
    return 0;
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
