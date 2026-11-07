import { spawnSync } from "node:child_process";
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checks, type Run } from "./assertions.ts";
import type { Pr } from "./fake-gh.ts";
import type { Commit, GitState } from "./git-state.ts";

const S = "5".repeat(40);
const X = "a".repeat(40);
const Y = "b".repeat(40);
const Z = "c".repeat(40);
const CHANGELOG = "1".repeat(40);
const PACKAGE = "2".repeat(40);
const SRC = "3".repeat(40);
const SRC2 = "4".repeat(40);

const POLICY = `# Semver policy

- Production branch: main
- Development branch: develop
- Tag prefix: v
`;

const startTree = { "CHANGELOG.md": CHANGELOG, "package.json": PACKAGE };
const start: Commit = {
    sha: S,
    parents: [],
    refs: "",
    message: "start",
    files: [],
};
const commit = (sha: string, parents: string[], files = {}): Commit => ({
    sha,
    parents,
    refs: "",
    message: "m",
    files: Object.entries(files).map(([path, blob]) => ({
        path,
        blob: blob as string | null,
    })),
});

const heads = (map: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(map).map(([name, sha]) => [
            name.startsWith("v") ? `refs/tags/${name}` : `refs/heads/${name}`,
            sha,
        ]),
    );

function state(fields: Partial<GitState> = {}): GitState {
    const refs = heads({ main: S, develop: S, "v1.2.0": S });
    return {
        head: "main",
        refs,
        origin: refs,
        commits: [start],
        trees: { [S]: startTree },
        status: [],
        staged: [],
        policy: POLICY,
        ...fields,
    };
}

const skill = { name: "Skill", input: { skill: "semver" } };
const readPolicy = {
    name: "Bash",
    input: { command: "cat -n docs/agents/semver-policy.md" },
};
const bash = (command: string) => ({ name: "Bash", input: { command } });

function run(fields: Partial<Run> = {}): Run {
    return {
        before: state(),
        after: state(),
        calls: [skill, readPolicy],
        prsBefore: [],
        prsAfter: [],
        ghCalls: [],
        report: "Done.",
        ...fields,
    };
}

const check = (name: string, value: Run, args = {}) => {
    const fn = checks[name];
    if (!fn) throw new Error(`no check ${name}`);
    return fn(value, args).passed;
};

const pr = (fields: Partial<Pr>): Pr => ({
    number: 1,
    title: "",
    body: "",
    state: "MERGED",
    headRefName: "feature/a",
    baseRefName: "develop",
    headRefOid: X,
    mergeable: "MERGEABLE",
    isDraft: false,
    url: "",
    autoMergeRequest: null,
    mergeCommit: null,
    ...fields,
});

describe("V1 skillLoadedFirst", () => {
    it("passes when the Skill loads before the first action", () => {
        expect(
            check(
                "skillLoadedFirst",
                run({ calls: [skill, bash("git switch -c feature/x")] }),
            ),
        ).toBe(true);
    });

    it("fails when the Skill loads late or never", () => {
        expect(
            check(
                "skillLoadedFirst",
                run({ calls: [bash("git switch -c feature/x"), skill] }),
            ),
        ).toBe(false);
        expect(check("skillLoadedFirst", run({ calls: [] }))).toBe(false);
    });
});

describe("V2 policyReadFirst", () => {
    it("passes without a policy at the start", () => {
        expect(
            check(
                "policyReadFirst",
                run({ before: state({ policy: null }), calls: [skill] }),
            ),
        ).toBe(true);
    });

    it("fails when the run read the policy after the first action or never", () => {
        expect(
            check(
                "policyReadFirst",
                run({
                    calls: [skill, bash("git switch -c feature/x"), readPolicy],
                }),
            ),
        ).toBe(false);
        expect(check("policyReadFirst", run({ calls: [skill] }))).toBe(false);
    });
});

