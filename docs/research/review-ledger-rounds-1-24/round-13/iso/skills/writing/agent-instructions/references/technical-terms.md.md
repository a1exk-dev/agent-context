Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/technical-terms.md: 10,036 bytes. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointers in the sections under review:
- Line 36, "When a technical noun is not in the base list or in the glossary": "If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition." - Not a pointer. The sentence names a file to recommend, not a file to read.
- Pointers that name no file: none.

Findings:

- Rule: "Do not write the condition of the heading again in each rule of the section. A pointer is different, because it gives its condition. (advisory)"
- Text: "When a technical noun is not in the base list and not in the glossary, add a warning."
- Problem: In skills/writing/agent-instructions/references/technical-terms.md line 33, the sentence writes again the condition of the heading "When a technical noun is not in the base list or in the glossary" on line 31, and the sentence is not a pointer.
- Correction: "Add a warning."
