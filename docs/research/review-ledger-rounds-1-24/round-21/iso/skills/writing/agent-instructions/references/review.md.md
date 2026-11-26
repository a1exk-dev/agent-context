Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 71: "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`."
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 116: "Also give a finding for each text that the author moved and that does not obey loading-rules.md."

File sizes:
- skills/writing/agent-instructions/references/review.md: 48,596 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move in the sections under review: none. The section "When you start the reviewers" is in a reference file, and the prompt in its code block is already in a reference file.

Moved sections: none in the Changes line.

Pointer list, sentences in the section "When you start the reviewers" (heading: "When you start the reviewers"):
- Line 65, 66, 67 (table cells with `review.md`, `loading-rules.md`, `agent-skills-spec.md`, `ste-rules.md`, `technical-terms.md`, `plain-language-rules.md`): not pointers. They give the reference files that the author gives to each reviewer. The row gives the reviewer class as the condition.
- Line 69, "The glossary and `MEMORY.md` are not pointer targets.": not a pointer. It is a definition.
- Line 69, "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them, through the `Changes:` line.": not a pointer. It gives its condition.
- Line 71, "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`.": a pointer. The heading and the sentence give a condition, but the condition "When you start the reviewers" does not tell that the agent must read the target before it starts the reviewers. See the finding for the sequence rule.
- Line 71, "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer.": not a pointer. It refers to the file itself.

Pointers that name no file: none in the section under review.

Findings:

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "When you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`."
- Problem: In skills/writing/agent-instructions/references/review.md, line 61 tells the agent to start 3 reviewers and line 73 tells it to copy the prompt, but the step that finds the list files, which decides which reviewers to start and which `Changes:` line each one gets, is at line 71, after the start step, and its condition "When you start the reviewers" does not put it before that step.
- Correction: Move the list-file text of line 71 before the table at line 63, and start it with "Before you start the reviewers, find the list files in "Terms in this skill" in `SKILL.md`."

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "Also give a finding for each text that the author moved and that does not obey loading-rules.md."
- Problem: In skills/writing/agent-instructions/references/review.md, line 116 of the reviewer prompt tells the ASD-STE100 reviewer and the ISO 24495-1 reviewer to examine moved text with loading-rules.md, but the table at lines 65 to 67 puts the path of loading-rules.md only in the Rules line of the loading reviewer, so these 2 reviewers get no path when the review target has no pointer to loading-rules.md, for example an `AGENTS.md` file of a different project.
- Correction: Also give a finding for each text that the author moved and that does not obey the loading-rules.md file in the Rules line or the Loading rules line. In the table, add `loading-rules.md` to the reference files of the ASD-STE100 reviewer and the ISO 24495-1 reviewer for the edit job, or add a prompt line "Loading rules: <absolute path of loading-rules.md>".

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Give a finding for each text to move in a section in the Changes line."
- Problem: In skills/writing/agent-instructions/references/review.md, line 115 tells each reviewer to give a finding for text to move, but line 139 tells that each finding gives one rule from the rule files, and the rule files of the ASD-STE100 reviewer and the ISO 24495-1 reviewer have no rule to move text, because line 119 tells the ISO 24495-1 reviewer to skip the rule about long text.
- Correction: "<For the loading reviewer only:> Give a finding for each text to move in a section in the Changes line." Or tell which rule the other 2 reviewers give in the Rule field of such a finding.

- Rule: "Add one short cause to a rule in each of these cases:"
- Text: "When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round."
- Problem: In skills/writing/agent-instructions/references/review.md, line 71 changes the usual work of the author, because line 61 tells it to start 3 reviewers, but the section gives no cause why a list file needs no loading reviewer.
- Correction: When each changed file is a list file, start only the ASD-STE100 reviewer and the ISO 24495-1 reviewer in each round, because the loading rules give no file-size limit and no layout rule for a list file.

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Copy this prompt for each reviewer. Replace only the placeholders."
- Problem: In skills/writing/agent-instructions/references/review.md, line 73 gives a sequence of steps to make each reviewer prompt (copy, replace the placeholders, keep and remove lines, remove 2 lines in the write job, give the same lines) as one paragraph, not as a numbered list.
- Correction: Write line 73 as a numbered list, for example: "1. Copy this prompt for each reviewer. 2. Replace only the placeholders. Do not change the report requirements. 3. Keep the lines for the reviewer that you start, and remove the text in angle brackets at the start of these lines. 4. Remove the lines for the other reviewers. 5. In the write job, also remove the 2 prompt lines that start with ..."

- Rule: "Keep only the text that the agent cannot find without help. Examples are project facts, decisions, special instructions of the user, and corrections of incorrect agent work. (advisory)"
- Text: "Give no list file in the `Changes:` line of the loading reviewer."
- Problem: In skills/writing/agent-instructions/references/review.md, line 71 gives this rule, and the same paragraph gives it again in "Where `review.md` gives 3 reviewers, 3 reports, or the same `Changes:` line for each reviewer, give no list file to the loading reviewer."
- Correction: Remove "Give no list file in the `Changes:` line of the loading reviewer." and keep the later sentence of line 71.
