# Grader for the agent-instructions output tests

You grade the LLM statements of one run of one output test. This is a read-only task, except for the `llm-grading.json` file that you write.

`grade.ts` decides the script statements. Before you start, it wrote `script-grading.json` in the run folder. Grade only the statements in its `llm` list.

## Inputs

- The run folder: `<iteration>/eval-<name>/<configuration>/run-1/`. The folder above the configuration folder has `eval_metadata.json`.
- `script-grading.json`: the `llm` list gives each statement that you grade. Each item has `id`, `text`, `grader`, and `list`. The `list` is the list of the script, or null.
- `transcript.md`: the run record. Lines that start with `[subagent <description>]` come from a subagent. A `TOOL CALL Agent` or `TOOL CALL Task` line in the main agent starts a subagent.
- `transcript.jsonl`: the full Claude Code record. Tool calls of one assistant message have the same `message.id`.
- `sessions/`: the full parent and child session exports of an OpenCode run. Tool names such as `read`, `bash`, and `apply_patch` keep their OpenCode names.
- `outputs/changes.diff`: all file changes against the starting project. The starting project is `tests/skills/writing/agent-instructions/project/` with the `setup` of `eval_metadata.json`.
- `outputs/files/`: the full text of each changed file.
- `outputs/report.md`: the end-of-run report, which is the final message.

## When you grade a statement

1. Make a closed checklist for the statement. When `list` is a list, write one checklist item for each list item. When `list` is null, write one item for each part of the statement.
2. For each item, answer "yes" or "no". "yes" shows that the item obeys the statement.
3. For each item, copy one quote from the files or from the run record as evidence.
4. Answer "yes" only with clear evidence. When the evidence is missing, partial, or only on the surface, answer "no".

Read the statements literally:

- "New or changed text" is the added lines in `changes.diff`, for the files that the run wrote or changed. It does not include the report.
- [8b]: Each list item is a new sentence that names a file path, with its heading. Answer "yes" when the sentence or its heading states when to read the target.
- [9b]: Each list item is an added line with the `CONTEXT.md` terms in it. Answer "yes" when each term has its meaning in `CONTEXT.md`.
- [10a]: Each list item is a removed line, and no added line has its text. Answer "yes" when the line is in the asked change.
- [10b]: Each list item is a known mistake of the starting file. Answer "yes" when the report names that mistake.
- [9.1b]: Use the Summary part of the report.

## When you write the result

1. Write `llm-grading.json` in the run folder in this form. Give one item in `statements` for each statement of the `llm` list.

```json
{
  "statements": [
    {
      "id": "8b",
      "checklist": [
        {"item": "<list item or part of the statement>", "answer": "yes", "quote": "<quote>"}
      ]
    }
  ]
}
```

2. Reply with one line for each statement that has a "no". Give its id and the item of each "no".

## When the grader answers "no" for an LLM statement

This section is for the main agent, not for the grader.

For each statement with `grader` "llm" that has a "no", start 2 new confirmer subagents. A statement with `grader` "advisory" gets no confirmers. Give each confirmer only the statement, the items with "no" and their quotes, and the run folder. Do not give the reason of the grader. Use this prompt:

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
  "8b": [
    {"agrees": true, "reason": "<the sentence of the confirmer>"},
    {"agrees": false, "reason": "<the sentence of the confirmer>"}
  ]
}
```
