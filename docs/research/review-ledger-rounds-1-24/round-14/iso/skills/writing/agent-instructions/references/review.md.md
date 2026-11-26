Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,402 bytes, 450 lines. Limit: none. The file is a reference file of a Skill, and the table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Text to move:
- None. The file is a reference file. The rules in loading-rules.md that tell you to move text are for a `SKILL.md` file and entry-file text. The Changes line gives no moved section.

Pointer list for the sections under review ("After the self-check: the reader test", lines 205 to 315):
- Line 216: "For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order." - Not a pointer. The sentence gives an example of a pointer as quoted text.
- Line 231: "For a Skill, the first file is its `SKILL.md`." - Not a pointer. The sentence identifies the first file of the readers.
- Line 231: "When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`." - Not a pointer. The sentence identifies the first file of the readers.
- Line 235: "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - Pointer. The heading gives "After the self-check", and item 8 starts with the condition "Before you change a file of the round". The pointer gives the file and the condition.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "It uses the same file, words, or condition as these rules, but these rules are not applicable to it."
- Problem: In skills/writing/agent-instructions/references/review.md line 215, the out-of-scope task uses "the same ... condition as these rules", but line 216 tells the author to select a task that agrees with no condition and to write a different task if a condition is applicable to it.
- Correction: "It uses the same file or words as these rules, but no condition of these rules is applicable to it."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "Do the reader test in each job, also for a small change."
- Problem: In skills/writing/agent-instructions/references/review.md line 209, the sentence gives again the instruction of step 9 in skills/writing/agent-instructions/SKILL.md line 104 ("do the reader test that `references/review.md` gives, also for a small change"), and `SKILL.md` is a pointer target of review.md (line 235).
- Correction: Remove the sentence, and start the paragraph with "Also do the reader test when you expect that it finds no problem."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When each changed file is a list file, do no reader test."
- Problem: In skills/writing/agent-instructions/references/review.md line 211, the sentence gives again the instruction of step 9 in skills/writing/agent-instructions/SKILL.md line 104 ("When the job changes only list files, do no reader test."), and `SKILL.md` is a pointer target of review.md (line 235).
- Correction: Remove the sentence. Keep "When the job also changes a different file, give the readers only the files that are not list files."
