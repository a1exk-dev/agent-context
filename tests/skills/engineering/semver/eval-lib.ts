// Shared code for the semver eval runners: the tests of evals.json, the test
// repository with its local `origin` and fake `gh`, and the pure audit of
// the commands of a run. The general runner code comes from the
// agent-instructions tests, and the git command parser from the git-commit
// tests. The pure functions call no Bun API, so vitest imports them on Node.
// cspell:ignore Xours Xtheirs

import { spawnSync } from "node:child_process";
import {
    chmodSync,
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    symlinkSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ToolCall } from "../../writing/agent-instructions/eval-lib.ts";
import { gitCommands } from "../git-commit/eval-lib.ts";
import { type Pr, REPO_URL } from "./fake-gh.ts";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const SKILL = join(HERE, "../../../../skills/engineering/semver");
export const SKILL_DIR = ".claude/skills/semver";
export const FORCE_SKILL = "Use the semver skill for this task.";
export const START_TAG = "v1.2.0";

// A statement of an output test. grade.ts decides a `script` statement with
// the function `check` of assertions.ts and its `args`. The grader subagent
// decides an `llm` statement.
export type Statement = {
    id: string;
    text: string;
    grader: "script" | "llm";
    check?: string;
    args?: Record<string, unknown>;
};

// A pull request of `setup.prs`. `headRefOid` and `mergeCommit` are Git
// revisions that prepare resolves after the setup steps. Without
// `headRefOid`, the pull request gets the commit of its head branch on
// origin.
export type PrSetup = Partial<Omit<Pr, "headRefOid" | "mergeCommit">> & {
    number: number;
    headRefName: string;
    baseRefName: string;
    headRefOid?: string;
    mergeCommit?: string;
};

// `gh: false` puts no `gh` on PATH, also not the real one.
export type Setup = {
    overlay?: string | null;
    remove?: string[];
    steps?: string[];
    prs?: PrSetup[];
    gh?: boolean;
};

export type Eval = {
    id: number;
    name: string;
    prompt: string;
    setup: Setup;
    assertions: Statement[];
};

// Reads the tests of evals.json. Each test gets the common statements first.
export function readEvals(ids: string): Eval[] {
    const wanted = ids.split(",").filter(Boolean).map(Number);
    const file = JSON.parse(readFileSync(join(HERE, "evals.json"), "utf8")) as {
        common_assertions: Statement[];
        evals: Eval[];
    };
    return file.evals
        .filter((ev) => wanted.length === 0 || wanted.includes(ev.id))
        .map((ev) => ({
            ...ev,
            assertions: [...file.common_assertions, ...ev.assertions],
        }));
}

// What the statements V1, V2, and V4 need from the tool calls of the main
// agent. Indexes count the tool calls from 0. An action is a command that
// makes a branch, merges, makes a tag, pushes, or writes through `gh`.
export type Audit = {
    firstSkillLoad: number | null;
    firstPolicyRead: number | null;
    firstAction: number | null;
    forbidden: string[];
};

const pathOf = (call: ToolCall) =>
    String(
        call.input.file_path ?? call.input.filePath ?? call.input.path ?? "",
    );
const commandOf = (call: ToolCall) =>
    call.name.toLowerCase() === "bash" ? String(call.input.command ?? "") : "";

// A run loads the Skill when the agent calls it or reads its SKILL.md.
export function isSkillLoad(call: ToolCall): boolean {
    if (call.name.toLowerCase() === "skill") {
        return String(call.input.skill ?? call.input.name ?? "") === "semver";
    }
    const target = `${pathOf(call)} ${commandOf(call)}`;
    return target.includes("semver/SKILL.md");
}

export function isPolicyRead(call: ToolCall): boolean {
    return `${pathOf(call)} ${commandOf(call)}`.includes("semver-policy.md");
}

const BRANCH_READS = new Set([
    "-d",
    "-D",
    "--delete",
    "-l",
    "--list",
    "-a",
    "--all",
    "-r",
    "--remotes",
    "--show-current",
    "--contains",
    "--no-contains",
    "--merged",
    "--no-merged",
    "--points-at",
    "-v",
    "-vv",
    "--verbose",
    "-u",
    "--set-upstream-to",
    "--unset-upstream",
    "--format",
    "--sort",
]);
const TAG_READS = new Set([
    "-l",
    "--list",
    "-d",
    "--delete",
    "-v",
    "--verify",
    "-n",
    "--contains",
    "--no-contains",
    "--points-at",
    "--merged",
    "--no-merged",
    "--sort",
    "--format",
]);

