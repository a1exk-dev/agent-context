Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6,405 bytes, 69 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`. This file is a reference file of a Skill.

Pointer conditions (heading of each pointer: "When you write the end-of-run report"):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - condition given: "When you write this item".
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - condition given: "When you write this item".
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - not a pointer: it gives the scope of a warning item. The next sentence is the pointer.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - condition given: "When you write this item".
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - not a pointer: it gives a warning item.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - condition given: "In the edit job, before you write the report".
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - condition given: the previous sentence on line 64 ("A reviewer other than the loading reviewer can tell you to move text in an unchanged part.") and the "If" clause.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - condition given: "For a manual check".

Pointers that name no file: none.

Text to move in the sections under review: none. The file is a reference file. The numbered list in "When the write job makes a SKILL.md or entry-file text" in loading-rules.md moves text from a `SKILL.md` or entry-file text, and the template on lines 14 to 30 is already in a reference file.

Moved text: none. The Changes line gives no moved section for this file.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 9 (step 3) writes again the condition of the heading "When you write the end-of-run report" on line 3, and the sentence is not a pointer.
- Correction: "Compare the report with each reviewer report."
