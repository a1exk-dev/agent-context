// The script checks of the human-communication output tests. A `script`
// statement of evals.json names its check and gives its `args`. grade.ts
// builds the Run of a saved run folder and calls the check. A later test adds
// a check here only when no check fits with other `args`.

import {
    type ClaudeEvent,
    type ToolCall,
    toolCalls,
} from "../agent-instructions/eval-lib.ts";
import type { Expect } from "./eval-lib.ts";
import { changedFiles, type GitState, newCommits } from "./git-state.ts";
import {
    type HumanPart,
    humanText,
    prose,
    type QuestionCall,
    sentences,
    steProblems,
} from "./human-text.ts";

// The saved files of one run. `files` has the text of each new or changed
// file. `questions` has the input of each AskUserQuestion call. `templates`
// has the text of each template of the test, by path.
export type Run = {
    events: ClaudeEvent[];
    questions: QuestionCall[];
    files: Record<string, string>;
    templates: Record<string, string>;
    before: GitState;
    after: GitState;
    expect: Expect;
};

export type Verdict = { passed: boolean; evidence: string };
export type Check = (run: Run, args: Record<string, unknown>) => Verdict;

function verdict(problems: string[], ok: string): Verdict {
    return problems.length === 0
        ? { passed: true, evidence: ok }
        : { passed: false, evidence: problems.join("\n") };
}

const human = (run: Run): HumanPart[] =>
    humanText({
        events: run.events,
        questions: run.questions,
        files: run.files,
        commits: newCommits(run.before, run.after).map((c) => c.message),
        templates: run.templates,
    });

// The chat text: the text blocks of the main agent and the final message.
const chat = (run: Run): string[] =>
    human(run)
        .filter((part) => part.source === "text" || part.source === "final")
        .map((part) => part.text);

const regex = (args: Record<string, unknown>) =>
    new RegExp(String(args.pattern), String(args.flags ?? ""));

const SKILL_NAME = "human-communication";
const WRITES = new Set(["write", "edit", "multiedit", "notebookedit"]);
const DOCUMENT = /\.(md|mdx|markdown|txt)$/i;

const pathOf = (call: ToolCall) =>
    String(
        call.input.file_path ?? call.input.filePath ?? call.input.path ?? "",
    );

export function isSkillLoad(call: ToolCall): boolean {
    if (call.name.toLowerCase() === "skill")
        return String(call.input.skill ?? call.input.name ?? "") === SKILL_NAME;
    const target = `${pathOf(call)} ${String(call.input.command ?? "")}`;
    return target.includes(`${SKILL_NAME}/SKILL.md`);
}

// What a human sees first: a text block, a question, or a document write.
type Step = { load: boolean; seen: string | null };

export function steps(events: ClaudeEvent[]): Step[] {
    return events
        .filter(
            (event) => event.type === "assistant" && !event.parent_tool_use_id,
        )
        .flatMap((event) => {
            const content = event.message?.content;
            return (Array.isArray(content) ? content : []).flatMap(
                (block): Step[] => {
                    if (block.type === "text" && block.text?.trim())
                        return [{ load: false, seen: "text" }];
                    const [call] = toolCalls({
                        type: "assistant",
                        message: { content: [block] },
                    });
                    if (!call) return [];
                    if (isSkillLoad(call)) return [{ load: true, seen: null }];
                    if (call.name === "AskUserQuestion")
                        return [{ load: false, seen: "AskUserQuestion call" }];
                    if (
                        WRITES.has(call.name.toLowerCase()) &&
                        DOCUMENT.test(pathOf(call))
                    )
                        return [
                            { load: false, seen: `write to ${pathOf(call)}` },
                        ];
                    return [];
                },
            );
        });
}

const mainCalls = (events: ClaudeEvent[]) =>
    events.filter((event) => !event.parent_tool_use_id).flatMap(toolCalls);

