// Runs the same output tests on OpenCode and exports all reviewer and reader
// sessions. Run graders separately.

import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
    collectChanges,
    completedSession,
    type Eval,
    integerOption,
    jobsOption,
    type OpenCodeEvent,
    type OpenCodeSession,
    openCodeEnv,
    parseJsonLines,
    prepare,
    readEvals,
    readOptions,
    runPool,
    sessionProblem,
    spawnTimed,
    writeJson,
    writeMetadata,
    writeTiming,
} from "./eval-lib.ts";

const USAGE = `Run the agent-instructions output tests on OpenCode.

Usage:
  bun run-opencode-evals.ts --out <iteration-dir> [--ids 1,3] [--jobs 5]
                            [--model openai/gpt-6-astra] [--timeout 3600]`;

type Options = { out: string; model: string; timeout: number };
type Rendered = { lines: string[]; tokens: number };

// Renders visible text and tools, including child sessions, without truncation.
async function exportSession(
    sessionId: string,
    runDir: string,
    work: string,
    seen: Set<string>,
    who = "",
): Promise<Rendered> {
    if (seen.has(sessionId)) return { lines: [], tokens: 0 };
    seen.add(sessionId);
    const path = join(runDir, "sessions", `${sessionId}.json`);
    // OpenCode can truncate large exports on a pipe. Write straight to a file.
    const proc = Bun.spawn(["opencode", "export", sessionId], {
        cwd: work,
        stdout: Bun.file(path),
        stderr: "pipe",
    });
    const stderr = await new Response(proc.stderr).text();
    if ((await proc.exited) !== 0) {
        throw new Error(`opencode export ${sessionId} failed: ${stderr}`);
    }
    const session = JSON.parse(readFileSync(path, "utf8")) as OpenCodeSession;
    if (realpathSync(session.info.directory) !== realpathSync(work)) {
        throw new Error(`Wrong project folder in session ${sessionId}`);
    }
    const problem = sessionProblem(session);
    if (problem) throw new Error(problem);

    const lines: string[] = [];
    const usage = session.info.tokens ?? {};
    let tokens = (usage.input ?? 0) + (usage.output ?? 0);
    for (const value of Object.values(usage.cache ?? {})) {
        tokens += Number(value);
    }
    for (const message of session.messages) {
        if (message.info.role !== "assistant") continue;
        for (const part of message.parts) {
            if (part.type === "text") {
                lines.push(`${who}TEXT:\n${part.text}\n`);
            } else if (part.type === "tool") {
                const state = part.state ?? {};
                const name = part.tool === "task" ? "Task" : part.tool;
                const input = state.input ?? {};
                lines.push(
                    `${who}TOOL CALL ${name} (id ${part.callID}):\n${JSON.stringify(input, null, 2)}\n`,
                );
                const child = state.metadata?.sessionId;
                if (part.tool === "task" && child) {
                    const rendered = await exportSession(
                        child,
                        runDir,
                        work,
                        seen,
                        `[subagent ${input.description ?? child}] `,
                    );
                    lines.push(...rendered.lines);
                    tokens += rendered.tokens;
                }
                lines.push(
                    `${who}TOOL RESULT (for ${part.callID}):\n${state.output ?? state.error ?? ""}\n`,
                );
            }
        }
    }
    return { lines, tokens };
}

async function run(ev: Eval, options: Options): Promise<string> {
    const runDir = join(options.out, `eval-${ev.name}`, "with_skill", "run-1");
    const outputs = join(runDir, "outputs");
    // A rerun needs a new output folder, so old records cannot count again.
    mkdirSync(runDir, { recursive: true });
    mkdirSync(outputs);
    mkdirSync(join(runDir, "sessions"));
    const { work, startCommit } = await prepare(
        ev,
        true,
        `ai-eval-${String(ev.id).padStart(2, "0")}-with_skill-`,
    );
    writeJson(join(runDir, "setup.json"), {
        work_dir: work,
        start_commit: startCommit,
        model: options.model,
    });
    const transcript = join(runDir, "transcript.jsonl");
    const { exited } = spawnTimed(
        [
            "opencode",
            "run",
            "--pure",
            "--dir",
            work,
            "--model",
            options.model,
            "--format",
            "json",
            ev.prompt,
        ],
        {
            cwd: work,
            env: openCodeEnv(options.model, work, {
                noSubagents: Boolean(ev.disallowed_tools?.length),
                forceSkill: true,
            }),
            stdout: Bun.file(transcript),
            stderr: Bun.file(join(runDir, "stderr.txt")),
        },
        options.timeout,
    );
    const { exitCode, timedOut, seconds: duration } = await exited;
    if (timedOut) {
        writeFileSync(
            join(runDir, "INCOMPLETE"),
            "Run timed out. Do not grade.\n",
        );
        return `${ev.name}: INCOMPLETE (timeout)`;
    }

    const events = parseJsonLines<OpenCodeEvent>(
        readFileSync(transcript, "utf8"),
    );
    const sessionId = completedSession(events, exitCode);
    if (!sessionId) {
        writeFileSync(
            join(runDir, "INCOMPLETE"),
            "Run did not finish. Do not grade.\n",
        );
        return `${ev.name}: INCOMPLETE (exit ${exitCode})`;
    }
    let rendered: Rendered;
    try {
        rendered = await exportSession(sessionId, runDir, work, new Set());
    } catch (error) {
        const message = (error as Error).message;
        writeFileSync(
            join(runDir, "INCOMPLETE"),
            `${message}\nDo not grade.\n`,
        );
        return `${ev.name}: INCOMPLETE (${message})`;
    }
    writeFileSync(join(runDir, "transcript.md"), rendered.lines.join("\n"));
    const report =
        events.findLast((event) => event.type === "text")?.part?.text ?? "";
    writeFileSync(join(outputs, "report.md"), report);
    await collectChanges(work, startCommit, outputs);
    writeTiming(runDir, rendered.tokens, duration, {
        work_dir: work,
        platform: "OpenCode",
        model: options.model,
        session_id: sessionId,
    });
    writeMetadata(join(options.out, `eval-${ev.name}`), ev);
    return `${ev.name}/with_skill: ${duration.toFixed(0)}s, model=${options.model}, complete`;
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "openai/gpt-6-astra" },
        timeout: { type: "string", default: "3600" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const options: Options = {
        out: values.out,
        model: values.model,
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    await runPool(readEvals(values.ids), jobs, async (ev) => {
        console.log(await run(ev, options));
    });
}
