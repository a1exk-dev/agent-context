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

## Load tests

The load tests show that a plain request never loads `wtf`, and that the call of the Operator always loads `wtf`. The tests run on Claude Code, Codex, and OpenCode 2.

`load-requests.json` holds the requests. Each request has its expected result in `should_trigger`:

- 10 plain requests must not load `wtf`, for example "I don't get your last message". These requests run on each platform.
- 3 call forms must load `wtf`: `/wtf` on Claude Code, `$wtf` on Codex, and `@wtf` on OpenCode 2. The `platform` field of a call form names its platform.

### Run the load tests

Run one platform at a time from the repository root. Each request runs 3 times:

```sh
bun tests/skills/writing/wtf/run-load-test.ts --platform claude --out /tmp/wtf-load/claude.json
bun tests/skills/writing/wtf/run-load-test.ts --platform codex --out /tmp/wtf-load/codex.json
bun tests/skills/writing/wtf/run-load-test.ts --platform opencode --out /tmp/wtf-load/opencode.json
```

Before you run the load tests, do these steps:

1. Make sure that `skills/writing/wtf/SKILL.md` is there. Else the runner stops.
2. Log in to each platform that you test. Codex uses the login of `codex login`.
3. Make sure that the model of each platform is available. `--model` selects a different model.

These options change a run:

| Option | Default | Effect |
|---|---|---|
| `--model` | `claude-opus-5-5` on Claude Code, the model of the Codex configuration on Codex, `anthropic/claude-opus-5-5` on OpenCode 2 | The model of each run. |
| `--ids 1,11` | All requests | Runs only these requests. The number is the position of the request in the list of the platform, from 1. |
| `--runs` | 3 | The number of runs of each request. |
| `--jobs` | 5 | The maximum number of runs at the same time. The runner refuses a value over 5, as `MEMORY.md` tells. |
| `--timeout` | 300 | The maximum time of one run, in seconds. |

The runner writes the result file of `--out`, and prints one line for each request. A request is correct only when each of its runs agrees with `should_trigger`. So one wrong load of `wtf` fails the request. The stop rule needs each request to be correct on each platform.

### How each run works

Each run starts in a new empty project outside this repository. The runner copies `skills/writing/wtf/` into the Skill folder of the platform: `.claude/skills/`, `.agents/skills/`, or `.opencode/skills/`.

| Platform | How the runner sends the request | What the load decision reads |
|---|---|---|
| Claude Code | `claude -p` with the request on stdin and `--replay-user-messages` | The replayed user message, and the tool calls |
| Codex | `codex exec --json` | The rollout file of the thread in `~/.codex/sessions/`, or in `$CODEX_HOME/sessions/` |
| OpenCode 2 | The prompt API of an `opencode serve` server | The session of `opencode session export` |

`opencode run` attaches no Skill for `@wtf`. The TUI of OpenCode 2 attaches the Skill when the Operator selects `@wtf` in the autocomplete. So the runner sends the prompt to a server, and attaches a Skill for each `@<name>` in the request, as the TUI does.

### The load decision

`load-decision.ts` decides for each run if the run loaded `wtf`. A run loads `wtf` in one of these cases:

- The platform adds the text of `wtf` for the call of the Operator.
- The agent loads `wtf` with the Skill tool of the platform. Claude Code refuses this call for a Manual-only Skill, so a refused call is no load.
- The agent reads `wtf/SKILL.md` with a tool, for example a shell command.

`load-decision.test.ts` tests each load decision with saved run output in `fixtures/load/`. The Claude Code and OpenCode 2 files come from real runs. The Codex files `codex-call.jsonl` and `codex-plain.jsonl` come from real rollout files. `codex-read.jsonl` follows the rollout format, because no logged-in Codex run was available.
