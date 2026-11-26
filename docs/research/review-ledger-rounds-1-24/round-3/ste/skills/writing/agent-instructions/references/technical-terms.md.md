Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 13: "The list contains only terms and meanings that we wrote."; line 20: "Each table row has 3 columns: term, definition, and the words that this list does not permit."; line 25: "The term "rule" has the meaning "a requirement in a text" in this list."; line 19: "Do not add a term of one platform only, for example "hook" or "slash command"."
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
- skills/writing/agent-instructions/references/technical-terms.md: 9,984 bytes. Limit: none, because the file-size limits in loading-rules.md are only for entry files and `SKILL.md`.

Findings:

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "The list contains only terms and meanings that we wrote."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 13, "The list" names the base list of line 9, but the base-list term "list" (line 101) means "Items that are written one below the other, each with a bullet or a number", and the base list is mostly tables, so one noun has two items and the base list has two names.
- Correction: "The base list contains only terms and meanings that we wrote."

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Each table row has 3 columns: term, definition, and the words that this list does not permit."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 20, "this list" names the base list, but the base-list term "list" (line 101) gives a different item, and lines 9, 17, and 18 use "the base list" for the same item.
- Correction: "Each table row has 3 columns: term, definition, and the words that the base list does not permit."

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "The term "rule" has the meaning "a requirement in a text" in this list."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 25, "this list" names the base list, but the base-list term "list" (line 101) gives a different item, and the other sections use "the base list" for the same item.
- Correction: "The term "rule" has the meaning "a requirement in a text" in the base list."

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Do not add a term of one platform only, for example "hook" or "slash command"."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 17 and the heading on line 15 call the item that the author adds to the base list "a word", but line 19 calls the same item "a term".
- Correction: "Do not add a word of one platform only, for example "hook" or "slash command"."
