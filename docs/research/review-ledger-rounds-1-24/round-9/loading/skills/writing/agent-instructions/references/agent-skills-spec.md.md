Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In the old place of the moved section, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8,103 bytes, 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Findings:

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "You can also start the value on the next line after `|` or `>`."
- Problem: Line 20 of skills/writing/agent-instructions/references/agent-skills-spec.md gives an alternative to quotation marks, and that alternative does not agree with the one-line `description` method of line 24, because "Some platforms and scripts read only the first line of a value".
- Correction: Remove the sentence. Line 20 then is: "Tier 1: Write frontmatter that the YAML parser reads with no errors. Put a value that contains `: ` in quotation marks. (script check)"
