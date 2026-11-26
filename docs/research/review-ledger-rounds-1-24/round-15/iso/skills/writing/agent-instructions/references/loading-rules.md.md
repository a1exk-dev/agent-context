Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes. Limit: none. "When you examine the file size" in loading-rules.md gives limits only for entry files and SKILL.md, and agent-skills-spec.md gives no byte limit for a reference file.

Pointer conditions (pointer list, loading-rules.md):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - the heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - the sentence gives the condition.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - the heading and the action of the sentence (when you write a pointer for a reference file) give the condition.
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - the heading and the action of the sentence (when you write the pointer in the old place of a moved section) give the condition.
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - the heading and the sentence give the condition.
- The other sentences of loading-rules.md in the pointer list (lines 3, 7 second sentence, 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, 56, 98 second and third sentences) are examples, table data, or statements. They tell the agent to read no file, so they are not pointers.

Pointers that name no file: none.

Text to move: none. loading-rules.md is a reference file, and no text of it is a candidate to move.
Moved text: none.

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 11, the sentence writes again the condition of its heading "When you find the target platforms" (line 9).
- Correction: "Examine the project files for these signals:"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the sentence tells the agent to recommend text of a Rule to move, but lines 56 and 75 tell the agent "Do not move text from a Rule."
- Correction: "For a Rule, use the file-size limit of the entry file that contains its text. Give no extraction candidate in a Rule."

- Rule: "Add one short cause to a rule in each of these cases:" - "The rule is not usual for the agent. (advisory)"
- Text: "Do not move text from a Rule."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md lines 56 and 75, the rule stops a usual move of text, and no file gives the cause.
- Correction: "Do not move text from a Rule, because the project copies the full text of a Rule into `AGENTS.md` or `CLAUDE.md`."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "After you move the text, examine the file size."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 71, a paragraph gives steps in a sequence (examine the file size, move sections, move the largest section first, stop, add a warning), not a numbered list.
- Correction: "After you move the text, do these steps: 1. Examine the file size. 2. If the file is more than a limit in "When you examine the file size", move more sections that have a specified condition. Move the largest section first. 3. When the file is not more than each limit, stop. 4. If the file is still more than a limit, add a warning. (advisory)"

- Rule: "Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target. (advisory)"
- Text: "The STE rules and the plain-language rules are also applicable to these files."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md line 100, the sentence gives a fact that the pointer target SKILL.md already gives: line 17 makes the glossary, `MEMORY.md`, and Rules Agent instructions, and step 7 (line 102) tells the agent to read and obey the STE rules and the plain-language rules for each Agent instruction.
- Correction: Remove the sentence. Keep "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The Agent Skills specification is not applicable to a Rule. (advisory)"
