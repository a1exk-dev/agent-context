// Runs the git-commit output tests with `claude -p`.
//
// Each run starts from a fresh copy of project/ in a temporary folder outside
// this repository, with a local bare `origin`, so no CLAUDE.md or AGENTS.md of
// this repository loads and no test needs the network.
// `--setting-sources project,local` keeps user skills and user memory out.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    type ClaudeEvent,
    claudeEnv,
    hitUsageLimit,
    integerOption,
    jobsOption,
    parseJsonLines,
    readOptions,
    renderTranscript,
    runPool,
    spawnTimed,
    toolCalls,
    writeJson,
    writeTiming,
} from "../../writing/agent-instructions/eval-lib.ts";
import {
    auditGit,
    type Eval,
    FORCE_SKILL,
    gitState,
    prepare,
    readEvals,
} from "./eval-lib.ts";

const USAGE = `Run the git-commit output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

type Options = { out: string; model: string; timeout: number };

async function run(ev: Eval, config: string, options: Options) {
    const evalDir = join(options.out, `eval-${ev.name}`);
    const runDir = join(evalDir, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    const withSkill = config === "with_skill";
    const { work, startCommit } = await prepare(
        ev,
        withSkill,
        `gc-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    writeFileSync(
        join(outputs, "git-before.md"),
        await gitState(work, startCommit),
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
    const { proc, exited } = spawnTimed(
        cmd,
        { cwd: work, env: claudeEnv(), stdout: "pipe", stderr: "pipe" },
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
    writeFileSync(join(outputs, "report.md"), result?.result ?? "");
    writeFileSync(
        join(outputs, "git-after.md"),
        await gitState(work, startCommit),
    );
    writeJson(
        join(outputs, "audit.json"),
        auditGit(
            events
                .filter((event) => !event.parent_tool_use_id)
                .flatMap(toolCalls),
        ),
    );
    const usage = result?.usage ?? {};
    const tokens = [
        "input_tokens",
        "output_tokens",
        "cache_read_input_tokens",
        "cache_creation_input_tokens",
    ].reduce((sum, key) => sum + (usage[key] ?? 0), 0);
    writeTiming(runDir, tokens, duration, {
        cost_usd: result?.total_cost_usd ?? null,
        work_dir: work,
    });
    writeJson(join(evalDir, "eval_metadata.json"), {
        eval_id: ev.id,
        eval_name: ev.name,
        prompt: ev.prompt,
        setup: ev.setup,
        assertions: ev.assertions,
    });
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
        timeout: { type: "string", default: "1800" },
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
