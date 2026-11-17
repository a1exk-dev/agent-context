# Research: a Skill that runs only when the Operator calls it

Question (issue #226, map #225): Which mechanism stops each platform from loading the `wtf` Skill on its own, so that only a call from the Operator starts it? For Codex, OpenCode, and Claude Code: how does the Operator call the Skill, how does the Skill get an argument, and what happens on a platform that ignores the mechanism? Does the mechanism break a claude.ai upload or a `skills` CLI install?

Use: the frontmatter, the extra files, and the call syntax of the planned `wtf` Skill.

Sources, read on 2026-11-18:

- Claude Code docs, fetched as Markdown: [Skills](https://code.claude.com/docs/en/skills). In this file, `CC/skills` is that page.
- Codex source: [openai/codex](https://github.com/openai/codex) at `main` commit `7066a55` (2026-11-17). Paths are relative to `codex-rs/`.
- Codex docs: [Build skills](https://learn.chatgpt.com/docs/build-skills).
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) at `dev` commit `9cfff5f` (2026-11-17, version 2.3.0). Paths are relative to `packages/`. Docs source: `services/site/src/docs/content/skills.mdx` (the Skills page of the V2 docs).
- `skills` CLI source: [vercel-labs/skills](https://github.com/vercel-labs/skills) at commit `57217cf` (2026-11-17, version 1.9.0).
- Upload validator: [`quick_validate.py`](https://github.com/anthropics/skills/blob/main/skills/skill-creator/scripts/quick_validate.py) of `anthropics/skills`, `main` on 2026-11-18.
- Agent Skills specification: <https://agentskills.io/specification>.
- Earlier research in this repo: `docs/research/agent-platforms.md` (OpenCode 1.18.34, Codex `d91294c`).

I ran no platform. All behaviour comes from docs and source.

## Summary

| | Claude Code | Codex | OpenCode V2 (2.3.0) |
| - | - | - | - |
| Mechanism | `disable-model-invocation: true` in `SKILL.md` | `policy.allow_implicit_invocation: false` in `agents/openai.yaml` | `disable-model-invocation: true`, or `metadata.opencode/autoinvoke: "false"`, in `SKILL.md` |
| Effect on the model | Skill not listed. The harness blocks a model call. | Skill not listed. | Skill not listed. The `skill` tool still loads the Skill by ID. |
| Operator call | `/wtf` at the start of the message | `$wtf` anywhere in the message, or a pick from `/skills` | `@wtf` from the autocomplete, or a pick from `/skills` |
| `/wtf` on this platform | Runs the Skill | Error: "Unrecognized command '/wtf'" | Sent to the model as plain text |
| Argument | Text after `/wtf`, through `$ARGUMENTS` or as `ARGUMENTS: <text>` | The full message text. No substitution. | The full message text. No substitution. |
| claude.ai upload | Fails: unexpected key | No effect (separate file) | `metadata` form: no effect. `disable-model-invocation` form: fails. |
| `skills` CLI install | Keeps the key | Copies `agents/openai.yaml` | Keeps the key |

The main result: no single mechanism works on all three platforms. The minimum set for `wtf` is two parts:

```yaml
# skills/<category>/wtf/SKILL.md (frontmatter)
---
name: wtf
description: ...
disable-model-invocation: true
---
```

```yaml
# skills/<category>/wtf/agents/openai.yaml
policy:
  allow_implicit_invocation: false
```

Claude Code and OpenCode V2 both read `disable-model-invocation`. Codex reads only `agents/openai.yaml`. The cost is that a claude.ai upload of this `SKILL.md` fails. To keep the upload, replace `disable-model-invocation: true` with `metadata: { opencode/autoinvoke: "false" }`. Then Claude Code has no file-based mechanism, and only the `skillOverrides` setting of each user hides the Skill there.

The call syntax differs on each platform: `/wtf` on Claude Code, `$wtf` on Codex, `@wtf` on OpenCode V2. The argument is the rest of the message on all three. Only Claude Code substitutes it into the Skill text.

## 1. Claude Code

### Stop the model

- `disable-model-invocation: true` prevents Claude "from automatically loading this skill". The default is `false` ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference").
- With this field, the description is not in the context. The full Skill loads only when the user calls it ([CC/skills](https://code.claude.com/docs/en/skills), "Control who invokes a skill", table).
- If Claude tries to call the Skill and the message does not hold `/wtf` as a separate word, "Claude Code blocks the call" (same section).
- The field also stops a preload into subagents and a run from a session-scoped scheduled task ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference").
- Do not use `user-invocable: false`. That field does the opposite: only Claude can call the Skill ([CC/skills](https://code.claude.com/docs/en/skills), "Control who invokes a skill").
- Alternative with no file change: the user setting `skillOverrides` with the value `"user-invocable-only"`. The Skill is then hidden from Claude and stays in the `/` menu ([CC/skills](https://code.claude.com/docs/en/skills), "Override skill visibility from settings"). Each user must set it.

### Operator call

- `/wtf` at the start of the message runs the Skill directly ([CC/skills](https://code.claude.com/docs/en/skills), "Where you write the skill's name").
- `/wtf` after plain text does not run the Skill. It only gives Claude permission to run the Skill for that message (same section).

### Argument

- `$ARGUMENTS` in the Skill text expands to the full text after the Skill name. `$0`, `$1`, and named `arguments` give single words ([CC/skills](https://code.claude.com/docs/en/skills), "Available string substitutions").
- When no placeholder receives the argument, Claude Code appends `ARGUMENTS: <value>` to the Skill text ([CC/skills](https://code.claude.com/docs/en/skills), "Pass arguments to skills").
- `argument-hint` shows a hint in the autocomplete, for example `[part of the message]` ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference").

### claude.ai upload and `skills` CLI

- A claude.ai upload, the Skills API, and `package_skill.py` accept only `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Any other key is a hard error ([CC/skills](https://code.claude.com/docs/en/skills), "Using skill frontmatter outside Claude Code"). `quick_validate.py` gives the same list and the same error.
- So `disable-model-invocation` and `argument-hint` both break the upload.
- `metadata` keys are not checked by `quick_validate.py`. So `metadata.opencode/autoinvoke` passes the upload.
- Claude Code accepts `metadata` and does not act on it ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference").

## 2. Codex

### Stop the model

- Codex reads `agents/openai.yaml` in the Skill folder (`ext/skills/src/loader/mod.rs:22-23`). The key `policy.allow_implicit_invocation` defaults to `true` (`skills/src/model.rs:23-28`).
- With `false`, the catalog entry gets `hidden_from_prompt()` (`ext/skills/src/provider/host.rs:170-172`). The model-visible list keeps only entries that are enabled and visible (`ext/skills/src/catalog.rs:286-288`).
- The docs agree: "When `false`, Codex won't implicitly invoke the skill based on user prompt", and "explicit `$skill` invocation still works" ([Build skills](https://learn.chatgpt.com/docs/build-skills), "Optional metadata").
- Codex reads only `name`, `description`, and `metadata.short-description` from the frontmatter (`skills/src/parser.rs:7-20`). The parser does not reject unknown keys. So `disable-model-invocation` does nothing on Codex and causes no error.

### Operator call

- The Operator types `$wtf` anywhere in the message, or picks the Skill from `/skills` ([Build skills](https://learn.chatgpt.com/docs/build-skills), "How ChatGPT and Codex use skills").
- Codex finds `$name` in the text and selects the enabled Skill with that name (`skills/src/mentions.rs:84-140`, `ext/skills/src/selection.rs:51-75`). A hidden Skill stays in the catalog, so the selection finds it.
- `/wtf` does not work. The TUI accepts only built-in slash commands. For other names it shows `Unrecognized command '/wtf'. Type "/" for a list of supported commands.` (`tui/src/bottom_pane/chat_composer/slash_input.rs:74-93`, `tui/src/bottom_pane/chat_composer.rs:3216-3223`).

### Argument

- Codex has no argument placeholder for a Skill. No `$ARGUMENTS` code exists in `codex-rs/` outside tests.
- Codex adds the Skill text as a separate `<skill>` block next to the user message (`ext/skills/src/extension.rs:378`, `:440-470`, `ext/skills/src/fragments.rs:97-105`). The user message stays as typed. So the Skill must read its argument from the message, for example the text after `$wtf`.

### claude.ai upload and `skills` CLI

- `agents/openai.yaml` is a separate file. The upload validator checks only the frontmatter of `SKILL.md` (`quick_validate.py`). The spec permits "any additional files or directories" in a Skill folder ([Specification](https://agentskills.io/specification), "Directory structure"). I did not test a real claude.ai upload with this file (UNVERIFIED).
- The `skills` CLI copies the full Skill folder. It leaves out only `metadata.json`, `.git`, `__pycache__`, and `__pypackages__` (`src/skill-hash.ts:11-19`, `src/installer.ts:585`). So `agents/openai.yaml` reaches the project.

## 3. OpenCode

OpenCode 2.x changed the Skill system. `docs/research/agent-platforms.md` describes 1.18.34, where each Skill was also a `/name` command. In 2.3.0, a Skill is not a slash command.

### Stop the model

- The parser reads `disable-model-invocation` and `metadata.opencode/autoinvoke`. `opencode/autoinvoke` wins when both are set. Each accepts a boolean or the strings `"true"`, `"false"`, `"yes"`, `"no"`, `"on"`, `"off"`, `"1"`, `"0"` (`core/src/config/plugin/skill-file.ts:10-15`, `:24-36`, `:48-50`).
- A Skill with `autoinvoke` set to `false` is left out of `<available_skills>` (`core/src/skill/instructions.ts:62-66`).
- The `skill` tool does not check `autoinvoke`. It loads any registered Skill by ID (`core/src/tool/plugin/skill.ts:47-50`). The docs say the same: the Skill "can still be loaded explicitly by ID" (`skills.mdx`, "Frontmatter"). So the model can still load `wtf` when it knows the ID, for example from the text `/wtf` in a message.
- A `skill` permission with `deny` hides the Skill and rejects the load (`skills.mdx`, "Permissions"). That rule is a config of the project, not a part of the Skill.

### Operator call

- The Operator types `@` and picks `@wtf` from the autocomplete (`tui/src/component/prompt/autocomplete.tsx:444-458`). The `/skills` command opens a dialog that inserts the same `@wtf` part (`tui/src/component/prompt/index.tsx:584-620`). The docs say: "To load a skill yourself, mention it in your prompt as `@skill-id`" (`skills.mdx`, "Loading").
- OpenCode then adds the Skill text to the user message (`core/src/session/prompt.ts:58-87`).
- I did not confirm that typed text `@wtf`, without a pick from the autocomplete, attaches the Skill (UNVERIFIED). The TUI attaches a Skill only from a stored prompt part.
- `/wtf` is not a command. The TUI sends a slash text with an unknown name to the model as plain text (`tui/src/component/prompt/index.tsx:1136-1153`).
- A command file `.opencode/commands/wtf.md` can make `/wtf` a command with `$ARGUMENTS` (`core/src/config/plugin/command.ts:115-127`, `:170-190`). That file is outside the Skill folder, so the `skills` CLI does not install the file.

### Argument

- The Skill gets no substitution. The Skill text arrives as a `<skill_content>` block, and the message text stays as typed (`core/src/skill.ts:41-58`). So the Skill must read its argument from the message.

### claude.ai upload and `skills` CLI

- `metadata.opencode/autoinvoke` passes the upload validator. The spec wants string values in `metadata`, so write `"false"` with quotes ([Specification](https://agentskills.io/specification), "`metadata` field"). OpenCode accepts the string `"false"`.
- `disable-model-invocation` breaks the upload, as in section 1.
- The `skills` CLI keeps the frontmatter byte for byte. The one exception is the Eve agent, where the CLI keeps only spec fields (`src/installer.ts:507-537`, `:613-615`). Eve keeps `metadata`, so the `metadata` form survives there too.

## 4. When a platform ignores the mechanism

A platform that ignores the mechanism lists the Skill with its description. The model can then load `wtf` on its own when a message matches that description. Examples:

- Codex ignores `disable-model-invocation` and `metadata.opencode/autoinvoke`.
- Claude Code ignores `agents/openai.yaml` and `metadata.opencode/autoinvoke`.
- OpenCode 1.x ignores all three. It reads only `name` and `description` (`docs/research/agent-platforms.md`, section 3).

Two measures limit this risk on such a platform:

1. Write the `description` so that the trigger is the Operator call only. For example: "Use only when the Operator calls /wtf, $wtf, or @wtf." This is a suggestion, and no test confirms it.
2. Keep the Skill free of side effects. `wtf` only writes a chat message, so an unwanted load costs context but changes no file.

## 5. Options for `wtf`

| Option | Claude Code | Codex | OpenCode V2 | claude.ai upload |
| - | - | - | - | - |
| A: `disable-model-invocation: true` + `agents/openai.yaml` | Manual only | Manual only | Manual only | Fails |
| B: `metadata.opencode/autoinvoke: "false"` + `agents/openai.yaml` | Model can load it | Manual only | Manual only | Passes |
| C: B + `skillOverrides` in each user's Claude Code settings | Manual only | Manual only | Manual only | Passes |

`MEMORY.md` names Codex, OpenCode, and Claude Code as the targets, and does not name claude.ai. If claude.ai is not a target, option A is the simplest. The map (#225) must make this decision.

## Open points

- A claude.ai upload of a Skill folder that holds `agents/openai.yaml` was not tested.
- Typed `@wtf` text in OpenCode V2, without the autocomplete, was not tested.
- How each model reacts to `/wtf` as plain text on Codex and OpenCode was not tested.
- Whether a description that names only the Operator call stops a model load on a platform that ignores the mechanism was not tested.
