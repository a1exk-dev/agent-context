Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 94: "Move an extraction candidate only after the user gives approval."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,673 bytes, 100 lines. Limit: none. The file is a reference file, and the table in "When you examine the file size" gives limits only for entry files and `SKILL.md`.

Pointer conditions (pointer list of the check script, loading-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - pointer; the sentence gives the condition.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the heading and the sentence give the condition (when you write the pointer of a reference file).
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the heading and the sentence give the condition (when you write the pointer of a moved section).
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - pointer; the sentence gives the condition.
- Lines 3, 7 (second sentence), 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, 56, and the 2 other sentences of line 98: not pointers. These sentences name files as examples, signals, or files to write.

Pointers that name no file: none.

Text to move: none. The file is a reference file. The move rules of "When the write job makes a SKILL.md or entry-file text" are for `SKILL.md` and entry-file text.

Moved text: none. The Changes line gives no moved section.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "Move an extraction candidate only after the user gives approval."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 94, item 4 of "When you recommend text to move" gives the action first and the necessary condition (the approval of the user) after it.
- Correction: "When the user gives approval for an extraction candidate, move that candidate."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the sentence writes again the condition of the heading "When you find the target platforms" on line 9.
- Correction: "Examine the project files for these signals:"

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "After you move the text, examine the file size."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 71, the paragraph gives a sequence of steps (examine the file size, move more sections, move the largest section first, stop, add a warning) in one paragraph, not in a numbered list.
- Correction: "After you move the text, do these steps:" followed by a numbered list: "1. Examine the file size." "2. If the file is more than a limit in "When you examine the file size", move the largest section that has a specified condition." "3. When the file is not more than each limit, stop. If not, do step 2 again." "4. If the file is still more than a limit after you moved each such section, add a warning."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When there is one target platform, write only the entry file of that platform."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 36 tells the agent to write only `CLAUDE.md` when Claude Code is the only target platform, but line 25 tells the agent to write only features that all three platforms read, also when Claude Code is the only target platform.
- Correction: Give the decision for a project with only Claude Code in one place, for example: "When Codex or OpenCode is the only target platform, write only `AGENTS.md`. When Claude Code is the only target platform, write only `CLAUDE.md`. This rule is an exception to "Write only features that Codex, OpenCode, and Claude Code all read"."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the extraction recommendation for a Rule can recommend to move Rule text, but lines 56 and 75 say "Do not move text from a Rule.", and "When you recommend text to move" (lines 87 to 94) does not exclude Rule text.
- Correction: "For a Rule, use the file-size limit of the entry file that contains its text. Do not recommend Rule text as an extraction candidate."

- Rule: "Add one short cause to a rule in each of these conditions:" - "The rule is not usual for the agent. (advisory)"
- Text: "Do not move text from a Rule."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 56 and 75, the rule stops the usual move of long text to reference files for Rule text, and neither line nor a pointer target gives the cause.
- Correction: "Do not move text from a Rule, because the project adds the full text of a Rule to `AGENTS.md` or `CLAUDE.md`."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The STE rules and the plain-language rules are also applicable to these files."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the sentence repeats facts that the pointer targets give: `SKILL.md` line 17 makes the glossary, `MEMORY.md`, and Rules Agent instructions, and `ste-rules.md` line 11 and `plain-language-rules.md` line 3 make these rules applicable to each Agent instruction.
- Correction: Remove the sentence. Keep "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The Agent Skills specification is not applicable to a Rule."
