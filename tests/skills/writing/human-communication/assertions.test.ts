import { describe, expect, it } from "vitest";
import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";
import { checks, type Run } from "./assertions.ts";
import type { GitState } from "./git-state.ts";

const START: GitState = {
    head: "main",
    commits: [{ sha: "a1", message: "start", files: ["README.md"] }],
    status: [],
    staged: [],
};

const text = (value: string): ClaudeEvent =>
    ({
        type: "assistant",
        message: { content: [{ type: "text", text: value }] },
    }) as ClaudeEvent;
const tool = (name: string, input: Record<string, unknown>): ClaudeEvent =>
    ({
        type: "assistant",
        message: { content: [{ type: "tool_use", name, input }] },
    }) as ClaudeEvent;
const LOAD = tool("Skill", { skill: "human-communication" });

const run = (overrides: Partial<Run>): Run => ({
    events: [],
    questions: [],
    files: {},
    before: START,
    after: START,
    expect: {},
    templates: {},
    ...overrides,
});
const check = (name: string, value: Run, args = {}) =>
    (checks[name] as NonNullable<(typeof checks)[string]>)(value, args);

describe("skillLoadedFirst (U1)", () => {
    it("passes when the Skill loads before the first text", () => {
        expect(
            check(
                "skillLoadedFirst",
                run({ events: [LOAD, text("The retry stops after 3.")] }),
            ).passed,
        ).toBe(true);
    });

    it("passes when the agent reads SKILL.md before it writes a document", () => {
        const events = [
            tool("Read", {
                file_path: "/w/.claude/skills/human-communication/SKILL.md",
            }),
            tool("Write", { file_path: "/w/docs/setup.md", content: "# A" }),
        ];
        expect(check("skillLoadedFirst", run({ events })).passed).toBe(true);
    });

    it("fails when text, a question, or a document write comes first", () => {
        for (const first of [
            text("Let me look."),
            tool("AskUserQuestion", { questions: [] }),
            tool("Edit", { file_path: "/w/README.md" }),
        ]) {
            expect(
                check("skillLoadedFirst", run({ events: [first, LOAD] }))
                    .passed,
            ).toBe(false);
        }
    });

    it("fails when the Skill never loads", () => {
        expect(
            check("skillLoadedFirst", run({ events: [text("Done.")] })).passed,
        ).toBe(false);
    });
});

describe("steText (U2)", () => {
    it("passes for STE-based text and fails with each problem as evidence", () => {
        expect(
            check("steText", run({ events: [text("The retry stops.")] })),
        ).toEqual({ passed: true, evidence: "No problem in 1 human texts." });
        const failed = check(
            "steText",
            run({ events: [text("You should retry.")] }),
        );
        expect(failed).toEqual({
            passed: false,
            evidence: 'text: forbidden word "should": You should retry.',
        });
    });
});

describe("onlyRequestedChanges (U5)", () => {
    it("passes when only the requested files changed", () => {
        const after = { ...START, status: [" M src/fetch.ts"] };
        expect(
            check(
                "onlyRequestedChanges",
                run({ after, expect: { changes: ["src/fetch.ts"] } }),
            ).passed,
        ).toBe(true);
    });

    it("fails for another changed file, a staged file, or a new commit", () => {
        const cases: GitState[] = [
            { ...START, status: ["?? notes.md"] },
            { ...START, staged: ["README.md"], status: ["M  README.md"] },
            {
                ...START,
                commits: [
                    { sha: "b2", message: "x", files: [] },
                    ...START.commits,
                ],
            },
        ];
        for (const after of cases) {
            expect(check("onlyRequestedChanges", run({ after })).passed).toBe(
                false,
            );
        }
    });
});

describe("noComplianceClaim (U6)", () => {
    it("fails when the text calls itself STE compliant", () => {
        const claim = run({ events: [text("This text is STE compliant.")] });
        expect(check("noComplianceClaim", claim).passed).toBe(false);
    });

    it("passes for a negated sentence", () => {
        const denial = run({
            events: [text("The text is STE-based, not STE certified.")],
        });
        expect(check("noComplianceClaim", denial).passed).toBe(true);
    });
});

