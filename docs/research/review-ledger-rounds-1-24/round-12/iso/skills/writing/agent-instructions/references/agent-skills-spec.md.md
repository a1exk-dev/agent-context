Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8,169 bytes and 79 lines. Limit: none. "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Text to move: none. The rules that tell you to move text are for a `SKILL.md` file and entry-file text. This file is a reference file.

Pointer conditions:
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." The heading and the sentence give the condition.
- Line 73, heading "When you select the folder for the Skill": "Before you select the folder, find the target platforms as `loading-rules.md` tells you." The heading and the sentence give the condition.
- Lines 7, 15, 39, 40, 41, 62, 73 (".claude/" and "skills/"), 77, 78, and 79 name a path, but they are not pointers. They tell the agent to read no file.
- Pointers that name no file: none.

Findings:

- Rule: "Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file. (advisory)"
- Text: "Select the Skills folder of the project first, as the section "When you select the folder for the Skill" tells you."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 11, the step has no job condition, but in the edit job the Skill already has its folder, and line 73 gives the folder rules only "For each Skill that you write".
- Correction: "In the write job, select the Skills folder of the project first, as the section "When you select the folder for the Skill" tells you."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Before you select the folder, find the target platforms as `loading-rules.md` tells you."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 73, one paragraph gives a sequence of steps (find the target platforms, select the Skills folder, ask the user when 2 or more folders or no folder occur, add a warning) without a numbered list.
- Correction: Keep the 2 sentences of information first. Then write a numbered list: "1. Find the target platforms as `loading-rules.md` tells you. 2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. A Skills folder of the project is a folder from the table below that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder. 3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. 4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The tier 1 rule is a loading rule of Codex."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 28, the sentence gives one tier 1 rule, but the section has 2 tier 1 rules, on line 41 and line 42.
- Correction: "The tier 1 rules are loading rules of Codex."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Each rule starts with its tier."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 3, the sentence tells that each rule starts with its tier, but the rules on line 11 ("Select the Skills folder of the project first"), line 50 ("When the user gives text for the description, keep the meaning of that text."), and the first rules of line 73 do not start with a tier.
- Correction: Start each of these rules with its tier, for example "Tier 4: When the user gives text for the description, keep the meaning of that text." On line 73, put "Tier 1:" at the start of the rule that it is for, as a different item.
