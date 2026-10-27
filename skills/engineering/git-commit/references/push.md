# Push

## Before you use this file

After the last commit of the task, if the `Push` Setting is `confirm` or `automatic`, read this file. This file refers to sections in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

## After the last commit of the task

Do these steps one time. Then one `git push` command sends all commits of the branch that are not on `origin`.

1. Run `git branch --show-current` to find the branch. If the output is empty, `HEAD` is not on a branch. Then do not push. In your report, tell that `HEAD` is not on a branch. Then stop.
2. Run `git remote`. If the output does not contain `origin`, do not push. This skill cannot know which other remote repository the Operator wants. In your report, tell that the repository has no remote repository with the name `origin`. Then stop.
3. Run `git log --oneline <branch> --not --remotes=origin`. This output gives one line for each commit that `git push` sends.
4. When `Push` is `automatic`, go to step 5 with no question. When `Push` is `confirm`, do these steps:
   1. Show the Operator the branch, the remote branch `origin/<branch>`, and the output of step 3.
   2. Ask the Operator one question with the answers `Push` and `Don't push`. When you ask this question, obey the section "When you ask the Operator a question" of `SKILL.md`.
   3. When the Operator answers `Don't push`, do not push. In your report, also tell that the commits stay in the local repository. Then stop.
   4. When the Operator gives no answer, also give the output of step 3 in your report. Tell that you push these commits only after the answer `Push`. Then stop.
   5. When the Operator answers `Push`, go to step 5.
5. CAUTION: Do not add `--force`, `--force-with-lease`, or a `+` before the branch. These options can delete commits that other persons pushed.
6. Run `git push origin <branch>`.
7. If `git push` gives an error, go to the section "When `git push` gives an error".
8. In your report, also give the branch, the remote branch, and the output of step 3. Tell that `git push` sent these commits.

## When `git push` gives an error

- Do not push again, also after a network error. The Operator decides the next step. When a Git hook stopped `git push`, also do not push with `--no-verify`. The hook examines the commits that you push for a requirement of the project.
- Do not run `git pull`, `git rebase`, or `git merge` to correct the error. The Operator decides the next step.
- Do not tell the Operator to push with `--force`, `--force-with-lease`, or `--no-verify`.
- In your report, also give the error. Tell that the commits stay in the local repository. Then stop.
