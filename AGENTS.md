# System design

- Treat evidence-led KISS and YAGNI as equal primary system design heuristics.
- Consider SOLID for every system design decision, and prefer composition over inheritance.
- Design functionality and tests around standard usage and feasible failures reachable through production inputs, dependencies, or execution paths. Failures possible only through test-only construction are outside scope.

# Questions

- Ask one question at a time through the question harness tool, and wait for the answer before the next. Provide concrete answer options, with the recommended option first. This sequence replaces any skill's batched-round format.

# Knowledge

- Before exploring or changing the repo, read `CONTEXT.md` for canonical concepts and `MEMORY.md` for applicable durable guidance.
- Before defining or editing `AGENTS.md`, `CONTEXT.md`, or `MEMORY.md`, and at task completion, follow [`docs/agents/domain.md`](docs/agents/domain.md).

# Workflow

- Branches: Before creating a branch, opening or merging a pull request, or tagging, follow Git Flow strictly with `feature/<name>`, `release/<semver>`, and `hotfix/<semver>` branches, and tag each merge into `main` as `v<semver>`. Change `main` and `develop` only through pull requests with merge commits, because users install skills from `main`.
- Commits: Before creating a commit or proposing or using a commit message, read and follow [`docs/agents/commit-policy.md`](docs/agents/commit-policy.md).
- Checks: Before each commit, run `scripts/check.sh`. Done when it exits 0; fix every error it reports.
