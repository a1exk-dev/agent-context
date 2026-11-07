# Pick the next version

Read this file before Pick. Also read it before you start a `release/*` branch when the request gives no version. The Setting table is in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

## Before you read the tags and the commits

Pick reads only the tags and the commit messages. Do not read the code or the diffs. Do not use the Setting `Breaking definition` to find a breaking change. The commit authors mark each breaking change in the commit message, so the same commits always give the same version.

## When you find the last release

1. Run `git tag --list`.
2. Keep each tag `<Tag prefix>X.Y.Z` that has no pre-release part and no build part. When `Tag prefix` is `none`, the tag is `X.Y.Z`.
3. The last release is the highest of these versions. Compare X first, then Y, then Z, as numbers. For example, 1.10.0 is higher than 1.9.0.
4. If no tag has this form, the project has no release. Do the steps in "When the project has no release".

## When the version is for a hotfix

When HEAD is on a `hotfix/*` branch, or the request asks for the version of a hotfix, do not find the bump. The next version is the next patch of the last release. For example, the last release 1.2.0 gives 1.2.1. Do not read the commits, because a hotfix only corrects the last release.

## When you find the commit set

The commit set is the commits in the Development branch that are not in the Production branch.

1. When `Development branch` is `none`, the commit set is the commits in the Production branch after the last release tag. Then use `<tag>..<production>` in place of `<production>..<development>` in the 2 commands of this section. Also use `Production merge` in place of `Development merge` in this file.
2. For each of the 2 branches, use the local branch. If the local branch is not there, use `origin/<branch>`.
3. Run this command to get the commits that the Development branch got directly, with their parents and messages:

   ```sh
   git log --first-parent --format='%h %p%n%B%n----' <production>..<development>
   ```

4. Run this command to get each commit of the set, also the commits of the merged branches:

   ```sh
   git log --format='%h%n%B%n----' <production>..<development>
   ```

## When a commit is a release or Back-merge commit

Do not count these commits, because they come from a release that has a version already:

- A merge of a `release/*` branch.
- A Back-merge: a merge of the Production branch, of a tag, or of a `bugfix/back-merge-v<version>` branch. An example is `Merge tag 'v1.2.0' into develop`.
- Each commit that only one of these merges brings into the commit set. To find these commits, run `git log --format=%h <merge>^1..<merge>^2`.

## When Development merge is merge commit

1. For each counted commit of the first command in "When you find the commit set", find the bump:
   - A commit with 2 parents is a merge. Find the branch name in the first line of its message, as the table after this list shows. A `feature/*` branch gives minor. A `bugfix/*` branch gives patch.
   - A merge of a different branch, or a merge message in a different form, makes the bump unclear.
   - A commit with 1 parent came from no merged branch, for example a direct push or a squash merge. This commit makes the bump unclear.
2. If no `feature/*` branch and no `bugfix/*` branch was merged, the bump is unclear.

| Message form | Example |
|---|---|
| `Merge branch '<branch>'`, and after it ` into <target>` or nothing | `Merge branch 'feature/search' into develop` |
| `Merge remote-tracking branch 'origin/<branch>'`, and after it ` into <target>` or nothing | `Merge remote-tracking branch 'origin/bugfix/typo'` |
| `Merge pull request #<number> from <owner>/<branch>` | `Merge pull request #5 from example/feature/search` |
| `<type>: merge <branch> into <target>`. The type can have a scope in parentheses. The line can end with ` (#<number>)`. | `chore: merge bugfix/typo into develop (#6)` |

## When Development merge is squash

1. For each counted commit of the first command in "When you find the commit set", read the first line of its message as a Conventional Commits header: `<type>(<scope>)!: <description>`. The scope and the `!` are optional.
2. The type `feat` gives minor. The type `fix` gives patch. Each other type, and a first line in a different form, gives no bump.
3. Do the steps in "When you find a breaking change". If no commit gives a bump and no commit is a breaking change, the bump is unclear.

## When you find a breaking change

Do these steps for the 2 values of `Development merge`. Read the full message of each counted commit of the second command in "When you find the commit set". A commit is a breaking change in one of these conditions:

- The first line has a `!` directly before the colon, for example `feat!: remove the v1 API` or `feat(api)!: remove the v1 API`.
- A line of the message starts with `BREAKING CHANGE:` or `BREAKING-CHANGE:`.

A breaking change gives major.

## When you find the next version

Do these steps only when the bump is not unclear.

1. The bump is the highest bump of the commit set: major, then minor, then patch.
2. When the last release is lower than 1.0.0, a breaking change gives the value of `Breaking before 1.0.0`: `minor` or `major`. A feature still gives minor, and a fix still gives patch.
3. Make the next version from the last release `X.Y.Z`:
   - Major gives `X+1.0.0`.
   - Minor gives `X.Y+1.0`.
   - Patch gives `X.Y.Z+1`.
4. Do not add a pre-release part, a build part, or a `v` to the version.

| Last release | Commit set | Next version |
|---|---|---|
| 1.2.0 | A feature and a fix | 1.3.0 |
| 1.2.3 | A feature and a fix | 1.3.0 |
| 1.2.0 | Only fixes | 1.2.1 |
| 1.2.0 | A breaking change | 2.0.0 |
| 0.4.0 | A breaking change, with `Breaking before 1.0.0: minor` | 0.5.0 |
| 0.4.0 | A breaking change, with `Breaking before 1.0.0: major` | 1.0.0 |

## When the bump is unclear

Give no version, because Pick never guesses. A released version cannot change, so an incorrect version stays in the history.

- For Pick alone, do not ask a question. In the report, give the cause and each unclear commit with its short SHA and its first line. Tell the caller that Start of a `release/*` branch asks the Operator for the version.
- For Start of a `release/*` branch, ask the Operator for the version. In the question, give the cause and each unclear commit with its short SHA and its first line. Also give the value of `Breaking definition` word for word, in a code span. Do not change its words. When the value is `default`, give the default definition: "users or other programs must change what they do to keep working". Give the next patch, the next minor, and the next major version of the last release as answers. The Operator can also type a different version.
- When the platform has no question tool, or the question tool gives an error, stop. In the report, give the text of the question and its answers. Tell the caller to give the version in a new request, for example "Start release 1.3.0".

## When the project has no release

The first version is a decision of the Operator.

- For Pick alone, do not ask a question. In the report, tell the caller that no release tag exists. Also give the 2 possible first versions: `0.1.0` and `1.0.0`.
- For Start of a `release/*` branch, ask the Operator one question for the first version. Give `0.1.0` first, as the recommended answer, and then `1.0.0`. Semantic Versioning 2.0.0 recommends 0.1.0 for the first release of a project in development.
- When the platform has no question tool, or the question tool gives an error, stop. In the report, tell the caller that no release tag exists. Also give `0.1.0` and `1.0.0`. Tell the caller to give the version in a new request, for example "Start release 0.1.0".

## When you report the version of Pick

Give the next version, the last release tag, and the bump. For each commit that gave the bump, give its short SHA and its first line. Tell the caller that Pick changed nothing.
