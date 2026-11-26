Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 136: "It drops each finding that has a missing field, a quotation that is not in the files, or no rule with a mark."; line 15: "In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 76: "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes, 151 lines. Limit: a maximum of 20,000 bytes ("When you examine the file size" in loading-rules.md), and less than 500 lines (tier 4 in agent-skills-spec.md). The file is in the two limits.

Text to move: the sections "When two sources do not agree" and "When you run the check script". The findings below give them.
Moved text: none. The Changes line gives no pointer of a moved section.

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "It drops each finding that has a missing field, a quotation that is not in the files, or no rule with a mark."
- Problem: In skills/writing/agent-instructions/SKILL.md line 136, "a quotation" names the text that a finding copies from the file, but line 27 of the same file names that item "the quoted text", the base-list term in technical-terms.md, so one item has two names.
- Correction: "It drops each finding that has a missing field, quoted text that is not in the files, or no rule with a mark."

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions."
- Problem: In skills/writing/agent-instructions/SKILL.md line 15, "Skill folder" names the folder of one Skill, but lines 33 and 102 of the same file name that item "the folder of that Skill" and "the folder of a Skill", and agent-skills-spec.md uses the almost equal noun "Skills folder" for a different item (the folder that contains the Skills of a project).
- Correction: "In the folder of a Skill, the `SKILL.md` file and its reference files are Agent instructions."

- Rule: GR-3 and GR-4 "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you."
- Problem: In skills/writing/agent-instructions/SKILL.md line 76, "it" can refer to "a Skill" or to "a known problem", and agent-skills-spec.md tells where to put each of these two items (the Skills folder in "When you select the Skills folder of the project", and the known problem in "When you write the body").
- Correction: "When a Skill has a known problem, put the known problem where `references/agent-skills-spec.md` tells you."

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When two sources do not agree"
- Problem: In skills/writing/agent-instructions/SKILL.md lines 61 to 85, the heading gives a specified condition and the section has more than 3 rules ("Obey the higher tier", the decision in each of the 8 table rows, "use the tier sequence", and "Write a warning"), and item 2 of "When the write job makes a SKILL.md or entry-file text" in loading-rules.md does not keep this section, because the section is not the numbered steps, the terms, or the pointers.
- Correction: Move the section to `references/source-conflicts.md`. In its old place, write the heading "When two sources do not agree" and the pointer "When two sources do not agree, read `references/source-conflicts.md`."

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When you run the check script"
- Problem: In skills/writing/agent-instructions/SKILL.md lines 113 to 147, the heading gives a specified condition and the section has more than 3 rules (for example "Run it with `node`", "Replace `<skill folder>`", "Save the output to a new file", and "stop the self-check and the reader test"), and its 3 command templates are text that item 1 of "When the write job makes a SKILL.md or entry-file text" in loading-rules.md also tells you to move.
- Correction: Move the section to `references/check-script.md`. In its old place, write the heading "When you run the check script" and the pointer "When you run the check script, read `references/check-script.md`."
