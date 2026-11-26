Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,684 bytes, 100 lines. Limit: none. The table in "When you examine the file size" gives no limit for a reference file of a Skill.

Text to move:
- none. The file is a reference file, and no section of the file was moved.

Pointer conditions:
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - the heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - the sentence gives the condition.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - the heading and the sentence give the condition: when you write the pointer for a reference file.
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - the heading and the sentence give the condition: when you write the pointer in the old place of a moved section.
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - the sentence gives the condition.
- The other sentences in the pointer list for this file (lines 3, 7 second sentence, 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, 56, 98 first and second sentences) give examples, signals, file names, or limits. They are not pointers.

Pointers that name no file:
- none.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the sentence writes again the condition of its heading "When you find the target platforms" (line 9).
- Correction: "Examine the project files for these signals:"

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "After you move the text, examine the file size."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 71, the paragraph gives 4 steps in a sequence (examine the file size, move the largest section first, stop, add a warning) as body text, not as a numbered list.
- Correction: "After you move the text, do these steps. These steps are tier 1:
  1. Examine the file size.
  2. If the file is more than a limit in "When you examine the file size", move more sections that have a specified condition. Move the largest section first. When the file is not more than each limit, stop. (advisory)
  3. If the file is still more than a limit, add a warning. (advisory)"
  Then change "The file-size paragraph after the numbered list is tier 1." on line 56 to "The file-size steps after the first numbered list are tier 1."
