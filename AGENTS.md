# System design

- Use KISS and YAGNI as the two equal primary principles of system design. Base each design decision on evidence.
- For each system design decision, examine SOLID. Use composition, not inheritance.
- Design the code and its tests for standard use, and for the failures that production inputs, dependencies, or code paths can cause. Do not design for failures that only test code can cause.

# Human communication

- Before you write text that a human reads (chat messages, questions, reports, code comments, and documents for persons), use the Skill tool with the human-communication Skill. If your platform has no Skill tool, read its SKILL.md.

# Knowledge

- Before you examine or change the repository, read `GLOSSARY.md` for the project terms and `MEMORY.md` for the applicable entries. Before you change a part of the project, read the ADRs in `docs/adr/` that are related to that part. Obey these ADRs, because each ADR records a decision that the code does not show.
- Prototypes: The `prototypes/` folder contains work that the repository does not keep. Take facts and decisions from the other folders. Open `prototypes/` only when the current prompt of the Operator tells you to open it.

# Workflow

- Checks: Before each commit, run `docker compose run --rm bun run check`. Correct all errors that it reports, until it exits 0. To correct the format, run `docker compose run --rm bun run fix`.

# Agent Skills

## Issue tracker

The issues are GitHub Issues on a1exk-dev/agent-context. The private "agent-context" project tracks them. Before you create, read, or change an issue, read `docs/agents/issue-tracker.md`.

## Triage labels

The default labels are needs-triage, needs-info, ready-for-agent, ready-for-human, and wontfix. Before you add or change a triage label, read `docs/agents/triage-labels.md`.

## Domain docs

Before you write or edit `AGENTS.md`, `GLOSSARY.md`, `MEMORY.md`, or an ADR, and when you complete a task, obey `docs/agents/domain.md`.
