# Loading rules

These rules are tier 1. A file that breaks one of them does not load, or a platform does not read it. They apply to each Agent instruction.

## When you find the target platforms

Find the target platforms from the project files:

| Signal | Target platforms |
|---|---|
| `CLAUDE.md` or `.claude/` | Claude Code |
| `AGENTS.md` or `.agents/` | Codex and OpenCode |
| `.opencode/` or `opencode.json` | OpenCode |

If you find no signal, or a signal conflicts with the request, ask the user once. Support for all three platforms is a choice of the project. Do not add a platform that the project does not target.

## When you select a feature

Write only features that Codex, OpenCode, and Claude Code all read. This rule applies also when Claude Code is the only target.

- Do not write `@path`, `.claude/rules/`, frontmatter that only Claude Code reads, or `AGENTS.override.md`.
- The `@AGENTS.md` line in `CLAUDE.md` is the one exception.
- Write each pointer as a prose sentence that names the file and the condition to read it.
- When its heading gives the condition, also put the condition in the pointer sentence.

When the user explicitly asks for a single-platform feature, write it. Then add a warning. The warning names the platforms that do not read the feature and gives the portable alternative. For an `@path` line in `CLAUDE.md`, the portable alternative is a prose pointer in `AGENTS.md`.

## When you write or edit an entry file

- When the targets are Claude Code and Codex or OpenCode, the write job puts the shared text in `AGENTS.md`. `CLAUDE.md` then holds the `@AGENTS.md` line and only lines for Claude Code alone.
- When there is one target platform, the entry file of that platform is the only entry file.
- The edit job changes only the part that the user asked for. If the layout leaves a target platform without the text, add a warning.
- Put Rule text in `AGENTS.md` or `CLAUDE.md`. Do not put it in `.claude/rules/`.

## When you check the file size

| File | Limit |
|---|---|
| Entry files | The chain of entry files from the project root to the file is less than 32 KiB in total, the Codex budget. Each entry file has less than 200 lines. These limits apply for all targets. |
| Skills | `SKILL.md` has a maximum of 20,000 bytes. Measure the bytes, for example with `wc -c`. 20,000 bytes are approximately 5,000 tokens. When Claude Code makes the context window smaller, it keeps only the first 5,000 tokens of a Skill. |
| `CONTEXT.md`, `MEMORY.md`, and `docs/agents/` files | No limit |

If a file is over a limit, add a warning with its extraction suggestion.

## When you suggest text to move

This suggestion applies to entry files and Skills, also when the file is under its limit.

1. Find each section that has a condition that you can name, for example "before a release".
2. For each section, propose a reference file and a pointer sentence that states the condition.
3. List each candidate in the Extraction candidates part of the report.
4. Move nothing until the user says yes.

## When the file is CONTEXT.md, MEMORY.md, or a Rule

- `CONTEXT.md` and `MEMORY.md` use the format that the project already uses. Copy the format of the entries in the file. This skill has no template for them.
- This skill has no template for Rules. Edit a Rule as you edit other Agent instructions.
- A file that is not a Skill gets the STE rules, the plain-language checks, the size limits, and the suggestion to move text. No other part of the Agent Skills specification applies to it.
