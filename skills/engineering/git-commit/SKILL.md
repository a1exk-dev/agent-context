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
- Do not change a Setting yourself. When the Operator wants a different Setting, the Operator edits the Commit policy. Add a Setting only as the section "When a Setting is not in the Commit policy" tells you.

## Before the first `git add`

1. Before the first `git add`, run `cat -n docs/agents/commit-policy.md` to read the Commit policy and its line numbers.
2. If the file is not there, do the steps in the section "When the Commit policy is not there". Without the Settings, you cannot write a message that the project accepts.
3. Before the first `git add`, examine each line of the Commit policy. A correct line is one of these lines:
   - The line is the title `# Commit policy`.
   - The line is blank.
   - The line is a Setting with a name and a value from the table.

   Each other line is an incorrect line. When 2 or more Settings have the same name, each Setting after the first Setting is an incorrect line.
4. If the Commit policy has an incorrect line, stop. You cannot know which commit decision an incorrect line gives. Examples of incorrect lines are a sentence, a different heading, `- Sign-off: yes`, and `- Header length: short`.
5. If the Commit policy has no incorrect line, examine each name in the table. If a name has no Setting, do the steps in the section "When a Setting is not in the Commit policy".

When you stop in this section:

- Do not stage, commit, or change a file.
- Do not ask the Operator a question, because only a change to the Commit policy can correct the problem.
- Do not change an incorrect line into a Setting. Only the Operator knows the commit decisions of the project.
- In your report, give the cause. For each incorrect line, give its line number and its text.
- When you stop because of incorrect lines, tell the Operator to write the file again. Tell the Operator to use only the title and the Settings. Also tell the Operator that the Operator can delete the file. Then, at the next commit, this skill writes a new Commit policy from the answers of the Operator.

| Setting | Values | Default value |
|---|---|---|
| Scope | The value is `off`, `optional`, or `required`. | `optional` |
| Scopes | The value is `any`, or a list of scopes. A comma is between each 2 scopes. | `any` |
| Types | The value is a list of types. A comma is between each 2 types. The list always contains `feat`, `fix`, and `revert`. | `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test` |
| Breaking change | The value is `!`, `footer`, or `both`. | `both` |
| Issue footer | The value is `off`, or one footer token, for example `Refs`, `Closes`, or `Fixes`. | `Refs` |
| Header length | The value is a number of characters, or `none`. | `72` |
| Body | The value is `optional` or `required`. | `optional` |
| Description style | The value has 3 parts. A comma is between each 2 parts. The case part is `lower case`, `sentence case`, or `any case`. The mood part is `imperative` or `any mood`. The period part is `no full stop` or `full stop`. | `lower case, imperative, no full stop` |
| Commit approval | The value is `confirm` or `automatic`. | `confirm` |
| Push | The value is `off`, `confirm`, or `automatic`. | `off` |

## When a Setting is not in the Commit policy

When the Commit policy has no incorrect line and a name in the table has no Setting, do these steps:

1. For each name that has no Setting, ask the Operator one question with the question tool of the platform. Give the default value as the first answer. Tell the Operator that the default value is the recommended answer.
2. If the platform has no question tool, or the question tool gives an error, use the default value. In these conditions, the Operator cannot give an answer.
3. Add one Setting for each of these names to the Commit policy, in the sequence of the table. Use the answer of the Operator or the default value. Then, at the next commit, you do not ask a question about these Settings.
4. Stage only `docs/agents/commit-policy.md`. Commit it alone with the message `chore: update commit policy`, as the sections "When you write the commit message" and "When you commit" tell you. Then the change to the Commit policy is not in a commit of the task. The `Commit approval` Setting of the changed Commit policy is applicable to this commit.

   When you stop after this step and before the commit, do not stage the task files. An example of this stop is a Commit review that has no answer. Only the Commit policy stays staged. When the Operator answers `Commit` later, commit the Commit policy first. Then do step 5.
5. Then stage the task files as the section "When you stage files" tells you. Then commit the task files.

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

When a Setting does not permit the message `chore: add commit policy` or `chore: update commit policy`, change or add only the necessary part. Examples are a scope when `Scope` is `required`, and a body when `Body` is `required`. Another example is `chore: Add commit policy.` when `Description style` is `sentence case, imperative, full stop`. When `Types` does not contain `chore`, use a type from `Types` that agrees with a change to a project file. An example is `docs`.

## When you commit

- When `Commit approval` is `confirm`, do the steps in the section "When you show a Commit review". Commit only when the Operator answers `Commit`.
- When `Commit approval` is `automatic`, commit with no question.
- Give the full message to Git, for example with `git commit -F <file>`. Keep the blank lines.
- If a Git hook stops the commit, do not commit again with `--no-verify`. The hook examines the commit for a requirement of the project. Also do not recommend a commit with `--no-verify` to the Operator. In your report, give the error of the hook. Then stop, because the Operator decides the next step.

## When you show a Commit review

If you are a subagent, do only step 1 and the 4 parts of step 2. Then put the Commit review, the recorded tree ID, and the question of step 3 in your report. Do not commit, because a subagent cannot get the answer of the Operator. Then stop.

