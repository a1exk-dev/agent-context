Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/end-of-run-report.md: 6,417 bytes. Limit: none. loading-rules.md "When you examine the file size" gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file. "When the write job makes a SKILL.md or entry-file text" and "When the edit job changes a SKILL.md or an entry file" in loading-rules.md are applicable only to a SKILL.md file and to entry files.

Moved text: none.

Pointer list (heading "When you write the end-of-run report" for each sentence):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." - pointer. The heading and the sentence give the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." - pointer. The heading and the sentence give the condition.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." - warning item. The next sentence on line 48 gives the pointer and its condition.
- Line 48: "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." - pointer. The heading and the sentence give the condition.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." - not a pointer. The sentence names a file of the Skill under edit, not a file to read.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." - pointer. The sentence and the sentence before it on line 64 give the condition: a reviewer other than the loading reviewer tells you to move text in an unchanged part.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." - pointer. The heading and the words "For a manual check" give the condition.

Pointers that name no file:
- None. Line 7 "The rules for the extraction candidates are below the template." and line 8 "These rules are below the template." refer to text in the same file. Line 39 "The pointer list of the check script gives each sentence that names a file path." identifies the JSON output of the check script, and "When you run the check script" in SKILL.md gives the script path and its output.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you write the report, compare it with each reviewer report."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md, line 9 (step 3) writes again the condition of the heading "When you write the end-of-run report" on line 3, and the sentence is not a pointer.
- Correction: "Compare the report with each reviewer report."
