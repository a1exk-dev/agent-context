Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none in "When you examine the file size" of loading-rules.md for a reference file of a Skill. The 20,000-byte limit is for `SKILL.md` only.

Text to move in the sections under review:
- none. "When you recommend text to move" is applicable to entry files and Skills. loading-rules.md is a reference file. It has no template, no prompt in a code block, and no example of a full task.

Moved text that does not obey loading-rules.md:
- none. The Changes line gives "all" and no moved section.

Pointer list of loading-rules.md: the condition of each sentence
- Line 3, "They are not applicable to other files, for example `README.md` or `.claude/settings.json`.": not a pointer. The paths are examples of files outside the scope.
- Line 7, "If `SKILL.md` of this skill is not in your context window, read it before you use this file.": pointer. The heading "Before you use this file" and the sentence give the condition.
- Line 7, "`SKILL.md` defines the terms, the tiers, and the end-of-run report.": not a pointer. It gives the cause of the pointer before it.
- Lines 15, 16, 17 (table cells of signals): not pointers. They give the files that are signals.
- Line 27, "Do not write `.claude/rules/`, frontmatter that only Claude Code reads, or `AGENTS.override.md`.": not a pointer.
- Line 28, "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`.": pointer. The sentence gives the condition. The target section exists.
- Line 29 and the 3 sentences of line 31: not pointers. They tell where to write a line or a pointer.
- Lines 35, 38, 45, 46, 56: not pointers.
- Line 69, "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you.": pointer. The step "Write one pointer for each reference file" and the heading "When the write job makes a SKILL.md or entry-file text" give the condition. The target section exists.
- Line 82, "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you.": pointer. The step "write the pointer" in the old place of a moved section and the heading "When the edit job changes a SKILL.md or an entry file" give the condition. The target section exists.
- Line 98, "For the glossary and `MEMORY.md`, use the format that the project uses." and "This skill has no template for the glossary or `MEMORY.md`.": not pointers.
- Line 98, "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you.": pointer. The sentence gives the condition.

Pointers that name no file:
- none.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 11 writes again the condition of the heading "When you find the target platforms" on line 9, and the sentence is not a pointer.
- Correction: "Examine the project files for these signals:"

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory) The rule is not usual for the agent. (advisory) To obey the rule, the agent must make a decision. (advisory)"
- Text: "Do not move text from a Rule."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 56 and 75 tell the agent not to move text from a Rule, which is not usual for the agent, but no file tells why this rule is necessary.
- Correction: "Do not move text from a Rule, because a project adds the text of a Rule to an entry file, and the extraction recommendation of that entry file is applicable to that text."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "After you move the text, examine the file size. If the file is more than a limit in "When you examine the file size", move more sections that have a specified condition. Move the largest section first. When the file is not more than each limit, stop. If the file is still more than a limit, add a warning. (advisory)"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 71 gives 5 steps in a sequence as one paragraph, but the same procedure for the edit job on lines 78 to 85 uses numbered items.
- Correction: Write the paragraph as a numbered list: "1. After you move the text, examine the file size. 2. If the file is more than a limit in "When you examine the file size", move more sections that have a specified condition. Move the largest section first. 3. When the file is not more than each limit, stop. 4. If the file is still more than a limit, add a warning. (advisory)"

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Select the reference file and its name as "When the write job makes a SKILL.md or entry-file text" tells you. (advisory)"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 79 to 84 give steps in a sequence as bullets, and the step on line 81 that selects the reference file comes after the step on line 80 that moves the section.
- Correction: Write the steps as a numbered list in the sequence of the task: select the reference file and its name, move the largest whole section with a specified condition, write the heading and the pointer in the old place, and stop when the file is not more than each limit.
