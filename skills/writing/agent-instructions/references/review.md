# Self-check and reader test

The check script of this skill examines each rule that ends with "(script check)". These rules are countable. New subagents do the other checks, because they can examine items that a script cannot examine. Examples are the mood of a sentence, the passive voice, and the meanings of words.

## When you start a subagent

1. Find the tool that starts a subagent:
   - Claude Code: The tool is the `Agent` tool. Its previous name is `Task`. Do not use a `fork` type, because a subagent of this type gets the session history of the main agent.
   - Codex: The tool is `spawn_agent` with `fork_turns="none"`. Without `fork_turns="none"`, `spawn_agent` copies the full session history. If you do not find `spawn_agent`, search for it with `tool_search`. Codex can show some subagent tools only after you search.
   - OpenCode: The tool is the `task` tool.

   If you do not find the tool, also after the search with `tool_search` on Codex, go to the section "When no subagent is available".
2. Tell the platform clearly to start a new subagent with an empty context window. Start each subagent from the main agent, because a subagent on Codex or OpenCode cannot start subagents.
3. Put the full task and its limits in the prompt. Put the full prompt text from this file, with its `Check class:` line, in the tool call that starts the subagent. Do not save the prompt to a file for the subagent to read. When the full prompt is in the tool call, the tool call shows the class of each check. No platform can make a subagent read-only from a `SKILL.md` file. Let the subagent use the shell, because Codex uses the shell to read files.
4. Give each subagent the absolute paths of the reference files that it uses and of the files that it examines. The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.
5. Start a new subagent for each check: each reviewer and each confirmer in each round, and each reader task. Do not give a second check to a subagent, because that subagent knows the previous text and findings.
6. Start the subagents of each round as "When you do a round" tells you.

## When you do a round

Each round contains the checks of all files that it examines. Do not do a different series of rounds for each file. For the round limits, count the rounds of all files together, because the limits are for the full change. "When a blocking problem stays open at a limit" gives the limits. A review round has 3 reviewers: one reviewer of each class for the sections in the `Changes:` line.

The Markdown files of a review target are these files:

- Its first file.
- Each Markdown file in the folder of a Skill of the review target.
- Each file in the `Changes:` line of round 1.

A pointer target that is not in this list is not a file of the review target.

The round list gives the files of a review round, in the alphabetical sequence of their paths. In each review round, the round list contains each file in the `Changes:` line of the reviewer prompt.

Each review round and each reader-test round has these steps:

1. In a review round, start the 3 reviewers in one message.
2. After you have the input of the confirmers or the readers, start them in groups of 3. For the confirmers of a review round, the input is the confirm lists of "During and after a review round". Put the 3 readers of a reader-test round in one group. Start each group in one message. After you get all reports of a group, start the next group. Codex permits a maximum of 3 subagents at the same time.
3. Wait for the reports of all subagents of the round:
   - Claude Code: Wait for one message for each subagent.
   - Codex: Call `wait_agent` again until each subagent gives its report. Before you get all reports, do not stop, because a stopped main agent gets no report. If the `close_agent` tool is available, close each subagent after its report. The maximum of 3 subagents includes each open subagent.
   - OpenCode: Wait for the message that gives the reports of all `task` tool calls.
4. Before you get all reports of the round, do not change a file that the round examines. This makes sure that all subagents of the round read the same text.
5. A subagent fails when the tool call that starts it gives an error. A confirmer or a reader also fails when it stops without a report. A reviewer also fails when its last message does not give the report path of each file in the round list. Examine the report folder of a reviewer only after its last message. When the report form gives exit code 2 for a missing report path, the reviewer of that report folder also failed. If a subagent fails, do not wait for a report from it. For a confirmer or a reader, its group is complete without that report. Start the other groups of the round as item 2 tells you. Then get all other reports of the round. On Codex, if the `close_agent` tool is available, close each failed subagent. Then start one new subagent for each failed subagent, as items 1 to 3 tell you. Start the new reviewers in one message. Give each new reviewer the same prompt and the same report folder as the failed reviewer. Do not add a list of files to that prompt. With this sequence, a maximum of 3 subagents operate at the same time.
6. If a new subagent also fails, do these checks as "When no subagent is available" tells you:
   - Each review check whose report is missing, for a reviewer whose new subagent failed. A report is missing for each file in the round list that has no report in the report folder of that reviewer.
   - Each check of a confirmer or a reader whose new subagent failed.
   - Each check of the round that you did not start.
   - All checks of the later review rounds and reader-test rounds. The tool that starts subagents failed 2 times for the same check.

   When a subagent gave the report for a check, do not do that check again. Do not review a file again when its report is in the report folder of that reviewer.
