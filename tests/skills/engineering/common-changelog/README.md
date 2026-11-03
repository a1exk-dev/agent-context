# Tests for the common-changelog skill

The eval plan is in the "Testing Decisions" section of issue #100. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. Its Changelog policy is the default. |
| `fixtures/<test>/` | Files that replace or add project files for one test. |
| `evals.json` | The output tests: request, setup, and statements. `common_assertions` (C1 to C6) apply to each test. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `eval-lib.ts` | The test repository, the repository state, and the tool-call audit. `eval-lib.test.ts` tests them. |
| `grader.md` | Instructions for the grader subagent that checks each statement. |

## Run

The runner needs [Bun](https://bun.sh) and Git on the host, because it starts `claude` with your sign-in. Run it from the repository root. Run it with `--help` to see its options.

```sh
bun tests/skills/engineering/common-changelog/run-evals.ts --out /tmp/cc-evals/iteration-1 --ids 19,20
```

Then give `grader.md` and one eval folder to a fresh grader subagent, one grader for each run.

## Manual checks

The output tests run with no human, so these checks test the human paths. The Operator runs them once on Claude Code, in an interactive session, before the build pull request merges, and records the results in that pull request. Start each check in a copy of `project/` with the Skill in `.claude/skills/common-changelog/`, as the runner makes it, and commit the setup of the check first.

| Check | Setup | Pass when |
|---|---|---|
| M1 | Delete `docs/agents/changelog-policy.md`. Ask "Add a changelog entry: fix `slugify` keeping leading spaces (pull request #6)." Answer `Use defaults`. | Before the question, the Skill shows the 8-line default Changelog policy. Then it writes that file, adds the item under `## Unreleased`, and stages nothing: `git diff --cached` is empty. |
| M2 | Delete `docs/agents/changelog-policy.md`. Ask "review the changelog". Answer `Choose each setting`. Answer the default value for each question, but for `Release branches` type `release/*, x y`, then type `release`. | The Skill asks 8 questions, one at a time, in this sequence: References, Notice, Authors, Version links, Host, Unreleased, Release branches, Draft approval. Each question gives the default value as the recommended first answer (`auto` for Host, `off` for Draft approval). After `release/*, x y`, it asks the `Release branches` question again. The file holds the answers with `- Release branches: release`, and the Review runs. |
| M3 | Delete the line `- Unreleased: on` from `docs/agents/changelog-policy.md`. Ask for a changelog entry. Then ask for a second changelog entry. | The first request asks one question about `Unreleased`, with `on` as the recommended answer. The Skill adds `- Unreleased: on` after `- Host: auto`, and does not commit the change. The second request asks no question. |
