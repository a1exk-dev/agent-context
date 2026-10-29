// The script statements of the agent-instructions output tests, keyed by the
// statement id in evals.json, and the lists that the script gives to the LLM
// grader for the other statements. grade.ts builds the Run of a saved run
// folder and calls these functions.

import {
    READER_TITLE,
    REVIEW_TITLE,
    type ToolCall,
    WRITE_TOOLS,
} from "./eval-lib.ts";
import {
    readerReportForms,
    readers,
    reviewers,
    reviewReportForms,
    roundLimits,
} from "./process.ts";

export type Finding = {
    reviewer: string;
    rule: string | null;
    ruleFile: string;
    heading: string;
    text: string;
    path: string;
    line: number;
    problem: string;
};

export type Pointer = {
    path: string;
    line: number;
    heading: string | null;
    text: string;
    targets: string[];
};

// One file of changes.diff. `added` maps each added line number of the new
// file to its text. `removed` gives each removed line of the old file.
export type FileChange = {
    path: string;
    status: "added" | "deleted" | "modified";
    added: Map<number, string>;
    removed: { line: number; text: string }[];
    before: string | null;
    after: string | null;
};

// A tool call of the main agent. `at` orders the calls, the subagent starts,
// and the subagent reports of a run.
export type MainCall = ToolCall & { at: number };

// A subagent that the main agent started. `message` is the id of the main
// message that started it. `end` is the place of its report or failure, or
// Infinity when it gave neither. `calls` are its own tool calls.
export type Subagent = {
    prompt: string;
    type: string;
    message: string;
    start: number;
    end: number;
    failed: boolean;
    report: string;
    calls: ToolCall[];
};

// The run as the statements see it. Paths are relative to the project root.
// `findings` and `pointers` come from the check script of the Skill and are
// only those on added lines. `messages` are the assistant messages of the
// main agent, each with its tool calls. `workDir` is the absolute project
// folder of the run. `dropped` runs the report form of the check script on
// reports against a changed file and gives the number of dropped findings,
// or null when the run deleted the file or there is no report.
export type Run = {
    prompt: string;
    knownMistakes: unknown;
    changes: FileChange[];
    findings: Finding[];
    pointers: Pointer[];
    glossary: string | null;
    workDir: string;
    messages: { id: string; calls: MainCall[] }[];
    subagents: Subagent[];
    dropped: (path: string, reports: string[]) => number | null;
};

export type Verdict = { passed: boolean; evidence: string };

const RELEASE = ".claude/skills/release/";
const RELEASE_SKILL_MD = `${RELEASE}SKILL.md`;
const REFERENCES = `${RELEASE}references/`;

function after(run: Run, path: string): string | null {
    return run.changes.find((change) => change.path === path)?.after ?? null;
}

function verdict(problems: string[], ok: string): Verdict {
    return problems.length === 0
        ? { passed: true, evidence: ok }
        : { passed: false, evidence: problems.join("\n") };
}

const hit = (finding: Finding) =>
    `${finding.path}:${finding.line}: ${finding.problem} "${finding.text}"`;

function findingVerdict(
    run: Run,
    select: (finding: Finding) => boolean,
    ok: string,
): Verdict {
    return verdict(run.findings.filter(select).map(hit), ok);
}

// The text lines of a file without the trailing empty line.
function lines(text: string): string[] {
    const all = text.split("\n");
    if (all.at(-1) === "") all.pop();
    return all;
}

