# Tests for the semver skill

The eval plan is in the "Testing Decisions" section of issue #164. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. It has `CHANGELOG.md`, `package.json` at version 1.2.0, and the default Semver policy with `Finish approval: automatic`. |
| `fixtures/<test>/` | Files that replace or add project files for one test. |
| `evals.json` | The output tests: request, setup, and statements. `common_assertions` (V1 to V6) apply to each test. Each statement is `{id, text, grader}`. A `script` statement also names its `check` in `assertions.ts` and gives its `args`. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `load-requests.json` | The 20 load requests of the description test, each with the expected result. |
| `run-load-test.ts` | Runs the load test with `claude -p`. `eval-lib.ts` gives the load decision. |
| `eval-lib.ts` | The test repository, the fake `gh` on `PATH`, and the audit of the commands of a run. |
| `fake-gh.ts` | The fake `gh`. `gh pr list` and `gh pr view` answer from `prs.json`. `gh pr create`, `gh pr merge`, and `gh pr close` change `prs.json` only, never Git refs. |
| `git-state.ts` | The Git state before and after a run. |
| `assertions.ts` | The script checks. |
| `grade.ts` | Grades the script statements of one run, and merges the llm results into `grading.json`. |
| `grader.md` | Instructions for the grader subagent of the llm statements, and the confirmer prompt. |

The unit tests (`*.test.ts`) test the fake `gh`, the Git state parser, the audit, the load decision, and the checks. The test container has no Git, so they test the parsers with saved Git output.

## Run

The runner needs [Bun](https://bun.sh), Git, and `jq` on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/engineering/semver/run-evals.ts --out /tmp/semver-evals/iteration-1 --ids 17,18,21
```

It runs a maximum of 5 runs at the same time (`--jobs 5`). A run that hits the usage limit gets a `LIMIT_HIT` file in its folder. Run it again later. `--configs with_skill` skips the baseline.

Then grade each run folder (`<iteration>/eval-<name>/<configuration>/run-1`) in 4 steps:

1. `bun tests/skills/engineering/semver/grade.ts script <run-dir>` grades the `script` statements and writes `script-grading.json`. It exits 1 and grades nothing when the run has `LIMIT_HIT`.
2. Give `grader.md` and the run folder to a fresh grader subagent, one grader for each run. It writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when at least 1 confirmer agrees.
4. `bun tests/skills/engineering/semver/grade.ts merge <run-dir>` writes `grading.json`.

## Load test

```sh
bun tests/skills/engineering/semver/run-load-test.ts --out /tmp/semver-load/round-1.json
```

The load test runs each request 3 times (`--runs 3`), a maximum of 5 runs at the same time. Each run starts from the test repository with the skill in `.claude/skills/semver/`, but with no system prompt that names the skill. Before the run, the repository gets a lodash dependency, a `README.md` with a typo, the branch `feature/search` merged into `develop` (pull request #1), the branch `release/1.3.0` with the open pull request #42 into `main`, a file `src/app.ts` with conflict markers, and one staged change. HEAD is on `develop`. So each request fits the repository. A run counts as a load when the agent calls the skill or reads its `SKILL.md` before its first command that makes a branch, merges, makes a tag, pushes, or writes through `gh`, and within its first 8 tool calls. A final answer before a load counts as no load. Then the runner stops the run. A request is correct when its load rate is on the correct side of 0.5. `--ids 1,11` runs only the requests at these positions in `load-requests.json`, for example the requests that failed.

## The test repository

For each run, the runner copies `project/` and the test's overlay to a temporary folder outside this repository, and deletes the paths in `setup.remove`. Runs with the skill copy it to `.claude/skills/semver/` and add "Use the semver skill for this task." to the system prompt. The runner then runs `git init -b main`, makes the start commit with a fixed date, tags it `v1.2.0`, and makes `develop` from it. It pushes the 2 branches and the tag to a local bare repository as `origin`. HEAD stays on `main`. Then it runs the shell commands in `setup.steps`.

`setup.prs` gives the pull requests of the fake `gh`, with the field names of `gh --json`. `headRefOid` and `mergeCommit` are Git revisions, for example `feature/a~1`, that the runner resolves after the setup steps. Without `headRefOid`, a pull request gets the commit of its head branch on `origin`. `setup.gh: false` puts no `gh` on `PATH`, also not the real one.

The runner saves these files in `outputs/`:

- `git-before.json` and `git-after.json` for `grade.ts`, and `git-before.md` and `git-after.md` for the grader. Each has HEAD, the local branches and tags, the refs of `origin`, each commit with its parents, message, and changed files, the files of each branch and tag, `git status`, the staged files, and the Semver policy.
- `prs-before.json` and `prs.json`: the pull requests before and after the run.
- `gh-calls.txt`: one JSON line with the arguments of each `gh` call.
- `report.md`: the final message of the run.

## Manual checklist

The Operator runs these checks once on Claude Code, in an interactive session, before the build pull request merges, and records the results in that pull request. Each check starts in a copy of `project/` with the skill installed, as the runner makes it. For M1 and M2, delete `docs/agents/semver-policy.md` before the session starts.

- [ ] M1. No policy, "Start a feature branch for search.", answer `Use defaults`: the skill shows the offered 14-line file first, writes it, does not stage it, and starts the branch.
- [ ] M2. No policy, answer `Choose each setting`: one question at a time, in table order, with the offered value first. `local` for `Finish mode` and `none` for `Development branch` skip `Tag and back-merge`, `Development auto-merge`, `Production auto-merge`, and `Development merge`. A typed `feature..x` for `Production branch` is asked again. `Production merge` shows the squash warning with `merge commit` recommended.
- [ ] M3. A policy with no `Back-merge conflicts` line: one question with `confirm` first, and the line is added. A second job asks nothing.
