# Contributing to agent-context

This file is for a person who changes this repository. To install the Skills in another project, read [README.md](README.md).

## Layout

| Path | Content |
|---|---|
| `skills/<category>/<name>/` | The Skills that this repository ships. Each Skill folder holds a `SKILL.md` file and each other file that the Skill uses. |
| `rules/<category>/<name>.md` | The Rules that this repository ships. A project copies the text of a Rule into its `AGENTS.md` or `CLAUDE.md`. The folder holds no Rule yet. |
| `scripts/` | The tools of this repository: the repository checks and the release scripts. This repository does not ship them. |
| `tests/` | The tests. `tests/skills/<category>/<name>/` holds the tests of one Skill. `tests/scripts/` holds the unit tests of `scripts/`. |
| `docs/` | The documents of this repository. `docs/agents/` holds the Policies and the other files that the agents read. `docs/research/` holds dated research records. |
| `.agents/skills/` | The Skills that the agents use to work on this repository. The third-party Skills come from `mattpocock/skills`, and `skills-lock.json` records them. The other entries are symbolic links to the Skills in `skills/`. This repository does not ship this folder. |

## Workflow

1. Find or make an issue in the [GitHub Issues](https://github.com/a1exk-dev/agent-context/issues) of this repository.
2. Make a `feature/<name>` branch from `develop`.
3. Run the checks. The section "Checks" gives the commands.
4. Open a pull request into `develop`. GitHub merges the pull request with a squash merge when the `check` job passes.

Only a `release/X.Y.Z` branch or a `hotfix/<name>` branch can open a pull request into `main`. The `source-branch` job of `.github/workflows/check.yml` stops each other branch. When a pull request merges into `main`, the `release` workflow tags the merge commit.

The agents that work on this repository obey [AGENTS.md](AGENTS.md).

## Checks

Run the checks in the container. The container uses the pinned Bun version, so you do not need Bun on your machine:

```sh
docker compose run --rm bun run check   # each check: repo, types, lint, spelling, tests
docker compose run --rm bun run fix     # correct the format
```

The container runs as UID 1000 and GID 1000 by default. If your user has a different UID or GID, export them first. Then `fix` writes files that you own. The commands `id -u` and `id -g` give your UID and GID.

```sh
export UID GID=$(id -g)
```

As an alternative, use Bun directly. Install the Bun version that `packageManager` in `package.json` gives. Then run these commands:

```sh
bun install
bun run check
bun run fix
```

## Tests

`bun run check` runs the unit tests in `tests/`. Each Skill also has output tests. A runner script starts `claude -p` for the output tests on your machine. The README.md of each tests folder tells you how to run the output tests:

| Skill | Category | Tests |
|---|---|---|
| agent-instructions | writing | [README.md](tests/skills/writing/agent-instructions/README.md) |
| human-communication | writing | [README.md](tests/skills/writing/human-communication/README.md) |
| common-changelog | engineering | [README.md](tests/skills/engineering/common-changelog/README.md) |
| git-commit | engineering | [README.md](tests/skills/engineering/git-commit/README.md) |
| semver | engineering | [README.md](tests/skills/engineering/semver/README.md) |
