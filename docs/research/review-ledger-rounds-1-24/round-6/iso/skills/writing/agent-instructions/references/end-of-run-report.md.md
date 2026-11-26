Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 48: "When you write this item, find the known cases in that table."

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6357 bytes, 69 lines. Limit: none. "When you examine the file size" in loading-rules.md gives limits only for entry files and SKILL.md, not for a reference file.

Pointer conditions (sections under review):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - condition: "When you write this item". Gives the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - condition: "When you write this item". Gives the condition.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - this sentence names a warning item, not an instruction to read. The instruction to read is the next sentence, "When you write this item, find the known cases in that table.", which gives the condition but names no file.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - names a warning item, not a pointer.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - condition: "In the edit job, before you write the report". Gives the condition.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - condition: a reviewer other than the loading reviewer tells you to move text in an unchanged part (previous sentences of the item). Gives the condition.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - condition: "For a manual check". Gives the condition.

Pointers that name no file:
- Line 48: "When you write this item, find the known cases in that table."

Moved text: none.
Text to move: none. This file is a reference file.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "When you write this item, find the known cases in that table."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 48, this sentence tells the agent to read a table but gives "that table" instead of the path of its file, and the sentence before it only names a warning item.
- Correction: When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`.
