# Research: context budget of one reviewer for all files of a review round

<!-- cspell:ignore AUTOCOMPACT -->

Question (issue #199, map #198): Can one reviewer subagent examine all files of a review round on Claude Code, Codex, and OpenCode, or does a round need a file cap for each reviewer? Find the token size of the rule files of each reviewer class, of the files under review (the 14 files of PR #143 as the upper case), and of a per-file report. Find the context-window and output limits of a subagent on each platform. Give the largest file count or byte count that fits with a safety margin, and any evidence that report quality drops with more files.

Use: issue #144 wants one reviewer of each class for all files of a round, instead of 3 reviewers for each file (`skills/writing/agent-instructions/references/review.md`, "When you start the reviewers"). Issue #200 designs that change.

Sources, read on 2026-11-08:

- Repo: `review.md` and the reference files at the PR #143 merge commit `7f041df`. Byte counts with `wc -c`.
- Run records: the Claude Code session of the PR #143 self-check (`~/.claude/projects/-home-a1exk-Projects-agent-context/395893b2-…/subagents/*.jsonl`, 193 subagents, all `claude-opus-5-5`). Token counts come from the API `usage` field of each request. These records are local to the Operator's machine, and the repo does not keep them.
- Claude Code docs (Markdown from code.claude.com): [Subagents](https://code.claude.com/docs/en/sub-agents), [Tools reference](https://code.claude.com/docs/en/tools-reference), [Environment variables](https://code.claude.com/docs/en/env-vars), [Model configuration](https://code.claude.com/docs/en/model-config), [Context window](https://code.claude.com/docs/en/context-window). Installed version: 2.1.312.
- Claude API docs: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows).
- Codex source: [openai/codex](https://github.com/openai/codex) at `748ab55` (2026-11-08), paths under `codex-rs/`. Installed version: codex-cli 0.166.0.
- OpenCode source: [sst/opencode](https://github.com/sst/opencode) at `caf8d6a` (2026-11-08, `packages/core` 2.2.5), paths under `packages/core/src/`. Installed version: 2.2.2.
- Quality evidence: [Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents); [Chroma, Context Rot](https://www.trychroma.com/research/context-rot) (technical report, 2025-07-14); [Liu et al., Lost in the Middle](https://arxiv.org/abs/2307.03172) (Transactions of the ACL).
- Earlier research, not repeated here: `docs/research/subagents.md` on `research/subagents` (#14) and `docs/research/parallel-subagents.md` on `research/parallel-subagents` (#94). `research/agent-platforms` (#12) has no subagent limits.

The main result: input fits, output does not. On Claude Code with Opus 5.5 (1M window), one reviewer could read all 14 files of PR #143, but on Codex (272K window) and on any 200K model, it could not. On all three platforms, one report for 14 files is too long to return safely: about 50K tokens at the median, and more than 100K tokens in the worst case. A cap is needed. The recommendation is a maximum of 3 files and 64 KB of files under review for each reviewer.

## Token ratio

The issue asks for bytes/4. The Claude API docs say the current tokenizer (since Claude Opus 4.7) fits "roughly ... 2.5M Unicode characters" in 1M tokens ([Models overview](https://platform.claude.com/docs/en/about-claude/models/overview), "Context window" note). The run records agree: a loading reviewer of `MEMORY.md` grew from 32.2K to 51.6K tokens after it read 53.2 KB of files, which is about 2.7 bytes per token, thinking included. So bytes/4 underestimates Claude tokens by about 1.6 times. The tables give both. Codex counts its own limits at 4 bytes per token (`utils/string/src/truncate.rs:6`, `APPROX_BYTES_PER_TOKEN = 4`).

## 1. Sizes

### Rule files of each reviewer class

From the reviewer table in `review.md` (PR #143 merge commit). The glossary is this repo's `GLOSSARY.md` (3,246 bytes). The check-script JSON file and, for the ISO reviewer, the pointer targets add more, and their size depends on the files under review.

| Reviewer | Files | Bytes | Tokens (bytes/4) | Tokens (bytes/2.5) |
|---|---|---|---|---|
| Loading | `review.md` 33,263 + `loading-rules.md` 10,809 (+ `agent-skills-spec.md` 5,313 for a Skill) | 44,072 (49,385) | 11.0K (12.3K) | 17.6K (19.8K) |
| ASD-STE100 | `review.md` + `ste-rules.md` 9,654 + `technical-terms.md` 9,623 + glossary | 55,786 | 13.9K | 22.3K |
| ISO 24495-1 | `review.md` + `plain-language-checks.md` 6,742 + glossary, + pointer targets | 43,251 + targets | 10.8K + targets | 17.3K + targets |

`review.md` is 60 to 77% of each set. A one-reviewer-per-class design loads each set once per reviewer, not once per file.

### Files under review: the PR #143 upper case

Round 1 of the PR #143 self-check started 42 reviewers (#144), so 14 files. The run records show these 14 files (all Agent instructions of the PR except `end-of-run-report.md`):

| File | Bytes |
|---|---|
| `skills/writing/agent-instructions/references/review.md` | 33,263 |
| `skills/engineering/git-commit/SKILL.md` | 15,223 |
| `skills/writing/agent-instructions/SKILL.md` | 15,184 |
| `skills/writing/agent-instructions/references/loading-rules.md` | 10,809 |
| `skills/writing/agent-instructions/references/ste-rules.md` | 9,654 |
| `skills/writing/agent-instructions/references/technical-terms.md` | 9,623 |
| `MEMORY.md` | 9,134 |
| `skills/writing/agent-instructions/references/plain-language-checks.md` | 6,742 |
| `skills/writing/agent-instructions/references/agent-skills-spec.md` | 5,313 |
| `docs/agents/domain.md` | 4,333 |
| `docs/agents/issue-tracker.md` | 4,308 |
| `AGENTS.md` | 4,106 |
| `GLOSSARY.md` | 3,246 |
| `docs/agents/triage-labels.md` | 1,045 |
| Total | 131,983 (33.0K tokens at /4, 52.8K at /2.5) |

The file text is small next to the work a reviewer does on it. Thinking, tool calls, and the report cost more than reading the file (next section).

### What one reviewer uses: measured

Each request's input (`input_tokens` + `cache_read_input_tokens` + `cache_creation_input_tokens`) counts toward the window. On Opus 5.5, "the API keeps previous thinking blocks by default, and they count toward the context window" ([Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows), "The context window with thinking"). The peak is the largest request input of one subagent.

Single-file reviewers (19 per class: 14 in round 1, 5 in round 2):

| Class | Input at the first request | Peak input (min / median / max) | Report, characters (min / median / max) | Output tokens of the last message (median / max) |
|---|---|---|---|---|
| Loading | 32.4K | 51.6K / 65.0K / 98.2K | 1,448 / 2,697 / 4,671 | 1.6K / 4.5K |
| ASD-STE100 | 32.3K | 56.8K / 70.7K / 96.3K | 3,210 / 8,813 / 22,699 | 6.1K / 16.2K |
| ISO 24495-1 | 32.6K | 62.2K / 71.8K / 108.9K | 3,080 / 8,271 / 14,649 | 4.7K / 10.0K |

- About 32K tokens are present before the reviewer reads a file: the system prompt, the tool definitions, `CLAUDE.md`/`AGENTS.md`, and the prompt.
- The growth after that, minus the rule files read once, is the cost of one file: about 13K (loading), 16K (ASD-STE100), and 20K (ISO 24495-1) tokens at the median, and up to about 42K in the worst case (ASD-STE100 of `technical-terms.md`). This cost depends more on the number of findings than on the file size: `triage-labels.md` (1 KB) took the ASD-STE100 reviewer to 60.7K.

### Per-file report

The report form in `review.md` has a blocking checklist with one line for each blocking rule (loading 15 with `agent-skills-spec.md`, ASD-STE100 22, ISO 24495-1 9), and then one 4-field finding (Rule, Text, Problem, Correction) for each problem, with the full rule text. At about 250 characters for a checklist line and 500 to 800 characters for a finding, a report is 2 to 25 KB. The measured reports above agree: median 2.7 KB (loading), 8.8 KB (ASD-STE100), 8.3 KB (ISO 24495-1), at most 22.7 KB. At 2.5 bytes per token, the median ASD-STE100 report is about 3.5K tokens and the largest is about 9K tokens.

### Multi-file reviewers that the self-check ran

From round 2, the self-check gave one reviewer of each class 2 or 4 files, with a `=== File: <path> ===` line for each part. These rounds examined only changed lines.

| Class | Files | Peak input | Report characters | Parts with a checklist |
|---|---|---|---|---|
| Loading | 2 / 4 | 59.8K / 64.8K | 5,340 / 9,567 | 2 of 2 / 4 of 4 |
| ASD-STE100 | 2 / 4 | 60.6K / 79.3K | 8,300 / 18,898 | 2 of 2 / 4 of 4 |
| ISO 24495-1 | 2 / 4 | 65.5K / 73.6K | 6,923 / 10,030 | 2 of 2 / 4 of 4 |

Each multi-file report gave one part and one blocking checklist for each file. The 4-file reviewers used about 6 to 12K tokens for each extra file, because they examined only a few changed lines in each file.

## 2. Platform limits for a subagent

### Claude Code (`Agent` tool)

- Window: "a subagent's context window is sized by its own model, not the parent's" ([Subagents](https://code.claude.com/docs/en/sub-agents)). A general-purpose subagent uses the main conversation's model unless `CLAUDE_CODE_SUBAGENT_MODEL` or a `model` parameter sets a different one (same page).
- Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1 have a 1M-token window and "can generate up to 128k output tokens" in one request ([Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows), "Context window sizes by model"). Claude Code runs Opus 4.7 and later "with the 1M window by default". They "compact before the window fills, at about 967K tokens by default" ([Model configuration](https://code.claude.com/docs/en/model-config), "Extended context", "Default auto-compact thresholds").
- With `CLAUDE_CODE_DISABLE_1M_CONTEXT=1`, or a model ID that Claude Code does not know (for example an LLM gateway alias), the window is 200K (same page). Opus 4.6 and Sonnet 4.6 without `[1m]` are also 200K.
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` "Applies to both main conversations and subagents", and a subagent definition can set `autoCompactWindow` from 100,000 to 1,000,000 ([Environment variables](https://code.claude.com/docs/en/env-vars); [Subagents](https://code.claude.com/docs/en/sub-agents)). A compacted reviewer loses the exact rule text that the report form must quote word for word.
- Output: `CLAUDE_CODE_MAX_OUTPUT_TOKENS` sets "the maximum number of output tokens for most requests. Defaults and caps vary by model ... For a model ID Claude Code can't resolve to a model it knows, the default is 32000 and the cap is 128000" ([Environment variables](https://code.claude.com/docs/en/env-vars)). The docs do not give the default for Opus 5.5. Thinking tokens count in the same limit ([Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)).
- Result: "The parent doesn't see the subagent's intermediate tool calls or outputs, only that final result" ([Tools reference](https://code.claude.com/docs/en/tools-reference), "Agent tool behavior"). So the full report must be in the last message, and that one message obeys the output limit. The docs give no size limit for the result that the parent gets. The 30,000-character limit in "Output limits" is for `Bash` output. The largest single report of the self-check (22.7 KB) reached the main agent.
- File reads: the `Read` tool has a default limit of 25,000 tokens for each read (`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`, [Environment variables](https://code.claude.com/docs/en/env-vars)). `review.md` (33 KB, about 13K tokens) is below it.

### Codex (`spawn_agent`)

- Window: a subagent gets a clone of the parent's config, with the parent's model (`core/src/agent/child_config.rs:144-169`, `build_agent_shared_config`). The feature `subagent_default_context_limits`, which removes `model_context_window` and `model_auto_compact_token_limit` for a subagent, is "UnderDevelopment" and off by default (`features/src/lib.rs:1669-1674`).
- The bundled model catalog gives `context_window` 272,000 for most models, 500,000 for `gpt-6.1-terra`, and 372,000 for `gpt-daybreak-red-latest` (`models-manager/src/models.json`). The usable window is 95% of it (`effective_context_window_percent`, default 95, `protocol/src/openai_models.rs:413-415`, `:573-577`). Auto-compaction starts at 90% of the window: 244,800 tokens for a 272K model (`protocol/src/openai_models.rs:579-590`).
- Output: Codex sets no `max_output_tokens` on a model request (no use in `core/src` other than shell output). The model's own limit applies.
- Result, V1 tools (the default, `multi_agent_v2` is off by default, `features/src/lib.rs:1645-1650`): `wait_agent` returns the status of each subagent, and `AgentStatus::Completed` "Contains the final assistant message" (`protocol/src/protocol.rs:2062-2063`). Codex records each function output in the history truncated to the model's `truncation_policy` times 1.2 (`core/src/context_manager/history.rs:669-678`, `utils/output-truncation/src/lib.rs:20-22`). All catalog models have `{"mode": "tokens", "limit": 10000}`, so the parent keeps at most about 12,000 tokens, or about 48,000 bytes, of a `wait_agent` output. The completion watcher also puts a `<subagent_notification>` with the status into the parent as a user message (`core/src/agent/control.rs:534-557`). I found no size limit on that message, but the main agent can act on the cut `wait_agent` output first.
- Result, V2 tools: the completion message carries the full final message, and Codex cuts only an error to about 900 tokens (`core/src/session_prefix.rs:9-12`, `:20-42`).
- File reads: Codex reads files with the shell, and a shell output is cut at the same 10,000-token policy (`core/src/tools/events.rs:389`). `review.md` (about 8.3K tokens at 4 bytes per token) is below it. One `cat` of several files is not.

### OpenCode (`task` tool)

- Window: each model's `limit.context` and `limit.output` come from the models.dev catalog (`models-dev.ts:457`). The subagent uses its agent's model, or the parent's model.
- Output: a request asks for the catalog output limit, at most 256,000, or 32,000 when the catalog has no limit, and never more than the room that the prompt leaves in the window (`session/model-request.ts:54-104`, `outputLimit`).
- Auto-compaction keeps 15% of the window free, at least 16,000 tokens (`session/compaction.ts:127-139`, `RESERVE_SHARE`, `RESERVE_MIN`). For a 200K model, a reviewer compacts at about 170K.
- Result: the `task` tool returns all text parts of the subagent's last assistant message (`session/subagent-completion.ts:10-18`, `tool/plugin/subagent.ts:255-263`). The session runner cuts each tool output, the `task` output included, to 2,000 lines and 50 KiB. It saves the full output to a file and adds the marker "[showing lines 1-N of M; full output saved to <file>]" (`session/runner/step.ts:127`, `tool-output.ts:13-14`, `:69-118`). The config key `tool_output` (`max_lines`, `max_bytes`) changes these limits (`config/plugin/tool-output.ts`).

### Summary of limits

| Platform | Window of a subagent | Compaction starts at | Output of one response | Report that the parent gets |
|---|---|---|---|---|
| Claude Code, Opus 5.5 | 1M (200K with 1M off or an unknown model ID) | about 967K (200K) | up to 128K; Claude Code default not documented for Opus 5.5 (32K for an unknown model ID) | last message, no documented cap |
| Codex, catalog models | 272K (some 372K or 500K) | 90%: 244.8K for 272K | model limit, none set by Codex | V1 `wait_agent`: about 12K tokens / 48 KB kept; notification and V2: no cap found |
| OpenCode | models.dev `limit.context` (often 200K) | 85% (170K for 200K) | catalog limit, at most 256K, fitted to the room left | 50 KiB or 2,000 lines, then a file path |

## 3. Evidence that quality drops with more files or more context

- Anthropic: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot" ([Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows), "How the context window works"). The engineering post adds that LLMs have an "attention budget", that "the model's ability to accurately recall information from that context decreases" as tokens increase, and that a subagent should return "a condensed, distilled summary of its work (often 1,000-2,000 tokens)" ([Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
- Chroma tested 18 models (Claude Opus 4 and Sonnet 4 among them) and found that "performance grows increasingly unreliable as input length grows", "even on tasks as simple as non-lexical retrieval or text replication" ([Context Rot](https://www.trychroma.com/research/context-rot)). The current Claude models were not in that test.
- Liu et al.: "performance can degrade significantly when changing the position of relevant information" in a long input ([Lost in the Middle](https://arxiv.org/abs/2307.03172)). The rule text that a reviewer must copy word for word is near the start of its context, and the last files of a long round are far from it.
- In this repo: the 2-file and 4-file reviewers of the self-check gave one complete part for each file (table above). They examined only changed lines, so they do not show the quality of a full-file round 1 with many files. No run compared one reviewer for N full files with N single-file reviewers. The evals #140–#142 do not measure it either.

Conclusion: the sources show that quality drops as context grows, but they do not give a file count at which a review report becomes worse. The cap below is set by the measured sizes and the platform limits, and it keeps each reviewer near the context size that worked in the self-check.

## 4. Recommendation

A cap is needed. With the median costs measured above, one reviewer for all 14 files of PR #143 in round 1 would need about:

| Class | Input peak (median) | Input peak (worst) | One report for 14 files (median) |
|---|---|---|---|
| Loading | 32K + 20K + 14 × 13K = about 235K | about 400K | 14 × 2.7 KB = 38 KB, about 15K tokens |
| ASD-STE100 | 32K + 22K + 14 × 16K = about 280K | more than 600K | 14 × 8.8 KB = 123 KB, about 49K tokens |
| ISO 24495-1 | 32K + 17K + 14 × 20K = about 330K | more than 600K | 14 × 8.3 KB = 116 KB, about 46K tokens |

- Input: this fits only on Claude Code with a 1M model. It is more than the 244.8K compaction point of Codex and the 170K compaction point of OpenCode with a 200K model.
- Output: on every platform, this is the binding limit. At the median, one ASD-STE100 report for 14 files is 123 KB and about 49K tokens in one message, with thinking on top. In the worst case (22.7 KB for each file), it is about 318 KB and 127K tokens, which is at the 128K API output limit. Codex V1 keeps about 48 KB of a `wait_agent` output, and OpenCode cuts a `task` output at 50 KiB.

Recommended cap for each reviewer, in each round:

- **A maximum of 3 files, and a maximum of 64 KB for the total size of the files under review.** Start a new reviewer of the same class for the next files.
- Why 3: with the median per-file cost, 3 full files need about 100–115K tokens of input. That is about half of the smallest compaction point above (170K), and the worst case (about 180K) still fits a 200K window. A 3-file report is about 26 KB and 10K tokens at the median, and about 27K tokens in the worst case. This is below 32K output tokens, below the 48 KB that Codex V1 keeps, and below the 50 KiB of OpenCode. The self-check ran 4 files for changed lines with no problem, so 3 full files keeps a margin.
- Why 64 KB: the three largest files of PR #143 (`review.md`, `git-commit/SKILL.md`, `agent-instructions/SKILL.md`) are 63.7 KB together, so the byte cap stops a group of 3 large files from growing past the measured upper case. A single file over 64 KB gets its own reviewer.
- Effect on #144: for the 14 files of PR #143, round 1 needs 5 reviewers of each class (15 in total) instead of 42. Each reviewer loads its rule files once for 3 files, which saves about two thirds of the repeated rule-file reads.
- A cap that depends on the platform (for example all files on Claude Code with a 1M window) does not help, because the output limits are the same or smaller there and the main agent cannot know the report size before the round. KISS: one cap for all platforms.

Limits of this research: the token costs come from one self-check run on Claude Code with Opus 5.5 and this repo's files. Codex and OpenCode use different models and tokenizers, so their real costs can be different. No eval compared review quality for 1, 3, and 14 files. If #200 adopts the cap, a later eval can test whether 3 full-file reports keep the same findings as 3 single-file reports.
