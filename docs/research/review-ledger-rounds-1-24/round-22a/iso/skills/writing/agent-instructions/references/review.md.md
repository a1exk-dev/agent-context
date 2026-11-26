Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/review.md: 48,598 bytes, 452 lines. Limit: none in "When you examine the file size" of loading-rules.md for a reference file of a Skill. The 20,000-byte limit is for `SKILL.md` only.

Text to move in the sections under review:
- none. "When you recommend text to move" is applicable to entry files and Skills. review.md is a reference file. Its prompts in code blocks are already in a reference file.

Moved text that does not obey loading-rules.md:
- none. The Changes line gives "all" and no moved section.

Pointer list of review.md: the condition of each sentence
- Line 14, "No platform can make a subagent read-only from a `SKILL.md` file.": not a pointer. It gives a fact.
- Line 15, "The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.": not a pointer. It gives the location for step 4, which gives the paths to the subagents.
- Line 56, "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you.": pointer. The heading "Before each review round" and the action "Run the check script" give the condition. The target section exists.
- Line 61, "Before you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`.": pointer. The sentence and the heading "When you start the reviewers" give the condition. The target section exists.
- Line 61, "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer.": not a pointer. It refers to the text of this file.
- Lines 67, 68, 69 (table cells of reference files): not pointers to read for the author. They give the files for each reviewer.
- Line 71, "The glossary and `MEMORY.md` are not pointer targets." and "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line.": not pointers.
- Line 155, "Run it as "When you run the check script" in `SKILL.md` tells you.": pointer. "Before you change a file of the round, run the report form of the check script" in the same item gives the condition. The target section exists.
- Line 201, "Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you.": pointer. The heading "After the last review round" and the action "Run the check script" give the condition. The target section exists.
- Line 217, "For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order.": not a pointer. It is an example.
- Line 232, "For a Skill, the first file is its `SKILL.md`." and "When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`.": not pointers. They select the files of the readers.
- Line 236, "Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you.": pointer. "Before you change a file of the round, run the report form for reader reports one time for the round" in the same item gives the condition. The target section exists.
- Line 323, "A project often keeps the tests of a Skill in a folder with a `README.md` file, for example `tests/skills/<category>/<name>/`.": not a pointer. It tells where to find the tests.
- Line 328, "Run each test as the `README.md` of the tests tells you." and "Then grade each test as that `README.md` tells you.": pointers. The actions "Run each test" and "grade each test" give the condition. Each sentence names `README.md` of the tests.
- Line 348, "Make the setup of the check in that copy, as the `README.md` of the tests tells you.": pointer. The action "Make the setup of the check" and the heading "When you run a manual check" give the condition.
- Line 430, "Write it as the Warnings part in `end-of-run-report.md` tells you.": pointer. "When you write the end-of-run report" in the same item gives the condition.
- Line 434, "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you.": pointer. The sentence gives the condition. The target is this file.
- Line 447, "You can save the JSON output of the check script with `>`, as `SKILL.md` shows.": not a pointer. It gives a permission.

Pointers that name no file:
- none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A reviewer also fails when its last message does not give the report path of each file in the round list."
- Problem: In skills/writing/agent-instructions/references/review.md, line 42 says that a reviewer fails when its last message does not give the report path of each file in the round list, but the reviewer prompt on lines 124 and 125 tells a new reviewer with the same report folder not to review a file that has a report and to give "only the list of the saved paths", so a correct new reviewer fails by line 42 and item 6 then makes the author do all later checks without subagents.
- Correction: "A reviewer also fails when, after its last message, its report folder does not have the report of each file in the round list."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md, line 434 is in review.md and points to review.md with no section, and item 4 of "During and after a review round" on line 157 already tells the agent to correct the text or to reject the finding.
- Correction: "When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you."

- Rule: "Add one short cause to a rule in each of these cases: The rule changes the usual work of the agent. (advisory) The rule is not usual for the agent. (advisory) To obey the rule, the agent must make a decision. (advisory)"
- Text: "Give no list file in the `Changes:` line of the loading reviewer."
- Problem: In skills/writing/agent-instructions/references/review.md, line 61 changes the usual review round of 3 reviewers on line 21, but neither review.md nor `SKILL.md` step 8 tells why the loading reviewer gets no list file.
- Correction: "Give no list file in the `Changes:` line of the loading reviewer, because loading-rules.md gives no file-size limit and no text to move for a list file."
