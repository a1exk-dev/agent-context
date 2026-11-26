Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 48: "When you write this item, find the known cases in that table."

File sizes:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6,330 bytes, 69 lines. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointers in the pointer list for this file, and their conditions:
- Line 36, heading "When you write the end-of-run report": "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - gives the condition "When you write this item" and the path.
- Line 38, heading "When you write the end-of-run report": "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - gives the condition and the path.
- Line 48, heading "When you write the end-of-run report": "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - the sentence that tells the agent to read the target ("When you write this item, find the known cases in that table.") gives the condition but names no file.
- Line 56, heading "When you write the end-of-run report": "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - not a pointer. The sentence names the file of a warning item, not a file to read.
- Line 63, heading "When you write the end-of-run report": "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - gives the condition and the path.
- Line 64, heading "When you write the end-of-run report": "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - gives the condition (a reviewer other than the loading reviewer tells you to move text in an unchanged part) and the path.
- Line 67, heading "When you write the end-of-run report": "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - gives the condition and the path.

Text to move: none. Moved text: none.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "When you write this item, find the known cases in that table."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 48, the sentence that tells the agent to read the target gives "that table" and no path, but the other pointers of the same list (lines 36 and 38) give the path of the target in the sentence that tells the agent to read it.
- Correction: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 9, step 3 writes again the condition of the heading "When you write the end-of-run report" on line 3.
- Correction: "Compare the report with each reviewer report."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Write each candidate in the Extraction candidates part, also when the file is less than its size limit."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 63, this sentence gives again what the pointer target "When you recommend text to move" in references/loading-rules.md (lines 89 and 93) gives: the recommendation is applicable also when the file size is less than the limit, and each extraction candidate goes in the Extraction candidates part of the report.
- Correction: Remove the sentence "Write each candidate in the Extraction candidates part, also when the file is less than its size limit." and keep "Then find each extraction candidate in the unchanged parts as that section tells you."
