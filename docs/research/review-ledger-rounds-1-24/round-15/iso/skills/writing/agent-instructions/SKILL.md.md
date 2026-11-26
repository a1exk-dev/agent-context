Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 103: "Then do the self-check that it gives."

File size:
- skills/writing/agent-instructions/SKILL.md: 17,948 bytes. Limit: a maximum of 20,000 bytes (loading-rules.md). 151 lines. Limit: less than 500 lines (agent-skills-spec.md).

Pointer conditions (heading and sentence), SKILL.md:
- Line 12, "Terms in this skill": "When a term is not in this section, find it in `references/technical-terms.md`." - the sentence gives the condition.
- Line 40, "Terms in this skill": "In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections." - the sentence gives the condition.
- Line 76, "When two sources do not agree": "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you." - the sentence gives the condition.
- Line 80, "When two sources do not agree": "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - the sentence gives the condition.
- Line 81, "When two sources do not agree": "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - the sentence gives the condition.
- Line 91, "Steps of the write job and the edit job": "Before you select target platforms, read `references/loading-rules.md`." - the sentence gives the condition.
- Line 92: "If the project has a glossary, read `GLOSSARY.md` or `CONTEXT.md`, as "Terms in this skill" tells you." - the sentence gives the condition.
- Line 97: "For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives." - the sentence gives the condition.
- Line 102: the pointers to `references/ste-rules.md`, `references/plain-language-rules.md`, `references/technical-terms.md`, `references/agent-skills-spec.md`, and `references/loading-rules.md` each give the condition.
- Lines 103 to 106: the pointers to `references/review.md` each give the condition. Line 103 "Then do the self-check that it gives." gives no path (checklist item 4).
- Line 111, "When a reviewer gives a finding": "When a reviewer or the check script gives a finding, read `references/review.md`." - the heading and the sentence give the condition.
- Line 117, "When you run the check script": "When you do the self-check, `references/review.md` tells you when to run the check script." - the heading and the sentence give the condition.
- Line 140, "When you run the check script": the pointer to `references/review.md` gives the condition "For the reader reports of a reader-test round".
- Line 151, "When you write the end-of-run report": "When you write the end-of-run report, read `references/end-of-run-report.md`." - the heading and the sentence give the condition.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Then do the self-check that it gives."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), this sentence tells the agent to do the self-check of a file, but it identifies that file only with the pronoun "it" and gives no path.
- Correction: "Then do the self-check that `references/review.md` gives."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do the vote also when you expect to reject the findings."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), this sentence gives the same instruction as the pointer target references/review.md line 168 ("Also do the vote when you expect to reject the findings.").
- Correction: Remove the sentence "Do the vote also when you expect to reject the findings." from step 8.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Start no confirmers for a reviewer that has no report in a confirm list."
- Problem: In skills/writing/agent-instructions/SKILL.md line 137, this sentence gives the same instruction as the pointer target references/review.md line 155 ("Do not start confirmers for a reviewer that has no report in a confirm list.").
- Correction: Remove the sentence "Start no confirmers for a reviewer that has no report in a confirm list." from the list item at line 137.
