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
- A **finding** is one problem that a reviewer subagent gives in its report. The check script also gives findings.
- A **blocking rule** is a rule in a reference file of this skill. The rule ends with the mark "(blocking)". When you accept a confirmed finding for a blocking rule, the review round of that finding fails.
- An **advisory rule** is a rule in a reference file of this skill. The rule ends with the mark "(advisory)". A finding for an advisory rule never makes a review round fail.
- A **confirmer** is a new subagent that answers "yes" or "no", with one sentence, for one problem that a different check found. It gets the rule, the quoted text, and the files, but not the cause that the other check gives. The problem counts when one or more confirmers answer "yes".
- A **warning** is one item in the Warnings part of the end-of-run report. It is not the STE signal word WARNING, which this skill does not use.
- A **tier** is one position in the sequence of the sources.
- An **ADR** is an architecture decision record: a file that records one design decision and its cause.
- **Loading rules** are the rules that a file must obey. If a file does not obey them, one of 3 results occurs. A platform does not load the file, a check gives an error, or the platform does not read all of the file.
- The **loading reviewer**, the **ASD-STE100 reviewer**, and the **ISO 24495-1 reviewer** are the 3 reviewer subagents.
- The **self-check** is the review by the 3 reviewer subagents, in a maximum of 3 rounds.
- The **reader test** is a dry run of 3 tasks by new reader subagents after the self-check.
- In the edit job, the **changed part** is the text that the user wants to change. It also includes each line that you add. When you move a line of that text to a different section, the line stays in the changed part. Each other part of the file is an **unchanged part**.
- An **extraction candidate** is a whole section of an unchanged part that the author recommends to move in the edit job. In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections.

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

1. Loading rules: These are the MUST items of the Agent Skills specification for a Skill, and the platform loading rules for each Agent instruction. The MUST items include all items that `skills-ref validate` examines.
2. ASD-STE100: This tier contains the STE rules of this skill.
3. ISO 24495-1 checks: This tier contains the plain-language checks of this skill.
4. Recommendations: This tier contains the recommendations of the Agent Skills specification. It also contains the rules in `references/loading-rules.md` that tell you to move text and that are not tier 1. Text that does not obey a recommendation can obey all rules of the specification.

For an Agent instruction that is not a Skill, the Agent Skills specification is not applicable. Tier 1 then contains only the loading rules for that file. Tier 4 contains only the rules that tell you to move text and that are not tier 1.

This table gives the known cases where two sources do not agree, and the decision for each case:

| Case | Decision |
|---|---|
| The "Gotchas" section of the specification and the rule "Use no headings that are applicable to all subjects" | When a Skill has a known problem, put it where `references/agent-skills-spec.md` tells you. Write no "Gotchas" section. |
| The specification "give freedom where many approaches work" and the STE modal verbs | Use CAN or a condition that you write in the sentence. |
| ISO neutral tone and CAUTION | You can use CAUTION. Use no other emphasis. |
| The rule "Write each pointer as a sentence that gives the file" and the rule "Make no sequences of pointers" | When a reference file refers to a different reference file that `SKILL.md` also points to, give the file name. This text is not a sequence of pointers. |
| File size | When you examine the file size, use only the limits in `references/loading-rules.md` and `references/agent-skills-spec.md`. |
| File-size limit and the edit-job rule 'change only the changed part' | Move whole sections without changes. |
| The rule "Copy the format of the entries" for the glossary and `MEMORY.md`, and the STE rule "Do not omit words" | Copy the format of the entries. If the entries start the definition without the term, start the new definition without the term. |

If two sources do not agree in a case that is not in this table, use the tier sequence. Write a warning that gives the case and the tier that you obeyed.

## Steps of the write job and the edit job

Do these steps in the write job and in the edit job.

1. Before you select target platforms, read `references/loading-rules.md`. Then find the target platforms as that file tells you.
2. If the project has a glossary, read `GLOSSARY.md` or `CONTEXT.md`, as "Terms in this skill" tells you. The terms of the glossary are technical nouns for this task. Before you write text, find each project fact, command, and path that the task makes necessary. If no project file gives one or more of these items, speak to the user one time. Ask about all of these items in that time. An example of a project fact is a branch name. After you start to write text, do not stop the job for a question to the user. The end-of-run report gives all questions to the user. Put each question that you find after you start to write text in the Warnings part of the end-of-run report.
3. Find when the file loads: in each session, only when a task makes it necessary, or through a pointer. Use the result to select the file type and the file-size limit.
4. In the write job, select the file type:
   - If the user gives a file type, write that type. If that type is not correct for the text, add a warning.
   - If the user gives no file type, use this list to select the type:
     - For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives. If the project keeps Rules, write a Rule.
     - For text that is applicable only to some tasks, write a Skill.
     - For long text, write a reference file.
