Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size:
- skills/writing/agent-instructions/SKILL.md: 17,985 bytes. Limit: 20,000 bytes (references/loading-rules.md, "When you examine the file size"). 151 lines. Limit: less than 500 lines (references/agent-skills-spec.md, "When you write the body").

Pointer conditions (pointer list of the check script, skills/writing/agent-instructions/SKILL.md):
- Line 3 (frontmatter description, 3 sentences): not pointers. The sentences give the files that make the Skill applicable.
- Line 12 ("Terms in this skill"), references/technical-terms.md: the sentence gives the condition "When a term is not in this section". Condition given.
- Lines 15, 16, 17, 21, 22, 23: definitions, not pointers.
- Line 40 ("Terms in this skill"), references/loading-rules.md: the sentence gives the condition "In the edit job". Condition given.
- Lines 46, 47, 48: examples of files, not pointers.
- Line 68 ("When two sources do not agree"), references/loading-rules.md: the heading gives the condition. Condition given.
- Line 76, references/agent-skills-spec.md: "When a Skill has a known problem". Condition given.
- Line 79: names SKILL.md, not a pointer.
- Line 80, references/agent-skills-spec.md: "When you write or edit a Skill". Condition given. The first sentence of line 80 is a table cell that names agents/openai.yaml, not a pointer.
- Line 81, references/loading-rules.md and references/agent-skills-spec.md: "When you examine the file size". Condition given.
- Line 83: names MEMORY.md, not a pointer.
- Line 91, references/loading-rules.md (2 sentences): "Before you select target platforms". Condition given.
- Line 92, GLOSSARY.md or CONTEXT.md: "If the project has a glossary". Condition given.
- Line 92, references/review.md: the sentence gives the exception to the rule before it, and step 11 gives the condition to read the file. Condition given.
- Line 97, references/loading-rules.md: "For text that is applicable in each session" in the write job. Condition given.
- Line 102, references/ste-rules.md, references/plain-language-rules.md, references/technical-terms.md: "Before you write text". Condition given.
- Line 102, references/agent-skills-spec.md: "If the file that you write or edit is in the folder of a Skill". Condition given.
- Line 102, references/loading-rules.md (2 sentences): "In the write job" and "In the edit job". Condition given.
- Line 103, references/review.md (3 sentences): "Before the self-check", "Then", and "In each job". Condition given.
- Line 104, references/review.md: "In the other jobs, after the self-check". Condition given.
- Line 105, references/review.md: "In the other jobs, after the reader test passes". Condition given.
- Line 106, references/review.md: "If a blocking problem stays open at a limit". Condition given.
- Line 111 ("When a reviewer gives a finding"), references/review.md: "When a reviewer or the check script gives a finding". Condition given.
- Line 117, scripts/check.ts: gives the location of the script, not a pointer to read.
- Line 117, references/review.md: "When you do the self-check". Condition given.
- Line 123: names SKILL.md, not a pointer.
- Line 140, references/review.md: "For the reader reports of a reader-test round". Condition given.
- Line 151, references/end-of-run-report.md: "When you write the end-of-run report". Condition given.

Pointers that name no file: none.

Text to move: none for the rules of this reviewer. The rule about long text in "When you select the text" is skipped, as the prompt tells.

Findings:

- Rule: "Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. (advisory)"
- Text: "For a list file, start no loading reviewer in the self-check."
- Problem: Line 103 (step 8) of skills/writing/agent-instructions/SKILL.md starts no loading reviewer for a list file, but line 34 defines the self-check as "the review of the changed sections by one reviewer subagent of each class", so the definition does not agree with step 8 for a list file.
- Correction: On line 34, write: "The **self-check** is the review of the changed sections by one reviewer subagent of each class, in a maximum of 2 rounds. For a list file, the self-check has no loading reviewer."

- Rule: "The rule changes the usual work of the agent. (advisory)"
- Text: "For a list file, start no loading reviewer in the self-check."
- Problem: Line 103 (step 8) of skills/writing/agent-instructions/SKILL.md changes the usual self-check of 3 reviewers, but neither SKILL.md nor references/review.md ("When you start the reviewers") tells why a list file gets no loading reviewer.
- Correction: "For a list file, start no loading reviewer in the self-check, because the loading rules give a list file no file-size limit and no layout to examine."
