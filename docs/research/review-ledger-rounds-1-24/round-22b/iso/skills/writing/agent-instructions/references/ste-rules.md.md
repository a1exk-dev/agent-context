Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/ste-rules.md: 9973 bytes, 125 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script):
- Line 7, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer, gives the condition.
- Line 7, "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives the cause of the pointer before it.
- Line 11, "When you use STE for text": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The file names are examples.
- Line 27, "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - pointer, gives the condition.
- Line 28, "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`." - pointer, gives the condition. The heading is in technical-terms.md line 31.
- Line 31, "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - pointer, gives the condition.
- Line 54, "When you write a sentence": "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it." - pointer, gives the condition through "for it", which refers to the multi-word noun with a glossary term in the sentence before it. The heading is in technical-terms.md line 31.
- Line 54, "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - pointer, gives the condition. The heading is in technical-terms.md line 23.
- Line 102, "When you count words": "Read references/review.md first." - not a pointer. It is an example sentence in the table of word counts.

Pointers that name no file: none.

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "In a safety list, write"
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/ste-rules.md line 72, the rule starts with "In a safety list", but the heading "When you write a safety list" on line 70 already gives this condition, and the rule is not a pointer.
- Correction: "- Write "do not" in each item that tells the reader not to do an action (rule 4.3). (advisory)"

- Rule: "Add one short cause to a rule in each of these cases:" - "The rule is not usual for the agent. (advisory)"
- Text: "Also write it when a heading above the step gives a condition."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/ste-rules.md line 113, the rule tells the agent to write the condition of a heading again in a step, which is not usual because plain-language-rules.md line 36 tells the agent not to write the condition of the heading again, and the rule gives no cause.
- Correction: "Also write it when a heading above the step gives a condition, because an agent can do one step of a list without the heading."
