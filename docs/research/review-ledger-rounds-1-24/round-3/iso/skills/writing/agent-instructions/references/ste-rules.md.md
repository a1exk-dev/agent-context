Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/ste-rules.md has 9953 bytes and 124 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script for this file):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. The sentence gives information about the target of the previous pointer.
- Line 11: "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - Not a pointer. The file names are examples.
- Line 27, heading "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - The heading and the sentence give the condition.
- Line 28, heading "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in "When a word is not in the base list or in the glossary" in `technical-terms.md`." - The heading and the sentence give the condition.
- Line 31, heading "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - The heading and the sentence give the condition.
- Line 54, heading "When you write a sentence": "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it." - The sentence gives the condition only through the pronoun "it". The heading gives no condition about a multi-word noun. See the finding.
- Line 54, heading "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - The heading and the sentence give the condition.
- Line 102, heading "When you count words": "Read references/review.md first." - Not a pointer. The sentence is an example in the word-count table.
- Pointers that name no file: none.

Text to move: none. ste-rules.md is a reference file. The move rules in loading-rules.md are for a SKILL.md and for entry-file text.
Moved text: none.

Findings:

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 54, under the heading "When you write a sentence", the pointer gives its condition only as "for it", so the sentence alone does not tell when to read technical-terms.md, and the heading does not give the condition about a multi-word noun.
- Correction: "For a multi-word noun with a glossary term, obey "When a word is not in the base list or in the glossary" in `technical-terms.md`."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3)."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 72, the rule starts with "In a safety list", which is the condition that the heading "When you write a safety list" already gives.
- Correction: "Write "do not" in each item that tells the reader not to do an action (rule 4.3)."

- Rule: "The rule is not usual for the agent. (advisory)"
- Text: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 84, the rule changes the word count of STE rule 8.6 but gives no cause, and no pointer target gives the cause.
- Correction: Add one short cause after "This rule is stricter than rule 8.6, which counts a name as 1 word." If no file and no user gives the cause, add a warning.
