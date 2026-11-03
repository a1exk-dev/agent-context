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
    // Shell commands that the runner cannot classify with confidence, for the
    // grader to examine. A call in `firstPolicyRead` or `firstChangelogWrite`
    // is never in these lists.
    possiblePolicyReads: PossibleCall[];
    possibleChangelogWrites: PossibleCall[];
    gitWrites: string[];
};

export type PossibleCall = { call: number; command: string };

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

// The parts of a shell command that run as separate commands, also in a
// command substitution. A heredoc body gives one part for each line.
const commandParts = (command: string) =>
    command.split(/&&|\|\||\$\(|[;\n|`]/).map((part) => part.trim());

// The words of a shell command part, without quotes, redirect signs, and the
// `$(`, backtick, and bracket signs that open a substitution or group.
const wordsOf = (part: string) =>
    part
        .split(/\s+/)
        .map((word) =>
            word.replace(/['"]/g, "").replace(/^[$(`{<]+|[)`}]+$/g, ""),
        )
        .filter(Boolean);

const escapeRegExp = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whether a shell glob matches one path segment. The glob signs are `*`, `?`,
// `[...]`, and `{a,b}`. A word from a script, for example `s[s.index(`, is no
// valid glob, and then matches only the same text.
function globMatches(glob: string, segment: string): boolean {
    const source = glob
        .split(/(\*+|\?|\[!?[^\]]+\]|\{[^}]*\})/)
        .map((piece, i) => {
            if (i % 2 === 0) return escapeRegExp(piece);
            if (piece.startsWith("*")) return "[^/]*";
            if (piece === "?") return "[^/]";
            if (piece.startsWith("{")) {
                return `(${piece.slice(1, -1).split(",").map(escapeRegExp).join("|")})`;
            }
            return `[${piece.slice(1, -1).replace(/^!/, "^").replace(/\\/g, "\\\\")}]`;
        })
        .join("");
    try {
        return new RegExp(`^${source}$`).test(segment);
    } catch {
        return glob === segment;
    }
}

const POLICY_SEGMENTS = POLICY.split("/");

// How a shell word covers the Changelog policy: "file" when the word, as a
// path or glob, names the policy file, "folder" when it names a folder above
// the file, or null. The word can be relative to the project or absolute.
function policyCover(word: string): "file" | "folder" | null {
    const segments = word.replace(/\/+$/, "").split("/");
    const start = segments.lastIndexOf(POLICY_SEGMENTS[0] as string);
    const tail =
        start === -1
            ? segments.slice(-(POLICY_SEGMENTS.length - 1))
            : segments.slice(start);
    const offset = start === -1 ? POLICY_SEGMENTS.length - tail.length : 0;
    if (tail.length === 0 || tail.length + offset > POLICY_SEGMENTS.length) {
        return null;
    }
    const matches = tail.every((segment, i) =>
        globMatches(segment, POLICY_SEGMENTS[i + offset] as string),
    );
    if (!matches) return null;
    if (tail.length + offset === POLICY_SEGMENTS.length) return "file";
    return start === -1 ? null : "folder";
}

// Commands that print or search the files that they get as arguments.
const READERS = new Set([
    "cat",
    "head",
    "tail",
    "sed",
    "less",
    "more",
    "grep",
    "egrep",
    "rg",
    "awk",
    "nl",
    "bat",
]);

const readerWords = (part: string) => {
    const words = wordsOf(part);
    const at = words.findIndex((word) => word !== "xargs" && word !== "sudo");
    return at !== -1 && READERS.has(words[at] as string)
        ? words.slice(at + 1)
        : null;
};

const POLICY_NAME = POLICY_SEGMENTS.at(-1) as string;
const READER_AFTER = new RegExp(
    String.raw`(^|\s)(xargs|-exec|-execdir)\s(.*[\s'"])?(${[...READERS].join("|")})\s`,
);

// A `find` on the policy or a folder above it that passes the files to a read
// command with `xargs` or `-exec`. Each `-name` or `-iname` test must match the
// policy file name.
function isFindRead(command: string): boolean {
    return command.split("\n").some((line) =>
        [...line.matchAll(/(^|[\s;&|(])find\s+([^|;&]*)/g)].some((match) => {
            const words = wordsOf((match[2] as string).replace(/['"]/g, ""));
            const firstTest = words.findIndex((word) => word.startsWith("-"));
            const paths = firstTest === -1 ? words : words.slice(0, firstTest);
            const names = words.flatMap((word, i) =>
                word === "-name" || word === "-iname"
                    ? [words[i + 1] ?? ""]
                    : [],
            );
            const rest = line.slice(
                (match.index ?? 0) +
                    match[0].length -
                    (match[2] as string).length,
            );
            return (
                paths.some((path) => policyCover(path) !== null) &&
                names.every((name) => globMatches(name, POLICY_NAME)) &&
                READER_AFTER.test(`${rest} `)
            );
        }),
    );
}

// A read of the Changelog policy: a Read tool call on the file, a shell read
// command with an argument that names the file, also by a glob, or a `find`
// that passes the file to a read command.
export function isPolicyRead(call: ToolCall): boolean {
    if (pathOf(call).endsWith(POLICY)) return true;
    const command = commandOf(call);
    return (
        commandParts(command).some((part) =>
            readerWords(part)?.some((word) => policyCover(word) === "file"),
        ) || isFindRead(command)
    );
}

// `CHANGELOG.md` as a whole file name, not as part of `CHANGELOG.md.bak`.
const CHANGELOG = String.raw`(\S*\/)?CHANGELOG\.md(?![\w.])`;

// A shell command part that writes to CHANGELOG.md with a redirect, `tee`,
// `sed -i`, `perl -i`, or `mv` or `cp` onto the file.
const isShellWrite = (part: string) =>
    new RegExp(String.raw`(>>?|\btee\b(\s+-a)?)\s*${CHANGELOG}`).test(part) ||
    new RegExp(String.raw`(^|\s)(sed|perl)\s(.*\s)?-\w*i\b.*${CHANGELOG}`).test(
        part,
    ) ||
    new RegExp(String.raw`\b(mv|cp)\b.*\s${CHANGELOG}\s*$`).test(part);

// A Python, Node, or Bun script in the command that writes to CHANGELOG.md:
// a file write call on a string with the file name, or on a name that the
// script binds to that string.
function isScriptWrite(command: string): boolean {
    const names = [
        ...command.matchAll(
            /(\w+)\s*=\s*(?:Path\()?\s*['"][^'"\n]*CHANGELOG\.md['"]/g,
        ),
    ].map((match) => String.raw`\b${match[1]}\b`);
    const target = [
        String.raw`['"][^'"\n]*CHANGELOG\.md['"]\)?`,
        ...names,
    ].join("|");
    return [
        String.raw`\bopen\(\s*(${target})\s*,\s*['"][wa]`,
        String.raw`(${target})\.(write_text|write_bytes)\(`,
        String.raw`\b(writeFileSync|writeFile|appendFileSync|appendFile|Bun\.write)\(\s*(${target})`,
    ].some((pattern) => new RegExp(pattern).test(command));
}

const WRITE_TOOLS = new Set(["write", "edit", "multiedit", "notebookedit"]);

// A change to CHANGELOG.md: a write tool on the file, a shell command that
// writes to it, or a script in a shell command that writes to it.
export function isChangelogWrite(call: ToolCall): boolean {
    if (WRITE_TOOLS.has(call.name.toLowerCase())) {
        return /(^|\/)CHANGELOG\.md$/.test(pathOf(call));
    }
    const command = commandOf(call);
    return (
        commandParts(command.replace(/['"]/g, "")).some(isShellWrite) ||
        isScriptWrite(command)
    );
}

// Words in a shell command that start a script.
const SCRIPTS = /(^|[\s;&|(])(python3?|node|bun|deno|perl|ruby)\s/;
// Words that pass file names on to another command, or search a folder.
const INDIRECT =
    /(^|\s)(xargs|-exec|-execdir|rg|grep\s+(-\w*[rR]\w*|--recursive))\s/;

// A shell command that is no certain read, but that names the Changelog
// policy or a folder above it, and that can read the file: a script, a
// recursive search, `xargs`, or `find -exec`, or a read command for a word
// that names the file. A plain read command such as `cat docs/*` gets the
// folder docs/agents, not the file, so it does not count.
export function isPossiblePolicyRead(call: ToolCall): boolean {
    const command = commandOf(call);
    if (!command || isPolicyRead(call)) return false;
    const covers = wordsOf(command.replace(/['"]/g, " ")).map(policyCover);
    if (SCRIPTS.test(command) || INDIRECT.test(command)) {
        return covers.some((cover) => cover !== null);
    }
    return (
        covers.includes("file") &&
        commandParts(command).some((part) => readerWords(part) !== null)
    );
}

// Commands and git subcommands that do not change the files that they name.
const READ_ONLY = new Set([
    ...READERS,
    "cd",
    "diff",
    "echo",
    "file",
    "ls",
    "printf",
    "stat",
    "test",
    "wc",
]);
const READ_ONLY_GIT = new Set([
    "add",
    "blame",
    "cat-file",
    "commit",
    "diff",
    "grep",
    "log",
    "ls-files",
    "rev-parse",
    "show",
    "status",
]);

const isReadOnlyPart = (part: string) => {
    const words = wordsOf(part).filter((word) => !/^\w+=/.test(word));
    const [name] = words;
    if (name === "git") {
        const [git] = gitCommands(part);
        return git !== undefined && READ_ONLY_GIT.has(git.sub);
    }
    return name !== undefined && READ_ONLY.has(name);
};

const MENTIONS_CHANGELOG = new RegExp(CHANGELOG);

// A shell command that names CHANGELOG.md in a script or in a command that
// is not known to be read-only. Quoted text outside a script, for example a
// commit message, does not count.
export function isPossibleChangelogWrite(call: ToolCall): boolean {
    const command = commandOf(call);
    if (!MENTIONS_CHANGELOG.test(command) || isChangelogWrite(call)) {
        return false;
    }
    if (SCRIPTS.test(command)) return true;
    const unquoted = command.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, "Q");
    return commandParts(unquoted).some(
        (part) => MENTIONS_CHANGELOG.test(part) && !isReadOnlyPart(part),
    );
}

export function auditRun(calls: ToolCall[]): RunAudit {
    const first = (test: (call: ToolCall) => boolean) => {
        const index = calls.findIndex(test);
        return index === -1 ? null : index;
    };
    const possible = (test: (call: ToolCall) => boolean) =>
        calls.flatMap((call, index) =>
            test(call) ? [{ call: index, command: commandOf(call) }] : [],
        );
    return {
        firstSkillLoad: first(isSkillLoad),
        firstPolicyRead: first(isPolicyRead),
        firstChangelogWrite: first(isChangelogWrite),
        possiblePolicyReads: possible(isPossiblePolicyRead),
        possibleChangelogWrites: possible(isPossibleChangelogWrite),
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
