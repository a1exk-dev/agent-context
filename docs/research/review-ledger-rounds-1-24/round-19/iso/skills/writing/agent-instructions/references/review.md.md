Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 71: "When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/review.md: 48,446 bytes, 450 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions in the section under review ("When you start the reviewers", lines 59 to 149):
- Line 65, 66, 67 (table cells that give the reference files of each reviewer): the heading "When you start the reviewers" and the table row give the condition. The prompt line "Rules:" gives these files to the reviewer.
- Line 71: "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." The sentence gives the file, the section, and the condition.
- Line 69 and line 71 (the sentences that name `MEMORY.md` and `review.md`): these sentences are not pointers, because they do not tell the agent to read a file.

Pointers that name no file: none.

Text to move: none.

Moved text: none.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round."
- Problem: In skills/writing/agent-instructions/references/review.md, line 61 tells the agent to start 3 reviewer subagents, but the list-file condition that changes this step and the step to find the list files come later, on line 71.
- Correction: Move the paragraph of line 71 ("When you start the reviewers, find the list files ... The loading reviewer gives no report for a list file.") to directly after the heading "When you start the reviewers", before "In each round, start 3 new reviewer subagents".

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "In round 2, give only the sections that the previous round changed."
- Problem: In skills/writing/agent-instructions/references/review.md, line 85 gives the rule only for round 2, but line 387 ("Correct again") permits new rounds after round 2, and line 163 gives the same rule for each next round.
- Correction: "In each round after round 1, give only the sections that the previous round changed."

- Rule: "Keep only the text that the agent cannot find without help. Examples are project facts, decisions, special instructions of the user, and corrections of incorrect agent work. (advisory)"
- Text: "Each reviewer reads the prompt in this file to know the requirements for its reports. A reviewer does only the review that the author gave to it."
- Problem: In skills/writing/agent-instructions/references/review.md, line 69 gives facts that the reviewer prompt on lines 96 and 97 already gives ("Before the review, read the file in the Report requirements line." and "Do only this review."), so the main agent can find them without these sentences.
- Correction: Remove the two sentences.
