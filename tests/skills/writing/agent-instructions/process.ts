// The process statements [1], [2], [3a], [3c], and [4] of the output tests.
// They sort the subagents of a run into the checks of review.md by the class
// line of each prompt, put the checks into rounds, and examine the sequence
// of starts, reports, report-form runs, and file changes.

import { basename, posix } from "node:path";
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
// The report folder of each reviewer in the folder of a review round.
const FOLDERS: Record<string, string> = {
    "loading reviewer": "loading",
    "ASD-STE100 reviewer": "ste",
    "ISO 24495-1 reviewer": "iso",
};

// One check of a round: a subagent, or a report that the main agent saved
// itself as "When no subagent is available" tells. A saved report has no
// message and gives its round number in its title. A reviewer gives its
// round in its report folder, and a review confirmer in its report paths.
// `changes` gives the files of the Changes line of a reviewer, and
// `reports` the paths of the Reports line of a review confirmer.
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
    changes: string[];
    reports: string[];
    calls: ToolCall[];
    round?: number;
};

type Round = { kind: Kind; number: number; checks: Check[] };

type Process = {
    review: Round[];
    reader: Round[];
    unclassified: string[];
    noFolder: string[];
    checks: Check[];
    calls: MainCall[];
};

const CLASS_LINE = /^\s*(?:<[^>]*>\s*)?Check class: (.+?)\s*$/gm;
const FILE_LINE = /^\s*Instruction file: (.+?)\s*$/m;
const TASK_LINE = /^\s*Task: (.+?)\s*$/m;
const REPORT_LINE = /^\s*Report: (.+?)\s*$/m;
const REPORTS_LINE = /^\s*Reports: (.+?)\s*$/m;
const REPORT_FOLDER_LINE = /^\s*Report folder: (.+?)\s*$/m;
const CHANGES_LINE = /^\s*Changes: (.+?)\s*$/m;
// The round number, the reviewer folder, and the rest of a path in a
// review round.
const REVIEW_PATH = new RegExp(
    `(?:^|/)round-(\\d+)/(${Object.values(FOLDERS).join("|")})/(.*)$`,
);

// The report path of a reviewer for one file of a review round, relative to
// the round folder of the run: `round-<n>/<folder>/<project path>.md`.
const reportFile = (round: number, folder: string, file: string) =>
    `round-${round}/${folder}/${file}.md`;

// The round, the reviewer folder, and the file under review of a path in a
// review round. The file is empty for the report folder itself.
function reviewPlace(path: string) {
    const match = REVIEW_PATH.exec(path);
    if (!match) return null;
    return {
        round: Number(match[1]),
        folder: match[2],
        file: match[3].replace(/\.md$/, ""),
    };
}

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

