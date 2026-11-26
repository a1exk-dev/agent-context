File size: skills/writing/agent-instructions/references/loading-rules.md has 10,705 bytes. Limit: "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

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

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "examine the project files for these signals"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 11 (and lines 19 and 21) use "signal" as a technical noun, but the glossary and the base list in technical-terms.md do not give it.
- Correction: Add a warning that recommends a glossary entry for "signal" (a file or folder that shows a target platform of the project), or write "examine the project files for these files and folders:".

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Get the names of the target platforms from the user."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 21 and other lines (for example lines 9, 25, 35, 36, and 44) use the multi-word noun "target platform", but the glossary and the base list in technical-terms.md give only "platform".
- Correction: Add a warning that recommends a glossary entry for "target platform" (a platform that the project selects to read its Agent instructions).

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write only features that Codex, OpenCode, and Claude Code all read."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 25 and 31 use "feature" as a technical noun for a file, a folder, a frontmatter field, or an `@path` line, but the glossary and the base list in technical-terms.md do not give it.
- Correction: Add a warning that recommends a glossary entry for "feature" (a file, a folder, a frontmatter field, or a line form that a platform reads), or keep the list of items under the sentence as its definition and add the warning.

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "If the layout gives no copy of the text to a target platform, add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 37 (and "file layout" on line 56) use "layout" as a technical noun, but the glossary and the base list in technical-terms.md do not give it.
- Correction: "If no entry file of a target platform gives the text, add a warning."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "one level below the Skill folder"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 67 uses the multi-word noun "Skill folder", which contains the glossary term "Skill", but the glossary does not give that multi-word noun.
- Correction: "one level below the folder of the Skill"
