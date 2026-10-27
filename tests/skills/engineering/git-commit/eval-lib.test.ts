import { describe, expect, it } from "vitest";
import {
    auditGit,
    gitCommands,
    isSkillLoad,
    loadDecision,
    readEvals,
} from "./eval-lib.ts";

const bash = (command: string) => ({ name: "Bash", input: { command } });

describe("readEvals", () => {
    it("puts the common statements before the statements of each test", () => {
        const [first] = readEvals("1");
        expect(first?.assertions[0]).toMatch(/^\[S1\]/);
        expect(first?.assertions.at(-1)).toMatch(/^\[1\.4\]/);
    });

    it("reads all tests when no ids are given", () => {
        expect(readEvals("").length).toBeGreaterThan(1);
    });
});

describe("isSkillLoad", () => {
    it("counts a Skill call and a read of SKILL.md", () => {
        expect(
            isSkillLoad({ name: "Skill", input: { skill: "git-commit" } }),
        ).toBe(true);
        expect(
            isSkillLoad({
                name: "Read",
                input: { file_path: "/w/.claude/skills/git-commit/SKILL.md" },
            }),
        ).toBe(true);
        expect(isSkillLoad({ name: "Skill", input: { skill: "tdd" } })).toBe(
            false,
        );
    });
});

describe("gitCommands", () => {
    it("finds each git command in a chain and skips global options", () => {
        expect(
            gitCommands("cd x && git -C sub -c a=b add src/a.ts; ls | wc").map(
                (c) => [c.sub, c.args],
            ),
        ).toEqual([["add", ["src/a.ts"]]]);
    });

    it("keeps quoted text as one token", () => {
        expect(
            gitCommands('git commit -m "fix: add -A flag"')[0]?.args,
        ).toEqual(["-m", "Q"]);
    });
});

describe("auditGit", () => {
    it("gives the first Skill load and the first git write", () => {
        const audit = auditGit([
            bash("git status --porcelain"),
            { name: "Skill", input: { skill: "git-commit" } },
            bash("git add src/a.ts"),
        ]);
        expect(audit).toEqual({
            firstSkillLoad: 1,
            firstGitWrite: 2,
            forbidden: [],
        });
    });

    it.each([
        "git add -A",
        "git add .",
        "git add -u",
        "git add --all",
        "git commit -am wip",
        "git commit --no-verify -F msg.txt",
        "git commit -n -m x",
        "git push --force",
        "git push -f origin develop",
        "git push --force-with-lease",
        "git push origin +develop",
    ])("reports %s as forbidden", (command) => {
        expect(auditGit([bash(command)]).forbidden).toEqual([command]);
    });

    it.each([
        "git add src/a.ts src/b.ts",
        "git commit -F /tmp/msg.txt",
        "git push -u origin develop",
        "git commit -m \"$(cat <<'EOF'\nfeat: add -A support\nEOF\n)\"",
    ])("permits %s", (command) => {
        expect(auditGit([bash(command)]).forbidden).toEqual([]);
    });
});

describe("loadDecision", () => {
    const load = { name: "Skill", input: { skill: "git-commit" } };
    const status = bash("git status");

    it("counts a load before the first git write", () => {
        expect(loadDecision([status, load, bash("git add a.ts")])).toBe(true);
    });

    it("counts no load after the first git write", () => {
        expect(loadDecision([bash("git add a.ts"), load])).toBe(false);
    });

    it("counts no load after the 8th tool call", () => {
        expect(loadDecision([...Array(8).fill(status), load])).toBe(false);
    });

    it("waits while no load and no git write occurred", () => {
        expect(loadDecision(Array(7).fill(status))).toBeNull();
    });
});
