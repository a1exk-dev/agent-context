Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/end-of-run-report.md has 6,268 bytes and 69 lines. Limit: loading-rules.md gives no file-size limit for a reference file of a Skill.

Pointer conditions (heading "When you write the end-of-run report"):
- Line 36: condition "When you write this item" - the condition is given.
- Line 38: condition "When you write this item" - the condition is given.
- Line 48: names `SKILL.md` as the source of the table; the list condition "In the Warnings part" and the heading give the condition.
- Line 56: names `agents/openai.yaml` as the subject of a warning, not as a file to read.
- Line 63: condition "In the edit job, before you write the report" - the condition is given.
- Line 64: condition "A reviewer other than the loading reviewer can tell you to move text in an unchanged part" - the condition is given.
- Line 67: condition "For a manual check" - the condition is given.
Pointers that name no file: none.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, step 1 on line 7 tells the agent to find each extraction candidate, but the step that makes this possible (read the loading-rules.md section first) is on line 63, after the template, so the necessary condition comes after the step that needs it.
- Correction: Put this step in the numbered list before the current step 1: "1. In the edit job, read "When you recommend text to move" in `references/loading-rules.md`. Then find each extraction candidate as that section tells you." Remove the sentence on line 63.

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 9 writes again the condition of the heading "When you write the end-of-run report" on line 3.
- Correction: "Compare the report with each reviewer report."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Write each candidate in the Extraction candidates part, also when the file is less than its size limit."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 63 gives again what the pointer target skills/writing/agent-instructions/references/loading-rules.md gives in "When you recommend text to move" on lines 89 and 93.
- Correction: Remove the sentence.
