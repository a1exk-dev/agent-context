Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none. It is a reference file of a Skill, and the table in "When you examine the file size" gives a limit only for entry files and `SKILL.md`.

Text to move:
- None. The numbered list in "When the write job makes a SKILL.md or entry-file text" is applicable to a `SKILL.md` and to entry-file text, and this file is a reference file.

Moved text:
- None. The Changes line gives "all" and no pointer of a moved section.

Pointer conditions (pointer list of the check script, loading-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - pointer; the sentence gives the condition, and the target has that heading.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the action "Write one pointer for each reference file" gives the condition, and the target has that heading.
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - pointer; the action "write the pointer" in the old place of a moved section gives the condition.
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - pointer; the sentence gives the condition.
- Lines 3, 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, 56, and 98 ("For the glossary and `MEMORY.md`, use the format that the project uses." and "This skill has no template for the glossary or `MEMORY.md`.") name a file or a folder as an example, a signal, a location, or a limit. They do not tell the agent to read a file, so they are not pointers.
- Pointers that name no file: none. "that file" on line 66 refers to a reference file that the project has, as a place to write text. It does not tell the agent to read a file.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 11 writes the condition "When you find the target platforms" again, and the heading on line 9 already gives that condition.
- Correction: "Examine the project files for these signals:"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "When there is one target platform, write only the entry file of that platform."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 36 tells the agent to write only `CLAUDE.md` when Claude Code is the only target platform, but line 25 tells the agent to write only features that Codex, OpenCode, and Claude Code all read, also when Claude Code is the only target platform, and Codex does not read `CLAUDE.md`.
- Correction: Add this sentence after "This rule is also applicable when Claude Code is the only target platform, because the project can add a target platform later." on line 25: "The selection of the entry file is not a feature. "When you write or edit an entry file" gives that selection."
