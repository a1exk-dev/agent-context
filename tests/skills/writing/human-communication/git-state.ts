// The git state of one human-communication output test, before or after the
// run. The runner saves it as git-before.json and git-after.json for
// grade.ts, and as git-before.md and git-after.md for the grader subagent.
// `collectGitState` runs git on the host. The parser is pure, so vitest
// tests it with saved output.

import { spawnSync } from "node:child_process";

export type Commit = { sha: string; message: string; files: string[] };

// `status` has the lines of `git status --porcelain --untracked-files=all`,
// and `staged` the paths of the index changes.
export type GitState = {
    head: string;
    commits: Commit[];
    status: string[];
    staged: string[];
};

export type RawGitState = {
    head: string;
    log: string;
    status: string;
    staged: string;
};

const LOG_FORMAT = "--format=%x1e%H%x1f%B%x1f";

const lines = (text: string) => text.split("\n").filter(Boolean);

// Parses the output of the git commands of a snapshot. `log` is `git log`
// with LOG_FORMAT and `--name-only`.
export function parseGitState(raw: RawGitState): GitState {
    const commits = raw.log
        .split("\x1e")
        .slice(1)
        .map((record) => {
            const [sha = "", message = "", files = ""] = record.split("\x1f");
            return { sha, message: message.trim(), files: lines(files) };
        });
    return {
        head: raw.head.trim(),
        commits,
        status: lines(raw.status),
        staged: lines(raw.staged),
    };
}

// The paths of one status line. A rename gives the new and the old path.
const statusPaths = (line: string) => line.slice(3).split(" -> ").reverse();

// The commits of `after` that `before` does not have.
export function newCommits(before: GitState, after: GitState): Commit[] {
    const old = new Set(before.commits.map((commit) => commit.sha));
    return after.commits.filter((commit) => !old.has(commit.sha));
}

// Each file that the run changed: a status line that is new after the run,
// or a file of a new commit.
export function changedFiles(before: GitState, after: GitState): string[] {
    const old = new Set(before.status);
    const paths = [
        ...after.status.filter((line) => !old.has(line)).flatMap(statusPaths),
        ...newCommits(before, after).flatMap((commit) => commit.files),
    ];
    return [...new Set(paths)];
}

const block = (items: string[]) =>
    items.length > 0 ? `${items.join("\n")}\n` : "(none)\n";

export function renderGitState(state: GitState): string {
    const commits = state.commits.map((commit) =>
        [
            `commit ${commit.sha}`,
            "",
            commit.message,
            "",
            ...commit.files.map((file) => `  ${file}`),
        ].join("\n"),
    );
    const sections: [string, string][] = [
        ["HEAD", `${state.head}\n`],
        ["git log (changed files)", block(commits)],
        ["git status --porcelain", block(state.status)],
        ["git diff --cached --name-only", block(state.staged)],
    ];
    return sections.map(([title, text]) => `## ${title}\n\n${text}`).join("\n");
}

function git(work: string, args: string[]): string {
    const result = spawnSync("git", args, { cwd: work, encoding: "utf8" });
    return result.status === 0 ? result.stdout : "";
}

// Runs the git commands of a snapshot in the project folder of a run.
export function collectGitState(work: string): GitState {
    return parseGitState({
        head: git(work, ["symbolic-ref", "--short", "-q", "HEAD"]),
        log: git(work, ["log", "--no-renames", "--name-only", LOG_FORMAT]),
        status: git(work, ["status", "--porcelain", "--untracked-files=all"]),
        staged: git(work, ["diff", "--cached", "--name-only"]),
    });
}
