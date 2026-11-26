Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 63: "Then find each extraction candidate in the unchanged parts as that section tells you."

File size: skills/writing/agent-instructions/references/end-of-run-report.md has 6417 bytes and 69 lines. Limit: none. "When you examine the file size" in references/loading-rules.md gives limits only for entry files and `SKILL.md`, and gives no limit for a reference file of a Skill.

Pointer conditions (pointer list sentences of this file):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - The heading "When you write the end-of-run report" and the sentence give the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - The heading and the sentence give the condition.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - Not a pointer. It is a list item that names a warning.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - The heading and the sentence give the condition.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - Not a pointer. It is a list item that names a warning.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - The heading and the sentence give the condition.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - The heading and the previous sentence on line 64 ("A reviewer other than the loading reviewer can tell you to move text in an unchanged part.") give the condition.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - The heading and the sentence give the condition.

Pointers that name no file:
- Line 63: "Then find each extraction candidate in the unchanged parts as that section tells you."

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Then find each extraction candidate in the unchanged parts as that section tells you."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 63, this sentence tells the agent to use a section of a different file, but "that section" gives no heading and no path of the target.
- Correction: "Then find each extraction candidate in the unchanged parts as "When you recommend text to move" in `references/loading-rules.md` tells you."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 9, step 3 is a rule, not a pointer, and it writes again the condition of the heading "When you write the end-of-run report" on line 3.
- Correction: "Compare the report with each reviewer report."
