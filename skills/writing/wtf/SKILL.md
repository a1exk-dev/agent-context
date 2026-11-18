---
name: wtf
description: "When the Operator calls this Skill by name after an agent message that the Operator did not understand, use this skill. It writes that message again in a clearer form: shorter text, simpler examples, glossary terms, and simple sentences. Load only when the Operator calls this Skill by name. Never load it on your own judgment."
disable-model-invocation: true
---

# wtf

This skill writes one of your messages again in a clearer form. The Operator calls this skill after a message that the Operator did not understand.

## Terms in this skill

- The Operator is the person who controls the project and its agents.
- The rewrite is the new form of the message that this skill gives.
- The context line is the 1 or 2 sentences at the start of the rewrite.
- The glossary is the project file with the terms of the project. Use `GLOSSARY.md`, and use `CONTEXT.md` only when the project has no `GLOSSARY.md`.
- An agent-made word is a term that an agent made in the session and that the glossary does not have.
- A required part is a part of the message that the Operator needs to act. Examples are a diff before an approval, a command in a code block, and the parts of a question.

## Steps

1. If your list of skills has the human-communication skill, and you did not load it in this session, load it now. Else continue with the 4 methods in step 4.
2. Read the text that the Operator wrote after the name of this skill as extra instructions. The text can give the message, the part of the message, or the methods. If the Operator wrote no text, rewrite your last message.
3. If the project has a glossary, read it.
4. Use the methods that fit the text that the Operator did not understand. Select the methods, the part, and the message by your own judgment:
   1. Write shorter and more compact text.
   2. Give better or simpler examples. Give the fewest examples that make each point clear.
   3. Use the glossary term for each item, and explain the term in common words the first time. Replace each agent-made word with a glossary term or with common words.
   4. Write simple sentences in simple tenses.
5. Give the rewrite as "When you give the rewrite" tells you.

## When you write the rewrite

- Keep each fact and each required part of the message. These parts are more important than method 1. Method 1 makes only the text around them shorter.
- The 4 methods add to the other writing rules that you obey. They do not replace these rules.
- Keep the rewrite near the length of the message. An agent without this skill often writes a rewrite that is about 3 times longer than the message.
- Change no file. For example, do not record a lesson in `MEMORY.md`. A rewrite has no result other than the new text.

## When you give the rewrite

Give these parts in this sequence:

1. The context line. It gives the task and the decision that the message is about, so that the Operator knows where the work is after a break. An example is "Where we are: Q1 added the outbound message to ChatTop, so ChatTop now stores your own sent lines. Q2 asks how long ChatTop keeps them."
2. The rewritten text.
3. The question of the message, only when the message asked a question. Put it at the end, so that the Operator can answer it directly.

Give only these parts. Add no note about the changes. Ask no question about whether the rewrite is clear.
