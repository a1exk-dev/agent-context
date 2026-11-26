Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 96: "Before the review, read the report requirements from their file."

File size:
- skills/writing/agent-instructions/references/review.md: 48263 bytes, 450 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer conditions (pointer list, review.md):
- Line 56, "Before each review round": "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you." - The heading and the sentence give the condition.
- Line 71, "When you start the reviewers": "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - The heading and the sentence give the condition.
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - The item gives the condition "Before you change a file of the round".
- Line 200, "After the last review round": "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you." - The heading and the sentence give the condition.
- Line 235, "After the self-check: the reader test": "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - The item gives the condition "Before you change a file of the round".
- Line 327, "After the reader test: the output tests and the manual checks": "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you." - The sentences give the condition.
- Line 347, "When you run a manual check": "Make the setup of the check in that copy, as the `README.md` of the tests tells you." - The heading and the sentence give the condition.
- Line 429, "When no subagent is available": "Write it as the Warnings part in `end-of-run-report.md` tells you." - The item gives the condition "When you write the end-of-run report".
- Line 433, "When a reviewer gives a finding": "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you." - The heading and the sentence give the condition. The target is the file itself.
- Lines 14, 15, 65, 66, 67, 69, 216, 230, 322, and 446 name a file but are not pointers.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Before the review, read the report requirements from their file."
- Problem: In skills/writing/agent-instructions/references/review.md, line 96, the pointer in the reviewer prompt identifies its target only with the words "their file", not with the path or with the prompt line that gives the path.
- Correction: "Before the review, read the file in the Report requirements line."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A reviewer also fails when its last message does not give the report path of each file in the round list."
- Problem: In skills/writing/agent-instructions/references/review.md, line 42 does not agree with line 71: when the job changes a list file and a different file, the round list contains the list file, but the loading reviewer gives no report for a list file, so line 42 makes the loading reviewer fail.
- Correction: "A reviewer also fails when its last message does not give the report path of each file in the round list that its `Changes:` line gives."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md, line 433 points to the file itself and gives no section, and item 4 of "During and after a review round" (line 156) already tells the agent to correct the text or reject the finding.
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."

- Rule: "In each other heading, give the condition or the topic of its section. (advisory)"
- Text: "When you start the reviewers"
- Problem: In skills/writing/agent-instructions/references/review.md, the section of the level 2 heading on line 59 also contains the level 3 sections "During and after a review round" (line 151), "When a reviewer has blocking findings" (line 166), and "After the last review round" (line 195), whose rules are not applicable when you start the reviewers.
- Correction: Change these 3 level 3 headings to level 2 headings, for example "## During and after a review round", "## When a reviewer has blocking findings", and "## After the last review round".
