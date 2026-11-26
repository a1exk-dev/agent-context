Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 215: "It looks almost the same as a typical task, but the new or changed instruction does not change it."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 170: "Give the findings numbers in one series across all files."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 69: "A reviewer reviews them only when the job changed them, through the `Changes:` line."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,210 bytes. Limit: none. references/loading-rules.md gives limits only for entry files, SKILL.md, the glossary, MEMORY.md, and docs/agents/ files, not for a reference file of a Skill.

Texts to move: none.
Moved texts: none.

Findings:

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "It looks almost the same as a typical task, but the new or changed instruction does not change it."
- Problem: In skills/writing/agent-instructions/references/review.md line 215, "the new or changed instruction" identifies the same item that line 213 calls "the new or changed rules of the change", and lines 217 and 239 call "new or changed rule" and "added or changed line", so the reader can think that the out-of-scope task uses a different item.
- Correction: "It looks almost the same as a typical task, but the new or changed rules do not change it."

- Rule: "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Give the findings numbers in one series across all files."
- Problem: In skills/writing/agent-instructions/references/review.md line 170, the sentence omits "to" or "a number to each finding", so "the findings numbers" can mean "the numbers that the findings already have" and not "give a new number to each finding".
- Correction: "Give a number to each finding. Use one series of numbers across all files."

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "A reviewer reviews them only when the job changed them, through the `Changes:` line."
- Problem: In skills/writing/agent-instructions/references/review.md line 69, "them" can refer to "The glossary and `MEMORY.md`" or to "the pointer targets" in the two sentences before it.
- Correction: "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: In skills/writing/agent-instructions/references/review.md line 161, "tie-break" is a technical noun that is not in the glossary or in the base list of references/technical-terms.md.
- Correction: "This item ranks no rules."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Give their identifiers to the runner of the project, for example with `--ids 3,7`."
- Problem: In skills/writing/agent-instructions/references/review.md line 327, "runner" is a technical noun that is not in the glossary or in the base list of references/technical-terms.md.
- Correction: "Give their identifiers to the test script of the project, for example with `--ids 3,7`."
