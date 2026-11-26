Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,201 bytes, 65 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Pointer conditions (pointer list of the check script, sentences in plain-language-rules.md):
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The files are examples of files where the rules are not applicable.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. The sentence gives the cause of the pointer before it.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer. The folder is a file type where the rule is applicable.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer. The file is a file type where the rule is applicable.
- Line 45, heading "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - not a pointer. The file is an example.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text."
- Problem: Line 63 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the pointer target `SKILL.md` (line 11 pointer) already gives in step 8 of "Steps of the write job and the edit job" (line 103) and in the term "self-check" (line 34), and the pointer target `review.md` (line 62 pointer) gives it in full.
- Correction: Remove the sentence "During the write job or the edit job, the self-check examines the text."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "After the self-check, new reader subagents examine the text in the reader test."
- Problem: Line 64 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the pointer target `SKILL.md` already gives in the term "reader test" (line 35) and in step 9 (line 104), and that the pointer target `review.md` gives in "After the self-check: the reader test" (line 205).
- Correction: Remove the sentence "After the self-check, new reader subagents examine the text in the reader test."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: Line 65 of skills/writing/agent-instructions/references/plain-language-rules.md gives an instruction that the pointer target `review.md` (pointer on line 62) already gives on line 214: "If the user told you that an agent did not obey an instruction, make one task from that problem."
- Correction: Remove the sentence "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."

- Rule: "Add one short cause to a rule in each of these cases:" "The rule changes the usual work of the agent. (advisory)"
- Text: "Do not tell the agent that it is an expert."
- Problem: Line 58 of skills/writing/agent-instructions/references/plain-language-rules.md changes a usual prompt practice (a role sentence such as "You are an expert"), but neither this file nor a pointer target tells why the rule is necessary.
- Correction: "Do not tell the agent that it is an expert, because this sentence gives the agent no fact that it can use for the task."

- Rule: "Add one short cause to a rule in each of these cases:" "The rule is not usual for the agent. (advisory)"
- Text: "Make no sequences of pointers."
- Problem: Line 45 of skills/writing/agent-instructions/references/plain-language-rules.md gives a rule that is not usual for an agent, and neither this file nor a pointer target tells why the rule is necessary; the table in `SKILL.md` (line 79) gives only an exception.
- Correction: "Make no sequences of pointers, because the agent can stop before it reads the last file of a sequence."
