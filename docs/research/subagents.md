# Research: starting a read-only subagent from a skill

Question (issue #14): How does a skill start a read-only subagent on each of Codex, OpenCode, and Claude Code? For each platform: can a skill start a fresh subagent with no prior context, give it a prompt, and get its report back? Can the subagent be limited to reading (no file writes, no state-changing commands, no network)? Is there a portable way to word this in one `SKILL.md`, and how does a skill detect that the platform has no subagent support?

Use: the reader test of the planned `agent-instructions` skill (decided in #8). The skill gives a new or changed Agent instruction to 3 fresh subagents (2 typical tasks, 1 near-miss task). Each subagent does a dry run: it reads files, reports the steps it would take, and changes nothing.

Sources, read on 2026-10-01:

- Claude Code docs (fetched as Markdown from code.claude.com): [Subagents](https://code.claude.com/docs/en/sub-agents), [Skills](https://code.claude.com/docs/en/skills), [Tools reference](https://code.claude.com/docs/en/tools-reference), [Permissions](https://code.claude.com/docs/en/permissions), [Permission modes](https://code.claude.com/docs/en/permission-modes), [Sandboxing](https://code.claude.com/docs/en/sandboxing), [CLI reference](https://code.claude.com/docs/en/cli-reference), [Errors](https://code.claude.com/docs/en/errors), [Plugin components](https://code.claude.com/docs/en/plugins/components), [Agent SDK subagents](https://code.claude.com/docs/en/agent-sdk/subagents), [Agent SDK permissions](https://code.claude.com/docs/en/agent-sdk/permissions).
- Claude Code repo: [`CHANGELOG.md`](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) (latest entry 2.1.287), issues [#75861](https://github.com/anthropics/claude-code/issues/75861) and [#17418](https://github.com/anthropics/claude-code/issues/17418) as supporting evidence only.
- Codex source: [openai/codex](https://github.com/openai/codex) at tag `rust-v0.159.3` (latest stable, 2026-09-30, commit `01fc69f`), files under `codex-rs/`. Key files checked unchanged on `main` at `d91294c`. PR #39299 (merge `1a6e07a`, first released in `rust-v0.149.0`).
- Codex docs (the `developers.openai.com/codex/...` pages now redirect here, undated): [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Build skills](https://learn.chatgpt.com/docs/build-skills), [Approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security).
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) (`sst/opencode` redirects there) at `dev` commit `aa481b8` (2026-10-01). No relevant file changed since release v1.18.34 (2026-09-30). Docs source under `packages/web/src/content/docs/`.
- OpenCode docs: [Agents](https://opencode.ai/docs/agents/), [Permissions](https://opencode.ai/docs/permissions/).
- Agent Skills specification: <https://agentskills.io/specification>.

In this file, `CC/` is `https://code.claude.com/docs/en/`, Codex paths are relative to `codex-rs/` at `rust-v0.159.3`, and OpenCode paths are relative to the repo root at `aa481b8`.

## Summary

| | Claude Code | Codex | OpenCode |
| - | - | - | - |
| Tool that starts a subagent | `Agent` (was `Task`; `Task` still works as an alias) | `spawn_agent`, in one of two tool sets (V1 or V2) | `task` |
| Available by default | Yes | Yes (`multi_agent` flag is stable and on) | Yes |
| Fresh context by default | Yes, except the `fork` subagent type | V1: yes. V2: no, it forks the full history unless `fork_turns="none"` | Yes, unless `task_id` resumes a session |
| Report comes back to the skill | Yes, as the tool result | V1: from `wait_agent`. V2: delivered as a message to the parent | Yes, as the tool result |
| Parallel | Yes, 20 at once by default | Yes. V1: 6 threads. V2: 4 threads including the main agent, so 3 subagents | Yes |
| Built-in "read-only" subagent | `Explore`: no Edit or Write, but has Bash and web tools | `explorer`: empty role, no restriction | `explore`: no edit tools, but `bash`, `webfetch`, `websearch` are allowed |
| Enforced read-only from a plain `SKILL.md` | No | No | No |
| Enforced read-only with extra setup | Agent definition with `tools: Read, Grep, Glob` (plugin or user file) | Start the whole session with the `read-only` sandbox | Agent definition that denies `edit`, `bash`, `webfetch`, `websearch` (user file) |

The main result: all three platforms let a skill start fresh subagents with a prompt and collect their reports, but none lets a plain `SKILL.md` enforce read-only. The dry-run limit is a prompt instruction unless the user or a plugin adds an agent definition, or the user runs Codex read-only.

## 1. Claude Code

### Start, prompt, report

- Skill instructions run in the main conversation, and the main agent starts subagents with the `Agent` tool. The subagent returns only its final result ([CC/tools-reference](https://code.claude.com/docs/en/tools-reference), "Agent tool behavior"). The docs give a skill doing this as an example: skill-creator "spawns a subagent per test case so each run starts with a clean context" ([CC/skills](https://code.claude.com/docs/en/skills), "Run evals with skill-creator").
- The Task tool was renamed to `Agent` in version 2.1.63, and `Task(...)` still works as an alias in settings and agent definitions ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Restrict which subagents can be spawned"). The SDK `system:init` tool list still says `Task` ([Agent SDK subagents](https://code.claude.com/docs/en/agent-sdk/subagents), "Detect subagent invocation").
- Context is fresh: "Each subagent starts with a fresh, isolated context window. It doesn't see your conversation history, the skills you've already invoked, or the files Claude has already read" ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "What loads at startup"). It still loads the agent's system prompt, the CLAUDE.md/AGENTS.md hierarchy, and a git status snapshot. `Explore` and `Plan` skip CLAUDE.md and git status.
- Exception: the `fork` subagent type inherits the whole conversation and is on by default in interactive sessions (same page, "Fork the current conversation"). A reader test must not use it.
- The only thing passed from parent to subagent is the prompt string ([Agent SDK subagents](https://code.claude.com/docs/en/agent-sdk/subagents), "What subagents inherit").
- Parallel: supported, 20 concurrent subagents by default (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). Subagents run in the background by default, and the main agent gets completion notifications ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Concurrent subagent limit", "Run subagents in foreground or background").
- Nesting: up to 3 levels below the main conversation (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). At the limit, the `Agent` tool is withheld (same page, "Let subagents spawn their own subagents"; CHANGELOG 2.1.217 and 2.1.219).

### Read-only

- Built-in `Explore`: the docs say "read-only tools; Write and Edit are denied". The tool set still includes Bash, WebFetch, and WebSearch, so the no-change rule comes from its system prompt. Issue #75861 reports an Explore subagent that ran `rm -rf`.
- Custom agent definitions (`.claude/agents/*.md`) enforce limits: `tools` is an allow-list, `disallowedTools` a deny-list, and a tool left out "isn't in the subagent's session at all" ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Frontmatter reference", "Available tools"). `tools: Read, Grep, Glob` removes Bash, the web tools, and MCP tools. The SDK docs list this exact set as "Read-only analysis".
- `permissionMode: plan` is not reliable: it is ignored when the main session uses `bypassPermissions`, `acceptEdits`, or `auto`, and plugin agents ignore it ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Permission modes"; [CC/permission-modes](https://code.claude.com/docs/en/permission-modes)).
- Skill frontmatter: `allowed-tools` only pre-approves tools and "does not restrict which tools are available" ([CC/skills](https://code.claude.com/docs/en/skills), "Pre-approve tools for a skill"). `context: fork` with `agent:` runs the whole skill in one subagent, so it cannot start 3 test subagents at the end of a run. `context`, `agent`, and `disallowed-tools` are Claude Code extensions outside the Agent Skills specification. The docs do not say whether skill tool limits carry into subagents.
- A plain `SKILL.md` cannot ship an agent definition. A plugin can, in `agents/*.md`, and plugin agents support `tools` and `disallowedTools` ([Plugin components](https://code.claude.com/docs/en/plugins/components), "Agents"). Writing a file into `.claude/agents/` at run time breaks the no-write rule, and a new `agents` directory needs a restart.
- Network: WebFetch and WebSearch are separate tools that can be removed by name. Bash can still reach the network: "Using WebFetch alone doesn't prevent network access" ([CC/permissions](https://code.claude.com/docs/en/permissions), "Read-only commands"). The Bash sandbox is a user setting, and when it is on in the parent session, Bash in subagents is sandboxed too ([CC/sandboxing](https://code.claude.com/docs/en/sandboxing), "Scope"). A skill cannot turn it on.

### Detect

- No official statement covers detection. The `Agent` tool is absent when denied by a bare `Agent` rule, `--disallowedTools Agent`, `--tools` or the SDK `tools` option, or at the depth limit ([CC/cli-reference](https://code.claude.com/docs/en/cli-reference)).
- The tool can exist and the call still fail: a typed deny such as `Agent(Explore)`, `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1` (error `subagent_type is required`, [CC/errors](https://code.claude.com/docs/en/errors)), or `Concurrent subagent limit reached`.

## 2. Codex

### Start, prompt, report

- Subagents are on by default. The `multi_agent` feature flag (old alias `collab`) is stable and enabled. `multi_agent_v2` is stable but off by default (`features/src/lib.rs`). The docs: "Current Codex releases enable subagent workflows by default", and `agents.enabled = false` turns them off ([Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)).
- There are two tool sets. The model catalog picks one per model (`core/src/config/mod.rs`, `multi_agent_version_for_model`; `models-manager/models.json`). In the bundled catalog, most current models (gpt-6-*, gpt-5.6-sol, gpt-5.6-terra) use V2. gpt-5.6-luna and gpt-5.5 use V1. A skill must handle both.
- V1 tools: `spawn_agent`, `send_input`, `wait_agent`, `resume_agent`, `close_agent` (`core/src/tools/handlers/multi_agents_spec.rs`).
  - `spawn_agent` takes `message`, plus optional `agent_type`, `fork_context`, `model`, `reasoning_effort`. `fork_context`: "false or omitted starts with only the initial prompt". Fresh by default.
  - `wait_agent(targets, timeout_ms)` returns the final message of each completed target. It returns when any one target finishes, so 3 reports need a loop. Default timeout 30 s, maximum 1 h (`multi_agents_common.rs`).
  - Finished agents count toward the thread limit until `close_agent`.
- V2 tools: `spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `interrupt_agent`, `list_agents` (`core/src/tools/spec_plan.rs`).
  - `spawn_agent` requires `task_name` and `message`. It forks the full history by default (`fork_turns` defaults to `all`). A fresh subagent needs `fork_turns="none"`. `fork_context` is rejected (`multi_agents_v2/spawn.rs`).
  - The final answer arrives in the parent's context as a message (`agent/control/completion.rs`). V2 `wait_agent` only says that something arrived.
- Codex spawns only on explicit request. The V1 tool description says: "Do not spawn sub-agents unless the user or applicable AGENTS.md/skill instructions explicitly ask for sub-agents, delegation, or parallel agent work" (`multi_agents_spec.rs`).
- Limits: V1 allows 6 concurrent threads and depth 1, so a subagent cannot spawn another. V2 allows 4 threads per session including the main agent, which leaves exactly 3 subagents. Over the limit, the call fails with `AgentLimitReached` (`config/src/config_toml.rs`, `core/src/agent/registry.rs`).

### Read-only

- A subagent always gets the parent session's sandbox and approval policy. `apply_spawn_agent_runtime_overrides` copies them onto the child after the role is applied (`core/src/agent/child_config.rs`). Since `rust-v0.149.0` (PR #39299), a role can set only instructions, model, reasoning, verbosity, personality, service tier, and turn off some features. `sandbox_mode`, `approval_policy`, and `mcp_servers` in a role file are ignored (`core/src/agent/role.rs`). Tests assert that a role cannot change or expand the parent's permissions (`role_tests.rs`).
- The docs disagree: they show custom agents with `sandbox_mode = "read-only"` ([Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)). The code at `rust-v0.159.3` ignores that field, so the docs are probably stale. This was not checked by running Codex.
- The built-in `explorer` role file is empty (`core/assets/agent/builtins/explorer.toml`), so it adds no restriction.
- A role can turn off the shell, but Codex reads files through the shell, so a subagent without it cannot read. File edits use `apply_patch`, which a role cannot turn off.
- Network: both the `read-only` and `workspace-write` sandboxes have `network_access`, false by default (`protocol/src/protocol.rs`; [Approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)). A session started with the `read-only` sandbox therefore gives its subagents enforced read-only, no-network runs. Under the default `workspace-write` session, subagents can write.

### Detect

- When subagents are off, no collaboration tools are registered (`collab_tools_enabled` in `spec_plan.rs`). The same applies to a V1 subagent at the depth limit.
- Trap: when the model supports tool search, V1 tools are deferred. They are missing from the first tool list and are found through `tool_search` (search text includes "spawn_agent", "subagent", "delegate"). V2 tools are listed directly.
- Errors that mean "unavailable": "Agent depth limit reached", the thread limit, "collab manager unavailable".

### Skill format

- Codex reads only `name`, `description`, and `metadata.short-description` from `SKILL.md` (`skills/src/parser.rs`). `agents/openai.yaml` holds interface, invocation policy, and MCP dependencies (`skills/src/model.rs`). Neither can declare subagents or permissions.

## 3. OpenCode

### Start, prompt, report

- The `task` tool takes `description`, `prompt`, `subagent_type`, optional `task_id`, and optional `command` (`packages/opencode/src/tool/task.ts`).
- A call without `task_id` creates a new child session whose first message is only the prompt. The tool description says: "Each agent invocation starts with a fresh context unless you provide task_id" (`tool/task.txt`). The child still gets the main system prompt, AGENTS.md, and the skills list (`session/prompt.ts`).
- The result is the last text of the subagent's final message, returned to the main agent as `<task_result>` (`task.ts`). A failed tool call in that final message fails the whole task.
- Parallel: "Launch multiple agents concurrently … use a single message with multiple tool uses" (`task.txt`).
- Nesting: `subagent_depth` defaults to 1, so a subagent cannot start another (`task.ts`; `config.mdx`, "Subagent depth").
- The `task` tool description lists only the subagents the caller may use (`tool/registry.ts`, `describeTask`).
- The docs list a third built-in subagent, Scout. It was removed in commit `a639fe7` (2026-06-02), so the docs are stale on this point.

### Read-only

- Built-in `explore` denies everything, then allows `grep`, `glob`, `list`, `read`, `bash`, `webfetch`, `websearch` (`packages/opencode/src/agent/agent.ts`). It blocks edits, but not shell commands or the network. Only its prompt says not to change the system (`agent/prompt/explore.txt`).
- The user's global permissions merge after the built-in rules, and the last match wins, so a global `"edit": "allow"` re-enables editing in `explore` (`agent.ts`; `permission/index.ts`).
- Custom agents (in `opencode.json` under `agent`, or Markdown files in `.opencode/agent(s)/` or `~/.config/opencode/agent(s)/`) take `mode: subagent` and a `permission` map of `allow`, `ask`, or `deny` (`config/agent.ts`; [Agents](https://opencode.ai/docs/agents/)). A tool denied with pattern `*` is removed from the tool list. A dry-run agent needs `edit: deny`, `bash: deny`, `webfetch: deny`, `websearch: deny`, `task: deny`. The `tools` map is deprecated and maps to `permission`.
- A skill cannot ship an agent definition. Skills contribute only name, description, and body (`skill/index.ts`), and agent files under a skill folder are not loaded.
- No sandbox wraps the shell. The only controls are permission checks on `bash`, `webfetch`, and `websearch`. A bash pattern list cannot reliably block network access, so `bash: deny` is the only firm option (inference from `tool/shell.ts`).
- Skill frontmatter: OpenCode reads only `name` and `description` and ignores unknown fields, including `allowed-tools` (`skill/index.ts`; `skills.mdx`).

### Detect

- The `task` tool is absent when its last matching rule is `deny` with pattern `*` (including `tools: {task: false}`), and inside a subagent unless that subagent allows `task` (`permission/index.ts`; `agent/subagent-permissions.ts`).
- Errors that mean "unavailable": "Unknown agent type", permission denied, "Subagent depth limit reached", or a user rejecting the permission prompt (`task.ts`).

## 4. One portable wording

The tool names and parameters differ (`Agent`, `spawn_agent`, `task`), so a portable `SKILL.md` describes the action and lets each agent map it to its own tool. Points the wording must cover, each tied to a platform finding above:

1. Ask for subagents explicitly. Codex spawns only when skill instructions ask for subagents.
2. Ask for a fresh context with no conversation history. Codex V2 forks the full history by default, and Claude Code's `fork` type inherits the conversation.
3. Put the whole task in the prompt. On all three, the prompt is the only thing passed from the main agent.
4. State the dry-run limits in the prompt: read files only, make no file changes, run no state-changing commands, use no network, and report the steps instead. On all three, this is the only limit a plain `SKILL.md` can set. Do not tell the subagent to avoid the shell, because Codex reads files through it.
5. Ask the main agent to wait for all 3 reports. Codex V1 needs repeated `wait_agent` calls.
6. Start the subagents from the main agent, not from inside a subagent. Codex and OpenCode allow depth 1 by default.

Optional hardening per platform, outside the portable text: a Claude Code plugin agent with `tools: Read, Grep, Glob`, an OpenCode agent that denies `edit`, `bash`, `webfetch`, and `websearch`, or a Codex session started with the `read-only` sandbox.

Codex V2's default of 4 threads including the main agent fits exactly 3 subagents, so the reader test must not start more than 3 at once.

## 5. Detecting no subagent support

No platform documents a detection method for skills. A test that works on all three:

1. Look for a tool that starts subagents: `Agent` or `Task` on Claude Code, `spawn_agent` (in any namespace) on Codex, `task` on OpenCode.
2. On Codex, if the tool is missing and a `tool_search` tool exists, search for "spawn_agent subagent" first, because V1 tools can be deferred.
3. If no such tool exists, skip the reader test and warn.
4. If a start call fails (permission denied, depth limit, thread limit, unknown agent type), treat subagents as unavailable for that run, then skip and warn.

## Open points

- Codex role `sandbox_mode`: the docs and the code disagree. The code is clear, but no Codex run confirmed it.
- Claude Code: the docs do not say whether a skill's `allowed-tools` or `disallowed-tools` carry into subagents it starts.
- Codex: how a provider shows namespaced tool names (for example `multi_agent_v1.spawn_agent`) was not checked.
- OpenCode: the exact parallel mechanism inside the AI SDK was not traced.
