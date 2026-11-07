// cspell:ignore pathlib yzxoz nsed
import { describe, expect, it } from "vitest";
import {
    auditRun,
    changelogBefore,
    isChangelogWrite,
    isPolicyRead,
    isPolicyWrite,
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
        { name: "Write", input: { file_path: "/w/project/HISTORY.md" } },
        { name: "Edit", input: { file_path: "changelog.md" } },
        bash("sed -i 's/a/b/' NEWS.md"),
        bash("echo '- Fix x' >> ./CHANGES.md"),
        bash("git mv HISTORY.md OLD-HISTORY.md"),
        bash("rm HISTORY.md"),
        // From saved run transcripts.
        bash(
            "cd /tmp/cc-eval-48-with_skill-B2CBLh/project && git log --format=%an 3227833^1..3227833^2 && mv HISTORY.md CHANGELOG.md && cat -n CHANGELOG.md && git status --short",
        ),
        bash(
            "git log -1 --format='%an' 5e6f6a1 && git mv HISTORY.md CHANGELOG.md",
        ),
        bash(
            "cd /tmp/cc-eval-25-with_skill-F3DyI6/project\nsed -i '11a - Fix `slugify()` keeping leading spaces ([#6](https://github.com/example/demo/pull/6)) (Bob)' CHANGELOG.md\ncat -n CHANGELOG.md",
        ),
        bash(
            "cd /tmp/cc-eval-44-with_skill-maZvSm/project && { printf '# Changelog\\n\\n'; cat CHANGELOG.md; } > /tmp/cl.new && mv /tmp/cl.new CHANGELOG.md && cat -n CHANGELOG.md",
        ),
    ])("counts %j as a change", (call) => {
        expect(isChangelogWrite(call)).toBe(true);
    });

    it.each([
        { name: "Read", input: { file_path: "/w/project/CHANGELOG.md" } },
        { name: "Write", input: { file_path: "/w/project/README.md" } },
        // From saved run transcripts: a policy file with a wrong name, and a
        // read of HISTORY.md.
        bash(
            "cat > docs/agents/changelog.md <<'EOF'\n# Changelog policy\n\nRules for agents and maintainers editing `CHANGELOG.md`.\nEOF",
        ),
        bash(
            "cd /tmp/cc-eval-47-with_skill-ak8BrD/project; cat -n HISTORY.md; ls -a",
        ),
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

describe("isPolicyWrite", () => {
    it.each([
        {
            name: "Edit",
            input: { file_path: "/w/project/docs/agents/changelog-policy.md" },
        },
        // From saved run transcripts.
        bash(
            "cd /tmp/cc-eval-25-with_skill-F3DyI6/project\nprintf -- '- Host: auto\\n- Unreleased: on\\n' >> docs/agents/changelog-policy.md\ncat -n docs/agents/changelog-policy.md",
        ),
        bash(
            "cd /tmp/cc-eval-22-with_skill-Q3lHUx/project && mkdir -p docs/agents && cat > docs/agents/changelog-policy.md <<'EOF'\n# Changelog policy\n\n- Notice: required\nEOF\ncat -n CHANGELOG.md",
        ),
    ])("counts %j as a change", (call) => {
        expect(isPolicyWrite(call)).toBe(true);
    });

    it.each([
        {
            name: "Read",
            input: { file_path: "/w/docs/agents/changelog-policy.md" },
        },
        bash("cat -n docs/agents/changelog-policy.md"),
        bash("echo x > CHANGELOG.md"),
    ])("counts %j as no change", (call) => {
        expect(isPolicyWrite(call)).toBe(false);
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
            { name: "Edit", input: { file_path: "/w/project/CHANGELOG.md" } },
            bash("git add CHANGELOG.md"),
        ]);
        expect(audit).toEqual({
            firstSkillLoad: 1,
            firstPolicyRead: 2,
            firstChangelogWrite: 3,
            firstPolicyWrite: null,
            possiblePolicyReads: [],
            possibleChangelogWrites: [],
            possiblePolicyWrites: [],
            gitWrites: ["git add CHANGELOG.md"],
        });
    });

    it("gives null for an item that did not occur", () => {
        expect(auditRun([bash("ls")])).toEqual({
            firstSkillLoad: null,
            firstPolicyRead: null,
            firstChangelogWrite: null,
            firstPolicyWrite: null,
            possiblePolicyReads: [],
            possibleChangelogWrites: [],
            possiblePolicyWrites: [],
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
            bash("ls -R docs/agents && cat docs/agents/*; cat README.md"),
            bash(
                "ls -R docs && cat docs/* README.md | head -80; grep -rni yank . --exclude-dir=.git",
            ),
            bash("ls docs && grep -ril changelog docs README.md"),
            bash("grep -rn -i notice . --include=*.md | grep -v node_modules"),
            bash('grep -rn "old\\|search\\|export\\|dark" src'),
            bash("grep -rn notice . --include=*.ts"),
            bash("grep -rn notice"),
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
            {
                call: 8,
                command:
                    "ls -R docs && cat docs/* README.md | head -80; grep -rni yank . --exclude-dir=.git",
            },
            {
                call: 9,
                command: "ls docs && grep -ril changelog docs README.md",
            },
            {
                call: 10,
                command:
                    "grep -rn -i notice . --include=*.md | grep -v node_modules",
            },
            { call: 13, command: "grep -rn notice" },
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

    it("gives the first change to the policy and lists possible changes", () => {
        const audit = auditRun([
            bash("cat -n docs/agents/changelog-policy.md"),
            bash("cd docs/agents && sed -i 's/on/off/' changelog-policy.md"),
            {
                name: "Write",
                input: {
                    file_path: "/w/project/docs/agents/changelog-policy.md",
                },
            },
            // From a saved run transcript: a policy file with a wrong name.
            bash(
                "cat > docs/agents/changelog.md <<'EOF'\n# Changelog policy\n\nRules for agents and maintainers editing `CHANGELOG.md`.\nEOF",
            ),
        ]);
        expect(audit.firstPolicyWrite).toBe(2);
        expect(audit.firstChangelogWrite).toBeNull();
        expect(audit.possiblePolicyWrites.map(({ call }) => call)).toEqual([1]);
        expect(audit.possibleChangelogWrites.map(({ call }) => call)).toEqual([
            3,
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

    it("finds the items of GitLab merge requests and Bitbucket pull requests", () => {
        const text = changelog
            .replace("/pull/5)", "/-/merge_requests/5)")
            .replace("/pull/6)", "/pull-requests/6)");
        expect(changelogBefore(text, [5, 6])).toBe(
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
    const write = {
        name: "Edit",
        input: { file_path: "/w/project/CHANGELOG.md" },
    };
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
