import { describe, expect, it } from "vitest";
import type { GitState } from "../human-communication/git-state.ts";
import { checks, copyProblems, type Run, rewriteText } from "./assertions.ts";

const STATE: GitState = { head: "main", commits: [], status: [], staged: [] };
const MESSAGE = "Round 1 is at group 7 of 14: the reviewers are running.";
const run = (rewrite: string, after = STATE): Run => ({
    messages: [MESSAGE],
    rewrite,
    before: STATE,
    after,
});
const check = (
    name: string,
    rewrite: string,
    after = STATE,
    args: Record<string, unknown> = {},
) =>
    (checks[name] as NonNullable<(typeof checks)[string]>)(
        run(rewrite, after),
        args,
    );

describe("copyProblems", () => {
    it("accepts a reply with the words of the message", () => {
        expect(
            copyProblems(["| A | B |\n|---|---|"], ["| A |  B |\n|---|---|\n"]),
        ).toEqual([]);
    });

    it("reports a reply that changed a word", () => {
        expect(
            copyProblems(["Round 1 is at group 7."], ["Round 1 is at file 7."]),
        ).toEqual(["Turn 1 changed the message: 'group' became 'file'."]);
    });

    it("reports a reply that adds text after the message", () => {
        expect(copyProblems(["Done."], ["Done. Anything else?"])).toEqual([
            "Turn 1 changed the message: '' became 'Anything'.",
        ]);
    });

    it("names the turn of each changed message", () => {
        expect(copyProblems(["A.", "B."], ["A.", "C."])).toEqual([
            "Turn 2 changed the message: 'B.' became 'C.'.",
        ]);
    });
});

describe("rewriteText", () => {
    it("joins the text blocks of the main agent and skips subagents", () => {
        const events = [
            {
                type: "assistant",
                message: { content: [{ type: "text", text: "Where we are." }] },
            },
            {
                type: "assistant",
                parent_tool_use_id: "toolu_1",
                message: { content: [{ type: "text", text: "sub" }] },
            },
            {
                type: "assistant",
                message: { content: [{ type: "text", text: "The rewrite." }] },
            },
            { type: "result", result: "The rewrite." },
        ];
        expect(rewriteText(events)).toBe("Where we are.\n\nThe rewrite.");
    });

    it("uses the final result when the run has no text block", () => {
        expect(rewriteText([{ type: "result", result: "Only this." }])).toBe(
            "Only this.",
        );
    });
});

describe("noChangeNote", () => {
    it("passes a rewrite with no change note", () => {
        expect(
            check("noChangeNote", "Review round 1: 6 of 14 files are done.")
                .passed,
        ).toBe(true);
    });

    it("passes a label that heads the file changes of the message", () => {
        const rewrite =
            "**Changes:**\n- Rename `CONTEXT.md` to `GLOSSARY.md`.\n\nShould I go ahead?";
        expect(check("noChangeNote", rewrite).passed).toBe(true);
    });

    it.each([
        "*What I changed: shorter text, 1 example.*",
        "Changes: I removed the reason about docs/adr/.",
        "I shortened the text and explained 2 terms.",
    ])("fails the change note %j", (note) => {
        const verdict = check("noChangeNote", `The rewrite.\n\n${note}`);
        expect(verdict.passed).toBe(false);
        expect(verdict.evidence).toContain(note.split("\n")[0]);
    });
});

describe("noCheckQuestion", () => {
    it("passes a rewrite that ends with the original question", () => {
        expect(
            check(
                "noCheckQuestion",
                "I will use a new branch. Should I go ahead with that branch?",
            ).passed,
        ).toBe(true);
    });

    it.each([
        "Which part is still not clear?",
        "Is this clearer now?",
        "Does this make sense?",
        "If a part is still not clear, tell me which part.",
        "Do you have any questions?",
    ])("fails the check question %j", (question) => {
        const verdict = check("noCheckQuestion", `The rewrite.\n\n${question}`);
        expect(verdict.passed).toBe(false);
        expect(verdict.evidence).toContain(question);
    });
});

describe("noChangedFile", () => {
    it("passes a run with the same Git state", () => {
        expect(check("noChangedFile", "text").passed).toBe(true);
    });

    it("fails a run that left a new file", () => {
        const verdict = check("noChangedFile", "text", {
            ...STATE,
            status: ["?? notes.md"],
        });
        expect(verdict).toEqual({
            passed: false,
            evidence: "The run changed: notes.md",
        });
    });

    it("fails a run that made a commit", () => {
        const after = {
            ...STATE,
            commits: [{ sha: "abc", message: "docs", files: ["MEMORY.md"] }],
        };
        expect(check("noChangedFile", "text", after).passed).toBe(false);
    });
});

describe("includesText", () => {
    const args = {
        texts: ["+    vi.useFakeTimers();", "for i in $(seq 1 200)"],
    };

    it("passes a rewrite that keeps each text", () => {
        const rewrite =
            "```diff\n+    vi.useFakeTimers();\n```\n\n```sh\nfor i in $(seq 1 200); do x; done\n```";
        expect(check("includesText", rewrite, STATE, args).passed).toBe(true);
    });

    it("fails a rewrite that lost a text", () => {
        expect(
            check("includesText", "for i in $(seq 1 200)", STATE, args),
        ).toEqual({
            passed: false,
            evidence: "The rewrite does not have: +    vi.useFakeTimers();",
        });
    });
});
