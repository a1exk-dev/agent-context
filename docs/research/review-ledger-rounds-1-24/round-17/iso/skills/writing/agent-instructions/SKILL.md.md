Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes. Limit: a maximum of 20,000 bytes (references/loading-rules.md, "When you examine the file size").
- skills/writing/agent-instructions/SKILL.md: 151 lines. Limit: less than 500 lines (references/agent-skills-spec.md, "When you write the body").

Pointer conditions (each sentence in the pointer list for SKILL.md that is a pointer):
- Line 12, "Terms in this skill": "When a term is not in this section, find it in `references/technical-terms.md`." - gives the condition.
- Line 40, "Terms in this skill": "In the edit job, \"When you recommend text to move\" in `references/loading-rules.md` gives these sections." - gives the condition.
- Line 68, "When two sources do not agree": pointer to `references/loading-rules.md` - the heading gives the condition.
- Line 76, "When two sources do not agree": "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you." - gives the condition.
- Line 80, "When two sources do not agree": "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - gives the condition.
- Line 81, "When two sources do not agree": "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - gives the condition.
- Line 91, "Steps of the write job and the edit job": both pointers to `references/loading-rules.md` - give the condition "Before you select target platforms".
- Line 92, "Steps of the write job and the edit job": "If the project has a glossary, read `GLOSSARY.md` or `CONTEXT.md`, as \"Terms in this skill\" tells you." - gives the condition.
- Line 97, "Steps of the write job and the edit job": pointer to `references/loading-rules.md` - gives the condition "For text that is applicable in each session" in the write job.
- Line 102, "Steps of the write job and the edit job": the 4 pointers give the conditions "Before you write text", "If the file that you write or edit is in the folder of a Skill", "In the write job", and "In the edit job".
- Lines 103 to 106, "Steps of the write job and the edit job": the pointers to `references/review.md` give the conditions "Before the self-check", "In each job", "In the other jobs, after the self-check", "In the other jobs, after the reader test passes", and "If a blocking problem stays open at a limit".
- Line 111, "When a reviewer gives a finding": "When a reviewer or the check script gives a finding, read `references/review.md`." - gives the condition.
- Line 117, "When you run the check script": "When you do the self-check, `references/review.md` tells you when to run the check script." - gives the condition.
- Line 140, "When you run the check script": pointer to `references/review.md` - gives the condition "For the reader reports of a reader-test round".
- Line 151, "When you write the end-of-run report": "When you write the end-of-run report, read `references/end-of-run-report.md`." - gives the condition.
- The other sentences in the pointer list for SKILL.md (lines 3, 15 to 17, 21 to 23, 46 to 48, 79, 83, 92 "The only exception is the question at a limit that `references/review.md` gives.", and 123) name a file as an example, a definition, or a reference. They do not tell the agent to read a file, so they are not pointers.

Pointers that name no file: none.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, start no loading reviewer in the self-check."
- Problem: SKILL.md line 103 (step 8) gives a rule that references/review.md line 71 ("When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round") already gives, and step 8 tells the agent to read references/review.md before the self-check.
- Correction: Remove the sentence "For a list file, start no loading reviewer in the self-check." from step 8.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do not give a list file to the readers, because a list file gives no task to test."
- Problem: SKILL.md line 104 (step 9) gives a rule that references/review.md line 211 ("When the job also changes a different file, give the readers only the files that are not list files") already gives, and step 9 tells the agent to do the reader test that references/review.md gives.
- Correction: Remove the sentence "Do not give a list file to the readers, because a list file gives no task to test." from step 9.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, do no output test, no load test, and no manual check."
- Problem: SKILL.md line 105 (step 10) gives a rule that references/review.md line 320 ("Select no output test, no load test, and no manual check for a list file.") already gives, and step 10 tells the agent to do the tests that this section of references/review.md gives.
- Correction: Remove the sentence "For a list file, do no output test, no load test, and no manual check." from step 10.

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The **self-check** is the review of the changed sections by one reviewer subagent of each class, in a maximum of 2 rounds."
- Problem: SKILL.md line 34 tells that the self-check has one reviewer of each class, but SKILL.md line 103 and references/review.md line 71 tell the agent to start no loading reviewer when each changed file is a list file.
- Correction: "The **self-check** is the review of the changed sections by the reviewer subagents, in a maximum of 2 rounds. For a list file, the self-check has no loading reviewer."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The report form of the script examines the 3 reviewer reports of one file."
- Problem: SKILL.md line 130 gives 3 reviewer reports for each file, but references/review.md line 71 tells the agent to use only 2 reports for a list file, because the loading reviewer gives no report for a list file.
- Correction: "The report form of the script examines the reviewer reports of one file: 3 reports, or 2 reports for a list file."
