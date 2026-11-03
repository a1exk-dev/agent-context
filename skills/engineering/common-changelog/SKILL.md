---
name: common-changelog
description: "Before you create or change `CHANGELOG.md`, use this skill. When a prompt says \"changelog\", \"changelog entry\", \"review the changelog\", \"check the changelog\", or \"release notes\", use this skill. This skill writes `CHANGELOG.md` in the Common Changelog format and obeys `docs/agents/changelog-policy.md`. It creates the file, adds items and release entries, and reviews the file. It does not stage or commit. Do not use it to make a GitHub release, to select a version number, or to write a commit message."
---

# Common changelog

This skill makes each change to the changelog obey Common Changelog (https://common-changelog.org/) and the Changelog policy of the project.

## Terms in this skill

- The **Operator** is the person who controls a project and the agents that operate in it. Only the Operator answers the questions of an agent and gives approval. An agent never acts as the Operator.
- The **changelog** is the file `CHANGELOG.md` of the project.
- The **caller** is the Operator or the agent that starts this skill.
- A **Policy** is a file `docs/agents/<name>-policy.md` of a project. It holds only the Settings that one skill obeys.
- The **Changelog policy** is the Policy of this skill: `docs/agents/changelog-policy.md`.
- A **Setting** is one line `- <name>: <value>` of a Policy. The skill that reads the Policy gives each name and the form of its value.
- A **Commit review** is what an agent shows the Operator before one commit: the staged files, the full diff, and the exact message. The commit occurs only after the Operator approves that review.
- This skill has 3 jobs. The **Create** job makes the changelog. The **Write** job makes each change to the changelog. The **Review** job examines the changelog and changes no file.
- The **Unreleased section** is the section `## Unreleased` directly after the title `# Changelog`. It collects the items that no release contains yet.
- A **release entry** is a section `## [X.Y.Z] - YYYY-MM-DD` and its groups. A **group** is a section `### Changed`, `### Added`, `### Removed`, or `### Fixed`. An **item** is one list line in a group.
- A **reference** is a link after an item to a commit, a pull request, or an issue.
- The **Release branches** Setting gives branch prefixes. "A branch that the Release branches Setting lists" is a branch `<prefix>/<rest>` with `<prefix>` in that Setting.
- A **finding** is one problem that the Review job finds.

## Deviations from Common Changelog

This skill obeys Common Changelog with 2 deviations. Each deviation is on or off in the Changelog policy.

- The Unreleased section breaks §2.1, §2.2, and §6.2. It is on when `Unreleased` is `on`.
- An item with no references breaks §2.4.2. Items have no references only when `Host` is `none`.

## Before each job

1. Before the Create, Write, or Review job, run `cat -n docs/agents/changelog-policy.md` to read the Changelog policy and its line numbers.
2. Examine each line. A correct line is the title `# Changelog policy`, a blank line, or a Setting with a name and a value from the table. Each other line is an incorrect line. When 2 or more Settings have the same name, each Setting after the first Setting is an incorrect line.
3. If the Changelog policy is not there, has an incorrect line, or has no line for a Setting, stop. Do not change a file. In the report, give the cause and the line number of each incorrect line.
4. Use the value of each Setting in each job.

| Setting | Values | Default value |
|---|---|---|
| References | `commits`, `commits, pull requests`, `commits, issues`, or `commits, pull requests, issues` | `commits, pull requests` |
| Notice | `required` or `major` | `required` |
| Authors | `on` or `off` | `on` |
| Version links | `release`, `compare`, or `off` | `release` |
| Host | `auto`, `github`, `gitlab`, `bitbucket`, or `none` | `auto` |
| Unreleased | `on` or `off` | `on` |
| Release branches | `off`, or a list of branch prefixes. A comma is between each 2 prefixes. | `release, hotfix` |
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

## Rules for all jobs

- Before the Write job or the Review job, read `references/common-changelog-rules.md`. That file gives each rule of Common Changelog that this skill obeys, with its § number.
- Before the Write job, read `references/release-entries.md`. That file tells you how to find the version, make a release entry, write a notice, and mark a yanked release.
- Before you write a reference or a version link, read `references/links.md`. Take each URL form from that file, not from the links in the changelog.
- Do not stage, commit, or push. The Operator approves the change in the Commit review of the commit that follows.
- Do not ask for approval before a Write job. The Commit review gives the Operator the change.

## When you do the Create job

Do the Create job when the caller asks for a changelog, or when a Write job finds no changelog.

1. If the changelog is there, do not change it. In the report, tell that the changelog is there.
2. If the changelog is not there, write the file with only the line `# Changelog`. Do not add entries for old tags, because only a Write job adds entries.

## When you do the Write job

Do the Write job for each change to the changelog, for example a new item or a release entry.

When the caller tells you that a release is yanked, do steps 1, 8, 9, 10, and 11. In place of steps 2 to 7, do "When you mark a release as yanked" in `references/release-entries.md`.

1. If the changelog is not there, do the Create job first.
2. Use the change text that the caller gives. Write it as one item in the imperative mood, for example "Fix `slugify()` keeping leading spaces". Keep the meaning of the change text.
3. Find the group of the item from the change text: `Changed`, `Added`, `Removed`, or `Fixed`. A breaking change goes in `Changed` with the prefix `**Breaking:** `.
4. Find the version as "When you find the version" in `references/release-entries.md` tells you. If that section tells you to put the item in the Unreleased section, do these steps:
   - If the file has no Unreleased section, add `## Unreleased` directly after `# Changelog`.
   - If the Unreleased section has no group for the item, add the group in the sequence `Changed`, `Added`, `Removed`, `Fixed`.
   - Put the item at the end of its group.
5. If that section tells you to make a release entry, do "When you make a release entry" and "When you write a notice" in `references/release-entries.md`.
6. Write the references of the item as the `References` Setting tells you:
   - Under the Unreleased section, write no commit reference, because the merge commit is not there yet.
   - In a release entry, always write the commit reference.
   - Write a pull-request or issue reference only when the `References` Setting has that kind and the change has one.
7. When `Authors` is `on`, write the author after the references, in parentheses, for example `(Bob)`. Find the author in the Git history, for example the author of the commits of the pull request. If you cannot find the author, write no author and tell it in the report.
8. Change only the lines of this Write job. Keep each other line as it is.
9. After the change, do the Review job on the full file.
10. Correct each finding in a line that this Write job wrote. Then do the Review job again on these lines.
11. Do not correct a finding in a different line. List that finding in the report.

## When you do the Review job

1. Examine each line of the changelog for each rule in `references/common-changelog-rules.md` and for each Setting.
2. Do not change a file in the Review job.
3. For each finding, record the line numbers, the rule and its § number, the severity, and a fix. A "must" rule gives the severity `error`. A "should" rule gives the severity `warning`.
4. When 2 or more findings have the same rule and the same fix, make one finding with all their line numbers.
5. Do not read the branch name in the Review job.

## When you write the report

Write these parts in this sequence:

1. Each file that you changed, for example `CHANGELOG.md`. If you changed no file, tell why.
2. Each item that you wrote, as a quotation.
3. The findings of the last Review job, as a table with the columns `Lines`, `Rule`, `Severity`, and `Fix`. If the Review job found no problem, tell that the Review job found no finding.
4. When a finding is in a line that this run did not write, tell that the caller can correct these lines with the words "convert the changelog".
