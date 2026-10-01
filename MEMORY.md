# Memory

## Knowledge edits ride on their feature branch

Applies when: planning or building a feature produces an edit to `CONTEXT.md` or `MEMORY.md`.

Guidance: Commit the edit on that feature's `feature/<name>` branch, so it merges into `develop` in the same pull request as the feature.

Reason: A term or lesson only matters once its feature lands, and the operator wants the glossary and the feature to change together.

## ASD-STE100 content stays outside the repo

Applies when: an Agent instruction, script, or test needs ASD-STE100 rules or dictionary entries.

Guidance: Paraphrase the rules in our own words, cite rule numbers, and link to the official download. Load dictionary data only from the operator's own copy of the standard. Describe tools as STE-based, never as STE compliant or certified.

Reason: ASD reserves every reproduction of the standard "in whole or in part", and certifies no tool. See the ASD-STE100 research on `research/asd-ste100`.

## ISO standard text stays outside agent reads

Applies when: an agent researches or checks work against an ISO standard, for example ISO 24495-1.

Guidance: Work from the ISO catalogue page, the bodies that drafted the standard, and other public secondary sources. Cite the standard by number and title, and paraphrase its principles in our own words. Before an agent reads ISO preview pages or a purchased copy, get the operator's confirmation that the licence allows AI use.

Reason: The ISO Online Browsing Platform terms (2026-09-18) forbid AI ingestion, restatement, or summary of ISO content, and ISO copyright covers every part of a standard. See the ISO 24495-1 research on `research/iso-24495-1`.

## Skills and Rules target Codex, OpenCode, and Claude Code

Applies when: writing or changing a Skill or Rule, or deciding which agent platforms it supports.

Guidance: Make each Skill and Rule work on Codex, OpenCode, and Claude Code. Leave other platforms, for example Copilot and Cursor, for a later effort.

Reason: The operator supports these three platforms for now and plans to add others later. See "Which jobs does the agent-instructions skill do?" (#6).
