Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - line 24: "Some checks read only the first line of a value."
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

File size: /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md has 8,088 bytes and 79 lines. Limit: loading-rules.md gives no file-size limit for a reference file of a Skill.

Findings:

- Rule: 1.11 and 6.2, "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)"
- Text: "Some checks read only the first line of a value."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md line 24, "checks" identifies programs that parse the frontmatter, but in this skill "check" identifies a review check, a manual check, or the check script (for example SKILL.md lines 34 and 37, and review.md lines 21 to 49), so one technical noun identifies more than one item.
- Correction: "Some programs that read the frontmatter read only the first line of a value."

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "A Skills folder of the project is a folder from this table that the project has."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md lines 11 and 73, "Skills folder" is a multi-word noun that is not in the base list, and it differs by one letter from "Skill folder" on line 63, which identifies a different item (the folder of one Skill).
- Correction: Use the base-list term "folder" with a clause, for example "A folder for Skills of the project is a folder from this table that the project has.", or add a warning that recommends a glossary entry for "Skills folder".

- Rule: 1.8, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Tier 4: Include a minimum of one user phrase in quotation marks, for example "draft a skill"."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md line 53, "user phrase" is a technical noun that is not in the base list of technical-terms.md.
- Correction: "Tier 4: Include a minimum of one request of the user in quotation marks, for example "draft a skill"." Or add a warning that recommends a glossary entry for "user phrase".
