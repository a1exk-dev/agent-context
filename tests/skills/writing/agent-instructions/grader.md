# Grader for the agent-instructions output tests

You grade the runs of one output test. This is a read-only task, except for the `grading.json` files that you write.

## Inputs

- The eval folder: `<iteration>/eval-<name>/`. It has `eval_metadata.json` and one folder for each configuration (`with_skill`, `without_skill`).
- In each `<configuration>/run-1/` folder:
  - `transcript.md`: the run record. Lines that start with `[subagent <description>]` come from a subagent. A `TOOL CALL Agent` or `TOOL CALL Task` line in the main agent starts a subagent.
  - `outputs/changes.diff`: all file changes against the starting project. The starting project is `tests/skills/writing/agent-instructions/project/` with the overlay and removals that `evals.json` gives for this test.
  - `outputs/files/`: the full text of each changed file.
   - `outputs/report.md`: the end-of-run report (the final message).
   - OpenCode runs also have `sessions/`: the complete parent and child session exports. Their `task` calls appear as `TOOL CALL Task` in `transcript.md`. Tool names such as `read`, `bash`, and `apply_patch` retain their OpenCode names.

## Grading

1. If a run folder has a `LIMIT_HIT` or `INCOMPLETE` file, do not grade that run. Report that it needs a new run.
2. Grade each statement in `assertions` of `eval_metadata.json`, for each configuration.
3. A statement passes only with clear evidence in the outputs or the run record. A statement fails when the evidence is missing, partial, or only on the surface.
4. Apply the statements literally:
   - "New or changed text" means the added lines in `changes.diff`, for files that the run wrote or changed. It does not include the report.
   - Statement 6: quoted text and code spans also count. List each hit.
   - Statement 7: count the words of each new sentence. A code span, path, URL, or quoted text counts as 1 word. A number counts as 1 word. The signal word "CAUTION:" is a label, not a word. Give the longest imperative and the longest other sentence with their counts.
   - Statement 8: the specified `@AGENTS.md` exception in `CLAUDE.md` exempts that line from the prose-and-condition requirement as well as the `@path` restriction. Issue #17 requires this entry-file layout. The explicitly requested import in test 7 has the same exemption.
   - Statement 1: the main agent started 3 reviewer subagents, one for each source, with no fork of its history.
   - Statement 2: distinguish findings from required notices about permitted limitations. The required notice about an existing Skill folder does not claim that the chosen folder breaks a rule. If a reviewer presents an item as a finding, it still needs its rule and text quote.
   - Statement 3: find each reader subagent and check its tool calls. A `Write`, `Edit`, or state-changing `Bash` call fails the statement. This also applies to OpenCode's equivalent tools, including `apply_patch`. The reader test must start after the last review round before it ends. A review round after the reader test is permitted when it only checks text that a reader-test fix changed.
   - Statement 4: count review rounds and reader-test rounds from the subagent starts.
   - Test 10 has no subagents. Claude Code disables `Agent`; OpenCode denies `task`. Each review and reader report must be in the run record as its own tool call that saves that one report, in its own assistant message, in sequence. A tool call or an assistant message that saves 2 or more reports fails statement 10.2. A claim in the report alone is not evidence.
   - Statement 10: compare the lines outside the asked change with the starting file. Check the report for each item in `known_mistakes`.
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
