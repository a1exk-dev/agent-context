---
name: agent-instructions
description: "When you write, edit, make shorter, or correct a file that an agent reads as instructions, use this skill. These files are SKILL.md files and their reference files, AGENTS.md, AGENTS.override.md, CLAUDE.md, CLAUDE.local.md, GLOSSARY.md, CONTEXT.md, MEMORY.md, and Rules. A Rule is a short file. A project adds the text of a Rule to AGENTS.md or CLAUDE.md. These files also include the files in docs/agents/, .claude/rules/, .claude/skills/, .agents/skills/, and .opencode/skills/, and the targets of their pointers. When a user tells you to \"draft a skill\", \"rewrite AGENTS.md\", \"tidy up CLAUDE.md\", \"add a term to CONTEXT.md\", or \"record in MEMORY.md\", use this skill. When a user tells you that \"the agent keeps ignoring\" an instruction or does not obey a rule, use this skill. When a user wants Agent instructions that are shorter or more clear, use this skill. Do not use it for files that persons read, Cursor or Copilot files, or subagent definitions. Do not use it for prompt text in product code."
---

# Agent instructions

This skill helps you write or edit an Agent instruction. It uses three sources for the text: the Agent Skills specification, ASD-STE100, and ISO 24495-1.

## Terms in this skill

Each bold term in this section is a technical noun in this skill. When a term is not in this section, find it in `references/technical-terms.md`.

- An **Agent instruction** is a file that an agent reads as instructions. Agent instructions are these files:
  - In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions.
  - The entry files `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, and `AGENTS.override.md` are Agent instructions.
  - `GLOSSARY.md`, `CONTEXT.md`, `MEMORY.md`, Rules, the files in `.claude/rules/`, and the files in `docs/agents/` are Agent instructions.
  - The files that pointers in these files identify are also Agent instructions. A file for persons is not an Agent instruction, also when a pointer identifies it.
- The **author** is you, the agent that uses this skill. The **user** is the person who gave you the task.
- The **write job** makes a new Agent instruction. The **edit job** changes an Agent instruction that the project has.
- The **glossary** is the file that gives the terms of the project. Its name is `GLOSSARY.md` or `CONTEXT.md`. If the project has the two files, use `GLOSSARY.md`.
- A **Rule** is a short Markdown file. A project adds the text of a Rule to `AGENTS.md` or `CLAUDE.md`.
- A **finding** is one problem that a reviewer subagent gives in its report.
- A **warning** is one item in the Warnings part of the end-of-run report. It is not the STE signal word WARNING, which this skill does not use.
- A **tier** is one position in the sequence of the sources.
- An **ADR** is an architecture decision record: a file that records one design decision and its cause.
- **Loading rules** are the rules that a file must obey. If a file does not obey them, one of 3 results occurs. A platform does not load the file, a check gives an error, or the platform does not read all of the file.
- The **loading reviewer**, the **ASD-STE100 reviewer**, and the **ISO 24495-1 reviewer** are the 3 reviewer subagents.
- The **self-check** is the review by the 3 reviewer subagents, in a maximum of 3 rounds.
- The **reader test** is a dry run of 3 tasks by new reader subagents after the self-check.
- An **extraction candidate** is a section of an unchanged part in the edit job. In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections. The report gives each of these sections to the user. The author keeps the section in its file until the user gives approval.

## Files that are not Agent instructions

When the task is about one of these files, do the task without this skill:

- Files for persons, for example `README.md`, `CONTRIBUTING.md`, ADRs, user manuals, code comments, and commit messages.
- Subagent definitions, for example the files in `.claude/agents/`.
- Files for platforms other than Codex, OpenCode, and Claude Code, for example Cursor rules and `.github/copilot-instructions.md`.
- Prompt text in the code of a software product.

When you do the task without this skill, write no end-of-run report.

## Sources

- The Agent Skills specification is at https://agentskills.io/specification.
- This skill uses ASD-STE100 Simplified Technical English, Issue 9.
- This skill uses ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*.

Do not write in a file that your text or this skill is "STE compliant" or "certified". ASD, the organization that publishes ASD-STE100, did not examine this text or this skill.

## Sequence of the sources

When two sources do not agree, obey the higher tier. The tiers are in this sequence, with the highest tier first:

1. **Loading rules:** These are the MUST items of the Agent Skills specification for a Skill, and the platform loading rules for each Agent instruction. The MUST items include all items that `skills-ref validate` examines.
2. **ASD-STE100:** This tier contains the STE rules of this skill.
3. **ISO 24495-1 checks:** This tier contains the plain-language checks of this skill.
4. **Recommendations:** This tier contains the recommendations of the Agent Skills specification. It also contains the rules in `references/loading-rules.md` that tell you to move text and that are not tier 1. Text that does not obey a recommendation can obey all rules of the specification.

For an Agent instruction that is not a Skill, the Agent Skills specification is not applicable. Tier 1 then contains only the loading rules for that file. Tier 4 contains only the rules that tell you to move text and that are not tier 1.

This table gives the known cases where two sources do not agree, and the decision for each case:

| Case | Decision |
|---|---|
| The "Gotchas" section of the specification and the rule "Use no headings that are applicable to all subjects" | When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you. Write no "Gotchas" section. |
| ISO words that the reader knows and STE words | Use the STE words. |
| The specification "give freedom where many approaches work" and the STE modal verbs | Use CAN or a condition that you write in the sentence. |
| ISO neutral tone and CAUTION | You can use CAUTION. Use no other emphasis. |
| The rule "Write each pointer as a sentence that gives the file" and the rule "Make no sequences of pointers" | When a reference file refers to a different reference file that `SKILL.md` also points to, give the file name. This text is not a sequence of pointers. |
| File size | When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`. |
| File-size limit and the edit-job rule "change only the changed part" (step 5) | Move whole sections without changes. |
| The rule "Copy the format of the entries" for the glossary and `MEMORY.md`, and the STE rule "Do not omit words" | Copy the format of the entries. If the entries start the definition without the term, start the new definition without the term. |

