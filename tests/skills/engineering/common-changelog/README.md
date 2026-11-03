# Tests for the common-changelog skill

The eval plan is in the "Testing Decisions" section of issue #100. These files run it.

## Manual checks

The output tests run with no human, so these checks test the human paths. The Operator runs them once on Claude Code, in an interactive session, before the build pull request merges, and records the results in that pull request. Start each check in a copy of `project/` with the fixed history of `eval-lib.ts` and the Skill in `.claude/skills/common-changelog/`, as the runner makes it.

| Check | Setup | Pass when |
|---|---|---|
| M7 | Put conflict markers inside the `## [1.2.0]` entry of `CHANGELOG.md`, as the setup of output test 18 does. Ask "Add a changelog entry: fix `slugify` keeping leading spaces (pull request #6)." | The Skill stops and asks the Operator to resolve the conflict. It says that the conflict is outside the Unreleased section and gives its line numbers. `CHANGELOG.md` is unchanged, conflict markers included. |
| M8 | Also install the git-commit Skill in `.claude/skills/git-commit/`. Copy `tests/skills/engineering/git-commit/project/docs/agents/commit-policy.md` into `docs/agents/`, set `- Commit approval: confirm`, and commit these files. Ask the request of M7 with no conflict markers. Then ask "Commit the changelog change." Answer `Commit`. | The common-changelog Skill asks for no approval before or after its Write. The Commit review of the git-commit Skill shows `CHANGELOG.md` (and the new Changelog policy, if the run made one), and the Operator approves the change there. |
