import { describe, expect, it } from "vitest";
import { fakeGh, type GhContext, type Pr } from "./fake-gh.ts";

const ctx: GhContext = {
    currentBranch: "feature/search",
    defaultBranch: "main",
    remoteHead: (branch) =>
        ({ "feature/search": "a".repeat(40), main: "b".repeat(40) })[branch] ??
        null,
};

const pr = (fields: Partial<Pr>): Pr => ({
    number: 1,
    title: "t",
    body: "",
    state: "OPEN",
    headRefName: "feature/x",
    baseRefName: "develop",
    headRefOid: "c".repeat(40),
    mergeable: "MERGEABLE",
    isDraft: false,
    url: "https://github.com/example/project/pull/1",
    autoMergeRequest: null,
    mergeCommit: null,
    ...fields,
});

const json = (stdout: string) => JSON.parse(stdout);

describe("gh pr list", () => {
    const prs = [
        pr({ number: 1, headRefName: "feature/a", state: "MERGED" }),
        pr({ number: 2, headRefName: "feature/b" }),
        pr({ number: 3, headRefName: "main", baseRefName: "develop" }),
    ];

    it("gives the open pull requests by default, with the asked fields", () => {
        const result = fakeGh(
            ["pr", "list", "--json", "number,headRefName"],
            prs,
            ctx,
        );
        expect(result.code).toBe(0);
        expect(json(result.stdout)).toEqual([
            { number: 2, headRefName: "feature/b" },
            { number: 3, headRefName: "main" },
        ]);
    });

    it("filters by state, head, and base", () => {
        const all = (args: string[]) =>
            json(
                fakeGh(["pr", "list", ...args, "--json", "number"], prs, ctx)
                    .stdout,
            ).map((item: { number: number }) => item.number);
        expect(all(["--state", "merged"])).toEqual([1]);
        expect(all(["--state", "all", "--head", "feature/a"])).toEqual([1]);
        expect(all(["--base", "develop", "--head", "main"])).toEqual([3]);
        expect(all(["-s", "closed"])).toEqual([]);
    });

    it("passes --jq to the caller and gives a table without --json", () => {
        const result = fakeGh(
            ["pr", "list", "--json", "number", "--jq", ".[].number"],
            prs,
            ctx,
        );
        expect(result.jq).toBe(".[].number");
        expect(fakeGh(["pr", "list"], prs, ctx).stdout).toBe(
            "2\tt\tfeature/b\tOPEN\n3\tt\tmain\tOPEN\n",
        );
    });
});

describe("gh pr view", () => {
    const prs = [
        pr({
            number: 4,
            headRefName: "feature/search",
            mergeable: "CONFLICTING",
        }),
    ];

    it("finds a pull request by number, by branch, and by the current branch", () => {
        for (const args of [["4"], ["feature/search"], []]) {
            const result = fakeGh(
                ["pr", "view", ...args, "--json", "number,mergeable"],
                prs,
                ctx,
            );
            expect(json(result.stdout)).toEqual({
                number: 4,
                mergeable: "CONFLICTING",
            });
        }
    });

    it("fails for an unknown pull request", () => {
        const result = fakeGh(["pr", "view", "9"], prs, ctx);
        expect(result.code).toBe(1);
        expect(result.stderr).toMatch(/no pull request/);
    });
});

describe("gh pr create", () => {
    it("adds an open pull request with the head commit of origin", () => {
        const result = fakeGh(
            [
                "pr",
                "create",
                "--base",
                "develop",
                "--title",
                "Add search",
                "--body",
                "Body",
            ],
            [pr({ number: 7 })],
            ctx,
        );
        expect(result.code).toBe(0);
        expect(result.stdout).toBe(
            "https://github.com/example/project/pull/8\n",
        );
        expect(result.prs.at(-1)).toMatchObject({
            number: 8,
            title: "Add search",
            body: "Body",
            state: "OPEN",
            headRefName: "feature/search",
            baseRefName: "develop",
            headRefOid: "a".repeat(40),
        });
    });

    it("uses --head and the default branch as base", () => {
        const result = fakeGh(
            ["pr", "create", "-H", "main", "-t", "x", "-b", ""],
            [],
            ctx,
        );
        expect(result.prs[0]).toMatchObject({
            headRefName: "main",
            baseRefName: "main",
            number: 1,
        });
    });

    it("refuses a head branch that origin does not have", () => {
        const result = fakeGh(
            ["pr", "create", "--head", "feature/new", "--fill"],
            [],
            ctx,
        );
        expect(result.code).toBe(1);
        expect(result.prs).toEqual([]);
    });

    it("refuses a second open pull request for the same head and base", () => {
        const prs = [
            pr({ headRefName: "feature/search", baseRefName: "develop" }),
        ];
        const result = fakeGh(
            ["pr", "create", "--base", "develop", "--fill"],
            prs,
            ctx,
        );
        expect(result.code).toBe(1);
        expect(result.prs).toEqual(prs);
    });
});

describe("gh pr merge and gh pr close", () => {
    const prs = [pr({ number: 5 })];

    it("merges at once without --auto", () => {
        const result = fakeGh(["pr", "merge", "5", "--squash"], prs, ctx);
        expect(result.code).toBe(0);
        expect(result.prs[0]?.state).toBe("MERGED");
        expect(prs[0]?.state).toBe("OPEN");
    });

    it("turns on auto-merge with --auto and keeps the pull request open", () => {
        const result = fakeGh(
            ["pr", "merge", "5", "--auto", "--merge"],
            prs,
            ctx,
        );
        expect(result.prs[0]).toMatchObject({
            state: "OPEN",
            autoMergeRequest: { mergeMethod: "MERGE" },
        });
    });

    it("closes a pull request", () => {
        const result = fakeGh(["pr", "close", "5"], prs, ctx);
        expect(result.prs[0]?.state).toBe("CLOSED");
    });

    it("refuses to merge a closed pull request", () => {
        const closed = [pr({ number: 5, state: "CLOSED" })];
        expect(fakeGh(["pr", "merge", "5", "--merge"], closed, ctx).code).toBe(
            1,
        );
    });
});

describe("other commands", () => {
    it("answers gh auth status and refuses an unknown command", () => {
        expect(fakeGh(["auth", "status"], [], ctx).code).toBe(0);
        const result = fakeGh(["release", "create", "v1.3.0"], [], ctx);
        expect(result.code).toBe(1);
        expect(result.stderr).toMatch(/fake gh/);
    });
});