7. After the last report of the round, correct the files. Do not correct a file between 2 groups of the round. The last report can come from a new subagent or from "When no subagent is available".

## Before each review round

1. Before review round 1, make one new round folder that is not in the project, with the command `mktemp -d`. Use this folder for the self-check and the reader test. Do not use a specified path, because a different session can use the same path.
2. At the start of each review round, save a copy of each Markdown file of the review target as `<round folder>/round-<n>/<file path>`. `<n>` is the number of the round. `<file path>` is the path of the file in the project folder. Do not make the copy in a tool call that saves a report. Save each copy as "When you save a file or run a command in a round" tells you.
3. Run the check script on the full file of each Markdown file of the review target, as "When you run the check script" in `SKILL.md` tells you. Save the output of each round to a new JSON file in `<round folder>/round-<n>/`.
4. Give the path of the JSON file to each reviewer of the round.

## When you start the reviewers

In each round, start 3 new reviewer subagents for the sections in the `Changes:` line, one of each class, as "When you do a round" tells you:

| Reviewer | Checks | Reference files |
|---|---|---|
| Loading reviewer | The loading rules for each file type, and the Agent Skills specification for a Skill | `review.md`, `loading-rules.md`, `agent-skills-spec.md` for a Skill, and the pointer targets |
| ASD-STE100 reviewer | The STE rules | `review.md`, `ste-rules.md`, `technical-terms.md`, and the pointer targets |
| ISO 24495-1 reviewer | The plain-language checks | `review.md`, `plain-language-checks.md`, and the pointer targets |

The pointer targets are the files that the pointers in the files of the review target identify. The glossary and `MEMORY.md` are not pointer targets. A reviewer reviews them only when the job changed them, through the `Changes:` line. Each reviewer reads the prompt in this file to know the requirements for its reports. A reviewer does only the review that the author gave to it.

Copy this prompt for each reviewer. Replace only the placeholders. Do not change the report requirements. Keep the lines for the reviewer that you start. Remove the label in angle brackets from these lines. Remove the lines for the other reviewers. In the write job, also remove the 2 prompt lines that start with "For a section that the author moved" and "Also give a finding for each text that the author moved". Give the same `Review target:` line, `Changes:` line, and pointer targets to each reviewer.

