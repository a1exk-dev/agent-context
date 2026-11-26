Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6,471 bytes, 69 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer conditions (heading "When you write the end-of-run report"):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - gives the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - gives the condition.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - gives the condition.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - gives the condition.
- Line 63: "Then find each extraction candidate in the unchanged parts as "When you recommend text to move" in `references/loading-rules.md` tells you." - gives the condition through "Then" and the previous sentence in the same item.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - does not give the condition.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - gives the condition.

Pointers that name no file: none

Text to move: none

Findings:

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 64, the heading and this pointer do not give the condition to read the target, because the condition "If ... gives that section" is known only after the agent reads the target, and the previous sentence "A reviewer other than the loading reviewer can tell you to move text in an unchanged part." states a possibility, not a condition.
- Correction: "When a reviewer other than the loading reviewer tells you to move text in an unchanged part, find the section of that text. Then read "When you recommend text to move" in `references/loading-rules.md`. If that section of `references/loading-rules.md` gives the section of that text, add the section of that text to the Extraction candidates part."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 9, the condition "When you write the report" repeats the condition of the heading "When you write the end-of-run report" on line 3, and step 2 on line 8 already tells the agent to write the report.
- Correction: "Compare the report with each reviewer report."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When no user was available to answer, give the question with its 3 answers. Then write that the change did not pass."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 36, these 2 sentences give again the rules of the pointer target "When a blocking problem stays open at a limit" in skills/writing/agent-instructions/references/review.md line 383, and the same item already points to that section.
- Correction: Remove the 2 sentences. Keep "Each blocking problem that stayed open at a limit, with the question to the user and the answer. When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`."
