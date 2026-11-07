// The script checks of the semver output tests. A `script` statement of
// evals.json names its check and gives its `args`. grade.ts builds the Run
// of a saved run folder and calls the check. A later test adds a check here
// only when no check fits with other `args`.

import type { ToolCall } from "../../writing/agent-instructions/eval-lib.ts";
import { auditCalls } from "./eval-lib.ts";
import type { Pr } from "./fake-gh.ts";
import { type Commit, type GitState, isAncestor, POLICY } from "./git-state.ts";

// The saved files of one run. `calls` are the tool calls of the main agent
// in their sequence. `ghCalls` are the arguments of each fake gh call.
export type Run = {
    before: GitState;
    after: GitState;
    calls: ToolCall[];
    prsBefore: Pr[];
    prsAfter: Pr[];
    ghCalls: string[][];
    report: string;
};

export type Verdict = { passed: boolean; evidence: string };
export type Check = (run: Run, args: Record<string, unknown>) => Verdict;

const PROTECTED = ["CHANGELOG.md", "package.json"];
const VERSION = "(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)";
const HEADS = "refs/heads/";
const TAGS = "refs/tags/";

function verdict(problems: string[], ok: string): Verdict {
    return problems.length === 0
        ? { passed: true, evidence: ok }
        : { passed: false, evidence: problems.join("\n") };
}

// The branch names and the Tag prefix of the policy at the end of the run,
// or at the start when the run deleted it. A missing Setting gets its
// default.
export function policyOf(run: Run): {
    production: string;
    development: string | null;
    tagPrefix: string;
} {
    const text = run.after.policy ?? run.before.policy ?? "";
    const setting = (name: string, fallback: string) =>
        new RegExp(`^- ${name}: (.+)$`, "m").exec(text)?.[1]?.trim() ??
        fallback;
    const development = setting("Development branch", "develop");
    return {
        production: setting("Production branch", "main"),
        development: development === "none" ? null : development,
        tagPrefix: setting("Tag prefix", "v") === "none" ? "" : "v",
    };
}

const named = (refs: Record<string, string>, prefix: string) =>
    Object.fromEntries(
        Object.entries(refs)
            .filter(([ref]) => ref.startsWith(prefix))
            .map(([ref, sha]) => [ref.slice(prefix.length), sha]),
    );

const allCommits = (run: Run): Commit[] => [
    ...run.before.commits,
    ...run.after.commits,
];

const newNames = (run: Run, prefix: string) => {
    const before = new Set([
        ...Object.keys(named(run.before.refs, prefix)),
        ...Object.keys(named(run.before.origin, prefix)),
    ]);
    return [
        ...new Set([
            ...Object.keys(named(run.after.refs, prefix)),
            ...Object.keys(named(run.after.origin, prefix)),
        ]),
    ].filter((name) => !before.has(name));
};

function skillLoadedFirst(run: Run): Verdict {
    const { firstSkillLoad, firstAction } = auditCalls(run.calls);
    if (firstSkillLoad === null)
        return { passed: false, evidence: "The run did not load the Skill." };
    if (firstAction !== null && firstAction < firstSkillLoad)
        return {
            passed: false,
            evidence: `Tool call ${firstAction} acted before the Skill loaded at tool call ${firstSkillLoad}.`,
        };
    return {
        passed: true,
        evidence: `The Skill loaded at tool call ${firstSkillLoad}, the first action is at ${firstAction ?? "none"}.`,
    };
}

function policyReadFirst(run: Run): Verdict {
    if (run.before.policy === null)
        return { passed: true, evidence: "No policy file at the start." };
    const { firstPolicyRead, firstAction } = auditCalls(run.calls);
    if (firstPolicyRead === null)
        return { passed: false, evidence: "The run did not read the policy." };
    if (firstAction !== null && firstAction < firstPolicyRead)
        return {
            passed: false,
            evidence: `Tool call ${firstAction} acted before the policy read at tool call ${firstPolicyRead}.`,
        };
    return {
        passed: true,
        evidence: `The run read the policy at tool call ${firstPolicyRead}.`,
    };
}

