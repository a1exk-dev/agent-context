# Research: how a TypeScript script in a Skill runs on the user's machine

Question (issue #21, map #20): A Skill may ship a script in its own folder. The `skills` CLI installs only that folder, so the script cannot use the repo's root `package.json` dependencies. For Codex, OpenCode, and Claude Code: is Bun present or expected? Can Node run `.ts` directly, from which version, with which limits? What do other published Skills do? Which approach works on all three platforms with no install step?

Use: the runtime rule for scripts in Skills after the move to TypeScript on Bun (#20).

Sources, read on 2026-10-03:

- Node.js docs: [Modules: TypeScript](https://nodejs.org/api/typescript.html) (history table and limits). Release dates: [`nodejs/Release` `schedule.json`](https://github.com/nodejs/Release/blob/main/schedule.json).
- Bun docs: [Single-file executables](https://bun.com/docs/bundler/executables), section on `BUN_BE_BUN`.
- Claude Code docs: [Advanced setup](https://code.claude.com/docs/en/setup), [Skills](https://code.claude.com/docs/en/skills).
- Codex source: [openai/codex](https://github.com/openai/codex) at `main` commit `b741e48` (2026-10-03). Install methods from its `README.md`.
- OpenCode source: [anomalyco/opencode](https://github.com/anomalyco/opencode) at `dev` commit `907b3bc` (2026-10-02, version 1.18.34). Install methods from [opencode.ai/docs](https://opencode.ai/docs/).
- `skills` CLI source: [vercel-labs/skills](https://github.com/vercel-labs/skills) at commit `18f96ea` (2026-10-02, version 1.7.0).
- Agent Skills: [Specification](https://agentskills.io/specification), [Using scripts in skills](https://agentskills.io/skill-creation/using-scripts).
- Published Skills: [anthropics/skills](https://github.com/anthropics/skills) at `8a1541c` (2026-09-28), [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) at `063bee9` (2026-08-28).
- Local runs on Linux x64 (2026-10-03): Node 22.17.0, 22.18.0, 22.20.0, 26.7.0; Bun 1.4.2; Deno; Claude Code 2.1.288; Codex 0.160.0; OpenCode 1.18.34.

## Summary

| | Claude Code | Codex | OpenCode |
| - | - | - | - |
| Ships as | Native binary (built with Bun) | Native Rust binary | Native binary (built with `bun build --compile`) |
| Needs Node to run | No | No (only the npm launcher needs Node 16+) | No (only the npm launcher needs Node) |
| `bun` on PATH | No | No | No |
| Bun inside the binary usable for scripts | No (tested) | Not applicable | Yes, with `BUN_BE_BUN=1 opencode`, but only OpenCode has it |
| Network in the agent's shell | Yes by default | No in the default `workspace-write` sandbox | Yes by default |

The main result: none of the three platforms puts `bun` or `node` on the user's PATH. So no runtime is guaranteed by the platform. The `skills` CLI that installs a Skill runs on Node and declares `node >=22.20.0`. Node runs `.ts` files with no flag from 22.18.0. So a user who installed a Skill with `npx skills add` has, in the standard case, a Node that runs the Skill's `.ts` script directly. Write the script as erasable TypeScript with only `node:` built-ins, and run it with `node <skill-dir>/scripts/<name>.ts`. The same file also runs on Bun and Deno.

## 1. Is Bun present?

- Claude Code. The native installer, Homebrew, WinGet, apt, dnf, and apk install a native binary. The npm package "requires Node.js 22 or later", but "the installed `claude` binary does not itself invoke Node" ([setup](https://code.claude.com/docs/en/setup), "Install with npm"). System requirements list no Node and no Bun (same page, "System requirements"). The binary contains Bun v1.4.3 (found with `strings`), but `BUN_BE_BUN=1 claude <file>.ts` started a normal Claude session. So the embedded Bun is not reachable as a CLI (local run, 2.1.288).
- Codex. Install methods are npm, Homebrew, a curl or PowerShell script, and GitHub release binaries (`README.md`). The binary is a static Rust executable (local `file` output). The npm launcher `codex-cli/bin/codex.js` starts with `#!/usr/bin/env node`, and `codex-cli/package.json` declares `"node": ">=16"`. No Bun anywhere.
- OpenCode. Install methods are a curl script, npm, Bun, pnpm, Yarn, Homebrew, AUR, Chocolatey, Scoop, mise, and Docker ([docs](https://opencode.ai/docs/)). The release binary is built with `bun build` and `compile:` (`packages/opencode/script/build.ts:165-180`), so Bun runs inside it, but no `bun` binary goes on PATH. The npm launcher `packages/opencode/bin/opencode` starts with `#!/usr/bin/env node` and spawns the native binary.
- OpenCode's embedded Bun. Bun docs: "Set the `BUN_BE_BUN=1` environment variable to run a standalone executable as if it were the `bun` CLI itself" ([executables](https://bun.com/docs/bundler/executables)). OpenCode uses this itself for MCP servers whose command is `opencode` (`packages/opencode/src/mcp/index.ts:354`) and for formatters (`packages/opencode/src/format/formatter.ts:41`). `BUN_BE_BUN=1 opencode /tmp/t.ts` ran a `.ts` file and printed `bun --version` as 1.3.14 (local run). The shell tool passes only `process.env` plus plugin variables (`packages/opencode/src/tool/shell.ts:416-426`), so it adds no `bun` to PATH. This trick works only in OpenCode and is not a documented interface for Skills.

So Bun is not present or expected on any of the three platforms. A user has `bun` only if they installed it themselves.

## 2. Can Node run `.ts` directly?

From the Node.js docs ([TypeScript](https://nodejs.org/api/typescript.html)):

- Type stripping is "Stability: 2 - Stable".
- History: added as `--experimental-strip-types` in 22.6.0; enabled by default in 23.6.0 and 22.18.0; stable in 25.2.0 and 24.12.0. `--experimental-transform-types` was added in 22.7.0 and removed in 26.0.0. Disable stripping with `--no-strip-types`.
- Not supported, because they need code generation: `enum`, `namespace` with runtime code (type-only namespaces work), parameter properties, `import x = require()` aliases, and decorators.
- Import paths must have the file extension: `import './file.ts'`, not `import './file'`. Type-only imports need `import type` or an inline `type` marker. Otherwise they fail at run time.
- Node ignores `tsconfig.json`. Path aliases and down-levelling do not work. The docs recommend TypeScript 5.8+ with `noEmit`, `target: esnext`, `module: nodenext`, `rewriteRelativeImportExtensions`, `erasableSyntaxOnly`, and `verbatimModuleSyntax`.
- Node refuses to strip types from `.ts` files under a `node_modules` path. An installed Skill lives under `.agents/skills/` or `.claude/skills/`, not `node_modules`, so this does not apply.

Local check (`import` of a `.ts` file plus `import type`, no `package.json`):

- Node 22.17.0: fails with `ERR_UNKNOWN_FILE_EXTENSION`.
- Node 22.18.0, 22.20.0, 26.7.0: runs, with no warning.
- Node 22.18.0 on an `enum`: `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX: TypeScript enum is not supported in strip-only mode`.
- Node 26.7.0: `--experimental-transform-types` is a bad option. So code that needs transforms has no flag fallback on current Node.
- Bun 1.4.2 and Deno run the same file. Deno needs `--allow-*` flags for file system or network access.

Release status on 2026-10-03 (`schedule.json`): Node 20 reached end of life on 2026-04-30. Node 22 is in maintenance until 2027-04-30. Node 24 is LTS. Node 26 becomes LTS on 2026-10-28. So every supported Node line is 22 or later, but early 22.x releases (22.0.0 to 22.17.x) cannot run `.ts` without a flag.

## 3. What does the installer guarantee?

- The `skills` CLI declares `"engines": { "node": ">=22.20.0" }` (`package.json:144-146`). Its README installs Skills with `npx skills add <source>`. So a standard install needs Node and npm. npm only warns on an engine mismatch, so an older Node is possible but outside the supported path.
- The CLI copies the whole Skill folder, except `metadata.json`, `.git`, `__pycache__`, and `__pypackages__` (`src/installer.ts:458-463`). It runs no install step, such as `npm install`, in the Skill folder. Its `child_process` calls are for git, update, and `use` (`src/git.ts`, `src/update.ts`, `src/use.ts`).
- The agent can run a Skill on another machine than the one that installed it, for example in a container or a remote sandbox. Then Node is not guaranteed. This is a reason to state the requirement in `SKILL.md`.

## 4. How the agent finds the script

- Claude Code: `${CLAUDE_SKILL_DIR}` is "the directory containing the skill's `SKILL.md` file", for use "to reference scripts or files bundled with the skill, regardless of the current working directory" ([Skills](https://code.claude.com/docs/en/skills)). Its example runs `python3 ${CLAUDE_SKILL_DIR}/scripts/visualize.py`, which "uses only built-in libraries, so there are no packages to install".
- OpenCode: the `skill` tool output starts with `Base directory for this skill: <dir>` and "Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory" (`packages/opencode/src/tool/skill.ts:53-54`).
- Codex: the skills catalog gives the path to each `SKILL.md` (from the earlier agent-platforms research). No variable like `${CLAUDE_SKILL_DIR}` was found.
- Agent Skills spec: use relative paths from the Skill root, for example `scripts/extract.py`. "Supported languages depend on the agent implementation. Common options include Python, Bash, and JavaScript" ([Specification](https://agentskills.io/specification), "`scripts/`").

So the portable form is a plain sentence such as "Run `node scripts/check.ts <file>` from this skill's directory". The agent resolves the directory on each platform. `${CLAUDE_SKILL_DIR}` works only in Claude Code.

## 5. What other published Skills do

- anthropics/skills: scripts are Python (62 `.py` files) and 2 shell scripts. No `.ts` or `.js` script. JavaScript appears only as code the agent writes, with packages it calls "preinstalled" in Anthropic's sandbox (`skills/docx/SKILL.md:21`, `skills/pptx/SKILL.md:31`).
- vercel-labs/agent-skills: `vercel-optimize` ships 89 `.mjs` files that import only `node:` modules and relative files. `SKILL.md` lists "Node.js 20+" as a prerequisite and runs `node scripts/collect-signals.mjs ...`. Types come from a `.d.ts` file, not from `.ts` source. `deploy-to-vercel` uses Bash.
- The Agent Skills guide ([Using scripts](https://agentskills.io/skill-creation/using-scripts)) lists `npx`, `bunx`, `uvx`, `pipx`, `deno run`, and `go run` for one-off commands. For self-contained scripts it shows PEP 723 with `uv run`, Deno with `npm:` imports, Bun auto-install, and Ruby `bundler/inline`. It says `bunx` is "only appropriate when the user's environment has Bun rather than Node.js". It advises: "State prerequisites in your `SKILL.md` (e.g., "Requires Node.js 18+")", and the `compatibility` field for runtime requirements.
- No published Skill in these sources uses `npx tsx` or ships `.ts` source.

## 6. Options compared

| Option | Claude Code | Codex | OpenCode | Install step | Notes |
| - | - | - | - | - | - |
| `.ts` with `node` (type stripping) | Yes, Node 22.18+ | Yes, Node 22.18+ | Yes, Node 22.18+ | None | Same Node the `skills` CLI needs. Erasable syntax and `node:` built-ins only. |
| Bundled `.js` (built from `.ts` in the repo) | Yes, any Node | Yes, any Node | Yes, any Node | None | Needs a build step and a committed build output in the Skill folder. Source and output can drift. |
| `bun scripts/x.ts` | Only if the user installed Bun | Same | Same, or `BUN_BE_BUN=1 opencode` | User installs Bun | Not present by default on any platform. |
| `bunx` / `npx tsx` / `npx <pkg>` | Downloads at run time | Fails in the default sandbox (no network) | Downloads at run time | Network download | Codex `workspace-write` has `network_access: false` by default (`codex-rs/protocol/src/protocol.rs:1213-1220`). |
| Python standard library | Only if Python 3 is present | Same | Same | None | Not TypeScript. |

## 7. Recommended approach

1. Ship scripts as `.ts` files in `skills/<category>/<name>/scripts/`, and run them with `node scripts/<name>.ts` from the Skill's directory.
2. Use only erasable TypeScript: no `enum`, no runtime `namespace`, no parameter properties, no decorators, no `import =` aliases.
3. Import relative files with the `.ts` extension, and type-only imports with `import type`.
4. Import only `node:` built-ins and files inside the Skill folder. No npm packages, because nothing installs them.
5. In the repo, type-check with `tsc --noEmit` and `erasableSyntaxOnly`, `verbatimModuleSyntax`, `allowImportingTsExtensions` (or `rewriteRelativeImportExtensions`), `module: nodenext`. Bun can run the repo's tests and checks, because the same file runs on Bun.
6. In `SKILL.md`, state "Requires Node.js 22.18 or later" in the body, because only Claude Code reads `compatibility`. Call the script with `node`, not through a shebang, so it also works on Windows.
7. Keep a bundled `.js` build as the fallback only if a Skill must support Node older than 22.18 or needs code that type stripping refuses.

## Open points

- Exec permission and shebangs after a `skills` copy install were not tested. Calling `node <file>` avoids both.
- Windows was not run. Node type stripping is documented for all platforms.
- Codex cloud tasks and other remote sandboxes were not checked for which Node version they ship.
- Whether Claude Code's embedded Bun can be reached by another documented switch was not found. Only `BUN_BE_BUN` was tried.
