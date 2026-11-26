Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none. The table in "When you examine the file size" gives limits only for entry files and `SKILL.md`, and this file is a reference file.

Text to move: none. The numbered list in "When the write job makes a SKILL.md or entry-file text" is applicable only to `SKILL.md` text and entry-file text, and this file is a reference file.

Findings:

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 11, 13, 19, and 21 use the technical noun "signal", which is not in the glossary, in the base list, or in "Terms in this skill" of SKILL.md.
- Correction: "When you find the target platforms, examine the project for the files and folders in this table:" Change the column title "Signal" to "File or folder", and write "file or folder from this table" for "signal" in lines 19 and 21.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write only features that Codex, OpenCode, and Claude Code all read."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 23, 25, and 31 use the technical noun "feature", which is not in the glossary, in the base list, or in "Terms in this skill" of SKILL.md.
- Correction: "Write only files, folders, lines, and frontmatter fields that Codex, OpenCode, and Claude Code all read." Use the same words for "feature" in line 31, or add a warning that recommends a glossary entry for "feature".

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "If the layout gives no copy of the text to a target platform, add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 37 uses the technical noun "layout" (and line 56 uses "file layout"), which is not in the glossary, in the base list, or in "Terms in this skill" of SKILL.md.
- Correction: "If no entry file gives the text to a target platform, add a warning."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 100 uses the technical noun "extraction recommendation", which is not in the glossary, in the base list, or in "Terms in this skill" of SKILL.md, and the file gives the item only as the heading "When you recommend text to move" (line 87).
- Correction: "For a Rule, use the file-size limit of the entry file that contains its text. Also use "When you recommend text to move" for that entry file."

- Rule: 4.1 "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 35, the words "Claude Code and Codex or OpenCode" can also mean "Claude Code and Codex, or only OpenCode", and with that meaning, the next sentence about `CLAUDE.md` is applicable to a job without Claude Code.
- Correction: "When the target platforms of the write job are Claude Code and one or more of Codex and OpenCode, put the text for all target platforms in `AGENTS.md`."
