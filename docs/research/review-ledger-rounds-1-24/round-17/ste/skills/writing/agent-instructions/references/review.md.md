Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 140: "A script compares each quotation with the files and removes each finding with a different quotation."; line 400: "Before the first check of each round, save a copy of each file that the round examines."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - line 162: "The self-check stops when a round passes, or after round 2."; line 439: "The main agent obeys this section."
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md: 48,444 bytes. Limit: none. loading-rules.md gives limits only for entry files and `SKILL.md`, not for a reference file.

Findings:

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "A script compares each quotation with the files and removes each finding with a different quotation."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 140, the reviewer prompt calls the text that is copied word for word from a file a "quotation", but lines 217, 235, 238, 240, and 281 call the same item a "quote".
- Correction: "A script compares each quote with the files and removes each finding with a different quote."

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Before the first check of each round, save a copy of each file that the round examines."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 400, "each file that the round examines" names the copies that line 55 calls "a copy of each Markdown file of the review target" and line 230 calls "a copy of each file that the round tests", and the words can also mean only the files of the round list (line 31), so the reader cannot know which files to copy.
- Correction: "Before the first check of each review round, save the copies that item 2 of "Before each review round" gives. Before the first check of each reader-test round, save the copies that item 6 of "After the self-check: the reader test" gives."

- Rule: "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "The self-check stops when a round passes, or after round 2."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 162, item 6 gives the instruction to stop the self-check as a statement, not in the imperative.
- Correction: "Stop the self-check when a round passes, or after round 2."

- Rule: "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "The main agent obeys this section."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 439, the instruction to the main agent and the next sentence "A subagent obeys the limits in its prompt." are statements, not imperatives, although a reviewer subagent also reads this file as its report requirements.
- Correction: "When you are the main agent, obey this section. When you are a subagent, obey the limits in your prompt."

- Rule: "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "Before you change a file of the round, run the report form of the check script once for each file in the round list."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 154, the step says "once", but the same type of step says "one time" in line 235 and "1 time" in line 329.
- Correction: "Before you change a file of the round, run the report form of the check script one time for each file in the round list."

- Rule: "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "Run each selected manual check 1 time, as "When you run a manual check" tells you."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 329, the step says "1 time", but the same type of step says "one time" in lines 235 and 330, and "once" in line 154.
- Correction: "Run each selected manual check one time, as "When you run a manual check" tells you."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Make a copy of the test project in a new folder that is not in the project, for example with `mktemp -d`."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 347, "test project" is not in the base list or in the glossary, and the file does not tell which folder it is.
- Correction: "Make a copy of the project folder that the check uses in a new folder that is not in the project, for example with `mktemp -d`."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Save the screen text to the screen-text file in the round folder."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 356, "screen-text file" is not in the base list or in the glossary, and the file uses it with "the" before it gives the item.
- Correction: "Save the screen text to a file in the round folder."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Give their identifiers to the runner of the project, for example with `--ids 3,7`."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 327, "runner" is not in the base list or in the glossary, but the base-list term "script" gives the same item.
- Correction: "Give their identifiers to the test script of the project, for example with `--ids 3,7`."

- Rule: "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "Write each new or changed rule that no tested quote is from in the end-of-run report."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 217, the words "is from in the end-of-run report" put the place of the action after a relative clause, so the sentence is not clear.
- Correction: "In the end-of-run report, write each new or changed rule that no tested quote comes from."
