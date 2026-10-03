# Tests for the agent-instructions skill

The eval plan is in issue #17, section 12. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. |
| `fixtures/<test>/` | Files that replace project files for one test. |
| `evals.json` | The 10 output tests: request, setup, statements, and known mistakes. |
| `load-requests.json` | The 20 load-test requests. |
| `run_evals.py` | Runs the output tests with `claude -p`, with and without the skill. |
| `run_opencode_evals.py` | Runs the output tests with OpenCode and exports every parent and child session. |
| `run_load_test.py` | Runs the load test with Claude Code or OpenCode. |
| `grader.md` | Instructions for the grader subagent that checks each statement. |

## Run

```sh
./run_evals.py --out /tmp/ai-evals/iteration-1
./run_load_test.py --out /tmp/ai-evals/iteration-1/load-test.json
```

Both scripts run a maximum of 5 runs at the same time (`--jobs 5`). A run that hits the usage limit gets a `LIMIT_HIT` file in its folder, and the load test stops with an error. Run it again later.

Then give `grader.md` and one run to a fresh grader subagent, one grader for each run.

Each run uses a copy of `project/` in a temporary folder outside the repository, so this repository's `AGENTS.md` and `CLAUDE.md` do not load. `--setting-sources project,local` keeps user skills and user memory out of the run. Runs with the skill install it in `.claude/skills/` and add "Use the agent-instructions skill for this task." to the system prompt. The output tests then check the skill's behavior, and the load test checks the description on its own.

A load-test run counts as a load when the agent calls the skill or reads its `SKILL.md` within its first 8 tool calls. Each request runs 3 times. A request is correct when its load rate is on the correct side of 0.5.

## OpenCode

```sh
python3 run_opencode_evals.py --out /tmp/ai-evals/iteration-6 --jobs 5
./run_load_test.py --out /tmp/ai-evals/iteration-6/load-test.json --platform opencode --jobs 5
```

OpenCode uses `openai/gpt-6-astra` by default. It uses the same sample project, requests, and statements. The output runner forces the Skill through the author prompt. The load test does not. External skills and plugins are disabled. Test 10 denies the `task` tool. At most five evals run at once. Each eval runs its reviewers and readers sequentially. Run grader batches separately, with at most five fresh graders at once.

The output runner saves complete session exports under `sessions/` and renders each child's tool calls in `transcript.md`. An `INCOMPLETE` run must be rerun before grading. Use a new output folder for a rerun, so old records cannot count as new evidence.

Keep the platform and model in each result. A copied Claude baseline is historical data, not a same-model comparison with OpenCode.
