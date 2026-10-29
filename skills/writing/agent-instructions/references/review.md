# Self-check and reader test

The check script of this skill examines each rule that ends with "(script check)". These rules are countable. New subagents do the other checks, because they can examine items that a script cannot examine. Examples are the mood of a sentence, the passive voice, and the meanings of words.

## When you start a subagent

1. Find the tool that starts a subagent:
   - Claude Code: The tool is the `Agent` tool. Its previous name is `Task`. Do not use a `fork` type, because a subagent of this type gets the session history of the main agent.
   - Codex: The tool is `spawn_agent` with `fork_turns="none"`. Without `fork_turns="none"`, `spawn_agent` copies the full session history. If you do not find `spawn_agent`, search for it with `tool_search`. Codex can show some subagent tools only after you search.
   - OpenCode: The tool is the `task` tool.
2. Tell the platform clearly to start a new subagent with an empty context window. Start each subagent from the main agent, because a subagent on Codex or OpenCode cannot start subagents.
3. Put the full task and its limits in the prompt. No platform can make a subagent read-only from a `SKILL.md` file. Let the subagent use the shell, because Codex uses the shell to read files.
4. Give each subagent the absolute paths of the reference files that it uses and of the file that it examines. The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.
5. Start a new subagent for each check: each reviewer in each round, and each reader task. Do not give a second check to a subagent, because that subagent knows the previous text and findings.
6. Start the subagents of each round as "When you do a round" tells you.

If no tool starts a subagent, go to the section "When no subagent is available".

## When you do a round

Each round contains the checks of all files that it examines. Do not do a different series of rounds for each file. For the round limits, count the rounds of all files together, because the limits are for the full task. For example, a review round for 2 files has 6 checks: 3 reviewers for each file.

Each review round and each reader-test round has these steps:

1. If the round has 3 checks or fewer, start all subagents of the round in one message.
2. If the round has more than 3 checks, start the subagents in groups of 3. Put the 3 checks of one file in one group. Start each group in one message. After you get all reports of a group, start the next group. Codex permits a maximum of 3 subagents at the same time.
3. Wait for the reports of all subagents of the round:
   - Claude Code: Wait for one message for each subagent.
   - Codex: Call `wait_agent` again until each subagent gives its report. Before you get all reports, do not stop, because a stopped main agent gets no report. If the `close_agent` tool is available, close each subagent after its report. The maximum of 3 subagents includes each open subagent.
   - OpenCode: Wait for the message that gives the reports of all `task` tool calls.
4. Before you get all reports of the round, do not change a file that the round examines. This makes sure that all subagents of the round read the same text.
5. A subagent fails when the tool call that starts it gives an error. A subagent also fails when it stops without a report. If a subagent fails, do not wait for a report from it. Its group is complete without that report. Start the other groups of the round as item 2 tells you. Then get all other reports of the round. On Codex, if the `close_agent` tool is available, close each failed subagent. Then start one new subagent for each failed check, as items 1 to 3 tell you. With this sequence, a maximum of 3 subagents operate at the same time.
6. If a new subagent also fails, do these checks as "When no subagent is available" tells you:
   - Each check whose new subagent failed.
   - Each check of the round that you did not start.
   - All checks of the later review rounds and reader-test rounds. The tool that starts subagents failed 2 times for the same check.

   When a subagent gave the report for a check, do not do that check again.
7. After the last report of the round, correct the files. Do not correct a file between 2 groups of the round. The last report can come from a new subagent or from "When no subagent is available".

## Before each review round

1. Run the check script on the full file of each file in the round, as "When you run the check script" in `SKILL.md` tells you. Save the output of each round to a new JSON file.
2. Give the path of the JSON file to each reviewer of the round.
3. After the last report of the round, correct each finding of the script, or reject it, as for a reviewer finding.
4. Put each script finding about text that you cannot edit in a warning.

## When you start the reviewers

In each round, start 3 new, read-only reviewer subagents for each file, as "When you do a round" tells you:

| Reviewer | Checks | Reference files |
|---|---|---|
| Loading reviewer | The loading rules for each file type, and the Agent Skills specification for a Skill | `review.md`, `loading-rules.md`, and `agent-skills-spec.md` for a Skill |
| ASD-STE100 reviewer | The STE rules | `review.md`, `ste-rules.md`, `technical-terms.md`, and the glossary |
| ISO 24495-1 reviewer | The plain-language checks | `review.md`, `plain-language-checks.md`, the glossary, and the files that the file under review identifies with pointers |

Each reviewer reads the prompt in this file to know the requirements for its report. A reviewer does only the review that the author gave to it.

Copy this prompt for each reviewer. Replace only the placeholders. Do not change the report requirements. Keep the lines for the reviewer that you start. Remove the label in angle brackets from these lines. Remove the lines for the other reviewers. In the write job, also remove the lines for the loading reviewer in the edit job. Give the same pointer targets to each reviewer.

