// The fake `gh` of the semver output tests. The runner puts a `gh` wrapper
// first on PATH that runs this file with FAKE_GH_PRS (the prs.json of the
// run) and FAKE_GH_LOG (gh-calls.txt). Each call adds its arguments to the
// log as one JSON line. `gh pr list` and `gh pr view` answer from prs.json.
// `gh pr create`, `gh pr merge`, and `gh pr close` change prs.json only. The
// fake gh never changes Git refs. `fakeGh` is pure, so vitest tests it
// without Git.

import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

// A pull request with the field names of `gh --json`. A test can add more
// fields, and `--json` gives them too.
export type Pr = {
    number: number;
    title: string;
    body: string;
    state: "OPEN" | "MERGED" | "CLOSED";
    headRefName: string;
    baseRefName: string;
    headRefOid: string | null;
    mergeable: "MERGEABLE" | "CONFLICTING" | "UNKNOWN";
    isDraft: boolean;
    url: string;
    autoMergeRequest: { mergeMethod: string } | null;
    mergeCommit: { oid: string } | null;
    [field: string]: unknown;
};

// What the fake gh reads from the repository of the run.
export type GhContext = {
    currentBranch: string | null;
    defaultBranch: string;
    // The commit of the branch on origin, or null when origin has no branch.
    remoteHead: (branch: string) => string | null;
};

// `jq` is the --jq filter that the caller applies to stdout.
export type GhResult = {
    code: number;
    stdout: string;
    stderr: string;
    prs: Pr[];
    jq?: string;
};

export const REPO_URL = "https://github.com/example/project";

// The flags that take a value. Each other flag is a switch.
const VALUE_FLAGS: Record<string, string> = {
    "-B": "--base",
    "--base": "--base",
    "-H": "--head",
    "--head": "--head",
    "-t": "--title",
    "--title": "--title",
    "-b": "--body",
    "--body": "--body",
    "-F": "--body-file",
    "--body-file": "--body-file",
    "-s": "--state",
    "--state": "--state",
    "-L": "--limit",
    "--limit": "--limit",
    "-q": "--jq",
    "--jq": "--jq",
    "--json": "--json",
    "-R": "--repo",
    "--repo": "--repo",
    "-c": "--comment",
    "--comment": "--comment",
    "-l": "--label",
    "--label": "--label",
    "-a": "--assignee",
    "--assignee": "--assignee",
    "-r": "--reviewer",
    "--reviewer": "--reviewer",
    "-S": "--search",
    "--search": "--search",
    "-A": "--author",
    "--author": "--author",
    "--subject": "--subject",
    "-m": "--milestone",
    "--milestone": "--milestone",
};

type Parsed = { positional: string[]; flags: Map<string, string | true> };

// `gh pr merge` uses -m, -s, -r, and -d as switches.
const MERGE_SWITCHES = new Set(["-m", "-s", "-r", "-d"]);

function parseArgs(args: string[], switches = new Set<string>()): Parsed {
    const positional: string[] = [];
    const flags = new Map<string, string | true>();
    for (let i = 0; i < args.length; i++) {
        const arg = args[i] as string;
        const eq = arg.startsWith("--") ? arg.indexOf("=") : -1;
        const name = eq > 0 ? arg.slice(0, eq) : arg;
        const long = switches.has(name) ? undefined : VALUE_FLAGS[name];
        if (long && eq > 0) flags.set(long, arg.slice(eq + 1));
        else if (long) flags.set(long, args[++i] ?? "");
        else if (arg.startsWith("-")) flags.set(arg, true);
        else positional.push(arg);
    }
    return { positional, flags };
}

const ok = (stdout: string, prs: Pr[], jq?: string): GhResult => ({
    code: 0,
    stdout,
    stderr: "",
    prs,
    ...(jq === undefined ? {} : { jq }),
});

const fail = (stderr: string, prs: Pr[]): GhResult => ({
    code: 1,
    stdout: "",
    stderr: `${stderr}\n`,
    prs,
});

