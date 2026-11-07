// Runs the common-changelog output tests with `claude -p`.
//
// Each run starts from a fresh copy of project/ in a temporary folder outside
// this repository, with the fixed history of eval-lib.ts, so no CLAUDE.md or
// AGENTS.md of this repository loads and no test needs the network.
// `--setting-sources project,local` keeps user skills and user memory out.
// Give grader.md and one eval folder to a fresh grader subagent for each run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    claudeEnv,
    writeJson,
} from "../../writing/agent-instructions/eval-lib.ts";
import {
    finishRun,
    mainCalls,
    type OutputOptions,
    outputRun,
    outputTestMain,
} from "../eval-lib.ts";
import {
    auditRun,
    type Eval,
    FORCE_SKILL,
    prepare,
    readEvals,
    repoState,
} from "./eval-lib.ts";

const USAGE = `Run the common-changelog output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

async function run(ev: Eval, config: string, options: OutputOptions) {
    const evalDir = join(options.out, `eval-${ev.name}`);
    const runDir = join(evalDir, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    const withSkill = config === "with_skill";
    const { work } = await prepare(
        ev,
        withSkill,
        `cc-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    const runDate = new Date().toISOString().slice(0, 10);
    writeFileSync(join(outputs, "state-before.md"), await repoState(work));
    const done = await outputRun(
        ev.prompt,
        withSkill ? FORCE_SKILL : null,
        work,
        claudeEnv(),
        options,
        runDir,
    );
    writeFileSync(join(outputs, "state-after.md"), await repoState(work));
    writeJson(join(outputs, "audit.json"), auditRun(mainCalls(done.events)));
    writeJson(join(evalDir, "eval_metadata.json"), {
        eval_id: ev.id,
        eval_name: ev.name,
        prompt: ev.prompt,
        setup: ev.setup,
        run_date: runDate,
        assertions: ev.assertions,
    });
    return finishRun(`${ev.name}/${config}`, runDir, work, done);
}

if (import.meta.main) {
    await outputTestMain(USAGE, readEvals, run);
}
