Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 113: "A step that other persons can see, but that you can undo, has no risk of this type."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,953 bytes, 124 lines. Limit: none. loading-rules.md, "When you examine the file size", gives limits only for entry files, `SKILL.md`, the glossary, `MEMORY.md`, and `docs/agents/` files. This file is a reference file of a Skill.

Pointers in the pointer list:
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - gives the condition.
- Line 7, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer, gives information.
- Line 11, heading "When you use STE for text": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer, gives examples.
- Line 27, heading "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - gives the condition.
- Line 28, heading "When you select a technical noun": "When the glossary and the base list have no noun for an item, do the steps in "When a word is not in the base list or in the glossary" in `technical-terms.md`." - gives the condition.
- Line 31, heading "When you select a technical noun": "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - gives the condition.
- Line 54, heading "When you write a sentence": "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it." - gives no condition in the sentence. See the finding.
- Line 54, heading "When you write a sentence": "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - gives the condition.
- Line 102, heading "When you count words": "Read references/review.md first." - not a pointer, an example sentence in a table.

Pointers that name no file: none.

Text to move: none. ste-rules.md is a reference file. The move rules in loading-rules.md are for a `SKILL.md` file and entry-file text. The Changes line gives no moved section.

Findings:

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "A step that other persons can see, but that you can undo, has no risk of this type."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 113, the rule "Write a condition at the start of that step" is applicable to a step that has no risk, but its heading "Before a step with a risk" (line 109) gives only the condition of a step with a risk.
- Correction: Move the line 113 rule to a new section after the last section, with the heading "When you write a step that other persons can see", and keep its text: "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)"

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a word is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 54, the pointer to `technical-terms.md` gives no condition in its sentence, and its heading "When you write a sentence" does not give the condition either, so the agent must find the condition in the previous sentence through the pronoun "it".
- Correction: "When you write a multi-word noun with a glossary term, obey "When a word is not in the base list or in the glossary" in `technical-terms.md`."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Then tell the risk or the possible result in a second sentence (rule 7.3). (advisory)"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md lines 116 to 119, the rules "Start the safety instruction with the signal word CAUTION", "After CAUTION, write the instruction or the condition first", and "Then tell the risk" give steps in a sequence, but they are bullets.
- Correction: Write the 3 items as a numbered list: "1. Start the safety instruction with the signal word CAUTION. A CAUTION is for a risk of damage. (advisory)" "2. After CAUTION, write the instruction or the condition first (rule 7.2). (advisory)" "3. In a second sentence, tell the risk or the possible result (rule 7.3). (advisory)"

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3). (advisory)"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 72, the rule starts with "In a safety list", which writes again the condition of its heading "When you write a safety list" (line 70).
- Correction: "Write "do not" in each item that tells the reader not to do an action (rule 4.3). (advisory)"

- Rule: Add one short cause to a rule in each of these cases: "The rule is not usual for the agent. (advisory)"
- Text: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule does not obey rule 8.6 of the standard, which is not usual for the agent, and the text gives no cause for the stricter count.
- Correction: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word, because <the cause from the author or the user>." If no file and no user gives the cause, add a warning.
