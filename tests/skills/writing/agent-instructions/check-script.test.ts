import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const script = join(
    import.meta.dirname,
    "../../../../skills/writing/agent-instructions/scripts/check.ts",
);

function run(args: string[]) {
    const result = spawnSync("node", [script, ...args], { encoding: "utf8" });
    return {
        code: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

// Runs the check script as an author agent does: on one file with the given
// text, in a new project folder, with no glossary.
function check(text: string) {
    const project = mkdtempSync(join(tmpdir(), "check-script-"));
    const path = join(project, "AGENTS.md");
    writeFileSync(path, text);
    const result = run([path, "--project", project, "--glossary", "none"]);
    return { ...result, findings: JSON.parse(result.stdout).findings };
}

function ste(
    rule: string | null,
    heading: string,
    fields: { text: string; line: number; problem: string },
) {
    return {
        reviewer: "ASD-STE100",
        rule,
        ruleFile: "references/ste-rules.md",
        heading,
        path: expect.stringMatching(/AGENTS\.md$/),
        ...fields,
    };
}

const modal = (text: string, line: number, word: string) =>
    ste(null, "When you select a word", {
        text,
        line,
        problem: `The sentence has the non-approved word "${word}".`,
    });

const words = (n: number) =>
    Array.from({ length: n }, (_, i) => `word${i + 1}`).join(" ");

describe("check script, file form", () => {
    it("finds a sentence of 26 words", () => {
        const result = check(`# Title\n\n${words(26)}.\n`);
        expect(result.code).toBe(1);
        expect(result.findings).toEqual([
            {
                reviewer: "ASD-STE100",
                rule: null,
                ruleFile: "references/ste-rules.md",
                heading: "When you write a sentence",
                text: `${words(26)}.`,
                path: expect.stringMatching(/AGENTS\.md$/),
                line: 3,
                problem: "The sentence has 26 words.",
            },
        ]);
    });

    it("finds a semicolon", () => {
        const result = check("Run the check; then commit.\n");
        expect(result.code).toBe(1);
        expect(result.findings).toEqual([
            ste("8.1", "When you write punctuation", {
                text: "Run the check; then commit.",
                line: 1,
                problem: "The sentence has a semicolon.",
            }),
        ]);
    });

    it("finds each non-approved word in any case", () => {
        const result = check(
            "You should run it.\n\nIt May fail.\n\n- It might, would, shall, or could stop.\n",
        );
        expect(result.findings).toEqual([
            modal("You should run it.", 1, "should"),
            modal("It May fail.", 3, "May"),
            ...["might", "would", "shall", "could"].map((word) =>
                modal("It might, would, shall, or could stop.", 5, word),
            ),
        ]);
    });

    it("finds each emphasis word in capital letters, but not CAUTION", () => {
        const emphasis = [
            "IMPORTANT",
            "CRITICAL",
            "MUST",
            "NEVER",
            "ALWAYS",
            "NOTE",
            "WARNING",
        ];
        const result = check(
            `${emphasis.map((word) => `${word}: Run it.`).join("\n\n")}\n\nCAUTION: Do not push. Never push. You must stop.\n`,
        );
        expect(result.findings).toEqual(
            emphasis.map((word, i) =>
                ste(null, "Before a step with a risk", {
                    text: `${word}: Run it.`,
                    line: 2 * i + 1,
                    problem: `The sentence has "${word}" in capital letters.`,
                }),
            ),
        );
    });

    it("finds SHOULD and MAY as emphasis and as non-approved words", () => {
        const result = check("You SHOULD stop.\n");
        expect(result.findings).toEqual([
            modal("You SHOULD stop.", 1, "SHOULD"),
            ste(null, "Before a step with a risk", {
                text: "You SHOULD stop.",
                line: 1,
                problem: 'The sentence has "SHOULD" in capital letters.',
            }),
        ]);
    });

    it("finds more than 3 words joined by hyphens", () => {
        const result = check(
            "Use the state-of-the-art end-of-run report in docs/a-b-c-d.md.\n",
        );
        expect(result.findings).toEqual([
            ste("2.2", "When you write a multi-word noun", {
                text: "Use the state-of-the-art end-of-run report in docs/a-b-c-d.md.",
                line: 1,
                problem:
                    'The noun "state-of-the-art" has 4 words joined by hyphens.',
            }),
        ]);
    });

    it("skips code blocks", () => {
        const result = check(
            `Run this command:\n\n\`\`\`sh\n${words(30)}; echo MUST should a-b-c-d-e\n\`\`\`\n`,
        );
        expect(result.findings).toEqual([]);
    });

    it("skips code spans and counts each as 1 word", () => {
        const result = check(
            `${words(24)} \`${words(10)}; MUST should a-b-c-d-e\`.\n`,
        );
        expect(result.findings).toEqual([]);
    });

    it("skips quoted text and counts each as 1 word", () => {
        const result = check(
            `${words(22)} "${words(5)}; MUST should a-b-c-d-e" “It should; MUST” 'It may; NEVER'.\n`,
        );
        expect(result.findings).toEqual([]);
    });

    it("counts text in parentheses as 1 word and as its own sentence", () => {
        const result = check(
            `${words(24)} (${words(10)}).\n\n${words(3)} (${words(26)}).\n`,
        );
        expect(result.findings).toEqual([
            ste(null, "When you write a sentence", {
                text: words(26),
                line: 3,
                problem: "The sentence has 26 words.",
            }),
        ]);
    });

    it("stops a sentence at a colon at the end of a line", () => {
        const result = check(`${words(20)}:\n\n- ${words(20)}.\n`);
        expect(result.findings).toEqual([]);
    });

    it("counts a sentence across wrapped lines and gives its first line", () => {
        const result = check(`# Title\n\n${words(13)}\n${words(13)}.\n`);
        expect(result.findings).toEqual([
            ste(null, "When you write a sentence", {
                text: `${words(13)}\n${words(13)}.`,
                line: 3,
                problem: "The sentence has 26 words.",
            }),
        ]);
    });

    it("does not count the words of a heading", () => {
        const result = check(`# ${words(30)}\n`);
        expect(result.findings).toEqual([]);
    });

    it("checks the frontmatter description, not the other fields", () => {
        const result = check(
            `---\nname: a-b-c-d-e\ndescription: "Use it; it \\"should\\" stop."\n---\n\nBody.\n`,
        );
        expect(result.findings).toEqual([
            ste("8.1", "When you write punctuation", {
                text: 'Use it; it \\"should\\" stop.',
                line: 3,
                problem: "The sentence has a semicolon.",
            }),
        ]);
    });

    it("gives no findings and exit 0 for a clean file", () => {
        const result = check(`# Title\n\n${words(25)}.\n`);
        expect(result.code).toBe(0);
        expect(result.findings).toEqual([]);
    });

    it("gives exit 2 for a missing file", () => {
        const project = mkdtempSync(join(tmpdir(), "check-script-"));
        const result = run([
            join(project, "missing.md"),
            "--project",
            project,
            "--glossary",
            "none",
        ]);
        expect(result.code).toBe(2);
        expect(result.stdout).toBe("");
        expect(result.stderr).toContain("missing.md");
    });

    it("gives exit 2 for a bad argument", () => {
        const project = mkdtempSync(join(tmpdir(), "check-script-"));
        const path = join(project, "AGENTS.md");
        writeFileSync(path, "# Title\n");
        for (const args of [
            [path, "--project", project, "--glossary", "none", "--bad"],
            [path, "--glossary", "none"],
            [path, "--project", project],
            ["--project", project, "--glossary", "none"],
            [path, "--project", project, "--glossary", join(project, "G.md")],
        ]) {
            const result = run(args);
            expect(result.code, args.join(" ")).toBe(2);
            expect(result.stdout).toBe("");
        }
    });
});