```text
You are the <name> reviewer for an Agent instruction: a file that an agent reads as instructions.
This task is read-only. Only read files. Do not edit, make, move, or delete files.
Do not run commands that change files, Git data, or external services.

File under review: <absolute path>
Sections to review: <"the full file" in round 1, or the changed sections in rounds 2 and 3>
Sections that the author can edit: <the changed part, for example a new section, or "the full file" for a new file. In the edit job, include the pointer of each section that you moved, but not the text of that section>
Job: <"the write job" or "the edit job">
Project folder: <absolute path>
Target platforms: <the target platforms that you found with loading-rules.md, for example "Claude Code, Codex, and OpenCode">
Rules: <absolute paths of all reference files for this reviewer in the table>
Report requirements: <absolute path of this review.md file>
Glossary: <absolute path of GLOSSARY.md or CONTEXT.md, or "none">
Pointer targets: <absolute paths of the files that the pointers in the file identify, or "none">
Check script findings: <absolute path of the JSON file of the check script for this round>

Before the review, read the report requirements from their file.
Do only this review. Do not give it to a subagent.
Use each rule in the rule files for the sections under review.
Skip each rule that ends with "(script check)". The check script findings give the problems for these rules.
Give the problems in all sections under review, also in sections that the author cannot edit.
The author puts each finding about a section that the author cannot edit in a warning.
The author does not change the text of that section.
<For the loading reviewer only:> Skip the rules about pointers and headings in "When you select a feature" in loading-rules.md.
The ISO 24495-1 reviewer examines the conditions of the pointers and the headings.
Write the file size of each file and its limit.
Give a finding for each text to move in a section that the author can edit.
Also give a finding for each text that the author moved and that does not obey loading-rules.md. In the Text field, write the pointer of that text in quotation marks. If that text has no pointer, copy the heading of the moved section.
<For the ISO 24495-1 reviewer only:> The check script findings also give the pointer list: each sentence that names a file path, with its line and heading.
For each sentence in the pointer list that is a pointer, decide whether the heading and the sentence give the condition to read the target.
Also find each pointer that names no file, for example "that file".
In "When you select the text" in plain-language-checks.md, skip the rule about long text. The loading reviewer examines it.
In "When you select the words and the tone", skip the rule about one term for each item. The ASD-STE100 reviewer examines it.
<For the loading reviewer in the edit job only:> Write the extraction candidates in a different list: section heading, recommended file, and pointer sentence. Put in this list only sections under review that the author cannot edit. Use only the candidates that "When you recommend text to move" in loading-rules.md gives.

Give each finding in this form:
- Rule: <the rule number, if the rule has one, and the full text of the rule in quotation marks from the rule files>
- Text: "<the words from the file in quotation marks>"
- Problem: <one sentence>
- Correction: <recommended new text>
Each finding gives one rule from the rule files and the text from the file in quotation marks.
Write the full rule in each finding. Do not refer to a different finding.
Copy the rule and the text word for word. A script compares each quotation with the files and removes each finding with a different quotation.
Write each finding so that the author can examine it without the other findings.
Do not make a new rule. A group heading is not a rule.
The Text field contains only words from the file under review.
For a file-size problem or a file-location problem, copy the heading or the first line of the file.
Give the paths and the line numbers in the Problem field.
Use this form for each finding. Keep the necessary lists apart from the findings.
If you find no problem, write "No findings" after the necessary lists.
Do not add other notes or questions.
```

### During and after a review round

1. Round 1 examines the full file, also in the edit job. In each prompt, give the parts to review and, in a different line, the parts that the author can edit. In the edit job, put each finding about text that is not in the changed part in a warning.
2. After the last report of the round, save each reviewer report to a new file in a temporary folder that is not in the project. Then run the report form of the check script for each file of the round, as "When you run the check script" in `SKILL.md` tells you. Use only the findings in the blocking list and the advisory list. Do not use the findings in the dropped list.
3. For each finding, correct your text, or reject the finding. To reject a finding, give the rule that permits the text. An example is quoted text. Write each finding that you reject in a warning.
4. Before you correct your text after a round, save a copy of each file that the round examines. Do not make the copy in a tool call that saves a report. Put the copy in a temporary folder that is not in the project. In rounds 2 and 3, start all 3 reviewers again, but only for the sections that the previous round changed. To find these sections, compare each file and its copy, for example with `diff`. Do not find them from memory. A correction for one source can make the text incorrect for a different source.
5. The self-check stops when a round gives no finding in your text that you accept, or after round 3.
6. After round 3, put each finding that you did not correct in a warning with its rule. Then do the check in "After the last review round" on the text that the round 3 corrections changed.

### After the last review round

Do this check on each round 3 correction. Also do it on each correction after the reader test when you did all 3 review rounds.

1. Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you.
2. Correct each script finding in the text that the corrections changed. After each correction, do these checks again.
3. Send a message that gives the condition of each changed pointer in quotation marks. If a pointer has no condition, add the condition to that sentence.
4. Add a warning that tells that no reviewer examined the text that these corrections changed.