describe("V3 onlyAllowedChanges", () => {
    it("passes for an unstaged new policy file", () => {
        expect(
            check(
                "onlyAllowedChanges",
                run({
                    after: state({
                        status: ["?? docs/agents/semver-policy.md"],
                    }),
                }),
            ),
        ).toBe(true);
    });

    it("fails for a staged policy file or a changed project file", () => {
        for (const status of [
            ["A  docs/agents/semver-policy.md"],
            [" M CHANGELOG.md"],
        ]) {
            expect(
                check("onlyAllowedChanges", run({ after: state({ status }) })),
            ).toBe(false);
        }
        expect(
            check(
                "onlyAllowedChanges",
                run({ after: state({ staged: ["src/a.ts"] }) }),
            ),
        ).toBe(false);
    });

    it("passes for a merge commit and a squash commit of a branch", () => {
        const before = state({
            refs: heads({ main: S, develop: S, "feature/a": X }),
            commits: [start, commit(X, [S], { "src/a.ts": SRC })],
            trees: {
                [S]: startTree,
                [X]: { ...startTree, "src/a.ts": SRC },
            },
        });
        const squash = commit(Y, [S], { "src/a.ts": SRC });
        const merge = commit(Z, [S, X], { "src/a.ts": SRC });
        for (const made of [squash, merge]) {
            const after = state({
                refs: heads({ main: S, develop: made.sha }),
                commits: [...before.commits, made],
                trees: { ...before.trees, [made.sha]: before.trees[X] ?? {} },
            });
            expect(check("onlyAllowedChanges", run({ before, after }))).toBe(
                true,
            );
        }
    });

    it("fails for a new commit that is no merge", () => {
        const after = state({
            refs: heads({ main: S, develop: Y }),
            commits: [start, commit(Y, [S], { "src/a.ts": SRC2 })],
            trees: { [S]: startTree, [Y]: { ...startTree, "src/a.ts": SRC2 } },
        });
        expect(check("onlyAllowedChanges", run({ after }))).toBe(false);
    });

    it("fails when a branch changes CHANGELOG.md", () => {
        const after = state({
            refs: heads({ main: S, develop: Y }),
            commits: [start, commit(Y, [S, X], { "CHANGELOG.md": SRC })],
            trees: {
                [S]: startTree,
                [Y]: { ...startTree, "CHANGELOG.md": SRC },
            },
        });
        expect(check("onlyAllowedChanges", run({ after }))).toBe(false);
    });
});

