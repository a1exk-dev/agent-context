// Runs the git-commit load test with `claude -p`.
//
// Each request runs in a fresh test repository with the Skill in
// .claude/skills/ and no system prompt that names the Skill. The repository
// has a branch to merge, commits to amend and revert, and staged, unstaged,
// and new files, so that each request fits it. A stub `gh` keeps
// `gh pr merge` off the network. A run counts as a load when the agent calls
// the Skill or reads its SKILL.md before its first git write and within its
// first 8 tool calls. A request is correct when the load rate is on the right
// side of 0.5.
// cspell:ignore Smal

import { readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import {
    type ClaudeEvent,
    claudeEnv,
    hitUsageLimit,
    integerOption,
    jobsOption,
    lines,
    loadVerdict,
    readOptions,
    runPool,
    spawnTimed,
    type ToolCall,
    toolCalls,
    writeJson,
} from "../../writing/agent-instructions/eval-lib.ts";
import { type Eval, HERE, loadDecision, prepare } from "./eval-lib.ts";

const USAGE = `Run the git-commit load test with \`claude -p\`.

Usage:
  bun run-load-test.ts --out <result.json> [--ids 1,11] [--runs 3] [--jobs 5]
                       [--model claude-opus-5-5] [--timeout 300]`;

type Request = { query: string; should_trigger: boolean };
type Options = { model: string; timeout: number };

const REPO: Eval = {
    id: 0,
    name: "load",
    prompt: "",
    assertions: [],
    setup: {
        stubs: ["gh"],
        steps: [
            "git switch -q -c feature/search && printf 'export function search(items: string[], term: string): string[] {\\n    return items.filter((item) => item.includes(term));\\n}\\n' > src/search.ts && git add src/search.ts && git commit -q -m 'feat: add search helper' && git switch -q develop",
            "mkdir -p src/pages && printf 'export const loginRedirect = \"/hme\";\\n' > src/pages/login.ts && git add src/pages/login.ts && git commit -q -m 'feat: change the login page redirect'",
            "sed -i 's/Small text/Smal text/' README.md && git add README.md && git commit -q -m 'docs: describe the package'",
            "printf '// rounds to cents\\n' >> src/price.ts && git add src/price.ts",
            "printf 'export function trim(text: string): string {\\n    return text.trim();\\n}\\n' >> src/strings.ts",
            'mkdir -p config && printf \'{ "currency": "EUR" }\\n\' > config/app.json',
        ],
    },
};

async function runOnce(
    query: string,
    options: Options,
): Promise<{ hit: boolean; calls: string[] }> {
    const { work, bin } = await prepare(REPO, true, "gc-load-");
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
        {
            cwd: work,
            env: { ...claudeEnv(), PATH: `${bin}:${process.env.PATH}` },
            stdout: "pipe",
            stderr: "ignore",
        },
        options.timeout,
    );
    let seconds = 0;
    const calls: ToolCall[] = [];
    let hit: boolean | null = null;
    let limit = false;
    try {
        for await (const line of lines(proc.stdout)) {
            let event: ClaudeEvent;
            try {
                event = JSON.parse(line);
            } catch {
                continue;
            }
            limit ||= hitUsageLimit(line);
            // Only the calls of the main agent count.
            if (!event.parent_tool_use_id) calls.push(...toolCalls(event));
            hit = loadDecision(calls);
            if (hit === null && event.type === "result") hit = false;
            if (hit !== null) break;
        }
    } finally {
        proc.kill();
        ({ seconds } = await exited);
        rmSync(dirname(work), { recursive: true, force: true });
    }
    if (limit) throw new Error(`usage limit hit for: ${query}`);
    if (hit === null) {
        throw new Error(
            `incomplete load-test run after ${seconds.toFixed(0)}s: ${query}`,
        );
    }
    return { hit, calls: calls.map(summarize) };
}

// The tool name, and for a shell command its first words.
function summarize(call: ToolCall): string {
    const command = String(call.input.command ?? "");
    return command ? `${call.name}: ${command.slice(0, 60)}` : call.name;
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        runs: { type: "string", default: "3" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "claude-opus-5-5" },
        timeout: { type: "string", default: "300" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const runs = integerOption(USAGE, "runs", values.runs);
    const options: Options = {
        model: values.model,
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    // --ids selects requests by their position in load-requests.json, from 1.
    const wanted = values.ids.split(",").filter(Boolean).map(Number);
    const requests = (
        JSON.parse(
            readFileSync(join(HERE, "load-requests.json"), "utf8"),
        ) as Request[]
    ).filter((_, i) => wanted.length === 0 || wanted.includes(i + 1));
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
            first_tools: own.map((outcome) => outcome.calls.slice(0, 4)),
        };
    });
    const summary = {
        correct: results.filter((result) => result.correct).length,
        total: results.length,
    };
    writeJson(values.out, { model: options.model, summary, results });
    console.log(`${summary.correct}/${summary.total} correct`);
    for (const result of results) {
        const mark = result.correct ? "ok  " : "FAIL";
        console.log(
            `${mark} rate=${result.load_rate.toFixed(2)} expect=${result.should_trigger}: ${result.query.slice(0, 80)}`,
        );
    }
}
