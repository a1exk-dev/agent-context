# Rules for a Skill

These rules come from the Agent Skills specification at https://agentskills.io/specification. Each rule starts with its tier.

## Before you use this file

Obey the rules of this file only for a Skill that you write or edit. These rules are not applicable to other files with frontmatter, for example subagent definitions. If `SKILL.md` of this skill is not in your context window, read it before you use this file. `SKILL.md` defines the terms, the tiers, and the end-of-run report.

## When you write the folder and the frontmatter

Select the folder first, as the section "When you select the folder for the Skill" tells you.

A Manual-only Skill is a Skill that an agent loads only when the user calls the Skill by name. OpenCode 2 is version 2 of OpenCode.

- Tier 1: Put a `SKILL.md` file in the folder of each Skill. Start the file with YAML frontmatter. Put the Markdown text after the frontmatter. (script check)
- Tier 1: Give `name` 1 to 64 characters: lowercase letters, digits, and hyphens. Put no hyphen at the start or at the end, and no `--`. Use the folder name. If the user gives a name that does not obey this rule, correct the name. Give the change in the Summary part. (script check)
- Tier 1: Give `description` 1 to 1024 characters. (script check)
- Tier 1: In the frontmatter, write no top-level field other than `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Exception: in a Manual-only Skill, also write `disable-model-invocation: true`. (script check)
- Tier 1: Give `compatibility` a maximum of 500 characters. Write each key and each value in `metadata` as text. (script check)
- Tier 1: Write frontmatter that the YAML parser reads with no errors. Put a value that contains `: ` in quotation marks. You can also start the value on the next line after `|` or `>`. (script check)
- Tier 1: Write only `name` and `description` in the frontmatter. Only these two fields operate on Codex, OpenCode, and Claude Code. A field that is not in the list of permitted fields, for example `disable-model-invocation`, also gives an error in `skills-ref validate`. Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it. (script check)
- Tier 1: When the user tells you clearly to write `license`, `compatibility`, `metadata`, or `allowed-tools`, write it. Then add a warning that gives the platforms that do not read the field. (advisory)
- Tier 1: If the user tells you to write a field that is not permitted, do not write it. Add a warning that gives the field and the error. (advisory)
- Tier 4: Write `description` as one line in quotation marks. Some checks read only the first line of a value. In the value, write `\"` for each double quotation mark. (advisory)

## When you write or edit a Skill: the agents/openai.yaml file

Codex reads the file `<name>/agents/openai.yaml`, where `<name>` is the folder of the Skill. Codex shows the values of `display_name` and `short_description` in its list of Skills, and obeys the value of `allow_implicit_invocation`. Claude Code and OpenCode do not read the file, and the file does not change how they load the Skill. The rules in this section come from the Codex documentation, not from the Agent Skills specification. The tier 1 rule is a loading rule of Codex. The tier 4 rules are recommendations of Codex. This example shows the form of the file for a Skill with the name `git-commit`:

```yaml
interface:
  display_name: "Git Commit"
  short_description: "Stage the files of a task and write the commit message"
  default_prompt: "Use $git-commit to commit my changes."
policy:
  allow_implicit_invocation: true
```

- Tier 4: In the write job, write `agents/openai.yaml` for each Skill that you write. (script check)
- Tier 4: In the edit job, when the Skill has no `agents/openai.yaml` and is not a Manual-only Skill, do not write the file. Add a warning that recommends the file. In the warning, give the full text of the file. The check script also reports the missing file. Reject that script finding. Give this warning as the cause of the rejection. (advisory)
- Tier 1: In the edit job, when a Manual-only Skill has no `agents/openai.yaml`, write the file, because Codex does not read `disable-model-invocation`. (script check)
- Tier 1: In a Manual-only Skill, write `allow_implicit_invocation: false` under `policy:`, because Codex does not read `disable-model-invocation` in the frontmatter. In each other Skill, write `allow_implicit_invocation: true`. (script check)
- Tier 4: Write `display_name`, `short_description`, and `default_prompt` under `interface:`. Write no other field under `interface:`. (advisory)
- Tier 4: Put each value that is not `true` or `false` in double quotation marks. Do not put a key in quotation marks. (advisory)
- Tier 4: Give `short_description` 25 to 64 characters. (advisory)
- Tier 4: Write `default_prompt` as one short sentence that asks for a task. In this sentence, write the name of the Skill as `$<name>`. (advisory)

## When you write the description

An agent reads the description to know when to load the Skill. When the user gives text for the description, keep its meaning and write it by these rules.

- Tier 1: Write the condition first: "When ..., use this skill." Do not write "Use this skill when ...". (script check)
- Tier 4: Include a minimum of one user phrase in quotation marks, for example "draft a skill". The YAML quotation marks around the value do not show a user phrase. A code span also does not show a user phrase. The word rules are not applicable to quoted text, and it counts as 1 word. (advisory)
- Tier 4: Write each condition where the Skill is applicable. Include conditions where the user does not tell the subject of the task. An example is "the agent keeps ignoring ...". Do not write a condition where the Skill is not applicable. (advisory)
- Tier 4: Give the files and folders that make the Skill applicable, for example the files that its tasks change. (advisory)
- Tier 4: Tell the agent not to use the Skill for tasks that look almost the same as Skill tasks. (advisory)

## When you write the body

The specification gives no structure for the body.

- Tier 4: Write less than 500 lines in `SKILL.md`. (script check)
- Tier 4: Move long text to files in the Skill folder or in a folder directly in it. For each file, tell when to read it. (advisory)
- Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)
- Tier 4: Write no "Gotchas" section. Put each known problem in the section of the condition where the problem occurs. Put it next to the step that the problem makes incorrect. (advisory)

## When the Skill has a script

Tier 4: Write each script so that it operates without input from a person while it runs. Give it `--help`, clear error messages, and structured output. Use specified versions of the packages that it uses. (advisory)

## When you select the folder for the Skill

Each platform loads Skills from these folders. When the target platforms include Claude Code and Codex, no single folder is applicable to all target platforms. Before you select the folder, find the target platforms as `loading-rules.md` tells you. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. A Skills folder of the project is a folder from this table that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill. (advisory)

| Platform | Folder |
|---|---|
| Claude Code | `.claude/skills/` |
| Codex | `.agents/skills/` |
| OpenCode | `.opencode/skills/`, `.claude/skills/`, and `.agents/skills/` |
