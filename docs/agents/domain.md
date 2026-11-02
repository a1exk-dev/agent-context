# Glossary, Memory, and ADRs

## When you write or edit AGENTS.md, GLOSSARY.md, or MEMORY.md

Before you write or edit `AGENTS.md`, `GLOSSARY.md`, or `MEMORY.md`, use the `agent-instructions` Skill, because these files are Agent instructions.

A knowledge read is complete when two conditions are true before editing. Every task term defined by `GLOSSARY.md` is used consistently. Every `MEMORY.md` entry whose `Applies when:` condition matches the task is accounted for.

## When a task makes or changes a project term

`GLOSSARY.md` is the repository glossary. Create or update it in the same task that resolves or changes a project-specific term, conceptual boundary, or relationship another agent can otherwise interpret differently.

When a task makes or changes a project term, use the `domain-modeling` Skill to write each entry in `GLOSSARY.md`. That Skill gives the entry format.

Keep commands, procedures, task history, and temporary findings in their operational sources. A context update is complete when every resolved or changed concept appears once under its canonical name and no conflicting definition remains.

## MEMORY.md: durable guidance

`MEMORY.md` holds current guidance that future work must apply: durable constraints, recurring gotchas, proven lessons, and decisions with rationale that do not get an ADR. Record only verified items that cannot be inferred cheaply from the repository. Create or update it in the same task that establishes one of those items.

Give each item one actionable entry:

```markdown
## <Constraint, lesson, or decision>

Applies when: <condition>

Guidance: <action or constraint>

Reason: <durable rationale>
```

Keep the file curated as current guidance by replacing stale entries and leaving task narration in the originating ticket. A memory update is complete when every newly established durable item is represented, its applicability and rationale are explicit, and stale conflicting guidance is removed.

## Apply and preserve

Use `GLOSSARY.md` vocabulary in tickets, proposals, hypotheses, and tests. Apply relevant `MEMORY.md` guidance before changing files.

When proposed work conflicts with either file or with an ADR, surface the conflicting entry and obtain a decision before implementation. At completion, account for every concept or durable item resolved by the work and update its single source of truth.

## Preserve automatically

Treat `AGENTS.md`, `GLOSSARY.md`, and `MEMORY.md` as agent-owned operating knowledge optimized for future agent execution.

At the completion of every task, classify each useful discovery and important decision:

- Agent behavior or invocation instruction: update `AGENTS.md`, disclosing branch-specific detail behind a pointer.
- Canonical project term, boundary, or relationship: update `GLOSSARY.md`.
- Architecture decision: obey the section "When a task makes an architecture decision".
- Durable constraint, gotcha, proven lesson, or other decision with rationale: update `MEMORY.md`.

Write each qualifying item automatically as soon as it is resolved, without an approval gate. For an ADR, obey the section "When a task makes an architecture decision". Keep each meaning in one authoritative file and update an existing entry instead of duplicating it. At task completion, run the classification once more to catch anything missed. Tasks with no qualifying durable knowledge finish without a knowledge-file edit.

Commit every knowledge-file edit on the branch whose work produced it, before that branch is pushed. Preservation is complete when every qualifying item appears in exactly one authoritative location. In the final response, give the human a concise review list containing each changed knowledge file, what was added or updated, and why it qualified.

## When a task makes an architecture decision

1. When a task makes an architecture decision, use the `domain-modeling` Skill to examine the decision.
2. If all 3 conditions in the section "Offer ADRs sparingly" of the `domain-modeling` Skill are true, recommend an ADR to the Operator. If not, write the decision in `MEMORY.md`.
3. Before you write the ADR in `docs/adr/`, get approval from the Operator, because the Operator controls each ADR.

## Before you change an ADR

- Get approval from the Operator, because the Operator controls each ADR.
