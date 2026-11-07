# Changelog

## Unreleased

### Changed

- Take the GitHub release notes from the `CHANGELOG.md` entry of the version, and use generated notes when that entry is missing ([#151](https://github.com/a1exk-dev/agent-context/pull/151)) (Aliaksandr Katkou)
- Take the Git Flow rules of this repository from the `semver` Skill and `docs/agents/semver-policy.md`, and remove the Branches, Merging, and Back-merges lines from `AGENTS.md` ([#187](https://github.com/a1exk-dev/agent-context/pull/187)) (Aliaksandr Katkou)

### Added

- Add the `common-changelog` Skill, which creates, writes, and reviews `CHANGELOG.md` in the Common Changelog format ([#151](https://github.com/a1exk-dev/agent-context/pull/151)) (Aliaksandr Katkou)
- Add the `semver` Skill, which picks and checks versions by Semantic Versioning 2.0.0 and starts and finishes Git Flow branches by the Semver policy of the project ([#187](https://github.com/a1exk-dev/agent-context/pull/187)) (Aliaksandr Katkou)
