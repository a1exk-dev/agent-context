Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/review.md: 48,582 bytes, 451 lines. Limit: none. It is a reference file of a Skill, and "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Text to move in the sections under review: none. The section "When you start the reviewers" (lines 59 to 150) is in a reference file. The list in "When the write job makes a SKILL.md or entry-file text" in loading-rules.md is for a `SKILL.md` and entry-file text.

Moved text: none. The Changes line gives no pointer of a moved section.

Pointer list, section "When you start the reviewers":
- Line 65: "`review.md`, `loading-rules.md`, `agent-skills-spec.md` for a Skill, and the pointer targets" - not a pointer. The table cell gives the files to give to the loading reviewer. The heading and the row give the condition.
- Line 66: "`review.md`, `ste-rules.md`, `technical-terms.md`, and the pointer targets" - not a pointer. The table cell gives the files to give to the ASD-STE100 reviewer. The heading and the row give the condition.
- Line 67: "`review.md`, `plain-language-rules.md`, and the pointer targets" - not a pointer. The table cell gives the files to give to the ISO 24495-1 reviewer. The heading and the row give the condition.
- Line 69: "The glossary and `MEMORY.md` are not pointer targets." - not a pointer. It tells no agent to read a file.
- Line 69: "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line." - not a pointer. It gives the scope of a review.
- Line 71: "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - pointer. The heading and the sentence give the condition "When you start the reviewers". The sentence gives the path and a heading of the target.
- Line 71: "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer." - not a pointer. `review.md` is this file. The sentence gives an exception, not a file to read.

Pointers that name no file:
- None. Line 69 "Each reviewer reads the prompt in this file to know the requirements for its reports." refers to review.md itself. It tells the main agent to read no other file.
- In the reviewer prompt, line 96 "Before the review, read the file in the Report requirements line.", line 100 "Before you give a finding, read each file in the Pointer targets line and each file that a sentence in the pointer list names.", and line 102 "Read the glossary only to examine a word that you found for a rule." give each file through a prompt line that contains its absolute path.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Rules: <absolute paths of all reference files for this reviewer in the table>"
- Problem: In skills/writing/agent-instructions/references/review.md, line 90 tells the author to put all reference files of the table in the Rules line, but the table at lines 63 to 67 (column "Rules" and column "Reference files") puts "the pointer targets" in the reference files, and line 104 tells the reviewer to read each pointer target only for context, so the Rules line can make the pointer targets rule files.
- Correction: "Rules: <absolute paths of the reference files for this reviewer in the table, but not the pointer targets>"

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory)"
- Text: "Do not examine the conditions of the pointers and the headings."
- Problem: In skills/writing/agent-instructions/references/review.md, line 113 is a new rule that limits the usual work of the loading reviewer and the ASD-STE100 reviewer, but these reviewers do not get line 112 and the prompt gives them no cause, while line 119 gives the cause for a similar limit ("The loading reviewer examines that rule.").
- Correction: "<For the loading reviewer and the ASD-STE100 reviewer only:> Do not examine the conditions of the pointers and the headings. The ISO 24495-1 reviewer examines them."
