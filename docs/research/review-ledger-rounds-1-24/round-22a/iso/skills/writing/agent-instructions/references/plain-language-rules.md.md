Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 45: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers."; line 46: "When the file does not load in each session, find a pointer to it in a different Agent instruction. If you find no pointer, add a warning."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,236 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file of a Skill, and the rules that tell you to move text are for a SKILL.md file and entry-file text.

Moved text: none.

Pointer list:
- Line 3, "Plain-language rules": "The rules are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages." - not a pointer.
- Line 11, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 11, "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer.
- Line 33, "When you put the text in sections and lists": "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." - not a pointer.
- Line 34, "When you put the text in sections and lists": "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." - not a pointer.
- Line 45, "When you put the text in sections and lists": "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." - not a pointer.
- Line 50, "When you select the words and the tone": "When you select a word or write a sentence, obey the rules in `ste-rules.md`." - pointer. The heading and the sentence give the condition.
- Line 62, "When you test the text": "When you do the self-check or the reader test, read `review.md`." - pointer. The heading and the sentence give the condition.

Pointers that name no file: none.

Findings:

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the rule is applicable when the author selects the file that contains a pointer, but its heading "When you put the text in sections and lists" (line 30) gives the condition for sections and lists, not for the file of a pointer.
- Correction: Put the rule in a new section at the end of the file, under the heading "## When you select the file for a pointer".

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "When the file does not load in each session, find a pointer to it in a different Agent instruction. If you find no pointer, add a warning."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 46, the rule is applicable when the author writes or edits a file that does not load in each session, but its heading "When you put the text in sections and lists" (line 30) does not give that condition.
- Correction: Put the rule in a new section at the end of the file, under the heading "## When you write a file that does not load in each session".

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory)"
- Text: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the job changed this rule, and the rule changes the usual work of an agent, which often puts a pointer in the file that it edits, but the rule gives no cause.
- Correction: Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers, because an agent can stop before it reads the last file of a sequence.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The rules are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 3, the job changed this sentence, and the pointer target SKILL.md already gives this limit in "Files that are not Agent instructions" (lines 42 to 51), which tells the agent to do a task about a file for persons, for example `README.md` or a commit message, without this skill.
- Correction: These rules are tier 3. The rules are applicable only to Agent instructions.
