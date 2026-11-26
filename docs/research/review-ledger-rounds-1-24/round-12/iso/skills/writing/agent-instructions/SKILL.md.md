Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,948 bytes, 151 lines. Limit: 20,000 bytes (references/loading-rules.md, "When you examine the file size"), and less than 500 lines (references/agent-skills-spec.md, tier 4).

Pointer conditions (sentences in the pointer list that are pointers):
- Line 12, "Terms in this skill": "When a term is not in this section, find it in `references/technical-terms.md`." - the sentence gives the condition.
- Line 40, "Terms in this skill": "In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections." - the sentence gives the condition.
- Line 76, "When two sources do not agree": "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you." - the heading and the sentence give the condition.
- Line 80, "When two sources do not agree": "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 81, "When two sources do not agree": "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 91, "Steps of the write job and the edit job": "Before you select target platforms, read `references/loading-rules.md`." and "Then find the target platforms as `references/loading-rules.md` tells you." - the sentences give the condition.
- Line 92: "If the project has a glossary, read `GLOSSARY.md` or `CONTEXT.md`, as "Terms in this skill" tells you." - the sentence gives the condition.
- Line 97: "For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives." - the sentence gives the condition.
- Line 102: the 4 pointers to `references/ste-rules.md`, `references/plain-language-rules.md`, `references/technical-terms.md`, `references/agent-skills-spec.md`, and `references/loading-rules.md` - each sentence gives the condition ("Before you write text", "If the file that you write or edit is a Skill", "In the write job", "In the edit job").
- Lines 103 to 106: the pointers to `references/review.md` - each sentence gives the condition ("Before the self-check", "In each job", "In the other jobs, after the self-check", "after the reader test passes", "If a blocking problem stays open at a limit").
- Line 111, "When a reviewer gives a finding": "When a reviewer or the check script gives a finding, read `references/review.md`." - the heading and the sentence give the condition.
- Line 117, "When you run the check script": "When you do the self-check, `references/review.md` tells you when to run the check script." - the heading and the sentence give the condition.
- Line 140, "When you run the check script": "For the reader reports of a reader-test round, give each file of the readers with its copy, and the tasks file that `references/review.md` gives." - the heading and the sentence give the condition.
- Line 151, "When you write the end-of-run report": "When you write the end-of-run report, read `references/end-of-run-report.md`." - the heading and the sentence give the condition.
- Pointers that name no file: none.

Findings:

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory)"
- Text: "For a list file, start no loading reviewer in the self-check."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), this changed rule removes one of the 3 reviewers that the self-check usually starts, but no file gives the cause (references/review.md line 71 gives the same rule without a cause).
- Correction: "For a list file, start no loading reviewer in the self-check, because <the cause>." If no file and no user gives the cause, add a warning.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In a review round, the first 2 confirmers of a reviewer get all blocking findings of that reviewer. A third confirmer gets only the findings with one "yes" and one "no"."
- Problem: In skills/writing/agent-instructions/SKILL.md line 27, these 2 sentences copy the procedure of items 1 to 4 of "When a reviewer has blocking findings" in references/review.md, which the agent reads before the self-check (step 8, line 103).
- Correction: Remove the 2 sentences. Keep "A **confirmer** is a new subagent that answers "yes" or "no", with one sentence, for each problem in its prompt."
