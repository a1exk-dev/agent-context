// Shared code for the common-changelog eval runners: the test repository with
// its fixed history, the state that the grader reads, and the pure audit of
// the tool calls of a run. The pure functions call no Bun API, so vitest can
// import them on Node. The general runner code comes from the
// agent-instructions tests, and the git-command parser from the git-commit
// tests.

import {
    cpSync,
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    git,
    type ToolCall,
} from "../../writing/agent-instructions/eval-lib.ts";
import { gitCommands } from "../git-commit/eval-lib.ts";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const SKILL = join(
    HERE,
    "../../../../skills/engineering/common-changelog",
);
export const SKILL_DIR = ".claude/skills/common-changelog";
export const FORCE_SKILL = "Use the common-changelog skill for this task.";
export const POLICY = "docs/agents/changelog-policy.md";
export const DEFAULT_ORIGIN = "https://github.com/example/demo";

export type Eval = {
    id: number;
    name: string;
    prompt: string;
    setup: {
        // A folder whose files replace or add project files.
        overlay?: string | null;
        // Paths to delete from the project before the history.
        remove?: string[];
        // The branch of the run. The default is `feature/x`.
        branch?: string;
        // The URL of `origin`, or null for no remote.
        origin?: string | null;
        // Shell commands that run on the branch after the history.
        steps?: string[];
    };
    assertions: string[];
};

// Reads the tests of evals.json. Each test gets the common statements first.
export function readEvals(ids: string): Eval[] {
    const wanted = ids.split(",").filter(Boolean).map(Number);
    const file = JSON.parse(readFileSync(join(HERE, "evals.json"), "utf8")) as {
        common_assertions: string[];
        evals: Eval[];
    };
    return file.evals
        .filter((ev) => wanted.length === 0 || wanted.includes(ev.id))
        .map((ev) => ({
            ...ev,
            assertions: [...file.common_assertions, ...ev.assertions],
        }));
}

// The changelog before the given pull requests merged: their items leave the
// Unreleased section, then each empty group, then an empty Unreleased section.
// A changelog with no `## Unreleased` heading stays the same.
export function changelogBefore(text: string, pulls: number[]): string {
    const lines = text.split("\n");
    const start = lines.indexOf("## Unreleased");
    if (start === -1) return text;
    const nextRelease = lines.findIndex(
        (line, i) => i > start && line.startsWith("## "),
    );
    const end = nextRelease === -1 ? lines.length : nextRelease;
    const links = pulls.map((n) => `/pull/${n})`);
    const items = lines
        .slice(start + 1, end)
        .filter((line) => !links.some((link) => line.includes(link)));
    const groups: string[][] = [];
    for (const line of items) {
        if (line.startsWith("### ")) groups.push([line]);
        else if (line.startsWith("- ")) groups.at(-1)?.push(line);
    }
    const kept = groups.filter((group) => group.length > 1);
    const section = kept.length
        ? [
              "## Unreleased",
              "",
              ...kept.flatMap(([heading, ...rest]) => [
                  heading as string,
                  "",
                  ...rest,
                  "",
              ]),
          ]
        : [];
    return [...lines.slice(0, start), ...section, ...lines.slice(end)].join(
        "\n",
    );
}

// The source changes of pull requests #5 and #6 in the fixed history.
const TRUNCATE = `
export function truncate(text: string, max: number): string {
    return text.length <= max ? text : \`\${text.slice(0, max - 1)}…\`;
}
`;

