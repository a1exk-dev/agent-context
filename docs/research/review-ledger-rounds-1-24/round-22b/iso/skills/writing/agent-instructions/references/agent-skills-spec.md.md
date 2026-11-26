Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,208 bytes, 79 lines. Limit: none. `loading-rules.md` and `agent-skills-spec.md` give no file-size limit for a reference file of a Skill.

Pointers in the pointer list (condition check):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 73, heading "When you select the Skills folder of the project": "Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you." - The heading and the sentence give the condition.
- Lines 7, 15, 39, 40, 41, 62, 73 (".claude/", "skills/"), 77, 78, 79: these sentences name a file or a folder to write or to examine, not a file to read. They are not pointers.
- Pointers that name no file: none.

Headings (condition check):
- "Before you use this file", "When you write the folder and the frontmatter", "When you write or edit a Skill: the agents/openai.yaml file", "When you write the description", "When you write the body", "When the Skill has a script", "When you select the Skills folder of the project": each heading gives a condition.

Text to move: none. The file is a reference file. The move rules of `loading-rules.md` are for `SKILL.md` and entry-file text.

Moved text: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "If the user tells you to write a field that is not permitted, do not write it."
- Problem: Line 23 of skills/writing/agent-instructions/references/agent-skills-spec.md tells the agent not to write a field that is not permitted, but line 31 of the pointer target skills/writing/agent-instructions/references/loading-rules.md tells the agent to write "frontmatter that only Claude Code reads" when the user tells it clearly, so for a Skill field such as one that only Claude Code reads, the two tier 1 rules do not agree and the agent cannot know which rule to obey.
- Correction: "Tier 1: If the user tells you to write a field that is not permitted, do not write it. This rule replaces "When you select a feature" in `loading-rules.md` for the frontmatter of a Skill. Add a warning that gives the field and the error. (advisory)"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it."
- Problem: Line 21 of skills/writing/agent-instructions/references/agent-skills-spec.md tells that `disable-model-invocation` gives an error in `skills-ref validate`, and line 65 of skills/writing/agent-instructions/SKILL.md puts each item that `skills-ref validate` examines in tier 1, but the tier 1 exception in lines 18 and 21 tells the agent to write that field, so the agent cannot know whether the error of `skills-ref validate` for a Manual-only Skill is a problem.
- Correction: "Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it. This exception is applicable also when `skills-ref validate` gives an error for this field."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Tier 4: Move long text to files in the folder of the Skill or in a folder directly in the folder of the Skill."
- Problem: Line 63 of skills/writing/agent-instructions/references/agent-skills-spec.md permits a reference file directly in the folder of the Skill, but item 4 on line 67 of the pointer target skills/writing/agent-instructions/references/loading-rules.md tells the agent to put a reference file of a Skill in `<skill>/references/<name>.md`, so the two files give different places.
- Correction: "Tier 4: Move long text to reference files, as "When the write job makes a SKILL.md or entry-file text" in `loading-rules.md` tells you. For each file, tell when to read it. (advisory)"

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use."
- Problem: Line 73 of skills/writing/agent-instructions/references/agent-skills-spec.md puts a sequence of steps (find the target platforms, select the folder, ask the user, add a warning) and a "Tier 1:" rule in one paragraph that ends with one "(advisory)" mark, so the agent cannot see the sequence or which mark applies to each rule.
- Correction: "Each platform loads Skills from the folders in the table after this list. When the target platforms include Claude Code and Codex, no single folder is applicable to all target platforms.
  1. Before you select the Skills folder of the project, find the target platforms as `loading-rules.md` tells you.
  2. Tier 1: When the target platforms include Claude Code and Codex, use the Skills folder of the project. A Skills folder of the project is a folder from the table that the project has. A `.claude/` folder without a `skills/` folder is not a Skills folder. (advisory)
  3. If the project has 2 or more of these folders, or none of these folders, ask the user one time which folder to use. (advisory)
  4. For each Skill that you write for these target platforms, add a warning that gives the platform that does not load the Skill. (advisory)"
