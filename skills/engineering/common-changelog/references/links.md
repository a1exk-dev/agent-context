# Links

The Write job and the Review job use these URL forms. Take each URL form from this file, not from the links in the changelog. New links obey this file. Old links change only when the caller asks for a change to them.

This skill knows 3 hosts: GitHub, GitLab, and Bitbucket Cloud. Each other host is an unknown host, for example Gitea, Forgejo, and Codeberg.

## When you find the host

1. If `Host` is `none`, do not run `git remote`. Write no reference and no version link, and ask no question about links. Write each release heading with no brackets, for example `## 1.3.0 - 2026-10-01`.
2. Run `git remote get-url origin`. Use only the remote `origin`. If the command gives an error, the project has no remote, also when it has a different remote.
3. Find the host and the path in the URL. The URL has one of these forms:
   - `https://<host>/<path>`, for example `https://bitbucket.org/example/demo.git`.
   - `ssh://<user>@<host>:<port>/<path>`, for example `ssh://git@ssh.github.com:443/example/demo.git`.
   - `<user>@<host>:<path>`, for example `git@gitlab.com:grp/sub/demo.git`. This form has no `/` before the first `:`.
4. Remove the user part and the port. From the path, remove a `/` at the start or at the end, and one `.git` at the end. Keep each level of the path. For example, `git@gitlab.com:grp/sub/demo.git` gives the host `gitlab.com` and the path `grp/sub/demo`.
5. Change the host `ssh.github.com` to `github.com`. Change the host `ssh.bitbucket.org` to `bitbucket.org`.
6. The base URL is `https://<host>/<path>`.
7. When `Host` is `github`, `gitlab`, or `bitbucket`, use the URL forms of that host, also for a different hostname. For example, `Host: gitlab` with the base URL `https://github.com/example/demo` gives the GitLab forms.
8. When `Host` is `auto`, use the hostname to find the URL forms:
   - `github.com`, or a hostname that ends with `.ghe.com`: the GitHub forms.
   - `gitlab.com`: the GitLab forms.
   - `bitbucket.org`: the Bitbucket Cloud forms.
   - Each other hostname is an unknown host. Examples are a custom domain such as `git.example.com`, a hostname that contains "gitlab" such as `gitlab.example.com`, and an SSH alias such as `github-work`.
9. When the project has no remote, or `Host` is `auto` and the host is unknown, do "When you cannot make links".

## When you cannot make links

Do these steps only in a Write job that writes a reference or a version link. The Review job asks no question.

1. Ask the Operator one question, as "When you ask the Operator a question" in `SKILL.md` tells you. That section also tells you when there is no human. Give these options:
   - For an unknown host, give the 4 options `github`, `gitlab`, `bitbucket`, and `No references`.
   - For no remote, give the options `No references` and `Stop`.
2. When the Operator selects a host, change the line `- Host: auto` in the Changelog policy to `- Host: <host>`, for example `- Host: gitlab`. Then use the URL forms of that host.
3. When the Operator selects `No references`, change the line to `- Host: none`. Then do step 1 of "When you find the host".
4. When the Operator selects `Stop`, stop and do not change a file.
5. Do not stage or commit the change to the Changelog policy. In the report, give the changed line.
6. If there is no human, do not change the Changelog policy. Write the items with no references, and write no version link. Write each release heading with no brackets. In the report, give the cause:
   - For an unknown host, give the hostname. Tell the Operator that the `Host` Setting gives the URL forms of a host, for example `- Host: gitlab`.
   - For no remote, tell that the project has no remote `origin`.

## When you write a link

Write each link after the base URL in these forms:

| Link | GitHub | GitLab | Bitbucket Cloud |
|---|---|---|---|
| Commit | `/commit/<sha>` | `/-/commit/<sha>` | `/commits/<sha>` |
| Pull request | `/pull/<n>`, text `#<n>` | `/-/merge_requests/<n>`, text `!<n>` | `/pull-requests/<n>`, text `#<n>` |
| Issue | `/issues/<n>`, text `#<n>` | `/-/issues/<n>`, text `#<n>` | A Jira issue, as "When you write a Jira issue reference" tells you |
| Version link, `Version links: release` | `/releases/tag/<tag>` | `/-/releases/<tag>` | `/commits/tag/<tag>` |
| Version link, `Version links: compare` | `/compare/<previous tag>...<tag>` | `/-/compare/<previous tag>...<tag>` | `/commits/tag/<tag>` |

- The text of a commit link is the short SHA in a code span, for example `` [`3f2a9c1`](https://github.com/example/demo/commit/3f2a9c1) ``.
- On GitLab, a merge request is the pull request. Its text is `!<n>`, for example `[!6](https://gitlab.com/grp/sub/demo/-/merge_requests/6)`, also when the caller says "pull request #6".
- On Bitbucket Cloud, both values of `Version links` give the tag view `/commits/tag/<tag>`. Do not write a compare URL for Bitbucket Cloud.
- `<tag>` is the exact Git tag, for example `v1.3.0`. Put each link definition at the bottom of the file, with the latest version first.

Each host writes a different message in the merge commit of a pull request. Use this message to find the merge commit and the number of a pull request:

| Host | Merge commit message |
|---|---|
| GitHub | `Merge pull request #5 from alice/truncate` |
| GitLab | `Merge branch 'alice/truncate' into 'main'`, with the line `See merge request grp/sub/demo!5` |
| Bitbucket Cloud | `Merged in alice/truncate (pull request #5)` |

## When you write a Jira issue reference

Do these steps only when the URL forms are the Bitbucket Cloud forms and the `References` Setting has `issues`. GitHub and GitLab do not use Jira.

1. Find a Jira key in the branch name and in the commit messages of the change. A Jira key has the form `[A-Z][A-Z0-9]+-\d+`, for example `APP-42` in `feature/APP-42-login`.
2. If you find no Jira key, write no issue reference.
3. If the session has a Jira MCP tool, get the URL of the issue from that tool.
4. Else, ask the Operator for the link of the issue, with the option `Skip`. Tell the Operator that a Jira MCP server removes this question.
5. If the Operator selects `Skip`, or there is no human, write no issue reference.
6. Write the reference as `([APP-42](<URL>))`. Do not write the Jira site URL in the Changelog policy.

## When you review links

Do these steps in the Review job, with the host of "When you find the host". Do not ask a question.

1. When the host is known, each link in a different URL form is a finding with the severity `error` and §2.4.2. A known host is a host of GitHub, GitLab, or Bitbucket Cloud, or a host that the `Host` Setting gives. The fix gives the correct form, for example `/commit/<sha>`.
2. When `Host` is `auto` and the host is unknown, or the project has no remote, do not examine the URL forms. Each item with no reference is one finding with the severity `warning` and §2.4.2, also in a release entry.
3. When `Host` is `none`, make no finding about a missing reference or a missing version link. A release heading with no brackets is correct.
4. For each value of `Host`, a reference that is not a Markdown link is a finding of §2.4.2, for example `(#6)` with no URL.
5. A missing Jira issue reference is not a finding.
