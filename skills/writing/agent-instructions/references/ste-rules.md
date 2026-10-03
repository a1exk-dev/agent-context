# How ASD-STE100 applies

ASD-STE100 is tier 2. This file gives the rules in our own words, with the rule numbers of Issue 9. The official download is at https://www.asd-ste100.org/STE_downloads.html.

## When you apply STE to text

- STE applies to all natural-language text: body text, headings, list items, table cells, and the frontmatter `description`.
- Code spans, code blocks, file paths, commands, URLs, and quoted text are exempt from the word rules. Each one counts as 1 word (rule 8).

## When you select a word

You must obey the word rules (1.1 to 1.4).

- Use only approved words, technical nouns, and technical verbs.
- When a word is not approved, look for it in the base list and in the project `CONTEXT.md`.
- Use each approved word only with its approved meaning and part of speech.
- Choose words from model knowledge. Do not read the ASD-STE100 dictionary or a copy of the standard.
- Each report contains the word-choice warning that `SKILL.md` gives.

### Known non-approved words

Always replace these words. This list gives no replacement words, because a table of replacements is dictionary content.

- "should", "may", "might", "would", "shall"
- "ensure", "begin", "commence", "initiate"
- "utilize", "leverage", "perform", "execute"
- "prior to", "via"

## When you write a sentence

Find the text type of each sentence from its mood.

- An imperative sentence is an instruction. It has a maximum of 20 words and one instruction. Put the condition first.
- Each other sentence is descriptive. It has a maximum of 25 words and no imperative.
- A paragraph of descriptive sentences has a maximum of 6 sentences.

## When you write a heading, a label, a list, or a table

- Headings, bold labels in lists, and the cells in the first row of a table are titles.
- A title can be a noun phrase. It uses only approved words and technical words, and no "-ing" form outside a technical noun.
- The text after a label is a full STE sentence. A list item or a table body cell that gives an instruction or a fact is also a full STE sentence.

## Before a step with a risk

- A risky action can cause data loss, is difficult to undo, or is visible to other people or systems. Examples are a push, a tag, and a pull request.
- Put a safety instruction (rule 7) directly before each step that does a risky action. An example is the step that makes a tag.
- Start the safety instruction with the signal word CAUTION.
- Do not use WARNING, because the action is not a risk to persons.
- Use no other emphasis. Examples of emphasis are "IMPORTANT", "CRITICAL", and words in capital letters.

## When you write verbs and punctuation

These rules apply fully to Agent instructions.

- The only modal verbs are CAN, MUST, and WILL. Change a "should" or a "may" to MUST, CAN, or an explicit condition.
- Do not use RFC 2119 "SHOULD" or "MAY". They add a second system of meanings. Agents read that system differently, and a self-check cannot separate it from words that need new text.
- Use no semicolons and no contractions.
- Use the active voice. The passive voice is permitted only in descriptive text when the actor is not known.
- Use "-ing" forms only in technical nouns.
- A noun cluster has a maximum of 3 words.
- Write words in their American English form. Use no Latin abbreviations.
