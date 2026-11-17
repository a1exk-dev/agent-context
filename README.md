# agent-context

Install these Skills and Rules in your project. Your agents can then use them with Codex, OpenCode, and Claude Code.

## Skills

A Skill is a folder with a `SKILL.md` file and the other files that the Skill uses. An agent loads a Skill only when a task needs it.

| Skill | Category | Job |
|---|---|---|
| [common-changelog](skills/engineering/common-changelog/SKILL.md) | engineering | Writes and reviews `CHANGELOG.md` in the Common Changelog format. |
| [git-commit](skills/engineering/git-commit/SKILL.md) | engineering | Stages the files of a task and writes the commit message. |
| [semver](skills/engineering/semver/SKILL.md) | engineering | Picks the next Semantic Versioning 2.0.0 version, and starts and finishes the Git Flow branches. |
| [agent-instructions](skills/writing/agent-instructions/SKILL.md) | writing | Writes and corrects the files that an agent reads as instructions, for example `SKILL.md`, `AGENTS.md`, and `CLAUDE.md`. |
| [human-communication](skills/writing/human-communication/SKILL.md) | writing | Writes clear text for a human reader. At setup, the Skill asks the Operator questions. Then the Skill adds a pointer to `AGENTS.md` or `CLAUDE.md`. |

The Operator is the person who controls the project and its agents.

## Install and update

Requires Node.js 22.20 or later. Run the commands in the root folder of your project. The `skills` CLI puts each Skill in `.agents/skills/<name>/`, and adds a link in `.claude/skills/` for Claude Code.

| Task | Command |
|---|---|
| Install all Skills | `npx skills add a1exk-dev/agent-context/skills --skill '*' -a codex -a opencode -a claude-code` |
| Install one Skill | `npx skills add a1exk-dev/agent-context/skills --skill git-commit -a codex -a opencode -a claude-code` |
| Install the Skills of one release | `npx skills add 'a1exk-dev/agent-context/skills#v0.3.0' --skill '*' -a codex -a opencode -a claude-code` |
| Look for updates | `npx skills check` |
| Install the updates | `npx skills update` |

Keep `/skills` in the source. Without `/skills`, the CLI also installs the third-party Skills that this repository uses for its own work.

Put quotes around a source with `#`, because some shells read `#` as the start of a comment. A Skill from a release stays on the tag of that release. `npx skills check` reports no update for that Skill.

## Rules

A Rule is a short Markdown file whose text an agent loads in each session. This repository has no Rule yet.

To use a Rule, copy the text of `rules/<category>/<name>.md` into the `AGENTS.md` or `CLAUDE.md` file of your project. No command installs a Rule.

## Contribute

To change this repository, read [CONTRIBUTING.md](CONTRIBUTING.md).

## Changelog

[CHANGELOG.md](CHANGELOG.md) gives the changes to the Skills and Rules.