// The items of a prompt line, without quotation marks and separators.
const tokens = (line: string | undefined) =>
    [...(line ?? "").matchAll(/[^\s,;"'`]+/g)].map((match) => match[0]);

// The files of a Changes line: each absolute path in the project folder.
function changedFiles(run: Run, line: string | undefined): string[] {
    const paths = [...(line ?? "").matchAll(/\/[^\s,;:"'`()]+/g)].map((match) =>
        local(run, match[0]),
    );
    return [...new Set(paths.filter((path) => !path.startsWith("/")))];
}

const label = (round: Round) =>
    `${round.kind === "review" ? "Review round" : "Reader-test round"} ${round.number}`;

const isBash = (call: ToolCall) => call.name.toLowerCase() === "bash";
const command = (call: ToolCall) => String(call.input.command ?? "");

// The checks of the subagents. A reviewer prompt without a report folder
// of a review round is a problem of [1], and the reviewer is not a check.
function subagentChecks(
    run: Run,
    unclassified: string[],
    noFolder: string[],
): Check[] {
    return run.subagents.flatMap((agent) => {
        const name = classOf(agent.prompt);
        if (!name) {
            const first = agent.prompt.trim().split("\n")[0];
            unclassified.push(
                `The subagent "${first}" has no class line of review.md.`,
            );
            return [];
        }
        let round: number | undefined;
        if (REVIEWERS.includes(name)) {
            const [folder] = tokens(REPORT_FOLDER_LINE.exec(agent.prompt)?.[1]);
            const folderPlace = folder ? reviewPlace(`${folder}/`) : null;
            if (!folderPlace) {
                noFolder.push(`The ${name} subagent has no report folder.`);
                return [];
            }
            round = folderPlace.round;
        }
        const reports = tokens(REPORTS_LINE.exec(agent.prompt)?.[1]).filter(
            (path) => path.includes("/"),
        );
        const reportPlace = reports
            .map(reviewPlace)
            .find((place) => place !== null);
        if (name === "confirmer" && reportPlace) round = reportPlace.round;
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
                changes: changedFiles(
                    run,
                    CHANGES_LINE.exec(agent.prompt)?.[1],
                ),
                reports,
                key: `${file} ${name === "reader" ? task : name}`,
                round,
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
                    changes: [],
                    reports: [],
                    calls: [],
                    round: Number(round),
                },
            ];
        }),
    );
}

// Puts the checks of the run into review rounds and reader-test rounds. A
// check with a round number goes into that round: a reviewer, a review
// confirmer, or a saved check of the main agent. A reader check starts a
// new round when the current round is of the other kind, or already has a
// check with the same file and task that did not fail. A confirmer without
// a round number is a check of the current round.
function findRounds(run: Run): Process {
    const unclassified: string[] = [];
    const noFolder: string[] = [];
    const checks = [
        ...subagentChecks(run, unclassified, noFolder),
        ...savedChecks(run),
    ];
    checks.sort((a, b) => a.start - b.start);
    const rounds: Record<Kind, Round[]> = { review: [], reader: [] };
    const numbered = (kind: Kind, number: number) => {
        const list = rounds[kind];
        while (list.length < number)
            list.push({ kind, number: list.length + 1, checks: [] });
        return list[number - 1];
    };
    let current: Round | undefined;
    for (const check of checks) {
        if (check.class === "confirmer") {
            if (check.round !== undefined)
                numbered("review", check.round).checks.push(check);
            else if (current) current.checks.push(check);
            else
                unclassified.push("A confirmer starts before the first round.");
            continue;
        }
        const kind: Kind = check.class === "reader" ? "reader" : "review";
        if (check.round !== undefined) {
            current = numbered(kind, check.round);
        } else if (
            current?.kind !== kind ||
            current.checks.some(
                (item) => item.key === check.key && !item.failed,
            )
        ) {
            current = numbered(kind, rounds[kind].length + 1);
        }
        current.checks.push(check);
    }
    return {
        ...rounds,
        unclassified,
        noFolder,
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

// The saved report of a reviewer for one file of a review round.
const savedReport = (run: Run, round: Round, reviewer: string, file: string) =>
    run.saved.find((path) =>
        path.endsWith(`/${reportFile(round.number, FOLDERS[reviewer], file)}`),
    );

// The files of a round. Review round 1: each Markdown file that the run
// created or changed. Later review rounds: each file of the Changes lines
// of the reviewers, or, in a round without reviewer subagents, each file
// with a saved report. Reader-test round: each instruction file of the
// readers, and each changed Markdown file when the run saved the reports
// itself.
function roundFiles(run: Run, round: Round): string[] {
    const changed = run.changes
        .filter(
            (change) => change.after !== null && change.path.endsWith(".md"),
        )
        .map((change) => change.path);
    if (round.kind === "review") {
        if (round.number === 1) return changed;
        const changes = round.checks.flatMap((check) => check.changes);
        if (changes.length > 0) return [...new Set(changes)];
        return [
            ...new Set(
                run.saved.flatMap((path) => {
                    const place = reviewPlace(path);
                    return place?.round === round.number && place.file
                        ? [place.file]
                        : [];
                }),
            ),
        ];
    }
    const files = new Set(
        round.checks.flatMap((check) => (check.file ? [check.file] : [])),
    );
    if (round.checks.some((check) => check.message === null))
        for (const path of changed) files.add(path);
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

// The problems of the subagents of one check: a maximum of 2, and a new
// subagent after a failure. After 2 failures, the main agent does the check
// itself and starts no more subagents.
function attemptProblems(
    name: string,
    found: Process,
    attempts: Check[],
    what: string,
    selfDone: boolean,
): string[] {
    const problems: string[] = [];
    const last = attempts.at(-1) as Check;
    if (attempts.length > 2)
        problems.push(`${name}: ${attempts.length} subagents for ${what}.`);
    if (!last.failed) return problems;
    if (attempts.length === 1) {
        problems.push(
            `${name}: ${what} failed, and the run started no new subagent.`,
        );
        return problems;
    }
    if (!selfDone)
        problems.push(
            `${name}: ${what} failed 2 times, and the run did not do the check itself.`,
        );
    if (found.checks.some((check) => check.start > last.end && check.message))
        problems.push(
            `${name}: the run started subagents after ${what} failed 2 times.`,
        );
    return problems;
}

// The files that a reviewer of a round reads: each file of the round, and
// the target of each pointer on an added line of these files. A folder
// target, with a `/` at its end, and a target that the project does not
// have give no text to read. A relative
// target can be relative to the folder of its file or to a folder above it,
// so each of these project paths counts as the target.
function readTargets(run: Run, files: string[]): Map<string, string[]> {
    const targets = new Map<string, string[]>(
        files.map((file) => [file, [file]]),
    );
    for (const pointer of run.pointers) {
        if (!files.includes(pointer.path)) continue;
        for (const target of pointer.targets) {
            if (target.startsWith("~") || target.endsWith("/")) continue;
            if (posix.isAbsolute(target)) {
                targets.set(local(run, target), [local(run, target)]);
                continue;
            }
            const folders = [];
            for (
                let folder = posix.dirname(pointer.path);
                ;
                folder = posix.dirname(folder)
            ) {
                folders.push(folder);
                if (folder === ".") break;
            }
            const paths = folders
                .map((folder) => posix.normalize(posix.join(folder, target)))
                .filter((path) => !path.startsWith("..") && run.exists(path));
            if (paths.length > 0 && !targets.has(paths[0]))
                targets.set(paths[0], paths);
        }
    }
    return targets;
}

// The reviewer subagents of one class in a round, each with `failed` as
// review.md defines it: the subagent failed, its last message does not give
// the report path of each file of its Changes line (of the round when the
// line has none) that no earlier subagent of its class saved, or a report
// form run after its report, and before the next subagent of its class,
// gives a report path of its folder that no subagent of its class up to it
// names in a tool call. That report form exits 2.
function reviewerAttempts(
    run: Run,
    found: Process,
    round: Round,
    reviewer: string,
): Check[] {
    const folder = FOLDERS[reviewer];
    const attempts = subagentsOf(round).filter(
        (check) => check.class === reviewer,
    );
    const named = (checks: Check[]) =>
        checks
            .flatMap((item) => item.calls)
            .map((call) => JSON.stringify(call.input))
            .join("\n");
    return attempts.map((check, index) => {
        const files =
            check.changes.length > 0 ? check.changes : roundFiles(run, round);
        const earlier = named(attempts.slice(0, index));
        const unreported = files.some((file) => {
            const path = reportFile(round.number, folder, file);
            return !earlier.includes(path) && !check.report.includes(path);
        });
        const next = attempts[index + 1]?.start ?? Number.POSITIVE_INFINITY;
        const upToIt = named(attempts.slice(0, index + 1));
        const missing = found.calls.some((call) => {
            if (!isBash(call) || call.at <= check.end || call.at >= next)
                return false;
            const paths = formRuns(run, command(call)).flatMap(
                (form) => form.reports,
            );
            return paths.some((path) => {
                const place = reviewPlace(path);
                return (
                    place?.round === round.number &&
                    place.folder === folder &&
                    !upToIt.includes(
                        reportFile(round.number, folder, place.file),
                    )
                );
            });
        });
        return { ...check, failed: check.failed || unreported || missing };
    });
}

// The review round problems of [1]: 1 subagent of each class, or 2 when
// the first failed, the first subagents in one message, the reads of each
// class, and a saved report of each class for each file of the round.
function reviewerProblems(run: Run, found: Process, round: Round): string[] {
    const problems: string[] = [];
    const name = label(round);
    const files = roundFiles(run, round);
    const targets = readTargets(run, files);
    const firsts: Check[] = [];
    for (const reviewer of REVIEWERS) {
        const attempts = reviewerAttempts(run, found, round, reviewer);
        if (attempts.length === 0) continue;
        firsts.push(attempts[0]);
        if (attempts.length === 2 && !attempts[0].failed)
            problems.push(
                `${name}: 2 subagents of the ${reviewer}, and the first did not fail.`,
            );
        const selfDone = round.checks.some(
            (check) => check.message === null && check.class === reviewer,
        );
        problems.push(
            ...attemptProblems(
                name,
                found,
                attempts,
                `the ${reviewer} subagent`,
                selfDone,
            ),
        );
        const named = attempts
            .flatMap((check) => check.calls)
            .filter((call) => !WRITE_TOOLS.includes(call.name.toLowerCase()))
            .map((call) => JSON.stringify(call.input))
            .join("\n");
        for (const [target, paths] of targets)
            if (!paths.some((path) => named.includes(path)))
                problems.push(
                    `${name}: the ${reviewer} did not read ${target}.`,
                );
    }
    if (new Set(firsts.map((check) => check.message)).size > 1)
        problems.push(
            `${name}: the reviewers of the round start in different messages.`,
        );
    for (const file of files)
        for (const reviewer of REVIEWERS)
            if (!savedReport(run, round, reviewer, file))
                problems.push(
                    `${name}: ${file} has no report of the ${reviewer}.`,
                );
    return problems;
}

// The reader-test round problems of [3a]: the 3 tasks of each file in one
// message, and a new subagent for each failed reader.
function readerProblems(found: Process, round: Round): string[] {
    const problems: string[] = [];
    const name = label(round);
    const readers = subagentsOf(round).filter(
        (check) => check.class === "reader",
    );
    for (const [file, checks] of groupBy(readers, (check) => `${check.file}`)) {
        const keys = new Set(checks.map((check) => check.key));
        if (keys.size !== 3)
            problems.push(`${name}: ${file} has ${keys.size} reader tasks.`);
        const firsts = [...keys].map(
            (key) => checks.find((check) => check.key === key) as Check,
        );
        if (new Set(firsts.map((check) => check.message)).size > 1)
            problems.push(
                `${name}: the readers of ${file} start in different messages.`,
            );
    }
    const selfDone = round.checks.some((check) => check.message === null);
    for (const attempts of groupBy(readers, (check) => check.key).values()) {
        const last = attempts.at(-1) as Check;
        problems.push(
            ...attemptProblems(
                name,
                found,
                attempts,
                `the reader subagent of ${last.file} for "${last.task}"`,
                selfDone,
            ),
        );
    }
    return problems;
}

// The problems of one round that [1] and [3a] share: the checks of the
// round, the groups of 3, and no file change before the last report.
function roundProblems(run: Run, found: Process, round: Round): string[] {
    const problems =
        round.kind === "review"
            ? reviewerProblems(run, found, round)
            : readerProblems(found, round);
    const name = label(round);
    const subagents = subagentsOf(round);
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

// The report form runs of a shell line. One line can run the report form
// for several files, one command on each line or after `;`, `&&`, or `||`.
// A command that only sets shell variables, for example `S=<path>`, gives
// their values to `$S` and `${S}` in the later commands of the line.
function formRuns(run: Run, line: string): FormRun[] {
    const values = new Map<string, string>();
    const expand = (text: string) =>
        text.replace(
            /\$\{(\w+)\}|\$(\w+)/g,
            (word, braced, plain) => values.get(braced ?? plain) ?? word,
        );
    const forms: FormRun[] = [];
    for (const part of line.split(/\n|;|&&|\|\|/)) {
        const words = part.trim().split(/\s+/);
        const assignments = words.map((word) => /^(\w+)=(\S*)$/.exec(word));
        if (part.trim() && assignments.every((match) => match !== null)) {
            for (const match of assignments)
                if (match) values.set(match[1], expand(match[2]));
            continue;
        }
        const form = formRun(run, expand(part));
        if (form) forms.push(form);
    }
    return forms;
}

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

// A saved report of a round with its file, its reviewer folder, and the
// number that its confirmers decide: blocking findings, or "no" answers of
// a closed list.
type SavedReport = {
    round: number;
    file: string | null;
    folder: string | null;
    count: number;
};

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
                folder: null,
                count: [...text.matchAll(/^\s*\d+\.\s*[*"']*no\b/gim)].length,
            });
        }
        return { problems, reports };
    }
    for (const call of found.calls) {
        if (!isBash(call)) continue;
        for (const form of formRuns(run, command(call))) {
            if (form.reader) continue;
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
                    problems.push(
                        `${name}: the report file ${path} is missing.`,
                    );
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
                        folder: reviewPlace(path)?.folder ?? null,
                        count: counts.get(path) ?? 0,
                    });
            }
        }
    }
    return { problems, reports };
}

// The vote of a review round. The report form has the 3 reviewer reports of
// each file of the round. Each reviewer with blocking findings has 2
// confirmers whose Reports lines give each of its reports with blocking
// findings, and only reports of that reviewer. A reviewer without blocking
// findings has no confirmer. The round has a maximum of 6 confirmers, after
// the last report of the round. A round that the run did itself, or a
// reviewer whose 2 confirmers failed, has no vote.
function reviewVote(
    run: Run,
    round: Round,
    reports: Map<string, SavedReport>,
): string[] {
    const problems: string[] = [];
    const name = label(round);
    const ofRound = [...reports].filter(
        ([, report]) => report.round === round.number,
    );
    for (const file of roundFiles(run, round)) {
        const given = ofRound.filter(([, report]) => report.file === file);
        if (given.length < REVIEWERS.length)
            problems.push(
                `${name}, ${file}: the report form has ${given.length} of the ${REVIEWERS.length} reviewer reports.`,
            );
    }
    const confirmers = round.checks.filter(
        (check) => check.class === "confirmer",
    );
    for (const check of confirmers) {
        if (check.reports.length === 0) {
            problems.push(`${name}: a confirmer has no Reports line.`);
            continue;
        }
        for (const path of check.reports)
            if (reports.get(path)?.round !== round.number)
                problems.push(
                    `${name}: a confirmer gives ${path}, which is not a saved report of this round.`,
                );
        const folders = new Set(
            check.reports.map((path) => reviewPlace(path)?.folder),
        );
        if (folders.size > 1)
            problems.push(
                `${name}: a confirmer gives the reports of ${folders.size} reviewers.`,
            );
    }
    const selfDone = round.checks.some((check) => check.message === null);
    for (const reviewer of REVIEWERS) {
        const folder = FOLDERS[reviewer];
        const blocking = ofRound.filter(
            ([, report]) => report.folder === folder && report.count > 0,
        );
        const count = blocking.reduce(
            (sum, [, report]) => sum + report.count,
            0,
        );
        const started = confirmers.filter(
            (check) =>
                check.reports.length > 0 &&
                check.reports.every(
                    (path) => reviewPlace(path)?.folder === folder,
                ),
        );
        const ok = started.filter((check) => !check.failed);
        const noVote = selfDone || started.length - ok.length >= 2;
        if (
            (count > 0 && ok.length < 2 && !noVote) ||
            (count === 0 && started.length > 0) ||
            ok.length > 2
        )
            problems.push(
                `${name}: the ${reviewer} has ${count} blocking findings and ${started.length} confirmers.`,
            );
        for (const check of ok)
            for (const [path] of blocking)
                if (!check.reports.includes(path))
                    problems.push(
                        `${name}: a confirmer of the ${reviewer} does not give ${path}.`,
                    );
    }
    const total = confirmers.filter((check) => !check.failed).length;
    if (total > 6) problems.push(`${name} has ${total} confirmers.`);
    return problems;
}

// The vote of a reader-test round: 2 closed lists for each file, and each
// closed list with a "no" has 2 confirmers that give it in their Report
// line. A closed list without "no" answers has no confirmer. A round has a
// maximum of 4 confirmers for each file. A round that the run did itself,
// or a closed list whose 2 confirmers failed, has no vote.
function readerVote(round: Round, reports: Map<string, SavedReport>): string[] {
    const problems: string[] = [];
    const name = label(round);
    const ofRound = [...reports].filter(
        ([, report]) => report.round === round.number,
    );
    const readers = subagentsOf(round).filter(
        (check) => check.class === "reader" && !check.failed,
    );
    const files = new Set(readers.map((check) => `${check.file}`));
    if (ofRound.length < 2 * files.size)
        problems.push(
            `${name}: ${ofRound.length} closed lists for ${files.size} files. Each file has 2 typical tasks.`,
        );
    const confirmers = round.checks.filter(
        (check) => check.class === "confirmer",
    );
    for (const check of confirmers) {
        const report = check.reportPath ? reports.get(check.reportPath) : null;
        if (!check.reportPath)
            problems.push(`${name}: a confirmer has no Report line.`);
        else if (report?.round !== round.number)
            problems.push(
                `${name}: a confirmer gives ${check.reportPath}, which is not a saved closed list of this round.`,
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
                `${name}: the closed list ${path} has ${report.count} "no" answers and ${started.length} confirmers.`,
            );
    }
    for (const [file, checks] of groupBy(
        confirmers.filter((check) => !check.failed),
        (check) => `${check.file}`,
    ))
        if (checks.length > 4)
            problems.push(`${name}: ${file} has ${checks.length} confirmers.`);
    return problems;
}

function confirmerProblems(
    run: Run,
    round: Round,
    reports: Map<string, SavedReport>,
): string[] {
    const problems =
        round.kind === "review"
            ? reviewVote(run, round, reports)
            : readerVote(round, reports);
    const confirmers = round.checks.filter(
        (check) => check.class === "confirmer",
    );
    const lastReport = Math.max(...mainChecks(round).map((check) => check.end));
    if (confirmers.some((check) => check.start < lastReport))
        problems.push(
            `${label(round)}: a confirmer starts before the last report.`,
        );
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
// prompt. A loop `for <name> in <words>; do <commands>; done` passes when
// each command in its body passes.
function readOnly(line: string): boolean {
    const list = commands(line);
    if (!list || list.length === 0) return false;
    let loop: "none" | "head" | "body" = "none";
    for (const words of list) {
        let body = words;
        if (words[0] === "for") {
            const [, name, keyword] = words;
            if (loop !== "none" || keyword !== "in") return false;
            if (!/^[A-Za-z_]\w*$/.test(name)) return false;
            loop = "head";
            continue;
        }
        if (words[0] === "done") {
            if (loop !== "body" || words.length !== 1) return false;
            loop = "none";
            continue;
        }
        if (words[0] === "do") {
            if (loop !== "head") return false;
            loop = "body";
            body = words.slice(1);
            if (body.length === 0) continue;
        } else if (loop === "head") return false;
        if (!readOnlyCommand(body)) return false;
    }
    return loop === "none";
}

function readOnlyCommand([name, ...args]: string[]): boolean {
    if (READ_COMMANDS.includes(name)) return true;
    if (name === "sed")
        return (
            args[0] === "-n" &&
            !args.some((arg) => /^(-i|--in-place)/.test(arg))
        );
    if (name === "find")
        return !args.some((arg) =>
            /^-(delete|exec|execdir|ok|okdir|fprint0?|fprintf|fls)$/.test(arg),
        );
    if (name !== "git") return false;
    // The reader prompt permits `-C <folder>` after `git`.
    while (args[0] === "-C" && args.length > 2) args = args.slice(2);
    const [sub, ...rest] = args;
    if (sub === "branch") return listOnly(rest, ["-a", "-r"], ["--list"]);
    if (sub === "remote") return rest.length === 1 && rest[0] === "-v";
    if (sub === "tag") return listOnly(rest, [], ["-l", "--list"]);
    return ["status", "diff", "log", "show", "ls-files", "rev-parse"].includes(
        sub,
    );
}

// The reader prompt permits patterns only after a list option, because
// `git branch <name>` and `git tag <name>` make a branch or a tag.
function listOnly(args: string[], options: string[], list: string[]): boolean {
    const listed = args.some((arg) => list.includes(arg));
    return args.every(
        (arg) =>
            options.includes(arg) ||
            list.includes(arg) ||
            (listed && !arg.startsWith("-")),
    );
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
    const problems = [
        ...found.unclassified,
        ...found.noFolder,
        ...saved.problems,
    ];
    if (found.review.length === 0) problems.push("No review round.");
    for (const round of found.review)
        problems.push(
            ...roundProblems(run, found, round),
            ...confirmerProblems(run, round, saved.reports),
        );
    return verdict(
        problems,
        `${found.review.length} review rounds with 1 reviewer of each class in one message, a report of each reviewer for each file, 2 confirmers for each reviewer with blocking findings, and no file change before the last report.`,
    );
}

export function readers(run: Run): Verdict {
    const found = findRounds(run);
    const saved = savedReports(run, found, "reader");
    const problems = [...found.unclassified, ...saved.problems];
    const [first] = found.reader;
    // An output-test run skips the review rounds (#211). A recorded run with
    // review rounds starts the reader test after the first of them.
    if (!first) problems.push("No reader-test round.");
    else if (
        found.review.length > 0 &&
        !found.review.some((round) => roundStart(round) < roundStart(first))
    )
        problems.push(
            "Reader-test round 1 starts before the first review round.",
        );
    for (const round of found.reader)
        problems.push(
            ...roundProblems(run, found, round),
            ...confirmerProblems(run, round, saved.reports),
            ...readerWrites(round),
        );
    return verdict(
        problems,
        `${found.reader.length} reader-test rounds with 3 read-only readers for each file, after the review rounds when the run did them, and 2 confirmers for each saved closed list with a "no".`,
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
// number of findings that the report form drops from the saved reviewer
// reports of each file, against the file as the run left it.
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
                return formRuns(run, command(call)).some(
                    (form) =>
                        form.reader === (kind === "reader") &&
                        form.file === file,
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
            const reports = REVIEWERS.flatMap((reviewer) => {
                const path = savedReport(run, round, reviewer, file);
                const text = path ? run.readSaved(path) : null;
                return text === null ? [] : [text];
            });
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
