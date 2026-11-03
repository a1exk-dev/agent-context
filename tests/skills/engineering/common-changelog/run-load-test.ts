// Runs the common-changelog load test with `claude -p`.
//
// Each request runs in a fresh test repository with the fixed history of
// eval-lib.ts, the Skill in .claude/skills/, and no system prompt that names
// the Skill. Before each run, the repository gets a typo in README.md and a
// staged fix in src/price.ts, then the setup steps of the request, so that
// each request fits the repository. A run counts as a load when the agent
// calls the Skill or reads its SKILL.md before its first change to
// CHANGELOG.md and within its first 8 tool calls. A request is correct when
// the load rate is on the correct side of 0.5.
// cspell:ignore Smal

import { claudeEnv } from "../../writing/agent-instructions/eval-lib.ts";
import { type LoadRequest, loadRun, loadTestMain } from "../eval-lib.ts";
import { HERE, loadDecision, prepare } from "./eval-lib.ts";

const USAGE = `Run the common-changelog load test with \`claude -p\`.

Usage:
  bun run-load-test.ts --out <result.json> [--ids 1,9] [--runs 3] [--jobs 5]
                       [--model claude-opus-5-5] [--timeout 300]`;

type Request = LoadRequest & { steps?: string[] };

const BASE_STEPS = [
    "sed -i 's/Small text/Smal text/' README.md && git commit -q -am 'docs: describe the package'",
    "sed -i 's/return `$${amount}`;/return `$${amount.toFixed(2)}`;/' src/price.ts && git add src/price.ts",
];

if (import.meta.main) {
    await loadTestMain<Request>(USAGE, HERE, async (request, options) => {
        const { work } = await prepare(
            {
                id: 0,
                name: "load",
                prompt: "",
                assertions: [],
                setup: { steps: [...BASE_STEPS, ...(request.steps ?? [])] },
            },
            true,
            "cc-load-",
        );
        return loadRun(request.query, work, claudeEnv(), options, loadDecision);
    });
}
