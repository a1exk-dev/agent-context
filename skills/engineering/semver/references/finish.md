# Finish a branch

Read this file before Finish. `SKILL.md` of this skill has the Setting table. When your context window does not have `SKILL.md`, read it first.

## When you start Finish

Do the sections of this file in this sequence:

1. "When you find the branch to finish"
2. "When you find the targets"
3. "Before you finish in pull request mode", only when `Finish mode` is `pull request`
4. "When you find the version"
5. "When you make the plan"
6. "When you ask for approval"
7. "When Finish mode is local" or "When Finish mode is pull request", as the Setting `Finish mode` tells you
8. "When you clean up branches"
9. "When you report Finish"

## When you find the branch to finish

1. If the request gives the name of the branch, use that branch.
2. If not, examine HEAD only when the request gives no branch type or the branch type of HEAD. If HEAD is then on a `feature/*`, `bugfix/*`, `release/*`, or `hotfix/*` branch, use the branch of HEAD.
3. If not, find the branches of the type in the request, local and on `origin`. For example, "Finish the hotfix" gives the type `hotfix`. If only one branch has this type, use that branch. For the type `release`, use the open `release/*` branch, as "When you start a release branch" in `SKILL.md` tells you.
4. If you find no branch, or more than one branch, stop. In the report, give the branches that you found. Tell the caller to give the branch name in a new request.
5. The branch must be a local branch or an `origin` branch. If the branch is only on `origin`, use `origin/<branch>` in place of the local branch in each command.
6. Examine the branch name with the `branch` form of the check script `scripts/check.sh` in the folder of this skill, as "When you run the check script" in `SKILL.md` tells you. When the script gives `invalid:`, stop. In the report, give the cause that the script gives.

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
- A merge into a tag target is always a merge commit, for each value of `Development merge`. A merge commit keeps the commit of the tag in the history of the target. Then the next Back-merge has no conflict from the same changes.

## Before you finish in pull request mode

Finish uses a host tool. A host tool is a tool for the host of the project, for example `gh` for GitHub, or an MCP tool of the platform. This file gives the commands of `gh`. With a different host tool, use its commands that do the same work.

1. Run `git remote get-url origin`. If the project has no `origin` remote, stop. In the report, tell that the project has no remote, and give the Setting `Finish mode`. Tell the Operator to add the remote or to set `Finish mode: local`.
2. Find the host tool that you have. For `gh`, run `command -v gh`. Do not install, set up, or sign in to a host tool, because the Operator controls the host tools of the project.
3. If you have no host tool, stop. In the report, tell that you have no tool for the host of the project, and give the Setting `Finish mode`. Tell the Operator to give you a host tool or to set `Finish mode: local`.
4. Run `git fetch --tags origin`.
5. Find the pull requests of the branch into the first target:

   ```sh
   gh pr list --head <branch> --base <first target> --state all --json number,state,headRefOid,mergeCommit,autoMergeRequest,url
   ```

6. If the host tool gives an error, stop. In the report, give the error.
7. The pull request of the branch is its OPEN or MERGED pull request. A CLOSED pull request does not count. If the list has no OPEN or MERGED pull request, the branch has no pull request.
8. If the branch has no MERGED pull request, and the branch is local and on `origin`, run `git rev-list --count <branch>..origin/<branch>`. If the result is not 0, stop. In the report, give the branch and the number of commits that only `origin` has.

## When you find the version

Do these steps only for a `release/*` branch and a `hotfix/*` branch. A `feature/*` branch and a `bugfix/*` branch get no version and no tag.

- For a `release/X.Y.Z` branch, the version is `X.Y.Z`. If the tag of the version exists already, do not run the check script. An earlier Finish run or CI made that tag. If not, examine the version with the `release` form of `scripts/check.sh` and the value of `Tag prefix`. When the script gives `invalid:`, stop. In the report, give the cause that the script gives.
- For a `hotfix/*` branch with a MERGED pull request, run `git tag --points-at <commit of the tag>`. The commit of the tag is the `mergeCommit` of the pull request. If a tag `<Tag prefix>X.Y.Z` is on the commit of the tag, the version is `X.Y.Z`.
- For a `hotfix/*` branch with no such tag, the version is the next patch of the last release. Read `references/pick.md` in the folder of this skill. Then do the steps in its sections "When you find the last release" and "When the version is for a hotfix".
- The tag is `<Tag prefix><version>`. When `Tag prefix` is `none`, the tag is the version.

## When you make the plan

The plan gives each change that Finish will make, before Finish makes a change. Give these items:

