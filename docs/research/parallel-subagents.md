# Research: parallel subagents with per-result delivery

<!-- cspell:ignore anomalyco -->

Question (issue #94): How do Claude Code, Codex (OpenAI Codex CLI), and OpenCode start several subagents at the same time and give the main agent each result as soon as it is ready? For each platform: which call starts subagents in parallel; does the main agent get each result when that subagent finishes, or only when all calls of the message finish; can the main agent start a new subagent while others run; which limits apply.

Use: the planned parallel reviewer model of the `agent-instructions` Skill (`skills/writing/agent-instructions/references/review.md`). The loading, ASD-STE100, and ISO 24495-1 reviewers run at the same time, and each one has its own round count. The main agent acts on one report (corrects the text, starts that reviewer's next round) while the other reviewers still run.

This file adds to `docs/research/subagents.md` on `research/subagents` (#14), which covers fresh context, read-only limits, and detection. It does not repeat those points.

Sources, read on 2026-10-27:

- Claude Code docs, fetched as Markdown: [Subagents](https://code.claude.com/docs/en/sub-agents), [Tools reference](https://code.claude.com/docs/en/tools-reference), [Interactive mode](https://code.claude.com/docs/en/interactive-mode). [`CHANGELOG.md`](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), latest entry 2.1.312.
- Codex source: [openai/codex](https://github.com/openai/codex) at tag `rust-v0.165.0` (latest stable, commit `360319d`, 2026-10-27), files under `codex-rs/`. Codex docs: [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) (`sst/opencode` redirects there) at tag `v1.19.4` (latest release, commit `148842e`, 2026-10-22), files under `packages/opencode/src/`. Docs source under `packages/web/src/content/docs/`. The `dev` branch (`f7d0ce1`) has moved these files to other packages since the release.

## Summary

| | Claude Code | Codex V1 tools | Codex V2 tools | OpenCode, default | OpenCode, background flag on |
| - | - | - | - | - | - |
| Start call | `Agent`, one call per subagent | `spawn_agent` | `spawn_agent` (`fork_turns="none"`) | `task`, several calls in one message | `task` with `background: true` |
| Start call blocks | No: background is the default | No | No | Yes, until the subagent ends | No |
| Result arrives | Per subagent, as a completion notification | Per subagent: `wait_agent` returns when the first target ends | Per subagent, as a message in the parent's mailbox | Only when all `task` calls of the message end | Per subagent, as a synthetic message that wakes the parent |
| New subagent while others run | Yes | Yes | Yes | No | Yes |
| Concurrency cap (default) | 20 running | 6 open threads; a finished agent counts until `close_agent` | 3 subagents; idle ones are unloaded to make room | None found | None found |
| Per-reviewer rounds | Yes | Yes | Yes, while the main agent stays in its turn | No: lock-step | Yes, experimental |

The main result: Claude Code and Codex (both tool sets) let each reviewer run its own rounds. OpenCode forces lock-step rounds in its default setup, because the `task` tool blocks and the model sees no result until every `task` call of the message ends. Only its experimental background mode removes this limit.

## 1. Claude Code

- Start: one `Agent` call per subagent. "With nothing configured, a subagent that Claude spawns from your main conversation starts in the background" ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Which subagents run in the background").
- Delivery: "Background subagents run concurrently while you continue working." "A background subagent's results reach Claude as a completion notification in a later turn" (same page, "Run subagents in foreground or background", "Tools, permissions, and results of background subagents"). Each subagent sends its own notification, so the main agent gets each report when that subagent ends.
- Foreground runs are lock-step: "Foreground subagents block the main conversation until complete" (same section). The main agent waits in two cases: fork mode off (`CLAUDE_CODE_FORK_SUBAGENT=0`) and a request to wait, or `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`, with which "Claude waits for every subagent" ("Let Claude wait for a subagent"). In `claude -p` and the Agent SDK, Claude "can wait, on its own judgment or when you ask". So a Skill must ask for background runs, not for a wait.
- Fork mode is on by default from v2.1.302. While it is on, Claude "can't wait for a subagent" in interactive local sessions ("Turn fork mode off"). The `Agent` call must still name a non-fork type, because a fork copies the session history (see #14).
- New subagent while others run: yes. The `Agent` call of a background subagent returns at once, and the main agent keeps its turn. Spawning fails only at the cap.
- Cap: "when 20 subagents are running in a session, spawning another with the Agent tool fails with `Concurrent subagent limit reached`, and the error tells Claude not to retry". `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` changes it. Requires v2.1.217 ("Concurrent subagent limit").
- Other limits:
  - A background subagent has a smaller built-in tool set: `Read`, `Grep`, `Glob`, `Bash`, `Edit`, `Write`, web tools, and some others, plus MCP tools ("Available tools"). This is enough for a reviewer.
  - Its permission prompts go to the main session and name the subagent ("Tools, permissions, and results of background subagents").
  - An API error marks a background subagent failed. The message names the error and includes its last output ("API errors in subagents").
  - Usage limits: since 2.1.299, background agent notifications say when an agent "was stopped by a usage limit" (CHANGELOG 2.1.299). Parallel runs use more tokens at the same time, which is the reason for the current one-at-a-time rule in `review.md`.

## 2. Codex

Codex has two tool sets. The model catalog picks one per model (`core/src/config/mod.rs:1683`, `multi_agent_version_for_model`). In the bundled `models-manager/models.json`, V2 is set for gpt-6-*, gpt-6.1-*, gpt-5.6-sol, and gpt-5.6-terra, and V1 for gpt-5.6-luna. gpt-5.5 has no entry and follows the feature flags: `multi_agent` (V1) is stable and on, and `multi_agent_v2` is stable and off (`features/src/lib.rs:1529-1537`). A Skill must work with both.

### V1 tools

- Start: `spawn_agent` returns an agent id at once. The subagent runs on its own thread.
- Delivery: `wait_agent(targets, timeout_ms)` returns as soon as one target reaches a final status. The handler waits on a `FuturesUnordered` set, stops at the first result, and then adds only the results that are already ready (`core/src/tools/handlers/multi_agents/wait.rs:175-202`). The tool description: "Wait for agents to reach a final status. Completed statuses may include the agent's final message. Returns empty status when timed out. Once the agent reaches a final status, a notification message will be received containing the same completed status" (`core/src/tools/handlers/multi_agents_spec.rs:293`).
- Timeout: default 30 s, minimum 10 s, maximum 1 h (`core/src/tools/handlers/multi_agents_common.rs:22-24`, `core/src/config/mod.rs:260-262`). A timeout returns an empty status, so the main agent calls `wait_agent` again.
- New subagent while others run: yes, between `wait_agent` calls.
- Cap: 6 open threads by default (`DEFAULT_AGENT_MAX_THREADS`, `core/src/config/mod.rs:258`). "Completed agents remain open and count toward the concurrency limit until closed" (`close_agent` description, `multi_agents_spec.rs:347`). Over the cap, the spawn fails with `AgentLimitReached` (`core/src/agent/registry.rs:98-105`). With 3 reviewers, the main agent must `close_agent` each finished reviewer before it starts that reviewer's next round, or the 7th spawn fails.

### V2 tools

- Start: `spawn_agent` with `task_name`, `message`, and `fork_turns="none"`. It returns at once. Description: "its final answer will be provided to you when it finishes" (`multi_agents_spec.rs:800-806`).
- Delivery: when a subagent ends, Codex queues its final answer as a message to the parent, with `trigger_turn` false (`core/src/agent/control/completion.rs:115-140`). `wait_agent` wakes on "a mailbox update from any live agent", "Does not return the content", and returns a summary of which agents have updates (`multi_agents_spec.rs:306`). So the main agent gets each report when that subagent ends, as long as its turn is still active.
- An idle parent does not wake: a queue-only message starts a new turn only when the `wake_on_agent_messages` feature is on (`core/src/session/handlers.rs:88-98`). That feature is "under development" and off (`features/src/lib.rs:1570-1573`). A test shows that the notification is included in the next user turn (`core/tests/suite/subagent_notifications.rs:963`, `subagent_notification_is_included_without_wait`). So the main agent must stay in its turn and call `wait_agent` in a loop until all reviewers end their last round.
- Timeout: same as V1, default 30 s, minimum 10 s, maximum 1 h (`core/src/config/mod.rs:260-262`).
- New subagent while others run: yes.
- Cap: 4 threads per session including the main agent, so 3 subagents (`DEFAULT_MULTI_AGENT_V2_MAX_CONCURRENT_THREADS_PER_SESSION`, `core/src/config/mod.rs:259`, `:1697-1701`). The user setting `agents.max_concurrent_threads_per_session` counts subagents only, and Codex adds 1 for V2 (`core/src/config/mod.rs:2837-2848`). The docs agree: "Cap concurrently open spawned-agent threads, excluding the primary" ([Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)). At the cap, Codex unloads an idle resident subagent to make room. It fails with `AgentLimitReached` only when every resident is busy (`core/src/agent/control/residency.rs:186-271`). So 3 reviewers fit, and a finished reviewer does not block its next round. A 4th reviewer at the same time does not fit without a config change.

### Both tool sets

- Codex spawns only on an explicit request. The V1 description: "Do not spawn sub-agents unless the user or applicable AGENTS.md/skill instructions explicitly ask for sub-agents, delegation, or parallel agent work" (`multi_agents_spec.rs`, `spawn_agent_tool_description`).
- The docs show only the wait-for-all pattern: "Spawn one subagent for security risks, one for test gaps, and one for maintainability. Wait for all three, then summarize", and "When many agents are running, Codex waits until all requested results are available, then returns a consolidated response" ([Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)). The code does not force it. A Skill that wants per-reviewer rounds must say so: act on each report as it arrives, and keep waiting for the others.

## 3. OpenCode

### Default: blocking `task`

- Start: several `task` calls in one message. The tool description: "Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses" (`tool/task.txt`).
- Delivery: the `task` call waits for the subagent's session to end and returns its last text as `<task_result>` (`tool/task.ts:327-343`). The main loop sends one model request per step through `streamText` of the AI SDK (`session/llm.ts:280`), and runs the next step only after the step's tool calls have results (`session/prompt.ts:1088-1130`). So the main agent sees no report until every `task` call of that message ends. This is lock-step. (The wait for all tool results of a step is AI SDK behaviour. It is inferred from this loop, not stated in OpenCode docs.)
- New subagent while others run: no. The model can make new calls only in the next step.
- Cap: none found in `tool/task.ts` or `background/job.ts`. Depth: `subagent_depth` defaults to 1, so a subagent cannot start another (`tool/task.ts:106-114`; `config.mdx`, "Subagent depth").

### Experimental: `background: true`

- Switch: the `background` parameter exists only when `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true` or the umbrella `OPENCODE_EXPERIMENTAL=true` is set (`effect/runtime-flags.ts:11-14`, `:43`; `cli.mdx:724`, `:736`, "Enable background subagent tasks"). Without the flag, the tool schema hides the parameter, and a call with it fails with "Background subagents require OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true" (`tool/task.ts:98-100`, `:362-366`). A Skill cannot set this flag.
- Start: `task` with `background: true` "launches the subagent asynchronously and returns immediately" (`tool/task.ts:25-30`).
- Delivery: when the job ends, OpenCode adds a synthetic user message to the parent session, "Background task completed: <description>" with the `<task_result>` (`tool/task.ts:227-265`). This calls the session prompt, which joins the parent's loop if it runs, or starts a new loop if the parent is idle (`session/prompt.ts:1070`, `:1343-1346`; `effect/runner.ts:115-122`). The loop reloads the messages at each step (`session/prompt.ts:1092`). So each report arrives when its subagent ends, and it wakes an idle parent.
- New subagent while others run: yes.
- The returned text tells the model: "DO NOT sleep, poll for progress, ask the task for status, or duplicate this task's work" (`tool/task.ts:31-35`).

## 4. Per-reviewer rounds or lock-step

| Platform | Per-reviewer rounds | What the Skill must say |
| - | - | - |
| Claude Code | Possible by default | Start the 3 reviewers as background subagents of a non-fork type. Act on each completion notification. Do not ask to wait for a subagent. |
| Codex V1 | Possible | Call `wait_agent` on all running reviewers in a loop. When it returns a report, act on it, `close_agent` that reviewer, and spawn its next round. |
| Codex V2 | Possible, in one turn | Spawn with `fork_turns="none"`. Stay in the turn and call `wait_agent` in a loop until all reviewers end. Read each report from the mailbox message. Do not end the turn early, because an idle main agent does not wake. |
| OpenCode, default | Not possible: lock-step | Start the 3 `task` calls in one message. All 3 reports arrive together. Start the next round only for the reviewers that still have findings, again in one message. |
| OpenCode, flag on | Possible | Same as Claude Code with `background: true`. Experimental, and only the user can turn it on. |

A portable `review.md` therefore needs a fallback: per-reviewer rounds where the platform allows them, and lock-step rounds on OpenCode by default. In lock-step, a round ends when all running reviewers report, and a reviewer with no findings does not join the next round.

Two edits to the text of the file under review can collide: the main agent corrects the text for one report while another reviewer still reads the old text. All three platforms allow this. The research found no platform feature that prevents it. The Skill must decide what a running reviewer's report means after the text changed.

## Open points

- Claude Code: the docs do not say whether a completion notification can reach the main agent between tool calls of a running turn, or only when its turn ends.
- Codex V2: whether the mailbox message reaches the model in the same turn without a `wait_agent` call was not traced. The code path with `wait_agent` is clear.
- OpenCode: the release in which background subagents first shipped was not found. No run confirmed the background flow.
- No platform was run to confirm these findings. All come from docs and source code.
