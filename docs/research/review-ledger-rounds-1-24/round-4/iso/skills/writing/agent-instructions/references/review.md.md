Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/review.md has 48,313 bytes. Limit: loading-rules.md and agent-skills-spec.md give no limit for a reference file of a Skill.

Pointer conditions in the sections under review:
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." Item 2 gives the condition: "Before you change a file of the round, run the report form of the check script once for each file in the round list."
- Line 200, "After the last review round": "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you." The heading and the step give the condition.
- Line 216, "After the self-check: the reader test": "For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order." This sentence is an example, not a pointer.
- Line 230, "After the self-check: the reader test": "For a Skill, the first file is its `SKILL.md`." and "When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`." These sentences are rules, not pointers.
- Line 235, "After the self-check: the reader test": "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you." Item 8 gives the condition: "Before you change a file of the round".
- Line 322, "After the reader test: the output tests and the manual checks": "A project often keeps the tests of a Skill in a folder with a `README.md` file, for example `tests/skills/<category>/<name>/`." This sentence is a fact, not a pointer.
- Line 327, "After the reader test: the output tests and the manual checks": "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you." Step 6 gives the condition: the run of the selected output tests.
- Line 347, "When you run a manual check" (in "After the reader test: the output tests and the manual checks"): "Make the setup of the check in that copy, as the `README.md` of the tests tells you." Step 1 gives the condition.
- Line 433, "When a reviewer gives a finding": "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you." The sentence gives the condition. Its target is this file.

Pointers that name no file: none. The other references in these sections give a heading of this file.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 433, the pointer identifies review.md, the file that contains it, and repeats item 4 of "During and after a review round" at line 156 without the place in the file.
- Correction: When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you.
