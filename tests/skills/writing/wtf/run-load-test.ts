// Runs the wtf load test on Claude Code, Codex, or OpenCode 2.
//
// Each request of load-requests.json runs `--runs` times on the selected
// platform. A request with a `platform` runs only on that platform. Each run
// works in a fresh empty project outside this repository, with wtf in the
// Skill folder of the platform. load-decision.ts decides from the output of
// each run if the run loaded wtf. A request is correct only when each of its
// runs agrees with `should_trigger`, so one wrong load of wtf fails the
// request.

import { randomBytes } from "node:crypto";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { LoadRequest } from "../../engineering/eval-lib.ts";
import {
    type ClaudeEvent,
    claudeEnv,
    hitUsageLimit,
    integerOption,
    jobsOption,
    parseJsonLines,
    readOptions,
    runPool,
    spawnTimed,
    usageError,
    writeJson,
} from "../agent-instructions/eval-lib.ts";
import {
    type CodexRolloutItem,
    claudeLoad,
    codexLoad,
    type OpenCodeExport,
    openCodeLoad,
    SKILL_NAME,
} from "./load-decision.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, "../../../../skills/writing/wtf");

const PLATFORMS = {
    claude: { skillDir: ".claude/skills", model: "claude-opus-5-5" },
    codex: { skillDir: ".agents/skills", model: "" },
    opencode: {
        skillDir: ".opencode/skills",
        model: "anthropic/claude-opus-5-5",
    },
};
type Platform = keyof typeof PLATFORMS;
type Options = { platform: Platform; model: string; timeout: number };

export type WtfLoadRequest = LoadRequest & { platform?: Platform };

const USAGE = `Run the wtf load test on Claude Code, Codex, or OpenCode 2.

Usage:
  bun run-load-test.ts --out <result.json> [--platform claude|codex|opencode]
                       [--ids 1,11] [--runs 3] [--jobs 5] [--model <model>] [--timeout 300]

--model defaults to ${PLATFORMS.claude.model} on Claude Code, to the model of the
Codex configuration on Codex, and to ${PLATFORMS.opencode.model} on OpenCode.`;

// The requests that run on `platform`, in the order of load-requests.json.
export function requestsFor(platform: Platform): WtfLoadRequest[] {
    const all = JSON.parse(
        readFileSync(join(HERE, "load-requests.json"), "utf8"),
    ) as WtfLoadRequest[];
    return all.filter((r) => !r.platform || r.platform === platform);
}

// The result of a request from the load decision of each of its runs.
export function requestResult(request: LoadRequest, hits: boolean[]) {
    return {
        query: request.query,
        should_trigger: request.should_trigger,
        loads: hits.filter(Boolean).length,
        runs: hits.length,
        correct: hits.every((hit) => hit === request.should_trigger),
    };
}

// Makes a fresh project with wtf in the Skill folder of the platform. Gives
// the project folder. The caller deletes its parent folder.
function makeProject(platform: Platform): string {
    const project = join(mkdtempSync(join(tmpdir(), "wtf-load-")), "project");
    mkdirSync(project);
    cpSync(SKILL, join(project, PLATFORMS[platform].skillDir, SKILL_NAME), {
        recursive: true,
    });
    return project;
}

function checkOutput(raw: string, done: boolean, query: string, why = "") {
    if (hitUsageLimit(raw)) throw new Error(`usage limit hit for: ${query}`);
    if (!done) throw new Error(`incomplete load-test run: ${query} ${why}`);
}

// Claude Code: the prompt comes on stdin, so that Claude Code replays the
// user message, also the call of a Skill.
async function claudeRun(query: string, project: string, options: Options) {
    const message = { type: "user", message: { role: "user", content: query } };
    const { proc, exited } = spawnTimed(
        [
            "claude",
            "-p",
            "--input-format",
            "stream-json",
            "--replay-user-messages",
            "--output-format",
            "stream-json",
            "--verbose",
            "--setting-sources",
            "project,local",
            "--permission-mode",
            "bypassPermissions",
            "--model",
            options.model,
        ],
        {
            cwd: project,
            env: claudeEnv(),
            stdin: new Blob([`${JSON.stringify(message)}\n`]),
            stdout: "pipe",
            stderr: "ignore",
        },
        options.timeout,
    );
    const raw = await new Response(proc.stdout).text();
    await exited;
    const events = parseJsonLines<ClaudeEvent>(raw);
    checkOutput(
        raw,
        events.some((e) => e.type === "result"),
        query,
    );
    return claudeLoad(events);
}

// The rollout file of a Codex thread.
function codexRollout(thread: string): CodexRolloutItem[] {
    const home = process.env.CODEX_HOME ?? join(homedir(), ".codex");
    const sessions = join(home, "sessions");
    const file = readdirSync(sessions, { recursive: true, encoding: "utf8" })
        .filter((path) => path.endsWith(`${thread}.jsonl`))
        .at(0);
    if (!file) throw new Error(`no Codex rollout file for thread ${thread}`);
    return parseJsonLines(readFileSync(join(sessions, file), "utf8"));
}

async function codexRun(query: string, project: string, options: Options) {
    const model = options.model ? ["--model", options.model] : [];
    const { proc, exited } = spawnTimed(
        [
            "codex",
            "exec",
            "--json",
            "--skip-git-repo-check",
            "--sandbox",
            "read-only",
            ...model,
            query,
        ],
        { cwd: project, stdout: "pipe", stderr: "ignore" },
        options.timeout,
    );
    const raw = await new Response(proc.stdout).text();
    await exited;
    const events = parseJsonLines<{
        type?: string;
        thread_id?: string;
        error?: { message?: string };
    }>(raw);
    const failed = events.find((e) => e.type === "turn.failed");
    checkOutput(
        raw,
        events.some((e) => e.type === "turn.completed"),
        query,
        failed?.error?.message,
    );
    const thread = events.find((e) => e.thread_id)?.thread_id ?? "";
    return codexLoad(codexRollout(thread));
}

