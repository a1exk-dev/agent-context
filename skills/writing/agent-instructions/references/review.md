# Self-check and reader test

This file gives the steps of the self-check and the reader test of the write job and the edit job.

No script does a review or a reader-test task. Usually, new subagents do the self-check and the reader test, because they can examine items that a script cannot examine. Examples are the mood of a sentence, the passive voice, "-ing" technical nouns, and the meanings of words.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you start a subagent

1. Find the tool that starts a subagent:
   - Claude Code: The tool is the `Agent` tool. Its previous name is `Task`. Do not use a `fork` type, because a subagent of this type gets the session history of the main agent.
   - Codex: The tool is `spawn_agent` with `fork_turns="none"`. Without `fork_turns="none"`, `spawn_agent` copies the full session history. If you do not find `spawn_agent`, search for it with `tool_search`. Codex can show some subagent tools only after you search.
   - OpenCode: The tool is the `task` tool.
   If no tool starts a subagent, go to the section "When no subagent is available".
2. Tell the platform clearly to start a new subagent with an empty context window. Start each subagent from the main agent, because a subagent on Codex or OpenCode cannot start subagents.
3. Put the full task and its limits in the prompt. No platform can make a subagent read-only from a `SKILL.md` file. Let the subagent use the shell, because Codex uses the shell to read files.
4. Give each subagent the absolute paths of the reference files that it uses and of the file that it examines. The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.
5. Start a new subagent for each check: each reviewer in each round, and each reader-test task. Do not give a second check to a subagent, because that subagent knows the previous text and the findings.
6. Start the subagents of each round as "When you do a round" tells you.

## When you do a round

Each round contains the checks of all files that it examines. Do not do a different series of rounds for each file. For the round limits, count the rounds of all files together, because the limits are for the full task. For example, a review round for 2 files has 6 checks: 3 reviewers for each file.

Each review round and each reader-test round has these steps:

1. If the round has 3 checks or fewer, start all subagents of the round in one message.
2. If the round has more than 3 checks, start the subagents in groups of 3. Put the 3 checks of one file in one group. Then the reviewers of one file read the same text at the same time. Start each group in one message. After you get all reports of a group, start the next group. Codex permits a maximum of 3 subagents at the same time.
3. Wait for the reports of all subagents of the round:
   - Claude Code: Wait for one message for each subagent.
   - Codex: Call `wait_agent` again until each subagent gives its report. Before you get all reports, do not stop, because a stopped main agent gets no report. If the `close_agent` tool is available, close each subagent after its report. Each open subagent counts in the maximum of 3 subagents.
   - OpenCode: Wait for the message that gives the reports of all `task` tool calls.
4. Before you get all reports of the round, do not change a file that the round examines. This makes sure that all subagents of the round read the same text.
5. A subagent fails when the tool call that starts it gives an error. A subagent also fails when it stops without a report. If a subagent fails, do these steps:
   1. Do not wait for a report from it. Its group is complete without that report.
   2. Start the other groups of the round, as item 2 of the round steps tells you.
   3. Get all other reports of the round.
   4. On Codex, if the `close_agent` tool is available, close each failed subagent.
   5. Start one new subagent for each failed check, as items 1 to 3 of the round steps tell you. With this sequence, a maximum of 3 subagents operate at the same time.
6. If a new subagent also fails, do these checks as "When no subagent is available" tells you:
   - Each check that failed again with its new subagent.
   - Each check of the round that you did not start.
   - All checks of the later review rounds and reader-test rounds.

   You do these checks because the tool that starts subagents failed 2 times for the same check. When a subagent gave the report for a check, do not do that check again.
7. After the last report of the round, correct the files as "During and after a review round" or "After the self-check: the reader test" tells you. Do not correct a file between 2 groups of the round. The last report can come from a new subagent or from "When no subagent is available".

## When you start the reviewers

In each round, start 3 new reviewer subagents for each file, as "When you do a round" tells you. The reviewer prompt makes each reviewer read-only. Only the ASD-STE100 reviewer can save a file: one list file. This table gives the 3 reviewers:

