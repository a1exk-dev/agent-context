# Release entries

The Write job uses this file to find the version, to make a release entry, to write a notice, and to mark a yanked release.

## When you ask the Operator a question

Ask each question of this file as "When you ask the Operator a question" in `SKILL.md` tells you. The section "When you ask the Operator a question" in `SKILL.md` also tells you when there is no Operator. This file tells you what to do in each case when there is no Operator.

## When you find the version

Do these steps before you put an item in a section. Never calculate a version, for example from the last tag or from the type of the changes.

1. Find the version that the caller gives, for example `1.3.0` in "Release the changelog as 1.3.0".
2. When `Release branches` is not `off`, run `git branch --show-current`. Find if the current branch is a branch that the Release branches Setting lists. Do not read a different branch name, for example `develop`, `main`, or `feature/x`.
3. On a branch that the Release branches Setting lists, `<rest>` can be a semver version, for example `1.3.0` in `release/1.3.0`. That version is the branch version.
4. If the caller gives a version and the branch version is different, stop. Do not change a file. Ask the Operator which version to use, and give the 2 versions. When there is no Operator, give this question in the report.
5. On a branch that the Release branches Setting lists, make a release entry in each Write job, also for a request to add an item. Use the branch version. If there is no branch version, use the version of the caller.
6. On a branch that the Release branches Setting lists, there can be no branch version and no version from the caller. Then ask the Operator for the version. When there is no Operator, stop. Do not change a file. In the report, ask for the version.
7. On a different branch, when the caller gives a version, make a release entry with that version.
8. On a different branch, when the caller gives no version and `Unreleased` is `on`, put the item in the Unreleased section.
9. On a different branch, when the caller gives no version and `Unreleased` is `off`, ask the Operator for the version. When there is no Operator, stop. Do not change a file. In the report, ask for the version.

## When you make a release entry

1. Find the date of today with `date +%F`.
2. Find if the release entry has a version link. It has no version link when `Version links` is `off`, or when `references/links.md` tells you to write no version link.
3. Write the heading `## [X.Y.Z] - YYYY-MM-DD`. When the release entry has no version link, write `## X.Y.Z - YYYY-MM-DD`, with no brackets.
4. Put the release entry directly after `# Changelog`:
   - If the changelog has a release entry with the same version, use that entry.
   - Else, when the changelog has an Unreleased section, change its heading into the release heading. Keep its groups and items. This step also applies to an Unreleased section in a different form, for example `## [Unreleased]`. When `Unreleased` is `off`, also use the Unreleased section, so that no Unreleased section stays.
   - Else, add the release entry.
   - When you use a section that has a heading or a group in a different form, do "When a release converts a section" in `references/other-formats.md`.
5. Put the item of the caller in its group of the release entry. Do this as step 4 of "When you do the Write job" in `SKILL.md` tells you for the Unreleased section.
6. For each item of the release entry that has no commit reference, find its commit in the Git history. For a pull request, use its merge commit, for example the commit `Merge pull request #5 from alice/truncate`. `references/links.md` gives the merge commit message of each host. Run `git log --oneline` from the newest release tag to find the merge commits.
7. Write the commit reference with the short SHA of 7 characters, as `references/links.md` tells you.
8. Write the other references of each item as the `References` Setting tells you. Remove each reference of a kind that the Setting does not list.
9. When an item has more than 2 references, keep the commit reference and the pull-request reference. Remove the issue reference, because the pull request is the better starting point. In the report, give each reference that you removed.
10. When `Authors` is `on`, write the author of each item. The author of a pull request is the author of its commits, not of the merge commit. Find the authors with `git log --format=%an <merge commit>^1..<merge commit>^2`. For a pull request of an automated account, for example Dependabot, write the person who merged the pull request. When `Authors` is `off`, remove the authors from the items of the release entry.
11. If the release entry has no version link, write no link definition. Else, write the version link as the `Version links` Setting tells you:
    - `release`: the release URL of `references/links.md`.
    - `compare`: the compare URL of `references/links.md`. The previous tag is the tag of the newest release entry before this release.
12. Write the tag of the version link in the form of the tags in `git tag`. For example, when the tag of 1.2.0 is `v1.2.0`, the tag of 1.3.0 is `v1.3.0`.
13. Put the link definition at the bottom of the file, above the link definitions of older versions.

## When you write a notice

A notice is a paragraph of one sentence in italics, for example `_This release is yanked: it breaks install._`. Put the notice directly after the release heading, with a blank line before and after it. A release entry has a maximum of one notice.

1. Write the notice that the caller gives.
2. When a release entry has no groups, write a notice that tells why.
3. When `Notice` is `major` and the release is a major release, ask the Operator for the text of an upgrade-guide notice. A major release changes X of `X.Y.Z`, for example from 1.2.0 to 2.0.0.
4. When there is no Operator, write no upgrade-guide notice. In the report, tell that you did not ask for an upgrade-guide notice, because there is no Operator.

## When you mark a release as yanked

Do this when the caller tells you that a release is yanked.

1. Find the release entry of that version. Do not change its heading. Do not add the text `[YANKED]`.
2. If the entry has a notice, write one new notice in its place. The new notice gives the text of the old notice, the fact that the release is yanked, and the cause from the caller. Else, write a notice that tells that the release is yanked and gives the cause from the caller.
3. Keep the groups and items of the entry after the notice.
4. Do not change a different line of the changelog.
