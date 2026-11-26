Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,598 bytes. Limit: none. loading-rules.md gives limits only for entry files and SKILL.md, not for a reference file.

Pointer conditions (review.md):
- Line 56, "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you." - condition given: heading "Before each review round".
- Line 61, "Before you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - condition given in the sentence.
- Lines 67 to 69, reference files in the reviewer table - condition given: heading "When you start the reviewers".
- Line 155, "Run it as "When you run the check script" in `SKILL.md` tells you." - condition given: "Before you change a file of the round".
- Line 201, "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you." - condition given: heading "After the last review round" and line 198.
- Line 236, "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - condition given: "Before you change a file of the round".
- Line 328, "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you." - condition given: item 6, run the selected output tests.
- Line 348, "Make the setup of the check in that copy, as the `README.md` of the tests tells you." - condition given: heading "When you run a manual check".
- Line 430, "Write it as the Warnings part in `end-of-run-report.md` tells you." - condition given: "When you write the end-of-run report".
- Line 434, "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you." - condition given in the sentence.
- Lines 14, 15, 61 ("Where `review.md` gives ..."), 71, 217, 232, 323, and 447 are not pointers. They give facts, examples, or the location of files.
- Pointers that name no file: none.

Text to move: none. The move rules of loading-rules.md are for SKILL.md and entry-file text, not for a reference file. The Changes line gives no moved section.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "In each review round, the round list contains each file in the `Changes:` line of the reviewer prompt."
- Problem: In skills/writing/agent-instructions/references/review.md line 31, "the reviewer prompt" identifies no single prompt, because line 61 gives the loading reviewer a `Changes:` line without list files, so with a list file in the round, item 5 at line 42 can mark the loading reviewer as failed when it gives no report path for that list file.
- Correction: "In each review round, the round list of a reviewer contains each file in the `Changes:` line of the prompt of that reviewer." In line 42, write "each file in the round list of that reviewer".

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A reviewer also fails when its last message does not give the report path of each file in the round list."
- Problem: In skills/writing/agent-instructions/references/review.md line 42, a new reviewer gets the report folder of the failed reviewer, skips each file that has a report (line 124), and gives only the paths that it saved (line 125), so this criterion marks it as failed and item 6 at line 47 then sends all later rounds to "When no subagent is available".
- Correction: "A reviewer also fails when, after its last message, its report folder does not have the report of each file in the round list."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "The script finds 2 types of problems."
- Problem: In skills/writing/agent-instructions/references/review.md line 240, item 9 of the numbered reader-test list gives only information about the script output and no step of the sequence.
- Correction: Remove item 9 from the numbered list. Add its sentences to the end of item 8 as the result of that step: "The script finds 2 types of problems. A typical task has a problem when its report does not use a tested quote. The out-of-scope task has a problem when its report uses an added or changed line."

- Rule: "When you add a rule and no heading gives its condition, add a heading for the rule. Use the level of the other condition headings. If the file has only a level 1 heading, use level 2. Put the new section after the last section of the file. Put a new rule in a section after the last rule of that section. Do not change the headings of the other rules. (advisory)"
- Text: "During and after a review round"
- Problem: In skills/writing/agent-instructions/references/review.md, the level 3 headings at line 152, line 167 ("When a reviewer has blocking findings"), and line 196 ("After the last review round") are in the section "When you start the reviewers" (line 59), whose condition is not applicable to the steps during and after a review round, while the other condition headings of the file are level 2.
- Correction: "## During and after a review round", "## When a reviewer has blocking findings", and "## After the last review round".

- Rule: "Keep only the text that the agent cannot find without help. Examples are project facts, decisions, special instructions of the user, and corrections of incorrect agent work. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 434, the agent already reads review.md, so this pointer sends it to the same file with no section, and item 4 of "During and after a review round" at line 157 already tells it to correct the text or reject the finding.
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."
