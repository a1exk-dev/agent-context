# Grader for the semver output tests

You grade the llm statements of one run of one output test. This is a read-only task, except for the `llm-grading.json` file that you write.

`grade.ts` decides the script statements. Before you start, it wrote `script-grading.json` in the run folder. Grade only the statements in its `llm` list.

## Inputs

- The run folder: `<iteration>/eval-<name>/<configuration>/run-1/`. The folder above the configuration folder has `eval_metadata.json`, with the request and the setup of the test.
- `script-grading.json`: the `llm` list gives each statement that you grade, with `id` and `text`.
- `transcript.md`: the run record. Lines that start with `[subagent <description>]` come from a subagent.
- `outputs/report.md`: the final report of the run.
- `outputs/git-before.md` and `outputs/git-after.md`: the Git state after the setup and after the run. Each has HEAD, the local branches and tags, the refs of `origin`, the commits with their parents and messages, `git status`, the staged files, and the Semver policy.
- `outputs/prs-before.json` and `outputs/prs.json`: the pull requests of the fake `gh` before and after the run.
- `outputs/gh-calls.txt`: one JSON line with the arguments of each `gh` call.

## When you grade a statement

1. Make a closed checklist for the statement: one item for each part of the statement.
2. For each item, answer "yes" or "no". "yes" shows that the run obeys the item.
3. For each item, copy one quote from the files or from the run record as evidence.
4. Answer "yes" only with clear evidence. When the evidence is missing or partial, answer "no".

Read the statements literally:

- V6: The report must agree with `git-after.md` and `prs.json`. A part of the result that the job did not make, for example a tag for Start, needs no item. When the job stopped, the report must give the reason and what the job needs to continue.

## When you write the result

1. Write `llm-grading.json` in the run folder in this form. Give one item in `statements` for each statement of the `llm` list.

```json
{
  "statements": [
    {
      "id": "V6",
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

For each llm statement with a "no", start 2 new confirmer subagents. Give each confirmer only the statement, the items with "no" and their quotes, and the run folder. Do not give the reason of the grader. Use this prompt:

```text
You examine one statement of an output test. This is a read-only task.

Statement: <text of the statement>
Run folder: <absolute path of the run folder>
Items, each with its quote:
<one line for each item with "no": the item, then its quote in quotation marks>

For each item, read the files of the run folder. Answer "yes" when the item does not obey the statement. Answer "no" when it obeys the statement.
Give one line for each item: the item, "yes" or "no", and one sentence.
```

Then write `confirmers.json` in the run folder. For each statement, give one item for each confirmer. Set `agrees` to true when the confirmer answered "yes" for one or more items.

```json
{
  "V6": [
    {"agrees": true, "reason": "<the sentence of the confirmer>"},
    {"agrees": false, "reason": "<the sentence of the confirmer>"}
  ]
}
```
