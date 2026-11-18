# Tests for the wtf Skill

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
