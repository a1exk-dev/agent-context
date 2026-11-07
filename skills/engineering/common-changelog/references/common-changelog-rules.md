# Common Changelog requirements

The Write job and the Review job obey these requirements. Each requirement gives its § number in Common Changelog (https://common-changelog.org/) and its severity.

## When you give the severity of a finding

In the Review job, a requirement with the severity `error` is a "must" requirement, and a requirement with the severity `warning` is a "should" requirement. For references and version links, "When you review links" in `references/links.md` can give a different severity or no finding. Then obey `references/links.md`.

## When you examine the file and the release entries

| Requirement | § | Severity |
|---|---|---|
| The file name is `CHANGELOG.md`. | §2.1 | error |
| The first line is the title `# Changelog`. | §2.1 | error |
| After the title, the file has only release entries and their link definitions. When `Unreleased` is `on`, one Unreleased section can come first. | §2.1 | error |
| The release entries are in semver sequence, with the latest release entry first. | §2.1 | error |
| A release heading is `## [X.Y.Z] - YYYY-MM-DD`. The version obeys semver and has no `v`. The date has the form `YYYY-MM-DD`. | §2.2 | error |
| When `Version links` is not `off`, each version has a link definition at the bottom of the file, for example `[1.2.0]: <URL>`. When `Version links` is `off`, or `references/links.md` gives no version link, the heading is `## 1.2.0 - <date>`, with no brackets. | §2.2 | warning |
| After a release heading, there are one or more groups, or one notice and then zero or more groups. | §2.2 | error |
| A release entry with no groups has a notice that tells why. The release entry of a yanked release and the release entry of a first release with no changes also have a notice. A release entry has a maximum of one notice. | §2.3 | error |

## When you examine the Unreleased section

| Requirement | § | Severity |
|---|---|---|
| When `Unreleased` is `on`, the file has a maximum of one Unreleased section. It comes directly after `# Changelog`. | §6.2 | error |
| The heading is `## Unreleased`, with no date and no link. | §6.2 | error |
| When `Unreleased` is `off`, the file has no Unreleased section. | §6.2 | error |
| The items of the Unreleased section obey the requirements for groups and items, but have no commit reference. | §2.4.2 | error |

## When you examine the groups and the items

| Requirement | § | Severity |
|---|---|---|
| A group heading is `### Changed`, `### Added`, `### Removed`, or `### Fixed`. There is no `Deprecated` or `Security` group. | §2.4 | error |
| The groups of a section are in the sequence `Changed`, `Added`, `Removed`, `Fixed`. | §2.4 | error |
| Only a list with bullets comes after a group heading. | §2.4 | error |
| Each item is one line. | §2.4 | warning |
| Each item has the description of the change, then its references, then its authors. | §2.4 | error |
| The description starts with a verb in the imperative mood, for example "Add" or "Fix". The description is clear without its group heading. | §2.4.1 | error |
| In a release entry, each item has a reference to each commit of the change. | §2.4.2 | error |
| Each item has a pull-request reference when the `References` Setting has `pull requests` and the change has a pull request. Each item has an issue reference when the `References` Setting has `issues` and the change has an issue. | §2.4.2 | warning |
| Each reference is a Markdown link. References are in parentheses after the description, for example `([#6](<URL>))`. References of one kind share one pair of parentheses. A comma is between 2 references. | §2.4.2 | error |
| An item has a maximum of 2 references. When an item has more than 2 references, keep only the best starting point, for example the pull request and not its issue. | §2.4.2 | warning |
| When `Authors` is `on`, the authors come after the references, in their own parentheses, for example `([#42](<URL>)) (Alice)`. For the change of a bot, the author is the person who merged the change. When `Authors` is `off`, the item has no authors. | §2.4.3 | warning |
| The item of a breaking change starts with `**Breaking:** ` and comes first in its group. | §2.4.4 | error |

## When you write the text of an item

- Write no subsystem prefix, unless the caller gives one.

## When you select the changes to write

- Do not leave out a change of a type that §3.2 of Common Changelog lists. An example is a refactor that changes the runtime support.
