# Memory

## Knowledge edits ride on their feature branch

Applies when: planning or building a feature produces an edit to `CONTEXT.md` or `MEMORY.md`.

Guidance: Commit the edit on that feature's `feature/<name>` branch, so it merges into `develop` in the same pull request as the feature.

Reason: A term or lesson only matters once its feature lands, and the operator wants the glossary and the feature to change together.

## ASD-STE100 content stays outside the repo

Applies when: an Agent instruction, script, or test needs ASD-STE100 rules or dictionary entries.

Guidance: Paraphrase the rules in our own words, cite rule numbers, and link to the official download. Load dictionary data only from the operator's own copy of the standard. A shipped word list holds only our own technical nouns and verbs with our own meanings, never a table that maps non-approved words to approved ones, because those pairs are dictionary content. Describe tools as STE-based, never as STE compliant or certified.

Reason: ASD reserves every reproduction of the standard "in whole or in part", and certifies no tool. See the ASD-STE100 research on `research/asd-ste100`.

## ISO standard text stays outside agent reads

Applies when: an agent researches or checks work against an ISO standard, for example ISO 24495-1.

Guidance: Work from the ISO catalogue page, the bodies that drafted the standard, and other public secondary sources. Cite the standard by number and title, and paraphrase its principles in our own words. Before an agent reads ISO preview pages or a purchased copy, get the operator's confirmation that the licence allows AI use.

Reason: The ISO Online Browsing Platform terms (2026-09-18) forbid AI ingestion, restatement, or summary of ISO content, and ISO copyright covers every part of a standard. See the ISO 24495-1 research on `research/iso-24495-1`.

## Skills and Rules target Codex, OpenCode, and Claude Code

Applies when: writing or changing a Skill or Rule, or deciding which agent platforms it supports.

Guidance: Make each Skill and Rule work on Codex, OpenCode, and Claude Code. Use only `name` and `description` frontmatter for behaviour, and point to other files with a plain sentence, not `@path`. Leave other platforms, for example Copilot and Cursor, for a later effort.

Reason: The operator supports these three platforms for now and plans to add others later. See "Which jobs does the agent-instructions skill do?" (#6). Only Claude Code reads other frontmatter fields or expands `@path`. See the agent platform research on `research/agent-platforms`.

## A SKILL.md stays at 20,000 bytes or less

Applies when: writing or changing a `SKILL.md`, or changing the Skill size check in `scripts/check.sh`.

Guidance: Keep each `SKILL.md` at 20,000 bytes or less, about 5,000 tokens. Move detail into reference files, because reference files have no limit. The check fails over 20,000 bytes. It does not count lines.

Reason: After compaction, Claude Code keeps only the first 5,000 tokens of a Skill, so it loses the end of a longer file. Codex shell output has a limit of about 10,000 tokens. When Codex reads a longer `SKILL.md` with a shell command, it removes the middle of the file. OpenCode has no limit. No platform refuses to load a long file. See "Review findings: agent-instructions SKILL.md (round 1)" (#28).

## Test files live under tests/, outside the Skill folder

Applies when: adding test files, eval requests, or sample files for a Skill or Rule.

Guidance: Put them under `tests/` with a path that copies the repo layout: `tests/skills/<category>/<name>/` for a Skill and `tests/rules/<category>/<name>/` for a Rule. Keep the Skill folder for files the Skill reads at run time.

Reason: The skills CLI installs the full Skill folder, so test files inside it go to every user. See "Which test prompts and pass criteria go in the skill's eval plan?" (#16).

## Eval runs stay at 5 at a time

Applies when: running output tests, load tests, or grader subagents for a Skill or Rule.

Guidance: Run a maximum of 5 runs or subagents at the same time. Ask the operator before you run more. Start a fresh grader subagent for each run. Check progress directly. Do not use sleep or delayed retries to wait for a usage limit.

Reason: More runs at the same time hit the operator's usage limit. A run that hits the limit stops early, and its result does not count.

## Fix failed eval topics before the full matrix

Applies when: output tests for a Skill or Rule fail.

Guidance: Run only the failed topics until every statement for those topics passes. Then run the full matrix again.

Reason: The operator wants agents to fix failures before they repeat tests that passed. The full matrix then checks the other topics.

## One check per message makes agents work in sequence

Applies when: an Agent instruction tells the agent to do several checks or tasks itself, one after the other, without subagents.

Guidance: Tell the agent to save each result with one tool call, sent alone in a new message. Keep the results in files, not in long message text.

Reason: In test 10 of the agent-instructions Skill (#17), Opus 5.5 put 3 checks in one tool call when a rule only asked for a separate file per check. It almost never sent a required long report as message text in the middle of a run. The rule "one tool call alone in a new message" passed 2 of 2 runs.