// Makes the fixed history in a copy of project/ with the overlay of the test:
// a start commit with tag `v1.2.0` on `main`, then the merge commits of pull
// requests #5 (Alice) and #6 (Bob). Each pull request adds its Unreleased item
// to `CHANGELOG.md`. Pull request #6 has a second fix, leading spaces in
// `slugify()`, with no item, so that output tests can add that item. Then the run branch and the setup steps of the test.
// `origin` gets a URL but no push, so no test needs the network.
export async function prepare(
    ev: Eval,
    withSkill: boolean,
    prefix: string,
): Promise<{ work: string; startCommit: string }> {
    const root = mkdtempSync(join(tmpdir(), prefix));
    const work = join(root, "project");
    cpSync(join(HERE, "project"), work, { recursive: true });
    if (ev.setup.overlay) {
        cpSync(join(HERE, ev.setup.overlay), work, { recursive: true });
    }
    for (const path of ev.setup.remove ?? []) {
        rmSync(join(work, path), { recursive: true, force: true });
    }
    if (withSkill) cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });

    const changelogPath = join(work, "CHANGELOG.md");
    const changelog = existsSync(changelogPath)
        ? readFileSync(changelogPath, "utf8")
        : null;
    const setChangelog = (pulls: number[]) => {
        if (changelog !== null) {
            writeFileSync(changelogPath, changelogBefore(changelog, pulls));
        }
    };
    const strings = join(work, "src/strings.ts");
    const commit = async (
        message: string,
        date: string,
        author: string,
        args: string[] = [],
    ) => {
        await Bun.$`git ${args} -m ${message}`
            .cwd(work)
            .env({
                ...process.env,
                GIT_AUTHOR_NAME: author,
                GIT_AUTHOR_EMAIL: `${author.toLowerCase()}@example.com`,
                GIT_COMMITTER_NAME: "Maintainer",
                GIT_COMMITTER_EMAIL: "maintainer@example.com",
                GIT_AUTHOR_DATE: date,
                GIT_COMMITTER_DATE: date,
            })
            .quiet();
    };

    setChangelog([5, 6]);
    await git(work, ["init", "-q", "-b", "main"]);
    await git(work, ["config", "commit.gpgsign", "false"]);
    await git(work, ["config", "tag.gpgsign", "false"]);
    await git(work, ["add", "-A"]);
    await commit("chore: release 1.2.0", "2026-09-01T10:00:00Z", "Carol", [
        "commit",
        "-q",
    ]);
    await git(work, ["tag", "v1.2.0"]);

    await git(work, ["switch", "-q", "-c", "truncate"]);
    writeFileSync(strings, readFileSync(strings, "utf8") + TRUNCATE);
    setChangelog([6]);
    await git(work, ["add", "-A"]);
    await commit("feat: add truncate helper", "2026-09-10T10:00:00Z", "Alice", [
        "commit",
        "-q",
    ]);
    await git(work, ["switch", "-q", "main"]);
    await commit(
        "Merge pull request #5 from alice/truncate",
        "2026-09-11T10:00:00Z",
        "Maintainer",
        ["merge", "-q", "--no-ff", "truncate"],
    );

    await git(work, ["switch", "-q", "-c", "slugify-fixes"]);
    writeFileSync(
        strings,
        readFileSync(strings, "utf8").replace(
            "        .toLowerCase()",
            '        .normalize("NFKD")\n        .replace(/[\\u0300-\\u036f]/g, "")\n        .toLowerCase()',
        ),
    );
    setChangelog([]);
    await git(work, ["add", "-A"]);
    await commit(
        "fix: keep accented letters in slugify",
        "2026-09-20T10:00:00Z",
        "Bob",
        ["commit", "-q"],
    );
    writeFileSync(
        strings,
        readFileSync(strings, "utf8").replace(
            "        .toLowerCase()",
            "        .toLowerCase()\n        .trim()",
        ),
    );
    await git(work, ["add", "-A"]);
    await commit(
        "fix: trim leading spaces in slugify",
        "2026-09-20T11:00:00Z",
        "Bob",
        ["commit", "-q"],
    );
    await git(work, ["switch", "-q", "main"]);
    await commit(
        "Merge pull request #6 from bob/slugify-fixes",
        "2026-09-21T10:00:00Z",
        "Maintainer",
        ["merge", "-q", "--no-ff", "slugify-fixes"],
    );
    await git(work, ["branch", "-q", "-D", "truncate", "slugify-fixes"]);

    const branch = ev.setup.branch ?? "feature/x";
    if (branch !== "main") await git(work, ["switch", "-q", "-c", branch]);
    const origin =
        ev.setup.origin === undefined ? DEFAULT_ORIGIN : ev.setup.origin;
    if (origin !== null) await git(work, ["remote", "add", "origin", origin]);
    await git(work, ["config", "user.name", "eval"]);
    await git(work, ["config", "user.email", "eval@example.com"]);
    const startCommit = (await git(work, ["rev-parse", "HEAD"])).trim();
    for (const step of ev.setup.steps ?? []) {
        await Bun.$`sh -c ${step}`.cwd(work).quiet();
    }
    return { work, startCommit };
}

