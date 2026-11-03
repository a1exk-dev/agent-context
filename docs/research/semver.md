# Research: what SemVer 2.0.0 requires, and which parts can be Settings

<!-- cspell:ignore FIRSTPRERELEASE googleapis -->

Question (issue #153, map #152): Which rules of Semantic Versioning 2.0.0 are fixed, and which parts can a project choose: pre-release identifiers, build metadata, the 0.y.z stage, the first version, and the tag form (for example `v1.2.3`)? How do common tools (semantic-release, release-please, Conventional Commits) decide major, minor, or patch from the changes, and what do they do when a project declares no public API?

Use: the spec of the `semver` Skill and its Settings in `docs/agents/semver-policy.md` (#152).

Sources, read on 2026-11-03:

- SemVer 2.0.0: the published page [semver.org/spec/v2.0.0.html](https://semver.org/spec/v2.0.0.html), and its source [`semver.md`](https://github.com/semver/semver/blob/f99d548/semver.md) in semver/semver at `master` commit `f99d548`. The two agree on each passage quoted below. Below, "rule N" is the Nth item of its "Semantic Versioning Specification (SemVer)" list, and "rule 11.4.3" is a sub-item of rule 11. "FAQ" is the FAQ section of the same page.
- semantic-release: [semantic-release/semantic-release](https://github.com/semantic-release/semantic-release) at `master` commit `04c1923`: `lib/definitions/constants.js`, `lib/get-next-version.js`, `lib/get-config.js`. The [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq), section "Can I set the initial release version of my package to 0.0.1?".
- @semantic-release/commit-analyzer: [semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer) at `master` commit `a1f133d`: `README.md`, `index.js`, `lib/default-release-rules.js`, `lib/analyze-commit.js`.
- conventional-changelog presets: [conventional-changelog/conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) at `master` commit `0cdedf8`: `packages/conventional-changelog-angular/src/parser.js` and `src/whatBump.js`; `packages/conventional-changelog-conventionalcommits/src/parser.js` and `src/whatBump.js`.
- release-please: [googleapis/release-please](https://github.com/googleapis/release-please) at `main` commit `ea20bc2`: `README.md`, `docs/customizing.md`, `docs/manifest-releaser.md`, `schemas/config.json`, `src/versioning-strategies/default.ts`, `src/strategies/base.ts`, `src/version.ts`.
- Conventional Commits 1.0.0: [`content/v1.0.0/index.md`](https://github.com/conventional-commits/conventionalcommits.org/blob/7d293dc/content/v1.0.0/index.md) at `master` commit `7d293dc`. The earlier research on the branch `research/conventional-commits` (`docs/research/conventional-commits.md`) covers the rest of that spec. This file does not repeat it.

## Summary

- Fixed by the spec: the `X.Y.Z` form with no leading zeroes (rule 2), no change to a released version (rule 3), the bump and reset rules for `x > 0` (rules 6, 7, 8), the syntax of pre-release and build identifiers (rules 9, 10, and the BNF grammar), and precedence (rule 11). A project cannot change these and still use SemVer.
- Project choice inside the spec: whether to use pre-release identifiers and which ones (rule 9 is a MAY), whether to use build metadata (rule 10 is a MAY), whether to start at `0.y.z` or `1.0.0`, when to release `1.0.0`, how to bump during `0.y.z` (rule 4: "Anything MAY change at any time"), whether a minor bump may also cover big private changes (rule 7, MAY), and the tag form (the FAQ says `v1.2.3` is a tag name, not a version).
- Rule 1 says software that uses SemVer MUST declare a public API. Rules 5, 7, and 8 measure each change against that API. The Operator's deviation (no declared public API) breaks rule 1 only. To keep rules 7 and 8 usable, the policy must name what counts as a compatible or incompatible change.
- No tool reads an API. semantic-release, release-please, and Conventional Commits map commit types to bumps: a breaking-change marker gives major, `feat` gives minor, `fix` gives patch. So the tools work the same with or without a declared public API. The commit author decides what is breaking.
- During `0.y.z`, the tools differ. semantic-release has no `0.y.z` mode: its first release is `1.0.0`, and its FAQ calls `0.y.z` support "out of scope". release-please bumps the major by default (`0.3.0` to `1.0.0` on a breaking change). With `bump-minor-pre-major` it bumps the minor, and with `bump-patch-for-minor-pre-major` a `feat` bumps the patch.
- The default preset of semantic-release, `angular`, does not read the `!` marker of Conventional Commits. A `feat!:` commit with no `BREAKING CHANGE:` footer gives no release. The `conventionalcommits` preset and release-please read `!`.

## 1. Every normative statement of SemVer 2.0.0

The spec reads its key words as in RFC 2119 (Specification section, first paragraph).

| Rule | Key word | Requirement | Fixed or project choice |
| - | - | - | - |
| 1 | MUST | Software that uses SemVer declares a public API, in code or in documentation. | Fixed. The Operator's deviation removes it. See section 4. |
| 1 | SHOULD | That API is precise and comprehensive. | Fixed, but a SHOULD. |
| 2 | MUST, MUST NOT | A normal version is `X.Y.Z`: non-negative integers with no leading zeroes. | Fixed. |
| 2 | MUST | Each element increases numerically, for example `1.9.0 -> 1.10.0 -> 1.11.0`. | Fixed. |
| 3 | MUST NOT, MUST | A released version never changes. Each change is a new version. | Fixed. |
| 4 | MAY, SHOULD NOT | `0.y.z` is for initial development. "Anything MAY change at any time." The public API SHOULD NOT be considered stable. | The bump scheme during `0.y.z` is a project choice. |
| 5 | (none) | `1.0.0` defines the public API. After it, bumps depend on that API. | Fixed. When to release `1.0.0` is a project choice (FAQ). |
| 6 | MUST | For `x > 0`: bump the patch if only backward compatible bug fixes are in the release. A bug fix is "an internal change that fixes incorrect behavior". | Fixed. |
| 7 | MUST | For `x > 0`: bump the minor for new backward compatible public API functionality, and when public API functionality is marked deprecated. Reset the patch to 0. | Fixed. |
| 7 | MAY | Also bump the minor for "substantial new functionality or improvements" in private code. A minor release may include patch changes. | Project choice. |
| 8 | MUST | For `X > 0`: bump the major for any backward incompatible public API change. Reset the minor and patch to 0. | Fixed. |
| 8 | MAY | A major release may include minor and patch changes. | Free. |
| 9 | MAY | A pre-release version appends `-` and dot-separated identifiers after the patch. | Using them, and their names, is a project choice. |
| 9 | MUST, MUST NOT | Identifiers use only `[0-9A-Za-z-]`, are not empty, and numeric identifiers have no leading zeroes. | Fixed. |
| 9 | (none) | A pre-release has lower precedence than its normal version, and might not meet its compatibility promise. | Fixed. |
| 10 | MAY | Build metadata appends `+` and dot-separated identifiers after the patch or pre-release. | Using it is a project choice. |
| 10 | MUST | Identifiers use only `[0-9A-Za-z-]` and are not empty. Precedence ignores build metadata. | Fixed. Leading zeroes are allowed here: the BNF `<build identifier>` accepts `<digits>`. |
| 11.1 | MUST | Compare major, minor, patch, and pre-release, in that order. Build metadata does not count. | Fixed. |
| 11.2 | (none) | The first difference decides. Major, minor, and patch compare as numbers. | Fixed. |
| 11.3 | (none) | With equal major, minor, and patch, a pre-release is lower than a normal version: `1.0.0-alpha < 1.0.0`. | Fixed. |
| 11.4 | MUST | Compare pre-release identifiers one at a time, left to right. | Fixed. |
| 11.4.1 to 11.4.4 | (none) | Digits-only identifiers compare as numbers. Others compare in ASCII order. A numeric identifier is lower than a non-numeric one. More identifiers is higher when all before are equal. | Fixed. |

The spec ends rule 11 with this example: `1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0`. The FAQ gives two regular expressions that check a full SemVer string. The ECMAScript one is in the FAQ entry "Is there a suggested regular expression (RegEx) to check a SemVer string?".

## 2. Non-normative text that bears on the Skill

All from the FAQ of semver.org:

- First version and `0.y.z`: "The simplest thing to do is start your initial development release at 0.1.0 and then increment the minor version for each subsequent release" ("How should I deal with revisions in the 0.y.z initial development phase?").
- When to release `1.0.0`: "If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0" ("How do I know when to release 1.0.0?").
- Tag form: "'v1.2.3' is not a semantic version". The `v` prefix is "a common way (in English) to indicate it is a version number". In `git tag v1.2.3`, "'v1.2.3' is a tag name and the semantic version is '1.2.3'" ("Is 'v1.2.3' a semantic version?"). So the tag form is a project choice outside the spec.
- A wrong minor release: release a new patch that restores compatibility; never modify the released version (rule 3) ("What do I do if I accidentally release a backward incompatible change as a minor version?").
- Dependency updates with no public API change are compatible. Patch or minor depends on whether the update fixes a bug or adds functionality ("What should I do if I update my own dependencies without changing the public API?").
- Deprecation: at least one minor release with the deprecation before the major release that removes it ("How should I handle deprecating functionality?").
- Length: no size limit, "but use good judgment" ("Does SemVer have a size limit on the version string?").

## 3. How the tools pick major, minor, or patch

### Conventional Commits 1.0.0

- Summary: `fix` "correlates with `PATCH`", `feat` "correlates with `MINOR`", and a `BREAKING CHANGE:` footer or a `!` after the type or scope "introduces a breaking API change (correlating with `MAJOR`)" (`index.md` lines 33 to 35).
- Other types "have no implicit effect in Semantic Versioning (unless they include a BREAKING CHANGE)" (line 42).
- FAQ "How does this relate to SemVer?": `fix` "should" be a PATCH, `feat` a MINOR, and `BREAKING CHANGE` "regardless of type" a MAJOR (line 161).
- FAQ "How should I deal with commit messages in the initial development phase?": "proceed as if you've already released the product" (line 141). The spec says nothing about bumps during `0.y.z`.

### semantic-release with @semantic-release/commit-analyzer

- Default rules (`lib/default-release-rules.js`): a commit with a breaking change gives `major`, a revert gives `patch`, and for the Angular format `feat` gives `minor`, `fix` and `perf` give `patch`. The file also has rules for the Atom, Ember, ESLint, Express, and JSHint formats.
- A commit is breaking when its parsed `notes` list is not empty (`lib/analyze-commit.js`). Custom `releaseRules` go first. The default rules apply only when no custom rule matches (`index.js`; README, "Default rules matching"). A commit with scope `no-release` gives no release (README). A commit that matches no rule gives no release, so `docs`, `chore`, and `refactor` give none by default.
- The release type is the highest over all commits since the last release (`index.js`, `compareReleaseTypes`).
- The default `preset` is `angular` (README options table). Its `headerPattern` is `/^(\w*)(?:\((.*)\))?: (.*)$/` and its `noteKeywords` is `['BREAKING CHANGE']` (`conventional-changelog-angular/src/parser.js`). This pattern does not accept `!`, and this keyword list has no `BREAKING-CHANGE`. So a `feat!:` commit with no footer gets no type and no note, and gives no release. The README says the `BREAKING CHANGE` keyword must be "in the footer of the commit message".
- The `conventionalcommits` preset accepts `!` (`headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/` plus `breakingHeaderPattern`) and the shared `BREAKING_CHANGE_KEYWORDS` (`conventional-changelog-conventionalcommits/src/parser.js`). The README says this preset needs `presetConfig`.
- First version: `FIRST_RELEASE = "1.0.0"` (`lib/definitions/constants.js`). With no earlier release, the next version is `1.0.0`, or `1.0.0-<prerelease>.1` on a pre-release branch (`lib/get-next-version.js`).
- `0.y.z`: not supported. The FAQ says: "Semantic Versioning rules apply differently to major version zero and supporting those differences is out of scope". For a project with frequent breaking changes, it recommends pre-releases. A project that already has a `0.y.z` tag gets `semver.inc(lastRelease.version, type)` (`lib/get-next-version.js`), so a breaking change moves `0.3.0` to `1.0.0`.
- Pre-releases: the default `branches` include `{ name: "beta", prerelease: true }` and `{ name: "alpha", prerelease: true }`. A release there gets `<version>-<branch>.<n>`, with `n` from `FIRSTPRERELEASE = "1"` (`lib/get-config.js`, `lib/get-next-version.js`).
- Tag form: `tagFormat` defaults to `` `v${version}` `` (`lib/get-config.js`). A project can change it.
- No source in semantic-release adds build metadata.

### conventional-changelog `whatBump`

The presets also export a `whatBump` function, used by tools such as `conventional-recommended-bump`. semantic-release does not use it (`commit-analyzer/index.js` uses release rules).

- `angular` (`src/whatBump.js`): a breaking note gives major, else `feat` gives minor, else patch. Each commit gives a release, even `docs`.
- `conventionalcommits` (`src/whatBump.js`): the same order, but only types with the `bump` effect count, and with no such commit the result is `null` (no release). With `preMajor: true`, each level moves down one: breaking gives minor, `feat` gives patch.

### release-please

- Default versioning strategy: "Breaking changes bump the major version, features bump the minor version, bugfixes bump the patch version" (`docs/customizing.md`, "Versioning Strategies"). In code: any breaking commit gives major, else `feat` or `feature` gives minor, else patch (`src/versioning-strategies/default.ts`).
- Breaking markers: `feat!:`, `fix!:`, `refactor!:`, and so on "will result in a SemVer major" (README, lines 52 to 53). A `BREAKING-CHANGE:` footer also counts (README example, lines 85 to 87).
- Release trigger: a release pull request opens only for "releasable units", commits with the prefix `feat`, `fix`, or `deps`. "A 'chore' or 'build' commit is not a releasable unit." Some languages add others, for example `docs` for Java and Python (README, "Release Please bot does not create a release PR. Why?").
- `0.y.z`: `isPreMajor` is `major < 1` (`src/version.ts`). By default a breaking change still bumps the major. `bump-minor-pre-major: true` makes a breaking change bump the minor. `bump-patch-for-minor-pre-major: true` makes `feat` bump the patch. Both default to `false` (`docs/manifest-releaser.md`; `default.ts`).
- First version: `1.0.0`, unless the `initial-version` option sets another (`src/strategies/base.ts`, `initialReleaseVersion`; `schemas/config.json`).
- Override: a `Release-As: x.x.x` footer in a commit body, or the `release-as` option, forces the next version (README; `docs/manifest-releaser.md`; `default.ts`).
- Other strategies: `always-bump-patch`, `always-bump-minor`, `always-bump-major`, `service-pack` (for example `1.2.3-sp.1`), and `prerelease` (for example `1.2.1` to `1.3.0-beta`, with `prerelease-type`) (`docs/customizing.md`).
- Tag form: `include-v-in-tag` defaults to `true`, and `include-component-in-tag` adds `<component>-` before it, so `<component>-v<version>` or `v<version>`. `tag-separator` changes the separator (`schemas/config.json`; `src/strategies/base.ts`; `docs/manifest-releaser.md`).

### Comparison

| Change | SemVer 2.0.0, `x > 0` | SemVer 2.0.0, `0.y.z` | Conventional Commits | semantic-release default | release-please default |
| - | - | - | - | - | - |
| Incompatible public API change | major (rule 8) | free (rule 4) | `!` or `BREAKING CHANGE:` gives MAJOR | major, footer only | major (minor with `bump-minor-pre-major`) |
| New compatible functionality | minor (rule 7) | free (rule 4) | `feat` gives MINOR | `feat` gives minor | `feat` gives minor (patch with `bump-patch-for-minor-pre-major`) |
| Deprecation | minor (rule 7) | free (rule 4) | not stated | no rule | no rule |
| Bug fix | patch (rule 6) | free (rule 4) | `fix` gives PATCH | `fix`, `perf` give patch | `fix` gives patch |
| Other changes | not stated | free (rule 4) | no effect | no release | no release unless `deps` |
| First version | not stated; FAQ suggests `0.1.0` | | not stated | `1.0.0`, fixed | `1.0.0`, or `initial-version` |
| Tag | not a version (FAQ) | | not stated | `v${version}` | `v<version>`, optional component |

## 4. No declared public API

- Rule 1 is a MUST, and the Introduction says: "For this system to work, you first need to declare a public API." The FAQ entry "Documenting the entire public API is too much work!" repeats that SemVer insists on "a well defined public API". No source in this list allows SemVer without a public API, or gives a mode for applications.
- Rules 5, 7, and 8 measure changes against the public API. Rule 6 does not: a patch is for "backward compatible bug fixes", and a bug fix is "an internal change that fixes incorrect behavior". Rule 7 also lets "substantial new functionality or improvements ... within the private code" bump the minor (MAY).
- No tool checks or reads a public API. semantic-release and release-please pick the bump only from commit messages (section 3). Conventional Commits calls a breaking change "a breaking API change", but leaves the judgment to the commit author. So, with or without a declared public API, the tools give the same result.
- Consequence for the Skill: with no declared public API, "backward compatible" and "incompatible" have no reference in the spec. The policy, or the Operator, must give one. One choice is the behaviour that users or other systems depend on, for example the CLI flags, config files, data formats, or UI flows of an app. The SemVer FAQ "How do I know when to release 1.0.0?" uses this test of use: "If your software is being used in production".

## 5. What a project policy can choose

A policy conforms when each version it gives also conforms to the spec. So it can choose where the spec says MAY or says nothing. It cannot loosen a MUST, except the Operator's deviation on rule 1.

| Setting | Spec basis | Possible values | Limit |
| - | - | - | - |
| Public API | Rule 1 MUST (Operator's deviation) | Declared (where), or not declared | When not declared, the policy says what counts as a breaking change (section 4). |
| First version | Not in the rules; FAQ suggests `0.1.0` | `0.1.0`, `1.0.0`, or another `X.Y.Z` | Rule 2 form. semantic-release forces `1.0.0`; release-please allows `initial-version`. |
| Bumps during `0.y.z` | Rule 4 MAY | As for `x > 0` (release-please default), breaking gives minor (`bump-minor-pre-major`), or also `feat` gives patch (`bump-patch-for-minor-pre-major`) | Rules 2 and 3 still apply. |
| When to release `1.0.0` | Rule 5; FAQ | The Operator decides | None in the spec. |
| Pre-release identifiers | Rule 9 MAY | None, or a list such as `alpha`, `beta`, `rc`, with a counter such as `.1` | Rule 9 syntax. Rule 11.4 order: for example `rc` sorts after `beta`, and `beta.11` after `beta.2` only when the counter is a separate numeric identifier. |
| Build metadata | Rule 10 MAY | None, or a form such as a commit SHA or date | Rule 10 syntax. Precedence ignores it, so two versions that differ only in it are the same release for ordering. |
| Minor bump for private changes | Rule 7 MAY | Yes or no | None. |
| Tag form | Outside the spec (FAQ) | `v<version>` (semantic-release and release-please default), `<version>`, or with a component | The text after the prefix must be a valid SemVer string. |

The parts that a policy cannot change: the `X.Y.Z` form with no leading zeroes (rule 2), no change to a released version (rule 3), the bump and reset rules for `x > 0` (rules 6, 7, 8), the identifier syntax (rules 9, 10), and precedence (rule 11).

## 6. This repo today

- The tags are `v0.1.0`, `v0.2.0`, and `v0.3.0` (`git ls-remote --tags origin`, 2026-11-03). So this repo uses the `v<version>` tag form and is in the `0.y.z` stage, and its first version was `0.1.0`, as the SemVer FAQ suggests.
- `scripts/release-version.ts` reads only `v<X>.<Y>.<Z>` tags (`/^v(\d+)\.(\d+)\.(\d+)$/`) and `release/<X>.<Y>.<Z>` branch names. It does not accept pre-release or build metadata, and it sorts only by major, minor, and patch. A policy that allows pre-release identifiers would need rule 11.4 precedence in that code.
