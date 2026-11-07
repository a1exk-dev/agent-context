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

import { claudeEnv } from "../../writing/agent-instructions/eval-lib.ts";
import { type LoadRequest, loadRun, loadTestMain } from "../eval-lib.ts";
import { type Eval, HERE, loadDecision, prepare } from "./eval-lib.ts";

const USAGE = `Run the git-commit load test with \`claude -p\`.

Usage:
  bun run-load-test.ts --out <result.json> [--ids 1,11] [--runs 3] [--jobs 5]
                       [--model claude-opus-5-5] [--timeout 300]`;

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

if (import.meta.main) {
    await loadTestMain<LoadRequest>(USAGE, HERE, async (request, options) => {
        const { work, bin } = await prepare(REPO, true, "gc-load-");
        const env = { ...claudeEnv(), PATH: `${bin}:${process.env.PATH}` };
        return loadRun(request.query, work, env, options, loadDecision);
    });
}
