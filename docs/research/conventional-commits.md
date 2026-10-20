# Research: what Conventional Commits 1.0.0 requires, and which parts can be optional settings

<!-- cspell:ignore adoc Acked eapply -->

Question (issue #57, map #56): List every MUST, SHOULD, and MAY of Conventional Commits 1.0.0: header, type, scope, `!`, description, body, footers, `BREAKING CHANGE`, case rules. Which parts can a project policy turn on or off without breaking the spec? What does the spec say, or not say, about merge commits and revert commits? Where does the type list `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test` come from, and which of its rules (header length, case) are convention, not spec?

Use: the spec of the `git-commit` Skill and its optional settings in `docs/agents/commit-policy.md` (#56).

Sources, read on 2026-10-20:

- Conventional Commits 1.0.0: source of the published page, [`content/v1.0.0/index.md`](https://github.com/conventional-commits/conventionalcommits.org/blob/master/content/v1.0.0/index.md) in conventional-commits/conventionalcommits.org at `master` commit `7d293dc`. Rendered at [conventionalcommits.org/en/v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Below, "rule N" is the Nth item of its "Specification" list.
- commitlint: [conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint) at `master` commit `b55c557`, `@commitlint/config-conventional` version 21.2.4: `src/index.ts` and `README.md`; `@commitlint/is-ignored`: `src/defaults.ts` and `src/is-ignored.ts`.
- Angular commit convention: [`CONTRIBUTING.md` at `22b96b9`](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) (the version the spec links) and the current [`contributing-docs/commit-message-guidelines.md`](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md).
- conventional-changelog: [`packages/conventional-changelog-conventionalcommits/src/parser.js`](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/src/parser.js) at `master` commit `e2c4c3f`.
- Git: [git/git](https://github.com/git/git) at `master` commit `47fdf22` (2026-10-19): `sequencer.c` (`sequencer_format_revert_message`), `fmt-merge-msg.c` (`fmt_merge_msg_title`), `Documentation/git-revert.adoc`, `Documentation/git-merge.adoc`, `Documentation/config/merge.adoc`.
- GitHub Docs: [Configuring commit merging for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-merging-for-pull-requests).

## Summary

- The spec has 16 numbered rules. They use MUST, MUST NOT, MAY, OPTIONAL, REQUIRED, and SHALL. No rule uses SHOULD or RECOMMENDED. The word "should" appears only in the non-normative FAQ.
- A policy can narrow each MAY (scope, body, footers, extra types) and can pick one of the two breaking-change markers. A policy cannot remove `feat` or `fix`, cannot forbid both breaking-change markers, and cannot change the header syntax, the blank lines, the footer syntax, or the uppercase `BREAKING CHANGE`.
- The spec says nothing about merge commits. For reverts, a non-normative FAQ entry says the spec does not define them, and it suggests a `revert` type with a `Refs:` footer. The default messages of Git and GitHub for merges and reverts have no type, so they do not conform.
- The 11-type list is the `type-enum` rule of `@commitlint/config-conventional`. It is the 9 types of the Angular convention plus `chore` and `revert`. The spec names commitlint only as an example and mandates no types other than `feat` and `fix`.
- These commitlint rules are convention, not spec: the type list, lower-case type, the 100-character header and line limits, the subject case, and no full stop at the end of the subject. The commitlint README says this itself.

## 1. Every normative statement of the spec

The spec reads its key words as in RFC 2119 (Specification section, first paragraph).

| Part | Rule | Key word | Requirement |
| - | - | - | - |
| Header: type | 1 | MUST | Each commit starts with a type, "which consists of a noun, `feat`, `fix`, etc." |
| Header: scope | 1 | OPTIONAL | A scope after the type. |
| Header: `!` | 1 | OPTIONAL | A `!` after the type or scope. |
| Header: separator | 1 | REQUIRED | A colon and a space end the prefix. |
| Type `feat` | 2 | MUST | Use `feat` when a commit adds a new feature. |
| Type `fix` | 3 | MUST | Use `fix` when a commit is a bug fix. |
| Scope | 4 | MAY | A scope after the type. |
| Scope form | 4 | MUST | A noun for a section of the codebase, in parentheses: `fix(parser):`. |
| Description | 5 | MUST | The description comes immediately after the colon and space. It is "a short summary of the code changes". |
| Body | 6 | MAY | A longer body after the description. |
| Body position | 6 | MUST | The body starts one blank line after the description. |
| Body form | 7 | MAY | Free form, any number of paragraphs. |
| Footers | 8 | MAY | One or more footers, one blank line after the body. |
| Footer form | 8 | MUST | A word token, then `: ` or ` #`, then a value. Inspired by git trailers. |
| Footer token | 9 | MUST | Use `-` in place of whitespace, for example `Acked-by`. |
| Footer token exception | 9 | MAY | `BREAKING CHANGE`, with a space, is also a token. |
| Footer value | 10 | MAY | The value can contain spaces and newlines. |
| Footer parsing | 10 | MUST | Parsing of a value stops at the next valid token and separator. |
| Breaking change | 11 | MUST | Mark it in the type/scope prefix, or as a footer. |
| Breaking change footer | 12 | MUST | Uppercase `BREAKING CHANGE`, a colon, a space, and a description. |
| Breaking change `!` | 13 | MUST | In the prefix, put `!` immediately before the `:`. |
| `!` without footer | 13 | MAY | With `!`, the `BREAKING CHANGE:` footer can be left out. |
| `!` description | 13 | SHALL | Then the commit description describes the breaking change. |
| Other types | 14 | MAY | Types other than `feat` and `fix`, for example `docs:`. |
| Case | 15 | MUST NOT | Implementors do not treat the units as case-sensitive. |
| Case exception | 15 | MUST | `BREAKING CHANGE` is uppercase. |
| Synonym | 16 | MUST | `BREAKING-CHANGE` is the same as `BREAKING CHANGE` as a footer token. |

Non-normative text that bears on the Skill:

- Summary: other types "are not mandated" and "have no implicit effect in Semantic Versioning (unless they include a BREAKING CHANGE)". A breaking change "can be part of commits of any _type_".
- FAQ "Are the types in the commit title uppercase or lowercase?": "Any casing may be used, but it's best to be consistent."
- FAQ "What do I do if the commit conforms to more than one of the commit types?": make several commits when possible.
- FAQ "How does this relate to SemVer?": `fix` "should" be a PATCH, `feat` a MINOR, `BREAKING CHANGE` a MAJOR. This is the only "should", and it is in the FAQ.
- Rule 8 places footers "one blank line after the body". The spec's first example has no body and puts the `BREAKING CHANGE:` footer one blank line after the header. So footers can follow the header directly.
- The spec sets no length limit, no mood (imperative or other), and no rule about a full stop or the case of the description.

## 2. What a project policy can turn on or off

A policy conforms when each message it allows also conforms to the spec. So a policy can narrow a MAY or choose between two allowed forms. It cannot loosen a MUST.

| Setting | Spec basis | Allowed policy values | Limit |
| - | - | - | - |
| Scope | MAY (rules 1, 4) | Forbidden, optional, required, or only from a fixed list. | A scope is a noun in parentheses (rule 4). |
| Types | `feat`, `fix` MUST (rules 2, 3); others MAY (rule 14) | Any extra types, or a fixed list. | The list must contain `feat` and `fix`, and the policy must use them for features and bug fixes. |
| Breaking change marker | Prefix or footer (rule 11) | `!` only, footer only, or both. | At least one marker on each breaking change. A footer is uppercase `BREAKING CHANGE:` or `BREAKING-CHANGE:` (rules 12, 16). With `!` only, the description describes the break (rule 13). |
| Body | MAY (rule 6) | Forbidden, optional, or required (for example for breaking changes). | One blank line after the description. |
| Footers | MAY (rule 8) | Optional, or required, for example `Refs: #<issue>`. | Footer syntax of rules 8 and 9. |
| Case of type and scope | Case-insensitive for tools (rule 15); FAQ asks for consistency | One case, for example lower case. | A policy fixes a style. Tools must still accept other cases. |
| Header length, line length, description case, full stop, mood | Not in the spec | Any value. | None. |

The parts that a policy cannot change: the `type[(scope)][!]: description` header, the blank line before the body and before the footers, the footer token and separator syntax, and the uppercase `BREAKING CHANGE`.

The current `docs/agents/commit-policy.md` already narrows the spec in two places: scope optional, and a required `Refs: #<issue-number>` footer for issue work. Both conform.

## 3. Merge commits and revert commits

### Merge commits

The spec text does not mention merge commits. The FAQ mentions a squash workflow, where a maintainer writes "the proper git commit message for the merge".

Default messages:

- Git: `fmt_merge_msg_title` in `fmt-merge-msg.c` writes `Merge ` plus `branch '<name>'`, `branches ...`, `remote-tracking branch ...`, `tag ...`, or `commit ...`, then ` of <repo>` for a remote source, then ` into <branch>`. By default it leaves out ` into <branch>` for `main` and `master` (`merge.suppressDest`, defaults set at `fmt-merge-msg.c:661-663`). Merging an annotated tag uses the tag message as the template (`git-merge.adoc`). `-m <msg>` and `-F <file>` set the merge message (`git-merge.adoc`).
- GitHub: the default merge commit message "includes the pull request number and title. For example, `Merge pull request #123 from patch-1`". A repository setting can change it to the pull request title, or to the title and description (GitHub Docs).

None of these defaults has a type, so none conforms to the spec. A tool that follows the spec skips them, as the FAQ says for a commit that does not conform. commitlint ignores them by default: `@commitlint/is-ignored` `src/defaults.ts` matches `Merge pull request`, `Merge X into Y`, `Merge branch`, `Merge tag`, `Merge remote-tracking branch`, `Merged ...`, `Automatic merge`, and `Auto-merged`. A config turns these defaults off with `defaults: false` (`src/is-ignored.ts`).

So a policy has two choices. It can exempt merge commits, as commitlint does. Or it can require a conforming merge message, given with `git merge -m`, or with the GitHub "pull request title" setting and a conforming pull request title. The current commit policy of this repo takes the second choice ("including merge commits"). But the newest commit on `main`, `fd16846`, has the GitHub default message `Merge pull request #51 from a1exk-dev/release/0.1.0`.

### Revert commits

The only text is the FAQ entry "How does Conventional Commits handle revert commits?". It is not normative. It says the spec "does not make an explicit effort to define revert behavior" and leaves it to tooling authors. "One recommendation" is the `revert` type with a footer that lists the reverted SHAs:

```
revert: let us never again speak of the noodle incident

Refs: 676104e, a215868
```

Default message of `git revert` (`sequencer_format_revert_message` in `sequencer.c`):

```
Revert "<subject of the reverted commit>"

This reverts commit <full SHA>.
```

- For a merge commit, the body continues `, reversing changes made to <parent SHA>.`
- A revert of a `Revert "..."` commit gets the subject `Reapply "<original subject>"`.
- With `--reference` or `revert.reference`, the body uses the `--pretty=reference` form, and the subject is a comment that asks why (`git-revert.adoc`, `sequencer.c`).

This default has no type, so it does not conform. commitlint ignores it by default (`^(R|r)evert ` and `^(R|r)eapply ` in `is-ignored`). The line `This reverts commit <sha>.` has no `: ` or ` #` separator, so in a conforming message it is body text, not a footer.

The Angular convention sets a third form: the subject `revert: <header of the reverted commit>`, and the body `This reverts commit <hash>.` (`CONTRIBUTING.md` at `22b96b9`, section "Revert"). The changelog parser accepts the Git form and the Angular form: `revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i` (`conventional-changelog-conventionalcommits` `src/parser.js`).

So a Skill that must conform has to rewrite the Git default. The two forms with the most source support are the FAQ form (`revert:` plus `Refs: <sha>`) and the Angular form (`revert: <header>` plus `This reverts commit <sha>.`). The changelog parser reads the Angular form as a revert. It does not read the FAQ form as a revert, because that form has no `This reverts commit` line.

## 4. Where the 11 types come from

- The list `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test` is the `type-enum` rule of `@commitlint/config-conventional` (`src/index.ts`, severity Error).
- The spec's Summary names this package as one example: commitlint "(based on the Angular convention) recommends `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, and others". Its next sentence says additional types "are not mandated".
- The Angular `CONTRIBUTING.md` at `22b96b9`, the version that the spec links, lists 9 types under "Type ... Must be one of the following": `build, ci, docs, feat, fix, perf, refactor, style, test`. `revert` is a separate section of that file. `chore` is not in that list. commitlint adds `chore` and `revert`.
- The current Angular guidelines list 8 types. They no longer have `style`.
- The same `src/index.ts` gives each type a description and changelog title for the commitlint prompt. For example, `chore` is "Other changes that don't modify src or test files".

## 5. commitlint rules: spec or convention

The rules in `@commitlint/config-conventional` `src/index.ts`:

| Rule | Setting | Spec or convention |
| - | - | - |
| `type-empty` | never empty, Error | Spec, rule 1. |
| `subject-empty` | never empty, Error | Spec, rule 5. |
| `body-leading-blank` | always, Warning | Spec, rule 6 (a MUST that commitlint only warns on). |
| `footer-leading-blank` | always, Warning | Spec, rule 8 (a MUST that commitlint only warns on). |
| `header-trim` | always, Error | Convention. Close to rule 5, "immediately follow". |
| `type-enum` | the 11 types, Error | Convention. The spec allows any type (rule 14). |
| `type-case` | lower-case, Error | Convention. The spec makes case free for tools (rule 15). |
| `subject-case` | never sentence-case, start-case, pascal-case, or upper-case, Error | Convention. |
| `subject-full-stop` | never `.`, Error | Convention. |
| `header-max-length` | 100, Error | Convention. |
| `body-max-line-length` | 100, Error | Convention. |
| `footer-max-line-length` | 100, Error | Convention. |

The commitlint README, section "Beyond the specification", agrees. It says the config adds "a few stylistic rules the specification itself does not require", inherited from the Angular convention: the three 100-character limits (lines with URLs are exempt), `type-enum` ("while the specification allows any type"), and `type-case`, `subject-case`, and `subject-full-stop`. It says, "These rules narrow the specification — they do not conflict with it."

Other Angular rules that are not in the spec: the imperative, present tense ("change" not "changed"), no capital first letter, and no dot at the end (Angular `CONTRIBUTING.md` at `22b96b9`, section "Subject"; current guidelines, section "Summary"). commitlint puts the imperative only in its prompt text ("Write a short, imperative tense description"). It has no rule for it.
