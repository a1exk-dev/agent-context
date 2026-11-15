---
name: human-communication
description: "Before you write text that a human reads, use this skill. Each task ends with such text, so use this skill at the start of each task, before your first message. This text includes chat answers, explanations of code, summaries of commits and changes, progress lines, and reports. It also includes the final message after a fix or a rename, questions to the Operator, code comments, commit messages, and documents for persons. Examples of these documents are README.md, docs, issue bodies, and pull request text. When you ask the Operator a question, or when a prompt says \"how does\", \"what changed\", \"explain\", \"fix\", \"commit\", \"write a doc\", \"summarize\", or \"report\", use this skill. It writes STE-based text (ASD-STE100), builds text per ISO 24495-1, and counts questions. It reads the human communication policy of the project in docs/agents/."
---

# Human communication

This skill tells you how to write text that a human reads. The text is clear on the first read, gives the result first, and shows the examples that the reader needs.

## Terms in this skill

- The Operator is the person who controls a project and its agents. The Operator answers the questions of an agent.
- The glossary is the file that gives the terms of the project. Its name is `GLOSSARY.md` or `CONTEXT.md`. If the project has the two files, use `GLOSSARY.md`.
- STE-based text obeys the rules in `references/ste-rules.md`. These rules are our own words for a part of the writing rules of ASD-STE100. STE-based text is not "STE compliant" and not "STE certified", because ASD did not examine it.
- Plain language is text that obeys the rules in `references/plain-language.md`. These rules are our own words for the 4 principles of ISO 24495-1:2023.
- A document for persons is a text that a human reads without the chat. Examples are `README.md`, a file in `docs/`, an issue body, and a pull request text.

## When this skill is applicable

- Use this skill for each text that a human reads. Examples are chat messages, progress lines, questions, reports, and code comments.
- Also use this skill for commit messages, issue and pull request text, and documents for persons.
- You decide who reads a text. When a human can read a text, use this skill for that text.
- This skill stays in your context window for the session. Load it one time.

## Before you write the first text of the session

1. Read `references/ste-rules.md` in the folder of this skill. It gives the STE-based rules for words, sentences, and CAUTION.
2. Read `references/plain-language.md` in the folder of this skill. It gives the plain-language rules for the result, the details, and the structure.
3. If the project has a glossary, read the glossary.

## While you write text that a human reads

- Obey the rules of the 2 reference files while you write. Do not read your text again for a check before the human sees it. Start no subagent to review your text. A second read makes each answer slower, and the rules already apply while you write.
- Use the glossary term for each item that the glossary has. Do not use a word that the glossary tells you to avoid.
- Agents break these rules of the reference files most often. Obey them also in short status sentences and in the final message:
  - Give each sentence and each clause its actor as the subject. Write "I did not commit the file", not "The file is not committed". Write "When a Job starts at midnight", not "When a Job is set for midnight". Also do not write "get" with a past participle, for example "Long lines get cut".
  - Use one word for each item in the full text, also in lists, steps, and summaries. When you name an item again, use the same word. For example, do not write "the project" and then "the repository", "the function" and then "the code", or "the SQLite file" and then "the database file".
  - When the code names the item, use the word of the code each time. For example, write "the delay" for `DELAY_MS` in each sentence, also in a sentence that says how the delay grows.
  - Write "it" only when the sentence has one noun that "it" can refer to. Else write the noun again. For example, write "`runDue` keeps the Job after the Job runs", not "after it runs".
  - Write no "should", "may", "might", "would", or "could". Write "will" for an expected result and "can" for a possibility.
  - Write a maximum of 25 words in each sentence, also in a sentence that compares the old and the new behavior. When a sentence adds a second fact with "plus", "and", or "which", write two sentences.

## When the text needs an example

Show the example in each of these cases:

| Case | Example to show |
|---|---|
| The Operator approves or reviews a change to a file. | A diff of the change, in a `diff` code block. |
| The text names a command, a call, or a configuration. | A code block with the command, the call, or the configuration, so that the reader can copy it. |
| The text explains a change in behavior. | A before and after, in code or in pseudocode. |

In other cases, give an example when words alone are not clear. A prose example is permitted.

## When you write a chat message

- Use no headings.
- Use a list only for 3 or more parallel items. Else write sentences.
- Name code as `path:line`, for example `src/fetch.ts:12`. The Operator can open the code with one click.
- Name each issue and each pull request by its title, with its URL. Do not name it only by its number, because a number does not tell what the item is.