// A free TCP port. OpenCode buffers the output line with its URL, so the
// runner selects the port itself.
function freePort(): number {
    const probe = Bun.serve({ port: 0, fetch: () => new Response() });
    const port = probe.port ?? 0;
    void probe.stop(true);
    return port;
}

// Waits until the OpenCode server at `url` accepts a connection.
async function serverReady(url: string, seconds: number) {
    const end = Date.now() + seconds * 1000;
    while (Date.now() < end) {
        try {
            await fetch(url);
            return;
        } catch {
            await Bun.sleep(250);
        }
    }
    throw new Error(`the OpenCode server at ${url} did not start`);
}

// The skills that the TUI of OpenCode 2 attaches for each `@<id>` mention.
// `opencode run` attaches no Skill, so the runner sends the prompt to a
// server, as the TUI does.
function mentionedSkills(query: string) {
    return [...query.matchAll(/(?:^|\s)@([\w-]+)/g)].map((m) => ({
        id: m[1],
    }));
}

async function openCodeRun(query: string, project: string, options: Options) {
    const password = randomBytes(16).toString("hex");
    const config = {
        $schema: "https://opencode.ai/config.json",
        model: options.model,
        share: "disabled",
        instructions: [],
        permission: { "*": "allow", task: "deny" },
    };
    const env = {
        ...process.env,
        OPENCODE_SERVER_PASSWORD: password,
        OPENCODE_CONFIG_CONTENT: JSON.stringify(config),
    };
    const port = freePort();
    const url = `http://127.0.0.1:${port}`;
    const server = Bun.spawn(["opencode", "serve", "--port", String(port)], {
        cwd: project,
        env,
        stdout: "ignore",
        stderr: "ignore",
    });
    try {
        await serverReady(url, 60);
        const auth = `Basic ${btoa(`opencode:${password}`)}`;
        const call = async (path: string, body?: unknown) => {
            const response = await fetch(`${url}${path}`, {
                method: "POST",
                headers: {
                    authorization: auth,
                    "content-type": "application/json",
                },
                body: body === undefined ? undefined : JSON.stringify(body),
                signal: AbortSignal.timeout(options.timeout * 1000),
            });
            const text = await response.text();
            if (!response.ok) throw new Error(`${path}: ${text}`);
            // The wait call gives an empty body.
            return (text ? JSON.parse(text) : {}) as { data?: { id: string } };
        };
        const [providerID, ...id] = options.model.split("/");
        const created = await call("/api/session", {
            location: { directory: project },
            model: { providerID, id: id.join("/") },
        });
        const session = created.data?.id ?? "";
        await call(`/api/session/${session}/prompt`, {
            text: query,
            skills: mentionedSkills(query),
        });
        await call(`/api/experimental/session/${session}/wait`);
        const exported = Bun.spawnSync(
            ["opencode", "session", "export", session, "--server", url],
            { cwd: project, env },
        );
        const raw = exported.stdout.toString();
        const result = JSON.parse(raw) as OpenCodeExport;
        checkOutput(
            raw,
            result.info.outcome === "succeeded",
            query,
            result.info.outcome,
        );
        return openCodeLoad(result);
    } finally {
        server.kill();
        await server.exited;
    }
}

const RUNS = { claude: claudeRun, codex: codexRun, opencode: openCodeRun };

async function runOnce(request: WtfLoadRequest, options: Options) {
    const project = makeProject(options.platform);
    try {
        return await RUNS[options.platform](request.query, project, options);
    } finally {
        rmSync(dirname(project), { recursive: true, force: true });
    }
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        platform: { type: "string", default: "claude" },
        ids: { type: "string", default: "" },
        runs: { type: "string", default: "3" },
        jobs: { type: "string", default: "5" },
        model: { type: "string" },
        timeout: { type: "string", default: "300" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const runs = integerOption(USAGE, "runs", values.runs);
    const platform = values.platform as Platform;
    if (!(platform in PLATFORMS))
        usageError(
            USAGE,
            `--platform must be ${Object.keys(PLATFORMS).join(", ")}`,
        );
    if (!existsSync(join(SKILL, "SKILL.md")))
        usageError(USAGE, `the wtf Skill is missing in ${SKILL}`);
    const options: Options = {
        platform,
        model: values.model ?? PLATFORMS[platform].model,
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    // Make the folder of --out first, so that a missing folder does not lose
    // the results of all runs at the end.
    mkdirSync(dirname(values.out), { recursive: true });
    // --ids selects requests by their position in the list of the platform,
    // from 1.
    const wanted = values.ids.split(",").filter(Boolean).map(Number);
    const requests = requestsFor(platform).filter(
        (_, i) => wanted.length === 0 || wanted.includes(i + 1),
    );
    const hits = await runPool(
        requests.flatMap((request) => Array(runs).fill(request)),
        jobs,
        (request: WtfLoadRequest) => runOnce(request, options),
    );
    const results = requests.map((request, i) =>
        requestResult(request, hits.slice(i * runs, (i + 1) * runs)),
    );
    const summary = {
        correct: results.filter((result) => result.correct).length,
        total: results.length,
    };
    writeJson(values.out, {
        platform,
        model: options.model || "codex default",
        summary,
        results,
    });
    console.log(`${platform}: ${summary.correct}/${summary.total} correct`);
    for (const result of results) {
        const mark = result.correct ? "ok  " : "FAIL";
        console.log(
            `${mark} loads=${result.loads}/${result.runs} expect=${result.should_trigger}: ${result.query}`,
        );
    }
}
