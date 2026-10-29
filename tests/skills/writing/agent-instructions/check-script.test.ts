import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
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

// Makes a new project folder with the given files, keyed by relative path.
function project(files: Record<string, string>) {
    const folder = mkdtempSync(join(tmpdir(), "check-script-"));
    for (const [path, text] of Object.entries(files)) {
        mkdirSync(dirname(join(folder, path)), { recursive: true });
        writeFileSync(join(folder, path), text);
    }
    return folder;
}

// Runs the check script on the given files of a project folder.
function checkFiles(folder: string, paths: string[], glossary = "none") {
    const result = run([
        ...paths.map((path) => join(folder, path)),
        "--project",
        folder,
        "--glossary",
        glossary === "none" ? glossary : join(folder, glossary),
    ]);
    return { ...result, ...JSON.parse(result.stdout) };
}

function loading(
    ruleFile: string,
    heading: string,
    fields: { text: string; path: string; line: number; problem: string },
) {
    return {
        reviewer: "loading",
        rule: null,
        ruleFile,
        heading,
        ...fields,
        path: expect.stringMatching(new RegExp(`/${fields.path}$`)),
    };
}

// A code block of the given number of lines of 100 bytes each. The text
// rules skip code blocks.
const codeBlock = (lines: number) =>
    `\`\`\`\n${`${"x".repeat(99)}\n`.repeat(lines - 2)}\`\`\`\n`;

