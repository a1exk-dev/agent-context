// cspell:ignore toolu
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
    completedSession,
    hitUsageLimit,
    isSkillLoad,
    loadVerdict,
    openCodeEnv,
    renderTranscript,
    sessionProblem,
    toolCalls,
    writeTiming,
} from "./eval-lib.ts";

describe("renderTranscript", () => {
    it("renders text, tool calls, tool results, and the final result", () => {
        const events = [
            { type: "system", subtype: "init" },
            {
                type: "assistant",
                parent_tool_use_id: null,
                message: {
                    content: [
                        { type: "text", text: "  Reading the file.\n" },
                        {
                            type: "tool_use",
                            id: "toolu_1",
                            name: "Read",
                            input: { file_path: "AGENTS.md" },
                        },
                    ],
                },
            },
            {
                type: "user",
                parent_tool_use_id: null,
                message: {
                    content: [
                        {
                            type: "tool_result",
                            tool_use_id: "toolu_1",
                            content: "# Project",
                        },
                    ],
                },
            },
            { type: "result", result: "Done." },
        ];
        expect(renderTranscript(events)).toBe(
            [
                "TEXT:\nReading the file.\n",
                'TOOL CALL Read (id toolu_1):\n{\n "file_path": "AGENTS.md"\n}\n',
                "TOOL RESULT (for toolu_1):\n# Project\n",
                "FINAL RESULT:\nDone.\n",
            ].join("\n"),
        );
    });

    it("labels subagent events with the description of their Agent call", () => {
        const events = [
            {
                type: "assistant",
                message: {
                    content: [
                        {
                            type: "tool_use",
                            id: "toolu_a",
                            name: "Agent",
                            input: { description: "loading reviewer" },
                        },
                    ],
                },
            },
            {
                type: "user",
                parent_tool_use_id: "toolu_a",
                message: {
                    content: [
                        {
                            type: "tool_result",
                            tool_use_id: "toolu_b",
                            content: [
                                { type: "text", text: "line 1" },
                                { type: "text", text: "line 2" },
                            ],
                        },
                    ],
                },
            },
        ];
        expect(renderTranscript(events).split("\n\n")[1]).toBe(
            "[subagent loading reviewer] TOOL RESULT (for toolu_b):\nline 1\nline 2\n",
        );
    });
});

describe("isSkillLoad", () => {
    it("counts a Claude Code Skill call for agent-instructions", () => {
        expect(
            isSkillLoad({
                name: "Skill",
                input: { skill: "agent-instructions" },
            }),
        ).toBe(true);
    });

    it("counts an OpenCode skill call for agent-instructions", () => {
        expect(
            isSkillLoad({
                name: "skill",
                input: { name: "agent-instructions" },
            }),
        ).toBe(true);
    });

    it("does not count a Skill call for another Skill", () => {
        expect(isSkillLoad({ name: "Skill", input: { skill: "tdd" } })).toBe(
            false,
        );
    });

    it("counts a read of the Skill's SKILL.md", () => {
        expect(
            isSkillLoad({
                name: "Read",
                input: {
                    file_path:
                        "/tmp/p/.claude/skills/agent-instructions/SKILL.md",
                },
            }),
        ).toBe(true);
        expect(
            isSkillLoad({
                name: "read",
                input: {
                    filePath:
                        "/tmp/p/.claude/skills/agent-instructions/SKILL.md",
                },
            }),
        ).toBe(true);
    });

    it("does not count a read of another file", () => {
        expect(
            isSkillLoad({ name: "Read", input: { file_path: "AGENTS.md" } }),
        ).toBe(false);
    });
});

describe("loadVerdict", () => {
    it("is correct when a should-load request loads in half or more runs", () => {
        expect(loadVerdict([true, false], true)).toEqual({
            load_rate: 0.5,
            correct: true,
        });
    });

    it("is wrong when a should-load request loads in fewer than half", () => {
        expect(loadVerdict([true, false, false], true)).toEqual({
            load_rate: 1 / 3,
            correct: false,
        });
    });

    it("is correct when a should-not-load request loads in fewer than half", () => {
        expect(loadVerdict([false, false, true], false)).toEqual({
            load_rate: 1 / 3,
            correct: true,
        });
    });

    it("is wrong when a should-not-load request loads in half or more", () => {
        expect(loadVerdict([true, false], false)).toEqual({
            load_rate: 0.5,
            correct: false,
        });
    });
});

describe("hitUsageLimit", () => {
    it("detects the usage-limit message in a stream-json result", () => {
        const raw = [
            '{"type":"system","subtype":"init"}',
            '{"type":"result","is_error":true,"result":"You\'ve hit your session limit · resets 9pm"}',
        ].join("\n");
        expect(hitUsageLimit(raw)).toBe(true);
    });

    it("detects the 5-hour limit message", () => {
        const raw =
            '{"type":"result","is_error":true,"result":"You\'ve hit your 5-hour limit · resets 2:40pm (Europe/Warsaw)"}';
        expect(hitUsageLimit(raw)).toBe(true);
    });

    it("passes a run without the message", () => {
        expect(hitUsageLimit('{"type":"result","result":"Done."}')).toBe(false);
    });
});