// A new commit with 1 parent is a squash merge when one branch or tag of the
// start has each changed file with the same blob.
function isSquash(run: Run, commit: Commit): boolean {
    return Object.values(run.before.trees).some((tree) =>
        commit.files.every((file) => (tree[file.path] ?? null) === file.blob),
    );
}

function onlyAllowedChanges(run: Run): Verdict {
    const problems: string[] = [];
    const statusBefore = new Set(run.before.status);
    for (const line of run.after.status) {
        if (statusBefore.has(line)) continue;
        const path = line.slice(3);
        if (path !== POLICY) problems.push(`Changed file: ${line}`);
        else if (![" ", "?"].includes(line[0] ?? ""))
            problems.push(`The policy file is staged: ${line}`);
    }
    for (const path of run.after.staged) {
        if (!run.before.staged.includes(path))
            problems.push(`Staged file: ${path}`);
    }
    const known = new Map(
        PROTECTED.map((path) => [
            path,
            new Set(Object.values(run.before.trees).map((tree) => tree[path])),
        ]),
    );
    const tips = {
        ...named(run.after.refs, HEADS),
        ...Object.fromEntries(
            Object.entries(named(run.after.origin, HEADS)).map(
                ([name, sha]) => [`origin/${name}`, sha],
            ),
        ),
    };
    for (const [branch, sha] of Object.entries(tips)) {
        const tree = run.after.trees[sha];
        if (!tree) continue;
        for (const path of PROTECTED) {
            if (!known.get(path)?.has(tree[path]))
                problems.push(`${path} changed on ${branch}.`);
        }
    }
    const old = new Set(run.before.commits.map((commit) => commit.sha));
    for (const commit of run.after.commits) {
        if (old.has(commit.sha) || commit.parents.length >= 2) continue;
        if (!isSquash(run, commit))
            problems.push(
                `New commit ${commit.sha.slice(0, 7)} is no merge: ${commit.message.split("\n")[0]}`,
            );
    }
    return verdict(
        problems,
        "Only allowed changes: no other changed file, and only merges as new commits.",
    );
}

// The cleanup test of a deleted branch: its pull request is MERGED with the
// branch tip as head, or its target contains the tip. A release or hotfix
// branch also needs its tag and its Back-merge.
function deleteProblem(run: Run, branch: string, tip: string): string | null {
    const policy = policyOf(run);
    const commits = allCommits(run);
    const type = branch.split("/")[0] ?? "";
    if (!["feature", "bugfix", "release", "hotfix"].includes(type))
        return `${branch} is no feature, bugfix, release, or hotfix branch.`;
    const toProduction =
        ["release", "hotfix"].includes(type) || policy.development === null;
    const target = toProduction ? policy.production : policy.development;
    const targetTips = [
        run.after.refs[`${HEADS}${target}`],
        run.after.origin[`${HEADS}${target}`],
    ].filter((sha): sha is string => sha !== undefined);
    const merged =
        run.prsAfter.some(
            (pr) =>
                pr.headRefName === branch &&
                pr.state === "MERGED" &&
                pr.headRefOid === tip,
        ) ||
        targetTips.some(
            (sha) =>
                isAncestor(commits, tip, sha) || squashedInto(run, tip, sha),
        );
    if (!merged)
        return `${branch} has no MERGED pull request with its tip, and ${target} does not contain it.`;
    if (!["release", "hotfix"].includes(type)) return null;
    const tags = {
        ...named(run.after.origin, TAGS),
        ...named(run.after.refs, TAGS),
    };
    const tag =
        type === "release"
            ? tags[`${policy.tagPrefix}${branch.slice("release/".length)}`]
            : newNames(run, TAGS)
                  .map((name) => tags[name] as string)
                  .find((sha) => isAncestor(commits, tip, sha));
    if (!tag) return `${branch} was deleted before its tag existed.`;
    if (policy.development === null) return null;
    const development = policy.development;
    const backMerged =
        [run.after.refs, run.after.origin].some((refs) => {
            const sha = refs[`${HEADS}${development}`];
            return sha !== undefined && isAncestor(commits, tag, sha);
        }) ||
        run.prsAfter.some(
            (pr) =>
                pr.baseRefName === development &&
                (pr.headRefName === policy.production ||
                    pr.headRefName.startsWith("bugfix/back-merge-")),
        );
    return backMerged
        ? null
        : `${branch} was deleted before its Back-merge existed.`;
}

