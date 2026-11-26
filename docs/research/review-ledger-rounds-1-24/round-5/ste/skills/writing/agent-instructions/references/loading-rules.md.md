Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 82: "In its old place, write a heading that gives the condition."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,684 bytes, 100 lines. Limit: none. The table in "When you examine the file size" gives no limit for a reference file.

Text to move: none. The file is a reference file, and the Changes line gives no moved section.

Findings:

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "In its old place, write a heading that gives the condition."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 82, "its" can refer to "the heading of the section" or to "the moved section" in the sentence before it.
- Correction: "In the old place of the moved section, write a heading that gives the condition."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11 (and lines 13, 19, and 21), the technical noun "signal" is not in the glossary or in the base list of technical-terms.md.
- Correction: "When you find the target platforms, examine the project for the files and folders in this table:"

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "If the layout gives no copy of the text to a target platform, add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 37 (and "the file layout" on line 56), the technical noun "layout" is not in the glossary or in the base list of technical-terms.md.
- Correction: "If the entry files give no copy of the text to a target platform, add a warning."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The entry files from the project root to the file have a total file size of less than 32 KiB."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 44, the technical noun "project root" is not in the glossary or in the base list of technical-terms.md.
- Correction: "The entry files from the top folder of the project to the file have a total file size of less than 32 KiB."