If two sources do not agree in a case that is not in this table, use the tier sequence. Write a warning that gives the case and the tier that you obeyed.

## Steps of the write job and the edit job

Do these steps in the write job and in the edit job.

1. Before you select target platforms, read `references/loading-rules.md`. Then find the target platforms as that file tells you.
2. If the project has a glossary, read it. Its terms are technical nouns for this task. If no file gives a project fact for the task, speak to the user one time. An example is a branch name. If the project does not have a command or a path from the task, speak to the user one time.
3. Find when the file loads: in each session, only when a task makes it necessary, or through a pointer. Use the result to select the file type and the file-size limit.
4. In the write job, select the file type:
   - If the user gives a file type, write that type. If that type is not correct for the text, add a warning.
   - If the user gives no file type, use this list to select the type:
     - For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives. If the project keeps Rules, write a Rule.
     - For text that is applicable only to some tasks, write a Skill.
     - For long text, write a reference file.
5. In the edit job, change only the part that the user wants to change. In the other parts, do not write lines again, change the numbers of lines, or move lines. Do not put two lines into one line. A line that the change moves to a different section is in the changed part. This rule is also applicable when a finding tells you to make a change. The user gives approval only for the change that they wanted. The file-size limit is the only exception, as the table in "Sequence of the sources" gives. If you find a type that is not correct, add a warning.
6. In the edit job, the user can tell you that an agent did not obey an instruction. For that edit job, record the condition of the previous instruction in quotation marks. The condition can be in the heading of the section or in the sentence. The Summary part of the end-of-run report gives this condition. If the previous instruction has no condition, record "no condition".
7. Before you write text, read `references/ste-rules.md`, `references/plain-language-checks.md`, and `references/technical-terms.md`. If the file that you write or edit is a Skill, also read `references/agent-skills-spec.md`. In the edit job, first use these rules to examine each section that you will change. A new section has no previous text to examine. The Summary part then gives no problem for that section. Record each problem before you correct it. Keep the list of these problems for the Summary part. Then write the text by these rules. In the write job, also move text to reference files as "When the write job makes a SKILL.md or entry-file text" in `references/loading-rules.md` tells you. In the edit job, move text as "When the edit job changes a SKILL.md or an entry file" in that file tells you.
8. Before the self-check, read `references/review.md`. Then do the self-check that it gives.
9. After the self-check, do the reader test that `references/review.md` gives.
10. Write the end-of-run report.

