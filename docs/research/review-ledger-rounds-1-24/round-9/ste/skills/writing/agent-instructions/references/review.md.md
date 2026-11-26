Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 396: "One review check is one reviewer class for one file in the round list."; line 63: "| Reviewer | Checks | Reference files |"; line 366: "| Check | Limit for the change |"; line 255: "Instruction files: <the absolute paths of the files of the readers: first the first file of the review target, then each other file>"
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - line 162: "The self-check stops when a round passes, or after round 2."
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/review.md: 48,313 bytes. Limit: none, because loading-rules.md gives a file-size limit only for entry files and SKILL.md, not for a reference file.

Text to move: none. This change has no moved section.

- Rule: 1.11 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "One review check is one reviewer class for one file in the round list."
- Problem: In skills/writing/agent-instructions/references/review.md, line 396 makes one check the review of one file, but line 16 ("Start a new subagent for each check: each reviewer ...") makes one check the full task of one reviewer for all files of the round list, so "check" names two items and line 16 ("Do not give a second check to a subagent") then forbids a reviewer to review a second file.
- Correction: "Do the review of each file in the round list by each reviewer class as a different review check. A reviewer subagent does the review checks of all files in its round list."

- Rule: 1.11 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "| Reviewer | Checks | Reference files |"
- Problem: In skills/writing/agent-instructions/references/review.md, line 63 uses "Checks" for the rules that a reviewer examines, but line 16 uses "check" for the task of one subagent, so one noun names two items.
- Correction: "| Reviewer | Rules | Reference files |"

- Rule: 1.11 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "| Check | Limit for the change |"
- Problem: In skills/writing/agent-instructions/references/review.md, line 366 uses "Check" for rows that are rounds, corrections, and runs, but line 16 uses "check" for the task of one subagent, so one noun names two items.
- Correction: "| Item | Limit for the change |"

- Rule: 1.11 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Instruction files: <the absolute paths of the files of the readers: first the first file of the review target, then each other file>"
- Problem: In skills/writing/agent-instructions/references/review.md, line 255 and lines 259 to 281 use "instruction files" for the item that lines 230 to 237 call "the files of the readers", so the file gives two nouns for one item.
- Correction: "Files of the readers: <the absolute paths of the files of the readers: first the first file of the review target, then each other file>", and use "file of the readers" in place of "instruction file" in lines 259 to 281 and line 303.

- Rule: 5.3 "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "The self-check stops when a round passes, or after round 2."
- Problem: In skills/writing/agent-instructions/references/review.md, line 162 gives the instruction to stop the self-check as a statement, not in the imperative.
- Correction: "Stop the self-check when a round passes, or after round 2."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The round list gives the files of a review round, in the alphabetical sequence of their paths."
- Problem: In skills/writing/agent-instructions/references/review.md, line 31 uses the technical noun "round list", which is not in the glossary or in the base list of technical-terms.md.
- Correction: Add a warning with a recommended glossary entry for "round list", as "When a word is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Before review round 1, make one new round folder that is not in the project, with the command `mktemp -d`."
- Problem: In skills/writing/agent-instructions/references/review.md, line 54 uses the technical noun "round folder", which is not in the glossary or in the base list of technical-terms.md.
- Correction: Add a warning with a recommended glossary entry for "round folder", as "When a word is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Before reader-test round 1, write the tested quotes for each typical task."
- Problem: In skills/writing/agent-instructions/references/review.md, line 217 uses the technical noun "tested quote", which is not in the glossary or in the base list of technical-terms.md.
- Correction: Add a warning with a recommended glossary entry for "tested quote", as "When a word is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For each typical-task report, write a closed list: each step, its quote, and "yes" or "no"."
- Problem: In skills/writing/agent-instructions/references/review.md, line 240 uses the technical noun "closed list", which is not in the glossary or in the base list of technical-terms.md.
- Correction: Add a warning with a recommended glossary entry for "closed list", as "When a word is not in the base list or in the glossary" in technical-terms.md tells you.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This tie-break ranks no rules."
- Problem: In skills/writing/agent-instructions/references/review.md, line 161 uses the technical noun "tie-break", which is not in the glossary or in the base list of technical-terms.md and which the file does not define.
- Correction: "This item ranks no rules."
