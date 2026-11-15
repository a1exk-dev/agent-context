# Tests for the human-communication skill

The eval plan is in the "Testing Decisions" section of issue #188 and in the resolution comment of issue #184. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. It has `AGENTS.md`, `CLAUDE.md` (`@AGENTS.md`), `GLOSSARY.md` with the term "Job" ("task" to avoid), `README.md`, `src/fetch.ts` (a retry with a limit of 3), `src/scheduler.ts` (a comment that calls a Job a "task"), `issues.json` (3 issues), and the default Human communication policy. |
| `evals.json` | The output tests: request, setup, `expect`, and statements. `common_assertions` (U1 to U6) apply to each test, except the ids in its `skip` list. Each statement is `{id, text, grader}`. A `script` statement also names its `check` in `assertions.ts` and gives its `args`. `expect.changes` lists the files that the request asks for, and `expect.commits` the number of new commits (U5). `templates` lists the template files of the test in the project. |
| `overlays/` | The files that a test copies over `project/`, one folder for each test that names it in `setup.overlay`. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `question-host.ts` | The question host: a `PreToolUse` hook on `AskUserQuestion` and a stdio MCP server for `--permission-prompt-tool`. |
| `overlays/` | The files that a test copies over the project, for example the `AGENTS.md` of test 22 and the fixture skill `setup-ci` of test 23. |
| `eval-lib.ts` | The tests of `evals.json`, the temporary copy of the project, and the copy of the outputs before the runner deletes the copy. |
| `git-state.ts` | The Git state before and after a run. |
| `human-text.ts` | The human text of a run, and the word and sentence checks of U2. |
| `assertions.ts` | The script checks. |
| `grade.ts` | Grades the script statements of one run, and merges the llm results into `grading.json`. |
| `grader.md` | Instructions for the grader subagent of the llm statements, and the confirmer prompt. |
| `load-requests.json` | The 20 requests of the load test. Each must load the skill. |
| `run-load-test.ts` | Runs the load test with `claude -p` in 2 configurations: `description` (the skill with no pointer) and `pointer` (the skill and the pointer text in `AGENTS.md`). |
| `load-decision.ts` | Decides if a load-test run loaded the skill. |
| `static.test.ts` | The static test in the check: the skill names no other skill, the description and the pointer text name no exclusion, the pointer text is word for word, and each "compliant" or "certified" is in a sentence with "never" or "not". |

The unit tests (`*.test.ts`) test the Git state parser, the copy and delete of the run folder, the human text, the checks, and `grade.ts`. The test container has no Git, so they test the parser with saved Git output.

## Run

The runner needs [Bun](https://bun.sh) and Git on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/writing/human-communication/run-evals.ts --out /tmp/hc-evals/iteration-1 --ids 1,2,3
```

It runs a maximum of 5 runs at the same time (`--jobs 5`). A run that hits the usage limit gets a `LIMIT_HIT` file in its folder. Run it again later. `--configs with_skill` skips the baseline.

Then grade each run folder (`<iteration>/eval-<name>/<configuration>/run-1`) in 4 steps:

1. `bun tests/skills/writing/human-communication/grade.ts script <run-dir>` grades the `script` statements and writes `script-grading.json`. It exits 1 and grades nothing when the run has `LIMIT_HIT`.
2. Give `grader.md` and the run folder to a fresh grader subagent, one grader for each run. It writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when at least 1 confirmer agrees.
4. `bun tests/skills/writing/human-communication/grade.ts merge <run-dir>` writes `grading.json`.

## Load test

The load test runs each request of `load-requests.json` 3 times in each configuration. It adds no system prompt that names the skill. Run it from the repository root:

```sh
bun tests/skills/writing/human-communication/run-load-test.ts --out /tmp/hc-load/round-1.json
```

`--configs description` or `--configs pointer` runs 1 configuration, and `--ids 1,5` runs only these requests. The pointer configuration adds `references/agents-md-pointer.md` of the skill to `AGENTS.md` and commits it. In both configurations, the copy of `project/` is on the branch `feature/log-level` with 4 commits (a new config option, `fetchData`, a retry test, and a README typo) and a staged change in `src/fetch.ts`, so that each request fits it.

A run counts as a load when the agent calls the skill or reads its `SKILL.md` before its first text, its first question, and its first document write, and within its first 8 tool calls. A request is correct when its load rate is above 0.5. The stop rule needs at least 18 of 20 correct requests in each configuration.

## The test repository

For each run, the runner copies `project/` and the overlay of the test to a temporary folder outside this repository, and deletes the paths in `setup.remove`. Runs with the skill copy it to `.claude/skills/human-communication/` and add "Use the human-communication skill for this task." to the system prompt. No other skill is installed. The runner then runs `git init -b main`, makes the start commit with a fixed date, and runs the shell commands in `setup.steps`.

After the run, the runner copies each changed file to `outputs/files/` and deletes the temporary folder. It saves these files in `outputs/`:

- `git-before.json` and `git-after.json` for `grade.ts`, and `git-before.md` and `git-after.md` for the grader. Each has HEAD, the commits with their messages and files, `git status`, and the staged files.
- `files/`: a copy of each new or changed file.
- `report.md`: the final message of the run.

## Question host

`claude -p` offers `AskUserQuestion` only when the run has a permission host. A test with an `answers` list in `evals.json` gets the question host. The runner writes it to `host/`, next to the project folder in the temporary folder, so it never shows in the Git state:

- `question-host.ts`, a copy of the file in this folder.
- `answers.json`, the `answers` list of the test.
- `settings.json`, the `PreToolUse` hook on `AskUserQuestion`, passed with `--settings`.
- `mcp.json`, the MCP server, passed with `--mcp-config`. `--permission-prompt-tool mcp__question-host__prompt` names its tool.

The hook saves the input of each call to `host/questions.jsonl`. It answers each question with the next answer of the list, and with the first option when the list has no answer left. The MCP tool allows each call with its input unchanged. After the run, the runner copies `questions.jsonl` to `outputs/`. A test with no `answers` list runs with no host, so the run has no question tool.

A test with `hostError`, for example test 20, gets `host/error.txt` with that text. The hook then denies each call with the text as its error, as a platform with no human does. It saves each denied call with an `error` field. A denied call gives no answer, so Q1, Q2, and Q6 read the numbered list in the chat text after the error.

A test with `"questions": true` also gets the statements Q1 to Q6 of `question_assertions`, after U1 to U6.

## Human text

U2 and the other text checks read the human text: each text block of the main agent, the final message when no text block holds it, each question with its options in `outputs/questions.jsonl`, each new or changed Markdown or text file, and the body of each new commit message. Before the checks, `human-text.ts` removes code blocks. Before that, it removes each line that is equal to a line of a template in `templates`, because the fixed text of a template is not text of the agent. It puts 1 word in place of each code span, URL, path, and quoted text, because the writing rules do not apply to them.

## Manual checklist

The Operator runs these checks once in an interactive Claude Code session, before the build pull request merges, and records the results in the pull request. Each check starts in a copy of `project/` with the skill installed.

- M1. Delete `docs/agents/human-communication-policy.md`, give the request of test 12, and select `Use defaults`. The question UI shows the 2 setup tabs with the headers "Q1 of 2" and "Q2 of 2". The own questions then start at Q3.
- M2. Give a request with a question whose options differ in code, for example "Ask me which retry limit to use in src/fetch.ts, then change it". The question UI shows the example in the preview of each option.
- M3. With `Question mode: one at a time` in the policy, give the request of test 12. The agent waits for each answer before it asks the next question.
