# Loading rules

This file gives the loading rules, which are tier 1, and the steps that use them. The loading rules are applicable to each Agent instruction. They are not applicable to other files, for example `README.md` or `.claude/settings.json`.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you find the target platforms

Examine the project files for these signals:

| Signal | Target platforms |
|---|---|
| `CLAUDE.md` or `.claude/` | Claude Code |
| `AGENTS.md` or `.agents/` | Codex and OpenCode |
| `.opencode/` or `opencode.json` | OpenCode |

A folder is a signal also when it contains only `.gitkeep`. A request that gives one target platform agrees with the signals when the signals give that platform.

If you find no signal, or a signal does not agree with the request, ask the user one question. Get the names of the target platforms from the user. The project selects its target platforms. Do not add a platform that is not a target platform of the project.

## When you select a feature

Write only features that Codex, OpenCode, and Claude Code all read. This rule is also applicable when Claude Code is the only target platform. The project can add a target platform later.

- Do not write `@path` lines, except the `@AGENTS.md` line in `CLAUDE.md`.
- Do not make a new file in `.claude/rules/`, a new `AGENTS.override.md`, or frontmatter that only Claude Code reads. In the edit job, you can edit a file of this type that the project has.

When the user tells you clearly to write a feature that only one platform reads, write it. Then obey the rules in the list below. This rule is also applicable to the items in the list above. This rule is not applicable to the text of a Rule, because other projects add that text. These projects can use each of the three platforms.

- If that feature is an `@path` line, put it in `CLAUDE.md` after the `@AGENTS.md` line.
- Add a warning. The warning gives the platforms that do not read the feature and the alternative that all three platforms read.
- In the warning for an `@path` line in `CLAUDE.md`, give a pointer in `AGENTS.md` as the alternative. If `AGENTS.md` has a pointer to the same file, give a new condition for that pointer as the alternative.
- When the user tells you to load the pointer target in each session, give the alternative pointer the condition "At the start of each session".
- When two rules give a warning for the same feature, write one warning.

## When you write or edit an entry file

- When Claude Code and one or more of Codex and OpenCode are target platforms, put the shared text in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code.
- When there is one target platform, write only the entry file of that platform. The entry file itself is not a feature. The rules in "When you select a feature" are applicable to the text of the entry file.
- If a target platform does not load the text that you put in the entry files, add a warning.
- When Claude Code is the only target platform, put the text of a Rule in `CLAUDE.md`. If Claude Code is not the only target platform, put the text of a Rule in `AGENTS.md`.
- Do not put the text of a Rule in `.claude/rules/`, also when the user tells you to put it there. Only Claude Code reads `.claude/rules/`.

## When you examine the file size

| File | Limit |
|---|---|
| Entry files | The entry files from the top folder of the project to the entry file that you examine are one group. The total file size of this group is less than 32 KiB. This total is the Codex limit. A file that an `@path` line loads is not in this total. Each entry file has less than 200 lines. These limits are applicable to all target platforms. |
| Skills | `SKILL.md` has a maximum of 20,000 bytes. 20,000 bytes are approximately 5,000 tokens. When Claude Code makes the context window smaller, it keeps only the first 5,000 tokens of a Skill. |
| The glossary, `MEMORY.md`, and `docs/agents/` files | These files have no limit. |

To measure the file size of `SKILL.md`, run this command:

```sh
wc -c SKILL.md
```

## When the write job makes a SKILL.md or entry-file text

Move text to reference files from a new `SKILL.md` and from new entry-file text. The agent reads a reference file only when a task makes it necessary. Obey these rules:

- Before you write, plan the file layout.
- Before the self-check, write the reference files and their pointers.
- Do not move text from a Rule. A project adds only the text of the Rule to an entry file.
- If a new Rule makes the file size of the entry files more than a limit, add a warning. "When you examine the file size" gives the limits.

The rule "Do not move text from a Rule" and the steps in "After you move the text in the write job" are tier 1. The other rules in this section that tell you to move text are tier 4.

1. Move this text to a reference file:
   - Each template, each prompt in a code block, and each example of a full task, also when they are short.
   - Long policy text and long background text.
   - Each section that has a specified condition and 3 or more rules.

   Decide which text is long, because no word count is correct for all files.

   Use the rules in this paragraph for a section with a specified condition. Move this type of section also when the condition can occur at each step. The agent then reads the rules of that section only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules.
