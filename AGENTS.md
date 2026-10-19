# System design

- Use KISS and YAGNI as the two equal primary rules of system design. Base each design decision on evidence.
- For each system design decision, examine SOLID. Use composition, not inheritance.
- Design the code and its tests for standard use, and for the failures that production inputs, dependencies, or code paths can cause. Do not design for failures that only test code can cause.

# Questions

- When you must ask the user a question, use the question tool. Ask one question, then wait for the answer before you ask the next question. Give concrete answer options, with the recommended option first. This rule replaces the question format of each Skill that asks questions in batches.

# Knowledge

- Before you examine or change the repository, read `GLOSSARY.md` for the project terms and `MEMORY.md` for the applicable entries. Before you change a part of the project, read the ADRs in `docs/adr/` that are related to that part. Obey these ADRs, because each ADR records a decision that the code does not show.
- Prototypes: The `prototypes/` folder contains work that the repository does not keep. Take facts and decisions from the other folders. Open `prototypes/` only when the current prompt of the user tells you to open it.

# Workflow

- Branches: Before you create a branch, or open or merge a pull request, obey Git Flow. Open pull requests into `main` only from `release/<semver>` or `hotfix/<name>`. Send all other changes, for example `feature/<name>` and `bugfix/<name>`, through a pull request into `develop`. Change `main` and `develop` only through pull requests with merge commits, because users install Skills from `main`.
- Merging: When all required checks pass, merge a pull request into `develop` yourself. Leave pull requests into `main` for the user to merge. GitHub deletes the remote branch of a merged pull request, but your local branch stays. After you merge a pull request from a `feature/<name>` or `bugfix/<name>` branch into `develop`, do these steps:
  1. Run `git switch develop`.
  2. Run `git pull`.
  3. Run `git fetch --prune`.
  4. CAUTION: Delete a local branch only with `git branch -d`, not `git branch -D`. `git branch -D` deletes commits that no other branch contains.
  5. Delete the local branch of that pull request with `git branch -d <branch>`.
- Commits: Before you make a commit, or write or use a commit message, read and obey [`docs/agents/commit-policy.md`](docs/agents/commit-policy.md).
- Checks: Before each commit, run `docker compose run --rm bun run check`. Correct all errors that it reports, until it exits 0. To correct the format, run `docker compose run --rm bun run fix`.
- Back-merges: After the user merges a pull request into `main`, `release.yml` opens the back-merge pull request from `main` into `develop`. If the `back-merge` job stops because Git cannot merge `main` into `develop`, do not change that pull request. If you change that pull request, you push commits to `main`. Run `git fetch`. Then do these steps:
  1. Make the branch `bugfix/back-merge-v<semver>` from `origin/develop`. The title of the back-merge pull request gives `<semver>`.
  2. On that branch, run `git merge origin/main` and correct the files that Git cannot merge.
  3. Open a pull request from that branch into `develop`.
  4. Close the back-merge pull request, because the new pull request replaces it.

# Agent skills

## Issue tracker

The issues are GitHub Issues on a1exk-dev/agent-context. The private "agent-context" project tracks them. Before you create, read, or change an issue, read `docs/agents/issue-tracker.md`.

## Triage labels

The default labels are needs-triage, needs-info, ready-for-agent, ready-for-human, and wontfix. Before you add or change a triage label, read `docs/agents/triage-labels.md`.

## Domain docs

Before you write or edit `AGENTS.md`, `GLOSSARY.md`, `MEMORY.md`, or an ADR, and when you complete a task, obey `docs/agents/domain.md`.
