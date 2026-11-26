Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/end-of-run-report.md has 6,268 bytes and 69 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script, lines in end-of-run-report.md):
- Line 36: condition "When you write this item" in the sentence, and the heading "When you write the end-of-run report". The condition is given.
- Line 38: condition "When you write this item" in the sentence, and the heading. The condition is given.
- Line 48: the heading gives the condition, but the sentence gives no condition to read the table in `SKILL.md`. See the finding.
- Line 56: not a pointer. The sentence names a missing file, not a file to read.
- Line 63: condition "In the edit job, before you write the report" in the sentence. The condition is given.
- Line 64: condition "A reviewer other than the loading reviewer can tell you to move text in an unchanged part" in the item, and "If ... gives that section" in the sentence. The condition is given.
- Line 67: condition "For a manual check" in the sentence. The condition is given.

Pointers that name no file: none.

Text to move: none.

Moved text: none.

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Each case where two sources do not agree and that the table in \"When two sources do not agree\" in `SKILL.md` does not give, with the obeyed tier."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 48, the pointer names `SKILL.md` and its table, but the sentence gives no condition to read the table, while the pointers on lines 36 and 38 of the same list give "When you write this item".
- Correction: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier. When you write this item, find the known cases in that table."
