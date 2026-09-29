#!/usr/bin/env bash
# Repo checks. Run locally and in CI.
set -euo pipefail
cd "$(dirname "$0")/.."

fail=0
err() { echo "error: $*" >&2; fail=1; }
warn() { echo "warning: $*" >&2; }
field() { sed -n '2,/^---$/p' "$1" | sed -n "s/^$2: *//p" | head -n1; }

# Category folders hold skills, they are not skills themselves.
while read -r f; do err "$f: category folders must not contain SKILL.md"; done \
  < <(find skills -mindepth 2 -maxdepth 2 -name SKILL.md)

# Skill frontmatter (agentskills.io spec) and size.
names=()
while read -r f; do
  dir=$(basename "$(dirname "$f")")
  name=$(field "$f" name)
  desc=$(field "$f" description)
  [ "$name" = "$dir" ] || err "$f: name '$name' does not match folder '$dir'"
  [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ && ${#name} -le 64 ]] || err "$f: invalid name '$name'"
  [[ -n "$desc" && ${#desc} -le 1024 ]] || err "$f: description must be 1-1024 characters"
  [ "$(wc -l < "$f")" -le 500 ] || warn "$f: over 500 lines, move detail into references/"
  names+=("$name")
done < <(find skills -mindepth 3 -maxdepth 3 -name SKILL.md | sort)

dupes=$(printf '%s\n' "${names[@]}" | sort | uniq -d)
[ -z "$dupes" ] || err "duplicate skill names: $dupes"

# Rules load into every session, so keep each one small.
while read -r f; do
  size=$(wc -c < "$f")
  if [ "$size" -gt 3072 ]; then err "$f: $size bytes (max 3072)"
  elif [ "$size" -gt 2048 ]; then warn "$f: $size bytes (aim for 2048)"; fi
done < <(find rules -name '*.md')

if command -v typos >/dev/null; then typos || fail=1; else warn "typos not installed, skipping spell check"; fi
if command -v shellcheck >/dev/null; then
  find . -name '*.sh' -not -path './.git/*' -exec shellcheck {} + || fail=1
else
  warn "shellcheck not installed, skipping script lint"
fi

exit "$fail"
