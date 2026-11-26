Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 93: "Write each candidate in the Extraction candidates part of the report."
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 31: "If `AGENTS.md` has a pointer to the same file, the alternative is a change to the condition of that pointer."
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
- skills/writing/agent-instructions/references/loading-rules.md: 10,673 bytes. Limit: none. The table in "When you examine the file size" gives no file-size limit for a reference file of a Skill.

Findings:

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Write each candidate in the Extraction candidates part of the report."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 93, "candidate" is a shorter form of the 2-word term "extraction candidate" that SKILL.md line 40 defines and that lines 91 and 94 use, and rule 2.2 permits a shorter form only for a term of more than 3 words.
- Correction: Write each extraction candidate in the Extraction candidates part of the report.

- Rule: 4.2, "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "If `AGENTS.md` has a pointer to the same file, the alternative is a change to the condition of that pointer."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 31, "the same file" omits the file that it compares with, and the previous sentence names `CLAUDE.md` and `AGENTS.md`, so the reader cannot know that the text means the file that the `@path` line identifies.
- Correction: If `AGENTS.md` has a pointer to the file that the `@path` line identifies, the alternative is a change to the condition of that pointer.

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 11, 19, and 21, the technical noun "signal" is not in the glossary or in the base list of technical-terms.md, and ste-rules.md also uses "signal word" for CAUTION.
- Correction: When you find the target platforms, examine the project for these files and folders:

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write only features that Codex, OpenCode, and Claude Code all read."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 23, 25, and 31, the technical noun "feature" is not in the glossary or in the base list of technical-terms.md.
- Correction: Use a term from the base list, for example "Write only files and frontmatter fields that Codex, OpenCode, and Claude Code all read.", or recommend a glossary entry for "feature" in a warning.

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "If the layout gives no copy of the text to a target platform, add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 37 and 56, the technical noun "layout" is not in the glossary or in the base list of technical-terms.md.
- Correction: If the entry files give no copy of the text to a target platform, add a warning.

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the multi-word noun "extraction recommendation" is not in the glossary, in the base list of technical-terms.md, or in "Terms in this skill" in SKILL.md.
- Correction: For a Rule, use the file-size limit of the entry file that contains its text, and find extraction candidates as "When you recommend text to move" tells you.
