Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,201 bytes, 65 lines. Limit: none. loading-rules.md gives no file-size limit for a reference file of a Skill.

Pointer list (conditions):
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The sentence gives examples of files, not a file to read.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. The sentence gives the cause of the previous pointer.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer.
- Line 45, heading "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - not a pointer.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Text to move: none. The file is a reference file. The numbered list in "When the write job makes a SKILL.md or entry-file text" in loading-rules.md is for a SKILL.md and entry-file text.

Moved text: none.

Findings:

- Rule: "Add one short cause to a rule in each of these cases:" "The rule is not usual for the agent. (advisory)"
- Text: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the changed rule tells the author not to make pointers from a pointer target, which is not usual for an agent, but the rule gives no cause, and the table row in SKILL.md line 79 gives only a decision.
- Correction: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. An agent can read only a part of a file that a different pointer target identifies."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text."
- Problem: Line 63 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the pointer target SKILL.md (pointer on line 11) already gives in its term "self-check" on line 34 and in step 8 on line 103.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "After the self-check, new reader subagents examine the text in the reader test."
- Problem: Line 64 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the pointer target SKILL.md (pointer on line 11) already gives on line 35: "The **reader test** is a dry run of 3 tasks by new reader subagents after the self-check."
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: Line 65 of skills/writing/agent-instructions/references/plain-language-rules.md gives an instruction that the pointer target review.md (pointer on line 62) already gives in item 1 of "After the self-check: the reader test" on line 214.
- Correction: Remove the sentence.
