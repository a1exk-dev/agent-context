# Rules for a Skill

These rules come from the Agent Skills specification at https://agentskills.io/specification. Apply them to each Skill that you write or edit. Each rule starts with its tier.

## When you write the folder and the frontmatter

- Tier 1: A Skill is a folder with a `SKILL.md` file. The file starts with YAML frontmatter, and Markdown text comes after it.
- Tier 1: `name` has 1 to 64 characters: lowercase letters, digits, and hyphens. It has no hyphen at the start or at the end, and no `--`. It is the same as the folder name.
- Tier 1: `description` has 1 to 1024 characters.
- Tier 1: The frontmatter has no top-level field other than `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. `compatibility` has a maximum of 500 characters. `metadata` is a map of strings to strings.
- Tier 1: The YAML is strict. Put a value that contains `: ` in quotes, or write it as a block scalar.
- Tier 1: Write only `name` and `description` in the frontmatter. Only these two fields operate on Codex, OpenCode, and Claude Code. Other fields, for example `disable-model-invocation`, also fail `skills-ref validate`.
- Tier 4: Write `description` as one line in quotes. Some checks read only the first line of a value.

## When you write the description

An agent reads the description to decide when to load the Skill.

- Tier 2: Write the condition first: "When ..., use this skill." Do not write "Use this skill when ...".
- Tier 2: Write the description by the STE rules.
- Tier 2: Include at least one user phrase in quotes, for example "draft a skill". The outer YAML quotes and code spans do not mark a user phrase. Quoted text is exempt from the word rules and counts as 1 word.
- Tier 4: List each real context, also contexts where the user does not name the domain. An example is "the agent keeps ignoring ...". Claim no context that is not real.
- Tier 4: Name the files and folders that make the Skill applicable.
- Tier 4: Keep out the near-misses. A near-miss is a task that looks similar but is for a different tool or reader.

## When you write the body

- Tier 4: `SKILL.md` has less than 500 lines and approximately 5,000 tokens.
- Tier 4: Move detail to files one level below `SKILL.md`. For each file, say when to read it.
- Tier 4: Add only what the agent does not know. Give a default, not a list of options. Make a step as strict as its risk of failure.
- Tier 4: Write no "Gotchas" section. Put each known problem under the heading of the situation that it affects, next to the step that it breaks.

## When the Skill has a script

Tier 4: A script asks no interactive questions. It gives `--help`, clear error messages, and structured output. It uses fixed versions of the packages that it needs.

## When you select the folder for the Skill

Each platform loads Skills from these folders. When the targets include Claude Code and Codex, no single folder serves all targets. Then put a new Skill in the folder that the project already uses for Skills. Add a warning that names the target platform that does not load the Skill.

| Platform | Folder |
|---|---|
| Claude Code | `.claude/skills/` |
| Codex | `.agents/skills/` |
| OpenCode | `.claude/skills/` and `.agents/skills/` |
