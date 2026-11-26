Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 63: "Then find each extraction candidate in the unchanged parts as that section tells you."

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6,417 bytes. Limit: none. The table in "When you examine the file size" in references/loading-rules.md gives no limit for a reference file.

Pointer conditions (section "When you write the end-of-run report"):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - The sentence gives the condition "When you write this item". Condition given.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - The sentence gives the condition "When you write this item". Condition given.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - The heading and the list item give the condition: a case that the table does not give. Condition given.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - The sentence gives the condition "When you write this item". Condition given.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - This sentence names a file but does not tell the agent to read it. It is not a pointer.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - The sentence gives the condition "In the edit job, before you write the report". Condition given.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - The previous sentences give the condition: a reviewer other than the loading reviewer tells you to move text in an unchanged part. Condition given.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - The sentence gives the condition "For a manual check". Condition given.

Findings:

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Then find each extraction candidate in the unchanged parts as that section tells you."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 63, the sentence sends the agent to the instructions of a section of a different file with the words "that section", which give no path; SKILL.md line 91 writes the path again in the same type of sentence.
- Correction: "Then find each extraction candidate in the unchanged parts as "When you recommend text to move" in `references/loading-rules.md` tells you."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 9, the words "When you write the report" give again the condition of the heading "When you write the end-of-run report" on line 3, and the sentence is not a pointer.
- Correction: "Compare the report with each reviewer report."
