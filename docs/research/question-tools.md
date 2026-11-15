# Research: how a Skill asks the user a question, and what happens when no human answers

<!-- cspell:ignore anomalyco dont CLAUDECODE noninteractive -->

Question (issue #58): Which question tool does each supported platform give a Skill? Can a subagent use it? What happens in a run with no human, for example a subagent, `claude -p`, `codex exec`, or `opencode run`? How can a Skill detect that case?

Use: the `git-commit` Skill spec (map #56). The Skill asks the operator setup questions and gets approval before each commit. An agent can also run the Skill, as a subagent or in a non-interactive run, where no human answers.

This file builds on `docs/research/agent-platforms.md` (branch `research/agent-platforms`) and `docs/research/subagents.md` (branch `research/subagents`). It does not repeat them.

Sources, read on 2026-10-20:

- Claude Code docs (fetched as Markdown from code.claude.com): [Tools reference](https://code.claude.com/docs/en/tools-reference), [Subagents](https://code.claude.com/docs/en/sub-agents), [Headless](https://code.claude.com/docs/en/headless), [Permission modes](https://code.claude.com/docs/en/permission-modes), [Hooks](https://code.claude.com/docs/en/hooks), [Skills](https://code.claude.com/docs/en/skills), [Environment variables](https://code.claude.com/docs/en/env-vars), [Agent SDK user input](https://code.claude.com/docs/en/agent-sdk/user-input).
- Claude Code repo: [`CHANGELOG.md`](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), latest entry 2.1.304.
- Codex source: [openai/codex](https://github.com/openai/codex) at `main` commit `c465563` (2026-10-20). The latest stable tag is `rust-v0.163.0`; this file did not check that tag separately.
- Codex docs: [Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode). It does not mention questions.
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) at `dev` commit `3fdb13b` (2026-10-20, version 2.1.1, the latest release tag `v2.1.1`). Docs source under `packages/web/src/content/docs/`.
- OpenCode docs: [Tools](https://opencode.ai/docs/tools/), [Permissions](https://opencode.ai/docs/permissions/), [Agents](https://opencode.ai/docs/agents/).

In this file, `CC/` is `https://code.claude.com/docs/en/`, Codex paths are relative to `codex-rs/` at `c465563`, and OpenCode paths are relative to `packages/` at `3fdb13b`. Where docs and source disagree, this file trusts the source.

## Summary

| | Claude Code | Codex | OpenCode |
| - | - | - | - |
| Question tool | `AskUserQuestion` | `request_user_input` (blocking); `request_user_input_async` on some models | `question` |
| Usable in the normal interactive mode | Yes | Only in Plan mode. In Default mode the call fails | Yes (Build and Plan agents) |
| Shape | 1-4 questions, 2-4 options each, free text added | 1-3 questions, 2-3 options each, "Other" added | 1 or more questions, options, free text added, `multiple` allowed |
| Unanswered question in an interactive session | Waits forever by default; optional idle timeout | Waits | Waits |
| Subagent | Tool removed from every subagent | Call fails: "can only be used by the root thread" | Denied for built-in `general` and `explore`; a custom subagent can ask, and the UI shows it |
| Non-interactive run | `claude -p`: tool not offered, unless the run has a permission host | `codex exec`: call fails | `opencode run`: question cancelled, model told to continue with assumptions |
| Signal to the Skill | Tool is absent | Tool call returns an error | Tool call returns an error with a fixed message |

The main result: no platform lets a Skill rely on a structured question tool. Only OpenCode and Claude Code give it in their normal interactive mode, and none gives it to a default subagent or a plain non-interactive run. In every no-human case the platform tells the agent in-band: the tool is missing, or the call fails. No platform sets an environment variable or other flag that a Skill can read beforehand. So a portable Skill asks with the question tool when it exists, and otherwise asks in a plain-text message and ends its turn. For an approval gate, the Skill must treat "no answer" as "no approval", because Codex Default mode and OpenCode tell the model to continue on its own judgment.

## 1. Claude Code

### The tool

- `AskUserQuestion` "Asks multiple-choice questions to gather requirements or clarify ambiguity". It needs no permission ([CC/tools-reference](https://code.claude.com/docs/en/tools-reference), tools table). The user picks an option or types own text through `Other` or the notes field (same page, "AskUserQuestion tool behavior").
- Each call takes 1-4 questions with 2-4 options each ([Agent SDK user input](https://code.claude.com/docs/en/agent-sdk/user-input), "Limitations").
- A question stays open until the user answers. The optional `askUserQuestionTimeout` setting (`60s`, `5m`, `10m`) closes it after idle time. Then it submits the options already selected and "tells Claude you may be away from your keyboard, so Claude proceeds on its own judgment" ([CC/tools-reference](https://code.claude.com/docs/en/tools-reference), "Question auto-continue timeout"). The default changed to "no auto-continue" in 2.1.200 (CHANGELOG 2.1.200). The timer never starts in a background session, in screen reader mode, or with Remote Control (same section).
- No mode auto-approves it, including `bypassPermissions` ([CC/permission-modes](https://code.claude.com/docs/en/permission-modes), "Actions no mode auto-approves"). `dontAsk` mode denies it "even if your allow rules match it" (same page). Auto mode does not suppress it when "the user or a skill explicitly relies on it" (CHANGELOG 2.1.147).
- Before 2.1.69, listing it in a Skill's `allowed-tools` auto-allowed it, and it ran "with empty answers" (CHANGELOG 2.1.69). A Skill must not list it in `allowed-tools` for older versions.
- A Skill can remove it with the Claude-only `disallowed-tools` field: "Use for autonomous skills that should never call certain tools, such as `AskUserQuestion` for a background loop" ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference"). Codex and OpenCode ignore this field (see `agent-platforms.md`).
- `--channels` disables it (CHANGELOG 2.1.83).

### Subagents

- Claude Code removes `AskUserQuestion` from every subagent, "even when listed in the `tools` field". Only a fork keeps the main conversation's tools ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Available tools"). The SDK docs agree: "`AskUserQuestion` is not currently available in subagents spawned via the Agent tool" ([Agent SDK user input](https://code.claude.com/docs/en/agent-sdk/user-input), "Limitations").
- So a Skill with `context: fork` also runs without it, because that Skill runs in a subagent ([CC/skills](https://code.claude.com/docs/en/skills), "Run skills in a subagent"). This is an inference from the two pages.

### Non-interactive runs (`claude -p`)

- "In non-interactive mode with the `-p` flag, Claude Code offers them only when the run has a permission host to receive the prompt, such as an Agent SDK `canUseTool` callback" ([CC/hooks](https://code.claude.com/docs/en/hooks), "Tools that require user interaction"). A permission host is an SDK `canUseTool` callback or an MCP tool passed with `--permission-prompt-tool` ([CC/headless](https://code.claude.com/docs/en/headless), "Turn off permission prompts in unattended runs").
- So a plain `claude -p` run has no `AskUserQuestion` in its tool list.
- `--permission-prompts none` (v2.1.259+) removes it even when a host exists ([CC/headless](https://code.claude.com/docs/en/headless), same section).
- A host can answer it: an SDK app gets the call in `canUseTool` and returns the answers ([Agent SDK user input](https://code.claude.com/docs/en/agent-sdk/user-input), "Handle clarifying questions"). A `PreToolUse` hook can answer it with `permissionDecision: "allow"` and `updatedInput` that holds `answers` (since 2.1.85), or return `"defer"` so that the run exits with `stop_reason: "tool_deferred"` and the caller resumes it with the answer ([CC/hooks](https://code.claude.com/docs/en/hooks), "Defer a tool call for later").

### Detect

- No documented environment variable says "no human". `CLAUDECODE` and `CLAUDE_CODE_CHILD_SESSION` are set in subprocesses of both interactive and `-p` sessions ([CC/env-vars](https://code.claude.com/docs/en/env-vars)).
- The tool is absent in a subagent, in `claude -p` without a host, with `--permission-prompts none`, or with `--channels`. It is present but denied in `dontAsk` mode.

## 2. Codex

### The tool

- `request_user_input` takes 1-3 questions. Each question has `id`, `header`, `question`, and 2-3 `options` with `label` and `description`. The client adds a free-form "Other" option. The schema asks the model to put the recommended option first and add "(Recommended)" to its label (`core/src/tools/handlers/request_user_input_spec.rs`).
- It is registered by default. `[tools] experimental_request_user_input.enabled = false` removes it (`core/src/config/mod.rs`, `resolve_experimental_request_user_input_enabled`; `core/src/tools/spec_plan.rs`).
- It works only in Plan collaboration mode. Codex has two modes, Default and Plan, and Default is the default (`protocol/src/config_types.rs`, `ModeKind`, `allows_request_user_input`). The feature `default_mode_request_user_input` would allow it in Default mode, but it is "UnderDevelopment" and off (`features/src/lib.rs`). In Default mode the tool stays in the list, and a call fails with "request_user_input is unavailable in Default mode" (`request_user_input_spec.rs`, `request_user_input_unavailable_message`; handler in `request_user_input.rs`).
- The Default mode prompt tells the model: "If explicit user input is required for another reason before progress can safely continue, do not use the `request_user_input` tool. Ask the user directly with one concise plain-text question instead." It also says "If `request_user_input` returns no answers, continue with best judgment" (`collaboration-mode-templates/templates/default.md`). So in Default mode the normal way to ask is a plain-text message that ends the turn.
- In Plan mode the call blocks the turn until the user answers (`is_blocking: mode == ModeKind::Plan` in `request_user_input.rs`).
- `request_user_input_async` is a second tool, only for models whose catalog entry lists it. In the bundled catalog these are gpt-6-astra, gpt-6.1-sol, gpt-6-sol, and gpt-6-luna; gpt-5.6-* and gpt-5.5 do not have it (`models-manager/models.json`, `experimental_supported_tools`). It "returns immediately without ending the turn or waiting for a reply; any reply arrives asynchronously as a new user message" (`prompts/src/model_messages.rs`). It is not registered for subagents (`spec_plan.rs`, `!is_non_root_agent()`). It cannot block a turn for an approval.

### Subagents

- A subagent sees `request_user_input` in its list, but the call fails with "request_user_input can only be used by the root thread" (`request_user_input.rs`, `is_non_root_agent`). `request_user_input_async` is not registered for subagents (`spec_plan.rs`).
- So a Codex subagent can only put its question in its final message, which goes to the parent agent (see `subagents.md`).

### Non-interactive runs (`codex exec`)

- `codex exec` starts each turn with `collaboration_mode: None`, so the turn runs in Default mode (`exec/src/lib.rs`, `turn/start`). A call fails with the Default mode error above.
- If a request ever reaches the exec client, it rejects it: "request_user_input is not supported in exec mode" (`exec/src/lib.rs`, `handle_server_request`). The handler then returns "request_user_input was cancelled before receiving a response" to the model (`request_user_input.rs`). MCP elicitation requests are auto-cancelled, and command and file-change approvals are rejected the same way (same function).
- A plain-text question ends the turn, and `codex exec` exits after the turn. A caller can answer with `codex exec resume <id> "<answer>"` (`exec/src/cli.rs`, `Resume`).

### Detect

- No environment variable or flag says "no human". The tool is present in Default mode, Plan mode, `codex exec`, and subagents, so its presence proves nothing. Only the error text on a call tells the agent that no human can answer.

## 3. OpenCode

Note: OpenCode 2.x moved the code from `packages/opencode/` to `packages/core/` and `packages/cli/`, and renamed tools. The subagent tool is now `subagent`, not `task`, and the shell tool is `shell`, not `bash`. An old `task` permission migrates to `subagent` (`core/src/tool/plugin/subagent.ts`, `core/src/v1/config/migrate.ts`). `subagents.md` describes 1.18.34 and is out of date on these names.

### The tool

- `question` asks 1 or more questions. Each question has a header, the question text, options, and optional `multiple: true`. A "Type your own answer" option is added. The tool description asks the model to put a recommended option first with "(Recommended)" (`core/src/tool/plugin/question.ts`; [Tools](https://opencode.ai/docs/tools/), "question").
- The call first checks the `question` permission, then shows a form and waits (`question.ts`). The answer comes back as `User has answered your questions: "<q>"="<a>"`. An unanswered question shows as `Unanswered`.
- If the user dismisses the form, the step ends with "The user dismissed this question". If a client cancels it with a message, the model gets that message as a tool error and continues (`question.ts`, comment on the `cancelled` branch).
- Permissions: the Build and Plan agents allow `question` (`core/src/plugin/agent.ts`, `core/src/plugin/plan.ts`; [Agents](https://opencode.ai/docs/agents/)). Other permissions default to `allow` ([Permissions](https://opencode.ai/docs/permissions/), "Defaults"). A tool whose last matching rule is `deny` for `*` is removed from the tool list (`core/src/tool.ts`, `whollyDisabled`).

### Subagents

- The built-in `general` subagent denies `question`. The built-in `explore` subagent denies everything except its read and search tools (`core/src/plugin/agent.ts`). So neither has the tool.
- A custom subagent gets the default permissions, so it has `question` unless its config denies it. User config rules apply after the built-in rules, and the last match wins (Plan section of [Agents](https://opencode.ai/docs/agents/)), so a global `"question": "allow"` or `"*": "allow"` also gives the tool back to `general`. This is an inference from the documented rule order.
- When a child session asks, the web app and the TUI find open forms in the whole session tree, so the human sees the question (`app/src/session/requests/session-request-tree.ts`; `tui/src/mini/stream-v2.subagent.ts`). This was read in source and not run.

### Non-interactive runs (`opencode run`)

- `opencode run` cancels every form in its session and its child sessions. For a question it sends this message to the model: "This non-interactive run cannot ask the user questions, so the question was cancelled. Continue without an answer; make reasonable assumptions and state them." The run continues (`cli/src/run/noninteractive.ts`, `QUESTION_CANCELLED_FEEDBACK`, `cancelForm`).
- Permission prompts are rejected with "This non-interactive run cannot ask the user for permission, so the request was rejected. Continue without this action." With `--auto`, `--yolo`, or `--dangerously-skip-permissions`, permission prompts are approved instead, but questions are still cancelled (same file, `replyPermission`; `cli/src/commands/handlers/run.ts`).
- An older "V1 compatibility" path cancels the question without the message, stops the session, and sets exit code 1 (same file). `opencode run` does not use it (`cli/src/commands/handlers/run.ts` calls `runNonInteractive` with no `compatibility`). Which client still uses `runV1Bridge` was not found.

### Detect

- No environment variable says "no human". The tool is absent in `general` and `explore`. In `opencode run` it is present, and a call fails with the fixed message above.

## 4. Portable wording for a Skill

Points a portable `SKILL.md` must cover, each tied to a finding above:

1. Name the action, not the tool: "Ask the user with your question tool, if you have one (for example `AskUserQuestion`, `request_user_input`, or `question`)." The names differ on each platform.
2. Give a plain-text fallback: "If you have no question tool, or the call fails, ask the question in a plain message and end your turn. Wait for the answer." This is how Codex Default mode asks, and it works on all three platforms when a human reads the output.
3. Keep each call within the smallest limits: at most 3 questions and 2-3 options per question, recommended option first. Codex allows 1-3 questions and 2-3 options; Claude Code allows 1-4 and 2-4. One question per call also matches this repo's own question rule.
4. Do not let "no answer" mean "yes". Codex Default mode tells the model to "continue with best judgment" when it gets no answers, `opencode run` tells it to "make reasonable assumptions", and the Claude Code idle timeout tells it to proceed "on its own judgment". For an approval gate such as a commit, the Skill must say: "If the user does not answer, or the question tool fails or is missing, do not commit. Report what you would commit and stop."
5. Treat these as "no human": the question tool is absent; the call returns an error such as "unavailable in Default mode", "can only be used by the root thread", "not supported in exec mode", "cancelled", or "cannot ask the user questions"; or the Skill runs as a subagent. A subagent has no question tool on Claude Code and Codex, and none in OpenCode's built-in `general`.
6. Let the caller give answers in advance. A parent agent or a script can put the setup answers and an explicit approval in the prompt. The Skill then uses those answers and asks nothing. This is the only way to give a subagent or a non-interactive run what it needs, because no platform gives them a human.
7. Do not list the question tool in `allowed-tools` (Claude Code before 2.1.69 ran it with empty answers).

## 5. Optional platform setup, outside the portable text

- Claude Code: an SDK app or a `--permission-prompt-tool` host can answer `AskUserQuestion` in `-p` runs; a `PreToolUse` hook can answer or defer it.
- Codex: start the session in Plan mode to get a blocking `request_user_input`, or turn on `default_mode_request_user_input` (under development).
- OpenCode: a custom subagent with `question: allow` can ask the human in the TUI or web app.

## Open points

- No platform was run. All behaviour comes from docs and source reading.
- Codex: read at `main` `c465563`, not at the stable tag `rust-v0.163.0`. The Codex docs do not document `request_user_input`.
- Codex: whether a Plan mode session started from the TUI can pass a question from a subagent to the human. The code says no (root thread only).
- OpenCode: the TUI display of a child-session question was read in source only. Which client uses the V1 compatibility run path was not found.
- Claude Code: whether a skill-scoped `disallowed-tools: AskUserQuestion` also affects subagents that the Skill starts. The docs do not say, and subagents lose the tool anyway.
