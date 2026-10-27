# Research: URL forms of GitHub, GitLab, and Bitbucket Cloud for commit, pull-request, issue, tag, and compare links

<!-- cspell:ignore vweevers hallmark sheetsee jlord linguist altssh Githost githost scp insteadOf pushInsteadOf iid iids userinfo Gitea Forgejo Codeberg GHES semgrep GLFM reponame -->

Question (issue #88): Which URL forms do GitHub, GitLab, and Bitbucket Cloud use for commit, pull-request, issue, tag, and compare links? Which references does each host link automatically in rendered Markdown, and do issues and pull requests share one number space? How do you get the host and the repository path from the `origin` remote URL? What does Common Changelog say about links when a project has no remote or an unknown host?

Scope: GitHub (github.com and GitHub Enterprise Server), GitLab (gitlab.com and self-managed, with subgroups and the `/-/` segment), and Bitbucket Cloud. Gitea and Forgejo (and Codeberg) were left out by operator decision on 2026-10-27.

Sources, read on 2026-10-27:

- GitHub Docs, Markdown source through `https://docs.github.com/api/article/body?pathname=…`: [Autolinked references and URLs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls) (also the [GHES 3.22 version](https://docs.github.com/en/enterprise-server@latest/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls)), [Comparing commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits) (and its [GHES version](https://docs.github.com/en/enterprise-server@latest/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)), [Branches: three-dot and two-dot comparisons](https://docs.github.com/en/pull-requests/reference/branches), [Linking to releases](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases), [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases), [REST: issues](https://docs.github.com/en/rest/issues/issues), [REST: pulls](https://docs.github.com/en/rest/pulls/pulls), [Using SSH over the HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port), [About GitHub Enterprise Cloud with data residency](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency).
- GitLab docs and source, `gitlab-org/gitlab` at `master` commit `227bfdd`: [`doc/user/markdown.md`](https://docs.gitlab.com/user/markdown/) (GitLab Flavored Markdown, section "GitLab-specific references"), [`doc/user/project/releases/_index.md`](https://docs.gitlab.com/user/project/releases/), [`doc/user/project/repository/branches/_index.md`](https://docs.gitlab.com/user/project/repository/branches/), [`doc/user/project/repository/compare_revisions.md`](https://docs.gitlab.com/user/project/repository/compare_revisions/), [`doc/user/work_items/_index.md`](https://docs.gitlab.com/user/work_items/), [`doc/user/group/subgroups/_index.md`](https://docs.gitlab.com/user/group/subgroups/), [`doc/development/routing.md`](https://docs.gitlab.com/development/routing/), [`doc/install/relative_url.md`](https://docs.gitlab.com/install/relative_url/), [`config/routes/repository.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/config/routes/repository.rb), [`lib/gitlab/git/commit.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/lib/gitlab/git/commit.rb), [`app/models/commit.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/models/commit.rb), [`app/models/commit_range.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/models/commit_range.rb).
- Bitbucket Cloud: [Markup comments](https://support.atlassian.com/bitbucket-cloud/docs/markup-comments/), [Repository tags](https://support.atlassian.com/bitbucket-cloud/docs/repository-tags/), [Configure SSH and two-step verification](https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/), [Set up personal SSH keys on Linux](https://support.atlassian.com/bitbucket-cloud/docs/set-up-personal-ssh-keys-on-linux/), the [REST API 2.0 OpenAPI file](https://dac-static.atlassian.com/cloud/bitbucket/swagger.v3.json) (endpoint `/repositories/{workspace}/{repo_slug}/diff/{spec}`), the [Bitbucket Cloud changelog](https://developer.atlassian.com/cloud/bitbucket/changelog/) (entry of 20 August 2026), and live responses of `api.bitbucket.org/2.0` for the public repository `atlassian/atlassian-connect-express`.
- Git: [`git-clone`, section GIT URLS](https://git-scm.com/docs/git-clone#_git_urls) (page "last updated in 2.54.0") and `git help remote` (`get-url`).
- Common Changelog: [`README.md`](https://github.com/vweevers/common-changelog/blob/bed3ea6/README.md) at `main` commit `bed3ea6`, rendered at [common-changelog.org](https://common-changelog.org/). The linter [`remark-common-changelog`](https://github.com/vweevers/remark-common-changelog) v2.3.2 (`README.md`, `index.js`).
- Observed: HTTP status codes of `curl` requests to github.com, gitlab.com, and bitbucket.org on 2026-10-27. These rows are marked "observed". They show what the host did on that day, not a documented promise.

## Summary

- Templates use these placeholders: `{base}` is the web root (scheme, host, optional port, and for self-managed GitLab an optional relative root such as `/gitlab`); `{path}` is the repository path (`owner/repo`, or `group/sub/project` on GitLab); `{sha}` is a commit hash; `{n}` is an issue or pull-request number; `{tag}` is the git tag of the release; `{prev}` is the tag of the previous release.
- GitHub and GitHub Enterprise Server use the same paths. GitLab puts every project route after `/-/`. Bitbucket Cloud has no releases feature, and it removed its native issue tracker on 20 August 2026.
- Number spaces: GitHub issues and pull requests share one number space (`#n` can be either). GitLab issues (`#n`) and merge requests (`!n`) are separate objects with separate numbers. Bitbucket pull requests have their own numbers, and Bitbucket Cloud no longer has issues. So `(#6)` in a changelog is a pull request or an issue on GitHub, an issue on GitLab, and nothing on Bitbucket Cloud.
- Auto-links in a `CHANGELOG.md` file: GitHub does **not** link `#123` or a SHA in files in a repository (documented). GitLab says that GitLab Flavored Markdown, with its references, applies to "Markdown documents inside repositories". For Bitbucket Cloud repository files, no source says. So a changelog must write each link as an explicit Markdown link to be portable. Common Changelog requires this anyway: "Each reference must be a Markdown link."
- Remote URL: strip the userinfo (`user@`, `user:token@`), the port for the web URL, a trailing `/`, and one trailing `.git`. The scp-like form `[user@]host:path` has no port and is recognized only "if there are no slashes before the first colon". The SSH host is not always the web host (`ssh.github.com`, `ssh.bitbucket.org`, SSH config aliases). Only the three public hostnames identify the host reliably. A custom domain cannot be classified from the URL alone.
- Common Changelog has no rule for a project with no remote or an unknown host. The version link is a **should** (§2.2). Each reference **must** be a Markdown link (§2.4.2). The standard's own examples drop the links "for brevity" and then show `(#28)` and (`` `01e3a64` ``). A project with no host therefore cannot meet §2.4.2 to the letter; the standard is silent about that case.

## 1. Summary table

"doc" = stated in a primary doc. "src" = read in the host's source code. "API" = the URL that the host's own REST API returns as the `html` link. "obs" = observed only. "unverified" = no primary source found.

| Link type | GitHub (github.com, GHES) | GitLab (gitlab.com, self-managed) | Bitbucket Cloud |
| - | - | - | - |
| Commit | `{base}/{path}/commit/{sha}` (doc) | `{base}/{path}/-/commit/{sha}` (src, obs) | `{base}/{path}/commits/{sha}` (API) |
| Pull / merge request | `{base}/{path}/pull/{n}` (doc) | `{base}/{path}/-/merge_requests/{n}` (obs) | `{base}/{path}/pull-requests/{n}` (API) |
| Issue | `{base}/{path}/issues/{n}` (doc) | `{base}/{path}/-/issues/{n}`; 18.10+ redirects to `/-/work_items/{n}` (doc) | none: removed 2026-08-20 (doc) |
| Release for a tag | `{base}/{path}/releases/tag/{tag}` (obs; Common Changelog example) | `{base}/{path}/-/releases/{tag}` (doc) | none (no releases feature found; unverified absence) |
| Tag / tree view | `{base}/{path}/tree/{tag}` (obs) | `{base}/{path}/-/tree/{tag}` (src, obs); tag page `{base}/{path}/-/tags/{tag}` (src, obs) | `{base}/{path}/commits/tag/{tag}` (API); `{base}/{path}/src/{tag}/` (unverified) |
| Compare two tags | `{base}/{path}/compare/{prev}...{tag}` (three-dot, doc); `..` also accepted (doc) | `{base}/{path}/-/compare/{prev}...{tag}` (doc); `..` also accepted (src) | `{base}/{path}/branches/compare/{tag}%0D{prev}` (unverified, newer ref first) |
| Latest release | `{base}/{path}/releases/latest` (doc) | `{base}/{path}/-/releases/permalink/latest` (doc) | none |

`{base}` per host: `https://github.com`; GHES `https://HOSTNAME`; GitHub Enterprise Cloud with data residency uses "a dedicated subdomain of GHE.com" (doc); `https://gitlab.com` or the self-managed host, possibly with a relative root; `https://bitbucket.org`.

## 2. GitHub (github.com and GitHub Enterprise Server)

### 2.1. URL forms

- **Commit.** The autolink table gives the commit URL `https://github.com/jlord/sheetsee.js/commit/a5c3785ed8d6a35868bc169f07e40e889087fd2e` ([Autolinked references](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls)). The docs do not state that a short SHA works in the URL path. Observed: `/commit/bed3ea6` (7 characters) and even `/commit/bed3` (4 characters) return 200 on github.com for `vweevers/common-changelog`. The comparing-commits page uses short SHAs in a compare URL: "this URL uses the shortened SHA codes to compare commits `f75c570` and `3391dcc`" ([Comparing commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)).
- **Pull request and issue.** The autolink table links `#26` to `https://github.com/jlord/sheetsee.js/issues/26` and `github-linguist/linguist#4039` to `https://github.com/github-linguist/linguist/pull/4039`. Observed: `/issues/22` of a pull request redirects (302) to `/pull/22`, and `/pull/13` of an issue redirects to `/issues/13`. So either path works for either object.
- **Release.** GitHub Docs give only the latest-release form: "adding `releases/latest` to the end of a repository's URL. For example, … `https://github.com/octo-org/octo-repo/releases/latest`." For older releases they say "right click the title, and copy the URL" ([Linking to releases](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)). The form `/releases/tag/{tag}` is not in GitHub Docs (unverified as documented). Common Changelog §2.2 uses it: `[1.0.1]: https://github.com/owner/name/releases/tag/v1.0.1`. Observed: `vweevers/hallmark/releases/tag/v5.0.2` returns 200 and `/releases/tag/5.0.2` returns 404, so `{tag}` is the exact git tag, `v` prefix included. "Releases are based on Git tags" ([About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)).
- **Tag/tree view.** `/tree/{tag}` is not in the pages read (unverified as documented). Observed: `vweevers/hallmark/tree/v5.0.2` returns 200.
- **Compare.** "append `/compare` to your repository's path. The compare page uses `base` as the starting point and `compare` as the endpoint." For tags: "Select the older tag from the `base` dropdown menu. Select the newer tag from the `compare` dropdown menu." And: "If a branch and a tag have the same name, the branch is used. To compare the tag, add `tags/` before the tag name." The two-dot example is `compare/f75c570..3391dcc`; the three-dot example is `96d29b7~5...96d29b7` ([Comparing commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)). Order: older (`{prev}`) first, newer (`{tag}`) second.
- **Two-dot vs three-dot.** "Three-dot | `git diff A...B` | The most recent common commit of both branches (merge base) and the most recent version of the topic branch." "Two-dot | `git diff A..B` | The most recent state of the base branch … and the most recent version of the topic branch." "On GitHub, the Git committish references in a two-dot diff comparison must be pushed to the same repository or its forks." ([Branches](https://docs.github.com/en/pull-requests/reference/branches)). For two release tags on one line of history the two forms show the same diff; for tags on diverged branches (for example a patch release on a maintenance branch) they differ. The REST compare endpoint "expects the format BASE...HEAD" ([REST: commits](https://docs.github.com/en/rest/commits/commits)).

### 2.2. GitHub Enterprise Server

The GHES 3.22 docs use the same paths with a host placeholder: "Navigate to `https://HOSTNAME/OWNER/REPOSITORY/compare`" ([GHES comparing commits](https://docs.github.com/en/enterprise-server@latest/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)). The REST quick start uses `http(s)://HOSTNAME/api/v3/repos/REPO-OWNER/REPO-NAME/issues`. So `{base}` is `https://HOSTNAME`, with no path prefix. The GHES autolink page still shows `github.com` example URLs.

### 2.3. Auto-links and number space

- "Within conversations on GitHub, references to issues and pull requests are automatically converted to shortened links." Forms: `#26`, `GH-26`, `jlord/sheetsee.js#26`.
- **"Autolinked references are not created in wikis or files in a repository."** The same note is on the GHES page. A `CHANGELOG.md` viewed on GitHub does not turn `(#6)` or a bare SHA into a link.
- SHAs: "References to a commit's SHA hash are automatically converted into shortened links to the commit on GitHub." Forms: the full SHA, `jlord@SHA`, `jlord/sheetsee.js@SHA`. The page states no minimum length (unverified).
- Number space: the docs do not say "shared number space" in those words. They say: "GitHub's REST API considers every pull request an issue, but not every issue is a pull request" ([REST: issues](https://docs.github.com/en/rest/issues/issues)) and "Pull requests are a type of issue" ([REST: pulls](https://docs.github.com/en/rest/pulls/pulls)). The table names `#` as "issue or pull request number". With the observed redirects, `#n` names exactly one object, which is either an issue or a pull request.

## 3. GitLab (gitlab.com and self-managed)

### 3.1. The `/-/` segment and subgroups

- "we introduced the `/-/` scope. The purpose of it is to separate group or project paths from the rest of the routes." "Every project route must be under the `/-/` scope, except cases where a Git client or other software requires something different." Example: `gitlab-org/serverless/runtimes/-/settings/repository` ([routing](https://docs.gitlab.com/development/routing/), a development doc).
- Subgroups can "Be nested up to 20 levels" ([subgroups](https://docs.gitlab.com/user/group/subgroups/)). So `{path}` is everything between the host (and relative root) and `/-/`, for example `gitlab-org/security-products/analyzers/semgrep` (observed: `…/semgrep/-/merge_requests/1` returns 200).
- Old paths without `/-/` still redirect. Observed on gitlab.com: `gitlab-org/gitlab-runner/commit/{sha}` returns 301 to `/-/commit/{sha}`. Do not rely on this; write `/-/`.
- Self-managed GitLab can "be installed under a relative URL, for example `https://example.com/gitlab`" ([relative URL](https://docs.gitlab.com/install/relative_url/)). The relative root is part of `{base}` and cannot be seen in an SSH remote.

### 3.2. URL forms

- **Commit.** Route: `resources :commit, only: [:show], constraints: { id: Gitlab::Git::Commit::SHA_PATTERN }` ([`config/routes/repository.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/config/routes/repository.rb)), with `MIN_SHA_LENGTH = 7` and `RAW_SHA_PATTERN = "\\h{#{MIN_SHA_LENGTH},#{MAX_SHA_LENGTH}}"` ([`lib/gitlab/git/commit.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/lib/gitlab/git/commit.rb)). So the full SHA and a short SHA of 7 or more hex characters are accepted. Observed: 8 characters return 200; 5 characters do not resolve.
- **Merge request.** `{base}/{path}/-/merge_requests/{n}`. Observed (200), and the REST API returns `web_url` `https://gitlab.com/gitlab-org/gitlab-runner/-/merge_requests/2`. Not found as a template in the docs read (documented only by example links in the docs).
- **Issue.** "URLs that contain `/epics/:iid` or `/issues/:iid` automatically redirect to `/work_items/:iid`" in GitLab 18.10 and later ([work items](https://docs.gitlab.com/user/work_items/)). The REST API now returns `web_url` `https://gitlab.com/gitlab-org/gitlab-runner/-/work_items/2` for issue 2. `/-/issues/{n}` works on old and new versions, so it is the safer template for self-managed instances of unknown version.
- **Release.** "`https://gitlab.com/gitlab-org/gitlab-runner/-/releases/v17.7.0#release`" and the latest-release permalink "`https://gitlab.example.com/namespace/project/-/releases/permalink/latest`" ([releases](https://docs.gitlab.com/user/project/releases/)).
- **Tag and tree.** Routes `resources :tags, only: [:index, :show, …]` and `get '/tree/*id'` ([`config/routes/repository.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/config/routes/repository.rb)). Observed: `/-/tags/v17.7.0` and `/-/tree/v17.7.0` return 200.
- **Compare.** Doc example: `https://gitlab.example.com/my-group/my-project/-/compare/main...feature-branch?format=diff` ([branches](https://docs.gitlab.com/user/project/repository/branches/)). Routes: `get '/compare/:from...:to/'` and `get '/compare/:from..:to/', … defaults: { straight: "true" }`. The compare doc: the default method "uses the `git diff <from>...<to>` Git command"; the other method "uses the `git diff <from> <to>` Git command. It compares the actual commits directly" ([compare revisions](https://docs.gitlab.com/user/project/repository/compare_revisions/)). So `...` is the merge-base diff and `..` is the direct diff. Order: from (`{prev}`), then to (`{tag}`). Observed: both forms return 200.

### 3.3. Auto-links and number space

- GLFM is used in "Markdown documents inside repositories" (and comments, issues, merge requests, wikis, releases). GLFM "renders GitLab-specific references" ([GLFM](https://docs.gitlab.com/user/markdown/)). The page does not say that each reference type works in repository files; that a `CHANGELOG.md` renders `#6` as a link is unverified by rendering.
- Reference table: Issue `#123`, `GL-123`, or `[issue:123]`; Merge request `!123`; Commit `9ba12248`, `namespace/project@9ba12248`; "Commit range comparison" `9ba12248...b19a04f5`. Cross-project: `namespace/project#123`, `namespace/project!123`.
- SHA references match `\b\h{7,64}\b` (`WHOLE_WORD_COMMIT_SHA_PATTERN` from `SHA_PATTERN`, [`app/models/commit.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/models/commit.rb)). Range references need two SHAs of 7 or more characters with `..` or `...` (`STRICT_PATTERN`, [`commit_range.rb`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/models/commit_range.rb)).
- Number space: separate. `#` names an issue and `!` names a merge request. Observed: issue 2 ("Allow SSH authentication with pubkey") and merge request 2 ("Add a way to change some default settings.") of `gitlab-org/gitlab-runner` are different objects. A Common Changelog reference `(#6)` that means merge request 6 points to the wrong object on GitLab; it must be written `(!6)` with the link `{base}/{path}/-/merge_requests/6`.

## 4. Bitbucket Cloud

### 4.1. URL forms

- The REST API returns these `html` links (observed on `atlassian/atlassian-connect-express`): commit `https://bitbucket.org/atlassian/atlassian-connect-express/commits/fd61ca641c0db3ab42ad10bc1b2b7190033aee77`; pull request `https://bitbucket.org/atlassian/atlassian-connect-express/pull-requests/1`; tag `https://bitbucket.org/atlassian/atlassian-connect-express/commits/tag/v12.2.3`. The API accepts a short SHA (`/2.0/repositories/…/commit/fd61c` returns the full commit). Whether the web page `/commits/{short}` resolves is unverified: bitbucket.org answers 200 even for `/commits/nonexistent0`, so status codes prove nothing there.
- `{path}` is `{workspace}/{repo_slug}`. No nesting.
- **Issues.** "20 August 2026: Removal of native Bitbucket Cloud Issue tracker … the API endpoints that support Issue Tracker are now fully removed" ([changelog](https://developer.atlassian.com/cloud/bitbucket/changelog/), CHANGE-3071). Observed: `/2.0/repositories/{path}/issues/1` returns "CHANGE-3071 - Functionality has been deprecated". Issue links go to an external tracker (for example Jira), which Common Changelog calls "External tickets": `([JIRA-837](https://example.atlassian.net/browse/JIRA-837))`.
- **Releases.** No releases feature found in the Bitbucket Cloud docs read (unverified absence). The tag link above is the nearest target.
- **Compare.** Docs describe only the UI: "Select the More options ( ) button and select Compare branches or tags. From each dropdown, select the tag or branch … Select Compare. You'll see a diff, a list of commits, and any pull requests merged between the two versions." ([Repository tags](https://support.atlassian.com/bitbucket-cloud/docs/repository-tags/)). The web form `/branches/compare/{a}%0D{b}` (two refs joined by an encoded carriage return) comes only from community posts (unverified). The page did not render for an anonymous browser on 2026-10-27, so the argument order could not be checked. The REST diff endpoint documents its order, which is the reverse of git: "First commit: the commit containing the changes we wish to preview. Second commit: the commit representing the state to which we want to compare the first commit. **Note**: This is the opposite of the order used in `git diff`." Its separator is `..`, and with `topic=true` it "produces a 2-way three dot diff" ([OpenAPI, `/diff/{spec}`](https://dac-static.atlassian.com/cloud/bitbucket/swagger.v3.json)). If the web form follows the API, it is `{tag}%0D{prev}` (newer first) — unverified.

### 4.2. Auto-links and number space

- [Markup comments](https://support.atlassian.com/bitbucket-cloud/docs/markup-comments/): issue syntax `issue #number`, example `issue #88`; pull-request syntax `pull request #number`, example `pull request #1541`; changeset syntax `HEX_CHARS`: "The system links any changeset hash automatically also", example `9cc27f2`, no minimum length stated. "For items that are repository-specific, such as issues, pull requests, and commits, references to Bitbucket objects always refer to the current repository." The page scopes this to comments and commit messages; it does not mention repository files (unverified for `CHANGELOG.md`). The issue syntax on that page predates the issue tracker removal.
- Number space: pull requests and issues were separate (different syntaxes: `issue #n` vs `pull request #n`). Issues are gone. A bare `#6` is not a documented Bitbucket reference form.

## 5. Host and repository path from the `origin` remote URL

### 5.1. What git accepts

From [git-clone GIT URLS](https://git-scm.com/docs/git-clone#_git_urls):

- `ssh://[<user>@]<host>[:<port>]/<path-to-git-repo>`
- `http[s]://<host>[:<port>]/<path-to-git-repo>`
- `git://<host>[:<port>]/<path-to-git-repo>`
- scp-like, ssh only: `[<user>@]<host>:/<path-to-git-repo>`. "This syntax is only recognized if there are no slashes before the first colon. This helps differentiate a local path that contains a colon." The scp-like form has no port field.
- `~<username>` expansion: `ssh://[<user>@]<host>[:<port>]/~<user>/<path-to-git-repo>` and `[<user>@]<host>:~<user>/<path-to-git-repo>`.
- Local paths `/path/to/repo.git/` and `file:///path/to/repo.git/` — no host.
- `<transport>::<address>` for remote helpers.
- `url.<base>.insteadOf` and `pushInsteadOf` rewrite URLs. `git remote get-url`: "Configurations for insteadOf and pushInsteadOf are expanded here" (`git help remote`). So read the remote with `git remote get-url origin`, not from `.git/config`.

### 5.2. Parsing steps

1. `url = git remote get-url origin`. No remote, or a local path or `file://` URL: no host; see section 6.
2. If the URL has a scheme (`https://`, `http://`, `ssh://`, `git://`): parse it as a URL. Host = the hostname, lowercased. Drop the userinfo (`user@`, `user:token@`). Bitbucket documents `https://{username}@bitbucket.org/{workspace}/{repository}.git` ([SSH setup](https://support.atlassian.com/bitbucket-cloud/docs/set-up-personal-ssh-keys-on-linux/)). Path = the URL path.
3. Else, if it matches `^([^@/]+@)?([^:/]+):(.+)$` (no slash before the first colon): scp-like. Host = group 2; path = group 3.
4. Normalize the path: drop a leading `/`, a trailing `/`, and then one trailing `.git`. On GitLab, the whole remaining path (`group/sub/project`) is `{path}`.
5. For HTTPS, `{base}` = scheme + host + port + any prefix before `{path}`. But a relative root is indistinguishable from a group in the URL (`https://example.com/gitlab/group/project`): only the instance's configuration knows. For SSH, the port is the SSH port, not the web port; drop it and use `https://{host}`.

### 5.3. SSH host vs web host

- GitHub: "The hostname for port 443 is `ssh.github.com`, not `github.com`"; clone form `ssh://git@ssh.github.com:443/YOUR-USERNAME/YOUR-REPOSITORY.git` ([SSH over HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)). Map `ssh.github.com` to `github.com`.
- Bitbucket: docs show `git@bitbucket.org:<repo_owner>/<reponame>.git`, but the REST API on 2026-10-27 returned the SSH clone link `git@ssh.bitbucket.org:atlassian/atlassian-connect-express.git` (observed). Map `ssh.bitbucket.org` to `bitbucket.org`.
- SSH config aliases: Bitbucket's own docs show `git@bitbucket.org-{bitbucket_username}:{workspace}/{repo}.git` ([Configure SSH](https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/)), where the "host" is a `Host` entry in `~/.ssh/config`, not a DNS name. The real hostname is the `HostName` in that file (`ssh -G <alias>` prints it; not researched further).
- GitLab.com's alternative SSH host (`altssh.gitlab.com`) was not checked (unverified).

### 5.4. Which host is it?

- Reliable: hostname `github.com` (and `ssh.github.com`) → GitHub; `gitlab.com` → GitLab; `bitbucket.org` (and `ssh.bitbucket.org`) → Bitbucket Cloud; `*.ghe.com` → GitHub Enterprise Cloud with data residency ("a dedicated subdomain of GHE.com").
- Not reliable: any other hostname. A GHES instance and a self-managed GitLab both run on any domain the owner chooses (`HOSTNAME` in GitHub Docs, `gitlab.example.com` in GitLab Docs). A hostname that contains `gitlab` or `github` is a guess, not a fact. The remote URL carries no other signal. Asking the host's API over the network could tell, but that was not researched here. Safe behavior: treat the host as unknown and ask the operator, or record the host type in a project setting.

## 6. Common Changelog: links when there is no remote or an unknown host

### 6.1. What the standard says

- §1.2 (guiding principles): "Link each change to further information."
- §1.3 (prerequisites): "Project is under version control (this document assumes git)." "Each released version has a corresponding git tag." "Project adheres to Semantic Versioning." A hosting service is not a prerequisite.
- §2.2 (release links): "The version should link to further information. If the project is hosted on GitHub, link the version to a GitHub release that should contain the same content as the changelog entry, alongside useful GitHub features like assets and the compare view. Preferably use reference-style links to keep the unrendered Markdown form of the changelog readable." Strength: **should**. The only host named is GitHub.
- §2.4.2 (references): "For these reasons, changes must reference relevant commits, and should reference tickets or pull requests when available." "References must be written after (and on the same line as) a change … References must be wrapped in parentheses. … **Each reference must be a Markdown link.**" Strength: **must**.
- §2.4.2 forms: commits `` ([`53bd922`](https://github.com/owner/name/commit/53bd922)) `` and `` ([`owner/name@53bd922`](…)) ``; pull requests or issues `([#194](https://github.com/owner/name/issues/194))` and `([owner/name#194](…))`; external tickets `([JIRA-837](https://example.atlassian.net/browse/JIRA-837))`. All examples use github.com URLs; the standard gives no GitLab or Bitbucket form.
- No section addresses a project with no remote or an unknown host (searched for "remote", "host", "gitlab", "bitbucket": the only hit for `.gitlab` is a dotfile in the noise list of §3.2).

### 6.2. A reference without a link

The standard shows link-less references only in examples marked as abbreviated: "(links omitted for brevity)" before `- Prevent buffer overflow (#28) (Alice, Henry)` (§2.4), and "(links omitted)" before `` - **Breaking:** remove `write()` method from public API (`01e3a64`) `` (§2.3). So the shape without a link is the link text alone, still in parentheses: `(#28)` for a ticket or pull request and `` (`01e3a64`) `` for a commit. The standard presents these as shortened examples, not as a valid final form.

### 6.3. Consequence

- No remote or unknown host: the version link (§2.2, should) can be left out. The commit references (§2.4.2, must) can still be written, but not as links, so the entry breaks "Each reference must be a Markdown link." The standard does not grant an exception. A policy that writes `` (`53bd922`) `` without a link is a documented deviation, not compliance.
- The linter does not check references. It checks only the release link: `release-version-link` "Release version must have a link. The destination URL is not linted. In `fix` mode links are automatically inserted (to `https://github.com/OWNER/REPO/releases/tag/$tag`) requiring a nearby `package.json` with a `repository` field. The link is optional for the oldest (last listed) release." ([remark-common-changelog README](https://github.com/vweevers/remark-common-changelog#rules)). In `index.js`, `defaultReleaseUrl` builds `${githubUrl}/releases/tag/${tag}` from the repository URL that `find-githost` resolves, so the linter's fix mode knows only the GitHub form.

## 7. Open points

- GitHub `/releases/tag/{tag}` and `/tree/{tag}`: observed and used by Common Changelog, not found in GitHub Docs.
- GitHub minimum length of a SHA in a URL path or an autolink: not documented (4 characters worked in a URL on 2026-10-27).
- GitLab: whether `#n`, `!n`, and SHAs render as links inside a repository `CHANGELOG.md` was not checked by rendering.
- Bitbucket Cloud: the web compare URL and its argument order, short SHAs in web URLs, `/src/{tag}/`, and auto-links in repository files are unverified.
- Detecting GHES or self-managed GitLab on a custom domain through an API probe was not researched.
