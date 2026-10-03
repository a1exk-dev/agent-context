# Agent rules for shop-api

## Project

This repository is the shop-api service. It serves the HTTP API for the web shop and the mobile app, and it talks to the payment provider and the stock database. The code is TypeScript in strict mode, and we use pnpm for packages, so commands like installs and scripts go through pnpm. Most of the business logic lives in `src/`, the API routes live in `src/routes/`, and shared types live in `src/types/`. The service runs on Node 22 in production. Prices are integers in cents everywhere.

## Before a commit

- Run `make test`. Fix each failure before you commit.

## Branches

- Create each feature branch from `develop` with the name `feature/<name>`.
- Merge into `main` only through a pull request.
