// Check script of the agent-instructions Skill. It finds the countable rule
// problems in Agent instructions. Run it with `node` (Node.js 22.18 or later).
// It imports only `node:` built-ins, so it needs no install step.

import { readFileSync, statSync } from "node:fs";
import { parseArgs } from "node:util";

const usage = `Usage: node check.ts <file>... --project <folder> --glossary <path|none>

Checks each file for the rules that end with "(script check)" in the rule
files of the agent-instructions Skill. Writes JSON to stdout:
{ "findings": [ { reviewer, rule, ruleFile, heading, text, path, line, problem } ] }

Exit code: 0 for no findings, 1 for one or more findings, 2 when the check
could not run (missing file, bad argument).`;

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
// Marks a code span, a quote, or a URL in the masked text. It counts as one
// word and matches no word pattern.
const placeholder = "";

class UsageError extends Error {}

function main(argv: string[]): number {
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
    const findings: Finding[] = [];
    for (const path of args.files) {
        let source: string;
        try {
            source = readFileSync(path, "utf8");
        } catch (error) {
            process.stderr.write(`Cannot read ${path}: ${error}\n`);
            return 2;
        }
        findings.push(...checkText(path, source));
    }
    process.stdout.write(`${JSON.stringify({ findings }, null, 2)}\n`);
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
    problem: (match: string) => string | null;
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

function checkText(path: string, source: string): Finding[] {
    const findings: Finding[] = [];
    for (const segment of segments(source)) {
        const masked = mask(segment.visible);
        for (const [start, end] of sentences(masked)) {
            const sentence = segment.text
                .slice(firstVisible(masked, start), end)
                .trim();
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
                text: sentence,
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
                        text: segment.text
                            .slice(firstVisible(masked, s), e)
                            .trim(),
                    });
                }
            }
            const text = masked.slice(start, end);
            for (const { rule, heading, pattern, problem } of wordRules) {
                for (const match of text.matchAll(pattern)) {
                    const message = problem(match[0]);
                    if (message === null) continue;
                    findings.push(
                        finding(rule, heading, start + match.index, message),
                    );
                }
            }
        }
    }
    return findings;
}

// Splits a file into segments of natural-language text. It skips code
// blocks, frontmatter fields other than `description`, and table separator
// rows. It blanks list markers, heading marks, and table pipes, so that each
// segment keeps the columns of its lines.
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
        if (line.trim() === "") {
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
// of the same length. The masked text keeps the offsets of the segment.
function mask(text: string): string {
    const hide = (match: string) => placeholder + " ".repeat(match.length - 1);
    return text
        .replace(/(`+)[\s\S]*?\1/g, hide)
        .replace(/\]\([^)\s]*\)/g, (m) => `]${" ".repeat(m.length - 1)}`)
        .replace(/https?:\/\/[^\s)]*[^\s).,:]/g, hide)
        .replace(/"[^"]*"/g, hide)
        .replace(/“[^”]*”/g, hide)
        .replace(/(?<=^|[\s([])'[^'\n]*'(?![\p{L}\p{N}])/gu, hide);
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

process.exitCode = main(process.argv.slice(2));
