// The process statements [1], [2], [3a], [3c], and [4] of the output tests.
// They sort the subagents of a run into the checks of review.md by the class
// line of each prompt, put the checks into rounds, and examine the sequence
// of starts, reports, report-form runs, and file changes.

import { basename } from "node:path";
import type { MainCall, Run, Verdict } from "./assertions.ts";
import {
    READER_TITLE,
    REVIEW_TITLE,
    type ToolCall,
    WRITE_TOOLS,
} from "./eval-lib.ts";

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
    reportPath: string | null;
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
const REPORT_LINE = /^\s*Report: (.+?)\s*$/m;

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
        const report = REPORT_LINE.exec(agent.prompt)?.[1];
        return [
            {
                ...agent,
                class: name,
                file,
                task,
                reportPath: report ? local(run, report) : null,
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
                    reportPath: null,
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

// A report form run of the main agent: the file under review and the
// report paths, as the command gives them.
type FormRun = { file: string; reports: string[]; reader: boolean };

function formRun(run: Run, line: string): FormRun | null {
    const words = [...line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(
        (match) => match[1] ?? match[2] ?? match[3],
    );
    const first = words.findIndex((word) => word.endsWith("check.ts"));
    if (first < 0) return null;
    const args: string[] = [];
    for (const word of words.slice(first + 1)) {
        if (/^(\d?>|\||&&|;)/.test(word)) break;
        args.push(word);
    }
    if (!args.includes("--reports")) return null;
    const form: FormRun = { file: "", reports: [], reader: false };
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === "--reports") continue;
        if (arg.startsWith("--")) {
            const value = args[++index] ?? "";
            if (arg === "--file") form.file = local(run, value);
            if (arg === "--tasks") form.reader = true;
            continue;
        }
        form.reports.push(local(run, arg));
    }
    return form;
}

// The round folder of a saved file: `round-<n>/` for a review round and
// `reader-round-<n>/` for a reader-test round, in the folder of the run.
function roundFolder(
    path: string,
): { folder: string; kind: Kind; number: number } | null {
    const match = /^(.*\/(reader-)?round-(\d+))\/./.exec(path);
    if (!match) return null;
    return {
        folder: match[1],
        kind: match[2] ? "reader" : "review",
        number: Number(match[3]),
    };
}

// A saved report of a round with its file and the number that its
// confirmers decide: blocking findings, or "no" answers of a closed list.
type SavedReport = { round: number; file: string | null; count: number };

// The saved reports of all rounds of one kind. Review rounds: each report of
// a report form run, with the blocking findings of the report form against
// the copy of its round. Reader-test rounds: each closed list, with its "no"
// answers. A later report form run of a report replaces the earlier one.
function savedReports(run: Run, found: Process, kind: Kind) {
    const problems: string[] = [];
    const reports = new Map<string, SavedReport>();
    if (kind === "reader") {
        for (const path of run.saved) {
            const place = roundFolder(path);
            if (place?.kind !== "reader") continue;
            if (!basename(path).startsWith("closed-list-")) continue;
            const text = run.readSaved(path) ?? "";
            reports.set(path, {
                round: place.number,
                file: null,
                count: [...text.matchAll(/^\s*\d+\.\s*[*"']*no\b/gim)].length,
            });
        }
        return { problems, reports };
    }
    for (const call of found.calls) {
        if (!isBash(call)) continue;
        const form = formRun(run, command(call));
        if (!form || form.reader) continue;
        for (const [folder, paths] of groupBy(
            form.reports,
            (path) => roundFolder(path)?.folder ?? "",
        )) {
            const place = roundFolder(paths[0]);
            if (place?.kind !== "review") {
                for (const path of paths)
                    problems.push(
                        `The report file ${path} is not in a round-<n> folder.`,
                    );
                continue;
            }
            const name = `Review round ${place.number}`;
            const present = paths.filter((path) => {
                if (run.readSaved(path) !== null) return true;
                problems.push(`${name}: the report file ${path} is missing.`);
                return false;
            });
            const copy = `${folder}/${form.file}`;
            if (run.readSaved(copy) === null) {
                problems.push(`${name}: the copy ${copy} is missing.`);
                continue;
            }
            if (present.length === 0) continue;
            const counts = run.blockingCounts(copy, present);
            for (const path of present)
                reports.set(path, {
                    round: place.number,
                    file: form.file,
                    count: counts.get(path) ?? 0,
                });
        }
    }
    return { problems, reports };
}

// The vote of a round. Review round: the report form has the report of each
// reviewer, and each report with blocking findings has 2 confirmers that
// give it in their Report line. Reader-test round: 2 closed lists for each
// file, and each closed list with a "no" has 2 confirmers. A report without
// blocking findings or "no" answers has no confirmer. A round has a maximum
// of 6 confirmers for each file of a review round and 4 for each file of a
// reader-test round, after the last report of the round. A round that the
// run did itself, or a report whose 2 confirmers failed, has no vote.
function confirmerProblems(
    round: Round,
    reports: Map<string, SavedReport>,
): string[] {
    const problems: string[] = [];
    const name = label(round);
    const review = round.kind === "review";
    const ofRound = [...reports].filter(
        ([, report]) => report.round === round.number,
    );
    const mains = subagentsOf(round).filter(
        (check) => check.class !== "confirmer" && !check.failed,
    );
    const files = new Set(mains.map((check) => `${check.file}`));
    if (review) {
        for (const file of files) {
            const expected = mains.filter(
                (check) => `${check.file}` === file,
            ).length;
            const given = ofRound.filter(
                ([, report]) => report.file === file,
            ).length;
            if (given < expected)
                problems.push(
                    `${name}, ${file}: the report form has ${given} of the ${expected} reviewer reports.`,
                );
        }
    } else if (ofRound.length < 2 * files.size) {
        problems.push(
            `${name}: ${ofRound.length} closed lists for ${files.size} files. Each file has 2 typical tasks.`,
        );
    }
    const confirmers = round.checks.filter(
        (check) => check.class === "confirmer",
    );
    for (const check of confirmers) {
        const report = check.reportPath ? reports.get(check.reportPath) : null;
        if (!check.reportPath)
            problems.push(`${name}: a confirmer has no Report line.`);
        else if (report?.round !== round.number)
            problems.push(
                `${name}: a confirmer gives ${check.reportPath}, which is not a saved ${review ? "report" : "closed list"} of this round.`,
            );
    }
    const selfDone = round.checks.some((check) => check.message === null);
    for (const [path, report] of ofRound) {
        const started = confirmers.filter((check) => check.reportPath === path);
        const ok = started.filter((check) => !check.failed).length;
        const noVote = selfDone || started.length - ok >= 2;
        if (
            (report.count > 0 && ok < 2 && !noVote) ||
            (report.count === 0 && started.length > 0) ||
            ok > 2
        )
            problems.push(
                review
                    ? `${name}: the report ${path} has ${report.count} blocking findings and ${started.length} confirmers.`
                    : `${name}: the closed list ${path} has ${report.count} "no" answers and ${started.length} confirmers.`,
            );
    }
    const limit = review ? 6 : 4;
    for (const [file, checks] of groupBy(
        confirmers.filter((check) => !check.failed),
        (check) => `${check.file}`,
    ))
        if (checks.length > limit)
            problems.push(`${name}: ${file} has ${checks.length} confirmers.`);
    const lastReport = Math.max(...mainChecks(round).map((check) => check.end));
    if (confirmers.some((check) => check.start < lastReport))
        problems.push(`${name}: a confirmer starts before the last report.`);
    return problems;
}

// The stderr redirects that a reader command can use.
const STDERR_REDIRECT = /^>(?:\/dev\/null|&1)(?=$|[\s;|&])/;

// The words of each command in a shell line, or null when the line has a
// redirect other than 2>/dev/null or 2>&1, a command substitution, or a
// background job.
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
            const redirect = STDERR_REDIRECT.exec(line.slice(index));
            if (word !== "2" || !redirect) return null;
            word = "";
            index += redirect[0].length - 1;
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

const READ_COMMANDS = [
    "cat",
    "head",
    "tail",
    "grep",
    "rg",
    "ls",
    "wc",
    "diff",
    "cd",
    "echo",
    "pwd",
];

// A reader command passes only when each of its commands is on the
// read-only list of the spec. review.md gives the same list in the reader
// prompt.
function readOnly(line: string): boolean {
    const list = commands(line);
    if (!list || list.length === 0) return false;
    return list.every(([name, ...args]) => {
        if (READ_COMMANDS.includes(name)) return true;
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
        if (name !== "git") return false;
        const [sub, ...rest] = args;
        if (sub === "branch")
            return rest.every((arg) => ["-a", "-r", "--list"].includes(arg));
        if (sub === "remote") return rest.length === 1 && rest[0] === "-v";
        return [
            "status",
            "diff",
            "log",
            "show",
            "ls-files",
            "rev-parse",
        ].includes(sub);
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
    const saved = savedReports(run, found, "review");
    const problems = [...found.unclassified, ...saved.problems];
    if (found.review.length === 0) problems.push("No review round.");
    for (const round of found.review)
        problems.push(
            ...roundProblems(run, found, round),
            ...confirmerProblems(round, saved.reports),
        );
    return verdict(
        problems,
        `${found.review.length} review rounds with 3 reviewers for each file, in groups of 3, 2 confirmers for each saved report with blocking findings, and no file change before the last report.`,
    );
}

export function readers(run: Run): Verdict {
    const found = findRounds(run);
    const saved = savedReports(run, found, "reader");
    const problems = [...found.unclassified, ...saved.problems];
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
            ...confirmerProblems(round, saved.reports),
            ...readerWrites(round),
        );
    return verdict(
        problems,
        `${found.reader.length} reader-test rounds with 3 read-only readers for each file, after the review rounds, and 2 confirmers for each saved closed list with a "no".`,
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
