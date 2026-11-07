# Finish a branch

Read this file before Finish. `SKILL.md` of this skill has the Setting table. When your context window does not have `SKILL.md`, read it first.

Do the sections of this file in this sequence:

1. "When you find the branch to finish"
2. "When you find the targets"
3. "When you find the version"
4. "When you make the plan"
5. "When you ask for approval"
6. "When Finish mode is local"
7. "When you report Finish"

## When you find the branch to finish

1. If the request gives the name of the branch, use that branch.
2. If not, and HEAD is on a `feature/*`, `bugfix/*`, `release/*`, or `hotfix/*` branch, use the branch of HEAD. Do this step only when the request gives no branch type, or the branch type of HEAD.
3. If not, find the branches of the type in the request, local and on `origin`. For example, "Finish the hotfix" gives the type `hotfix`. If only one branch has this type, use that branch. For the type `release`, use the open `release/*` branch, as "When you start a release branch" in `SKILL.md` tells you.
4. If you find no branch, or more than one branch, stop. In the report, give the branches that you found. Tell the caller to give the branch name in a new request.
5. The branch must be a local branch or an `origin` branch. If the branch is only on `origin`, use `origin/<branch>` in place of the local branch in each command.
6. Examine the branch name with the `branch` form of the check script. When the script gives `invalid:`, stop and give its cause in the report.

## When you find the targets

A target is a branch that Finish merges into. Find the targets in this table:

| Branch type | First target | Tag targets |
|---|---|---|
| `feature` | The Development branch | None |
| `bugfix` | The Development branch | None |
| `release` | The Production branch | The Development branch |
| `hotfix` | The Production branch | The Development branch, and the open `release/*` branch |

- A tag target gets the Production branch at the new tag. The merge of the tag into the Development branch is the Back-merge.
- When `Development branch` is `none`, the first target of each branch type is the Production branch. Then Finish does no Back-merge.
- A `release/*` branch is open when no tag `<Tag prefix>X.Y.Z` of its version exists. A hotfix goes into the open `release/*` branch too, so that the next release keeps the correction. If no `release/*` branch is open, the hotfix has no such target.
- The merge kind into the Development branch is the value of `Development merge`. The merge kind into the Production branch is the value of `Production merge`.
- A merge into a tag target is always a merge commit, for each value of `Development merge`. A merge commit keeps the tag commit in the history of the target. Then the next Back-merge has no conflict from the same changes.

## When you find the version

Do these steps only for a `release/*` branch and a `hotfix/*` branch. A `feature/*` branch and a `bugfix/*` branch get no version and no tag.

- For a `release/X.Y.Z` branch, the version is `X.Y.Z`. Examine the version with the `release` form of the check script and the value of `Tag prefix`. When the script gives `invalid:`, stop and give its cause in the report.
- For a `hotfix/*` branch, the version is the next patch of the last release. Read `references/pick.md` in the folder of this skill. Then do the steps in its sections "When you find the last release" and "When the version is for a hotfix".
- The tag is `<Tag prefix><version>`. When `Tag prefix` is `none`, the tag is the version.

## When you make the plan

The plan gives each change that Finish will make, before Finish makes a change. Give these items:

- The branch to finish, and its version and tag, if it has a version.
- The value of `Finish mode`.
- Each target, in sequence, with the merge kind.
- Each branch and tag that Finish will push.
- The branch that Finish will delete, local and on `origin`.

## When you ask for approval

Only Finish asks for approval, because Finish changes the long-lived branches of the project and `origin`.

1. If `Finish approval` is `automatic`, do not ask. Give the plan in the report.
2. If the request already approves this Finish, do not ask. An example is "Finish the release, approved".
3. If not, show the plan to the Operator. Then ask one question with the answers `Finish`, `Request changes`, and `Reject`. Give `Finish` first, as the recommended answer.
4. When the Operator answers `Finish`, continue with the next section of the sequence.
5. When the Operator answers `Request changes`, get the changes from the Operator. Make a new plan with the changes, and do the step 3 again. Change the plan only inside the rules of this skill and the Semver policy. When a change needs a different Setting, tell the Operator to change the Semver policy.
6. When the Operator answers `Reject`, stop. Do not change the repository. In the report, tell that the Operator rejected the plan.
7. When you cannot use a question tool, stop. The platform can have no question tool, or the question tool can give an error. Do not change the repository. In the report, give the plan. Tell the caller to approve it in a new request, for example "Finish the release, approved".

## When you write a merge message

Finish writes the message of each merge commit and of each squash commit. The project can have rules for these messages.

1. Find the rules of the project for commit messages. Look in the instructions that you have, and in `AGENTS.md` and `CLAUDE.md` in the root folder of the project.
2. If you find rules, write each message by these rules. Give the message with `-m`.
3. If you find no rule, use the default message of Git: give `--no-edit`. This skill has no rules for commit messages.

## When Finish mode is local

In `local` mode, Finish does each merge, the tag, and the push with Git. If the project has no `origin` remote, do the steps without the fetch, the push, and the delete on `origin`.