```text
You are the <name> reviewer for Agent instructions: files that an agent reads as instructions.
<For the loading reviewer only:> Check class: loading reviewer
<For the ASD-STE100 reviewer only:> Check class: ASD-STE100 reviewer
<For the ISO 24495-1 reviewer only:> Check class: ISO 24495-1 reviewer
This task is read-only. Only read files. Do not edit, make, move, or delete files.
Do not run commands that change files, Git data, or external services.
Exception: save your reports in your report folder, as this prompt tells you. Write no other file.

Review target: <for each review target: the absolute path of its first file, for example the SKILL.md file of a Skill, or AGENTS.md>
Changes: <for each Markdown file that the job made or changed: its absolute path and its changed sections, or "all" for a new file. For a new file that contains only moved sections, write "no changed sections". In round 2, give only the sections that the previous round changed. In the edit job, include the pointer of each section that you moved, but not the text of that section>
Report folder: <absolute path of <round folder>/round-<n>/loading/, <round folder>/round-<n>/ste/, or <round folder>/round-<n>/iso/>
Job: <"the write job" or "the edit job">
Project folder: <absolute path>
Target platforms: <the target platforms that you found with loading-rules.md, for example "Claude Code, Codex, and OpenCode">
Rules: <absolute paths of all reference files for this reviewer in the table>
Report requirements: <absolute path of this review.md file>
Glossary: <absolute path of GLOSSARY.md or CONTEXT.md, or "none">
Pointer targets: <absolute paths of the files that the pointers in the files of the review target identify, or "none">
Check script findings: <absolute path of the JSON file of the check script for this round>

Before the review, read the report requirements from their file.
Do only this review. Do not give it to a subagent.
Review only the files in the Changes line.
The check script findings give the pointer list: each sentence that names a file path, with its line and heading.
Before you give a finding, read each file in the Pointer targets line and each file that a sentence in the pointer list names.
Give no finding for a problem that one of these files already solves.
Read the glossary only to examine a word that you found for a rule. When the glossary gives that word, and the glossary meaning is the meaning of the word in the text, give no finding for the word.
Do not compare the text with the glossary or with MEMORY.md. Give no finding that only the glossary or MEMORY.md causes.
Read each file of the review target that is not in the Changes line only for context. Also read each pointer target that is not in the Changes line only for context. Read each file that is not Markdown in the folder of a Skill only for context. Give no finding for these files.
In each tool call that reads a file, give the absolute path of that file. Do not use `cd`, `*`, or a loop to read files, because the tool calls must show each file that you read.
The number in round-<n> of your report folder is the number of the round.
In each round, the sections under review are only the sections in the Changes line.
Read the full text of each file only for context. Give no finding for text that is not in a section under review.
For a section that the author moved, the Changes line gives only its pointer. For the words of that section, give only the loading-rules.md finding that this prompt gives below.
Use each rule in the rule files for the sections under review.
Skip each rule that ends with "(script check)". The check script findings give the problems for these rules.
The ISO 24495-1 reviewer examines the conditions of the pointers and the headings.
Write the file size of each file and its limit.
Give a finding for each text to move in a section in the Changes line.
Also give a finding for each text that the author moved and that does not obey loading-rules.md. In the Text field, write the pointer of that text in quotation marks. If that text has no pointer, copy the heading of the moved section.
<For the ISO 24495-1 reviewer only:> For each sentence in the pointer list that is a pointer, decide whether the heading and the sentence give the condition to read the target.
<For the ISO 24495-1 reviewer only:> Also find each pointer that names no file, for example "that file".
<For the ISO 24495-1 reviewer only:> In "When you select the text" in plain-language-checks.md, skip the rule about long text. The loading reviewer examines that rule.

For each Markdown file that you review, save one report as <report folder>/<file path>.md. <file path> is the path of the file in the project folder.
For example, save the report of skills/x/SKILL.md as <report folder>/skills/x/SKILL.md.md.
Save each report with one tool call, alone in a new message. Wait for its result before you review the next file.
If the report folder already has the report of a file, do not review that file again. Also do not change that report.
After you save all reports, give only the list of the saved paths in your last message.

Start each report with the blocking checklist, in this form:
Blocking checklist:
1. "<a rule that ends with "(blocking)", word for word>" - <each place in the sections under review of that file that does not obey the rule: its line and its text in quotation marks, or "none">
Put each rule of your rule files that ends with "(blocking)" in the checklist. Do not put a rule that you skip in the checklist.
For the checklist, examine only the sections under review of that file.
After the checklist, give one finding for each place in the checklist. Then give the findings for the other rules.

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
In the Text field, write only words from the file of that report.
For a file-size problem or a file-location problem, copy the heading or the first line of the file.
Give the paths and the line numbers in the Problem field.
Use this form for each finding. Keep the necessary lists apart from the findings.
If you find no problem, write "No findings" after the necessary lists.
Do not add other notes or questions.
```

### During and after a review round

1. Each round examines only the sections in the `Changes:` line. In round 1 of the edit job, give each section of the changed part in the `Changes:` line. For a section that you moved, give only its pointer. Only the text of these sections is the changed text. The changed text of the write job is all text of each new file. The reviewers read the full files and the pointer targets only for context.
2. Before you change a file of the round, run the report form of the check script once for each file in the round list. Run it as "When you run the check script" in `SKILL.md` tells you. Give the 3 reports of that file: `<round folder>/round-<n>/loading/<file path>.md`, `<round folder>/round-<n>/ste/<file path>.md`, and `<round folder>/round-<n>/iso/<file path>.md`. Do not give a report of a different file. In that command, write the full absolute path of the file under review and of each report file. Do not use `*`, because the command must show which reports the script examined. Also obey the items for a command in "When you save a file or run a command in a round". The script refuses a path with `$` or `*`. Use only the findings in the blocking list and the advisory list. Do not use the findings in the dropped list.
3. For each reviewer with one or more reports in the confirm lists of the round, do the vote in "When a reviewer has blocking findings". The folder after `round-<n>/` in the path of a report gives its reviewer. Do not start confirmers for a reviewer that has no report in a confirm list. Before you get all confirmer reports of the round, do not correct a file.
4. The findings to use are the script findings and the confirmed blocking findings in the changed text. For each of these findings, correct your text, or reject the finding. Record each sentence that you change for a confirmed blocking finding, with its rule. Item 5 uses this record in the next round. Put each script finding about text that you cannot edit in a warning. To reject a finding, give the rule that permits the text. An example is quoted text. Write each finding that you reject in a warning.
5. Put each of these findings in a warning, with its rule. Do not correct the text of these findings:
   - Each finding in the advisory list.
   - Each finding about text that is not in the changed text.
   - Each finding about the words of a moved section, also a finding of the loading reviewer about the place of these words.
   - Each new finding for a different rule on a sentence that you changed for a confirmed blocking finding in the previous round. This tie-break ranks no rules. It stops 2 rules from changing one sentence again in each round.
