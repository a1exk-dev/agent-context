Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 156: "For each other finding, correct your text, or reject the finding."; line 242: "Correct your text for each problem of the script and each confirmed wrong step."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/review.md has 48,313 bytes and 450 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file, not a SKILL.md or an entry file. The Changes line gives no moved section.

Pointer list (each sentence in the pointer list that is a pointer, with its condition):
- Line 56, "Before each review round": "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you." - The heading and item 3 give the condition.
- Line 71, "When you start the reviewers": "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - The sentence gives the condition.
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - The previous sentence gives the condition "Before you change a file of the round".
- Line 200, "After the last review round": "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you." - The heading and the first sentence of the section give the condition.
- Line 235, "After the self-check: the reader test": "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - Item 8 gives the condition "Before you change a file of the round".
- Line 327, "After the reader test: the output tests and the manual checks": "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you." - The sentences give the condition. Item 1 gives the folder pattern of the tests.
- Line 347, "When you run a manual check": "Make the setup of the check in that copy, as the `README.md` of the tests tells you." - The heading and step 1 give the condition.
- Line 429, "When no subagent is available": "Write it as the Warnings part in `end-of-run-report.md` tells you." - The previous sentence gives the condition "When you write the end-of-run report".
- Line 433, "When a reviewer gives a finding": "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you." - The sentence gives the condition. The target is the file that contains this pointer.
- The other sentences in the pointer list for this file (lines 14, 15, 65, 66, 67, 69, 71 "Where `review.md` gives ...", 216, 230, 322, 446) give facts, examples, or table data. They are not pointers.

Pointers that name no file: none.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "For each other finding, correct your text, or reject the finding."
- Problem: In skills/writing/agent-instructions/references/review.md line 156, item 4 tells the agent to correct the text for each finding, but the condition that stops this correction after round 2 comes only later, in item 8 on line 164 ("After round 2, do not correct the text for a confirmed blocking finding that you accept."), and item 4 refers only to item 5 for the exceptions.
- Correction: "Items 5 and 8 give the findings that you do not correct. For each other finding, correct your text, or reject the finding."

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "Correct your text for each problem of the script and each confirmed wrong step."
- Problem: In skills/writing/agent-instructions/references/review.md line 242, item 12 tells the agent to correct each problem, but the condition that stops this correction after reader-test round 2 comes only later, in item 13 on line 243 ("After reader-test round 2, do not correct the text for a problem of the script or a confirmed wrong step.").
- Correction: "After reader-test round 1, correct your text for each problem of the script and each confirmed wrong step. After reader-test round 2, obey item 13."

- Rule: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 433, the pointer sends the agent to `references/review.md`, which is the file that contains the pointer, and gives no section, so the agent that came from the pointer on line 111 of SKILL.md gets a second pointer to the same file and cannot find the instruction to reject a finding (item 4 of "During and after a review round", line 156).
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."
