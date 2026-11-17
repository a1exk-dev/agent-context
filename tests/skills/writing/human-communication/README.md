# Tests for the human-communication Skill

The section "Testing Decisions" of [Spec: human-communication Skill](https://github.com/a1exk-dev/agent-context/issues/188) gives the eval plan. The resolution comment of [Which test prompts and pass criteria go in the human-communication Skill's eval plan?](https://github.com/a1exk-dev/agent-context/issues/184) adds to it. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. See [The sample project](#the-sample-project). |
| `evals.json` | The 38 output tests: request, setup, `expect`, and statements. See [The output tests](#the-output-tests). |
| `overlays/` | The files that a test copies over `project/`, one folder for each test that names it in `setup.overlay`. Examples are the `AGENTS.md` of test 22 and the fixture Skill `setup-ci` of test 23. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the Skill. |
| `question-host.ts` | The question host: a `PreToolUse` hook on `AskUserQuestion` and a stdio MCP server for `--permission-prompt-tool`. |
| `eval-lib.ts` | The tests of `evals.json`, the temporary copy of the project, and the copy of the outputs before the runner deletes the copy. The general runner code comes from `tests/skills/engineering/eval-lib.ts` and `tests/skills/writing/agent-instructions/eval-lib.ts`. |
| `git-state.ts` | The Git state before and after a run. |
| `human-text.ts` | The human text of a run, and the word and sentence checks of U2. |
| `assertions.ts` | The script checks. |
| `grade.ts` | Grades the script statements of one run, and merges the `llm` results into `grading.json`. |
| `grader.md` | Instructions for the grader subagent of the `llm` statements, and the Confirmer prompt. |
| `load-requests.json` | The 20 requests of the load test. Each request expects a load of the Skill. |
| `run-load-test.ts` | Runs the load test with `claude -p` in 2 configurations. See [Load test](#load-test). |
| `load-decision.ts` | Decides if a load-test run loaded the Skill. |
| `static.test.ts` | The static test in the check. See [Static test](#static-test). |

The unit tests (`*.test.ts`) test these items:

- The Git state parser.
- The copy and the delete of the run folder.
- The human text, the script checks, and `grade.ts`.
- The question host, the load decision, and the setup of the load test.

The test container has no Git, so the unit tests test the parser with saved Git output.

## Run

The runner needs [Bun](https://bun.sh) and Git on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/writing/human-communication/run-evals.ts --out /tmp/hc-evals/iteration-1 --ids 1,2,3
```

The runner runs a maximum of 5 runs at the same time (`--jobs 5`), and refuses a `--jobs` value above 5. When a run hits the usage limit, the runner writes a `LIMIT_HIT` file in the folder of the run. Run that test again later. `--configs with_skill` skips the baseline.

Then grade each run folder (`<iteration>/eval-<name>/<configuration>/run-1`) in 4 steps:

1. `bun tests/skills/writing/human-communication/grade.ts script <run-dir>` grades the `script` statements and writes `script-grading.json`. When the run has `LIMIT_HIT`, `grade.ts` grades nothing and exits 1.
2. Give `grader.md` and the run folder to a new grader subagent, one grader for each run. The grader writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 Confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when 1 or more Confirmers agree.
4. `bun tests/skills/writing/human-communication/grade.ts merge <run-dir>` writes `grading.json`.

## The output tests

Each test in `evals.json` has these fields:

- `common_assertions` (U1 to U6) apply to each test, except the ids in the `skip` list of the test.
- Each statement is `{id, text, grader}`. A `script` statement also names its `check` in `assertions.ts` and gives its `args`.
- `expect.changes` lists the files that the request asks for. `expect.commits` gives the number of new commits (U5).
- `templates` lists the template files of the test in the project.
- A test with `"questions": true` also gets the statements Q1 to Q6 of `question_assertions`, after U1 to U6.

## The sample project

`project/` has these files:

- `AGENTS.md`, and `CLAUDE.md` with the line `@AGENTS.md`.
- `GLOSSARY.md` with the term "Job". The glossary tells the agent to avoid "task".
- `README.md`.
- `src/fetch.ts`: a retry with a limit of 3.
- `src/scheduler.ts`: a comment that calls a Job a "task".
- `issues.json`: 3 issues.
- `docs/agents/human-communication-policy.md`: the default Human communication policy.

## The test repository

For each run, the runner does these steps:

1. It copies `project/` and the overlay of the test to a temporary folder outside this repository.
2. It deletes the paths in `setup.remove`.
3. For a run with the Skill, it copies the Skill to `.claude/skills/human-communication/`. It adds "Use the human-communication skill for this task." to the system prompt. The runner installs no other Skill.
4. It runs `git init -b main`, makes the start commit with a fixed date, and runs the shell commands in `setup.steps`.

After the run, the runner copies each changed file to `outputs/files/` and deletes the temporary folder. The runner saves these files in `outputs/`:

- `git-before.json` and `git-after.json` for `grade.ts`, and `git-before.md` and `git-after.md` for the grader. Each file has HEAD, the commits with their messages and files, `git status`, and the staged files.
- `files/`: a copy of each new or changed file.
- `report.md`: the final message of the run.

## Question host

`claude -p` offers `AskUserQuestion` only when the run has a permission host. A test with an `answers` list in `evals.json` gets the question host. The runner writes the question host to `host/`, next to the project folder in the temporary folder. Thus the files of `host/` never show in the Git state:

- `question-host.ts`, a copy of the file in this folder.
- `answers.json`, the `answers` list of the test.
- `settings.json`, the `PreToolUse` hook on `AskUserQuestion`. The runner gives this file with `--settings`.
- `mcp.json`, the MCP server. The runner gives this file with `--mcp-config`. `--permission-prompt-tool mcp__question-host__prompt` names its tool.

The hook saves the input of each call to `host/questions.jsonl`. The hook answers each question with the next answer of the list. When the list has no answer left, the hook selects the first option. The MCP tool allows each call with its input unchanged. After the run, the runner copies `questions.jsonl` to `outputs/`. A test with no `answers` list runs with no host, so the run has no question tool.

A test with `hostError`, for example test 20, gets `host/error.txt` with that text. The hook then denies each call with the text as its error, as a platform with no human does. The hook saves each denied call with an `error` field. A denied call gives no answer, so Q1, Q2, and Q6 read the numbered list in the chat text after the error.

## Human text

U2 and the other text checks read the human text of a run. The human text has these parts:

- Each text block of the main agent.
- The final message, when no text block holds the final message.
- Each question with its options in `outputs/questions.jsonl`.
- Each new or changed Markdown or text file.
- The body of each new commit message.

`human-text.ts` changes the human text before the checks, in this sequence:

1. It removes each line that is equal to a line of a template in `templates`. The fixed text of a template is not text of the agent.
2. It removes the code blocks.
3. It puts 1 word in place of each code span, URL, path, and quoted text, because the writing rules do not apply to them.

## Load test

The load test runs each request of `load-requests.json` 3 times in each configuration. It adds no system prompt that names the Skill. The 2 configurations are:

- `description`: the Skill with no pointer text. Only the description of the Skill can load the Skill.
- `pointer`: the Skill, and the pointer text in `AGENTS.md`.

Run the load test from the repository root:

```sh
bun tests/skills/writing/human-communication/run-load-test.ts --out /tmp/hc-load/round-1.json
```

`--configs description` or `--configs pointer` runs 1 configuration. `--ids 1,5` runs only these requests.

The runner prepares the copy of `project/` in these steps:

1. In the `pointer` configuration, the runner adds `references/agents-md-pointer.md` of the Skill to `AGENTS.md` and commits the change.
2. In the 2 configurations, the runner makes the branch `feature/log-level` with 4 commits: a new config option, `fetchData`, a retry test, and a README typo.
3. The runner stages a change in `src/fetch.ts`.

With this setup, each request fits the copy.

A run counts as a load when the agent calls the Skill or reads its `SKILL.md` before 3 events: its first text, its first question, and its first document write. The load must also occur in the first 8 tool calls. A request is correct when its load rate is 0.5 or more. The stop rule needs 18 or more correct requests of 20 in each configuration.

## Static test

`static.test.ts` runs in the check. It examines the text of the Skill:

- The Skill names no other Skill.
- The description and the pointer text name no exclusion.
- The Skill ships the pointer text word for word.
- Each "compliant" or "certified" is in a sentence with "never" or "not".

It also examines the setup of the Skill in this repository:

- `.agents/skills/` and `.claude/skills/` each have a symbolic link to the Skill.
- `docs/agents/human-communication-policy.md` is the default Human communication policy.
- `AGENTS.md` has the pointer text in the section "Human communication", and has no section "Questions".

## Manual checklist

The Operator runs these checks one time in an interactive Claude Code session, before the build pull request merges. The Operator records the results in the pull request. Each check starts in a copy of `project/` with the Skill installed.

- M1. Delete `docs/agents/human-communication-policy.md`, give the request of test 12, and select `Use defaults`. The question UI shows the 2 setup tabs with the headers "Q1 of 2" and "Q2 of 2". The questions of the task then start at Q3.
- M2. Give a request with a question whose options differ in code, for example "Ask me which retry limit to use in src/fetch.ts, then change it". The question UI shows the example in the preview of each option.
- M3. With `Question mode: one at a time` in the policy, give the request of test 12. The agent waits for each answer before it asks the next question.
