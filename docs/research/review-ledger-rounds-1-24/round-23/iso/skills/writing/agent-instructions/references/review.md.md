Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,626 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointers of the pointer list in the sections under review):
- Line 61, heading "When you start the reviewers": "Before you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - The heading and the sentence give the condition.
- Line 61: "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer." - The sentence refers to this file. It is not a pointer to a different file.
- Lines 67, 68, and 69 (table cells) give the reference files of each reviewer. The heading "When you start the reviewers" gives the condition, and line 90 of the prompt gives these files to the reviewer.
- Line 71: "The glossary and `MEMORY.md` are not pointer targets." and "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line." - Facts, not pointers.
- Line 155, heading "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - Item 2 gives the condition "Before you change a file of the round".
- Line 430, heading "When no subagent is available": "Write it as the Warnings part in `end-of-run-report.md` tells you." - Item 7 gives the condition "When you write the end-of-run report".
- Pointers that name no file: none.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In this warning, also write that no vote occurred for the blocking findings and the wrong steps."
- Problem: In skills/writing/agent-instructions/references/review.md line 430, the sentence gives the same instruction as references/end-of-run-report.md line 46 ("Write that no vote occurred for the blocking findings and the wrong steps of these checks."), and the previous sentence of line 430 points to that file for this warning.
- Correction: Remove the sentence "In this warning, also write that no vote occurred for the blocking findings and the wrong steps." from item 7.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Give the path of the report folder in the warning about the checks that you did yourself."
- Problem: In skills/writing/agent-instructions/references/review.md line 416, the sentence gives the same instruction as references/end-of-run-report.md line 46 ("Give the path of the report folder."), and item 7 on line 430 of the same section points to end-of-run-report.md for this warning.
- Correction: Remove the sentence "Give the path of the report folder in the warning about the checks that you did yourself." from line 416.