2. Keep the text in the list below in its file, also when item 1 tells you to move it. The agent uses the steps, the terms, and the pointers in each task. A pointer to a section with only 1 or 2 rules makes the file almost no shorter. When a file-size rule in this file or the user tells you to move this text, move it. This text is:
   - The numbered steps of the main task of a Skill, also under a heading that gives a condition.
   - The terms and the pointers.
   - Each section with only 1 or 2 rules.
3. Put a reference file of a Skill in `<skill>/references/<name>.md`, one level below the Skill folder. Put a reference file of an entry file in `docs/agents/<name>.md`. If the project keeps these files in a different folder, use that folder.
4. Write each file name in words of small letters, with hyphens between the words. The words give the topic of the file.
5. Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file.
6. Write one pointer for each reference file, as "When you write a pointer" tells you. The pointer gives the condition to read the file.

### After you move the text in the write job

1. Examine the file size.
2. If the file size is more than a limit in "When you examine the file size", select the largest section that has a specified condition. Do not select a section that contains only a pointer. Do not select a section that contains the text of a Rule. Select the reference file and its name as items 3 to 5 of "When the write job makes a SKILL.md or entry-file text" tell you. Move that section to that file. In the old place of the section, write a heading that gives the condition. Under that heading, write the pointer as "When you write a pointer" tells you.
3. When the file size is not more than each limit, stop. If the file contains a section that step 2 can select, do step 2 again.
4. If the file size is still more than a limit and step 2 can select no section, add a warning.

## When the edit job changes a SKILL.md or an entry file

Do not move text from a Rule. A project adds only the text of the Rule to an entry file. The rule "Do not move text from a Rule" is tier 1. Items 2 and 3 in this section are tier 1. The other items that tell you to move text are tier 4.

1. Use each item of the numbered list in "When the write job makes a SKILL.md or entry-file text" only on the changed part. When you add a line to a section, the other lines of that section stay in their place. These lines are in an unchanged part. The text that you add to a reference file that the project has is in the changed part.
2. After you do item 1 of this section, examine the file size. If the file size is more than a limit in "When you examine the file size", do these steps:
   1. Select the largest complete section of the unchanged parts that has a specified condition. Do not select a section that contains only a pointer. Do not select a section that contains the text of a Rule. A complete section contains the sections under its heading.
   2. Select the reference file and its name as items 3 to 5 of "When the write job makes a SKILL.md or entry-file text" tell you.
   3. Move the section and its heading to that file. Do not change the text of the section.
   4. In the old place, write a heading that gives the condition. Under that heading, write only the pointer as "When you write a pointer" tells you. Write no other text in the old place, also when a finding is about the moved section.
   5. When the file size is not more than each limit, stop. If the unchanged parts contain a complete section that step 1 can select, do step 1 again. If step 1 can select no complete section, go to item 3.

   The new pointer of a moved section is in the changed part. Put each finding about the text of a moved section in a warning.
3. If the file size is still more than a limit, add a warning.

## When you recommend text to move

This section is applicable only to the unchanged parts in the edit job. This section is applicable to entry files and `SKILL.md` files, also when the file size is less than the limit.

1. Find each section of an unchanged part that contains text that the numbered list in "When the write job makes a SKILL.md or entry-file text" tells you to move. Each section that you find is an extraction candidate: the complete section, not only the text to move. A section that contains only a pointer is not an extraction candidate. A section with only 1 or 2 rules is also not an extraction candidate. A section that you moved because of the file size is not an extraction candidate. A section that contains the text of a Rule is also not an extraction candidate.
2. For each extraction candidate, recommend a reference file and a pointer that gives the condition.
3. Write each extraction candidate in the Extraction candidates part of the end-of-run report.
4. After the user approves the extraction candidate, move it.

## When the file is the glossary, MEMORY.md, or a Rule

- Write a Rule without a template. This skill has no template for Rules.
- For a Rule, use the file-size limit of the entry file that contains its text. When no entry file contains the text of the Rule, use the limits for entry files on the Rule.

## When you write a pointer

- Write each pointer as a sentence that gives the file and the condition to read the file.
- When the heading of a pointer gives the condition, also put the condition in the pointer.
- Put a new pointer in a section whose heading gives the condition of the pointer. If no heading gives the condition, add a heading. A topic heading, for example "Tests", gives no condition. This rule is also applicable to a pointer whose condition you change. This rule is not applicable to a pointer in a numbered step of the main task of a Skill. The step gives the condition.
