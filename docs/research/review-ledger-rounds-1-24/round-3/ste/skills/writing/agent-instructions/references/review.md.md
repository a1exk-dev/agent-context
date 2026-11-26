Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 197: "Do this check on each correction after review round 2."; line 433: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 434: "An example is a word that makes a new technical noun in the project necessary."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 156: "Record each sentence that you change for a confirmed blocking finding, with its rule."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: skills/writing/agent-instructions/references/review.md has 48,263 bytes. It is a reference file of a Skill. loading-rules.md gives no file-size limit for a reference file.

Text to move: none. review.md is a reference file, and the move rules of loading-rules.md are for a SKILL.md and entry files.

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Do this check on each correction after review round 2."
- Problem: In skills/writing/agent-instructions/references/review.md, line 16 uses "check" for the task of one subagent ("Start a new subagent for each check"), but line 197 uses "check" for a procedure that the main agent does, so a reader can start a subagent for it.
- Correction: "Do these steps on each correction after review round 2." Also write "Do these steps" in the other sentences that refer to the section "After the last review round", for example line 164 and line 246.

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: Line 433 of skills/writing/agent-instructions/references/review.md names its own file `references/review.md`, but lines 69 and 73 name the same file "this file", so the reader can look for a different file.
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."

- Rule: "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "An example is a word that makes a new technical noun in the project necessary."
- Problem: Line 434 of skills/writing/agent-instructions/references/review.md does not tell what the example is for, and the sentence directly before it is about questions, so the reader can read it as an example of a question, not of a finding that you cannot correct without help.
- Correction: "An example of such a finding is a word that makes a new technical noun in the project necessary."

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Record each sentence that you change for a confirmed blocking finding, with its rule."
- Problem: On line 156 of skills/writing/agent-instructions/references/review.md, "its" can refer to the sentence or to the confirmed blocking finding.
- Correction: "Record each sentence that you change for a confirmed blocking finding, with the rule of that finding."

- Rule: "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "run the report form of the check script once for each file in the round list"
- Problem: Line 154 of skills/writing/agent-instructions/references/review.md writes "once" for this step, but line 235 writes "one time" for the same type of step ("run the report form for reader reports one time for the round").
- Correction: "run the report form of the check script one time for each file in the round list"

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: On line 161 of skills/writing/agent-instructions/references/review.md, "tie-break" is a technical noun that is not in the glossary or in the base list of technical-terms.md.
- Correction: "This item ranks no rules."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Give their identifiers to the runner of the project, for example with `--ids 3,7`."
- Problem: On line 327 of skills/writing/agent-instructions/references/review.md, "runner" is a technical noun that is not in the glossary or in the base list of technical-terms.md.
- Correction: "Give their identifiers to the test script of the project, for example with `--ids 3,7`."
