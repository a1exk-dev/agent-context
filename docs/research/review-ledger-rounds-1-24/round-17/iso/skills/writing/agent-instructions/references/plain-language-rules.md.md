Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7236 bytes, 65 lines. Limit: no limit. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`. This file is a reference file of a Skill.

Pointer conditions:
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - The heading and the sentence give the condition.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - The heading and the sentence give the condition.
- Lines 3, 33, 34, and 45 name a file path only as an example or as a file type. These sentences are not pointers.

Pointers that name no file: none.

Text to move: none. The file is a reference file, and the Changes line gives no moved section.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 65, this sentence gives the same instruction as item 1 of "After the self-check: the reader test" in the pointer target review.md line 214 ("If the user told you that an agent did not obey an instruction, make one task from that problem."), and the pointer on line 62 already sends the agent to review.md for the reader test.
- Correction: Remove the sentence. Keep "After agents use the file, the edit job examines the text again."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "After the self-check, new reader subagents examine the text in the reader test."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 64, this sentence gives only the definition of the reader test that the pointer target SKILL.md line 35 gives ("a dry run of 3 tasks by new reader subagents after the self-check"), and SKILL.md step 9 gives the same sequence.
- Correction: Remove the sentence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 63, this sentence gives a fact that the pointer target SKILL.md already gives in step 8 of "Steps of the write job and the edit job" (line 103) and in the term "self-check" (line 34).
- Correction: Remove the sentence.

- Rule: "The rule changes the usual work of the agent. (advisory)"
- Text: "Make no sequences of pointers."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, this rule is in the list under "Add one short cause to a rule in each of these cases:" because it changes how an agent usually links files, but no file gives why a sequence of pointers is a problem, for example that an agent can stop before it reads the second pointer target.
- Correction: "Make no sequences of pointers, because an agent can stop before it reads the target of the second pointer."
