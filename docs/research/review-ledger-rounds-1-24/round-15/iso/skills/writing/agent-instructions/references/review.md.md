Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 35: "In a review round, start the 3 reviewers in one message."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,402 bytes, 450 lines. Limit: none. loading-rules.md, "When you examine the file size", gives limits only for entry files and `SKILL.md`. This file is a reference file of a Skill.

Pointer conditions (pointer list of the check script, review.md):
- Line 14, "No platform can make a subagent read-only from a `SKILL.md` file.": not a pointer (a fact).
- Line 15, "The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.": not a pointer (a location for step 4).
- Line 56, heading "Before each review round": the sentence gives the condition "Run the check script on the full file ...". Condition given.
- Lines 65 to 67, table cells: not pointers (lists of files to give to each reviewer).
- Line 69, the 2 sentences about `MEMORY.md`: not pointers.
- Line 71, "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`.": condition given.
- Line 71, "Where `review.md` gives 3 reviewers, ...": not a pointer (refers to this file).
- Line 154, "Run it as "When you run the check script" in `SKILL.md` tells you.": the item gives the condition "Before you change a file of the round, run the report form". Condition given.
- Line 200, heading "After the last review round": condition given.
- Line 216: an example in quotation marks, not a pointer.
- Line 231, the 2 sentences: not pointers (they identify the first file of the readers).
- Line 235, "Run the report form for reader reports as ...": the item gives the condition "Before you change a file of the round". Condition given.
- Line 322, "A project often keeps the tests ...": not a pointer (a fact).
- Line 327, "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you.": condition given (run and grade each selected test). Each sentence names `README.md` of the tests from item 1.
- Line 347, heading "When you run a manual check": condition given.
- Line 429, "Write it as the Warnings part in `end-of-run-report.md` tells you.": the item gives the condition "When you write the end-of-run report". Condition given.
- Line 433, heading "When a reviewer gives a finding": condition given. The pointer identifies the file that contains it. See the finding below.
- Line 446, "You can save the JSON output of the check script with `>`, as `SKILL.md` shows.": condition given (save the JSON output).

Pointers that name no file: none.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "In a review round, start the 3 reviewers in one message."
- Problem: In skills/writing/agent-instructions/references/review.md, step 1 of "When you do a round" (line 35) tells the agent to start the reviewers, but the steps that are necessary before that action (the copy of each file, the check script, and the JSON path for each reviewer, lines 54 to 57) are in the later section "Before each review round".
- Correction: "In a review round, first do the steps in "Before each review round". Then start the 3 reviewers in one message."

- Rule: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md, line 433 points to `references/review.md`, which is the same file, and SKILL.md line 111 already points to it, so the agent follows a second pointer to the file that it reads and gets no section that tells how to reject a finding.
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "At the start of each review round, save a copy of each Markdown file of the review target as `<round folder>/round-<n>/<file path>`."
- Problem: In skills/writing/agent-instructions/references/review.md, item 2 at line 55 writes again the condition of its heading "Before each review round".
- Correction: "Save a copy of each Markdown file of the review target as `<round folder>/round-<n>/<file path>`."

- Rule: "Add one short cause to a rule in each of these cases: The rule is not usual for the agent. (advisory)"
- Text: "Save each report with one tool call, alone in a new message."
- Problem: In skills/writing/agent-instructions/references/review.md, line 122 of the reviewer prompt gives an unusual rule, and the reviewer subagent reads only the prompt, so it does not get the cause.
- Correction: "Save each report with one tool call, alone in a new message, because the author starts a new reviewer for each missing report when you fail."

- Rule: "Add one short cause to a rule in each of these cases: The rule is not usual for the agent. (advisory)"
- Text: "If the report folder already has the report of a file, do not review that file again."
- Problem: In skills/writing/agent-instructions/references/review.md, line 123 of the reviewer prompt gives an unusual rule without a cause, and the reviewer subagent does not read line 42, which tells that a new reviewer gets the report folder of a failed reviewer.
- Correction: "If the report folder already has the report of a file, do not review that file again, because a new reviewer continues the work of a failed reviewer in the same report folder."
