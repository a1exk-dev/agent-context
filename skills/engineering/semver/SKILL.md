---
name: semver
description: "Before you make a Git branch, a version tag, or a version change, use this skill. Before you open or merge a pull request into the production or development branch, for example `main` or `develop`, use this skill. When a request says \"version\", \"bump\", \"release\", \"hotfix\", \"tag\", or \"Git Flow\", or names this skill, use this skill. This skill picks the next Semantic Versioning 2.0.0 version and checks a version or a branch name. It also starts and finishes `feature/*`, `bugfix/*`, `release/*`, and `hotfix/*` branches. Before each job, this skill reads the Semver policy of the project. When the Semver policy is missing, this skill sets it up. Do not use it to write a commit message, changelog text, or the description of a pull request, or to bump a dependency. Do not use it to rebase a branch or to examine the history."
---

# Semver

This skill gives versions by Semantic Versioning 2.0.0 and makes branches by Git Flow, as the Semver policy of the project tells it.

## Terms in this skill

- The **Operator** is the person who controls a project and the agents that operate in it. Only the Operator answers the questions of an agent and gives approval. An agent never acts as the Operator.
- The **caller** is the Operator or the agent that starts this skill.
- A **Policy** is a file in `docs/agents/` that holds the decisions of the Operator for one skill. The **Semver policy** is the Policy of this skill: `docs/agents/semver-policy.md`.
- A **Setting** is one line `- <name>: <value>` of a Policy. This skill gives each name and its possible values.
- The **Production branch** is the branch that holds the released versions. The Setting `Production branch` gives its name.
- The **Development branch** is the branch that collects the work for the next release. The Setting `Development branch` gives its name, or `none` when the project has no Development branch.
- A **Back-merge** is the merge from the Production branch into the Development branch after a release or a hotfix.
- The 4 branch types are `feature/<name>`, `bugfix/<name>`, `release/X.Y.Z`, and `hotfix/<name>`. The prefixes are fixed.
- This skill does 4 jobs:
  - **Pick** gives the next version.
  - **Check** tells whether a version or a branch name is correct for Semantic Versioning 2.0.0 and the Semver policy.
  - **Start** makes a branch from the correct base, with the correct name, and checks it out.
  - **Finish** merges a branch into its targets, or opens a pull request for each target. It also makes the tag and the Back-merge, and deletes the branches that are safe to delete.

## In each job

- Change no file of the project except the Semver policy and, in Finish, the files with a conflict in a Back-merge. Do not edit the changelog, a version file, or other project files, because these files belong to the project and its other work.
- Do not stage or commit the Semver policy. The Operator commits it with the process of the project.
- Do not push with `--force`.
- Do not use `--no-verify`.
- Do not change a commit that `origin` contains.
- Write a version without `v`. Use the Setting `Tag prefix` only for the tag.

## Before each job

Do these steps first, before the check script or another step of the job.

1. Read `references/policy-setup.md` in the folder of this skill. It tells you how to set up, examine, and complete the Semver policy.
2. Run `cat -n docs/agents/semver-policy.md` to read the Semver policy and its line numbers.
3. If the file is not there, do the setup in the section "When the Semver policy is not there" of `references/policy-setup.md`.
4. If the file is there, examine each line as `references/policy-setup.md` tells you. If a Setting has no line, add it as `references/policy-setup.md` tells you.
5. Find each open Back-merge pull request with a conflict. Do the steps in "When you find a Back-merge pull request with a conflict".

