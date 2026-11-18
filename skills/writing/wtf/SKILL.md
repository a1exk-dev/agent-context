---
name: wtf
description: "When the Operator calls this Skill by name after an agent message that the Operator did not understand, use this Skill. It writes that message again in a clearer form: shorter text, simpler examples, glossary terms, and simple sentences. Load only when the Operator calls this Skill by name. Never load it on your own judgment."
disable-model-invocation: true
---

# wtf

This Skill writes one of your messages again in a clearer form. The Operator calls this Skill after a message that the Operator did not understand. Use this Skill only for a message of yours in the session. When the Operator asks for a change to a file, for example a shorter text in a project document, do not use this Skill.

## Terms in this Skill

- The Operator is the person who controls the project and its agents.
- The rewrite is the new form of the message that this Skill gives.
- The context line is the 1 or 2 sentences at the start of the rewrite.
- The glossary is the project file with the terms of the project. Use `GLOSSARY.md`. Use `CONTEXT.md` only when the project has no `GLOSSARY.md`.
- An agent-made word is a term that an agent made in the session and that the glossary does not have.
- A required part is a part of the message that the Operator needs to act. Examples are a diff before an approval, a command in a code block, and the parts of a question.

## Steps

1. If your list of Skills has the human-communication Skill, and you did not load it in this session, load it now. If your list of Skills does not have the human-communication Skill, use the 4 methods of step 4 without the human-communication Skill. In the two cases, continue with step 2.
2. Read the text that the Operator wrote after the name of this Skill. This text is the extra instructions of the Operator. The extra instructions can give the message, the part of the message, or the methods. When the Operator wrote no extra instructions, or the extra instructions give no message, rewrite your last message. When the extra instructions give a part of the message, for example "Q2", rewrite only that part. Do not repeat the other parts of the message.
3. If the project has `GLOSSARY.md`, read `GLOSSARY.md`. If the project has only `CONTEXT.md`, read `CONTEXT.md`.
4. Use the methods that fit the part of the message that the Operator did not understand. When the extra instructions give no part of the message, select the part by your own judgment. When the extra instructions give no methods, select the methods by your own judgment:
   1. Write shorter and more compact text.
   2. Give better or simpler examples. Give the fewest examples that make each point clear.
   3. Use the glossary term for each item that the glossary has. Explain each glossary term in common words the first time that you use it. Replace each agent-made word with a glossary term or with common words. When the project has no glossary, replace each agent-made word with common words.
   4. Write simple sentences in simple tenses.
5. Give the rewrite as "When you give the rewrite" tells you.

## When you write the rewrite

- Keep each fact and each required part of the message. The facts and the required parts are more important than method 1. Method 1 makes only the text around the facts and the required parts shorter.
- Keep each fact as the message gives it, also when you think that the fact is wrong. The rewrite does not correct a fact of the message.
- Obey your other writing instructions together with the 4 methods. Do not let the 4 methods replace these instructions.
- Keep the rewrite near the length of the message. An agent without this Skill often writes a rewrite that is about 3 times longer than the message.
- Change no file. For example, do not record a lesson in `MEMORY.md`. This Skill gives only the rewrite.

## When you give the rewrite

Give these parts in this sequence:

1. The context line. It gives the task and the decision that the message is about, so that the Operator knows where the work is after a break. When the message is about no decision, the context line gives only the task. An example is "Where we are: Q1 added the outbound message to ChatTop, so ChatTop now stores your own sent lines. Q2 asks how long ChatTop keeps them."
2. The rewritten text.
3. The question of the message, only when the message asked a question. When you rewrite only a part of the message, give only the question of that part. Put the question at the end, so that the Operator can answer it directly.

Give only these parts. Add no note about the changes. Ask no question about whether the rewrite is clear. Each added part makes the rewrite longer for the Operator.
