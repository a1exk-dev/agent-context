Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none. The table in "When you examine the file size" gives no limit for a reference file of a Skill.

Pointer list decisions (skills/writing/agent-instructions/references/loading-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - pointer; the sentence gives the condition.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the heading and the sentence give the condition (when you write the pointer of a reference file).
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the heading and the sentence give the condition (when you write the pointer in the old place of a moved section).
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - pointer; the heading and the sentence give the condition.
- The other sentences of this file in the pointer list (lines 3, 7 second sentence, 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, 56, 98 first and second sentences) are not pointers. They name files as examples, signals, or files to write.
- Pointers that name no file: none.

Text to move: none. This file is a reference file of a Skill. The move rules in this file are for a `SKILL.md` file and entry-file text.
Moved text: none.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the rule writes again the condition of its heading "When you find the target platforms" (line 9).
- Correction: "Examine the project files for these signals:"
