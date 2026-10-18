# agent-context

This repository gives Skills and Rules to other projects. Agents in these projects use the Skills and Rules with Codex, OpenCode, and Claude Code.

## Language

**Skill**:
A Skill is a folder `skills/<category>/<name>/` that contains a `SKILL.md` file and all other files that the Skill uses. An agent loads a Skill only when a task makes it necessary.
_Avoid_: plugin, skill package

**Rule**:
A Rule is a short Markdown file `rules/<category>/<name>.md` whose text a project adds to `AGENTS.md` or `CLAUDE.md`, not to `.claude/rules/`. An agent loads that text in each session.
_Avoid_: rule file

**Category**:
A Category is a folder, one level deep, that contains Skills under `skills/` or Rules under `rules/`. A Category is never a Skill.

**Agent instruction**:
An Agent instruction is a file that an agent reads as instructions. Examples are a Skill, a Rule, `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `MEMORY.md`, and the files in `docs/agents/`. A file for persons, for example `README.md`, is not an Agent instruction.
_Avoid_: prompt file, instruction file