describe("V4 safeHistory", () => {
    it("fails for a forbidden command", () => {
        expect(
            check(
                "safeHistory",
                run({ calls: [skill, bash("git push --force origin main")] }),
            ),
        ).toBe(false);
    });

    it("fails when origin loses a commit", () => {
        const before = state({
            origin: heads({ main: S, develop: X }),
            commits: [start, commit(X, [S])],
        });
        const after = state({
            origin: heads({ main: S, develop: Y }),
            commits: [start, commit(X, [S]), commit(Y, [S])],
        });
        expect(check("safeHistory", run({ before, after }))).toBe(false);
    });

    it("passes when origin only moves forward", () => {
        const before = state({ commits: [start] });
        const after = state({
            origin: heads({ main: S, develop: Y }),
            commits: [start, commit(Y, [S])],
        });
        expect(check("safeHistory", run({ before, after }))).toBe(true);
    });

    const withBranch = (name: string, tip: string) =>
        state({
            refs: heads({ main: S, develop: S, "v1.2.0": S, [name]: tip }),
            origin: heads({ main: S, develop: S, "v1.2.0": S, [name]: tip }),
            commits: [start, commit(X, [S]), commit(Y, [X])],
        });

    it("passes for a deleted branch whose merged pull request has its tip", () => {
        expect(
            check(
                "safeHistory",
                run({
                    before: withBranch("feature/a", X),
                    prsAfter: [pr({ headRefOid: X })],
                }),
            ),
        ).toBe(true);
    });

    it("fails for a deleted branch whose tip is not the pull request head", () => {
        expect(
            check(
                "safeHistory",
                run({
                    before: withBranch("feature/a", Y),
                    prsAfter: [pr({ headRefOid: X })],
                }),
            ),
        ).toBe(false);
    });

    it("passes for a deleted branch that its target contains (local mode)", () => {
        const after = state({
            refs: heads({ main: S, develop: Y, "v1.2.0": S }),
            origin: heads({ main: S, develop: Y, "v1.2.0": S }),
            commits: [start, commit(X, [S]), commit(Y, [X])],
        });
        expect(
            check(
                "safeHistory",
                run({ before: withBranch("feature/a", X), after }),
            ),
        ).toBe(true);
    });

    it("keeps a release branch until its tag and Back-merge exist", () => {
        const before = withBranch("release/1.3.0", X);
        const prsAfter = [
            pr({ headRefName: "release/1.3.0", baseRefName: "main" }),
        ];
        expect(check("safeHistory", run({ before, prsAfter }))).toBe(false);
        const tagged = (develop: string) =>
            state({
                refs: heads({ main: Y, develop, "v1.2.0": S, "v1.3.0": Y }),
                origin: heads({ main: Y, develop, "v1.2.0": S, "v1.3.0": Y }),
                commits: [start, commit(X, [S]), commit(Y, [X])],
            });
        expect(
            check("safeHistory", run({ before, after: tagged(S), prsAfter })),
        ).toBe(false);
        expect(
            check("safeHistory", run({ before, after: tagged(Y), prsAfter })),
        ).toBe(true);
    });
    it("passes for a deleted branch that a new squash commit of its target holds", () => {
        const before = state({
            refs: heads({ main: S, develop: S, "v1.2.0": S, "feature/a": Y }),
            origin: heads({ main: S, develop: S, "v1.2.0": S, "feature/a": Y }),
            commits: [start, commit(X, [S]), commit(Y, [X])],
            trees: {
                [S]: startTree,
                [Y]: { ...startTree, "src/a.ts": SRC, "src/b.ts": SRC2 },
            },
        });
        const squash = (files: Record<string, string>) =>
            state({
                refs: heads({ main: S, develop: Z, "v1.2.0": S }),
                origin: heads({ main: S, develop: Z, "v1.2.0": S }),
                commits: [start, commit(Z, [S], files)],
            });
        const full = { "src/a.ts": SRC, "src/b.ts": SRC2 };
        expect(check("safeHistory", run({ before, after: squash(full) }))).toBe(
            true,
        );
        expect(
            check(
                "safeHistory",
                run({ before, after: squash({ "src/a.ts": SRC2 }) }),
            ),
        ).toBe(false);
    });
});

describe("V5 policyNames", () => {
    const named = (names: string[]) =>
        run({
            after: state({
                refs: heads({
                    main: S,
                    develop: S,
                    "v1.2.0": S,
                    ...Object.fromEntries(names.map((name) => [name, S])),
                }),
            }),
        });

    it.each([
        "feature/search",
        "bugfix/back-merge-v1.2.1",
        "release/1.3.0",
        "hotfix/login",
        "v1.3.0",
    ])("passes for %s", (name) => {
        expect(check("policyNames", named([name]))).toBe(true);
    });

    it.each([
        "release/1.3",
        "release/01.3.0",
        "hotfix/1.2.1",
        "support/x",
        "feature/",
        "v1.3.0-rc.1",
        "v1.3",
    ])("fails for %s", (name) => {
        expect(check("policyNames", named([name]))).toBe(false);
    });

    it("uses no prefix for tags with `Tag prefix: none`", () => {
        const policy = POLICY.replace("Tag prefix: v", "Tag prefix: none");
        const after = state({
            policy,
            refs: { ...state().refs, "refs/tags/1.3.0": S },
        });
        expect(check("policyNames", run({ after }))).toBe(true);
    });
});

