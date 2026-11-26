Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - line 48: "When you write this item, find the known cases in that table."

File size: skills/writing/agent-instructions/references/end-of-run-report.md has 6,330 bytes. Limit: loading-rules.md and agent-skills-spec.md give no limit for a reference file of a Skill.

Pointer conditions in the sections under review (heading "When you write the end-of-run report"):
- Line 36: "When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`." The sentence gives the condition.
- Line 38: "When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`." The sentence gives the condition.
- Line 48: "Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier." This sentence is a warning item, not a pointer. The pointer is the next sentence, which names no file.
- Line 56: "In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file." This sentence is a warning item, not a pointer.
- Line 63: "In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`." The sentence gives the condition.
- Line 64: "If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part." The sentence before it and the "If" clause give the condition.
- Line 67: "For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record." The sentence gives the condition.

Pointers that name no file:
- Line 48: "When you write this item, find the known cases in that table."

- Rule: "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)"
- Text: "When you write this item, find the known cases in that table."
- Problem: In skills/writing/agent-instructions/references/end-of-run-report.md line 48, the pointer tells the agent when to read the table, but it gives "that table" and no path, so the pointer sentence alone does not identify `SKILL.md`.
- Correction: When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`.
