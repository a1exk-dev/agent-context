Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/agent-skills-spec.md has 8208 bytes. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file.

Pointer list, section "When you write or edit a Skill: the agents/openai.yaml file":
- Line 39, "Tier 4: In the write job, write `agents/openai.yaml` for each Skill that you write." - not a pointer. The sentence tells the agent to write the file, not to read it.
- Line 40, "Tier 4: In the edit job, when the Skill has no `agents/openai.yaml` and is not a Manual-only Skill, do not write the file." - not a pointer. The sentence tells the agent not to write the file.
- Line 41, "Tier 1: In the edit job, when a Manual-only Skill has no `agents/openai.yaml`, write the file, because Codex does not read `disable-model-invocation`." - not a pointer. The sentence tells the agent to write the file.

Text to move: none. The section is in a reference file, and the move rules of loading-rules.md are for a SKILL.md file and entry-file text.

Moved text: none.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The tier 4 rules are recommendations of Codex."
- Problem: Line 28 of skills/writing/agent-instructions/references/agent-skills-spec.md puts recommendations of Codex in tier 4, but the pointer target SKILL.md (line 7 points to it) defines tier 4 at line 68 as only the recommendations of the Agent Skills specification and the move rules of references/loading-rules.md, so the tier of these rules does not agree with the tier definition.
- Correction: "The tier 4 rules are recommendations of Codex. Use them with the tier of the recommendations of the Agent Skills specification." Alternatively, add "It also contains the recommendations of Codex for `agents/openai.yaml`." to tier 4 in "When two sources do not agree" in SKILL.md.
