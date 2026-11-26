Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,195 bytes. Limit: none. loading-rules.md gives a limit only for entry files and `SKILL.md`. A reference file has no limit.

Pointers in the pointer list of this file, with their conditions:
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives the cause of the previous pointer.
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The files are examples.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer. The folder is a file type.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer. The file is a file type.
- Line 45, heading "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - not a pointer. The file is an example.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Text to move in the sections in the Changes line: none.

Findings:

- Rule: "The agent that loads the file is the only reader. Make no changes for a person. (advisory)"
- Text: "These principles agree with the plain-language definition of the International Plain Language Federation: https://www.iplfederation.org/plain-language-definitions/."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 7, this sentence gives the origin of the principles for a person, and the agent uses no part of it to obey a rule.
- Correction: Remove the sentence. Keep "All four principles are applicable to an agent reader. The ISO rules that tell you to add images are not applicable."

- Rule: "Add one short cause to a rule in each of these conditions:" "The rule changes the usual work of the agent. (advisory)"
- Text: "If no heading gives that condition, add a heading."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 33, the rule to write condition headings in place of topic headings changes the usual work of the agent, and no sentence in this file, `SKILL.md`, `review.md`, `loading-rules.md`, or `ste-rules.md` tells why it is necessary.
- Correction: "If no heading gives that condition, add a heading, because the agent reads the heading to know when the rules of the section are applicable."

- Rule: "Add one short cause to a rule in each of these conditions:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Make no sequences of pointers."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the rule changes the usual work of the agent, and the table in "When two sources do not agree" in `SKILL.md` line 79 gives an exception but no cause.
- Correction: "Make no sequences of pointers, because an agent does not always read a pointer in a pointer target."

- Rule: "Add one short cause to a rule in each of these conditions:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Do not tell the agent that it is an expert."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 58, the rule stops a usual prompt practice of the agent and gives no cause.
- Correction: "Do not tell the agent that it is an expert, because this sentence gives no fact for the task."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 63, the sentence gives the same fact as the term "self-check" in `SKILL.md` line 34 and step 8 in `SKILL.md` line 103.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "After the self-check, new reader subagents examine the text in the reader test."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 64, the sentence gives the same fact as the term "reader test" in `SKILL.md` line 35.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 65, the sentence gives the same instruction as item 1 of "After the self-check: the reader test" in `review.md` line 214, and line 62 already points to `review.md` for the reader test.
- Correction: Remove the sentence.
