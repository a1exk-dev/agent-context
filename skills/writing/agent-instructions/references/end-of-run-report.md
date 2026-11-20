# End-of-run report

## When you write the end-of-run report

The job stops with one report. Use this template. Do not write a part that has no items.

1. In the edit job, find each extraction candidate before you write the report. The rules for the extraction candidates are below the template.
2. Write the report in the template below. Obey the rules for each part. These rules are below the template.
3. When you write the report, compare it with each reviewer report. Include each warning that this skill or its reference files tell you to add. In the edit job, also include each extraction candidate. For each finding in a warning, give its rule, its text in quotation marks, and its problem.
4. Save the full report to a file in a temporary folder that is not in the project.
5. After you save the report file, read it. Then your last message gives the full lists, not a short summary.
6. Send the full text of the file as your last message. Copy the text without changes. Do not write the report again in different words. Then the user can see the full lists and select the changes that they want.

```markdown
## Summary
<The files that the job wrote or changed, with their paths, and the changes.>
<For an edit job after an agent did not obey an instruction: the previous condition in quotation marks, or "no condition".>

## Warnings
- <One item for each warning that is applicable.>

## Output tests and manual checks
- <Test>: <passed, failed, or not run> - "<the new or changed rule that the test examines>"

## Extraction candidates
- <Section> → <recommended file>. Pointer: "<pointer>"

## Base-list words with a project meaning
- <Word>: <the meaning in the glossary>
```

In the Summary part of the edit job, include each problem that you recorded before you changed the file. Give the cause of each problem and the change that corrected the problem.

In the Warnings part, add one item for each of these warnings that is applicable:

- Each blocking problem that stayed open at a limit, with the question to the user and the answer. When you write this item, find these problems in "When a blocking problem stays open at a limit" in `references/review.md`. When no user was available to answer, give the question with its 3 answers. Then write that the change did not pass.
- Each finding that you rejected, with the rule that permits the text.
- Each finding that a review round tells you to put in a warning. When you write this item, find these findings in item 5 of "During and after a review round" in `references/review.md`.
- In the edit job, each pointer in an unchanged part that does not give the condition to read its target. The pointer list of the check script gives each sentence that names a file path.
- Each problem from the reader test that you cannot correct.
- In the edit job, each problem that you find in an unchanged part of a file that you change. Give its text in quotation marks and its rule. Do not correct it.
- Each selected manual check that you did not run, with its cause. Write that the user must run it.
- Each new or changed rule that no tested quote of a reader task is from. Write that no reader task tested these rules.
- Each text that only the check script examined: a correction after review round 2, and each later correction when you did 2 review rounds. Write that no reviewer examined these texts. If no reader examined a text, write that no reviewer or reader examined it.
- Each text that a correction of an unclear part after the last reader-test round changed. Write that no reader examined these texts.
- Each check that you did yourself because no subagent was available or because a new subagent also failed. Give the path of the report folder. Write that no vote occurred for the blocking findings and the wrong steps of these checks. If you did a reader task yourself, write that you were not a new reader for that task.
- Each finding that you cannot correct without help from the user.
- Each case where two sources do not agree and that the table in "When two sources do not agree" in `SKILL.md` does not give, with the obeyed tier.
- A feature that only one platform reads, if you wrote it because the user told you to write it.
- A file type that is not correct for the text, also when you found it during the edit job.
- An entry-file layout that gives no copy of the text to a target platform.
- An Agent instruction that does not load in each session and that no pointer identifies.
- A file size that is more than its limit after you moved text, or after a new Rule. Give the measured file size and the limit.
- A technical noun that is not in the base list and not in the glossary. Give the recommended glossary entry.
- A Skill folder that a target platform does not load, with that platform.
- In the edit job, a Skill that has no `agents/openai.yaml`, with the full text of the recommended file.

Obey these rules for the moved text and the extraction candidates:

- In the Summary part of the write job and of the edit job, give each text that you moved. For each text, give its new file and the reason.
- When the file size was the reason, give the file size before you moved the text, and the limit.
- In the write job, write no Extraction candidates part.
- In the edit job, before you write the report, read "When you recommend text to move" in `references/loading-rules.md`. Then find each extraction candidate in the unchanged parts as that section tells you. Write each candidate in the Extraction candidates part, also when the file is less than its size limit.
- A reviewer other than the loading reviewer can tell you to move text in an unchanged part. Then find the section of that text. If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part.
- Use the heading of each section as the name of its candidate.

In the Output tests and manual checks part, give each output test and each manual check that you selected. Give the rule that each test examines, in quotation marks. For a manual check, also give the evidence that "When you run a manual check" in `references/review.md` tells you to record.

In the last part, give each base-list word that has a different meaning in the glossary.
