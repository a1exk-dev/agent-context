Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In the old place of the moved section, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File sizes:
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md: 8,208 bytes, 79 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.
- /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/SKILL.md (context only): 17,985 bytes, 151 lines. Limit: 20,000 bytes and less than 500 lines.

Text to move: none. The file is a reference file of a Skill. The move rules in "When the write job makes a SKILL.md or entry-file text" and "When the edit job changes a SKILL.md or an entry file" are for a SKILL.md file and entry-file text.

Moved text: none.

Findings:

- Rule: "Tier 4: Add only the text that the agent does not know. Give one recommended method, not a list of alternatives. When a step has a high risk of an error, give it more limits. (advisory)"
- Text: "Put a value that contains `: ` in quotation marks. You can also start the value on the next line after `|` or `>`."
- Problem: In /Users/alexk/Projects/agent-context/skills/writing/agent-instructions/references/agent-skills-spec.md line 20, the rule gives 3 alternative methods for a value with `: `, but line 21 permits only `name` and `description`, and line 24 tells the agent to write `description` as one line in quotation marks, so the `|` and `>` alternatives disagree with the recommended method.
- Correction: "Put a value that contains `: ` in quotation marks."
