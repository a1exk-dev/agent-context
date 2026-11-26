Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes, limit 20,000 bytes (loading-rules.md). 151 lines, limit less than 500 lines (agent-skills-spec.md).

Pointer conditions (pointers of the pointer list in the sections under review):
- Line 12, heading "Terms in this skill": "When a term is not in this section, find it in `references/technical-terms.md`." - The sentence gives the condition.
- Line 40, heading "Terms in this skill": "In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections." - The sentence gives the condition "In the edit job". references/end-of-run-report.md line 63 tells when to read that section.
- Line 76, heading "When two sources do not agree": "When a Skill has a known problem, put the known problem where `references/agent-skills-spec.md` tells you." - The sentence gives the condition.
- Line 80, heading "When two sources do not agree": "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - The sentence gives the condition.
- Line 81, heading "When two sources do not agree": "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - The sentence gives the condition.
- Line 117, heading "When you run the check script": "When you do the self-check, `references/review.md` tells you when to run the check script." - The heading and the sentence give the condition.
- Line 140, heading "When you run the check script": "For the reader reports of a reader-test round, give each file of the readers with its copy, and the tasks file that `references/review.md` gives." - The heading and the sentence give the condition.
- The other sentences of the pointer list in these sections (lines 15, 16, 17, 21, 22, 23, 46, 47, 48, 79, 80 first cell, 83, 117 first sentence, 123) give definitions, examples, facts, or a path for a placeholder. They are not pointers.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The **self-check** is the review of the changed sections by one reviewer subagent of each class, in a maximum of 2 rounds."
- Problem: In skills/writing/agent-instructions/SKILL.md line 34, the definition gives one reviewer of each class, but step 8 on line 103 and references/review.md line 61 start no loading reviewer for a list file.
- Correction: "The **self-check** is the review of the changed sections by reviewer subagents, one of each class that `references/review.md` starts, in a maximum of 2 rounds."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The report form of the script examines the 3 reviewer reports of one file."
- Problem: In skills/writing/agent-instructions/SKILL.md line 130, the text gives 3 reviewer reports for each file, but references/review.md line 61 gives only 2 reviewers and 2 reports for a list file, and the exception in line 61 is only for the text of `review.md`.
- Correction: "The report form of the script examines the reviewer reports of one file: 3 reports, or 2 reports for a list file."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Start no confirmers for a reviewer that has no report in a confirm list."
- Problem: In skills/writing/agent-instructions/SKILL.md line 137, the sentence gives the same instruction as references/review.md line 156 ("Do not start confirmers for a reviewer that has no report in a confirm list."), and line 117 of SKILL.md points to references/review.md for the self-check.
- Correction: Remove the sentence "Start no confirmers for a reviewer that has no report in a confirm list." from line 137.
