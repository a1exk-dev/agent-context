Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 3: "Do not use it for prompt text in product code."; line 15: "In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 68: "It also contains the rules in `references/loading-rules.md` that tell you to move text and that are not tier 1."; line 76: "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you."; line 130: "Run it once for each file of the round"
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes, limit 20,000 bytes (loading-rules.md). 151 lines, limit less than 500 lines (agent-skills-spec.md).

Findings:

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Do not use it for prompt text in product code."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 3 (the `description`) names the item "product code", but line 49 names the same item "the code of a software product", so the file uses two terms for one item.
- Correction: "Do not use it for prompt text in the code of a software product."

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 15 uses the term "Skill folder", but lines 33 and 102 use "the folder of a Skill" and "the folder of that Skill" for the same item, so the file uses two terms for one item.
- Correction: "In the folder of a Skill, the `SKILL.md` file and its reference files are Agent instructions."

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "It also contains the rules in `references/loading-rules.md` that tell you to move text and that are not tier 1."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 68, "It" can refer to "This tier" or to "the Agent Skills specification" in the sentence before it.
- Correction: "This tier also contains the rules in `references/loading-rules.md` that tell you to move text and that are not tier 1."

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 76, "it" can refer to "a Skill" or to "a known problem", and `references/agent-skills-spec.md` tells where to put each of the two items (the Skills folder and the section of the condition).
- Correction: "When a Skill has a known problem, put the known problem where `references/agent-skills-spec.md` tells you."

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Run it once for each file of the round"
- Problem: In skills/writing/agent-instructions/SKILL.md, line 130, "it" can refer to "The report form" or to "the script" in the sentence before it.
- Correction: "Run the report form once for each file of the round:"

- Rule: 9.4, "Use the same terms and the same words for the same type of step (rule 9.4). (advisory)"
- Text: "Write a warning that gives the case and the tier that you obeyed."
- Problem: In skills/writing/agent-instructions/SKILL.md, line 85 uses "Write a warning", but lines 95 and 100 use "add a warning" for the same type of step.
- Correction: "Add a warning that gives the case and the tier that you obeyed."