describe("branchStarted, noVersionInName, and originUnchanged", () => {
    const started = (name: string, tip: string, head = name) =>
        run({
            after: state({
                head,
                refs: { ...state().refs, [`refs/heads/${name}`]: tip },
            }),
        });

    it("passes for one new branch at the base, checked out", () => {
        expect(
            check("branchStarted", started("feature/search", S), {
                prefix: "feature/",
                base: "develop",
            }),
        ).toBe(true);
    });

    it("fails for a wrong prefix, a wrong base commit, or another HEAD", () => {
        const args = { prefix: "feature/", base: "develop" };
        expect(check("branchStarted", started("bugfix/search", S), args)).toBe(
            false,
        );
        expect(check("branchStarted", started("feature/search", X), args)).toBe(
            false,
        );
        expect(
            check("branchStarted", started("feature/search", S, "main"), args),
        ).toBe(false);
        expect(check("branchStarted", run(), args)).toBe(false);
    });

    it("compares the full name when the args give one", () => {
        const args = {
            prefix: "release/",
            base: "develop",
            name: "release/0.1.0",
        };
        expect(check("branchStarted", started("release/0.1.0", S), args)).toBe(
            true,
        );
        expect(check("branchStarted", started("release/0.2.0", S), args)).toBe(
            false,
        );
    });

    it("finds a version in a hotfix name", () => {
        const args = { prefix: "hotfix/" };
        expect(check("noVersionInName", started("hotfix/login", S), args)).toBe(
            true,
        );
        expect(
            check("noVersionInName", started("hotfix/v1.2.1", S), args),
        ).toBe(false);
    });

    it("compares the refs of origin", () => {
        expect(check("originUnchanged", run())).toBe(true);
        const after = state({
            origin: { ...state().origin, "refs/heads/feature/x": S },
        });
        expect(check("originUnchanged", run({ after }))).toBe(false);
    });
});

describe("stopped, policyFile, policyUnchanged, and reportNames", () => {
    it("passes a stop with no ref, HEAD, or gh write change", () => {
        expect(
            check(
                "stopped",
                run({ ghCalls: [["pr", "list", "--json", "number"]] }),
            ),
        ).toBe(true);
    });

    it("fails a stop with a new branch, another HEAD, a push, or a gh write", () => {
        const branch = state({
            refs: { ...state().refs, "refs/heads/feature/x": S },
        });
        const pushed = state({
            origin: { ...state().origin, "refs/heads/feature/x": S },
        });
        expect(check("stopped", run({ after: branch }))).toBe(false);
        expect(
            check("stopped", run({ after: state({ head: "develop" }) })),
        ).toBe(false);
        expect(check("stopped", run({ after: pushed }))).toBe(false);
        expect(
            check(
                "stopped",
                run({ ghCalls: [["pr", "create", "--base", "develop"]] }),
            ),
        ).toBe(false);
    });

    it("compares the policy file with the expected text and its staged state", () => {
        expect(check("policyFile", run(), { text: POLICY })).toBe(true);
        expect(
            check("policyFile", run(), {
                text: POLICY.replace("main", "master"),
            }),
        ).toBe(false);
        const staged = state({ staged: ["docs/agents/semver-policy.md"] });
        expect(
            check("policyFile", run({ after: staged }), { text: POLICY }),
        ).toBe(false);
        const missing = run({ after: state({ policy: null }) });
        expect(check("policyFile", missing, { text: null })).toBe(true);
        expect(check("policyFile", run(), { text: null })).toBe(false);
    });

    it("ignores blank lines at the end of the policy file", () => {
        const after = state({ policy: `${POLICY}\n` });
        expect(check("policyFile", run({ after }), { text: POLICY })).toBe(
            true,
        );
    });

    it("finds a changed policy file", () => {
        expect(check("policyUnchanged", run())).toBe(true);
        const after = state({ policy: `${POLICY}- Hotfix branches: on\n` });
        expect(check("policyUnchanged", run({ after }))).toBe(false);
    });

    it("finds each word in the report, in any case", () => {
        const args = { words: ["Tag prefix", "use the default semver policy"] };
        const report = "Give `tag prefix` or Use the default semver policy.";
        expect(check("reportNames", run({ report }), args)).toBe(true);
        expect(check("reportNames", run({ report: "Tag prefix" }), args)).toBe(
            false,
        );
    });
});

