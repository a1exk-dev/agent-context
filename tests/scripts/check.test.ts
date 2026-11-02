import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
    checkBunPin,
    checkInstructions,
    checkRepo,
} from "../../scripts/check.ts";

// Vitest runs on Node, which has no Bun.YAML. JSON is valid YAML, so the
// tests write frontmatter as JSON and parse it with JSON.parse.
const parseYaml = JSON.parse;

function skill(path: string, frontmatter: object, body = "Body\n") {
    return { path, text: `---\n${JSON.stringify(frontmatter)}\n---\n${body}` };
}

describe("checkRepo", () => {
    it("passes a valid Skill", () => {
        const files = [
            skill("skills/writing/foo/SKILL.md", {
                name: "foo",
                description: "Does foo.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([]);
    });

    it("fails when a Category folder holds a SKILL.md", () => {
        const files = [
            skill("skills/writing/SKILL.md", {
                name: "writing",
                description: "Not a Skill.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/SKILL.md: category folders must not contain SKILL.md",
            },
        ]);
    });

    it("fails when name does not match its folder", () => {
        const files = [
            skill("skills/writing/foo/SKILL.md", {
                name: "bar",
                description: "Does foo.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/foo/SKILL.md: name 'bar' does not match folder 'foo'",
            },
        ]);
    });

    it("fails when name is not kebab-case", () => {
        const files = [
            skill("skills/writing/Foo_bar/SKILL.md", {
                name: "Foo_bar",
                description: "Does foo.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/Foo_bar/SKILL.md: invalid name 'Foo_bar'",
            },
        ]);
    });

    it("passes a 64-character name and fails a 65-character name", () => {
        const ok = "a".repeat(64);
        const long = "a".repeat(65);
        const files = [
            skill(`skills/writing/${ok}/SKILL.md`, {
                name: ok,
                description: "Ok.",
            }),
            skill(`skills/writing/${long}/SKILL.md`, {
                name: long,
                description: "Too long.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message: `skills/writing/${long}/SKILL.md: invalid name '${long}'`,
            },
        ]);
    });

    it("passes a 1024-character description and fails an empty or longer one", () => {
        const files = [
            skill("skills/writing/max/SKILL.md", {
                name: "max",
                description: "d".repeat(1024),
            }),
            skill("skills/writing/empty/SKILL.md", {
                name: "empty",
                description: "",
            }),
            skill("skills/writing/long/SKILL.md", {
                name: "long",
                description: "d".repeat(1025),
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/empty/SKILL.md: description must be 1-1024 characters",
            },
            {
                level: "error",
                message:
                    "skills/writing/long/SKILL.md: description must be 1-1024 characters",
            },
        ]);
    });

    it("passes a 20000-byte SKILL.md and fails a 20001-byte one", () => {
        const sized = (name: string, bytes: number) => {
            const file = skill(`skills/writing/${name}/SKILL.md`, {
                name,
                description: "Sized.",
            });
            // "é" is 2 bytes, so the check must count bytes, not characters.
            const pad = bytes - Buffer.byteLength(file.text) - 2;
            return { ...file, text: `${file.text}é${"x".repeat(pad)}` };
        };
        const files = [sized("fits", 20000), sized("big", 20001)];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/big/SKILL.md: 20001 bytes (max 20000), move detail into references/",
            },
        ]);
    });

    it("fails on duplicate Skill names across Categories", () => {
        const files = [
            skill("skills/writing/foo/SKILL.md", {
                name: "foo",
                description: "A.",
            }),
            skill("skills/coding/foo/SKILL.md", {
                name: "foo",
                description: "B.",
            }),
            skill("skills/coding/bar/SKILL.md", {
                name: "bar",
                description: "C.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            { level: "error", message: "duplicate skill names: foo" },
        ]);
    });

    it("warns on a Rule above 2048 bytes", () => {
        const files = [
            { path: "rules/writing/small.md", text: "x".repeat(2048) },
            { path: "rules/writing/large.md", text: "x".repeat(2049) },
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "warning",
                message: "rules/writing/large.md: 2049 bytes (aim for 2048)",
            },
        ]);
    });

    it("fails a Rule above 3072 bytes and only warns at 3072 bytes", () => {
        const files = [
            { path: "rules/writing/edge.md", text: "x".repeat(3072) },
            { path: "rules/writing/huge.md", text: "x".repeat(3073) },
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "warning",
                message: "rules/writing/edge.md: 3072 bytes (aim for 2048)",
            },
            {
                level: "error",
                message: "rules/writing/huge.md: 3073 bytes (max 3072)",
            },
        ]);
    });

    it("fails a SKILL.md without frontmatter", () => {
        const files = [
            { path: "skills/writing/none/SKILL.md", text: "# None\n\nBody\n" },
            {
                path: "skills/writing/open/SKILL.md",
                text: '---\n{"name": "open"}\nBody\n',
            },
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message: "skills/writing/none/SKILL.md: missing frontmatter",
            },
            {
                level: "error",
                message: "skills/writing/open/SKILL.md: missing frontmatter",
            },
        ]);
    });

    it("fails a SKILL.md with invalid YAML and still checks the next Skill", () => {
        const files = [
            {
                path: "skills/writing/bad/SKILL.md",
                text: '---\n{"name": \n---\nBody\n',
            },
            { path: "skills/writing/empty/SKILL.md", text: "---\n---\nBody\n" },
            skill("skills/writing/next/SKILL.md", {
                name: "other",
                description: "N.",
            }),
        ];
        expect(checkRepo(files, parseYaml)).toEqual([
            {
                level: "error",
                message:
                    "skills/writing/bad/SKILL.md: invalid frontmatter YAML",
            },
            {
                level: "error",
                message:
                    "skills/writing/empty/SKILL.md: invalid frontmatter YAML",
            },
            {
                level: "error",
                message:
                    "skills/writing/next/SKILL.md: name 'other' does not match folder 'next'",
            },
        ]);
    });
});

