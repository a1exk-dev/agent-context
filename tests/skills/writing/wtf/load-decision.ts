// The load decisions of the wtf load test, one for each platform. A run
// loads wtf when the platform adds the Skill text for the call of the
// Operator, or when the agent loads the Skill or reads its SKILL.md.

import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";

export const SKILL_NAME = "wtf";
const COMMAND = `<command-name>/${SKILL_NAME}</command-name>`;
const SKILL_FILE = `${SKILL_NAME}/SKILL.md`;

// True when the input of a tool call names the SKILL.md of wtf.
const readsSkillFile = (input: unknown) =>
    JSON.stringify(input ?? "").includes(SKILL_FILE);

const blocks = (event: ClaudeEvent) =>
    Array.isArray(event.message?.content) ? event.message.content : [];

// Claude Code: the events of `claude -p --output-format stream-json
// --replay-user-messages`. Claude Code replays the call of a Skill with the
// command name of the Skill. Claude Code refuses a Skill tool call for a
// Skill with `disable-model-invocation`, so a refused call is no load.
export function claudeLoad(events: ClaudeEvent[]): boolean {
    const refused = new Set(
        events
            .flatMap(blocks)
            .flatMap((block) =>
                block.type === "tool_result" && block.is_error
                    ? [block.tool_use_id]
                    : [],
            ),
    );
    return events.some((event) => {
        const content = event.message?.content;
        if (event.type === "user" && typeof content === "string")
            return content.includes(COMMAND);
        if (event.type !== "assistant") return false;
        return blocks(event).some((block) => {
            if (block.type !== "tool_use") return false;
            if (block.name === "Skill")
                return (
                    block.input?.skill === SKILL_NAME && !refused.has(block.id)
                );
            return readsSkillFile(block.input);
        });
    });
}

// One line of a Codex rollout file.
export type CodexRolloutItem = {
    type?: string;
    payload?: {
        type?: string;
        role?: string;
        content?: { text?: string }[];
    };
};
const CODEX_SKILL = `<skill>\n<name>${SKILL_NAME}</name>`;
const CODEX_CALLS = ["function_call", "custom_tool_call", "local_shell_call"];

// Codex: the rollout file of the run. `codex exec --json` does not show the
// Skill text, but the rollout file does. Codex adds the Skill text for the
// call `$wtf` as a separate user message that starts with a `<skill>` block.
export function codexLoad(items: CodexRolloutItem[]): boolean {
    return items.some(({ type, payload }) => {
        if (type !== "response_item" || !payload) return false;
        if (payload.type === "message" && payload.role === "user")
            return (payload.content ?? []).some((part) =>
                part.text?.startsWith(CODEX_SKILL),
            );
        return CODEX_CALLS.includes(payload.type ?? "")
            ? readsSkillFile(payload)
            : false;
    });
}

// The output of `opencode session export` for OpenCode 2.
export type OpenCodeExport = {
    info: { id: string; outcome?: string };
    messages: {
        type: string;
        skills?: { id: string }[];
        content?: {
            type: string;
            name?: string;
            state?: { input?: Record<string, unknown> };
        }[];
    }[];
};

// OpenCode 2: the exported session of the run. OpenCode attaches the Skill
// of the call `@wtf` to the user message. The skill tool loads any Skill by
// its ID, also a Skill that OpenCode does not list for the model.
export function openCodeLoad(session: OpenCodeExport): boolean {
    return session.messages.some((message) => {
        if (message.type === "user")
            return (message.skills ?? []).some(
                (skill) => skill.id === SKILL_NAME,
            );
        return (message.content ?? []).some((part) => {
            if (part.type !== "tool") return false;
            if (part.name === "skill")
                return part.state?.input?.id === SKILL_NAME;
            return readsSkillFile(part.state?.input);
        });
    });
}
