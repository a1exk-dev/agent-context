Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 281: "Copy each quote from the instruction word for word. A script compares each quote with the instruction files."
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
- skills/writing/agent-instructions/references/review.md: 48,396 bytes. Limit: none (a reference file has no limit in the table of "When you examine the file size" in loading-rules.md).

Findings:

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Copy each quote from the instruction word for word. A script compares each quote with the instruction files."
- Problem: In skills/writing/agent-instructions/references/review.md, line 281 uses "the instruction" and "the instruction files" for the same item in 2 adjacent sentences, and the heading at line 287 and item 10 at line 240 use "the instruction" for a different item (the rule that one step obeys), so one term has two items.
- Correction: "Copy each quote from the instruction files word for word. A script compares each quote with the instruction files." Also use "the instruction files" in lines 262, 276, 278, 279, 280, 283, 284, and 310 where the text means these files.

- Rule: 9.4 "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "A script compares each quotation with the files and removes each finding with a different quotation."
- Problem: In skills/writing/agent-instructions/references/review.md, line 140 uses "quotation" for the copied text that the script compares, but lines 235 and 281 use "quote" for the same type of step ("The script compares each quote with the files on the disk.").
- Correction: "A script compares each quote with the files and removes each finding with a different quote."

- Rule: 9.4 "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "run the report form of the check script once for each file in the round list"
- Problem: In skills/writing/agent-instructions/references/review.md, line 154 uses "once" and "the report form of the check script", but line 235 uses "one time" and "the report form for reader reports" for the same type of step.
- Correction: "run the report form of the check script one time for each file in the round list"

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A split is a finding with one "yes" and one "no" from the 2 confirmers."
- Problem: In skills/writing/agent-instructions/references/review.md, lines 172 and 173 use the technical noun "split", which is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill" in SKILL.md.
- Correction: "When one of the 2 confirmers answers "yes" and the other confirmer answers "no" for a finding, ..." and in line 173 "If the 2 confirmers do not agree on one or more findings, ..." and "In its Findings line, give only these findings, ...".

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A tested quote is a short quote of a new or changed rule that the task tests."
- Problem: In skills/writing/agent-instructions/references/review.md, lines 217, 218, 228, and 239 use the technical noun "tested quote", which is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill" in SKILL.md.
- Correction: Use a base-list term, for example "quoted text", or add a warning that recommends a glossary entry for "tested quote", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "write a closed list: each step, its quote, and "yes" or "no""
- Problem: In skills/writing/agent-instructions/references/review.md, lines 240, 289, 291, and 306 use the technical noun "closed list", which is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill" in SKILL.md.
- Correction: Add a warning that recommends a glossary entry for "closed list", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you, or write "write a list of answers: each step, its quote, and "yes" or "no"".

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: In skills/writing/agent-instructions/references/review.md, line 161 uses the technical noun "tie-break", which is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill" in SKILL.md.
- Correction: "This item ranks no rules."
