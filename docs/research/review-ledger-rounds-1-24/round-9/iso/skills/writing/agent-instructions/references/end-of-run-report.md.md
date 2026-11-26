Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6417 bytes. Limit: none, because the table in "When you examine the file size" in references/loading-rules.md gives no limit for a reference file of a Skill.

Text to move:
- none. The rules in "When the write job makes a SKILL.md or entry-file text" and "When the edit job changes a SKILL.md or an entry file" in references/loading-rules.md are for a SKILL.md file and entry-file text, and this file is a reference file.

Pointer conditions (heading of each pointer: "When you write the end-of-run report"):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - gives the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - gives the condition.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - not a pointer. It gives the item of the warning. The next sentence is the pointer.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - gives the condition.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - not a pointer. It names the file as the item of the warning.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - gives the condition.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - gives the condition, together with the heading and the sentence before it on line 64.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - gives the condition.

Pointers that name no file:
- none. Line 9, "Include each warning that this skill or its reference files tell you to add.", does not tell the agent to read a file, so it is not a pointer.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 9 (step 3) writes the condition of the heading "When you write the end-of-run report" (line 3) again, and this sentence is not a pointer.
- Correction: "Compare the report with each reviewer report."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 38 sends the agent only to item 5, but item 4 of "During and after a review round" in references/review.md (line 156) also tells the agent to put each script finding about text that it cannot edit in a warning, and no item of the Warnings list on lines 36 to 56 gives that warning.
- Correction: "When you write this item, find these findings in items 4 and 5 of "During and after a review round" in `references/review.md`."
