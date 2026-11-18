// Runs the wtf output tests with `claude -p`.
//
// Each run is one session in a temporary copy of project/ outside this
// repository. Each copy turn asks the agent to reply with one message of the
// test, and the last turn resumes the session with the call of the test.
// The baseline has no Skill, and its last turn is BASELINE. `--setting-sources
// project,local` keeps user skills and user memory out, so wtf is the only
// installed Skill. After the run, the runner copies the changed files to the
// run folder and deletes the copy.

import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    finishRun,
    type OutputOptions,
    outputRun,
    outputTestMain,
} from "../../engineering/eval-lib.ts";
import { claudeEnv, writeJson } from "../agent-instructions/eval-lib.ts";
import { keepOutputs } from "../human-communication/eval-lib.ts";
import {
    changedFiles,
    collectGitState,
    type GitState,
    renderGitState,
} from "../human-communication/git-state.ts";
import { type Eval, HERE, readEvals, readMessages } from "./eval-lib.ts";

const USAGE = `Run the wtf output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

const SKILL = join(HERE, "../../../../skills/writing/wtf");
const SKILL_DIR = ".claude/skills/wtf";
export const BASELINE =
    "I don't understand your last message. Write it again more clearly.";
const copyPrompt = (message: string) =>
    `Reply with exactly this text:\n\n${message}`;

// A fixed identity and date make the start commit the same in each run.
const START_ENV = {
    GIT_AUTHOR_NAME: "eval",
    GIT_AUTHOR_EMAIL: "eval@example.com",
    GIT_COMMITTER_NAME: "eval",
    GIT_COMMITTER_EMAIL: "eval@example.com",
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
};

function git(cwd: string, args: string[]): void {
    const result = spawnSync("git", args, {
        cwd,
        env: { ...process.env, ...START_ENV },
        encoding: "utf8",
    });
    if (result.status !== 0)
        throw new Error(`git ${args.join(" ")} failed:\n${result.stderr}`);
}

// Copies project/ to a new folder outside this repository and makes the
// start commit. A run with the Skill gets wtf in .claude/skills/. Delete
// `root` after the run.
function prepare(withSkill: boolean, prefix: string) {
    if (withSkill && !existsSync(join(SKILL, "SKILL.md")))
        throw new Error(`The Skill is not in ${SKILL}.`);
    const root = mkdtempSync(join(tmpdir(), prefix));
    const work = join(root, "project");
    try {
        cpSync(join(HERE, "project"), work, { recursive: true });
        if (withSkill)
            cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
        git(work, ["init", "-q", "-b", "main"]);
        git(work, ["config", "commit.gpgsign", "false"]);
        git(work, ["add", "-A"]);
        git(work, ["commit", "-q", "-m", "start"]);
    } catch (error) {
        rmSync(root, { recursive: true, force: true });
        throw error;
    }
    return { root, work };
}

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
    const withSkill = config === "with_skill";
    const messages = readMessages(ev);
    const { root, work } = prepare(
        withSkill,
        `wtf-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    const env = claudeEnv();
    const session = randomUUID();
    let changed: string[] = [];
    try {
        writeJson(join(evalDir, "eval_metadata.json"), {
            eval_id: ev.id,
            eval_name: ev.name,
            messages,
            call: ev.call,
            baseline: BASELINE,
            question: ev.question,
            facts: ev.facts,
            assertions: ev.assertions,
        });
        const before = saveGitState(work, outputs, "git-before");
        for (const [i, message] of messages.entries()) {
            const turnDir = join(runDir, `copy-${i + 1}`);
            mkdirSync(join(turnDir, "outputs"), { recursive: true });
            const resume =
                i === 0 ? ["--session-id", session] : ["--resume", session];
            const done = await outputRun(
                copyPrompt(message),
                null,
                work,
                env,
                options,
                turnDir,
                resume,
            );
            console.log(
                finishRun(
                    `${ev.name}/${config}/copy-${i + 1}`,
                    turnDir,
                    work,
                    done,
                ),
            );
        }
        const done = await outputRun(
            withSkill ? ev.call : BASELINE,
            null,
            work,
            env,
            options,
            runDir,
            ["--resume", session],
        );
        const after = saveGitState(work, outputs, "git-after");
        changed = changedFiles(before, after);
        return finishRun(`${ev.name}/${config}`, runDir, work, done);
    } finally {
        keepOutputs(root, work, changed, outputs);
    }
}

if (import.meta.main) await outputTestMain(USAGE, readEvals, run);
