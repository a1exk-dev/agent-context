// The static test of the human-communication Skill. It reads the Skill text,
// so that a later edit cannot add an exclusion, the name of another Skill,
// or a compliance claim. The output tests check the behavior.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { HERE, SKILL } from "./eval-lib.ts";
import { sentences } from "./human-text.ts";

const ROOT = join(HERE, "../../../..");
const NAME = "human-communication";
// The pointer text that #183 decided, word for word.
const POINTER =
    "Before you write text that a human reads (chat messages, questions, reports, code comments, and documents for persons), use the Skill tool with the human-communication Skill. If your platform has no Skill tool, read its SKILL.md.";

const skillFiles = readdirSync(SKILL, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
        const path = join(entry.parentPath, entry.name);
        return {
            path: relative(SKILL, path),
            text: readFileSync(path, "utf8"),
        };
    });
const read = (path: string) =>
    skillFiles.find((file) => file.path === path)?.text ?? "";

// The names of the other Skills of this repository and of .agents/skills/.
function otherSkills(): string[] {
    const categories = readdirSync(join(ROOT, "skills"), {
        withFileTypes: true,
    })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(ROOT, "skills", entry.name));
    const folders = [...categories, join(ROOT, ".agents/skills")].filter(
        (folder) => existsSync(folder),
    );
    const names = folders.flatMap((folder) => readdirSync(folder));
    return [...new Set(names)].filter((name) => name !== NAME);
}

const description = () =>
    (/^description: "(.*)"$/m.exec(read("SKILL.md"))?.[1] ?? "").replace(
        /\\"/g,
        '"',
    );

const EXCLUSIONS =
    /\b(except|excluding|unless|other than|not for|do not use|don't use|never use)\b/i;

describe("the human-communication Skill text", () => {
    it("names no other Skill", () => {
        const hits = otherSkills().flatMap((name) => {
            const word = new RegExp(`(?<![\\w-])${name}(?![\\w-])`, "i");
            return skillFiles
                .filter((file) => word.test(file.text))
                .map((file) => `${file.path}: ${name}`);
        });
        expect(otherSkills().length).toBeGreaterThan(0);
        expect(hits).toEqual([]);
    });

    it("has a description and a pointer text with no exclusion", () => {
        expect(description()).toMatch(
            /^Before you write text that a human reads/,
        );
        expect(description()).not.toMatch(EXCLUSIONS);
        expect(read("references/agents-md-pointer.md")).not.toMatch(EXCLUSIONS);
    });

    it("ships the pointer text word for word", () => {
        expect(read("references/agents-md-pointer.md")).toContain(POINTER);
    });

    it('puts each "compliant" or "certified" in a sentence with "never" or "not"', () => {
        const claims = skillFiles.flatMap((file) =>
            sentences(file.text)
                .filter((sentence) =>
                    /\b(compliant|certified)\b/i.test(sentence),
                )
                .filter((sentence) => !/\b(never|not)\b/i.test(sentence))
                .map((sentence) => `${file.path}: ${sentence}`),
        );
        expect(claims).toEqual([]);
    });
});
