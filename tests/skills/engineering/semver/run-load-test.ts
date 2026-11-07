// Runs the semver load test with `claude -p`.
//
// Each request runs in a fresh test repository with the Skill in
// .claude/skills/ and no system prompt that names the Skill. The repository
// has `main`, `develop`, the tag v1.2.0, a merged `feature/search`, an open
// `release/1.3.0` with pull request #42 into `main`, and the fake gh. It also
// has a staged change, a file with conflict markers, a README typo, and a
// lodash dependency, so that each request fits it. A run counts as a load
// when the agent calls the Skill or reads its SKILL.md before its first
// branch, tag, merge, push, or gh write, and within its first 8 tool calls.
// A request is correct when the load rate is on the correct side of 0.5.
// cspell:ignore smal

import { mkdirSync, readFileSync, rmSync } from "node:fs";
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

const USAGE = `Run the semver load test with \`claude -p\`.

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
        steps: [
            'git switch -q develop && printf \'{\\n    "name": "example-shop",\\n    "version": "1.2.0",\\n    "private": true,\\n    "type": "module",\\n    "dependencies": { "lodash": "4.17.20" }\\n}\\n\' > package.json && git add package.json && git commit -q -m "build: add lodash"',
            "printf '# Example shop\\n\\nA smal online shop.\\n' > README.md && git add README.md && git commit -q -m 'docs: add the readme'",
            "git switch -q -c feature/search && printf 'export function search(items: string[], term: string): string[] {\\n    return items.filter((item) => item.includes(term));\\n}\\n' > src/search.ts && git add src/search.ts && git commit -q -m 'feat: add the search option' && git push -q -u origin feature/search",
            "git switch -q develop && git merge -q --no-ff feature/search -m 'Merge pull request #1 from example/feature/search' && git push -q origin develop",
            "git switch -q -c release/1.3.0 && git push -q -u origin release/1.3.0 && git switch -q develop",
            "printf 'export const title = \"Shop\";\\n<<<<<<< HEAD\\nexport const limit = 10;\\n=======\\nexport const limit = 20;\\n>>>>>>> feature/limit\\n' > src/app.ts",
            "printf 'export const MIN_LENGTH = 8;\\n' >> src/login.ts && git add src/login.ts",
        ],
        prs: [
            {
                number: 1,
                headRefName: "feature/search",
                baseRefName: "develop",
                state: "MERGED",
                mergeCommit: "develop",
            },
            {
                number: 42,
                headRefName: "release/1.3.0",
                baseRefName: "main",
            },
        ],
    },
};

async function runOnce(
    query: string,
    options: Options,
): Promise<{ hit: boolean; calls: string[] }> {
    const { work, path } = prepare(REPO, true, "semver-load-");
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
            env: { ...claudeEnv(), PATH: path },
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
            // A final answer before a load counts as no load.
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
    // Make the folder of --out first, so that a missing folder does not lose
    // the results of all runs at the end.
    mkdirSync(dirname(values.out), { recursive: true });
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