6. A round passes when you accept no script finding and no confirmed blocking finding in the changed text. A finding that you reject with a warning does not make the round fail. A finding in a warning never makes a round fail. The self-check stops when a round passes, or after round 2.
7. If the round does not pass, start all 3 reviewers again in the next round, but only for the sections that the previous round changed. Give these sections in the `Changes:` line. A section is changed when one or more of its lines changed. To find these sections, compare each file and its copy in the folder of the previous round, for example with `diff`. Do not find them from memory. A correction for one source can make the text incorrect for a different source.
8. After round 2, do not correct the text for a confirmed blocking finding that you accept. Each of these findings stays open as a blocking problem. Correct the script findings. Then do the check in "After the last review round" on the text that these corrections changed.

### When a reviewer has blocking findings

Do this vote for each reviewer with one or more reports in the confirm lists of the round. Do the vote in each job, also for a small change. Also do the vote when you expect to reject the findings, because only the vote decides which blocking findings count.

1. In the confirmer prompt below, give the paths of the reports of that reviewer in the confirm lists. Also give each finding of these reports in the blocking lists, with the path of its file, its rule, and its text. Give the findings numbers in one series across all files. Do not give the Problem field or the Correction field of the reviewer.
2. Start 2 new, read-only confirmer subagents for the reviewer, as "When you do a round" tells you. The confirmers are checks of the same round. Start them in groups of 3. Start the 2 confirmers also when the reports have many findings, because only a confirmer can confirm a blocking finding. Wait for the reports of the 2 confirmers, also when the first confirmer answers "yes" for each finding. A round is complete only after each check gives its report.
3. When a confirmer gives no answer line for a finding, that confirmer answered "no" for that finding. A split is a finding with one "yes" and one "no" from the 2 confirmers.
4. If the reviewer has one or more splits, start 1 new, read-only confirmer subagent for the reviewer after the reports of the 2 confirmers. Give it the same Reports line as the 2 confirmers. In its Findings line, give only the splits, with their numbers from the first 2 confirmers. Wait for its report. A review round has a maximum of 9 confirmers: 2 for each reviewer, and a third confirmer for each reviewer with splits.
5. A blocking finding is confirmed when 2 of its confirmers answer "yes".

Copy this prompt for each confirmer. Replace only the placeholders.

```text
Check class: confirmer
This task is read-only. Only read files. Do not edit, make, move, or delete files.
Do not run commands that change files, Git data, or external services.

Reports: <absolute paths of the reports of one reviewer in the confirm lists of the round>
Findings: <for each finding in the blocking lists of these reports: a number, the absolute path of the file under review, the rule in quotation marks, and the text in quotation marks>

Read each file under review from the disk.
Also read the files that the pointers in these files identify.
For each finding, decide whether the text in the file does not obey the rule.
If a file that a pointer identifies already gives what the rule asks for, answer "no".
Give one line for each finding in this form:
<number>. <"yes" if the text does not obey the rule, or "no">: <one sentence that gives the cause>
Give only these lines. Do not give the work to a subagent.
```

### After the last review round

Do this check on each correction after review round 2. When you did 2 review rounds, also do it on each later correction. Examples are a correction after a reader-test round or after a failed output test.

1. If a changed pointer has no condition, add the condition to that pointer.
2. Run the check script on the full file of each changed file, as "When you run the check script" in `SKILL.md` tells you.
3. Correct each script finding in the text that the corrections changed. After each correction, do items 2 and 3 again.
4. Send a message that gives the condition of each changed pointer in quotation marks.
5. Add a warning that tells that no reviewer examined the text that these corrections changed.

## After the self-check: the reader test

Start the reader test only after the self-check stops. Do not start a reader subagent while a review round continues.

Do the reader test in each job, also for a small change. Also do the reader test when you expect that it finds no problem. Only the reader test shows how a new reader obeys the file.

1. Write 3 tasks for the change. Do not write 3 tasks for each file. Also write only 3 tasks for a change with many files or many changes, for example a new Skill. Each task tests the new or changed rules of the change:
   - Write 2 typical tasks with different inputs. If the user told you that an agent did not obey an instruction, make one task from that problem.
   - Write 1 out-of-scope task. It looks almost the same as a typical task, but the new or changed instruction does not change it. It uses the same file, words, or condition as the instruction, but the instruction is not applicable to it. An example for a rule about release branches is a task that makes a feature branch. If the instruction is applicable to all project tasks, use a different project or platform for this task.
   - Before you select the out-of-scope task, compare the task with the condition of each rule and each pointer in the files of the readers. Select a task that agrees with no condition. If a condition is applicable to the task, write a different task. For example, a pointer "Before you write code about an Order, read `GLOSSARY.md`" is applicable to a task about the code of an Order.
