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

For a new `SKILL.md` or new entry-file text in the write job, do step 7 of "When you write a new SKILL.md or new entry-file text". For other files, if the file size is more than the limit, add a warning. The warning gives the measured file size, the limit, the text to move, and the recommended reference file.

## When you write a new SKILL.md or new entry-file text

These steps are applicable only in the write job. They are not applicable to Rules. Steps 1 to 6 are tier 4. Step 7 is tier 1, because a platform does not read all of a file that is more than its limit.

1. Before you write the files, select the text for each file.
2. Move this text to reference files, because the agent reads a reference file only when its condition occurs:
   - Each template and each prompt in a code block, at any size.
   - Each example that shows the full result of a task, at any size.
   - Long descriptive text, for example the causes of rules or the history of a decision. Select which text is long.
   - Each section outside the main procedure that has a specified condition and 3 or more rules. Examples are "Before a release" and "When a step gives an error". Count each instruction as one rule, also when one bullet gives 2 or more instructions.
3. Keep this text in the `SKILL.md` file or in the entry file:
   - The steps of the main procedure, also when their section heading gives a condition, for example "After the pull request merges".
   - The terms.
   - The pointers.
   - Each section with only 1 or 2 rules.
4. Select the folder and the name of each reference file as this list tells you:
   - For a Skill, use `references/` in the Skill folder. Make no folder in `references/`.
   - For an entry file, use `docs/agents/`. If the project has a different folder for these files, use that folder.
   - Write the file name in small letters, with hyphens between the words. Use a name that gives the topic of the file, for example `release-checks.md`.
5. Make one reference file for each condition. Put the text that the agent reads in the same condition in one file. If a reference file with the same condition exists, add the text to that file.
6. For each reference file, write one pointer sentence that gives the file and the condition. Obey "When you select a feature" for each pointer. Write each reference file and its pointer before the self-check.
7. After step 6, measure the file size as "When you examine the file size" tells you. If the file size is more than its limit, move more sections that have a specified condition. Also move sections with only 1 or 2 rules. Move the largest section first, because then fewer sections and pointers are necessary. When the file obeys the limit, stop. If you cannot make the file obey the limit, add a warning with the measured file size and the limit.

Use each extraction candidate of the loading reviewer as a finding. A finding can also tell you that you moved text that must stay. Correct your text for each of these findings, or reject the finding as `review.md` tells you.

## When you recommend text to move

This recommendation is applicable to entry files and Skills in the edit job, also when the file size is less than the limit.

1. Find each section that has a specified condition, for example "before a release". A section that contains only a pointer is not a candidate. A section with only 1 or 2 rules is also not a candidate.
2. For each section, recommend a reference file and a pointer sentence that gives the condition.
3. Write each candidate in the Extraction candidates part of the report.
4. Move no text until the user gives approval.

## When the file is the glossary, MEMORY.md, or a Rule

- The glossary and `MEMORY.md` use the format that the project uses. Copy the format of the entries in the file. This skill has no template for the glossary or `MEMORY.md`. When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you.
- This skill has no template for Rules. Edit a Rule as you edit other Agent instructions.
- The STE rules and the plain-language checks are also applicable to these files. For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The Agent Skills specification is not applicable to a Rule.
