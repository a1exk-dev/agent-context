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
// file. `questions` has the input of each AskUserQuestion call.
export type Run = {
    events: ClaudeEvent[];
    questions: QuestionCall[];
    files: Record<string, string>;
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

function isSkillLoad(call: ToolCall): boolean {
    if (call.name.toLowerCase() === "skill")
        return String(call.input.skill ?? call.input.name ?? "") === SKILL_NAME;
    const target = `${pathOf(call)} ${String(call.input.command ?? "")}`;
    return target.includes(`${SKILL_NAME}/SKILL.md`);
}

// What a human sees first: a text block, a question, or a document write.
type Step = { load: boolean; seen: string | null };

function steps(events: ClaudeEvent[]): Step[] {
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

// One question that the run asked: in a tool call, `count` is the header.
// In plain text, `count` is the "Q<n> of <total>" at the start of the line.
type Asked = {
    count: string;
    question: string;
    labels: string[];
    tool: boolean;
};

const COUNT = /^Q(\d+) of (\d+)\b/;
const ITEM = /^\s*(?:[-*+]|\d+[.)]|[a-zA-Z][.)])\s+/;
const PART = /^(?:where we are|example|options?)\b/i;

// The questions of a numbered list in plain text. Each line that starts with
// "Q<n> of <total>" starts a question. The list items after it are its
// options, except the items that name a part of the question.
function plainQuestions(text: string): Asked[] {
    const asked: Asked[] = [];
    for (const line of withoutCode(text).split("\n")) {
        const body = line
            .replace(ITEM, "")
            .replace(/^#{1,6}\s+/, "")
            .replace(/\*\*|__/g, "")
            .trim();
        const count = body.match(COUNT)?.[0];
        if (count) {
            asked.push({ count, question: body, labels: [], tool: false });
            continue;
        }
        const current = asked.at(-1);
        if (current && ITEM.test(line) && !PART.test(body))
            current.labels.push(body);
    }
    return asked;
}

// The questions of the tool calls. With no tool call, the questions of the
// numbered lists in the chat text.
function askedQuestions(run: Run): Asked[] {
    const calls = run.questions.flatMap((call) =>
        (call.questions ?? []).map((item) => ({
            count: item.header ?? "",
            question: item.question ?? "",
            labels: (item.options ?? []).map((option) => option.label ?? ""),
            tool: true,
        })),
    );
    return calls.length > 0 ? calls : chat(run).flatMap(plainQuestions);
}

const RECOMMENDED = "(Recommended)";
const recommended = (label: string, tool: boolean) =>
    tool ? label.trimEnd().endsWith(RECOMMENDED) : label.includes(RECOMMENDED);

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

    // Q1: one count for the session. n starts at 1, goes up by 1 for each
    // question, and is never more than its total. In a tool call, the
    // header is the count and the question text starts with it.
    questionCount(run) {
        const asked = askedQuestions(run);
        if (asked.length === 0)
            return verdict(["The run asks no question."], "");
        const problems = asked.flatMap((item, index) => {
            const match = item.count.match(COUNT);
            const want = index + 1;
            if (!match || (item.tool && match[0] !== item.count))
                return [`No count "Q<n> of <total>": ${item.count}`];
            const [, n, total] = match.map(Number);
            const found: string[] = [];
            if (n !== want) found.push(`${item.count}: want Q${want}`);
            if ((total ?? 0) < (n ?? 0))
                found.push(`${item.count}: the total is less than n`);
            if (item.tool && !item.question.startsWith(item.count))
                found.push(
                    `The question text does not start with ${item.count}`,
                );
            return found;
        });
        return verdict(
            problems,
            `${asked.length} questions, counted in order.`,
        );
    },

    // Q2: 2 or more options, and only the first is recommended.
    answerOptions(run) {
        const asked = askedQuestions(run);
        if (asked.length === 0)
            return verdict(["The run asks no question."], "");
        const problems = asked.flatMap(({ count, labels, tool }) => {
            const found: string[] = [];
            if (labels.length < 2)
                found.push(`${count}: ${labels.length} options`);
            if (!recommended(labels[0] ?? "", tool))
                found.push(`${count}: the first option is not recommended`);
            if (labels.slice(1).some((label) => recommended(label, tool)))
                found.push(`${count}: a later option is recommended`);
            return found;
        });
        return verdict(
            problems,
            "Each question has its recommended option first.",
        );
    },

    // Q3: the schema limit of AskUserQuestion.
    toolLimits(run) {
        const problems = run.questions.flatMap((call, index) => {
            const items = call.questions ?? [];
            const found: string[] = [];
            if (items.length < 1 || items.length > 4)
                found.push(`call ${index + 1}: ${items.length} questions`);
            for (const item of items) {
                const options = item.options?.length ?? 0;
                if (options < 2 || options > 4)
                    found.push(
                        `call ${index + 1}, ${item.header}: ${options} options`,
                    );
            }
            return found;
        });
        return verdict(
            problems,
            `${run.questions.length} calls within the limit.`,
        );
    },

    // Q6: with no answered question call, no file that the answer controls
    // changed. These files are `args.paths`, or else `expect.changes`.
    noUnansweredWrite(run, args) {
        if (run.questions.length > 0)
            return verdict([], "The run got answers before it wrote.");
        const controlled = new Set(
            (args.paths as string[] | undefined) ?? run.expect.changes ?? [],
        );
        const problems = changedFiles(run.before, run.after)
            .filter((path) => controlled.has(path))
            .map((path) => `changed with no answer: ${path}`);
        return verdict(problems, "No file changed with no answer.");
    },

    // The headers of each question tool call, in order: `args.calls`. With
    // no `args.calls`, the run must make 1 or more calls.
    questionCalls(run, args) {
        const got = run.questions.map((call) =>
            (call.questions ?? []).map((item) => item.header ?? ""),
        );
        const want = args.calls as string[][] | undefined;
        if (!want)
            return verdict(
                got.length > 0 ? [] : ["The run made no question tool call."],
                `${got.length} question tool calls.`,
            );
        const same = JSON.stringify(got) === JSON.stringify(want);
        return verdict(
            same
                ? []
                : [
                      `calls ${JSON.stringify(got)}, want ${JSON.stringify(want)}`,
                  ],
            `calls ${JSON.stringify(got)}`,
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
};
