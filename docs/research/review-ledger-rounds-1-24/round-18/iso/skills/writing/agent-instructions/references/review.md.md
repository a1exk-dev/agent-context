Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 61: "In each round, start 3 new reviewer subagents for the sections in the `Changes:` line, one of each class, as "When you do a round" tells you:"
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/review.md has 48436 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer list, section "When you start the reviewers":
- Lines 65, 66, and 67, the "Reference files" cells of the reviewer table - not pointers for the main agent. The cells give the files that the main agent gives to each reviewer. The heading "When you start the reviewers" gives the condition.
- Line 69, "The glossary and `MEMORY.md` are not pointer targets." - not a pointer.
- Line 69, "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line." - not a pointer. The sentence gives a fact about the review.
- Line 71, "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - the sentence gives the condition and the path.
- Line 71, "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer." - not a pointer. `review.md` is this file.
- Prompt lines 96, 100, and 102 ("Before the review, read the file in the Report requirements line.", "Before you give a finding, read each file in the Pointer targets line and each file that a sentence in the pointer list names.", "Read the glossary only to examine a word that you found for a rule.") - each line gives its condition. Each line identifies the path through a labeled line of the same prompt, which gives the absolute path. No line names a file only with words such as "that file".

Text to move: none. The section is in a reference file, and the move rules of loading-rules.md are for a SKILL.md file and entry-file text.

Moved text: none.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "In each round, start 3 new reviewer subagents for the sections in the `Changes:` line, one of each class, as "When you do a round" tells you:"
- Problem: In skills/writing/agent-instructions/references/review.md, line 61 tells the main agent to start 3 reviewers, but the necessary condition and step that change this action come after it at line 71 ("When you start the reviewers, find the list files..." and "When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round."), so an agent that does the steps in sequence can start the loading reviewer before it finds the list files.
- Correction: Move the first 3 sentences of line 71 before line 61, and write line 61 as: "Before you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`. Give no list file in the `Changes:` line of the loading reviewer. When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round. In the other rounds, start 3 new reviewer subagents for the sections in the `Changes:` line, one of each class, as "When you do a round" tells you:"