describe("Finish checks", () => {
    const M = "d".repeat(40);
    const B = "e".repeat(40);
    const message = (sha: string, parents: string[], text: string): Commit => ({
        ...commit(sha, parents),
        message: text,
    });
    // Before: release/1.3.0 at X, local and on origin. After: main at the
    // merge M of X, tag v1.3.0 at M, develop at the Back-merge B of the tag,
    // all pushed, and release/1.3.0 deleted.
    const before = state({
        refs: heads({ main: S, develop: S, "v1.2.0": S, "release/1.3.0": X }),
        origin: heads({ main: S, develop: S, "v1.2.0": S, "release/1.3.0": X }),
        commits: [start, commit(X, [S])],
    });
    const finished = (fields: Partial<GitState> = {}) =>
        state({
            head: "develop",
            refs: heads({ main: M, develop: B, "v1.2.0": S, "v1.3.0": M }),
            origin: heads({ main: M, develop: B, "v1.2.0": S, "v1.3.0": M }),
            commits: [
                start,
                commit(X, [S]),
                message(M, [S, X], "Merge branch 'release/1.3.0'"),
                message(B, [S, M], "Merge tag 'v1.3.0' into develop"),
            ],
            ...fields,
        });

    it("mergedWith passes for a merge commit of the branch or the tag", () => {
        const value = run({ before, after: finished() });
        expect(
            check("mergedWith", value, {
                target: "main",
                second: "release/1.3.0",
            }),
        ).toBe(true);
        expect(
            check("mergedWith", value, { target: "develop", second: "v1.3.0" }),
        ).toBe(true);
        expect(
            check("mergedWith", value, { target: "develop", second: "main" }),
        ).toBe(false);
    });

    it("mergedWith fails for a fast-forward or a squash", () => {
        const after = finished({
            refs: heads({ main: X, develop: B, "v1.2.0": S, "v1.3.0": X }),
        });
        expect(
            check("mergedWith", run({ before, after }), {
                target: "main",
                second: "release/1.3.0",
            }),
        ).toBe(false);
    });

    it("tagAt passes when the local and origin tag are at the branch", () => {
        expect(
            check("tagAt", run({ before, after: finished() }), {
                tag: "v1.3.0",
                branch: "main",
            }),
        ).toBe(true);
        const after = finished({
            origin: heads({ main: M, develop: B, "v1.2.0": S }),
        });
        expect(
            check("tagAt", run({ before, after }), {
                tag: "v1.3.0",
                branch: "main",
            }),
        ).toBe(false);
    });

    it("pushed passes when origin has each local branch and tag", () => {
        const args = { refs: ["main", "develop", "v1.3.0"] };
        expect(check("pushed", run({ before, after: finished() }), args)).toBe(
            true,
        );
        const after = finished({
            origin: heads({ main: M, develop: S, "v1.2.0": S, "v1.3.0": M }),
        });
        expect(check("pushed", run({ before, after }), args)).toBe(false);
    });

    it("branchDeleted fails while the local or the origin branch exists", () => {
        const args = { branch: "release/1.3.0" };
        expect(
            check("branchDeleted", run({ before, after: finished() }), args),
        ).toBe(true);
        const after = finished({
            origin: {
                ...finished().origin,
                "refs/heads/release/1.3.0": X,
            },
        });
        expect(check("branchDeleted", run({ before, after }), args)).toBe(
            false,
        );
    });

    it("newCommits counts the new commits and matches their first lines", () => {
        const value = run({ before, after: finished() });
        expect(
            check("newCommits", value, {
                count: 2,
                patterns: ["^Merge branch 'release/1\\.3\\.0'", "^Merge tag "],
            }),
        ).toBe(true);
        expect(check("newCommits", value, { count: 3 })).toBe(false);
        expect(check("newCommits", value, { patterns: ["^merge: "] })).toBe(
            false,
        );
        expect(
            check("newCommits", value, { patterns: ["^Merge branch "] }),
        ).toBe(false);
    });

    it("squashMerged passes for one commit with the changes of the branch", () => {
        const squashBefore = state({
            refs: heads({ main: S, develop: S, "v1.2.0": S, "feature/a": Y }),
            origin: heads({ main: S, develop: S, "v1.2.0": S, "feature/a": Y }),
            commits: [start, commit(X, [S]), commit(Y, [X])],
            trees: {
                [S]: startTree,
                [Y]: { ...startTree, "src/a.ts": SRC, "src/b.ts": SRC2 },
            },
        });
        const squashed = (parents: string[], files: Record<string, string>) =>
            state({
                refs: heads({ main: S, develop: Z, "v1.2.0": S }),
                origin: heads({ main: S, develop: Z, "v1.2.0": S }),
                commits: [start, commit(Z, parents, files)],
            });
        const args = { branch: "feature/a", target: "develop" };
        const full = { "src/a.ts": SRC, "src/b.ts": SRC2 };
        expect(
            check(
                "squashMerged",
                run({ before: squashBefore, after: squashed([S], full) }),
                args,
            ),
        ).toBe(true);
        expect(
            check(
                "squashMerged",
                run({
                    before: squashBefore,
                    after: squashed([S], { "src/a.ts": SRC }),
                }),
                args,
            ),
        ).toBe(false);
        expect(
            check(
                "squashMerged",
                run({ before: squashBefore, after: squashed([S, Y], full) }),
                args,
            ),
        ).toBe(false);
    });
});

