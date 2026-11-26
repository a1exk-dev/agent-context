Blocking checklist:
1. "Use one technical noun for each item, and one item for each technical noun (rule 1.11). Use the same term for the same item each time (rule 6.2). (blocking)" - none
2. "Do not omit words when the omission changes the meaning of the sentence (rule 4.2). (blocking)" - none
3. "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)" - line 32: "Put procedure steps in the sequence of the task, with the necessary conditions first."
4. "Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again. (blocking)" - none
5. "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)" - line 17: "A rule with no condition is permitted only when it is applicable to all tasks for its file."
6. "Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence. (blocking)" - none
7. "A note gives only information (rule 5.5). Put each instruction, requirement, and limit in a step or a rule, not in a note. An agent does not always obey a note. Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note. (blocking)" - none
8. "Put information that prevents damage in a CAUTION, not in a note. (blocking)" - none
9. "A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition. (blocking)" - none
10. "Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item. (blocking)" - none
11. "A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/plain-language-rules.md: 7236 bytes. Limit: none. "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill.

Findings:

- Rule: GR-2 "When "with" can have two meanings in a sentence, write a different sentence (GR-2). (blocking)"
- Text: "Put procedure steps in the sequence of the task, with the necessary conditions first."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 32, "with the necessary conditions first" can mean that each condition comes before its step, or that the steps that have conditions come before the other steps.
- Correction: "Put procedure steps in the sequence of the task. Write each necessary condition before the step that it limits."

- Rule: 5.3 "Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. (blocking)"
- Text: "A rule with no condition is permitted only when it is applicable to all tasks for its file."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 17, this sentence gives an instruction to the author as a statement, not in the imperative.
- Correction: "Write a rule with no condition only when the rule is applicable to all tasks for its file."

- Rule: 1.8 "When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8). (advisory)"
- Text: "Use the level of the other condition headings."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 35, "condition headings" is a technical noun that is not in the base list, not in the glossary, and not in "Terms in this skill" of SKILL.md, and the same file elsewhere writes "a heading that gives the condition".
- Correction: "Use the level of the other headings that give a condition."

- Rule: 4.1 "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "Put each template and each command of more than one line in a code block."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 38, "of more than one line" can apply only to "each command" or also to "each template", so the reader does not know if a template of one line goes in a code block.
- Correction: "Put each template in a code block. Also put each command of more than one line in a code block."

- Rule: 4.1 "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "Examine only the rules that you add or change for these cases."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 27, "for these cases" can apply to "Examine" or to "add or change", so the reader does not know which rules to examine.
- Correction: "Examine only the rules that you add or change. For each of these rules, examine if one of these cases is applicable."

- Rule: 4.1 "Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement. (advisory)"
- Text: "Make no changes for a person."
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 15, "Make no changes for a person" is a general statement that does not tell which text the author must not add or change.
- Correction: "Do not add text that only a person needs, for example background text or a welcome sentence."
