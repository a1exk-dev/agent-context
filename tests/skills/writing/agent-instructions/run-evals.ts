// Runs the agent-instructions output tests with `claude -p`.
//
// Each run starts from a fresh copy of project/ in a temporary folder outside
// this repository, so no CLAUDE.md or AGENTS.md of this repository loads.
// `--setting-sources project,local` keeps user skills and user memory out.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    type ClaudeEvent,
    claudeEnv,
    collectChanges,
    type Eval,
    FORCE_SKILL,
    hitUsageLimit,
    integerOption,
    jobsOption,
    parseJsonLines,
    prepare,
    readEvals,
    readOptions,
    renderTranscript,
    runPool,
    writeJson,
    writeMetadata,
} from "./eval-lib.ts";

const USAGE = `Run the agent-instructions output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 3600]`;

type Options = { out: string; model: string; timeout: number };

async function run(ev: Eval, config: string, options: Options) {
    const runDir = join(options.out, `eval-${ev.name}`, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    const withSkill = config === "with_skill";
    const { work, startCommit } = await prepare(
        ev,
        withSkill,
        `ai-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    const cmd = [
        "claude",
        "-p",
        ev.prompt,
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
    if (withSkill) cmd.push("--append-system-prompt", FORCE_SKILL);
    if (ev.disallowed_tools?.length) {
        cmd.push("--disallowedTools", ...ev.disallowed_tools);
    }
    const start = performance.now();
    const proc = Bun.spawn(cmd, {
        cwd: work,
        env: claudeEnv(),
        stdout: "pipe",
        stderr: "pipe",
    });
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        proc.kill();
    }, options.timeout * 1000);
    const [raw, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
    ]);
    await proc.exited;
    clearTimeout(timer);
    const duration = (performance.now() - start) / 1000;

    writeFileSync(join(runDir, "transcript.jsonl"), raw);
    const err = timedOut ? "timeout" : stderr;
    if (err) writeFileSync(join(runDir, "stderr.txt"), err);
    const events = parseJsonLines<ClaudeEvent>(raw);
    writeFileSync(join(runDir, "transcript.md"), renderTranscript(events));
    const result = events.findLast((event) => event.type === "result");
    writeFileSync(join(outputs, "report.md"), result?.result ?? "");
    await collectChanges(work, startCommit, outputs);
    const usage = result?.usage ?? {};
    const tokens = [
        "input_tokens",
        "output_tokens",
        "cache_read_input_tokens",
        "cache_creation_input_tokens",
    ].reduce((sum, key) => sum + (usage[key] ?? 0), 0);
    writeJson(join(runDir, "timing.json"), {
        total_tokens: tokens,
        duration_ms: Math.trunc(duration * 1000),
        total_duration_seconds: Math.round(duration * 10) / 10,
        cost_usd: result?.total_cost_usd ?? null,
        work_dir: work,
    });
    writeMetadata(join(options.out, `eval-${ev.name}`), ev);
    const limit = hitUsageLimit(raw);
    if (limit) {
        writeFileSync(
            join(runDir, "LIMIT_HIT"),
            "The run hit the usage limit. Do not grade it.\n",
        );
    }
    return `${ev.name}/${config}: ${duration.toFixed(0)}s, result=${result ? "yes" : "no"}${limit ? ", LIMIT HIT" : ""}`;
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        configs: { type: "string", default: "with_skill,without_skill" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "claude-opus-5-5" },
        timeout: { type: "string", default: "3600" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const options: Options = {
        out: values.out,
        model: values.model,
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    const configs = values.configs.split(",");
    const runs = readEvals(values.ids).flatMap((ev) =>
        configs.map((config) => ({ ev, config })),
    );
    await runPool(runs, jobs, async ({ ev, config }) => {
        console.log(await run(ev, config, options));
    });
}