2. Before reader-test round 1, write the tested quotes for each typical task. A tested quote is a short quote of a new or changed rule that the task tests. A typical task can have more than one tested quote. Then compare the tested quotes with the new or changed rules. Write each new or changed rule that no tested quote is from in the end-of-run report.
3. Write the 3 tasks and their tested quotes in a tasks file in the round folder. Use this form:

   ```json
   [
     { "task": "<typical task 1>", "kind": "typical", "tested": ["<quote>"] },
     { "task": "<typical task 2>", "kind": "typical", "tested": ["<quote>"] },
     { "task": "<out-of-scope task>", "kind": "out-of-scope" }
   ]
   ```

4. Use the same tasks and the same tested quotes in each reader-test round. Change a tested quote only when a correction changes its text. Then write the new text in the tasks file.
5. At the start of each reader-test round, save a copy of each file that the round tests as `<round folder>/reader-round-<n>/<file path>`. Save each copy as "When you save a file or run a command in a round" tells you. Each reader-test round has the 3 tasks of the change. A reader-test round has a maximum of 3 readers. Give each task to a different new subagent. Start the subagents as "When you do a round" tells you.
   - Give each reader the files of the readers. The first file of the review target is the first file of the readers. For a Skill, the first file is its `SKILL.md`. For an Agent instruction that is not in a Skill, the first file is each changed entry file. When no entry file changed, the first file is the entry file of the project, for example `AGENTS.md`. Then give each new or changed file.
   - Also give a file that contains only an `@path` line or only moved sections. A reader can find that a line identifies an incorrect file.
   - The reader starts the task from the first file, as an agent starts a task. Then the reader can also find a pointer that does not identify a changed file.
6. Make sure that each subagent does a dry run. The first line of the reader prompt tells the subagent to do a dry run.
7. After the last report of the round, save each reader report to a new file in `<round folder>/reader-round-<n>/`. Save each report as "When you save a file or run a command in a round" tells you.
8. Before you change a file of the round, run the report form for reader reports one time for the round. The script compares each quote with the files on the disk. Run the report form for reader reports as "When you run the check script" in `SKILL.md` tells you. Write the full path of each file, as item 2 of "During and after a review round" tells you. In that command, also obey these rules:
   - Give the reports in the sequence of the tasks in the tasks file.
   - Give each file of the readers with its copy. For a changed file, give the copy that you saved before your first change. For a new file, give "none", because all lines are new. For a file that the job did not change, give the file as its copy.
   - Do not use the quotes in the dropped list.
9. The script finds 2 types of problems. A typical task has a problem when its report does not use a tested quote. The out-of-scope task has a problem when its report uses an added or changed line.
10. For each typical-task report, write a closed list: each step, its quote, and "yes" or "no". Write "yes" when the step obeys its quote for the task. Save each closed list to a new file in `<round folder>/reader-round-<n>/`, as "When you save a file or run a command in a round" tells you. Start the file name with `closed-list-`. Write one line for each step in this form: `<number>. <yes or no>: "<step>" - "<quote>"`. For each report with one or more "no" answers, do the vote in "When a reader step does not obey the instruction".
11. Do not change a file of the readers until all readers and confirmers of the round give their reports. Then all checks of a round read the same text.
12. Correct your text for each problem of the script and each confirmed wrong step. For each quote in the unclear list, correct your text or write a warning. An unclear part never starts a new reader-test round.
13. A reader-test round passes when it has no problem of the script and no confirmed wrong step. If the round does not pass, do items 15 and 16 after your correction. Then do the test again. Do a maximum of 2 reader-test rounds. After reader-test round 2, do not correct the text for a problem of the script or a confirmed wrong step. Each of these problems stays open as a blocking problem.
14. If you cannot correct a problem without help from the user, the problem stays open as a blocking problem. Do not stop the reader test for a question to the user. Ask the question that "When a blocking problem stays open at a limit" gives.
15. After a reader-test round, a correction can change text. If you did fewer than 2 review rounds, start the reviewers again for that text before the next reader-test round. This review round is one of the 2 review rounds.
16. If you did 2 review rounds, do the check in "After the last review round". Then do the next reader-test round, if the limit permits it.
17. If you correct an unclear part after the last reader-test round, run the check script on the full file. Correct each script finding in the text that this correction changed. Add a warning that tells that no reader examined this text.

Use this prompt for each reader:

