Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - line 71: "When you select the folder for the Skill"
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8,088 bytes and 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`, not for reference files.

Text to move: none. This file is a reference file. The rules in loading-rules.md that tell you to move text are applicable only to a `SKILL.md` and to entry-file text.

Moved text: none.

Pointer conditions (pointer list of the check script, this file):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition. The pointer names the file.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - Not a pointer. It gives information about the target of the previous sentence.
- Lines 15, 39, 40, 41, 62: these sentences name `SKILL.md` or `agents/openai.yaml` as a file to write. They are not pointers.
- Line 73, heading "When you select the folder for the Skill": "Before you select the folder, find the target platforms as `loading-rules.md` tells you." - The heading and the sentence give the condition. The pointer names the file.
- Line 73: "A `.claude/` folder without a `skills/` folder is not a Skills folder." - Not a pointer.
- Lines 77 to 79: table cells that give folders. Not pointers.

Pointers that name no file: none.

- Rule: "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)"
- Text: "When you select the folder for the Skill"
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, the section "When you select the folder for the Skill" (lines 71 to 79) gives the first step of the task, but it is the last section of the file, after the frontmatter, description, body, and script sections (lines 9 to 69), so line 11 must send the agent forward to it.
- Correction: Move the section "When you select the folder for the Skill" to the position directly after "Before you use this file", and change line 11 to "Select the Skills folder of the project first, as the section "When you select the folder for the Skill" before this section tells you."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Before you select the folder, find the target platforms as `loading-rules.md` tells you."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 73 gives 4 steps in a sequence (find the target platforms, use the Skills folder, ask the user when the project has 2 or more folders or none, add a warning) in one paragraph with facts, not in a numbered list.
- Correction: "Each platform loads Skills from the folders in the table after this list. When the target platforms include Claude Code and Codex, no single folder is applicable to all target platforms. A Skills folder of the project is a folder from this table that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder.

1. Before you select the folder, find the target platforms as `loading-rules.md` tells you.
2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project.
3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use.
4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill."

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The word rules are not applicable to quoted text, and it counts as 1 word."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md, line 53 repeats facts that ste-rules.md already gives (line 13: the word rules are not applicable to user phrases in quotation marks, and line 82: quoted text counts as 1 word), and SKILL.md step 7 tells the agent to read ste-rules.md before it writes text.
- Correction: Remove the sentence "The word rules are not applicable to quoted text, and it counts as 1 word."
