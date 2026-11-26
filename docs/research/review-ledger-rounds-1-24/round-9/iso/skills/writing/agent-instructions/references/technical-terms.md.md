Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 97: "in `ste-rules.md` tells when a colon stops a sentence"
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/technical-terms.md has 10,026 bytes and 182 lines. Limit: loading-rules.md, "When you examine the file size", gives no limit for a reference file of a Skill. The 20,000-byte limit is only for `SKILL.md`.

Pointer conditions (pointer list of check.json for this file):
- Line 5, heading "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." The heading and the sentence give the condition.
- Line 12, heading "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." The sentence gives the condition. The file name without a folder is permitted, because the table in "When two sources do not agree" in SKILL.md tells to give the file name for a reference file that SKILL.md also points to.
- Line 97, heading "Terms for text": the sentence about "When you count words" in `ste-rules.md` gives no condition to read the target. See the finding below.
- Lines 5 (second sentence), 11, 36, 57, and 59 name a file but are not pointers: they give a fact, an example, or a definition.

Pointers that name no file: none.

Text to move: none. technical-terms.md is a reference file, and the rules in loading-rules.md that tell you to move text are for a SKILL.md and entry-file text.

Findings:

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "in `ste-rules.md` tells when a colon stops a sentence"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 97, the pointer to `ste-rules.md` in the definition of "sentence" gives only the subject of the target, and its topic heading "Terms for text" gives no condition to read it.
- Correction: "To find when a colon stops a sentence, read "When you count words" in `ste-rules.md`."

- Rule: "Add one short cause to a rule in each of these cases:" with the case "To obey the rule, the agent must make a decision. (advisory)"
- Text: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 17, the changed rule makes the agent decide whether most projects use a term, but the rule gives no cause for the limit.
- Correction: "When the edit job changes this skill, add a term to the base list only when most projects use the term in Agent instructions, because the base list is applicable to the Agent instructions of each project."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 33, the first rule writes again the condition of the heading "When a word is not in the base list or in the glossary" on line 31.
- Correction: "Add a warning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 29, the rule writes again the condition of the heading "When the glossary gives a different meaning" on line 27.
- Correction: "Use the glossary meaning of the base-list term."
