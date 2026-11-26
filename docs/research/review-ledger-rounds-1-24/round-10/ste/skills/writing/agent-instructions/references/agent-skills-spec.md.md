Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 65: "Put it next to the step that the problem makes incorrect."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,154 bytes, 79 lines. A reference file of a Skill has no file-size limit in loading-rules.md or in agent-skills-spec.md.

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Put it next to the step that the problem makes incorrect."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 65 ("When you write the body"), "it" can refer to "each known problem", to "the section", or to "the condition" of the sentence before it.
- Correction: "Put the known problem next to the step that the problem makes incorrect."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Tier 4: Tell the agent not to use the Skill for tasks that look almost the same as Skill tasks. (advisory)"
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 56 ("When you write the description"), the multi-word noun "Skill tasks" contains the glossary term "Skill" but is not in the glossary or in the base list of technical-terms.md.
- Correction: "Tier 4: Tell the agent not to use the Skill for tasks that look almost the same as the tasks of the Skill. (advisory)"
