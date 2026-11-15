# Questions to the Operator

This file tells you how to ask the Operator questions. `SKILL.md` in the folder above this file tells you when to read it.

## Terms in this file

- The question tool is the tool of your platform that asks the Operator questions. Examples are `AskUserQuestion`, `request_user_input`, and `question`.
- The question mode is the form that you use to ask: `tabbed`, `one at a time`, or `numbered list`.
- The question count is the text `Q<n> of <total>` at the start of each question.
- Answer options are the concrete answers that the Operator can select.
- The Human communication policy is the file "human-communication-policy.md" in the `docs/agents/` folder of the project.

## When a different instruction tells you how to ask questions

- This skill replaces each instruction about how to ask questions that another skill or a project instruction gives. The replacement includes how that instruction groups questions and when that instruction asks them.
- Use the question mode, the question count, the answer options, and the parts of a question from this file.
- The other skill still gives the facts that you must find out. Ask for these facts as this file tells you.
- When the Operator asks for a different form in the current prompt, use that form for this session only.
- Do not tell the Operator that you replaced another instruction. This text adds nothing that the Operator needs.

When 2 instructions about questions do not agree, obey them in this sequence, with the highest first:

1. The prompt of the Operator in the current session. It is applicable only to this session.
2. The Human communication policy.
3. A project instruction, for example `AGENTS.md`.

## When you select the question mode

Use the `Question mode` of the Human communication policy. When the policy gives no question mode, use `tabbed`.

| Question mode | How you ask |
|---|---|
| `tabbed` | Put the questions of one topic in one call of the question tool, one tab for each question. When the topic has more questions than the limit of your question tool, make one more call. |
| `one at a time` | Put one question in each call of the question tool. Wait for the answer before you ask the next question. |
| `numbered list` | Put all open questions in one chat message as a numbered list. Do not use the question tool. Then end your turn. |

In each question mode, when a question depends on the answer to an open question, ask it in a later call or message. The Operator cannot answer a question about a choice that is not known yet.

In the `tabbed` question mode, use the limit of your own question tool. A call that is more than the limit fails. This table gives the limits:

| Question tool | Questions in each call | Options for each question |
|---|---|---|
| `AskUserQuestion` (Claude Code) | 1 to 4 | 2 to 4 |
| `request_user_input` (Codex) | 1 to 3 | 2 to 3 |
| `question` (OpenCode) | No limit | No limit |

## When you count the questions

- Give each question its question count. Use one count for the full session.
- `<n>` is the number of the question in the session. It starts at 1 and goes up by 1 for each question. It never goes back.
- `<total>` is the number of questions that you know at that time. When an answer adds or removes questions, give the new total in the next question.
- Give a single question its count too, for example "Q1 of 1".
- In a call of the question tool, use the count as the header of the question. Also start the question text with the count.
- In a chat message, start each question with the count.

This example shows a total that changes:

```text
Call 1: Q1 of 1  Does the app need a database?
        Answer: Yes. The answer adds 1 question.
Call 2: Q2 of 2  Which database does the app use?
```

## When you give answer options

- In a call of the question tool, always give concrete answer options.
- Put the recommended option first. Add "(Recommended)" to the end of its label. The Operator can then accept it with one click.
- Do not add "(Recommended)" to a different option.
- In the description of each option, give the effect of that option.

## When you write a question

Give each question these 4 parts, in this sequence:

1. The question count and the question.
2. "Where we are": 1 to 3 sentences about the task and the decision that the answer controls.
3. A concrete example in prose, code, or a diff. When the options differ in code or text, show the example in the preview of each option.
4. The answer options, with the recommended option first. Each option gives its effect.

Write each question so that a person who did not see the work can answer it. The Operator can read the question after a break, without the earlier messages.

This example shows one question in a call of `AskUserQuestion`:

```json
{
  "questions": [
    {
      "header": "Q1 of 3",
      "question": "Q1 of 3: Which log level does config/logger.json use?\n\nWhere we are: the logger configuration is new. The level controls how many lines each request writes.\n\nExample: at info, a request writes 1 line when it starts and 1 line when it stops.",
      "multiSelect": false,
      "options": [
        {
          "label": "info (Recommended)",
          "description": "Writes starts, stops, and errors. The log file stays small."
        },
        {
          "label": "debug",
          "description": "Also writes each retry. The log file gets large quickly."
        }
      ]
    }
  ]
}
```
