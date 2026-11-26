Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/technical-terms.md: 10,026 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer list (technical-terms.md):
- Line 5, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 5, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer; it gives a fact about the target of the previous pointer.
- Line 11, heading "When you find the sources of technical words": "They are not applicable to text for persons, for example `README.md`." - not a pointer; `README.md` is an example.
- Line 12, heading "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." - pointer; the sentence gives the condition.
- Line 36, heading "When a word is not in the base list or in the glossary": "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - not a pointer; it names a file to recommend, not a file to read.
- Line 57, heading "Agent terms": "A folder with a `SKILL.md` file." - not a pointer; it is a definition.
- Line 59, heading "Agent terms": "An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md`" - not a pointer; it is a definition.
- Line 97, heading "Terms for text": "\"When you count words\" in `ste-rules.md` tells when a colon stops a sentence" - pointer; the sentence gives the file, the section, and the subject to read it for: when a colon stops a sentence.

Pointers that name no file: none.

Findings:

- Rule: "To obey the rule, the agent must make a decision. (advisory)" (in "Add one short cause to a rule in each of these cases:")
- Text: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/technical-terms.md line 17, the agent must decide whether most projects use a term, but the changed rule gives no cause for this limit, and no pointer target gives it.
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions. The base list is for all projects, and a project gives its own terms in its glossary."
