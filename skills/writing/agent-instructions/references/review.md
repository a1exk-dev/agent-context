# Self-check and reader test

No check is a script. New subagents do the self-check, because they can examine items that a script cannot examine. Examples are the mood of a sentence, the passive voice, "-ing" technical nouns, and the meanings of words.

## When you start a subagent

1. Find the tool that starts a subagent:
   - Claude Code: The tool is the `Agent` tool. Its previous name is `Task`. Do not use a `fork` type, because a subagent of this type gets the session history of the main agent.
   - Codex: The tool is `spawn_agent` with `fork_turns="none"`. Without `fork_turns="none"`, `spawn_agent` copies the full session history. If you do not find `spawn_agent`, search for it with `tool_search`. Codex can show some subagent tools only after you search.
   - OpenCode: The tool is the `task` tool.
2. Tell the platform clearly to start a new subagent with an empty context window. Start each subagent from the main agent, because a subagent on Codex or OpenCode cannot start subagents.
3. Put the full task and its limits in the prompt. No platform can make a subagent read-only from a `SKILL.md` file. Let the subagent use the shell, because Codex uses the shell to read files.
4. Give each subagent the absolute paths of the reference files that it uses and of the file that it examines. The reference files are in the `references/` folder next to the `SKILL.md` file of this skill.
5. Start a new subagent for each check: each reviewer in each round, and each reader task. Do not give a second check to a subagent, because that subagent knows the previous text and findings.
6. Start one subagent at a time, also in round 2 and round 3. Subagents that operate at the same time can stop at a usage limit. Wait for the report of each subagent before you start the next subagent.

If no tool starts a subagent, go to the section "When no subagent is available". When the tool call that starts a subagent gives an error, also go to that section.

## When you start the reviewers

In each round, start 3 new, read-only reviewer subagents, one after the other:

| Reviewer | Checks | Reference files |
|---|---|---|
| Loading reviewer | The loading rules for each file type, and the Agent Skills specification for a Skill | `review.md`, `loading-rules.md`, and `agent-skills-spec.md` for a Skill |
| ASD-STE100 reviewer | The STE rules | `review.md`, `ste-rules.md`, `technical-terms.md`, and the glossary |
| ISO 24495-1 reviewer | The plain-language checks | `review.md`, `plain-language-checks.md`, the glossary, and the files that the file under review identifies with pointers |

Each reviewer reads the prompt in this file to know the requirements for its report. A reviewer does only the review that the author gave to it.

Copy this prompt for each reviewer. Replace only the placeholders. Do not change the report requirements. Keep the lines for the reviewer that you start. Remove the label in angle brackets from these lines. Remove the lines for the other reviewers. Give the same pointer targets to each reviewer.