// True when `target` contains a new commit with 1 parent whose changed
// files each have the blob of the tree of `tip`: a squash merge of `tip`.
function squashedInto(run: Run, tip: string, target: string): boolean {
    const tree = run.before.trees[tip];
    if (!tree) return false;
    const old = new Set(run.before.commits.map((commit) => commit.sha));
    const commits = allCommits(run);
    return run.after.commits.some(
        (commit) =>
            !old.has(commit.sha) &&
            commit.parents.length === 1 &&
            commit.files.length > 0 &&
            commit.files.every(
                (file) => (tree[file.path] ?? null) === file.blob,
            ) &&
            isAncestor(commits, commit.sha, target),
    );
}

function safeHistory(run: Run): Verdict {
    const problems = auditCalls(run.calls).forbidden.map(
        (command) => `Forbidden command: ${command}`,
    );
    const commits = allCommits(run);
    for (const [ref, sha] of Object.entries(run.before.origin)) {
        const now = run.after.origin[ref];
        if (now === undefined || now === sha) continue;
        if (ref.startsWith(TAGS) || !isAncestor(commits, sha, now))
            problems.push(
                `origin ${ref} moved from ${sha} to ${now} without its commits.`,
            );
    }
    const pushed = Object.values(run.before.origin);
    for (const [ref, sha] of Object.entries(run.before.refs)) {
        const now = run.after.refs[ref];
        if (!ref.startsWith(HEADS) || now === undefined || now === sha)
            continue;
        const onOrigin = pushed.some((tip) => isAncestor(commits, sha, tip));
        if (onOrigin && !isAncestor(commits, sha, now))
            problems.push(
                `${ref} lost the commit ${sha}, which origin contains.`,
            );
    }
    for (const [place, before, after] of [
        ["local", run.before.refs, run.after.refs],
        ["origin", run.before.origin, run.after.origin],
    ] as const) {
        for (const [branch, tip] of Object.entries(named(before, HEADS))) {
            if (`${HEADS}${branch}` in after) continue;
            const problem = deleteProblem(run, branch, tip);
            if (problem) problems.push(`Deleted (${place}): ${problem}`);
        }
    }
    return verdict(
        problems,
        "No forbidden command, no lost commit, and each deleted branch passes the cleanup test.",
    );
}

const VERSION_IN_NAME = /\d+\.\d+/;

function branchProblem(name: string, run: Run): string | null {
    const policy = policyOf(run);
    if (name === policy.production || name === policy.development) return null;
    if (/^(feature|bugfix)\/.+$/.test(name)) return null;
    if (new RegExp(`^release/${VERSION}$`).test(name)) return null;
    if (/^hotfix\/.+$/.test(name) && !VERSION_IN_NAME.test(name)) return null;
    return `The branch ${name} does not follow the policy.`;
}

function policyNames(run: Run): Verdict {
    const { tagPrefix } = policyOf(run);
    const tagForm = new RegExp(`^${tagPrefix}${VERSION}$`);
    const problems = [
        ...newNames(run, HEADS).map((name) => branchProblem(name, run)),
        ...newNames(run, TAGS).map((name) =>
            tagForm.test(name)
                ? null
                : `The tag ${name} is not ${tagPrefix}X.Y.Z.`,
        ),
    ].filter((problem): problem is string => problem !== null);
    return verdict(problems, "Each new branch and tag follows the policy.");
}

// One new local branch with the prefix, at the commit of `base` at the
// start, and checked out. When `args.name` gives the full name, the new
// branch has that name.
function branchStarted(run: Run, args: Record<string, unknown>): Verdict {
    const prefix = String(args.prefix);
    const base = String(args.base);
    const created = Object.keys(named(run.after.refs, HEADS)).filter(
        (name) => !(`${HEADS}${name}` in run.before.refs),
    );
    if (created.length !== 1)
        return {
            passed: false,
            evidence: `New local branches: ${created.join(", ") || "none"}.`,
        };
    const name = created[0] as string;
    const baseSha =
        run.before.refs[`${HEADS}${base}`] ??
        run.before.origin[`${HEADS}${base}`];
    const problems: string[] = [];
    if (!name.startsWith(prefix) || name.length === prefix.length)
        problems.push(`${name} is not ${prefix}<name>.`);
    if (args.name !== undefined && name !== args.name)
        problems.push(`${name} is not ${String(args.name)}.`);
    if (run.after.refs[`${HEADS}${name}`] !== baseSha)
        problems.push(`${name} is not at the commit of ${base} (${baseSha}).`);
    if (run.after.head !== name)
        problems.push(`HEAD is ${run.after.head}, not ${name}.`);
    return verdict(problems, `${name} starts at ${base} and is checked out.`);
}

