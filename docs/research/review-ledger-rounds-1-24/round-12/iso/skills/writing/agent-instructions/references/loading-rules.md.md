Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 38: "Put Rule text in `AGENTS.md` or `CLAUDE.md`."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/loading-rules.md has 10,705 bytes and 100 lines. Limit: none. The table in "When you examine the file size" gives no limit for a reference file of a Skill.

Pointer list: each pointer in the file gives its condition (line 7, line 28, line 69, line 82, line 98). No pointer names no file. The sentences on lines 3, 15 to 17, 27, 29, 31, 35, 38, 45, 46, and 56 name a file path but are not pointers.

Text to move: none. The file is a reference file. The move rules in "When the write job makes a SKILL.md or entry-file text" are applicable to a `SKILL.md` file and to entry-file text.
Moved text: none.

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "Put Rule text in `AGENTS.md` or `CLAUDE.md`."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 38, the rule is applicable when the agent writes a Rule, but its heading "When you write or edit an entry file" (line 33) does not give that condition, and the section for a Rule on line 96 does not contain the rule.
- Correction: Move the rule on line 38 to the section "When the file is the glossary, MEMORY.md, or a Rule", for example: "- When you write a Rule, put its text in `AGENTS.md` or `CLAUDE.md`. Do not put it in `.claude/rules/`. (script check)"

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the rule writes again the condition of its heading "When you find the target platforms" (line 9).
- Correction: "Examine the project files for these signals:"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the extraction recommendation lets the agent move an extraction candidate after approval (line 94), but lines 56 and 75 say "Do not move text from a Rule.", so the file does not tell whether the text of a Rule can be an extraction candidate.
- Correction: "For a Rule, use the file-size limit of the entry file that contains its text. Do not recommend text of a Rule as an extraction candidate."

- Rule: "Add one short cause to a rule in each of these cases:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Do not move text from a Rule."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 56 and 75, the rule stops the usual work of moving text to make a file shorter, but no file gives the cause.
- Correction: "Do not move text from a Rule, because <cause from the user or a project file>." If no file gives the cause, add a warning.

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "After you move the text, examine the file size."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 71, the paragraph gives 4 steps in a sequence (examine the file size, move more sections from the largest, stop, add a warning) as prose, not as a numbered list.
- Correction: "After you move the text, do these steps:
  1. Examine the file size.
  2. If the file is more than a limit in "When you examine the file size", move the largest section that has a specified condition. Do this step again until the file is not more than each limit.
  3. If the file is still more than a limit, add a warning. (advisory)"
