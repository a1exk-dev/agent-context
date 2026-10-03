---
name: agent-instructions
description: "When you write, edit, shorten, or fix a file that an agent reads as instructions, use this skill. These files are SKILL.md files and their reference files, AGENTS.md, AGENTS.override.md, CLAUDE.md, CLAUDE.local.md, CONTEXT.md, MEMORY.md, and Rule files. They are also the files in docs/agents/, .claude/rules/, .claude/skills/, .agents/skills/, and .opencode/skills/, and the files that these files point to. When a user asks to \"draft a skill\", \"rewrite AGENTS.md\", \"tidy up CLAUDE.md\", \"add a term to CONTEXT.md\", or \"record in MEMORY.md\", use it. When a user reports that \"the agent keeps ignoring\" an instruction or does not obey a rule, use it. When a user asks to make the agent instructions shorter or clearer, use it. This skill is not for files that people read, Cursor or Copilot files, subagent definitions, or prompt strings in application code."
---

# Agent instructions

This skill helps you write or edit an Agent instruction. It applies three sources to the text: the Agent Skills specification, ASD-STE100, and ISO 24495-1.

## Terms in this skill

- An **Agent instruction** is a file whose reader is an agent. Agent instructions are these files:
  - Skills: `SKILL.md` and its reference files.
  - Entry files: `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, and `AGENTS.override.md`.
  - Rule files, `CONTEXT.md`, `MEMORY.md`, and the files in `docs/agents/`.
  - Other files that these files point to.
- The **author** is you, the agent that uses this skill. The **user** is the person who asked for the work.
- The **write job** makes a new Agent instruction. The **edit job** changes an Agent instruction that the project has.
- A **Rule file** is a short Markdown file whose text a project adds to `AGENTS.md` or `CLAUDE.md`.
- A **finding** is one problem that a reviewer subagent reports.
- A **warning** is one item in the Warnings part of the end-of-run report.
- These names are technical nouns in this skill:
  - **Loading rules** are the rules that a file must obey so that a platform can load or validate it.
  - The **loading reviewer**, the **ASD-STE100 reviewer**, and the **ISO 24495-1 reviewer** are the 3 reviewer subagents.

## Files that are not Agent instructions

When the task is about one of these files, do the task without this skill:

- Files for human readers, for example `README.md`, `CONTRIBUTING.md`, ADRs, user manuals, docstrings, and commit messages.
- Subagent definitions, for example `.claude/agents/*.md`.
- Files for platforms other than Codex, OpenCode, and Claude Code, for example Cursor rules and `.github/copilot-instructions.md`.
- Prompt strings in application code.

## Sources

- The Agent Skills specification: https://agentskills.io/specification. Apply it strictly to every Skill.
- ASD-STE100 Simplified Technical English, Issue 9. Apply it to all prose. The official download is at https://www.asd-ste100.org/STE_downloads.html.
- ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*. Where its principles fit an agent reader, apply them. The catalog page is https://www.iso.org/standard/78907.html.

This skill is "STE-based". It is not "STE compliant" or "certified". It contains no ASD-STE100 rule text and no dictionary entries.

## Precedence of the sources

When two sources disagree, the higher tier wins. The tiers are in this order, highest first:

1. **Loading rules:** These are the MUST items of the Agent Skills specification for a Skill, and the platform loading rules for each Agent instruction. The MUST items include all that `skills-ref validate` checks. A file that breaks one of these rules does not load or does not validate.
2. **ASD-STE100:** This tier holds the STE rules of this skill.
3. **ISO 24495-1 checks:** This tier holds the plain-language checks of this skill.
4. **Recommendations:** This tier holds the recommendations and best practices of the Agent Skills specification. Text that does not obey a recommendation still obeys the specification strictly.

For an Agent instruction that is not a Skill, the Agent Skills specification does not apply. Tier 1 then holds only the loading rules for that file, and tier 4 is empty.

These are the known conflicts and their resolutions:

| Conflict | Resolution |
|---|---|
| The specification gives "Use this skill when ...", but STE puts the condition first. | Write "When ..., use this skill." |
| A "pushy" description against the narrowest real condition | There is no conflict. List every real context. Claim no context that is not real. |
| Words that users type against STE words | Quote the words that users type. Quoted text is exempt from the word rules and counts as 1 word. |
| The "Gotchas" section of the specification against the rule of no catch-all headings | Write no Gotchas section. Put each known problem under the heading of the situation that it affects, next to the step that it breaks. |
| ISO familiar words against STE words | STE wins. |
| The specification "give freedom where many approaches work" against the three modal verbs | Use CAN or an explicit condition. |
| ISO neutral tone against CAUTION | CAUTION is permitted. No other emphasis is permitted. |
| Length | Only the size limits of the loading rules apply. |

If you find a conflict that is not in this table, resolve it by the tier order. Name it in a warning with the tier that won.

## Workflow

Do these steps in the write job and in the edit job.

1. Before you select target platforms, read `references/loading-rules.md`. Then find the target platforms from the project files. If you find no signal, or a signal conflicts with the request, ask the user once.
2. If the project has a `CONTEXT.md` file, read it. Its terms are technical nouns for this task.
3. Find when the file loads: in every session, on demand, or through a pointer.
4. In the write job, if the user names no document type, select the type by its load pattern:
   - For text that applies in every session, write `AGENTS.md` text. If the project keeps Rule files, write a Rule file.
   - For text that applies on demand, write a Skill.
   - For long detail, write a reference file.

   If the type that the user names does not fit, write that type. Then add a warning.
5. In the edit job, change only the part that the user asked for. Outside that part, do not rewrite, merge, renumber, or move lines. This rule also applies when a finding asks for a change. If you find a type mismatch, add a warning.
6. In the edit job, the user can report incorrect agent behavior. Make that report one of the 2 typical reader-test tasks. For that edit, record the old instruction's condition as an exact quote. If it has no condition, record "no condition".
7. Before you write text, read `references/ste-rules.md`, `references/plain-language-checks.md`, and `references/technical-terms.md`. If the target is a Skill, also read `references/agent-skills-spec.md`. In the edit job, first check the text that you will change against these rules. Before you fix each problem, record it. Keep this list for the Summary part. Then write the text by these rules.
8. Before the self-check, read `references/review.md`. Then do the self-check: 3 reviewer subagents, one after the other, in a maximum of 3 rounds.
9. When the self-check ends, do the reader test that `references/review.md` gives.
10. Write the end-of-run report.

### Problems that the reviewers report

- Fix each finding in your own text, or reject it as `references/review.md` tells you.
- Put in a warning each item that you cannot fix alone. An example is a word that needs a new technical noun in the project.
- Put each finding in text outside your edit in a warning. Do not change that text.

## End-of-run report

The job ends with one report. Use this structure. Do not write a part that has no items.

Save the complete report to a file in a temporary folder outside the project. Then read the file. Send its complete text as your final message. The user needs the complete lists to choose which changes to approve.

Before you send the report, compare it with each reviewer report. Include every warning and extraction candidate. For each finding, give its rule, exact text, and problem. For a size warning, give the measured size and its limit.

In the edit job, include each problem that you recorded before the edit in the Summary part. Give the cause and the change that fixed it.

```markdown
## Summary
<What the job wrote or changed, with the file paths.>
<For an edit from incorrect behavior: the old condition as a quote, or "no condition".>

## Warnings
- Word choice was checked from model knowledge, not against the ASD-STE100 dictionary.
- <One item for each warning that applies.>

## Extraction candidates
- <Section> → <proposed file>. Pointer: "<pointer sentence>"

## Base-list words with a project meaning
- <Word>: <the meaning in CONTEXT.md>
```

The Warnings part always has the first item about word choice. Copy that item word for word: "Word choice was checked from model knowledge, not against the ASD-STE100 dictionary." Then add one item for each of these that applies:

- Each open finding after round 3, with its rule.
- Each finding that you rejected, with the rule or the exemption that you cited.
- In the edit job, each finding in text outside the edit.
- Each reader-test failure that you cannot fix.
- Each part that changed after the reader test when no review round was left. Name it as not reviewed.
- The checks were not independent and the readers were not fresh. This item applies when no subagent was available.
- Each conflict that is not in the conflict table, with the tier that won.
- A single-platform feature that you wrote because the user asked for it. Name the platforms that do not read it. Then give the portable alternative.
- A document type that does not fit, or a type mismatch that you found during an edit.
- An entry-file layout that leaves a target platform without the text.
- A file over a size limit, with its extraction suggestion.
- A word that is not in the base list and not in `CONTEXT.md`, with the proposed STE word or `CONTEXT.md` entry. Do not write the word into the project until the user says yes.

The Extraction candidates part lists each section of an entry file or Skill that has a condition that you can name. Give the proposed file and the pointer for each section. The job moves nothing.

Copy the loading reviewer's complete candidate list from the whole-file review into this part. Use the corrected items from later reviews. Add candidates from other reviewers. When one extraction fixes a size problem, keep the other candidates too. Use each section heading as the name of its candidate.

The last part lists each base-list word that the project `CONTEXT.md` gives a different meaning.
