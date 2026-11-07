import { spawnSync } from "node:child_process";
import {
    chmodSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "../../../..");
const skillFolder = join(root, "skills/engineering/semver");
const script = join(skillFolder, "scripts/check.sh");

// The check container has no Git. A fake `git` first on PATH answers the 3
// Git commands of the script: `check-ref-format --branch` accepts each name
// without `..`, `tag --list` prints FAKE_TAGS, and `merge-base --is-ancestor`
// gives exit code 0 for each "<commit> <branch>" line of FAKE_ANCESTORS, and
// 128 for the commit `missing`.
const fakeBin = mkdtempSync(join(tmpdir(), "semver-check-"));
writeFileSync(
    join(fakeBin, "git"),
    `#!/bin/sh
case "$1" in
check-ref-format)
    case "$3" in *..*) echo "fatal: '$3' is not a valid branch name" >&2; exit 128 ;; esac
    printf '%s\\n' "$3" ;;
tag) printf '%s' "$FAKE_TAGS" ;;
merge-base)
    [ "$2" = --is-ancestor ] || exit 99
    [ "$3" = missing ] && { echo "fatal: Not a valid object name missing" >&2; exit 128; }
    printf '%s\n' "$FAKE_ANCESTORS" | grep -qxF "$3 $4" ;;
*) exit 99 ;;
esac
`,
);
chmodSync(join(fakeBin, "git"), 0o755);

function run(args: string[], tags = "", ancestors = "") {
    const result = spawnSync("sh", [script, ...args], {
        encoding: "utf8",
        env: {
            ...process.env,
            PATH: `${fakeBin}:${process.env.PATH}`,
            FAKE_TAGS: tags,
            FAKE_ANCESTORS: ancestors,
        },
    });
    return {
        code: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

describe("check.sh version", () => {
    it.each([
        "1.2.3",
        "1.2.3-rc.1+build.5",
        "0.0.0",
        "1.0.0-alpha-1.0.x7",
        "1.0.0+20130313144700",
    ])("accepts %s", (version) => {
        const result = run(["version", version]);
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(/^valid: /);
    });

    it.each([
        ["01.2.3", /leading zero/],
        ["1.2", /X\.Y\.Z/],
        ["v1.2.3", /no `v`/],
        ["1.2.3-rc.01", /pre-release.*leading zero/],
        ["1.2.3-rc..1", /pre-release.*empty/],
        ["1.2.3+build_5", /build metadata/],
        ["1.2.x", /X\.Y\.Z/],
        ["", /X\.Y\.Z/],
    ])("rejects %s", (version, reason) => {
        const result = run(["version", version]);
        expect(result.code).toBe(1);
        expect(result.stdout).toMatch(/^invalid: /);
        expect(result.stdout).toMatch(reason);
    });
});

describe("check.sh branch", () => {
    it.each([
        "release/1.3.0",
        "hotfix/login",
        "feature/x",
        "bugfix/login-crash",
    ])("accepts %s", (name) => {
        const result = run(["branch", name]);
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(/^valid: /);
    });

    it.each([
        ["release/1.3", /X\.Y\.Z/],
        ["release/1.3.0-rc.1", /X\.Y\.Z/],
        ["hotfix/1.2.1", /no version/],
        ["feature/", /no name after/],
        ["support/x", /feature\/, bugfix\/, release\/, or hotfix\//],
        ["main", /feature\/, bugfix\/, release\/, or hotfix\//],
        ["feature/a..b", /git check-ref-format/],
    ])("rejects %s", (name, reason) => {
        const result = run(["branch", name]);
        expect(result.code).toBe(1);
        expect(result.stdout).toMatch(/^invalid: /);
        expect(result.stdout).toMatch(reason);
    });
});

describe("check.sh release", () => {
    const tags = "v1.0.0\nv1.10.0\nv1.9.0\nv2.0.0-rc.1\nother\n";

    it("accepts a version above the last release tag", () => {
        const result = run(["release", "1.11.0", "v"], tags);
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(/^valid: .*1\.10\.0/);
    });

    it.each([
        ["1.9.5", /not above the last release 1\.10\.0/],
        ["1.10.0", /not above the last release 1\.10\.0/],
        ["1.3", /X\.Y\.Z/],
        ["1.11.0-rc.1", /X\.Y\.Z/],
        ["v1.11.0", /no `v`/],
    ])("rejects %s", (version, reason) => {
        const result = run(["release", version, "v"], tags);
        expect(result.code).toBe(1);
        expect(result.stdout).toMatch(/^invalid: /);
        expect(result.stdout).toMatch(reason);
    });

    it("rejects 1.1.0 when the last release tag is v1.2.0", () => {
        const result = run(["release", "1.1.0", "v"], "v1.2.0\n");
        expect(result.code).toBe(1);
        expect(result.stdout).toMatch(/not above the last release 1\.2\.0/);
    });

    it("reads only tags without a prefix when the Tag prefix is none", () => {
        const result = run(["release", "1.3.0", "none"], "1.2.0\nv2.0.0\n");
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(/1\.2\.0/);
    });

    it("accepts each version when no release tag exists", () => {
        const result = run(["release", "0.1.0", "v"], "other\n");
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(/^valid: .*no release tag/);
    });
});

describe("check.sh ancestor", () => {
    it("accepts a commit that the branch contains", () => {
        const result = run(
            ["ancestor", "v1.2.0", "origin/develop"],
            "",
            "v1.2.0 origin/develop",
        );
        expect(result.code).toBe(0);
        expect(result.stdout).toMatch(
            /^valid: origin\/develop contains v1\.2\.0/,
        );
    });

    it("rejects a commit that the branch does not contain", () => {
        const result = run(
            ["ancestor", "v1.2.0", "HEAD"],
            "",
            "v1.2.0 origin/develop",
        );
        expect(result.code).toBe(1);
        expect(result.stdout).toMatch(
            /^invalid: HEAD does not contain v1\.2\.0/,
        );
    });

    it("exits 2 when Git cannot find the commit", () => {
        const result = run(["ancestor", "missing", "HEAD"]);
        expect(result.code).toBe(2);
        expect(result.stdout).toBe("");
        expect(result.stderr).toMatch(/merge-base/);
    });
});

describe("check.sh usage", () => {
    it.each([
        [[]],
        [["size", "1.2.3"]],
        [["version"]],
        [["release", "1.2.3"]],
        [["release", "1.2.3", "x"]],
        [["ancestor", "abc"]],
    ])("exits 2 for %j", (args) => {
        const result = run(args);
        expect(result.code).toBe(2);
        expect(result.stdout).toBe("");
        expect(result.stderr).toMatch(/usage/);
    });
});

describe("the semver Skill works alone", () => {
    // The Skill folders of this repo, and the Skills that a project can
    // install next to this Skill.
    const otherSkills = [
        "common-changelog",
        ...readdirSync(join(root, "skills"), { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .flatMap((category) =>
                readdirSync(join(root, "skills", category.name)),
            ),
    ].filter((name) => name !== "semver");

    const instructions = readdirSync(skillFolder, { recursive: true })
        .map(String)
        .filter((path) => path.endsWith(".md"));

    it("finds SKILL.md and other Skills to look for", () => {
        expect(instructions).toContain("SKILL.md");
        expect(otherSkills).toContain("git-commit");
    });

    it.each(instructions)("%s names no other Skill", (path) => {
        const text = readFileSync(join(skillFolder, path), "utf8");
        const named = otherSkills.filter((name) =>
            new RegExp(`(^|[^\\w-])${name}($|[^\\w-])`, "i").test(text),
        );
        expect(named).toEqual([]);
    });
});
