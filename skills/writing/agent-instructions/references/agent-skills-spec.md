# Rules for a Skill

These rules come from the Agent Skills specification at https://agentskills.io/specification. Obey them only for a Skill that you write or edit. They are not applicable to other files with frontmatter, for example subagent definitions. Each rule starts with its tier. If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report.

## When you write the folder and the frontmatter

Select the folder first, as the section "When you select the folder for the Skill" tells you.

- Tier 1: A Skill is a folder with a `SKILL.md` file. The file starts with YAML frontmatter, and Markdown text comes after it. (blocking)
- Tier 1: `name` has 1 to 64 characters: lowercase letters, digits, and hyphens. It has no hyphen at the start or at the end, and no `--`. It is the same as the folder name. If the user gives a name that does not obey this rule, correct the name. Give the change in the Summary part. (script check)
- Tier 1: `description` has 1 to 1024 characters. (script check)
- Tier 1: The frontmatter has no top-level field other than `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. (script check)
- Tier 1: `compatibility` has a maximum of 500 characters. Each key and each value in `metadata` is text. (blocking)
- Tier 1: The YAML parser accepts no errors. Put a value that contains `: ` in quotation marks. You can also start the value on the next line after `|` or `>`. (blocking)
- Tier 1: Write only `name` and `description` in the frontmatter. Only these two fields operate on Codex, OpenCode, and Claude Code. A field that is not in the list of permitted fields, for example `disable-model-invocation`, also gives an error in `skills-ref validate`. (blocking)
- Tier 1: When the user tells you clearly to write `license`, `compatibility`, `metadata`, or `allowed-tools`, write it. Then add a warning that gives the platforms that do not read the field. (advisory)
- Tier 1: If the user tells you to write a field that is not permitted, do not write it. Add a warning that gives the field and the error. (advisory)
- Tier 4: Write `description` as one line in quotation marks. Some checks read only the first line of a value. In the value, write `\"` for each double quotation mark. (advisory)

## When you write the description

An agent reads the description to know when to load the Skill. When the user gives text for the description, keep its meaning and write it by these rules.

- Tier 1: Write the condition first: "When ..., use this skill." Do not write "Use this skill when ...". (blocking)
- Tier 4: Include a minimum of one user phrase in quotation marks, for example "draft a skill". The YAML quotation marks around the value do not show a user phrase. A code span also does not show a user phrase. The word rules are not applicable to quoted text, and it counts as 1 word. (advisory)
- Tier 4: Write each condition where the Skill is applicable. Include conditions where the user does not tell the subject of the task. An example is "the agent keeps ignoring ...". Do not write a condition where the Skill is not applicable. (advisory)
- Tier 4: Give the files and folders that make the Skill applicable, for example the files that its tasks change. (advisory)
- Tier 4: Tell the agent not to use the Skill for tasks that look almost the same as Skill tasks. (advisory)

## When you write the body

The specification gives no structure for the body.

- Tier 4: `SKILL.md` has less than 500 lines. (script check)
- Tier 4: Move long text to files in the Skill folder or in a folder directly in it. For each file, tell when to read it. (advisory)
- Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)
- Tier 4: Write no "Gotchas" section. Put each known problem in the section of the condition where the problem occurs. Put it next to the step that the problem makes incorrect. (advisory)

## When the Skill has a script

Tier 4: A script operates without input from a person while it runs. It gives `--help`, clear error messages, and structured output. It uses specified versions of the packages that it uses. (advisory)

## When you select the folder for the Skill

Each platform loads Skills from these folders. When the target platforms include Claude Code and Codex, no single folder is applicable to all target platforms. Before you select the folder, find the target platforms as `loading-rules.md` tells you. Tier 1: When the target platforms include Claude Code and Codex, use the Skill folder of the project. A Skill folder of the project is a folder from this table that the project has. A `.claude/` folder without a `skills/` folder is not a Skill folder. If the project has two of these folders or none, speak to the user one time. For each Skill in these target platforms, add a warning that gives the platform that does not load it. (advisory)

| Platform | Folder |
|---|---|
| Claude Code | `.claude/skills/` |
| Codex | `.agents/skills/` |
| OpenCode | `.opencode/skills/`, `.claude/skills/`, and `.agents/skills/` |
