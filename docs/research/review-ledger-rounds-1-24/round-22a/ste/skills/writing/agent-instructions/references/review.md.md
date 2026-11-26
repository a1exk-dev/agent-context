File size: skills/writing/agent-instructions/references/review.md has 48,598 bytes. Limit: no limit. "When you examine the file size" in loading-rules.md gives limits only for entry files and SKILL.md, and this file is a reference file of a Skill.

Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 399: "Save each review report at the path that the reviewer prompt gives"; line 421: "Start each review report with its title"
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - line 139: "Each finding gives one rule from the rule files and the text from the file in quotation marks."
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

- Rule: rule 1.11 and rule 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Save each review report at the path that the reviewer prompt gives"
- Problem: In skills/writing/agent-instructions/references/review.md line 399, "review report" names the report of a reviewer, but line 436 ("from a reviewer report") and line 442 ("each reviewer report") use "reviewer report" for the same item, and SKILL.md line 130 also uses "reviewer reports".
- Correction: "Save each reviewer report at the path that the reviewer prompt gives: `<report folder>/<file path>.md`."

- Rule: rule 1.11 and rule 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Start each review report with its title"
- Problem: In skills/writing/agent-instructions/references/review.md line 421, "review report" names the report of a reviewer, but line 436 and line 442 use "reviewer report" for the same item.
- Correction: "Start each reviewer report with its title, for example "Round 2: ASD-STE100 review, skills/x/SKILL.md"."

- Rule: rule 5.3, "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "Each finding gives one rule from the rule files and the text from the file in quotation marks."
- Problem: In skills/writing/agent-instructions/references/review.md line 139, the reviewer prompt gives an instruction to the reviewer as a statement, not in the imperative.
- Correction: "In each finding, give one rule from the rule files and the text from the file in quotation marks."

- Rule: rule 9.4, "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "run the report form for reader reports one time for the round"
- Problem: In skills/writing/agent-instructions/references/review.md line 236, the step that runs the report form says "one time", but the same type of step on line 155 says "run the report form of the check script once", and SKILL.md line 130 says "Run it once".
- Correction: "Before you change a file of the round, run the report form for reader reports once for the round."

- Rule: rule 9.4, "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "Run each selected manual check 1 time"
- Problem: In skills/writing/agent-instructions/references/review.md line 330, the step says "1 time", but the step directly after it on line 331 says "correct the text one time" for the same type of count.
- Correction: "Run each selected manual check one time, as "When you run a manual check" tells you."

- Rule: rule 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Make a copy of the test project in a new folder that is not in the project"
- Problem: In skills/writing/agent-instructions/references/review.md line 348, "test project" is a technical noun that is not in the glossary or in the base list, and the same sentence also uses the base-list term "project" for a different item.
- Correction: "Make a copy of the project that the `README.md` of the tests gives for the check in a new folder that is not in the project." Also add a warning that recommends a glossary entry for "test project", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: rule 4.1, "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "For each step, write the part of the instruction that you used in quotation marks."
- Problem: In skills/writing/agent-instructions/references/review.md line 429, "in quotation marks" can attach to "used" or to "write", so the sentence can tell the agent to quote only the parts that it used in quotation marks.
- Correction: "For each step, write in quotation marks the part of the instruction that you used."
