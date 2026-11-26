Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In the old place of the moved section, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes (`wc -c`). Limit: 20,000 bytes for `SKILL.md`. Lines: 151. Limit: 500 lines.

Findings:

- Rule: "Each section that has a specified condition and 3 or more rules. Move such a section also when the condition can occur at each step. The agent then reads its rules only when the condition occurs. A section has a specified condition when its heading or a sentence at its start gives the condition. Examples are the heading "Before a release" and the sentence "Obey the rules in this section only when the user asks for a deploy." Count each instruction as one rule, also when one sentence or one list item gives 2 or more instructions. The number of rules does not change when you write them in fewer sentences. For example, "stop, keep the branch, and tell the user" gives 3 rules. (advisory)"
- Text: "When you run the check script"
- Problem: In skills/writing/agent-instructions/SKILL.md, lines 113 to 147, the section "When you run the check script" has a specified condition in its heading and more than 3 rules (for example "Run it with `node`", "Replace `<skill folder>`", "Save the output to a new file", "stop the self-check and the reader test", "Run it once for each file of the round", "Start no confirmers"), and three command templates in code blocks, but the agent uses these rules only during the self-check and the reader test, after it reads references/review.md.
- Correction: Move the full section, without changes, to `references/check-script.md`, with its heading at the start. In its old place in SKILL.md, keep the heading "When you run the check script" and write only this pointer: "When you run the check script, read `references/check-script.md`." Then change the pointers in `references/review.md` that give "When you run the check script" in `SKILL.md` to `references/check-script.md`.

- Rule: "Long text of decisions and long background text. You decide which text is long. (advisory)"
- Text: "This table gives the known cases where two sources do not agree, and the decision for each case:"
- Problem: In skills/writing/agent-instructions/SKILL.md, lines 72 to 85, the table of 8 known cases and their decisions is long decision text that the agent needs only when two sources do not agree for the text that it writes, but it loads with SKILL.md in each job.
- Correction: Keep the tier list in lines 63 to 70, because the reference files use SKILL.md for the definition of the tiers. Move the table and the sentence after it to `references/source-conflicts.md`. After the tier list, write: "When two sources do not agree for your text, read `references/source-conflicts.md`." Then change the pointer in `references/end-of-run-report.md` that gives the table in "When two sources do not agree" in `SKILL.md` to `references/source-conflicts.md`.
