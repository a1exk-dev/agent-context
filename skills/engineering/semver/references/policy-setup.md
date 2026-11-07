# New Semver policy, incorrect lines, and new Settings

The Setting table and the default Semver policy are in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

## When you find the offered value of a Setting

The offered value is the value that you give as the recommended answer. Find it in this sequence:

1. For `Production branch`, offer `main` when the repository has a local branch or an `origin` branch `main`. If `main` is not there, run `git symbolic-ref --short refs/remotes/origin/HEAD`. Offer that branch name without the remote name at its start. If `origin/HEAD` is also not there, offer the branch that HEAD is on.
2. For `Development branch`, offer `develop` when the repository has a local branch or an `origin` branch `develop`. If `develop` is not there, offer `none`.
3. For each other Setting, offer its default from the table in `SKILL.md`.

## When a Setting is not used

Some values make other Settings unused. For an unused Setting, write the default value. Ask no question for it, because its value changes no job:

| Value | Unused Settings |
|---|---|
| `Finish mode: local` | `Tag and back-merge`, `Development auto-merge`, `Production auto-merge` |
| `Development branch: none` | `Development merge`, `Development auto-merge` |

## When the Semver policy is not there

Do the setup before the job, also before Check. Without the Settings, no job knows the branches, the tags, or the merges of the project.

1. Find the answers in the request. The request can tell you to "use the default semver policy". Then use the offered values. The request can also give a value for each Setting.
2. When step 4, 5, or 6 needs a question and you cannot use a question tool, do not write the file. Also do not do the job. The platform can have no question tool, or the question tool can give an error. Only the Operator selects the values of a new Semver policy. In the report, do these steps:
   1. Give the offered Semver policy in a code block.
   2. Give each Setting that has no answer, with its offered value.
   3. Tell the caller to give a value for each of these Settings, or the words "use the default semver policy", in a new request.
   4. Then stop.
3. If the request gives one of these answers, go to step 6. Do not ask a question, because the request gives the answers.
4. Show the offered Semver policy to the Operator in a code block. It has the title `# Semver policy`, a blank line, and one Setting for each row of the Setting table in `SKILL.md`. Each Setting has its offered value. Then ask one question with the answers `Use defaults` and `Choose each setting`. Give `Use defaults` first, as the recommended answer.
5. When the Operator answers `Choose each setting`, ask one question for each Setting, in the sequence of the Setting table in `SKILL.md`. Ask only one question in each tool call, because one answer can make a later Setting unused. Give the offered value first, as the recommended answer. Skip each Setting that an earlier answer makes unused. For some Settings, also do these steps:
   - For `Production branch` and `Development branch`, the Operator can type a branch name. If `git check-ref-format --branch <name>` refuses the name, give the cause. Then ask again. If the name is the same as the name of the other branch, give the cause. Then ask again.
   - For `Production merge`, tell the Operator that `squash` makes the release commits not ancestors of the Production branch. Then Back-merges can have conflicts. Give `merge commit` first, as the recommended answer.
   - For `Tag and back-merge`, tell the Operator that `CI` needs a CI job. After each merge into the Production branch, that job makes the tag and opens the Back-merge pull request. With `Skill`, a later Finish job makes the tag and opens the Back-merge pull request.
   - For `Breaking definition`, show the default definition: "users or other programs must change what they do to keep working". The Operator can type a list of the public parts of the project instead, for example `Skill names, Setting names, Policy formats`. If the answer is not `default` and not such a list, ask again.
6. Make sure that each Setting has a value from the Values column of the Setting table in `SKILL.md`. For an unused Setting with no answer, use its default. For each other Setting with no value, or with a value that is not in that column, ask the question of step 5.
7. If the folder `docs/agents/` is not there, make the folder.
8. Write the Semver policy: the title `# Semver policy`, a blank line, and one Setting for each row of the Setting table in `SKILL.md`. Keep the sequence of that table.
9. Do not stage or commit the file.
10. Do the job with the new Semver policy. In the report, give the new Semver policy.

## When you examine the lines of the Semver policy

A correct line is one of these lines:

- The title `# Semver policy`.
- A blank line.
- One Setting `- <name>: <value>`. The name is in the Setting table in `SKILL.md`, and the value is in its Values cell.

Each other line is an incorrect line. Examples are these lines:

- Prose, or a different heading.
- A Setting with a name that is not in the Setting table in `SKILL.md`, or with a value that is not in its Values cell.
- A second Setting with the same name.
- A `Production branch` or `Development branch` value that `git check-ref-format --branch <name>` refuses. Run this command for each of these 2 values, but not for `none`.
- A `Breaking definition` value that is not `default` and not a list of parts with a comma between each 2 parts. Each part has text.
- A `Production branch` and a `Development branch` with the same name. The 2 lines are incorrect lines.

## When the Semver policy has an incorrect line

When the Semver policy has one or more incorrect lines, stop the job, also Check. Do not change the Semver policy. Do not ask a question. Do not try to correct a line. You cannot know which decision of the Operator an incorrect line gives. Do the same when no person can answer.

In the report, give the line number and the text of each incorrect line. Tell the Operator to correct these lines, or to delete the file so that the setup runs at the next job.

## When a Setting has no line

Do these steps only when the Semver policy has no incorrect line:

1. For each Setting that has no line, in the sequence of the Setting table in `SKILL.md`, find its value:
   - If the other lines make the Setting unused, use its default. Ask no question.
   - If the request gives the value, use that value.
   - If not, ask the Operator one question with the offered value first, as the recommended answer. Ask only one question in each tool call, because one answer can make a later Setting unused.
   - If the platform has no question tool, or the question tool gives an error, use the offered value.
2. Add one line for each of these Settings, in its position in the sequence of the Setting table in `SKILL.md`. Do not change the other lines.
3. Do not stage or commit the file.
4. Do the job. In the report, give each line that you added.

## When a job uses a branch that the Semver policy gives

A `Production branch` or `Development branch` line is not an incorrect line when the repository does not have its branch. Before a job uses the Production branch or the Development branch, make sure that the branch is a local branch or an `origin` branch. If the branch is not there, stop only that job. In the report, give the Setting and the branch name. A job that does not use the branch continues. For example, Check of a version uses no branch.
