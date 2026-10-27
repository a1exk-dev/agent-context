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

For each run, the runner copies `project/` and the test's overlay to a temporary folder outside this repository, and deletes the paths in the test's `setup.remove`. Tests 6, 7, and 8 delete `docs` in this way, so the start commit has no Commit policy. It runs `git init -b develop`, makes a start commit with a fixed date, and pushes it to a local bare repository as `origin`. Then it runs the shell commands in the test's `setup.steps`, for example a change to a file that must stay out of the commit, or a commit that a test amends, reverts, or merges. `git-before.md` shows the commits of these steps. For each name in `setup.stubs`, the runner puts a stub command first on `PATH`. The stub records its arguments in `outputs/stub-calls.txt` and does nothing else. Test 14 uses a stub `gh` in this way. No test needs the network.

Runs with the skill install it in `.claude/skills/git-commit/` before the start commit and add "Use the git-commit skill for this task." to the system prompt. `--setting-sources project,local` keeps user skills and user memory out of the run.

The runner saves the git state before and after the run in `outputs/git-before.md` and `outputs/git-after.md`, and the audit of the git commands in `outputs/audit.json`.

## Manual checks

The output tests run with no human, so these checks test the human paths. The Operator runs them once on Claude Code, in an interactive session, before the build pull request merges, and records the results in that pull request. Start each check in a copy of `project/` with the Skill in `.claude/skills/git-commit/`, as the runner makes it.

The checks M4 and M5 use the request of the next paragraph and have no Commit policy. For the checks M1, M2, M3, M8, M9, and M10, first set `- Commit approval: confirm` in `docs/agents/commit-policy.md` and commit that change. Then make the change of the check. Except in M8, the request in these checks is "Add a function `capitalize(text: string): string` to `src/strings.ts` that returns the text with its first letter in upper case. Then commit it."

| Check | Setup | Pass when |
|---|---|---|
| M4 | Delete the folder `docs` and commit the deletion. Ask the request. Answer `Choose each setting`. Answer `50` for `Header length` and `Closes` for `Issue footer`, and answer the default value for the other Settings. Answer `Commit` 2 times. | The Skill first shows the default Commit policy and asks `Use defaults` or `Choose each setting`. Then it asks 10 questions, one at a time, in the sequence of the Setting table, each with the default value as the recommended answer. It writes `docs/agents/commit-policy.md` with the given values. It commits `chore: add commit policy` alone first, then the task commit, each after its own Commit review. |
| M5 | Delete the folder `docs` and commit the deletion. Ask the request. Answer `Use defaults`. Answer `Commit` 2 times. | The Skill writes the default Commit policy. It commits `chore: add commit policy` alone first, then the task commit, each after its own Commit review. |
| M6 | Delete the line `- Push: off` from `docs/agents/commit-policy.md`. Ask for a commit. Then ask for a second commit. | The first commit asks one question about `Push`, with `off` as the recommended answer. The Skill writes the line, and commits `chore: update commit policy` alone before the task commit. The second commit asks nothing about `Push`. |
| M1 | Ask the request. Answer `Commit`. | The Commit review shows the staged-file stat, the full diff, the exact message, and the other changed files, and asks one question with `Commit`, `Request changes`, and `Reject`. After `Commit`, there is one new commit with exactly the shown diff and message. |
| M2 | Ask the request. Answer `Request changes` and say "use scope strings". Then answer `Commit`. | A new Commit review shows the header with the scope `strings`. After `Commit`, the commit has that header. |
| M3 | Ask the request. Answer `Reject`. | No new commit. `git diff --cached` is empty, and `git diff` still shows the change to `src/strings.ts`. |
| M9 | Add the hook in the code block after this table. Ask the request. Answer `Commit`. | After the first `Commit`, the Skill undoes the commit and shows a new Commit review with the line `// checked`. After the second `Commit`, there is one new commit, and it has that line. |
| M8 | Make the branch `feature/x` from `develop` with 2 commits that change `src/strings.ts`, and one more commit on `develop` that changes `README.md`. Ask "Merge feature/x into develop locally." Answer `Commit`. | The Commit review lists the 2 commits that the merge brings in, one line each, the staged-file stat, and the exact merge message, and asks `Commit`, `Request changes`, or `Reject`. After `Commit`, there is one merge commit with 2 parents and that message. |
| M10 | Ask "Use a subagent to add a function `capitalize(text: string): string` to `src/strings.ts` and to commit it." Answer `Commit`. | The subagent makes no commit. The main agent shows the Commit review of the subagent and asks the Operator. After `Commit`, there is one new commit. |

The hook of M9 is `.git/hooks/pre-commit`. Make it executable with `chmod +x .git/hooks/pre-commit`. It adds a line to `src/strings.ts` and stages it, one time only:

```sh
#!/bin/sh
grep -q '// checked' src/strings.ts && exit 0
printf '// checked\n' >> src/strings.ts
git add src/strings.ts
```
