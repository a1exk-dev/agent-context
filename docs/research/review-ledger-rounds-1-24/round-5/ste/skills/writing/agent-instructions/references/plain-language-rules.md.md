File size: skills/writing/agent-instructions/references/plain-language-rules.md is 7,195 bytes. Limit: no limit. "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`, not for a reference file.

Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 23: "Add one short cause to a rule in each of these conditions:"; line 27: "Examine only the rules that you add or change for these conditions."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - line 51: "When the project has a glossary, use each glossary term with its meaning in that file."
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

Findings:

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Add one short cause to a rule in each of these conditions:"
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 23, "conditions" means the cases that make a cause necessary, but lines 16, 17, 33, 36, and 41 use "condition" for the item that tells when a rule or a pointer is applicable.
- Correction: Add one short cause to a rule in each of these cases:

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Examine only the rules that you add or change for these conditions."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 27, "these conditions" uses the term "condition" for the cases of line 23, so the agent can read it as the conditions of the rules that it adds or changes.
- Correction: Examine only the rules that you add or change for these cases.

- Rule: GR-2 "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)"
- Text: "When the project has a glossary, use each glossary term with its meaning in that file."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 51, "with its meaning" can mean "only in the glossary meaning" or "together with a definition of the term", and "that file" can be the glossary or the file that the agent writes.
- Correction: When the project has a glossary, use each glossary term only with the meaning that the glossary gives.