| Setting | Values | Default |
|---|---|---|
| Production branch | A branch name. | `main` |
| Development branch | A branch name, or `none`. | `develop` |
| Hotfix branches | `on` or `off`. | `on` |
| Tag prefix | `v` or `none`. | `v` |
| Development merge | `merge commit` or `squash`. | `squash` |
| Production merge | `merge commit` or `squash`. CAUTION: Offer `merge commit` as the recommended value. `squash` makes the release commits not ancestors of the Production branch, and then Back-merges can have conflicts. | `merge commit` |
| Finish mode | `pull request` or `local`. | `pull request` |
| Tag and back-merge | `CI` or `Skill`. | `CI` |
| Back-merge conflicts | `confirm`, `automatic`, or `report`. | `confirm` |
| Development auto-merge | `on` or `off`. | `off` |
| Production auto-merge | `on` or `off`. | `off` |
| Finish approval | `confirm` or `automatic`. | `confirm` |
| Breaking before 1.0.0 | `minor` or `major`. | `major` |
| Breaking definition | `default`, or a list of the public parts of the project. A comma is between each 2 parts. | `default` |

The default Semver policy has the title, a blank line, and one Setting for each row, in the sequence of the table:

```markdown
# Semver policy

- Production branch: main
- Development branch: develop
- Hotfix branches: on
- Tag prefix: v
- Development merge: squash
- Production merge: merge commit
- Finish mode: pull request
- Tag and back-merge: CI
- Back-merge conflicts: confirm
- Development auto-merge: off
- Production auto-merge: off
- Finish approval: confirm
- Breaking before 1.0.0: major
- Breaking definition: default
```

## When you start a feature, bugfix, or hotfix branch

1. Find the branch type from the request: `feature`, `bugfix`, or `hotfix`.
2. If the branch type is `hotfix` and the Setting `Hotfix branches` is `off`, stop. In the report, give the Setting `Hotfix branches: off`. The project then ships its changes only through `release/*` branches.
3. Find the base branch in this table:

   | Branch type | Base branch |
   |---|---|
   | `feature` | The Development branch. When `Development branch` is `none`, the Production branch. |
   | `bugfix` | The Development branch. When `Development branch` is `none`, the Production branch. |
   | `hotfix` | The Production branch. |

4. Make sure that the base branch exists: `git rev-parse --verify --quiet refs/heads/<base>`. If the local branch is not there, use `origin/<base>` when it exists. If the two are not there, stop and give the name of the base branch in the report.
5. Find the name part from the request, in lowercase words with hyphens. For example, "Start a feature branch for search" gives `feature/search`. A hotfix name has no version, because a hotfix gets its version only at Finish.
6. If the request gives no subject for the name, ask the caller for the name. If no person can answer, stop.
7. Make sure that `git check-ref-format --branch <type>/<name>` accepts the full name. Also make sure that no local branch and no `origin` branch has that name. If one of these checks fails, stop and give the cause in the report.
8. Run `git switch -c <type>/<name> <base>` to make the branch and check it out.
9. Do not push the new branch. The new branch stays local until work starts on it.

## When you run the check script

The check script `scripts/check.sh` is in the folder of this `SKILL.md` file. It requires `sh` and Git. Run it in the project folder with `sh`, in one of these 4 forms:

```sh
sh <skill folder>/scripts/check.sh version <version>
sh <skill folder>/scripts/check.sh branch <branch name>
sh <skill folder>/scripts/check.sh release <version> <Tag prefix>
sh <skill folder>/scripts/check.sh ancestor <commit> <branch>
```

- Replace `<skill folder>` with the absolute path of the folder of this `SKILL.md` file.
- The `version` form examines the Semantic Versioning 2.0.0 syntax. It accepts a pre-release part and a build part.
- The `branch` form examines the name of a `feature/*`, `bugfix/*`, `release/*`, or `hotfix/*` branch.
- The `release` form examines a version for a new release: `X.Y.Z`, and higher than the last release tag. Give the value of the Setting `Tag prefix`: `v` or `none`.
- The `ancestor` form examines if the branch contains the commit. Give a commit, a tag, or `HEAD` as `<commit>`, and a local or `origin` branch, or `HEAD`, as `<branch>`.
- The script gives one line. `valid:` with exit code 0 shows a correct version or name, or a branch that contains the commit. `invalid:` with exit code 1 gives the cause of the problem.
- Exit code 2 shows that the script did not run. Then stop, and give the error message in the report.

