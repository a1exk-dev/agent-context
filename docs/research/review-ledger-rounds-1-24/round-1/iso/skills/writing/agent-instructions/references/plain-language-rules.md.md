Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,098 bytes, 65 lines. Limit: none. loading-rules.md, "When you examine the file size", gives no limit for a reference file of a Skill.

Pointers in the pointer list of this file:
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The file names are examples of text for persons.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Text to move: none. This file is a reference file, and the rules that tell you to move text are for a SKILL.md and for entry-file text.

Moved text: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A rule with no condition is permitted only when it is applicable to all tasks for its file."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md, line 17 permits a rule with no condition, but line 33 tells the author to put each rule of a reference file, a `docs/agents/` file, or a file that loads in each session in a section whose heading gives a condition, so the two lines do not tell where a rule for all tasks goes.
- Correction: "A rule with no condition is permitted only when it is applicable to all tasks for its file. In a file that line 33 gives, put such a rule in a section whose heading gives the condition of all tasks of the file, for example "When you write or edit an Agent instruction"."

- Rule: Add one short cause to a rule in each of these conditions: "The rule changes the usual work of the agent. (advisory)"
- Text: "Use the condition that is applicable to the smallest number of tasks."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md, line 17 tells the author to select the narrowest condition, which is not the usual work of an agent and makes a decision necessary, but neither this file nor a pointer target gives the cause.
- Correction: "Use the condition that is applicable to the smallest number of tasks, because the agent then reads the rule only in the tasks that make it necessary."

- Rule: Add one short cause to a rule in each of these conditions: "The rule is not usual for the agent. (advisory)"
- Text: "Put each pointer target one step from the file that has the pointer."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md, line 45 forbids sequences of pointers, which is not a usual limit for an agent, but neither this file nor a pointer target gives the cause.
- Correction: "Put each pointer target one step from the file that has the pointer, because an agent does not always read the target of a pointer in a pointer target."