## When you write a document for persons

- Start the document with a title.
- Put the headings in the sequence of the tasks of the reader.
- Use lists for steps and for parallel items. Use tables to compare items.
- Write no text that depends on the chat, for example "as I said above" or "the bug that we found". A reader of the document did not see the chat.

## When a text has a structure from another skill or the project

Another skill or the project can give a structure for a text. Examples are sections, headings, fixed labels, required fields, and their sequence.

- Keep that structure and its fixed text word for word. The rules of the 2 reference files do not apply to the fixed text.
- Write the sentences inside the structure as this skill tells you.
- For a commit message, keep the form that the commit rules of the project give, for example the header form and the trailers. Write the sentences of the body by the rules of this skill.
- For a pull request text, keep each heading and each fixed line of the pull request template. Write your sentences below each heading.

## The Human communication policy

The Human communication policy is the file "human-communication-policy.md" in the `docs/agents/` folder of the project. It holds the Settings that tell you how to ask the Operator questions. A Setting is one line `- <name>: <value>`. The file holds the title `# Human communication policy`, blank lines, and one line for each Setting, in the sequence of the Settings table:

| Setting | Values | Default value |
|---|---|---|
| Question mode | `tabbed`, `one at a time`, or `numbered list`. | `tabbed` |
| Answer options | `on` or `off`. Only the `numbered list` question mode uses this Setting. The other question modes always give answer options. | `on` |
| Question count | `on` or `off`. | `on` |

When you ask a question, `references/questions.md` tells you what each value does.

## Before you ask the Operator a question

Before you ask the Operator the first question of the session, do these steps:

1. Read the Human communication policy. Read it only before the first question. When the session has no question, do not read the policy. If the policy is not there, do the setup that "When the Human communication policy is not there" gives. If the policy is there, examine its lines as "When you examine the lines of the policy" tells you.
2. Read `references/questions.md` in the folder of this skill. It gives the question mode, the question count, the answer options, and the parts of a question. Its rules replace the question rules of each other skill and of each project instruction.

### When you examine the lines of the policy

Read the policy with its line numbers, for example with `cat -n`. A correct line is one of these lines:

- The title `# Human communication policy`.
- A blank line.
- A Setting with a name from the Settings table and a value from the Values cell of that name.

Each other line is an incorrect line. Examples are a sentence, a different heading, and `- Question mode: tabs`. A policy in prose has only incorrect lines, except its title and its blank lines. When 2 or more Settings have the same name, each Setting after the first Setting with that name is an incorrect line.

First, find the incorrect lines. Then, find each Setting that has no line.

### When the policy has an incorrect line

Stop the work that needs the question. You cannot know which decision of the Operator an incorrect line gives. Do these steps, also when no human can answer:

1. Ask no question. Change no file. Do not change an incorrect line into a Setting. Do not write a new policy.
2. In your report, give the line number and the text of each incorrect line.
3. Tell the Operator to correct these lines, or to delete the policy file. When the file is not there, the setup runs before the next question.

### When a Setting has no line

Do these steps only when the policy has no incorrect line:

1. For each Setting that has no line, in the sequence of the Settings table, find its value:
   - When the other lines make the Setting unused, use the default value. Ask no question. For example, `Answer options` is unused when the `Question mode` is not `numbered list`.
   - When the prompt gives the value, use that value.
   - When no human can answer, use the default value. Ask no question. No human can answer when you have no question tool, or when a call of the question tool fails.
   - Else, before your own questions, ask the Operator one question in a call of the question tool. Use the default Settings for this call. Put only that question in the call, because the answer can make a later Setting unused. Give the default value first, with "(Recommended)". Give the 4 parts of a question.
2. The total of the question count is the number of Settings that you ask about. Continue the count of the session for your own questions.
3. Add one line for each of these Settings to the policy, in the position of its row in the Settings table. Do not change the other lines.
4. Do not stage or commit the policy.
5. In your next message, give each line that you added. When no human can answer, give these lines in your final message.

## When the Human communication policy is not there

This section tells you how to set up the Human communication policy. `references/questions.md` gives the parts of a question, the question count, and the cases where no human can answer.

- The pointer text is the text of `references/agents-md-pointer.md` in the folder of this skill. It tells an agent to load this skill in each session.
- A pointer target is a file that gets the pointer text: `AGENTS.md`, `CLAUDE.md`, or the two files.
- The setup questions are the questions of this section. Your own questions are the questions of your task.

