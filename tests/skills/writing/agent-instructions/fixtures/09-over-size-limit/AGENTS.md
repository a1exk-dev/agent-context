# Agent rules for shop-api

## Before a commit

- Run `make test`. Fix each failure before you commit.
- Use pnpm to install and run packages. Do not use npm or yarn.

## Branches

- Create each feature branch from `develop` with the name `feature/<name>`.
- Merge into `main` only through a pull request.

## Code changes

Before you change code in `src/`, read `docs/agents/style.md`.

## Tests

- Put each unit test next to its source file, with the suffix `.test.ts`.
- Put each API test in `tests/api/`.
- Create the test data inside each test.
- Do not call the real payment provider from a test. Use the payment sandbox.
- Run one test file with `pnpm vitest run <path>`.
- When a test fails only in CI, run it with `CI=1 make test`.

## API conventions

- Put each route in `src/routes/<resource>.ts`.
- Use plural nouns in route paths, for example `/orders`.
- Return JSON for each response, also for errors.
- Use the error shape `{ "error": { "code": "<code>", "message": "<text>" } }`.
- Use HTTP 400 for a bad request, 404 for a missing resource, and 409 for a conflict.
- Use HTTP 422 when the request is valid JSON but fails validation.
- Validate each request body with a zod schema in `src/schemas/`.
- Do not return stack traces in a response.
- Return prices as integers in cents, with the field name suffix `Cents`.
- Return dates as ISO 8601 strings in UTC.
- Paginate each list endpoint with `limit` and `cursor`.
- The maximum `limit` is 100.
- Add each new route to `docs/api.md` in the same pull request.
- Version breaking changes under a new path prefix, for example `/v2/`.
- Do not remove a field from a response without a deprecation period of 90 days.
- Mark a deprecated field in `docs/api.md` with its removal date.
- Rate limit each public route with the shared middleware in `src/middleware/rate-limit.ts`.
- Log each request with its request ID.
- Read the request ID from the `X-Request-Id` header, or create one.

## Logging

- Use the logger in `src/log.ts`. Do not use `console.log`.
- Log at `info` for normal events, `warn` for recoverable problems, and `error` for failures.
- Put structured fields in the log call, not in the message text.
- Do not log personal data: names, emails, addresses, or card data.
- Log the Customer ID, not the Customer email.
- Log each payment provider call with its duration.
- Do not log full request bodies.
- Add a metric for each new background job: runs, failures, and duration.

## Background jobs

- Put each background job in `src/jobs/<name>.ts`.
- Make each job safe to run twice.
- Give each job a timeout.
- Register each job in `src/jobs/index.ts`.
- Run a job locally with `pnpm job <name>`.
- Do not start a job from a request handler. Put a message on the queue.
- Retry a failed job a maximum of 5 times, with backoff.
- Send a job that fails 5 times to the dead-letter queue.
- Look at the dead-letter queue dashboard after each deploy that changes a job.
## Deploy

Do the steps in this section only when the user asks for a deploy.

### Deploy to staging

1. Make sure that the `develop` branch has no failed CI run.
2. Pull the latest commits.
3. Run `make test`.
4. Run `pnpm build`.
5. Read `CHANGELOG.md` and find the version to deploy.
6. Send a message to `#deploy-staging` with the version and your name.
7. Run `pnpm db:migrate:status` and read the list of pending migrations.
8. If there are pending migrations, read each migration file.
9. If a migration deletes a column, stop and ask the user.
10. Run `pnpm deploy --env staging --dry-run`.
11. Read the dry-run output and compare it with the changelog.
12. Run `pnpm deploy --env staging`.
13. Wait for the deploy job to finish.
14. Open `https://staging.shop-api.internal/health` and make sure that the status is `ok`.
15. Open `https://staging.shop-api.internal/version` and make sure that the version is correct.
16. Run `pnpm smoke --env staging`.
17. Read the smoke test report.
18. If a smoke test fails, go to the rollback steps.
19. Open the error dashboard and look at the error rate for 15 minutes.
20. If the error rate is more than 1 percent, go to the rollback steps.
21. Open the latency dashboard and look at the p95 latency.
22. If the p95 latency is more than 400 ms, tell the user.
23. Send a message to `#deploy-staging` that the deploy is complete.
24. Add the deploy time to the release issue.

### Deploy to production

1. Make sure that the `main` branch has no failed CI run.
2. Pull the latest commits.
3. Run `make test`.
4. Run `pnpm build`.
5. Read `CHANGELOG.md` and find the version to deploy.
6. Send a message to `#deploy-prod` with the version and your name.
7. Run `pnpm db:migrate:status` and read the list of pending migrations.
8. If there are pending migrations, read each migration file.
9. If a migration deletes a column, stop and ask the user.
10. Run `pnpm deploy --env production --dry-run`.
11. Read the dry-run output and compare it with the changelog.
12. Run `pnpm deploy --env production`.
13. Wait for the deploy job to finish.
14. Open `https://shop-api.example.com/health` and make sure that the status is `ok`.
15. Open `https://shop-api.example.com/version` and make sure that the version is correct.
16. Run `pnpm smoke --env production`.
17. Read the smoke test report.
18. If a smoke test fails, go to the rollback steps.
19. Open the error dashboard and look at the error rate for 15 minutes.
20. If the error rate is more than 1 percent, go to the rollback steps.
21. Open the latency dashboard and look at the p95 latency.
22. If the p95 latency is more than 400 ms, tell the user.
23. Send a message to `#deploy-prod` that the deploy is complete.
24. Add the deploy time to the release issue.

### Deploy for the mobile app

