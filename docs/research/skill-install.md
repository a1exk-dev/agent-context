# Research: how a project installs a Skill and gets a Rule from this repository

Question (issue #215, map #214): How does a person in another project install a Skill from this repository, update it, and get a Rule? Which exact commands do this, and which source gives each command?

Use: the install and update section of the `README.md` outline (#214).

Sources, read on 2026-11-17:

- `skills` CLI source: [vercel-labs/skills](https://github.com/vercel-labs/skills) at `main` commit `57217cf` (2026-11-17), version 1.9.0. npm package [`skills`](https://www.npmjs.com/package/skills), latest version 1.9.0. Files: `README.md`, `docs/commands.md`, `docs/agents.md`, `docs/creating-skills.md`, `src/source-parser.ts`, `package.json`.
- This repository on GitHub: `gh repo view` (visibility and default branch), `gh api .../git/trees/main?recursive=1`, and the tags `v0.1.0`, `v0.2.0`, `v0.3.0`.
- Local files on `develop`: `skills/`, `rules/`, `.agents/skills/`, `.claude/skills/`, `.gitignore`, `GLOSSARY.md`, `MEMORY.md`, `README.md`, `docs/research/agent-platforms.md`, `docs/research/skill-script-runtime.md`. The file `skills-lock.json` of the Operator's checkout (Git ignores this file).
- Local runs on Linux x64 with Node 26.12.0 and `npx -y skills@1.9.0`, in empty scratch folders, with `DISABLE_TELEMETRY=1`.

## Summary

A project installs Skills from this repository with the `skills` CLI. The CLI needs Node.js 22.20 or later. Run the commands in the root folder of the project.

| Task | Command |
| - | - |
| Install one Skill for Codex, OpenCode, and Claude Code | `npx skills add a1exk-dev/agent-context --skill git-commit -a codex -a opencode -a claude-code` |
| Install all Skills of this repository | `npx skills add a1exk-dev/agent-context/skills --skill '*' -a codex -a opencode -a claude-code` |
| Install the Skills of one release | `npx skills add 'a1exk-dev/agent-context/skills#v0.3.0' --skill '*' -a codex -a opencode -a claude-code` |
| Show the Skills that the CLI finds | `npx skills add a1exk-dev/agent-context/skills --list` |
| Look for updates | `npx skills check` |
| Install the updates | `npx skills update` |
| Install the Skills again from `skills-lock.json` | `npx skills experimental_install` |
| Get a Rule | No command. Copy the text of `rules/<category>/<name>.md` into `AGENTS.md` or `CLAUDE.md`. |

The main results:

- The CLI finds Skills in Category folders, `skills/<category>/<name>/SKILL.md`. It shows only the name of the Skill, not the Category.
- Without a ref, the CLI reads the default branch `main`. On 2026-11-17, `main` holds 2 Skills of this repository: `git-commit` and `agent-instructions`. `develop` holds 5.
- The path `a1exk-dev/agent-context` without `/skills` also finds 13 Skills of `mattpocock/skills` in `.agents/skills/`. With `--skill '*'`, the CLI installs these 13 Skills too. Add `/skills` to the path to install only the Skills of this repository.
- The repository is public today. For a private repository, the same command works when Git, GitHub CLI, or SSH already has access.
- `rules/` holds no Rule. On `main` and on `develop`, `rules/` holds only `.gitkeep`. No installer for Rules exists.
- The current `README.md` says that Rules go to "`AGENTS.md` / `.claude/rules/`". `GLOSSARY.md` says that a project adds the text of a Rule to `AGENTS.md` or `CLAUDE.md`, not to `.claude/rules/`. The new `README.md` must follow `GLOSSARY.md`.

## 1. Install one Skill

```sh
npx skills add a1exk-dev/agent-context --skill git-commit -a codex -a opencode -a claude-code
```

- `--skill <name>` selects Skills by name. `'*'` selects all Skills (`docs/commands.md`, "Options").
- `-a <agent>` selects the agents. Without `-a`, the CLI asks for the agents. `-y` skips all questions (`docs/commands.md`, "Options").
- The local run installed `git-commit` from `skills/engineering/git-commit/` into `.agents/skills/git-commit/`. The CLI also made the link `.claude/skills/git-commit` to that folder.

## 2. Install all Skills of this repository

```sh
npx skills add a1exk-dev/agent-context/skills --skill '*' -a codex -a opencode -a claude-code
```

The CLI searches some fixed folders of a repository, for example `skills/`, `.agents/skills/`, and `.claude/skills/` (`docs/creating-skills.md`, "Skill Discovery"). This repository has Skills in 2 of these folders:

| Folder | Skills on `main` | Owner |
| - | - | - |
| `skills/<category>/<name>/` | `git-commit`, `agent-instructions` | This repository |
| `.agents/skills/<name>/` | `code-review`, `codebase-design`, `domain-modeling`, `grilling`, `implement`, `implement-spec`, `pr`, `prototype`, `research`, `tdd`, `to-spec`, `to-tickets`, `wayfinder` | `mattpocock/skills`, installed here for the work on this repository |

The local runs gave these results:

- `npx skills add a1exk-dev/agent-context --list` found 15 Skills: the 2 Skills of `skills/` and the 13 Skills of `.agents/skills/`.
- `npx skills add a1exk-dev/agent-context/skills --list` found only the 2 Skills of `skills/`.
- `npx skills add https://github.com/a1exk-dev/agent-context/tree/develop/skills --list` found the 5 Skills of `develop`: `common-changelog`, `git-commit`, `semver`, `agent-instructions`, and `human-communication`.

So the path `a1exk-dev/agent-context/skills` is the correct source for "all Skills of this repository". The lock file still records the source as `a1exk-dev/agent-context`, with the full `skillPath` (section 6).

## 3. Skills in Category folders

The CLI finds Skills in "catalog layouts with one or two category levels (`skills/<category>/<name>/SKILL.md` or `skills/<category>/<category>/<name>/SKILL.md`)" (`docs/creating-skills.md`, "Skill Discovery"). The local runs confirm this for `skills/engineering/` and `skills/writing/`.

The CLI installs each Skill under its name only, for example `.agents/skills/git-commit/`. The Category does not go to the project. Two Skills with the same name overwrite each other. `--rename <name>` installs one Skill under a different name (`docs/commands.md`, "Renaming a skill").

## 4. Select the agent

| Agent | `-a` value | Project folder | Global folder (`-g`) |
| - | - | - | - |
| Codex | `codex` | `.agents/skills/` | `~/.agents/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |

Source: `docs/agents.md`, "Supported agents".

- The CLI always puts the files in `.agents/skills/<name>/`. For Claude Code, the CLI adds a symbolic link in `.claude/skills/` by default. `--copy` makes copies, not links (`docs/commands.md`, "Installation Methods").
- `-g` installs for the user in all projects, not in the current project (`docs/commands.md`, "Installation Scope").
- `docs/research/agent-platforms.md` gives the reason for 2 folders: Claude Code reads only `.claude/skills/`, and Codex does not read `.claude/skills/`.

## 5. Select a release or a branch

| Source | Effect | Source of the rule |
| - | - | - |
| `a1exk-dev/agent-context/skills` | Default branch, today `main` | Local run |
| `'a1exk-dev/agent-context/skills#v0.3.0'` | Version tag `v0.3.0` | Local run. `src/source-parser.ts:446-456`: "Branch pins use `#ref`". |
| `'a1exk-dev/agent-context/skills#develop'` | Branch `develop` | Local run. `docs/commands.md`, "Source Formats". |
| `a1exk-dev/agent-context@v0.3.0` | Version tag `v0.3.0`, all folders | `docs/commands.md`, "Source Formats". `src/source-parser.ts:446-456`: a version tag or a full commit SHA after `@` is a pin. Other text after `@` is a Skill name. |

Use `#`, not `@`, after the `/skills` path. The local run of `npx skills add a1exk-dev/agent-context/skills@v0.3.0 --list` stopped with `[SKILLS_NO_VALID_SKILLS] No valid skills found`. The `@` pin works only directly after `owner/repo`. Put quotes around a source with `#`, because some shells read `#` as the start of a comment.

The tags of this repository are `v0.1.0`, `v0.2.0`, and `v0.3.0`. The local runs with `@v0.2.0` and `#v0.3.0` wrote the tag as `ref` into the lock file. After the `@v0.2.0` install, `npx skills check` reported "All project skills are up to date", although `main` has newer commits. So a pinned Skill stays on its tag.

## 6. `skills-lock.json`

`skills add` writes `skills-lock.json` in the root folder of the project. The lock file records each Skill of the project. This entry comes from the local run:

```json
{
  "version": 2,
  "skills": {
    "git-commit": {
      "source": "a1exk-dev/agent-context",
      "commit": "9df7a694e375c072975e57e990c45bdb7e05a10d",
      "sourceType": "github",
      "skillPath": "skills/engineering/git-commit/SKILL.md",
      "computedHash": "41ed40613f1ca2aa72089cf8fc0ace3eed575df20bbde75415c5fe71d47538fa"
    }
  }
}
```

- `computedHash` is a SHA-256 of the files in the Skill folder. `list`, `check`, and `install --frozen-lockfile` compare this value with the files on disk (`README.md`, "Lock File Content Hash").
- `commit` is the commit of the source. `skills install` fetches that commit, not the newest commit. `skills update` moves `commit` forward (`README.md`, "Lock File Content Hash").
- `ref` is present only for a pinned source (section 5).
- The CLI docs say "the lock is usually committed" (`docs/commands.md`, "Examples"). Commit `skills-lock.json` with the project. Then other persons can install the same Skills with `npx skills experimental_install`.
- In this repository, `.gitignore` holds `skills-lock.json`. The local file of the Operator has `"version": 1` and records only the 13 Skills of `mattpocock/skills`. The CLI upgrades a version 1 file when it reads the file (`README.md`, "Lock File Content Hash"). This file is a record of the work on this repository. A project that installs Skills from this repository does not use it.

## 7. Update the Skills

```sh
npx skills check      # list the Skills that have updates or local changes
npx skills update     # install the updates of all Skills
npx skills update git-commit   # install the update of one Skill
npx skills update -p -y        # update only the Skills of the project, with no questions
```

Source: `README.md`, "Other Commands"; `docs/commands.md`, "`skills check`" and "`skills update`".

- `skills check` exits with code 1 when a Skill has an update or local changes. A CI job can use this exit code.
- `skills update` reads the source of each Skill from `skills-lock.json`. The local runs of `check` and `update -p -y` found the Skills up to date.
- To restore the Skills of a project from `skills-lock.json`, for example after a clone:

```sh
npx skills experimental_install
```

`skills install` without a source is an alias for this command. The command is experimental, so its name and options can change (`docs/commands.md`, "Restore skills from the project lock file").

## 8. Private repository

Today the repository `a1exk-dev/agent-context` is public (`gh repo view`, 2026-11-17). If the repository becomes private, the install command stays the same (`docs/commands.md`, "Private Repositories"):

- For a GitHub short path or HTTPS URL, the CLI first uses the Git credentials of the user. If these fail and GitHub CLI has a login, the CLI tries `gh repo clone`. Then the CLI tries SSH.
- An SSH URL also works: `npx skills add git@github.com:a1exk-dev/agent-context.git`.
- `GITHUB_TOKEN` or `GH_TOKEN` gives access to the GitHub API, also for update checks. The token is optional when Git, GitHub CLI, or SSH has access.

So the person needs read access to the repository and one working login: a Git credential helper, `gh auth login`, or an SSH key. I did not test an install from a private repository.

## 9. Get a Rule

- `GLOSSARY.md` defines a Rule as "a short Markdown file `rules/<category>/<name>.md` whose text a project adds to `AGENTS.md` or `CLAUDE.md`, not to `.claude/rules/`".
- `MEMORY.md`, "Skills and Rules reach projects in different ways": "Tell a project to copy the text of a Rule into its `AGENTS.md` or `CLAUDE.md`." The reason: "No installer for Rules exists yet."
- The `skills` CLI has no command for Rules. Its docs and source handle only `SKILL.md` folders.
- `rules/` holds only `.gitkeep`, on `main` and on `develop`. So no Rule exists today.

When a Rule exists, a project gets the Rule with these steps:

1. Open `rules/<category>/<name>.md` on GitHub.
2. Copy the text of the Rule into `AGENTS.md` or `CLAUDE.md` of the project.
3. To update the Rule, compare the file with the text in the project and copy the changes by hand.

## Not verified

- An install from a private repository. The repository is public, so section 8 comes only from the CLI docs.
- An install on Windows or macOS. All runs used Linux.
- The behavior of `npx skills add a1exk-dev/agent-context --skill '*'` without `/skills`. I ran only `--list` for this path. The 13 extra Skills come from that list and from the meaning of `'*'` in `docs/commands.md`.