| Reviewer | Checks | Files to read |
|---|---|---|
| Loading reviewer | The loading rules for each file type, and the Agent Skills specification for a Skill | `review.md`, `loading-rules.md`, and `agent-skills-spec.md` for a Skill |
| ASD-STE100 reviewer | The STE rules | `review.md`, `ste-rules.md`, `technical-terms.md`, `source-conflicts.md`, and the glossary |
| ISO 24495-1 reviewer | The plain-language checks | `review.md`, `plain-language-checks.md`, `source-conflicts.md`, the glossary, and the pointer targets of the file |

Copy this prompt for each reviewer. Then do these steps on each copy:

1. Replace the placeholders in the lines from "You are the" to "Pointer targets". Do not replace the text in angle brackets in the finding form. The reviewer writes its findings in that form. Do not change other text of the prompt, except as items 2 to 5 tell you.
2. Keep the lines for the reviewer that you start. The lines for a reviewer start at the text in angle brackets that gives the name of that reviewer. They stop before the next text in angle brackets or before the next empty line.
3. Remove the text in angle brackets at the start of each group of lines that you keep.
4. Remove the lines for the other reviewers.
5. In the write job, also remove the lines for the loading reviewer in the edit job.

Obey these rules for each copy:

- Do not change the report requirements.
- Give the same pointer targets to each reviewer. The loading reviewer examines each pointer, and the ISO 24495-1 reviewer compares the file with each pointer target.

```text
You are the <name> reviewer for an Agent instruction: a file that an agent reads as instructions.
This task is read-only. Only read files. Do not edit, make, move, or delete files. You can save only the file that a line for your reviewer tells you to save.
Do not run commands that change files, Git data, or external services.

File to examine: <absolute path>
Sections to review: <"the full file" in round 1, or the changed sections in rounds 2 and 3>
Sections that the author can edit: <the changed part, for example a new section, or "the full file" for a new file. In the edit job, give the pointer of each section that you moved, but not the text of that section>
Job: <"the write job" or "the edit job">
Project folder: <absolute path>
Target platforms: <the target platforms that you found with loading-rules.md, for example "Claude Code, Codex, and OpenCode">
Reference files: <absolute paths of the files in the `references/` folder that the table gives for this reviewer>
Report requirements: <absolute path of this review.md file>
Glossary: <absolute path of GLOSSARY.md or CONTEXT.md, or "none">
Pointer targets: <absolute paths of the files that the pointers in the file identify, or "none">

Before the review, read the report requirements from their file.
Do only this review. Do not give it to a subagent.
Use each rule in the reference files for the sections that you examine.
Give the problems in all sections that you examine, also in sections that the author cannot edit.
The author puts each finding about a section that the author cannot edit in a warning.
The author does not change the text of that section.
<For the loading reviewer only:> First, write each pointer and its condition.
Copy the condition from that pointer. If it has no condition, give a finding.
Include each instruction that tells the reader to read, examine, or obey a different file.
Then write the file size of each file and its limit.
Give a finding for each text to move in a section that the author can edit.
Also give a finding for each text that the author moved and that does not obey loading-rules.md. In the Text field, write the pointer of that text in quotation marks. If that text has no pointer, copy the heading of the moved section.
<For the loading reviewer in the edit job only:> Write the extraction candidates in a different list: section heading, recommended file, and pointer. Put in this list only sections that you examine and that the author cannot edit. When you write this list, use only the candidates that "When you recommend text to move" in loading-rules.md gives.
<For the ASD-STE100 reviewer only:> First, write each sentence with its text type
(procedural, descriptive, or note) and its word count.
For each sentence of 18 words or more, write a number after each word,
for example "If(1) no(2) commit(3)". The numbers prevent errors when you count the words near the limit.
Save this list to a new file in a temporary folder that is not in the project folder.
You can write only this file.
In your report, give the path of the list, not the list.
Then examine each sentence.
Select words from model knowledge. Do not read the ASD-STE100 dictionary
or a copy of the standard.

Give each finding in this form:
- Rule: <the rule number, if the rule has one, and the full rule text in quotation marks>
- Text: "<the words from the file in quotation marks>"
- Problem: <one sentence>
- Correction: <recommended new text>
Each finding gives one rule from the reference files and the text from the file in quotation marks.
Write the full rule in each finding. Do not refer to a different finding.
Write each finding so that the author can examine it without the other findings.
Do not make a new rule. A group heading is not a rule.
The Text field contains only words from the file that you examine.
For a file-size problem or a file-location problem, copy the heading or the first line of the file.
Give the paths and the line numbers in the Problem field.
Use this form for each finding. Keep the necessary lists apart from the findings.
If you find no problem, write "No findings" after the necessary lists.
Do not add other notes or questions.
```