function noVersionInName(run: Run, args: Record<string, unknown>): Verdict {
    const prefix = String(args.prefix);
    const names = newNames(run, HEADS).filter((name) =>
        name.startsWith(prefix),
    );
    if (names.length === 0)
        return { passed: false, evidence: `No new ${prefix} branch.` };
    return verdict(
        names
            .filter((name) => VERSION_IN_NAME.test(name))
            .map((name) => `${name} has a version.`),
        `No version in ${names.join(", ")}.`,
    );
}

function originUnchanged(run: Run): Verdict {
    const refs = new Set([
        ...Object.keys(run.before.origin),
        ...Object.keys(run.after.origin),
    ]);
    return verdict(
        [...refs]
            .filter((ref) => run.before.origin[ref] !== run.after.origin[ref])
            .map(
                (ref) =>
                    `origin ${ref}: ${run.before.origin[ref] ?? "none"} -> ${run.after.origin[ref] ?? "none"}`,
            ),
        "The refs of origin are unchanged.",
    );
}

const GH_WRITES = ["create", "merge", "close"];

// A stopped job: the local refs, HEAD, and the refs of origin are unchanged,
// and no gh call wrote a pull request.
function stopped(run: Run): Verdict {
    const origin = originUnchanged(run);
    const problems = origin.passed ? [] : [origin.evidence];
    const refs = new Set([
        ...Object.keys(run.before.refs),
        ...Object.keys(run.after.refs),
    ]);
    for (const ref of refs) {
        if (run.before.refs[ref] !== run.after.refs[ref])
            problems.push(
                `${ref}: ${run.before.refs[ref] ?? "none"} -> ${run.after.refs[ref] ?? "none"}`,
            );
    }
    if (run.before.head !== run.after.head)
        problems.push(`HEAD: ${run.before.head} -> ${run.after.head}`);
    for (const args of run.ghCalls) {
        if (args[0] === "pr" && GH_WRITES.includes(args[1] ?? ""))
            problems.push(`gh write call: gh ${args.join(" ")}`);
    }
    return verdict(problems, "No ref, HEAD, or pull request changed.");
}

const endTrimmed = (text: string | null) =>
    text === null ? null : `${text.trimEnd()}\n`;

// The policy file at the end is exactly `args.text`, apart from blank lines
// at its end, and is not staged. A null text means no policy file.
function policyFile(run: Run, args: Record<string, unknown>): Verdict {
    const expected = endTrimmed((args.text as string | null) ?? null);
    const actual = endTrimmed(run.after.policy);
    const problems: string[] = [];
    if (actual !== expected)
        problems.push(
            `The policy file is:\n${actual ?? "(missing)"}\nnot:\n${expected ?? "(missing)"}`,
        );
    if (run.after.staged.includes(POLICY))
        problems.push("The policy file is staged.");
    return verdict(problems, "The policy file is as expected and not staged.");
}

function policyUnchanged(run: Run): Verdict {
    return run.before.policy === run.after.policy
        ? { passed: true, evidence: "The policy file is unchanged." }
        : {
              passed: false,
              evidence: `The policy file changed to:\n${run.after.policy ?? "(missing)"}`,
          };
}

// Each of `args.words` is in the report, in any case.
function reportNames(run: Run, args: Record<string, unknown>): Verdict {
    const report = run.report.toLowerCase();
    const words = args.words as string[];
    return verdict(
        words
            .filter((word) => !report.includes(word.toLowerCase()))
            .map((word) => `The report does not give "${word}".`),
        `The report gives each of ${words.length} words.`,
    );
}