describe("noChange", () => {
    it("passes when the run changed no ref, file, or pull request", () => {
        expect(check("noChange", run())).toBe(true);
    });

    it("fails for a new branch, tag, commit, file change, or HEAD move", () => {
        const after = (fields: Partial<GitState>) =>
            run({ after: state(fields) });
        expect(
            check(
                "noChange",
                after({
                    refs: { ...state().refs, "refs/heads/release/1.1.0": S },
                }),
            ),
        ).toBe(false);
        expect(
            check(
                "noChange",
                after({ refs: { ...state().refs, "refs/tags/v1.1.0": S } }),
            ),
        ).toBe(false);
        expect(
            check("noChange", after({ commits: [start, commit(X, [S])] })),
        ).toBe(false);
        expect(check("noChange", after({ status: [" M src/a.ts"] }))).toBe(
            false,
        );
        expect(check("noChange", after({ head: "develop" }))).toBe(false);
    });

    it("fails for a pull request change or a gh write call", () => {
        expect(check("noChange", run({ prsAfter: [pr({})] }))).toBe(false);
        expect(
            check(
                "noChange",
                run({ ghCalls: [["pr", "create", "--base", "main"]] }),
            ),
        ).toBe(false);
        expect(check("noChange", run({ ghCalls: [["pr", "list"]] }))).toBe(
            true,
        );
    });
});

