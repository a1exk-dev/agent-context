Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7145 bytes, 65 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Text to move:
- none. The file is a reference file of a Skill. The rules that tell you to move text are for a `SKILL.md` file and entry-file text.

Moved text:
- none.

Pointer list of this file:
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The sentence gives examples of files that the rules are not applicable to.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. The sentence gives a fact about the target of the previous pointer.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer. The sentence gives the files that the rule is applicable to.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer. The sentence gives the files that the rule is applicable to.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file:
- none. Line 51 has "that file" in "When the project has a glossary, use each glossary term with its meaning in that file." This sentence is a rule about words, not a pointer. "Terms in this skill" in `SKILL.md` gives the paths of the glossary, and step 2 in `SKILL.md` tells the agent to read it.

Findings:

- Rule: "Add one short cause to a rule in each of these conditions:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Put a pointer to each pointer target directly in the file that has the pointer."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the changed rule stops the usual chain of references from one file to the next, but it gives no cause, and no pointer target gives the cause.
- Correction: "Put a pointer to each pointer target directly in the first file that the agent reads, for example `SKILL.md`, because an agent can stop before it reads the end of a sequence of pointers."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: skills/writing/agent-instructions/references/plain-language-rules.md line 65 gives the same rule as skills/writing/agent-instructions/references/review.md line 214 ("If the user told you that an agent did not obey an instruction, make one task from that problem."), and the pointer on line 62 tells the agent to read `review.md` for the reader test.
- Correction: Remove the sentence. Keep "When you do the self-check or the reader test, read `review.md`."
