Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 18: "Do not add an entry for a platform file name or a command"; line 18: "because a file path and a command each count as 1 word"
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 54: "A folder with a `SKILL.md` file that an agent loads when a task makes it necessary"
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size: skills/writing/agent-instructions/references/technical-terms.md has 9,923 bytes. Limit: none, because "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`, and this file is a reference file.

Text to move: none. Moved text: none.

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Do not add an entry for a platform file name or a command"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, section "When you add a word to the base list", line 17 calls the item that the author adds to the base list a "word", line 18 calls the same item an "entry", and line 21 calls it a "table row".
- Correction: Do not add a word to the base list for a platform file name or a command

- Rule: "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "because a file path and a command each count as 1 word"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 18, the sentence names the item "platform file name" and then gives the cause for a different term, "file path", for the same item.
- Correction: because a file name in a code span and a command each count as 1 word

- Rule: "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "A folder with a `SKILL.md` file that an agent loads when a task makes it necessary"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 54, "that" and "it" can refer to the folder or to the `SKILL.md` file, so the reader does not know which item the agent loads.
- Correction: A folder with a `SKILL.md` file. An agent loads the `SKILL.md` file when a task makes the skill necessary

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "It is also applicable to a noun group that contains a glossary term, when the glossary does not give that noun group."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 30, the technical noun "noun group" is not in the base list, not in the list of grammar words on lines 107 to 139, and not in the glossary.
- Correction: Add "noun group" to the list of grammar words after "These words are also technical nouns. They have the meaning that they have in grammar:", or write "It is also applicable to a term of 2 or more words that contains a glossary term, when the glossary does not give that term."
