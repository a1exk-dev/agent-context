Yes, I'd rename it. On 2026-09-24 the upstream repo renamed its glossary file from `CONTEXT.md` to `GLOSSARY.md` (upstream commit `b1f3390`). The skills we just installed now look only for `GLOSSARY.md`, and none of them mention `CONTEXT.md`. If we keep the old name:

- **`domain-modeling` would create a second glossary.** It creates `GLOSSARY.md` when it settles its first term, so we'd end up with two glossaries that disagree. That breaks your rule of one source for each term.
- **`tdd`, `pr` and `codebase-design` wouldn't see your terms.** They read `GLOSSARY.md` "if it exists", so they'd skip `CONTEXT.md` without any warning.

A note in `docs/agents/domain.md` wouldn't fix this, because these skills look for the file name directly and never read that doc.

**What the rename touches** (tracked files that mention `CONTEXT.md`):
- `CONTEXT.md` → `GLOSSARY.md`, and its title.
- `AGENTS.md` (3 mentions), `docs/agents/domain.md` (7) and `MEMORY.md` (5). This includes the entry "A Skill term follows the CONTEXT.md term".
- Your own `agent-instructions` skill and its tests: about 40 mentions across `SKILL.md`, the reference files, `evals.json` and `load-requests.json`. I'd add `GLOSSARY.md` there rather than replace `CONTEXT.md`. Other projects that install your skill may still use `CONTEXT.md`, so the skill should handle both names.

**What stays the same:** `MEMORY.md`. It has no equivalent upstream. You don't use upstream's `docs/adr/`, and `MEMORY.md` already covers that role.

I'd do this on its own branch, `feature/glossary-rename` from `develop`, separate from `feature/agent-skills-setup`. The skill and test edits change what `agent-instructions` does, so its evals may need to run again.

Should I go ahead with that branch?
