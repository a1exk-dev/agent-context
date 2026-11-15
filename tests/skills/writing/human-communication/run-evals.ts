// Runs the human-communication output tests with `claude -p`.
//
// Each run works in a temporary copy of project/ outside this repository, so
// no CLAUDE.md or AGENTS.md of this repository loads, and no run leaves a
// file in this repository. `--setting-sources project,local` keeps user
// skills and user memory out, so human-communication is the only installed
// Skill. A test with `answers` also gets the question host of
// question-host.ts in the temporary folder. After the run, the runner copies
// the changed files and the saved questions to the run folder and deletes
// the copy.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    finishRun,
    type OutputOptions,
    outputRun,
    outputTestMain,
} from "../../engineering/eval-lib.ts";
import { claudeEnv, writeJson } from "../agent-instructions/eval-lib.ts";
import {
    type Eval,
    FORCE_SKILL,
    installHost,
    keepOutputs,
    prepare,
    readEvals,
} from "./eval-lib.ts";
import {
    changedFiles,
    collectGitState,
    type GitState,
    renderGitState,
} from "./git-state.ts";

const USAGE = `Run the human-communication output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

function saveGitState(work: string, outputs: string, name: string): GitState {
    const state = collectGitState(work);
    writeJson(join(outputs, `${name}.json`), state);
    writeFileSync(join(outputs, `${name}.md`), renderGitState(state));
    return state;
}

async function run(ev: Eval, config: string, options: OutputOptions) {
    const evalDir = join(options.out, `eval-${ev.name}`);
    const runDir = join(evalDir, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    writeJson(join(evalDir, "eval_metadata.json"), {
        eval_id: ev.id,
        eval_name: ev.name,
        prompt: ev.prompt,
        setup: ev.setup,
        expect: ev.expect ?? {},
        answers: ev.answers ?? null,
        assertions: ev.assertions,
    });
    const withSkill = config === "with_skill";
    const { root, work } = prepare(
        ev,
        withSkill,
        `hc-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    let changed: string[] = [];
    try {
        const hostArgs = ev.answers ? installHost(root, ev.answers) : [];
        const before = saveGitState(work, outputs, "git-before");
        const done = await outputRun(
            ev.prompt,
            withSkill ? FORCE_SKILL : null,
            work,
            claudeEnv(),
            options,
            runDir,
            hostArgs,
        );
        const after = saveGitState(work, outputs, "git-after");
        changed = changedFiles(before, after);
        return finishRun(`${ev.name}/${config}`, runDir, work, done);
    } finally {
        keepOutputs(root, work, changed, outputs);
    }
}

if (import.meta.main) await outputTestMain(USAGE, readEvals, run);
