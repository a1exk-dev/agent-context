Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 147: "A reader report without its 3 parts also gives exit code 2."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a step that opens a pull request and a step that pushes a tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md has 17,989 bytes. The limit is 20,000 bytes. The file has 151 lines. The tier 4 limit is less than 500 lines.

Findings:

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "A reader report without its 3 parts also gives exit code 2."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md line 147, the omitted words "one or more of" let the reader think that exit code 2 occurs only when the report has none of its 3 parts, but the script also stops when only one part is missing.
- Correction: "A reader report that does not have one or more of its 3 parts also gives exit code 2."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The report form of the script examines the 3 reviewer reports of one file."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md line 130, the technical noun "report form" is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill".
- Correction: Keep the sentence, and add a warning that recommends this glossary entry: "**Report form**: The command of the check script with `--reports`, which examines reviewer reports or reader reports."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The JSON also gives the confirm list."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md line 137, the technical noun "confirm list" is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill".
- Correction: Keep the sentence, and add a warning that recommends this glossary entry: "**Confirm list**: The list in the JSON of the report form that gives each report with one or more findings in the blocking list."