```text
Check class: reader
This task is a dry run. Only read files. Do not write files, change Git data, or change external services.

Instruction files: <the absolute paths of the files of the readers: first the first file of the review target, then each other file>
Project folder: <absolute path>
Task: <the task text>

Start the task from the first instruction file, as an agent starts a task.
Before your first step, read each instruction file from the disk with a file tool. A copy that loaded at the start
of your session can be older than the file.
Read the files that the instruction tells you to read for this task.
Use only these shell commands: `cat`, `head`, `tail`, `grep`, `rg`, `ls`, `wc`, `diff`, `cd`, `echo`, `pwd`, and `sed -n`.
You can also use `find`, but not with `-delete`, `-exec`, `-ok`, or `-fprint`.
You can also use `git status`, `git diff`, `git log`, `git show`, `git ls-files`, `git rev-parse`, and `git remote -v`.
You can also use `git branch` alone, or only with `-a`, `-r`, or `--list`.
You can also use `git tag` alone, or only with `-l` or `--list`.
After `--list` or `-l` in these `git branch` and `git tag` commands, you can give a pattern, for example `'v1.*'`.
In each of these `git` commands, you can write `-C <folder>` after `git`.
You can use a loop `for <name> in <words>; do <commands>; done` only when each command in the loop is on this list.
Do not send the output of a command to a file. You can add only `2>/dev/null` or `2>&1` to a command.
Give this report in 3 parts. Start each part with its heading line, as this form shows:
Part 1: Steps
<number>. <one step for the task. Write the steps in sequence.>
Part 2: Used parts
<step number>. "<the part of the instruction that you used for that step>"
Part 3: Unclear parts
- "<a part of the instruction that was not clear to you>" - <one sentence that gives the cause>
If a step uses 2 quotes from the instruction, write 2 lines with the same step number in part 2.
If all of the instruction was clear to you, write "None" in part 3.
Copy each quote from the instruction word for word. A script compares each quote with the instruction files.
Quote only the instruction files. Do not quote this prompt.
In each line of part 2 and part 3, use quotation marks only around the quote from the instruction.
Give only these 3 parts. Write each step and each quote from the instruction on a different line. Put long text, for example a prompt, at the end of part 1.
```

### When a reader step does not obey the instruction

Do this vote for each typical-task report whose closed list has one or more "no" answers. The reader test gives the closed list. Do the vote in each job, also for a small change. Also do the vote when you expect to correct no text.

1. In the confirmer prompt below, give the path of the saved closed list, the task, and the paths of the files of the readers. Also give each step with "no" and its quote. Do not give your cause for the "no".
2. Start 2 new, read-only confirmer subagents for the report, as "When you do a round" tells you. The confirmers are checks of the same reader-test round. Start them in groups of 3. A reader-test round has a maximum of 4 confirmers: 2 for each typical-task report.
3. Wait for the reports of the 2 confirmers, also when the first confirmer answers "yes" for each step. A round is complete only after each check gives its report.
4. A wrong step is confirmed when one or more of its confirmers answer "yes".

Copy this prompt for each confirmer of a reader step. Replace only the placeholders.

```text
Check class: confirmer
This task is read-only. Only read files. Do not edit, make, move, or delete files.
Do not run commands that change files, Git data, or external services.

Instruction files: <the absolute paths of the Instruction files line of the reader prompt>
Project folder: <absolute path>
Task: <the task text>
Report: <absolute path of the saved closed list>
Steps: <for each step with "no" in the closed list of one reader report: a number, the step in quotation marks, and its quote in quotation marks>

Read the instruction files from the disk.
For each step, decide whether the step does not obey its quote from the instruction for this task.
Give one line for each step in this form:
<number>. <"yes" if the step does not obey its quote, or "no">: <one sentence that gives the cause>
Give only these lines. Do not give the work to a subagent.
```

## After the reader test: the output tests and the manual checks

Start these steps only after a reader-test round passes. An output test or a manual check costs more than a reader test. Run these tests only on text that a reader understands.

1. Find the output tests, the load test, and the manual checks of each changed file in the project. A project often keeps the tests of a Skill in a folder with a `README.md` file, for example `tests/skills/<category>/<name>/`. If the project has no output test and no manual check for the changed files, the reader test is enough. Then write the end-of-run report.
2. Select the touched output tests. An output test is touched when one of its statements examines the result of a new or changed rule. Read each statement to decide. If you are not sure, select the test.
3. Select the touched manual checks. A manual check is touched when a new or changed rule changes its human path. Read the setup and the pass criteria of each check to decide. If you are not sure, select the check.
4. If the change makes a new human path that no manual check examines, add a manual check for that path. Write its setup and its pass criteria in the form of the other manual checks of the project. Then select the new check.
5. For each selected test, record the new or changed rule that it examines. The end-of-run report gives these rules.
6. Run only the selected output tests. Give their identifiers to the runner of the project, for example with `--ids 3,7`. Do not run all output tests, because the full set costs too many tokens for one change. Run each test as the `README.md` of the tests tells you. Then grade each test as that `README.md` tells you.
7. Run the load test only when the change edits the `description` of a Skill. Only the `description` changes the result of the load test.
8. Run each selected manual check 1 time, as "When you run a manual check" tells you.
9. When a test fails, correct the text one time. Then do these checks on the text that the correction changed:
   - If you did fewer than 2 review rounds, do 1 review round. If not, do the check in "After the last review round".
   - If you did fewer than 2 reader-test rounds, do 1 reader-test round. If not, add a warning that tells that no reader examined this text.
