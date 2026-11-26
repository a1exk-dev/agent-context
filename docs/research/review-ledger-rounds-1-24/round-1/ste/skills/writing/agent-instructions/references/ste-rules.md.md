Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 54: "A noun group with a glossary term, for example "<Term> branch", is a different technical noun."; line 76: "In a vertical list, the colon stops a sentence (rule 8.4)."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - line 15: "A prompt that an agent reads as an instruction is not in this group."
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/ste-rules.md: 9,923 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.
- skills/writing/agent-instructions/SKILL.md (context only): 17,938 bytes. Limit: 20,000 bytes.

Text to move: none. Moved text: none.

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "A noun group with a glossary term, for example "<Term> branch", is a different technical noun."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 54 uses "noun group" for the item that the heading at line 34 and the rules at lines 36, 37, and 86 call a "multi-word noun".
- Correction: "A multi-word noun with a glossary term, for example "<Term> branch", is a different technical noun."

- Rule: 1.11 and 6.2 "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "In a vertical list, the colon stops a sentence (rule 8.4)."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 76 uses "vertical list" for the item that the base list in technical-terms.md (line 98) calls a "list", and the same file uses "list" for this item at lines 20 and 114.
- Correction: "In a list, the colon stops a sentence (rule 8.4)."

- Rule: GR-3 and GR-4 "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)"
- Text: "A prompt that an agent reads as an instruction is not in this group."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 15, "this group" can refer to the text that the author cannot change (line 13) or to the code in code blocks (line 14), and no earlier sentence names a "group".
- Correction: "A prompt that an agent reads as an instruction is not text that the author cannot change. A prompt in a code block is also not text that the author cannot change. Write these prompts by all STE rules."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "This list gives no replacement words, because a table of replacements is a part of the dictionary."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 20, the technical noun "dictionary" is not in the base list of technical-terms.md or in the glossary, and the file does not tell which dictionary.
- Correction: "This list gives no replacement words, because the replacement words are a part of the ASD-STE100 standard."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A rule bullet with a risk is also a step for this section."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 112, the technical noun "rule bullet" is not in the base list of technical-terms.md or in the glossary.
- Correction: "A rule with a risk in a list of bullets is also a step for this section."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3)."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 72 and the heading at line 70, the technical noun "safety list" is not in the base list of technical-terms.md or in the glossary, and the file does not define it.
- Correction: "In a list of safety instructions, write "do not" in each item that tells the reader not to do an action (rule 4.3)."
