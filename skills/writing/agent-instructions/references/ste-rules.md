# ASD-STE100 rules

ASD-STE100 is tier 2. If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report. This file gives the rules of Issue 9 in words that we wrote, with their rule numbers. ASD publishes the standard at https://www.asd-ste100.org/STE_downloads.html.

## When you use STE for text

- These rules are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages.
- STE is applicable to all text in natural language: body text, headings, list items, table cells, and the frontmatter `description`.
- The word rules are not applicable to text that the author cannot change (rule 8.6). This text is user phrases in quotation marks, names, code spans, file paths, commands, URLs, and code in code blocks.
- A prompt that an agent reads as an instruction is not in this group. A prompt in a code block is also not in this group. Write it by all STE rules. An example is the text that a Skill gives to a subagent.
- The general recommendations GR-1 to GR-8 are not STE rules. This Skill makes them rules.

## When you select a word

- Use only approved words, technical nouns, and technical verbs (rule 1.1).
- Use an approved word only as its part of speech (rule 1.2). When the dictionary gives a word only as a noun, do not use it as a verb. Write a different sentence.
- Use an approved word only with its approved meaning (rules 1.3 and 9.2).
- Use only the verb forms and the adjective forms that the dictionary gives (rules 1.4 and 3.1). When the dictionary gives no comparative form for an adjective, write "more" or "most" before it.
- When a change of one word makes the sentence not clear, write a different sentence with the same meaning (rule 9.1).
- Do not use two words together as a verb with a new meaning, for example "set up" or "carry out" (rule 9.3).
- When a word is not approved, examine the base list in `technical-terms.md` and the project `CONTEXT.md`.
- Select words from model knowledge. Do not read the ASD-STE100 dictionary or a copy of the standard. This skill also operates in projects that have no copy. If model knowledge tells you that a word is not approved, write a different sentence. If no different sentence is clear, keep the word and add a warning. Do not add a warning for a word only because you are not sure about it. The word-selection warning of the end-of-run report is applicable to all words.

### When you find a known word that is not approved

Always replace these words. This list gives no replacement words, because a table of replacements is a part of the dictionary.

- "should", "may", "might", "would", "shall", "could" (for a possibility)
- "ensure", "begin", "commence", "initiate"
- "utilize", "leverage", "perform", "execute"
- "prior to", "via"
- "need", "fix", "every"

## When you select a technical noun or a technical verb

- Use a word that is not approved only in a technical noun or a technical verb (rule 1.6).
- Each technical noun is in one of the 22 word groups of rule 1.5. Each technical verb is in one of the 4 word groups of rule 1.12. When you select a word from the base list in `technical-terms.md`, find its word group in that list.
- When you select a technical noun, use a noun from `CONTEXT.md` or the base list in `technical-terms.md` (rule 1.8).
- When you must select a new technical noun, select a short noun that the reader knows (rule 1.9). Use a maximum of 3 words. Then do the steps in "When a word is not in the base list or in CONTEXT.md" in `technical-terms.md`.
- Do not use regional words, slang, or jargon as technical nouns (rule 1.10).
- Use one technical noun for each item, and one item for each technical noun (rule 1.11).
- Do not use a technical noun as a verb (rule 1.7). A technical verb can be a technical noun only when it is in word groups of rules 1.5 and 1.12. An example is "commit".
- Do not use a technical verb as a noun (rule 1.13). You can use its past participle as an adjective.
- When an approved verb gives the same instruction as a technical verb, use the approved verb (rule 1.12).

## When you write a multi-word noun

- A multi-word noun has a maximum of 3 words (rule 2.1).
- When a technical noun has more than 3 words, write it in full the first time (rule 2.2). After that, you can use a shorter form or an abbreviation.
- Use hyphens to connect words that are directly related, for example "end-of-run report" (rule 8.2). Do not connect more than 3 words with hyphens to make one noun (rule 2.2).

## When you write a verb

- Use only these verb forms (rule 3.2):
  - The infinitive and the imperative.
  - The simple present, the simple past, and the simple future.
  - The past participle as an adjective.
- Do not use the perfect tenses or the progressive tenses, for example "has changed" or "is running" (rule 3.2).
- A past participle after "be", "become", or "stay" is an adjective (rule 3.3). It is not the passive voice. An example is "The file is closed."
- Do not write "can", "must", or "will" together with "be" and a past participle (rule 3.4).
- Use an "-ing" form only as a technical noun or as a modifier in a technical noun (rule 3.5). Some approved words end in "-ing", for example "during". You can use these words.
- Use the active voice (rule 3.6). You can use the passive voice only in descriptive text, and only when you do not know the actor. "You" or "we" can be the subject.
- Use a verb to show an action, not a noun (rule 3.7). Write "Examine the file", not "Do an examination of the file".
- The only modal verbs are CAN, CANNOT, MUST, and WILL. CAN also shows that the reader is permitted to do an action. Change a "should" or a "may" to MUST, CAN, or a condition that you write in the sentence.
- Do not use RFC 2119 "SHOULD" or "MAY". They add a second system of meanings, and agents read that system differently. Also, a self-check cannot know which "should" is from RFC 2119 and which "should" to replace.

## When you write a sentence

- Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement.
- Do not omit words to make a sentence shorter (rule 4.2). Keep the nouns, the verbs, the subjects, and the articles. Use no contractions.
- When a noun can have an article, put "the", "a", "an", "this", or "these" before it (rule 4.5). Do not put an article before a name with an identifier, for example "rule 5.1".
- Use words such as "then", "but", and "because" to connect descriptive sentences with related topics (rule 4.4).
- Use the same terms and the same words for the same type of step (rule 9.4).
- Write "that" after a verb such as "make sure" or "show" (GR-1).
- When "with" can have two meanings in a sentence, write a different sentence (GR-2).
- Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again.
- When a word in a different language looks the same as an English word, use only the English meaning (GR-5).
- Use no Latin abbreviations, for example "e.g." or "etc." (GR-6).
- Use words that do not show a gender, for example "they" for a person (GR-7).
- Use the possessive form, for example "the user's file", only when the sentence is clear (GR-8). If you are not sure, write "of".
- Write words in their American English form (rule 1.14). Do not change the letters of quoted text.

## When you write a procedure or a rule

These rules are applicable to procedural text: numbered steps, rule bullets, and safety instructions. The type of text sets the limit, not the mood of each sentence.

- Each sentence in procedural text has a maximum of 20 words (rule 5.1). This limit is also applicable to a sentence that is not an instruction.
- Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction.
- Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence.
- A step can have a second sentence that gives the result of its action or a limit (rule 5.2).
- When the reader must know a condition first, put the condition at the start of the sentence (rule 5.4). Then write a comma. A time clause, for example "Before you commit", is a condition.

## When you write a note

- A note gives only information (rule 5.5). It contains no instruction, no requirement, and no limit.
- Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note.
- Put each instruction in a step or a rule, not in a note. An agent does not always obey a note.
- Put information that prevents damage in a CAUTION, not in a note.
- When the user tells you to write a "note" that gives an instruction, write a rule. Give this change in the Summary part.
- A sentence in a note has a maximum of 25 words (rule 5.1).
- In descriptive text, write notes only for tables (rule 5.5).

## When you write descriptive text

Descriptive text gives information. It has no imperative. A paragraph that gives an instruction is procedural text.

- Give information in small parts, one after the other (rule 6.1). Give each sentence one topic.
- Use the same term for the same item each time (rule 6.2).
- Each descriptive sentence has a maximum of 25 words (rule 6.3).
- Use paragraphs for related information (rule 6.4). Start each paragraph with a sentence that tells its topic.
- Give each paragraph only one topic (rule 6.5).
- A paragraph has a maximum of 6 sentences (rule 6.6).

## When you write a heading, a label, a list, or a table

- Headings, bold labels in lists, and the cells in the first row of a table are titles.
- A title can be a noun phrase. It uses only approved words and technical words, and no "-ing" form that rule 3.5 does not permit.
- The text after a label is a full STE sentence. A table body cell that gives an instruction or a fact is also a full STE sentence.
- A list item is a full STE sentence, or it completes the sentence before the list (rule 4.3).
- Use a vertical list for complex text (rule 4.3). End the sentence before the list with a colon. Make sure that each item agrees with that sentence.
- Do not put instructions and descriptive text in one list (rule 4.3).
- In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3).

## When you count words

- In a vertical list, the colon stops a sentence (rule 8.4). The sentence before the colon and each list item are each one sentence. Each one has the limit of its text type.
- Text in parentheses counts as 1 word in its sentence (rule 8.5). It is also a sentence with its own word count.
- Each of these items counts as 1 word (rule 8.6):
  - A number, or a number with its unit.
  - An abbreviation, or an identifier with letters and digits.
  - Quoted text. In Agent instructions, a code span, a file path, a command, and a URL are quoted text.
  - A title, a heading, or a label.
  - The name of a person, a group, an organization, or a country.
- A hyphenated word counts as 1 word (rule 8.7).
- Step numbers are not words.

## When you write punctuation

- You can use all English punctuation marks, but not the semicolon (rule 8.1).
- Use parentheses only for one of these 7 purposes (rule 8.3):
  - To refer to a figure or to a part of the text.
  - To give the letters or numbers that identify items.
  - To give the number of a step.
  - To give an abbreviation.
  - To give the singular and the plural form of a noun together.
  - To give the meaning of a word or of a part of a sentence.
  - To give an alternative.

## Before a step with a risk

- A step has a risk when it can cause data loss or makes a change that you cannot undo. Examples are a step that pushes with `--force` and a step that deletes a branch.
- A rule bullet with a risk is also a step for this section.
- A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...".
- Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item.
- A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition.
- Start the safety instruction with the signal word CAUTION. A caution is for a risk of damage.
- Do not use the signal word WARNING. It is for a risk of injury to persons. A warning in the end-of-run report is a different item.
- After CAUTION, write the instruction or the condition first (rule 7.2).
- Then tell the risk or the possible result in a second sentence (rule 7.3).
- Each sentence of a safety instruction has a maximum of 20 words (rule 5.1).
- Use no other emphasis. Examples of emphasis are "IMPORTANT", "CRITICAL", and words in capital letters. Words such as "always" and "never" are not emphasis when they are not in capital letters.

## When you write a word in capital letters

- A word in capital letters is not emphasis when the text gives it as an example, for example "Use CAN or a condition."
