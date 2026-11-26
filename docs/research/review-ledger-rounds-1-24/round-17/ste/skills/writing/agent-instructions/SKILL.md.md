Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 22: "Steps 8 to 10 give a shorter check for a list file."
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

File sizes:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md: 17,985 bytes, limit 20,000 bytes (loading-rules.md). 151 lines, limit less than 500 lines (agent-skills-spec.md).

Findings:

- Rule: 1.11 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Steps 8 to 10 give a shorter check for a list file."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md line 22, "check" is the full set of review and test steps, but line 27 ("a check other than the confirmer", "the check that found the problem") and line 107 ("each check that the job skipped") use "check" for one check task, as references/review.md does ("Start a new subagent for each check").
- Correction: "Steps 8 to 10 give fewer checks for a list file."

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When you run the check script"
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md lines 113 to 147, the section has the condition "When you run the check script" in its heading, more than 3 rules, and 3 command templates in code blocks, and it is not a part of the numbered steps, the terms, or the pointers.
- Correction: Move the section to `references/check-script.md`. In its old place, keep the heading "When you run the check script" and write "When you run the check script, read `references/check-script.md`." Change the pointers in `references/review.md` that give "When you run the check script" in `SKILL.md` to the new file.

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When two sources do not agree"
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md lines 61 to 85, the section has the condition "When two sources do not agree" in its heading and more than 3 rules ("Obey the higher tier.", the 8 decisions in the table, and "Write a warning that gives the case and the tier that you obeyed."), and it is not a part of the numbered steps, the terms, or the pointers.
- Correction: Move the section to `references/source-conflicts.md`. In its old place, keep the heading "When two sources do not agree" and write "When two sources do not agree, read `references/source-conflicts.md`." Change the pointers in `references/end-of-run-report.md` that give "When two sources do not agree" in `SKILL.md` to the new file.
