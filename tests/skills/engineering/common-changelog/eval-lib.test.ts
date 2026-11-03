// cspell:ignore pathlib yzxoz
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
        // From a saved run transcript.
        bash(
            "cd /tmp/cc-eval-17-with_skill-za8lf7/project; python3 - <<'EOF'\np='CHANGELOG.md'\ns=open(p).read()\nold=s[s.index('## Unreleased'):s.index('## [1.2.0]')]\nnew='''## Unreleased\n'''\nopen(p,'w').write(s.replace(old,new))\nEOF",
        ),
        bash(
            "python3 -c \"from pathlib import Path; p = Path('CHANGELOG.md'); p.write_text(p.read_text().replace('a', 'b'))\"",
        ),
        bash(
            "node -e \"const fs = require('fs'); const t = fs.readFileSync('CHANGELOG.md', 'utf8'); fs.writeFileSync('CHANGELOG.md', t + '- x\\n')\"",
        ),
        bash("perl -pi -e 's/a/b/' CHANGELOG.md"),
        bash("cat >> CHANGELOG.md <<'EOF'\n\n### Added\nEOF"),
        bash("cp /tmp/new.md ./CHANGELOG.md && git add CHANGELOG.md"),
    ])("counts %j as a change", (call) => {
        expect(isChangelogWrite(call)).toBe(true);
    });

    it.each([
        { name: "Read", input: { file_path: "/w/project/CHANGELOG.md" } },
        { name: "Write", input: { file_path: "/w/project/HISTORY.md" } },
        bash("cat -n CHANGELOG.md"),
        bash("git diff CHANGELOG.md"),
        bash("grep -n Unreleased CHANGELOG.md > /tmp/out.txt"),
        bash("cat CHANGELOG.md > CHANGELOG.md.bak"),
        bash("cp CHANGELOG.md /tmp/old.md"),
        bash(
            "python3 - <<'EOF'\ns=open('CHANGELOG.md').read()\nopen('/tmp/notes.md','w').write(s)\nEOF",
        ),
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

    // The first three commands come from saved run transcripts.
    it.each([
        "cat docs/agents/*; cat README.md package.json src/*",
        "cd /tmp/cc-eval-34-without_skill-2yzxoz/project; ls docs/agents; cat docs/agents/* | head -80",
        "ls -R docs/agents && cat docs/agents/*; cat README.md",
        "head -n 40 docs/agents/*.md",
        "tail /w/project/docs/agents/changelog-*.md",
        "cat 'docs/agents/changelog-policy.md'",
        'echo "$(cat docs/agents/changelog-policy.md)"',
        "xargs cat docs/agents/{changelog,commit}-policy.md",
        // From saved run transcripts.
        "cd /tmp/cc-eval-28-without_skill-GijCQk/project; find docs -type f | xargs -I{} sh -c 'echo \"== {}\"; cat {}'; cat README.md",
        "find docs -type f | xargs -I{} sh -c 'echo \"== {}\"; cat {}'; git show 9541c53 --stat",
        "find docs/agents -name '*.md' -exec head {} +",
    ])("counts the shell read %j", (command) => {
        expect(isPolicyRead(bash(command))).toBe(true);
    });

    it.each([
        "ls -R docs/agents",
        "cat docs/*.md",
        "cat docs/agents/commit-policy.md",
        "rm docs/agents/changelog-policy.md",
        "cat docs/agents/[z-a]*",
        "find docs -name '*.ts' | xargs cat",
        "find docs -type f | head",
    ])("counts %j as no read", (command) => {
        expect(isPolicyRead(bash(command))).toBe(false);
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
            possiblePolicyReads: [],
            possibleChangelogWrites: [],
            gitWrites: ["git add CHANGELOG.md"],
        });
    });

    it("gives null for an item that did not occur", () => {
        expect(auditRun([bash("ls")])).toEqual({
            firstSkillLoad: null,
            firstPolicyRead: null,
            firstChangelogWrite: null,
            possiblePolicyReads: [],
            possibleChangelogWrites: [],
            gitWrites: [],
        });
    });

    it("lists the shell commands that can read the policy", () => {
        const audit = auditRun([
            bash("find docs/agents -name '*.md' | xargs wc -l"),
            bash("grep -rn Unreleased docs/"),
            bash("ls -R docs/agents"),
            bash("cat docs/agents/changelog-policy.md"),
            bash(
                "python3 -c \"print(open('docs/agents/changelog-policy.md').read())\"",
            ),
            // From saved run transcripts. `cat` gets the folder docs/agents,
            // not the files in it.
            bash(
                "ls -R docs src && cat docs/* README.md; git show --stat 9541c53",
            ),
            bash(
                "python3 - <<'EOF'\nold=s[s.index('## Unreleased'):s.index('## [1.2.0]')]\nEOF",
            ),
        ]);
        expect(audit.firstPolicyRead).toBe(3);
        expect(audit.possiblePolicyReads).toEqual([
            { call: 0, command: "find docs/agents -name '*.md' | xargs wc -l" },
            { call: 1, command: "grep -rn Unreleased docs/" },
            {
                call: 4,
                command:
                    "python3 -c \"print(open('docs/agents/changelog-policy.md').read())\"",
            },
        ]);
    });

    it("lists the shell commands that can change CHANGELOG.md", () => {
        const audit = auditRun([
            bash("git checkout -- CHANGELOG.md"),
            bash("python3 fix.py CHANGELOG.md"),
            bash("F=CHANGELOG.md; ed -s $F < fix.ed"),
            // From saved run transcripts.
            bash(
                "cd /tmp/cc-eval-13-with_skill-Kst7GB/project; cat -n CHANGELOG.md; git log --oneline v1.2.0 | head",
            ),
            bash(
                "cd /tmp/cc-eval-37-with_skill-E6zx1y/project; git rev-parse v1.2.0^{commit}; git show dbcc682:CHANGELOG.md",
            ),
            bash('git commit -m "docs: update CHANGELOG.md"'),
            bash("wc -l CHANGELOG.md && diff CHANGELOG.md /tmp/old.md"),
        ]);
        expect(audit.firstChangelogWrite).toBeNull();
        expect(audit.possibleChangelogWrites.map(({ call }) => call)).toEqual([
            0, 1, 2,
        ]);
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