describe("completedSession", () => {
    const start = { type: "step_start", sessionID: "ses_1", part: {} };
    const toolStep = {
        type: "step_finish",
        sessionID: "ses_1",
        part: { reason: "tool-calls" },
    };
    const stop = {
        type: "step_finish",
        sessionID: "ses_1",
        part: { reason: "stop" },
    };

    it("returns the session ID of a run that stopped and exited 0", () => {
        expect(completedSession([start, toolStep, stop], 0)).toBe("ses_1");
    });

    it("marks a run without a stop step INCOMPLETE", () => {
        expect(completedSession([start, toolStep], 0)).toBeUndefined();
    });

    it("marks a run with a non-zero exit code INCOMPLETE", () => {
        expect(completedSession([start, stop], 1)).toBeUndefined();
    });

    it("marks a run without a session ID INCOMPLETE", () => {
        expect(completedSession([], 0)).toBeUndefined();
    });
});

describe("sessionProblem", () => {
    function session(...assistant: object[]) {
        return {
            info: { id: "ses_1", directory: "/tmp/p" },
            messages: [
                { info: { role: "user" }, parts: [] },
                ...assistant.map((info) => ({
                    info: { role: "assistant", ...info },
                    parts: [],
                })),
            ],
        };
    }

    it("passes a session whose last assistant message stopped", () => {
        expect(
            sessionProblem(
                session({ finish: "tool-calls" }, { finish: "stop" }),
            ),
        ).toBeUndefined();
    });

    it("reports a session whose last assistant message did not stop", () => {
        expect(sessionProblem(session({ finish: "tool-calls" }))).toBe(
            "Incomplete session ses_1: []",
        );
    });

    it("reports a session with an assistant error", () => {
        expect(
            sessionProblem(
                session({ error: { name: "APIError" } }, { finish: "stop" }),
            ),
        ).toBe('Incomplete session ses_1: [{"name":"APIError"}]');
    });

    it("reports a session without assistant messages", () => {
        expect(sessionProblem(session())).toBe("Incomplete session ses_1: []");
    });
});

describe("toolCalls", () => {
    it("reads tool calls from a Claude Code assistant event", () => {
        const event = {
            type: "assistant",
            message: {
                content: [
                    { type: "text", text: "Loading." },
                    {
                        type: "tool_use",
                        id: "toolu_1",
                        name: "Skill",
                        input: { skill: "agent-instructions" },
                    },
                ],
            },
        };
        expect(toolCalls(event)).toEqual([
            { name: "Skill", input: { skill: "agent-instructions" } },
        ]);
    });

    it("reads the tool call from an OpenCode tool_use event", () => {
        const event = {
            type: "tool_use",
            sessionID: "ses_1",
            part: {
                tool: "skill",
                state: {
                    status: "completed",
                    input: { name: "agent-instructions" },
                },
            },
        };
        expect(toolCalls(event)).toEqual([
            { name: "skill", input: { name: "agent-instructions" } },
        ]);
    });

    it("reads no tool calls from other events", () => {
        expect(toolCalls({ type: "result", result: "Done." })).toEqual([]);
    });
});

describe("openCodeEnv", () => {
    function config(env: Record<string, string | undefined>) {
        return JSON.parse(env.OPENCODE_CONFIG_CONTENT ?? "");
    }

    it("denies subagents and forces the Skill when the options ask", () => {
        const env = openCodeEnv("openai/gpt-6-astra", "/work", {
            noSubagents: true,
            forceSkill: true,
        });
        expect(config(env).permission).toEqual({ "*": "allow", task: "deny" });
        expect(config(env).agent.build.prompt).toBe(
            "Use the agent-instructions skill for this task.",
        );
        expect(env.PWD).toBe("/work");
    });

    it("allows subagents and adds no prompt by default", () => {
        const env = openCodeEnv("openai/gpt-6-astra", "/work", {});
        expect(config(env).permission).toEqual({ "*": "allow", task: "allow" });
        expect(config(env).agent.build.prompt).toBe("");
    });
});

describe("writeTiming", () => {
    it("writes the duration fields, then the extra fields, to timing.json", () => {
        const runDir = mkdtempSync(join(tmpdir(), "timing-"));
        writeTiming(runDir, 1234, 12.3456, { work_dir: "/work" });
        expect(
            JSON.parse(readFileSync(join(runDir, "timing.json"), "utf8")),
        ).toEqual({
            total_tokens: 1234,
            duration_ms: 12345,
            total_duration_seconds: 12.3,
            work_dir: "/work",
        });
    });
});
