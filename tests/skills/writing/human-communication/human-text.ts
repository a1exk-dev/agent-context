// The human text of one run of the human-communication output tests, and the
// STE-based word and sentence checks of statement U2. The functions are pure,
// so vitest tests them without a run.

// cspell:ignore bensur

import type { ClaudeEvent } from "../agent-instructions/eval-lib.ts";

// The input of one AskUserQuestion call, as the question host saves it in
// outputs/questions.jsonl.
export type QuestionCall = {
    questions?: {
        header?: string;
        question?: string;
        options?: { label?: string; description?: string }[];
    }[];
};

export type HumanSource = {
    events: ClaudeEvent[];
    questions: QuestionCall[];
    // The new or changed files of the run, by path.
    files: Record<string, string>;
    // The full message of each new commit.
    commits: string[];
};

export type HumanPart = { source: string; text: string };

const DOCUMENT = /\.(md|mdx|markdown|txt)$/i;

// Each text that a human reads in a run: the text blocks of the main agent,
// the final message when no text block holds it, each question with its
// options, each new or changed document, and the body of each new commit.
export function humanText(run: HumanSource): HumanPart[] {
    const parts: HumanPart[] = [];
    for (const event of run.events) {
        if (event.type !== "assistant" || event.parent_tool_use_id) continue;
        const content = event.message?.content;
        for (const block of Array.isArray(content) ? content : []) {
            const text = block.type === "text" ? block.text?.trim() : "";
            if (text) parts.push({ source: "text", text });
        }
    }
    const final = run.events
        .findLast((event) => event.type === "result")
        ?.result?.trim();
    if (final && !parts.some((part) => part.text === final)) {
        parts.push({ source: "final", text: final });
    }
    for (const call of run.questions) {
        for (const item of call.questions ?? []) {
            const options = (item.options ?? []).map(
                (option) =>
                    `${option.label ?? ""}: ${option.description ?? ""}`,
            );
            parts.push({
                source: "question",
                text: [item.question ?? "", options.join("\n")].join("\n\n"),
            });
        }
    }
    for (const [path, text] of Object.entries(run.files)) {
        if (DOCUMENT.test(path)) parts.push({ source: `file:${path}`, text });
    }
    for (const message of run.commits) {
        const body = message.split("\n").slice(1).join("\n").trim();
        if (body) parts.push({ source: "commit", text: body });
    }
    return parts;
}

const PLACEHOLDER = "x";

// The text with no code block, and with 1 word in place of each code span,
// URL, quoted text, and path. The STE-based rules do not apply to these
// items, and each counts as 1 word.
export function prose(text: string): string {
    return text
        .replace(/^ {0,3}(```|~~~)[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm, "")
        .replace(/`[^`\n]+`/g, PLACEHOLDER)
        .replace(/https?:\/\/[^\s<>()]*[^\s<>().,:;!?'"]/g, PLACEHOLDER)
        .replace(/"[^"\n]*"|“[^”\n]*”/g, PLACEHOLDER)
        .replace(/(?:[\w.-]+\/)+(?:[\w.-]*\w)?(?::\d+)?/g, PLACEHOLDER)
        .replace(
            /\b[\w-]+\.(?:md|ts|js|tsx|jsx|json|ya?ml|toml|sh|py|txt)(?::\d+)?\b/g,
            PLACEHOLDER,
        )
        .replace(/\*\*|__/g, "")
        .replace(/(?<!\w)[*_](?=\w)|(?<=\w)[*_](?!\w)/g, "");
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;

// The sentences of prose text. A heading is not a sentence. Each list item
// and table cell starts a new sentence, and the lines of a paragraph join.
// Text in parentheses counts as 1 word and is also a sentence of its own.
export function sentences(text: string): string[] {
    const units: string[] = [];
    let open = false;
    for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || /^#{1,6}\s/.test(trimmed)) {
            open = false;
            continue;
        }
        if (trimmed.startsWith("|")) {
            units.push(
                ...trimmed
                    .split("|")
                    .map((cell) => cell.trim())
                    .filter((cell) => cell && !/^:?-+:?$/.test(cell)),
            );
            open = false;
            continue;
        }
        const item = LIST_ITEM.test(line) || trimmed.startsWith(">");
        const body = trimmed.replace(LIST_ITEM, "").replace(/^>\s?/, "");
        if (open && !item) units[units.length - 1] += ` ${body}`;
        else units.push(body);
        open = true;
    }
    return units.flatMap((unit) => {
        const inner: string[] = [];
        const outer = unit.replace(/\(([^()]*)\)/g, (_, text: string) => {
            inner.push(text.trim());
            return PLACEHOLDER;
        });
        return [...outer.split(/(?<=[.!?])\s+/), ...inner].filter(Boolean);
    });
}

const FORBIDDEN =
    /\b(?:should|would|could|might|may|shall)(?:n[’']t)?(?![\w’'])|\bensur(?:e|es|ed|ing)\b/gi;
const EMPHASIS = new Set([
    "IMPORTANT",
    "CRITICAL",
    "MUST",
    "NEVER",
    "ALWAYS",
    "SHOULD",
    "MAY",
    "NOTE",
    "WARNING",
    "NOT",
    "DO",
    "ONLY",
    "NO",
]);
const MAX_WORDS = 25;

const wordCount = (sentence: string) =>
    sentence.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

// The problems of English human text for statement U2: a forbidden modal
// word or "ensure", a semicolon, a sentence of more than 25 words, and a
// word in capital letters for emphasis. CAUTION is permitted.
export function steProblems(text: string): string[] {
    return sentences(prose(text)).flatMap((sentence) => {
        const problems = [...sentence.matchAll(FORBIDDEN)].map(
            ([word]) => `forbidden word "${word}": ${sentence}`,
        );
        if (sentence.includes(";")) problems.push(`semicolon: ${sentence}`);
        const words = wordCount(sentence);
        if (words > MAX_WORDS) problems.push(`${words} words: ${sentence}`);
        for (const [word] of sentence.matchAll(/\b[A-Z]{2,}\b/g)) {
            if (EMPHASIS.has(word))
                problems.push(`capital emphasis "${word}": ${sentence}`);
        }
        return problems;
    });
}
