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

In the write job, use "When the write job makes a SKILL.md or entry-file text" for a file size that is more than the limit. In the edit job, use "When the edit job changes a SKILL.md or an entry file".

## When the write job makes a SKILL.md or entry-file text

Move text to reference files from a new `SKILL.md` and from new entry-file text. The agent reads a reference file only when a task makes it necessary. Before you write, plan the file layout. Before the self-check, write the reference files and their pointers. The file-size paragraph after the numbered list is tier 1. The other rules in this section that tell you to move text are tier 4. Do not move text from a Rule. If a new Rule makes the entry files more than a limit in "When you examine the file size", add a warning.

1. Move this text to a reference file:
   - Each template, each prompt in a code block, and each example of a full task, also when they are short.
   - Long policy text and long background text. You decide which text is long.
   - Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules.
2. Keep this text in its file, also when item 1 tells you to move it. The agent uses the steps, the terms, and the pointers in each task. A pointer to a section with only 1 or 2 rules makes the file almost no shorter. Move this text only when a file-size rule in this file or the user tells you to move it. This text is:
   - The numbered steps of the main task of a Skill, also under a heading that gives a condition.
   - The terms and the pointers.
   - Each section with only 1 or 2 rules.
3. Put a reference file of a Skill in `<skill>/references/<name>.md`, one level below the Skill folder. Put a reference file of an entry file in `docs/agents/<name>.md`. If the project keeps these files in a different folder, use that folder.
4. Write each file name in lowercase words with hyphens. The words give the subject of the file.
5. Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file.
6. Write one pointer sentence for each reference file, as "When you select a feature" tells you. The sentence gives the condition to read the file.

After you move the text, examine the file size. If the file is more than a limit in "When you examine the file size", move more sections that have a specified condition. Move the largest section first. When the file is not more than each limit, stop. If the file is still more than a limit, add a warning.

## When the edit job changes a SKILL.md or an entry file

Do not move text from a Rule. Items 2 and 3 in this section are tier 1. The other items that tell you to move text are tier 4.

1. Use each item of the numbered list in "When the write job makes a SKILL.md or entry-file text" only on the changed part. When you add a line to a section, the other lines of that section stay in their place. These lines are in an unchanged part. Text that you add to a reference file that the project has is in the changed part.
2. After you do item 1 of this section, examine the file size. If the file is more than a limit in "When you examine the file size", move sections from the unchanged parts:
   - Move only whole sections that have a specified condition. A whole section includes the sections under its heading.
   - Move the largest section first. When the file is not more than each limit, stop.
   - Select the reference file and its name as "When the write job makes a SKILL.md or entry-file text" tells you.
   - The heading of the section moves with the section. In its old place, write a heading that gives the condition. Under that heading, write the pointer sentence as "When you select a feature" tells you. Write no other text in the old place, also when a finding is about the moved section.
   - Do not change the text of a moved section. Its new pointer is in the changed part. Its text is not in the changed part.
   - Put each finding about the text of a moved section in a warning.
3. If the file is still more than a limit, add a warning.

## When you recommend text to move

This recommendation is applicable only to the unchanged parts in the edit job. It is applicable to entry files and Skills, also when the file size is less than the limit.

1. Find each section of an unchanged part that contains text that the numbered list in "When the write job makes a SKILL.md or entry-file text" tells you to move. Each section that you find is an extraction candidate: the whole section, not only the text to move. A section that contains only a pointer is not an extraction candidate. A section with only 1 or 2 rules is also not an extraction candidate. A section that you moved because of the file size is not an extraction candidate.
2. For each section, recommend a reference file and a pointer sentence that gives the condition.
3. Write each candidate in the Extraction candidates part of the report.
4. Move an extraction candidate only after the user gives approval.

## When the file is the glossary, MEMORY.md, or a Rule

- The glossary and `MEMORY.md` use the format that the project uses. Copy the format of the entries in the file. This skill has no template for the glossary or `MEMORY.md`. When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you.
- This skill has no template for Rules. Edit a Rule as you edit other Agent instructions.
- The STE rules and the plain-language checks are also applicable to these files. For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The Agent Skills specification is not applicable to a Rule.
