FROM oven/bun:1.4.3
WORKDIR /repo
COPY package.json bun.lock ./
# Compose runs as the host user, which can have any UID. Let every user write
# tool caches under node_modules.
RUN bun install --frozen-lockfile && chmod -R a+rwX node_modules