- The branch to finish, and its version and tag, if it has a version.
- The value of `Finish mode`.
- Each target, in sequence, with the merge kind.
- In `pull request` mode, each pull request that Finish will open, with its base, its head, and its auto-merge. Also give the tag and each merge into a tag target, and who makes them: CI, this Finish run, or a later Finish run.
- Each branch and tag that Finish will push.
- Each branch that Finish will delete, local and on `origin`: the finished branch, and each other branch that passes the test in "When a branch is safe to delete".

## When you ask for approval

1. If `Finish approval` is `automatic`, do not ask. Give the plan in the report.
2. If the request already approves this Finish, do not ask. An example is "Finish the release, approved".
3. If not, and you cannot use a question tool, stop. The platform can have no question tool, or the question tool can give an error. Do not change the repository. In the report, give the plan. Tell the caller that the Operator must approve it in a new request, for example "Finish the release, approved".
4. If not, show the plan to the Operator. Then ask one question with the answers `Finish`, `Request changes`, and `Reject`. Give `Finish` first, as the recommended answer.
5. When the Operator answers `Finish`, continue with the next section of the sequence.
6. When the Operator answers `Request changes`, get the changes from the Operator. Make a new plan with the changes. Then do step 4 again. Change the plan only inside the limits of this skill and the Semver policy. When a change needs a different Setting, tell the Operator to change the Semver policy.
7. When the Operator answers `Reject`, stop. Do not change the repository. In the report, tell that the Operator rejected the plan.

## When you write a merge message

Finish writes the message of each merge commit and of each squash commit. In `pull request` mode, Finish also writes the title and the body of each pull request. The project can have requirements for these texts.

1. Find the requirements of the project for commit messages and for pull requests. Look in the instructions that you have, and in `AGENTS.md` and `CLAUDE.md` in the root folder of the project.
2. If you find requirements, write each message as these requirements tell you. Give the message with `-m`.
3. If you find no requirement, use the default message of Git: give `--no-edit`. This skill has no requirements for commit messages.
4. In `pull request` mode, give the title and the body of a pull request to `gh pr create` with `--title` and `--body`. If you find no requirement, give `--fill`, so that the host writes its default text.
5. In `pull request` mode, when the project has requirements for merge messages, give the message to `gh pr merge` with `--subject` and `--body`. If not, give no message, so that the host writes its default message.

## When Finish mode is local

Finish does each merge, the tag, and the push with Git. If the project has no `origin` remote, do the steps without the fetch, the push, and the delete on `origin`.

1. Do the steps in "Before you merge in local mode".
2. Do the steps in "When you merge into the first target".
3. For a `release/*` branch and a `hotfix/*` branch, do the steps in "When you make the tag".
4. Do the steps in "When you push the first target".
5. For each tag target, in the sequence of the table in "When you find the targets", do the steps in "When you merge the tag in local mode".
6. Do the steps in "When you delete the finished branch".

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
6. Run `git rev-parse <branch>`. Record the commit that it gives. The section "When you delete the finished branch" uses this commit.
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

1. Run `git diff --name-only --diff-filter=U`. Record each file with a conflict.
2. Run `git merge --abort`.
3. If the tag target is the Development branch, do the steps in "When the Back-merge has a conflict".
4. If not, stop. Do not delete the finished branch. In the report, give each file with a conflict, and the tag target. Tell that the merge into the Production branch and the tag are done. Tell the Operator to merge the tag into the tag target.

## When the Back-merge has a conflict

The Setting `Back-merge conflicts` tells how Finish handles a Back-merge with a conflict. The replaced pull request is the OPEN pull request from the Production branch into the Development branch that has the conflict. Local mode has no replaced pull request.

