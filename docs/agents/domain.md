# Context and Memory

Before defining or editing `AGENTS.md`, `CONTEXT.md`, or `MEMORY.md`, load the `writing-for-agents` skill and apply its context-pointer, hierarchy, co-location, completion, and pruning rules.

A knowledge read is complete when every task term defined by `CONTEXT.md` is used consistently and every `MEMORY.md` entry whose `Applies when:` condition matches the task is accounted for before editing.

## CONTEXT.md: canonical concepts

`CONTEXT.md` is the repository glossary. Create or update it in the same task that resolves or changes a project-specific term, conceptual boundary, or relationship another agent could otherwise interpret differently.

Give each concept one authoritative entry:

```markdown
## <Canonical term>

<Definition, boundary, and relationship to adjacent concepts.>
```

Keep commands, procedures, task history, and temporary findings in their operational sources. A context update is complete when every resolved or changed concept appears once under its canonical name and no conflicting definition remains.

## MEMORY.md: durable guidance

`MEMORY.md` holds current guidance that future work must apply: durable constraints, recurring gotchas, proven lessons, and decisions with rationale. Record only verified items that cannot be inferred cheaply from the repository. Create or update it in the same task that establishes one of those items.

Give each item one actionable entry:

```markdown
## <Constraint, lesson, or decision>

Applies when: <condition>

Guidance: <action or constraint>

Reason: <durable rationale>
```

Keep the file curated as current guidance by replacing stale entries and leaving task narration in the originating ticket. A memory update is complete when every newly established durable item is represented, its applicability and rationale are explicit, and stale conflicting guidance is removed.

## Apply and preserve

Use `CONTEXT.md` vocabulary in tickets, proposals, hypotheses, and tests. Apply relevant `MEMORY.md` guidance before changing files.

When proposed work conflicts with either file, surface the conflicting entry and obtain a decision before implementation. At completion, account for every concept or durable item resolved by the work and update its single source of truth.

## Preserve automatically

Treat `AGENTS.md`, `CONTEXT.md`, and `MEMORY.md` as agent-owned operating knowledge optimized for future agent execution.

At the completion of every task, classify each useful discovery and important decision:

- Agent behavior or invocation rule: update `AGENTS.md`, disclosing branch-specific detail behind a pointer.
- Canonical project term, boundary, or relationship: update `CONTEXT.md`.
- Durable constraint, gotcha, proven lesson, or decision with rationale: update `MEMORY.md`.

Write each qualifying item automatically as soon as it is resolved, without an approval gate. Keep each meaning in one authoritative file and update an existing entry instead of duplicating it. At task completion, run the classification once more to catch anything missed. Tasks with no qualifying durable knowledge finish without a knowledge-file edit.

Commit every knowledge-file edit on the branch whose work produced it, before that branch is pushed, through the [commit policy](commit-policy.md)'s review. Preservation is complete when every qualifying item appears in exactly one authoritative location. In the final response, give the human a concise review list containing each changed knowledge file, what was added or updated, and why it qualified.
