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
   - Statement 6: quoted text and code spans also count. Code in a code block does not count, as "When you use STE for text" in `skills/writing/agent-instructions/references/ste-rules.md` says. List each hit. The signal word CAUTION is not an emphasis word.
   - Statement 7: count the words of each sentence in the new or changed text, and find its text type. Use only these sections of `skills/writing/agent-instructions/references/ste-rules.md`: "When you count words", "When you write a procedure or a rule", "When you write a note", and "When you write descriptive text". Use no other counting rule. Give the longest procedural sentence and the longest other sentence with their counts.
   - Statement 9: apply "When you select the words and the tone" in `skills/writing/agent-instructions/references/plain-language-checks.md`.
   - Statement 8: the specified `@AGENTS.md` exception in `CLAUDE.md` exempts that line from the prose-and-condition requirement as well as the `@path` restriction. Issue #17 requires this entry-file layout. The explicitly requested import in test 7 has the same exemption.
   - Statement 1: the main agent started 3 reviewer subagents, one for each source, with no fork of its history. On Claude Code, all `Agent` starts of a round come before the first `TOOL RESULT` of a subagent of that round. On OpenCode, all `task` calls of a round are in one assistant message. `transcript.md` does not show message bounds, so read them from the parent session export in `sessions/`. A round with more than 3 checks runs in groups of 3, and a group starts only after a subagent of the earlier group ends. A `Write`, `Edit`, or file-changing tool call by the main agent on a reviewed file between the first start and the last report of a round fails the statement.
   - Statement 2: distinguish findings from required notices about permitted limitations. The required notice about an existing Skill folder does not claim that the chosen folder breaks a rule. If a reviewer presents an item as a finding, it still needs its rule and text quote.
   - Statement 3: find each reader subagent and check its tool calls. A `Write`, `Edit`, or state-changing `Bash` call fails the statement. This also applies to OpenCode's equivalent tools, including `apply_patch`. The reader test must start after the last review round before it ends. A review round after the reader test is permitted when it only checks text that a reader-test fix changed. Check the reader-test rounds in the same way as the review rounds of statement 1: all reader starts of a round before its first report, a maximum of 3 open, and no change to a tested file before the last report of the round.
   - Statement 4: count review rounds and reader-test rounds from the subagent starts. A round is all subagent starts between two corrections by the author.
   - Failed subagent: if a run shows a failed subagent (a start error, or a subagent that ends without a report), the run passes only with one new start for that check, and after a second failure, the checks of "When no subagent is available" in `skills/writing/agent-instructions/references/review.md`.
   - Test 10 has no subagents. Claude Code disables `Agent`; OpenCode denies `task`. Each review and reader report must be in the run record as its own tool call that saves that one report, in its own assistant message, in sequence. A tool call or an assistant message that saves 2 or more reports fails statement 10.2. A tool call that changes a saved report also fails statement 10.2, because "When no subagent is available" in `skills/writing/agent-instructions/references/review.md` forbids it. A claim in the report alone is not evidence.
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
