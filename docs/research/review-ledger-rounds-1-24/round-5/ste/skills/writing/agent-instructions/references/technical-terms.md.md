Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 17: "add a word to the base list only when most projects use the word in Agent instructions"
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 77: "A unit of data on a disk that has a name"; line 89: "A system on a different computer that the agent can change, for example GitHub"; line 173: "Put software on a computer and make it ready to operate"
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - line 20: "Each table row has 3 columns: term, definition, and the words that the base list does not permit."; line 21: "Each word in that column is in quotation marks, because the column gives the words only as examples."; line 25: "Then the glossary meaning is correct for that file."
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 9,997 bytes, 182 lines. Limit: none. loading-rules.md and agent-skills-spec.md give no file-size limit for a reference file of a Skill.

Text to move: none. The rules in loading-rules.md that tell you to move text are for a SKILL.md file and entry-file text, not for a reference file.

Moved text: none.

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "add a word to the base list only when most projects use the word in Agent instructions"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 17 calls an item of the base list a "word", but line 19 ("Do not add a term of one platform only") and line 20 (the column "term") call the same item a "term".
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "A unit of data on a disk that has a name"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 77, the pronoun "that" can refer to "a unit of data" or to "a disk", so the reader cannot know which item has the name.
- Correction: "A unit of data that has a name and that is on a disk"

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "A system on a different computer that the agent can change, for example GitHub"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 89, the pronoun "that" can refer to "a system" or to "a different computer", so the reader cannot know which item the agent can change.
- Correction: "A system that the agent can change and that is on a different computer, for example GitHub"

- Rule: GR-3 and GR-4, "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "Put software on a computer and make it ready to operate"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 173, the pronoun "it" can refer to "software" or to "a computer".
- Correction: "Put software on a computer and make the software ready to operate"

- Rule: 5.3, "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "Each table row has 3 columns: term, definition, and the words that the base list does not permit."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 20, under the heading "When you add a word to the base list", this sentence gives the requirement for a new table row as a statement, not in the imperative.
- Correction: "Give each table row 3 columns: term, definition, and the words that the base list does not permit."

- Rule: 5.3, "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "Each word in that column is in quotation marks, because the column gives the words only as examples."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 21, under the heading "When you add a word to the base list", this sentence gives the requirement for the last column as a statement, not in the imperative.
- Correction: "Put each word in that column in quotation marks, because the column gives the words only as examples."

- Rule: 5.3, "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "Then the glossary meaning is correct for that file."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 25, under the heading "When you write the word rule", this sentence gives the instruction to use the glossary meaning as a statement, not in the imperative.
- Correction: "When you write about a file of that type, use the meaning that the glossary gives to Rule."
