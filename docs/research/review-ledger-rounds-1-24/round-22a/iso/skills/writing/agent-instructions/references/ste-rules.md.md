Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,973 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list, ste-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 27, heading "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - The heading and the sentence give the condition.
- Line 28, heading "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`." - The sentence gives the condition.
- Line 31, heading "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - The sentence gives the condition.
- Line 54, heading "When you write a sentence": "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it." - The sentence gives the condition with "for it", and "it" refers to the multi-word noun with a glossary term in the previous sentence.
- Line 54, heading "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - The sentence gives the condition.
- Line 11 (`README.md`, `CHANGELOG.md`) and line 102 (`references/review.md`) are examples, not pointers.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "In a list, the colon stops a sentence (rule 8.4)."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 76, "In a list" puts the colon in the list, but the colon that stops the sentence is before the list, and line 77 says "A colon in the middle of a line does not stop a sentence", so a reader can apply line 76 to a colon in a list item, for example "Tier 1: Put ...".
- Correction: "When a list follows a colon, the colon stops the sentence (rule 8.4)."

- Rule: "The rule is not usual for the agent. (advisory)" (from "Add one short cause to a rule in each of these cases:")
- Text: "This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule does not obey rule 8.6 of ASD-STE100 for names, which is not usual for an agent that knows STE, but the text gives no cause.
- Correction: "This rule is stricter than rule 8.6, which counts a name as 1 word, because the check script cannot find which words make a name."
