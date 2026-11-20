# Research: the model and effort of subagents and headless runs

Question (issue #277): On Claude Code, Codex, and OpenCode, which model and which reasoning effort does a subagent get when the main agent gives no model and no effort? Which model and effort does a headless run (`claude -p`, `codex exec`, `opencode run`) get? Can an agent read its own model and effort? Can the call of the subagent tool set the model and the effort?

This file adds to `docs/research/subagents.md` (how a Skill starts a subagent) and does not repeat it. Where this file and `subagents.md` disagree, this file is newer.

Sources, read on 2026-11-21:

- Claude Code 2.1.329 (installed). Claude Code is closed source, so this file uses the docs, `claude --help`, and the tool schema and environment of a live 2.1.329 session. Docs, fetched as Markdown from code.claude.com: [Subagents](https://code.claude.com/docs/en/sub-agents), [Model configuration](https://code.claude.com/docs/en/model-config), [Environment variables](https://code.claude.com/docs/en/env-vars), [Hooks](https://code.claude.com/docs/en/hooks), [Skills](https://code.claude.com/docs/en/skills), [CLI reference](https://code.claude.com/docs/en/cli-reference), [Headless](https://code.claude.com/docs/en/headless).
- Codex CLI 0.171.0 (installed). Source: [openai/codex](https://github.com/openai/codex) at tag `rust-v0.171.0` (commit `ccf9be8`, 2026-11-19). Docs: [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
- OpenCode 2.3.2 (installed). Source: [anomalyco/opencode](https://github.com/anomalyco/opencode) at tag `v2.3.2` (commit `c0ad18b`, 2026-11-18). Docs: [Agents](https://opencode.ai/docs/agents/), [Models](https://opencode.ai/docs/models/).

Link prefixes in this file:

- `CC/` is `https://code.claude.com/docs/en/`.
- Codex paths are relative to `https://github.com/openai/codex/blob/rust-v0.171.0/codex-rs/`.
- OpenCode paths are relative to `https://github.com/anomalyco/opencode/blob/v2.3.2/`.

## Summary

| | Claude Code 2.1.329 | Codex 0.171.0 | OpenCode 2.3.2 |
| - | - | - | - |
| Subagent tool | `Agent` | `spawn_agent` (V1 or V2) | `subagent` (was `task` in OpenCode 1) |
| Subagent model with no model given | Model of the parent conversation | Model of the parent turn | Model stored on the parent session |
| Subagent effort with no effort given | Effort of the session, on the parent's model | Effort of the parent turn | The variant of the parent session model |
| Default for all subagents | `CLAUDE_CODE_SUBAGENT_MODEL`, `CLAUDE_CODE_SUBAGENT_EFFORT` | `[agents] default_subagent_model`, `default_subagent_reasoning_effort` | None |
| Per-agent definition | Frontmatter `model`, `effort` | Role file `model`, `model_reasoning_effort` | Agent `model: "provider/model#variant"` |
| Tool parameters | `model` (alias only), `effort` | `model`, `reasoning_effort` | `model` (`provider/model#variant`) |
| Headless model with no flag | Normal startup order: env var, settings, account default (Opus 5.5) | `config.toml`, else first model of the catalog | Agent model, else `model` config, else newest model |
| Headless effort with no flag | Settings, else model default (`medium` on Opus 5.5) | `model_reasoning_effort`, else model default | Variant of the agent model, else provider default |
| Agent can read its own model | Yes, the system prompt names it (observed, not documented) | No, only from the session log file | No |
| Agent can read its own effort | Yes, `$CLAUDE_EFFORT` | No, only from the session log file | No |

The main result: on all three platforms, a subagent with no model and no effort runs on the model of its parent. A headless run does not inherit from the agent that starts it. The headless run reads the configuration files and environment again, so a model or effort that the parent picked in the session is lost. To keep them, the agent must pass them as flags. Only Claude Code tells the agent its own model and effort.

## 1. Subagent with no model and no effort

### Claude Code

- Model order, first match wins ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Choose a model"):
  1. The `model` parameter of the `Agent` call.
  2. The `model` field of the agent definition, including `inherit`.
  3. The `CLAUDE_CODE_SUBAGENT_MODEL` environment variable.
  4. The model of the main conversation, or of the parent subagent for a nested subagent.
- So with no parameter, no definition field, and no variable, the subagent runs on the parent's model. The built-in `general-purpose`, `Plan`, and `claude` agents have no model of their own (same page, "Built-in subagents").
- Exceptions: `claude-code-guide` runs on Haiku and `statusline-setup` on Sonnet. `Explore` runs on the parent's model, but when the parent runs Fable, `Explore` runs on Opus on Anthropic accounts (same page, "Built-in subagents").
- `CLAUDE_CODE_SUBAGENT_MODEL` alone does not change `Explore` and `Plan`. With `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (v2.1.257+), the variable overrides every definition and every `model` parameter. Forks still use the parent's model (same page, "Run every subagent on one model").
- A family alias, for example `opus`, keeps the parent's exact version when the parent is in the same family (same page, "Which version a model alias selects").
- Effort order for a subagent with no `effort` field and no `effort` parameter ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "When a subagent has no effort field or parameter"):
  1. `CLAUDE_CODE_EFFORT_LEVEL`.
  2. The `effort` of the parent subagent, or a level for the current turn only, for example the `effort` of a Skill.
  3. `CLAUDE_CODE_SUBAGENT_EFFORT` (v2.1.315+, [CC/env-vars](https://code.claude.com/docs/en/env-vars)).
  4. On the parent's model: the effort of the session (`/effort` or `--effort`). On another model, the session effort does not apply. The docs do not name the level that then applies. Unconfirmed: the model's default effort.
- A definition can set `effort` in its frontmatter (same page, "Supported frontmatter fields"). `CLAUDE_CODE_EFFORT_LEVEL` overrides that field.
- Subagents inherit the extended thinking setting of the main conversation. No per-subagent thinking setting exists (same page, "Extended thinking in subagents").
- `/tasks` shows the model and effort of each running subagent (v2.1.242+, same page, "Check a subagent's model").

### Codex

- The child config starts from the model and the effective effort of the parent's current turn (`core/src/agent/child_config.rs#L126-L129`). The effective effort is the parent's effort, else the `default_reasoning_level` of the model (`core/src/session/step_settings.rs#L91-L94`). So a `/model` change in the parent carries to the child.
- V1 and V2 use this same path (V1: `core/src/tools/handlers/multi_agents/spawn.rs#L105-L115`, V2: `core/src/thread_spawn.rs#L144-L156`).
- Next, `[agents] default_subagent_model` and `[agents] default_subagent_reasoning_effort` in `config.toml` fill a value that the call leaves out (`core/src/agent/child_config.rs#L230-L232`, `config/src/config_toml.rs#L818-L821`). This applies to fork and non-fork spawns.
- Last, the role (`agent_type`) applies. A role file with `model` or `model_reasoning_effort` overrides the call parameters (`core/src/agent/role.rs#L183-L191`, `core/src/agent/child_config.rs#L65-L84`). The [Subagents docs](https://learn.chatgpt.com/docs/agent-configuration/subagents) give the same order: custom agent file, then explicit spawn value, then `[agents]` default, then parent.
- With no `agent_type`, the `default` role applies. The built-in `default`, `worker`, and `explorer` roles set no model and no effort (`core/src/agent/role.rs#L322-L360`; `core/assets/agent/builtins/explorer.toml` is empty).
- A V1 `fork_context=true` spawn skips the role. A V2 full-history fork applies a role only when `agent_type` is given (`core/src/agent/child_config.rs#L62-L63`, `#L81-L82`).
- No environment variable sets a subagent model (no match in `core/`).

### OpenCode

- OpenCode 2 renamed the tool: the tool name is `subagent`, not `task` (`packages/core/src/tool/plugin/subagent.ts#L17`). The config key for agents is `agents`.
- A new child session gets `override ?? agent.model ?? parent.model` (`packages/core/src/tool/plugin/subagent.ts#L171`). `override` is the tool's `model` parameter, `agent.model` is the model of the agent definition, and `parent.model` is the model stored on the parent session.
- A model reference includes the variant (`packages/schema/src/agent.ts#L26`, `packages/core/src/session.ts#L93`). The variant is the effort control, so the parent's effort carries over with the parent's model.
- When the parent session has no stored model, the child stores none either. At run time, the child then uses its own agent's model, else the fallback model with no variant (`packages/core/src/session/runner/model.ts#L89-L99`). So the child does not inherit a model that the parent got from its own agent definition. This comes from the code. Unconfirmed: a run test.
- Unconfirmed: whether a TUI model pick always stores the model on the session.
- The fallback is the top-level `model` of the config, else the first enabled text model (`packages/core/src/model.ts#L302-L307`). The catalog lists the newest release first (`packages/core/src/model.ts#L246-L251`).
- The [Agents docs](https://opencode.ai/docs/agents/) ("Model") agree: "A subagent uses its configured model, or inherits the parent session's model when none is configured."
- Configuration:
  - Agent `model: "provider/model#variant"`, or the object form with `variant` (`packages/core/src/config/plugin/agent.ts#L86-L91`). In Markdown frontmatter, a separate `variant:` key joins the `model` (`#L170-L176`).
  - The top-level `model` keeps only the provider and model. OpenCode drops its variant (`packages/core/src/config/plugin/provider.ts#L100-L101`; [Models docs](https://opencode.ai/docs/models/)).
  - Old agent `options`, for example `reasoningEffort`, migrate to `request.body`. The docs say that the v2 runner does not send these values yet ([Agents docs](https://opencode.ai/docs/agents/), "request"). Use variants.
  - No environment variable selects a model.
- About variants: a variant is a named overlay on one model, selected with `#variant` (`packages/core/src/model-resolver.ts#L166-L170`). OpenCode builds the reasoning variants per provider package (`packages/core/src/variant.ts`). With no variant, the provider's default effort applies. An unknown variant is an error ([Models docs](https://opencode.ai/docs/models/), "Variants").

## 2. Headless run with no model and no effort

A headless run started from the Bash tool is a new process. It reads the configuration files and the inherited environment variables again. It does not get the model or the effort that the parent agent runs on.

### Claude Code (`claude -p`)

- Model order ([CC/model-config](https://code.claude.com/docs/en/model-config), "Setting your model", "Set a default model for new sessions"):
  1. `--model`.
  2. `ANTHROPIC_MODEL`.
  3. The `model` setting in a settings file. `/model` with `Enter` saves the pick here. A pick with `s` is for the session only.
  4. An organization default model.
  5. `ANTHROPIC_DEFAULT_MODEL`.
  6. The account default: Opus 5.5 on Pro, Max, Ultra, Team, Enterprise, the Anthropic API, Bedrock, and Google Cloud. Sonnet 4.5 on Microsoft Foundry ([CC/model-config](https://code.claude.com/docs/en/model-config), "`default` model setting").
- Effort order ([CC/model-config](https://code.claude.com/docs/en/model-config), "Adjust effort level"):
  1. `CLAUDE_CODE_EFFORT_LEVEL`.
  2. `--effort`.
  3. Settings: a saved per-model level in `modelSettings`, or `effortLevel`.
  4. The model default: `medium` for Fable 5.2, Opus 5.5, Sonnet 5.5, and Haiku 5.5. `xhigh` for Opus 4.7. `high` for the other models.
- `--model` and `--effort` exist on `claude --help` (2.1.329). `--effort` accepts `low`, `medium`, `high`, `xhigh`, `max`, and `ultracode` ([CC/cli-reference](https://code.claude.com/docs/en/cli-reference)).
- So a child `claude -p` gets the parent's model only when the parent's model came from a settings file or an exported variable. A `--model` flag of the parent, a session-only `/model` pick, and a subagent model do not carry.
- With `--output-format stream-json`, the `system/init` event reports the model of the run ([CC/headless](https://code.claude.com/docs/en/headless), "Read session metadata").

### Codex (`codex exec`)

- Model: `model` from `config.toml`, a profile (`-p`), or `-c model=...`. When none is set, Codex takes the first model of the catalog that the picker shows for the current login (`core/src/session/mod.rs#L644-L651`, `models-manager/src/manager.rs#L264-L312`). No constant in the code names a default model.
  - In the bundled catalog (`models-manager/models.json`), the default is `gpt-6.2-sol`.
  - With ChatGPT login, a catalog from the server replaces the bundled one, so the server can change the default at any time.
- Effort: `model_reasoning_effort` from the config, else the `default_reasoning_level` of the model (`core/src/session/mod.rs#L2480-L2483`). In the bundled catalog, the default effort of `gpt-6.2-sol` is `low`.
- `codex exec --help` (0.171.0) lists `-m, --model` but no effort flag. Set the effort with `-c model_reasoning_effort="high"` or a profile.

### OpenCode (`opencode run`)

- `opencode run --help` (2.3.2) lists `--model, -m` in the form `provider/model#variant`, and `--agent`. It has no separate effort flag. The variant carries the effort.
- A new session starts with no model. `--continue` and `--session` reuse the model stored on that session (`packages/cli/src/session-target.ts#L58-L71`, `packages/cli/src/run/run.ts#L85-L110`).
- At run time, the order is: the session model, then the model and variant of the selected agent, then the configured `model` or the newest model, with no variant (`packages/core/src/session/runner/model.ts#L89-L99`).
- Without `--agent`, the agent is `default_agent`, else `build` (`packages/core/src/agent.ts#L55-L64`).
- The `run` path reads no "last used model" state. Only the TUI keeps one (`packages/tui/src/model-preference.ts`).

## 3. Can an agent read its own model and effort?

### Claude Code

- Model: the system prompt of a 2.1.329 session names the model, for example "You are powered by the model named Opus 5.5. The exact model ID is claude-opus-5-5." This research observed the line in a live subagent session. Unconfirmed: the docs do not describe the line.
- No `$CLAUDE_MODEL` variable exists. `$ANTHROPIC_MODEL` holds only a value that the user exported, and a `/model` change does not update it ([CC/hooks](https://code.claude.com/docs/en/hooks), "Common input fields").
- Effort: Claude Code sets `CLAUDE_EFFORT` in each Bash tool subprocess and hook command, for example `CLAUDE_EFFORT=medium`. The variable exists only when the model supports effort ([CC/env-vars](https://code.claude.com/docs/en/env-vars)). A Skill can also use `${CLAUDE_EFFORT}` in its text ([CC/skills](https://code.claude.com/docs/en/skills)).
- Unconfirmed: whether `CLAUDE_EFFORT` in a subagent shows the subagent's own level. The hook field `effort.level` includes the level of a subagent, and the docs say `$CLAUDE_EFFORT` holds the same level ([CC/hooks](https://code.claude.com/docs/en/hooks)).
- A headless run does not read `CLAUDE_EFFORT` as input (not in the effort order above). So the agent must pass it on:

```sh
claude -p --model claude-opus-5-5 --effort "$CLAUDE_EFFORT" "<prompt>"
```

### Codex

- The base instructions say only "based on GPT-6" or "based on GPT-5", not the model slug. The model switch message does not name the model (`core/src/context/model_switch_instructions.rs#L36-L40`). The environment context has no model and no effort.
- The `<model_catalog>` context lists the models and their default efforts, but not the current model. A feature flag that is off by default controls it (`core/src/context/world_state/model_catalog.rs#L35-L89`, `features/src/lib.rs#L1696-L1699`).
- Shell commands get `CODEX_SESSION_ID`, `CODEX_THREAD_ID`, `CODEX_TOOL_CALL_ID`, `CODEX_VERSION`, and `CODEX_SANDBOX*`, but no model or effort (`protocol/src/shell_environment.rs#L6-L9`, `core/src/exec_env.rs#L11-L20`).
- `config.toml` gives only the configured value, not a `/model` change or a spawn override.
- Workaround: each `turn_context` record of the session log holds `model` and `effort` (`protocol/src/protocol.rs#L3722-L3734`). The log is `~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<thread_id>.jsonl`, and `CODEX_THREAD_ID` gives the thread ID. Unconfirmed: whether the sandbox lets the agent read `~/.codex`.

### OpenCode

- The default system prompt does not name the model (`packages/core/src/session/runner/prompt/system.txt`, `packages/core/src/session/system-prompt.ts`). Only the prompt for Meta "muse" models names the model (`packages/core/src/plugin/optimize.ts#L57-L60`). No prompt names the variant.
- The `<env>` block holds the directory, git state, platform, and temp folder only (`packages/core/src/instructions/builtins.ts#L33-L46`).
- The shell tool exports `AGENT=1`, `OPENCODE=1`, `AI_AGENT`, and `OPENCODE_SESSION_ID`, but no model or variant (`packages/core/src/tool/plugin/shell.ts#L423-L426`).
- The `models` tool uses the session's provider only to sort its list (`packages/core/src/tool/plugin/opencode.ts#L235-L245`).
- So the agent can only guess from the config files. Unconfirmed: whether the local server API returns the session model for `OPENCODE_SESSION_ID`.

## 4. Can the subagent call set the model and the effort?

### Claude Code: `model` and `effort`

- `model`: an alias only, `sonnet`, `opus`, `haiku`, or `fable`. A full model ID and `inherit` are not accepted ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Choose a model"). The tool schema of 2.1.329 has the same enum.
- `effort`: `low`, `medium`, `high`, `xhigh`, or `max` (v2.1.292+). Not for a fork. The parameter overrides the definition's `effort` and stays when the subagent resumes. `CLAUDE_CODE_EFFORT_LEVEL` overrides it ([CC/sub-agents](https://code.claude.com/docs/en/sub-agents), "Choose an effort level").
- `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` blocks the `model` parameter.
- The tool description in 2.1.329 tells the model to set `effort` only when the user or the instructions ask for a level. The docs say the same: "When you ask Claude to run a non-fork subagent at a specific effort level".

```json
{ "subagent_type": "general-purpose", "description": "...", "prompt": "...", "model": "sonnet", "effort": "high" }
```

### Codex: `model` and `reasoning_effort`

- V1 (`multi_agent_v1`): `message`, `items`, `agent_type`, `fork_context`, `model`, `reasoning_effort` (`core/src/tools/handlers/multi_agents/spawn.rs#L229-L238`, schema at `core/src/tools/handlers/multi_agents_spec.rs#L610-L647`).
- V2: `task_name` and `message` (required), plus `agent_type`, `model`, `reasoning_effort`, and `fork_turns` (`core/src/tools/handlers/multi_agents_v2/spawn.rs#L201-L211`). `model` and `reasoning_effort` are on by default (`expose_spawn_agent_model_overrides: true`, `core/src/config/mod.rs#L1483`). `[features.multi_agent_v2] expose_spawn_agent_model_overrides = false` removes them (`core/src/tools/handlers/multi_agents_spec.rs#L129-L132`). This corrects `subagents.md`, which lists no model parameter for V2.
- `model` must match a catalog slug exactly, else the error lists up to 16 models (`core/src/agent/child_config.rs#L346-L370`).
- `reasoning_effort` must be in the model's `supported_reasoning_levels`, else the error lists them (`#L373-L391`). The values are strings such as `minimal`, `low`, `medium`, `high`, `xhigh` (`protocol/src/openai_models.rs#L74-L99`).
- With only `model`, the child gets that model's default effort, not the parent's effort (`core/src/agent/child_config.rs#L262-L263`). With only `reasoning_effort`, Codex checks it against the parent's model (`#L269-L275`).
- A role that sets `model` or `model_reasoning_effort` overrides both parameters.

```json
{ "task_name": "review", "message": "...", "fork_turns": "none", "model": "gpt-6.2-sol", "reasoning_effort": "high" }
```

### OpenCode: `model` with `#variant`

- Parameters of `subagent`: `agent`, `description`, `prompt`, optional `model`, optional `sessionID` (`packages/core/src/tool/plugin/subagent.ts#L30-L44`).
- `model` takes `"providerID/modelID"` or `"providerID/modelID#variant"`. The variant carries the effort. No separate effort parameter exists.
- The tool checks that the model is available, is a chat model, and has that variant (`packages/core/src/tool/plugin/subagent.ts#L70-L99`). The parameter overrides the agent's model (`#L171`).
- The parameter description says "NEVER set this unless the user explicitly asks for a particular model or variant."

```json
{ "agent": "general", "description": "...", "prompt": "...", "model": "anthropic/claude-sonnet-5-5#high" }
```

## Open points

- Claude Code: the docs do not describe the model line in the system prompt. The line can change without notice.
- Claude Code: the docs do not name the effort of a subagent on a model other than the parent's when no effort source applies.
- Codex: no run checked that the sandbox lets an agent read its session log in `~/.codex/sessions/`.
- OpenCode: no run checked the case of a parent session with no stored model, or whether the server API returns the session model.
