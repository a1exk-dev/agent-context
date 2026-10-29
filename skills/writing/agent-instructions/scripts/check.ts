// Check script of the agent-instructions Skill. It finds the countable rule
// problems in Agent instructions. Run it with `node` (Node.js 22.18 or later).
// It imports only `node:` built-ins, so it needs no install step.

import { Buffer } from "node:buffer";
import { readFileSync, statSync } from "node:fs";
import {
    basename,
    dirname,
    isAbsolute,
    join,
    relative,
    resolve,
    sep,
} from "node:path";
import { parseArgs } from "node:util";

const usage = `Usage: node check.ts <file>... --project <folder> --glossary <path|none>
       node check.ts --reports --file <file under review> <report>...

File form: checks each file for the rules that end with "(script check)" in
the rule files of the agent-instructions Skill. Writes JSON to stdout:
{ "findings": [ { reviewer, rule, ruleFile, heading, text, path, line, problem } ],
  "pointers": [ { path, line, heading, text, targets } ] }
The pointers list gives each sentence that names a file path. The glossary
gives the terms and their _Avoid_ words. The base list of technical terms
comes from references/technical-terms.md of the Skill.

Report form: checks the findings (Rule, Text, Problem, Correction) of the
reviewer reports of one file under review. Writes JSON to stdout:
{ "blocking": [ { reviewer, rule, ruleFile, heading, text, path, line,
                  problem, correction, report, reportLine } ],
  "advisory": [ ...the same fields ],
  "dropped": [ { report, reportLine, rule, text, problem, correction, reason } ] }
It drops each finding with a missing field, a Text quote that is not in the
file, or a Rule quote that is in no rule that ends with "(blocking)" or
"(advisory)". It sorts the other findings by the mark of their rule.

Report form for reader reports: add --copy <saved copy|none> and --tasks
<tasks file>, and give one reader report for each task, in the sequence of
the tasks. The tasks file is a JSON array:
[ { "task": "...", "kind": "typical", "tested": ["<quote>", ...] },
  { "task": "...", "kind": "out-of-scope" } ]
Each reader report has the headings "Part 1", "Part 2", and "Part 3". Each
line of part 2 or part 3 with a quotation gives one quote. Writes JSON:
{ "problems": [ { task, kind, report, text, line, problem } ],
  "unclear": [ { report, reportLine, part, text, line } ],
  "dropped": [ { report, reportLine, part, text, reason } ] }
It drops each quote that is not in the file. An out-of-scope task fails when
each place of a part-2 quote is on a line that is not in the copy ("none":
all lines are new). A typical task fails when no part-2 quote overlaps a
tested quote. A tested quote that is not in the file gives exit code 2.

Exit code: 0 for no findings, 1 for one or more findings (in the report form:
blocking or advisory; for reader reports: problems or unclear parts), 2 when
the check could not run (missing file, bad argument, unreadable report).`;

type Finding = {
    reviewer: string;
    rule: string | null;
    ruleFile: string;
    heading: string;
    text: string;
    path: string;
    line: number;
    problem: string;
};

// One piece of natural-language text: a paragraph, a list item, a heading, a
// table cell, or the frontmatter description. `text` joins its lines with
// "\n". `visible` is `text` with the Markdown or YAML marks blanked, at the
// same offsets. `starts[i]` is the offset where line `lines[i]` starts.
type Segment = {
    heading: boolean;
    text: string;
    visible: string;
    lines: number[];
    starts: number[];
};

const sentenceLimit = 25;
const skillBytes = 20_000;
const skillLines = 500;
const copyWords = 6;
const generalHeadings = ["notes", "other", "misc", "general"];
const entryLines = 200;
const entryBytes = 32 * 1024;
const entryFiles = [
    "AGENTS.md",
    "AGENTS.override.md",
    "CLAUDE.md",
    "CLAUDE.local.md",
];
const skillFields = [
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
];
// Marks a code span, a quote, or a URL in the masked text. It counts as one
// word and matches no word pattern.
const placeholder = "";

const technicalTerms = join(
    import.meta.dirname,
    "../references/technical-terms.md",
);

class UsageError extends Error {}

function main(argv: string[]): number {
    if (argv.includes("--reports")) return reportForm(argv);
    let args: ReturnType<typeof parseArguments>;
    try {
        args = parseArguments(argv);
    } catch (error) {
        process.stderr.write(`${(error as Error).message}\n\n${usage}\n`);
        return 2;
    }
    if (args === "help") {
        process.stdout.write(`${usage}\n`);
        return 0;
    }
    let rules: WordRule[];
    try {
        const glossary = args.glossary
            ? readGlossary(readFileSync(args.glossary, "utf8"))
            : { terms: [], avoid: [] };
        const base = readBaseList(readFileSync(technicalTerms, "utf8"));
        rules = [...wordRules, ...glossaryRules(glossary, base)];
    } catch (error) {
        process.stderr.write(
            `Cannot read the glossary or the base list: ${error}\n`,
        );
        return 2;
    }
    const findings: Finding[] = [];
    const pointers: Pointer[] = [];
    for (const path of args.files) {
        let source: string;
        try {
            source = readFileSync(path, "utf8");
        } catch (error) {
            process.stderr.write(`Cannot read ${path}: ${error}\n`);
            return 2;
        }
        findings.push(...checkText(path, source, rules));
        findings.push(...checkLoading(path, source, args.project));
        const plain = checkPlainLanguage(path, source, args.project);
        findings.push(...plain.findings);
        pointers.push(...plain.pointers);
    }
    process.stdout.write(
        `${JSON.stringify({ findings, pointers }, null, 2)}\n`,
    );
    return findings.length === 0 ? 0 : 1;
}

function parseArguments(argv: string[]) {
    const { values, positionals } = parseArgs({
        args: argv,
        allowPositionals: true,
        options: {
            project: { type: "string" },
            glossary: { type: "string" },
            help: { type: "boolean" },
        },
    });
    if (values.help) return "help" as const;
    if (positionals.length === 0) throw new UsageError("No file to check.");
    if (values.project === undefined)
        throw new UsageError("Missing --project <folder>.");
    if (values.glossary === undefined)
        throw new UsageError("Missing --glossary <path|none>.");
    if (!isFolder(values.project))
        throw new UsageError(`Project folder not found: ${values.project}`);
    if (values.glossary !== "none" && !isFile(values.glossary))
        throw new UsageError(`Glossary not found: ${values.glossary}`);
    return {
        files: positionals,
        project: values.project,
        glossary: values.glossary === "none" ? null : values.glossary,
    };
}

