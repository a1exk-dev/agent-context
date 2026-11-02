---
name: agent-instructions
description: "When you write, edit, make shorter, or correct a file that an agent reads as instructions, use this skill. These files are SKILL.md files and their reference files, AGENTS.md, AGENTS.override.md, CLAUDE.md, CLAUDE.local.md, GLOSSARY.md, CONTEXT.md, MEMORY.md, and Rules. A Rule is a short file. A project adds the text of a Rule to AGENTS.md or CLAUDE.md. These files also are the files in docs/agents/ and .claude/rules/, and the pointer targets of these files. When a user tells you to \"draft a skill\", \"rewrite AGENTS.md\", \"tidy up CLAUDE.md\", \"add a term to CONTEXT.md\", or \"record in MEMORY.md\", use this skill. When a user tells you that an agent does not obey one of these files, use this skill. An example is \"the agent keeps ignoring\". When a user tells you to make Agent instructions shorter or more clear, use this skill. Do not use it for files that persons read, Cursor or Copilot files, or subagent definitions. Do not use it for prompt text in product code."
---

# Agent instructions

This skill helps you write or edit an Agent instruction. It uses these sources for the text: the platform loading rules, the Agent Skills specification, ASD-STE100, and ISO 24495-1.

## Terms in this skill

Each bold term in this section is a technical noun in this skill.

