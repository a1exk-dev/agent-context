// Shared code for the human-communication eval runners: the tests of
// evals.json, the temporary copy of the sample project, and the copy of the
// outputs before the runner deletes that copy. The general runner code comes
// from tests/skills/engineering/eval-lib.ts.

import { spawnSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readEvalsIn } from "../../engineering/eval-lib.ts";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const SKILL = join(
    HERE,
    "../../../../skills/writing/human-communication",
);
export const SKILL_DIR = ".claude/skills/human-communication";
export const FORCE_SKILL = "Use the human-communication skill for this task.";

// A statement of an output test. grade.ts decides a `script` statement with
// the function `check` of assertions.ts and its `args`. The grader subagent
// decides an `llm` statement.
export type Statement = {
    id: string;
    text: string;
    grader: "script" | "llm";
    check?: string;
    args?: Record<string, unknown>;
};

// `overlay` is a folder of this test folder that the runner copies over the
// project. `steps` are shell commands that run after the start commit.
export type Setup = {
    overlay?: string | null;
    remove?: string[];
    steps?: string[];
};

// What the request permits: the files that the run can change, and the
// number of new commits. U5 uses it.
export type Expect = { changes?: string[]; commits?: number };

export type Eval = {
    id: number;
    name: string;
    prompt: string;
    setup: Setup;
    expect?: Expect;
    // The ids of the common statements that do not apply to the test.
    skip?: string[];
    // The paths of the templates in the project. Their fixed text is not
    // human text of the agent.
    templates?: string[];
    assertions: Statement[];
};

// Reads the tests of evals.json with the given ids, or all tests with no
// ids. Each test gets the common statements first, without the statements
// in its `skip` list.
export function readEvals(ids: string): Eval[] {
    return readEvalsIn<Eval>(HERE, ids).map((ev) => ({
        ...ev,
        assertions: ev.assertions.filter(
            (statement) => !ev.skip?.includes(statement.id),
        ),
    }));
}

// A fixed identity and date make the start commit the same in each run.
const START_ENV = {
    GIT_AUTHOR_NAME: "eval",
    GIT_AUTHOR_EMAIL: "eval@example.com",
    GIT_COMMITTER_NAME: "eval",
    GIT_COMMITTER_EMAIL: "eval@example.com",
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
};

function run(cwd: string, command: string, args: string[]): void {
    const result = spawnSync(command, args, {
        cwd,
        env: { ...process.env, ...START_ENV },
        encoding: "utf8",
    });
    if (result.status !== 0)
        throw new Error(
            `${command} ${args.join(" ")} failed in ${cwd}:\n${result.stderr}`,
        );
}

// Copies project/ and the overlay of the test to a new folder outside this
// repository, so no AGENTS.md or CLAUDE.md of this repository loads. A run
// with the skill gets it in .claude/skills/, the only installed skill. Then
// the runner makes the start commit on `main` with a fixed date and runs the
// setup steps. Delete `root` after the run.
export function prepare(
    ev: Eval,
    withSkill: boolean,
    prefix: string,
): { root: string; work: string } {
    const root = mkdtempSync(join(tmpdir(), prefix));
    const work = join(root, "project");
    try {
        cpSync(join(HERE, "project"), work, { recursive: true });
        if (ev.setup.overlay)
            cpSync(join(HERE, ev.setup.overlay), work, { recursive: true });
        for (const path of ev.setup.remove ?? [])
            rmSync(join(work, path), { recursive: true, force: true });
        if (withSkill)
            cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
        run(work, "git", ["init", "-q", "-b", "main"]);
        run(work, "git", ["config", "commit.gpgsign", "false"]);
        run(work, "git", ["add", "-A"]);
        run(work, "git", ["commit", "-q", "-m", "start"]);
        for (const step of ev.setup.steps ?? []) run(work, "sh", ["-c", step]);
    } catch (error) {
        rmSync(root, { recursive: true, force: true });
        throw error;
    }
    return { root, work };
}

// The text of each template of the test in the project folder of a run, by
// path.
export function readTemplates(ev: Eval, work: string): Record<string, string> {
    return Object.fromEntries(
        (ev.templates ?? []).map((path) => [
            path,
            readFileSync(join(work, path), "utf8"),
        ]),
    );
}

// Copies each changed file that exists to outputs/files/, then deletes the
// temporary folder `root` of the run. Gives the text of each copied file.
export function keepOutputs(
    root: string,
    work: string,
    paths: string[],
    outputs: string,
): Record<string, string> {
    const files: Record<string, string> = {};
    try {
        for (const path of paths) {
            const source = join(work, path);
            if (!existsSync(source) || !statSync(source).isFile()) continue;
            const target = join(outputs, "files", path);
            mkdirSync(dirname(target), { recursive: true });
            cpSync(source, target);
            files[path] = readFileSync(source, "utf8");
        }
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
    return files;
}
