Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 45: "Put each pointer target one step from the file that has the pointer."; line 20: "When the user tells you that an agent did not obey a rule, do not remove that rule."
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

File size: skills/writing/agent-instructions/references/plain-language-rules.md has 7,098 bytes and 65 lines. Limit: no limit, because loading-rules.md gives limits only for entry files and `SKILL.md`, and this file is a reference file of a Skill.

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Put each pointer target one step from the file that has the pointer."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, "step" means one pointer between two files, but lines 32 and 38 of the same file use "step" for a procedure step, so one technical noun has two items.
- Correction: "Put a pointer to each pointer target directly in the file that has the pointer."

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "When the user tells you that an agent did not obey a rule, do not remove that rule."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 20, the item that an agent did not obey is "a rule", but line 65 of the same file (and step 6 of SKILL.md) gives the same item the term "an instruction".
- Correction: "When the user tells you that an agent did not obey an instruction, do not remove that instruction. The user wants agents to obey that instruction. You can correct the text of that instruction. You can also move that instruction."

- Rule: 4.1, "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "Examine only the rules that you add or change for these conditions."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 27, "for these conditions" can attach to "add or change" or to "Examine", so the reader cannot know which rules to examine.
- Correction: "For these conditions, examine only the rules that you add or change."

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Use the level of the other condition headings."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 35, the technical noun "condition headings" is not in the glossary or in the base list of technical-terms.md.
- Correction: "Use the level of the other headings that give a condition."
