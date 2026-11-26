Blocking checklist:
1. "When the write job has Claude Code and Codex or OpenCode as target platforms, put the text for all target platforms in `AGENTS.md`. `CLAUDE.md` then contains the `@AGENTS.md` line and only the lines that are only for Claude Code. (blocking)" - none
2. "When there is one target platform, write only the entry file of that platform. (blocking)" - none
3. "Keep the heading of the section at the start of the moved section. In its old place, write a heading that gives the condition. Under that heading, write the pointer as "When you put the text in sections and lists" in `plain-language-rules.md` tells you. Write no other text in the old place, also when a finding is about the moved section. (blocking)" - none

File size:
- skills/writing/agent-instructions/references/review.md: 48263 bytes, 450 lines. Limit: none. The table in "When you examine the file size" in loading-rules.md gives no limit for a reference file of a Skill. The 20,000-byte limit is only for `SKILL.md`, and the 500-line recommendation in agent-skills-spec.md is only for `SKILL.md`.

Findings:

- Rule: 3. "Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file. (advisory)"
- Text: "After the self-check: the reader test"
- Problem: In skills/writing/agent-instructions/SKILL.md, step 9 (line 104) tells the agent to read references/review.md under the condition "after the self-check", which is different from the step 8 (line 103) condition "Before the self-check", but references/review.md keeps the reader-test section (lines 205-314) in the same file as the self-check text, so the agent loads approximately 48 KB for each condition.
- Correction: Move the section "After the self-check: the reader test" with its subsection to `references/reader-test.md`, and in SKILL.md step 9 write: "After the self-check, do the reader test that `references/reader-test.md` gives, also for a small change."

- Rule: 3. "Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file. (advisory)"
- Text: "After the reader test: the output tests and the manual checks"
- Problem: In skills/writing/agent-instructions/SKILL.md, step 10 (line 105) tells the agent to read this section of references/review.md only "after the reader test passes", but the section (lines 316-360, with "When you run a manual check") is in the same file as the self-check text that step 8 (line 103) loads "Before the self-check".
- Correction: Move the section "After the reader test: the output tests and the manual checks" with its subsection to `references/output-tests.md`, and in SKILL.md step 10 write: "In the other jobs, after the reader test passes, do the output tests and the manual checks that `references/output-tests.md` gives."

- Rule: 3. "Make one reference file for each condition that tells the agent to read a file. Put the text that the agent reads under the same condition in one file. When the user gives rules under one condition, keep all these rules in one file. If the project has a reference file for that condition, add the text to that file. (advisory)"
- Text: "When a blocking problem stays open at a limit"
- Problem: In skills/writing/agent-instructions/SKILL.md, step 11 (line 106) tells the agent to read this section of references/review.md only "If a blocking problem stays open at a limit", but the section (lines 362-390) is in the same file as the self-check text that step 8 (line 103) loads "Before the self-check".
- Correction: Move the section "When a blocking problem stays open at a limit" to `references/open-blocking-problems.md`, and in SKILL.md step 11 write: "If a blocking problem stays open at a limit, do the steps in `references/open-blocking-problems.md`."
