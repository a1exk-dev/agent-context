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
- skills/writing/agent-instructions/references/review.md: 48357 bytes. Limit: none. The file is a reference file of a Skill, and the limits in loading-rules.md are only for entry files and SKILL.md.

Text to move: none.

Findings:

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Give their identifiers to the runner of the project, for example with `--ids 3,7`."
- Problem: In skills/writing/agent-instructions/references/review.md, line 327, the technical noun "runner" is not in the glossary or in the base list, and the file does not define it.
- Correction: Give their identifiers to the test command of the project, for example with `--ids 3,7`.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Save the screen text to the screen-text file in the round folder."
- Problem: In skills/writing/agent-instructions/references/review.md, line 356, the multi-word noun "screen-text file" is not in the glossary or in the base list, and the file uses "the" as if a different sentence defined it.
- Correction: Save the screen text to a file in the round folder. At the first save, make a new file. At each later save, add the text to the end of that file. (Then in line 360, write "the path of the file with the screen text".)

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: In skills/writing/agent-instructions/references/review.md, line 161, the technical noun "tie-break" is not in the glossary or in the base list, and the file does not define it.
- Correction: This item ranks no rules.
