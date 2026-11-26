Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,989 bytes. Limit: a maximum of 20,000 bytes. 151 lines. Limit: less than 500 lines.

Pointer conditions in "When you run the check script":
- Line 117: "When you do the self-check, `references/review.md` tells you when to run the check script." - The heading and the sentence give the condition.
- Line 140: "For the reader reports of a reader-test round, give each file of the readers with its copy, and the tasks file that `references/review.md` gives." - The heading and the sentence give the condition.
- Line 117 "The check script `scripts/check.ts` is in the folder of this `SKILL.md` file." and line 123 "Replace `<skill folder>` with the absolute path of the folder of this `SKILL.md` file." give the location of the script. They do not tell the agent to read a file.
- Pointers that name no file: none.

Text to move: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The report form of the script examines the 3 reviewer reports of one file."
- Problem: In skills/writing/agent-instructions/SKILL.md line 130, the report form always examines 3 reviewer reports, but references/review.md line 61 gives only 2 reviewers and 2 reports for a list file.
- Correction: "The report form of the script examines the reviewer reports of one file: 3 reports, or 2 reports for a list file."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "If the script gives no JSON, stop the self-check and the reader test."
- Problem: Together with "The exit codes are the same as in the first form." in skills/writing/agent-instructions/SKILL.md line 138, line 128 tells the agent to stop the self-check at each exit code 2 of the report form, but references/review.md line 42 tells the agent that exit code 2 for a missing report path means a failed reviewer and that a new reviewer starts.
- Correction: "If the first form gives no JSON, stop the self-check and the reader test." Also add to the report form: "When the report form gives exit code 2 for a missing report path, do the steps for a failed reviewer in `references/review.md`."
