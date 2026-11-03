// Runs the git-commit output tests with `claude -p`.
//
// Each run starts from a fresh copy of project/ in a temporary folder outside
// this repository, with a local bare `origin`, so no CLAUDE.md or AGENTS.md of
// this repository loads and no test needs the network.
// `--setting-sources project,local` keeps user skills and user memory out.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
    auditGit,
    type Eval,
    FORCE_SKILL,
    gitState,
    prepare,
    readEvals,
} from "./eval-lib.ts";

const USAGE = `Run the git-commit output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

async function run(ev: Eval, config: string, options: OutputOptions) {
    const evalDir = join(options.out, `eval-${ev.name}`);
    const runDir = join(evalDir, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    const withSkill = config === "with_skill";
    const { work, startCommit, bin, stubLog } = await prepare(
        ev,
        withSkill,
        `gc-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    writeFileSync(
        join(outputs, "git-before.md"),
        await gitState(work, startCommit),
    );
    const done = await outputRun(
        ev.prompt,
        withSkill ? FORCE_SKILL : null,
        work,
        { ...claudeEnv(), PATH: `${bin}:${process.env.PATH}` },
        options,
        runDir,
    );
    writeFileSync(
        join(outputs, "git-after.md"),
        await gitState(work, startCommit),
    );
    if (ev.setup.stubs?.length) {
        writeFileSync(
            join(outputs, "stub-calls.txt"),
            existsSync(stubLog)
                ? readFileSync(stubLog, "utf8")
                : "(no calls)\n",
        );
    }
    writeJson(join(outputs, "audit.json"), auditGit(mainCalls(done.events)));
    writeJson(join(evalDir, "eval_metadata.json"), {
        eval_id: ev.id,
        eval_name: ev.name,
        prompt: ev.prompt,
        setup: ev.setup,
        assertions: ev.assertions,
    });
    return finishRun(`${ev.name}/${config}`, runDir, work, done);
}

if (import.meta.main) {
    await outputTestMain(USAGE, readEvals, run);
}
