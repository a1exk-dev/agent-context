# Changelog

## Unreleased

### Changed

- Take the notes of a GitHub release from the `CHANGELOG.md` entry of its version, and let GitHub generate the notes when that entry is missing ([#151](https://github.com/a1exk-dev/agent-context/pull/151)) (Aliaksandr Katkou)
- Take the Git Flow rules of this repository from the `semver` Skill and `docs/agents/semver-policy.md`, and remove the Branches, Merging, and Back-merges lines from `AGENTS.md` ([#187](https://github.com/a1exk-dev/agent-context/pull/187)) (Aliaksandr Katkou)

### Added

- Add the `common-changelog` Skill, which creates `CHANGELOG.md` in the Common Changelog format, adds items and release entries, and reviews the file ([#151](https://github.com/a1exk-dev/agent-context/pull/151)) (Aliaksandr Katkou)
- Add the `semver` Skill, which picks and checks versions and starts and finishes Git Flow branches by the Semver policy of the project ([#187](https://github.com/a1exk-dev/agent-context/pull/187)) (Aliaksandr Katkou)
- Add `agents/openai.yaml` to each Skill, so that Codex shows its display name, short description, and default prompt, and make `bun run check` fail for a Skill without this file ([#241](https://github.com/a1exk-dev/agent-context/pull/241)) (Aliaksandr Katkou)
- Add the MIT License in `LICENSE`, and add a License section to `README.md` ([#242](https://github.com/a1exk-dev/agent-context/pull/242)) (Aliaksandr Katkou)

### Fixed

- Show the Commit review of the `git-commit` Skill in the text of the approval question, with one stat line for each staged file in place of the full diff ([#243](https://github.com/a1exk-dev/agent-context/pull/243)) (Aliaksandr Katkou)
- Make the main agent load the `git-commit` Skill and show the Commit review of a subagent word for word in the approval question, and show the default Commit policy in the text of its setup question ([#244](https://github.com/a1exk-dev/agent-context/pull/244)) (Aliaksandr Katkou)
- Ask for the Commit review of a `git-commit` merge before its commit step, find the commit before a revert, and add a caution before `gh pr merge` ([#245](https://github.com/a1exk-dev/agent-context/pull/245)) (Aliaksandr Katkou)