// A job that stops: no new or moved ref, local or on origin, no new commit,
// no file change, the same HEAD, and no pull request change or gh write.
function noChange(run: Run): Verdict {
    const problems: string[] = [];
    for (const [place, before, after] of [
        ["local", run.before.refs, run.after.refs],
        ["origin", run.before.origin, run.after.origin],
    ] as const) {
        for (const ref of new Set([
            ...Object.keys(before),
            ...Object.keys(after),
        ])) {
            if (before[ref] !== after[ref])
                problems.push(
                    `${place} ${ref}: ${before[ref] ?? "none"} -> ${after[ref] ?? "none"}`,
                );
        }
    }
    const old = new Set(run.before.commits.map((commit) => commit.sha));
    for (const commit of run.after.commits)
        if (!old.has(commit.sha))
            problems.push(`New commit ${commit.sha.slice(0, 7)}.`);
    if (run.after.head !== run.before.head)
        problems.push(
            `HEAD moved from ${run.before.head} to ${run.after.head}.`,
        );
    if (
        JSON.stringify([
            run.after.status,
            run.after.staged,
            run.after.policy,
        ]) !==
        JSON.stringify([
            run.before.status,
            run.before.staged,
            run.before.policy,
        ])
    )
        problems.push("The working tree changed.");
    if (JSON.stringify(run.prsAfter) !== JSON.stringify(run.prsBefore))
        problems.push("The pull requests changed.");
    for (const args of run.ghCalls)
        if (["create", "merge", "close"].includes(args[1] ?? ""))
            problems.push(`gh write call: gh ${args.join(" ")}`);
    return verdict(problems, "The run changed nothing.");
}

// The commit of a branch or a tag: a local branch, else an origin branch,
// at the start of the run, else a tag at the end of the run.
function commitOf(run: Run, name: string): string | undefined {
    return (
        run.before.refs[`${HEADS}${name}`] ??
        run.before.origin[`${HEADS}${name}`] ??
        run.after.refs[`${TAGS}${name}`] ??
        run.after.origin[`${TAGS}${name}`]
    );
}

const newCommitList = (run: Run): Commit[] => {
    const old = new Set(run.before.commits.map((commit) => commit.sha));
    return run.after.commits.filter((commit) => !old.has(commit.sha));
};

// The local `args.target` at the end is a new merge commit. Its first
// parent is the target at the start, and its second parent is the commit
// of `args.second`, a branch or a tag.
function mergedWith(run: Run, args: Record<string, unknown>): Verdict {
    const target = String(args.target);
    const second = String(args.second);
    const tip = run.after.refs[`${HEADS}${target}`];
    const commit = run.after.commits.find((item) => item.sha === tip);
    const parents = [commitOf(run, target), commitOf(run, second)];
    if (!commit)
        return { passed: false, evidence: `No local ${target} at the end.` };
    if (run.before.commits.some((item) => item.sha === tip))
        return { passed: false, evidence: `${target} has no new commit.` };
    return verdict(
        JSON.stringify(commit.parents) === JSON.stringify(parents)
            ? []
            : [
                  `${target} is at ${tip?.slice(0, 7)} with the parents ${commit.parents.join(", ") || "none"}, not ${parents.join(", ")}.`,
              ],
        `${target} is a merge commit of ${second}.`,
    );
}

// The tag `args.tag`, local and on origin, is at the local `args.branch` at
// the end.
function tagAt(run: Run, args: Record<string, unknown>): Verdict {
    const tag = `${TAGS}${String(args.tag)}`;
    const branch = run.after.refs[`${HEADS}${String(args.branch)}`];
    const problems: string[] = [];
    for (const [place, refs] of [
        ["local", run.after.refs],
        ["origin", run.after.origin],
    ] as const) {
        if (branch === undefined || refs[tag] !== branch)
            problems.push(
                `The ${place} tag ${String(args.tag)} is at ${refs[tag] ?? "none"}, not at ${String(args.branch)} (${branch ?? "none"}).`,
            );
    }
    return verdict(
        problems,
        `${String(args.tag)} is at ${String(args.branch)}.`,
    );
}

