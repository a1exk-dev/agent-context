Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 12: "When a term is not in this section, find it in `references/technical-terms.md`."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,941 bytes, limit 20,000 bytes (loading-rules.md, "When you examine the file size"). 151 lines, limit 500 lines (agent-skills-spec.md, "When you write the body").

Pointer conditions (heading and sentence):
- Line 12, heading "Terms in this skill": the sentence gives the condition "When a term is not in this section". The heading is a topic heading and gives no condition.
- Line 40, heading "Terms in this skill": the sentence gives the condition "In the edit job".
- Lines 68, 76, 80, 81, heading "When two sources do not agree": the heading and each sentence give the condition.
- Lines 91, 92, 97, 102, 103, 104, 105, 106, heading "Steps of the write job and the edit job": each sentence gives the condition.
- Line 111, heading "When a reviewer gives a finding": the heading and the sentence give the condition.
- Lines 117, 140, heading "When you run the check script": the heading and each sentence give the condition.
- Line 151, heading "When you write the end-of-run report": the heading and the sentence give the condition.
- Lines 3, 15, 16, 17, 21, 22, 23, 46, 47, 48, 79, 83, 123: these sentences name files as examples or definitions. They are not pointers.
- Pointers that name no file: none.

Findings:

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "When a term is not in this section, find it in `references/technical-terms.md`."
- Problem: In skills/writing/agent-instructions/SKILL.md line 12, the pointer to references/technical-terms.md is under the topic heading "Terms in this skill" (line 10), which gives no condition.
- Correction: Remove the sentence from line 12. After line 40, add a level 3 section: "### When a term is not in "Terms in this skill"" with the pointer "When a term is not in "Terms in this skill", find it in `references/technical-terms.md`."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do the vote also when you expect to reject the findings."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103, this sentence and "also for a small change" give the same rules as references/review.md line 168, which step 8 tells the agent to read.
- Correction: "8. Before the self-check, read `references/review.md`. Then do the self-check and the vote of the confirmers that it gives. For a list file, start no loading reviewer in the self-check."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do not give a list file to the readers, because a list file gives no task to test."
- Problem: In skills/writing/agent-instructions/SKILL.md line 104, this sentence gives the same rule and cause as references/review.md line 211, which the same step tells the agent to read.
- Correction: Remove the sentence "Do not give a list file to the readers, because a list file gives no task to test." from step 9.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, do no output test, no load test, and no manual check."
- Problem: In skills/writing/agent-instructions/SKILL.md line 105, this sentence gives the same rule as references/review.md line 320, and the first sentence of step 10 already sends a job with only list files to step 11.
- Correction: Remove the sentence "For a list file, do no output test, no load test, and no manual check." from step 10.

- Rule: "Add one short cause to a rule in each of these cases:" "The rule is not usual for the agent. (advisory)"
- Text: "If the project has the two files, use `GLOSSARY.md`."
- Problem: In skills/writing/agent-instructions/SKILL.md line 21, the rule selects `GLOSSARY.md` over `CONTEXT.md` with no cause, and no file of the Skill tells why this selection is necessary.
- Correction: "If the project has the two files, use `GLOSSARY.md`, because other Skills of the project can read only `GLOSSARY.md`."