When a subagent gives you a Commit review, show the Commit review to the Operator. Use the tree ID in the report of the subagent as the recorded tree ID. Then do steps 3 to 7 yourself.

Do these steps for each commit:

1. Run `git write-tree`. Record the tree ID that this command gives. This ID identifies the staged changes of the Commit review.
2. Show the Commit review to the Operator as text, before the question. Write these 4 parts in this sequence:
   1. The output of `git diff --cached --stat`.
   2. The output of `git diff --cached`. If the output has more than 500 lines, write the command `git diff --cached` in place of the output. Tell the Operator to run this command before the answer. The Operator cannot read more than 500 lines of diff in one message.
   3. The full message in a code block.
   4. The other changed files from `git status --porcelain`, and a sentence that tells that these files are not in the commit.
3. Ask the Operator one question with the answers `Commit`, `Request changes`, and `Reject`. Ask as the section "When you ask the Operator a question" tells you.
4. When the Operator answers `Commit`, run `git write-tree` again. If the tree ID is different, or you changed the message, go back to step 1.
5. Commit one time, with the staged changes and the message of the Commit review.
6. After the commit, run `git rev-parse HEAD^{tree}`. If this tree ID is not the recorded tree ID, a Git hook changed the files of the commit. The Operator did not approve these changes.
7. If the tree IDs are different, undo the commit with `git reset --soft HEAD@{1}`. The changes stay staged. Then go back to step 1. In the new Commit review, tell the Operator that a Git hook changed the files.

When the Operator answers `Request changes`, the Operator tells you what to change. Change the files or the message. Stage the task files again. Then go back to step 1.

When the Operator answers `Reject`, do these steps:

1. Run `git restore --staged <path>` for each task file. The changes stay in the files.
2. In your report, tell that the Operator rejected the commit. Then stop.

Obey these instructions for the approval:

- Only the Operator approves a Commit review. Do not answer the question for the Operator. This instruction is also applicable when a subagent gives you the question.
- An answer `Commit` approves one Commit review only. If the staged changes or the message are different, show a new Commit review.
- Do not use an approval that the Operator gave before the Commit review. An example is "commit when you're done" in the prompt. The Operator did not see the staged changes or the message at that time.

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

## When you ask the Operator a question

- Ask with the question tool of the platform.
- When you cannot use a question tool to add a Setting, do the steps in the section "When a Setting is not in the Commit policy".
- When you cannot use a question tool to make a new Commit policy, do the steps in the section "When the Commit policy is not there".
- When you cannot use a question tool for a different question, show the question and its answers as text. Then stop and wait for the next prompt of the Operator.
- Ask a maximum of 3 questions in one tool call, because some platforms accept no more questions. Give 2 or 3 answers for each question, because some platforms accept a maximum of 3 answers.
- If the Operator gives no answer, you have no approval. Do not commit. Do not push. In your report, give the question that has no answer.

## When the Commit policy is not there

Before the first `git add`, do these steps:

1. Find the answers for the new Commit policy in the prompt. The prompt can tell you to "use the default commit policy". The prompt can also give a value for each name in the table.
2. If the prompt gives one of these answers, go to step 6. Do not ask a question, because the prompt gives the answers.
3. Show the default Commit policy to the Operator in a code block. Write the title `# Commit policy`, a blank line, and one Setting for each name in the sequence of the table. Use the default values. Then the Operator can see the default values before the answer.
4. Ask the Operator one question with the answers `Use defaults` and `Choose each setting`. Give `Use defaults` as the first answer. Tell the Operator that `Use defaults` is the recommended answer.

   When you cannot use a question tool in steps 4 to 6, do not write, stage, or commit a file. Only the Operator selects the values of a new Commit policy. These values give all commit decisions of the project. In your report, give each name in the table that has no answer. Tell the Operator to give a value for each of these names, or to tell you to "use the default commit policy". Then stop.
5. When the Operator answers `Choose each setting`, ask one question for each name in the table, in the sequence of the table. Ask only one question in each tool call, because the answer to one Setting can change the next answer. Give the default value as the first answer. Tell the Operator that the default value is the recommended answer. For a list, a number, or a footer token, the Operator can also give a different value as text.
6. Make sure that each name in the table has a value from the Values column. The answer `Use defaults` and the words "use the default commit policy" give the default values. If a name has no value, ask the question of step 5 for that name. When the value is not in that column, also ask that question.
7. If the folder `docs/agents/` is not there, make the folder.
8. Write the file `docs/agents/commit-policy.md`. Write the title `# Commit policy`, a blank line, and one Setting for each name in the sequence of the table. Use the values of step 6.
9. Stage only `docs/agents/commit-policy.md`. Commit it alone with the message `chore: add commit policy`, as the sections "When you write the commit message" and "When you commit" tell you. Then the new Commit policy is not in a commit of the task. The `Commit approval` Setting of the new Commit policy is applicable to this commit.

   When you stop after this step and before the commit, do not stage the task files. An example of this stop is a Commit review that has no answer. The Commit policy must be in a commit alone. Only the Commit policy stays staged. When the Operator answers `Commit` later, commit the Commit policy first. Then do step 10.
10. After this commit, stage the task files as the section "When you stage files" tells you. Then commit the task files.
