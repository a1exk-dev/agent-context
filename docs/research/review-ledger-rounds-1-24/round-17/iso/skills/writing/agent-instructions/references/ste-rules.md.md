Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 109: "Before a step with a risk"
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,973 bytes, 124 lines. Limit: none. loading-rules.md gives no file-size limit for a reference file of a Skill.

Pointer list (sentences in the pointer list for this file):
- Line 7: "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer; it gives a fact.
- Line 11: "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer; the paths are examples.
- Line 27: "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - pointer; the sentence gives the condition.
- Line 28: "When the glossary and the base list have no noun for an item, do the steps in "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`." - pointer; the sentence gives the condition.
- Line 31: "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - pointer; the sentence gives the condition.
- Line 54: "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it." - pointer; "for it" refers to the multi-word noun of the sentence before it, which gives the condition.
- Line 54: "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - pointer; the sentence gives the condition.
- Line 102: "Read references/review.md first." - not a pointer; it is an example sentence in the word-count table.

Findings:

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "Before a step with a risk"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 109, the heading gives the time before an agent does a step with a risk, but the rules on lines 111 to 119 are applicable when the author writes a step with a risk, as each other heading of the file ("When you write ...") shows.
- Correction: "When you write a step with a risk"

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "These rules are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 11, the text repeats what the pointer target SKILL.md gives in "Terms in this skill" (lines 14 to 18) and in "Files that are not Agent instructions" (lines 44 to 46), and line 7 of ste-rules.md tells the agent to read SKILL.md first.
- Correction: Remove the item on line 11.

- Rule: "Add one short cause to a rule in each of these cases:" "The rule is not usual for the agent. (advisory)"
- Text: "Write a maximum of 25 words in each sentence. This limit is applicable to all text. (script check)"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 51, the rule applies the 25-word limit also to procedure sentences, which is different from the STE limit that an agent knows, and the file gives no cause for this change.
- Correction: "Write a maximum of 25 words in each sentence. This limit is applicable to all text, because the check script uses one limit for all sentences. (script check)" (Use the true cause of the author.)

- Rule: "Add one short cause to a rule in each of these cases:" "The rule changes the usual work of the agent. (advisory)"
- Text: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 84, the rule replaces STE rule 8.6, but the file tells only that the rule is stricter and not why the rule is necessary.
- Correction: "A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word, because <the cause of the author>."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3). (advisory)"
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 72, the rule writes again the condition of its heading "When you write a safety list" on line 70, and the rule is not a pointer.
- Correction: "Write "do not" in each item that tells the reader not to do an action (rule 4.3). (advisory)"
