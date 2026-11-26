Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 9,984 bytes and 182 lines. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointer conditions (sections "When you add a word to the base list", "When you write the word rule", "When a word is not in the base list or in the glossary", and "Agent terms"):
- Line 36: "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - not a pointer. The sentence tells the agent to recommend a file.
- Line 57: "A folder with a `SKILL.md` file." - not a pointer. The table cell gives a definition.
- Line 59: "An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md`" - not a pointer. The table cell gives a definition.
- Line 25: "Then the glossary meaning is correct for that file." - not a pointer. "that file" refers to a file with the name Rule, not to a file to read.

Text to move: none. The sections are in a reference file.

Findings:

- Rule: "When you add a rule and no heading gives its condition, add a heading for the rule. Use the level of the other condition headings. If the file has only a level 1 heading, use level 2. Put the new section after the last section of the file. Put a new rule in a section after the last rule of that section. Do not change the headings of the other rules. (advisory)"
- Text: "When you write the word rule"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md, the new section at line 23 is between "When you add a word to the base list" (line 15) and "When the glossary gives a different meaning" (line 27), not after the last section of the file (the "Base list" section, lines 39 to 182).
- Correction: Put the heading "## When you write the word rule" and its paragraph after line 182, the last line of the file.

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A folder with a `SKILL.md` file. An agent loads the skill only when a task makes the skill necessary"
- Problem: Line 57 of skills/writing/agent-instructions/references/technical-terms.md tells that an agent loads a skill only when a task makes it necessary, but line 13 of skills/writing/agent-instructions/references/agent-skills-spec.md defines a Manual-only Skill that an agent loads only when the user calls it by name.
- Correction: "A folder with a `SKILL.md` file. An agent loads the skill when a task makes the skill necessary, or when the user calls the skill by name"