function isAction(sub: string, args: string[]): boolean {
    const flags = args.map((arg) => arg.split("=")[0] as string);
    const positional = args.some((arg) => !arg.startsWith("-"));
    switch (sub) {
        case "switch":
            return flags.some((flag) =>
                ["-c", "-C", "--create", "--force-create"].includes(flag),
            );
        case "checkout":
            return flags.some((flag) =>
                ["-b", "-B", "--orphan"].includes(flag),
            );
        case "branch":
            return positional && !flags.some((flag) => BRANCH_READS.has(flag));
        case "tag":
            return positional && !flags.some((flag) => TAG_READS.has(flag));
        case "merge":
        case "push":
            return true;
        default:
            return false;
    }
}

const SAFE_STRATEGY = (value: string | undefined) =>
    !["ours", "theirs"].includes(value ?? "");

function isForbidden(sub: string, args: string[]): boolean {
    if (args.includes("--no-verify")) return true;
    const short = args.filter((arg) => /^-[a-zA-Z]+$/.test(arg)).join("");
    if (sub === "commit" && short.includes("n")) return true;
    if (sub === "push") {
        return (
            short.includes("f") ||
            args.some((arg) => arg.startsWith("--force") || arg.startsWith("+"))
        );
    }
    if (!["merge", "pull", "rebase", "cherry-pick", "revert"].includes(sub))
        return false;
    return args.some((arg, i) => {
        const next = args[i + 1];
        if (
            arg === "-X" ||
            arg === "--strategy-option" ||
            arg === "-s" ||
            arg === "--strategy"
        )
            return !SAFE_STRATEGY(next);
        const joined = /^(?:-X|-s|--strategy-option=|--strategy=)(.+)$/.exec(
            arg,
        );
        return joined ? !SAFE_STRATEGY(joined[1]) : false;
    });
}

// Each `gh` command of a shell command, as its words.
function ghCommands(shell: string): string[][] {
    const unquoted = shell.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, "Q");
    return unquoted.split(/&&|\|\||[;|\n]/).flatMap((segment) => {
        const words = segment.trim().split(/\s+/);
        const start = words.indexOf("gh");
        return start === -1 ? [] : [words.slice(start + 1)];
    });
}

// The `gh pr` commands that write a pull request.
export const GH_WRITES = new Set(["create", "merge", "close"]);

export function auditCalls(calls: ToolCall[]): Audit {
    const audit: Audit = {
        firstSkillLoad: null,
        firstPolicyRead: null,
        firstAction: null,
        forbidden: [],
    };
    calls.forEach((call, index) => {
        if (audit.firstSkillLoad === null && isSkillLoad(call))
            audit.firstSkillLoad = index;
        if (audit.firstPolicyRead === null && isPolicyRead(call))
            audit.firstPolicyRead = index;
        const shell = commandOf(call);
        let action = ghCommands(shell).some(
            ([group, command]) =>
                group === "pr" && GH_WRITES.has(command ?? ""),
        );
        for (const { text, sub, args } of gitCommands(shell)) {
            if (isAction(sub, args)) action = true;
            if (isForbidden(sub, args)) audit.forbidden.push(text);
        }
        if (action && audit.firstAction === null) audit.firstAction = index;
    });
    return audit;
}

const MAX_LOAD_CALLS = 8;

// The load-test decision for the tool calls of a run so far: true when the
// Skill loaded before the first action and within the first 8 calls, false
// when an action or the 8th call came first, and null while the run must go
// on. The runner counts a run that ends with null as no load.
export function loadDecision(calls: ToolCall[]): boolean | null {
    const { firstSkillLoad, firstAction } = auditCalls(
        calls.slice(0, MAX_LOAD_CALLS),
    );
    if (firstSkillLoad !== null) {
        return firstAction === null || firstSkillLoad < firstAction;
    }
    if (firstAction !== null || calls.length >= MAX_LOAD_CALLS) return false;
    return null;
}

// Gives a PATH without the command `name`: each folder that has it becomes
// a new folder in `shadow` with a link to each other file of that folder.
export function hideCommand(
    name: string,
    path: string,
    shadow: string,
): string {
    return path
        .split(delimiter)
        .map((folder, index) => {
            if (!existsSync(join(folder, name))) return folder;
            const copy = join(shadow, String(index));
            mkdirSync(copy, { recursive: true });
            for (const entry of readdirSync(folder)) {
                if (entry !== name)
                    symlinkSync(join(folder, entry), join(copy, entry));
            }
            return copy;
        })
        .join(delimiter);
}

// A fixed identity and date make the start commit the same in each run.
const START_ENV = {
    GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z",
};

