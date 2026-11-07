// Runs the semver output tests with `claude -p`.
//
// Each run starts from a fresh copy of project/ in a temporary folder outside
// this repository, with a local bare `origin` and the fake gh, so no
// CLAUDE.md or AGENTS.md of this repository loads and no test needs the
// network. `--setting-sources project,local` keeps user skills and user
// memory out, so the semver Skill is the only installed Skill.

import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
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
    writeJson,
    writeTiming,
} from "../../writing/agent-instructions/eval-lib.ts";
import { type Eval, FORCE_SKILL, prepare, readEvals } from "./eval-lib.ts";
import { collectGitState, renderGitState } from "./git-state.ts";

const USAGE = `Run the semver output tests with \`claude -p\`.

Usage:
  bun run-evals.ts --out <iteration-dir> [--ids 17,18] [--configs with_skill,without_skill]
                   [--jobs 5] [--model claude-opus-5-5] [--timeout 1800]`;

type Options = { out: string; model: string; timeout: number };

function saveGitState(work: string, outputs: string, name: string) {
    const state = collectGitState(work);
    writeJson(join(outputs, `${name}.json`), state);
    writeFileSync(join(outputs, `${name}.md`), renderGitState(state));
}

async function run(ev: Eval, config: string, options: Options) {
    const evalDir = join(options.out, `eval-${ev.name}`);
    const runDir = join(evalDir, config, "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(outputs, { recursive: true });
    const withSkill = config === "with_skill";
    const { work, path, prsPath, ghLog } = prepare(
        ev,
        withSkill,
        `semver-eval-${String(ev.id).padStart(2, "0")}-${config}-`,
    );
    saveGitState(work, outputs, "git-before");
    copyFileSync(prsPath, join(outputs, "prs-before.json"));
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
        {
            cwd: work,
            env: { ...claudeEnv(), PATH: path },
            stdout: "pipe",
            stderr: "pipe",
        },
        options.timeout,
    );
    const [raw, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
    ]);
    const { timedOut, seconds } = await exited;

    writeFileSync(join(runDir, "transcript.jsonl"), raw);
    const err = timedOut ? "timeout" : stderr;
    if (err) writeFileSync(join(runDir, "stderr.txt"), err);
    const events = parseJsonLines<ClaudeEvent>(raw);
    writeFileSync(join(runDir, "transcript.md"), renderTranscript(events));
    const result = events.findLast((event) => event.type === "result");
    writeFileSync(join(outputs, "report.md"), result?.result ?? "");
    saveGitState(work, outputs, "git-after");
    copyFileSync(prsPath, join(outputs, "prs.json"));
    copyFileSync(ghLog, join(outputs, "gh-calls.txt"));
    const usage = result?.usage ?? {};
    const tokens = [
        "input_tokens",
        "output_tokens",
        "cache_read_input_tokens",
        "cache_creation_input_tokens",
    ].reduce((sum, key) => sum + (usage[key] ?? 0), 0);
    writeTiming(runDir, tokens, seconds, {
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
    return `${ev.name}/${config}: ${seconds.toFixed(0)}s, result=${result ? "yes" : "no"}${limit ? ", LIMIT HIT" : ""}`;
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