// Each of `args.refs`, a branch or a tag, has the same commit local and on
// origin at the end.
function pushed(run: Run, args: Record<string, unknown>): Verdict {
    const problems = (args.refs as string[]).flatMap((name) => {
        const local =
            run.after.refs[`${HEADS}${name}`] ??
            run.after.refs[`${TAGS}${name}`];
        const remote =
            run.after.origin[`${HEADS}${name}`] ??
            run.after.origin[`${TAGS}${name}`];
        return local !== undefined && local === remote
            ? []
            : [
                  `${name}: local ${local ?? "none"}, origin ${remote ?? "none"}.`,
              ];
    });
    return verdict(problems, "origin has each branch and tag.");
}

function branchDeleted(run: Run, args: Record<string, unknown>): Verdict {
    const ref = `${HEADS}${String(args.branch)}`;
    return verdict(
        [
            ref in run.after.refs ? "The local branch exists." : null,
            ref in run.after.origin ? "The origin branch exists." : null,
        ].filter((problem): problem is string => problem !== null),
        `${String(args.branch)} is deleted, local and on origin.`,
    );
}

// The new commits of the run: `args.count` of them, when given. With
// `args.patterns`, the first line of each new commit matches a pattern, and
// each pattern matches a new commit.
function newCommits(run: Run, args: Record<string, unknown>): Verdict {
    const subjects = newCommitList(run).map(
        (commit) => commit.message.split("\n")[0] ?? "",
    );
    const problems: string[] = [];
    if (args.count !== undefined && subjects.length !== Number(args.count))
        problems.push(
            `${subjects.length} new commits, not ${String(args.count)}: ${subjects.join(" | ")}`,
        );
    const patterns = ((args.patterns as string[] | undefined) ?? []).map(
        (pattern) => new RegExp(pattern),
    );
    if (patterns.length > 0) {
        for (const subject of subjects)
            if (!patterns.some((pattern) => pattern.test(subject)))
                problems.push(`No pattern matches "${subject}".`);
        for (const pattern of patterns)
            if (!subjects.some((subject) => pattern.test(subject)))
                problems.push(`No new commit matches ${pattern}.`);
    }
    return verdict(problems, `New commits: ${subjects.join(" | ")}`);
}

// The local `args.target` at the end is one new commit on the target at
// the start. It changes exactly the files that `args.branch` at the start
// changes against that target, with the same blobs.
function squashMerged(run: Run, args: Record<string, unknown>): Verdict {
    const target = String(args.target);
    const base = commitOf(run, target) ?? "";
    const tip = commitOf(run, String(args.branch)) ?? "";
    const commit = run.after.commits.find(
        (item) => item.sha === run.after.refs[`${HEADS}${target}`],
    );
    const baseTree = run.before.trees[base] ?? {};
    const tipTree = run.before.trees[tip] ?? {};
    if (!commit || run.before.commits.some((item) => item.sha === commit.sha))
        return { passed: false, evidence: `${target} has no new commit.` };
    const problems: string[] = [];
    if (JSON.stringify(commit.parents) !== JSON.stringify([base]))
        problems.push(
            `The parents are ${commit.parents.join(", ")}, not ${base}.`,
        );
    const expected = [
        ...new Set([...Object.keys(baseTree), ...Object.keys(tipTree)]),
    ]
        .filter((path) => baseTree[path] !== tipTree[path])
        .map((path) => `${path} ${tipTree[path] ?? "deleted"}`)
        .sort();
    const actual = commit.files
        .map((file) => `${file.path} ${file.blob ?? "deleted"}`)
        .sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected))
        problems.push(
            `The commit changes ${actual.join(", ")}, not ${expected.join(", ")}.`,
        );
    return verdict(
        problems,
        `${target} is one squash commit of ${String(args.branch)}.`,
    );
}

export const checks: Record<string, Check> = {
    skillLoadedFirst,
    policyReadFirst,
    onlyAllowedChanges,
    safeHistory,
    policyNames,
    branchStarted,
    noVersionInName,
    originUnchanged,
    stopped,
    policyFile,
    policyUnchanged,
    reportNames,
    noChange,
    mergedWith,
    tagAt,
    pushed,
    branchDeleted,
    newCommits,
    squashMerged,
};
