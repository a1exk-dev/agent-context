import { describe, expect, it } from "vitest";
import { isAncestor, parseGitState, renderGitState } from "./git-state.ts";

const A = "a".repeat(40);
const B = "b".repeat(40);
const C = "c".repeat(40);
const T = "e".repeat(40);
const BLOB1 = "1".repeat(40);
const BLOB2 = "2".repeat(40);
const ZERO = "0".repeat(40);

// The raw output of the git commands of one snapshot, as git prints them.
const raw = {
    head: "feature/search\n",
    refs: [
        `refs/heads/develop\t${B}\t`,
        `refs/heads/feature/search\t${B}\t`,
        `refs/heads/main\t${A}\t`,
        `refs/remotes/origin/main\t${A}\t`,
        `refs/tags/v1.2.0\t${T}\t${A}`,
        "",
    ].join("\n"),
    origin: [
        `${A}\tHEAD`,
        `${B}\trefs/heads/develop`,
        `${A}\trefs/heads/main`,
        `${T}\trefs/tags/v1.2.0`,
        `${A}\trefs/tags/v1.2.0^{}`,
        "",
    ].join("\n"),
    log: [
        `\x1e${B}\x1f${A} ${C}\x1fHEAD -> feature/search, develop\x1fMerge branch 'feature/x' into develop\n\x1f`,
        `:100644 100644 ${BLOB1} ${BLOB2} M\tsrc/a.ts`,
        `:100644 000000 ${BLOB1} ${ZERO} D\told.txt`,
        "",
        `\x1e${C}\x1f${A}\x1f\x1ffeat: add x\n\nBody line.\n\x1f`,
        `:000000 100644 ${ZERO} ${BLOB2} A\tsrc/a.ts`,
        "",
        `\x1e${A}\x1f\x1ftag: v1.2.0, main\x1fstart\n\x1f`,
        `:000000 100644 ${ZERO} ${BLOB1} A\tCHANGELOG.md`,
        "",
    ].join("\n"),
    status: " M src/a.ts\n?? docs/agents/semver-policy.md\n",
    staged: "src/a.ts\n",
    policy: "# Semver policy\n",
};

const trees = {
    [A]: `100644 blob ${BLOB1}\tCHANGELOG.md\n`,
    [B]: `100644 blob ${BLOB1}\tCHANGELOG.md\n100644 blob ${BLOB2}\tsrc/a.ts\n`,
};

describe("parseGitState", () => {
    const state = parseGitState(raw, trees);

    it("gives the current branch, the local refs, and the refs of origin", () => {
        expect(state.head).toBe("feature/search");
        expect(state.refs).toEqual({
            "refs/heads/develop": B,
            "refs/heads/feature/search": B,
            "refs/heads/main": A,
            "refs/tags/v1.2.0": A,
        });
        expect(state.origin).toEqual({
            "refs/heads/develop": B,
            "refs/heads/main": A,
            "refs/tags/v1.2.0": A,
        });
    });

    it("gives each commit with its parents, message, and changed files", () => {
        expect(state.commits).toEqual([
            {
                sha: B,
                parents: [A, C],
                refs: "HEAD -> feature/search, develop",
                message: "Merge branch 'feature/x' into develop",
                files: [
                    { path: "src/a.ts", blob: BLOB2 },
                    { path: "old.txt", blob: null },
                ],
            },
            {
                sha: C,
                parents: [A],
                refs: "",
                message: "feat: add x\n\nBody line.",
                files: [{ path: "src/a.ts", blob: BLOB2 }],
            },
            {
                sha: A,
                parents: [],
                refs: "tag: v1.2.0, main",
                message: "start",
                files: [{ path: "CHANGELOG.md", blob: BLOB1 }],
            },
        ]);
    });

    it("gives the tree of each ref commit, the status, the staged files, and the policy", () => {
        expect(state.trees[B]).toEqual({
            "CHANGELOG.md": BLOB1,
            "src/a.ts": BLOB2,
        });
        expect(state.status).toEqual([
            " M src/a.ts",
            "?? docs/agents/semver-policy.md",
        ]);
        expect(state.staged).toEqual(["src/a.ts"]);
        expect(state.policy).toBe("# Semver policy\n");
    });

    it("gives a detached HEAD as its commit and a missing policy as null", () => {
        const detached = parseGitState(
            { ...raw, head: "", headCommit: `${A}\n`, policy: null },
            trees,
        );
        expect(detached.head).toBe(`(detached) ${A}`);
        expect(detached.policy).toBeNull();
    });
});

describe("isAncestor", () => {
    const { commits } = parseGitState(raw, trees);

    it("follows the parents of each commit", () => {
        expect(isAncestor(commits, A, B)).toBe(true);
        expect(isAncestor(commits, C, B)).toBe(true);
        expect(isAncestor(commits, B, B)).toBe(true);
        expect(isAncestor(commits, B, A)).toBe(false);
    });
});

describe("renderGitState", () => {
    it("shows each part for the grader in Markdown", () => {
        const text = renderGitState(parseGitState(raw, trees));
        expect(text).toContain("## HEAD\n\nfeature/search\n");
        expect(text).toContain(`refs/heads/main ${A}`);
        expect(text).toContain(
            `commit ${C}\nparents ${A}\nrefs \n\nfeat: add x`,
        );
        expect(text).toContain("## git status --porcelain\n\n M src/a.ts");
        expect(text).toContain(
            "## docs/agents/semver-policy.md\n\n# Semver policy",
        );
    });
});
