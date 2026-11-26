Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 63: "Move long text to files in the Skill folder or in a folder directly in it."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 50: "When the user gives text for the description, keep its meaning and write it by these rules."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8,103 bytes and 80 lines. It is a reference file of a Skill. loading-rules.md gives no file-size limit for a reference file.

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Move long text to files in the Skill folder or in a folder directly in it."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 63, "the Skill folder" names the same item that lines 15, 16, and 28 call "the folder of the Skill", and it is almost the same as the different term "Skills folder" on lines 11 and 73.
- Correction: "Move long text to files in the folder of the Skill or in a folder directly in the folder of the Skill."

- Rule: GR-3 and GR-4 "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "When the user gives text for the description, keep its meaning and write it by these rules."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 50, "its" and "it" can refer to the text of the user or to the description, so the agent can keep the meaning of the previous description instead of the meaning of the text of the user.
- Correction: "When the user gives text for the description, keep the meaning of the text of the user. Write the description by these rules."
