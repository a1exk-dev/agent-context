# Tests for the common-changelog skill

The eval plan is in the "Testing Decisions" section of issue #100. These files run it.

| File | Purpose |
|---|---|
| `project/` | Sample project. Each output test starts from a copy. Its Changelog policy is the default. |
| `fixtures/<test>/` | Files that replace or add project files for one test, before the fixed history. |
| `evals.json` | The output tests: request, setup, and statements. `common_assertions` (C1 to C6) apply to each test. |
| `run-evals.ts` | Runs the output tests with `claude -p`, with and without the skill. |
| `eval-lib.ts` | The test repository with its fixed history, the repository state, and the audit of the tool calls. `eval-lib.test.ts` tests the audit. |
| `grader.md` | Instructions for the grader subagent that checks each statement. |

## Run

Run the runner from the repository root with Bun. Run it with `--help` to see its options.

```sh
bun tests/skills/engineering/common-changelog/run-evals.ts --out /tmp/cc-evals/iteration-1 --ids 4,5
```

Then give `grader.md` and one eval folder to a fresh grader subagent, one grader for each run.

## Manual checks

The output tests run with no human, so these checks test the human paths. The Operator runs them once on Claude Code, in an interactive session, before the build pull request merges, and records the results in that pull request. Start each check in a copy of `project/` with the fixed history of `eval-lib.ts` and the Skill in `.claude/skills/common-changelog/`, as the runner makes it.

| Check | Setup | Pass when |
|---|---|---|
| M4 | Switch to the branch `release/1.3.0`. Ask "Release the changelog as 1.4.0." | The Skill names the versions 1.3.0 and 1.4.0 and asks which one to use. `CHANGELOG.md` does not change before the answer. After the answer, the release entry has the selected version. |
| M5 | Switch to the branch `hotfix/login`. Ask "Add a changelog entry: fix `slugify` keeping leading spaces (pull request #6)." Answer `1.2.1` when the Skill asks for the version. | The Skill asks for the version and does not change `CHANGELOG.md` before the answer. After the answer, the first section after `# Changelog` is `## [1.2.1] - <today>` with the new item and the old Unreleased items, each with its commit reference, and there is no `## Unreleased` section. |
| M6 | Set `- Notice: major` in `docs/agents/changelog-policy.md`. Ask "Release the changelog as 2.0.0." Answer "_See the [upgrade guide](UPGRADING.md) for 2.0.0._" when the Skill asks for a notice. | The Skill asks for an upgrade-guide notice. The `## [2.0.0] - <today>` entry has the given text as its notice, directly after the heading and before the groups. |
