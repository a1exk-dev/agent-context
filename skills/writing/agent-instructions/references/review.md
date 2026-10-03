# Self-check and reader test

No check is a script. Fresh subagents do the self-check, because they can judge what a script cannot: mood, passive voice, "-ing" technical nouns, and word meanings.

## When you start a subagent

1. Find the tool that starts a subagent:
   - Claude Code: the `Agent` tool. Its old name is `Task`. Do not use a `fork` type, because a fork gets the session history of the main agent.
   - Codex: `spawn_agent` with `fork_turns="none"`. Without that argument, the V2 tools copy the full history.
   - OpenCode: the `task` tool.
2. On Codex, if you do not find `spawn_agent`, search with `tool_search` first. The V1 tools can be hidden until a search finds them.
3. Ask explicitly for a fresh subagent with an empty context window. Start each subagent from the main agent, because Codex and OpenCode permit only 1 level of subagents.
4. Put the full task and its limits in the prompt. No platform makes a subagent read-only from a `SKILL.md` file. Do not forbid the shell, because Codex uses the shell to read files.
5. Give each subagent the absolute paths of the reference files that it uses and of the file under review. The reference files are in the `references/` folder next to this skill's `SKILL.md`.
6. Start a fresh subagent for each check: each reviewer in each round, and each reader task. Do not give a second check to a subagent.
7. Start one subagent at a time, also in round 2 and round 3. Wait for its report before you start the next subagent.

If no tool starts a subagent, or a start call fails, go to the section "When no subagent is available".

## When you start the reviewers

In each round, start 3 fresh, read-only reviewer subagents, one after the other:

| Reviewer | Checks | Reference files |
|---|---|---|
| Loading reviewer | The loading rules for each file type, and the Agent Skills specification for a Skill | `review.md`, `loading-rules.md`, and `agent-skills-spec.md` for a Skill |
| ASD-STE100 reviewer | The STE rules | `review.md`, `ste-rules.md`, `technical-terms.md`, and the project `CONTEXT.md` |
| ISO 24495-1 reviewer | The plain-language checks | `review.md`, `plain-language-checks.md`, the project `CONTEXT.md`, and the files that the file under review points to |

Each reviewer reads the prompt in this file for its report requirements. As a reviewer, do only the assigned review yourself.

Copy this prompt for each reviewer. Replace only the placeholders. Keep the report requirements unchanged.

```text
You are the <name> reviewer for an Agent instruction: a file whose reader is an agent.
This is a read-only task. Read files only. Do not edit, create, move, or delete files.
Do not run commands that change files, Git state, or outside services.

File under review: <absolute path>
Sections to review: <"the whole file" in round 1, or the changed sections in rounds 2 and 3>
Sections the author can edit: <the part that the user asked to change, or "the whole file" for a new file>
Project folder: <absolute path>
Target platforms: <for example "Claude Code, Codex, and OpenCode">
Rules: <absolute paths of the reference files for this reviewer>
Report requirements: <absolute path of this review.md file>
Project glossary: <absolute path of CONTEXT.md, or "none">
Pointer targets: <absolute paths of the files that the file under review points to, or "none">

Before the review, read the report requirements from their file.
Do only this assigned review yourself.
Apply each rule in the rule files to the sections under review.
Report problems in all sections under review, also sections that the author cannot edit.
The author puts those findings in warnings and leaves their text unchanged.
<For the loading reviewer only:> First, list each pointer sentence and its condition.
Copy the condition from that sentence. If it has no condition, report a finding.
Include instructions to read, inspect, or follow another file.
Then list each file size and its limit.
List extraction candidates separately: section heading, proposed file, and pointer sentence.
Include candidates in sections that the author cannot edit.
<For the ASD-STE100 reviewer only:> First, list each sentence with its mood
(imperative or descriptive) and its word count. The counts are best effort.
Save this list to a new file in a temporary folder outside the project.
This file is the one permitted exception to the read-only limit.
In your report, give the path of the list, not the list.
Then judge each sentence.
Word choice comes from model knowledge. Do not read the ASD-STE100 dictionary
or a copy of the standard.

Report each finding in this form:
- Rule: <the rule number, or an exact quote of the rule from the rule files>
- Text: "<exact quote of the text>"
- Problem: <one sentence>
- Fix: <proposed new text>
Each finding names one rule that is in the rule files and quotes the exact text.
Write the rule in full in each finding. Do not refer to a different finding.
A reader must be able to check each finding on its own.
Do not make up a rule. A group heading alone is not a rule.
The Text field contains exact words from inside the file under review.
For a file size or location problem, quote the file's heading or first line.
Give paths and line numbers in the Problem field.
Use this form for each finding. Keep the required lists separate from the findings.
If you find no problem, write "No findings" after the required lists.
Do not add other notes or questions.
```

### When a review round ends