```text
You are the <name> reviewer for an Agent instruction: a file that an agent reads as instructions.
This task is read-only. Only read files. Do not edit, make, move, or delete files, except the one file that this prompt tells you to save.
Do not run commands that change files, Git data, or external services.

File under review: <absolute path>
Sections to review: <"the full file" in round 1, or the changed sections in rounds 2 and 3>
Sections that the author can edit: <the part that the user wants to change, for example a new section, or "the full file" for a new file>
Job: <"the write job" or "the edit job">
Project folder: <absolute path>
Target platforms: <the target platforms that you found with loading-rules.md, for example "Claude Code, Codex, and OpenCode">
Rules: <absolute paths of all reference files for this reviewer in the table>
Report requirements: <absolute path of this review.md file>
Glossary: <absolute path of GLOSSARY.md or CONTEXT.md, or "none">
Pointer targets: <absolute paths of the files that the pointers in the file identify, or "none">

Before the review, read the report requirements from their file.
Do only this review. Do not give it to a subagent.
Use each rule in the rule files for the sections under review.
Give the problems in all sections under review, also in sections that the author cannot edit.
The author puts each finding about a section that the author cannot edit in a warning.
The author does not change the text of that section.
<For the loading reviewer only:> First, write each pointer sentence and its condition.
Copy the condition from that sentence. If it has no condition, give a finding.
Include each instruction that tells the reader to read, examine, or obey a different file.
Then write the file size of each file and its limit.
In the edit job, write the extraction candidates in a different list: section heading, recommended file, and pointer sentence.
In the edit job, include the candidates in all sections under review.
In the write job, give a finding for each text to move in a section that the author can edit.
<For the ASD-STE100 reviewer only:> First, write each sentence with its text type
(procedural, descriptive, or note) and its word count.
For each sentence of 18 words or more, write a number after each word,
for example "If(1) no(2) commit(3)". The numbers prevent errors in the count near the limit.
Save this list to a new file in a temporary folder that is not in the project folder.
You can write only this file.
In your report, give the path of the list, not the list.
Then examine each sentence.
Select words from model knowledge. Do not read the ASD-STE100 dictionary
or a copy of the standard.

Give each finding in this form:
- Rule: <the rule number, if the rule has one, and the full text of the rule in quotation marks from the rule files>
- Text: "<the words from the file in quotation marks>"
- Problem: <one sentence>
- Correction: <recommended new text>
Each finding gives one rule from the rule files and the text from the file in quotation marks.
Write the full rule in each finding. Do not refer to a different finding.
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
2. For each finding, correct your text, or reject the finding. To reject a finding, give the rule or the text type that permits the text. Examples are an "-ing" technical noun and quoted text. Write each finding that you reject in a warning.
3. Before you correct your text after a round, save a copy of the file. Do not make the copy in a tool call that saves a report. Put the copy in a temporary folder that is not in the project. In rounds 2 and 3, start all 3 reviewers again, but only for the sections that the previous round changed. To find these sections, compare the file with the copy, for example with `diff`. Do not find them from memory. A correction for one source can make the text incorrect for a different source.
4. The self-check stops when a round gives no finding in your text that you accept, or after round 3.
5. After round 3, put each finding that you did not correct in a warning with its rule. Then do the check in "After the last review round" on the text that the round 3 corrections changed.

### After the last review round

Do this check on each round 3 correction. Also do it on each correction after the reader test when you did all 3 review rounds.

1. Send a message that shows each changed sentence with its text type and its word count.
2. For each sentence of 18 words or more, write a number after each word, for example "If(1) no(2) commit(3)". The numbers prevent errors in the count near the limit.
3. For each changed pointer, also write the condition from that sentence in quotation marks. If a pointer has no condition, add the condition to that sentence.
4. Correct each sentence that is longer than its limit: 20 words for procedural text, 25 words for descriptive text and notes. After each correction, do these checks again.
5. Add a warning that tells that no reviewer examined the changed part.

## After the self-check: the reader test

Start the reader test only after the self-check stops. Do not start a reader subagent while a review round continues.

1. For each new or changed file, write 3 tasks, also when the file has many changes. Each task tests the new or changed rules of its file:
   - Write 2 typical tasks with different inputs. If the user told you that an agent did not obey an instruction, make one task from that problem.
   - Write 1 out-of-scope task. It looks almost the same as a typical task, but the new or changed instruction does not change it. It uses the same file, words, or condition as the instruction, but the instruction is not applicable to it. An example for a rule about release branches is a task that makes a feature branch. If the instruction is applicable to all project tasks, use a different project or platform for this task.
2. Each reader-test round has the 3 tasks of each file. Give each task to a different new subagent, with the path of the new or changed file. Start the subagents one after the other.
3. Make sure that each subagent does a dry run. The first line of the reader prompt tells the subagent to do a dry run.
4. Make sure that each subagent gives its steps for the task and the parts of the instruction that it used.
5. Compare each report with the instruction:
   - A typical task is correct when the steps obey the instruction.
   - The out-of-scope task is correct when the reader uses no part of the new or changed instruction for its steps. The reader can use instructions that did not change.
   - When a part is not clear to a reader, that part has a problem.
6. Do not change the instruction until all readers of the round give their reports. Then all readers of a round read the same text. Then, if a task has a problem, correct your text. After the correction, do the test again. Do a maximum of 3 reader-test rounds.
7. If you cannot correct a problem without help from the user, put it in a warning.
8. When a correction after the reader test changes text, start the reviewers again for the changed part. This check is one of the 3 review rounds.
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

This section is applicable when no tool starts a subagent, or when the tool call that starts a subagent gives an error.

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

The end-of-run report cannot replace these files. Give the path of the report folder in the Warnings part of the end-of-run report. Put this path in the warning that tells that the same agent did all checks.

Do the checks in this sequence:

1. In each review round, do the 3 reviews in the sequence of the reviewer table.
2. Start each review report with its title, for example "Round 2: ASD-STE100 review". Give each finding in the form of the reviewer prompt. Keep the necessary lists apart from the findings. Give no other items.
3. In each ASD-STE100 review report, write each sentence, its text type, and its word count on one line. These lines replace the list file of the reviewer prompt.
4. Correct your text after each round. Then do the next round, or write that the self-check stopped.
5. After the self-check stops, do the 3 reader tasks, one after the other. Use these titles:
   - "Reader task 1 (typical): <task>"
   - "Reader task 2 (typical): <task>"
   - "Reader task 3 (out-of-scope): <task>"
6. In each reader report, give the 3 parts of the reader prompt. For each step, write the part of the instruction that you used in quotation marks.
7. Add a warning that tells that the same agent did all checks and that the readers knew the previous text.
