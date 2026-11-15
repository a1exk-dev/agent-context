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

const ask = (...headers: string[]) => ({
    questions: headers.map((header) => ({
        header,
        question: `${header}: Which value?`,
        options: [
            { label: "a (Recommended)", description: "Effect a." },
            { label: "b", description: "Effect b." },
        ],
    })),
});

describe("questionCount (Q1)", () => {
    it("passes when the counts of the tool calls go up by 1 from Q1", () => {
        const questions = [ask("Q1 of 1"), ask("Q2 of 2", "Q3 of 3")];
        expect(check("questionCount", run({ questions })).passed).toBe(true);
    });

    it("fails when n goes back or skips, or a question has no count", () => {
        const noText = ask("Q1 of 1");
        const first = noText.questions[0] as { question: string };
        first.question = "Which value?";
        for (const questions of [
            [ask("Q1 of 2", "Q2 of 2"), ask("Q2 of 3")],
            [ask("Q1 of 3", "Q3 of 3")],
            [ask("Q2 of 2")],
            [ask("Logging")],
            [noText],
        ]) {
            expect(check("questionCount", run({ questions })).passed).toBe(
                false,
            );
        }
    });

    it("reads the counts of a numbered list in plain text", () => {
        const list = [
            "1. **Q1 of 2** Which level?",
            "   - info (Recommended): fewer lines.",
            "   - debug: more lines.",
            "2. **Q2 of 2** Which path?",
        ].join("\n");
        expect(
            check("questionCount", run({ events: [text(list)] })).passed,
        ).toBe(true);
        const back = list.replace("Q2 of 2", "Q1 of 2");
        expect(
            check("questionCount", run({ events: [text(back)] })).passed,
        ).toBe(false);
    });

    it("fails when the run asks no question", () => {
        expect(check("questionCount", run({})).passed).toBe(false);
    });
});

describe("a failed question call", () => {
    const ERROR = "request_user_input is unavailable in Default mode";
    const failed = { ...ask("Q1 of 2", "Q2 of 2"), error: ERROR };
    const list = [
        "1. Q1 of 2 Which level?",
        "   - info (Recommended): fewer lines.",
        "   - debug: more lines.",
        "2. Q2 of 2 Which path?",
        "   - logs/app.log (Recommended): one file.",
        "   - stdout: no file.",
    ].join("\n");
    const retry = run({ questions: [failed], events: [text(list)] });

    it("counts as no question, so Q1 and Q2 read the plain-text retry", () => {
        expect(check("questionCount", retry).passed).toBe(true);
        expect(check("answerOptions", retry).passed).toBe(true);
        const back = list.replace("Q2 of 2", "Q1 of 2");
        expect(
            check(
                "questionCount",
                run({ questions: [failed], events: [text(back)] }),
            ).passed,
        ).toBe(false);
    });

    it("gives no answer, so Q6 fails when a file that the answer controls changed", () => {
        const after: GitState = { ...START, status: ["?? config/logger.json"] };
        const changed = run({
            questions: [failed],
            after,
            expect: { changes: ["config/logger.json"] },
        });
        expect(check("noUnansweredWrite", changed).passed).toBe(false);
    });
});

describe("listedQuestions", () => {
    const counts = ["Q1 of 2", "Q2 of 2"];
    const list = [
        "Two questions before I write config/logger.json.",
        "",
        "1. Q1 of 2 Which level?",
        "   Where we are: the logger is new.",
        "   - info (Recommended): fewer lines.",
        "   - debug: more lines.",
        "2. Q2 of 2 Which path?",
        "   - logs/app.log (Recommended): one file.",
        "   - stdout: no file.",
    ].join("\n");
    const bare = "1. Q1 of 2 Which level?\n2. Q2 of 2 Which path?";

    it("passes when one chat message lists the questions with these counts in order", () => {
        expect(
            check("listedQuestions", run({ events: [text(list)] }), { counts })
                .passed,
        ).toBe(true);
    });

    it("fails when the questions are in 2 messages, or a count is missing", () => {
        const [first, second] = list.split("2. Q2");
        for (const events of [
            [text(first ?? ""), text(`2. Q2${second}`)],
            [text(list.replace("2. Q2 of 2 Which path?", ""))],
        ])
            expect(
                check("listedQuestions", run({ events }), { counts }).passed,
            ).toBe(false);
    });

    it("fails when an answered question tool call asked the questions", () => {
        const value = run({
            events: [text(list)],
            questions: [ask(...counts)],
        });
        expect(check("listedQuestions", value, { counts }).passed).toBe(false);
    });

    it("with options off, passes only when no question has options", () => {
        const args = { counts, options: false };
        expect(
            check("listedQuestions", run({ events: [text(bare)] }), args)
                .passed,
        ).toBe(true);
        expect(
            check("listedQuestions", run({ events: [text(list)] }), args)
                .passed,
        ).toBe(false);
    });
});

