# Tests for the semver Skill

The section "Testing Decisions" of [Spec: semver Skill](https://github.com/a1exk-dev/agent-context/issues/164) gives the eval plan. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. It has `CHANGELOG.md`, `package.json` at version 1.2.0, and the default Semver policy with `Finish approval: automatic`. |
| `fixtures/<name>/` | Files that replace or add project files for one or more tests. `fixtures/merge-commit/` has the policy with `Development merge: merge commit`. `fixtures/finish-local/` has the policy with `Finish mode: local`. |
| `evals.json` | The output tests: request, setup, and statements. `common_assertions` (V1 to V6) apply to each test. Each statement is `{id, text, grader}`. A `script` statement also names its `check` in `assertions.ts` and gives its `args`. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the Skill. |
| `load-requests.json` | The 20 load requests of the description test, each with the expected result. |
| `run-load-test.ts` | Runs the load test with `claude -p`. `eval-lib.ts` gives the load decision. |
| `eval-lib.ts` | The test repository, the fake `gh` on `PATH`, and the audit of the commands of a run. The general runner code comes from `tests/skills/writing/agent-instructions/eval-lib.ts`. |
| `fake-gh.ts` | The fake `gh`. `gh pr list` and `gh pr view` answer from `prs.json`. `gh pr create`, `gh pr merge`, and `gh pr close` change `prs.json` only, never Git refs. |
| `git-state.ts` | The Git state before and after a run. |
| `assertions.ts` | The script checks. |
| `grade.ts` | Grades the script statements of one run, and merges the llm results into `grading.json`. |
| `check-script.test.ts` | Runs the check script of the Skill with `sh` and a fake `git` on `PATH`. It also makes sure that the Agent instructions of the Skill name no other Skill. |
| `grader.md` | Instructions for the grader subagent of the `llm` statements, and the prompt of the Confirmer. |

The unit tests (`*.test.ts`) test the fake `gh`, the Git state parser, the audit, the load decision, and the checks. The container of `bun run check` has no Git, so the unit tests give saved Git output to the parsers.

## Run

The runner needs [Bun](https://bun.sh), Git, and `jq` on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/engineering/semver/run-evals.ts --out /tmp/semver-evals/iteration-1 --ids 17,18,21
```

The runner runs a maximum of 5 runs at the same time (`--jobs 5`), and refuses a `--jobs` value above 5. When a run hits the usage limit, the runner writes a `LIMIT_HIT` file in the folder of the run. Run that test again later. `--configs with_skill` skips the baseline.

Then grade each run folder (`<iteration>/eval-<name>/<configuration>/run-1`) in 4 steps:

1. `bun tests/skills/engineering/semver/grade.ts script <run-dir>` grades the `script` statements and writes `script-grading.json`. It exits 1 and grades nothing when the run has `LIMIT_HIT`.
2. Give `grader.md` and the run folder to a fresh grader subagent, one grader for each run. It writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 Confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when at least 1 Confirmer agrees.
4. `bun tests/skills/engineering/semver/grade.ts merge <run-dir>` writes `grading.json`.

## Load test

```sh
bun tests/skills/engineering/semver/run-load-test.ts --out /tmp/semver-load/round-1.json
```

The load test runs each request 3 times (`--runs 3`), a maximum of 5 runs at the same time. Each run starts from the test repository with the Skill in `.claude/skills/semver/`, but with no system prompt that names the Skill. Before the run, the runner adds these items to the repository, so that each request fits the repository:

- A lodash dependency.
- A `README.md` with a typo.
- The branch `feature/search`, merged into `develop` with the pull request #1 of the fake `gh`.
- The branch `release/1.3.0`, with the open pull request #42 into `main`.
- A file `src/app.ts` with conflict markers.
- One staged change.

HEAD is on `develop`. A run counts as a load when the agent calls the Skill or reads its `SKILL.md` within its first 8 tool calls. The call or the read must also come before the first command that makes a branch, merges, makes a tag, pushes, or writes through `gh`. A final answer before a load counts as no load. Then the runner stops the run. A request is correct when its load rate is on the correct side of 0.5. `--ids 1,11` runs only the requests at these positions in `load-requests.json`, for example the requests that failed.

## The test repository

For each run, the runner copies `project/` and the test's overlay to a temporary folder outside this repository, and deletes the paths in `setup.remove`. For a run with the Skill, the runner copies the Skill to `.claude/skills/semver/`. The runner also adds "Use the semver skill for this task." to the system prompt. The runner then runs `git init -b main`, makes the start commit with a fixed date, tags the start commit `v1.2.0`, and makes `develop` from the start commit. The runner pushes the 2 branches and the tag to a local bare repository as `origin`. HEAD stays on `main`. Then the runner runs the shell commands in `setup.steps`.

`setup.prs` gives the pull requests of the fake `gh`, with the field names of `gh --json`. `headRefOid` and `mergeCommit` are Git revisions, for example `feature/a~1`, that the runner resolves after the setup steps. Without `headRefOid`, a pull request gets the commit of its head branch on `origin`. `setup.gh: false` puts no `gh` on `PATH`, also not the real one.

The runner saves these files in `outputs/`:

- `git-before.json` and `git-after.json` for `grade.ts`, and `git-before.md` and `git-after.md` for the grader. Each has HEAD, the local branches and tags, the refs of `origin`, each commit with its parents, message, and changed files, the files of each branch and tag, `git status`, the staged files, the Semver policy, and each file of a branch or tag commit with a conflict marker line.
- `prs-before.json` and `prs.json`: the pull requests before and after the run.
- `gh-calls.txt`: one JSON line with the arguments of each `gh` call.
- `report.md`: the final message of the run.

## Manual checklist

The Operator runs these checks once on Claude Code, in an interactive session, before the build pull request merges. The Operator records the results in that pull request. Start each check in a copy of `project/` with the Skill in `.claude/skills/semver/`, as the runner makes it. For M1 and M2, delete `docs/agents/semver-policy.md` before the session starts.

- [ ] M1. No policy, "Start a feature branch for search.", answer `Use defaults`: the Skill first shows the offered Semver policy with its 14 Settings. Then the Skill writes the Semver policy, does not stage it, and starts the branch.
- [ ] M2. No policy, answer `Choose each setting`: one question at a time, in table order, with the offered value first. `local` for `Finish mode` and `none` for `Development branch` skip `Tag and back-merge`, `Development auto-merge`, `Production auto-merge`, and `Development merge`. After a typed `feature..x` for `Production branch`, the Skill asks the `Production branch` question again. `Production merge` shows the squash warning with `merge commit` recommended.
- [ ] M3. A policy with no `Back-merge conflicts` line: one question with `confirm` first. The Skill adds the line. A second job asks nothing.
- [ ] M4. Make the repository as `setup` of test 7 in `evals.json` does: a merge of `feature/search` and one direct commit on `develop`. "Start the next release.": the Skill asks for the version and shows the `Breaking definition` value `CLI flags, config file format`. After the answer `1.3.0`, `release/1.3.0` exists and starts at `develop`. The Skill does not push `release/1.3.0`.
- [ ] M5. Make the repository as `setup` of test 13 in `evals.json` does: no tag. "Start the next release.": the Skill asks one question for the first version, with `0.1.0` recommended and `1.0.0`.
- [ ] M6. Make the repository as `setup` of test 24 in `evals.json` does, and set `Finish approval: confirm` in `docs/agents/semver-policy.md`. "Finish the release.": the Skill shows the plan first, then asks one question with `Finish`, `Request changes`, and `Reject`. After `Request changes`, it shows a new plan and asks again. After `Reject`, the branches, the tags, and the refs of `origin` did not change.
- [ ] M7. Make the repository as `setup` of test 35 in `evals.json` does, with `fixtures/35-back-merge-automatic/`, and set `Back-merge conflicts: confirm` in `docs/agents/semver-policy.md`. Keep `Development auto-merge: on`. Put the fake `gh` first on `PATH`: a `gh` script that sets `FAKE_GH_PRS` to a `prs.json` with the 2 pull requests of the test, sets `FAKE_GH_LOG` to an empty file, and runs `bun fake-gh.ts "$@"`, as `eval-lib.ts` does. "Finish the hotfix.": the Skill resolves `src/login.ts` on `bugfix/back-merge-v1.2.1`, shows the resolved diff, and asks before it pushes. After the answer `Push`, `prs.json` has the new pull request into `develop` with no auto-merge, and pull request #13 has the state `CLOSED`.