function isFolder(path: string) {
    try {
        return statSync(path).isDirectory();
    } catch {
        return false;
    }
}

function isFile(path: string) {
    try {
        return statSync(path).isFile();
    } catch {
        return false;
    }
}

// A rule that a pattern finds in the masked text of a sentence. Each rule
// gives only the reference to its text in the rule file.
type WordRule = {
    rule: string | null;
    heading: string;
    pattern: RegExp;
    problem: (
        match: string,
        atStart: boolean,
        found: RegExpMatchArray,
    ) => string | null;
};

const wordRules: WordRule[] = [
    {
        rule: null,
        heading: "When you select a word",
        pattern: /\b(?:should|may|might|would|shall|could)\b/gi,
        problem: (word) => `The sentence has the non-approved word "${word}".`,
    },
    {
        rule: null,
        heading: "Before a step with a risk",
        pattern:
            /\b(?:IMPORTANT|CRITICAL|MUST|NEVER|ALWAYS|SHOULD|MAY|NOTE|WARNING)\b/g,
        problem: (word) => `The sentence has "${word}" in capital letters.`,
    },
    {
        rule: "8.1",
        heading: "When you write punctuation",
        pattern: /;/g,
        problem: () => "The sentence has a semicolon.",
    },
    {
        rule: "2.2",
        heading: "When you write a multi-word noun",
        pattern: /\S+/g,
        problem: (token) => {
            if (token.includes("/")) return null;
            const noun = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
            const parts = noun.split("-");
            if (
                parts.length <= 3 ||
                !parts.every((p) => /^[\p{L}\p{N}]+$/u.test(p))
            )
                return null;
            return `The noun "${noun}" has ${parts.length} words joined by hyphens.`;
        },
    },
];

// Gives the rules that use the glossary terms, their `_Avoid_` words, and the
// base list of technical-terms.md.
function glossaryRules(glossary: Glossary, base: string[]): WordRule[] {
    const rules: WordRule[] = [];
    const known = new Set(
        [...base, ...glossary.terms].map((term) => term.toLowerCase()),
    );
    const words = (word: string, plural: boolean) =>
        new RegExp(
            `(?<![\\p{L}\\p{N}_-])${escapeRegExp(word).replace(/\s+/g, "\\s+")}${plural ? "(?:e?s)?" : ""}(?![\\p{L}\\p{N}_-])`,
            "giu",
        );
    const places = glossary.terms.map((term) => ({
        term,
        pattern: words(term, true),
    }));
    // Tells whether the match is in a place of a glossary term, in any case,
    // other than the term `except`.
    const inTerm = (found: RegExpMatchArray, except: string | null) => {
        const from = found.index ?? 0;
        const to = from + found[0].length;
        return places.some(
            ({ term, pattern }) =>
                term !== except &&
                [...(found.input ?? "").matchAll(pattern)].some(
                    (place) =>
                        (place.index ?? 0) <= from &&
                        (place.index ?? 0) + place[0].length >= to,
                ),
        );
    };
    for (const avoid of glossary.avoid)
        rules.push({
            rule: "1.11",
            heading: "When you select a technical noun",
            pattern: words(avoid, false),
            problem: (word, _atStart, found) =>
                inTerm(found, null)
                    ? null
                    : `The sentence has "${word}", which the glossary gives after _Avoid_.`,
        });
    for (const term of glossary.terms)
        rules.push({
            rule: "6.2",
            heading: "When you write a sentence",
            pattern: words(term, true),
            problem: (word, atStart, found) => {
                if (inTerm(found, term)) return null;
                const stem = word.slice(0, term.length);
                if (stem === term) return null;
                const capital = term[0].toUpperCase() + term.slice(1);
                if (atStart && stem === capital) return null;
                return `The sentence has "${word}", but the glossary term is "${term}".`;
            },
        });
    rules.push({
        rule: "1.8",
        heading: "When you select a technical noun",
        pattern: /\*\*([^*\n]+?)\*\*/g,
        problem: (bold) => {
            const term = bold
                .slice(2, -2)
                .replace(/[:.]$/, "")
                .replace(/\s+/g, " ")
                .trim();
            const lower = term.toLowerCase();
            if ([lower, lower.replace(/e?s$/, "")].some((t) => known.has(t)))
                return null;
            return `The bold term "${term}" is not in the glossary or in the base list of technical-terms.md.`;
        },
    });
    return rules;
}

function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Glossary = { terms: string[]; avoid: string[] };

