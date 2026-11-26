Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,941 bytes and 151 lines. Limit: a maximum of 20,000 bytes (loading-rules.md), and less than 500 lines (agent-skills-spec.md).

Pointer conditions (section "Steps of the write job and the edit job"):
- Line 91: "Before you select target platforms, read `references/loading-rules.md`." - condition given.
- Line 91: "Then find the target platforms as `references/loading-rules.md` tells you." - condition given.
- Line 92: "If the project has a glossary, read `GLOSSARY.md` or `CONTEXT.md`, as "Terms in this skill" tells you." - condition given.
- Line 92: "The only exception is the question at a limit that `references/review.md` gives." - not a pointer; step 11 gives the pointer with its condition.
- Line 97: "For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives." - condition given.
- Line 102: "Before you write text, read `references/ste-rules.md`, `references/plain-language-rules.md`, and `references/technical-terms.md`." - condition given.
- Line 102: "If the file that you write or edit is a Skill, also read `references/agent-skills-spec.md`." - condition given.
- Line 102: the 2 pointers to `references/loading-rules.md` start with "In the write job" and "In the edit job" - conditions given.
- Line 103: "Before the self-check, read `references/review.md`." - condition given.
- Line 103: "In each job, also for a small change, do the vote of the confirmers that `references/review.md` gives." - condition given.
- Line 104: "In the other jobs, after the self-check, do the reader test that `references/review.md` gives, also for a small change." - condition given.
- Line 105: "In the other jobs, after the reader test passes, do the output tests and the manual checks ..." - condition given.
- Line 106: "If a blocking problem stays open at a limit, do the steps in ..." - condition given.

Text to move: none. The section gives the numbered steps of the main task of the Skill, which item 2 of "When the write job makes a SKILL.md or entry-file text" in loading-rules.md keeps in the file.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the job changes only list files, go to step 11."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 104 (step 9) already tells the agent to go to step 11 when the job changes only list files, so the agent never does step 10 in that case and the first sentence of line 105 (step 10) has no effect.
- Correction: Remove the sentence. Start step 10 with "In the other jobs, after the reader test passes, do the output tests and the manual checks that ..."
