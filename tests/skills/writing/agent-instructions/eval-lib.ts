// Shared code for the agent-instructions eval runners: fixture copy, git,
// job pool, timed process runs, options, output collection, and the pure
// parsers. The pure parsers call no Bun API, so vitest can import them on
// Node.

import {
    copyFileSync,
    cpSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import type { SpawnOptions } from "bun";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const SKILL = join(
    HERE,
    "../../../../skills/writing/agent-instructions",
);
export const SKILL_DIR = ".claude/skills/agent-instructions";
export const FORCE_SKILL = "Use the agent-instructions skill for this task.";
const MAX_JOBS = 5;

export type Eval = {
    id: number;
    name: string;
    prompt: string;
    setup: { overlay?: string | null; remove?: string[] };
    assertions: string[];
    known_mistakes?: unknown;
    disallowed_tools?: string[];
};

export function readEvals(ids: string): Eval[] {
    const wanted = ids.split(",").filter(Boolean).map(Number);
    const evals = (
        JSON.parse(readFileSync(join(HERE, "evals.json"), "utf8")) as {
            evals: Eval[];
        }
    ).evals;
    return evals.filter((ev) => wanted.length === 0 || wanted.includes(ev.id));
}

type StringOptions = Record<string, { type: "string"; default?: string }>;

// Reads the string flags of a runner. `--help` prints the usage, and a bad or
// missing `--out` flag prints a usage error.
export function readOptions<const O extends StringOptions>(
    usage: string,
    options: O,
): {
    [K in keyof O]: O[K]["default"] extends string
        ? string
        : string | undefined;
} & { out: string } {
    let values: Record<string, string | boolean | undefined>;
    try {
        values = parseArgs({
            options: { ...options, help: { type: "boolean", short: "h" } },
        }).values;
    } catch (error) {
        usageError(usage, (error as Error).message);
    }
    if (values.help) {
        console.log(usage);
        process.exit(0);
    }
    if (typeof values.out !== "string") usageError(usage, "--out is required");
    return values as never;
}

// Prints a usage error and exits with code 2, as argparse did.
export function usageError(usage: string, message: string): never {
    console.error(`${usage}\nerror: ${message}`);
    process.exit(2);
}

export function integerOption(
    usage: string,
    name: string,
    value: string,
): number {
    if (!/^\d+$/.test(value)) {
        usageError(usage, `--${name} must be an integer, got '${value}'`);
    }
    return Number(value);
}

// More runs at the same time hit the operator's usage limit (MEMORY.md).
export function jobsOption(usage: string, value: string): number {
    const jobs = integerOption(usage, "jobs", value);
    if (jobs < 1 || jobs > MAX_JOBS) {
        usageError(usage, `--jobs must be 1 to ${MAX_JOBS}, got ${jobs}`);
    }
    return jobs;
}

// Runs task on each item, at most `jobs` at a time, and keeps the item order.
// After a failure it starts no new task, waits for the running ones, and throws.
export async function runPool<T, R>(
    items: T[],
    jobs: number,
    task: (item: T) => Promise<R>,
): Promise<R[]> {
    const results: R[] = [];
    let next = 0;
    let failure: { error: unknown } | undefined;
    async function worker() {
        while (!failure && next < items.length) {
            const index = next++;
            try {
                results[index] = await task(items[index] as T);
            } catch (error) {
                failure ??= { error };
            }
        }
    }
    await Promise.all(
        Array.from({ length: Math.min(jobs, items.length) }, worker),
    );
    if (failure) throw failure.error;
    return results;
}

// Runs cmd and kills it after timeoutSeconds. `exited` gives the exit code,
// whether the timeout killed the run, and the run time in seconds.
export function spawnTimed<
    const Out extends SpawnOptions.Readable,
    const Err extends SpawnOptions.Readable,
>(
    cmd: string[],
    options: SpawnOptions.SpawnOptions<"ignore", Out, Err>,
    timeoutSeconds: number,
) {
    const start = performance.now();
    const proc = Bun.spawn(cmd, options);
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        proc.kill();
    }, timeoutSeconds * 1000);
    const exited = proc.exited.then((exitCode) => {
        clearTimeout(timer);
        const seconds = (performance.now() - start) / 1000;
        return { exitCode, timedOut, seconds };
    });
    return { proc, exited };
}

export async function git(cwd: string, args: string[]): Promise<string> {
    return await Bun.$`git ${args}`.cwd(cwd).quiet().text();
}

// Copies project/ to a fresh folder outside this repository, so no AGENTS.md
// or CLAUDE.md of this repository loads, and commits it as the start point.
export async function prepare(
    ev: Eval,
    withSkill: boolean,
    prefix: string,
): Promise<{ work: string; startCommit: string }> {
    const work = join(mkdtempSync(join(tmpdir(), prefix)), "project");
    cpSync(join(HERE, "project"), work, { recursive: true });
    if (ev.setup.overlay) {
        cpSync(join(HERE, ev.setup.overlay), work, { recursive: true });
    }
    for (const rel of ev.setup.remove ?? []) rmSync(join(work, rel));
    if (withSkill) cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
    await git(work, ["init", "-q", "-b", "develop"]);
    await git(work, ["add", "-A"]);
    await git(work, [
        "-c",
        "user.name=eval",
        "-c",
        "user.email=eval@example.com",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-q",
        "-m",
        "start",
    ]);
    const startCommit = (await git(work, ["rev-parse", "HEAD"])).trim();
    return { work, startCommit };
}

