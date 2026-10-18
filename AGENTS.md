# System design

- Treat evidence-led KISS and YAGNI as equal primary system design heuristics.
- Consider SOLID for every system design decision, and prefer composition over inheritance.
- Design functionality and tests around standard usage and feasible failures reachable through production inputs, dependencies, or execution paths. Failures possible only through test-only construction are outside scope.

# Questions

- Ask one question at a time through the question harness tool, and wait for the answer before the next. Provide concrete answer options, with the recommended option first. This sequence replaces any skill's batched-round format.

# Knowledge

- Before you examine or change the repository, read `GLOSSARY.md` for the project terms and `MEMORY.md` for the applicable entries. Before you change a part of the project, read the ADRs in `docs/adr/` that are related to that part. Obey these ADRs, because each ADR records a decision that the code does not show.
- Prototypes: `prototypes/` holds throwaway work. Take facts and decisions from the rest of the repo, and open `prototypes/` only when the human's current prompt asks for it.

# Workflow

- Branches: Before creating a branch, opening or merging a pull request, follow Git Flow strictly. Open pull requests into `main` only from `release/<semver>` or `hotfix/<name>`. Send every other change, including `feature/<name>` and `bugfix/<name>`, through a pull request into `develop`. Change `main` and `develop` only through pull requests with merge commits, because users install skills from `main`.
- Merging: Merge a pull request into `develop` yourself once every required check passes. Leave pull requests into `main` for the human to merge. GitHub deletes the remote branch of a merged pull request, but your local branch stays. After you merge a pull request from a `feature/<name>` or `bugfix/<name>` branch into `develop`, do these steps:
  1. Run `git switch develop`.
  2. Run `git pull`.
  3. Run `git fetch --prune`.
  4. CAUTION: Delete a local branch only with `git branch -d`, not `git branch -D`. `git branch -D` deletes commits that no other branch contains.
  5. Delete the local branch of that pull request with `git branch -d <branch>`.
- Commits: Before creating a commit or proposing or using a commit message, read and follow [`docs/agents/commit-policy.md`](docs/agents/commit-policy.md).
- Checks: Before each commit, run `docker compose run --rm bun run check`. Done when it exits 0; fix every error it reports. To fix formatting, run `docker compose run --rm bun run fix`.
- Back-merges: After the user merges a pull request into `main`, `release.yml` opens the back-merge pull request from `main` into `develop`. If the `back-merge` job stops because Git cannot merge `main` into `develop`, do not change that pull request. If you change that pull request, you push commits to `main`. Run `git fetch`. Then do these steps:
  1. Make the branch `bugfix/back-merge-v<semver>` from `origin/develop`. The title of the back-merge pull request gives `<semver>`.
  2. On that branch, run `git merge origin/main` and correct the files that Git cannot merge.
  3. Open a pull request from that branch into `develop`.
  4. Close the back-merge pull request, because the new pull request replaces it.

# Agent skills

## Issue tracker

GitHub Issues on a1exk-dev/agent-context, tracked in the private "agent-context" project. See `docs/agents/issue-tracker.md`.

## Triage labels

Default labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

## Domain docs

Before you write or edit `AGENTS.md`, `GLOSSARY.md`, `MEMORY.md`, or an ADR, and when you complete a task, obey `docs/agents/domain.md`.
