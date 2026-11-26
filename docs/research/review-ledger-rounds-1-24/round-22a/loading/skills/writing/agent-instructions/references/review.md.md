Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In the old place of the moved section, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File size:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md: 48,598 bytes, 451 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill. The 20,000-byte limit and the 500-line limit are only for `SKILL.md`.

Findings:

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/review.md line 434, the sentence sends the agent to `references/review.md`, which is the file that the agent reads at that time, so the reference adds no information and does not give the part of the file that tells how to reject a finding.
- Correction: When a reviewer gives a finding, correct your text, or reject the finding as item 4 of "During and after a review round" tells you.
