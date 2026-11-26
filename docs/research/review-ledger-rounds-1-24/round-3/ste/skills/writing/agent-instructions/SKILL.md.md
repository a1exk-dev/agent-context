Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,941 bytes. Limit: 20,000 bytes. 151 lines. Limit: less than 500 lines.

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When you run the check script"
- Problem: In skills/writing/agent-instructions/SKILL.md, lines 113 to 147, the section has the condition "When you run the check script" in its heading and more than 3 rules, for example "Run it with `node`" (line 117), "Give the absolute path of each file to examine" (line 124), and "Start no confirmers for a reviewer that has no report in a confirm list" (line 137), and its 3 code blocks are command templates with placeholders.
- Correction: Move the full section to `references/check-script.md`. In its old place, keep the heading "When you run the check script" and write only this pointer: "When you run the check script, read `references/check-script.md`."

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When two sources do not agree"
- Problem: In skills/writing/agent-instructions/SKILL.md, lines 61 to 85, the section has the condition "When two sources do not agree" in its heading and more than 3 rules: "Obey the higher tier" (line 63), the 8 decisions of the table (lines 76 to 83), "use the tier sequence" and "Write a warning that gives the case and the tier that you obeyed" (line 85).
- Correction: Move the table and the rules of lines 72 to 85 to `references/source-conflicts.md`. Keep the tier list of lines 63 to 70 in `SKILL.md`, because the reference files use `SKILL.md` for the tiers. After the tier list, write this pointer: "When two sources do not agree in a case, read `references/source-conflicts.md`."

- Rule: "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "Before you select target platforms, read `references/loading-rules.md`."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 91, step 1 uses the verb "select" and then the verb "find" ("Then find the target platforms") for the same action on the target platforms.
- Correction: "Before you find the target platforms, read `references/loading-rules.md`."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Exit code 0 shows no findings."
- Problem: In skills/writing/agent-instructions/SKILL.md, lines 125, 126, 138, 146, and 147, the technical noun "exit code" is not in the base list of `technical-terms.md` and not in "Terms in this skill".
- Correction: Add a warning that recommends the base-list entry "exit code | The number that a command or a script gives when it stops |", or define "exit code" in "Terms in this skill".

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "In each job, also for a small change, do the vote of the confirmers that `references/review.md` gives."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 103, the technical noun "vote" is not in the base list of `technical-terms.md` and not in "Terms in this skill".
- Correction: "In each job, also for a small change, start the confirmers that `references/review.md` gives."