// The state that the grader reads: the commits, the status, the staged and
// unstaged changes, the remotes, `CHANGELOG.md` with line numbers, and the
// Changelog policy.
export async function repoState(work: string): Promise<string> {
    const file = (path: string) => {
        const full = join(work, path);
        if (!existsSync(full)) return "(missing)\n";
        return readFileSync(full, "utf8")
            .split("\n")
            .map((line, i) => `${String(i + 1).padStart(4)}  ${line}`)
            .join("\n");
    };
    const sections: [string, string | Promise<string>][] = [
        [
            "git log --all --graph",
            git(work, [
                "log",
                "--all",
                "--graph",
                "--format=%h %d %s (author %an, %ad)",
                "--date=short",
            ]),
        ],
        ["git branch --show-current", git(work, ["branch", "--show-current"])],
        ["git remote -v", git(work, ["remote", "-v"])],
        ["git status --porcelain", git(work, ["status", "--porcelain"])],
        ["git diff --cached", git(work, ["diff", "--cached"])],
        ["git diff", git(work, ["diff"])],
        ["CHANGELOG.md (with line numbers)", file("CHANGELOG.md")],
        [`${POLICY} (with line numbers)`, file(POLICY)],
    ];
    const parts = await Promise.all(
        sections.map(
            async ([title, text]) =>
                `## ${title}\n\n\`\`\`text\n${await text}\n\`\`\`\n`,
        ),
    );
    return parts.join("\n");
}

// What the runner finds in the tool calls of a run. Indexes count the tool
// calls of the main agent from 0.
export type RunAudit = {
    firstSkillLoad: number | null;
    firstPolicyRead: number | null;
    firstChangelogWrite: number | null;
    gitWrites: string[];
};

const GIT_WRITES = new Set([
    "add",
    "commit",
    "merge",
    "revert",
    "reset",
    "stash",
    "push",
]);

const pathOf = (call: ToolCall) =>
    String(call.input.file_path ?? call.input.filePath ?? "");
const commandOf = (call: ToolCall) =>
    call.name.toLowerCase() === "bash" ? String(call.input.command ?? "") : "";

// A run loads the Skill when the agent calls it or reads its SKILL.md.
export function isSkillLoad(call: ToolCall): boolean {
    if (call.name.toLowerCase() === "skill") {
        const name = call.input.skill ?? call.input.name ?? "";
        return String(name).includes("common-changelog");
    }
    const target = "common-changelog/SKILL.md";
    return pathOf(call).includes(target) || commandOf(call).includes(target);
}

export function isPolicyRead(call: ToolCall): boolean {
    return (
        pathOf(call).endsWith(POLICY) ||
        /\b(cat|head|sed|less|grep)\b[^|;&]*changelog-policy\.md/.test(
            commandOf(call),
        )
    );
}

const WRITE_TOOLS = new Set(["write", "edit", "multiedit", "notebookedit"]);

// A change to CHANGELOG.md: a write tool on the file, or a shell command that
// writes to it with a redirect, `tee`, `sed -i`, `mv`, or `cp`.
export function isChangelogWrite(call: ToolCall): boolean {
    if (WRITE_TOOLS.has(call.name.toLowerCase())) {
        return /(^|\/)CHANGELOG\.md$/.test(pathOf(call));
    }
    return commandOf(call)
        .split(/&&|\|\||[;\n]/)
        .some(
            (segment) =>
                /(>>?|\btee\b(\s+-a)?)\s*(\S*\/)?CHANGELOG\.md\b/.test(
                    segment,
                ) ||
                /(^|\s)sed\s+-i\b.*CHANGELOG\.md/.test(segment) ||
                /\b(mv|cp)\b.*\s(\S*\/)?CHANGELOG\.md\s*$/.test(segment),
        );
}

export function auditRun(calls: ToolCall[]): RunAudit {
    const first = (test: (call: ToolCall) => boolean) => {
        const index = calls.findIndex(test);
        return index === -1 ? null : index;
    };
    return {
        firstSkillLoad: first(isSkillLoad),
        firstPolicyRead: first(isPolicyRead),
        firstChangelogWrite: first(isChangelogWrite),
        gitWrites: calls
            .flatMap((call) => gitCommands(commandOf(call)))
            .filter((command) => GIT_WRITES.has(command.sub))
            .map((command) => command.text),
    };
}

const MAX_LOAD_CALLS = 8;

// The load-test decision for the tool calls of a run so far: true when the
// Skill loaded before the first change to CHANGELOG.md and within the first
// 8 calls, false when a change or the 8th call came first, and null when the
// run must continue.
export function loadDecision(calls: ToolCall[]): boolean | null {
    const { firstSkillLoad, firstChangelogWrite } = auditRun(
        calls.slice(0, MAX_LOAD_CALLS),
    );
    if (firstSkillLoad !== null) {
        return (
            firstChangelogWrite === null || firstSkillLoad < firstChangelogWrite
        );
    }
    if (firstChangelogWrite !== null || calls.length >= MAX_LOAD_CALLS) {
        return false;
    }
    return null;
}