// Reads the terms (`**Term**:`) and the `_Avoid_:` words of a glossary.
function readGlossary(source: string): Glossary {
    const glossary: Glossary = { terms: [], avoid: [] };
    for (const line of source.split(/\r?\n/)) {
        const term = /^\*\*([^*]+)\*\*:/.exec(line);
        if (term) glossary.terms.push(term[1].trim());
        const avoid = /^_Avoid_:\s*(.*)$/.exec(line);
        if (avoid)
            for (const word of avoid[1].split(",")) {
                const clean = word.replace(/["“”.]/g, "").trim();
                if (clean !== "") glossary.avoid.push(clean);
            }
    }
    return glossary;
}

// Reads the terms of the base list in technical-terms.md: the first cell of
// each table row and each list item after the heading "Base list".
function readBaseList(source: string): string[] {
    const terms: string[] = [];
    const start = source.indexOf("\n## Base list");
    for (const line of source.slice(start).split(/\r?\n/)) {
        const cell = /^\|\s*([^|]+?)\s*\|/.exec(line);
        if (cell && cell[1] !== "Term" && !/^[\s:-]+$/.test(cell[1]))
            terms.push(cell[1]);
        const item = /^-\s+(.+?)\s*$/.exec(line);
        if (item) terms.push(item[1]);
    }
    return terms;
}

function checkText(path: string, source: string, rules: WordRule[]): Finding[] {
    const findings: Finding[] = [];
    for (const { segment, masked, start, end, text } of fileSentences(source)) {
        const finding = (
            rule: string | null,
            heading: string,
            offset: number,
            problem: string,
        ) => ({
            reviewer: "ASD-STE100",
            rule,
            ruleFile: "references/ste-rules.md",
            heading,
            text,
            path,
            line: lineAt(segment, offset),
            problem,
        });
        if (!segment.heading) {
            for (const [s, e, count] of wordCounts(masked, start, end)) {
                if (count <= sentenceLimit) continue;
                findings.push({
                    ...finding(
                        null,
                        "When you write a sentence",
                        firstVisible(masked, s),
                        `The sentence has ${count} words.`,
                    ),
                    text: segment.text.slice(firstVisible(masked, s), e).trim(),
                });
            }
        }
        const words = masked.slice(start, end);
        for (const { rule, heading, pattern, problem } of rules) {
            for (const match of words.matchAll(pattern)) {
                const message = problem(
                    match[0],
                    match.index === firstVisible(words, 0),
                    match,
                );
                if (message === null) continue;
                findings.push(
                    finding(rule, heading, start + match.index, message),
                );
            }
        }
    }
    return findings;
}

type Sentence = {
    segment: Segment;
    masked: string;
    start: number;
    end: number;
    // The sentence, verbatim from the file.
    text: string;
    line: number;
    // The text of the last heading before the sentence, or null.
    heading: string | null;
};

// Gives each sentence of the natural-language text of a file, in file order.
function fileSentences(source: string): Sentence[] {
    const result: Sentence[] = [];
    let heading: string | null = null;
    for (const segment of segments(source)) {
        const masked = mask(segment.visible);
        if (segment.heading) heading = segment.visible.trim();
        for (const [start, end] of sentences(masked)) {
            const from = firstVisible(masked, start);
            result.push({
                segment,
                masked,
                start,
                end,
                text: segment.text.slice(from, end).trim(),
                line: lineAt(segment, from),
                heading,
            });
        }
    }
    return result;
}

type Pointer = {
    path: string;
    line: number;
    heading: string | null;
    text: string;
    targets: string[];
};

// The plain-language rules of one file: general headings, images, Mermaid
// diagrams, pointer targets that do not exist, and sentences copied from a
// pointer target. It also gives each sentence that names a file path.
function checkPlainLanguage(
    path: string,
    source: string,
    project: string,
): { findings: Finding[]; pointers: Pointer[] } {
    const findings: Finding[] = [];
    const pointers: Pointer[] = [];
    const finding = (
        heading: string,
        text: string,
        line: number,
        problem: string,
    ) =>
        findings.push({
            reviewer: "ISO 24495-1",
            rule: null,
            ruleFile: "references/plain-language-checks.md",
            heading,
            text,
            path,
            line,
            problem,
        });
    for (const segment of segments(source)) {
        const text = segment.visible.trim();
        if (
            segment.heading &&
            generalHeadings.includes(text.replace(/:$/, "").toLowerCase())
        )
            finding(
                "When you put the text in sections and lists",
                text,
                segment.lines[0],
                `The heading "${text}" is applicable to all subjects.`,
            );
    }
    const targets = new Map<string, string>();
    const prose = fileSentences(source).filter((s) => !s.segment.heading);
    for (const sentence of prose) {
        const from = firstVisible(sentence.masked, sentence.start);
        const words = sentence.masked.slice(from, sentence.end);
        if (/!\[[^\]]*\]|<img\b/i.test(words))
            finding(
                "When you select the words and the tone",
                sentence.text,
                sentence.line,
                "The sentence has an image.",
            );
        const named = filePaths(sentence.text, words);
        if (named.length === 0) continue;
        pointers.push({
            path,
            line: sentence.line,
            heading: sentence.heading,
            text: sentence.text,
            targets: named,
        });
        for (const target of named) {
            const found = findTarget(target, path, project);
            if (found === null)
                finding(
                    "When you put the text in sections and lists",
                    sentence.text,
                    sentence.line,
                    `The pointer target "${target}" does not exist.`,
                );
            else if (found !== resolve(path) && isFile(found))
                targets.set(target, found);
        }
    }
    for (const [line, text] of fenceLines(source))
        if (/^\s*(`{3,}|~{3,})\s*mermaid\b/i.test(text))
            finding(
                "When you select the words and the tone",
                text.trim(),
                line,
                "The file has a Mermaid diagram.",
            );
    const texts = [...targets].map(
        ([target, found]) =>
            [target, collapseSpaces(readFileSync(found, "utf8"))] as const,
    );
    for (const sentence of prose) {
        const count = wordCounts(
            sentence.masked,
            sentence.start,
            sentence.end,
        )[0][2];
        if (count < copyWords) continue;
        const copy = texts.find(([, text]) =>
            text.includes(collapseSpaces(sentence.text)),
        );
        if (copy)
            finding(
                "When you select the text",
                sentence.text,
                sentence.line,
                `The sentence of ${count} words is also in the pointer target "${copy[0]}".`,
            );
    }
    return { findings, pointers };
}

// Gives the text with one space for each run of white space, and no white
// space at the start or the end.
function collapseSpaces(text: string) {
    return text.replace(/\s+/g, " ").trim();
}

// Gives each file path that a sentence names: in a code span, or as a bare
// word. A path has a known file extension, or it has a "/" and starts with
// ".", "/", or "~" or stops with "/". A placeholder or a pattern is not a path.
function filePaths(text: string, masked: string): string[] {
    const found: [number, string][] = [];
    for (const match of text.matchAll(/`([^`]+)`/g))
        found.push([match.index, match[1].trim()]);
    for (const match of masked.matchAll(/\S+/g))
        found.push([
            match.index,
            match[0].replace(/^[("'[]+/, "").replace(/[.,:;!?)\]"']+$/, ""),
        ]);
    const paths = found
        .sort((a, b) => a[0] - b[0])
        .map(([, token]) => token)
        .filter(isPath);
    return [...new Set(paths)];
}

function isPath(token: string) {
    // A name such as "Node.js" is not a path.
    if (/^[A-Z][a-z]+\.js$/.test(token)) return false;
    if (/[<>*{}$|\s`@]/.test(token) || /^[a-z][\w+.-]*:/i.test(token))
        return false;
    return (
        /\.(?:md|mdc|json|jsonl|ts|js|mjs|cjs|yml|yaml|toml|txt|sh|py)$/i.test(
            token,
        ) ||
        (token.includes("/") && /^[./~]|\/$/.test(token))
    );
}

// Finds a pointer target relative to the folder of the file or to a folder
// above it, up to the project folder. Gives the absolute path, or null when
// the target does not exist. A path from the home folder ("~") is not
// examined.
function findTarget(target: string, path: string, project: string) {
    if (target.startsWith("~")) return target;
    if (isAbsolute(target)) return exists(target) ? target : null;
    for (const folder of foldersFromRoot(path, project).reverse()) {
        const candidate = join(folder, target);
        if (exists(candidate)) return candidate;
    }
    return null;
}

function exists(path: string) {
    try {
        statSync(path);
        return true;
    } catch {
        return false;
    }
}

// The loading rules of one file: the file size, the line count, the Skill
// frontmatter, and the `@path` lines.
function checkLoading(
    path: string,
    source: string,
    project: string,
): Finding[] {
    const findings: Finding[] = [];
    const firstLine = source.split(/\r?\n/)[0];
    const finding = (
        ruleFile: string,
        heading: string,
        problem: string,
        text = firstLine,
        line = 1,
    ) =>
        findings.push({
            reviewer: "loading",
            rule: null,
            ruleFile,
            heading,
            text,
            path,
            line,
            problem,
        });
    if (basename(path) === "SKILL.md") {
        const bytes = Buffer.byteLength(source);
        if (bytes > skillBytes)
            finding(
                "references/loading-rules.md",
                "When you examine the file size",
                `SKILL.md has ${bytes} bytes. The limit is 20,000 bytes.`,
            );
        const lines = lineCount(source);
        if (lines >= skillLines)
            finding(
                "references/agent-skills-spec.md",
                "When you write the body",
                `SKILL.md has ${lines} lines. The limit is less than 500 lines.`,
            );
        const field = (problem: string, at?: Field) =>
            finding(
                "references/agent-skills-spec.md",
                "When you write the folder and the frontmatter",
                problem,
                at?.text,
                at?.line,
            );
        const fields = frontmatter(source);
        const name = fields.get("name");
        if (name === undefined) field("The frontmatter has no name.");
        else if (!/^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$/.test(name.value))
            field(
                `The name "${name.value}" is not 1 to 64 lowercase letters, digits, and hyphens, with no hyphen at the start or end and no "--".`,
                name,
            );
        const folder = basename(dirname(resolve(path)));
        if (name !== undefined && name.value !== folder)
            field(
                `The name "${name.value}" is not the folder name "${folder}".`,
                name,
            );
        const description = fields.get("description");
        const length = description ? [...description.value].length : 0;
        if (description === undefined)
            field("The frontmatter has no description.");
        else if (length < 1 || length > 1024)
            field(
                `The description has ${length} characters. The limit is 1 to 1024 characters.`,
                description,
            );
        for (const [key, at] of fields)
            if (!skillFields.includes(key))
                field(`The frontmatter field "${key}" is not permitted.`, at);
    }
    if (entryFiles.includes(basename(path))) {
        const lines = lineCount(source);
        if (lines >= entryLines)
            finding(
                "references/loading-rules.md",
                "When you examine the file size",
                `${basename(path)} has ${lines} lines. The limit is less than 200 lines.`,
            );
        const bytes = entryBytesFromRoot(path, project);
        if (bytes >= entryBytes)
            finding(
                "references/loading-rules.md",
                "When you examine the file size",
                `The entry files from the project root to this file have ${bytes} bytes. The limit is less than 32,768 bytes.`,
            );
    }
    for (const [line, text] of proseLines(source)) {
        for (const match of mask(text).matchAll(/(?<=^|\s)@[^\s]+/g)) {
            const target = match[0].replace(/[.,:;!?)]+$/, "");
            if (!target.includes("/") && !target.includes(".")) continue;
            if (basename(path) === "CLAUDE.md" && target === "@AGENTS.md")
                continue;
            finding(
                "references/loading-rules.md",
                "When you select a feature",
                `The file imports "${target}" with an @path line.`,
                text.trim(),
                line,
            );
        }
    }
    return findings;
}

// Gives the total file size of the entry files in each folder from the
// project folder to the folder of the file.
function entryBytesFromRoot(path: string, project: string) {
    let total = 0;
    for (const folder of foldersFromRoot(path, project))
        for (const name of entryFiles)
            if (isFile(join(folder, name)))
                total += statSync(join(folder, name)).size;
    return total;
}

// Gives each folder from the project folder to the folder of the file. For a
// file outside the project folder, gives only the folder of the file.
function foldersFromRoot(path: string, project: string) {
    const folder = dirname(resolve(path));
    const root = resolve(project);
    const inside = relative(root, folder);
    if (inside.startsWith("..") || isAbsolute(inside)) return [folder];
    const folders = [root];
    for (const part of inside.split(sep).filter(Boolean))
        folders.push(join(folders.at(-1) as string, part));
    return folders;
}

// Gives each opening fence line of a code block, with its line number.
function fenceLines(source: string): [number, string][] {
    const result: [number, string][] = [];
    let fence: string | null = null;
    source.split(/\r?\n/).forEach((line, i) => {
        const match = /^\s*(`{3,}|~{3,})/.exec(line);
        if (fence !== null) {
            if (line.trim().startsWith(fence)) fence = null;
        } else if (match) {
            fence = match[1];
            result.push([i + 1, line]);
        }
    });
    return result;
}

// Gives each line outside the frontmatter and the code blocks, with its
// line number.
function proseLines(source: string): [number, string][] {
    const lines = source.split(/\r?\n/);
    const result: [number, string][] = [];
    let first = 0;
    if (lines[0] === "---") first = lines.indexOf("---", 1) + 1;
    let fence: string | null = null;
    for (let i = first; i < lines.length; i++) {
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(lines[i]);
        if (fence !== null) {
            if (lines[i].trim().startsWith(fence)) fence = null;
        } else if (fenceMatch) fence = fenceMatch[1];
        else result.push([i + 1, lines[i]]);
    }
    return result;
}

function lineCount(source: string) {
    return source.split("\n").length - (source.endsWith("\n") ? 1 : 0);
}

type Field = { value: string; text: string; line: number };

// Gives the top-level fields of the YAML frontmatter, in file order. It reads
// a plain value, a quoted value on one line, and a block scalar (`|` or `>`).
function frontmatter(source: string): Map<string, Field> {
    const fields = new Map<string, Field>();
    const lines = source.split(/\r?\n/);
    if (lines[0] !== "---") return fields;
    const end = lines.indexOf("---", 1);
    if (end < 0) return fields;
    for (let i = 1; i < end; i++) {
        const match = /^([^\s#:][^:]*):(?:\s+(.*))?$/.exec(lines[i]);
        if (!match) continue;
        const at = { text: lines[i], line: i + 1 };
        let value = (match[2] ?? "").trim();
        if (/^[|>][+-]?$/.test(value)) {
            const block: string[] = [];
            while (i + 1 < end && /^(\s|$)/.test(lines[i + 1]))
                block.push(lines[++i].trim());
            value = block.join(value[0] === "|" ? "\n" : " ").trim();
        } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/\\(.)/g, "$1");
        } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1).replaceAll("''", "'");
        }
        fields.set(match[1], { value, ...at });
    }
    return fields;
}

// Splits a file into segments of natural-language text. It skips code
// blocks, frontmatter fields other than `description`, table separator rows,
// and the `_Avoid_:` lines of a glossary. It blanks list markers, heading
// marks, and table pipes, so that each segment keeps the columns of its lines.
function segments(source: string): Segment[] {
    const lines = source.split(/\r?\n/);
    const result: Segment[] = [];
    let current: Segment | null = null;
    let fence: string | null = null;
    let first = 0;

    const start = (
        heading: boolean,
        line: number,
        visible: string,
        text = visible,
    ) => {
        const segment = { heading, text, visible, lines: [line], starts: [0] };
        result.push(segment);
        return segment;
    };

    if (lines[0] === "---") {
        const end = lines.indexOf("---", 1);
        if (end > 0) {
            for (let i = 1; i < end; i++) {
                const match = /^description:\s*/.exec(lines[i]);
                if (match)
                    start(
                        false,
                        i + 1,
                        unquoteYaml(lines[i], match[0].length),
                        lines[i],
                    );
            }
            first = end + 1;
        }
    }

    for (let i = first; i < lines.length; i++) {
        const line = lines[i];
        const number = i + 1;
        if (fence !== null) {
            if (line.trim().startsWith(fence)) fence = null;
            continue;
        }
        const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
        if (fenceMatch) {
            fence = fenceMatch[1];
            current = null;
            continue;
        }
        // The `_Avoid_:` line of a glossary entry gives words not to use.
        if (line.trim() === "" || line.startsWith("_Avoid_:")) {
            current = null;
            continue;
        }
        const headingMatch = /^#{1,6}\s/.exec(line);
        if (headingMatch) {
            start(true, number, blank(line, headingMatch[0].length), line);
            current = null;
            continue;
        }
        if (/^\s*\|/.test(line)) {
            current = null;
            if (/^[\s|:-]+$/.test(line)) continue;
            for (const cell of tableCells(line))
                start(false, number, cell, line);
            continue;
        }
        const itemMatch = /^\s*(?:>\s*)?(?:[-*+]|\d+[.)])\s+/.exec(line);
        if (itemMatch) {
            current = start(
                false,
                number,
                blank(line, itemMatch[0].length),
                line,
            );
            continue;
        }
        const visible = line.replace(/^\s*>\s?/, (m) => " ".repeat(m.length));
        if (current === null) {
            current = start(false, number, visible, line);
        } else {
            current.starts.push(current.text.length + 1);
            current.lines.push(number);
            current.text += `\n${line}`;
            current.visible += `\n${visible}`;
        }
    }
    return result;
}

function blank(line: string, length: number) {
    return " ".repeat(length) + line.slice(length);
}

// Gives the value of a frontmatter line at its columns. The quotation marks of
// a YAML string become spaces, and `\"` becomes ` "`.
function unquoteYaml(line: string, valueStart: number) {
    let value = line.slice(valueStart);
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
        value = ` ${value.slice(1, -1)} `;
        if (quote === '"') value = value.replaceAll('\\"', ' "');
    }
    return " ".repeat(valueStart) + value;
}

// Gives each cell of a table row as the full row with the other cells and the
// pipes blanked, so that each cell keeps its columns.
function tableCells(line: string): string[] {
    const cells: string[] = [];
    let cellStart = -1;
    let inCode = false;
    for (let i = 0; i <= line.length; i++) {
        const char = line[i];
        if (char === "`") inCode = !inCode;
        if (i < line.length && (char !== "|" || inCode || line[i - 1] === "\\"))
            continue;
        if (cellStart >= 0) {
            const cell = line.slice(cellStart, i);
            if (cell.trim() !== "") cells.push(" ".repeat(cellStart) + cell);
        }
        cellStart = i + 1;
    }
    return cells;
}

// Replaces each code span, quoted text, and URL with a placeholder and spaces
// of the same length. The masked text keeps the offsets of the segment. A
// quoted text that stops with ".", "!", or "?" keeps that mark in the place of
// its closing quotation mark, so that the sentence stops there.
function mask(text: string): string {
    const hide = (match: string) => placeholder + " ".repeat(match.length - 1);
    const hideQuote = (match: string) =>
        /[.!?]$/.test(match.slice(0, -1))
            ? `${hide(match.slice(0, -1))}${match.at(-2)}`
            : hide(match);
    return text
        .replace(/(`+)[\s\S]*?\1/g, hide)
        .replace(/\]\([^)\s]*\)/g, (m) => `]${" ".repeat(m.length - 1)}`)
        .replace(/https?:\/\/[^\s)]*[^\s).,:]/g, hide)
        .replace(/"[^"]*"/g, hideQuote)
        .replace(/“[^”]*”/g, hideQuote)
        .replace(/(?<=^|[\s([])'[^'\n]*'(?![\p{L}\p{N}])/gu, hideQuote);
}

// Gives the [start, end) offsets of each sentence in the masked text. A
// sentence stops after ".", "!", or "?" before a space or the end, and after a
// colon at the end of a line. It does not stop in parentheses.
function sentences(masked: string): [number, number][] {
    const result: [number, number][] = [];
    let start = 0;
    let depth = 0;
    for (let i = 0; i < masked.length; i++) {
        const char = masked[i];
        if (char === "(") depth++;
        else if (char === ")") depth = Math.max(0, depth - 1);
        if (depth > 0) continue;
        const next = masked[i + 1];
        const stop =
            (/[.!?]/.test(char) && (next === undefined || /\s/.test(next))) ||
            (char === ":" && /^[ \t]*(\n|$)/.test(masked.slice(i + 1)));
        if (stop) {
            result.push([start, i + 1]);
            start = i + 1;
        }
    }
    if (masked.slice(start).trim() !== "") result.push([start, masked.length]);
    return result.filter(([s, e]) => masked.slice(s, e).trim() !== "");
}

// Gives the word count of a sentence, and of each text in parentheses in it,
// as [start, end, count]. Text in parentheses counts as 1 word in its
// sentence, and it is also a sentence with its own count (rule 8.5).
function wordCounts(
    masked: string,
    start: number,
    end: number,
): [number, number, number][] {
    const result: [number, number, number][] = [];
    let outer = "";
    let depth = 0;
    let groupStart = 0;
    for (let i = start; i < end; i++) {
        const char = masked[i];
        if (char === "(") {
            if (depth === 0) {
                groupStart = i + 1;
                outer += ` ${placeholder} `;
            }
            depth++;
            continue;
        }
        if (char === ")" && depth > 0) {
            depth--;
            if (depth === 0) result.push(...wordCounts(masked, groupStart, i));
            continue;
        }
        if (depth === 0) outer += char;
    }
    result.unshift([start, end, countWords(outer)]);
    return result;
}

function countWords(text: string) {
    return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token))
        .length;
}

function firstVisible(masked: string, offset: number) {
    const match = /\S/.exec(masked.slice(offset));
    return match ? offset + match.index : offset;
}

function lineAt(segment: Segment, offset: number) {
    let index = 0;
    while (
        index + 1 < segment.starts.length &&
        segment.starts[index + 1] <= offset
    )
        index++;
    return segment.lines[index];
}

// The rule files of the reviewers, relative to the Skill folder, with the
// reviewer that uses each file.
const ruleFiles: [string, string][] = [
    ["references/ste-rules.md", "ASD-STE100"],
    ["references/technical-terms.md", "ASD-STE100"],
    ["references/plain-language-checks.md", "ISO 24495-1"],
    ["references/loading-rules.md", "loading"],
    ["references/agent-skills-spec.md", "loading"],
];
const fields = ["rule", "text", "problem", "correction"] as const;

type ReportFinding = Record<(typeof fields)[number], string> & {
    report: string;
    reportLine: number;
};

// One rule of a rule file: a paragraph, a list item, or a table cell, with
// the mark at its end, or null.
type RuleUnit = {
    ruleFile: string;
    reviewer: string;
    heading: string;
    text: string;
    indent: number;
    mark: string | null;
};

// The report form: checks the findings of the reviewer reports of one file.
function reportForm(argv: string[]): number {
    let file: string;
    let reports: string[];
    let readers: { copy: string; tasks: string } | null = null;
    try {
        const { values, positionals } = parseArgs({
            args: argv,
            allowPositionals: true,
            options: {
                reports: { type: "boolean" },
                file: { type: "string" },
                copy: { type: "string" },
                tasks: { type: "string" },
            },
        });
        if (values.file === undefined)
            throw new UsageError("Missing --file <file under review>.");
        if (positionals.length === 0)
            throw new UsageError("No report to check.");
        if ((values.copy === undefined) !== (values.tasks === undefined))
            throw new UsageError(
                "Give --copy <path|none> and --tasks <path> together.",
            );
        file = values.file;
        reports = positionals;
        if (values.copy !== undefined && values.tasks !== undefined)
            readers = { copy: values.copy, tasks: values.tasks };
    } catch (error) {
        process.stderr.write(`${(error as Error).message}\n\n${usage}\n`);
        return 2;
    }
    if (readers !== null) return readerForm(file, readers, reports);
    let source: string;
    let units: RuleUnit[];
    const sources: [string, string][] = [];
    try {
        source = readFileSync(file, "utf8");
        units = ruleFiles.flatMap(([ruleFile, reviewer]) =>
            ruleUnits(
                ruleFile,
                reviewer,
                readFileSync(join(import.meta.dirname, "..", ruleFile), "utf8"),
            ),
        );
        for (const report of reports)
            sources.push([report, readFileSync(report, "utf8")]);
    } catch (error) {
        process.stderr.write(`Cannot read a file: ${error}\n`);
        return 2;
    }
    const target = comparableWithOffsets(source);
    const blocking: object[] = [];
    const advisory: object[] = [];
    const dropped: object[] = [];
    for (const [report, text] of sources) {
        for (const found of reportFindings(report, text)) {
            const drop = (reason: string) => dropped.push({ ...found, reason });
            const missing = fields.find((field) => found[field] === "");
            if (missing) {
                drop(
                    `The finding has no ${missing[0].toUpperCase()}${missing.slice(1)} field.`,
                );
                continue;
            }
            const quote = quoted(found.text);
            const at =
                quote === null ? -1 : target.text.indexOf(comparable(quote));
            if (quote === null || quote.trim() === "" || at < 0) {
                drop("The Text quote is not in the file under review.");
                continue;
            }
            const ruleQuote = quoted(found.rule);
            const unit = ruleQuote === null ? null : findRule(units, ruleQuote);
            if (unit === null) {
                drop("The Rule quote is in no rule file.");
                continue;
            }
            if (unit.mark !== "blocking" && unit.mark !== "advisory") {
                drop(
                    unit.mark === "script check"
                        ? 'The rule ends with "(script check)". The check script examines it.'
                        : 'The rule does not end with "(blocking)" or "(advisory)".',
                );
                continue;
            }
            const line = source.slice(0, target.offsets[at]).split("\n").length;
            (unit.mark === "blocking" ? blocking : advisory).push({
                reviewer: unit.reviewer,
                rule: ruleNumber(unit.text),
                ruleFile: unit.ruleFile,
                heading: unit.heading,
                text: quote,
                path: file,
                line,
                problem: found.problem,
                correction: found.correction,
                report: found.report,
                reportLine: found.reportLine,
            });
        }
    }
    process.stdout.write(
        `${JSON.stringify({ blocking, advisory, dropped }, null, 2)}\n`,
    );
    return blocking.length + advisory.length === 0 ? 0 : 1;
}

type ReaderTask = { kind: "typical" | "out-of-scope"; tested: string[] };

// One quote in part 2 or part 3 of a reader report.
type ReaderQuote = {
    report: string;
    reportLine: number;
    part: 2 | 3;
    text: string;
};

// The text of the file under review, with the lines that the job added or
// changed.
type Target = {
    source: string;
    text: string;
    offsets: number[];
    changed: Set<number>;
};

class ReaderError extends Error {}

// The report form for reader reports: checks the reports of the reader tasks
// of one file. The reports are in the sequence of the tasks.
function readerForm(
    file: string,
    input: { copy: string; tasks: string },
    reports: string[],
): number {
    let target: Target;
    let tasks: ReaderTask[];
    const quotes: ReaderQuote[][] = [];
    // The places of each tested quote of each task.
    const testedPlaces: [number, number][][][] = [];
    try {
        const source = readFileSync(file, "utf8");
        const copy =
            input.copy === "none" ? null : readFileSync(input.copy, "utf8");
        target = {
            source,
            ...comparableWithOffsets(source),
            changed: changedLines(copy, source),
        };
        tasks = readerTasks(readFileSync(input.tasks, "utf8"));
        if (tasks.length !== reports.length)
            throw new ReaderError(
                `The tasks file gives ${tasks.length} tasks, but there are ${reports.length} reports.`,
            );
        tasks.forEach((task, i) => {
            testedPlaces.push(
                task.tested.map((quote) => {
                    const found = occurrences(target, quote);
                    if (found.length === 0)
                        throw new ReaderError(
                            `The tested quote "${quote}" of task ${i + 1} is not in the file under review.`,
                        );
                    return found;
                }),
            );
        });
        for (const report of reports)
            quotes.push(readerQuotes(report, readFileSync(report, "utf8")));
    } catch (error) {
        process.stderr.write(
            error instanceof ReaderError
                ? `${error.message}\n`
                : `Cannot read a file: ${error}\n`,
        );
        return 2;
    }
    const problems: object[] = [];
    const unclear: object[] = [];
    const dropped: object[] = [];
    tasks.forEach((task, i) => {
        const used: [number, number][][] = [];
        for (const quote of quotes[i]) {
            const found = occurrences(target, quote.text);
            if (found.length === 0) {
                dropped.push({
                    ...quote,
                    reason: "The quote is not in the file under review.",
                });
                continue;
            }
            const line = lineOf(target, found[0][0]);
            if (quote.part === 3) {
                unclear.push({ ...quote, line });
                continue;
            }
            used.push(found);
            const changed = found.every(([start, end]) => {
                for (
                    let k = lineOf(target, start);
                    k <= lineOf(target, end - 1);
                    k++
                )
                    if (target.changed.has(k)) return true;
                return false;
            });
            if (task.kind === "out-of-scope" && changed)
                problems.push({
                    task: i + 1,
                    kind: task.kind,
                    report: quote.report,
                    text: quote.text,
                    line,
                    problem:
                        "The out-of-scope task uses a part that the job added or changed.",
                });
        }
        for (const [k, tested] of testedPlaces[i].entries()) {
            const overlaps = tested.some(([start, end]) =>
                used.some((places) =>
                    places.some(([s, e]) => s < end && start < e),
                ),
            );
            if (!overlaps)
                problems.push({
                    task: i + 1,
                    kind: task.kind,
                    report: reports[i],
                    text: task.tested[k],
                    line: lineOf(target, tested[0][0]),
                    problem:
                        "Part 2 of the report does not use the tested quote.",
                });
        }
    });
    process.stdout.write(
        `${JSON.stringify({ problems, unclear, dropped }, null, 2)}\n`,
    );
    return problems.length + unclear.length === 0 ? 0 : 1;
}

// Reads the tasks file: a JSON array with one object for each reader task.
function readerTasks(source: string): ReaderTask[] {
    let tasks: unknown;
    try {
        tasks = JSON.parse(source);
    } catch (error) {
        throw new ReaderError(`The tasks file is not JSON: ${error}`);
    }
    if (!Array.isArray(tasks))
        throw new ReaderError("The tasks file is not a JSON array.");
    return tasks.map((task, i) => {
        const kind = task?.kind;
        const tested = task?.tested ?? [];
        if (kind !== "typical" && kind !== "out-of-scope")
            throw new ReaderError(
                `Task ${i + 1} in the tasks file has no kind "typical" or "out-of-scope".`,
            );
        if (
            !Array.isArray(tested) ||
            tested.some((quote) => typeof quote !== "string") ||
            (kind === "typical" && tested.length === 0)
        )
            throw new ReaderError(
                `Typical task ${i + 1} in the tasks file has no list of tested quotes.`,
            );
        return { kind, tested };
    });
}

// Gives the quotes of part 2 and part 3 of a reader report. Each line of these
// parts that has a quotation mark gives one quote.
function readerQuotes(report: string, text: string): ReaderQuote[] {
    const result: ReaderQuote[] = [];
    const parts = new Set<number>();
    let part = 0;
    text.split(/\r?\n/).forEach((line, i) => {
        const heading = /^\s*(?:#{1,6}\s*)?(?:\*\*)?part\s*([123])\b/i.exec(
            line,
        );
        if (heading) {
            part = Number(heading[1]);
            parts.add(part);
            return;
        }
        const quote = quoted(line);
        if ((part === 2 || part === 3) && quote !== null)
            result.push({ report, reportLine: i + 1, part, text: quote });
    });
    for (const wanted of [2, 3])
        if (!parts.has(wanted))
            throw new ReaderError(
                `The reader report ${report} has no part ${wanted}.`,
            );
    return result;
}

// Gives the start and end offsets in the comparable text of each place of the
// quote.
function occurrences(target: Target, quote: string): [number, number][] {
    const wanted = comparable(quote);
    const result: [number, number][] = [];
    if (wanted === "") return result;
    for (
        let at = target.text.indexOf(wanted);
        at >= 0;
        at = target.text.indexOf(wanted, at + 1)
    )
        result.push([at, at + wanted.length]);
    return result;
}

// Gives the line in the file of an offset in the comparable text.
function lineOf(target: Target, at: number) {
    return target.source.slice(0, target.offsets[at]).split("\n").length;
}

// Gives the numbers of the lines of the file that are not in the copy, as a
// line diff shows them. With no copy (the write job), all lines are new.
function changedLines(copy: string | null, source: string): Set<number> {
    const lines = source.split(/\r?\n/);
    const all = new Set(lines.map((_, i) => i + 1));
    if (copy === null) return all;
    const old = copy.split(/\r?\n/);
    // common[i][j]: length of the longest common line sequence of
    // lines[i..] and old[j..].
    const common = Array.from({ length: lines.length + 1 }, () =>
        new Array<number>(old.length + 1).fill(0),
    );
    for (let i = lines.length - 1; i >= 0; i--)
        for (let j = old.length - 1; j >= 0; j--)
            common[i][j] =
                lines[i] === old[j]
                    ? common[i + 1][j + 1] + 1
                    : Math.max(common[i + 1][j], common[i][j + 1]);
    for (let i = 0, j = 0; i < lines.length && j < old.length; ) {
        if (lines[i] === old[j]) {
            all.delete(i + 1);
            i++;
            j++;
        } else if (common[i + 1][j] >= common[i][j + 1]) i++;
        else j++;
    }
    return all;
}

// Gives each finding of a report. A finding is a group of field lines
// (Rule, Text, Problem, Correction). A Rule line or a field that the group
// already has starts a new finding. The lines after a field line, up to a
// blank line, a heading, or the next field line, continue its value.
function reportFindings(report: string, text: string): ReportFinding[] {
    const result: ReportFinding[] = [];
    let current: ReportFinding | null = null;
    let last: (typeof fields)[number] | null = null;
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
        const match =
            /^\s*(?:[-*+]\s+|\d+[.)]\s+)?(?:\*\*)?(rule|text|problem|correction)(?:\*\*)?\s*:(?:\*\*)?\s*(.*)$/i.exec(
                line,
            );
        if (match) {
            const field = match[1].toLowerCase() as (typeof fields)[number];
            if (current === null || field === "rule" || current[field] !== "") {
                current = {
                    rule: "",
                    text: "",
                    problem: "",
                    correction: "",
                    report,
                    reportLine: i + 1,
                };
                result.push(current);
            }
            current[field] = match[2].trim();
            last = field;
            return;
        }
        if (current === null || last === null) return;
        if (/^#{1,6}\s/.test(line)) {
            last = null;
        } else if (line.trim() === "") {
            if (current[last] !== "") last = null;
        } else {
            current[last] = `${current[last]}\n${line}`.trim();
        }
    });
    return result;
}

// Gives the text between the first and the last quotation mark, or null.
function quoted(value: string): string | null {
    const start = value.search(/["“]/);
    const end = Math.max(value.lastIndexOf('"'), value.lastIndexOf("”"));
    if (start < 0 || end <= start) return null;
    return value.slice(start + 1, end);
}

// Makes text comparable: no code-span or emphasis marks, straight quotation
// marks, and one space for each run of white space.
function comparable(text: string) {
    return comparableWithOffsets(text).text;
}

// Gives the comparable text and, for each of its characters, the offset in the
// source.
function comparableWithOffsets(source: string) {
    let text = "";
    const offsets: number[] = [];
    for (let i = 0; i < source.length; i++) {
        let char = source[i];
        if (char === "`" || char === "*") continue;
        if (char === "\\" && source[i + 1] === '"') continue;
        if (char === "“" || char === "”") char = '"';
        if (char === "‘" || char === "’") char = "'";
        if (/\s/.test(char)) {
            if (text === "" || text.endsWith(" ")) continue;
            char = " ";
        }
        text += char;
        offsets.push(i);
    }
    if (text.endsWith(" ")) {
        text = text.slice(0, -1);
        offsets.pop();
    }
    return { text, offsets };
}

// Gives the rules of a rule file: each paragraph, list item, and table cell,
// with the last heading before it.
function ruleUnits(ruleFile: string, reviewer: string, source: string) {
    const units: RuleUnit[] = [];
    let heading = "";
    for (const segment of segments(source)) {
        const text = segment.visible.trim();
        if (segment.heading) {
            heading = text;
            continue;
        }
        const mark = /\((blocking|advisory|script check)\)$/.exec(text);
        units.push({
            ruleFile,
            reviewer,
            heading,
            text,
            indent: segment.visible.search(/\S/),
            mark: mark ? mark[1] : null,
        });
    }
    return units;
}

// Finds the rule that contains the quote, in the sequence of the rule files.
// The quote can continue into the rules after it under the same heading. A
// rule with no mark of its own gets the first mark of its nested list items.
function findRule(units: RuleUnit[], quote: string): RuleUnit | null {
    const wanted = comparable(quote).toLowerCase();
    if (wanted === "") return null;
    let first = 0;
    while (first < units.length) {
        let last = first;
        let joined = "";
        const ends: number[] = [];
        for (
            ;
            last < units.length &&
            units[last].ruleFile === units[first].ruleFile &&
            units[last].heading === units[first].heading;
            last++
        ) {
            joined += `${joined === "" ? "" : " "}${comparable(units[last].text).toLowerCase()}`;
            ends.push(joined.length);
        }
        const at = joined.indexOf(wanted);
        if (at >= 0) {
            const end = at + wanted.length;
            return withMark(units, first + ends.findIndex((e) => e >= end));
        }
        first = last;
    }
    return null;
}

function withMark(units: RuleUnit[], index: number): RuleUnit {
    const unit = units[index];
    if (unit.mark !== null) return unit;
    for (let k = index + 1; k < units.length; k++) {
        const next = units[k];
        if (next.heading !== unit.heading || next.indent <= unit.indent) break;
        if (next.mark !== null) return { ...unit, mark: next.mark };
    }
    return unit;
}

// Gives the rule number of a rule, for example "3.6" from "(rule 3.6)".
function ruleNumber(text: string): string | null {
    const match = /\((?:rules?\s+)?((?:\d+\.\d+|GR-\d+)[^()]*)\)/.exec(text);
    return match ? match[1] : null;
}

process.exitCode = main(process.argv.slice(2));