1. Do the steps in "Before you merge in local mode".
2. Do the steps in "When you merge into the first target".
3. For a `release/*` branch and a `hotfix/*` branch, do the steps in "When you make the tag".
4. Do the steps in "When you push the first target".
5. For each tag target, in the sequence of the table in "When you find the targets", do the steps in "When you merge the tag in local mode".
6. Do the steps in "When you delete the finished branch".
7. Run `git switch <development>`. When `Development branch` is `none`, run `git switch <production>`.

## Before you merge in local mode

1. Run `git status --porcelain`. If a line gives a file other than the Semver policy, stop. In the report, give these files. Finish switches branches, so these changes can go to the wrong branch.
2. Run `git fetch --tags origin`.
3. Do this step for each target that is a local branch and an `origin` branch. These 2 commands count the commits that only one of the 2 branches has:

   ```sh
   git rev-list --count origin/<target>..<target>
   git rev-list --count <target>..origin/<target>
   ```

4. If the local target has commits that `origin` does not have, stop. In the report, give the target and the number of commits. Finish pushes the target, so these commits go to `origin` too.
5. When the branch to finish is local and on `origin`, do the same 2 commands for this branch. If `origin/<branch>` has commits that the local branch does not have, stop. In the report, give the branch and the number of commits. Then the merge does not contain these commits.
6. Run `git rev-parse <branch>` and record the commit. The section "When you delete the finished branch" uses this commit.
7. Run `git rev-list --count <first target>..<branch>`. If the result is 0, stop. In the report, tell that the first target contains the branch already.

## When you merge into the first target

1. Run `git switch <first target>`. If the local target is not there, this command makes it from `origin/<first target>`.
2. If the local target has fewer commits than `origin/<first target>`, run `git merge --ff-only origin/<first target>`.
3. Find the merge kind, as "When you find the targets" tells you. Find the message, as "When you write a merge message" tells you.
4. For `merge commit`, run `git merge --no-ff <branch>` with `--no-edit` or `-m '<message>'`.
5. For `squash`, run `git merge --squash <branch>`. Then run `git commit` with `--no-edit` or `-m '<message>'`.
6. If the merge has a conflict, run `git reset --merge`. Then stop. In the report, give each file with a conflict. Tell the caller to merge the first target into the branch, correct the conflicts, and finish again.

## When you make the tag

1. Run `git tag <tag>` on the Production branch, after the merge. The tag is on the merge commit or the squash commit.
2. Do not move or delete a tag. A released version does not change.

## When you push the first target

1. If `origin` has no branch with the name of the first target, do not push. In the report, tell that the first target is local only.
2. If not, run `git push --atomic origin <first target>`. For a `release/*` branch and a `hotfix/*` branch, also give the tag in the same command: `git push --atomic origin <first target> <tag>`. The atomic push changes all of the refs, or none of them.

## When you merge the tag in local mode

1. Run `git switch <tag target>`. If the local target is not there, this command makes it from `origin/<tag target>`.
2. If the local target has fewer commits than `origin/<tag target>`, run `git merge --ff-only origin/<tag target>`.
3. Find the message, as "When you write a merge message" tells you.
4. Run `git merge --no-ff <tag>` with `--no-edit` or `-m '<message>'`. The merge comes from the Production branch at the tag, so the target gets the released version.
5. If the merge has a conflict, do the steps in "When a merge of the tag has a conflict".
6. If `origin` has a branch with the name of the tag target, run `git push origin <tag target>`.

## When a merge of the tag has a conflict

This version of the skill does not correct a conflict in the Back-merge or in a different merge of the tag.

1. Run `git merge --abort`.
2. Stop. Do not delete the finished branch.
3. In the report, give each file with a conflict, and the tag target. Tell that the merge into the Production branch and the tag are done. Tell the Operator to merge the tag into the tag target.

## When you delete the finished branch

Delete the finished branch only when its work is in the targets. A deleted branch can have commits that no other branch contains.

1. Make sure that all steps before this section are done. For a `release/*` branch and a `hotfix/*` branch, the tag and the merge into each tag target must exist.
2. Run `git rev-parse <branch>`. If the result is not the commit that you recorded before the merge, do not delete the branch. In the report, give the branch and the cause.
3. Run `git fetch origin`. If `origin/<branch>` is there and is not the recorded commit or one of its ancestors, do not delete the branch. In the report, give the branch and the cause.
4. CAUTION: Delete the branch only after steps 2 and 3. A branch with new commits loses these commits.
5. Run `git branch -D <branch>`. After a squash merge, `git branch -d` refuses to delete the branch, because the target does not contain its commits.
6. If `origin/<branch>` is there, run `git push origin --delete <branch>`.

## When you report Finish

Give these items:

- The branch that Finish merged, and its version and tag, if it has a version.
- Each merge: the target, the merge kind, and the short SHA of the new commit.
- Each branch and tag that Finish pushed, and each branch that stays local only.
- Each deleted branch, local and on `origin`. Give each branch that Finish did not delete, with the cause.
- The branch of HEAD at the end.

When Finish stops, give the cause, the steps that Finish did before it stopped, and what Finish needs to continue.
