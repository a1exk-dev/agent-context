# Memory

## Knowledge edits ride on their feature branch

Applies when: planning or building a feature produces an edit to `CONTEXT.md` or `MEMORY.md`.

Guidance: Commit the edit on that feature's `feature/<name>` branch, so it merges into `develop` in the same pull request as the feature.

Reason: A term or lesson only matters once its feature lands, and the operator wants the glossary and the feature to change together.
