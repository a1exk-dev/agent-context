Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/loading-rules.md: 10,705 bytes, 100 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointer list of loading-rules.md (sentences that are pointers):
- Line 7, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - The heading and the sentence give the condition.
- Line 28, heading "When you select a feature": "When you write a Manual-only Skill, read "When you write the folder and the frontmatter" in `agent-skills-spec.md`." - The sentence gives the condition.
- Line 69, heading "When the write job makes a SKILL.md or entry-file text": "Write one pointer for each reference file, as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - The heading and the sentence give the condition.
- Line 82, heading "When the edit job changes a SKILL.md or an entry file": "Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you." - The heading and the sentence give the condition.
- Line 98, heading "When the file is the glossary, MEMORY.md, or a Rule": "When the project has no glossary, give each term and its definition, as `technical-terms.md` tells you." - The heading and the sentence give the condition.
- The other sentences of loading-rules.md in the pointer list (lines 3, 7, 15, 16, 17, 27, 29, 31, 35, 38, 45, 46, and 56) name a file, but do not tell the agent to read it. They are not pointers.

Pointers that name no file: none.

Text to move: none. The move rules in loading-rules.md are applicable to a SKILL.md file and to entry-file text, not to a reference file.

Moved text: none. The Changes line gives no moved section.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When you find the target platforms, examine the project files for these signals:"
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 11 writes again the condition of the heading "When you find the target platforms" on line 9.
- Correction: "Examine the project files for these signals:"

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, lines 56 and 75 say "Do not move text from a Rule", but line 100 applies the extraction recommendation to a Rule, and item 4 on line 94 lets the user approve the move of an extraction candidate, so the agent cannot know whether the text of a Rule can be an extraction candidate.
- Correction: "For a Rule, use the file-size limit and the extraction recommendation of the entry file that contains its text. The text of a Rule is not an extraction candidate."

- Rule: "Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span. (advisory)"
- Text: "For an `@path` line, put the line in `CLAUDE.md` after the `@AGENTS.md` line. Then add a warning."
- Problem: In skills/writing/agent-instructions/references/loading-rules.md, line 31 gives steps in a sequence (write the feature, then add a warning) in one paragraph of 9 sentences, together with the conditions for the alternative.
- Correction: "When the user tells you clearly to write a feature that only one platform reads, do these steps. The steps are also applicable to the items in the list above:
  1. Write the feature. For an `@path` line, put the line in `CLAUDE.md` after the `@AGENTS.md` line.
  2. Add a warning. The warning gives the platforms that do not read the feature and the alternative that all three platforms read. When two rules give a warning for the same feature, write one warning."
  Keep the sentences about the alternative after the list.
