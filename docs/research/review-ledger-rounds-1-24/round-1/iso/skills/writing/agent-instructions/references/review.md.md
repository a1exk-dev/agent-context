Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 35: "In a review round, start the 3 reviewers in one message."; line 156: "For each of these findings, correct your text, or reject the finding."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 187: "Also read the files that the pointers in these files identify."

File size:
- skills/writing/agent-instructions/references/review.md: 48,210 bytes, 450 lines. Limit: none. loading-rules.md and agent-skills-spec.md give limits only for `SKILL.md` and for entry files, not for a reference file.

Pointer conditions (pointer list, sentences that are pointers):
- Line 56, "Before each review round": "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you." - the heading and item 3 give the condition.
- Line 71, "When you start the reviewers": "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - the sentence gives the condition.
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - item 2 gives the condition "Before you change a file of the round".
- Line 200, "After the last review round": "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you." - the heading gives the condition.
- Line 235, "After the self-check: the reader test": "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - item 8 gives the condition "Before you change a file of the round".
- Line 327, "After the reader test: the output tests and the manual checks": "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you." - item 6 gives the condition. The path depends on the test folder that item 1 finds.
- Line 347, "When you run a manual check": "Make the setup of the check in that copy, as the `README.md` of the tests tells you." - step 1 gives the condition.
- Line 429, "When no subagent is available": "Write it as the Warnings part in `end-of-run-report.md` tells you." - item 7 gives the condition "When you write the end-of-run report".
- Line 433, "When a reviewer gives a finding": "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you." - the sentence gives the condition, but the target is this file.
- Pointers that name no file: line 187 "Also read the files that the pointers in these files identify."

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "In a review round, start the 3 reviewers in one message."
- Problem: In skills/writing/agent-instructions/references/review.md, line 35 (section "When you do a round") tells the agent to start the reviewers, but the steps that must occur before this step (round folder, copies, and check script JSON for the `Check script findings:` line) are in "Before each review round" at lines 52 to 57, after it.
- Correction: Put the section "Before each review round" before the section "When you do a round", or start item 1 with the condition: "In a review round, after you do the steps in "Before each review round", start the 3 reviewers in one message."

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "For each of these findings, correct your text, or reject the finding."
- Problem: In skills/writing/agent-instructions/references/review.md, line 156 (item 4 of "During and after a review round") tells the agent to correct each confirmed blocking finding, but item 5 at lines 157 to 161 gives the exceptions after that step (for example a new finding on a sentence that the previous round changed), so the agent can correct text before it reads the condition not to correct it.
- Correction: Put item 5 before item 4, or start item 4 with the condition: "Except for the findings that item 5 gives, for each of these findings, correct your text, or reject the finding."

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Also read the files that the pointers in these files identify."
- Problem: In skills/writing/agent-instructions/references/review.md, line 187 (confirmer prompt in "When a reviewer has blocking findings") tells the confirmer to read files but gives no path, and the confirmer prompt has no `Pointer targets:` line as the reviewer prompt has at line 93, so each confirmer must find the targets itself and two confirmers can read different files.
- Correction: Add a line "Pointer targets: <the absolute paths in the Pointer targets line of the reviewer prompt>" to the confirmer prompt, and change the sentence to "Also read each file in the Pointer targets line."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md, line 433 is a pointer to the file that contains it, and item 4 of "During and after a review round" at line 156 already tells the agent to correct or reject each finding and how to reject it.
- Correction: Remove this item, or change it to "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Make sure that each subagent does a dry run."
- Problem: In skills/writing/agent-instructions/references/review.md, line 233 (item 6 of "After the self-check: the reader test") gives no action, because the reader prompt at line 253 already tells each reader to do a dry run, and the author copies that prompt without changes.
- Correction: Remove item 6.

- Rule: "The rule is not usual for the agent. (advisory)"
- Text: "After a correction for a failed manual check, run that check 2 times."
- Problem: In skills/writing/agent-instructions/references/review.md, line 333 (item 10 of "After the reader test: the output tests and the manual checks") gives an unusual rule (2 runs after a correction, but only 1 run for an output test) without a short cause.
- Correction: "After a correction for a failed manual check, run that check 2 times, because one pass of an interactive session can occur by chance."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Do not save 2 reports in one tool call or in one message."
- Problem: In skills/writing/agent-instructions/references/review.md, lines 396 to 415 (section "When no subagent is available") give many rules in no sequence as prose paragraphs, for example line 411, not as bullets.
- Correction: Write the rules of lines 396 to 415 as one bullet list, for example "- Do not save 2 reports in one tool call or in one message." and "- Do not send 2 tool calls at the same time."
