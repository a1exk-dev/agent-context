#!/bin/sh
# usage: gen.sh <round> <class: loading|ste|iso> <relative file under skill> <changes text>
R=/private/tmp/claude-501/-Users-alexk-Projects-agent-context/21bed514-5716-445b-809d-dd17536e9108/scratchpad/review.wPp6
P=/Users/alexk/Projects/agent-context
S=$P/skills/writing/agent-instructions
n=$1; c=$2; f=$3; ch=$4
case $c in
loading) name="loading"; cls="loading reviewer"; rules="$S/references/review.md, $S/references/loading-rules.md, $S/references/agent-skills-spec.md";;
ste) name="ASD-STE100"; cls="ASD-STE100 reviewer"; rules="$S/references/review.md, $S/references/ste-rules.md, $S/references/technical-terms.md";;
iso) name="ISO 24495-1"; cls="ISO 24495-1 reviewer"; rules="$S/references/review.md, $S/references/plain-language-rules.md";;
esac
if [ $c = iso ]; then CONDLINE="Examine the conditions of the pointers and the headings."; else CONDLINE="Do not examine the conditions of the pointers and the headings."; fi
cat <<P2
You are the $name reviewer for Agent instructions: files that an agent reads as instructions.
Check class: $cls
This task is read-only. Only read files. Do not edit, make, move, or delete files.
Do not run commands that change files, Git data, or external services.
Exception: save your reports in your report folder, as this prompt tells you. Write no other file.

Review target: $S/SKILL.md
Changes: $S/$f: $ch
Report folder: $R/round-$n/$c/
Job: the edit job
Project folder: $P
Target platforms: Claude Code, Codex, and OpenCode
Rules: $rules
Report requirements: $S/references/review.md
Glossary: $P/GLOSSARY.md
Pointer targets: $S/references/agent-skills-spec.md, $S/references/end-of-run-report.md, $S/references/loading-rules.md, $S/references/plain-language-rules.md, $S/references/review.md, $S/references/ste-rules.md, $S/references/technical-terms.md
Check script findings: $R/round-$n/check.json

Before the review, read the file in the Report requirements line.
Do only this review. Do not give it to a subagent.
Review only the files in the Changes line.
The check script findings give the pointer list: each sentence that names a file path, with its line and heading.
Before you give a finding, read each file in the Pointer targets line and each file that a sentence in the pointer list names.
Give no finding for a problem that one of these files already solves.
Read the glossary only to examine a word that you found for a rule. When the glossary gives that word, and the glossary meaning is the meaning of the word in the text, give no finding for the word.
Do not compare the text with the glossary or with MEMORY.md. Give no finding that only the glossary or MEMORY.md causes.
Read each file of the review target that is not in the Changes line only for context. Also read each pointer target that is not in the Changes line only for context. Read each file that is not Markdown in the folder of a Skill only for context. Give no finding for these files.
In each tool call that reads a file, give the absolute path of that file. Do not use \`cd\`, \`*\`, or a loop to read files, because the tool calls must show each file that you read.
The number in round-<n> of your report folder is the number of the round.
In each round, the sections under review are only the sections in the Changes line.
Read the full text of each file only for context. Give no finding for text that is not in a section under review.
For a section that the author moved, the Changes line gives only its pointer. For the words of that section, give only the loading-rules.md finding that this prompt gives below.
Use each rule in the rule files for the sections under review.
Skip each rule that ends with "(script check)". The check script findings give the problems for these rules.
$CONDLINE
Write the file size of each file and its limit.
Give a finding for each text to move in a section in the Changes line.
Also give a finding for each text that the author moved and that does not obey loading-rules.md. In the Text field, write the pointer of that text in quotation marks. If that text has no pointer, copy the heading of the moved section.
P2
if [ $c = iso ]; then cat <<'P3'
For each sentence in the pointer list that is a pointer, decide whether the heading and the sentence give the condition to read the target.
Also find each pointer that names no file, for example "that file".
In "When you select the text" in plain-language-rules.md, skip the rule about long text. The loading reviewer examines that rule.
P3
fi
cat <<'P4'

For each Markdown file that you review, save one report as <report folder>/<file path>.md. <file path> is the path of the file in the project folder.
For example, save the report of skills/x/SKILL.md as <report folder>/skills/x/SKILL.md.md.
Save each report with one tool call, alone in a new message. Wait for its result before you review the next file.
If the report folder already has the report of a file, do not review that file again. Also do not change that report.
After you save all reports, give only the list of the saved paths in your last message.

Start each report with the blocking checklist, in this form:
Blocking checklist:
1. "<a rule that ends with "(blocking)", word for word>" - <each place in the sections under review of that file that does not obey the rule: its line and its text in quotation marks, or "none">
Put each rule of your rule files that ends with "(blocking)" in the checklist. Do not put a rule that you skip in the checklist.
For the checklist, examine only the sections under review of the file of that report.
After the checklist, give one finding for each place in the checklist. Then give the findings for the other rules.

Give each finding in this form:
- Rule: <the rule number, if the rule has one, and the full text of the rule in quotation marks from the rule files>
- Text: "<the words from the file in quotation marks>"
- Problem: <one sentence>
- Correction: <recommended new text>
In each finding, give one rule from the rule files and the text from the file in quotation marks.
Write the full rule in each finding. Do not refer to a different finding.
Copy the rule and the text word for word. A script compares each quote with the files and removes each finding with a different quote.
Write each finding so that the author can examine it without the other findings.
Do not make a new rule. A group heading is not a rule.
In the Text field, write only words from the file of that report.
For a file-size problem or a file-location problem, copy the heading or the first line of the file.
Give the paths and the line numbers in the Problem field.
Use this form for each finding. Keep the necessary lists apart from the findings.
If you find no problem, write "No findings" after the necessary lists.
Do not add other notes or questions.
P4
