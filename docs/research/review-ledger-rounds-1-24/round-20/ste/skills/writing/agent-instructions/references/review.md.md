File size: /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md has 48,582 bytes and 451 lines. Limit: no limit. The table in "When you examine the file size" in loading-rules.md gives a limit only for entry files and for SKILL.md, not for a reference file of a Skill.

Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 131: "For the checklist, examine only the sections under review of that file."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

Text to move: none. The section "When you start the reviewers" is in a reference file. The rules in loading-rules.md that tell you to move text are applicable to a SKILL.md file and to entry-file text.
Moved text: none. The Changes line gives no pointer of a moved section.

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "For the checklist, examine only the sections under review of that file."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 131, "that file" can refer to one of "your rule files" in the previous sentence on line 130 or to the file of the report, because no sentence after line 124 gives one file.
- Correction: "For the checklist, examine only the sections under review of the file of that report."

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Before you change a file of the round, run the report form of the check script once for each file in the round list."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 155, the technical nouns "report form" and "round list" are not in the base list of technical-terms.md and are not bold terms in "Terms in this skill" in SKILL.md.
- Correction: Keep the sentence, and add a warning that recommends a glossary entry for "report form" and "round list", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For each reviewer with one or more reports in the confirm lists of the round, do the vote in "When a reviewer has blocking findings"."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 156, the technical noun "confirm lists" is not in the base list of technical-terms.md and is not a bold term in "Terms in this skill" in SKILL.md.
- Correction: Keep the sentence, and add a warning that recommends a glossary entry for "confirm list", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.
