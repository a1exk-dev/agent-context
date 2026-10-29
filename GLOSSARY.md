# agent-context

This repository gives Skills and Rules to other projects. Agents in these projects use the Skills and Rules with Codex, OpenCode, and Claude Code.

## Language

**Skill**:
A Skill is a folder `skills/<category>/<name>/` that contains a `SKILL.md` file and all other files that the Skill uses. An agent loads a Skill only when a task makes it necessary.
_Avoid_: plugin, skill package

**Rule**:
A Rule is a short Markdown file `rules/<category>/<name>.md` whose text a project adds to `AGENTS.md` or `CLAUDE.md`, not to `.claude/rules/`. An agent loads that text in each session.
_Avoid_: rule file

**Category**:
A Category is a folder, one level deep, that contains Skills under `skills/` or Rules under `rules/`. A Category is never a Skill.

**Agent instruction**:
An Agent instruction is a file that an agent reads as instructions. Examples are a Skill, a Rule, `AGENTS.md`, `CLAUDE.md`, `GLOSSARY.md`, `MEMORY.md`, and the files in `docs/agents/`. A file for persons, for example `README.md`, is not an Agent instruction.
_Avoid_: prompt file, instruction file

**Operator**:
The Operator is the human who controls a project and the agents that work in it. Only the Operator answers the questions of an agent and gives approval. An agent never acts as the Operator.
_Avoid_: user, owner, maintainer

**Commit policy**:
A Commit policy is the file `docs/agents/commit-policy.md` of a project. It holds the title `# Commit policy` and the Settings that each commit by the git-commit Skill obeys, and no other text.
_Avoid_: commit rules, commit conventions, commit config

**Setting**:
A Setting is one line `- <name>: <value>` of a Commit policy. The git-commit Skill fixes each name and its possible values.
_Avoid_: option, rule

**Commit review**:
A Commit review is what an agent shows the Operator before one commit: the staged files, the full diff, and the exact message. But for a diff of more than 500 lines, the Commit review gives the command that shows the diff, not the full diff. The commit occurs only after the Operator approves that review.
_Avoid_: commit preview, approval request

**Blocking rule**:
A Blocking rule is a judgment requirement in a reference file of the agent-instructions Skill, with the mark "(blocking)" at its end. A confirmed finding for a Blocking rule makes its review round fail. A breach of a Blocking rule makes an agent do a wrong action or miss an instruction. One or two quotations from the files let a new subagent answer yes or no.
_Avoid_: hard rule, error rule

**Advisory rule**:
An Advisory rule is a judgment requirement in a reference file of the agent-instructions Skill, with the mark "(advisory)" at its end. A finding for an Advisory rule never makes a review round fail.
_Avoid_: soft rule, warning rule

**Confirmer**:
A Confirmer is a new subagent that answers "yes" or "no", with one sentence, for one problem that a different check found. That check can be a reviewer, the grader of the output tests, or the author in a reader test. The Confirmer gets the requirement, the quoted text, and the files, but not the reason of the other check. The problem counts when one or more Confirmers answer "yes".
_Avoid_: verifier, second reviewer