### When a reviewer gives a finding

- When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you.
- If you cannot correct a finding without help from the user, put it in a warning. An example is a word that makes a new technical noun in the project necessary.
- A finding comes only from a reviewer report. When you find a problem yourself, give it in a warning, not as a finding. In that warning, give the text in quotation marks and the problem.

## End-of-run report

The job stops with one report. Use this structure. Do not write a part that has no items.

1. Write the report in the structure below. Obey the rules for each part. These rules are below the template.
2. Compare the report with each reviewer report. Include each warning. In the edit job, also include each extraction candidate. For each finding in a warning, give its rule, its text in quotation marks, and its problem. For a file-size warning, give the measured file size and its limit.
3. Save the full report to a file in a temporary folder that is not in the project.
4. After you save the report file, read it. Then your last message gives the full lists, not a short summary.
5. Send the full text of the file as your last message. Copy the text without changes. Do not write the report again in different words. Then the user can see the full lists and select the changes that they want.

```markdown
## Summary
<The files that the job wrote or changed, with their paths, and the changes.>
<For an edit job after an agent did not obey an instruction: the previous condition in quotation marks, or "no condition".>

## Warnings
- The author selected words from model knowledge and did not examine them in the ASD-STE100 dictionary.
- <One item for each warning that is applicable.>

## Extraction candidates
- <Section> → <recommended file>. Pointer: "<pointer sentence>"

## Base-list words with a project meaning
- <Word>: <the meaning in the glossary>
```

In the Summary part of the edit job, include each problem that you recorded before you changed the file. Give the cause and the change that corrected it.

The Warnings part always starts with the word-selection warning. Copy it with the same words: "The author selected words from model knowledge and did not examine them in the ASD-STE100 dictionary." Then add one item for each of these warnings that is applicable:

- Each finding that you did not correct after round 3, with its rule.
- Each finding that you rejected, with the rule or the text type that permits the text.
- In the edit job, each finding about text that is not in the changed part.
- Each problem from the reader test that you cannot correct.
- Each part that a round 3 correction changed. Also each part that changed after the reader test when you did all 3 review rounds. Write that no reviewer examined it.
- The same agent did all checks, and the readers knew the previous text. Give the path of the report folder. This item is applicable when no subagent was available.
- Each finding that you cannot correct without help from the user.
- Each case where two sources do not agree and that the table does not give, with the obeyed tier.
- A feature that only one platform reads, if you wrote it because the user told you to write it.
- A file type that is not correct for the text, also when you found it during the edit job.
- An entry-file layout that gives no copy of the text to a target platform.
- An Agent instruction that does not load in each session and that no pointer identifies.
- A file size that is more than its limit after you moved text. Give the measured file size and the limit.
- A word that is not approved, not in the base list, and not in the glossary. Give the recommended STE word or glossary entry.
- A Skill folder that a target platform does not load, with that platform.

In the write job and in the edit job, give each text that you moved in the Summary part. The write job has no Extraction candidates part. In the edit job, copy the full candidate list of the round-1 loading reviewer into the Extraction candidates part. Use the corrected items from the reviews after round 1. A finding of a different reviewer can tell you to move unchanged text. If the section of that text is an extraction candidate, add that section. Do not include a section that you moved. Use the heading of each section as the name of its candidate.

The last part gives each base-list word that has a different meaning in the glossary.
