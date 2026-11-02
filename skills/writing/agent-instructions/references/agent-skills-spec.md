# When you write or edit a Skill

These rules are from the Agent Skills specification at https://agentskills.io/specification. Some rules are from the platform loading rules or from the STE rules. The rules in this file are not applicable to other files with frontmatter. An example is a subagent definition. Each rule starts with its tier.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you select the folder for the Skill

- Tier 1: When the glossary or a project file gives the folder for new Skills, use that folder. The project selects the folder of its Skills. Do not obey the other rules in this section.

Each platform loads Skills from the folders in this table:

| Platform | Folder |
|---|---|
| Claude Code | `.claude/skills/` |
| Codex | `.agents/skills/` |
| OpenCode | `.opencode/skills/`, `.claude/skills/`, and `.agents/skills/` |

When Claude Code and Codex are target platforms, no folder is applicable to all target platforms.

When the project has a folder from the table, that folder is a folder for Skills of the project. A `.claude/` folder without a `skills/` folder is not a folder for Skills.

### When Claude Code and Codex are target platforms

- Tier 1: If the project has one folder for Skills, use that folder.
- Tier 1: If the number of folders for Skills in the project is not 1, ask the user one question. The question asks which folder to use.
- Tier 1: Add a warning for each Skill. The warning gives each platform from the table that does not load the Skill. Give these platforms also when they are not target platforms, because the project can add a target platform later.

### When Claude Code and Codex are not both target platforms

- Tier 1: Use a folder that each target platform loads. The table gives these folders. If only one of these folders is applicable, use that folder. If 2 or more of these folders are applicable, find which of them the project has. If the project has one of them, use that folder. The other Skills of the project are in that folder. If the project has none of them or 2 or more of them, ask the user one question. The question asks which folder to use.
- Tier 1: Add a warning for each Skill. The warning gives each platform from the table that does not load the Skill. Give these platforms also when they are not target platforms, because the project can add a target platform later.

## When you make the folder and write the frontmatter

A Skill is a folder that contains a `SKILL.md` file and all other files that the Skill uses. The file starts with YAML frontmatter, and Markdown text follows the frontmatter.

- Tier 1: Write a `name` of 1 to 64 characters: small letters (a to z), digits, and hyphens. Do not put a hyphen at the start or at the end of the `name`. Do not write `--`. Make the `name` the same as the folder name. If the user gives a name that does not obey this rule, correct the name. Give the change in the Summary part.
- Tier 1: Write a `description` of 1 to 1024 characters.
- Tier 1: Write the frontmatter with no YAML errors. Put a value that contains `: ` in quotation marks. For a value other than `description`, you can also start the value on the next line after `|` or `>`.
- Tier 1: Write only `name` and `description` in the frontmatter. Only these two fields operate on Codex, OpenCode, and Claude Code. The permitted top-level fields are `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. A different field, for example `disable-model-invocation`, gives an error in `skills-ref validate`.
- Tier 1: When the user tells you clearly to write `license`, `compatibility`, `metadata`, or `allowed-tools`, write that field. Write a maximum of 500 characters in `compatibility`. In `metadata`, write each value and the name of each value as text. Then add a warning. In the warning, give the platforms that do not read the field. Also give the alternative that all three platforms read.
- Tier 1: If the user tells you to write a field that is not permitted, do not write that field. This rule replaces the rule in "When you select a feature" in `loading-rules.md` for a field that is not permitted. This rule is also applicable when only one platform reads that field. Add a warning that gives the field and the error.
- Tier 4: Write `description` as one line in quotation marks. Some scripts read only the first line of a value. In the value, write `\"` for each double quotation mark.

## When you write the description

An agent reads the description to know when to load the Skill.

- Tier 2: When the description gives an instruction, for example "use this skill", write a maximum of 20 words in each sentence. The description is then procedural text.
- Tier 4: When the user gives text for the description, keep the meaning of that text.
- Tier 2: Write the condition first: "When ..., use this skill." Do not write "Use this skill when ...". STE rule 5.4 tells you to put the condition at the start of the sentence.
- Tier 4: Include a minimum of one user phrase in quotation marks, for example "draft a skill". The agent can then match the words of a user request to the Skill. The YAML quotation marks around the value do not show a user phrase. A code span also does not show a user phrase. The word rules are not applicable to quoted text, and each quoted text counts as 1 word.
- Tier 4: Write each condition in which the Skill is applicable. Include conditions in which the user does not give the topic of the task. An example is "the agent keeps ignoring ...". Do not tell the agent to use the Skill in a condition in which the Skill is not applicable.
- Tier 4: Give the files and the folders that make the Skill applicable. An example is a file that a task of the Skill changes.
- Tier 4: Tell the agent not to use the Skill for tasks that are almost the same as Skill tasks.

## When you write the body

The specification gives no structure for the body.

- Tier 4: Keep `SKILL.md` at less than 500 lines.
- Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. An agent that reads a list of alternatives must select one of them. When a step has a high risk of an error, give that step more limits.
- Tier 4: Write no "Gotchas" section. A problem next to its step is in the text that the agent reads for that step. Put each known problem in the section whose heading gives the condition in which the problem occurs. Put the text about the problem next to the step that the problem makes incorrect.

### When SKILL.md has 500 lines or more

- Tier 4: If `SKILL.md` has 500 lines or more, move text as `loading-rules.md` tells you. In the write job, use "When the write job makes a SKILL.md or entry-file text". In the edit job, use "When the edit job changes a SKILL.md or an entry file". In these sections, the limit of less than 500 lines is also a limit of "When you examine the file size".

## When the Skill has a script

- Tier 4: Write a script that operates without input from a person while it runs. The agent that runs the script cannot answer a question from the script.
- Tier 4: Give the script `--help`, clear error messages, and structured output.
- Tier 4: In the script, use specified versions of the packages that the script uses. Then the script gives the same result in each project and each time that it runs.