describe("checks of tests 1 to 8", () => {
    it("noHeading fails for a heading in chat text, not in a code block", () => {
        expect(
            check("noHeading", run({ events: [text("```\n# x\n```")] })).passed,
        ).toBe(true);
        expect(
            check("noHeading", run({ events: [text("## Result\nIt works.")] }))
                .passed,
        ).toBe(false);
    });

    it("textMatches finds the pattern in the chat text", () => {
        const value = run({ events: [text("See `src/fetch.ts:10`.")] });
        const args = { pattern: "src/fetch\\.ts:\\d+" };
        expect(check("textMatches", value, args).passed).toBe(true);
        expect(check("textMatches", run({}), args).passed).toBe(false);
    });

    it("notRead fails when a tool call names the path", () => {
        const args = { pattern: "human-communication-policy.md" };
        const read = tool("Read", {
            file_path: "/w/docs/agents/human-communication-policy.md",
        });
        expect(check("notRead", run({ events: [read] }), args).passed).toBe(
            false,
        );
        expect(check("notRead", run({}), args).passed).toBe(true);
    });

    it("codeBlock finds the pattern only inside a code block", () => {
        const args = { pattern: "bun test" };
        expect(
            check(
                "codeBlock",
                run({ events: [text("```sh\nbun test\n```")] }),
                args,
            ).passed,
        ).toBe(true);
        expect(
            check("codeBlock", run({ events: [text("Run `bun test`.")] }), args)
                .passed,
        ).toBe(false);
    });

    it("issuesNamed needs each title with its URL and no bare number", () => {
        const args = {
            issues: [
                {
                    number: 12,
                    title: "Retry fails",
                    url: "https://x/issues/12",
                },
            ],
        };
        expect(
            check(
                "issuesNamed",
                run({ events: [text("[Retry fails](https://x/issues/12)")] }),
                args,
            ).passed,
        ).toBe(true);
        expect(
            check(
                "issuesNamed",
                run({
                    events: [
                        text("Retry fails (https://x/issues/12), see #12."),
                    ],
                }),
                args,
            ).passed,
        ).toBe(false);
    });

    it("documentForm needs a title, a heading, and a list", () => {
        const args = { path: "docs/setup.md" };
        const good = {
            "docs/setup.md": "# Setup\n\n## Install\n\n1. Run it.\n",
        };
        expect(check("documentForm", run({ files: good }), args).passed).toBe(
            true,
        );
        const flat = { "docs/setup.md": "Setup text.\n" };
        expect(check("documentForm", run({ files: flat }), args).passed).toBe(
            false,
        );
    });

    it("fileMatches reads the changed file", () => {
        const files = { "src/fetch.ts": "const MAX_TRIES = 5;\n" };
        const args = { path: "src/fetch.ts", pattern: "MAX_TRIES = 5\\b" };
        expect(check("fileMatches", run({ files }), args).passed).toBe(true);
        expect(check("fileMatches", run({}), args).passed).toBe(false);
    });

    it("proseAvoids ignores the words in code and quoted text", () => {
        const args = { pattern: "\\btasks?\\b", flags: "i" };
        expect(
            check(
                "proseAvoids",
                run({ events: [text('The comment says "task". A Job runs.')] }),
                args,
            ).passed,
        ).toBe(true);
        expect(
            check(
                "proseAvoids",
                run({ events: [text("Each task runs.")] }),
                args,
            ).passed,
        ).toBe(false);
    });
});

describe("checks of tests 9 to 11", () => {
    const TEMPLATE = {
        ".github/pull_request_template.md":
            "## Summary\n\n## Test plan\n\n- [ ] This change should not break the API.\n",
    };

    it("steText does not read the fixed text of a template", () => {
        const files = {
            "pr.md":
                "## Summary\n\nThe retry stops after 5 tries.\n\n## Test plan\n\n- [ ] This change should not break the API.\n",
        };
        expect(
            check("steText", run({ files, templates: TEMPLATE })).passed,
        ).toBe(true);
        expect(check("steText", run({ files })).passed).toBe(false);
    });

    it("keepsTemplate needs each fixed line of the template, in its order", () => {
        const args = {
            path: "pr.md",
            template: ".github/pull_request_template.md",
        };
        const kept = {
            "pr.md":
                "## Summary\n\nThe retry stops later.\n\n## Test plan\n\n- [ ] This change should not break the API.\n- [x] I ran the tests.\n",
        };
        expect(
            check(
                "keepsTemplate",
                run({ files: kept, templates: TEMPLATE }),
                args,
            ),
        ).toEqual({
            passed: true,
            evidence:
                "pr.md keeps the 3 fixed lines of .github/pull_request_template.md.",
        });
        const changed = {
            "pr.md":
                "## Test plan\n\n- [ ] Tests pass.\n\n## Summary\n\nThe retry stops later.\n",
        };
        expect(
            check(
                "keepsTemplate",
                run({ files: changed, templates: TEMPLATE }),
                args,
            ),
        ).toEqual({
            passed: false,
            evidence: [
                "missing or out of order: ## Test plan",
                "missing or out of order: - [ ] This change should not break the API.",
            ].join("\n"),
        });
        expect(
            check("keepsTemplate", run({ templates: TEMPLATE }), args).passed,
        ).toBe(false);
    });

    it("commitMatches needs a new commit, and each new commit matches", () => {
        const args = { pattern: "^fix: \\S.*\\n\\n\\S" };
        const commit = (message: string) => ({
            ...START,
            commits: [{ sha: "b2", message, files: [] }, ...START.commits],
        });
        expect(
            check(
                "commitMatches",
                run({
                    after: commit(
                        "fix: raise the retry limit\n\nThe retry stops after 5 tries.",
                    ),
                }),
                args,
            ).passed,
        ).toBe(true);
        expect(
            check(
                "commitMatches",
                run({ after: commit("Raise the limit") }),
                args,
            ).passed,
        ).toBe(false);
        expect(check("commitMatches", run({}), args).passed).toBe(false);
    });
});
