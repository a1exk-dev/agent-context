# Grader for the git-commit output tests

You grade the runs of one output test. This is a read-only task, except for the `grading.json` files that you write.

## Inputs

- The eval folder: `<iteration>/eval-<name>/`. It has `eval_metadata.json` and one folder for each configuration (`with_skill`, `without_skill`).
- In each `<configuration>/run-1/` folder:
  - `transcript.md`: the run record. Lines that start with `[subagent <description>]` come from a subagent.
  - `outputs/report.md`: the final message of the run.
  - `outputs/git-before.md` and `outputs/git-after.md`: the git state after the setup and after the run. Each has the commits after the start commit with their full messages and stats, `git status --porcelain`, the staged stat, the refs of `origin`, and the Commit policy.
  - `outputs/audit.json`: what the runner found in the git commands of the main agent. `firstSkillLoad` and `firstGitWrite` are tool-call indexes from 0, or `null`. `forbidden` lists each command that S2 or S5 forbids.
- The starting project is `tests/skills/engineering/git-commit/project/` with the overlay that `eval_metadata.json` gives. Its `setup.steps` ran after the start commit.

## Grading

1. If a run folder has a `LIMIT_HIT` file, do not grade that run. Report that it needs a new run.
2. Grade each statement in `assertions` of `eval_metadata.json`, for each configuration.
3. A statement passes only with clear evidence in the outputs or the run record. A statement fails when the evidence is missing or partial.
4. Apply the statements literally:
   - A new commit is a commit in `git-after.md` that is not in `git-before.md`.
   - S1: pass when `firstSkillLoad` is not `null` and is less than `firstGitWrite`. When `firstGitWrite` is `null`, pass when the Skill loaded at all. In `without_skill` runs, the Skill is not installed, so S1 fails.
   - S2 and S5: use `audit.json`, then confirm each hit in `transcript.md`. For S5, also compare the `origin` refs and the commits of `git-before.md` with `git-after.md`.
   - S3: check the header form `<type>[(<scope>)][!]: <description>`, one blank line after the header when a body or footers follow, one blank line before the footers, no blank line between 2 footers, each footer as `<Token>: <value>` or `<Token> #<value>` with hyphens in the token, and uppercase `BREAKING CHANGE`.
   - S4: check each new commit against the Commit policy in `git-after.md`. Count the characters of the full header line for Header length.
   - S3 and S4: when the run made no new commit, they fail if the test's own statements expect a commit, and they pass if not.
   - S6: the report must give the short SHA and the header of each new commit, or the cause when no commit happened.
5. Write `<configuration>/run-1/grading.json` in this form:

```json
{
  "expectations": [
    {"text": "<statement text>", "passed": true, "evidence": "<quote or count>"}
  ],
  "summary": {"passed": 0, "failed": 0, "total": 0, "pass_rate": 0.0}
}
```

6. Reply with one line for each configuration: the pass count, and the text of each failed statement with a one-sentence reason.