10. Then run only the failed tests again. Do not run a test again when it passed. After a correction for a failed manual check, run that check 2 times. The check passes only when it passes in the 2 runs.
11. If a test fails again, do not correct the text again. The failed test stays open as a blocking problem. An output test runs a maximum of 2 times. A manual check runs a maximum of 3 times.

### When you run a manual check

In a manual check, you are the test driver, not the user. The test driver starts the session, sends the request of the check, and gives the answers that the check gives. Answer only the questions of the test session, and only with these answers.

Do not run a manual check in these 2 cases. Put the check in a warning, and write that the user must run it.

- You cannot start an interactive session, for example because `tmux` or the command of the agent is not available.
- A pass criterion examines the user interface as the user sees it, for example the color or the layout of a dialog. The screen text of `tmux` does not show these items.

Do these steps for each run of a manual check:

1. Make a copy of the test project in a new folder that is not in the project, for example with `mktemp -d`. Make the setup of the check in that copy, as the `README.md` of the tests tells you.
2. Start the agent in a new `tmux` session in the copy:

   ```sh
   tmux new-session -d -s <session name> -x 200 -y 50 -c <copy folder> '<agent command>'
   ```

3. Send the request of the check with `tmux send-keys -t <session name> '<request>' Enter`.
4. Read the screen with `tmux capture-pane -p -t <session name>`. Read the screen again until the agent asks a question or stops.
5. Save the screen text to the screen-text file in the round folder. At the first save, make a new file. At each later save, add the text to the end of that file.
6. When the agent asks a question, send the answer of the check with `tmux send-keys -t <session name> '<answer>' Enter`. Then do step 4 again.
7. Compare the result with each pass criterion of the check. When a pass criterion gives a file or Git data, examine the copy.
8. Stop the session with `tmux kill-session -t <session name>`.
9. Record the evidence: the check, the result of each pass criterion, and the path of the screen-text file. If the change has a pull request and the user gives approval, add the evidence to the pull request. In the other cases, give the evidence in the end-of-run report.

## When a blocking problem stays open at a limit

The budget of a change is a number of rounds and test runs, not a number of tokens. These limits are for the full change. Count each round, also a round after a correction for a failed test.

| Check | Limit for the change |
|---|---|
| Review rounds | 2 |
| Reader-test rounds | 2 |
| Corrections for a failed output test or manual check | 1 |
| Runs of one output test | 2 |
| Runs of one manual check | 3 |

A blocking problem is one of these problems that you did not correct:

- A confirmed blocking finding in the changed text.
- A problem of the script or a confirmed wrong step in a reader-test round.
- An output test or a manual check that failed in its last run.

At a limit, each blocking problem stays open. Do not do more rounds or test runs for it. Do all other checks of the change first.

When no user can answer the question, do not ask it. Examples are a subagent and an output test of this skill. Put the question, its blocking problems, and its 3 answers in the end-of-run report. Do not write in the report that the change passed.

When a user can answer the question, do these steps:

1. Ask the user one question. In the text of the question, give each blocking problem: its check, its file, and its text in quotation marks or its failed test. Put the problems before the answers. Give these 3 answers:
   - Correct again: Correct each blocking problem. Then examine the corrected text with new rounds and test runs. The same limits are applicable to them.
   - Accept with a warning: Put each blocking problem in a warning.
   - Stop the change: Do not change a file again. In the Summary part of the end-of-run report, write that the user stopped the change.
2. Do the action of the answer. Then write the end-of-run report.

## When no subagent is available

This section is applicable when no tool starts a subagent. It is also applicable to the checks that item 6 of "When you do a round" gives.

Do each review and each reader task as a different check. One review check is one reviewer class for one file in the round list. Use the same reviewer prompt, with the same `Review target:` line and `Changes:` line, so that you also read the pointer targets. Use the same reader prompt and the same round limits. Each check has a different report file. With these files, the user can examine each finding and the sequence of the checks.

