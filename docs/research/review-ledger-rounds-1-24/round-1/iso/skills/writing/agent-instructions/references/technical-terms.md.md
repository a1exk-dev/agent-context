Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - line 12: "To find the text of a rule from its rule number, read `ste-rules.md`."; line 19: "The term "rule" has the meaning "a requirement in a text" in this list."
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 94: ""When you count words" in `ste-rules.md` tells when a colon stops a sentence"
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 9,923 bytes, 180 lines. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Pointers in the pointer list:
- Line 5, "Before you use this file": "If `SKILL.md` of this skill is not in your context window, read it before you use this file." - pointer; the heading and the sentence give the condition.
- Line 5: "`SKILL.md` defines the terms, the tiers, and the end-of-run report." - not a pointer; it gives the cause of the line 5 pointer.
- Line 11: "They are not applicable to text for persons, for example `README.md`." - not a pointer; it gives an example.
- Line 12, "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." - pointer; the sentence gives the condition, but the heading gives a different condition.
- Line 33: "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - not a pointer; it names a file to recommend.
- Line 54 and line 56: table definitions with `SKILL.md` and `AGENTS.md` - not pointers; they give examples.
- Line 94, "Terms for text": ""When you count words" in `ste-rules.md` tells when a colon stops a sentence" - pointer; it gives no condition to read the target.

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "To find the text of a rule from its rule number, read `ste-rules.md`."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 12, the pointer is applicable when the agent finds the text of a rule from its rule number, but the heading "When you find the sources of technical words" gives a different condition.
- Correction: Move the pointer to a new section after the last section of the file, with the heading "## When you find the text of a rule from its rule number". Write the pointer as "To find the text of a rule from its rule number, read `ste-rules.md`."

- Rule: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)"
- Text: "The term "rule" has the meaning "a requirement in a text" in this list."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 19, the rule about the two meanings of "rule" is applicable when the agent writes the word "rule", as the pointer in ste-rules.md line 54 shows, but the heading "When you add a word to the base list" gives a different condition.
- Correction: Move line 19 to a new section with the heading "## When you write the word "rule"", and change the heading in the pointer in ste-rules.md line 54 to that new heading.

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: ""When you count words" in `ste-rules.md` tells when a colon stops a sentence"
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 94, the pointer in the table cell gives the file and the section but no condition to read them, and the topic heading "Terms for text" gives no condition.
- Correction: "To find when a colon stops a sentence, read "When you count words" in `ste-rules.md`."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When the glossary gives a base-list term a different meaning, use the glossary meaning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 26, the rule writes again the condition of the heading "When the glossary gives a different meaning".
- Correction: "Use the glossary meaning."

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 30, the rule writes again the condition of the heading "When a word is not in the base list or in the glossary".
- Correction: "Add a warning."

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "It has no table that gives approved words for words that are not approved."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 13, the sentence tells that the list has no table of approved words for words that are not approved, but each table of the base list (lines 40 to 179) gives a term next to the words that the list does not permit.
- Correction: "It does not give the replacement words of the ASD-STE100 dictionary. The "Do not use" column gives only examples of words for rule 1.11."
