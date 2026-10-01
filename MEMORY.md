# Memory

## Knowledge edits ride on their feature branch

Applies when: planning or building a feature produces an edit to `CONTEXT.md` or `MEMORY.md`.

Guidance: Commit the edit on that feature's `feature/<name>` branch, so it merges into `develop` in the same pull request as the feature.

Reason: A term or lesson only matters once its feature lands, and the operator wants the glossary and the feature to change together.

## ASD-STE100 content stays outside the repo

Applies when: an Agent instruction, script, or test needs ASD-STE100 rules or dictionary entries.

Guidance: Paraphrase the rules in our own words, cite rule numbers, and link to the official download. Load dictionary data only from the operator's own copy of the standard. Describe tools as STE-based, never as STE compliant or certified.

Reason: ASD reserves every reproduction of the standard "in whole or in part", and certifies no tool. See the ASD-STE100 research on `research/asd-ste100`.
