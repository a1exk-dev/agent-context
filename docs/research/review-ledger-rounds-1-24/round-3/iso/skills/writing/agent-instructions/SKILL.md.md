Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 103: "Then do the self-check that it gives."

File size:
- skills/writing/agent-instructions/SKILL.md: 17,941 bytes, limit 20,000 bytes. 151 lines, limit less than 500 lines.

Pointer conditions (SKILL.md):
- Line 12, "Terms in this skill": "When a term is not in this section, find it in `references/technical-terms.md`." - the sentence gives the condition.
- Line 40, "Terms in this skill": "In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections." - the sentence gives the condition "In the edit job".
- Line 76, "When two sources do not agree": "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you." - the heading and the sentence give the condition.
- Line 80, "When two sources do not agree": "When you write or edit a Skill, obey the rules for `agents/openai.yaml` in `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 81, "When two sources do not agree": "When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`." - the heading and the sentence give the condition.
- Line 91, "Steps of the write job and the edit job": "Before you select target platforms, read `references/loading-rules.md`." and "Then find the target platforms as `references/loading-rules.md` tells you." - the sentences give the condition.
- Line 92: "The only exception is the question at a limit that `references/review.md` gives." - the sentence gives the condition "at a limit". Step 11 is the pointer that tells when to read the target.
- Line 97: "For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives." - the sentence gives the condition.
- Line 102: the pointers to `references/ste-rules.md`, `references/plain-language-rules.md`, `references/technical-terms.md`, `references/agent-skills-spec.md`, and `references/loading-rules.md` give the conditions "Before you write text", "If the file that you write or edit is a Skill", "In the write job", and "In the edit job".
- Line 103: "Before the self-check, read `references/review.md`." gives the condition. "Then do the self-check that it gives." names no file.
- Lines 104 to 106: the pointers to `references/review.md` give the conditions "after the self-check", "after the reader test passes", and "If a blocking problem stays open at a limit".
- Line 111, "When a reviewer gives a finding": the heading and the sentence give the condition.
- Lines 117 and 140, "When you run the check script": the heading and the sentences give the conditions "When you do the self-check" and "For the reader reports of a reader-test round".
- Line 151, "When you write the end-of-run report": the heading and the sentence give the condition.
- Lines 3, 15 to 17, 21 to 23, 46 to 48, 68, 79, 83, 117, and 123 name files as definitions, examples, or locations. They are not pointers that tell the agent to read a file.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Then do the self-check that it gives."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), the pointer refers to its target with the pronoun "it" and gives no path, but step 1 on line 91 and step 9 on line 104 give the path `references/review.md`.
- Correction: "Then do the self-check that `references/review.md` gives."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The report form of the script examines the 3 reviewer reports of one file."
- Problem: In skills/writing/agent-instructions/SKILL.md line 130, the number 3 does not agree with step 8 on line 103 and with references/review.md line 71, which start no loading reviewer for a list file and give only 2 reports for it.
- Correction: "The report form of the script examines the reviewer reports of one file: 3 reports, or 2 reports for a list file."

- Rule: "The rule changes the usual work of the agent. (advisory)" (a condition of the rule "Add one short cause to a rule in each of these conditions:" in plain-language-rules.md)
- Text: "For a list file, start no loading reviewer in the self-check."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), the rule removes one of the 3 reviewers of the self-check but gives no cause, and references/review.md line 71 and references/loading-rules.md also give no cause, while steps 9 and 10 give a cause for their list-file rules.
- Correction: "For a list file, start no loading reviewer in the self-check, because the loading rules give no file-size limit and no move rule for a list file."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do the vote also when you expect to reject the findings."
- Problem: In skills/writing/agent-instructions/SKILL.md line 103 (step 8), this sentence repeats references/review.md line 168 ("Also do the vote when you expect to reject the findings"), which step 8 tells the agent to read in the same step.
- Correction: Remove the sentence "Do the vote also when you expect to reject the findings." from step 8.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "For a list file, do no output test, no load test, and no manual check."
- Problem: In skills/writing/agent-instructions/SKILL.md line 105 (step 10), this sentence repeats references/review.md line 320 ("Select no output test, no load test, and no manual check for a list file"), which the pointer in the same step identifies.
- Correction: Remove the sentence "For a list file, do no output test, no load test, and no manual check." from step 10.