- The mobile app reads the API from production. Old app versions stay in use for months.
- Before a deploy that changes a response, check the minimum app version in `src/compat.ts`.
- Do not remove a field that an app version above the minimum reads.
- If you are not sure which app versions read a field, ask the user.
- After the deploy, open the mobile error dashboard and look at the crash rate for 30 minutes.
- If the crash rate goes up, go to the rollback steps.
- Tell the mobile team in `#mobile` about each deploy that changes a response.

### Cache after a deploy

- A deploy does not clear the cache.
- If the deploy changes the shape of a cached object, change its cache key prefix.
- The cache key prefixes are in `src/cache/keys.ts`.
- Do not clear the full cache in production. Ask the user.
- Product prices are cached for 5 minutes.
- Stock counts are not cached.
### Database migrations

- Write each migration as a new file in `migrations/`. Do not edit a migration that ran in production.
- Name each migration file `<timestamp>-<name>.sql`.
- Add a down migration for each up migration.
- Run `pnpm db:migrate` on your local database before you commit a migration.
- Run `pnpm db:rollback` and then `pnpm db:migrate` again to test the down migration.
- Do not add a column with a default value to the `orders` table in one step. The table is large.
- Add the column with no default, then fill it in batches, then add the default.
- Do not rename a column in one deploy. Add the new column, copy the data, and remove the old column in a later deploy.
- Do not delete a column until no deployed code reads it.
- Put each index change in its own migration.
- Create indexes with `CONCURRENTLY`.
- Tell the user before a migration that locks a table for more than 1 second.

### Feature flags

- Put each new feature behind a feature flag.
- Name each flag `<team>.<feature>`, for example `checkout.express-pay`.
- Add each flag to `src/flags.ts` with its owner and its removal date.
- Turn on a flag in staging first.
- Turn on a flag in production for 5 percent of traffic, then 25 percent, then 100 percent.
- Wait one day between the steps.
- Remove a flag and its old code path within 30 days after 100 percent.
- Do not put a flag check inside a database transaction.
- Do not read flags in migrations.

### Monitoring after a deploy

- The error dashboard is in Grafana under `shop-api / errors`.
- The latency dashboard is in Grafana under `shop-api / latency`.
- The payment dashboard is in Grafana under `shop-api / payments`.
- After each production deploy, look at all three dashboards for 15 minutes.
- Compare each graph with the same hour on the previous day.
- A drop of more than 10 percent in payments is an incident. Tell the user.
- A rise of more than 20 percent in 5xx responses is an incident. Tell the user.
- Write the result of the check in the release issue.
- If a dashboard does not load, ask the user. Do not skip the check.
- Alerts go to `#alerts-shop-api`. Read that channel after each deploy.
- Do not mute an alert during a deploy.
### Rollback

1. Send a message to the deploy channel that you start a rollback.
2. Run `pnpm deploy --env <env> --rollback`.
3. Wait for the rollback job to finish.
4. Open the health URL and make sure that the status is `ok`.
5. Open the version URL and make sure that the previous version is live.
6. If the deploy ran a migration, do not roll back the migration. Ask the user.
7. Look at the error dashboard for 15 minutes.
8. Write a short report in the release issue: the version, the time, and the reason.
9. Make a bugfix branch for the problem.
10. Tell the user that the rollback is complete.

### Deploy secrets

- The deploy reads secrets from the secret manager. Do not put secrets in `.env` files in the repository.
- To add a secret, ask the user. Only the user can write to the secret manager.
- Do not print secrets in logs or in CI output.
- Rotate the payment provider key every 90 days. The user does the rotation.
- If you find a secret in the repository, stop and tell the user.

### Deploy windows

- Deploy to production only from Monday to Thursday, between 09:00 and 16:00 UTC.
- Do not deploy to production on a public holiday in Germany or the United States.
- Do not deploy to production during a sale event. The sale calendar is in the release issue.
- Staging deploys have no time limits.
- A hotfix can go to production at any time, but only when the user says yes.

### Release versions

- The version is in `package.json`.
- Use semantic versioning.
- Bump the minor version for a new feature and the patch version for a fix.
- Bump the major version only when the user says so.
- Write each change in `CHANGELOG.md` under the new version.
- Tag each release as `v<version>`.
- Do not reuse a tag.
- Deploy only tagged versions to production.
- Staging can run any commit of `develop`.
- Write the release notes for the mobile team in the release issue.
- The release issue has the label `release`.
## Security

- Check each request for an authenticated user, except the routes in `src/routes/public.ts`.
- Check that the user owns the resource before you return it.
- Use parameterized queries. Do not build SQL with string concatenation.
- Escape each value that goes into an email template.
- Do not add a new public route without the user's approval.
- Do not turn off CSRF protection.
- Do not commit a file that contains a secret, a key, or a token.
- Report each security problem that you find to the user, also outside your task.
- Do not write a security problem in a public issue.
## Incidents

- When the user reports an incident, read the error dashboard first.
- Find the first error in the logs and the deploy before it.
- If the incident started after a deploy, propose a rollback to the user.
- Write each finding in the incident issue, with the time in UTC.
- Do not change production data during an incident without the user's approval.
- After the incident, write a short summary: the cause, the impact, and the fix.
- Add a test that would catch the cause, when that is possible.

## Dependencies

- Add a dependency only when the standard library or an existing dependency cannot do the job.
- Run `pnpm add <package>` to add a dependency.
- Pin each dependency to an exact version.
- Run `pnpm audit` after each dependency change.
- Do not add a dependency with a copyleft license. Ask the user first.
- Update dependencies only in a separate pull request.

## Pull requests

- Write the pull request title in the Conventional Commits form.
- Link the issue in the pull request description.
- Add a short test plan to the description.
- Keep each pull request under 400 changed lines when possible.
- Ask for a review from the code owner of each changed folder.
- Do not merge your own pull request.
