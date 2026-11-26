Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 156: "An example is quoted text."; line 382: "Examples are a subagent and an output test of this skill."
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
- skills/writing/agent-instructions/references/review.md: 48,402 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and SKILL.md, not for a reference file of a Skill.

Findings:

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "An example is quoted text."
- Problem: In skills/writing/agent-instructions/references/review.md, line 156, the sentence after "To reject a finding, give the rule that permits the text." omits the item that "example" refers to, so the reader can read quoted text as an example of a rule, not as an example of text that a rule permits.
- Correction: "For example, a rule can permit quoted text."

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Examples are a subagent and an output test of this skill."
- Problem: In skills/writing/agent-instructions/references/review.md, line 382, the sentence omits the words that make a subagent and an output test into cases where no user can answer, so the reader can read "a subagent" as a user that cannot answer.
- Correction: "Examples are a session where you are a subagent and an output test of this skill."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The round list gives the files of a review round, in the alphabetical sequence of their paths."
- Problem: In skills/writing/agent-instructions/references/review.md, line 31, the technical noun "round list" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "round list" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Before review round 1, make one new round folder that is not in the project, with the command `mktemp -d`."
- Problem: In skills/writing/agent-instructions/references/review.md, line 54, the technical noun "round folder" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "round folder" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For the confirmers of a review round, the input is the confirm lists"
- Problem: In skills/writing/agent-instructions/references/review.md, line 36, the technical noun "confirm list" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "confirm list" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "When the report form gives exit code 2 for a missing report path, the reviewer of that report folder also failed."
- Problem: In skills/writing/agent-instructions/references/review.md, line 42, the technical noun "report form" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "report form" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A split is a finding with one"
- Problem: In skills/writing/agent-instructions/references/review.md, line 172, the technical noun "split" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "split" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A tested quote is a short quote of a new or changed rule that the task tests."
- Problem: In skills/writing/agent-instructions/references/review.md, line 217, the technical noun "tested quote" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "tested quote" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write the 3 tasks and their tested quotes in a tasks file in the round folder."
- Problem: In skills/writing/agent-instructions/references/review.md, line 218, the technical noun "tasks file" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "tasks file" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For each typical-task report, write a closed list"
- Problem: In skills/writing/agent-instructions/references/review.md, line 240, the technical noun "closed list" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "closed list" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "After reader-test round 1, correct your text for each problem of the script and each confirmed wrong step."
- Problem: In skills/writing/agent-instructions/references/review.md, line 242, the technical noun "wrong step" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "wrong step" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "In a manual check, you are the test driver, not the user."
- Problem: In skills/writing/agent-instructions/references/review.md, line 338, the technical noun "test driver" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "test driver" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Save the screen text to the screen-text file in the round folder."
- Problem: In skills/writing/agent-instructions/references/review.md, line 356, the technical noun "screen-text file" is not in the glossary and not in the base list of technical-terms.md.
- Correction: Recommend a glossary entry for "screen-text file" and add a warning, as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.
