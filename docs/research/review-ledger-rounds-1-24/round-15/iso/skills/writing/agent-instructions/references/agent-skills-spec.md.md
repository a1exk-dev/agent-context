Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8207 bytes, 80 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointers in the pointer list for this file:
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the sentence gives the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer; it gives the cause of the pointer before it.
- Line 15: "Tier 1: Put a `SKILL.md` file in the folder of each Skill." - not a pointer; it tells the author to make a file.
- Lines 39, 40, 41: the sentences about `agents/openai.yaml` - not pointers; they tell the author to write or not write a file.
- Line 62: "Tier 4: Write less than 500 lines in `SKILL.md`." - not a pointer.
- Line 73, heading "When you select the Skills folder of the project": "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you." - pointer; the heading and the sentence give the condition. It gives the file name, which the table in "When two sources do not agree" in SKILL.md permits.
- Line 73: "A `.claude/` folder without a `skills/` folder is not a Skills folder." - not a pointer.
- Lines 77, 78, 79: table cells - not pointers.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The tier 1 rule is a loading rule of Codex."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 28 refers to one tier 1 rule, but the section has 2 tier 1 rules, on lines 41 and 42.
- Correction: "The tier 1 rules are loading rules of Codex."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Each rule starts with its tier."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 3 tells that each rule starts with its tier, but the rules on line 11 ("Select the Skills folder of the project first"), line 50 ("When the user gives text for the description, keep the meaning of that text."), and line 73 ("If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use.") do not start with a tier.
- Correction: Add the tier at the start of each of these rules, for example "Tier 4: When the user gives text for the description, keep the meaning of that text." Or change line 3 to "Each rule in a list starts with its tier."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 73 gives a sequence of steps (find the target platforms, use the Skills folder, ask the user, add a warning) in one paragraph, not in a numbered list.
- Correction: "1. Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you.
2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. A Skills folder of the project is a folder from this table that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder.
3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use.
4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill. (advisory)"

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The word rules are not applicable to quoted text, and it counts as 1 word."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 53 gives facts that the pointer target ste-rules.md already gives on line 13 (the word rules are not applicable to user phrases in quotation marks) and on line 82 (quoted text counts as 1 word).
- Correction: Remove the sentence "The word rules are not applicable to quoted text, and it counts as 1 word." from line 53.

- Rule: "Add one short cause to a rule in each of these cases:" "To obey the rule, the agent must make a decision. (advisory)"
- Text: "When a step has a high risk of an error, give it more limits."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 64 tells the agent to decide which step has a high risk of an error, but gives no cause for the rule.
- Correction: "When a step has a high risk of an error, give it more limits, because an agent makes more errors in a step with few limits."
