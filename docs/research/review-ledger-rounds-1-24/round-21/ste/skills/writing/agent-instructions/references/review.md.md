Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - line 114: "Write the file size of each file and its limit."; line 115: "Give a finding for each text to move in a section in the Changes line."
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - none
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - none
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md: 48,596 bytes, 451 lines. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Sections under review: "When you start the reviewers" (lines 59 to 205, with its sections "During and after a review round", "When a reviewer has blocking findings", and "After the last review round").

Findings:

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Write the file size of each file and its limit."
- Problem: In the reviewer prompt at line 114 of /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md, the sentence omits which files (each file that the reviewer reads, or only each file that it reviews) and where to write the file size, so a reviewer can write the size of each pointer target or put the size before the blocking checklist that line 127 tells it to put first.
- Correction: "In each report, after the blocking checklist, write the file size of the file of that report and its limit."

- Rule: 4.2 "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)"
- Text: "Give a finding for each text to move in a section in the Changes line."
- Problem: In the reviewer prompt at line 115 of /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md, the words "text to move" omit the rule source that tells which text to move, so the ASD-STE100 reviewer and the ISO 24495-1 reviewer, whose rule files do not include loading-rules.md, can decide by their own judgment which text to move.
- Correction: "Give a finding for each text in a section in the Changes line that loading-rules.md tells you to move."
