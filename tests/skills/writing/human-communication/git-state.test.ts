import { describe, expect, it } from "vitest";
import {
    changedFiles,
    type GitState,
    newCommits,
    parseGitState,
    renderGitState,
} from "./git-state.ts";

// Saved output of the git commands of a snapshot. The check container has
// no Git, so the tests use this output.
const LOG = [
    "\x1eb2\x1ffix: retry limit\n\nThe retry stops after 5 tries.\n\x1f",
    "",
    "src/fetch.ts",
    "\x1ea1\x1fstart\n\x1f",
    "",
    "AGENTS.md",
    "src/fetch.ts",
    "",
].join("\n");

const state = (overrides: Partial<GitState>): GitState => ({
    head: "main",
    commits: [{ sha: "a1", message: "start", files: ["AGENTS.md"] }],
    status: [],
    staged: [],
    ...overrides,
});

describe("parseGitState", () => {
    it("reads HEAD, the commits with their files, the status, and the staged files", () => {
        expect(
            parseGitState({
                head: "main\n",
                log: LOG,
                status: " M README.md\n?? docs/setup.md\n",
                staged: "src/fetch.ts\n",
            }),
        ).toEqual({
            head: "main",
            commits: [
                {
                    sha: "b2",
                    message:
                        "fix: retry limit\n\nThe retry stops after 5 tries.",
                    files: ["src/fetch.ts"],
                },
                {
                    sha: "a1",
                    message: "start",
                    files: ["AGENTS.md", "src/fetch.ts"],
                },
            ],
            status: [" M README.md", "?? docs/setup.md"],
            staged: ["src/fetch.ts"],
        });
    });
});

describe("changedFiles", () => {
    it("gives the files whose status changed in the run and the files of new commits", () => {
        const before = state({ status: [" M src/fetch.ts"] });
        const after = state({
            commits: [
                { sha: "c3", message: "docs", files: ["docs/a.md"] },
                { sha: "a1", message: "start", files: ["AGENTS.md"] },
            ],
            status: [
                " M src/fetch.ts",
                "?? docs/setup.md",
                "R  old.md -> new.md",
            ],
        });
        expect(changedFiles(before, after)).toEqual([
            "docs/setup.md",
            "new.md",
            "old.md",
            "docs/a.md",
        ]);
    });

    it("gives no file when nothing changed", () => {
        expect(changedFiles(state({}), state({}))).toEqual([]);
    });
});

describe("newCommits", () => {
    it("gives the commits that the run made", () => {
        const after = state({
            commits: [
                { sha: "c3", message: "docs", files: [] },
                { sha: "a1", message: "start", files: ["AGENTS.md"] },
            ],
        });
        expect(newCommits(state({}), after).map((c) => c.sha)).toEqual(["c3"]);
    });
});

describe("renderGitState", () => {
    it("gives each part under its own heading", () => {
        expect(renderGitState(state({ staged: ["a.md"] }))).toBe(
            [
                "## HEAD",
                "",
                "main",
                "",
                "## git log (changed files)",
                "",
                "commit a1",
                "",
                "start",
                "",
                "  AGENTS.md",
                "",
                "## git status --porcelain",
                "",
                "(none)",
                "",
                "## git diff --cached --name-only",
                "",
                "a.md",
                "",
            ].join("\n"),
        );
    });
});
