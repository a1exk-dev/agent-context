Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 10,036 bytes. Limit: none. loading-rules.md gives no file-size limit for a reference file of a Skill.

Pointers in the pointer list for this file:
- Line 5, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 5, "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. It gives the cause of the pointer before it.
- Line 11, "When you find the sources of technical words": "They are not applicable to text for persons, for example `README.md`." - Not a pointer. It gives an example of a file.
- Line 12, "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." - The heading and the sentence give the condition.
- Line 36, "When a technical noun is not in the base list or in the glossary": "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - Not a pointer. It tells the agent to recommend a file, not to read a file.
- Line 57, "Agent terms": "A folder with a `SKILL.md` file." - Not a pointer. It is a definition.
- Line 59, "Agent terms": "An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md`" - Not a pointer. It is a definition.
- Line 97, "Terms for text": "\"When you count words\" in `ste-rules.md` tells when a colon stops a sentence" - The sentence gives the file and the section, and the subject "when a colon stops a sentence" gives the condition to read it.

Pointers that name no file: none

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 33, the rule writes again the condition of its heading "When a technical noun is not in the base list or in the glossary" (line 31).
- Correction: "Add a warning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 29, the rule writes again the condition of its heading "When the glossary gives a different meaning" (line 27).
- Correction: "Use the glossary meaning."

- Rule: "To obey the rule, the agent must make a decision. (advisory)"
- Text: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 17, the changed rule makes the agent decide whether "most projects" use a term, but the rule gives no cause for this limit.
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions. The base list is applicable to each project that uses this skill."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "If the project has a glossary, recommend a glossary entry in the format of the project."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md lines 35 to 37, items 1 and 2 are two alternatives for two different conditions, and item 3 is a rule for both, so the numbered list gives no sequence of steps.
- Correction: Write the 3 items as bullets: "- If the project has a glossary, recommend a glossary entry in the format of the project.", "- If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition.", and the third item without a number.
