Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,207 bytes. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointers in the sections under review:
- Line 15, "When you write the folder and the frontmatter": "Tier 1: Put a `SKILL.md` file in the folder of each Skill." - Not a pointer. The sentence names a file to write, not a file to read.
- Line 73, "When you select the Skills folder of the project": "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you." - Pointer. The heading and the sentence give the condition.
- Line 73: "A `.claude/` folder without a `skills/` folder is not a Skills folder." - Not a pointer.
- Lines 77 to 79: the folder cells of the table - Not pointers. The cells give reference data.
- Pointers that name no file: none.

Findings:

- Rule: "Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file. (advisory)"
- Text: "Select the Skills folder of the project first, as the section "When you select the Skills folder of the project" tells you."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 11, the only condition is the heading "When you write the folder and the frontmatter", so an edit job that changes only the frontmatter of a Skill that has a folder also gets the step to select a Skills folder.
- Correction: "When you make the folder of a new Skill, first select the Skills folder of the project, as the section "When you select the Skills folder of the project" tells you."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 73, one paragraph gives a sequence of steps (find the target platforms, find the folders, use a folder or ask the user, add a warning), and the step "use the Skills folder of the project" comes before the step that handles 2 or more folders or no folder.
- Correction: Write the steps as a numbered list after the table:
  "1. Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you.
  2. When the target platforms include Claude Code and Codex, find the folders from this table that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder.
  3. If the project has 1 of these folders, use that folder. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use.
  4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill."

- Rule: "Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file. (advisory)"
- Text: "If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 73, the sentence gives no target-platform condition, so an agent with only Claude Code as target platform and both `.claude/skills/` and `.agents/skills/` in the project cannot know whether to ask the user.
- Correction: "When the target platforms include Claude Code and Codex, and the project has 2 or more of these folders or none of these folders, ask the user one time which folder to use."
