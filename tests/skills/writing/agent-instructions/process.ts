// The process statements [1], [2], [3a], [3c], and [4] of the output tests.
// They sort the subagents of a run into the checks of review.md by the class
// line of each prompt, put the checks into rounds, and examine the sequence
// of starts, reports, report-form runs, and file changes.

import { basename } from "node:path";
import type { MainCall, Run, Verdict } from "./assertions.ts";
import type { ToolCall } from "./eval-lib.ts";

type Kind = "review" | "reader";

const REVIEWERS = [
    "loading reviewer",
    "ASD-STE100 reviewer",
    "ISO 24495-1 reviewer",
];
const CLASSES = [...REVIEWERS, "confirmer", "reader"];

// One check of a round: a subagent, or a report that the main agent saved
// itself as "When no subagent is available" tells. A saved report has no
// message and gives its round number in its title.
type Check = {
    class: string;
    file: string | null;
    key: string;
    start: number;
    end: number;
    failed: boolean;
    message: string | null;
    type: string;
    task: string;
    report: string;
    calls: ToolCall[];
    round?: number;
};

type Round = { kind: Kind; number: number; checks: Check[] };

type Process = {
    review: Round[];
    reader: Round[];
    unclassified: string[];
    checks: Check[];
    calls: MainCall[];
};

const CLASS_LINE = /^\s*(?:<[^>]*>\s*)?Check class: (.+?)\s*$/gm;
const FILE_LINE = /^\s*(?:File under review|Instruction file): (.+?)\s*$/m;
const TASK_LINE = /^\s*Task: (.+?)\s*$/m;
const REVIEW_TITLE = /Round (\d+): (loading|ASD-STE100|ISO 24495-1) review/gi;
const READER_TITLE =
    /Reader-test round (\d+), ([^,\n]+), reader task ([123])/gi;
const WRITE_TOOLS = [
    "write",
    "edit",
    "multiedit",
    "notebookedit",
    "apply_patch",
    "patch",
];

// The class of a prompt, or null when the prompt has no class line of
// review.md or more than one.
function classOf(prompt: string): string | null {
    const names = new Set(
        [...prompt.matchAll(CLASS_LINE)].map((match) => match[1]),
    );
    const [name] = names;
    return names.size === 1 && CLASSES.includes(name) ? name : null;
}

