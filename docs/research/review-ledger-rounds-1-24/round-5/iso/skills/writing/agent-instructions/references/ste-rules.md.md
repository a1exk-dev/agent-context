Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,953 bytes. Limit: none. The file is a reference file of a Skill, and "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer conditions (pointer list of the check script for this file):
- Line 7, "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading "Before you use this file" and the sentence give the condition.
- Line 7, "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. The sentence gives information about the target of the previous pointer.
- Line 11, "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - Not a pointer. The file names are examples.
- Line 27, "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - The sentence gives the condition.
- Line 28, "When the glossary and the base list have no noun for an item, do the steps in "When a word is not in the base list or in the glossary" in `technical-terms.md`." - The sentence gives the condition.
- Line 31, "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - The sentence gives the condition: when you write a term in bold.
- Line 54, "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it." - The sentence gives no condition. Only the pronoun "it" refers to the condition in the previous sentence, and the heading "When you write a sentence" does not give it.
- Line 54, "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - The sentence gives the condition.
- Line 102, "Read references/review.md first." - Not a pointer. The sentence is an example in the word-count table.

Pointers that name no file: none.

Text to move: none. ste-rules.md is a reference file. The rules that tell you to move text are for a `SKILL.md` file and entry-file text.

Moved text: none. The Changes line gives no moved section.

Findings:

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 54, under the heading "When you write a sentence", the pointer gives its condition only through the pronoun "it", so the pointer sentence alone does not tell when to read the target.
- Correction: "When you write a multi-word noun with a glossary term, obey "When a word is not in the base list or in the glossary" in `technical-terms.md`."

- Rule: "The rule is not usual for the agent. (advisory)" (from "Add one short cause to a rule in each of these conditions:")
- Text: "This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 84, the rule changes the word count of ASD-STE100 rule 8.6 for names, but the text gives no cause for the stricter count.
- Correction: "This rule is stricter than rule 8.6, which counts a name as 1 word, because <the cause from the author or the user>." If no file and no user gives the cause, add a warning.

- Rule: "The rule changes the usual work of the agent. (advisory)" (from "Add one short cause to a rule in each of these conditions:")
- Text: "Also write it when a heading above the step gives a condition."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md, line 113, the rule tells the agent to write the condition of a heading again in a step, which an agent usually does not do, but the text gives no cause.
- Correction: "Also write it when a heading above the step gives a condition, because <the cause from the author or the user>." If no file and no user gives the cause, add a warning.
