Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/technical-terms.md: 10,036 bytes. Limit: none. loading-rules.md gives no file-size limit for a reference file of a Skill.
- skills/writing/agent-instructions/SKILL.md (context only): 17,985 bytes. Limit: 20,000 bytes.

Pointer conditions (pointer list of the check script for technical-terms.md):
- Line 5, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 12, heading "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." - The sentence gives the condition.
- Line 97, heading "Terms for text": "\"When you count words\" in `ste-rules.md` tells when a colon stops a sentence" - The sentence gives the condition: when you must know if a colon stops a sentence.
- Lines 11, 36, 57, and 59 name a file path only as an example or a definition. They are not pointers.
- Pointers that name no file: none.

Text to move: none. technical-terms.md is a reference file, and the rules in loading-rules.md that tell you to move text are for a SKILL.md file and entry-file text.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 29, the rule writes again the condition of its heading "When the glossary gives a different meaning" (line 27).
- Correction: "Use the glossary meaning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 33, the rule writes again the condition of its heading "When a technical noun is not in the base list or in the glossary" (line 31).
- Correction: "Add a warning."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Then use the glossary meaning for that file."
- Problem: skills/writing/agent-instructions/SKILL.md line 23 defines Rule as a term of this skill, but skills/writing/agent-instructions/references/technical-terms.md line 25 tells the agent to use the glossary meaning, which does not exist in a project whose glossary does not give Rule.
- Correction: "Then use the meaning of Rule in "Terms in this skill" in `SKILL.md`. When the glossary gives Rule a different meaning, use the glossary meaning."

- Rule: "To obey the rule, the agent must make a decision. (advisory)"
- Text: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 17, the agent must decide if most projects use a term, but the rule gives no cause for this limit.
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions, because each project that uses this skill reads the base list."
