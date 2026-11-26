Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 71: "When you select the folder for the Skill"
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

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8,169 bytes and 79 lines. Limit: loading-rules.md gives no file-size limit for a reference file of a Skill.

Text to move: none. This file is a reference file, not a SKILL.md file or an entry file.

Moved text: none.

Findings:

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "When you select the folder for the Skill"
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, the heading on line 71, the quoted heading on line 11, and "the folder" on line 73 identify the Skills folder of the project (for example `.claude/skills/`), but lines 15, 16, and 63 use the almost identical term "the folder of the Skill" for the folder that contains `SKILL.md`, and the heading on line 9 uses "the folder" for that second item, so one noun has two items and one item has two terms.
- Correction: Change the heading on line 71 to "When you select the Skills folder of the project" and the quoted heading on line 11 to "When you select the Skills folder of the project". On line 73, write "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you."
