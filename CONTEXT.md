# Context

## Skill

A folder `skills/<category>/<name>/` with a `SKILL.md`, installed with the `skills` CLI and listed on skills.sh. An agent loads it on demand. Everything the skill needs lives inside its own folder, because the CLI installs and tracks updates per folder.

## Rule

A short Markdown file `rules/<category>/<name>.md` whose text a project adds to `AGENTS.md` or `CLAUDE.md`, never to `.claude/rules/`. An agent loads it in every session, unlike a **Skill**. No installer exists yet.

## Category

A folder that groups **Skills** under `skills/` and **Rules** under `rules/`, one level deep. It is never a **Skill** itself.

## Agent instruction

A document whose reader is an agent, not the human operator. Every **Skill** and **Rule** is an Agent instruction, and so are `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `MEMORY.md`, and the files under `docs/agents/`. `README.md` is not, because the operator reads it.
