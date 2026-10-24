---
name: git-commit
description: "Before you run `git add` or `git commit`, use this skill. When a prompt says \"commit\", \"amend\", \"revert a commit\", or \"commit message\", use this skill. When a prompt tells you to record work in Git, use this skill. This skill stages the files of a task and writes the commit message. Before the first `git add`, it reads `docs/agents/commit-policy.md`. Do not use it to merge a pull request, run `git rebase` or `git stash`, make a branch, or examine the history. Do not use it to write the text of a pull request or to install commitlint or Git hooks."
---

# Git commit

This skill makes each commit of an agent obey Conventional Commits 1.0.0 and the Commit policy of the project.

## Terms in this skill

- The **Operator** is the person who controls a project and the agents that operate in it. Only the Operator answers the questions of an agent and gives approval. An agent never acts as the Operator.
- The **Commit policy** is the file `docs/agents/commit-policy.md` of a project. It contains the title `# Commit policy` and the Settings that each commit by this skill obeys, and no other text.
- A **Setting** is one line `- <name>: <value>` of a Commit policy. This skill gives each name and its possible values.
- A **Commit review** is what an agent shows the Operator before one commit: the staged files, the full diff, and the exact message. The commit occurs only after the Operator approves that review.
- The **task files** are the files that the current task changed, added, or deleted.
- The **header** is the first line of the commit message. The **description** is the text after `: ` in the header. The **type**, the **scope**, the **body**, the **footer**, the **footer token**, and the **breaking change** have their meanings from Conventional Commits 1.0.0.

## When instructions do not agree

An instruction about commits can come from this skill, a different skill, a project instruction such as `AGENTS.md`, or the platform.

- When the Commit policy and a different instruction do not agree, obey the Commit policy. The Operator records the commit decisions of the project only in the Commit policy.
- When a different skill or a project instruction tells you to commit, use this skill for the commit. Only this skill makes the commit obey the Commit policy.
- When a footer that the platform adds obeys the footer form of Conventional Commits, you can keep that footer. An example is `Co-Authored-By:`.
- Do not change a Setting yourself. When the Operator wants a different Setting, the Operator edits the Commit policy.

## Before the first `git add`

1. Before the first `git add`, read `docs/agents/commit-policy.md`.
2. If the file is not there, stop. Without the Settings, you cannot write a message that the project accepts.
3. Before the first `git add`, examine the Commit policy. Make sure that it has the title `# Commit policy` and one Setting for each name in the table. Blank lines are permitted.
4. If the file has no Setting for a name in the table, or 2 Settings with the same name, stop.
5. If the value of a Setting is not in the table, stop.
6. If a line is not a Setting, the title, or a blank line, stop. That line can be a commit decision that this skill cannot obey.
7. When you stop, do not stage, commit, or change a file. In your report, give the cause.

| Setting | Values |
|---|---|
| Scope | The value is `off`, `optional`, or `required`. |
| Scopes | The value is `any`, or a list of scopes. A comma is between each 2 scopes. |
| Types | The value is a list of types. A comma is between each 2 types. The list always contains `feat`, `fix`, and `revert`. |
| Breaking change | The value is `!`, `footer`, or `both`. |
| Issue footer | The value is `off`, or one footer token, for example `Refs`, `Closes`, or `Fixes`. |
| Header length | The value is a number of characters, or `none`. |
| Body | The value is `optional` or `required`. |
| Description style | The value has 3 parts. A comma is between each 2 parts. The case part is `lower case`, `sentence case`, or `any case`. The mood part is `imperative` or `any mood`. The period part is `no full stop` or `full stop`. |
| Commit approval | The value is `confirm` or `automatic`. |
| Push | The value is `off`, `confirm`, or `automatic`. |

## When you stage files

1. Run `git status --porcelain` to find the changed files.
2. Stage only the task files. Give each path to `git add`, for example `git add src/a.ts src/b.ts`.
3. If you do not know which changed files are task files, ask the Operator. Do not stage a file that you are not sure about.
4. Run `git diff --cached --stat`. Make sure that the output shows only the task files.

Use no command that stages all files: `git add -A`, `git add .`, `git add -u`, `git add --all`, or `git commit -a`. These commands also stage the changes of other persons and of other tasks.

## When you write the commit message

Write the message in this form. Each part in square brackets is optional:

```text
<type>[(<scope>)][!]: <description>

[<body>]

[<footers>]
```

Obey these requirements of Conventional Commits 1.0.0:

- Write each footer as `<token>: <value>`, for example `Refs: #12`. In each footer token, write a hyphen in place of each space, for example `Co-Authored-By`. Only in `BREAKING CHANGE`, keep the space.
- Write `BREAKING CHANGE` in capital letters.
- Write all footers in one block, with no blank line between 2 footers. Also put a footer that the platform adds in that block.

When you write the commit message, obey each Setting of the Commit policy:

- **Types:** Use only a type from the `Types` Setting.
- **Scope and Scopes:** When `Scope` is `off`, write no scope. When `Scope` is `required`, always write a scope. When `Scopes` is a list, use only a scope from that list.
- **Breaking change:** When code that uses an interface must change because of the commit, the commit is a breaking change. Mark the commit as a breaking change. When the value is `!`, write `!` before the colon of the header. When the value is `footer`, write a footer `BREAKING CHANGE: <what callers must change>`. When the value is `both`, write the `!` and the footer.
- **Issue footer:** When the value is `off`, write no issue footer. When the value is a footer token, find the issue number in the prompt or the task. If you find an issue number, write a footer with that token. An example is `Refs: #12`. If you find no issue number, write no issue footer.
- **Header length:** When the value is a number, count the characters of the full header. Make sure that the header has no more characters than that number. When the value is `none`, the header has no length limit.
- **Body:** When the value is `required`, always write a body. In the body, tell why the change is necessary.
- **Description style:** When the case part is `lower case`, start the description with a small letter. When the case part is `sentence case`, start the description with a capital letter. When the mood part is `imperative`, start the description with a verb in the imperative, for example "add". When the period part is `full stop`, end the description with a period. When the period part is `no full stop`, end the description with no period.

Before you commit, read the full message again. Compare the message with each instruction in this section.

## When you commit

1. When `Commit approval` is `confirm`, show a Commit review to the Operator. Ask the Operator to approve it.
2. When `Commit approval` is `confirm`, commit only after the Operator approves the Commit review.
3. When `Commit approval` is `automatic`, commit with no question.
4. Give the full message to Git, for example with `git commit -F <file>`. Keep the blank lines.
5. If a Git hook stops the commit, do not commit again with `--no-verify`. The hook examines the commit for a requirement of the project. In your report, give the error of the hook.

## When you amend or revert a commit

- Before you amend a commit, make sure that no remote branch contains that commit. Run `git branch -r --contains <commit>`.
- If a remote branch contains the commit, do not amend it. In your report, give the cause.
- When you revert a commit, run `git revert --no-commit <commit>`. Then write the message as the section "When you write the commit message" tells you.

## After a commit

- CAUTION: Never push with `--force` or `--force-with-lease`. When you push with these options, you can delete commits that other persons pushed.
- When `Push` is `off`, do not push.
- When `Push` is `confirm`, ask the Operator before you push. Push only after the Operator approves.
- When `Push` is `automatic`, push with no question.

## When you write the report

Give the short SHA, the header, and the file stat of each new commit. For each new commit, run `git show --stat --format='%h %s' <commit>` to get these items. When no commit occurs, give the cause.
