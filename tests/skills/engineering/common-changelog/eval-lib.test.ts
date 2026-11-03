import { describe, expect, it } from "vitest";
import {
    auditRun,
    changelogBefore,
    isChangelogWrite,
    isPolicyRead,
    isSkillLoad,
    loadDecision,
    readEvals,
} from "./eval-lib.ts";

const bash = (command: string) => ({ name: "Bash", input: { command } });

describe("readEvals", () => {
    it("puts the common statements before the statements of each test", () => {
        const [first] = readEvals("1");
        expect(first?.assertions[0]).toMatch(/^\[C1\]/);
        expect(first?.assertions.at(-1)).toMatch(/^\[1\.\d\]/);
    });

    it("reads all tests when no ids are given", () => {
        expect(readEvals("").length).toBeGreaterThan(1);
    });
});

describe("isSkillLoad", () => {
    it("counts a Skill call and a read of SKILL.md", () => {
        expect(
            isSkillLoad({
                name: "Skill",
                input: { skill: "common-changelog" },
            }),
        ).toBe(true);
        expect(
            isSkillLoad({
                name: "Read",
                input: {
                    file_path: "/w/.claude/skills/common-changelog/SKILL.md",
                },
            }),
        ).toBe(true);
        expect(
            isSkillLoad(bash("cat .claude/skills/common-changelog/SKILL.md")),
        ).toBe(true);
        expect(
            isSkillLoad({ name: "Skill", input: { skill: "git-commit" } }),
        ).toBe(false);
    });
});

describe("isChangelogWrite", () => {
    it.each([
        { name: "Write", input: { file_path: "/w/project/CHANGELOG.md" } },
        { name: "Edit", input: { file_path: "CHANGELOG.md" } },
        bash("printf '# Changelog\\n' > CHANGELOG.md"),
        bash("echo '- Fix x' >> CHANGELOG.md"),
        bash("sed -i 's/a/b/' CHANGELOG.md"),
        bash("cat new.md | tee CHANGELOG.md"),
        bash("mv /tmp/new.md CHANGELOG.md"),
    ])("counts %j as a change", (call) => {
        expect(isChangelogWrite(call)).toBe(true);
    });

    it.each([
        { name: "Read", input: { file_path: "/w/project/CHANGELOG.md" } },
        { name: "Write", input: { file_path: "/w/project/HISTORY.md" } },
        bash("cat -n CHANGELOG.md"),
        bash("git diff CHANGELOG.md"),
        bash("grep -n Unreleased CHANGELOG.md > /tmp/out.txt"),
    ])("counts %j as no change", (call) => {
        expect(isChangelogWrite(call)).toBe(false);
    });
});

describe("isPolicyRead", () => {
    it("counts a Read and a shell read of the Changelog policy", () => {
        expect(
            isPolicyRead({
                name: "Read",
                input: { file_path: "/w/docs/agents/changelog-policy.md" },
            }),
        ).toBe(true);
        expect(
            isPolicyRead(bash("cat -n docs/agents/changelog-policy.md")),
        ).toBe(true);
        expect(isPolicyRead(bash("cat -n CHANGELOG.md"))).toBe(false);
    });
});

describe("auditRun", () => {
    it("gives the first Skill load, policy read, and changelog change", () => {
        const audit = auditRun([
            bash("git status --porcelain"),
            { name: "Skill", input: { skill: "common-changelog" } },
            bash("cat -n docs/agents/changelog-policy.md"),
            { name: "Edit", input: { file_path: "/w/CHANGELOG.md" } },
            bash("git add CHANGELOG.md"),
        ]);
        expect(audit).toEqual({
            firstSkillLoad: 1,
            firstPolicyRead: 2,
            firstChangelogWrite: 3,
            gitWrites: ["git add CHANGELOG.md"],
        });
    });

    it("gives null for an item that did not occur", () => {
        expect(auditRun([bash("ls")])).toEqual({
            firstSkillLoad: null,
            firstPolicyRead: null,
            firstChangelogWrite: null,
            gitWrites: [],
        });
    });
});

describe("changelogBefore", () => {
    const changelog = [
        "# Changelog",
        "",
        "## Unreleased",
        "",
        "### Added",
        "",
        "- Add a ([#5](https://github.com/example/demo/pull/5)) (Alice)",
        "",
        "### Fixed",
        "",
        "- Fix b ([#6](https://github.com/example/demo/pull/6)) (Bob)",
        "",
        "## [1.2.0] - 2026-09-01",
        "",
        "### Added",
        "",
        "- Add c ([`3f2a9c1`](https://github.com/example/demo/commit/3f2a9c1))",
        "",
    ].join("\n");

    it("removes the Unreleased items of the pull requests and empty groups", () => {
        expect(changelogBefore(changelog, [6])).toBe(
            [
                "# Changelog",
                "",
                "## Unreleased",
                "",
                "### Added",
                "",
                "- Add a ([#5](https://github.com/example/demo/pull/5)) (Alice)",
                "",
                "## [1.2.0] - 2026-09-01",
                "",
                "### Added",
                "",
                "- Add c ([`3f2a9c1`](https://github.com/example/demo/commit/3f2a9c1))",
                "",
            ].join("\n"),
        );
    });

    it("removes an Unreleased section with no items left", () => {
        expect(changelogBefore(changelog, [5, 6])).toBe(
            [
                "# Changelog",
                "",
                "## [1.2.0] - 2026-09-01",
                "",
                "### Added",
                "",
                "- Add c ([`3f2a9c1`](https://github.com/example/demo/commit/3f2a9c1))",
                "",
            ].join("\n"),
        );
    });

    it("keeps a changelog with no Unreleased section", () => {
        const text = "# Changelog\n\nFree text about #5.\n";
        expect(changelogBefore(text, [5])).toBe(text);
    });
});

describe("loadDecision", () => {
    const load = { name: "Skill", input: { skill: "common-changelog" } };
    const write = { name: "Edit", input: { file_path: "/w/CHANGELOG.md" } };
    const read = bash("cat -n CHANGELOG.md");

    it("counts a load before the first change to CHANGELOG.md", () => {
        expect(loadDecision([read, load, write])).toBe(true);
    });

    it("counts no load after the first change to CHANGELOG.md", () => {
        expect(loadDecision([read, write, load])).toBe(false);
    });

    it("counts no load after the 8th tool call", () => {
        expect(loadDecision([...Array(8).fill(read), load])).toBe(false);
    });

    it("waits while no load and no change occurred", () => {
        expect(loadDecision(Array(7).fill(read))).toBeNull();
    });
});
