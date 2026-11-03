// Shared parts of the output-test and load-test runners of the engineering
// Skills. Each Skill keeps its own test repository, audit, and load decision.

import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
    type ClaudeEvent,
    hitUsageLimit,
    integerOption,
    jobsOption,
    lines,
    loadVerdict,
    parseJsonLines,
    readOptions,
    renderTranscript,
    runPool,
    spawnTimed,
    type ToolCall,
    toolCalls,
    writeJson,
    writeTiming,
} from "../writing/agent-instructions/eval-lib.ts";

// Reads the tests of `<dir>/evals.json` with the given ids, or all tests with
// no ids. Each test gets the common statements first.
export function readEvalsIn<E extends { id: number; assertions: string[] }>(
    dir: string,
    ids: string,
): E[] {
    const wanted = ids.split(",").filter(Boolean).map(Number);
    const file = JSON.parse(readFileSync(join(dir, "evals.json"), "utf8")) as {
        common_assertions: string[];
        evals: E[];
    };
    return file.evals
        .filter((ev) => wanted.length === 0 || wanted.includes(ev.id))
        .map((ev) => ({
            ...ev,
            assertions: [...file.common_assertions, ...ev.assertions],
        }));
}

export type LoadRequest = { query: string; should_trigger: boolean };
export type LoadOptions = { model: string; timeout: number };
export type LoadRun = { hit: boolean; calls: string[] };
type Decide = (calls: ToolCall[]) => boolean | null;

// Reads the stream-json lines of a run until `decide` gives a decision. Only
// the calls of the main agent count. A run that ends with no decision is no
// load. `hit` is null when the stream stops before its result.
export async function loadOutcome(
    stream: AsyncIterable<string>,
    decide: Decide,
): Promise<{ hit: boolean | null; limit: boolean; calls: ToolCall[] }> {
    const calls: ToolCall[] = [];
    let hit: boolean | null = null;
    let limit = false;
    for await (const line of stream) {
        let event: ClaudeEvent;
        try {
            event = JSON.parse(line);
        } catch {
            continue;
        }
        limit ||= hitUsageLimit(line);
        if (!event.parent_tool_use_id) calls.push(...toolCalls(event));
        hit = decide(calls);
        if (hit === null && event.type === "result") hit = false;
        if (hit !== null) break;
    }
    return { hit, limit, calls };
}

// The tool name, and for a shell command its first words.
export function summarize(call: ToolCall): string {
    const command = String(call.input.command ?? "");
    return command ? `${call.name}: ${command.slice(0, 60)}` : call.name;
}

// Runs one load-test request with `claude -p` in the test repository `work`,
// then deletes the temporary folder of `work`.
export async function loadRun(
    query: string,
    work: string,
    env: Record<string, string | undefined>,
    options: LoadOptions,
    decide: Decide,
): Promise<LoadRun> {
    const cmd = [
        "claude",
        "-p",
        query,
        "--output-format",
        "stream-json",
        "--verbose",
        "--setting-sources",
        "project,local",
        "--permission-mode",
        "bypassPermissions",
        "--model",
        options.model,
    ];
    const { proc, exited } = spawnTimed(
        cmd,
        { cwd: work, env, stdout: "pipe", stderr: "ignore" },
        options.timeout,
    );
    let seconds = 0;
    let outcome: Awaited<ReturnType<typeof loadOutcome>>;
    try {
        outcome = await loadOutcome(lines(proc.stdout), decide);
    } finally {
        proc.kill();
        ({ seconds } = await exited);
        rmSync(dirname(work), { recursive: true, force: true });
    }
    const { hit, limit, calls } = outcome;
    if (limit) throw new Error(`usage limit hit for: ${query}`);
    if (hit === null) {
        throw new Error(
            `incomplete load-test run after ${seconds.toFixed(0)}s: ${query}`,
        );
    }
    return { hit, calls: calls.map(summarize) };
}

// The verdict of each request from its `runs` outcomes, in request order.
export function loadResults(
    requests: LoadRequest[],
    outcomes: LoadRun[],
    runs: number,
) {
    const results = requests.map((request, i) => {
        const own = outcomes.slice(i * runs, (i + 1) * runs);
        return {
            query: request.query,
            should_trigger: request.should_trigger,
            ...loadVerdict(
                own.map((outcome) => outcome.hit),
                request.should_trigger,
            ),
            first_tools: own.map((outcome) => outcome.calls.slice(0, 4)),
        };
    });
    const summary = {
        correct: results.filter((result) => result.correct).length,
        total: results.length,
    };
    return { summary, results };
}

