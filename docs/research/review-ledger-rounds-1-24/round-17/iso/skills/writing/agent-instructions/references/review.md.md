Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,444 bytes, 450 lines. Limit: none. `loading-rules.md` and `agent-skills-spec.md` give limits only for entry files and `SKILL.md`, not for a reference file of a Skill.

Text to move: none. The move rules in `loading-rules.md` are for a `SKILL.md` file and entry-file text, not for a reference file.

Pointer conditions (pointer list of the check script, review.md):
- Line 56, "Before each review round": condition in the heading and in item 3 ("Run the check script"). Pass.
- Line 71, "When you start the reviewers": condition in the sentence. Pass.
- Line 154, "During and after a review round": condition "Before you change a file of the round" in item 2. Pass.
- Line 200, "After the last review round": condition in the heading and in item 2. Pass.
- Line 235, "After the self-check: the reader test": condition "Before you change a file of the round" in item 8. Pass.
- Line 327, "After the reader test: the output tests and the manual checks": condition in item 6. Pass.
- Line 347, "When you run a manual check": condition in step 1 of each run. Pass.
- Line 429, "When no subagent is available": condition "When you write the end-of-run report" in item 7. Pass.
- Line 433, "When a reviewer gives a finding": condition in the sentence, but the target is this file (see the findings).
- Line 446, "When you save a file or run a command in a round": condition in the bullet. Pass.
- Lines 14, 15, 65, 66, 67, 69, 216, 231, 322: facts, table cells, or examples, not pointers.

Findings:

- Rule: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 433, the pointer identifies its own file, so `SKILL.md` line 111 points to `references/review.md` and this section points to `references/review.md` again with no section that gives the reject rules (item 4 of "During and after a review round", line 156).
- Correction: "When a reviewer gives a finding, do items 4 and 5 of "During and after a review round"."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 433, the bullet tells the author to correct or reject each finding, but item 5 of "During and after a review round" (line 157) tells the author not to correct some findings and to put them in a warning.
- Correction: "When a reviewer gives a finding, do items 4 and 5 of "During and after a review round"."

- Rule: "In each other heading, give the condition or the topic of its section. (advisory)"
- Text: "When you start the reviewers"
- Problem: In skills/writing/agent-instructions/references/review.md line 59, the section of this level 2 heading continues to line 204 and contains "### During and after a review round" (line 151), "### When a reviewer has blocking findings" (line 166), and "### After the last review round" (line 195), whose rules are not applicable when you start the reviewers.
- Correction: Change the 3 headings to level 2: "## During and after a review round", "## When a reviewer has blocking findings", and "## After the last review round".

- Rule: "The rule is not usual for the agent. (advisory)"
- Text: "A wrong step is confirmed when one or more of its confirmers answer "yes"."
- Problem: In skills/writing/agent-instructions/references/review.md line 294, 1 "yes" confirms a wrong step, but line 174 needs 2 "yes" answers to confirm a blocking finding, and no file gives the cause of this difference.
- Correction: "A wrong step is confirmed when one or more of its confirmers answer "yes". <One short sentence that tells why 1 "yes" is enough for a wrong step.>"

- Rule: "The rule is not usual for the agent. (advisory)"
- Text: "After a correction for a failed manual check, run that check 2 times."
- Problem: In skills/writing/agent-instructions/references/review.md line 333, an output test runs again 1 time but a manual check runs again 2 times, and no file gives the cause of this difference.
- Correction: "After a correction for a failed manual check, run that check 2 times, because <one short cause, for example that the result of an interactive session can change between runs>."

- Rule: "The rule changes the usual work of the agent. (advisory)"
- Text: "Give no list file in the `Changes:` line of the loading reviewer."
- Problem: In skills/writing/agent-instructions/references/review.md line 71, the rule removes a reviewer class for a list file, but neither this file nor `SKILL.md` lines 22 and 103 give the cause.
- Correction: "Give no list file in the `Changes:` line of the loading reviewer, because <one short cause, for example that the loading rules give a list file no file-size limit>."