## During and after a review round

1. Put each finding about a section that you cannot edit in a warning.
2. After a review round, save a copy of each file that the round examines. Before you correct your text, save these copies. Do not make the copy in a tool call that saves a report. Write only one file in each tool call that saves a copy. Then each tool call shows one action. Put the copy in a temporary folder that is not in the project.
3. For each finding about a section that you can edit, correct your text, or reject the finding. To reject a finding, give the rule or the text type that permits the text. Examples are an "-ing" technical noun and quoted text. Write each finding that you reject in a warning.
4. When a round before round 3 gives no finding that you accept, stop the self-check. After round 3, do item 6. Then stop the self-check.
5. If the self-check did not stop, start all 3 reviewers again in the next round. Give them only the sections that the previous round changed. To find these sections, compare each file and its copy, for example with `diff`. Do not find them from memory. A correction for one source can make the text incorrect for a different source.
6. After round 3, put each finding that you did not correct in a warning with its rule. Then do the word-count step in "After a round 3 correction, or a reader-test correction after 3 review rounds" on the text that the round 3 corrections changed.

Obey these rules for each finding:

- If you cannot correct a finding without help from the user, put it in a warning. An example is a word that makes a new technical noun in the project necessary.
- When you find a problem outside a review report, give it in a warning, not as a finding. In that warning, give the text in quotation marks and the problem.

## After a round 3 correction, or a reader-test correction after 3 review rounds

Do this word-count step on each of these corrections.

1. Send a message that shows each changed sentence with its text type and its word count.
2. For each sentence of 18 words or more, write a number after each word, for example "If(1) no(2) commit(3)". The numbers prevent errors when you count the words near the limit.
3. For each changed pointer, also write the condition from that pointer in quotation marks. If a pointer has no condition, add the condition to that pointer.
4. Correct each sentence that is longer than its limit: 20 words for procedural text, 25 words for descriptive text and notes. After each correction, do items 1 to 3 again.
5. Add a warning that tells that no reviewer examined the text that these corrections changed.

## After the self-check: the reader test

While a review round continues, do not start a reader subagent. The corrections after that round change the text that the reader tests.

1. For each new or changed file, write 3 tasks, also when the file has many changes. Each task tests the new or changed instruction of its file. Write these tasks:
   - Write 2 typical tasks with different inputs. If the user told you that an agent did not obey an instruction, make one task from that problem.
   - Write 1 out-of-scope task. The new or changed instruction does not change the out-of-scope task. The out-of-scope task is almost the same as a typical task. It uses the same file, words, or condition as the instruction, but the instruction is not applicable to this task. An example for a rule about release branches is a task that makes a `feature/<name>` branch. If the instruction is applicable to all project tasks, use a different project or platform for this task.
2. Each reader-test round has the 3 tasks of each file. Give each task to a different new subagent. Use the reader prompt that follows these steps. In that prompt, give the task and the path of its new or changed file. Start the subagents as "When you do a round" tells you.
3. Compare each report with the instruction:
   - A typical task is correct when the steps obey the instruction.
   - The out-of-scope task is correct when the reader uses no part of the new or changed instruction for its steps. The reader can use instructions that did not change.
   - When a part is not clear to a reader, that part has a problem.