// Writes outputs/changes.diff and copies each changed file to outputs/files/.
// The installed Skill is not part of the run's changes.
export async function collectChanges(
    work: string,
    startCommit: string,
    outputs: string,
): Promise<void> {
    await git(work, ["add", "-A"]);
    const range = [
        "--cached",
        startCommit,
        "--",
        ".",
        `:(exclude)${SKILL_DIR}`,
    ];
    writeFileSync(
        join(outputs, "changes.diff"),
        await git(work, ["diff", ...range]),
    );
    const changed = (await git(work, ["diff", "--name-only", ...range]))
        .split("\n")
        .filter(Boolean);
    for (const rel of changed) {
        const src = join(work, rel);
        if (!statSync(src, { throwIfNoEntry: false })?.isFile()) continue;
        const dst = join(outputs, "files", rel);
        mkdirSync(dirname(dst), { recursive: true });
        copyFileSync(src, dst);
    }
}

export function writeJson(path: string, value: unknown): void {
    writeFileSync(path, JSON.stringify(value, null, 2));
}

// Writes timing.json in runDir: the tokens and duration of a run, then extra.
export function writeTiming(
    runDir: string,
    tokens: number,
    seconds: number,
    extra: Record<string, unknown>,
): void {
    writeJson(join(runDir, "timing.json"), {
        total_tokens: tokens,
        duration_ms: Math.trunc(seconds * 1000),
        total_duration_seconds: Math.round(seconds * 10) / 10,
        ...extra,
    });
}

// Writes eval_metadata.json for the grader in out/eval-<name>/.
export function writeMetadata(evalDir: string, ev: Eval): void {
    writeJson(join(evalDir, "eval_metadata.json"), {
        eval_id: ev.id,
        eval_name: ev.name,
        prompt: ev.prompt,
        assertions: ev.assertions,
        known_mistakes: ev.known_mistakes ?? null,
    });
}

// The OpenCode settings for a run: only the eval Skill, no sharing, and all
// permissions. Tests that disallow tools also deny subagents.
export function openCodeEnv(
    model: string,
    work: string,
    options: { noSubagents?: boolean; forceSkill?: boolean },
): Record<string, string | undefined> {
    const config = {
        $schema: "https://opencode.ai/config.json",
        model,
        share: "disabled",
        instructions: [],
        skills: { paths: [SKILL_DIR] },
        permission: {
            "*": "allow",
            task: options.noSubagents ? "deny" : "allow",
        },
        agent: {
            build: { prompt: options.forceSkill ? FORCE_SKILL : "" },
            general: { model },
            explore: { model },
        },
    };
    return {
        ...process.env,
        OPENCODE_DISABLE_EXTERNAL_SKILLS: "1",
        OPENCODE_DISABLE_CLAUDE_CODE_SKILLS: "1",
        OPENCODE_CONFIG_CONTENT: JSON.stringify(config),
        PWD: work,
    };
}

// Claude Code refuses to start inside another Claude Code session.
// cspell:ignore CLAUDECODE
export function claudeEnv(): Record<string, string | undefined> {
    const { CLAUDECODE: _, ...env } = process.env;
    return env;
}

// Gives each line of a stream as soon as the line is complete.
export async function* lines(stream: ReadableStream<Uint8Array>) {
    let buffer = "";
    for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
        buffer += chunk;
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";
        yield* parts;
    }
    if (buffer) yield buffer;
}

// Parses the JSON lines of a transcript and skips any other line.
export function parseJsonLines<T>(raw: string): T[] {
    return raw.split("\n").flatMap((line) => {
        try {
            return [JSON.parse(line) as T];
        } catch {
            return [];
        }
    });
}

type Input = Record<string, unknown>;
type Block = {
    type?: string;
    text?: string;
    id?: string;
    name?: string;
    input?: Input;
    tool_use_id?: string;
    content?: unknown;
};
export type ClaudeEvent = {
    type?: string;
    parent_tool_use_id?: string | null;
    message?: { content?: Block[] | string };
    result?: string;
    usage?: Record<string, number>;
    total_cost_usd?: number;
};

