Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,953 bytes, 124 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script, ste-rules.md):
- Line 7, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 7, "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. It tells what the target of the previous pointer gives.
- Line 11, "When you use STE for text": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - Not a pointer. The file names are examples.
- Line 27, "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - The heading and the sentence give the condition.
- Line 28, "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in "When a word is not in the base list or in the glossary" in `technical-terms.md`." - The sentence gives the condition.
- Line 31, "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - The heading and the sentence give the condition.
- Line 54, "When you write a sentence": "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it." - The sentence gives the condition with "for it". "it" refers only to the multi-word noun with a glossary term in the previous sentence.
- Line 54, "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - The sentence gives the condition.
- Line 102, "When you count words": "Read references/review.md first." - Not a pointer. It is an example sentence in the table of word counts.

Pointers that name no file: none.

Text to move: none. ste-rules.md is a reference file. The rules in loading-rules.md that tell you to move text are for a SKILL.md file and entry-file text.

Findings:

- Rule: "Add one short cause to a rule in each of these cases:" - "The rule is not usual for the agent. (advisory)"
- Text: "Also write it when a heading above the step gives a condition."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 113, the rule tells the agent to write the condition of the heading again in the step, which is not usual and which "Do not write the condition of the heading again in each rule of the section" in plain-language-rules.md line 36 tells the agent not to do, but the text gives no cause.
- Correction: "Also write it when a heading above the step gives a condition, because an agent can read the step without its heading."

- Rule: "Add one short cause to a rule in each of these cases:" - "The rule is not usual for the agent. (advisory)"
- Text: "This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule changes the word count of ASD-STE100 rule 8.6 for a name, but the text tells only that the rule is stricter and gives no cause for the change.
- Correction: "This rule is stricter than rule 8.6, which counts a name as 1 word. A name with many words makes the sentence longer for the reader."
