Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,088 bytes and 79 lines. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointer conditions (section "When you write the folder and the frontmatter"):
- Line 15: "Tier 1: Put a `SKILL.md` file in the folder of each Skill." - not a pointer. The sentence tells the agent to write the file, not to read it.
- Line 11 refers to a section of this file, not to a different file.

Text to move: none. The section is in a reference file.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Select the Skills folder of the project first, as the section "When you select the folder for the Skill" tells you."
- Problem: Line 11 of skills/writing/agent-instructions/references/agent-skills-spec.md tells the agent to select the Skills folder of the project for each Skill, but line 73 tells the agent to use the Skills folder of the project only when the target platforms include Claude Code and Codex, and lines 75 to 79 give the folder for the other target platforms.
- Correction: "Select the folder for the Skill first, as the section "When you select the folder for the Skill" tells you."
