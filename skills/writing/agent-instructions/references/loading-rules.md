# Loading rules

This file gives the loading rules, which are tier 1, and the steps that use them. When a file does not obey a loading rule, one of 3 results occurs. A platform does not load the file, a check gives an error, or the platform does not read all of the file. The loading rules are applicable to each Agent instruction. They are not applicable to other files, for example `README.md` or `.claude/settings.json`. If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report.

## When you find the target platforms

When you find the target platforms, examine the project files for these signals:

| Signal | Target platforms |
|---|---|
| `CLAUDE.md` or `.claude/` | Claude Code |
| `AGENTS.md` or `.agents/` | Codex and OpenCode |
| `.opencode/` or `opencode.json` | OpenCode |

A folder is a signal also when it contains only `.gitkeep`. A request that gives one target platform agrees with the signals when the signals include that platform.

If you find no signal, or a signal does not agree with the request, speak to the user one time. Get the names of the target platforms from the user. The project selects its target platforms. Do not add a platform that is not a target platform of the project.

## When you select a feature

Write only features that Codex, OpenCode, and Claude Code all read. This rule is also applicable when Claude Code is the only target, because the project can add a target platform later.

- Do not write `@path`, `.claude/rules/`, frontmatter that only Claude Code reads, or `AGENTS.override.md`.
- You can write only one `@path` line: the `@AGENTS.md` line in `CLAUDE.md`.
- Write each pointer as a sentence that gives the file and the condition to read it.
- When the heading of a pointer gives the condition, also put the condition in the pointer sentence.
- Put a new pointer in a section whose heading gives its condition. If no heading gives the condition, add a heading. A topic heading, for example "Tests", gives no condition. This rule is also applicable to a pointer whose condition you change.

When the user tells you clearly to write a feature that only one platform reads, write it. This rule is also applicable to the items in the list above. Put an `@path` line in `CLAUDE.md` after the `@AGENTS.md` line. Then add a warning. The warning gives the platforms that do not read the feature and the alternative that all three platforms read. For an `@path` line in `CLAUDE.md`, the alternative is a pointer sentence in `AGENTS.md`. If `AGENTS.md` has a pointer to the same file, the alternative is a change to the condition of that pointer. When the user wants the file in each session, use the condition "At the start of each session". When two rules give a warning for the same feature, write one warning.

## When you write or edit an entry file

- When the write job has Claude Code and Codex or OpenCode as targets, put the text for all targets in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code.
- When there is one target platform, the entry file of that platform is the only entry file.
- If the layout gives no copy of the text to a target platform, add a warning.
- Put Rule text in `AGENTS.md` or `CLAUDE.md`. Do not put it in `.claude/rules/`.

## When you examine the file size

| File | Limit |
|---|---|
| Entry files | The entry files from the project root to the file have a total file size of less than 32 KiB. This total is the Codex limit. A file that an `@path` line imports is not in this total. Each entry file has less than 200 lines. These limits are applicable to all targets. |
| Skills | `SKILL.md` has a maximum of 20,000 bytes. Measure the bytes with the command after this table. 20,000 bytes are approximately 5,000 tokens. When Claude Code makes the context window smaller, it keeps only the first 5,000 tokens of a Skill. |
| The glossary, `MEMORY.md`, and `docs/agents/` files | No limit |

```sh
wc -c SKILL.md
```

In the write job, use "When the write job makes a SKILL.md or entry-file text" for a file size that is more than the limit. In the edit job, if the file size is more than the limit, add a warning with the recommended extraction.

## When the write job makes a SKILL.md or entry-file text

Move text to reference files from a new `SKILL.md` and from new entry-file text. The agent reads a reference file only when a task makes it necessary. Before you write, plan the file layout. Before the self-check, write the reference files and their pointers. The file-size paragraph after the numbered list is tier 1. The other rules in this section that tell you to move text are tier 4. Do not move text from a Rule. If a new Rule makes the entry file more than its limit, add a warning. Give the measured file size and the limit in the warning.

1. Move this text to a reference file:
   - Each template, each prompt in a code block, and each example of a full task, also when they are short.
   - Long policy text and long background text. You decide which text is long.
   - Each section that has a specified condition, for example "Before a release", and 3 or more rules.
2. Keep this text in its file:
   - The steps that the agent must do each time.
   - The terms and the pointers.
   - Each section with only 1 or 2 rules.
3. Put a reference file of a Skill in `<skill>/references/<name>.md`, one level below the Skill folder. Put a reference file of an entry file in `docs/agents/<name>.md`. If the project keeps these files in a different folder, use that folder.
4. Write each file name in lowercase words with hyphens. The words give the subject of the file.
5. Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file.
6. Write one pointer sentence for each reference file, as "When you select a feature" tells you. The sentence gives the condition to read the file.

After you move the text, examine the file size. If the file is more than its limit, move more sections that have a specified condition. Move the largest section first. When the file size is not more than the limit, stop. If the file is still more than its limit, add a warning with the measured file size and the limit.

In the Summary part of the report, give each text that you moved, its new file, and the reason.

## When you recommend text to move

This recommendation is applicable only in the edit job. It is applicable to entry files and Skills, also when the file size is less than the limit.

1. Find each section that has a specified condition, for example "before a release". A section that contains only a pointer is not a candidate. A section with only 1 or 2 rules is also not a candidate.
2. For each section, recommend a reference file and a pointer sentence that gives the condition.
3. Write each candidate in the Extraction candidates part of the report.
4. Move no text until the user gives approval.

## When the file is the glossary, MEMORY.md, or a Rule

- The glossary and `MEMORY.md` use the format that the project uses. Copy the format of the entries in the file. This skill has no template for the glossary or `MEMORY.md`. When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you.
- This skill has no template for Rules. Edit a Rule as you edit other Agent instructions.
- The STE rules and the plain-language checks are also applicable to these files. For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The Agent Skills specification is not applicable to a Rule.
