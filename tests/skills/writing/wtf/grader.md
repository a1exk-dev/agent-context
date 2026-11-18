# Grader for the wtf output tests

You grade the llm statements of one run of one output test. This is a read-only task, except for the `llm-grading.json` file that you write.

`grade.ts` decides the script statements. Before you start, `grade.ts` wrote `script-grading.json` in the run folder. Grade only the statements in its `llm` list.

## Inputs

- The run folder: `<iteration>/eval-<name>/<configuration>/run-1/`.
- `eval_metadata.json` in the folder 2 levels above the run folder. It gives these items of the test:
  - `messages`: the text of each original message, in sequence.
  - `call`: the last turn of a run with the Skill. A run of the configuration `without_skill` sends the `baseline` turn in place of `call`.
  - `question`: the question that the original message asks the Operator, or null.
  - `facts`: the fact list of the test.
- `script-grading.json`: the `llm` list gives each statement that you grade, with `id` and `text`. The `words` item gives the number of words of each message and of the rewrite.
- `transcript.md`: the record of the last turn. Lines that start with `[subagent <description>]` come from a subagent.
- `outputs/report.md`: the final message of the last turn.
- `copy-<n>/transcript.md`: the record of the copy turn of message `<n>`.

## When you find the rewrite

The rewrite is the text of the main agent in `transcript.md`: each text block and the final message. A text block of a subagent is not a part of the rewrite.

The original is the message or the part of a message that the last turn names, for example Q2. When the last turn names no message, the original is the last message of `messages`.

## When you grade a statement

1. Make a closed checklist for the statement: one item for each part of the statement.
2. For each item, answer "yes" or "no". "yes" shows that the rewrite obeys the item.
3. For each item, copy one quote from the rewrite or from the original as evidence.
4. Answer "yes" only with clear evidence. When the evidence is missing or partial, answer "no".

Read these statements literally:

- W4: The rewrite starts with a context line of 1 or 2 sentences: the task, and the decision that the message is about. The context line is the first 1 or 2 sentences of the rewrite. A "no" needs a quote of the start of the rewrite.
- W5: The rewrite keeps each fact of the fact list of the test. Make one checklist item for each fact of `facts`. A fact in different words is kept. A fact with a changed number, name, or decision is not kept.
- W6: The rewrite keeps each required part, for example a diff, a command, and the parts of a question. A required part is a part that the Operator needs to approve, to copy, or to answer. Examples are a diff before an approval, a command in a code block, a table of results, and each answer choice of a question. A "no" needs the name of the part that the rewrite does not have.
- W7: The rewrite ends with the original question only when the message asked one. When `question` is not null, the last sentence of the rewrite asks that question, in the same or in different words. When `question` is null, the rewrite ends with no question.
- W8: The length of the rewrite is near the length of the original. The `words` item of `script-grading.json` gives the word counts of the full messages. When the original is a part of a message, count the words of that part. No fixed ratio of words applies. Answer "no" only when you judge that the rewrite is much longer than the original. A "no" gives the 2 word counts.
- W9: The rewrite is clearer than the original. Compare the 2 texts for a reader who did not see the work. A "no" needs a quote of a part of the rewrite that is not clearer than the same part of the original.

Each test can add its own statements:

- 5.1: The rewrite covers only Q2. It does not rewrite or repeat Q1 or Q3. A "no" needs a quote of Q1 or Q3 in the rewrite.
- 7.1: The rewrite covers the first message, about the 0.4.0 release, and not the second message, about the README typo.
- 8.1: The rewrite uses only the method "shorter text". It adds no new example, no explanation of a term, and no new term. A "no" needs a quote of the new example, the explanation, or the new term.

## When you write the result

1. Write `llm-grading.json` in the run folder in this form. Give one item in `statements` for each statement of the `llm` list.

```json
{
  "statements": [
    {
      "id": "W5",
      "checklist": [
        {"item": "<part of the statement>", "answer": "yes", "quote": "<quote>"}
      ]
    }
  ]
}
```

2. Reply with one line for each statement that has a "no". Give its id and the item of each "no".

## When the grader answers "no" for a statement

This section is for the main agent, not for the grader.

For each llm statement with a "no", start 2 new Confirmer subagents. Give each Confirmer only the statement, the items with "no" and their quotes, and the run folder. Do not give the reason of the grader. Use this prompt:

```text
You examine one statement of an output test of the wtf Skill. This is a read-only task.

Statement: <text of the statement>
Run folder: <absolute path of the run folder>
Items, each with its quote:
<one line for each item with "no": the item, then its quote in quotation marks>

The rewrite is the text of the main agent in transcript.md of the run folder. eval_metadata.json, 2 folders above the run folder, gives the original messages, the question, and the fact list.
For each item, read these files. Answer "yes" when the item does not obey the statement. Answer "no" when the item obeys the statement.
Give one line for each item: the item, "yes" or "no", and one sentence.
```

Then write `confirmers.json` in the run folder. For each statement, give one item for each Confirmer. Set `agrees` to true when the Confirmer answered "yes" for one or more items.

```json
{
  "W5": [
    {"agrees": true, "reason": "<the sentence of the Confirmer>"},
    {"agrees": false, "reason": "<the sentence of the Confirmer>"}
  ]
}
```
