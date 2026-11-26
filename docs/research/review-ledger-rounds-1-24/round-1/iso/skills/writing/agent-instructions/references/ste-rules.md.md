Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 109: "Before a step with a risk"
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/ste-rules.md has 9,923 bytes. It is a reference file of a Skill. loading-rules.md gives no file-size limit for a reference file (the limits are for entry files and `SKILL.md`).

Pointer conditions (pointer list of the check script, file references/ste-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - the sentence and the heading give the condition.
- Line 27, heading "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - the sentence and the heading give the condition.
- Line 28, heading "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in ..." - the sentence gives the condition.
- Line 31, heading "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - the sentence gives the condition.
- Line 54, heading "When you write a sentence": "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it." - the sentence gives no condition, only the pronoun "it". The heading does not give the condition.
- Line 54, heading "When you write a sentence": "When you write "rule" in lowercase, read "When you add a word to the base list" in `technical-terms.md` for the two meanings." - the sentence gives the condition.
- Line 102, heading "When you count words": "Read references/review.md first." - an example sentence in the word-count table, not a pointer.
- Lines 7 and 11: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." and "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not pointers.

Pointers that name no file: none.

Text to move: none. The file is a reference file. The move rules in loading-rules.md are for `SKILL.md` and entry-file text.

Moved text: none.

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "Before a step with a risk"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 109, the heading gives a place in the text, not the condition where the rules are applicable, because the agent uses these rules when it writes a step with a risk, not before it does that step.
- Correction: "When you write a step with a risk"

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 54, the pointer gives its condition only with the pronoun "it", and the heading "When you write a sentence" does not give the condition.
- Correction: "When you write a noun group with a glossary term, obey "When a word is not in the base list or in the glossary" in `technical-terms.md`."

- Rule: "The rule is not usual for the agent. (advisory)"
- Text: "A name counts as its number of words, for example "Claude Code" counts as 2 words."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule changes rule 8.6 of the standard, but no file gives the cause of this change.
- Correction: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word, because <the cause from the user>."
