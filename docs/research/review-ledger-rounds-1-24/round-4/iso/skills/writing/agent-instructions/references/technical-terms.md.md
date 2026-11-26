Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/technical-terms.md has 9,997 bytes. Limit: loading-rules.md and agent-skills-spec.md give no limit for a reference file of a Skill.

Pointer conditions in the sections under review:
- Line 11, "When you find the sources of technical words": "They are not applicable to text for persons, for example `README.md`." This sentence is a rule, not a pointer.
- Line 12, "When you find the sources of technical words": "To find the text of a rule from its rule number, read `ste-rules.md`." The sentence gives the condition.
- The sections "When you add a word to the base list" and "When you write the word rule" have no pointers. The heading "When you write the word rule" gives the condition of the pointer in ste-rules.md line 54.

Pointers that name no file: none.

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "The base list contains only terms and meanings that we wrote. It has no table that gives approved words for words that are not approved."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 13, the file tells that the base list has no table that gives approved words for words that are not approved, but lines 20 and 43 to 182 give tables with a "Do not use" column next to each approved term.
- Correction: The base list contains only terms and meanings that we wrote. It is not the ASD-STE100 dictionary. The "Do not use" column gives only examples of words that the base list does not permit.
