# Research: what the Agent Skills specification requires of a skill

Question (issue #3): What do <https://agentskills.io/home> and its linked specification pages require and recommend for a skill? Cover folder structure, `SKILL.md` frontmatter and limits, naming, body size, progressive disclosure, `scripts/`/`references/`/`assets/`, validation tooling, and authoring best practices. Separate hard requirements from recommendations.

Sources, read on 2026-10-01:

- Overview: <https://agentskills.io/home>
- Specification: <https://agentskills.io/specification>
- Best practices: <https://agentskills.io/skill-creation/best-practices>
- Optimizing descriptions: <https://agentskills.io/skill-creation/optimizing-descriptions>
- Evaluating skills: <https://agentskills.io/skill-creation/evaluating-skills>
- Using scripts: <https://agentskills.io/skill-creation/using-scripts>
- Quickstart: <https://agentskills.io/skill-creation/quickstart>
- Client implementation guide: <https://agentskills.io/client-implementation/adding-skills-support>
- Reference validator `skills-ref` v0.1.0: <https://github.com/agentskills/agentskills/tree/main/skills-ref>, commit `69ef37e` (2026-08-09). The site pages are generated from `docs/` in the same repository.

Legend: **MUST** is a hard requirement (the specification says "must" or "required", or `skills-ref validate` fails). **SHOULD** is a recommendation.

## 1. Folder structure

| Level | Item | Source |
| - | - | - |
| MUST | A skill is a directory that contains, at minimum, a file named `SKILL.md`. | [Specification, Directory structure](https://agentskills.io/specification#directory-structure) |
| MUST | The directory name equals the `name` field. | [Specification, `name` field](https://agentskills.io/specification#name-field) |
| MAY | Any other files and directories. `scripts/`, `references/`, `assets/` are conventions, not requirements. | [Specification, Optional directories](https://agentskills.io/specification#optional-directories) |
| Note | The specification does not define where skill directories live. `.agents/skills/` is a cross-client convention for clients to scan. | [Client guide, Where to scan](https://agentskills.io/client-implementation/adding-skills-support#where-to-scan) |
| Note | `skills-ref` also accepts a lowercase `skill.md`, but prefers `SKILL.md`. | `skills-ref/src/skills_ref/parser.py`, `find_skill_md` |

## 2. `SKILL.md` format and frontmatter

MUST: `SKILL.md` starts with YAML frontmatter between `---` lines, followed by Markdown content ([Specification, `SKILL.md` format](https://agentskills.io/specification#skill-md-format)). `skills-ref` fails when the file does not start with `---`, when the closing `---` is missing, or when the YAML is not a mapping (`parser.py`, `parse_frontmatter`).

### Fields

| Field | Required | Hard limits | Recommendations |
| - | - | - | - |
| `name` | Yes | 1-64 characters. Lowercase letters, digits, hyphens. No leading or trailing hyphen. No `--`. Equals the parent directory name. | None |
| `description` | Yes | 1-1024 characters, non-empty | Say what the skill does and when to use it. Include keywords that help agents match tasks. |
| `license` | No | None | Keep short: a license name or the name of a bundled license file. |
| `compatibility` | No | 1-500 characters if present | Include only for real environment needs (product, system packages, network). "Most skills do not need" it. |
| `metadata` | No | Map of string keys to string values | Use reasonably unique key names. Clients store extra properties here. |
| `allowed-tools` | No | Space-separated string of pre-approved tools | Experimental. Support varies by client. |

Source: [Specification, Frontmatter](https://agentskills.io/specification#frontmatter).

### Validator behavior that goes beyond the specification text

These checks come from `skills-ref/src/skills_ref/validator.py` and were confirmed by running `skills-ref validate` on test skills.

- **Unknown fields fail.** `ALLOWED_FIELDS` is exactly `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`. A client-specific field such as Claude Code's `disable-model-invocation` produces `Unexpected fields in frontmatter` and exit code 1. A strictly conforming skill therefore puts client-specific settings under `metadata` or leaves them out.
- **YAML is parsed with `strictyaml`.** An unquoted value that contains `: ` fails. Example: `description: Use this skill when: the user asks` gives `mapping values are not allowed here`. Quote the value or use a block scalar (`description: >`). A folded block scalar passes. The client guide names this the most common malformed-YAML issue ([Client guide, Handling malformed YAML](https://agentskills.io/client-implementation/adding-skills-support#handling-malformed-yaml)).
- **Name character set.** The specification text says `a-z` and `0-9`, but also says "unicode lowercase alphanumeric". The validator applies NFKC normalization and accepts any lowercase Unicode letter or digit (`str.isalnum`). ASCII `a-z0-9-` satisfies both.
- **Not checked by `skills-ref`:** body length, line count, token count, reference depth, `license` content, `metadata` value types beyond string coercion, and `allowed-tools` syntax.

### Client leniency

The client guide tells clients to warn but still load a skill whose name does not match its directory or exceeds 64 characters. Clients skip a skill only when `description` is missing or empty, or when the YAML cannot be parsed ([Client guide, Lenient validation](https://agentskills.io/client-implementation/adding-skills-support#lenient-validation)). The guide states that the specification itself stays strict. Leniency is a client choice, not permission for authors.

## 3. Naming

| Level | Item | Source |
| - | - | - |
| MUST | Rules in section 2 (`name` row). Valid: `pdf-processing`. Invalid: `PDF-Processing`, `-pdf`, `pdf--processing`. | [Specification, `name` field](https://agentskills.io/specification#name-field) |
| Note | When two skills share a `name`, clients apply precedence: project-level overrides user-level. Unique names avoid shadowing. | [Client guide, Handling name collisions](https://agentskills.io/client-implementation/adding-skills-support#handling-name-collisions) |

## 4. Body content and size

| Level | Item | Source |
| - | - | - |
| MUST | None. "There are no format restrictions." | [Specification, Body content](https://agentskills.io/specification#body-content) |
| SHOULD | Include step-by-step instructions, input and output examples, and common edge cases. | Same |
| SHOULD | Keep the `SKILL.md` body under 5000 tokens. | [Specification, Progressive disclosure](https://agentskills.io/specification#progressive-disclosure) |
| SHOULD | Keep `SKILL.md` under 500 lines. Move detailed reference material into separate files. | Same |
| Note | The agent loads the whole `SKILL.md` when the skill activates. | [Specification, Body content](https://agentskills.io/specification#body-content) |

## 5. Progressive disclosure

Three tiers ([Specification, Progressive disclosure](https://agentskills.io/specification#progressive-disclosure); [Overview](https://agentskills.io/home)):

1. Metadata: `name` and `description` load at startup for every installed skill, about 100 tokens per skill (the client guide says 50-100).
2. Instructions: the full `SKILL.md` body loads when the skill activates. Recommended size is under 5000 tokens.
3. Resources: files in `scripts/`, `references/`, `assets/` load only when needed.

Consequences for authors:

- The `description` "carries the entire burden of triggering" ([Optimizing descriptions, How skill triggering works](https://agentskills.io/skill-creation/optimizing-descriptions#how-skill-triggering-works)).
- Tell the agent *when* to load each reference file. "Read `references/api-errors.md` if the API returns a non-200 status code" beats "see references/ for details" ([Best practices, Structure large skills](https://agentskills.io/skill-creation/best-practices#structure-large-skills-with-progressive-disclosure)).
- Agents may not consult a skill for simple one-step tasks they can do alone, even when the description matches ([Optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions#how-skill-triggering-works)).

## 6. `scripts/`, `references/`, `assets/`, and file references

All of this section is recommendation. The specification calls these directories conventions ([Specification, Optional directories](https://agentskills.io/specification#optional-directories)).

- `scripts/`: executable code. Make scripts self-contained or document their dependencies. Give helpful error messages. Handle edge cases. Supported languages depend on the client (Python, Bash, and JavaScript are common).
- `references/`: documentation the agent reads on demand, for example `REFERENCE.md`, `FORMS.md`, or domain files. Keep each file focused, because smaller files use less context.
- `assets/`: static resources such as templates, images, and data files.
- File references: use relative paths from the skill root. Keep references one level deep from `SKILL.md` and avoid deep reference chains ([Specification, File references](https://agentskills.io/specification#file-references)).
- Commands inside `references/*.md` also resolve relative to the skill root, because the agent runs commands from there ([Using scripts](https://agentskills.io/skill-creation/using-scripts#referencing-scripts-from-skill-md)).

Script design ([Using scripts](https://agentskills.io/skill-creation/using-scripts#designing-scripts-for-agentic-use)):

- Hard constraint of the execution environment: no interactive prompts. Agents run in non-interactive shells, and a prompt hangs the script.
- Recommended: document usage in `--help`; write error messages that say what went wrong and what to try; print structured output (JSON, CSV) on stdout and diagnostics on stderr; make operations idempotent; offer `--dry-run` for destructive operations; use distinct, documented exit codes; keep output size predictable, because harnesses truncate long output (about 10-30K characters).
- Recommended: pin versions in one-off commands (`npx eslint@9.0.0`), declare dependencies inline (PEP 723, Deno `npm:` imports, Bun, `bundler/inline`), and list the bundled scripts in `SKILL.md`. State prerequisites in `SKILL.md` or in `compatibility`.

## 7. Validation tooling

- `skills-ref validate <dir>` checks frontmatter validity and naming ([Specification, Validation](https://agentskills.io/specification#validation)). It also offers `read-properties` (JSON) and `to-prompt` (an `<available_skills>` XML catalog).
- The `skills-ref` README marks it "for demonstration purposes only. It is not meant to be used in production." The README installs it from the repository (`pip install -e .` or `uv sync` in `skills-ref/`). A `skills-ref` package also exists on PyPI (<https://pypi.org/project/skills-ref/>, latest 0.1.1), while the repository `pyproject.toml` says 0.1.0. The findings above come from the repository source.
- The specification has no version number.

## 8. Authoring best practices (all recommendations)

Content ([Best practices](https://agentskills.io/skill-creation/best-practices)):

- Start from real expertise: extract the skill from a real task or from project artifacts (runbooks, review comments, fixes), not from generic LLM knowledge.
- Refine with real execution, and read execution traces, not only final outputs.
- Add what the agent lacks and omit what it knows. For each line, ask "Would the agent get this wrong without this instruction?" If not, cut it.
- Scope each skill as one coherent unit, like a well-designed function.
- Aim for moderate detail. Concise stepwise guidance with a working example beats exhaustive documentation.
- Match specificity to fragility: give freedom and explain *why* where many approaches work; be prescriptive where operations are fragile or order matters.
- Provide a default, not a menu of equal options.
- Teach a procedure for a class of problems, not the answer for one instance.
- Useful patterns: a "Gotchas" section kept in `SKILL.md`, output templates (long ones in `assets/`), checklists for multi-step work, validation loops, plan-validate-execute, and bundled scripts for logic the agent keeps reinventing.

Description ([Optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions#writing-effective-descriptions)):

- Use imperative phrasing: "Use this skill when..." rather than "This skill does...".
- Describe user intent, not implementation.
- Be "pushy": list contexts where the skill applies, including ones where the user does not name the domain.
- Keep it to a few sentences or a short paragraph, and inside 1024 characters, because descriptions grow during optimization.
- Test triggering with about 20 labeled queries (8-10 should trigger, 8-10 should not, with near-miss negatives), 3 runs each, a 0.5 trigger-rate threshold, and a 60/40 train/validation split. About five iterations usually suffice. Pick the iteration with the best validation pass rate.

Evaluation ([Evaluating skills](https://agentskills.io/skill-creation/evaluating-skills)):

- Store test cases in `evals/evals.json` inside the skill directory (`prompt`, `expected_output`, optional `files`). Start with 2-3 cases.
- Run each case with and without the skill (or against the previous version) in a clean context. Record tokens and duration, add assertions after the first run, grade, aggregate, review with a human, and iterate.

## 9. Gotchas for this repository

- `scripts/check.sh` only finds skills at `skills/<category>/<name>/SKILL.md` (depth 3), and it reports an error for any `SKILL.md` at depth 2 ("category folders must not contain SKILL.md"). The map's planned location `skills/agent-instructions/SKILL.md` fails this check until the script changes or the skill gets a Category.
- `scripts/check.sh` reads `description` as a single line. A block scalar (`description: >`) yields the one character `>`, so the length check passes without measuring the real text. It also does not reject unknown frontmatter fields or check `compatibility` length. `skills-ref validate` covers those gaps.
