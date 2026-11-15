# STE-based rules

These rules are our own words for a part of the writing rules of ASD-STE100, Issue 9. Each rule gives its rule number. ASD publishes the standard at https://www.asd-ste100.org/STE_downloads.html.

This skill keeps only the rules that help a human reader. Text that obeys them is STE-based. Never call the text "STE compliant" or "STE certified", because ASD did not examine it.

## When you select a word

- Use only the modal verbs "can", "cannot", "must", and "will". Do not write "should", "may", "might", "would", "could", or "shall".
- Do not write "ensure". Write the action that the reader does.
- For an expected result, write "will", for example "The call will send 5 requests." For a fact in the past, write the fact, for example "I did not find the URL." For a possibility, write "can".
- Use one term for each item, and the same term each time (rules 1.11 and 6.2).
- Do not change the term for an item to vary the style. For example, do not write "the wait" in one sentence and "the delay" in the next sentence for the same item.
- When the glossary of the project has a term for the item, use that term.
- When the glossary has no term for the item, use a common word that has one meaning.
- Write a multi-word noun of a maximum of 3 words (rule 2.1).

## When you write a verb

- Use the active voice (rule 3.6). Give the actor as the subject, for example "The script deletes the file." Do not write "The file is deleted".
- Do not write "can", "must", or "will" together with "be" and a past participle (rule 3.4). For example, write "You can delete the file", not the passive form.

## When you write a sentence

- Write a maximum of 25 words in each sentence (rule 4.1). Most sentences need 20 words or fewer. When a sentence gets longer, write two sentences.
- Write one instruction in each sentence, in the imperative (rules 5.2 and 5.3).
- Make each pronoun, for example "it", "they", or "this", refer to one item only (GR-3 and GR-4). If a pronoun can refer to two items, write the noun again.
- Do not use a semicolon (rule 8.1). Write two sentences.

## Before a step that can lose data

A step has a risk when it can lose data or when you cannot undo it. An example is a command that deletes a database.

1. Put a CAUTION directly before the step (rule 7.1). In a numbered list, put the CAUTION above the line of the step, not inside the step and not after the instruction of the step.
2. After CAUTION, write the instruction first (rule 7.2).
3. Then write the risk in a second sentence (rule 7.3).

This example shows the form:

```markdown
CAUTION: Make a backup of the database before you run the next command. The command deletes all data, and you cannot undo it.
```

Use no other words in capital letters for emphasis, for example "IMPORTANT" or "NEVER".

## When the text has code, names, or quoted text

The rules in this file do not apply to code, code spans, paths, commands, URLs, names, and quoted text (rule 8.6). Keep these items as they are.

## When you write in a language other than English

- Obey `plain-language.md` in this folder.
- Obey these rules of this file: short sentences, the active voice, and one instruction in each sentence.
- Also use one term for each item, and make each pronoun refer to one item.
- The word rules for English do not apply, for example the list of modal verbs.
