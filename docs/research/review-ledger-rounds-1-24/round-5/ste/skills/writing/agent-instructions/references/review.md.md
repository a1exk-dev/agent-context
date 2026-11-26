Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 400: "Before the first check of each round, save a copy of each file that the round examines. Send only this tool call in a new message."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - line 340: "Put the check in a warning, and write that the user must run it."
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: skills/writing/agent-instructions/references/review.md has 48,313 bytes. Limit: none. loading-rules.md gives a file-size limit only for entry files and `SKILL.md`, not for a reference file.

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Before the first check of each round, save a copy of each file that the round examines. Send only this tool call in a new message."
- Problem: In skills/writing/agent-instructions/references/review.md line 400, "this tool call" can refer to each of the tool calls that save the copies, because a round can examine more than one file and line 445 tells the author to save one file in each tool call.
- Correction: "Before the first check of each round, save a copy of each file that the round examines. Save each copy with a different tool call. Send each of these tool calls alone in a new message."

- Rule: "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)"
- Text: "Put the check in a warning, and write that the user must run it."
- Problem: In skills/writing/agent-instructions/references/review.md line 340, the sentence gives 2 instructions: put the check in a warning, and write that the user must run the check.
- Correction: "Put the check in a warning. In that warning, write that the user must run the check."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: In skills/writing/agent-instructions/references/review.md line 161, "tie-break" is a technical noun that is not in the base list of technical-terms.md, and the file does not define it.
- Correction: "This item ranks no rules."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Give their identifiers to the runner of the project, for example with `--ids 3,7`."
- Problem: In skills/writing/agent-instructions/references/review.md line 327, "runner" is a technical noun that is not in the base list of technical-terms.md, and the file does not define it.
- Correction: "Give their identifiers to the test script of the project, for example with `--ids 3,7`."

- Rule: "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "run the report form of the check script once for each file in the round list"
- Problem: In skills/writing/agent-instructions/references/review.md line 154, the step uses "once", but line 235 uses "one time" for the same type of step ("run the report form for reader reports one time for the round").
- Correction: "run the report form of the check script one time for each file in the round list"
