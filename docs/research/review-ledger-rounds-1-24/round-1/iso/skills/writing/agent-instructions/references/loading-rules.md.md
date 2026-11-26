Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File sizes:
- skills/writing/agent-instructions/references/loading-rules.md: 10673 bytes. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointers in the sections under review (line, heading, condition):
- Line 7, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." The sentence and the heading give the condition.
- Line 28, "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." The sentence gives the condition.
- Line 69, "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." The heading and the action of the sentence give the condition.
- Line 82, "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." The heading and the sentence give the condition.
- Line 98, "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." The sentence gives the condition.
- The other sentences in the pointer list for this file name a file as an example, a signal, or a place to write text. They do not tell the agent to read a file.
- Pointers that name no file: none.

Moved text: none. Text to move: none, because the rules that move text are applicable to a `SKILL.md` file and to entry-file text, not to a reference file.

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the rule writes again the condition of its heading "When you find the target platforms" on line 9.
- Correction: "Examine the project files for these signals:"

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "For an `@path` line, put the line in `CLAUDE.md` after the `@AGENTS.md` line. Then add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 31, a paragraph gives steps in a sequence ("write it", "put the line", "Then add a warning") without a numbered list.
- Correction: Write the steps as a numbered list: "1. Write the feature. 2. For an `@path` line, put the line in `CLAUDE.md` after the `@AGENTS.md` line. 3. Add a warning. The warning gives the platforms that do not read the feature and the alternative that all three platforms read."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "Before you write, plan the file layout. Before the self-check, write the reference files and their pointers."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 56, a paragraph gives 2 steps in a sequence of the task without a numbered list, before a numbered list with different items.
- Correction: Put the 2 steps in the numbered list: first "Before you write, plan the file layout.", and as the last item "Before the self-check, write the reference files and their pointers."
