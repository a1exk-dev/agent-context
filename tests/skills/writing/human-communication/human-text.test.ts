import { describe, expect, it } from "vitest";
import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";
import { humanText, prose, sentences, steProblems } from "./human-text.ts";

const assistant = (
    content: unknown[],
    parent: string | null = null,
): ClaudeEvent =>
    ({
        type: "assistant",
        parent_tool_use_id: parent,
        message: { content },
    }) as ClaudeEvent;

describe("humanText", () => {
    it("takes the text blocks of the main agent and the final message once", () => {
        const events: ClaudeEvent[] = [
            assistant([{ type: "text", text: "Reading the file." }]),
            assistant([{ type: "text", text: "Subagent text." }], "toolu_1"),
            assistant([{ type: "text", text: "The retry stops after 3." }]),
            { type: "result", result: "The retry stops after 3." },
        ];
        expect(
            humanText({ events, questions: [], files: {}, commits: [] }),
        ).toEqual([
            { source: "text", text: "Reading the file." },
            { source: "text", text: "The retry stops after 3." },
        ]);
    });

    it("adds a final message that no text block holds", () => {
        const events: ClaudeEvent[] = [{ type: "result", result: "Done." }];
        expect(
            humanText({ events, questions: [], files: {}, commits: [] }),
        ).toEqual([{ source: "final", text: "Done." }]);
    });

    it("takes each question with its options, the Markdown files, and the commit bodies", () => {
        const questions = [
            {
                questions: [
                    {
                        header: "Q1 of 1",
                        question: "Q1 of 1: Which log level?",
                        options: [
                            {
                                label: "info (Recommended)",
                                description: "Logs each Job.",
                            },
                        ],
                    },
                ],
            },
        ];
        const files = {
            "docs/setup.md": "# Setup\n",
            "src/fetch.ts": "export {};\n",
        };
        const commits = ["fix: retry limit\n\nThe retry stops after 5 tries."];
        expect(humanText({ events: [], questions, files, commits })).toEqual([
            {
                source: "question",
                text: "Q1 of 1: Which log level?\n\ninfo (Recommended): Logs each Job.",
            },
            { source: "file:docs/setup.md", text: "# Setup\n" },
            { source: "commit", text: "The retry stops after 5 tries." },
        ]);
    });

    it("removes each fixed line of a template from the human text", () => {
        const templates = {
            ".github/pull_request_template.md":
                "## Summary\n\n## Test plan\n\n- [ ] This change should not break the API.\n",
        };
        const files = {
            "pr.md":
                "## Summary\n\nThe retry stops after 5 tries.\n\n## Test plan\n\n- [ ] This change should not break the API.\n- [x] I ran the tests.\n",
        };
        expect(
            humanText({
                events: [],
                questions: [],
                files,
                commits: [],
                templates,
            }),
        ).toEqual([
            {
                source: "file:pr.md",
                text: "\n\nThe retry stops after 5 tries.\n\n\n\n\n- [x] I ran the tests.\n",
            },
        ]);
    });
});

describe("prose", () => {
    it("removes code blocks and keeps 1 word for each code span, URL, path, and quoted text", () => {
        const text = [
            "Run `bun test` in src/fetch.ts:12, see https://example.com/a.",
            "",
            "```sh",
            "rm -rf data; echo should",
            "```",
            'The comment says "you should retry".',
        ].join("\n");
        expect(prose(text)).toBe(
            ["Run x in x, see x.", "", "", "The comment says x."].join("\n"),
        );
    });

    it("removes Markdown emphasis marks", () => {
        expect(prose("The **Job** runs _once_.")).toBe("The Job runs once.");
    });
});

describe("sentences", () => {
    it("joins the lines of a paragraph and splits at the end of each sentence", () => {
        expect(
            sentences("The retry waits.\nThen it runs\nagain. It stops."),
        ).toEqual(["The retry waits.", "Then it runs again.", "It stops."]);
    });

    it("gives each list item and table cell as a sentence and skips headings", () => {
        expect(
            sentences(
                "# Title\n\nDo these steps:\n- Open it.\n1. Run it.\n\n| a | b c |\n|---|---|",
            ),
        ).toEqual(["Do these steps:", "Open it.", "Run it.", "a", "b c"]);
    });

    it("counts text in parentheses as 1 word and as its own sentence", () => {
        expect(sentences("The Job (the unit of work) runs.")).toEqual([
            "The Job x runs.",
            "the unit of work",
        ]);
    });
});

describe("steProblems", () => {
    it("finds no problem in STE-based text", () => {
        expect(
            steProblems(
                "CAUTION: Make a backup first. The command deletes data.",
            ),
        ).toEqual([]);
    });

    it("finds each forbidden word, semicolon, long sentence, and capital emphasis", () => {
        const long = Array(26).fill("word").join(" ");
        expect(
            steProblems(
                `You should retry; it may fail. Ensure that it shouldn't stop.\n\n${long}.\n\nIMPORTANT: Do NOT skip it.`,
            ),
        ).toEqual([
            'forbidden word "should": You should retry; it may fail.',
            'forbidden word "may": You should retry; it may fail.',
            "semicolon: You should retry; it may fail.",
            'forbidden word "Ensure": Ensure that it shouldn\'t stop.',
            "forbidden word \"shouldn't\": Ensure that it shouldn't stop.",
            `26 words: ${long}.`,
            'capital emphasis "IMPORTANT": IMPORTANT: Do NOT skip it.',
            'capital emphasis "NOT": IMPORTANT: Do NOT skip it.',
        ]);
    });

    it("ignores the words in code, paths, and quoted text", () => {
        expect(
            steProblems('Run `x; y` and read "it should work" in docs/may.md.'),
        ).toEqual([]);
    });
});
