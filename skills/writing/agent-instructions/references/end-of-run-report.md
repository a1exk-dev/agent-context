# End-of-run report

## When you write the end-of-run report

The job stops with one report. Use this structure. Do not write a part that has no items.

1. Write the report in the structure below. Obey the rules for each part. These rules are below the template.
2. When you write the report, compare it with each reviewer report. Include each warning that this skill or its reference files tell you to add. In the edit job, also include each extraction candidate. For each finding in a warning, give its rule, its text in quotation marks, and its problem.
3. Save the full report to a file in a temporary folder that is not in the project.
4. After you save the report file, read it. Then your last message gives the full lists, not a short summary.
5. Send the full text of the file as your last message. Copy the text without changes. Do not write the report again in different words. Then the user can see the full lists and select the changes that they want.

```markdown
## Summary
<The files that the job wrote or changed, with their paths, and the changes.>
<For an edit job after an agent did not obey an instruction: the previous condition in quotation marks, or "no condition".>

## Warnings
- <One item for each warning that is applicable.>

## Extraction candidates
- <Section> → <recommended file>. Pointer: "<pointer sentence>"

## Base-list words with a project meaning
- <Word>: <the meaning in the glossary>
```

In the Summary part of the edit job, include each problem that you recorded before you changed the file. Give the cause and the change that corrected it.

In the Warnings part, add one item for each of these warnings that is applicable:

- Each finding that you did not correct after round 3, with its rule.
- Each finding that you rejected, with the rule that permits the text.
- In the edit job, each finding about text that is not in the changed part.
- Each problem from the reader test that you cannot correct.
- Each text that a round 3 correction changed, and each text that an advisory correction in the last review round changed. Also each text that changed after the reader test when you did all 3 review rounds. Write that no reviewer examined these texts.
- Each text that a correction of an unclear part after the last reader-test round changed. Write that no reader examined these texts.
- Each check that you did yourself because no subagent was available or because a new subagent also failed. Give the path of the report folder. Write that no vote occurred for the blocking findings and the wrong steps of these checks. If you did a reader task yourself, write that you were not a new reader for that task.
- Each finding that you cannot correct without help from the user.
- Each case where two sources do not agree and that the table does not give, with the obeyed tier.
- A feature that only one platform reads, if you wrote it because the user told you to write it.
- A file type that is not correct for the text, also when you found it during the edit job.
- An entry-file layout that gives no copy of the text to a target platform.
- An Agent instruction that does not load in each session and that no pointer identifies.
- A file size that is more than its limit after you moved text, or after a new Rule. Give the measured file size and the limit.
- A technical noun that is not in the base list and not in the glossary. Give the recommended glossary entry.
- A Skill folder that a target platform does not load, with that platform.

Obey these rules for the moved text and the extraction candidates:

- In the Summary part of the write job and of the edit job, give each text that you moved. For each text, give its new file and the reason.
- When the file size was the reason, give the file size before you moved the text, and the limit.
- In the write job, write no Extraction candidates part.
- In the edit job, copy the full candidate list of the round-1 loading reviewer into the Extraction candidates part. Only round 1 reviews the full file.
- If a loading reviewer after round 1 gives a different item for a section, use the last item.
- A reviewer other than the loading reviewer can tell you to move text in an unchanged part. Then find the section of that text. If "When you recommend text to move" in `references/loading-rules.md` gives that section, add it to the Extraction candidates part.
- Use the heading of each section as the name of its candidate.

The last part gives each base-list word that has a different meaning in the glossary.
