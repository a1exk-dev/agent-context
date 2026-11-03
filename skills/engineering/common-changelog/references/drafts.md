# Drafts

The Write job uses this file when the caller gives no change text, for example "add a changelog entry for this branch" or "Release the changelog as 1.3.0". A draft is an item that this skill writes from the Git history and the uncommitted changes, not from the change text of a caller. When the caller gives change text, do not make a draft.

A request that points to a change but gives no text for it also has no change text, for example "update CHANGELOG.md for this fix". The draft covers all user changes that "When you find the changes" gives, not only the change that the request points to.

## When the caller asks for a release

1. If the Unreleased section has one or more items, do not make a draft. The release entry gets only the items of the Unreleased section.
2. Then do steps 1 to 5 of "When you find the changes" to find the user changes. In the report, give each user change that the Unreleased section does not list, for example `#7 feat: add search option`. Do not add these changes to the release entry.
3. If the Unreleased section has no items, or `Unreleased` is `off`, make a draft. The draft goes into the release entry.

## When you find the changes

1. Find the newest release entry in the changelog. Run `git tag --list` and find the tag of that release: `vX.Y.Z` or `X.Y.Z` for `## [X.Y.Z]`.
   - If the changelog has no release entry, use the full Git history.
   - If the newest release entry has no tag, ask the Operator for the change text or a start commit. With no human, stop and do not change a file. In the report, give the missing tag, for example `v1.2.0`, and ask for the change text or a start commit.
2. Run `git log --format='%h %an %s' <tag>..HEAD` to find the commits. With no tag, run `git log --format='%h %an %s'`. For each merge commit of a pull request, run `git log --format='%h %an %s' <merge commit>^1..<merge commit>^2` to find the commits of that pull request.
3. Run `git status --porcelain` and `git diff HEAD` to find the staged and unstaged changes. Do not use the changes to the changelog and to the Changelog policy.
4. Remove each change that the changelog lists. The changelog lists a change when an item has the same pull-request reference, the same commit reference, or the same change. When an item has the reference of a pull request, the changelog lists each commit of that pull request.
5. Keep only the changes that a user of the project can see. Skip each change that changes only dotfiles, dev dependencies, or tests, and each refactor. Commit types `test` and `refactor`, and a `chore` that bumps a dev dependency, are examples. Record each commit and each uncommitted file that you skip.
6. If no user change stays, stop and do not change a file. In the report, tell that you found no user change, and give each commit and each file that you skipped.

## When you write the draft

1. Find the group of each user change from its commit type: `feat` gives `Added`, and `fix` gives `Fixed`. A breaking change, for example `feat!` or a `BREAKING CHANGE:` footer, gives `Changed`. When the commit type gives no group, or the change is not committed, find the group from the diff.
2. Write one item for all user changes. Start it with a verb in the imperative mood, and name each change, for example "Add search option and fix `slugify()` keeping leading spaces".
3. Put the item in the first group of the sequence `Changed`, `Added`, `Removed`, `Fixed` that has a user change. When a user change is breaking, put the item in `Changed` with the prefix `**Breaking:** `.
4. Take the references from the user changes in the sequence of their groups, with the changes of the item group first. Take only the kinds of the `References` Setting.
   - Under the Unreleased section, write no commit reference.
   - In a release entry, write the commit reference of the first user change. For a pull request, use its merge commit.
   - An uncommitted change has no reference.
   - Write a maximum of 2 references. In the report, give each reference that you did not write.
5. When `Authors` is `on`, write the author of each committed user change that the draft covers, as the Write job tells you. An uncommitted change has no author.
6. Put the item where "When you find the version" in `references/release-entries.md` tells you. On a branch that the Release branches Setting lists, the draft goes into the release entry.

## When Draft approval is on

1. When `Draft approval` is `off`, write the draft. Do not ask for approval.
2. When `Draft approval` is `on`, show the draft to the Operator and ask for approval before you change a file. When the Operator approves the draft, write the draft.
3. With no human, stop and do not change a file. In the report, show the draft and tell that it waits for the approval of the Operator.

## When you write the report of a draft

Add these parts to the report:

- Tell that the item is a draft. Use the word "draft".
- Give each commit and each uncommitted file that the draft covers.
- Give each commit and each uncommitted file that the draft skips.