// The lines that are not in a code block.
function proseLines(text: string): string[] {
    let fence = false;
    return lines(text).filter((line) => {
        if (/^\s*(```|~~~)/.test(line)) {
            fence = !fence;
            return false;
        }
        return !fence;
    });
}

const numberedItems = (text: string) =>
    proseLines(text).filter((line) => /^\s*\d+\.\s/.test(line));

const count = (text: string, part: string) => text.split(part).length - 1;

// The top-level fields of the frontmatter, with the plain value of each field.
function frontmatter(text: string): Map<string, string> {
    const fields = new Map<string, string>();
    const all = lines(text);
    if (all[0] !== "---") return fields;
    let key = "";
    for (const line of all.slice(1)) {
        if (line === "---") break;
        const field = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
        if (field) {
            key = field[1];
            fields.set(key, field[2]);
        } else if (key) {
            fields.set(key, `${fields.get(key)}\n${line.trim()}`);
        }
    }
    for (const [name, raw] of fields) fields.set(name, yamlValue(raw));
    return fields;
}

function yamlValue(raw: string): string {
    const value = raw.trim();
    if (/^[>|]/.test(value)) return value.replace(/^[>|][-+]?\n?/, "").trim();
    if (value.startsWith('"')) {
        try {
            return JSON.parse(value.replace(/\n/g, " "));
        } catch {
            return value.slice(1, -1);
        }
    }
    if (value.startsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
    return value.replace(/\n/g, " ");
}

// The `##` sections of a Markdown file, each with its `###` subsections.
function sections(text: string) {
    const result: { heading: string; body: string[] }[] = [];
    let fence = false;
    for (const line of lines(text)) {
        if (/^\s*(```|~~~)/.test(line)) fence = !fence;
        const heading = fence ? null : /^## (.+)$/.exec(line);
        if (heading) result.push({ heading: heading[1].trim(), body: [] });
        else result.at(-1)?.body.push(line);
    }
    return result;
}

const nonBlank = (body: string[]) => body.filter((line) => line.trim());

// A heading of any level reads as "# <text>", so that a moved section can
// change its heading level.
const sameLevel = (line: string) => line.replace(/^#+ /, "# ");

const SUBAGENT_TOOLS = ["agent", "task"];

function selfChecks(run: Run): Verdict {
    const problems: string[] = [];
    const reviews = new Map<string, string[]>();
    const readers = new Map<string, string[]>();
    const savedPaths: { path: string; index: number }[] = [];
    run.messages.forEach((message, index) => {
        for (const call of message.calls) {
            const input = JSON.stringify(call.input);
            const titles = [
                ...input.matchAll(REVIEW_TITLE),
                ...input.matchAll(READER_TITLE),
            ];
            if (titles.length === 0) continue;
            if (titles.length > 1) {
                problems.push(
                    `Message ${index + 1}: one ${call.name} call saves ${titles.length} reports.`,
                );
            }
            if (message.calls.length > 1) {
                problems.push(
                    `Message ${index + 1}: the report call is one of ${message.calls.length} tool calls.`,
                );
            }
            for (const title of titles) {
                const [, round, name, task] = title;
                if (task === undefined) {
                    const list = reviews.get(round) ?? [];
                    reviews.set(round, [...list, name.toLowerCase()]);
                } else {
                    const key = `${round}, ${name.trim()}`;
                    readers.set(key, [...(readers.get(key) ?? []), task]);
                }
            }
            const path = call.input.file_path ?? call.input.filePath;
            if (typeof path === "string") savedPaths.push({ path, index });
        }
    });
    run.messages.forEach((message, index) => {
        for (const call of message.calls) {
            if (!WRITE_TOOLS.includes(call.name.toLowerCase())) continue;
            const path = call.input.file_path ?? call.input.filePath;
            const saved = savedPaths.find(
                (report) => report.path === path && report.index < index,
            );
            if (saved) {
                problems.push(
                    `Message ${index + 1}: ${call.name} changes the saved report ${path}.`,
                );
            }
        }
    });
    if (reviews.size === 0) problems.push("No saved review report.");
    for (const [round, names] of reviews) {
        const sorted = names.toSorted().join(", ");
        if (sorted !== "asd-ste100, iso 24495-1, loading") {
            problems.push(`Review round ${round} has the reports: ${sorted}.`);
        }
    }
    if (readers.size === 0) problems.push("No saved reader report.");
    for (const [key, tasks] of readers) {
        if (tasks.toSorted().join(",") !== "1,2,3") {
            problems.push(
                `Reader-test round ${key} has the tasks: ${tasks.join(", ")}.`,
            );
        }
    }
    return verdict(
        problems,
        `Each report is in its own tool call and message: ${reviews.size} review rounds, ${readers.size} reader-test file rounds.`,
    );
}

function sharedRules(run: Run): Verdict {
    const agents = after(run, "AGENTS.md") ?? "";
    const missing = ["make test", "pnpm", "main"].filter(
        (part) => !agents.toLowerCase().includes(part),
    );
    return verdict(
        missing.map((part) => `AGENTS.md does not have "${part}".`),
        'AGENTS.md has "make test", "pnpm", and "main".',
    );
}

function numberedList(run: Run, path: string): Verdict {
    const items = numberedItems(after(run, path) ?? "");
    return verdict(
        items.length >= 2
            ? []
            : [`${path} has ${items.length} numbered items.`],
        `${path} has ${items.length} numbered items.`,
    );
}

function maxLines(run: Run, path: string, limit: number): string[] {
    const text = after(run, path);
    if (text === null) return [`The run did not write ${path}.`];
    const total = lines(text).length;
    return total <= limit ? [] : [`${path} has ${total} lines.`];
}

function movedSections(run: Run): Verdict {
    const start = run.changes.find((change) => change.path === "AGENTS.md");
    if (!start?.before || !start.after) {
        return { passed: false, evidence: "The run did not change AGENTS.md." };
    }
    const old = sections(start.before);
    const now = new Map(
        sections(start.after).map((section) => [section.heading, section]),
    );
    const moved = old.filter((section) => {
        const kept = new Set(nonBlank(now.get(section.heading)?.body ?? []));
        return nonBlank(section.body).some((line) => !kept.has(line));
    });
    if (moved.length === 0) {
        return { passed: false, evidence: "No section of AGENTS.md moved." };
    }
    const problems: string[] = [];
    const size = (section: { body: string[] }) => section.body.length + 1;
    const largest = old
        .toSorted((a, b) => size(b) - size(a))
        .slice(0, moved.length)
        .map((section) => section.heading);
    for (const section of moved) {
        if (!largest.includes(section.heading)) {
            problems.push(
                `"${section.heading}" (${size(section)} lines) moved before a larger section.`,
            );
        }
        const body = nonBlank(section.body).map(sameLevel).join("\n");
        const target = run.changes.find(
            (change) =>
                change.path.startsWith("docs/agents/") &&
                change.after !== null &&
                nonBlank(lines(change.after))
                    .map(sameLevel)
                    .join("\n")
                    .includes(body),
        );
        if (!target) {
            problems.push(
                `No file in docs/agents/ has the text of "${section.heading}" without changes.`,
            );
            continue;
        }
        const place = nonBlank(now.get(section.heading)?.body ?? []);
        if (
            place.length !== 1 ||
            /^\s*([-*]|\d+\.)\s/.test(place[0]) ||
            !place[0].includes(target.path)
        ) {
            problems.push(
                `The old place of "${section.heading}" holds more or less than one pointer to ${target.path}: ${JSON.stringify(place)}.`,
            );
        }
    }
    return verdict(
        problems,
        `Moved, largest first, with a pointer in the old place: ${moved.map((section) => `"${section.heading}" (${size(section)} lines)`).join(", ")}.`,
    );
}

// The script statements, keyed by statement id.
export const scriptStatements: Record<string, (run: Run) => Verdict> = {
    "1": reviewers,
    "2": reviewReportForms,
    "3a": readers,
    "3c": readerReportForms,
    "4": roundLimits,
    "6": (run) =>
        findingVerdict(
            run,
            (finding) =>
                finding.ruleFile === "references/ste-rules.md" &&
                (finding.heading === "When you select a word" ||
                    finding.heading === "Before a step with a risk" ||
                    finding.rule === "8.1"),
            "No modal word, semicolon, or emphasis word on an added line.",
        ),
    "7": (run) =>
        findingVerdict(
            run,
            (finding) =>
                finding.ruleFile === "references/ste-rules.md" &&
                /^The sentence has \d+ words\.$/.test(finding.problem),
            "No sentence over 25 words on an added line.",
        ),
    "8a": (run) =>
        findingVerdict(
            run,
            (finding) => {
                const target = /^The file imports "(.+)"/.exec(
                    finding.problem,
                )?.[1];
                return target !== undefined && !run.prompt.includes(target);
            },
            "No @path line on an added line, except the permitted ones.",
        ),
    "9a": (run) =>
        findingVerdict(
            run,
            (finding) => finding.rule === "1.11" || finding.rule === "6.2",
            "No _Avoid_ word and no glossary term in a different case on an added line.",
        ),
    "1.1": (run) => {
        const fields = [
            ...frontmatter(after(run, RELEASE_SKILL_MD) ?? "").keys(),
        ];
        const name = frontmatter(after(run, RELEASE_SKILL_MD) ?? "").get(
            "name",
        );
        return verdict(
            fields.join(",") === "name,description" && name === "release"
                ? []
                : [`Fields: ${fields.join(", ")}. name: ${name}.`],
            "Only name and description. name is release.",
        );
    },
    "1.2": (run) => {
        const description =
            frontmatter(after(run, RELEASE_SKILL_MD) ?? "").get(
                "description",
            ) ?? "";
        const ok =
            /^When\b/.test(description) && /"[^"]+"|“[^”]+”/.test(description);
        return {
            passed: ok,
            evidence: `description: ${JSON.stringify(description)}`,
        };
    },
    "1.3a": (run) => numberedList(run, RELEASE_SKILL_MD),
    "1.4": (run) => {
        const text = after(run, RELEASE_SKILL_MD) ?? "";
        const problems = maxLines(run, RELEASE_SKILL_MD, 500);
        if (/^#+ .*gotchas/im.test(text))
            problems.push('SKILL.md has a "Gotchas" section.');
        return verdict(problems, `SKILL.md has ${lines(text).length} lines.`);
    },
    "1.5": (run) => {
        const skill = after(run, RELEASE_SKILL_MD) ?? "";
        const references = run.changes.filter(
            (change) =>
                change.path.startsWith(REFERENCES) && change.after !== null,
        );
        const problems: string[] = [];
        const has = (test: (text: string) => boolean) =>
            references.some((change) => test(change.after ?? ""));
        if (
            !has((text) =>
                ["## Summary", "## Changes", "## Version"].every((part) =>
                    text.includes(part),
                ),
            )
        )
            problems.push("No file in references/ has the PR template.");
        if (!has((text) => /fail/i.test(text) && /release branch/i.test(text)))
            problems.push(
                "No file in references/ has the If-the-release-fails rules.",
            );
        for (const change of references) {
            const mentions = count(skill, change.path.slice(RELEASE.length));
            if (mentions !== 1)
                problems.push(
                    `SKILL.md names ${change.path} ${mentions} times.`,
                );
        }
        if (numberedItems(skill).length < 3)
            problems.push("SKILL.md has fewer than 3 numbered steps.");
        return verdict(
            problems,
            `references/ has ${references.map((change) => change.path).join(", ")}. SKILL.md names each one time and has the steps.`,
        );
    },
    "2.1": sharedRules,
    "2.4": sharedRules,
    "2.2a": (run) => {
        const claude = lines(after(run, "CLAUDE.md") ?? "");
        return {
            passed: claude.some((line) => line.trim() === "@AGENTS.md"),
            evidence: `CLAUDE.md: ${JSON.stringify(claude)}`,
        };
    },
    "2.3": (run) =>
        verdict(
            run.changes
                .filter((change) => change.after !== null)
                .flatMap((change) => maxLines(run, change.path, 200)),
            "Each file has 200 lines or less.",
        ),
    "2.5": (run) => {
        const added = run.changes
            .filter((change) => change.status === "added")
            .map((change) => change.path);
        const docs = added.filter((path) => path.startsWith("docs/agents/"));
        const other = added.filter(
            (path) => !docs.includes(path) && path !== "AGENTS.md",
        );
        const problems: string[] = [];
        if (docs.length !== 1)
            problems.push(`New files in docs/agents/: ${docs.join(", ")}.`);
        if (other.some((path) => path !== "CLAUDE.md"))
            problems.push(`Other new files: ${other.join(", ")}.`);
        const doc = docs.length === 1 ? (after(run, docs[0]) ?? "") : "";
        if (docs.length === 1) {
            const mentions = count(after(run, "AGENTS.md") ?? "", docs[0]);
            if (mentions !== 1)
                problems.push(`AGENTS.md names ${docs[0]} ${mentions} times.`);
            if (!doc.includes("CHANGELOG.md") || !/\btag\b/i.test(doc))
                problems.push(`${docs[0]} does not have the release rules.`);
        }
        return verdict(problems, `New files: ${added.join(", ")}.`);
    },
    "5.1a": (run) => {
        const memory = run.changes.find(
            (change) => change.path === "MEMORY.md",
        );
        const headings = [...(memory?.added ?? [])].filter(([, text]) =>
            text.startsWith("## "),
        );
        if (!memory?.after || headings.length === 0)
            return { passed: false, evidence: "No new entry in MEMORY.md." };
        const [start, heading] = headings.at(-1) as [number, string];
        const body: string[] = [];
        for (const line of lines(memory.after).slice(start)) {
            if (line.startsWith("#")) break;
            body.push(line);
        }
        const labels = body
            .map(
                (line) =>
                    /^\W*(Applies when|Guidance|Reason)\b/i.exec(line)?.[1] ??
                    "",
            )
            .filter(Boolean)
            .join(", ");
        return {
            passed: labels === "Applies when, Guidance, Reason",
            evidence: `${heading}: ${labels}`,
        };
    },
    "6.1a": (run) => numberedList(run, "docs/agents/review-policy.md"),
    "6.2": (run) => {
        const target = "docs/agents/review-policy.md";
        const pointer = run.pointers.find(
            (item) =>
                item.path === "AGENTS.md" &&
                item.targets.some((path) => path.endsWith(target)),
        );
        const exists = after(run, target) !== null;
        return {
            passed: Boolean(pointer) && exists,
            evidence: pointer
                ? `AGENTS.md:${pointer.line}: "${pointer.text}"${exists ? "" : ` (${target} does not exist)`}`
                : `No new pointer in AGENTS.md names ${target}.`,
        };
    },
    "7.1": (run) => ({
        passed: lines(after(run, "CLAUDE.md") ?? "").some(
            (line) => line.trim() === "@docs/agents/testing.md",
        ),
        evidence: `CLAUDE.md: ${JSON.stringify(after(run, "CLAUDE.md"))}`,
    }),
    "9.1a": (run) =>
        verdict(
            maxLines(run, "AGENTS.md", 200),
            "AGENTS.md has 200 lines or less.",
        ),
    "9.2": movedSections,
    "10.1": (run) => {
        const starts = run.messages
            .flatMap((message) => message.calls)
            .filter((call) => SUBAGENT_TOOLS.includes(call.name.toLowerCase()));
        return {
            passed: starts.length === 0,
            evidence: `${starts.length} subagent starts.`,
        };
    },
    "10.2": selfChecks,
};

const escapeRegExp = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The terms of a glossary: each `**Term**:` line and each `## Term` heading.
function glossaryTerms(glossary: string): string[] {
    return [...glossary.matchAll(/^\*\*([^*]+)\*\*:|^## (.+)$/gm)].map(
        (match) => (match[1] ?? match[2]).trim(),
    );
}

// The lists that the LLM grader examines item by item, keyed by statement id.
// A statement with no list here gets null.
export const statementLists: Record<string, (run: Run) => unknown> = {
    "8b": (run) => run.pointers,
    "9b": (run) => {
        const terms = run.glossary ? glossaryTerms(run.glossary) : [];
        return run.changes.flatMap((change) =>
            [...change.added]
                .map(([line, text]) => ({
                    path: change.path,
                    line,
                    text,
                    terms: terms.filter((term) =>
                        new RegExp(`\\b${escapeRegExp(term)}`, "i").test(text),
                    ),
                }))
                .filter((item) => item.terms.length > 0),
        );
    },
    "10a": (run) => {
        const added = new Set(
            run.changes.flatMap((change) =>
                [...change.added.values()].map((text) => text.trim()),
            ),
        );
        return run.changes.flatMap((change) =>
            change.removed
                .filter(({ text }) => text.trim() && !added.has(text.trim()))
                .map(({ line, text }) => ({ path: change.path, line, text })),
        );
    },
    "10b": (run) => run.knownMistakes,
};
