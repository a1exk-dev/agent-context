Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 37: "If the layout gives no copy of the text to a target platform, add a warning."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 31: "For an `@path` line in `CLAUDE.md`, the alternative is a pointer in `AGENTS.md`."
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
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none. "When you examine the file size" in loading-rules.md gives limits only for entry files and SKILL.md, not for a reference file.

Text to move: none. This file is a reference file of the Skill.
Moved text: none. The Changes line gives no pointer of a moved section.

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "If the layout gives no copy of the text to a target platform, add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 37, "the layout" is the entry-file layout, which end-of-run-report.md line 51 calls "An entry-file layout", but loading-rules.md line 56 uses "the file layout" for a different item (the plan of SKILL.md and its reference files), so one noun names two items and one item has two names.
- Correction: "If the entry-file layout gives no copy of the text to a target platform, add a warning."

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "For an `@path` line in `CLAUDE.md`, the alternative is a pointer in `AGENTS.md`."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 31, the sentence omits the target of the pointer, so the later words "a pointer to the same file" and "When the user wants the file in each session" can refer to `CLAUDE.md`, `AGENTS.md`, or the file that the `@path` line loads.
- Correction: "For an `@path` line in `CLAUDE.md`, the alternative is a pointer in `AGENTS.md` to the file that the `@path` line loads."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, "extraction recommendation" is a technical noun that is not in the base list, not in "Terms in this skill" of SKILL.md, and not used in other parts of the skill, which use "extraction candidate" and "When you recommend text to move".
- Correction: "For a Rule, use the file-size limit of the entry file that contains its text. Also find the extraction candidates of that entry file as "When you recommend text to move" tells you."