describe("noQuestionCount", () => {
    const topic = (header: string, question: string) => ({
        questions: [
            {
                header,
                question,
                options: [{ label: "a (Recommended)" }, { label: "b" }],
            },
        ],
    });

    it("passes when each header is a topic name and no text has a count", () => {
        const questions = [topic("Log level", "Which log level?")];
        expect(check("noQuestionCount", run({ questions })).passed).toBe(true);
    });

    it("fails with a count in a header, a question, or the chat text, or with no header", () => {
        for (const value of [
            run({ questions: [topic("Q1 of 1", "Which log level?")] }),
            run({ questions: [topic("Log level", "Q1 of 1: Which level?")] }),
            run({ questions: [topic("", "Which log level?")] }),
            run({ events: [text("Q1 of 3 Which log level?")] }),
        ])
            expect(check("noQuestionCount", value).passed).toBe(false);
    });
});

describe("noQuestion", () => {
    it("passes when the run asks no question", () => {
        expect(
            check("noQuestion", run({ events: [text("I wrote the file.")] }))
                .passed,
        ).toBe(true);
    });

    it("fails with a question tool call or a counted question in the chat text", () => {
        for (const value of [
            run({ events: [tool("AskUserQuestion", { questions: [] })] }),
            run({ questions: [ask("Q1 of 1")] }),
            run({ events: [text("1. Q1 of 1 Which log level?")] }),
        ])
            expect(check("noQuestion", value).passed).toBe(false);
    });
});

describe("answerOptions (Q2)", () => {
    it("passes when each question has 2 or more options and only the first is recommended", () => {
        const questions = [ask("Q1 of 2", "Q2 of 2")];
        expect(check("answerOptions", run({ questions })).passed).toBe(true);
    });

    it("fails with 1 option, a late recommended option, or 2 recommended options", () => {
        const one = ask("Q1 of 1");
        one.questions[0]?.options.pop();
        const late = ask("Q1 of 1");
        late.questions[0]?.options.reverse();
        const two = ask("Q1 of 1");
        const second = two.questions[0]?.options[1] as { label: string };
        second.label = "b (Recommended)";
        for (const call of [one, late, two])
            expect(
                check("answerOptions", run({ questions: [call] })).passed,
            ).toBe(false);
    });

    it("reads the options of a numbered list in plain text", () => {
        const list = [
            "1. Q1 of 1 Which level?",
            "   - info (Recommended): fewer lines.",
            "   - debug: more lines.",
        ].join("\n");
        expect(
            check("answerOptions", run({ events: [text(list)] })).passed,
        ).toBe(true);
        const late = `${list.replace(" (Recommended)", "")} (Recommended)`;
        expect(
            check("answerOptions", run({ events: [text(late)] })).passed,
        ).toBe(false);
    });
});

describe("toolLimits (Q3)", () => {
    it("passes with at most 4 questions of 2 to 4 options each", () => {
        const questions = [ask("Q1 of 4", "Q2 of 4", "Q3 of 4", "Q4 of 4")];
        expect(check("toolLimits", run({ questions })).passed).toBe(true);
    });

    it("fails with 5 questions or with 1 option", () => {
        const one = ask("Q1 of 1");
        one.questions[0]?.options.pop();
        for (const call of [ask("1", "2", "3", "4", "5"), one])
            expect(check("toolLimits", run({ questions: [call] })).passed).toBe(
                false,
            );
    });
});

describe("noUnansweredWrite (Q6)", () => {
    const after: GitState = { ...START, status: ["?? config/logger.json"] };
    const logger = { changes: ["config/logger.json"] };

    it("fails when a file that the answer controls changed with no answered question", () => {
        expect(
            check("noUnansweredWrite", run({ after, expect: logger })).passed,
        ).toBe(false);
    });

    it("passes after an answered question, or when nothing changed", () => {
        const questions = [ask("Q1 of 1")];
        expect(
            check(
                "noUnansweredWrite",
                run({ after, expect: logger, questions }),
            ).passed,
        ).toBe(true);
        expect(check("noUnansweredWrite", run({ expect: logger })).passed).toBe(
            true,
        );
    });
});

describe("questionCalls", () => {
    it("passes when the headers of each call match in order", () => {
        const questions = [ask("Q1 of 1"), ask("Q2 of 2")];
        const args = { calls: [["Q1 of 1"], ["Q2 of 2"]] };
        expect(check("questionCalls", run({ questions }), args).passed).toBe(
            true,
        );
    });

    it("fails when the questions are in other calls", () => {
        const questions = [ask("Q1 of 2", "Q2 of 2")];
        const args = { calls: [["Q1 of 2"], ["Q2 of 2"]] };
        expect(check("questionCalls", run({ questions }), args).passed).toBe(
            false,
        );
    });

    it("with `sizes`, passes when the number of questions of each call matches", () => {
        const questions = [ask("A", "B", "C")];
        expect(
            check("questionCalls", run({ questions }), { sizes: [3] }).passed,
        ).toBe(true);
        expect(
            check("questionCalls", run({ questions }), { sizes: [1, 1, 1] })
                .passed,
        ).toBe(false);
    });

    it("with no headers, passes when the run made 1 or more calls", () => {
        expect(check("questionCalls", run({})).passed).toBe(false);
        const questions = [ask("Q1 of 1")];
        expect(check("questionCalls", run({ questions })).passed).toBe(true);
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
