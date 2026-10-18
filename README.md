# agent-context

Skills and rules for coding agents.

## Layout

- `skills/<category>/<skill>/SKILL.md` — installable skills
- `rules/<category>/<rule>.md` — rule shards for `AGENTS.md` / `.claude/rules/`
- `scripts/` — repo tooling, not shipped

## Setup

Run the checks in the container. It uses the pinned Bun version, so you do not need Bun on your machine:

```sh
docker compose run --rm bun run check   # every check: repo, types, lint, spelling, tests
docker compose run --rm bun run fix     # fix formatting
```

The container runs as UID and GID 1000 by default. If your user has a different UID or GID (see `id -u` and `id -g`), export them first, so `fix` writes files that you own:

```sh
export UID GID=$(id -g)
```

Or use Bun directly. Install Bun at the version that `packageManager` in `package.json` gives, then run:

```sh
bun install
bun run check
bun run fix
```