// A path relative to the project folder of the run.
function local(run: Run, path: string): string {
    const plain = path.replace(/^["'`]+|["'`]+$/g, "");
    return run.workDir && plain.startsWith(`${run.workDir}/`)
        ? plain.slice(run.workDir.length + 1)
        : plain;
}

const label = (round: Round) =>
    `${round.kind === "review" ? "Review round" : "Reader-test round"} ${round.number}`;

const isBash = (call: ToolCall) => call.name.toLowerCase() === "bash";
const command = (call: ToolCall) => String(call.input.command ?? "");

function subagentChecks(run: Run, unclassified: string[]): Check[] {
    return run.subagents.flatMap((agent) => {
        const name = classOf(agent.prompt);
        if (!name) {
            const first = agent.prompt.trim().split("\n")[0];
            unclassified.push(
                `The subagent "${first}" has no class line of review.md.`,
            );
            return [];
        }
        const path = FILE_LINE.exec(agent.prompt)?.[1];
        const file = path ? local(run, path) : null;
        const task = TASK_LINE.exec(agent.prompt)?.[1] ?? "";
        return [
            {
                ...agent,
                class: name,
                file,
                task,
                key: `${file} ${name === "reader" ? task : name}`,
            },
        ];
    });
}

// The reports that the main agent saved itself, each in one tool call.
function savedChecks(run: Run): Check[] {
    return run.messages.flatMap((message) =>
        message.calls.flatMap((call) => {
            if (["agent", "task"].includes(call.name.toLowerCase())) return [];
            const input = JSON.stringify(call.input);
            const titles = [
                ...input.matchAll(REVIEW_TITLE),
                ...input.matchAll(READER_TITLE),
            ];
            if (titles.length !== 1) return [];
            const [, round, name, task] = titles[0];
            const reviewer = REVIEWERS.find((item) =>
                item.toLowerCase().startsWith(name.toLowerCase()),
            );
            const report = String(
                call.input.content ?? call.input.command ?? input,
            );
            return [
                {
                    class: task === undefined ? (reviewer ?? "") : "reader",
                    file: null,
                    key: `saved ${name} ${task}`,
                    start: call.at,
                    end: call.at,
                    failed: false,
                    message: null,
                    type: "",
                    task: task ?? "",
                    report,
                    calls: [],
                    round: Number(round),
                },
            ];
        }),
    );
}

// Puts the checks of the run into review rounds and reader-test rounds. A
// reviewer or reader check starts a new round when the current round is of
// the other kind, or already has a check with the same file and reviewer or
// task that did not fail. A confirmer is a check of the current round.
function findRounds(run: Run): Process {
    const unclassified: string[] = [];
    const checks = [...subagentChecks(run, unclassified), ...savedChecks(run)];
    checks.sort((a, b) => a.start - b.start);
    const rounds: Record<Kind, Round[]> = { review: [], reader: [] };
    let current: Round | undefined;
    for (const check of checks) {
        if (check.class === "confirmer") {
            if (current) current.checks.push(check);
            else
                unclassified.push("A confirmer starts before the first round.");
            continue;
        }
        const kind: Kind = check.class === "reader" ? "reader" : "review";
        const list = rounds[kind];
        if (check.round !== undefined) {
            while (list.length < check.round)
                list.push({ kind, number: list.length + 1, checks: [] });
            current = list[check.round - 1];
        } else if (
            current?.kind !== kind ||
            current.checks.some(
                (item) => item.key === check.key && !item.failed,
            )
        ) {
            current = { kind, number: list.length + 1, checks: [] };
            list.push(current);
        }
        current.checks.push(check);
    }
    return {
        ...rounds,
        unclassified,
        checks,
        calls: run.messages.flatMap((message) => message.calls),
    };
}

const subagentsOf = (round: Round) =>
    round.checks.filter((check) => check.message !== null);
const mainChecks = (round: Round) =>
    round.checks.filter((check) => check.class !== "confirmer");
const roundStart = (round: Round) =>
    Math.min(...round.checks.map((check) => check.start));
const roundEnd = (round: Round) =>
    Math.max(...round.checks.map((check) => check.end));

// The files of a round. A round with saved reports also examines each
// Markdown file that the run changed.
function roundFiles(run: Run, round: Round): string[] {
    const files = new Set(
        round.checks.flatMap((check) => (check.file ? [check.file] : [])),
    );
    if (round.checks.some((check) => check.message === null))
        for (const change of run.changes)
            if (change.after !== null && change.path.endsWith(".md"))
                files.add(change.path);
    return [...files];
}

// The file changes of the main agent.
function writes(run: Run, calls: MainCall[]) {
    return calls.flatMap((call) => {
        if (!WRITE_TOOLS.includes(call.name.toLowerCase())) return [];
        const input = call.input;
        const paths = [
            input.file_path,
            input.filePath,
            input.notebook_path,
            ...[
                ...String(input.patchText ?? input.patch ?? "").matchAll(
                    /^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm,
                ),
            ].map((match) => match[1]),
        ].filter((path): path is string => typeof path === "string");
        return paths.map((path) => ({
            at: call.at,
            name: call.name,
            path: local(run, path),
        }));
    });
}

const groupBy = <T>(items: T[], key: (item: T) => string) => {
    const groups = new Map<string, T[]>();
    for (const item of items)
        groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
    return groups;
};

// The problems of one round that [1] and [3a] share: the checks of each
// file, a new subagent for each failed check, the groups of 3, and no file
// change before the last report.
function roundProblems(run: Run, found: Process, round: Round): string[] {
    const problems: string[] = [];
    const name = label(round);
    const subagents = subagentsOf(round);
    const mains = subagents.filter((check) => check.class !== "confirmer");
    for (const [file, checks] of groupBy(mains, (check) => `${check.file}`)) {
        const keys = new Set(checks.map((check) => check.key));
        if (round.kind === "review") {
            for (const reviewer of REVIEWERS)
                if (!checks.some((check) => check.class === reviewer))
                    problems.push(`${name}: ${file} has no ${reviewer}.`);
        } else if (keys.size !== 3) {
            problems.push(`${name}: ${file} has ${keys.size} reader tasks.`);
        }
        const firsts = [...keys].map(
            (key) => checks.find((check) => check.key === key) as Check,
        );
        if (new Set(firsts.map((check) => check.message)).size > 1)
            problems.push(
                `${name}: the ${round.kind === "review" ? "reviewers" : "readers"} of ${file} start in different messages.`,
            );
    }
    for (const attempts of groupBy(mains, (check) => check.key).values()) {
        const last = attempts.at(-1) as Check;
        const what = `the ${last.class} subagent of ${last.file}${last.class === "reader" ? ` for "${last.task}"` : ""}`;
        if (attempts.length > 2)
            problems.push(`${name}: ${attempts.length} subagents for ${what}.`);
        if (!last.failed) continue;
        if (attempts.length === 1) {
            problems.push(
                `${name}: ${what} failed, and the run started no new subagent.`,
            );
            continue;
        }
        if (!round.checks.some((check) => check.message === null))
            problems.push(
                `${name}: ${what} failed 2 times, and the run did not do the check itself.`,
            );
        if (
            found.checks.some(
                (check) => check.start > last.end && check.message,
            )
        )
            problems.push(
                `${name}: the run started subagents after ${what} failed 2 times.`,
            );
    }
    for (const [message, checks] of groupBy(
        subagents,
        (check) => `${check.message}`,
    )) {
        if (checks.length > 3)
            problems.push(
                `${name}: ${checks.length} subagents start in one message.`,
            );
        const start = checks[0].start;
        const open = found.checks.some(
            (check) =>
                check.message !== null &&
                check.message !== message &&
                check.start < start &&
                check.end > start,
        );
        if (open)
            problems.push(
                `${name}: a subagent starts before an earlier subagent gives its report.`,
            );
    }
    for (const check of subagents)
        if (/fork/i.test(check.type))
            problems.push(`${name}: the ${check.class} subagent is a fork.`);
    const files = roundFiles(run, round);
    const [start, end] = [roundStart(round), roundEnd(round)];
    for (const write of writes(run, found.calls))
        if (write.at > start && write.at < end && files.includes(write.path))
            problems.push(
                `${name}: ${write.name} changes ${write.path} before the last report of the round.`,
            );
    return problems;
}

// The confirmers of a round: 2 for each report with blocking findings or
// with a wrong step, a maximum of 6 for each file of a review round and 4 for
// each file of a reader-test round, after the last report of the round.
function confirmerProblems(round: Round): string[] {
    const problems: string[] = [];
    const name = label(round);
    const confirmers = round.checks.filter(
        (check) => check.class === "confirmer",
    );
    const lastReport = Math.max(...mainChecks(round).map((check) => check.end));
    const limit = round.kind === "review" ? 6 : 4;
    for (const [file, checks] of groupBy(
        confirmers,
        (check) => `${check.file}`,
    )) {
        const reports = mainChecks(round).filter(
            (check) =>
                !check.failed && (check.file === file || check.file === null),
        ).length;
        const count = checks.length;
        if (count % 2 !== 0 || count > limit || count > 2 * reports)
            problems.push(`${name}: ${file} has ${count} confirmers.`);
    }
    if (confirmers.some((check) => check.start < lastReport))
        problems.push(`${name}: a confirmer starts before the last report.`);
    return problems;
}

// The words of each command in a shell line, or null when the line has a
// redirect, a command substitution, or a background job.
function commands(line: string): string[][] | null {
    const result: string[][] = [[]];
    let word = "";
    let quote: string | null = null;
    const endWord = () => {
        if (word) (result.at(-1) as string[]).push(word);
        word = "";
    };
    for (let index = 0; index < line.length; index++) {
        const char = line[index];
        const substitution =
            char === "`" || (char === "$" && line[index + 1] === "(");
        if (quote === "'") {
            if (char === quote) quote = null;
            else word += char;
        } else if (substitution) {
            return null;
        } else if (quote) {
            if (char === quote) quote = null;
            else word += char;
        } else if (char === "'" || char === '"') {
            quote = char;
        } else if (char === ">") {
            return null;
        } else if (/[;|&\n]/.test(char)) {
            if (
                char === "&" &&
                line[index + 1] !== "&" &&
                line[index - 1] !== "&"
            )
                return null;
            endWord();
            result.push([]);
        } else if (/\s/.test(char)) {
            endWord();
        } else {
            word += char;
        }
    }
    endWord();
    return result.filter((words) => words.length > 0);
}

// A reader command passes only when each of its commands is on the
// read-only list of the spec.
function readOnly(line: string): boolean {
    const list = commands(line);
    if (!list || list.length === 0) return false;
    return list.every(([name, ...args]) => {
        if (
            ["cat", "head", "tail", "grep", "rg", "ls", "wc", "diff"].includes(
                name,
            )
        )
            return true;
        if (name === "sed")
            return (
                args[0] === "-n" &&
                !args.some((arg) => /^(-i|--in-place)/.test(arg))
            );
        if (name === "find")
            return !args.some((arg) =>
                /^-(delete|exec|execdir|ok|okdir|fprint0?|fprintf|fls)$/.test(
                    arg,
                ),
            );
        if (name === "git")
            return ["status", "diff", "log", "show"].includes(args[0]);
        return false;
    });
}

function readerWrites(round: Round): string[] {
    const problems: string[] = [];
    for (const check of subagentsOf(round)) {
        if (check.class !== "reader") continue;
        for (const call of check.calls) {
            const who = `${label(round)}: the reader of "${check.task}"`;
            if (WRITE_TOOLS.includes(call.name.toLowerCase()))
                problems.push(`${who} calls ${call.name}.`);
            else if (isBash(call) && !readOnly(command(call)))
                problems.push(`${who} runs "${command(call)}".`);
        }
    }
    return problems;
}

const verdict = (problems: string[], ok: string): Verdict =>
    problems.length === 0
        ? { passed: true, evidence: ok }
        : { passed: false, evidence: problems.join("\n") };

export function reviewers(run: Run): Verdict {
    const found = findRounds(run);
    const problems = [...found.unclassified];
    if (found.review.length === 0) problems.push("No review round.");
    for (const round of found.review)
        problems.push(
            ...roundProblems(run, found, round),
            ...confirmerProblems(round),
        );
    return verdict(
        problems,
        `${found.review.length} review rounds with 3 reviewers for each file, in groups of 3, and no file change before the last report.`,
    );
}

export function readers(run: Run): Verdict {
    const found = findRounds(run);
    const problems = [...found.unclassified];
    const [first] = found.reader;
    if (!first) problems.push("No reader-test round.");
    else if (
        !found.review.some((round) => roundStart(round) < roundStart(first))
    )
        problems.push(
            "Reader-test round 1 starts before the first review round.",
        );
    for (const round of found.reader)
        problems.push(
            ...roundProblems(run, found, round),
            ...confirmerProblems(round),
            ...readerWrites(round),
        );
    return verdict(
        problems,
        `${found.reader.length} reader-test rounds with 3 read-only readers for each file, after the review rounds.`,
    );
}

export function roundLimits(run: Run): Verdict {
    const found = findRounds(run);
    return {
        passed: found.review.length <= 3 && found.reader.length <= 3,
        evidence: `${found.review.length} review rounds and ${found.reader.length} reader-test rounds.`,
    };
}

// [2] and [3c]: after the last report of each round, the run ran the report
// form for each file of the round before it changed a file of the round and
// before the next round. For review rounds, the evidence also gives the
// number of findings that the report form drops from the reports, against
// the file as the run left it.
function reportForms(run: Run, kind: Kind): Verdict {
    const found = findRounds(run);
    const rounds = found[kind];
    const all = [...found.review, ...found.reader].map(roundStart);
    const problems: string[] = [];
    const ok: string[] = [];
    if (rounds.length === 0)
        problems.push(
            `No ${kind === "review" ? "review" : "reader-test"} round.`,
        );
    for (const round of rounds) {
        const lastReport = Math.max(
            ...mainChecks(round).map((check) => check.end),
        );
        const files = roundFiles(run, round);
        const nextRound = Math.min(
            ...all.filter((start) => start > roundStart(round)),
        );
        const change = writes(run, found.calls)
            .filter(
                (write) => write.at > lastReport && files.includes(write.path),
            )
            .map((write) => write.at);
        const limit = Math.min(nextRound, ...change);
        for (const file of files) {
            const ran = found.calls.some((call) => {
                if (!isBash(call) || call.at <= lastReport || call.at >= limit)
                    return false;
                const line = command(call);
                const target = /--file[= ]+(?:"([^"]+)"|'([^']+)'|(\S+))/.exec(
                    line,
                );
                return (
                    line.includes("check.ts") &&
                    line.includes("--reports") &&
                    line.includes("--tasks") === (kind === "reader") &&
                    target !== null &&
                    local(run, target[1] ?? target[2] ?? target[3]) === file
                );
            });
            const name = `${label(round)}, ${file}`;
            if (!ran) {
                problems.push(`${name}: no report form before the correction.`);
                continue;
            }
            if (kind === "reader") {
                ok.push(`${name}: the report form ran.`);
                continue;
            }
            const reports = mainChecks(round)
                .filter(
                    (check) =>
                        !check.failed &&
                        (check.file === file ||
                            (check.file === null &&
                                (files.length === 1 ||
                                    check.report.includes(basename(file))))),
                )
                .map((check) => check.report);
            const dropped = run.dropped(file, reports);
            ok.push(
                dropped === null
                    ? `${name}: the report form ran.`
                    : `${name}: the report form ran. ${dropped} dropped findings in ${reports.length} reports, against the file as the run left it.`,
            );
        }
    }
    return verdict(problems, ok.join("\n"));
}

export const reviewReportForms = (run: Run) => reportForms(run, "review");
export const readerReportForms = (run: Run) => reportForms(run, "reader");
