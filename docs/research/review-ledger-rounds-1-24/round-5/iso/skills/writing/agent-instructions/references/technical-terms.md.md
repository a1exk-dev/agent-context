Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 97: "in `ste-rules.md` tells when a colon stops a sentence"
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 97: "in `ste-rules.md` tells when a colon stops a sentence"
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 9997 bytes, 182 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move:
- none. This file is a reference file, not a SKILL.md or an entry file. "When the edit job changes a SKILL.md or an entry file" in loading-rules.md is not applicable to it.

Pointer conditions (pointer list of the check script for this file):
- Line 5, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 5: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. The sentence gives the cause of the previous pointer.
- Line 11: "They are not applicable to text for persons, for example `README.md`." - not a pointer.
- Line 12, heading "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." - pointer. The sentence gives the condition ("To find the text of a rule from its rule number"). The heading gives a related condition.
- Line 36: "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - not a pointer. It tells the agent to recommend a file, not to read a file.
- Line 57 and line 59: table definitions - not pointers.
- Line 97, heading "Terms for text": "in `ste-rules.md` tells when a colon stops a sentence" - pointer. The heading is a topic heading. The sentence tells what the target section gives, but not when to read it.

Pointers that name no file: none.

Findings:

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "in `ste-rules.md` tells when a colon stops a sentence"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 97, the pointer to "When you count words" in `ste-rules.md` is in a table cell under the topic heading "Terms for text" (line 92), and no heading gives the condition to read the target.
- Correction: Remove the pointer sentence from the table cell at line 97. In the section "When you find the sources of technical words", add: "When you must know whether a colon stops a sentence, read \"When you count words\" in `ste-rules.md`."

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "in `ste-rules.md` tells when a colon stops a sentence"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 97, the sentence tells what the section in `ste-rules.md` gives, but it gives no condition that tells the agent when to read that section.
- Correction: "When you must know whether a colon stops a sentence, read \"When you count words\" in `ste-rules.md`."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 33, the sentence writes again the condition of the heading "When a word is not in the base list or in the glossary" (line 31).
- Correction: "Add a warning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 29, the sentence writes again the condition of the heading "When the glossary gives a different meaning" (line 27).
- Correction: "Use the glossary meaning."
