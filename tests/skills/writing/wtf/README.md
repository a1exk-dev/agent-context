# Tests for the wtf Skill

The section "Testing Decisions" of [Spec: wtf Skill](https://github.com/a1exk-dev/agent-context/issues/234) gives the test plan. The resolution comment of [Which test prompts and pass criteria go in the wtf Skill's eval plan?](https://github.com/a1exk-dev/agent-context/issues/231) adds to it. These files run it.

## Output tests

An output test shows if a `/wtf` rewrite is clearer than the original message, and if the rewrite keeps each fact and each required part. The output tests run on Claude Code (`claude -p`) only.

| File | Purpose |
|---|---|
| `evals.json` | The 8 output tests: the messages, the call, the question, the fact list, and the statements of each test. |
| `fixtures/messages/` | The messages of the tests. Messages 1 to 4 are copies of the 4 messages of the prototype `prototypes/wtf-rewrite.html` on the branch `prototype/wtf-rewrite`. |
| `project/` | The sample project. Each run starts from a copy. |
| `run-evals.ts` | Runs the output tests, with and without the Skill. |
| `eval-lib.ts` | Reads the tests of `evals.json` and their messages. |
| `assertions.ts` | The script checks, and the check of the copy turns. |
| `grade.ts` | Grades the script statements of one run, and merges the `llm` results into `grading.json`. |
| `grader.md` | Instructions for the grader subagent of the `llm` statements, and the Confirmer prompt. |

The runner and `grade.ts` reuse the runner code of the human-communication tests and of `tests/skills/engineering/eval-lib.ts`. The unit tests (`*.test.ts`) test the script checks, the check of the copy turns, `grade.ts`, and `evals.json`. The unit tests run no Git, because the check container has no Git.

### How a run works

Each run is one Claude Code session in a temporary copy of `project/` outside this repository:

1. The runner copies `project/` and makes the start commit. A run with the Skill also gets `skills/writing/wtf/` in `.claude/skills/wtf/`. The runner installs no other Skill.
2. Each copy turn sends "Reply with exactly this text:" and one message of the test. The first copy turn starts the session with `--session-id`. Test 7 has 2 messages, so it has 2 copy turns.
3. The last turn resumes the session with `claude -p --resume` and sends the call of the test, for example `/wtf Q2`.
4. The runner saves the Git state before the first turn and after the last turn. Then it copies each changed file to `outputs/files/` and deletes the temporary folder.

The baseline (`without_skill`) has no Skill. Its last turn is "I don't understand your last message. Write it again more clearly." for each test.

The folder of a run is `<iteration>/eval-<name>/<configuration>/run-1/`. It holds these files:

- `copy-<n>/`: the transcript and the reply of the copy turn of message `<n>`.
- `transcript.jsonl` and `transcript.md`: the record of the last turn.
- `outputs/report.md`: the final message of the last turn.
- `outputs/git-before.json`, `outputs/git-after.json`, and their `.md` forms: the Git state before and after the session.

### The statements

Each test gets the common statements first:

- The script statements W1 to W3: no "What I changed" note, no check question, and no changed file.
- The `llm` statements W4 to W9: the context line, the facts, the required parts, the question at the end, the length, and the clarity.

Some tests add their own statements: the Q2 scope of test 5, the diff and the command of test 6, the first message of test 7, and the single method of test 8.

A run counts only when each copy turn replied with its message word for word. `grade.ts` compares the words and ignores the white space. When a copy turn changed its message, `grade.ts` writes `COPY_CHANGED` and the first changed word in `script-grading.json`, and grades nothing.

### Run the output tests

The runner needs [Bun](https://bun.sh) and Git on the host, because it starts `claude` with your sign-in. Run it from the repository root:

```sh
bun tests/skills/writing/wtf/run-evals.ts --out /tmp/wtf-evals/iteration-1 --ids 1,5
```

- `--ids` selects tests. With no `--ids`, the runner runs the 8 tests.
- `--configs with_skill` skips the baseline.
- The runner runs a maximum of 5 runs at the same time (`--jobs 5`). It refuses a `--jobs` value above 5.
- When a turn hits the usage limit, the runner writes a `LIMIT_HIT` file in the folder of that turn. Run that test again later.

### Grade a run

Grade each run folder in 4 steps:

1. Run `bun tests/skills/writing/wtf/grade.ts script <run-dir>`. It grades the script statements and writes `script-grading.json`. When the run has `LIMIT_HIT` or `COPY_CHANGED`, `grade.ts` grades nothing and exits 1. Run that test again.
2. Give `grader.md` and the run folder to a new grader subagent, one grader for each run. The grader writes `llm-grading.json`.
3. For each `llm` statement with a "no", start 2 Confirmers with the prompt in `grader.md`, and write `confirmers.json`. A failed statement counts only when 1 or more Confirmers agree.
4. Run `bun tests/skills/writing/wtf/grade.ts merge <run-dir>`. It writes `grading.json`.

Start a maximum of 5 graders or Confirmers at the same time.

### Compare with the baseline

`script-grading.json` gives the word counts of the messages and of the rewrite in `words`. Compare the word counts and the W5 facts of the baseline with the runs with the Skill. The stop rule uses only the runs with the Skill: stop when each statement is true. After 5 rounds, stop and report each statement that is still false.