// Fenced code blocks of Markdown text, each with its info string.
function codeBlocks(text: string): { lang: string; body: string }[] {
    return [
        ...text.matchAll(/^ {0,3}(```|~~~)([^\n]*)\n([\s\S]*?)^ {0,3}\1/gm),
    ].map((match) => ({ lang: (match[2] ?? "").trim(), body: match[3] ?? "" }));
}

const withoutCode = (text: string) =>
    text.replace(/^ {0,3}(```|~~~)[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm, "");

export const checks: Record<string, Check> = {
    skillLoadedFirst(run) {
        const list = steps(run.events);
        const load = list.findIndex((step) => step.load);
        const first = list.findIndex((step) => step.seen !== null);
        if (load === -1) return verdict(["The Skill never loaded."], "");
        if (first !== -1 && first < load)
            return verdict(
                [`The ${list[first]?.seen} came before the Skill loaded.`],
                "",
            );
        return verdict([], "The Skill loaded first.");
    },

    steText(run) {
        const parts = human(run);
        const problems = parts.flatMap((part) =>
            steProblems(part.text).map(
                (problem) => `${part.source}: ${problem}`,
            ),
        );
        return verdict(problems, `No problem in ${parts.length} human texts.`);
    },

    onlyRequestedChanges(run) {
        const allowed = new Set(run.expect.changes ?? []);
        const problems = changedFiles(run.before, run.after)
            .filter((path) => !allowed.has(path))
            .map((path) => `changed: ${path}`);
        const staged = new Set(run.before.staged);
        for (const path of run.after.staged)
            if (!staged.has(path)) problems.push(`staged: ${path}`);
        const commits = newCommits(run.before, run.after).length;
        if (commits !== (run.expect.commits ?? 0))
            problems.push(`${commits} new commits`);
        return verdict(problems, "Only the requested files changed.");
    },

    noComplianceClaim(run) {
        const problems = human(run).flatMap((part) =>
            sentences(part.text).filter(
                (sentence) =>
                    /\bSTE\b[\s-]*(compliant|certified)/i.test(sentence) &&
                    !/\b(not|never|no)\b/i.test(sentence),
            ),
        );
        return verdict(problems, "No compliance claim.");
    },

    noHeading(run) {
        const problems = chat(run).flatMap((text) =>
            withoutCode(text)
                .split("\n")
                .filter((line) => /^ {0,3}#{1,6}\s/.test(line)),
        );
        return verdict(problems, "No heading in the chat text.");
    },

    textMatches(run, args) {
        const found = chat(run).some((text) => regex(args).test(text));
        return verdict(
            found ? [] : [`No chat text matches /${String(args.pattern)}/.`],
            `The chat text matches /${String(args.pattern)}/.`,
        );
    },

    notRead(run, args) {
        const pattern = String(args.pattern);
        const problems = mainCalls(run.events)
            .filter((call) => JSON.stringify(call.input).includes(pattern))
            .map(
                (call) =>
                    `${call.name}: ${JSON.stringify(call.input).slice(0, 200)}`,
            );
        return verdict(problems, `No tool call names ${pattern}.`);
    },

    codeBlock(run, args) {
        const found = chat(run).some((text) =>
            codeBlocks(text).some((block) => regex(args).test(block.body)),
        );
        return verdict(
            found ? [] : [`No code block matches /${String(args.pattern)}/.`],
            `A code block matches /${String(args.pattern)}/.`,
        );
    },

    issuesNamed(run, args) {
        const text = chat(run).join("\n\n");
        const issues = args.issues as {
            number: number;
            title: string;
            url: string;
        }[];
        const problems = issues.flatMap((issue) => [
            ...(text.includes(issue.title) ? [] : [`no title: ${issue.title}`]),
            ...(text.includes(issue.url) ? [] : [`no URL: ${issue.url}`]),
        ]);
        const bare = text
            .replace(/https?:\/\/\S+/g, "")
            .match(/(?<![\w/&])#\d+\b/g);
        for (const number of bare ?? [])
            problems.push(`bare number: ${number}`);
        return verdict(problems, "Each issue has its title and URL.");
    },

    documentForm(run, args) {
        const path = String(args.path);
        const text = run.files[path];
        if (text === undefined) return verdict([`${path} is missing.`], "");
        const lines = withoutCode(text).split("\n");
        const problems: string[] = [];
        if (!/^# \S/.test(lines.find((line) => line.trim()) ?? ""))
            problems.push("The first line is not a title.");
        if (!lines.some((line) => /^##+ \S/.test(line)))
            problems.push("No `##` heading.");
        if (!lines.some((line) => /^\s*(?:[-*+]|\d+[.)])\s+\S/.test(line)))
            problems.push("No list.");
        return verdict(problems, `${path} has a title, headings, and a list.`);
    },

    fileMatches(run, args) {
        const path = String(args.path);
        const found = regex(args).test(run.files[path] ?? "");
        return verdict(
            found ? [] : [`${path} does not match /${String(args.pattern)}/.`],
            `${path} matches /${String(args.pattern)}/.`,
        );
    },

    proseAvoids(run, args) {
        const problems = human(run).flatMap((part) =>
            sentences(prose(part.text))
                .filter((sentence) => regex(args).test(sentence))
                .map((sentence) => `${part.source}: ${sentence}`),
        );
        return verdict(problems, `No prose matches /${String(args.pattern)}/.`);
    },

    keepsTemplate(run, args) {
        const path = String(args.path);
        const template = String(args.template);
        const text = run.files[path];
        if (text === undefined) return verdict([`${path} is missing.`], "");
        const fixed = (run.templates[template] ?? "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        const lines = text.split("\n").map((line) => line.trim());
        let next = 0;
        const problems: string[] = [];
        for (const line of fixed) {
            const found = lines.indexOf(line, next);
            if (found === -1) problems.push(`missing or out of order: ${line}`);
            else next = found + 1;
        }
        return verdict(
            problems,
            `${path} keeps the ${fixed.length} fixed lines of ${template}.`,
        );
    },

    commitMatches(run, args) {
        const commits = newCommits(run.before, run.after);
        const problems = commits
            .filter((commit) => !regex(args).test(commit.message))
            .map((commit) => `no match: ${commit.message}`);
        if (commits.length === 0) problems.push("No new commit.");
        return verdict(
            problems,
            `Each new commit matches /${String(args.pattern)}/.`,
        );
    },
};
