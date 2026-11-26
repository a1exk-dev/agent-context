Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In its old place, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/agent-skills-spec.md: 8046 bytes, 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Text to move: none. The file is a reference file of a Skill, not a `SKILL.md` file or an entry file.

Moved text: none.

Findings:

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "You can also start the value on the next line after `|` or `>`."
- Problem: In skills/writing/agent-instructions/references/agent-skills-spec.md line 20, this sentence gives a second method for a value that contains `: `, and for `description` this method does not agree with the tier 4 rule in line 24 that tells the agent to write `description` as one line in quotation marks.
- Correction: Remove the sentence. Line 20 then is: "- Tier 1: Write frontmatter that the YAML parser reads with no errors. Put a value that contains `: ` in quotation marks. (script check)"
