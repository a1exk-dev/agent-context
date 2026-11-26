Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,236 bytes, 65 lines. Limit: none. loading-rules.md gives a limit only for entry files and `SKILL.md`. This file is a reference file of a Skill.

Pointer list (sentences of skills/writing/agent-instructions/references/plain-language-rules.md that name a file path):
- Line 3, heading "Plain-language rules": "The rules are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - Not a pointer. The sentence gives examples of files, and does not tell the agent to read them.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - Pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. The sentence gives the cause of the previous pointer.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - Not a pointer. The path identifies a type of file for the rule.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - Not a pointer. The path identifies a type of file for the rule.
- Line 45, heading "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - Not a pointer. The path is an example of a file type.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - Pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - Pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Text to move: none.

Moved text: none.

Findings:

- Rule: "Add one short cause to a rule in each of these cases:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers. (advisory)"
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the changed rule tells the agent not to put a pointer in a pointer target, which changes the usual work of an agent that adds a pointer where it writes the text, but the rule and its pointer targets give no cause.
- Correction: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers, because an agent does not always read the target of a pointer in a pointer target. (advisory)"

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 65, the sentence gives the same instruction as skills/writing/agent-instructions/references/review.md line 215 ("If the user told you that an agent did not obey an instruction, make one task from that problem."), and review.md is the pointer target of line 62, which the agent reads before the reader test.
- Correction: "After agents use the file, the edit job examines the text again."
