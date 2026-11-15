---
name: human-communication
description: "Before you write text that a human reads, use this skill. This text includes chat messages, progress lines, reports, questions to the Operator, code comments, and documents for persons. Examples of these documents are README.md, docs, issue bodies, and pull request text. When you ask the Operator a question, or when a prompt says \"write a doc\", \"explain\", \"summarize\", or \"report\", use this skill. It writes STE-based text (ASD-STE100), builds text per ISO 24495-1, and counts questions. It reads the human communication policy of the project in docs/agents/."
---

# Human communication

This skill tells you how to write text that a human reads. The text is clear on the first read, gives the result first, and shows the examples that the reader needs.

## Terms in this skill

- The Operator is the person who controls a project and its agents. The Operator answers the questions of an agent.
- The glossary is the file that gives the terms of the project. Its name is `GLOSSARY.md` or `CONTEXT.md`. If the project has the two files, use `GLOSSARY.md`.
- STE-based text obeys the rules in `references/ste-rules.md`. These rules are our own words for a part of the writing rules of ASD-STE100. STE-based text is not "STE compliant" and not "STE certified", because ASD did not examine it.
- Plain language is text that obeys the rules in `references/plain-language.md`. These rules are our own words for the 4 principles of ISO 24495-1:2023.
- A document for persons is a text that a person reads without the chat. Examples are `README.md`, a file in `docs/`, an issue body, and a pull request text.

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
- Keep code, code spans, commands, paths, URLs, names, and quoted text as they are. The writing rules do not apply to them.
- Use the glossary term for each item that the glossary has. Do not use a word that the glossary tells you to avoid.

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

- Keep that structure and its fixed text word for word. The writing rules do not apply to the fixed text.
- Write the sentences inside the structure as this skill tells you.
- For a commit message, keep the form that the commit rules of the project give, for example the header form and the trailers. Write the sentences of the body by the rules of this skill.
- For a pull request text, keep each heading and each fixed line of the pull request template. Write your sentences below each heading.
