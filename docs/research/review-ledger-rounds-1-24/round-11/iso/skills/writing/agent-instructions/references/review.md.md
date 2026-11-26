Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md: 48,357 bytes, 450 lines. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file.
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md (first file of the review target, for context): 17,948 bytes, 151 lines. Limit: 20,000 bytes (loading-rules.md) and less than 500 lines (agent-skills-spec.md).

Pointer list (sections under review: "After the self-check: the reader test", lines 205 to 314, with its subsection "When a reader step does not obey the instruction"):
- Line 216: "For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order." - Not a pointer. The sentence gives an example of a pointer.
- Line 230: "For a Skill, the first file is its `SKILL.md`." - Not a pointer. The sentence defines the first file of the readers.
- Line 230: "When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`." - Not a pointer. The sentence defines the first file of the readers.
- Line 235: "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." - Pointer. The condition is given: the heading "After the self-check: the reader test", item 8 "Before you change a file of the round", and the sentence itself (when you run the report form for reader reports).

Pointers that name no file: none.

Text to move: none. The section is in a reference file. The rules that tell you to move text are for a SKILL.md file and entry-file text.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "After reader-test round 1, correct your text for each problem of the script and each confirmed wrong step. For each quote in the unclear list, correct your text or write a warning."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 242, the condition "After reader-test round 1" now also limits the rule for the unclear list, but item 17 at line 247 expects a correction of an unclear part after the last reader-test round, which can be round 2, so no item tells the author to correct or to write a warning for the unclear list of round 2.
- Correction: "After reader-test round 1, correct your text for each problem of the script and each confirmed wrong step. After each reader-test round, for each quote in the unclear list, correct your text or write a warning."