const skill = (name: string, description: string, extra = "") =>
    `---\nname: ${name}\ndescription: "${description}"\n${extra}---\n\n# Title\n`;

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
        expect(
            result.findings.filter(
                (f: { reviewer: string }) => f.reviewer === "ASD-STE100",
            ),
        ).toEqual([
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

describe("check script, loading rules", () => {
    it("finds a SKILL.md of more than 20,000 bytes", () => {
        const body = codeBlock(210);
        const folder = project({
            "a/SKILL.md": skill("a", "When you test, use this skill.") + body,
        });
        const result = checkFiles(folder, ["a/SKILL.md"]);
        expect(result.code).toBe(1);
        expect(result.findings).toEqual([
            loading(
                "references/loading-rules.md",
                "When you examine the file size",
                {
                    text: "---",
                    path: "a/SKILL.md",
                    line: 1,
                    problem: expect.stringMatching(
                        /^SKILL\.md has 20\d{3} bytes\. The limit is 20,000 bytes\.$/,
                    ),
                },
            ),
        ]);
    });

    it("finds a SKILL.md of 500 lines or more", () => {
        const folder = project({
            "a/SKILL.md": `${skill("a", "When you test, use this skill.")}${"\n".repeat(494)}`,
        });
        const result = checkFiles(folder, ["a/SKILL.md"]);
        expect(result.findings).toEqual([
            loading(
                "references/agent-skills-spec.md",
                "When you write the body",
                {
                    text: "---",
                    path: "a/SKILL.md",
                    line: 1,
                    problem:
                        "SKILL.md has 500 lines. The limit is less than 500 lines.",
                },
            ),
        ]);
    });

    it("passes a SKILL.md of 499 lines", () => {
        const folder = project({
            "a/SKILL.md": `${skill("a", "When you test, use this skill.")}${"\n".repeat(493)}`,
        });
        expect(checkFiles(folder, ["a/SKILL.md"]).findings).toEqual([]);
    });

    it("finds each Skill frontmatter problem", () => {
        const frontmatter = (problem: string, line: number, text: string) =>
            loading(
                "references/agent-skills-spec.md",
                "When you write the folder and the frontmatter",
                { text, path: "Bad--Name/SKILL.md", line, problem },
            );
        const folder = project({
            "Bad--Name/SKILL.md": `---\nname: Bad--Name\ndescription: ""\nlicense: MIT\nmodel: x\n---\n\n# Title\n`,
        });
        expect(checkFiles(folder, ["Bad--Name/SKILL.md"]).findings).toEqual([
            frontmatter(
                'The name "Bad--Name" is not 1 to 64 lowercase letters, digits, and hyphens, with no hyphen at the start or end and no "--".',
                2,
                "name: Bad--Name",
            ),
            frontmatter(
                "The description has 0 characters. The limit is 1 to 1024 characters.",
                3,
                'description: ""',
            ),
            frontmatter(
                'The frontmatter field "model" is not permitted.',
                5,
                "model: x",
            ),
        ]);
    });

    it("finds a name that is not the folder name, and a long description", () => {
        const folder = project({
            "a/SKILL.md": skill("b", "x".repeat(1025)),
        });
        expect(checkFiles(folder, ["a/SKILL.md"]).findings).toEqual([
            loading(
                "references/agent-skills-spec.md",
                "When you write the folder and the frontmatter",
                {
                    text: "name: b",
                    path: "a/SKILL.md",
                    line: 2,
                    problem: 'The name "b" is not the folder name "a".',
                },
            ),
            loading(
                "references/agent-skills-spec.md",
                "When you write the folder and the frontmatter",
                {
                    text: `description: "${"x".repeat(1025)}"`,
                    path: "a/SKILL.md",
                    line: 3,
                    problem:
                        "The description has 1025 characters. The limit is 1 to 1024 characters.",
                },
            ),
        ]);
    });

    it("finds a SKILL.md with no frontmatter", () => {
        const folder = project({ "a/SKILL.md": "# Title\n" });
        expect(checkFiles(folder, ["a/SKILL.md"]).findings).toEqual(
            [
                "The frontmatter has no name.",
                "The frontmatter has no description.",
            ].map((problem) =>
                loading(
                    "references/agent-skills-spec.md",
                    "When you write the folder and the frontmatter",
                    { text: "# Title", path: "a/SKILL.md", line: 1, problem },
                ),
            ),
        );
    });

    it("reads a description in a block scalar", () => {
        const folder = project({
            "a/SKILL.md": `---\nname: a\ndescription: >\n  When you test,\n  use this skill.\n---\n\n# Title\n`,
        });
        expect(checkFiles(folder, ["a/SKILL.md"]).findings).toEqual([]);
    });

    it("finds entry files from the root of 32 KiB or more", () => {
        const folder = project({
            "AGENTS.md": codeBlock(170),
            "CLAUDE.md": "@AGENTS.md\n",
            "sub/AGENTS.md": codeBlock(162),
        });
        expect(checkFiles(folder, ["sub/AGENTS.md"]).findings).toEqual([
            loading(
                "references/loading-rules.md",
                "When you examine the file size",
                {
                    text: "```",
                    path: "sub/AGENTS.md",
                    line: 1,
                    problem:
                        "The entry files from the project root to this file have 32827 bytes. The limit is less than 32,768 bytes.",
                },
            ),
        ]);
    });

    it("finds an entry file of 200 lines or more", () => {
        const folder = project({ "CLAUDE.md": codeBlock(200) });
        expect(checkFiles(folder, ["CLAUDE.md"]).findings).toEqual([
            loading(
                "references/loading-rules.md",
                "When you examine the file size",
                {
                    text: "```",
                    path: "CLAUDE.md",
                    line: 1,
                    problem:
                        "CLAUDE.md has 200 lines. The limit is less than 200 lines.",
                },
            ),
        ]);
    });

    it("finds each @path line, but not @AGENTS.md in CLAUDE.md", () => {
        const folder = project({
            "CLAUDE.md":
                "@AGENTS.md\n@docs/a.md\n\nAsk @alex, or mail a@b.md. Do not write `@docs/b.md`.\n",
            "docs/agents/x.md": "Read @AGENTS.md first.\n",
        });
        const at = (path: string, text: string, line: number, target: string) =>
            loading(
                "references/loading-rules.md",
                "When you select a feature",
                {
                    text,
                    path,
                    line,
                    problem: `The file imports "${target}" with an @path line.`,
                },
            );
        expect(
            checkFiles(folder, ["CLAUDE.md", "docs/agents/x.md"]).findings,
        ).toEqual([
            at("CLAUDE.md", "@docs/a.md", 2, "@docs/a.md"),
            at("docs/agents/x.md", "Read @AGENTS.md first.", 1, "@AGENTS.md"),
        ]);
    });
});

describe("check script, glossary rules", () => {
    const glossary = [
        "# Glossary",
        "",
        "**Operator**:",
        "The human who controls a project.",
        "_Avoid_: user, project owner",
        "",
        "**dry run**:",
        "A test that changes no file.",
        "",
    ].join("\n");

    const term = (rule: string, text: string, line: number, problem: string) =>
        ste(
            rule,
            rule === "6.2"
                ? "When you write a sentence"
                : "When you select a technical noun",
            {
                text,
                line,
                problem,
            },
        );

    it("finds each _Avoid_ word of the glossary in any case", () => {
        const folder = project({
            "GLOSSARY.md": glossary,
            "AGENTS.md":
                "Ask the user-facing team. Ask the User.\n\nAsk the project\nowner. Ask the `user`.\n",
        });
        expect(
            checkFiles(folder, ["AGENTS.md"], "GLOSSARY.md").findings,
        ).toEqual([
            term(
                "1.11",
                "Ask the User.",
                1,
                'The sentence has "User", which the glossary gives after _Avoid_.',
            ),
            term(
                "1.11",
                "Ask the project\nowner.",
                3,
                'The sentence has "project\nowner", which the glossary gives after _Avoid_.',
            ),
        ]);
    });

    it("finds a glossary term in a different case", () => {
        const folder = project({
            "GLOSSARY.md": glossary,
            "AGENTS.md":
                "Operator approves. The operators approve. Dry run first. Do a Dry run.\n",
        });
        expect(
            checkFiles(folder, ["AGENTS.md"], "GLOSSARY.md").findings,
        ).toEqual([
            term(
                "6.2",
                "The operators approve.",
                1,
                'The sentence has "operators", but the glossary term is "Operator".',
            ),
            term(
                "6.2",
                "Do a Dry run.",
                1,
                'The sentence has "Dry run", but the glossary term is "dry run".',
            ),
        ]);
    });

    it("skips the _Avoid_ lines of the glossary", () => {
        const folder = project({ "GLOSSARY.md": glossary });
        expect(
            checkFiles(folder, ["GLOSSARY.md"], "GLOSSARY.md").findings,
        ).toEqual([]);
    });

    it("finds a bold term in neither the glossary nor the base list", () => {
        const folder = project({
            "GLOSSARY.md": glossary,
            "AGENTS.md":
                "An **Operator** starts an **agent**. **Subagents** do a **dry run**. A **widget:** runs.\n",
        });
        expect(
            checkFiles(folder, ["AGENTS.md"], "GLOSSARY.md").findings,
        ).toEqual([
            term(
                "1.8",
                "A **widget:** runs.",
                1,
                'The bold term "widget" is not in the glossary or in the base list of technical-terms.md.',
            ),
        ]);
    });

    it("uses only the base list with no glossary", () => {
        const result = check(
            "An **Operator** starts an **agent**. Ask the user.\n",
        );
        expect(result.findings).toEqual([
            term(
                "1.8",
                "An **Operator** starts an **agent**.",
                1,
                'The bold term "Operator" is not in the glossary or in the base list of technical-terms.md.',
            ),
        ]);
    });
});

function iso(
    heading: string,
    fields: { text: string; path: string; line: number; problem: string },
) {
    return {
        reviewer: "ISO 24495-1",
        rule: null,
        ruleFile: "references/plain-language-checks.md",
        heading,
        ...fields,
        path: expect.stringMatching(new RegExp(`/${fields.path}$`)),
    };
}

describe("check script, ISO 24495-1 rules", () => {
    it("finds the general headings of the fixed list", () => {
        const folder = project({
            "AGENTS.md":
                "# General\n\n## Notes\n\n### other:\n\n## Misc\n\n## General rules\n\n## Before a commit\n",
        });
        expect(checkFiles(folder, ["AGENTS.md"]).findings).toEqual(
            [
                ["General", 1],
                ["Notes", 3],
                ["other:", 5],
                ["Misc", 7],
            ].map(([text, line]) =>
                iso("When you put the text in sections and lists", {
                    text: text as string,
                    path: "AGENTS.md",
                    line: line as number,
                    problem: `The heading "${text}" is applicable to all subjects.`,
                }),
            ),
        );
    });

    it("finds images and Mermaid diagrams", () => {
        const folder = project({
            "AGENTS.md":
                'See ![flow](flow.png) first.\n\nSee <img src="a.png"> here.\n\n```mermaid\ngraph TD\n```\n\n```md\n![x](y.png)\n```\n',
        });
        const image = (text: string, line: number, problem: string) =>
            iso("When you select the words and the tone", {
                text,
                path: "AGENTS.md",
                line,
                problem,
            });
        expect(checkFiles(folder, ["AGENTS.md"]).findings).toEqual([
            image(
                "See ![flow](flow.png) first.",
                1,
                "The sentence has an image.",
            ),
            image(
                'See <img src="a.png"> here.',
                3,
                "The sentence has an image.",
            ),
            image("```mermaid", 5, "The file has a Mermaid diagram."),
        ]);
    });

    const pointers = {
        "docs/agents/commit.md":
            "# Commit\n\n- Run the check before each commit.\n- Push the branch.\n",
        "skills/a/SKILL.md": skill("a", "When you test, use this skill."),
        "skills/a/references/b.md": "# B\n",
        "AGENTS.md": [
            "# Agents",
            "",
            "Read `docs/agents/` first.",
            "",
            "## Before a commit",
            "",
            "Read `docs/agents/commit.md` before a commit. Then obey",
            "docs/agents/missing.md. Read `skills/<name>/SKILL.md` and `node:fs`.",
            "",
            "- Run the check before each commit.",
            "- Push the branch.",
            "",
        ].join("\n"),
    };

    it("lists each sentence that names a file path", () => {
        const folder = project(pointers);
        const result = checkFiles(folder, ["AGENTS.md"]);
        const pointer = (
            line: number,
            heading: string | null,
            text: string,
            targets: string[],
        ) => ({
            path: expect.stringMatching(/\/AGENTS\.md$/),
            line,
            heading,
            text,
            targets,
        });
        expect(result.pointers).toEqual([
            pointer(3, "Agents", "Read `docs/agents/` first.", [
                "docs/agents/",
            ]),
            pointer(
                7,
                "Before a commit",
                "Read `docs/agents/commit.md` before a commit.",
                ["docs/agents/commit.md"],
            ),
            pointer(
                7,
                "Before a commit",
                "Then obey\ndocs/agents/missing.md.",
                ["docs/agents/missing.md"],
            ),
        ]);
    });

    it("finds a missing pointer target and a sentence copied from a target", () => {
        const folder = project(pointers);
        expect(checkFiles(folder, ["AGENTS.md"]).findings).toEqual([
            iso("When you put the text in sections and lists", {
                text: "Then obey\ndocs/agents/missing.md.",
                path: "AGENTS.md",
                line: 7,
                problem:
                    'The pointer target "docs/agents/missing.md" does not exist.',
            }),
            iso("When you select the text", {
                text: "Run the check before each commit.",
                path: "AGENTS.md",
                line: 10,
                problem:
                    'The sentence of 6 words is also in the pointer target "docs/agents/commit.md".',
            }),
        ]);
    });

    it("finds a pointer target from a folder above the file", () => {
        const folder = project({
            ...pointers,
            "skills/a/references/c.md":
                "Read `references/b.md` and `SKILL.md` when you test.\n",
        });
        const result = checkFiles(folder, ["skills/a/references/c.md"]);
        expect(result.findings).toEqual([]);
        expect(result.pointers).toHaveLength(1);
    });

    it("does not list a name or a placeholder as a file path", () => {
        const folder = project({
            "AGENTS.md":
                "Requires Node.js 22.18. Read `skills/<name>/SKILL.md`, `node:fs`, and and/or.\n",
        });
        const result = checkFiles(folder, ["AGENTS.md"]);
        expect(result.pointers).toEqual([]);
        expect(result.findings).toEqual([]);
    });
});
