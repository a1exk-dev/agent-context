# Research: instruction files and skills on Codex, OpenCode, and Claude Code

Question (issue #12): Which files does each supported platform load as agent instructions, from which locations, at which precedence, and with which size limits? Does each platform support Agent Skills, and which frontmatter fields does it read?

Use: the description triggers and the cross-platform advice of the planned `agent-instructions` skill. That skill guides writing every Agent instruction: Skills, Rules, `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `MEMORY.md`, and `docs/agents/` files.

Sources, read on 2026-10-01:

- Claude Code docs (fetched as Markdown from code.claude.com): [Memory](https://code.claude.com/docs/en/memory), [Skills](https://code.claude.com/docs/en/skills), [Context window](https://code.claude.com/docs/en/context-window).
- Claude Code repo: [`CHANGELOG.md`](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), latest entry 2.1.287.
- Codex source: [openai/codex](https://github.com/openai/codex) at `main` commit `d91294c` (2026-10-01).
- Codex docs (`developers.openai.com/codex/...` now redirects here, undated): [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Build skills](https://learn.chatgpt.com/docs/build-skills), [Config reference](https://learn.chatgpt.com/docs/config-file/config-reference), [Advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced).
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) (`sst/opencode` redirects there) at `dev` commit `aa481b8` (2026-10-01, version 1.18.34). Docs source under `packages/web/src/content/docs/`.
- OpenCode docs: [Rules](https://opencode.ai/docs/rules/), [Skills](https://opencode.ai/docs/skills/).
- Agent Skills specification: <https://agentskills.io/specification>.

In this file, `CC/` is `https://code.claude.com/docs/en/`, Codex paths are relative to `codex-rs/` at `d91294c`, and OpenCode paths are relative to the repo root at `aa481b8`. Where docs and source disagree, this file trusts the source.

## Summary

| | Claude Code | Codex | OpenCode |
| - | - | - | - |
| Project instruction file | `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.local.md`; `AGENTS.md` only if none of these exist (v2.1.277+) | `AGENTS.override.md`, else `AGENTS.md`, else configured fallback names | First name found among `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` |
| Directories searched at start | cwd and every parent | Project root (`.git`) down to cwd | cwd up to the git root |
| Ancestor files | All load, root first | One per directory, root first | All files of the winning name load |
| Subdirectory files | Load when Claude reads a file there | Never loaded by the harness | Load when the `read` tool opens a file there |
| Global file | `~/.claude/CLAUDE.md`, plus managed policy file | `~/.codex/AGENTS.override.md`, else `~/.codex/AGENTS.md` | `~/.config/opencode/AGENTS.md`, else `~/.claude/CLAUDE.md` |
| Rules folder | `.claude/rules/**/*.md`, optional `paths` | None (Codex `rules/` hold command approval rules) | None, except files listed in `instructions` config |
| `@path` import | Yes, 4 hops | No | No |
| Size limit | File over 4 MiB skipped; aim under 200 lines | 32 KiB combined for all project files | None found |
| Agent Skills | Yes | Yes | Yes |
| Project skill folders | `.claude/skills/` | `.agents/skills/` (and `.codex/skills/`) | `.claude/skills/`, `.agents/skills/`, `.opencode/skill(s)/` |
| Frontmatter read | 20 fields; unknown fields ignored | `name`, `description`, `metadata.short-description` | `name`, `description` |
| Required fields | None | `description` | `name` |

The main result: no single file layout reaches all three platforms. `AGENTS.md` reaches Codex and OpenCode directly, and Claude Code through a `CLAUDE.md` that holds `@AGENTS.md`. For skills, no single folder reaches all three: Claude Code reads only `.claude/skills/`, and Codex reads `.agents/skills/` but not `.claude/skills/`. The only frontmatter that works everywhere is `name` plus `description`, so all trigger words must sit in `description`.

## 1. Claude Code

### Instruction files

- `CLAUDE.md` and `CLAUDE.local.md` load from cwd and every directory above it. All files are concatenated, root first, so the closest file is read last. `CLAUDE.local.md` comes after `CLAUDE.md` in each directory ([CC/memory](https://code.claude.com/docs/en/memory), "How CLAUDE.md files load").
- Subdirectory files load when Claude reads files in that subdirectory (same section).
- User file `~/.claude/CLAUDE.md`, managed policy file such as `/etc/claude-code/CLAUDE.md` ([CC/memory](https://code.claude.com/docs/en/memory), "Choose where to put CLAUDE.md files").
- Content arrives as a user message after the system prompt, not as part of it ([CC/memory](https://code.claude.com/docs/en/memory), "Claude isn't following my CLAUDE.md").
- `.claude/rules/`: all `.md` files, found recursively. A rule without `paths` loads at launch "with the same priority as `.claude/CLAUDE.md`". "`paths` is the only field Claude Code reads from a rule" ([CC/memory](https://code.claude.com/docs/en/memory), "Organize rules with `.claude/rules/`", "Path-specific rules"). User rules live in `~/.claude/rules/`.
- `AGENTS.md`: read natively since v2.1.277 (CHANGELOG 2.1.277). By default Claude reads it only when no `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md` exists in cwd or above. `~/.claude/CLAUDE.md`, the managed file, and `.claude/rules/` do not count ([CC/memory](https://code.claude.com/docs/en/memory), "When Claude Code reads AGENTS.md").
- When it applies, Claude reads every `AGENTS.md` and `.claude/AGENTS.md` in cwd and above, and a subdirectory `AGENTS.md` on Read. It expands `@path` imports inside it. It never reads `AGENTS.local.md`, `AGENTS.override.md`, "or anything under a `.agents/` directory" (same section).
- The user setting **Project instructions** can switch this to `claude-md-and-agents-md`, `claude-md`, or `managed-only` ([CC/memory](https://code.claude.com/docs/en/memory), "Choose which instruction files load").
- Native `AGENTS.md` is missing before v2.1.277, with the built-in `agents-md` plugin disabled, and sometimes in the first session after an upgrade. Before v2.1.281 it was also missing on Bedrock and with telemetry off ([CC/memory](https://code.claude.com/docs/en/memory), "When AGENTS.md support is unavailable"; CHANGELOG 2.1.281).
- A `CLAUDE.md` with `@AGENTS.md` stays valid: "Keeping the import never makes Claude read `AGENTS.md` twice". The docs prefer the import over a symlink when anyone clones on Windows ([CC/memory](https://code.claude.com/docs/en/memory), "Remove an earlier AGENTS.md workaround", "Share one file with other coding tools").
- Limits: "target under 200 lines per CLAUDE.md file". A file up to 4 MiB loads in full, and a larger file is skipped ([CC/memory](https://code.claude.com/docs/en/memory), "Write effective instructions", "How it works").
- Auto memory is a separate file: `~/.claude/projects/<project>/memory/MEMORY.md`. Only its first 200 lines or 25 KB load ([CC/memory](https://code.claude.com/docs/en/memory), "Storage location", "How it works"). It is not a repo-root `MEMORY.md`.

### Imports

- `@path` anywhere in the file. Relative paths resolve from the importing file. Imports recurse "with a maximum depth of four hops" ([CC/memory](https://code.claude.com/docs/en/memory), "Import additional files").
- Code spans and fenced blocks are skipped, so `` `@README` `` stays literal (same section).
- An import that resolves outside cwd from a project file needs a one-time approval (same section).
- Imports do not save context, because imported files also load at launch ([CC/memory](https://code.claude.com/docs/en/memory), "Write effective instructions").

### Skills

- Locations: managed `.claude/skills/`, `~/.claude/skills/`, project `.claude/skills/` in cwd and every parent up to the repo root, nested `<subdir>/.claude/skills/` on first file access there, `--add-dir` directories, and plugins ([CC/skills](https://code.claude.com/docs/en/skills), "Choose where skills load", "Load skills in monorepos and subdirectories"). No location includes `.agents/skills/`.
- A `<skill-name>` entry can be a symlink. Claude Code loads the skill once even if several locations point to it (same section). A symlink for the whole `.claude/skills/` folder is not documented (UNVERIFIED).
- Collisions: "Enterprise over personal, and personal over project". A skill beats a `.claude/commands/` file. Root and nested skills both load ([CC/skills](https://code.claude.com/docs/en/skills), "Resolve skills that share a name").
- Frontmatter: "All fields are optional". Unknown fields are ignored without an error. `name` defaults to the folder name. `description` falls back to the first body line. Fields read: `name`, `description`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `background`, `hooks`, `paths`, `shell`. `metadata`, `license`, and `compatibility` are accepted with no effect ([CC/skills](https://code.claude.com/docs/en/skills), "Frontmatter reference").
- Uploads to claude.ai, the Skills API, and `package_skill.py` accept only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Any other key is a hard error ([CC/skills](https://code.claude.com/docs/en/skills), "Using skill frontmatter outside Claude Code").
- Limits: `description` plus `when_to_use` is cut at 1,536 characters in the listing. The whole listing gets 1% of the context window, and descriptions of the least-used skills drop first ([CC/skills](https://code.claude.com/docs/en/skills), "Skill descriptions are cut short").
- After compaction, each invoked skill comes back with only its first 5,000 tokens, 25,000 tokens in total ([CC/skills](https://code.claude.com/docs/en/skills), "Skill content lifecycle").

## 2. Codex

### Instruction files

- Global: `$CODEX_HOME` (default `~/.codex`) tries `AGENTS.override.md`, then `AGENTS.md`. The first non-empty file wins (`codex-home/src/instructions/mod.rs:43`).
- Project root: Codex walks up from cwd to the first `project_root_markers` entry, default `.git`. With no marker, only cwd is checked (`core/src/agents_md.rs:1-18`, `config/src/project_root_markers.rs:5`).
- In each directory from the root down to cwd, Codex takes the first file among `AGENTS.override.md`, `AGENTS.md`, and the `project_doc_fallback_filenames` entries. So one file per directory, and an override replaces that directory's `AGENTS.md` (`core/src/agents_md.rs:272-296`).
- The fallback list is empty by default (`config/src/config_toml.rs:85-87`). So Codex reads `CLAUDE.md` only after `project_doc_fallback_filenames = ["CLAUDE.md"]`, and only in directories with no `AGENTS.md`. An entry with a `/` is ignored, so `.claude/CLAUDE.md` cannot be a fallback (`core/src/agents_md.rs:280-289`).
- Files below cwd never load through the harness. Discovery stops at cwd (`core/src/agents_md.rs:15-18`). The [AGENTS.md docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md) agree.
- An explicitly untrusted project loads no project files (`core/src/agents_md.rs:64`).
- Codex has no rules folder for instruction text. Its `rules/*.rules` files control "which commands Codex can run outside the sandbox" ([Rules](https://learn.chatgpt.com/docs/agent-configuration/rules)).

### Size limit

- `project_doc_max_bytes` defaults to `32 * 1024` (`config/src/config_toml.rs:75`). The field comment says "Maximum total bytes of project instruction content across all selected environments" (`config_toml.rs:331`).
- It is one combined budget. Files load root first. The file that crosses the limit is cut at the byte limit, and later files are skipped. Only a log line warns (`core/src/agents_md.rs:68`, `:142-166`). So the deepest, most specific file loses content first.
- The global file does not count against this budget (`core/src/agents_md.rs:63-83`).
- Docs conflict: [Advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced) says "how much to read from each `AGENTS.md` file", and the [Config reference](https://learn.chatgpt.com/docs/config-file/config-reference) says "Maximum bytes read from `AGENTS.md`". The [AGENTS.md page](https://learn.chatgpt.com/docs/agent-configuration/agents-md) says "combined size", which matches the code.

### Imports

- None. Files are read as bytes, cut to the budget, and inserted as text. No code in `core/src/agents_md.rs` parses `@` or links (`:142-180`). An `@AGENTS.md` line reaches the model as plain text.

### Skills

- Codex follows the Agent Skills standard ([Build skills](https://learn.chatgpt.com/docs/build-skills)).
- Roots: project `.codex/skills`, `$CODEX_HOME/skills` (marked deprecated), `~/.agents/skills`, the bundled system skills, `/etc/codex/skills`, plugin roots, and `.agents/skills` in every directory from the project root down to cwd (`ext/skills/src/host_roots.rs:86-120`, `:137-170`). No root is `.claude/skills` (no match for `.claude` in `ext/skills/src` or `skills/src` besides plugin manifests).
- The docs list only the `.agents/skills` folders, `/etc/codex/skills`, and bundled skills ([Build skills](https://learn.chatgpt.com/docs/build-skills)).
- Scan: recursive to depth 6. Hidden folders inside a root are skipped (`ext/skills/src/loader/mod.rs:31`, `loader/host.rs:178`). The docs say Codex follows symlinked skill folders.
- Collisions: skills are de-duplicated by path, not by name, so two skills with one name both stay (`ext/skills/src/loader/host_merge.rs:233`). The docs agree.
- Frontmatter: the parser reads only `name`, `description`, and `metadata.short-description`. Other keys are ignored (`skills/src/parser.rs:6-20`). The file must start with `---`.
- `description` is required, and loading fails without it (`parser.rs:84`). `name` is optional and defaults to the folder name (`loader/host.rs:394`), with a 64-character maximum (`parser.rs:4`). The docs say `name` is required. The spec's name pattern and folder match are not enforced.
- Codex reads extra options from `agents/openai.yaml`, for example `policy.allow_implicit_invocation` (`ext/skills/src/loader/mod.rs:20-21`, `skills/src/model.rs:64`).
- Limits: the catalog cuts each description to 1,024 characters. The catalog gets 2% of the context window, or 8,000 characters when the window is unknown. Over budget, descriptions shrink first, then skills drop (`ext/skills/src/render.rs:19-23`, `:126-152`, `:1091`).

## 3. OpenCode

### Instruction files

- Global: `~/.config/opencode/AGENTS.md`, else `~/.claude/CLAUDE.md`. Only the first that exists loads (`packages/opencode/src/session/instruction.ts:60-63`, `:114-119`).
- Project: names in order `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` (marked `// deprecated`) (`instruction.ts:64-68`). For each name, OpenCode collects every match from cwd up to the git root. The first name with any match wins, and all its ancestor matches load (`instruction.ts:124-131`, `packages/core/src/fs-util.ts:154-166`).
- So an `AGENTS.md` anywhere from cwd up to the git root blocks every `CLAUDE.md` and `CONTEXT.md`. Without `AGENTS.md` and `CLAUDE.md`, every `CONTEXT.md` from cwd up loads as instructions.
- Subdirectories: when the `read` tool opens a file below cwd, OpenCode walks up to cwd. In each directory it attaches the first of `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` once (`instruction.ts:171-177`, `:194`; caller `packages/opencode/src/tool/read.ts:300`). Edit, grep, and glob do not trigger this. A `CONTEXT.md` in a subdirectory with no `AGENTS.md` or `CLAUDE.md` is attached as instructions.
- The `instructions` config array adds files and globs, and URLs with a 5 s timeout (`instruction.ts:95-103`, `:135-150`). Relative globs run in every directory from cwd up to the git root.
- Order: global file, project files, `instructions` matches, then URLs, each with an `Instructions from: <path>` header (`instruction.ts:154-168`).
- No rules folder. `.claude/rules/` is not read. The docs suggest listing such files in `instructions` ([Rules](https://opencode.ai/docs/rules/)).
- Size: files are read whole, with no cut (`instruction.ts:92`). No other cap was found (UNVERIFIED that none exists).
- Docs conflicts: the docs never mention `CONTEXT.md`, ancestor stacking, or the load on `read`. They list local files before the global file, but the code puts the global file first. They say `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` disables only `~/.claude/CLAUDE.md`, but the code also drops project `CLAUDE.md` (`instruction.ts:62`, `:66`).

### Imports

- None in instruction files. They are read raw (`instruction.ts:92`). The docs say "opencode doesn't automatically parse file references in `AGENTS.md`" and suggest the `instructions` config or a written "read X" instruction ([Rules](https://opencode.ai/docs/rules/), "Referencing External Files").
- Command templates expand `@file` and `` !`cmd` `` (`packages/opencode/src/config/markdown.ts:5-6`). Each skill is also registered as a `/name` command (`packages/opencode/src/command/index.ts:134-150`). So these expansions apply when a user types `/name`, not when the model loads the skill with the `skill` tool (from the original report; the tool path was only checked for its output format).

### Skills

- Locations: `~/.claude/skills/` and `~/.agents/skills/`; `.claude/` and `.agents/` folders from cwd up to the git root, each scanned for `skills/**/SKILL.md`; `{skill,skills}/**/SKILL.md` in each OpenCode config folder, including `.opencode/`; plus the `skills.paths` and `skills.urls` config (`packages/opencode/src/skill/index.ts:21-25`, `:173-232`). The scan follows symlinks (`symlink: true`, `:154`).
- Collisions: skills are stored by `name`. A duplicate only logs "duplicate skill name". Files load in parallel with no limit, so the winner has no defined order (`index.ts:123-136`, `:240-243`; the order is inferred).
- Frontmatter: only `name` and `description` are stored. A skill without a string `name` is skipped with no message. `description` is optional, but a skill without it is left out of the `<available_skills>` list (`index.ts:53-59`, `:123`, `:322`).
- Docs conflicts: the docs say `name` and `description` are required, the name must match the folder and `^[a-z0-9]+(-[a-z0-9]+)*$`, and `description` must be 1-1024 characters. The code checks none of this except that `name` is a string. The docs list `license`, `compatibility`, and `metadata` as recognized, but the code does not store them ([Skills](https://opencode.ai/docs/skills/); `NameMismatchError` is declared at `index.ts:67` and never thrown).
- Limits: none found on skill count, description length, or body size.

## 4. Writing Agent instructions that work on all three

Portable patterns:

1. Keep project instructions in `AGENTS.md`. Add a `CLAUDE.md` that holds `@AGENTS.md` and only Claude-specific lines below it. Codex and OpenCode read `AGENTS.md` and skip `CLAUDE.md`. Claude Code reads `CLAUDE.md` and expands the import. This also covers Claude Code sessions with no native `AGENTS.md` support, and users who add a `CLAUDE.local.md`. This repo already does this.
2. Write pointers to other files as plain instructions, for example "Before X, read `docs/agents/domain.md`". Codex and OpenCode never expand `@path`, and a pointer in prose works on all three. Use `@path` only in `CLAUDE.md`.
3. Keep the root-to-cwd chain of `AGENTS.md` files well under 32 KiB in total. Codex cuts the deepest file first and warns only in a log. This repo's `AGENTS.md` is about 2 KB.
4. Put files that must always load in the root `AGENTS.md`. Codex never loads a subdirectory `AGENTS.md` below cwd. Claude Code and OpenCode load it only when the agent reads a file there.
5. For skills, keep the real folder in one place and link it into the other. Claude Code reads only `.claude/skills/`. Codex reads `.agents/skills/` and never `.claude/skills/`. OpenCode reads both. A per-skill symlink is documented for Claude Code and Codex. OpenCode then finds the skill twice, logs a duplicate warning, and loads the same content.
6. Use only `name` and `description` for behaviour. Set `name` to the folder name, lowercase with hyphens, at most 64 characters: OpenCode skips a skill without `name`. Always set `description`: Codex fails to load a skill without it. Keep `description` at most 1,024 characters with the trigger words first: Codex cuts there, and all three shorten descriptions when the list is over budget.
7. Put trigger phrases in `description`, not in `when_to_use`. Only Claude Code reads `when_to_use`. Claude-only fields such as `disable-model-invocation` and `allowed-tools` do nothing on Codex and OpenCode, and some of them break a claude.ai upload.
8. Keep a `SKILL.md` under 500 lines and about 5,000 tokens, as the spec recommends. Claude Code keeps only the first 5,000 tokens of a skill after compaction.

Traps:

- `CONTEXT.md` in OpenCode. OpenCode still reads `CONTEXT.md` as instructions where no `AGENTS.md` or `CLAUDE.md` is found. This repo uses `CONTEXT.md` as a glossary. At the root it is safe, because `AGENTS.md` wins. A project that copies the glossary pattern needs an `AGENTS.md` or `CLAUDE.md` in the same or a parent directory. A `CONTEXT.md` in a subdirectory with no sibling `AGENTS.md` loads as instructions when a file there is read.
- `CLAUDE.local.md` in Claude Code. Any `CLAUDE.md` or `CLAUDE.local.md` in cwd or above stops native `AGENTS.md` loading. Pattern 1 avoids this.
- `AGENTS.override.md` in Codex. It replaces `AGENTS.md` in its directory. Claude Code and OpenCode ignore it.
- Rules. `.claude/rules/` is Claude Code only. A Rule that must reach all three platforms belongs in `AGENTS.md`, which matches the "Rule" entry in `CONTEXT.md`.
- `MEMORY.md`. None of the three loads a repo-root `MEMORY.md` by itself. `AGENTS.md` must tell the agent to read it. Claude Code's auto memory uses the same file name in `~/.claude/projects/<project>/memory/`, which is a different file.

Description triggers for the `agent-instructions` skill: the file and folder names that the three platforms load as instructions. These are `SKILL.md`, `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.md`, `CLAUDE.local.md`, `.claude/rules/`, `.claude/skills/`, `.agents/skills/`, `.opencode/skills/`, `CONTEXT.md`, `MEMORY.md`, and `docs/agents/`.

## Open points

- Whether a whole-folder symlink from `.claude/skills` to `.agents/skills` works in Claude Code. Only per-skill symlinks are documented.
- Whether OpenCode has a global cap on instruction size outside `instruction.ts`.
- `packages/core/src/instruction-context.ts` in OpenCode is a newer loader that reads only `AGENTS.md`. It was not confirmed whether the CLI uses it. If it replaces `instruction.ts`, the `CONTEXT.md` trap goes away.
- No platform was run. All behaviour comes from docs and source reading.