1. For `report`, stop. Do not make a branch. In the report, give each file with a conflict, the tag, and the replaced pull request with its number and URL. Tell the Operator to correct the conflict, or to set `Back-merge conflicts` to `confirm` or `automatic`.
2. For `confirm` and `automatic`, the resolution branch is `bugfix/back-merge-v<version>`, for example `bugfix/back-merge-v1.2.1`. The name has the letter `v` also when `Tag prefix` is `none`, so that each Finish run finds the branch by one fixed name.
3. If the resolution branch exists, local or on `origin`, an earlier Finish run made it. Run `git switch <resolution branch>`. If the `ancestor` form of `scripts/check.sh` gives `valid:` for `<tag> HEAD`, go to step 9. If not, stop. In the report, give the resolution branch, and tell that it does not contain the tag.
4. Run `git switch -c <resolution branch> <base>`. In local mode, the base is the local Development branch. In `pull request` mode, the base is `origin/<development>`.
5. Find the message, as "When you write a merge message" tells you. Run `git merge --no-ff <tag>` with `--no-edit` or `-m '<message>'`. The merge gets the same conflict.
6. Correct each file with a conflict. Read the two sides of each conflict. Then edit the file so that it keeps the changes of the two sides. Do not use `-X ours`, `-X theirs`, `git checkout --ours`, or `git checkout --theirs`, because they remove the changes of one side.
7. If you cannot tell how to keep the changes of the two sides, run `git merge --abort`. Then run `git switch <development>`. Then run `git branch -d <resolution branch>`. Then stop as step 1 tells you.
8. Run `git add <file>` for each file. Run `git diff --cached --check`. If the command gives a conflict marker, correct that file. Then run `git add` for that file again. Then run `git commit` with `--no-edit` or `-m '<message>'`. The new merge commit has the tag as its second parent. Do not squash it.
9. For `confirm`, if the request already approves the push of the resolution, do not ask, and go to step 13. `Finish approval: automatic` does not approve this push.
10. For `confirm`, when you cannot use a question tool, stop. Do not push. The resolution branch stays local. In the report, give each file with a conflict and the resolution branch. Tell the caller that the Operator must examine the resolution and approve it in a new request, for example "Finish the hotfix, push the back-merge resolution".
11. For `confirm`, run `git diff HEAD^1 HEAD -- <files with a conflict>`. Show this diff to the Operator. Then ask one question with the answers `Push` and `Do not push`. Give `Push` first, as the recommended answer.
12. When the Operator answers `Do not push`, stop. The resolution branch stays local.
13. For `automatic`, and for `confirm` after the answer `Push` or the approval in the request, do the next step of your mode.
14. In local mode, run `git switch <development>`. Then run `git merge --no-ff <resolution branch>` with `--no-edit` or `-m '<message>'`. If `origin` has the Development branch, run `git push origin <development>`.
15. In `pull request` mode, run `git push -u origin <resolution branch>`. Find the title and the body, as "When you write a merge message" tells you. Run `gh pr create --base <development> --head <resolution branch>` with `--title` and `--body`, or with `--fill`.
16. In `pull request` mode with `automatic`, do the steps in "When you turn on auto-merge". With `confirm`, do not turn on auto-merge, so that the Operator examines the resolution before the merge.
17. If a replaced pull request exists, run `gh pr close <number> --comment 'Replaced by <URL of the new pull request>'`.
18. Go back to the step after the step that sent you to this section.

## When you examine a Back-merge for a conflict in pull request mode

Do this section in `pull request` mode, when the tag exists, in 2 cases:

- The OPEN pull request from the Production branch into the Development branch has the `mergeable` value `CONFLICTING`. This pull request is the replaced pull request.
- In "When Tag and back-merge is Skill", before you open the pull request into the Development branch. Then no pull request is replaced.

1. Run `git merge-tree --write-tree --name-only origin/<development> <tag>`. This command merges in memory and changes no branch.
2. If the exit code is 0, Git finds no conflict. If a replaced pull request exists, give it in the report, with its number and URL. Do not change it.
3. If the exit code is 1, the lines after the first line, up to the first blank line, are the files with a conflict. Do the steps in "When the Back-merge has a conflict".

## When you delete the finished branch

Delete the finished branch only when its work is in the targets. A deleted branch can have commits that no other branch contains.

1. Make sure that all steps before this section are done. For a `release/*` branch and a `hotfix/*` branch, the tag and the merge into each tag target must exist.
2. Run `git rev-parse <branch>`. If the result is not the commit that you recorded before the merge, do not delete the branch. In the report, give the branch and the cause.
3. Run `git fetch origin`. If `origin/<branch>` is there and is not the recorded commit or one of its ancestors, do not delete the branch. In the report, give the branch and the cause.
4. CAUTION: Delete the branch only after steps 2 and 3. A branch with new commits loses these commits.
5. Run `git branch -D <branch>`. After a squash merge, `git branch -d` refuses to delete the branch, because the target does not contain its commits.
6. CAUTION: Delete `origin/<branch>` only after steps 2 and 3. A deleted branch can have commits that no other branch contains.
7. If `origin/<branch>` is there, run `git push origin --delete <branch>`.

## When Finish mode is pull request

The host merges each pull request. After the merge, a new Finish run of the same branch does the next steps. For example, a new "Finish the release" makes or examines the tag and the Back-merge.

