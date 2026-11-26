Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md: 8,208 bytes, 79 lines. Limit: none. The file is a reference file of a Skill. "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`. The 500-line limit in agent-skills-spec.md is for `SKILL.md`.

Pointer list decisions:
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives the cause of the pointer before it.
- Lines 15, 39, 40, 41, 62: not pointers. They name files that the agent writes or measures.
- Line 73, heading "When you select the Skills folder of the project": "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you." - pointer. The heading and the sentence give the condition.
- Line 73: "A `.claude/` folder without a `skills/` folder is not a Skills folder." - not a pointer.
- Lines 77 to 79 (table cells): not pointers.

Pointers that name no file: none. Line 11 refers to a section of the same file by its heading.

Text to move: none. The move rules in loading-rules.md are for `SKILL.md` and entry files. This file is a reference file.

Moved text: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Each rule starts with its tier."
- Problem: Line 3 of agent-skills-spec.md tells that each rule starts with its tier, but the rules on line 11 ("Select the Skills folder of the project first"), line 50 ("When the user gives text for the description, keep the meaning of that text."), and line 73 (the rule "ask the user one time which folder to use" and the rule "add a warning") start with no tier.
- Correction: Start each of these rules with its tier, for example "Tier 4: When the user gives text for the description, keep the meaning of that text." Or change line 3 to "Each rule in a list starts with its tier."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use."
- Problem: Line 73 of agent-skills-spec.md puts a fact, a pointer, a tier 1 rule, a definition, and 2 more rules in one paragraph with one mark "(advisory)" at its end, so the reader cannot see the sequence of the steps or which rule has the tier and the mark.
- Correction: Write the steps as a numbered list, with one tier and one mark for each step: "1. Find the target platforms as `loading-rules.md` tells you. 2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. 3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. 4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill." Keep the facts and the definition before the list.

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The word rules are not applicable to quoted text, and it counts as 1 word."
- Problem: Line 53 of agent-skills-spec.md repeats ste-rules.md line 13 (the word rules are not applicable to user phrases in quotation marks) and line 82 (quoted text counts as 1 word), and step 7 of SKILL.md tells the agent to read ste-rules.md before it writes text.
- Correction: Remove the sentence "The word rules are not applicable to quoted text, and it counts as 1 word."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Tier 4: Move long text to files in the folder of the Skill or in a folder directly in the folder of the Skill."
- Problem: Line 63 of agent-skills-spec.md permits a reference file directly in the folder of the Skill, but item 4 on line 67 of loading-rules.md tells the agent to put a reference file of a Skill in `<skill>/references/<name>.md`, so the two files give different places for the same file.
- Correction: "Tier 4: Move long text to reference files in `<skill>/references/`. For each file, tell when to read it."
