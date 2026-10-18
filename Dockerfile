FROM oven/bun:1.4.3
# Install as the image's bun user (UID 1000), so the default host user can
# write tool caches under node_modules.
WORKDIR /repo
RUN chown bun:bun /repo
USER bun
COPY --chown=bun:bun package.json bun.lock ./
RUN bun install --frozen-lockfile
