// Runs the agent-instructions load test with Claude Code or OpenCode.
//
// Each request runs in a fresh copy of project/ with the Skill in
// .claude/skills/. A run counts as a load when the agent calls the Skill tool
// for agent-instructions or reads its SKILL.md. A request is correct when the
// load rate is on the right side of 0.5.

import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
    type ClaudeEvent,
    claudeEnv,
    HERE,
    hitUsageLimit,
    integerOption,
    isSkillLoad,
    jobsOption,
    loadVerdict,
    type OpenCodeEvent,
    openCodeEnv,
    readOptions,
    runPool,
    SKILL,
    SKILL_DIR,
    toolCalls,
    usageError,
    writeJson,
} from "./eval-lib.ts";

const USAGE = `Run the agent-instructions load test with Claude Code or OpenCode.

Usage:
  bun run-load-test.ts --out <result.json> [--runs 3] [--jobs 5]
                       [--platform claude|opencode] [--model <model>] [--timeout 180]`;

const MAX_TOOL_CALLS = 8;

type Request = { query: string; should_trigger: boolean };
type Options = { model: string; timeout: number; platform: string };

async function* lines(stream: ReadableStream<Uint8Array>) {
    let buffer = "";
    for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
        buffer += chunk;
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";
        yield* parts;
    }
    if (buffer) yield buffer;
}

async function runOnce(
    query: string,
    options: Options,
): Promise<{ hit: boolean; calls: string[] }> {
    const work = join(mkdtempSync(join(tmpdir(), "ai-load-")), "project");
    cpSync(join(HERE, "project"), work, { recursive: true });
    cpSync(SKILL, join(work, SKILL_DIR), { recursive: true });
    const { model } = options;
    const proc =
        options.platform === "opencode"
            ? Bun.spawn(
                  [
                      "opencode",
                      "run",
                      "--pure",
                      "--dir",
                      work,
                      "--model",
                      model,
                      "--format",
                      "json",
                      query,
                  ],
                  {
                      cwd: work,
                      env: openCodeEnv(model, work, true, false),
                      stdout: "pipe",
                      stderr: "ignore",
                  },
              )
            : Bun.spawn(
                  [
                      "claude",
                      "-p",
                      query,
                      "--output-format",
                      "stream-json",
                      "--verbose",
                      "--setting-sources",
                      "project,local",
                      "--model",
                      model,
                  ],
                  {
                      cwd: work,
                      env: claudeEnv(),
                      stdout: "pipe",
                      stderr: "ignore",
                  },
              );
    const start = performance.now();
    const watchdog = setTimeout(() => proc.kill(), options.timeout * 1000);
    const calls: string[] = [];
    let hit = false;
    let limit = false;
    let valid = false;
    try {
        for await (const line of lines(proc.stdout)) {
            let event: ClaudeEvent & OpenCodeEvent;
            try {
                event = JSON.parse(line);
            } catch {
                continue;
            }
            limit ||= hitUsageLimit(line);
            if (event.type === "error") {
                throw new Error(
                    `provider error for ${query}: ${JSON.stringify(event)}`,
                );
            }
            for (const call of toolCalls(event)) {
                calls.push(call.name);
                hit ||= isSkillLoad(call);
            }
            const done =
                event.type === "result" ||
                (event.type === "step_finish" && event.part?.reason === "stop");
            // A load counts only within the first tool calls.
            if (hit || done || calls.length >= MAX_TOOL_CALLS) {
                valid = true;
                break;
            }
        }
    } finally {
        clearTimeout(watchdog);
        proc.kill();
        await proc.exited;
        rmSync(dirname(work), { recursive: true, force: true });
    }
    if (limit) throw new Error(`usage limit hit for: ${query}`);
    if (!valid) {
        const seconds = ((performance.now() - start) / 1000).toFixed(0);
        throw new Error(`incomplete load-test run after ${seconds}s: ${query}`);
    }
    return { hit, calls };
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        runs: { type: "string", default: "3" },
        jobs: { type: "string", default: "5" },
        platform: { type: "string", default: "claude" },
        model: { type: "string" },
        timeout: { type: "string", default: "180" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const runs = integerOption(USAGE, "runs", values.runs);
    const platform = values.platform;
    if (platform !== "claude" && platform !== "opencode") {
        usageError(USAGE, `--platform must be claude or opencode`);
    }
    const options: Options = {
        platform,
        model:
            values.model ??
            (platform === "opencode"
                ? "openai/gpt-6-astra"
                : "claude-opus-5-5"),
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    const requests = JSON.parse(
        readFileSync(join(HERE, "load-requests.json"), "utf8"),
    ) as Request[];
    const outcomes = await runPool(
        requests.flatMap((request) => Array(runs).fill(request) as Request[]),
        jobs,
        (request) => runOnce(request.query, options),
    );
    const results = requests.map((request, i) => {
        const own = outcomes.slice(i * runs, (i + 1) * runs);
        return {
            ...request,
            ...loadVerdict(
                own.map((outcome) => outcome.hit),
                request.should_trigger,
            ),
            first_tools: own.map((outcome) => outcome.calls.slice(0, 3)),
        };
    });
    const summary = {
        correct: results.filter((result) => result.correct).length,
        total: results.length,
    };
    writeJson(values.out, {
        platform,
        model: options.model,
        summary,
        results,
    });
    console.log(`${summary.correct}/${summary.total} correct`);
    for (const result of results) {
        const mark = result.correct ? "ok  " : "FAIL";
        console.log(
            `${mark} rate=${result.load_rate.toFixed(2)} expect=${result.should_trigger}: ${result.query.slice(0, 80)}`,
        );
    }
}