// The command line of a load-test runner: reads the flags, runs each request
// of `<dir>/load-requests.json` `--runs` times, and writes the result file.
export async function loadTestMain<R extends LoadRequest>(
    usage: string,
    dir: string,
    runOnce: (request: R, options: LoadOptions) => Promise<LoadRun>,
): Promise<void> {
    const values = readOptions(usage, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        runs: { type: "string", default: "3" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "claude-opus-5-5" },
        timeout: { type: "string", default: "300" },
    });
    const jobs = jobsOption(usage, values.jobs);
    const runs = integerOption(usage, "runs", values.runs);
    const options: LoadOptions = {
        model: values.model,
        timeout: integerOption(usage, "timeout", values.timeout),
    };
    // --ids selects requests by their position in load-requests.json, from 1.
    const wanted = values.ids.split(",").filter(Boolean).map(Number);
    const requests = (
        JSON.parse(readFileSync(join(dir, "load-requests.json"), "utf8")) as R[]
    ).filter((_, i) => wanted.length === 0 || wanted.includes(i + 1));
    const outcomes = await runPool(
        requests.flatMap((request) => Array(runs).fill(request) as R[]),
        jobs,
        (request) => runOnce(request, options),
    );
    const { summary, results } = loadResults(requests, outcomes, runs);
    writeJson(values.out, { model: options.model, summary, results });
    console.log(`${summary.correct}/${summary.total} correct`);
    for (const result of results) {
        const mark = result.correct ? "ok  " : "FAIL";
        console.log(
            `${mark} rate=${result.load_rate.toFixed(2)} expect=${result.should_trigger}: ${result.query.slice(0, 80)}`,
        );
    }
}

// The tool calls of the main agent in the events of a run.
export function mainCalls(events: ClaudeEvent[]): ToolCall[] {
    return events
        .filter((event) => !event.parent_tool_use_id)
        .flatMap(toolCalls);
}

// The input, output, and cache tokens of the usage of a result event.
export function tokenCount(usage: Record<string, number> | undefined): number {
    return [
        "input_tokens",
        "output_tokens",
        "cache_read_input_tokens",
        "cache_creation_input_tokens",
    ].reduce((sum, key) => sum + (usage?.[key] ?? 0), 0);
}

export type OutputOptions = { out: string; model: string; timeout: number };

// Runs one output test with `claude -p` in the test repository `work`. It
// writes the transcript, the stderr text, and `report.md` of the run.
export async function outputRun(
    prompt: string,
    forceSkill: string | null,
    work: string,
    env: Record<string, string | undefined>,
    options: OutputOptions,
    runDir: string,
) {
    const cmd = [
        "claude",
        "-p",
        prompt,
        "--output-format",
        "stream-json",
        "--verbose",
        "--setting-sources",
        "project,local",
        "--permission-mode",
        "bypassPermissions",
        "--model",
        options.model,
    ];
    if (forceSkill) cmd.push("--append-system-prompt", forceSkill);
    const { proc, exited } = spawnTimed(
        cmd,
        { cwd: work, env, stdout: "pipe", stderr: "pipe" },
        options.timeout,
    );
    const [raw, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
    ]);
    const { timedOut, seconds: duration } = await exited;

    writeFileSync(join(runDir, "transcript.jsonl"), raw);
    const err = timedOut ? "timeout" : stderr;
    if (err) writeFileSync(join(runDir, "stderr.txt"), err);
    const events = parseJsonLines<ClaudeEvent>(raw);
    writeFileSync(join(runDir, "transcript.md"), renderTranscript(events));
    const result = events.findLast((event) => event.type === "result");
    writeFileSync(join(runDir, "outputs", "report.md"), result?.result ?? "");
    return { raw, events, result, duration };
}

// Writes the timing of a run, and LIMIT_HIT when the run hit the usage limit.
// Gives the line that the runner prints for the run.
export function finishRun(
    label: string,
    runDir: string,
    work: string,
    run: Awaited<ReturnType<typeof outputRun>>,
): string {
    const { raw, result, duration } = run;
    writeTiming(runDir, tokenCount(result?.usage), duration, {
        cost_usd: result?.total_cost_usd ?? null,
        work_dir: work,
    });
    const limit = hitUsageLimit(raw);
    if (limit) {
        writeFileSync(
            join(runDir, "LIMIT_HIT"),
            "The run hit the usage limit. Do not grade it.\n",
        );
    }
    return `${label}: ${duration.toFixed(0)}s, result=${result ? "yes" : "no"}${limit ? ", LIMIT HIT" : ""}`;
}

// The command line of an output-test runner: reads the flags and runs each
// selected test in each configuration.
export async function outputTestMain<E>(
    usage: string,
    readEvals: (ids: string) => E[],
    run: (ev: E, config: string, options: OutputOptions) => Promise<string>,
): Promise<void> {
    const values = readOptions(usage, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        configs: { type: "string", default: "with_skill,without_skill" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "claude-opus-5-5" },
        timeout: { type: "string", default: "1800" },
    });
    const jobs = jobsOption(usage, values.jobs);
    const options: OutputOptions = {
        out: values.out,
        model: values.model,
        timeout: integerOption(usage, "timeout", values.timeout),
    };
    const configs = values.configs.split(",");
    const runs = readEvals(values.ids).flatMap((ev) =>
        configs.map((config) => ({ ev, config })),
    );
    await runPool(runs, jobs, async ({ ev, config }) => {
        console.log(await run(ev, config, options));
    });
}
