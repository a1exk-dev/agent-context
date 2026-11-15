# Research: what Git Flow defines for each branch type, and how its variants differ

<!-- cspell:ignore nvie Driessen gitflow petervanderdoes gittower versiontag nobackmerge notag keepremote keeplocal signingkey messagefile nodevelopmerge pushproduction pushdevelop autoupdate upstreamstrategy downstreamstrategy startpoint tagprefix tagname mergemessage updatemessage noflag pushtag Hotfixes -->

Question (issue #154, map #152): What do the original Git Flow model (nvie, 2010) and the git-flow tools (gitflow-avh, git-flow-next) define for the production branch, the development branch, and `feature/*`, `bugfix/*`, `release/*`, and `hotfix/*` branches: where each branch starts, where it merges, when the version and tag are set, and how back-merges work? How do common variants (GitHub flow, GitLab flow, a project without a development branch) differ? Which names and choices do the tools make configurable?

Use: the policy file `docs/agents/semver-policy.md` and the branch jobs of the `semver` Skill (#152).

Sources, read on 2026-11-03:

- [nvie] Vincent Driessen, ["A successful Git branching model"](https://nvie.com/posts/a-successful-git-branching-model/) (2010), with its "Note of reflection" of 2020-03-05 at the top of the same page.
- [avh] gitflow-avh at `develop` commit [`40fc2df`](https://github.com/petervanderdoes/gitflow-avh/tree/40fc2df960d034cb57dd277af7501be6884f767e) (2019-05-23, version `1.12.4-dev0`). The GitHub repository is archived (API `archived: true`, last push 2023-08-17). Files: `git-flow-init`, `git-flow-feature`, `git-flow-bugfix`, `git-flow-release`, `git-flow-hotfix`, `git-flow-support`, `CHANGELOG.md`, and the wiki page [Reference: Configuration](https://github.com/petervanderdoes/gitflow-avh/wiki/Reference:-Configuration).
- [next] git-flow-next (by Tower) at `main` commit [`00d1b4b`](https://github.com/gittower/git-flow-next/tree/00d1b4be9ade548b1b698a42988dbd64a01ea400) (2026-09-08, latest tag `v2.1.0`). Files: `docs/gitflow-config.5.md`, `docs/git-flow-init.1.md`, `docs/git-flow-finish.1.md`, `docs/avh-compatibility-analysis.md`, `internal/config/config.go` (`DefaultConfig`), `internal/config/resolver.go`.
- [gh] GitHub Docs, ["GitHub flow"](https://docs.github.com/en/get-started/using-github/github-flow).
- [gl] GitLab Docs, `doc/topics/gitlab_flow.md` at tag [`v15.11.0-ee`](https://gitlab.com/gitlab-org/gitlab/-/blob/v15.11.0-ee/doc/topics/gitlab_flow.md), the last full version. At `v16.5.0-ee` the file is a redirect to a 2023-07-27 GitLab blog post, and `docs.gitlab.com/ee/topics/gitlab_flow.html` returns 404. The current GitLab page is the marketing topic ["What is GitLab Flow?"](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/).
- [repo] This repository: `AGENTS.md` (Branches, Merging, Back-merges), `scripts/release-version.ts`, `scripts/check-source-branch.ts`, `scripts/release.ts`, `scripts/back-merge.ts`, `.github/workflows/release.yml`.

## Summary

- The 2010 model gives start and merge rules only for feature, release, and hotfix branches. `master` and `develop` are the two branches with "infinite lifetime" [nvie]. `bugfix/*` and `support/*` are not in the article. The tools add them [avh, next].
- Version: nvie sets the version **at the start** of the release branch ("not any earlier"), with a "bump version" commit on that branch. A hotfix bumps the version right after it branches off. The tag goes on the merge commit on `master` at finish [nvie]. In both tools, the version is the branch name (`release/<version>`, `hotfix/<version>`), and finish makes the tag `<versiontag prefix><version>` on the production branch [avh, next].
- Back-merge: nvie merges the **release or hotfix branch** into `develop`. Both tools by default merge the **production branch (or the new tag)** into `develop` instead, so `git describe` on `develop` sees the tag [avh, next]. This repo does the same: it opens a pull request from `main` into `develop` [repo].
- Hotfix during an open release: nvie merges the hotfix into the **release branch instead of `develop`**, and allows a merge into `develop` too if `develop` needs it now [nvie]. Neither tool does this automatically. gitflow-avh merges a hotfix into `master` and `develop` only. git-flow-next updates only base branches with `autoUpdate=true` (by default `develop`), and a release branch is a topic branch [avh, next]. A skill that follows nvie must handle this case itself.
- Concurrency: gitflow-avh allows only one release branch at a time, and one hotfix branch unless `gitflow.multi-hotfix=true` [avh]. I found no such limit in git-flow-next.
- Names that the tools make configurable: the production branch (avh default `master`, next default `main`), the development branch (`develop`), the prefixes `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/`, and the version tag prefix (default empty, not `v`) [avh, next]. git-flow-next also makes the start point, the merge target (parent), the merge strategy (merge, rebase, squash, none), and tagging configurable per branch type [next].
- Variants: GitHub flow has one long-lived branch and no release, version, tag, or `develop` rule [gh]. GitLab flow has no `develop` branch: work goes into `main`, with optional environment branches (downstream only) or `X.Y-stable` release branches that get fixes by cherry-pick ("upstream first"), with a new patch tag for each fix [gl]. Driessen himself recommends a simpler flow for continuously delivered software, and Git Flow for "explicitly versioned" software [nvie].

## 1. Per branch type

### 1.1. Production branch (`master` / `main`)

| Item | nvie | gitflow-avh | git-flow-next |
| - | - | - | - |
| Role | `origin/master` is "the main branch where the source code of HEAD always reflects a production-ready state"; infinite lifetime. | `gitflow.branch.master`; `git flow init` suggests `master`, and guesses `production`, `main`, `master` in that order (`git-flow-init` l. 147–201). | Base branch `main`, no parent, `upstreamStrategy=none` (`config.go` `DefaultConfig`). `git flow init --main=<name>` (`git-flow-init.1.md`). |
| Starts from | — (initial branch) | — | — |
| Receives | Only release and hotfix merges, each tagged: "each time when changes are merged back into master, this is a new production release by definition." | Release and hotfix finish (`git merge --no-ff`, or `--squash` with `squash`). | Topic branches whose parent is `main`: `release`, `hotfix` (and `support` with strategy `none`). |
| Tags | On each merge commit from release or hotfix. | On finish of release or hotfix, unless `notag`. | On finish of a topic type with `tag=true` (release, hotfix by default). |

### 1.2. Development branch (`develop`)

| Item | nvie | gitflow-avh | git-flow-next |
| - | - | - | - |
| Role | "the main branch where the source code of HEAD always reflects a state with the latest delivered development changes for the next release"; the "integration branch"; infinite lifetime. | `gitflow.branch.develop`; init guesses `develop`, `int`, `integration`, `master` (`git-flow-init` l. 206–252). | Base branch `develop`, parent `main`, `autoUpdate=true`, downstream strategy `merge` (`config.go`). `--develop=<name>`. |
| Receives | Feature merges; release back-merges; hotfix merges (or via the release branch, see 1.6). | Feature and bugfix finish; back-merge of `master` or the tag after release and hotfix finish. | Feature and bugfix finish; after a release or hotfix finish, an update **from `main`** because `autoUpdate=true` ("Update Children", `git-flow-finish.1.md`). |
| Version | None. nvie: the version is assigned at release branch start, "not any earlier". | None. | None. Integrate (`git flow integrate`) tags only with an explicit tag name, because "base branches have no version from which to derive a tag name" (`gitflow-config.5.md`). |

### 1.3. `feature/*`

- nvie: "May branch off from: `develop`. Must merge back into: `develop`." Naming: "anything except `master`, `develop`, `release-*`, or `hotfix-*`". Merge with `--no-ff`, so the history keeps the feature as a group of commits. Feature branches "typically exist in developer repos only, not in `origin`" [nvie].
- gitflow-avh: `git flow feature start <name> [<base>]`, base defaults to `develop` (`git-flow-feature` l. 198). Finish merges into the recorded base (`gitflow.branch.<name>.base`, default `develop`). Finish options: `rebase`, `squash`, `no-ff`, `keep`, `keepremote`, `keeplocal`, `push`, `fetch` [avh wiki].
- git-flow-next: topic type `feature`, parent and start point `develop`, upstream `merge`, downstream `rebase`, no tag (`config.go`).

### 1.4. `bugfix/*`

- nvie: no such branch type. The article has feature, release, and hotfix branches only.
- gitflow-avh: added in 1.9.0 ("Add bugfix command", `CHANGELOG.md` l. 143). It works like `feature`: base defaults to `develop` (`git-flow-bugfix` l. 198, 301), finish merges into that base.
- git-flow-next: same as `feature` (parent and start point `develop`, no tag) (`config.go`).
- Fixes on a release branch: nvie puts small fixes for an open release directly on the release branch (release branches "allow for minor bug fixes and preparing meta-data for a release"; "Adding large new features here is strictly prohibited"), and the release finish brings them into `develop` [nvie]. Neither tool defaults `bugfix` to a release branch, but gitflow-avh accepts any `<base>` [avh].

### 1.5. `release/*`

- nvie: "May branch off from: `develop`. Must merge back into: `develop` and `master`." Naming `release-*`. Start "when develop (almost) reflects the desired state of the new release". "It is exactly at the start of a release branch that the upcoming release gets assigned a version number—not any earlier." The example runs `./bump-version.sh 1.2` and commits "Bumped version number to 1.2". Finish: merge into `master` with `--no-ff`, tag that commit, merge the release branch into `develop` ("may well lead to a merge conflict" because of the version change), delete the branch [nvie].
- gitflow-avh:
  - `git flow release start <version> [<base>]`, base defaults to `develop` (`git-flow-release` l. 571). The command refuses when another release branch exists (`require_no_existing_release_branches`, l. 585).
  - The version is the branch name (`release/<version>`). The tag is `$VERSION_PREFIX$TAGNAME` (`gitflow.prefix.versiontag` + version, or `--tagname`) (l. 428, 143).
  - Finish: merge into `master` (`--no-ff`, or `--squash` with `squash`, or fast-forward with `ff-master`), tag on `master` unless `notag`, then back-merge into `develop`. By default the back-merge merges **the tag** (or `master` with `notag`) into `develop`, "Accounting for 'git describe'". With `nobackmerge`, it merges the release branch itself. With `nodevelopmerge`, it does not merge into `develop` (l. 150–181, 646–693).
  - `git flow release branch <version> [<name>]` releases an existing branch (default `develop`) directly (l. 763–780).
- git-flow-next: topic type `release`, **parent `main`**, start point `develop`, `tag=true` (`config.go`). Finish merges into `main`, tags, then updates each `autoUpdate=true` child of `main` (`develop`) by merging `main` into it (`git-flow-finish.1.md`, "Child Branch Updates"). Default tag name is `tagprefix + branch short name` (`resolver.go` l. 173–182). `nobackmerge` is not supported (`avh-compatibility-analysis.md` l. 219).

### 1.6. `hotfix/*`

- nvie: "May branch off from: `master`. Must merge back into: `develop` and `master`." Naming `hotfix-*`. "Don't forget to bump the version number after branching off!" Finish: merge into `master`, tag, merge into `develop`.
- nvie, hotfix while a release branch is open: "when a release branch currently exists, the hotfix changes need to be merged into that release branch, instead of `develop`. Back-merging the bugfix into the release branch will eventually result in the bugfix being merged into `develop` too, when the release branch is finished. (If work in `develop` immediately requires this bugfix and cannot wait for the release branch to be finished, you may safely merge the bugfix into `develop` now already as well.)"
- gitflow-avh:
  - `git flow hotfix start <version> [<base>]`, base defaults to `master` (`git-flow-hotfix` l. 187). Only one hotfix branch at a time, unless `gitflow.multi-hotfix=true` (l. 208; `CHANGELOG.md` 1.9.0). The tag must not already exist (`require_tag_absent`).
  - Finish: merge into the base (`--no-ff` or `squash`), tag unless `notag`, and only when the base is `master`, merge into `develop`: by default the tag (or `master`), with `nobackmerge` the hotfix branch (l. 476–575). The hotfix code never names a release branch, so an open release branch does not get the hotfix.
  - A hotfix can start from a `support/*` branch; then it merges only into that base (l. 551).
- git-flow-next: topic type `hotfix`, parent and start point `main`, `tag=true`, downstream `rebase` (`config.go`). Finish merges into `main`, tags, and updates `develop` from `main`. Only base branches can have children and auto-update, and "topic branches cannot have children" (`gitflow-config.5.md`, Validation Rules), so an open `release/*` branch does not get the hotfix.

### 1.7. `support/*`

- nvie: not in the article.
- gitflow-avh: `git flow support start <version> <base>`; the base must be a commit on `master` (`git-flow-support` l. 161–194). There is no `support finish` command (commands: list, start, rebase). Hotfixes can start from a support branch.
- git-flow-next: topic type `support`, parent and start point `main`, upstream and downstream strategy `none`, no tag (`config.go`).
- nvie's 2020 note names the use case: Git Flow fits "if you need to support multiple versions of your software in the wild".

## 2. Variants

### 2.1. Original article vs. the tools

| Topic | nvie (2010) | gitflow-avh | git-flow-next |
| - | - | - | - |
| Prefix separator | `release-*`, `hotfix-*` | `feature/`, `bugfix/`, `release/`, `hotfix/`, `support/` | Same defaults; any literal string, for example `feature_` |
| Production branch | `master` | `master` (configurable) | `main` (configurable) |
| Version source | Bump script on the release or hotfix branch | Branch name argument | Branch name argument, or a `filter-flow-<type>-start-version` filter (`git-flow-start.1.md`) |
| Tag prefix | Example `git tag -a 1.2`, no prefix; hotfix example `hotfix-1.2.1` | `gitflow.prefix.versiontag`, default empty | `tagprefix` per type, default empty |
| Back-merge into `develop` | The release or hotfix branch | `master` or the tag (default); the branch with `nobackmerge` | `main` (child update), always |
| Hotfix with an open release | Into the release branch | Not handled | Not handled |
| Merge kind | `--no-ff` | `--no-ff` default; `squash` option; `ff-master` for release | Strategy `merge`, `rebase`, `squash`, or `none` per type |

### 2.2. Driessen's 2020 note

"If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like GitHub flow) instead of trying to shoehorn git-flow into your team. If, however, you are building software that is explicitly versioned, or if you need to support multiple versions of your software in the wild, then git-flow may still be as good of a fit to your team as it has been to people in the last 10 years." [nvie]

### 2.3. GitHub flow

"GitHub flow is a lightweight, branch-based workflow." Steps: create a branch, make changes, open a pull request, address review comments, merge, delete the branch [gh]. The page names only the default branch and the topic branch. It has no release branch, version, tag, or `develop` rule [gh]. git-flow-next's GitHub Flow preset has only `main` and `feature/*` with parent `main` (`gitflow-config.5.md`).

### 2.4. GitLab flow

From the last GitLab Docs version [gl]:

- Problems it names in Git Flow: developers "must use the `develop` branch and not `main`", and "the complexity introduced by the hotfix and release branches", for example "the merging back of release branches"; "Frequently, developers make mistakes such as merging changes only into `main` and not into the `develop` branch."
- Production branch: an optional `production` branch "that reflects the deployed code". "you can have your deployment script create a tag on each deployment."
- Environment branches (`staging`, `pre-prod`, `production`): changes move by merge request from one environment branch to the next. A hotfix is developed "on a feature branch" and merged "into `production` with a merge request".
- Release branches: "only if you need to release software to the outside world", named like `2.3-stable`, created from `main` "as late as possible". "first merge these bug fixes into `main`, and then cherry-pick them into the release branch" ("upstream first"). "Every time you include a bug fix in a release branch, increase the patch version (to comply with Semantic Versioning) by setting a new tag." "In this flow, it is not common to have a production branch (or Git flow `main` branch)."
- git-flow-next's GitLab Flow preset: base branches `production` ← `staging` ← `main`, `feature/*` from `main`, `hotfix/*` from `production` with tags (`gitflow-config.5.md`).

### 2.5. A project without a development branch

- GitHub flow and GitLab flow are such projects: feature and fix branches start from and merge into the default branch [gh, gl].
- In git-flow-next this is a configuration, not a different tool: delete the `develop` base branch and set `feature` parent to `main` (the GitHub Flow preset). A release or hotfix finish then has no auto-update child, so it ends on the parent, and no back-merge happens (`git-flow-finish.1.md`, "integration branch") [next].
- gitflow-avh cannot do this: `git flow init` stops with "Production and integration branches should differ." when the two names are the same (`git-flow-init` l. 242–243) [avh].

## 3. What the tools make configurable

| Choice | gitflow-avh key | git-flow-next key |
| - | - | - |
| Production branch name | `gitflow.branch.master` | `gitflow.branch.<name>` with `type=base`, no parent; `init --main` |
| Development branch name | `gitflow.branch.develop` | base branch with `parent=<production>`, `autoUpdate=true`; `init --develop` |
| Branch prefixes | `gitflow.prefix.{feature,bugfix,release,hotfix,support}` | `gitflow.branch.<type>.prefix` |
| Version tag prefix | `gitflow.prefix.versiontag` (default empty) | `gitflow.branch.<type>.tagprefix` (default empty) |
| Start point of a type | `<base>` argument per command | `gitflow.branch.<type>.startPoint` |
| Merge target of a type | Fixed by command (`master` and `develop`) | `gitflow.branch.<type>.parent` |
| Merge strategy | `gitflow.<type>.finish.{squash,rebase,no-ff}`, `release.finish.ff-master` | `upstreamStrategy`, `downstreamStrategy`; `gitflow.<type>.finish.{merge,squash,rebase,no-ff,ff,ff-only}` |
| Tag on finish | `gitflow.{release,hotfix}.finish.notag`, `sign`, `signingkey`, `message`, `messagefile`, `--tagname` | `gitflow.branch.<type>.tag`; `gitflow.<type>.finish.{tag,notag,sign,signingkey,message}`, `--tagname` |
| Back-merge | `gitflow.{release,hotfix}.finish.nobackmerge`, `release.finish.nodevelopmerge` | `autoUpdate` on the child base branch |
| Merge commit messages | — | `gitflow.<type>.finish.mergemessage`, `updatemessage` (placeholders `%b`, `%p`) |
| Push after finish | `gitflow.<type>.finish.push`; `release.finish.pushproduction`, `pushdevelop`, `pushtag` | `gitflow.<type>.finish.push`, `pushtag` |
| Branch deletion | `keep`, `keepremote`, `keeplocal`, `force_delete` | `keep`, `keeplocal`, `keepremote`, `force-delete` |
| More than one hotfix | `gitflow.multi-hotfix` | No limit found |
| Shared team config | — (local `.git/config`) | Committed `.gitflow` file, copied into local config (`init --shared`, `config sync`) |

Sources: [avh] `git-flow-init`, `git-flow-release` l. 646–693, `git-flow-hotfix` l. 388–402, wiki Reference: Configuration; [next] `gitflow-config.5.md`, `git-flow-init.1.md`.

## 4. This repository against the sources

- Branch names: `main`, `develop`, `feature/<name>`, `bugfix/<name>`, `release/<semver>`, `hotfix/<name>` (`AGENTS.md`). This matches the tool defaults with `main` as production (git-flow-next default).
- Version: `release/X.Y.Z` carries the version in its name, like both tools. `hotfix/<name>` carries **no** version: `release-version.ts` adds 1 to the patch of the latest `v*` tag. Both tools instead take the hotfix version as the branch name (`hotfix/<version>`), and nvie bumps it by hand.
- Tag: `release.ts` makes the GitHub release `v<version>` on the merge commit after the pull request into `main` merges. So the tag prefix is `v`, not the tools' empty default, and the tag is set by CI, not by a local finish command.
- Merges go through pull requests with merge commits, not through a local `finish`; feature and bugfix merge into `develop`, release and hotfix into `main` (`AGENTS.md`, `check-source-branch.ts`).
- Back-merge: `back-merge.ts` opens a pull request from `main` into `develop`. This is the tools' default (production into development), not nvie's (release branch into development).
- Hotfix with an open release branch: no rule in this repo. nvie's exception is not implemented.