function pick(pr: Pr, fields: string): Record<string, unknown> {
    return Object.fromEntries(
        fields
            .split(",")
            .filter(Boolean)
            .map((field) => [field, pr[field] ?? null]),
    );
}

// The output of a read command: JSON with --json, or else text.
function output(
    value: Pr | Pr[],
    flags: Parsed["flags"],
    text: string,
    prs: Pr[],
): GhResult {
    const fields = flags.get("--json");
    if (typeof fields !== "string") return ok(text, prs);
    const picked = Array.isArray(value)
        ? value.map((pr) => pick(pr, fields))
        : pick(value, fields);
    const jq = flags.get("--jq");
    return ok(
        `${JSON.stringify(picked, null, 2)}\n`,
        prs,
        typeof jq === "string" ? jq : undefined,
    );
}

// Finds the pull request of a number, a URL, or a branch. Without one, the
// open pull request of the current branch.
function find(prs: Pr[], selector: string | undefined, ctx: GhContext) {
    const number = /(?:^#?|\/pull\/)(\d+)$/.exec(selector ?? "")?.[1];
    if (number) return prs.find((pr) => pr.number === Number(number));
    const branch = selector ?? ctx.currentBranch;
    const matches = prs.filter((pr) => pr.headRefName === branch);
    return matches.find((pr) => pr.state === "OPEN") ?? matches.at(-1);
}

const STATES: Record<string, Pr["state"][]> = {
    open: ["OPEN"],
    closed: ["CLOSED"],
    merged: ["MERGED"],
    all: ["OPEN", "CLOSED", "MERGED"],
};

function list(prs: Pr[], { flags }: Parsed): GhResult {
    const state = String(flags.get("--state") ?? "open");
    const states = STATES[state];
    if (!states) return fail(`invalid argument "${state}" for "--state"`, prs);
    const selected = prs.filter(
        (pr) =>
            states.includes(pr.state) &&
            [
                ["--head", pr.headRefName],
                ["--base", pr.baseRefName],
            ].every(([flag, value]) => {
                const wanted = flags.get(flag as string);
                return typeof wanted !== "string" || wanted === value;
            }),
    );
    const text = selected
        .map(
            (pr) =>
                `${pr.number}\t${pr.title}\t${pr.headRefName}\t${pr.state}\n`,
        )
        .join("");
    return output(selected, flags, text, prs);
}

function view(prs: Pr[], parsed: Parsed, ctx: GhContext): GhResult {
    const selector = parsed.positional[0];
    const pr = find(prs, selector, ctx);
    if (!pr)
        return fail(
            `no pull requests found for ${selector ?? `branch "${ctx.currentBranch}"`}`,
            prs,
        );
    const text = `title:\t${pr.title}\nstate:\t${pr.state}\nnumber:\t${pr.number}\nurl:\t${pr.url}\nbase:\t${pr.baseRefName}\nhead:\t${pr.headRefName}\n--\n${pr.body}\n`;
    return output(pr, parsed.flags, text, prs);
}

function create(prs: Pr[], { flags }: Parsed, ctx: GhContext): GhResult {
    const value = (flag: string) => {
        const found = flags.get(flag);
        return typeof found === "string" ? found : undefined;
    };
    const head = value("--head") ?? ctx.currentBranch;
    if (!head) return fail("could not determine the head branch", prs);
    const base = value("--base") ?? ctx.defaultBranch;
    const oid = ctx.remoteHead(head);
    if (!oid)
        return fail(
            `aborted: you must first push the branch ${head} to a remote`,
            prs,
        );
    const open = prs.find(
        (pr) =>
            pr.state === "OPEN" &&
            pr.headRefName === head &&
            pr.baseRefName === base,
    );
    if (open)
        return fail(
            `a pull request for branch "${head}" into branch "${base}" already exists:\n${open.url}`,
            prs,
        );
    const number = Math.max(0, ...prs.map((pr) => pr.number)) + 1;
    const url = `${REPO_URL}/pull/${number}`;
    const created: Pr = {
        number,
        title: value("--title") ?? head,
        body: value("--body") ?? "",
        state: "OPEN",
        headRefName: head,
        baseRefName: base,
        headRefOid: oid,
        mergeable: "MERGEABLE",
        isDraft: flags.has("--draft") || flags.has("-d"),
        url,
        autoMergeRequest: null,
        mergeCommit: null,
    };
    return ok(`${url}\n`, [...prs, created]);
}

const METHODS: Record<string, string> = {
    "--merge": "MERGE",
    "-m": "MERGE",
    "--squash": "SQUASH",
    "-s": "SQUASH",
    "--rebase": "REBASE",
    "-r": "REBASE",
};

// Changes one pull request. A merge without --auto merges at once. With
// --auto, the pull request stays open with auto-merge on.
function change(
    prs: Pr[],
    action: "merge" | "close",
    parsed: Parsed,
    ctx: GhContext,
): GhResult {
    const pr = find(prs, parsed.positional[0], ctx);
    if (!pr) return fail("no pull request found", prs);
    if (pr.state !== "OPEN")
        return fail(`pull request #${pr.number} is ${pr.state}`, prs);
    let changed: Pr;
    if (action === "close") {
        changed = { ...pr, state: "CLOSED" };
    } else {
        const method = Object.entries(METHODS).find(([flag]) =>
            parsed.flags.has(flag),
        )?.[1];
        if (!method)
            return fail(
                "--merge, --rebase, or --squash required when not running interactively",
                prs,
            );
        changed = parsed.flags.has("--auto")
            ? { ...pr, autoMergeRequest: { mergeMethod: method } }
            : { ...pr, state: "MERGED" };
    }
    const verb =
        action === "close"
            ? "Closed"
            : changed.state === "MERGED"
              ? "Merged"
              : "Auto-merge enabled for";
    return ok(
        `${verb} pull request #${pr.number}\n`,
        prs.map((item) => (item === pr ? changed : item)),
    );
}

// Runs one gh call against the pull requests. It never changes `prs`, and
// gives the new list in the result.
export function fakeGh(args: string[], prs: Pr[], ctx: GhContext): GhResult {
    const [group, command, ...rest] = args;
    const parsed = parseArgs(
        rest,
        command === "merge" ? MERGE_SWITCHES : undefined,
    );
    if (group === "auth" && command === "status")
        return ok("github.com\n  ✓ Logged in to github.com\n", prs);
    if (group === "pr") {
        if (command === "list") return list(prs, parsed);
        if (command === "view") return view(prs, parsed, ctx);
        if (command === "create") return create(prs, parsed, ctx);
        if (command === "merge" || command === "close")
            return change(prs, command, parsed, ctx);
    }
    return fail(
        `fake gh: the command "gh ${args.join(" ")}" is not available in this test`,
        prs,
    );
}

function gitLine(args: string[]): string | null {
    const result = spawnSync("git", args, { encoding: "utf8" });
    return result.status === 0 ? result.stdout.trim() || null : null;
}

function main(args: string[]): number {
    const prsPath = process.env.FAKE_GH_PRS;
    const logPath = process.env.FAKE_GH_LOG;
    if (!prsPath || !logPath) {
        console.error("fake gh: FAKE_GH_PRS and FAKE_GH_LOG are not set");
        return 2;
    }
    appendFileSync(logPath, `${JSON.stringify(args)}\n`);
    const prs = JSON.parse(readFileSync(prsPath, "utf8")) as Pr[];
    const result = fakeGh(args, prs, {
        currentBranch: gitLine(["symbolic-ref", "--short", "-q", "HEAD"]),
        defaultBranch: "main",
        remoteHead: (branch) =>
            gitLine(["ls-remote", "origin", `refs/heads/${branch}`])?.split(
                "\t",
            )[0] ?? null,
    });
    if (result.prs !== prs)
        writeFileSync(prsPath, `${JSON.stringify(result.prs, null, 2)}\n`);
    let stdout = result.stdout;
    if (result.jq !== undefined) {
        stdout = execFileSync("jq", ["-r", result.jq], {
            input: stdout,
            encoding: "utf8",
        });
    }
    process.stdout.write(stdout);
    process.stderr.write(result.stderr);
    return result.code;
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
