import { describe, expect, it } from "vitest";
import { checkRepo } from "../../scripts/check.ts";

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
