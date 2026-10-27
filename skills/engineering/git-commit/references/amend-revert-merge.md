# Amend, revert, and merge

Read this file before you amend a commit, revert a commit, or run `git merge` or `gh pr merge`. This file refers to sections in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

Before the first step of each section, read the Commit policy as the section "Before the first `git add`" of `SKILL.md` tells you. Some of these jobs run no `git add`, but each job uses the Settings.

## When you amend a commit

1. Amend only the last commit of the branch. If the task tells you to amend a different commit, do not amend it. In your report, tell that this skill amends only the last commit. Only `git rebase` can change a different commit, and this skill does not run `git rebase`.
2. Run `git branch -r --contains HEAD`. If the output gives a remote branch, do not amend the commit. In your report, give that remote branch. `git commit --amend` replaces the commit. Only `git push --force` or `git push --force-with-lease` can replace a commit on a remote branch. This skill never pushes with these options.
3. When you amend a commit, stage the task files as the section "When you stage files" of `SKILL.md` tells you. When the task changes only the message, stage no file.
4. When you amend a commit, write its full message as the section "When you write the commit message" of `SKILL.md` tells you. Keep the old message when it agrees with the amended commit and the task does not change it.
5. When you amend a commit, commit with `git commit --amend -F <file>`, as the section "When you commit" of `SKILL.md` tells you.

When `Commit approval` is `confirm`, do the steps of the section "When you show a Commit review" of `SKILL.md` before you commit in step 5. Do the steps of that section with these 2 differences:

- In step 2 of that section, first give the short SHA and the header of the commit that `git commit --amend` replaces. In parts 1 and 2, use `git diff --cached --stat HEAD~1` and `git diff --cached HEAD~1`. Then the Operator sees all changes of the amended commit, not only the new changes.
- In step 5 of that section, commit with `git commit --amend -F <file>`.

## When you revert a commit

1. If the task gives only the header of the commit, run `git log --format='%H %s'` to find the commit. Then run `git revert --no-commit <commit>`.
2. If Git cannot revert a file, stop. Do not correct that file, because each correction is a decision about the code. In your report, give the output of `git diff --name-only --diff-filter=U`. Tell the Operator that `git revert --abort` cancels `git revert`.
3. Run `git log -1 --format=%s <commit>` to get the old header. Run `git rev-parse <commit>` to get the full SHA.
4. Write the message in this form:

   ```text
   revert: <old header>

   This reverts commit <full SHA>.

   Refs: <full SHA>
   ```

5. When a Setting does not permit this message, change or add only the necessary part. Change the message in the same way that the section "When you write the commit message" of `SKILL.md` changes `chore: add commit policy`. When the header has more characters than `Header length`, remove words from the end of the old header. Do not change `<old header>` in a different way.
6. When you write the message of step 4, obey the `Issue footer` Setting of the Commit policy. Put the issue footer in the footer block, on the line after `Refs: <full SHA>`.
7. The task files are the files that `git revert` changed. When you revert a commit, commit these files as the section "When you commit" of `SKILL.md` tells you.

## When you run `git merge`

This skill does not decide to merge a branch. Merge a branch only when the task tells you to merge it. This skill writes the message of the merge commit and shows its Commit review.

1. Run `git status --porcelain`. If the output shows a changed file, do not merge. In your report, give the changed files. `git merge --abort` cannot always restore changes that are not in a commit.
2. If the task tells you to use `--ff-only`, run `git merge --ff-only <branch>`. `git merge --ff-only` makes no commit. Do not write a message or show a Commit review. Go to the section "When you write the report" of `SKILL.md`.
3. In all other conditions, run `git merge --no-ff --no-commit <branch>`. `--no-ff` makes a merge commit also when `<branch>` contains all commits of the current branch. `--no-commit` stops before the commit, so that you can write the message.
4. If Git cannot merge a file and the task does not tell you to correct it, stop. In your report, give the output of `git diff --name-only --diff-filter=U`. Tell the Operator that `git merge --abort` cancels `git merge`. When the task tells you to correct the file, give each corrected file to `git add`.
5. Write the header `<type>[(<scope>)]: merge <branch> into <current branch>`. Use a type from `Types` that agrees with the commits that `<branch>` adds to the current branch. When you write the message of a merge commit, obey each Setting as the section "When you write the commit message" of `SKILL.md` tells you.
6. When you commit, use `git commit -F <file>`, as the section "When you commit" of `SKILL.md` tells you. Git then makes a merge commit.

When `Commit approval` is `confirm`, do the steps of the section "When you show a Commit review" of `SKILL.md` before you commit in step 6. Do the steps of that section with these 3 differences:

- In part 2 of step 2 of that section, write the output of `git log --oneline HEAD..MERGE_HEAD` in place of `git diff --cached`. This output gives one line for each commit that `<branch>` adds to the current branch.
- After `git reset --soft HEAD@{1}` in step 7 of that section, Git has no merge state. Then run `git rev-parse <branch> > "$(git rev-parse --git-path MERGE_HEAD)"`. Then the next commit is again a merge commit. In the new Commit review, also give the output of `git diff <previous tree ID> <new tree ID>`. This output shows the change of the Git hook.
- When the Operator answers `Reject`, run `git merge --abort` in place of `git restore --staged`. The commits of `<branch>` stay on `<branch>`.

## When you run `gh pr merge`

GitHub makes this merge commit, not local Git. Do not show a Commit review. Do not ask for approval. This rule is also applicable when `Commit approval` is `confirm`.

1. Run `gh pr merge` only when the task tells you to merge the pull request.
2. Find the number of the pull request, the branch that it merges, and the branch that it merges into. If the task does not give them, run `gh pr view <number> --json number,headRefName,baseRefName`.
3. When the task tells you to use `--squash`, write a header that tells the change of the pull request. Add ` (#<number>)` at the end of this header.
4. In all other conditions, write the header `<type>[(<scope>)]: merge <head branch> into <base branch> (#<number>)`. `<head branch>` is the branch that the pull request merges. `<base branch>` is the branch that the pull request merges into.
5. When you write the `--subject` header, obey each Setting as the section "When you write the commit message" of `SKILL.md` tells you.
6. Give the header to `gh pr merge` with `--subject`. Do not stage a file. Do not make a local commit.
7. In your report, give the number of the pull request and the header. Tell that GitHub made the merge commit. Do not run `git show`, because the merge commit is not in the local repository.
