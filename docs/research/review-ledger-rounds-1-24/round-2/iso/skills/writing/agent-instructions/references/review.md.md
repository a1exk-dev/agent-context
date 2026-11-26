Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 96: "Before the review, read the report requirements from their file."

File size:
- skills/writing/agent-instructions/references/review.md: 48,263 bytes and 450 lines. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointer conditions (sections "When you start the reviewers", "During and after a review round", and "After the self-check: the reader test"):
- Lines 65 to 67: the table cells give the reference files of each reviewer. The row of the reviewer gives the condition.
- Line 69: "The glossary and `MEMORY.md` are not pointer targets." - not a pointer.
- Line 69: "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line." - not a pointer.
- Line 71: "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - condition given.
- Line 71: "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer." - not a pointer. The sentence refers to this file.
- Line 154: "Run it as "When you run the check script" in `SKILL.md` tells you." - condition given: "Before you change a file of the round" at the start of item 2.
- Line 216: "For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order." - not a pointer. The sentence gives an example.
- Line 230: "For a Skill, the first file is its `SKILL.md`." and "When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`." - not pointers. The sentences select the first file of the readers.
- Line 235: "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - condition given: "Before you change a file of the round" at the start of item 8.
- Line 96: "Before the review, read the report requirements from their file." - condition given, but the pointer names no file.

Text to move: none. The sections are in a reference file.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Before the review, read the report requirements from their file."
- Problem: In skills/writing/agent-instructions/references/review.md, line 96 of the reviewer prompt tells the reviewer to read a file with the words "their file", which give no path and do not name the `Report requirements:` line (line 91) that gives the path.
- Correction: "Before the review, read the file in the Report requirements line."

- Rule: "Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file. (advisory)"
- Text: "Before you give a finding, read each file in the Pointer targets line and each file that a sentence in the pointer list names."
- Problem: In skills/writing/agent-instructions/references/review.md, line 100 tells each reviewer to read each file that a sentence in the pointer list names, but the pointer list also gives sentences that name a file only as an example (for example lines 216 and 230 of review.md), and line 116 shows that not each sentence in the pointer list is a pointer.
- Correction: "Before you give a finding, read each file in the Pointer targets line and each file that a pointer in the pointer list names."
