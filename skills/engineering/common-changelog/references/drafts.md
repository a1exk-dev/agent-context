# Drafts

The Write job uses this file when the caller gives no change text, for example "add a changelog entry for this branch" or "Release the changelog as 1.3.0". A draft is an item that this Skill writes from the Git history and the uncommitted changes, not from the change text of a caller.

## Before you make a draft

- When the caller gives change text, do not make a draft.
- A request that points to a change but gives no text for it also has no change text, for example "update CHANGELOG.md for this fix". The draft covers all public changes that "When you find the changes" gives, not only the change that the request points to.

## When you ask the Operator a question

When this file tells you to ask the Operator, ask as "When you ask the Operator a question" in `SKILL.md` tells you. When there is no Operator, do the step of this file for that case.

## When the caller asks for a release

1. If the Unreleased section has one or more items, do not make a draft. The release entry gets only the items of the Unreleased section.
2. If the Unreleased section has one or more items, do steps 1 to 5 of "When you find the changes" to find the public changes. In the report, give each public change that the Unreleased section does not list, for example `#7 feat: add search option`. Do not add these changes to the release entry.
3. If the Unreleased section has no items, or `Unreleased` is `off`, make a draft. The draft goes into the release entry.

## When you find the changes

1. Find the newest release entry in the changelog. Run `git tag --list`. Find the tag of that release: `vX.Y.Z` or `X.Y.Z` for `## [X.Y.Z]` or `## X.Y.Z`.
   - If the changelog has no release entry, use the full Git history.
   - If the newest release entry has no tag, ask the Operator for the change text or a start commit. When there is no Operator, stop and do not change a file. In the report, give the missing tag, for example `v1.2.0`, and ask for the change text or a start commit.
2. Run `git log --format='%h %an %s' <tag>..HEAD` to find the commits. If the Operator gives a start commit, run `git log --format='%h %an %s' <start commit>..HEAD`. If the changelog has no release entry, run `git log --format='%h %an %s'`. For each merge commit of a pull request, run `git log --format='%h %an %s' <merge commit>^1..<merge commit>^2` to find the commits of that pull request.
3. Run `git status --porcelain` and `git diff HEAD` to find the staged and unstaged changes. Skip the changes to the changelog and to the Changelog policy.
4. Skip each change that the changelog lists. The changelog lists a change when an item has the same pull-request reference, the same commit reference, or the same change. When an item has a pull-request reference, the changelog lists each commit of that pull request.
5. Keep only the public changes: the changes that a person who uses the project can see. Skip each change that changes only dotfiles, dev dependencies, or tests, and each refactor, for example the commit types `test` and `refactor`. Also skip a `chore` that bumps a dev dependency. Record each commit and each uncommitted file that you skip.
6. If no public change stays, stop and do not change a file. In the report, tell that you found no public change, and give each commit and each uncommitted file that you skipped.

## When you write the draft

1. Find the section of the draft as "When you find the version" in `references/release-entries.md` tells you. On a branch that the Release branches Setting lists, the section of the draft is the release entry.
2. Find the group of each public change from its commit type: `feat` gives `Added`, and `fix` gives `Fixed`. A breaking change, for example `feat!` or a `BREAKING CHANGE:` footer, gives `Changed`. When the commit type gives no group, or the change is an uncommitted change, find the group from the diff.
3. Write one item for all public changes. Start the item with a verb in the imperative mood. Name each change in the item, for example "Add search option and fix `slugify()` keeping leading spaces".
4. Put the item in the first group of the sequence `Changed`, `Added`, `Removed`, `Fixed` that has a public change. When a public change is breaking, put the item in `Changed`. When a public change is breaking, start the item with the prefix `**Breaking:** `.
5. Take the references from the public changes in the sequence of their groups. Start with the changes of the group that contains the item. Take only the kinds of the `References` Setting.
   - Under the Unreleased section, write no commit reference.
   - In a release entry, write the commit reference of the first public change. For a pull request, use its merge commit.
   - An uncommitted change has no reference.
   - Write a maximum of 2 references. In the report, give each reference that you did not write.
6. When `Authors` is `on`, write the author of each committed public change that the draft covers, as step 7 of "When you do the Write job" in `SKILL.md` tells you. An uncommitted change has no author.
7. Record the section of step 1 for the draft. Do not change the changelog before you do "Before you put the draft in the changelog".

## Before you put the draft in the changelog

Put the draft in the section that step 7 of "When you write the draft" records.

1. When `Draft approval` is `off`, put the draft in the changelog. Do not ask for approval.
2. When `Draft approval` is `on`, show the draft to the Operator and ask for approval before you change a file. When the Operator approves the draft, put the draft in the changelog.
3. When `Draft approval` is `on` and there is no Operator, stop and do not change a file. In the report, show the draft and tell that the draft waits for the approval of the Operator.

## When you write the report of a draft

Add these parts to the report:

- Tell that the item is a draft. Use the word "draft".
- Give each commit and each uncommitted file that the draft covers.
- Give each commit and each uncommitted file that the draft skips.
