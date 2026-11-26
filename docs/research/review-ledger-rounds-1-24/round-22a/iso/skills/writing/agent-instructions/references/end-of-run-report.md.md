Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/end-of-run-report.md has 6,471 bytes and 69 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script for this file):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - The sentence gives the condition and the path.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - The sentence gives the condition and the path.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - The sentence gives the condition and the path. The first sentence of line 48 names `SKILL.md` only to identify the warning, and is not a pointer.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - Not a pointer. It names the file of a warning.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - The sentence gives the condition and the path. The next sentence on line 63 continues the same step with the same path.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - The sentence gives the condition and the path.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - The sentence gives the condition and the path.
- Heading "When you write the end-of-run report" gives the condition for all rules and pointers of the file.

Pointers that name no file: none.

Text to move: none. The file is a reference file, and the template is already in a reference file.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Write each extraction candidate in the Extraction candidates part, also when the file is less than its file-size limit."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 63, this sentence repeats the pointer target skills/writing/agent-instructions/references/loading-rules.md, line 89 ("also when the file size is less than the limit") and line 93 (item 3, "Write each extraction candidate in the Extraction candidates part of the report."), and step 3 on line 9 of the same file also tells the agent to include each extraction candidate.
- Correction: Remove the sentence. Keep "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`. Then find each extraction candidate in the unchanged parts as "When you recommend text to move" in `references/loading-rules.md` tells you."
