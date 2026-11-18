// The script checks of the wtf output tests. A `script` statement of
// evals.json names its check. grade.ts builds the Run of a saved run folder
// and calls the check. `copyProblems` decides if a run counts.

import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";
import type { Verdict } from "../human-communication/assertions.ts";
import {
    changedFiles,
    type GitState,
} from "../human-communication/git-state.ts";

// `messages` are the messages of the copy turns. `rewrite` is the text of
// the main agent in the turn of the call. `before` is the Git state before
// the first turn, and `after` the Git state after the last turn.
export type Run = {
    messages: string[];
    rewrite: string;
    before: GitState;
    after: GitState;
};
export type Check = (run: Run, args: Record<string, unknown>) => Verdict;

export const words = (text: string) => text.split(/\s+/).filter(Boolean);

// A copy turn must reply with the words of its message in the same
// sequence. White space can change, because the word sequence stays the
// same. Gives one problem for each changed message, with the first changed
// word.
export function copyProblems(messages: string[], replies: string[]): string[] {
    return messages.flatMap((message, i) => {
        const want = words(message);
        const got = words(replies[i] ?? "");
        const at = Array.from(
            { length: Math.max(want.length, got.length) },
            (_, n) => n,
        ).find((n) => want[n] !== got[n]);
        if (at === undefined) return [];
        return [
            `Turn ${i + 1} changed the message: '${want[at] ?? ""}' became '${got[at] ?? ""}'.`,
        ];
    });
}

// The text blocks of the main agent, or the final result when the turn has
// no text block.
export function rewriteText(events: ClaudeEvent[]): string {
    const blocks = events
        .filter(
            (event) => event.type === "assistant" && !event.parent_tool_use_id,
        )
        .flatMap((event) =>
            Array.isArray(event.message?.content) ? event.message.content : [],
        )
        .filter((block) => block.type === "text" && block.text?.trim())
        .map((block) => block.text?.trim() ?? "");
    if (blocks.length > 0) return blocks.join("\n\n");
    return events.findLast((event) => event.type === "result")?.result ?? "";
}

const CHANGE_NOTE =
    /\bwhat I changed\b|^\W*changes\b.*:|\bI (changed|shortened|simplified|rewrote|explained)\b/i;
const QUESTION = /\?|\btell me\b/i;
const CHECK =
    /\b(un)?clear|\bmake sense|\bwhich part|\bany (other )?questions|\bdoes this help/i;

const linesWith = (text: string, ...patterns: RegExp[]) =>
    text.split("\n").filter((line) => patterns.every((p) => p.test(line)));

function verdict(problems: string[], ok: string): Verdict {
    return problems.length === 0
        ? { passed: true, evidence: ok }
        : { passed: false, evidence: problems.join("\n") };
}

export const checks: Record<string, Check> = {
    noChangeNote: (run) =>
        verdict(linesWith(run.rewrite, CHANGE_NOTE), "No change note."),
    noCheckQuestion: (run) =>
        verdict(linesWith(run.rewrite, QUESTION, CHECK), "No check question."),
    noChangedFile: (run) => {
        const paths = changedFiles(run.before, run.after);
        return verdict(
            paths.length > 0 ? [`The run changed: ${paths.join(", ")}`] : [],
            "The run changed no file.",
        );
    },
    // Passes when the rewrite has each text of `args.texts` word for word,
    // for example the lines of a diff or a command.
    includesText: (run, args) =>
        verdict(
            (args.texts as string[])
                .filter((text) => !run.rewrite.includes(text))
                .map((text) => `The rewrite does not have: ${text}`),
            "The rewrite has each text.",
        ),
    // Passes when the rewrite has fewer words than message `args.message`,
    // by default the first message.
    shorter: (run, args) => {
        const message = run.messages[Number(args.message ?? 0)] ?? "";
        const [got, want] = [words(run.rewrite).length, words(message).length];
        return verdict(
            got < want
                ? []
                : [
                      `The rewrite has ${got} words. The message has ${want} words.`,
                  ],
            `The rewrite has ${got} words. The message has ${want} words.`,
        );
    },
};
