---
name: setup-ci
description: Sets up continuous integration for this project with a GitHub Actions workflow. Use when the user asks to set up CI.
---

# Set up CI

1. Find out these values from the user:
   - The branches that start a CI run.
   - The Bun version of the CI run.
   - Whether the CI run also checks the format.
2. Ask the whole round in one message, numbered, with your recommended answer.
3. Write `.github/workflows/ci.yml` with the answers. The workflow installs the dependencies with `bun install` and runs `bun test`.
