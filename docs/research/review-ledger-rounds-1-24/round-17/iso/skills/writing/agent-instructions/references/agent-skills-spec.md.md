Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,207 bytes, 79 lines. Limit: none. "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`.

Pointer conditions (pointer list of the check script for this file):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The sentence and the heading give the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives the cause of the pointer before it.
- Line 73, heading "When you select the Skills folder of the project": "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you." - pointer. The sentence and the heading give the condition.
- Lines 15, 39, 40, 41, 62, 73 (".claude/" sentence), 77, 78, 79 - not pointers. These sentences and table cells are rules or reference data that name a file or a folder.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "If the user tells you to write a field that is not permitted, do not write it."
- Problem: Line 23 of skills/writing/agent-instructions/references/agent-skills-spec.md tells the agent not to write a field that is not permitted, also when the user asks, but the pointer target loading-rules.md line 31 tells the agent to write a feature that only one platform reads when the user tells it clearly, and line 27 of loading-rules.md includes "frontmatter that only Claude Code reads" in that list, so the two files give opposite actions for a user request for a Claude Code frontmatter field.
- Correction: "Tier 1: If the user tells you to write a field that is not permitted, do not write it, also when only one platform reads the field. Add a warning that gives the field and the error. This rule replaces the rule for one-platform features in `loading-rules.md` for frontmatter fields. (advisory)"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The tier 1 rule is a loading rule of Codex."
- Problem: Line 28 of skills/writing/agent-instructions/references/agent-skills-spec.md tells of one tier 1 rule in the section, but the section has 2 tier 1 rules, on line 41 and line 42.
- Correction: "The tier 1 rules are loading rules of Codex."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "A field that is not in the list of permitted fields, for example `disable-model-invocation`, also gives an error in `skills-ref validate`."
- Problem: Line 21 of skills/writing/agent-instructions/references/agent-skills-spec.md calls `disable-model-invocation` a field that is not permitted, but line 18 and line 21 permit it in a Manual-only Skill, and line 23 tells the agent not to write a field that is not permitted, so the agent cannot know which rule to obey for a Manual-only Skill or whether to add a warning about the `skills-ref validate` error.
- Correction: "Each other field, also `disable-model-invocation`, gives an error in `skills-ref validate`. Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it. Then add a warning that `skills-ref validate` gives an error for this field."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When the user gives text for the description, keep the meaning of that text."
- Problem: Line 3 of skills/writing/agent-instructions/references/agent-skills-spec.md tells that each rule starts with its tier, but the rule on line 50 has no tier, so the agent cannot know which tier to obey when this rule and a different rule do not agree.
- Correction: "- Tier 4: When the user gives text for the description, keep the meaning of that text. (advisory)"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Select the Skills folder of the project first, as the section "When you select the Skills folder of the project" tells you."
- Problem: Line 3 of skills/writing/agent-instructions/references/agent-skills-spec.md tells that each rule starts with its tier, but the instruction on line 11 has no tier.
- Correction: "Tier 1: Select the Skills folder of the project first, as the section "When you select the Skills folder of the project" tells you."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project."
- Problem: Line 73 of skills/writing/agent-instructions/references/agent-skills-spec.md puts steps in a sequence (find the target platforms, select the folder, ask the user, add a warning) in one paragraph, with the tier mark in the middle and one "(advisory)" mark at the end for all steps.
- Correction: "1. Find the target platforms as `loading-rules.md` tells you. 2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. (advisory) 3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. (advisory) 4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill. (advisory)"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use."
- Problem: Line 73 of skills/writing/agent-instructions/references/agent-skills-spec.md does not tell when to ask this question, but the pointer target SKILL.md step 2 (line 92) tells the agent to ask about all paths in one question before it writes text and not to stop the job for a question after it starts to write text.
- Correction: "If the project has 2 or more of these folders, or none of these folders, ask the user which folder to use in the question of step 2 in `SKILL.md`."