Save each review report at the path that the reviewer prompt gives: `<report folder>/<file path>.md`. Save each reader report in `<round folder>/reader-round-<n>/`. In this section, you can write these report files. The limits in the reviewer prompt and the reader prompt do not stop these files.

Before the first check of each round, save a copy of each file that the round examines. Send only this tool call in a new message. Put no other tool call in that message. This message shows that you saved the copy before the checks of the round.

Do these 2 steps for each check: each review and each reader task. Do not start the next check before you complete step 2.

1. Do the check as the reviewer prompt or the reader prompt tells you.
2. Save the full report to a new file. Send only this tool call in a new message. Put no other tool call in that message, for example a `git` command or a copy of the file. Wait for its result before you start the next check. This tool call writes only one file. Do not change a report after you save it.

If you find an error in a saved report, do not correct that file. Give the correction in the Warnings part of the end-of-run report.

In each round, do each check again. Do not copy a report of an earlier round, also when the text of that check did not change. Make each report from a check that you do in the current round.

Do not save 2 reports in one tool call or in one message. Do not send 2 tool calls at the same time. These 2 rules are applicable in each round, also when the reports of a round are short. These 2 rules are also applicable when a round examines only one line, and when a report gives "No findings". The sequence of the messages shows that you did the checks one after the other.

Write each report in full. In each finding, write the full rule. Do not refer to a different finding or a different report.

The end-of-run report cannot replace these files. Give the path of the report folder in the warning about the checks that you did yourself.

Do the checks in this sequence:

1. In each review round, do each review check that no subagent did. Do the reviewer classes in the sequence of the reviewer table. For each class, do the files in the sequence of the round list.
2. Start each review report with its title, for example "Round 2: ASD-STE100 review, skills/x/SKILL.md". Then write the blocking checklist of the reviewer prompt. Give each finding in the form of the reviewer prompt. Keep the necessary lists apart from the findings. Give no other items.
3. Do not do the vote of "When a reviewer has blocking findings". Each finding in the blocking list counts as a confirmed blocking finding. When the new subagent of a confirmer also fails, each finding of that vote also counts as a confirmed blocking finding.
   Also do not do the vote of "When a reader step does not obey the instruction". Each "no" in a closed list counts as a confirmed wrong step.
4. Correct your text after each round. Then do the next round, or write that the self-check stopped.
5. After the self-check stops, do each reader task that no subagent did, one after the other. Use these titles, with the number of the reader-test round:
   - "Reader-test round <n>, reader task 1 (typical): <task>"
   - "Reader-test round <n>, reader task 2 (typical): <task>"
   - "Reader-test round <n>, reader task 3 (out-of-scope): <task>"
6. In each reader report, give the 3 parts in the form of the reader prompt. For each step, write the part of the instruction that you used in quotation marks.
7. When you write the end-of-run report, add the warning about the checks that you did yourself. Write it as the Warnings part in `end-of-run-report.md` tells you. In this warning, also write that no vote occurred for the blocking findings and the wrong steps.

## When a reviewer gives a finding

- When a reviewer gives a finding, correct your text, or reject the finding as `references/review.md` tells you.
- If you cannot correct a finding without help from the user, do not stop the job for a question to the user. The user reads all questions in the end-of-run report. An example is a word that makes a new technical noun in the project necessary. Do the review rounds and the reader-test rounds until each one stops. Then put the finding and the question in the Warnings part of the end-of-run report. A confirmed blocking finding in the changed text is an exception: it stays open as a blocking problem. Ask about it as "When a blocking problem stays open at a limit" tells you.
- A finding comes only from a reviewer report or from the check script. When you find a problem yourself, give it in a warning, not as a finding. In that warning, give the text in quotation marks and the problem.

## When you save a file or run a command in a round

The tool calls of a round show which files you saved and which files a command examined. A shell variable, a `cd`, or a loop hides the path of a file. The main agent obeys this section. A subagent obeys the limits in its prompt.

- Save each copy of a round, each reviewer report, each reader report, and each closed list with the file-write tool of the platform:
  - Claude Code: The tool is the `Write` tool.
  - Codex: The tool is the `apply_patch` tool. In the patch text of the tool call, write one `*** Add File:` line.
  - OpenCode: The tool is the `write` tool.
- In that tool call, give the full absolute path of the file. Save one file in each tool call.
- Do not save these files with a shell command, for example `cat <<EOF >`, `cat >`, `printf >`, or a loop. You can save the JSON output of the check script with `>`, as `SKILL.md` shows.
- In each shell command, also in the report form of the check script:
  - Write the full absolute path of each file.
  - Do not set or use a shell variable.
  - Do not use `cd` or a loop.