## After the self-check: the reader test

Start the reader test only after the self-check stops. Do not start a reader subagent while a review round continues.

1. For each new or changed file, write 3 tasks, also when the file has many changes. Each task tests the new or changed rules of its file:
   - Write 2 typical tasks with different inputs. If the user told you that an agent did not obey an instruction, make one task from that problem.
   - Write 1 out-of-scope task. It looks almost the same as a typical task, but the new or changed instruction does not change it. It uses the same file, words, or condition as the instruction, but the instruction is not applicable to it. An example for a rule about release branches is a task that makes a feature branch. If the instruction is applicable to all project tasks, use a different project or platform for this task.
2. Each reader-test round has the 3 tasks of each file. Give each task and the path of its new or changed file to a different new subagent. Start the subagents as "When you do a round" tells you.
3. Make sure that each subagent does a dry run. The first line of the reader prompt tells the subagent to do a dry run.
4. Make sure that each subagent gives its steps for the task and the parts of the instruction that it used.
5. Compare each report with the instruction:
   - A typical task is correct when the steps obey the instruction.
   - The out-of-scope task is correct when the reader uses no part of the new or changed instruction for its steps. The reader can use instructions that did not change.
   - When a part is not clear to a reader, that part has a problem.
6. Do not change the instruction until all readers of the round give their reports. Then all readers of a round read the same text. Then, if a task has a problem, correct your text. After the correction, do the test again. Do a maximum of 3 reader-test rounds.
7. If you cannot correct a problem without help from the user, put it in a warning.
8. After a reader-test round, a correction can change text. If you did fewer than 3 review rounds, start the reviewers again for that text before the next reader-test round. This review round is one of the 3 review rounds.
9. If you did all 3 review rounds, do the check in "After the last review round". Then do the next reader-test round, if the limit permits it.

Use this prompt for each reader:

```text
This task is a dry run. Only read files. Do not write files, change Git data, or change external services.

Instruction file: <absolute path>
Project folder: <absolute path>
Task: <the task text>

Before your first step, read the instruction file from the disk with a file tool. A copy that loaded at the start
of your session can be older than the file.
Read the files that the instruction tells you to read for this task.
Give this report:
1. Your steps for the task, in sequence.
2. For each step, the part of the instruction that you used, in quotation marks.
3. Each part of the instruction that was not clear to you, or "None".
Give only these 3 parts. Write each step on one line. Put long text, for example a prompt, after the steps.
```

## When no subagent is available

This section is applicable when no tool starts a subagent. It is also applicable to the checks that item 6 of "When you do a round" gives.

Do each review and each reader task as a different check. Use the same reviewer prompt, reader prompt, and round limits. Each check has a different report file. With these files, the user can examine each finding and the sequence of the checks.

Before the first check, make a new temporary folder that is not in the project, for example with this command:

```sh
mktemp -d
```

Do not use a specified path, because a different session can use the same path. In this section, you can make this folder and write its report files. The limits in the reviewer prompt and the reader prompt do not stop these files.

Do these 2 steps for each check: each review and each reader task. Do not start the next check before you complete step 2.

1. Do the check as the reviewer prompt or the reader prompt tells you.
2. Save the full report to a new file. Send only this tool call in a new message. Put no other tool call in that message, for example a `git` command or a copy of the file. Wait for its result before you start the next check. This tool call writes only one file. Do not change a report after you save it.

If you find an error in a saved report, do not correct that file. Give the correction in the Warnings part of the end-of-run report.

Do not save 2 reports in one tool call or in one message. Do not send 2 tool calls at the same time. This rule is applicable in each round, also when the reports of a round are short. It is also applicable when a round examines only one line, and when a report gives "No findings". The sequence of the messages shows that you did the checks one after the other.

Write each report in full. In each finding, write the full rule. Do not refer to a different finding or a different report.

The end-of-run report cannot replace these files. Give the path of the report folder in the warning about the checks that you did yourself.

Do the checks in this sequence:

1. In each review round, do each review that no subagent did, in the sequence of the reviewer table.
2. Start each review report with its title, for example "Round 2: ASD-STE100 review". Give each finding in the form of the reviewer prompt. Keep the necessary lists apart from the findings. Give no other items.
3. Correct your text after each round. Then do the next round, or write that the self-check stopped.
4. After the self-check stops, do each reader task that no subagent did, one after the other. Use these titles, with the number of the reader-test round and the file name:
   - "Reader-test round <n>, <file>, reader task 1 (typical): <task>"
   - "Reader-test round <n>, <file>, reader task 2 (typical): <task>"
   - "Reader-test round <n>, <file>, reader task 3 (out-of-scope): <task>"
5. In each reader report, give the 3 parts of the reader prompt. For each step, write the part of the instruction that you used in quotation marks.
6. When you write the end-of-run report, add the warning about the checks that you did yourself. Write it as the Warnings part in `SKILL.md` tells you.
