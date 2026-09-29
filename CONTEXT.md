# Context

## Skill

A folder `skills/<category>/<name>/` with a `SKILL.md`, installed with the `skills` CLI and listed on skills.sh. An agent loads it on demand. Everything the skill needs lives inside its own folder, because the CLI installs and tracks updates per folder.

## Rule

A short Markdown file `rules/<category>/<name>.md` that a project adds to `AGENTS.md` or `.claude/rules/`. An agent loads it in every session, unlike a **Skill**. No installer exists yet.

## Category

A folder that groups **Skills** under `skills/` and **Rules** under `rules/`, one level deep. It is never a **Skill** itself.