// Turns Claude Code stream-json events into a readable run record.
export function renderTranscript(events: ClaudeEvent[]): string {
    const lines: string[] = [];
    const names = new Map<string, string>();
    for (const event of events) {
        const parent = event.parent_tool_use_id;
        const who = parent ? `[subagent ${names.get(parent) ?? parent}] ` : "";
        const content = event.message?.content;
        const blocks = Array.isArray(content) ? content : [];
        if (event.type === "assistant") {
            for (const block of blocks) {
                if (block.type === "text" && block.text?.trim()) {
                    lines.push(`${who}TEXT:\n${block.text.trim()}\n`);
                } else if (block.type === "tool_use") {
                    const input = block.input ?? {};
                    if (block.name === "Agent" || block.name === "Task") {
                        names.set(
                            block.id ?? "",
                            String(input.description ?? block.id),
                        );
                    }
                    const body = JSON.stringify(input, null, 1);
                    lines.push(
                        `${who}TOOL CALL ${block.name} (id ${block.id}):\n${body.slice(0, 6000)}\n`,
                    );
                }
            }
        } else if (event.type === "user") {
            for (const block of blocks) {
                if (block.type !== "tool_result") continue;
                lines.push(
                    `${who}TOOL RESULT (for ${block.tool_use_id}):\n${resultText(block.content).slice(0, 4000)}\n`,
                );
            }
        } else if (event.type === "result") {
            lines.push(`FINAL RESULT:\n${event.result ?? ""}\n`);
        }
    }
    return lines.join("\n");
}

function resultText(content: unknown): string {
    if (Array.isArray(content)) {
        return content
            .filter((item) => typeof item === "object" && item !== null)
            .map((item: { text?: unknown }) => String(item.text ?? ""))
            .join("\n");
    }
    return String(content ?? "");
}

export type ToolCall = { name: string; input: Input };

// A load-test run loads the Skill when the agent calls it or reads its SKILL.md.
export function isSkillLoad(call: ToolCall): boolean {
    const input = call.input;
    if (call.name.toLowerCase() === "skill") {
        return String(input.skill ?? input.name ?? "").includes(
            "agent-instructions",
        );
    }
    return String(input.file_path ?? input.filePath ?? "").includes(
        "agent-instructions/SKILL.md",
    );
}

// A request is correct when its load rate is on the right side of 0.5.
export function loadVerdict(
    hits: boolean[],
    shouldTrigger: boolean,
): { load_rate: number; correct: boolean } {
    const rate = hits.filter(Boolean).length / hits.length;
    return {
        load_rate: rate,
        correct: shouldTrigger ? rate >= 0.5 : rate < 0.5,
    };
}

// A run that hits the usage limit stops early, so its result does not count.
export function hitUsageLimit(output: string): boolean {
    return output.includes("hit your session limit");
}

export type OpenCodeEvent = {
    type?: string;
    sessionID?: string;
    part?: {
        reason?: string;
        text?: string;
        tool?: string;
        state?: { input?: Input };
    };
};

// The session ID of an OpenCode run that finished, or undefined when the
// run is INCOMPLETE and must not be graded.
export function completedSession(
    events: OpenCodeEvent[],
    exitCode: number,
): string | undefined {
    const sessionId = events.find((event) => event.sessionID)?.sessionID;
    const stopped = events.some(
        (event) =>
            event.type === "step_finish" && event.part?.reason === "stop",
    );
    return exitCode === 0 && stopped ? sessionId : undefined;
}

export type OpenCodeSession = {
    info: {
        id: string;
        directory: string;
        tokens?: { input?: number; output?: number; cache?: Input };
    };
    messages: {
        info: { role: string; error?: unknown; finish?: string };
        parts: OpenCodePart[];
    }[];
};
export type OpenCodePart = {
    type: string;
    text?: string;
    tool?: string;
    callID?: string;
    state?: {
        input?: Input;
        output?: string;
        error?: string;
        metadata?: { sessionId?: string };
    };
};

// Why an exported OpenCode session is INCOMPLETE, or undefined when it is not.
export function sessionProblem(session: OpenCodeSession): string | undefined {
    const assistant = session.messages.filter(
        (message) => message.info.role === "assistant",
    );
    const errors = assistant
        .map((message) => message.info.error)
        .filter(Boolean);
    if (errors.length > 0 || assistant.at(-1)?.info.finish !== "stop") {
        return `Incomplete session ${session.info.id}: ${JSON.stringify(errors)}`;
    }
    return undefined;
}

// The tool calls in one Claude Code stream-json or OpenCode json event.
export function toolCalls(event: ClaudeEvent & OpenCodeEvent): ToolCall[] {
    if (event.type === "assistant") {
        const content = event.message?.content;
        return (Array.isArray(content) ? content : [])
            .filter((block) => block.type === "tool_use")
            .map((block) => ({
                name: block.name ?? "",
                input: block.input ?? {},
            }));
    }
    if (event.type === "tool_use" && event.part) {
        return [
            {
                name: event.part.tool ?? "",
                input: event.part.state?.input ?? {},
            },
        ];
    }
    return [];
}

// Counts one sentence by "When you count words" in the skill's ste-rules.md.
// A code span, quoted text, and text in parentheses each count as 1 word.
export function countWords(sentence: string): number {
    return sentence
        .replace(/^\s*(?:\d+\.|[-*])\s+/, "")
        .replace(/`[^`]*`/g, " x ")
        .replace(/"[^"]*"|“[^”]*”/g, " x ")
        .replace(/\([^)]*\)/g, " x ")
        .split(/\s+/)
        .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}
