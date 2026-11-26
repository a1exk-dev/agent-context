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
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,207 bytes. Limit: none (a reference file has no limit in the table of "When you examine the file size" in loading-rules.md).

Findings:

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A Skills folder of the project is a folder from this table that the project has."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, lines 11 and 73 use the multi-word technical noun "Skills folder", which is not in the glossary or in the base list of technical-terms.md, and the section defines it only locally.
- Correction: Use words from the base list, for example "A folder from this table that the project has is a Skills location of the project" is also not permitted, so write "Use a folder from this table that the project has." and in line 11 write "Select the folder of the project for the Skill first, as the section "When you select the Skills folder of the project" tells you."; or add a warning that recommends a glossary entry for "Skills folder", as "When a technical noun is not in the base list or in the glossary" in technical-terms.md tells you.
