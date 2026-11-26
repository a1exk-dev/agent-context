Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8103 bytes, 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`, not for a reference file.

Pointer conditions (pointer list, agent-skills-spec.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - the heading and the sentence give the condition.
- Line 73, heading "When you select the folder for the Skill": "Before you select the folder, find the target platforms as `loading-rules.md` tells you." - the heading and the sentence give the condition.
- Lines 7, 15, 39, 40, 41, 62, 73 (".claude/" sentence), 77, 78, 79: these sentences name a file path but are not pointers. They define a file, tell the agent to write a file, or give a folder in a table.
- Pointers that name no file: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Select the Skills folder of the project first"
- Problem: In agent-skills-spec.md line 11, this rule tells the agent to select the Skills folder of the project for each Skill, but the referenced section at line 73 gives a rule for that folder only "When the target platforms include Claude Code and Codex", so for other target platforms (for example Claude Code only, with only `.agents/skills/` in the project) the section gives no rule, and the agent can select a folder that a target platform does not load.
- Correction: At line 73, add a rule for all target platforms before the Claude Code and Codex rule: "Tier 1: Use a folder from the table that each target platform loads. When the target platforms include Claude Code and Codex, use the Skills folder of the project."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project."
- Problem: In agent-skills-spec.md line 73, one paragraph mixes facts with 4 rules (find the target platforms, use the Skills folder of the project, ask the user, add a warning), while each other section of the file gives its rules as bullets with a tier at the start.
- Correction: Keep the facts in the paragraph and put each rule in a bullet, for example: "- Before you select the folder, find the target platforms as `loading-rules.md` tells you." "- Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. (advisory)" "- Tier 1: If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. (advisory)" "- Tier 1: For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill. (advisory)"