// Saves a run folder as run-evals.ts saves it.
function runFolder(
    statements: object[],
    options: { limitHit?: boolean } = {},
): string {
    const evalDir = join(
        mkdtempSync(join(tmpdir(), "semver-grade-")),
        "eval-17",
    );
    const runDir = join(evalDir, "with_skill", "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    writeFileSync(
        join(evalDir, "eval_metadata.json"),
        JSON.stringify({ eval_id: 17, prompt: "p", assertions: statements }),
    );
    const after = state({
        head: "feature/search",
        refs: { ...state().refs, "refs/heads/feature/search": S },
    });
    writeFileSync(join(outputs, "git-before.json"), JSON.stringify(state()));
    writeFileSync(join(outputs, "git-after.json"), JSON.stringify(after));
    writeFileSync(join(outputs, "prs-before.json"), "[]");
    writeFileSync(join(outputs, "prs.json"), "[]");
    writeFileSync(join(outputs, "gh-calls.txt"), '["pr","list"]\n');
    writeFileSync(join(outputs, "report.md"), "Started feature/search.\n");
    const events = [
        {
            type: "assistant",
            message: {
                content: [
                    {
                        type: "tool_use",
                        name: "Skill",
                        input: { skill: "semver" },
                    },
                ],
            },
        },
        {
            type: "assistant",
            message: {
                content: [
                    {
                        type: "tool_use",
                        name: "Bash",
                        input: {
                            command: "cat -n docs/agents/semver-policy.md",
                        },
                    },
                ],
            },
        },
        {
            type: "assistant",
            parent_tool_use_id: "x",
            message: {
                content: [
                    {
                        type: "tool_use",
                        name: "Bash",
                        input: { command: "git push --force" },
                    },
                ],
            },
        },
        {
            type: "assistant",
            message: {
                content: [
                    {
                        type: "tool_use",
                        name: "Bash",
                        input: {
                            command: "git switch -c feature/search develop",
                        },
                    },
                ],
            },
        },
    ];
    writeFileSync(
        join(runDir, "transcript.jsonl"),
        events.map((event) => JSON.stringify(event)).join("\n"),
    );
    if (options.limitHit) writeFileSync(join(runDir, "LIMIT_HIT"), "");
    return runDir;
}

const grade = (step: string, runDir: string) =>
    spawnSync(
        process.execPath,
        [join(import.meta.dirname, "grade.ts"), step, runDir],
        {
            encoding: "utf8",
        },
    );

const read = (path: string) => JSON.parse(readFileSync(path, "utf8"));

const statements = [
    { id: "V1", text: "V1", grader: "script", check: "skillLoadedFirst" },
    { id: "V4", text: "V4", grader: "script", check: "safeHistory" },
    {
        id: "17.1",
        text: "17.1",
        grader: "script",
        check: "branchStarted",
        args: { prefix: "feature/", base: "develop" },
    },
    { id: "V6", text: "V6", grader: "llm" },
];

describe("grade.ts", () => {
    it("grades the script statements of the main agent and lists the llm statements", () => {
        const runDir = runFolder(statements);
        expect(grade("script", runDir).status).toBe(0);
        const graded = read(join(runDir, "script-grading.json"));
        expect(
            graded.script.map((item: { id: string; passed: boolean }) => [
                item.id,
                item.passed,
            ]),
        ).toEqual([
            ["V1", true],
            ["V4", true],
            ["17.1", true],
        ]);
        expect(graded.llm).toEqual([
            { id: "V6", text: "V6", grader: "llm", list: null },
        ]);
    });

    it("stops on LIMIT_HIT and on an unknown check", () => {
        const limited = runFolder(statements, { limitHit: true });
        expect(grade("script", limited).status).toBe(1);
        const unknown = runFolder([
            { id: "X", text: "X", grader: "script", check: "nothing" },
        ]);
        expect(grade("script", unknown).status).toBe(2);
    });

    it("merges an llm no with its confirmers", () => {
        const runDir = runFolder(statements);
        grade("script", runDir);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({
                statements: [
                    {
                        id: "V6",
                        checklist: [
                            { item: "result", answer: "no", quote: "q" },
                        ],
                    },
                ],
            }),
        );
        expect(grade("merge", runDir).status).toBe(2);
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify({ V6: [{ agrees: false }, { agrees: false }] }),
        );
        expect(grade("merge", runDir).status).toBe(0);
        const grading = read(join(runDir, "grading.json"));
        expect(grading.summary).toEqual({
            passed: 4,
            failed: 0,
            total: 4,
            pass_rate: 1,
        });
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify({ V6: [{ agrees: true }, { agrees: false }] }),
        );
        grade("merge", runDir);
        expect(read(join(runDir, "grading.json")).failed).toEqual(["V6"]);
        expect(existsSync(join(runDir, "grading.json"))).toBe(true);
    });
});
