// Runs the human-communication load test with `claude -p`.
//
// Each request of load-requests.json runs `--runs` times in each
// configuration: `description` installs the Skill with no pointer, so only
// its description can load it, and `pointer` also adds the shipped pointer
// text to AGENTS.md. Each run works in a fresh copy of project/ outside this
// repository with no system prompt that names the Skill. The copy is on the
// branch `feature/log-level` with 4 commits (a new config option, fetchData,
// a retry test, and a README typo) and a staged change, so that each request
// fits it. A run counts as a load when the agent calls the Skill or reads its
// SKILL.md before its first text, its first question, and its first document
// write, and within its first 8 tool calls. A request is correct when its
// load rate is above 0.5.
// cspell:ignore fixd

import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
    type LoadRequest,
    loadResults,
    loadRun,
} from "../../engineering/eval-lib.ts";
import {
    claudeEnv,
    integerOption,
    jobsOption,
    readOptions,
    runPool,
    usageError,
    writeJson,
} from "../agent-instructions/eval-lib.ts";
import { HERE, prepare, type Setup, SKILL_DIR } from "./eval-lib.ts";
import { loadDecision } from "./load-decision.ts";

const USAGE = `Run the human-communication load test with \`claude -p\`.

Usage:
  bun run-load-test.ts --out <result.json> [--ids 1,5] [--configs description,pointer]
                       [--runs 3] [--jobs 5] [--model claude-opus-5-5] [--timeout 300]`;

const POINTER_STEP = `printf '\\n' >> AGENTS.md && cat ${SKILL_DIR}/references/agents-md-pointer.md >> AGENTS.md && git commit -q -am 'docs: load the human-communication Skill'`;

const BRANCH_STEPS = [
    "git switch -q -c feature/log-level",
    `printf 'export const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";\\n' > src/config.ts && git add src/config.ts && git commit -q -m 'feat: add the LOG_LEVEL option'`,
    `printf 'import { fetchWithRetry } from "./fetch.ts";\\n\\nexport async function fetchData(url: string): Promise<unknown> {\\n    return (await fetchWithRetry(url)).json();\\n}\\n' > src/data.ts && git add src/data.ts && git commit -q -m 'feat: add fetchData'`,
    `printf 'import { expect, test } from "bun:test";\\nimport { fetchWithRetry } from "./fetch.ts";\\n\\ntest("the retry gets the page", async () => {\\n    const start = Date.now();\\n    await fetchWithRetry("https://example.com");\\n    expect(Date.now() - start).toBeLessThan(1000);\\n});\\n' > src/fetch.test.ts && git add src/fetch.test.ts && git commit -q -m 'test: cover the retry'`,
    "sed -i 's/at fixed times/at fixd times/' README.md && git commit -q -am 'docs: describe the schedule'",
    "sed -i 's/DELAY_MS = 500/DELAY_MS = 1000/' src/fetch.ts && git add src/fetch.ts",
];

const CONFIGS: Record<string, string[]> = {
    description: BRANCH_STEPS,
    pointer: [POINTER_STEP, ...BRANCH_STEPS],
};

// The setup of the test repository in the configuration `config`.
export function loadSetup(config: string): Setup {
    const steps = CONFIGS[config];
    if (!steps)
        throw new Error(
            `unknown configuration ${config}, use ${Object.keys(CONFIGS).join(", ")}`,
        );
    return { steps };
}

if (import.meta.main) {
    const values = readOptions(USAGE, {
        out: { type: "string" },
        ids: { type: "string", default: "" },
        configs: { type: "string", default: "description,pointer" },
        runs: { type: "string", default: "3" },
        jobs: { type: "string", default: "5" },
        model: { type: "string", default: "claude-opus-5-5" },
        timeout: { type: "string", default: "300" },
    });
    const jobs = jobsOption(USAGE, values.jobs);
    const runs = integerOption(USAGE, "runs", values.runs);
    const options = {
        model: values.model,
        timeout: integerOption(USAGE, "timeout", values.timeout),
    };
    const configs = values.configs.split(",").filter(Boolean);
    for (const config of configs)
        if (!CONFIGS[config]) usageError(USAGE, `unknown config ${config}`);
    // Make the folder of --out first, so that a missing folder does not lose
    // the results of all runs at the end.
    mkdirSync(dirname(values.out), { recursive: true });
    // --ids selects requests by their position in load-requests.json, from 1.
    const wanted = values.ids.split(",").filter(Boolean).map(Number);
    const requests = (
        JSON.parse(
            readFileSync(join(HERE, "load-requests.json"), "utf8"),
        ) as LoadRequest[]
    ).filter((_, i) => wanted.length === 0 || wanted.includes(i + 1));
    const items = configs.flatMap((config) =>
        requests.flatMap((request) =>
            Array.from({ length: runs }, () => ({ config, request })),
        ),
    );
    const outcomes = await runPool(items, jobs, ({ config, request }) => {
        const { work } = prepare(
            {
                id: 0,
                name: "load",
                prompt: "",
                setup: loadSetup(config),
                assertions: [],
            },
            true,
            `hc-load-${config}-`,
        );
        return loadRun(request.query, work, claudeEnv(), options, (_, e) =>
            loadDecision(e),
        );
    });
    const per = requests.length * runs;
    const report = Object.fromEntries(
        configs.map((config, i) => [
            config,
            loadResults(requests, outcomes.slice(i * per, (i + 1) * per), runs),
        ]),
    );
    writeJson(values.out, { model: options.model, configs: report });
    for (const [config, { summary, results }] of Object.entries(report)) {
        console.log(`${config}: ${summary.correct}/${summary.total} correct`);
        for (const result of results) {
            const mark = result.correct ? "ok  " : "FAIL";
            console.log(
                `${mark} rate=${result.load_rate.toFixed(2)}: ${result.query.slice(0, 80)}`,
            );
        }
    }
}
