Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In the old place of the moved section, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7,201 bytes, 65 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.
- skills/writing/agent-instructions/SKILL.md (context only): 17,948 bytes. Limit: 20,000 bytes.

Text to move: none. The file is a reference file of a Skill. The rules that tell you to move text in loading-rules.md are applicable only to a SKILL.md and to entry-file text.

Moved text: none.

Findings:

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "During the write job or the edit job, the self-check examines the text."
- Problem: Line 63 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the agent already knows from step 8 of skills/writing/agent-instructions/SKILL.md (line 103), and line 11 of plain-language-rules.md makes sure that SKILL.md is in the context window.
- Correction: Remove the sentence "During the write job or the edit job, the self-check examines the text."

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "After the self-check, new reader subagents examine the text in the reader test."
- Problem: Line 64 of skills/writing/agent-instructions/references/plain-language-rules.md gives a fact that the agent already knows from step 9 (line 104) and the term "reader test" (line 35) of skills/writing/agent-instructions/SKILL.md.
- Correction: Remove the sentence "After the self-check, new reader subagents examine the text in the reader test."
