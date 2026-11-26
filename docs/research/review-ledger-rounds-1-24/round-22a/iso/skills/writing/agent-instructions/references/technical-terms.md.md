Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/technical-terms.md: 10,036 bytes, 182 lines. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill. The 20,000-byte limit and the 500-line limit are for `SKILL.md` only.

Text to move in the sections under review:
- none. "When you recommend text to move" is applicable to entry files and Skills. technical-terms.md is a reference file. It has no template, no prompt in a code block, and no example of a full task.

Moved text that does not obey loading-rules.md:
- none. The Changes line gives "all" and no moved section.

Pointer list of technical-terms.md: the condition of each sentence
- Line 5, "If `SKILL.md` of this skill is not in your context window, read it before you use this file.": pointer. The heading "Before you use this file" and the sentence give the condition.
- Line 5, "`SKILL.md` defines the terms, the tiers, and the end-of-run report.": not a pointer. It gives the cause of the pointer before it.
- Line 11, "They are not applicable to text for persons, for example `README.md`.": not a pointer. The path is an example of a file outside the scope.
- Line 12, "To find the text of a rule from its rule number, read `ste-rules.md`.": pointer. The sentence gives the condition "To find the text of a rule from its rule number". The heading "When you find the sources of technical words" agrees.
- Line 36, "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition.": not a pointer. It tells which file to recommend.
- Lines 57 and 59 (table cells of "skill" and "entry file"): not pointers. The paths are examples in definitions.
- Line 97, ""When you count words" in `ste-rules.md` tells when a colon stops a sentence": pointer in a table cell. The cell gives the file, the section, and the condition: to know when a colon stops a sentence. The target section exists.

Pointers that name no file:
- none.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 33 writes again the condition of the heading "When a technical noun is not in the base list or in the glossary" on line 31, and the sentence is not a pointer.
- Correction: "Add a warning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 29 writes again the condition of the heading "When the glossary gives a different meaning" on line 27, and the sentence is not a pointer.
- Correction: Change the heading to "When the glossary gives a base-list term a different meaning" and write the rule as "Use the glossary meaning."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "In the end-of-run report, give the name of each term of this type."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 29 gives an instruction that the pointer target end-of-run-report.md already gives in its template part "Base-list terms with a project meaning" (line 28) and in line 69 "In the last part, give each base-list term that has a different meaning in the glossary."
- Correction: Remove the sentence "In the end-of-run report, give the name of each term of this type."

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory) The rule is not usual for the agent. (advisory) To obey the rule, the agent must make a decision. (advisory)"
- Text: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 17 makes the agent decide whether "most projects" use a term, but no file tells why the base list must contain only such terms.
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions, because each project that uses this skill reads the base list."

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory) The rule is not usual for the agent. (advisory) To obey the rule, the agent must make a decision. (advisory)"
- Text: "Do not write the term or the glossary entry until the user gives approval."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 37 stops the agent from writing a new term that it needs for its text, which changes the usual work of the agent, but no file tells why the approval of the user is necessary.
- Correction: "Do not write the term or the glossary entry until the user gives approval, because a glossary term changes the meaning of that word in all Agent instructions of the project."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "It has no table that gives approved words for words that are not approved."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, line 13 tells that the base list has no table of approved words for words that are not approved, but each table from line 43 to line 168 has the column "Do not use" next to each term, and only line 21 tells that this column gives examples.
- Correction: "Its "Do not use" column gives only examples of words that the base list does not permit. It is not a table of replacement words."
