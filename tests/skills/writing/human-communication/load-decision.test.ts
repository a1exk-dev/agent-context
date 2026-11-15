import { describe, expect, it } from "vitest";
import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";
import { loadDecision } from "./load-decision.ts";

const text = (value: string): ClaudeEvent =>
    ({
        type: "assistant",
        message: { content: [{ type: "text", text: value }] },
    }) as ClaudeEvent;
const tool = (
    name: string,
    input: Record<string, unknown>,
    parent?: string,
): ClaudeEvent =>
    ({
        type: "assistant",
        parent_tool_use_id: parent ?? null,
        message: { content: [{ type: "tool_use", name, input }] },
    }) as ClaudeEvent;
const LOAD = tool("Skill", { skill: "human-communication" });
const READ = tool("Read", { file_path: "/w/src/fetch.ts" });

describe("loadDecision", () => {
    it("is a load when the Skill loads before the first text", () => {
        expect(loadDecision([READ, LOAD, text("The retry stops.")])).toBe(true);
    });

    it("is a load when the agent reads SKILL.md with a shell command", () => {
        const cat = tool("Bash", {
            command: "cat .claude/skills/human-communication/SKILL.md",
        });
        expect(loadDecision([cat])).toBe(true);
    });

    it("is no load when text, a question, or a document write comes first", () => {
        for (const first of [
            text("Let me look."),
            tool("AskUserQuestion", { questions: [] }),
            tool("Write", { file_path: "/w/docs/setup.md", content: "# A" }),
        ]) {
            expect(loadDecision([first])).toBe(false);
        }
    });

    it("is no load when the Skill loads after the first 8 tool calls", () => {
        const eight = Array(8).fill(READ) as ClaudeEvent[];
        expect(loadDecision([...eight, LOAD])).toBe(false);
        expect(loadDecision(eight)).toBe(false);
        expect(loadDecision([...Array(7).fill(READ), LOAD])).toBe(true);
    });

    it("gives no decision while the run has fewer than 8 other tool calls", () => {
        expect(loadDecision([READ, READ])).toBeNull();
    });

    it("counts only the main agent", () => {
        const sub = tool("Write", { file_path: "/w/a.md" }, "task-1");
        expect(loadDecision([sub, LOAD])).toBe(true);
    });
});
