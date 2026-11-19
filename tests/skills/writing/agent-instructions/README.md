# Tests for the agent-instructions Skill

Section 12 "Eval plan" of [Spec: agent-instructions skill](https://github.com/a1exk-dev/agent-context/issues/17) gives the eval plan. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. |
| `fixtures/<test>/` | Files that replace project files for one test. |
| `evals.json` | The 10 output tests: request, setup, statements, and known mistakes. Each statement is `{id, text, grader}`, and `grader` is `script`, `llm`, or `advisory`. |
| `grade.ts` | The grade script. It grades the `script` statements of one run and merges the LLM results into `grading.json`. `grade.test.ts` tests it. |
| `assertions.ts` | The `script` statement checks by id, and the lists that the LLM grader examines. |
| `process.ts` | The process statements [3a] and [3c], and the review statements [1], [2], and [4]. See [The review statements](#the-review-statements). |
| `load-requests.json` | The 20 load-test requests, each with the expected result. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the Skill. |
| `run-opencode-evals.ts` | Runs the output tests with OpenCode, only with the Skill, and exports each parent and child session. |
| `run-load-test.ts` | Runs the load test with Claude Code or OpenCode. |
| `eval-lib.ts` | The runner code that the 3 runners share. `eval-lib.test.ts` tests its parsers. The runners of human-communication and semver also import this file. |
| `grader.md` | Instructions for the grader subagent that checks the `llm` and `advisory` statements, and the Confirmer prompt. |
| `check-script.test.ts` | The unit tests of `scripts/check.ts` of the Skill. |

## Run

The runners need [Bun](https://bun.sh) on the host, because they start `claude` and `opencode` with your sign-ins. Run them from the repository root. Run a script with `--help` to see its options.

```sh
bun tests/skills/writing/agent-instructions/run-evals.ts --out /tmp/ai-evals/iteration-1
bun tests/skills/writing/agent-instructions/run-load-test.ts --out /tmp/ai-evals/iteration-1/load-test.json
```

Each script runs a maximum of 5 runs at the same time (`--jobs 5`), and refuses a `--jobs` value above 5. When an output run hits the usage limit, the runner writes a `LIMIT_HIT` file in the folder of the run. When a load-test run hits the usage limit, the load test stops with an error. Run that test again later.

Then grade each run folder (`<iteration>/eval-<name>/<configuration>/run-1`) in 4 steps:

1. `bun tests/skills/writing/agent-instructions/grade.ts script <run-dir>` grades the `script` statements. It writes `script-grading.json` with the lists for the LLM grader. When the run has `LIMIT_HIT` or `INCOMPLETE`, `grade.ts` grades nothing and exits 1. Run that test again later.
2. Give `grader.md` and the run folder to a new grader subagent, one grader for each run. The grader writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 Confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when 1 or more Confirmers agree.
4. `bun tests/skills/writing/agent-instructions/grade.ts merge <run-dir>` writes `grading.json`. Its summary counts the `script` and `llm` statements. The summary shows the `advisory` statements but does not count them.

## The test repository

The runner copies `project/` to a temporary folder outside this repository. Thus the `AGENTS.md` and `CLAUDE.md` of this repository do not load. The runner also does these steps:

- It gives each run its own empty `TMPDIR` next to that copy. In this `TMPDIR`, the run makes its round folder with `mktemp -d`. The round folder holds the copy of each file at the start of each reader-test round, the reader reports, and the closed lists.
- After the run, the runner copies the `TMPDIR` to `outputs/tmp/`. `grade.ts` uses this copy to check the vote of each reader-test round for [3a].
- `--setting-sources project,local` keeps user Skills and user memory out of the run.
- For a run with the Skill, the runner installs the Skill in `.claude/skills/` and adds `FORCE_SKILL` of `eval-lib.ts` to the system prompt.

`FORCE_SKILL` tells the run to use the Skill and to do the reader test with its vote. It also tells the run to skip the review rounds of the self-check. Thus the run starts no loading, ASD-STE100, or ISO 24495-1 reviewer, and no Confirmer for these reviewers. The output tests then check how well the Skill does its job, for a small part of the tokens of a full self-check.

## The review statements

`process.ts` sorts each subagent by the `Check class:` line of its prompt. It reads `transcript.jsonl` or `sessions/`. `evals.json` no longer has the statements [1], [2], or [4], because the runs skip the review rounds. See [Eval matrix: no reviewer rounds, only the Skill's job and the reader test](https://github.com/a1exk-dev/agent-context/issues/211). `grade.ts` still grades these statements in a recorded run whose `eval_metadata.json` has them.

## The budget of a change

The budget of a change to an Agent instruction is a number of rounds and test runs. "When a blocking problem stays open at a limit" in `references/review.md` of the Skill gives the limits: 2 review rounds, 2 reader-test rounds, 1 fix for a failed output test or manual check, 2 runs of an output test, and 3 runs of a manual check. Statement [4] fails a recorded run with more than 2 review rounds or more than 2 reader-test rounds. The agent does not measure tokens. This table gives the Operator an estimate. See [Which round limits and token budget does a change get?](https://github.com/a1exk-dev/agent-context/issues/255).

| Check | Tokens | Source |
|---|---|---|
| 1 reviewer | about 115K | #248: 9 reviewers, about 1.03M |
| 1 Confirmer | about 44K | #248: 8 Confirmers, about 0.35M |
| 1 review round | max about 0.75M | 3 reviewers and max 9 Confirmers |
| 1 reader-test round | about 0.3M | 3 readers and max 4 Confirmers, a reader counted as about 50K |
| 1 output-test run | about 2.7M | #211 matrix: 27.3M for 10 runs on Opus, graders not counted |
| 1 manual check run | no data | The implementation effort records the cost of the first runs |

Example: a change that touches 1 output test and no manual check costs at most about 2 × 0.75M + 2 × 0.3M + 2 × 2.7M = 7.5M tokens. Most changes pass round 1 and cost much less.

## Load test

The load test adds no system prompt. It checks only the description of the Skill. Each request runs 3 times.

A load-test run counts as a load when the agent calls the Skill or reads its `SKILL.md` in its first 8 tool calls. A request that expects a load is correct when its load rate is 0.5 or more. A request that expects no load is correct when its load rate is less than 0.5.

## OpenCode

```sh
bun tests/skills/writing/agent-instructions/run-opencode-evals.ts --out /tmp/ai-evals/iteration-6 --jobs 5
bun tests/skills/writing/agent-instructions/run-load-test.ts --out /tmp/ai-evals/iteration-6/load-test.json --platform opencode --jobs 5
```

The OpenCode runs use these settings:

- The default model is `openai/gpt-6-astra`. `--model` selects a different model.
- The runs use the same sample project, requests, and statements as the Claude Code runs.
- The output runner adds `FORCE_SKILL` to the prompt of the `build` agent. The load test adds no prompt.
- The runner disables external Skills and Claude Code Skills, and runs `opencode run --pure`.
- Test 10 denies the `task` tool. The load test denies the `task` tool in each run.

Run a maximum of 5 graders at the same time, each in a new subagent.

The output runner saves the full session exports in `sessions/`. It also writes the tool calls of each child session to `transcript.md`. When a run has `INCOMPLETE`, run that test again before you grade it. Use a new output folder for each new run, so that old records do not count as new results.

Keep the platform and the model in each result. A copied Claude Code baseline is an old result. Do not compare it with OpenCode as if the two runs used the same model.