function run(
    cwd: string,
    command: string,
    args: string[],
    env: NodeJS.ProcessEnv = process.env,
): string {
    const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
    if (result.status !== 0)
        throw new Error(
            `${command} ${args.join(" ")} failed in ${cwd}:\n${result.stderr}`,
        );
    return result.stdout.trim();
}

const git = (cwd: string, ...args: string[]) =>
    run(cwd, "git", args, { ...process.env, ...START_ENV });

// The pull requests of `setup.prs` with the gh defaults and resolved commits.
function resolvePrs(work: string, prs: PrSetup[]): Pr[] {
    const revision = (rev: string) => git(work, "rev-parse", `${rev}^{commit}`);
    const remoteHead = (branch: string) =>
        git(work, "ls-remote", "origin", `refs/heads/${branch}`).split(
            "\t",
        )[0] || null;
    return prs.map((pr) => ({
        title: pr.headRefName,
        body: "",
        state: "OPEN",
        mergeable: "MERGEABLE",
        isDraft: false,
        url: `${REPO_URL}/pull/${pr.number}`,
        autoMergeRequest: null,
        ...pr,
        headRefOid:
            pr.headRefOid === undefined
                ? remoteHead(pr.headRefName)
                : revision(pr.headRefOid),
        mergeCommit:
            pr.mergeCommit === undefined
                ? null
                : { oid: revision(pr.mergeCommit) },
    }));
}

export type Prepared = {
    work: string;
    // The PATH of the run: the fake gh first, or no gh at all.
    path: string;
    prsPath: string;
    ghLog: string;
};

// Copies project/ and the overlay to a fresh folder outside this
// repository, so no AGENTS.md or CLAUDE.md of this repository loads, and
// deletes the paths in `setup.remove`. Then it makes the start commit on
// `main` with a fixed date, tags it v1.2.0, makes `develop` from it, and
// pushes the 2 branches and the tag to a local bare `origin`. Then it runs
// the setup steps of the test and writes prs.json for the fake gh. HEAD
// stays on `main` unless a step changes it.
export function prepare(
    ev: Eval,
    withSkill: boolean,
    prefix: string,
): Prepared {
    const root = mkdtempSync(join(tmpdir(), prefix));
    const work = join(root, "project");
    const origin = join(root, "origin.git");
    const bin = join(root, "bin");
    const prsPath = join(root, "prs.json");
    const ghLog = join(root, "gh-calls.txt");
    mkdirSync(bin);
    cpSync(join(HERE, "project"), work, { recursive: true });
    if (ev.setup.overlay) {
        cpSync(join(HERE, ev.setup.overlay), work, { recursive: true });
    }
    for (const path of ev.setup.remove ?? []) {
        rmSync(join(work, path), { recursive: true, force: true });
    }
    if (withSkill) cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
    git(work, "init", "-q", "-b", "main");
    git(work, "config", "user.name", "eval");
    git(work, "config", "user.email", "eval@example.com");
    git(work, "config", "commit.gpgsign", "false");
    git(work, "config", "tag.gpgsign", "false");
    git(work, "add", "-A");
    git(work, "commit", "-q", "-m", "start");
    git(work, "tag", START_TAG);
    git(work, "branch", "develop");
    git(root, "init", "-q", "--bare", "-b", "main", origin);
    git(work, "remote", "add", "origin", origin);
    git(work, "push", "-q", "-u", "origin", "main", "develop");
    git(work, "push", "-q", "origin", `refs/tags/${START_TAG}`);
    git(work, "remote", "set-head", "origin", "main");
    for (const step of ev.setup.steps ?? []) {
        run(work, "sh", ["-c", step], { ...process.env, ...START_ENV });
    }
    writeFileSync(
        prsPath,
        `${JSON.stringify(resolvePrs(work, ev.setup.prs ?? []), null, 2)}\n`,
    );
    writeFileSync(ghLog, "");
    let path = `${bin}${delimiter}${process.env.PATH ?? ""}`;
    if (ev.setup.gh === false) {
        path = hideCommand("gh", process.env.PATH ?? "", join(root, "path"));
    } else {
        const wrapper = join(bin, "gh");
        writeFileSync(
            wrapper,
            [
                "#!/bin/sh",
                `export FAKE_GH_PRS='${prsPath}'`,
                `export FAKE_GH_LOG='${ghLog}'`,
                `exec '${process.execPath}' '${join(HERE, "fake-gh.ts")}' "$@"`,
                "",
            ].join("\n"),
        );
        chmodSync(wrapper, 0o755);
    }
    return { work, path, prsPath, ghLog };
}
