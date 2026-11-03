import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type {
    ClaudeEvent,
    ToolCall,
} from "../writing/agent-instructions/eval-lib.ts";
import {
    loadOutcome,
    loadResults,
    mainCalls,
    readEvalsIn,
    summarize,
    tokenCount,
} from "./eval-lib.ts";

type Test = { id: number; name: string; assertions: string[] };

describe("readEvalsIn", () => {
    let dir = "";
    afterEach(() => rmSync(dir, { recursive: true, force: true }));

    function write(): void {
        dir = mkdtempSync(join(tmpdir(), "evals-"));
        writeFileSync(
            join(dir, "evals.json"),
            JSON.stringify({
                common_assertions: ["[C1] common"],
                evals: [
                    { id: 1, name: "a", assertions: ["[1.1] own"] },
                    { id: 2, name: "b", assertions: [] },
                    { id: 3, name: "c", assertions: ["[3.1] own"] },
                ],
            }),
        );
    }

    it("puts the common statements before the statements of each test", () => {
        write();
        expect(readEvalsIn(dir, "1")).toEqual([
            { id: 1, name: "a", assertions: ["[C1] common", "[1.1] own"] },
        ]);
    });

    it("reads the tests of the given ids, or all tests with no ids", () => {
        write();
        expect(readEvalsIn<Test>(dir, "1,3").map((ev) => ev.name)).toEqual([
            "a",
            "c",
        ]);
        expect(readEvalsIn<Test>(dir, "").map((ev) => ev.name)).toEqual([
            "a",
            "b",
            "c",
        ]);
    });
});

async function* stream(...items: unknown[]): AsyncGenerator<string> {
    for (const item of items) {
        yield typeof item === "string" ? item : JSON.stringify(item);
    }
}

const toolUse = (
    name: string,
    input: Record<string, unknown>,
    parent?: string,
): ClaudeEvent => ({
    type: "assistant",
    parent_tool_use_id: parent ?? null,
    message: { content: [{ type: "tool_use", name, input }] },
});

// Loads when the agent reads SKILL.md, misses when it edits a file first.
const decide = (calls: ToolCall[]): boolean | null => {
    for (const call of calls) {
        if (call.name === "Read") return true;
        if (call.name === "Edit") return false;
    }
    return null;
};

describe("loadOutcome", () => {
    it("stops at the first decision and keeps the calls of the main agent", async () => {
        const outcome = await loadOutcome(
            stream(
                "not json",
                toolUse("Bash", { command: "git status" }),
                toolUse("Edit", {}, "sub-1"),
                toolUse("Read", { file_path: "SKILL.md" }),
                toolUse("Edit", {}),
            ),
            decide,
        );
        expect(outcome).toEqual({
            hit: true,
            limit: false,
            calls: [
                { name: "Bash", input: { command: "git status" } },
                { name: "Read", input: { file_path: "SKILL.md" } },
            ],
        });
    });

    it("counts no load when the run ends with no decision", async () => {
        const outcome = await loadOutcome(
            stream(toolUse("Bash", { command: "ls" }), { type: "result" }),
            decide,
        );
        expect(outcome.hit).toBe(false);
    });

    it("gives no decision when the stream stops before a result", async () => {
        const outcome = await loadOutcome(
            stream(toolUse("Bash", { command: "ls" })),
            decide,
        );
        expect(outcome.hit).toBeNull();
    });

    it("records a usage limit", async () => {
        const outcome = await loadOutcome(
            stream({ type: "result", result: "You've hit your usage limit" }),
            decide,
        );
        expect(outcome.limit).toBe(true);
    });
});

describe("summarize", () => {
    it("gives the tool name, and for a shell command its first 60 characters", () => {
        expect(summarize({ name: "Read", input: { file_path: "a" } })).toBe(
            "Read",
        );
        expect(
            summarize({ name: "Bash", input: { command: "x".repeat(70) } }),
        ).toBe(`Bash: ${"x".repeat(60)}`);
    });
});

describe("loadResults", () => {
    it("gives the verdict and the first 4 tools of each request", () => {
        const requests = [
            { query: "commit this", should_trigger: true, steps: ["true"] },
            { query: "what time is it", should_trigger: false },
        ];
        const calls = ["a", "b", "c", "d", "e"];
        const outcomes = [
            { hit: true, calls },
            { hit: false, calls: ["a"] },
            { hit: true, calls: ["a"] },
            { hit: false, calls: [] },
        ];
        expect(loadResults(requests, outcomes, 2)).toEqual({
            summary: { correct: 1, total: 2 },
            results: [
                {
                    query: "commit this",
                    should_trigger: true,
                    load_rate: 0.5,
                    correct: true,
                    first_tools: [["a", "b", "c", "d"], ["a"]],
                },
                {
                    query: "what time is it",
                    should_trigger: false,
                    load_rate: 0.5,
                    correct: false,
                    first_tools: [["a"], []],
                },
            ],
        });
    });
});

describe("mainCalls", () => {
    it("gives the tool calls of the main agent only", () => {
        expect(
            mainCalls([
                toolUse("Bash", { command: "ls" }),
                toolUse("Edit", {}, "sub-1"),
                { type: "result" },
            ]),
        ).toEqual([{ name: "Bash", input: { command: "ls" } }]);
    });
});

describe("tokenCount", () => {
    it("adds the input, output, and cache tokens", () => {
        expect(
            tokenCount({
                input_tokens: 1,
                output_tokens: 20,
                cache_read_input_tokens: 300,
                cache_creation_input_tokens: 4000,
                other: 50000,
            }),
        ).toBe(4321);
        expect(tokenCount(undefined)).toBe(0);
    });
});
