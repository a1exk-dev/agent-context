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

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8,208 bytes and 80 lines. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file. The rules that tell you to move text are for a SKILL.md file and for entry-file text.

Moved text: none.

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "In the frontmatter, write no top-level field other than `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 18 (and lines 21 to 23, 43), the technical noun "field" is not a term of the base list in technical-terms.md and not a term of GLOSSARY.md.
- Correction: Keep the sentence, and add a warning that recommends a base-list term: "field | One key and its value in the frontmatter or in a YAML file | "property", "attribute"".

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write each key and each value in `metadata` as text."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 19 (and lines 20, 24, 28, 44), the technical nouns "key" and "value" are not terms of the base list in technical-terms.md and not terms of GLOSSARY.md.
- Correction: Keep the sentence, and add a warning that recommends 2 base-list terms: "key | The name of a field in YAML" and "value | The data after the key of a field in YAML".

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Write frontmatter that the YAML parser reads with no errors."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 20, the technical noun "YAML parser" is not a term of the base list in technical-terms.md and not a term of GLOSSARY.md.
- Correction: "Write frontmatter that is correct YAML, so that `skills-ref validate` gives no errors."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Include a minimum of one user phrase in quotation marks"
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 53, the technical noun "user phrase" is not a term of the base list in technical-terms.md and not a term of GLOSSARY.md.
- Correction: "Include a minimum of one quoted text in quotation marks: words that a user can write in a prompt, for example "draft a skill"."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "The specification gives no structure for the body."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 60 (and the heading on line 58), the technical noun "body" is not a term of the base list in technical-terms.md and not a term of GLOSSARY.md.
- Correction: "The specification gives no structure for the Markdown text after the frontmatter."

- Rule: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A Skills folder of the project is a folder from this table that the project has."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 73 (and line 11 and the heading on line 71), the technical noun "Skills folder" is not a term of the base list in technical-terms.md and not a term of GLOSSARY.md.
- Correction: Keep the sentence, and add a warning that recommends a glossary entry: "**Skills folder**: A folder from which a platform loads Skills, for example `.claude/skills/` or `.agents/skills/`."
