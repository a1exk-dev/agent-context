// cspell:ignore objectname
// The git state of one semver output test, before or after the run. The
// runner saves it as git-before.json and git-after.json for grade.ts, and as
// git-before.md and git-after.md for the grader subagent. `collectGitState`
// runs git. The parsers are pure, so vitest tests them without Git.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const POLICY = "docs/agents/semver-policy.md";

// One changed file of a commit against its first parent. `blob` is null for
// a deleted file.
export type FileBlob = { path: string; blob: string | null };

export type Commit = {
    sha: string;
    parents: string[];
    refs: string;
    message: string;
    files: FileBlob[];
};

// `refs` and `origin` map each `refs/heads/*` and `refs/tags/*` to its
// commit, with tags peeled. `trees` maps each commit of these refs to its
// files and blobs. `status` has the lines of `git status --porcelain
// --untracked-files=all`, and `staged` the paths of the index changes.
// `markers` has `<commit>:<path>` for each file of a ref commit with a
// conflict marker line.
export type GitState = {
    head: string;
    refs: Record<string, string>;
    origin: Record<string, string>;
    commits: Commit[];
    trees: Record<string, Record<string, string>>;
    status: string[];
    staged: string[];
    policy: string | null;
    markers: string[];
};

// The raw output of each git command of a snapshot.
export type RawGitState = {
    head: string;
    headCommit?: string;
    refs: string;
    origin: string;
    log: string;
    status: string;
    staged: string;
    policy: string | null;
    markers: string;
};

const lines = (text: string) => text.split("\n").filter(Boolean);
const kept = (ref: string) =>
    ref.startsWith("refs/heads/") || ref.startsWith("refs/tags/");

function parseRefs(text: string): Record<string, string> {
    const refs: Record<string, string> = {};
    for (const line of lines(text)) {
        const [ref = "", sha = "", peeled = ""] = line.split("\t");
        if (kept(ref)) refs[ref] = peeled || sha;
    }
    return refs;
}

function parseLsRemote(text: string): Record<string, string> {
    const refs: Record<string, string> = {};
    for (const line of lines(text)) {
        const [sha = "", ref = ""] = line.split("\t");
        const name = ref.replace(/\^\{\}$/, "");
        if (!kept(name)) continue;
        if (ref.endsWith("^{}") || !(name in refs)) refs[name] = sha;
    }
    return refs;
}

// Parses `git log` with LOG_FORMAT and `--raw`.
function parseLog(text: string): Commit[] {
    return text
        .split("\x1e")
        .slice(1)
        .map((record) => {
            const [sha = "", parents = "", refs = "", message = "", raw = ""] =
                record.split("\x1f");
            const files = lines(raw)
                .filter((line) => line.startsWith(":"))
                .map((line) => {
                    const [meta = "", path = ""] = line.split("\t");
                    const blob = meta.split(" ")[3] ?? "";
                    return { path, blob: /^0+$/.test(blob) ? null : blob };
                });
            return {
                sha,
                parents: parents.split(" ").filter(Boolean),
                refs,
                message: message.trim(),
                files,
            };
        });
}

function parseLsTree(text: string): Record<string, string> {
    const tree: Record<string, string> = {};
    for (const line of lines(text)) {
        const [meta = "", path = ""] = line.split("\t");
        tree[path] = meta.split(" ")[2] ?? "";
    }
    return tree;
}

export function parseGitState(
    raw: RawGitState,
    trees: Record<string, string>,
): GitState {
    const head = raw.head.trim();
    return {
        head: head || `(detached) ${raw.headCommit?.trim() ?? ""}`,
        refs: parseRefs(raw.refs),
        origin: parseLsRemote(raw.origin),
        commits: parseLog(raw.log),
        trees: Object.fromEntries(
            Object.entries(trees).map(([sha, text]) => [
                sha,
                parseLsTree(text),
            ]),
        ),
        status: lines(raw.status),
        staged: lines(raw.staged),
        policy: raw.policy,
        markers: lines(raw.markers),
    };
}

// True when `ancestor` is `commit` or one of its ancestors.
export function isAncestor(
    commits: Commit[],
    ancestor: string,
    commit: string,
): boolean {
    const parents = new Map(commits.map((item) => [item.sha, item.parents]));
    const seen = new Set<string>();
    const queue = [commit];
    while (queue.length > 0) {
        const sha = queue.pop() as string;
        if (sha === ancestor) return true;
        if (seen.has(sha)) continue;
        seen.add(sha);
        queue.push(...(parents.get(sha) ?? []));
    }
    return false;
}

const block = (items: string[]) =>
    items.length > 0 ? `${items.join("\n")}\n` : "(none)\n";

export function renderGitState(state: GitState): string {
    const refs = (map: Record<string, string>) =>
        block(Object.entries(map).map(([ref, sha]) => `${ref} ${sha}`));
    const commits = state.commits.map((commit) =>
        [
            `commit ${commit.sha}`,
            `parents ${commit.parents.join(" ")}`,
            `refs ${commit.refs}`,
            "",
            commit.message,
            "",
            ...commit.files.map(
                (file) =>
                    `  ${file.path}${file.blob === null ? " (deleted)" : ""}`,
            ),
            "",
        ].join("\n"),
    );
    const sections: [string, string][] = [
        ["HEAD", `${state.head}\n`],
        ["Local branches and tags (tags peeled)", refs(state.refs)],
        ["git ls-remote origin (tags peeled)", refs(state.origin)],
        [
            "git log --all (changed files against the first parent)",
            block(commits),
        ],
        ["git status --porcelain", block(state.status)],
        ["git diff --cached --name-only", block(state.staged)],
        [POLICY, state.policy ?? "(missing)\n"],
        ["Conflict markers in ref files", block(state.markers)],
    ];
    return sections.map(([title, text]) => `## ${title}\n\n${text}`).join("\n");
}

const LOG_FORMAT = "--format=%x1e%H%x1f%P%x1f%D%x1f%B%x1f";

function git(work: string, args: string[]): string {
    const result = spawnSync("git", args, { cwd: work, encoding: "utf8" });
    return result.status === 0 ? result.stdout : "";
}

// Runs the git commands of a snapshot in the project folder of a run.
export function collectGitState(work: string): GitState {
    const policy = join(work, POLICY);
    const raw: RawGitState = {
        head: git(work, ["symbolic-ref", "--short", "-q", "HEAD"]),
        headCommit: git(work, ["rev-parse", "HEAD"]),
        refs: git(work, [
            "for-each-ref",
            "--format=%(refname)%09%(objectname)%09%(*objectname)",
        ]),
        origin: git(work, ["ls-remote", "origin"]),
        log: git(work, [
            "log",
            "--all",
            "--no-abbrev",
            "--no-renames",
            "--raw",
            "--diff-merges=first-parent",
            LOG_FORMAT,
        ]),
        status: git(work, ["status", "--porcelain", "--untracked-files=all"]),
        staged: git(work, ["diff", "--cached", "--name-only"]),
        policy: existsSync(policy) ? readFileSync(policy, "utf8") : null,
        markers: "",
    };
    const state = parseGitState(raw, {});
    const tips = new Set([
        ...Object.values(state.refs),
        ...Object.values(state.origin),
    ]);
    raw.markers = git(work, [
        "grep",
        "-l",
        "-E",
        "^(<<<<<<<|>>>>>>>)( |$)",
        ...tips,
    ]);
    const trees = Object.fromEntries(
        [...tips].map((sha) => [sha, git(work, ["ls-tree", "-r", sha])]),
    );
    return parseGitState(raw, trees);
}