1. Round 1 covers the whole file, also in the edit job. In each prompt, separate the parts to review from the parts that the author can edit. In the edit job, put the findings outside the edit in a warning.
2. For each finding, fix your own text, or reject the finding. To reject a finding, cite the rule or the exemption that permits the text. Examples are an "-ing" technical noun and quoted text. Put each rejection in a warning.
3. In rounds 2 and 3, start all 3 reviewers again, but only on the sections that the last round changed. A fix for one source can break the rules of a different source.
4. The self-check ends when a round gives no finding in your own text that you accept, or after round 3.
5. After round 3, put each open finding in a warning with its rule. Then do the check in "When no review round is left" on the text that the round 3 fixes changed.

### When no review round is left

Do this check on each change after the last review round: a round 3 fix or a reader-test fix.

1. Send a visible message that lists each changed sentence with its mood and word count.
2. For each sentence of 18 or more words, write a number after each word, for example "If(1) no(2) commit(3)".
3. For each changed pointer, also quote the condition from that sentence. If a pointer has no condition, add it to that sentence.
4. Fix each sentence over its limit: 20 words for an imperative, 25 words for other sentences. After each fix, repeat these checks.
5. Add a warning that names the changed part as not reviewed.

## When the self-check ends: the reader test

Start the reader test only after the self-check ends. Do not start a reader subagent while a review round is open.

1. For each new or changed Agent instruction file, write 3 tasks:
   - 2 typical tasks with different inputs. If the edit starts from a reported misbehavior, the report is one of these tasks.
   - 1 near-miss task: Use a similar task that the new or changed instruction must not change. It uses the same file, words, or situation as the instruction, but the instruction does not apply to it. An example for a rule about release branches is a task that makes a feature branch. If all tasks in the project match the instruction, use a different project or platform for the near-miss.
2. Each reader-test round has all 3 tasks. Give each task to its own fresh subagent, with the path of the instruction. Start the 3 subagents one after the other.
3. Each subagent does a dry run: it can read files. It does not write files, change state, or contact outside services.
4. Each subagent reports its steps for the task and the parts of the instruction that it used.
5. Compare each report with the instruction.
   - A typical task passes when the steps obey the instruction.
   - The near-miss task passes when the reader uses no part of the new or changed instruction for its steps. The reader can use unchanged instructions.
   - A part that a reader reports as not clear is a failure.
6. Do not change the instruction until all 3 readers of the round have reported. Then, on a failure, fix your own text and do the test again. Do a maximum of 3 reader-test rounds.
7. If you cannot fix a failure alone, put it in a warning.
8. When a fix after the reader test changes text, the reviewers check the changed part again. This check counts as one of the 3 review rounds.
9. If no review round is left, do the check in "When no review round is left".

Use this prompt for each reader:

```text
This is a dry run. Read files only. Do not write files, change state, or contact outside services.

Instruction file: <absolute path>
Project folder: <absolute path>
Task: <the task text>

Read the instruction file from the disk with a file tool. A copy that loaded at the start
of your session can be older than the file.
Read the files that the instruction tells you to read for this task.
Report:
1. Your steps for the task, in sequence.
2. For each step, the part of the instruction that you used, as a quote.
3. Each part of the instruction that was not clear to you, or "None".
Give only these 3 parts. Write each step on one line.
```

## When no subagent is available

This section applies when no tool starts a subagent, or when a start call fails.

Do each review and each reader task yourself, as a separate check. Use the same reviewer prompt, reader prompt, and round limits. Each check has its own report file. This record lets the user check each finding and the sequence of the checks.

Before the first check, make a new temporary folder outside the project, for example with `mktemp -d`. Do not use a fixed path, because a different session can use the same path. The read-only limits permit this folder and its report files.

Do these 2 steps for each check: each review and each reader task. Do not start the next check before step 2 is complete.

1. Do the check as the reviewer prompt or the reader prompt tells you.
2. Save the complete report to a new file. Send this tool call alone in a new message.

Do not save 2 reports in one tool call or in one message. Do not send 2 tool calls at the same time. The sequence of the messages shows that you did the checks one after the other.

Write each report in full. In each finding, write the rule in full. Do not refer to a different finding or a different report.

The end-of-run report cannot replace these files. In the end-of-run report, give the path of the report folder.

Do the checks in this sequence:

1. In each review round, do the 3 reviews in the sequence of the reviewer table.
2. Start each review report with its title, for example "Round 2: ASD-STE100 review". Give each finding in the form of the reviewer prompt. Include the required lists separately from the findings. Report no other items.
3. In each ASD-STE100 review report, also list each sentence on its own line with its mood and word count.
4. Fix your text after each round. Then do the next round, or say that the self-check ended.
5. After the self-check ends, do the 3 reader tasks, one after the other. Use these titles:
   - "Reader task 1 (typical): <task>"
   - "Reader task 2 (typical): <task>"
   - "Reader task 3 (near-miss): <task>"
6. In each reader report, give the 3 parts of the reader prompt. For each step, quote the part of the instruction that you used.
7. Add a warning that says that the checks were not independent and the readers were not fresh.