### When you do the setup

Do the setup before your own first question. A text with no question never starts the setup. Your own questions use the question mode and the Settings of the new policy.

This is the default Human communication policy. It has the title, a blank line, and one Setting for each row of the Settings table:

```markdown
# Human communication policy

- Question mode: tabbed
- Answer options: on
- Question count: on
```

### When you find the pointer targets

Find the pointer targets in the root folder of the project:

1. When `CLAUDE.md` is a symbolic link to `AGENTS.md`, or holds the line `@AGENTS.md`, the pointer target is only `AGENTS.md`.
2. When `AGENTS.md` is a symbolic link to `CLAUDE.md`, or holds the line `@CLAUDE.md`, the pointer target is only `CLAUDE.md`.
3. Else, each of the 2 files that the project has is a pointer target.
4. When the project has neither file, the pointer targets are 2 new files. `AGENTS.md` gets the pointer text. `CLAUDE.md` gets only the line `@AGENTS.md`.

A pointer target that already holds the sentence of the pointer text needs no edit. When no pointer target needs an edit, do not offer the pointer text. Offer the pointer text only in the setup.

### When a human can answer the setup questions

Ask the setup questions with the default Settings: the `tabbed` question mode, with the question count and the answer options. Give each setup question the 4 parts that `references/questions.md` gives.

1. When the prompt gives a value for each Setting, use these values. When the prompt says "use the default human communication policy", use the default values. In these 2 cases, do not ask the policy question.
2. When no pointer target needs an edit, do not ask the pointer question. When the first call then has no question, make no call.
3. Make the first call of the question tool. It holds the policy question and the pointer question, one tab for each question:
   - The policy question. Show the default Human communication policy in the preview of `Use defaults`. Give the options `Use defaults` (Recommended) and `Choose each setting`.
   - The pointer question. Name each pointer target. Show the pointer text in the preview of the first option. Give the options `Yes` (Recommended) and `No`.
4. In the first call, the total of the question count is the number of setup questions in that call. The new policy decides how you ask your own questions. Continue the count of the session after the setup questions.
5. When the Operator selects `Choose each setting`, ask one question for each Setting, in the sequence of the Settings table. Ask only one question in each call, because one answer can make a later Setting unused. Give the default value first, with "(Recommended)".
   - Ask the `Answer options` question only when the answer for `Question mode` is `numbered list`. Else write `on` for `Answer options`. Ask no question for `Answer options`.
6. When a call of the question tool fails, obey "When no human can answer the setup questions".

When you have the answers, do these steps:

1. If the folder `docs/agents/` is not there, make the folder.
2. Write the Human communication policy with the values that you have. Write one Setting for each row of the Settings table, in the sequence of that table.
3. If the Operator selected `Yes` for the pointer text, add the pointer text to the end of each pointer target that needs an edit. Put a blank line before the pointer text. When the project has neither file, make the 2 files as "When you find the pointer targets" tells you.
4. Do not stage or commit a file of the setup. The Operator commits these files with the process of the project.
5. In your next message, name each new file and each changed file.
6. Ask your own questions in the question mode of the new policy.

### When no human can answer the setup questions

No human can answer when you have no question tool, or when a call of the question tool fails. `references/questions.md` gives examples of these cases.

The words "use the default human communication policy" answer only the policy question. They do not answer the pointer question.

When the prompt gives a value for each Setting, or says "use the default human communication policy", do these steps:

1. Write the Human communication policy with these values. Obey steps 1, 2, 4, and 5 of the steps after the answers.
2. If the prompt answers the pointer question with yes, obey step 3 of the steps after the answers, as for the answer `Yes`. If the prompt answers with no, make no edit for the pointer text.
3. If the prompt does not answer the pointer question, make no edit for the pointer text. If a pointer target needs an edit, put the pointer question first in the list of your own questions.
4. Continue with your own questions, as `references/questions.md` tells you for the case where no human can answer.

When the prompt does not give these answers, do these steps:

1. Write no file. Make no edit for the pointer text.
2. In your final message, put the setup questions first. When the prompt answers the pointer question, do not ask it. Then put your own questions. Write the questions in one numbered list, as `references/questions.md` tells you. The total of the question count is the number of questions in the list.
3. Below the policy question, give the default Human communication policy in a code block.
4. Tell the caller to answer the questions in a new request. As an alternative, the caller can say "use the default human communication policy".
5. Stop the work that needs an answer.
