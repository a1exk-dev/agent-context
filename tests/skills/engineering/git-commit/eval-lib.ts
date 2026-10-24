// Shared code for the git-commit eval runners: the test repository with its
// `origin`, the git state for the grader, and the pure audit of the git
// commands of a run. The pure functions call no Bun API, so vitest can import
// them on Node. The general runner code comes from the agent-instructions
// tests.
// cspell:ignore nparents nrefs

import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    git,
    type ToolCall,
} from "../../writing/agent-instructions/eval-lib.ts";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const SKILL = join(HERE, "../../../../skills/engineering/git-commit");
export const SKILL_DIR = ".claude/skills/git-commit";
export const FORCE_SKILL = "Use the git-commit skill for this task.";

export type Eval = {
    id: number;
    name: string;
    prompt: string;
    setup: { overlay?: string | null; remove?: string[]; steps?: string[] };
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

// A fixed identity and date make the start commit the same in each run.
const START_ENV = {
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
};

// Copies project/ and the overlay to a fresh folder outside this repository,
// so no AGENTS.md or CLAUDE.md of this repository loads, and deletes the
// paths in `setup.remove`, for example the Commit policy. Then it makes the
// start commit, pushes it to a local bare `origin`, and runs the setup steps
// of the test.
export async function prepare(
    ev: Eval,
    withSkill: boolean,
    prefix: string,
): Promise<{ work: string; startCommit: string }> {
    const root = mkdtempSync(join(tmpdir(), prefix));
    const work = join(root, "project");
    const origin = join(root, "origin.git");
    cpSync(join(HERE, "project"), work, { recursive: true });
    if (ev.setup.overlay) {
        cpSync(join(HERE, ev.setup.overlay), work, { recursive: true });
    }
    for (const path of ev.setup.remove ?? []) {
        rmSync(join(work, path), { recursive: true, force: true });
    }
    if (withSkill) cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
    await git(work, ["init", "-q", "-b", "develop"]);
    await git(work, ["config", "user.name", "eval"]);
    await git(work, ["config", "user.email", "eval@example.com"]);
    await git(work, ["config", "commit.gpgsign", "false"]);
    await git(work, ["add", "-A"]);
    await Bun.$`git commit -q -m start`.cwd(work).env(gitEnv()).quiet();
    await git(root, ["init", "-q", "--bare", origin]);
    await git(work, ["remote", "add", "origin", origin]);
    await git(work, ["push", "-q", "-u", "origin", "develop"]);
    for (const step of ev.setup.steps ?? []) {
        await Bun.$`sh -c ${step}`.cwd(work).env(gitEnv()).quiet();
    }
    const startCommit = (await git(work, ["rev-parse", "HEAD"])).trim();
    return { work, startCommit };
}

function gitEnv(): Record<string, string | undefined> {
    return { ...process.env, ...START_ENV };
}

// The git state that the grader reads: the Commit policy, each commit after
// the start commit with its full message and stat, the status, and the refs
// of `origin`.
export async function gitState(
    work: string,
    startCommit: string,
): Promise<string> {
    const policy = join(work, "docs/agents/commit-policy.md");
    const sections: [string, Promise<string>][] = [
        [
            "git log --all (after the start commit)",
            newCommits(work, startCommit),
        ],
        ["git status --porcelain", git(work, ["status", "--porcelain"])],
        ["git diff --cached --stat", git(work, ["diff", "--cached", "--stat"])],
        ["git ls-remote origin", git(work, ["ls-remote", "origin"])],
        [
            "docs/agents/commit-policy.md",
            Bun.file(policy)
                .text()
                .catch(() => "(missing)\n"),
        ],
    ];
    const parts = await Promise.all(
        sections.map(async ([title, text]) => `## ${title}\n\n${await text}`),
    );
    return parts.join("\n");
}

async function newCommits(work: string, startCommit: string): Promise<string> {
    const log = await git(work, [
        "log",
        "--all",
        "--stat",
        "--format=commit %H%nparents %P%nrefs %D%n%n%B",
        `^${startCommit}`,
    ]);
    return log || "(none)\n";
}

// What the runner finds in the git commands of a run. Indexes count the tool
// calls of the run from 0.
export type GitAudit = {
    firstSkillLoad: number | null;
    firstGitWrite: number | null;
    forbidden: string[];
};

const GIT_WRITES = new Set(["add", "commit", "merge", "revert"]);

// A run loads the Skill when the agent calls it or reads its SKILL.md.
export function isSkillLoad(call: ToolCall): boolean {
    const input = call.input;
    if (call.name.toLowerCase() === "skill") {
        return String(input.skill ?? input.name ?? "").includes("git-commit");
    }
    return String(input.file_path ?? input.filePath ?? "").includes(
        "git-commit/SKILL.md",
    );
}

// Finds the first Skill load, the first git command that writes, and each
// git command that the statements forbid.
export function auditGit(calls: ToolCall[]): GitAudit {
    const audit: GitAudit = {
        firstSkillLoad: null,
        firstGitWrite: null,
        forbidden: [],
    };
    calls.forEach((call, index) => {
        if (audit.firstSkillLoad === null && isSkillLoad(call)) {
            audit.firstSkillLoad = index;
        }
        if (call.name.toLowerCase() !== "bash") return;
        for (const command of gitCommands(String(call.input.command ?? ""))) {
            if (audit.firstGitWrite === null && GIT_WRITES.has(command.sub)) {
                audit.firstGitWrite = index;
            }
            if (isForbidden(command)) audit.forbidden.push(command.text);
        }
    });
    return audit;
}

type GitCommand = { text: string; sub: string; args: string[] };

// Splits a shell command into its git commands. Quoted text becomes one
// token, so a message such as "add -A" is not a flag.
export function gitCommands(shell: string): GitCommand[] {
    const unquoted = shell.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, "Q");
    return unquoted.split(/&&|\|\||[;|\n]/).flatMap((segment) => {
        const words = segment.trim().split(/\s+/);
        const start = words.indexOf("git");
        if (start === -1) return [];
        let i = start + 1;
        while (words[i]?.startsWith("-")) {
            i += words[i] === "-C" || words[i] === "-c" ? 2 : 1;
        }
        const sub = words[i];
        if (!sub) return [];
        return [{ text: segment.trim(), sub, args: words.slice(i + 1) }];
    });
}

function isForbidden({ sub, args }: GitCommand): boolean {
    const short = args.filter((arg) => /^-[a-zA-Z]+$/.test(arg)).join("");
    if (args.includes("--no-verify")) return true;
    if (sub === "add") {
        return (
            /[Au]/.test(short) ||
            args.some((arg) => ["--all", "--update", "."].includes(arg))
        );
    }
    if (sub === "commit") return /[an]/.test(short) || args.includes("--all");
    if (sub === "push") {
        return (
            short.includes("f") ||
            args.some((arg) => arg.startsWith("--force") || arg.startsWith("+"))
        );
    }
    return false;
}
