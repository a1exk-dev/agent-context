# Commit policy

- Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Scopes are optional.
- Include a `Refs: #<issue-number>` footer in commits that work on an issue.
- Apply the commit format and approval policy to every commit, including merge commits; this policy overrides skill defaults.
- After approval, use the reviewed message without rewriting it.
- Present verified changes and the proposed message for human review. Ask one question with `Commit`, `Request changes`, and `Reject` options when no decision is pending.
- A `Commit` decision authorizes only the reviewed diff and message for one commit. Apply requested changes, verify them, and present them again. Leave rejected work uncommitted.

## When GitHub merges the pull request from `main` into `develop` automatically

- Do not ask for approval of the merge commit that has the message `chore: merge main v<semver> into develop (#<n>)`, because no agent makes this commit.
