// The static test of the wtf Skill. It reads the Skill files, so that a later
// edit cannot remove the manual-only parts or add a call syntax to the
// description. The output tests and the load tests check the behavior.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SKILL = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../skills/writing/wtf",
);

const read = (path: string) =>
    existsSync(join(SKILL, path))
        ? readFileSync(join(SKILL, path), "utf8")
        : "";
const frontmatter = () =>
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(read("SKILL.md"))?.[1] ?? "";
const body = () => read("SKILL.md").slice(frontmatter().length);
const description = () =>
    (/^description: "(.*)"$/m.exec(frontmatter())?.[1] ?? "").replace(
        /\\"/g,
        '"',
    );

// The call forms of Claude Code, Codex, and OpenCode 2.
const CALL_SYNTAX = /[/$@]wtf\b/;

describe("the manual-only parts of the wtf Skill", () => {
    it("turns off model invocation on Claude Code", () => {
        expect(frontmatter()).toMatch(/^disable-model-invocation: true$/m);
    });

    it("turns off implicit invocation on Codex in agents/openai.yaml", () => {
        expect(read("agents/openai.yaml")).toMatch(
            /^policy:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+allow_implicit_invocation:[ \t]*false[ \t]*$/m,
        );
    });

    it("gives OpenCode 2 its manual-only field as a top-level frontmatter field", () => {
        // OpenCode 2 reads disable-model-invocation as a YAML boolean of the
        // frontmatter, so a quoted value or a nested field does not count.
        const lines = frontmatter()
            .split(/\r?\n/)
            .filter((line) => line.startsWith("disable-model-invocation"));
        expect(lines).toEqual(["disable-model-invocation: true"]);
    });

    it("says in the description that only the Operator calls it, with no call syntax", () => {
        expect(description()).toContain(
            "only when the Operator calls this Skill by name",
        );
        expect(description()).not.toMatch(CALL_SYNTAX);
    });
});

describe("the wtf Skill text", () => {
    it("uses no argument placeholder in the body", () => {
        expect(body()).not.toMatch(/\$ARGUMENTS|\$\d|\$\{/);
    });
});
