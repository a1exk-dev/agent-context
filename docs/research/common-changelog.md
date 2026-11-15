# Research: what Common Changelog requires, which parts are optional, and what it says about an Unreleased section

<!-- cspell:ignore vweevers hallmarkrc hallmark buhtz hcording prereleases prerelease YANKED premajor preminor prepatch Unrelease Milly -->

Question (issue #77, map #76): List each rule the format requires (file name, headings, release heading and date, change groups, change format, references, notice, links), and each part the standard calls optional, with its section number. Confirm the section numbers that the operator's brief uses: 2.3 Notice and 2.4.2 References. Find what the standard says about an Unreleased section, about entries written before a release, and how it differs from Keep a Changelog. Report any rule that conflicts with an Unreleased section with no date.

Use: the spec of the `common-changelog` Skill and the optional settings in `docs/agents/changelog-policy.md` (#76).

Sources, read on 2026-10-27:

- Common Changelog: [`README.md`](https://github.com/vweevers/common-changelog/blob/bed3ea6/README.md) in vweevers/common-changelog at `main` commit `bed3ea6` (2025-12-17, "Move out of draft mode (#22)"). Rendered at [common-changelog.org](https://common-changelog.org/). Below, "§N" is the section number of that document. The standard has no version number; that commit is the latest change.
- `remark-common-changelog` v2.3.2, the linter by the same author: [`README.md`](https://github.com/vweevers/remark-common-changelog#rules), [`index.js`](https://github.com/vweevers/remark-common-changelog/blob/main/index.js), and [`lib/changelog.js`](https://github.com/vweevers/remark-common-changelog/blob/main/lib/changelog.js).
- `hallmark` v5.0.2, the CLI that wraps that linter: [`README.md`](https://github.com/vweevers/hallmark#readme), section `cc add`.
- Issue [vweevers/common-changelog#13](https://github.com/vweevers/common-changelog/issues/13) "Understanding of 'Unrelease' section" (closed as completed by its author on 2026-07-25, with no change to the standard) and open issue [#16](https://github.com/vweevers/common-changelog/issues/16) on release branches.

## Summary

- The section numbers in the brief are correct: §2.3 is Notice, and §2.4.2 is References.
- Notice (§2.3) is not optional in the sense of a project setting. The standard requires a notice when a release has no change groups, when a release is yanked (§6.4), and for a first release with no changes. In other releases a notice is the writer's choice ("might", "use notices wisely").
- References (§2.4.2) are not fully optional. Each change **must** reference relevant commits. References to tickets or pull requests are a **should**, "when available". A policy that drops all references breaks the standard; a policy that drops ticket and pull-request references does not.
- Common Changelog has **no Unreleased section** (§6.2). The FAQ calls the Unreleased workflow "unproductive" and gives three reasons. The author said in #13 that he is "somewhat open" to an optional Unreleased section, but the standard did not change.
- An undated `## Unreleased` heading at the top breaks these rules: §2.2 (heading must be `VERSION - DATE`, semver version, ISO date), §2.1 (content after the title must be only releases), and the linter rules `release-version`, `release-date`, and probably `release-version-link`. The standard's alternative is to write the entry for the new version, with its real version and date, just before the tag (§2.2: commit the entry before the tag; `hallmark cc add`).

## 1. Every rule of the format

Key words: the standard uses plain English "must", "should", "may", "can", and "recommended". It does not cite RFC 2119. Below, the column "Strength" copies the word that the standard uses.

### 1.1. File (§2.1)

| Rule | Strength | Section |
| - | - | - |
| File name is `CHANGELOG.md`. | must | §2.1 |
| Content is Markdown and starts with the first-level heading `# Changelog`. | must | §2.1 |
| After the title, content is zero or more releases ("changelog entries"), and nothing else. | must | §2.1 |
| Releases are sorted latest-first by semver order, also when a smaller version was published later. | must | §2.1 |
| Each new stable release has an entry. | must | §2.1 |
| Prerequisites: git, a git tag for each released version, Semantic Versioning. | stated as prerequisites | §1.3 |

### 1.2. Release heading (§2.2)

| Rule | Strength | Section |
| - | - | - |
| A release starts with a second-level heading `## VERSION - DATE`. | must | §2.2 |
| `VERSION` is semver-valid, with no `v` prefix, and matches a git tag (the tag can have a `v`). | must (stated as format) | §2.2 |
| A new version's entry is committed before the git tag is made. | should | §2.2 |
| `DATE` is `YYYY-MM-DD` (ISO 8601). | must | §2.2, reasons in §4.3 |
| The version links to more information; on GitHub, to the GitHub release, which should have the same content as the entry. | should | §2.2 |
| Use reference-style links, so the definitions (`[1.0.1]: https://...`) sit at the bottom of the file. | "preferably" | §2.2 |
| After the heading: one or more change groups, or one notice and then zero or more change groups. No other content. | must | §2.2 |
| Change groups can be left out only when a notice explains why. | must | §2.2 |

The standard itself does not order the link definitions. The linter does: definitions latest-first, like releases, and other definitions after them (`latest-definition-first`).

### 1.3. Notice (§2.3)

- Use: a link to an essential upgrade guide or blog post, the status of a yanked release, a release with zero changes, or a first release ("_First release._").
- A notice is a paragraph of one sentence, with any Markdown. Emphasis is recommended.
- A release has one notice or none.
- A notice comes first, so use it with care. A notice about code that has a better place outside the changelog goes there.

### 1.4. Change group (§2.4)

| Rule | Strength | Section |
| - | - | - |
| A group starts with a third-level, text-only heading with a category. | must | §2.4 |
| Category is one of, in this order: `Changed`, `Added`, `Removed`, `Fixed`. | must | §2.4 |
| The heading is followed only by an unnumbered list. | must | §2.4 |
| Each item is one line. | should | §2.4, §3.6 |
| Each item is: change, then one or more references, then zero or more authors. | must | §2.4 |
| List order: breaking changes first, then other importance, then latest-first. | should | §2.4, §2.4.4 |

There is no `Deprecated` or `Security` category. A deprecation goes under `Changed` (§6.2). The linter is looser here: its `group-heading-type` rule also accepts `Deprecated` and `Security`.

### 1.5. Change (§2.4.1)

- Imperative mood. The change must start with a present-tense verb, for example `Add`, `Fix`, `Bump`, `Deprecate`.
- Each change must describe itself without its category heading ("Add `write()` method", not "`write()` method").
- Commits in the same style are "highly recommended", so that a draft comes from git history.

### 1.6. References (§2.4.2)

| Rule | Strength |
| - | - |
| Reference the relevant commits. | must |
| Reference tickets or pull requests, when available. | should |
| References come after the change, on the same line. | must |
| References are in parentheses. References of one type can share parentheses, separated by commas: `(#1, #2)`. | must / may |
| Each reference is a Markdown link. | must |
| With more than two references, give only the best starting point (for example the pull request, not the ticket it closed). | stated as instruction |
| Forms: short commit hash; `owner/name@hash` only for git submodules; `#N`; `owner/name#N` only for other repositories; external ticket keys such as `JIRA-837`. | should (for the restricted forms) |

### 1.7. Authors (§2.4.3)

- Author names come after the references, in parentheses, separated by commas. A semicolon can separate references and authors in one pair of parentheses: `(#194, #195; Alice, Milly)`.
- A project with one contributor can leave out author names.
- For a bot's change, name the person who merged it.
- No rule on full name or user name; the author's preferred name (from git) is recommended.

### 1.8. Prefixes (§2.4.4)

- A breaking change must start with bold `**Breaking:** ` and should come first in its group.
- A project with subsystems can prefix a change with the bold subsystem name; breaking: `**<subsystem> (breaking):** `. The standard says to avoid subsystems in general.

### 1.9. Formatting, writing, yanked releases, prereleases

- §2.5: no rule on Markdown formatting. The examples follow the `hallmark` style.
- §3 (Writing) is guidance, not format: remove noise (§3.2, with a list of changes that must not be removed, for example refactorings and runtime support changes), rephrase (§3.3), merge related changes (§3.4), skip changes that cancel out (§3.5), keep long descriptions in commits (§3.6).
- Yanked releases (§6.4): keep the entry if the release was public for more than a few hours. Add a notice with the status. The notice should not replace the list of changes. There is no `[YANKED]` tag (§6.2).
- Prereleases (§3.7): three approaches to promote a prerelease. A: copy the prerelease content into the release entry, as if the prereleases did not exist. B: no entry for a prerelease made only for internal tests. C: after prereleases that each had an entry, the release has only a notice, for example "_Stable release based on 3.1.0-rc.2._". §2.1 requires an entry only for each stable release.
- Rewriting old entries is allowed (§6.5).

## 2. Unreleased section and entries before a release

### 2.1. What the standard says

- §6.2 "No Unreleased section": Common Changelog has no `Unreleased` section at the top. Keep a Changelog recommends one, to list changes as they land on the main branch. Common Changelog calls that workflow unproductive, for three reasons:
  1. A commit or pull request cannot add its own references (commit hash, pull request number). These come only after the fact.
  2. First-time contributors cannot be expected to edit the changelog, so maintainers make separate commits, which add noise to the history.
  3. A changelog needs a view of the whole release, but changes are reviewed one at a time.
- §2.2: the entry for a new version should be committed before its git tag. So the entry is written at release time, with the real version and date, not collected during development.
- §3.1: the author makes the draft of a new entry with `hallmark cc add`. That command adds a release for the next version (`major`, `minor`, `patch`, a prerelease type, or an explicit version) and fills it with the commits since the latest tag ([hallmark README](https://github.com/vweevers/hallmark#readme), `cc add`).
- [#13](https://github.com/vweevers/common-changelog/issues/13): the author answered that he is "somewhat open to restoring the 'Unreleased' section, as an optional feature", but does not want commit hashes to become optional. Another user proposed `## [5.1.0] - UNDER DEVELOPMENT`. The issue closed on 2026-07-25 with no change to the standard.

### 2.2. Other differences from Keep a Changelog (§6.2)

- Adds references (§2.4.2), authors (§2.4.3), and the breaking prefix (§2.4.4).
- Four categories, not six: no `Deprecated`, no `Security`.
- No Unreleased section.
- No `[YANKED]` tag; a notice instead.

### 2.3. Conflicts with an undated Unreleased section at the top

An entry `## Unreleased` (or `## [Unreleased]`) with no date, above the latest release, breaks these rules:

| Rule | Why it conflicts |
| - | - |
| §2.1: after the title, only releases | `Unreleased` is not a release. |
| §2.2: heading is `VERSION - DATE` | No version, no date. |
| §2.2: `VERSION` is semver-valid and matches a git tag | `Unreleased` is not semver. |
| §2.2: `DATE` is `YYYY-MM-DD` | No date. |
| §2.2: the version should link | A link to an unreleased version has no target, unless it links to a compare view. |
| §6.2 | The standard says directly that it has no Unreleased section. |

The linter confirms this. `lib/changelog.js` reads the heading text `Unreleased` as version `Unreleased` with no date. `index.js` then reports `release-version` ("Release version must be semver-valid") and `release-date` ("Release must have date"). Because `Unreleased` is not the oldest release, it also reports `release-version-link` unless the heading is a link. With semver order (§2.1, `latest-release-first`), the linter also cannot sort a non-semver version.

Changes that do not conflict: §2.4 to §2.4.4 (groups, change, references, authors, prefixes) apply in the same way to the items under an Unreleased heading. But a change in a pull request cannot yet reference its own squash or merge commit, which §2.4.2 requires (reason 1 of §6.2).

What the standard recommends instead: write no entry during development. At release time, add the entry for the new version with its real version and date (`## [1.2.0] - 2026-10-27`), commit it before the tag (§2.2), and make the draft from git history (§3.1, `hallmark cc add`). The linter supports this: a version greater than the current version passes without a git tag (`release-version`, `version` option).

## 3. Facts a policy could make into optional Settings

Settings that stay inside the standard:

- Ticket and pull-request references: on or off (§2.4.2 "should ... when available"). Commit references stay required.
- Reference form: GitHub `#N`, external ticket key (`JIRA-837`), or both (§2.4.2).
- Authors: on, or off for a project with one contributor (§2.4.3).
- Author separator: comma groups `(refs) (authors)` or semicolon `(refs; authors)` (§2.4.3).
- Version links: the host and URL pattern, for example a GitHub release or a compare view (§2.2 "should"). Reference-style links at the bottom (§2.2 "preferably").
- Notice for optional cases: an upgrade-guide notice for major releases, and the first-release wording (§2.3). Notices for an empty release and a yanked release stay required.
- Prereleases: approach A, B, or C (§3.7).
- Subsystem prefixes: on or off (§2.4.4, "should generally be avoided").
- Noise filter: the extra kinds of maintenance changes to leave out (§3.2).

Settings that break the standard, so a policy that turns them on is a deviation, not a setting:

- An Unreleased section (§6.2, §2.2).
- `Deprecated` or `Security` categories (§2.4, §6.2), although the linter accepts them.
- No commit references (§2.4.2 "must").
- A file name other than `CHANGELOG.md`, a different title, a date format other than `YYYY-MM-DD`, a `v` prefix in the heading version (§2.1, §2.2).

Open point for the map: the brief puts an undated Unreleased section at the top on `feature/*`, `bugfix/*`, and `hotfix/*` branches. That is a deviation from §6.2 and §2.2, and the linter reports it. Options that stay closer to the standard: a heading with the planned version and the current date in `YYYY-MM-DD` form, which `release/*` corrects (it passes the linter, but the version can change before the release); or no entry until the release branch, as §2.2 and §3.1 describe. Only the second option follows the standard with no deviation.
