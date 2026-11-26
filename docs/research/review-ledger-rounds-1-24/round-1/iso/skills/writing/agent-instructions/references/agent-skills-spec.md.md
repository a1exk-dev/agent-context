Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,046 bytes, 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives limits only for entry files and `SKILL.md`, not for a reference file.

Pointer list (sentences in this file that name a file path):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer. The heading and the sentence give the condition. The sentence gives the path `SKILL.md`.
- Line 7, heading "Before you use this file": "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer. It gives the cause of the pointer before it.
- Line 15, heading "When you write the folder and the frontmatter": "Tier 1: Put a `SKILL.md` file in the folder of each Skill." - not a pointer. It tells which file to write.
- Lines 39, 40, 41, heading "When you write or edit a Skill: the agents/openai.yaml file": the sentences that name `agents/openai.yaml` - not pointers. They tell which file to write.
- Line 62, heading "When you write the body": "Tier 4: Write less than 500 lines in `SKILL.md`." - not a pointer.
- Line 73, heading "When you select the folder for the Skill": "Before you select the folder, find the target platforms as `loading-rules.md` tells you." - pointer. The heading and the sentence give the condition. The sentence gives the file name `loading-rules.md`, which the table in "When two sources do not agree" in `SKILL.md` permits for a reference file that `SKILL.md` also points to.
- Line 73, heading "When you select the folder for the Skill": "A `.claude/` folder without a `skills/` folder is not a Skills folder." - not a pointer.
- Lines 77, 78, 79, heading "When you select the folder for the Skill": the table cells with Skills folders - not pointers. They give the folders that each platform loads.

Pointers that name no file: none.

Text to move: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The tier 1 rule is a loading rule of Codex."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 28, the sentence gives one tier 1 rule, but the list of the section has 2 tier 1 rules (line 41 and line 42), so the agent cannot know which rule the sentence identifies.
- Correction: "The tier 1 rules are loading rules of Codex."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 21, the sentence before the exception tells that `disable-model-invocation` gives an error in `skills-ref validate`, and `SKILL.md` line 65 (the pointer target of line 7) puts each item that `skills-ref validate` examines in tier 1, but the exception does not tell the agent what to do about that error.
- Correction: "Exception: in a Manual-only Skill, also write `disable-model-invocation: true`, because Claude Code and OpenCode 2 read it. Then add a warning that `skills-ref validate` gives an error for this field."