- An **Agent instruction** is a file that an agent reads as instructions. Agent instructions are these files:
  - In a Skill folder, the `SKILL.md` file and its reference files are Agent instructions.
  - The entry files `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, and `AGENTS.override.md` are Agent instructions.
  - `GLOSSARY.md`, `CONTEXT.md`, `MEMORY.md`, Rules, the files in `.claude/rules/`, and the files in `docs/agents/` are Agent instructions.
  - The pointer targets of these files are also Agent instructions. A file for persons is not an Agent instruction, also when it is a pointer target.
- The **author** is you, the agent that uses this skill. The **user** is the person who gave you the task. When the glossary gives a different term for this person, for example "operator", the glossary term replaces "user". This rule is applicable only to the types of file for which the glossary gives that term. The user controls the terms of the project.
- The **write job** makes a new Agent instruction. The **edit job** changes an Agent instruction that the project has.
- The **glossary** is the file that gives the terms of the project. Its name is `GLOSSARY.md` or `CONTEXT.md`. If the project has the two files, the glossary is `GLOSSARY.md`.
- A **Rule** is a short Markdown file. A project adds the text of a Rule to `AGENTS.md` or `CLAUDE.md`.
- A **finding** is one problem in a review report. A review report comes from a reviewer subagent, or from a review that you do as "When no subagent is available" in `references/review.md` tells you.
- A **warning** is one item in the Warnings part of the end-of-run report. It is not the STE signal word WARNING, which this skill does not use.
- A **tier** is one of the 4 groups of rules in "When two sources do not agree". The groups are in a sequence, with the highest tier first.
- A **pointer target** is the file that a pointer identifies.
- A **target platform** is a platform that the project selects for its Agent instructions.
- **Loading rules** are the rules that a file must obey. If a file does not obey them, one of these 3 results occurs:
  - A platform does not load the file.
  - A check gives an error.
  - The platform does not read all of the file.
- The **loading reviewer**, the **ASD-STE100 reviewer**, and the **ISO 24495-1 reviewer** are the 3 reviewers. Usually, each reviewer is a subagent.
- A **round** is one series of checks of all files that the round examines. Each reviewer examines each file one time, or each reader does one task.
- The **self-check** is the review of each file by the 3 reviewers, in a maximum of 3 rounds.
- The **reader test** is a dry run of 3 tasks for each new or changed file, after the self-check stops. Usually, new reader subagents do these tasks.
- An **out-of-scope task** is a reader-test task that the new or changed instruction does not change.
- In the edit job, the **changed part** is the text that the user tells you to change. The changed part also contains each line that the author adds. The changed part does not contain a section that the author moves from an unchanged part because of the file size. When the author moves a line of the changed part to a different section, the line stays in the changed part. Each other part of the file is an **unchanged part**.
- An **extraction candidate** is a complete section in an unchanged part. In the edit job, the author recommends that this section goes to a different file. In the edit job, "When you recommend text to move" in `references/loading-rules.md` gives these sections.

### When a term is not in "Terms in this skill"

When a term is not in "Terms in this skill", find it in the glossary of the project. If the glossary does not give the term, find it in `references/technical-terms.md`.

## Files that are not Agent instructions

When the task is about one of these files, do the task without this skill:

- Files for persons, for example `README.md`, `CONTRIBUTING.md`, architecture decision records (ADRs), manuals, code comments, and commit messages.
- Subagent definitions, for example the files in `.claude/agents/`.
- Files for platforms other than Codex, OpenCode, and Claude Code, for example the files in `.cursor/rules/` and `.github/copilot-instructions.md`.
- Prompt text in the code of a software product.

When you do the task without this skill, write no end-of-run report.

## Sources

In a file, do not write that your text or this skill is "STE compliant" or "certified". ASD, the organization that publishes ASD-STE100, did not examine your text or this skill.

## When two sources do not agree

When two sources do not agree, read `references/source-conflicts.md`. It gives the known cases and what to do in each case. The tiers are in this sequence, with the highest tier first:

1. **Loading rules:** These are the "MUST" items of the Agent Skills specification for a Skill, and the platform loading rules for each Agent instruction. This tier also contains the rules that `references/agent-skills-spec.md` marks as tier 1. Each item that `skills-ref validate` examines is a "MUST" item.
2. **ASD-STE100:** This tier contains the STE rules of this skill and the rules that `references/agent-skills-spec.md` marks as tier 2.
3. **ISO 24495-1 checks:** This tier contains the plain-language checks of this skill.
4. **Recommendations:** This tier contains the recommendations of the Agent Skills specification and the other rules that `references/agent-skills-spec.md` marks as tier 4. Tier 4 also contains the rules in `references/loading-rules.md` that tell you to move text and that are not in tier 1.

For an Agent instruction that is not in a Skill folder, the Agent Skills specification is not applicable. Tier 1 then contains only the loading rules for that file. Tier 4 contains only the rules that tell you to move text and that are not in tier 1.

## Steps of the write job and the edit job

1. Before you find the target platforms, read `references/loading-rules.md`. Then find the target platforms as that file tells you.
2. If the project has a glossary, read it. Its terms are technical nouns for this task.
3. When the glossary gives a term for the user, use that term in the file types that the glossary gives.
4. If no file gives a project fact for the task, ask the user one question. An example is a branch name. If the task gives a command or a path that the project does not have, ask the user one question. Do not ask about the cause of a rule. A question for each cause stops the task many times.
5. Find which of these items makes the platform load the file that you write or edit:
   - The start of each session.
   - A task that makes the file necessary.
   - A pointer in a different file.

   Use the result to select the file type and the file-size limit.
6. In the write job, select the file type:
   - If the user gives a file type, select that file type, except when `references/loading-rules.md` does not permit it. If that type is not correct for the text, add a warning.
   - If the user gives no file type, use this list to select the type:
     - For text that is applicable in each session, write entry-file text in the file that `references/loading-rules.md` gives. If the project keeps Rules, write a Rule.
     - For text that is applicable only to some tasks, write a Skill.
     - For text that `references/loading-rules.md` tells you to move from a Skill or from entry-file text, write a reference file. Also write its pointer.
7. In the edit job, change only the changed part. In the unchanged parts, do not write lines again. Do not move lines in the unchanged parts. In the unchanged parts, do not put two lines into one line or one line into two lines. When a finding tells you to make a change, also obey the rules of this step. The user approves only the change that they asked for. In the edit job, you can move a complete section of an unchanged part to obey the file-size limit. Move it as "When the edit job changes a SKILL.md or an entry file" in `references/loading-rules.md` tells you. When the user approves an extraction candidate, move it. If you find a file type that is not correct for the text, add a warning.
8. In the edit job, the user can tell you that an agent did not obey an instruction. For that edit job, record the condition of the previous instruction in quotation marks. The condition can be in the heading of the section of that instruction or in the sentence of that instruction. Give this condition in the Summary part of the end-of-run report. If the previous instruction has no condition, record "no condition".
9. Before you write text, read `references/ste-rules.md`, `references/plain-language-checks.md`, and `references/technical-terms.md`. If the file that you write or edit is in a Skill folder, also read `references/agent-skills-spec.md`.
10. In the edit job, first use the rules from step 9 to examine each section that you will change. A new section has no previous text to examine. For that section, give no problem in the Summary part. Before you correct a problem, record it for the Summary part.
11. In the write job, plan the file layout as "When the write job makes a SKILL.md or entry-file text" in `references/loading-rules.md` tells you.
12. Write the text as the rules from step 9 tell you.
13. In the write job, move text to reference files as "When the write job makes a SKILL.md or entry-file text" in `references/loading-rules.md` tells you. In the edit job, move text as "When the edit job changes a SKILL.md or an entry file" in `references/loading-rules.md` tells you.
14. Before the self-check, read `references/review.md`. Then do the self-check that it gives.
15. After the self-check, do the reader test that `references/review.md` gives.
16. Write the end-of-run report.

## Before you write the end-of-run report

Before you write the end-of-run report, read `references/end-of-run-report.md`. Then write the report as that file tells you.
