Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 12: "When a term is not in this section, find it in `references/technical-terms.md`."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,938 bytes, 151 lines. Limit: 20,000 bytes (`references/loading-rules.md`, "When you examine the file size", Skills row). The file is less than the limit.

Pointer conditions (each sentence in the pointer list of SKILL.md that tells the agent to read or use a file):
- Line 12, heading "Terms in this skill": the sentence gives the condition "When a term is not in this section". The heading is a topic heading (see finding 1).
- Line 40, heading "Terms in this skill": the sentence defines a term and does not tell the agent to read the file. `references/end-of-run-report.md` line 63 gives the condition to read that section. No finding.
- Line 91: "Before you select target platforms" - condition given.
- Line 92: "If the project has a glossary" - condition given. The sentence about `references/review.md` refers to step 11, which gives the condition.
- Line 97: "For text that is applicable in each session" - condition given.
- Line 102: "Before you write text", "If the file that you write or edit is a Skill", "In the write job", "In the edit job" - conditions given.
- Lines 103 to 106: "Before the self-check", "In each job", "after the self-check", "after the reader test passes", "If a blocking problem stays open at a limit" - conditions given.
- Line 111, heading "When a reviewer gives a finding": "When a reviewer or the check script gives a finding" - condition given in the heading and the sentence.
- Line 117, heading "When you run the check script": "When you do the self-check" - condition given.
- Line 140, heading "When you run the check script": "For the reader reports of a reader-test round" - condition given.
- Line 151, heading "When you write the end-of-run report": condition given in the heading and the sentence.
- Lines 68, 76, 79, 80, 81, heading "When two sources do not agree": the heading and the case column give the condition.
- Lines 3, 15 to 17, 21 to 23, 46 to 48, 83: these sentences name files as examples or definitions, not as pointers.

Pointers that name no file: none.

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "When a term is not in this section, find it in `references/technical-terms.md`."
- Problem: In skills/writing/agent-instructions/SKILL.md line 12, the pointer is in the section "Terms in this skill" (line 10), which is a topic heading and gives no condition for the pointer.
- Correction: Keep the heading "Terms in this skill", because step 2 and `references/review.md` refer to it. Move the pointer to a new level 3 section at the end of that section: "### When a term is not in this section" with the text "When a term is not in "Terms in this skill", find it in `references/technical-terms.md`."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In a review round, the first 2 confirmers of a reviewer get all blocking findings of that reviewer."
- Problem: In skills/writing/agent-instructions/SKILL.md line 27, the definition of a confirmer repeats the vote procedure that "When a reviewer has blocking findings" in `references/review.md` (lines 168 to 174) gives, and the agent reads that file before the vote.
- Correction: Remove the sentences "In a review round, the first 2 confirmers of a reviewer get all blocking findings of that reviewer. A third confirmer gets only the findings with one "yes" and one "no"." Keep the other sentences of the definition.

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The **self-check** is the review of the changed sections by one reviewer subagent of each class, in a maximum of 2 rounds."
- Problem: In skills/writing/agent-instructions/SKILL.md line 34, the definition gives one reviewer of each class, but step 8 (line 103) and `references/review.md` line 71 start no loading reviewer for a list file.
- Correction: "The **self-check** is the review of the changed sections by one reviewer subagent of each class that `references/review.md` starts for the file, in a maximum of 2 rounds."