1. If the branch has no pull request, do the steps in "When you open the pull request".
2. If the pull request is OPEN, do the steps in "When the pull request is open".
3. If the pull request is MERGED, and the branch is a `release/*` or `hotfix/*` branch, examine the Setting `Tag and back-merge`. For `CI`, do the steps in "When Tag and back-merge is CI". For `Skill`, do the steps in "When Tag and back-merge is Skill".
4. If the pull request is MERGED, and the branch is a `feature/*` or `bugfix/*` branch, continue with "When you clean up branches".

## When you open the pull request

1. If `origin/<branch>` is not there, or the local branch has commits that `origin/<branch>` does not have, run `git push -u origin <branch>`. The host opens a pull request only from a branch on `origin`.
2. Find the title and the body, as "When you write a merge message" tells you.
3. When the plan has approval, run `gh pr create --base <first target> --head <branch>` with `--title` and `--body`, or with `--fill`.
4. Do the steps in "When you turn on auto-merge".

## When the pull request is open

1. If the local branch has commits that `origin/<branch>` does not have, run `git push origin <branch>`. The pull request then gets these commits.
2. If the pull request has no `autoMergeRequest`, do the steps in "When you turn on auto-merge".

## When you turn on auto-merge

1. Find the Setting of the base branch of the pull request. For the Production branch, it is `Production auto-merge`. For the Development branch and for a `release/*` branch, it is `Development auto-merge`.
2. If the Setting is `off`, do not turn on auto-merge. Then the Operator merges the pull request.
3. If the Setting is `on`, find the merge kind of the target, as "When you find the targets" tells you. A pull request into a tag target always has the merge kind `merge commit`.
4. Find the message, as "When you write a merge message" tells you.
5. When the Setting is `on`, run `gh pr merge <number> --auto` with `--merge` for `merge commit`, or with `--squash` for `squash`. The host merges the pull request when its required checks pass.

## When you find the merge into a tag target

The commit of the tag is the commit on the Production branch that gets the tag. In `pull request` mode, it is the `mergeCommit` of the MERGED pull request. The merge of the tag into a tag target exists when one of these conditions is true:

- The `ancestor` form of `scripts/check.sh` gives `valid:` for `<commit of the tag> origin/<tag target>`.
- An OPEN pull request from the Production branch into the tag target exists, and its `mergeable` value is not `CONFLICTING`. Find it with `gh pr list --head <production> --base <tag target> --state open --json number,mergeable,url`.
- The tag target is the Development branch, and an OPEN pull request from the resolution branch `bugfix/back-merge-v<version>` into the Development branch exists. Find it with `gh pr list --head bugfix/back-merge-v<version> --base <development> --state open --json number,url`.

A pull request into a `release/*` branch can have the `mergeable` value `CONFLICTING`. Give this pull request in the report, with its number and URL.

## When Tag and back-merge is CI

A CI job of the project makes the tag and opens the pull request of the Back-merge. Finish only examines them, because the CI job and Finish must not make the same tag.

1. Run `git rev-parse --verify --quiet 'refs/tags/<tag>^{commit}'`. If the command gives no commit, the tag is missing.
2. For each tag target, find the merge of the tag, as "When you find the merge into a tag target" tells you.
3. Find the OPEN pull request from the Production branch into the Development branch. If the tag exists and this pull request has the `mergeable` value `CONFLICTING`, do the steps in "When you examine a Back-merge for a conflict in pull request mode".
4. Do not make a missing tag or a missing pull request.
5. In the report, give each missing item: the tag, and the merge into each tag target. Tell the Operator to examine the CI job.

## When Tag and back-merge is Skill

1. Run the `ancestor` form of `scripts/check.sh` for `<commit of the tag> origin/<production>`. If it does not give `valid:`, stop. In the report, tell that `origin/<production>` does not contain the commit of the tag.
2. Run `git rev-parse --verify --quiet 'refs/tags/<tag>^{commit}'`. If the tag exists, do not make it again. Do not move or delete a tag. A released version does not change.
3. If the tag is missing, run `git tag <tag> <commit of the tag>`.
4. When the plan has approval, run `git push origin <tag>`.
5. For each tag target, in the sequence of the table in "When you find the targets", find the merge of the tag, as "When you find the merge into a tag target" tells you. If the merge exists, do not open a pull request into that tag target.
6. If the OPEN pull request from the Production branch into the Development branch has the `mergeable` value `CONFLICTING`, do the steps in "When you examine a Back-merge for a conflict in pull request mode". Do not open a different pull request into the Development branch.
7. If `git rev-parse origin/<production>` does not give the commit of the tag, do not open a pull request into the tag target. In the report, tell that the Production branch has commits after the tag. A pull request from the Production branch then brings changes that the version does not have.
8. For the Development branch, first do the steps in "When you examine a Back-merge for a conflict in pull request mode". If they find a conflict, do not open a pull request from the Production branch into the Development branch.
9. If not, find the title and the body, as "When you write a merge message" tells you.
10. When the plan has approval, run `gh pr create --base <tag target> --head <production>` with `--title` and `--body`, or with `--fill`.
11. Do the steps in "When you turn on auto-merge".

