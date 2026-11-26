Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,948 bytes, limit 20,000 bytes (loading-rules.md, "When you examine the file size"). 151 lines, limit less than 500 lines (agent-skills-spec.md, "When you write the body").

Pointer list in the sections under review ("Files that are not Agent instructions"):
- Line 46, "Files for persons, for example `README.md`, `CONTRIBUTING.md`, ADRs, user manuals, code comments, and commit messages." - not a pointer. The sentence gives examples of files that are not Agent instructions. It does not tell the agent to read a file.
- Line 47, "Subagent definitions, for example the files in `.claude/agents/`." - not a pointer, for the same cause.
- Line 48, "Files for platforms other than Codex, OpenCode, and Claude Code, for example the files of Cursor and `.github/copilot-instructions.md`." - not a pointer, for the same cause.

Pointers that name no file: none.

Text to move in the sections under review: none. The section "Files that are not Agent instructions" has 2 rules and no template, prompt, or full example.

No findings
