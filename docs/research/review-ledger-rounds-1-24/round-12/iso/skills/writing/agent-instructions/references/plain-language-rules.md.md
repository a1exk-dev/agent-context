Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,201 bytes, 65 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill. agent-skills-spec.md gives a line limit only for `SKILL.md`.

Pointer conditions (pointer list of the check script for this file):
- Line 3, heading "Plain-language rules": "They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer. The sentence gives examples, not a file to read.
- Line 11, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer.
- Line 33, heading "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer.
- Line 34, heading "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer.
- Line 45, heading "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - not a pointer.
- Line 50, heading "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition. The file name without its folder is permitted by the table in "When two sources do not agree" in SKILL.md.
- Line 62, heading "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition. The file name without its folder is permitted by the same table in SKILL.md.

Pointers that name no file: none.

Text to move: none. The rules that tell you to move text in loading-rules.md are for a `SKILL.md` file and entry-file text, not for a reference file.

Moved text: none.

Findings:

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The rules are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 3, these 2 sentences give the scope that the pointer target skills/writing/agent-instructions/SKILL.md already gives in line 18 ("A file for persons is not an Agent instruction") and in lines 44 to 46 ("Files that are not Agent instructions", with `README.md` and commit messages).
- Correction: Remove the 2 sentences. Keep "These rules are tier 3." on line 3.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text. After the self-check, new reader subagents examine the text in the reader test."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md lines 63 and 64, these 2 sentences give the sequence that the pointer target skills/writing/agent-instructions/SKILL.md already gives in lines 34 and 35 (the terms "self-check" and "reader test") and in steps 8 and 9 on lines 103 and 104.
- Correction: Remove the 2 sentences. Keep "When you do the self-check or the reader test, read `review.md`." on line 62.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When the user tells you that an agent did not obey an instruction, make one typical task of the reader test from that problem."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 65, this rule repeats the rule that the pointer target skills/writing/agent-instructions/references/review.md gives in line 214 ("If the user told you that an agent did not obey an instruction, make one task from that problem."), and the pointer on line 62 tells the agent to read review.md for the reader test.
- Correction: Remove the sentence.
