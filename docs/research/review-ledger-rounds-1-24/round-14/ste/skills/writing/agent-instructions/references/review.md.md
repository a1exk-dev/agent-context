Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 306: "Report: <absolute path of the saved closed list>"
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 215: "It uses the same file, words, or condition as these rules, but these rules are not applicable to it."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md has 48,402 bytes. Limit: no limit for a reference file of a Skill (loading-rules.md, "When you examine the file size", gives limits only for entry files and `SKILL.md`).

- Rule: 1.11, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Report: <absolute path of the saved closed list>"
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 306, the confirmer prompt of "When a reader step does not obey the instruction" uses the term "Report" for the closed list, but lines 240, 289, and 307 of the same section use "report" for the reader report and "closed list" for the list that the author writes, so one term names two items.
- Correction: "Closed list: <absolute path of the saved closed list>"

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "It uses the same file, words, or condition as these rules, but these rules are not applicable to it."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 215, the last "it" can refer to the out-of-scope task, to "the same file", or to the "condition", and "these rules are not applicable to the file" is also a possible reading.
- Correction: "It uses the same file, words, or condition as these rules, but these rules are not applicable to the out-of-scope task."

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write the 3 tasks and their tested quotes in a tasks file in the round folder."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 218, the technical noun "tasks file" is not in the base list of technical-terms.md and not in "Terms in this skill" of SKILL.md.
- Correction: Add "tasks file" to "Terms in this skill" in SKILL.md, for example "The **tasks file** is the JSON file in the round folder that gives the 3 tasks of the reader test and their tested quotes.", or add a warning with a recommended glossary entry.

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For each typical-task report, write a closed list: each step, its quote, and "yes" or "no"."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 240, the technical noun "closed list" is not in the base list of technical-terms.md and not in "Terms in this skill" of SKILL.md.
- Correction: Add "closed list" to "Terms in this skill" in SKILL.md, for example "A **closed list** is the file in which the author gives each step of a reader report, its quote, and "yes" or "no".", or add a warning with a recommended glossary entry.
