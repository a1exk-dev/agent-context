Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8103 bytes, 79 lines. Limit: none. The limits in loading-rules.md ("When you examine the file size") and agent-skills-spec.md line 62 are for entry files and `SKILL.md`, not for a reference file of a Skill.

Pointer conditions (pointer list of the check script for this file):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition.
- Line 7: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives a fact.
- Line 15: "Tier 1: Put a `SKILL.md` file in the folder of each Skill." - not a pointer. It tells the agent to write a file.
- Lines 39, 40, 41: the sentences about `agents/openai.yaml` - not pointers. They tell the agent when to write the file.
- Line 62: "Tier 4: Write less than 500 lines in `SKILL.md`." - not a pointer.
- Line 73, heading "When you select the folder for the Skill": "Before you select the folder, find the target platforms as `loading-rules.md` tells you." - pointer. The heading and the sentence give the condition. `SKILL.md` also points to `references/loading-rules.md`, so the table in "When two sources do not agree" in `SKILL.md` permits this file name.
- Line 73: "A `.claude/` folder without a `skills/` folder is not a Skills folder." - not a pointer. It gives a definition.
- Lines 77, 78, 79: table cells with folder paths - not pointers. They give reference data.

Pointers that name no file: none.

Text to move: none. This file is a reference file. The rules that tell you to move text are for `SKILL.md` and entry-file text.

No findings
