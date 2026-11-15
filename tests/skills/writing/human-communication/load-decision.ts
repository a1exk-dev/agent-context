// The load decision of the human-communication load test. A run counts as a
// load when the agent calls the Skill or reads its SKILL.md before its first
// text, its first question, and its first document write, and within its
// first 8 tool calls. Only the main agent counts.

import { mainCalls } from "../../engineering/eval-lib.ts";
import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";
import { isSkillLoad, steps } from "./assertions.ts";

export const MAX_LOAD_CALLS = 8;

// Gives null while the events of the run so far permit both decisions.
export function loadDecision(events: ClaudeEvent[]): boolean | null {
    const list = steps(events);
    const load = list.findIndex((step) => step.load);
    const seen = list.findIndex((step) => step.seen !== null);
    if (seen !== -1 && (load === -1 || seen < load)) return false;
    const calls = mainCalls(events);
    if (load !== -1) return calls.findIndex(isSkillLoad) < MAX_LOAD_CALLS;
    if (calls.length >= MAX_LOAD_CALLS) return false;
    return null;
}
