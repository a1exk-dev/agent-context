// cspell:ignore Xours Xtheirs
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { auditCalls, hideCommand, readEvals } from "./eval-lib.ts";

const bash = (command: string) => ({ name: "Bash", input: { command } });
const skill = { name: "Skill", input: { skill: "semver" } };
const readPolicy = {
    name: "Read",
    input: { file_path: "/w/project/docs/agents/semver-policy.md" },
};

describe("readEvals", () => {
    it("puts the common statements V1 to V6 before the statements of each test", () => {
        const [first] = readEvals("17");
        expect(first?.id).toBe(17);
        expect(first?.assertions.slice(0, 6).map((item) => item.id)).toEqual([
            "V1",
            "V2",
            "V3",
            "V4",
            "V5",
            "V6",
        ]);
        expect(first?.assertions.length).toBeGreaterThan(6);
    });
});

describe("auditCalls", () => {
    it("gives the first Skill load, policy read, and branch, tag, merge, push, or gh write", () => {
        const audit = auditCalls([
            bash("git status"),
            skill,
            readPolicy,
            bash(
                "git rev-parse --verify develop && git switch -c feature/search develop",
            ),
        ]);
        expect(audit).toEqual({
            firstSkillLoad: 1,
            firstPolicyRead: 2,
            firstAction: 3,
            forbidden: [],
        });
    });

    it("counts a read of SKILL.md and a cat of the policy", () => {
        const audit = auditCalls([
            {
                name: "Read",
                input: { file_path: "/w/.claude/skills/semver/SKILL.md" },
            },
            bash("cat -n docs/agents/semver-policy.md"),
        ]);
        expect(audit.firstSkillLoad).toBe(0);
        expect(audit.firstPolicyRead).toBe(1);
    });

    it.each([
        "git switch -c feature/x",
        "git switch --create feature/x",
        "git checkout -b hotfix/login main",
        "git branch feature/x develop",
        "git branch -m feature/y",
        "git merge --no-ff release/1.3.0",
        "git tag v1.3.0",
        "git tag -a v1.3.0 -m 'Release'",
        "git push origin develop",
        "gh pr create --base develop",
        "gh pr merge 5 --merge",
        "gh pr close 5",
    ])("counts %s as an action", (command) => {
        expect(auditCalls([bash(command)]).firstAction).toBe(0);
    });

    it.each([
        "git branch",
        "git branch --show-current",
        "git branch -a",
        "git branch --merged develop",
        "git branch -d feature/x",
        "git tag",
        "git tag -l 'v*'",
        "git tag --list",
        "git switch develop",
        "git checkout main",
        "git merge-base main develop",
        "gh pr list --state merged",
        "gh pr view 5",
    ])("does not count %s as an action", (command) => {
        expect(auditCalls([bash(command)]).firstAction).toBeNull();
    });

    it.each([
        "git push --force origin develop",
        "git push -f",
        "git push --force-with-lease",
        "git push origin +develop",
        "git commit --no-verify -m x",
        "git commit -n -m x",
        "git merge -X ours main",
        "git merge -Xtheirs main",
        "git merge --strategy-option=ours main",
        "git merge -s ours main",
    ])("lists %s as forbidden", (command) => {
        expect(auditCalls([bash(command)]).forbidden).toHaveLength(1);
    });

    it("lists no forbidden command for a normal Finish", () => {
        expect(
            auditCalls([
                bash("git merge --no-ff -m 'Merge' release/1.3.0"),
                bash("git push origin main v1.3.0"),
                bash("git push origin --delete feature/x"),
            ]).forbidden,
        ).toEqual([]);
    });
});

describe("hideCommand", () => {
    it("replaces each folder with the command by a folder of links without it", () => {
        const root = mkdtempSync(join(tmpdir(), "hide-"));
        const withGh = join(root, "a");
        const without = join(root, "b");
        mkdirSync(withGh);
        mkdirSync(without);
        writeFileSync(join(withGh, "gh"), "");
        writeFileSync(join(withGh, "git"), "");
        const path = hideCommand(
            "gh",
            `${withGh}:${without}`,
            join(root, "shadow"),
        );
        const [first, second] = path.split(":");
        expect(second).toBe(without);
        expect(first).not.toBe(withGh);
        expect(readdirSync(first as string)).toEqual(["git"]);
        expect(existsSync(join(first as string, "gh"))).toBe(false);
    });
});
