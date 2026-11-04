---
name: common-changelog
description: "Before you create or change `CHANGELOG.md`, use this skill. When a prompt says \"changelog\", \"changelog entry\", \"review the changelog\", \"check the changelog\", or \"release notes\", use this skill. This skill writes `CHANGELOG.md` in the Common Changelog format and obeys `docs/agents/changelog-policy.md`. It creates the file, adds items and release entries, and reviews the file. It does not stage or commit. Do not use it to make a GitHub release, to select a version number, or to write a commit message."
---

# Common changelog

This skill makes each change to the changelog obey Common Changelog (https://common-changelog.org/) and the Changelog policy of the project.

## Terms in this skill

- The **Operator** is the human who controls a project and the agents that operate in it. Only the Operator answers the questions of an agent and gives approval. An agent never acts as the Operator.
- The **changelog** is the file `CHANGELOG.md` of the project.
- The **caller** is the Operator or the agent that starts this skill.
- A **Policy** is a file `docs/agents/<name>-policy.md` of a project. It holds only the Settings that one skill obeys.
- The **Changelog policy** is the Policy of this skill: `docs/agents/changelog-policy.md`.
- A **Setting** is one line `- <name>: <value>` of a Policy. The skill that reads the Policy gives each name and the form of its value.
- A **Commit review** is what an agent shows the Operator before one commit: the staged files, the full diff, and the exact message. But for a diff of more than 500 lines, the Commit review gives the command that shows the diff, not the full diff. The commit occurs only after the Operator approves that review.
- This skill has 3 jobs. The **Create** job makes the changelog. The **Write** job makes each change to the changelog. The **Review** job examines the changelog and changes no file.
- The **Unreleased section** is the section `## Unreleased` directly after the title `# Changelog`. It collects the items that no release contains yet.
- A **release entry** is a section `## [X.Y.Z] - YYYY-MM-DD` and its groups. A **group** is a section `### Changed`, `### Added`, `### Removed`, or `### Fixed`. An **item** is one list line in a group.
- A **reference** is a link after an item to a commit, a pull request, or an issue.
- The **Release branches** Setting gives branch prefixes. "A branch that the Release branches Setting lists" is a branch `<prefix>/<rest>` with `<prefix>` in that Setting.
- A **finding** is one problem that the Review job finds.
- A **conversion** is a Write job that corrects each finding in the full changelog, also in the old lines.

## Deviations from Common Changelog

This skill obeys Common Changelog with 2 deviations. Each deviation is on or off in the Changelog policy.

- The Unreleased section breaks §2.1, §2.2, and §6.2. This deviation is on when `Unreleased` is `on`.
- An item with no references breaks §2.4.2. Items have no references only when `Host` is `none`, or when `references/links.md` finds no URL forms and there is no Operator.

## Before each job

1. Before the Create, Write, or Review job, run `cat -n docs/agents/changelog-policy.md` to read the Changelog policy and its line numbers.
2. If the Changelog policy is not there, read `references/changelog-policy-setup.md`. Then do the steps in its section "When the Changelog policy is not there" before the job.
3. Examine each line. A correct line is the title `# Changelog policy`, a blank line, or a Setting with a name and a value from the table. Each other line is an incorrect line. When 2 or more Settings have the same name, each Setting after the first Setting is an incorrect line.
4. If the Changelog policy has an incorrect line, stop, also for the Review job. You cannot know which decision an incorrect line gives. When you stop in this step:
   - Do not change a file, and do not ask a question.
   - In the report, give the line number and the text of each incorrect line.
   - Tell the Operator to correct the Changelog policy, or to delete it. When the file is not there, this skill sets up a new Changelog policy.
5. If the Changelog policy has no incorrect line and a name in the table has no Setting, read `references/changelog-policy-setup.md`. Then do the steps in its section "When a Setting is not in the Changelog policy".
6. Use the value of each Setting in each job.

| Setting | Values | Default value |
|---|---|---|
| References | `commits`, `commits, pull requests`, `commits, issues`, or `commits, pull requests, issues` | `commits, pull requests` |
| Notice | `required` or `major` | `required` |
| Authors | `on` or `off` | `on` |
| Version links | `release`, `compare`, or `off` | `release` |
| Host | `auto`, `github`, `gitlab`, `bitbucket`, or `none` | `auto` |
| Unreleased | `on` or `off` | `on` |
| Release branches | `off`, or a list of branch prefixes. A comma is between each 2 prefixes. A prefix has only letters, digits, `.`, `_`, and `-`. | `release, hotfix` |
| Draft approval | `off` or `on` | `off` |

The default Changelog policy is this file:

```markdown
# Changelog policy

- References: commits, pull requests
- Notice: required
- Authors: on
- Version links: release
- Host: auto
- Unreleased: on
- Release branches: release, hotfix
- Draft approval: off
```

## In each job

- Before the Write job or the Review job, read `references/common-changelog-rules.md`. That file gives each requirement of Common Changelog that this skill obeys, with its § number.
- Before the Write job, read `references/release-entries.md`. That file tells you how to find the version, make a release entry, write a notice, and mark a yanked release.
- Before the Create job or the Write job, read `references/other-formats.md` when one of these conditions is true:
  - The changelog is not there.
  - The changelog has a line that is not in Common Changelog form.
  - The caller asks for a conversion.
- Before the Write job or the Review job, read `references/links.md`. Take each URL form from that file, not from the links in the changelog.
- Do not stage, commit, or push. The Operator approves the change in the Commit review of the commit that follows.
- Do not ask for approval before a Write job. The Commit review gives the Operator the change. The only exception is a draft when `Draft approval` is `on`.

## When you ask the Operator a question

Each step of this skill that tells you to ask the Operator gives the action, not a tool. Do that action in this way:

1. Do not ask a question when the caller gives the answer before the job, for example "use the default changelog policy".
2. Ask only the questions that the steps of this skill give. Do not ask a different question, for example about the scope of a draft.
3. When the platform has a question tool, ask with that tool. Ask a maximum of 3 questions in one tool call. When one answer can change the next question, ask only one question in each tool call.
4. Give 2 or 3 options for each question. The one exception is the unknown-host question of `references/links.md`, which has 4 options.
5. When the platform has no question tool and there is an Operator (see step 8), ask the same question in plain text, with its options. Do not change a file for the step of that question.
6. In that plain-text message, also give the text that the report gives in that case when there is no Operator. Examples are each Setting with no answer and the words "use the default changelog policy", or the words "convert the changelog". Then the caller can give the answer before the next job.
7. After the plain-text message, end your turn. Do not continue the job before the Operator answers.
8. There is no Operator only in 2 cases: the question tool gives an error, or the caller tells you that no human answers questions.
9. When there is no Operator, do not select an answer in place of the Operator. Do the step for no Operator that the reference file of the question gives for that case. That reference file is `references/changelog-policy-setup.md`, `references/drafts.md`, `references/links.md`, `references/other-formats.md`, or `references/release-entries.md`.
10. When there is no Operator, write in the report the text that the step for no Operator gives. Add no other question to the report.

## When you do the Create job

Do the Create job when the caller asks for a changelog, or when a Write job finds no changelog.

1. If the changelog is there, do not change it. Do the Review job. In the report, tell that the changelog is there. Also give the findings in the report.
2. If the changelog is not there, write the file with only the line `# Changelog`. Do not add release entries for old tags, because only a Write job adds release entries.

## Before the Write job changes the changelog

Find each conflict in the changelog. A conflict is the lines from a line that starts with `<<<<<<<` to the next line that starts with `>>>>>>>`. Git writes these lines when it cannot merge 2 changes.

- If a conflict is outside the Unreleased section, stop. Do not change a file, because only the Operator knows the correct text of a release entry. In the report, tell that the conflict is outside the Unreleased section. Give the line numbers of the conflict. Ask the Operator to resolve the conflict.
- If a conflict is in the Unreleased section, keep the items of the 2 sides. Remove the lines that start with `<<<<<<<`, `=======`, or `>>>>>>>`. Then put each item in its group, with one heading for each group, in the sequence `Changed`, `Added`, `Removed`, `Fixed`.

## When you do the Write job

Do the Write job for each change to the changelog, for example a new item or a release entry.

When the caller tells you that a release is yanked, do steps 1, 8, 9, 10, 11, and 12. In place of steps 2 to 7, do "When you mark a release as yanked" in `references/release-entries.md`.

1. If the changelog is not there, do "When the changelog has a different file name" in `references/other-formats.md`. If you do not stop in that section and the changelog is still not there, do the Create job.
2. If the caller gives no change text, for example "update CHANGELOG.md for this fix", read `references/drafts.md`. Then do the steps of `references/drafts.md`. The draft gives the item and its group, or tells you to stop. Then continue at step 4.
   Else, use the change text that the caller gives. Write it as one item in the imperative mood, for example "Fix `slugify()` keeping leading spaces". Keep the meaning of the change text.
3. Find the group of the item from the change text: `Changed`, `Added`, `Removed`, or `Fixed`. Put a breaking change in `Changed` with the prefix `**Breaking:** `.
4. Find the version as "When you find the version" in `references/release-entries.md` tells you. If that section tells you to put the item in the Unreleased section, do these steps:
   - If the file has no Unreleased section, add `## Unreleased` directly after `# Changelog`.
   - If the Unreleased section has no group for the item, add the group in the sequence `Changed`, `Added`, `Removed`, `Fixed`.
   - Put the item at the end of its group.
5. If that section tells you to make a release entry, do "When you make a release entry" and "When you write a notice" in `references/release-entries.md`.
6. If `references/links.md` tells you to write no references, write no reference. Else, write the references of the item as the `References` Setting tells you:
   - Under the Unreleased section, write no commit reference, because the merge commit is not there yet.
   - In a release entry, always write the commit reference.
   - Write a pull-request or issue reference only when the `References` Setting has that kind and the change has one.
7. When `Authors` is `on`, write the author after the references, in parentheses, for example `(Bob)`. Find the author in the Git history, for example the author of the commits of the pull request. If you cannot find the author, write no author. In the report, tell that the item has no author.
8. Change only the lines of this Write job. Keep each other line as it is.
9. After the change, do the Review job on the full file.
10. Correct each finding in a line that this Write job wrote. Then do the Review job again on these lines.
11. Do not correct a finding in a different line. List that finding in the report.
12. Do "When you offer a conversion" in `references/other-formats.md`.

## When you do the Review job

Do the Review job when the caller asks for a review of the changelog, and after each Write job.

1. Examine each line of the changelog for each requirement in `references/common-changelog-rules.md` and for each Setting. Also do the steps of "When you review links" in `references/links.md`.
2. Do not change a file in the Review job.
3. For each finding, record the line numbers, the requirement and its § number, the severity, and a fix. A "must" requirement gives the severity `error`. A "should" requirement gives the severity `warning`.
4. When 2 or more findings have the same requirement and the same fix, make one finding with all their line numbers.
5. When `Unreleased` is `off` and the changelog has an Unreleased section, make one §6.2 finding for the full section. Make no finding for the commit references of its items, because the fix of the §6.2 finding adds them.
6. Do not read the branch name in the Review job. The requirements for the Unreleased section use only the `Unreleased` Setting.

## When you write the report

Write these parts in this sequence:

1. Each file that you changed, for example `CHANGELOG.md`. If you changed no file, tell why.
2. Each item that you wrote, as a quotation.
3. The findings of the last Review job, as a table with the columns `Lines`, `Requirement`, `Severity`, and `Fix`. If the Review job found no problem, tell that the Review job found no finding.
4. When a finding is in an old line, tell that the caller can say "convert the changelog" to correct these lines. An old line is a line that the Write job of this request did not write.
