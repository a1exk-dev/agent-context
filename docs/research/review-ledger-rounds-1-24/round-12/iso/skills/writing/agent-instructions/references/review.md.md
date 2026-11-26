Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 233: "Make sure that each subagent does a dry run."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 96: "Before the review, read the report requirements from their file."

File size:
- skills/writing/agent-instructions/references/review.md: 48,357 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.
- skills/writing/agent-instructions/SKILL.md (context only): 17,948 bytes. Limit: 20,000 bytes.

Text to move: none. review.md is a reference file, not a SKILL.md file or an entry file.

Pointer list (review.md), condition from the heading and the sentence:
- Line 14, "When you start a subagent": "No platform can make a subagent read-only from a `SKILL.md` file." - not a pointer (a fact).
- Line 15, "When you start a subagent": "The reference files are in the `references/` folder next to the `SKILL.md` file of this skill." - not a pointer (location of files to give to subagents).
- Line 56, "Before each review round": "Run the check script ... as "When you run the check script" in `SKILL.md` tells you." - condition given: when you run the check script before each review round.
- Lines 65 to 67, "When you start the reviewers": table cells - not pointers (the reference files of each reviewer).
- Line 69, "When you start the reviewers": 2 sentences about `MEMORY.md` - not pointers.
- Line 71, "When you start the reviewers": "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - condition given.
- Line 71, "When you start the reviewers": "Where `review.md` gives 3 reviewers, ..." - not a pointer (refers to this file).
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - condition given: before you change a file of the round, when you run the report form.
- Line 200, "After the last review round": condition given.
- Line 216, "After the self-check: the reader test": example pointer in quotation marks - not a pointer.
- Line 230, "After the self-check: the reader test": 2 sentences - not pointers (they identify the first file of the readers).
- Line 235, "After the self-check: the reader test": condition given: before you change a file of the round.
- Line 322, "After the reader test: the output tests and the manual checks": not a pointer (a fact about projects).
- Line 327, "After the reader test: the output tests and the manual checks": 2 sentences - condition given: when you run and grade each selected output test.
- Line 347, "When you run a manual check": condition given: for each run of a manual check, step 1.
- Line 429, "When no subagent is available": condition given: when you write the end-of-run report.
- Line 433, "When a reviewer gives a finding": condition given. The target is this file (see the finding below).
- Line 446, "When you save a file or run a command in a round": condition given: when you save the JSON output of the check script.

Pointers that name no file: line 96, "their file" (see the finding below).

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "Make sure that each subagent does a dry run."
- Problem: In review.md line 233, item 6 of "After the self-check: the reader test" comes after item 5, which already starts the reader subagents, but the dry run is set only by the prompt at the start of each subagent.
- Correction: Remove item 6 and add to item 5, before "Give each task to a different new subagent.": "Use the reader prompt below for each reader. The first line of the reader prompt tells the subagent to do a dry run."

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Before the review, read the report requirements from their file."
- Problem: In review.md line 96, in the reviewer prompt, "their file" gives no path and does not identify the line that gives the path.
- Correction: "Before the review, read the file in the Report requirements line."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In review.md line 433, the sentence points to review.md, which is this file, with no section, but the rule to reject a finding is in item 4 of "During and after a review round" in this file (line 156).
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."
