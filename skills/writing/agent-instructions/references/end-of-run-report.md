# End-of-run report

The write job and the edit job stop with one end-of-run report.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you write the end-of-run report

1. Write the report in the structure of the template that follows these steps. Do not write a part that has no items. Obey the rules for each part. These rules are in the sections after the template.
2. Compare the report with each review report and each reader report. Add each warning that this skill or its reference files tell you to add. In the edit job, also add each extraction candidate. For each finding in a warning, give its rule, its text in quotation marks, and its problem.
3. Save the full report to a file in a temporary folder that is not in the project. An agent gives the full lists more reliably when it copies them from a file.
4. After you save the report file, read it.
5. Send the full text of the file as your last message. Copy the text without changes. Do not write the report again in different words. Then the user can see the full lists and select changes.

```markdown
## Summary
<The files that the job wrote or changed, with their paths, and the changes.>
<For an edit job after an agent did not obey an instruction: the previous condition in quotation marks, or "no condition".>

## Warnings
- The author selected words from model knowledge and did not examine them in the ASD-STE100 dictionary.
- <One item for each warning that is applicable.>

## Extraction candidates
- <Section> → <recommended file>. Pointer: "<pointer>"

## Base-list words with a project meaning
- <Word>: <the meaning in the glossary>
```

## When you write the Summary part

In the Summary part of the edit job, give each problem that you recorded before you changed the file. Give the cause of each problem and the change that corrected the problem.

## When you write the Warnings part

Start the Warnings part with this warning. Copy the words without changes: "The author selected words from model knowledge and did not examine them in the ASD-STE100 dictionary." This warning tells the user that no agent examined the words in the ASD-STE100 dictionary. Then add a warning for each of these items when the item is applicable:

- Each finding that you did not correct after round 3, with its rule.
- Each finding that you rejected, with the rule or the text type that permits the text.
- In the edit job, each finding about text in an unchanged part.
- Each problem that the reader test found and that you cannot correct without help from the user.
- Each text that a round 3 correction changed. Write that no reviewer examined this text.
- When you did all 3 review rounds, each text that a correction after a reader-test round changed. Write that no reviewer examined this text.
- Each text that a correction changed after the last reader-test round. Write that no reader examined this text.
- Each check that you did yourself because no subagent was available or because a new subagent also failed. Give the path of the temporary folder that contains the report files of these checks. If you did a reader-test task yourself, write that you were not a new reader for that task.
- Each correction of an error in a saved review report or a saved reader report.
- Each finding that you cannot correct without help from the user.
- Each case in which two sources do not agree and that `source-conflicts.md` does not give. Give the case and the tier that you obeyed.
- A feature that only one platform reads and that you wrote because the user told you to write it. Give the platforms that do not read the feature and the alternative that all three platforms read.
- A frontmatter field that is not permitted and that the user told you to write. Give the field and the error.
- A `license`, `compatibility`, `metadata`, or `allowed-tools` field that the user told you to write. Give the platforms that do not read the field and the alternative that all three platforms read.
- A new or changed rule that must have a cause, but has no cause.
- Each problem that you found outside a review report. In quotation marks, give the text that has the problem. Then give the problem.
- A file type that is not correct for the text. Add this warning also in the edit job, because only the user can approve a new file type.
- A file layout of the entry files in which a target platform does not load the text.
- An Agent instruction that the platform loads only through a pointer and that no pointer identifies.
- A file size that is still more than its limit after you moved text or added a Rule. Give the measured file size and the limit.
- A word that is not approved, not in the base list, and not in the glossary. Give the recommended STE word or the recommended glossary entry.
- For each Skill, each platform from the table in `agent-skills-spec.md` that does not load the Skill. Give these platforms also when they are not target platforms.

## When you give moved text and extraction candidates

- In the Summary part of the write job and of the edit job, give each text that you moved. For each text, give its new file and the reason.
- When the file size was the reason, give the limit. Also give the file size that the file had before you moved the text.
- In the edit job, copy each extraction candidate of the round-1 loading reviewer into the Extraction candidates part. Only round 1 reviews the full file.
- After round 1, a loading reviewer can give a different recommended file or pointer for an extraction candidate. If a loading reviewer gives a different file or pointer, use the file and the pointer from the last round. The last round examined the newest text.
- Use the heading of each section as the name of its extraction candidate.

### When a reviewer other than the loading reviewer tells you to move text in an unchanged part

Do these steps:

1. Find the section of that text.
2. When a reviewer other than the loading reviewer tells you to move that text, read "When you recommend text to move" in `loading-rules.md`.
3. If `loading-rules.md` makes the section from step 1 an extraction candidate, add that section to the Extraction candidates part. Give its heading, the recommended file, and the pointer.

## When you write the Base-list words with a project meaning part

In this part, give each base-list word that has a different meaning in the glossary.
