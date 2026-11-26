Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/ste-rules.md has 9,973 bytes. It is a reference file. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer conditions (pointer list, ste-rules.md):
- Line 7, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - the sentence gives the condition.
- Line 27, "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - the sentence gives the condition.
- Line 28, "When you select a technical noun": the sentence gives the condition "When the glossary and the base list have no noun for an item".
- Line 31, "When you select a technical noun": the sentence gives the condition "only when the glossary or the base list in `technical-terms.md` has it".
- Line 54, "When you write a sentence": "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it." - the sentence gives no condition of its own. The heading gives a different condition. See the finding.
- Line 54, "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - the sentence gives the condition.
- Lines 11 and 102 are examples, not pointers.
Pointers that name no file: none.

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 54, the pointer gives its condition only through the pronoun "it" from the previous sentence, and the heading "When you write a sentence" does not give the condition to read technical-terms.md.
- Correction: "When you write a multi-word noun with a glossary term, obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`."

- Rule: "The rule is not usual for the agent. (advisory)" (an item of "Add one short cause to a rule in each of these cases:")
- Text: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule changes the word count of ASD-STE100 rule 8.6 but gives no cause for the change.
- Correction: Add one short cause after the rule, for example "This rule is stricter than rule 8.6, which counts a name as 1 word, because <the cause that the user gives>." If no file and no user gives the cause, add a warning.
