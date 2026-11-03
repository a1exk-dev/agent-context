# Release entries

The Write job uses this file to find the version, to make a release entry, to write a notice, and to mark a yanked release.

## When you ask the Operator a question

- Ask with the question tool of the platform. Give 2 or 3 options.
- There is no human when the platform has no question tool or the question tool gives an error. This file tells you what to do in each case with no human.

## When you find the version

Do these steps before you put an item in a section. Never calculate a version, for example from the last tag or from the type of the changes.

1. Find the version that the caller gives, for example `1.3.0` in "Release the changelog as 1.3.0".
2. When `Release branches` is not `off`, run `git branch --show-current`. Find if the current branch is a branch that the Release branches Setting lists. Do not read a different branch name, for example `develop`, `main`, or `feature/x`.
3. On a branch that the Release branches Setting lists, `<rest>` can be a semver version, for example `1.3.0` in `release/1.3.0`. That version is the branch version.
4. If the caller gives a version and the branch version is different, stop. Do not change a file. Ask the Operator which version to use, and give the 2 versions. With no human, give this question in the report.
5. On a branch that the Release branches Setting lists, each Write job makes a release entry, also for a request to add an item. Use the branch version. If there is no branch version, use the version of the caller.
6. If the current branch is a branch that the Release branches Setting lists and there is no version, ask the Operator for the version. With no human, stop, do not change a file, and ask for the version in the report.
7. On a different branch, when the caller gives a version, make a release entry with that version.
8. On a different branch, when the caller gives no version and `Unreleased` is `on`, put the item in the Unreleased section.
9. If the current branch is a different branch, the caller gives no version, and `Unreleased` is `off`, ask the Operator for the version. With no human, stop, do not change a file, and ask for the version in the report.

## When you make a release entry

1. Find the date of today with `date +%F`.
2. Write the heading `## [X.Y.Z] - YYYY-MM-DD`. When there is no version link, write `## X.Y.Z - YYYY-MM-DD`, with no brackets.
3. Put the release entry directly after `# Changelog`:
   - If the changelog has a release entry with the same version, use that entry.
   - Else, when `Unreleased` is `on` and the changelog has an Unreleased section, change its heading into the release heading. Keep its groups and items.
   - Else, add the release entry.
4. Put the item of the caller in its group of the release entry, as the Write job tells you for the Unreleased section.
5. For each item of the release entry that has no commit reference, find its commit in the Git history. For a pull request, use its merge commit, for example the commit `Merge pull request #5 from alice/truncate`. Run `git log --oneline` from the newest release tag to find the merge commits.
6. Write the commit reference with the short SHA of 7 characters, as `references/links.md` tells you.
7. Write the other references of each item as the `References` Setting tells you. Remove each reference of a kind that the Setting does not list.
8. When an item has more than 2 references, keep the commit reference and the pull request. Remove the issue reference, because the pull request is the better starting point. In the report, give each reference that you removed.
9. When `Authors` is `on`, write the author of each item. The author of a pull request is the author of its commits, not of the merge commit. Find the authors with `git log --format=%an <merge commit>^1..<merge commit>^2`. For the change of a bot, write the person who merged the change. When `Authors` is `off`, remove the authors from the items of the release entry.
10. Write the version link as the `Version links` Setting tells you:
    - `release`: the release URL of `references/links.md`.
    - `compare`: the compare URL of `references/links.md`. The previous tag is the tag of the newest release entry before this release.
    - `off`: no link definition and no brackets in the heading.
11. Write the tag of the version link in the form of the tags in `git tag`. For example, when the tag of 1.2.0 is `v1.2.0`, the tag of 1.3.0 is `v1.3.0`.
12. Put the link definition at the bottom of the file, above the link definitions of older versions.

## When you write a notice

A notice is a paragraph of one sentence in italics, for example `_This release is yanked: it breaks install._`. Put the notice directly after the release heading, with a blank line before and after it. A release has a maximum of one notice.

1. Write the notice that the caller gives.
2. When a release entry has no groups, write a notice that tells why.
3. When `Notice` is `major` and the release is a major release, ask the Operator for the text of an upgrade-guide notice. A major release changes X of `X.Y.Z`, for example from 1.2.0 to 2.0.0.
4. If there is no human, write no upgrade-guide notice. In the report, tell that you did not ask for an upgrade-guide notice, because there is no human.

## When you mark a release as yanked

Do this when the caller tells you that a release is yanked.

1. Find the release entry of that version. Do not change its heading. Do not add a `[YANKED]` tag.
2. Write a notice that tells that the release is yanked and gives the cause from the caller. Keep the groups and items of the entry after the notice.
3. If the entry has a notice, write one notice that gives the two facts.
4. Do not change a different line of the changelog.
