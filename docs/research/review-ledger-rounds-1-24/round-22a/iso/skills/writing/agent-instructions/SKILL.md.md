Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes, limit 20,000 bytes (loading-rules.md). 151 lines, limit less than 500 lines (agent-skills-spec.md).

Pointer conditions (pointers in the pointer list of SKILL.md):
- Line 12 "When a term is not in this section, find it in `references/technical-terms.md`." - the sentence gives the condition.
- Line 76 "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you." - the heading and the sentence give the condition.
- Line 80 "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 81 "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 91 "Before you select target platforms, read `references/loading-rules.md`." - the sentence gives the condition.
- Line 97 "For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives." - the step and the sentence give the condition.
- Line 102 "Before you write text, read `references/ste-rules.md`, `references/plain-language-rules.md`, and `references/technical-terms.md`." - the sentence gives the condition.
- Line 102 "If the file that you write or edit is in the folder of a Skill, also read `references/agent-skills-spec.md`." - the sentence gives the condition.
- Line 102 the 2 sentences "In the write job, also move text ..." and "In the edit job, move text ..." - each sentence gives the condition.
- Line 103 "Before the self-check, read `references/review.md`." and "Then do the self-check that `references/review.md` gives." - the sentences give the condition.
- Lines 104, 105, and 106 - each sentence gives the condition.
- Line 111 "When a reviewer or the check script gives a finding, read `references/review.md`." - the heading and the sentence give the condition.
- Line 117 "When you do the self-check, `references/review.md` tells you when to run the check script." - the heading and the sentence give the condition.
- Line 140 "For the reader reports of a reader-test round, give each file of the readers with its copy, and the tasks file that `references/review.md` gives." - the heading and the sentence give the condition.
- Line 151 "When you write the end-of-run report, read `references/end-of-run-report.md`." - the heading and the sentence give the condition.
- The other sentences in the pointer list of SKILL.md give examples, definitions, or facts. They are not pointers.
- Pointers that name no file: none.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do the vote also when you expect to reject the findings."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103, step 8 gives the same instruction as references/review.md line 169 ("Also do the vote when you expect to reject the findings."), and step 8 tells the agent to read references/review.md before the self-check.
- Correction: Remove the sentence "Do the vote also when you expect to reject the findings." from step 8.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do not give a list file to the readers, because a list file gives no task to test."
- Problem: In skills/writing/agent-instructions/SKILL.md line 104, step 9 gives the same instruction and cause as references/review.md line 212, which the reader test of step 9 points to.
- Correction: Remove the sentence "Do not give a list file to the readers, because a list file gives no task to test." from step 9.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, do no output test, no load test, and no manual check."
- Problem: In skills/writing/agent-instructions/SKILL.md line 105, step 10 gives the same instruction as references/review.md line 321 ("Select no output test, no load test, and no manual check for a list file."), and step 10 points to that section.
- Correction: Remove the sentence "For a list file, do no output test, no load test, and no manual check." from step 10.

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The **self-check** is the review of the changed sections by one reviewer subagent of each class, in a maximum of 2 rounds."
- Problem: In skills/writing/agent-instructions/SKILL.md line 34, the definition gives one reviewer of each class, but step 8 on line 103 and references/review.md line 61 start no loading reviewer for a list file.
- Correction: "The **self-check** is the review of the changed sections by reviewer subagents, one of each class that `references/review.md` starts, in a maximum of 2 rounds."
