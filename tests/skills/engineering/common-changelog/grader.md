# Grader for the common-changelog output tests

You grade one run of one output test. This is a read-only task, except for the `grading.json` file that you write.

## Inputs

- The eval folder: `<iteration>/eval-<name>/`. Its `eval_metadata.json` gives the request, the setup, the run date, and the statements.
- The run folder: `<eval folder>/<configuration>/run-1/`, where the configuration is `with_skill` or `without_skill`. It has these files:
  - `transcript.md`: the run record. Lines that start with `[subagent <description>]` come from a subagent.
  - `outputs/report.md`: the final message of the run.
  - `outputs/state-before.md` and `outputs/state-after.md`: the repository after the setup and after the run. Each has the commit graph, the branch, the remotes, `git status --porcelain`, `git diff --cached`, `git diff`, `CHANGELOG.md` with line numbers, and the Changelog policy `docs/agents/changelog-policy.md` with line numbers.
  - `outputs/audit.json`: what the runner found in the tool calls of the main agent. `firstSkillLoad`, `firstPolicyRead`, and `firstChangelogWrite` are tool-call indexes from 0, or `null`. `gitWrites` lists each git command that stages, commits, merges, resets, stashes, or pushes.
- The starting project is `tests/skills/engineering/common-changelog/project/` with the setup of `eval_metadata.json`. The fixed history: tag `v1.2.0`, then the merge commits of pull request #5 (author Alice) and #6 (author Bob), then the run branch. Pull request #6 has 2 commits: accented letters, which has an Unreleased item, and leading spaces, which has none.

## Rules to grade against

- Common Changelog: https://common-changelog.org/. A release heading is `## [X.Y.Z] - YYYY-MM-DD`. The groups are `Changed`, `Added`, `Removed`, `Fixed`, in that order. Each item is one line in the imperative mood, then its references, then its authors in their own parentheses, for example `([#6](https://github.com/example/demo/pull/6)) (Bob)`. Each reference is a Markdown link.
- The 2 deviations of the Skill: an undated `## Unreleased` section with no link, first after `# Changelog`, whose items have no commit reference; and `Host: none` items with no references.
- GitHub URL forms after `https://github.com/<owner>/<repo>`: `/commit/<sha>`, `/pull/<n>` written `#n`, `/issues/<n>`, `/releases/tag/<tag>`, `/compare/<prev>...<tag>`.
- GitLab URL forms after `https://<host>/<path>`: `/-/commit/<sha>`, `/-/merge_requests/<n>` written `!n`, `/-/issues/<n>`, `/-/releases/<tag>`, `/-/compare/<prev>...<tag>`.
- Bitbucket Cloud URL forms after `https://bitbucket.org/<path>`: `/commits/<sha>`, `/pull-requests/<n>` written `#n`, and the tag view `/commits/tag/<tag>` for each version link. Issue references come from Jira.
- The URL forms are the GitHub forms on `https://github.com/example/demo`, unless the setup of the test gives a different `origin` or a `Host` Setting. Then the statements of the test give the forms. The setup field `mergeMessage` gives the message of the merge commits of #5 and #6.
- An item with no references is correct when `Host` is `none`, and when the statements of the test require an item with no reference.
- A draft (an item that the Skill writes from git when the request gives no change text) is one summary item for all covered changes. It goes in the first group of `Changed`, `Added`, `Removed`, `Fixed` that has a change, with a maximum of 2 references. When one change is breaking, it goes in `Changed` with `**Breaking:** `. Its authors are the authors of each committed change that it covers. Such an item is correct, also when it names changes of other groups.
- `Authors: on` puts the author of the change after the references. When git gives no author for the change, an item with no author is correct.

## Grading

1. If the run folder has a `LIMIT_HIT` file, do not grade the run. Report that it needs a new run.
2. Grade each statement in `assertions` of `eval_metadata.json`.
3. A statement passes only with clear evidence in the outputs or the run record. A statement fails when the evidence is missing or partial.
4. Apply the statements literally:
   - A new commit is a commit in `state-after.md` that is not in `state-before.md`.
   - C1: pass when `firstSkillLoad` is not `null` and is less than `firstChangelogWrite`, or `firstChangelogWrite` is `null`. Confirm a policy change in `transcript.md` also comes after the load. In `without_skill` runs, the Skill is not installed, so C1 fails.
   - C2: when the setup removes no policy, pass when `firstPolicyRead` is not `null` and is less than `firstChangelogWrite`. Confirm in `transcript.md`.
   - C4: compare `git status --porcelain` of the 2 states. A file that the run deleted, added, or changed counts.
   - C5: compare `CHANGELOG.md` of the 2 states. Examine each line that the run added or changed against the rules above and the Changelog policy of `state-after.md`.
   - C6: the report must name each changed file and give each finding with line numbers, the rule with its § number, the severity, and a fix. When Review found nothing, a report that says so passes the finding part.
5. Write `<run folder>/grading.json` in this form:

```json
{
  "expectations": [
    {"text": "<statement text>", "passed": true, "evidence": "<quote or count>"}
  ],
  "summary": {"passed": 0, "failed": 0, "total": 0, "pass_rate": 0.0}
}
```

6. Reply with one line: the pass count, and the text of each failed statement with a one-sentence reason.
