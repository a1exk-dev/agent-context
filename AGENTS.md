# System design

- Treat evidence-led KISS and YAGNI as equal primary system design heuristics.
- Consider SOLID for every system design decision, and prefer composition over inheritance.
- Design functionality and tests around standard usage and feasible failures reachable through production inputs, dependencies, or execution paths. Failures possible only through test-only construction are outside scope.

# Questions

- Ask one question at a time through the question harness tool, and wait for the answer before the next. Provide concrete answer options, with the recommended option first. This sequence replaces any skill's batched-round format.

# Knowledge

- Before exploring or changing the repo, read `CONTEXT.md` for canonical concepts and `MEMORY.md` for applicable durable guidance.
- Prototypes: `prototypes/` holds throwaway work. Take facts and decisions from the rest of the repo, and open `prototypes/` only when the human's current prompt asks for it.
- Before defining or editing `AGENTS.md`, `CONTEXT.md`, or `MEMORY.md`, and at task completion, follow [`docs/agents/domain.md`](docs/agents/domain.md).

# Workflow

- Branches: Before creating a branch, opening or merging a pull request, or tagging, follow Git Flow strictly. Open pull requests into `main` only from `release/<semver>` or `hotfix/<name>`, and tag each merge into `main` as `v<semver>`. Send every other change, including `feature/<name>` and `bugfix/<name>`, through a pull request into `develop`. Change `main` and `develop` only through pull requests with merge commits, because users install skills from `main`.
- Merging: Merge a pull request into `develop` yourself once every required check passes. Leave pull requests into `main` for the human to merge.
- Commits: Before creating a commit or proposing or using a commit message, read and follow [`docs/agents/commit-policy.md`](docs/agents/commit-policy.md).
- Checks: Before each commit, run `scripts/check.sh`. Done when it exits 0; fix every error it reports.
