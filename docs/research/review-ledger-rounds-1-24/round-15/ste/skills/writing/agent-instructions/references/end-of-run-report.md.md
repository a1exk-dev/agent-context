Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 44: "Each text that only the check script examined: a correction after review round 2, and each later correction when you did 2 review rounds."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 42: "Each selected manual check that you did not run, with its cause."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6417 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file of a Skill.

Findings:

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Each text that only the check script examined: a correction after review round 2, and each later correction when you did 2 review rounds."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 44, the sentence gives "a correction" as the text, but the examined item is the text that the correction changed (review.md line 203, and end-of-run-report.md line 45 uses the full form), so the omitted words change the item that the warning gives.
- Correction: "Each text that only the check script examined: the text that a correction after review round 2 changed, and the text that each later correction changed when you did 2 review rounds."

- Rule: GR-3 and GR-4 "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Each selected manual check that you did not run, with its cause."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 42, "its" refers grammatically to the manual check, but the necessary cause is the cause why you did not run the check (review.md lines 340 to 343), so the pronoun can refer to two items.
- Correction: "Each selected manual check that you did not run, with the cause why you did not run it."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A file type that is not correct for the text, also when you found that file type during the edit job."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 50, the technical noun "file type" is not in the base list of technical-terms.md, not in the glossary, and not in "Terms in this skill" in SKILL.md.
- Correction: Add a warning that recommends a glossary entry for "file type", for example "file type: the type of an Agent instruction: entry-file text, a Rule, a Skill, or a reference file", and keep the sentence until the user gives approval.
