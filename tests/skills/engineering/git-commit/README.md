# Tests for the git-commit skill

The eval plan is in the "Testing Decisions" section of issue #67. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. Its Commit policy is the default with `Commit approval: automatic`. |
| `fixtures/<test>/` | Files that replace or add project files for one test. |
| `evals.json` | The output tests: request, setup, and statements. `common_assertions` (S1 to S6) apply to each test. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `eval-lib.ts` | The test repository, the git state, and the git-command audit. `eval-lib.test.ts` tests the audit. The general runner code comes from `tests/skills/writing/agent-instructions/eval-lib.ts`. |
| `grader.md` | Instructions for the grader subagent that checks each statement. |

## Run

The runner needs [Bun](https://bun.sh) and Git on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/engineering/git-commit/run-evals.ts --out /tmp/gc-evals/iteration-1
```

It runs a maximum of 5 runs at the same time (`--jobs 5`), and refuses a `--jobs` value above 5. A run that hits the usage limit gets a `LIMIT_HIT` file in its folder. Run it again later.

Then give `grader.md` and one eval folder to a fresh grader subagent, one grader for each run.

## The test repository

For each run, the runner copies `project/` and the test's overlay to a temporary folder outside this repository. It runs `git init -b develop`, makes a start commit with a fixed date, and pushes it to a local bare repository as `origin`. Then it runs the shell commands in the test's `setup.steps`, for example a change to a file that must stay out of the commit. No test needs the network.

Runs with the skill install it in `.claude/skills/git-commit/` before the start commit and add "Use the git-commit skill for this task." to the system prompt. `--setting-sources project,local` keeps user skills and user memory out of the run.

The runner saves the git state before and after the run in `outputs/git-before.md` and `outputs/git-after.md`, and the audit of the git commands in `outputs/audit.json`.