## When you clean up branches

Do this section at the end of each Finish that did not stop, in the two modes. It deletes each branch that is safe to delete, so that no old branch stays. If the project has no `origin` remote, do the steps without the fetch, the merge from `origin`, and the delete on `origin`.

1. Run `git fetch --prune --tags origin`. This command also removes the refs of the branches that `origin` deleted.
2. Run `git switch <development>`. When `Development branch` is `none`, run `git switch <production>`.
3. If the local branch of HEAD has fewer commits than its `origin` branch, run `git merge --ff-only origin/<branch of HEAD>`. If this command fails, do not change the branch. In the report, give the branch and the cause.
4. Find each `feature/*`, `bugfix/*`, `release/*`, and `hotfix/*` branch, local and on `origin`:

   ```sh
   git for-each-ref --format='%(refname) %(objectname)' refs/heads/feature refs/heads/bugfix refs/heads/release refs/heads/hotfix refs/remotes/origin/feature refs/remotes/origin/bugfix refs/remotes/origin/release refs/remotes/origin/hotfix
   ```

5. For each branch, do the test in "When a branch is safe to delete". Do the test for the local branch and for the `origin` branch separately, each with its own commit.
6. CAUTION: Delete a branch only when it passes the test. A deleted branch can have commits that no other branch contains.
7. For each local branch that passes the test, run `git branch -D <branch>`. After a squash merge, `git branch -d` refuses to delete the branch, because the target does not contain its commits.
8. CAUTION: Delete an `origin` branch only when it passes the test. A deleted branch can have commits that no other branch contains.
9. For each `origin` branch that passes the test, run `git push origin --delete <branch>`.
10. For each branch that does not pass the test, record the branch and the cause for the report.

## When a branch is safe to delete

A branch passes the test only when each of these steps gives a pass. The commit of the branch is the commit of the local branch or of the `origin` branch that you examine.

1. In `pull request` mode, run `gh pr list --head <branch> --state merged --json number,headRefOid,mergeCommit`. The branch passes this step only when a MERGED pull request has the commit of the branch as its `headRefOid`. Then the pull request has all the commits of the branch.
2. In `local` mode, find the target of the branch type, as "When you find the targets" tells you. The branch passes this step only when the `ancestor` form of `scripts/check.sh` gives `valid:` for `<commit> <target>`.
3. For a `release/X.Y.Z` branch, the tag `<Tag prefix>X.Y.Z` must exist.
4. For a `hotfix/*` branch in `pull request` mode, a tag `<Tag prefix>X.Y.Z` must be on the `mergeCommit` of its pull request. Find it with `git tag --points-at <commit of the tag>`.
5. For a `hotfix/*` branch in `local` mode, a tag `<Tag prefix>X.Y.Z` must contain the commit of the branch. Find it with `git tag --contains <commit>`.
6. For a `release/*` or `hotfix/*` branch, when the project has a Development branch, the Back-merge must exist. Find it as "When you find the merge into a tag target" tells you, with the commit of the tag of that branch.

## When you report Finish

Give these items:

- The branch that Finish merged, and its version and tag, if it has a version.
- Each merge: the target, the merge kind, and the short SHA of the new commit.
- Each pull request that Finish opened or found: its number, URL, base, head, state, and auto-merge. When a pull request waits for its merge, tell the caller to finish the branch again after the merge.
- In `pull request` mode, each missing tag and each missing merge into a tag target.
- For a Back-merge with a conflict: each file with a conflict, the resolution branch, and its pull request. Also tell if Finish pushed the resolution, and give the replaced pull request that Finish closed.
- Each branch and tag that Finish pushed, and each branch that stays local only.
- Each deleted branch, local and on `origin`. Give each branch that Finish did not delete, with the cause.
- The branch of HEAD at the end.

When Finish stops, give the cause, the steps that Finish did before it stopped, and what Finish needs to continue.
