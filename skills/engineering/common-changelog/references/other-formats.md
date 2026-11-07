# Changelogs in other formats

The Create job and the Write job use this file for a changelog in a different format. They also use it for a changelog with a different file name. An example of a different format is Keep a Changelog. Free text is also a different format.

## Before you use this file

If `SKILL.md` of this Skill is not in your context window, read it.

## When you ask the Operator a question

The section "When you ask the Operator a question" in `SKILL.md` tells you how to ask and when there is no Operator. Each section of this file that asks a question tells you what to do when there is no Operator.

## When the changelog has a different file name

Do these steps before a Write job, when the changelog is not there.

1. In the root folder of the project, find a file with one of these names. For the last name, find only a name with one or more lowercase letters, because the Write job found no changelog.

   ```text
   HISTORY.md
   CHANGES.md
   NEWS.md
   CHANGELOG.md
   ```
2. If there is no such file, do the Write job as `SKILL.md` tells you.
3. If the request of the caller tells you to rename that file, rename it with `mv <file> CHANGELOG.md`. Do not use `git mv`, because this Skill does not stage a file. Then do the Write job on the renamed file.
4. If the request of the caller tells you to make a new file, do the Write job on a new changelog. Keep the old file.
5. Else, ask the Operator one question with the options `Rename <file> to CHANGELOG.md` and `Make a new CHANGELOG.md`. When the Operator answers `Rename <file> to CHANGELOG.md`, do step 3. When the Operator answers `Make a new CHANGELOG.md`, do step 4.
6. When there is no Operator, stop and do not change a file. In the report, give the name of the file and the words "rename <file> to CHANGELOG.md", for example "rename HISTORY.md to CHANGELOG.md".

## When the Write job adds an item to a changelog in a different format

The Write job adds new lines in Common Changelog form. Keep the old lines as they are, also when they have findings. The Review job lists the findings in the old lines.

1. If the changelog has no `# ` title, it has no structure. If the changelog has text that is not a release entry or an Unreleased section in any form, it also has no structure. Examples of a release heading in a different form are `## [1.1.0]`, `## v1.1`, and a heading with a different date form.
2. When the changelog has no structure, put the line `# Changelog`, a blank line, and the new section at the top of the file. The new section is the Unreleased section or the release entry of the Write job. Keep the old text below the new section, with no change.
3. When `Unreleased` is `on`, the Unreleased section is the first `## ` section whose heading text is "Unreleased" in any form, for example `## [Unreleased]`. This step also applies to a heading with a link.
4. When the Write job puts an item in that section, change the heading of that section to `## Unreleased`. Remove the link definition of the heading, for example `[Unreleased]: https://github.com/example/demo/compare/v1.2.0...HEAD`.
5. Put the item in its group, in the sequence `Changed`, `Added`, `Removed`, `Fixed`. When the section has no group for the item, add the group after the last group that comes before the new group in that sequence. Keep the old groups and items of the section, for example a `### Security` group, with no change.

## When a release converts a section

Do these steps when the Write job changes a section in a different form into the release entry. `references/release-entries.md` tells you when the Write job does this. Older release entries do not change.

1. Change the heading into the release heading.
2. Remove the link definition of the old heading.
3. Move each item of a `### Security` group to `### Fixed`, because Common Changelog has only the groups `Changed`, `Added`, `Removed`, and `Fixed`. Move each item of a `### Deprecated` group to `### Changed`. Put the groups in the sequence `Changed`, `Added`, `Removed`, `Fixed`.
4. Write each item in the imperative mood, for example "Fixed XSS in search" becomes "Fix XSS in search". Keep the meaning of the item.
5. Keep each item, also when its text does not agree with the changes in the Git history. Do not replace, remove, or add an item. The Operator approves the items in the Commit review.
6. Write the references and the author of each item as "When you make a release entry" in `references/release-entries.md` tells you. A text reference, for example `(#6)`, gives the pull request. Find its merge commit in the Git history.
7. In the report, give each item that moved to a different group, with the old group and the new group.

## When you do a conversion

A conversion is a Write job that corrects each finding in the full changelog. Common Changelog §6.5 permits a change to old entries. Do a conversion when the caller asks for it, for example with the words "convert the changelog". Also do a conversion when the Operator answers "Yes" to the conversion offer. A conversion needs no separate approval, because the Operator approves it in the Commit review.

1. Write the title `# Changelog` as the first line.
2. If the changelog has no structure, do "When you convert free text".
3. Change each release heading to `## [X.Y.Z] - YYYY-MM-DD`, with no `v`.
4. When the heading has the text `[YANKED]`, remove that text. Write a yanked notice as "When you mark a release as yanked" in `references/release-entries.md` tells you.
5. Change the groups and the items of each release entry as steps 3 to 5 of "When a release converts a section" tell you.
6. When `Unreleased` is `on`, change the heading of the Unreleased section to `## Unreleased`. Change its groups and items as steps 3 to 5 of "When a release converts a section" tell you.
7. An item can give a pull request or a commit that the Git history has. For each such item, write the references and the author of the item as "When you make a release entry" in `references/release-entries.md` tells you. Write no commit reference in the Unreleased section.
8. When an item gives no pull request or commit, or the Git history does not have that pull request or commit, keep the item. Do not add a reference to the item. The Review job lists it as a §2.4.2 error.
9. Remove each text after the title that is not a release entry, the Unreleased section, or a link definition, for example an introduction paragraph. Keep the text that step 7 of "When you convert free text" keeps. Give each removed text in the report, as a quotation.
10. Write the link definitions again as `references/links.md` and the `Version links` Setting tell you. Remove each link definition that has no section, for example `[Unreleased]:`.
11. Change each other link into the URL form of `references/links.md`.
12. Do the Review job. Give the findings of the Review job in the report.

## When you convert free text

1. Run `git tag --list` to find the Git tags.
2. If the project has no tags, do not change a file. In the report, tell that the project has no Git tags, so the free text stays as it is.
3. For each tag that has a semver version, make a release entry `## [X.Y.Z] - YYYY-MM-DD`. The version comes from the tag name, for example `1.2.0` from `v1.2.0`. The date is the date of the tagged commit: run `git log -1 --format=%cs <tag>`.
4. Find the text that gives the version of a tag, for example "Version 1.2 added dark mode" for `v1.2.0`. Write that text as items of that release entry, in Common Changelog form.
5. Find the commit of each item in the Git history up to the tag of the release entry of that item. An example is the merge commit `Merge pull request #3 from dave/dark-mode` for "added dark mode". Then write the references and the author of the item as "When you make a release entry" in `references/release-entries.md` tells you.
6. Put the release entries in semver sequence, with the latest release first, directly after `# Changelog`.
7. Keep the text that gives no version of a tag below the last release entry, with no change. In the report, give each line of that text.

## When you offer a conversion

Do these steps after a Write job that is not a conversion.

1. If the last Review job found no finding in a line that this Write job did not write, do not offer a conversion.
2. If the Operator answered "No" to a conversion offer in this session, do not offer a conversion again.
3. Ask the Operator one question: "Convert the old lines to Common Changelog form?" Give the options `Yes` and `No`.
4. When the Operator answers `Yes`, do a conversion.
5. When there is no Operator, do not do a conversion. In the report, tell that the caller can correct the old lines with the words "convert the changelog".