5. In the edit job, before your first change, save a copy of each file that you change. Save the copies in a temporary folder that is not in the project. The reader test uses these copies. Change only the changed part. In the unchanged parts, do not write lines again. Do not move lines in the unchanged parts. In the unchanged parts, do not put two lines into one line or one line into two lines. The rules about the unchanged parts are also applicable when a finding tells you to make a change. The user gives approval only for the change that they wanted. The file-size limit is one exception, as the table in "Sequence of the sources" gives. An extraction candidate that the user gives approval for is the other exception. If you find a file type that is not correct for the text, add a warning.
6. In the edit job, the user can tell you that an agent did not obey an instruction. For that edit job, record the condition of the previous instruction in quotation marks. The condition can be in the heading of the section or in the sentence. The Summary part of the end-of-run report gives this condition. If the previous instruction has no condition, record "no condition".
7. Before you write text, read `references/ste-rules.md`, `references/plain-language-checks.md`, and `references/technical-terms.md`. If the file that you write or edit is a Skill, also read `references/agent-skills-spec.md`. In the edit job, first use these rules to examine each section that you will change. A new section has no previous text to examine. The Summary part then gives no problem for that section. Record each problem before you correct it. Keep the list of these problems for the Summary part. Then write the text by these rules. In the write job, also move text to reference files as "When the write job makes a SKILL.md or entry-file text" in `references/loading-rules.md` tells you. In the edit job, move text as "When the edit job changes a SKILL.md or an entry file" in that file tells you.
8. Before the self-check, read `references/review.md`. Then do the self-check that it gives.
9. After the self-check, do the reader test that `references/review.md` gives.
10. Write the end-of-run report.

### When a reviewer gives a finding

When a reviewer or the check script gives a finding, read `references/review.md`.

## When you run the check script

Requires Node.js 22.18 or later.

The check script `scripts/check.ts` is in the folder of this `SKILL.md` file. It examines each rule that ends with "(script check)". When you do the self-check, `references/review.md` tells you when to run it. Run it with `node`, as this command shows:

```sh
node <skill folder>/scripts/check.ts <file>... --project <project folder> --glossary <glossary path or none> > <JSON file>
```

- Replace `<skill folder>` with the absolute path of the folder of this `SKILL.md` file.
- Give the absolute path of each file to examine. Save the output to a new file in a temporary folder that is not in the project.
- The script gives JSON with a list of findings and a list of the sentences that name a file path. Exit code 0 shows no findings. Exit code 1 shows one or more findings.
- Exit code 2 shows that the check script did not run, for example because of a missing file. Then the script gives no JSON.
- The script does not write its error message to the JSON file. The shell shows the error message.
- If the script gives no JSON, stop the self-check and the reader test. Then write the end-of-run report. In a warning, give the error message. In the same warning, tell the user that the check script requires Node.js 22.18 or later.

The report form of the script examines the reviewer reports of one file. Run it once for each file of the round:

```sh
node <skill folder>/scripts/check.ts --reports --file <file under review> <report file>... > <JSON file>
```

- The script gives JSON with 3 lists of findings: blocking, advisory, and dropped. It drops each finding that has a missing field, a quotation that is not in the files, or no rule with a mark.
- The exit codes are the same as in the first form. Exit code 1 shows one or more findings in the blocking list or the advisory list.

For the reader reports of one file, also give the saved copy and the tasks file that `references/review.md` gives. Give the reports in the sequence of the tasks:

```sh
node <skill folder>/scripts/check.ts --reports --file <file under review> --copy <saved copy or none> --tasks <tasks file> <reader report>... > <JSON file>
```

- The script gives JSON with 3 lists: the problems list, the unclear list, and the dropped list. Exit code 1 shows one or more items in the problems list or the unclear list.
- A tested quote that is not in the file under review gives exit code 2. A reader report without its 3 parts also gives exit code 2.

## When you write the end-of-run report

When you write the end-of-run report, read `references/end-of-run-report.md`.
