Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 45: "Put a pointer to each pointer target directly in the file that has the pointer."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: skills/writing/agent-instructions/references/plain-language-rules.md has 7,145 bytes. It is a reference file of a Skill. loading-rules.md and agent-skills-spec.md give no file-size limit for a reference file.

Sections under review: "When you select the text" (lines 13 to 28) and "When you put the text in sections and lists" (lines 30 to 46). No moved sections.

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Put a pointer to each pointer target directly in the file that has the pointer."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the sentence omits which file must have the direct pointer, so "the file that has the pointer" refers back to the same pointer and the rule then requires nothing, although the cause "Make no sequences of pointers" shows that the pointer must be in the first file, for example `SKILL.md` or the entry file.
- Correction: "Put the pointer to each reference file directly in the first file, for example `SKILL.md` or `AGENTS.md`. Make no sequences of pointers."
