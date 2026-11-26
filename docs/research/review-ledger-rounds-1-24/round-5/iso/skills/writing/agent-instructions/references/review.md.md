Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48,313 bytes, 450 lines. Limit: none. `loading-rules.md` and `agent-skills-spec.md` give no file-size limit for a reference file of a Skill.

Pointer conditions (pointer list of the check script for skills/writing/agent-instructions/references/review.md):
- Line 14, "When you start a subagent": "No platform can make a subagent read-only from a `SKILL.md` file." - not a pointer.
- Line 15, "When you start a subagent": "The reference files are in the `references/` folder next to the `SKILL.md` file of this skill." - not a pointer. It gives a location.
- Line 56, "Before each review round": "Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you." - the heading and the step give the condition.
- Lines 65 to 67, "When you start the reviewers": the table cells give the reference files of each reviewer. The heading gives the condition.
- Line 69, "When you start the reviewers": the 2 sentences about `MEMORY.md` are not pointers.
- Line 71, "When you start the reviewers": "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`." - the sentence gives the condition.
- Line 71: "Where `review.md` gives 3 reviewers, ..." - not a pointer. It refers to this file.
- Line 154, "During and after a review round": "Run it as "When you run the check script" in `SKILL.md` tells you." - the previous sentence of item 2 gives the condition "Before you change a file of the round", and the action gives when to read the section.
- Line 200, "After the last review round": the heading and the step give the condition.
- Line 216: the quoted pointer is an example, not a pointer.
- Line 230: the 2 sentences give the first file of the readers. They are not pointers.
- Line 235, "After the self-check: the reader test": item 8 gives the condition "Before you change a file of the round".
- Line 322: not a pointer. It gives where a project often keeps its tests.
- Line 327, "After the reader test: the output tests and the manual checks": the step gives the condition. "that `README.md`" refers to the `README.md` of the tests in item 1, which gives its folder.
- Line 347, "When you run a manual check": the heading and step 1 give the condition.
- Line 429, "When no subagent is available": the previous sentence of item 7 gives the condition "When you write the end-of-run report".
- Line 433, "When a reviewer gives a finding": the sentence gives the condition, but the target is this file. See the finding.
- Line 446, "When you save a file or run a command in a round": not a pointer to read. It permits `>`.

Pointers that name no file: none.

Moved sections: none.

Text to move: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In skills/writing/agent-instructions/references/review.md line 433, the pointer identifies the file that contains it and no section, and it tells the agent to correct or reject each finding, but item 5 of "During and after a review round" (line 157) tells the agent to put some findings in a warning and not to correct them.
- Correction: "When a reviewer gives a finding, do items 4 and 5 of "During and after a review round"."
