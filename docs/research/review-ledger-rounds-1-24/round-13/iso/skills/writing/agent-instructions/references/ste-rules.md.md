Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - line 54: "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it."
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/ste-rules.md: 9,973 bytes. Limit: none. loading-rules.md gives no file-size limit for a reference file.

Pointers in the sections under review:
- Line 27, "When you select a technical noun": "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8)." - Pointer. The heading and the sentence give the condition.
- Line 28: "When the glossary and the base list have no noun for an item, do the steps in "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`." - Pointer. The sentence gives the condition.
- Line 31: "Write a term in bold only when the glossary or the base list in `technical-terms.md` has it (rule 1.8)." - Pointer. The sentence gives the condition: when you write a term in bold.
- Line 54, "When you write a sentence": "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it." - Pointer. The heading does not give the condition, and the sentence gives the condition only through the pronoun "it".
- Line 54: "When you write "rule" in lowercase, read "When you write the word rule" in `technical-terms.md` for the two meanings." - Pointer. The sentence gives the condition.
- Pointers that name no file: none.

Findings:

- Rule: "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)"
- Text: "Obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md` for it."
- Problem: In skills/writing/agent-instructions/references/ste-rules.md line 54, the heading "When you write a sentence" does not give the condition to read technical-terms.md, and the pointer gives its condition only as "for it", so the reader must find the item in the previous sentence.
- Correction: "When you write a multi-word noun with a glossary term that the glossary does not give, obey "When a technical noun is not in the base list or in the glossary" in `technical-terms.md`."
