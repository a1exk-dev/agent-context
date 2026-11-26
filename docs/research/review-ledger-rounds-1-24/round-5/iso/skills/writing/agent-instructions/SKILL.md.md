Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,941 bytes, limit 20,000 bytes (references/loading-rules.md, "When you examine the file size"). 151 lines, limit less than 500 lines (references/agent-skills-spec.md, "When you write the body").

Pointer conditions (SKILL.md, from the pointer list of check.json):
- Line 12 "When a term is not in this section, find it in `references/technical-terms.md`." - the sentence gives the condition.
- Line 40 "In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections." - the sentence gives the condition.
- Lines 68, 76, 80, 81 (heading "When two sources do not agree") - the heading gives the condition, and lines 76, 80, and 81 also give it in the sentence.
- Lines 91, 92, 97, 102, 103, 104, 105, 106 (heading "Steps of the write job and the edit job") - each sentence gives its condition, for example "Before you select target platforms", "at a limit", "Before the self-check", "If a blocking problem stays open at a limit".
- Line 111 (heading "When a reviewer gives a finding") - the heading and the sentence give the condition.
- Lines 117, 123, 140 (heading "When you run the check script") - the heading gives the condition. Line 117 and line 140 also give it in the sentence.
- Line 151 (heading "When you write the end-of-run report") - the heading and the sentence give the condition.
- No pointer names no file.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In each job, also for a small change, do the vote of the confirmers that `references/review.md` gives. Do the vote also when you expect to reject the findings."
- Problem: Step 8 at skills/writing/agent-instructions/SKILL.md line 103 repeats the pointer target skills/writing/agent-instructions/references/review.md line 168, which tells the agent to do the vote in each job, also for a small change, and also when it expects to reject the findings.
- Correction: "Before the self-check, read `references/review.md`. Then do the self-check that it gives, with the vote of the confirmers. For a list file, start no loading reviewer in the self-check."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In the other jobs, after the self-check, do the reader test that `references/review.md` gives, also for a small change. The self-check does not examine how a new reader obeys the file."
- Problem: Step 9 at skills/writing/agent-instructions/SKILL.md line 104 repeats the pointer target skills/writing/agent-instructions/references/review.md line 209, which tells the agent to do the reader test in each job, also for a small change, and gives the same cause.
- Correction: "In the other jobs, after the self-check, do the reader test that `references/review.md` gives."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do not give a list file to the readers, because a list file gives no task to test."
- Problem: Step 9 at skills/writing/agent-instructions/SKILL.md line 104 repeats the pointer target skills/writing/agent-instructions/references/review.md line 211, which tells the agent that the reader test does not examine a list file and to give the readers only the files that are not list files.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, do no output test, no load test, and no manual check."
- Problem: Step 10 at skills/writing/agent-instructions/SKILL.md line 105 repeats the pointer target skills/writing/agent-instructions/references/review.md line 320, which tells the agent to select no output test, no load test, and no manual check for a list file.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In a review round, the first 2 confirmers of a reviewer get all blocking findings of that reviewer."
- Problem: The confirmer term at skills/writing/agent-instructions/SKILL.md line 27 repeats the vote procedure of the pointer target skills/writing/agent-instructions/references/review.md lines 170 to 173, which gives the first 2 confirmers, the third confirmer, and their findings.
- Correction: "A **confirmer** is a new subagent that answers "yes" or "no", with one sentence, for each problem in its prompt. These problems come from a check other than the confirmer. A confirmer gets the rule, the quoted text, and the files, but not the cause that the other check gives. The number of "yes" answers that confirm a problem depends on the check that found the problem."