4. After all readers of the round give their reports, save a copy of each file that the round examines. Item 2 of "During and after a review round" tells you how. Then correct your text for each task that has a problem.
5. If a reader-test correction changed text and you did fewer than 3 review rounds, start the reviewers for that text. This review round is one of the 3 review rounds. After it, do items 1 to 3 of "During and after a review round". If this review round is round 3, also do item 6 of that section. Do not start one more review round for that text. If you did fewer than 3 reader-test rounds, the next reader-test round tests that text. If you did 3 reader-test rounds, add a warning that no reader examined that text. Then, if you did fewer than 3 reader-test rounds, do the next reader-test round.
6. If a reader-test correction changed text and you did all 3 review rounds, do the word-count step in "After a round 3 correction, or a reader-test correction after 3 review rounds". If you did 3 reader-test rounds, add a warning that no reader examined that text. Then, if you did fewer than 3 reader-test rounds, do the next reader-test round.
7. If no correction after a reader-test round changed text, stop the reader test.

Obey these rules for the reader test:

- Do a maximum of 3 reader-test rounds.
- If you cannot correct a problem without help from the user, put it in a warning.

Use this prompt for each reader:

```text
This task is a dry run. Only read files. Do not write files, change Git data, or change external services.

Agent instruction: <absolute path>
Project folder: <absolute path>
Task: <the task text>

Before your first step, read the Agent instruction from the disk with a file tool. A copy that the platform loaded at the start
of your session can be older than the file.
Read the files that the Agent instruction tells you to read for this task.
Give this report:
1. Your steps for the task, in the sequence that you do them.
2. For each step, the part of the Agent instruction that you used, in quotation marks.
3. Each part of the Agent instruction that was not clear to you, or "None".
Give only these 3 parts. Write each step on one line. Put long text, for example a prompt, after the steps.
```

## When no subagent is available

This section is also applicable to the checks that item 6 of "When you do a round" gives.

Do each review and each reader-test task as a different check. Use the same reviewer prompt, the same reader prompt, and the same round limits. Each check has a different report file. With these files, the user can examine each finding and the sequence of the checks.

Before the first check, make a new temporary folder that is not in the project, for example with this command:

```sh
mktemp -d
```

Do not use a specified path, because a different session can use the same path. In this section, you can make this folder and write its report files. The limits in the reviewer prompt and the reader prompt are not applicable to these files.

Do these 2 steps for each check: each review and each reader-test task. Before you complete step 2, do not start the next check.

1. Do the check as the reviewer prompt or the reader prompt tells you.
2. Save the full report to a new file. Send only this tool call in a new message. Put no other tool call in that message, for example a `git` command or a copy of a different file. Before you start the next check, wait for the result of this tool call. This tool call writes only one file. After you save a report, do not change it.

If you find an error in a saved report, do not correct that file. Give the correction in the Warnings part of the end-of-run report.

Do not save 2 reports in one tool call or in one message. Do not send 2 tool calls at the same time. These 2 rules are applicable in each round, also when the reports of a round are short. These 2 rules are also applicable when a round examines only one line, and when a report gives "No findings". The sequence of the messages shows that you did the checks one after the other.

Write each report in full. In each finding, write the full rule. Do not refer to a different finding or a different report.

The end-of-run report cannot replace the report files.

Do the checks in this sequence:

1. In each review round, do each review that no subagent did, in the sequence of the reviewer table.
2. After each round, correct your text as "During and after a review round" tells you. Then do the next round, or stop the self-check as item 4 of that section tells you.
3. After the self-check stops, in each reader-test round, do each reader-test task that no subagent did, one after the other. After each reader-test round, correct your text. Then do the next steps as "After the self-check: the reader test" tells you.

Obey these rules for each report:

- Start each review report with its title. In the title, give the round number, the file name, and the reviewer, for example "Round 2, SKILL.md: ASD-STE100 review". Give each finding in the form of the reviewer prompt. Keep the necessary lists apart from the findings. Give no other items.
- In each ASD-STE100 review report, write each sentence, its text type, and its word count on one line. For each sentence of 18 words or more, also write a number after each word. These lines replace the list file of the reviewer prompt.
- Start each reader report with its title. Use these titles, with the number of the reader-test round and the file name:
  - "Reader-test round <n>, <file>, reader-test task 1 (typical): <task>"
  - "Reader-test round <n>, <file>, reader-test task 2 (typical): <task>"
  - "Reader-test round <n>, <file>, reader-test task 3 (out-of-scope): <task>"
- In each reader report, give the 3 parts of the reader prompt. For each step, write in quotation marks the part of the Agent instruction that you used.