describe("checkBunPin", () => {
    const packageJson = JSON.stringify({ packageManager: "bun@1.4.3" });

    it("passes when the Dockerfile tag matches packageManager", () => {
        const dockerfile = "FROM oven/bun:1.4.3\nRUN bun install\n";
        expect(checkBunPin(packageJson, dockerfile)).toEqual([]);
    });

    it("fails when the Dockerfile tag differs from packageManager", () => {
        const dockerfile = "FROM oven/bun:1.4.2\nRUN bun install\n";
        expect(checkBunPin(packageJson, dockerfile)).toEqual([
            {
                level: "error",
                message:
                    "Dockerfile: oven/bun tag '1.4.2' differs from packageManager 'bun@1.4.3' in package.json",
            },
        ]);
    });
});

// Makes a project folder with the given files, for checkInstructions.
function project(files: Record<string, string>) {
    const root = mkdtempSync(join(tmpdir(), "check-instructions-"));
    for (const [path, text] of Object.entries(files)) {
        mkdirSync(dirname(join(root, path)), { recursive: true });
        writeFileSync(join(root, path), text);
    }
    return root;
}

describe("checkInstructions", () => {
    it("runs the check script of the agent-instructions Skill", () => {
        const root = project({ "AGENTS.md": "You should run the tests.\n" });
        expect(checkInstructions(root, [])).toEqual([
            {
                level: "error",
                message:
                    'AGENTS.md:1: The sentence has the non-approved word "should". [When you select a word] "You should run the tests."',
            },
        ]);
    });

    it("checks repo files with GLOSSARY.md and shipped files with no glossary", () => {
        const ask = "Ask the user for the branch.\n";
        const root = project({
            "GLOSSARY.md":
                "**Operator**:\nThe Operator is a human.\n_Avoid_: user\n",
            "AGENTS.md": ask,
            "CLAUDE.md": ask,
            "MEMORY.md": ask,
            "docs/agents/domain.md": ask,
            "skills/writing/foo/SKILL.md": `---\nname: foo\ndescription: Does foo.\n---\n${ask}`,
            "skills/writing/foo/references/bar.md": ask,
            "rules/writing/baz.md": ask,
            ".claude/skills/other/SKILL.md": "You should run it.\n",
        });
        const avoid = (path: string) => ({
            level: "error",
            message: `${path}:1: The sentence has "user", which the glossary gives after _Avoid_. [1.11] "Ask the user for the branch."`,
        });
        expect(checkInstructions(root, [])).toEqual([
            avoid("AGENTS.md"),
            avoid("CLAUDE.md"),
            avoid("MEMORY.md"),
            avoid("docs/agents/domain.md"),
        ]);
    });

    it("ignores each hit that the allow-list gives", () => {
        const root = project({
            "AGENTS.md":
                'Do not write "MUST" as MUST.\n\nYou should run the tests.\n',
        });
        const allowList = [
            {
                path: "AGENTS.md",
                rule: "Before a step with a risk",
                text: 'Do not write "MUST" as MUST.',
                cause: "The sentence gives the word as an example.",
            },
        ];
        expect(checkInstructions(root, allowList)).toEqual([
            {
                level: "error",
                message:
                    'AGENTS.md:3: The sentence has the non-approved word "should". [When you select a word] "You should run the tests."',
            },
        ]);
    });
});