## When you check a version or a branch name

1. For each version in the request, run the `version` form of the check script.
2. For each branch name in the request, run the `branch` form of the check script. Do not run it for the name of the Production branch or the Development branch, because the script accepts only the 4 branch types. Compare that name with the Semver policy.
3. When the Setting `Hotfix branches` is `off`, report each `hotfix/*` name as not correct for the project. Do this also when the script gives `valid:`.
4. Do not change the repository.
5. In the report, give each version and branch name, and tell if it is correct. For each name or version that is not correct, give the cause from the script.

## When you pick the next version

Before Pick, read `references/pick.md` in the folder of this skill. Then do its steps. In Pick, do not change the repository. In Pick, ask no question, except when Start of a `release/*` branch uses Pick.

Pick does not find deprecations. When the caller asks how to mark a deprecation, tell the caller to make it on a `feature/*` branch. With `Development merge: squash`, tell the caller to make it in a `feat` commit. Then Pick gives minor, as item 7 of the Semantic Versioning 2.0.0 specification tells.

## When you start a release branch

1. Find each `release/*` branch, local and on `origin`: `git branch --all --list 'release/*' '*/release/*'`.
2. A `release/X.Y.Z` branch is open when no tag `<Tag prefix>X.Y.Z` exists. If a `release/*` branch is open, stop. In the report, give the name of that branch. Only one release at a time gets ready, so that two releases do not compete for the same version.
3. If the request gives the version, use that version exactly as the request gives it. Do not add a part to the version or remove a part from it. For example, do not change `1.3` to `1.3.0`. If the request gives no version, before you find the version, read `references/pick.md` in the folder of this skill. Then do its steps to pick the version. These steps can ask the Operator for the version.
4. Run the `release` form of the check script with the version and the Setting `Tag prefix`.
5. If the script gives `invalid:`, stop. In the report, give the cause from the script.
6. The base branch is the Development branch. When `Development branch` is `none`, the base branch is the Production branch. Make sure that the base branch exists, as step 4 of "When you start a feature, bugfix, or hotfix branch" tells you.
7. Run `git switch -c release/<version> <base>` to make the branch and check it out.
8. Do not push the new branch. The new branch stays local until work starts on it.

## When you find a Back-merge pull request with a conflict

Do these steps in each job, Check too, so that the Operator learns about the conflict. Do them only when the project has a Development branch and an `origin` remote. You must also have a tool for the host, for example `gh` for GitHub. Do not install or set up a host tool for these steps, because the Operator controls the host tools of the project.

1. Run `gh pr list --base <development> --state open --json number,headRefName,mergeable,url`, or the command of your host tool that does the same work.
2. A Back-merge pull request has the head `<production>` or a branch `bugfix/back-merge-v<version>`. Record each Back-merge pull request with the `mergeable` value `CONFLICTING` for the report.
3. If the command gives an error, continue the job, and give the error in the report.

These steps change nothing. Finish resolves the conflict as the Setting `Back-merge conflicts` tells you.

## When you finish a branch

Before Finish, read `references/finish.md` in the folder of this skill. Then do its steps. Finish is the only job that asks for approval, because it changes the long-lived branches and `origin`.

## When you ask a question

Ask with the question tool of the platform. When you cannot use a question tool, do the steps of the reference file of the job for this condition. This occurs when the platform has no question tool, or when that tool gives an error. If the reference file gives no steps, ask in plain text. Then end your turn. No answer is not approval. When the request gives the answer before the question, use that answer and do not ask.

## When you write the report

Give the result of the job. For Pick, give the items that `references/pick.md` tells you to give. For Start, give the new branch, its base branch, and the short SHA of the commit where the new branch starts. Also tell that the new branch is not pushed. For Finish, give the items that `references/finish.md` tells you to give. When you stop, give the cause and what the job needs to continue.

In each job, also give each open Back-merge pull request with a conflict, with its number and URL. Tell the Operator that Finish of the release or the hotfix of that version handles the conflict.
