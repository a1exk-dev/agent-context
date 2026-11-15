# Tests for the human-communication skill

The eval plan is in the "Testing Decisions" section of issue #188 and in the resolution comment of issue #184. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. It has `AGENTS.md`, `CLAUDE.md` (`@AGENTS.md`), `GLOSSARY.md` with the term "Job" ("task" to avoid), `README.md`, `src/fetch.ts` (a retry with a limit of 3), `src/scheduler.ts` (a comment that calls a Job a "task"), `issues.json` (3 issues), and the default Human communication policy. |
| `evals.json` | The output tests: request, setup, `expect`, and statements. `common_assertions` (U1 to U6) apply to each test, except the ids in its `skip` list. Each statement is `{id, text, grader}`. A `script` statement also names its `check` in `assertions.ts` and gives its `args`. `expect.changes` lists the files that the request asks for, and `expect.commits` the number of new commits (U5). |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `eval-lib.ts` | The tests of `evals.json`, the temporary copy of the project, and the copy of the outputs before the runner deletes the copy. |
| `git-state.ts` | The Git state before and after a run. |
| `human-text.ts` | The human text of a run, and the word and sentence checks of U2. |
| `assertions.ts` | The script checks. |
| `grade.ts` | Grades the script statements of one run, and merges the llm results into `grading.json`. |
| `grader.md` | Instructions for the grader subagent of the llm statements, and the confirmer prompt. |
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

## The test repository

For each run, the runner copies `project/` and the overlay of the test to a temporary folder outside this repository, and deletes the paths in `setup.remove`. Runs with the skill copy it to `.claude/skills/human-communication/` and add "Use the human-communication skill for this task." to the system prompt. No other skill is installed. The runner then runs `git init -b main`, makes the start commit with a fixed date, and runs the shell commands in `setup.steps`.

After the run, the runner copies each changed file to `outputs/files/` and deletes the temporary folder. It saves these files in `outputs/`:

- `git-before.json` and `git-after.json` for `grade.ts`, and `git-before.md` and `git-after.md` for the grader. Each has HEAD, the commits with their messages and files, `git status`, and the staged files.
- `files/`: a copy of each new or changed file.
- `report.md`: the final message of the run.

## Human text

U2 and the other text checks read the human text: each text block of the main agent, the final message when no text block holds it, each question with its options in `outputs/questions.jsonl`, each new or changed Markdown or text file, and the body of each new commit message. Before the checks, `human-text.ts` removes code blocks. It puts 1 word in place of each code span, URL, path, and quoted text, because the writing rules do not apply to them.
