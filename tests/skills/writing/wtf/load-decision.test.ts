import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { claudeLoad, codexLoad, openCodeLoad } from "./load-decision.ts";

const FIXTURES = join(import.meta.dirname, "fixtures/load");
const jsonLines = (name: string) =>
    readFileSync(join(FIXTURES, name), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

describe("claudeLoad", () => {
    it("is a load when Claude Code runs the /wtf call", () => {
        expect(claudeLoad(jsonLines("claude-call.jsonl"))).toBe(true);
    });

    it("is no load for a plain request", () => {
        expect(claudeLoad(jsonLines("claude-plain.jsonl"))).toBe(false);
    });

    it("is a load when the agent reads SKILL.md", () => {
        expect(claudeLoad(jsonLines("claude-read.jsonl"))).toBe(true);
    });

    it("is no load when Claude Code blocks the Skill tool call", () => {
        expect(claudeLoad(jsonLines("claude-blocked.jsonl"))).toBe(false);
    });

    it("is a load when the Skill tool call succeeds", () => {
        const events = jsonLines("claude-blocked.jsonl");
        const result = events[2].message.content[0];
        result.is_error = false;
        result.content = "Launching skill: wtf";
        expect(claudeLoad(events)).toBe(true);
    });
});

describe("codexLoad", () => {
    it("is a load when Codex adds the Skill text for the $wtf call", () => {
        expect(codexLoad(jsonLines("codex-call.jsonl"))).toBe(true);
    });

    it("is no load for a plain request", () => {
        expect(codexLoad(jsonLines("codex-plain.jsonl"))).toBe(false);
    });

    it("is a load when the agent reads SKILL.md with a shell command", () => {
        expect(codexLoad(jsonLines("codex-read.jsonl"))).toBe(true);
    });
});

describe("openCodeLoad", () => {
    const session = (name: string) =>
        JSON.parse(readFileSync(join(FIXTURES, name), "utf8"));

    it("is a load when OpenCode attaches the Skill of the @wtf call", () => {
        expect(openCodeLoad(session("opencode-call.json"))).toBe(true);
    });

    it("is no load for a plain request", () => {
        expect(openCodeLoad(session("opencode-plain.json"))).toBe(false);
    });

    it("is a load when the agent loads wtf with the skill tool", () => {
        expect(openCodeLoad(session("opencode-skill-tool.json"))).toBe(true);
    });

    it("is a load when the agent reads SKILL.md", () => {
        expect(openCodeLoad(session("opencode-read.json"))).toBe(true);
    });
});
