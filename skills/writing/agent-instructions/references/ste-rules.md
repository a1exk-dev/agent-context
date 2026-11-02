# ASD-STE100 rules

This file gives the rules of Issue 9 in words that we wrote, with their rule numbers. The URL of the standard is https://www.asd-ste100.org/STE_downloads.html.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you use STE for text

- STE is applicable to all text in natural language: body text, headings, list items, table cells, and the frontmatter `description`.
- The word rules are not applicable to text that the author cannot change (rule 8.6). This text is quoted text, names, code spans, file paths, commands, URLs, and code in code blocks. Quoted text is text in quotation marks and text that the author copies from a source.
- The punctuation rules are also not applicable to code in code blocks.
- A prompt that an agent reads as an instruction is not text that the author cannot change. A prompt in a code block is also not text of this type. When you write a prompt of these 2 types, obey all STE rules. An example is the text that a Skill gives to a subagent.
- The general recommendations GR-1 to GR-8 are not STE rules. This skill makes them rules.

## When you select a word

- Use only approved words, technical nouns, and technical verbs (rule 1.1).
- Use an approved word only as its part of speech (rule 1.2). If model knowledge tells you that a word is only a noun, do not use it as a verb. Write a different sentence.
- Use an approved word only with its approved meaning (rules 1.3 and 9.2).
- Use only the verb forms and the adjective forms that the ASD-STE100 dictionary gives (rules 1.4 and 3.1). If model knowledge tells you that the ASD-STE100 dictionary gives no comparative form, write "more" or "most" before the adjective.
- When a change of one word makes the sentence not clear, write a different sentence with the same meaning (rule 9.1).
- Do not use two words together as a verb with a new meaning, for example "set up" or "carry out" (rule 9.3).
- Select words from model knowledge. Do not read the ASD-STE100 dictionary or a copy of the standard. This skill also operates in projects that have no copy. Do not add a warning for a word only because you are not sure about that word. Many warnings of this type hide the important warnings.

### When a word is not approved

Do these steps:

1. When a word is not approved, find the word in the base list in `technical-terms.md` or in the glossary.
2. If the word is not in these files, write a different sentence with approved words.
3. If no different sentence is clear, do the steps in "When a word is not approved, not in the base list, and not in the glossary" in `technical-terms.md`.

### When your text contains a known word that is not approved

This list gives no replacement words, because a table of replacements is a part of the ASD-STE100 dictionary. In your new text and in the changed part, always replace these words, also when no different sentence is clear. Each of these words has an approved replacement. Replace these words:

- "should", "may", "might", "would", "shall", "could" (when it tells that an action is possible)
- "ensure", "begin", "commence", "initiate"
- "utilize", "leverage", "perform", "execute"
- "prior to", "via"
- "need", "fix", "every"

### When the user or a different project file uses a known word that is not approved

- This section is for each word from the list in "When your text contains a known word that is not approved". When the user, a project file, or an unchanged part uses one of these words, do the steps in "When a word is not approved, not in the base list, and not in the glossary" in `technical-terms.md`. This rule is not applicable to the text that the word rules do not cover.

## When you select a technical noun or a technical verb

- Use a word that is not approved only in a technical noun or a technical verb (rule 1.6).
- Each technical noun is in one of the 22 word groups of rule 1.5. Each technical verb is in one of the 4 word groups of rule 1.12. When you select a word from the base list in `technical-terms.md`, find its word group in that list.
- When you select a technical noun, use a noun from the glossary, the base list in `technical-terms.md`, or `SKILL.md` (rule 1.8).
- When you must select a new technical noun, select a short noun that the reader knows (rule 1.9). Use a maximum of 3 words.
- Do not use a word as a technical noun when only persons in one area know that word (rule 1.10). Also do not use words that only a small group of persons knows.
- Use one technical noun for each item (rule 1.11). Use each technical noun for one item only.
- Do not use a technical noun as a verb (rule 1.7). Only some words can be a technical noun and a technical verb. Each of these words is in a word group of rule 1.5 and in a word group of rule 1.12. An example is "commit".
- Do not use a technical verb as a noun (rule 1.13). You can use its past participle as an adjective.
- When an approved verb gives the same instruction as a technical verb, use the approved verb (rule 1.12).

### When a new technical noun contains a word that is not approved

- When a new technical noun contains a word that is not approved, do the steps in "When a word is not approved, not in the base list, and not in the glossary" in `technical-terms.md`.

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
- Use the active voice (rule 3.6). You can use the passive voice only in descriptive text. In that text, use it only when you do not know the person or the item that does the action. In a sentence in the active voice, "you" or "we" can be the subject.
- Use a verb to show an action, not a noun (rule 3.7). Write "Examine the file", not "Do an examination of the file".
- The only modal verbs are CAN, CANNOT, MUST, and WILL. CAN also shows that the reader is permitted to do an action. Change a "should" or a "may" to the imperative, MUST, CAN, or a condition that you write in the sentence.
- Do not use RFC 2119 "SHOULD" or "MAY". They add a second system of meanings, and not all agents read that system in the same way. Also, a self-check cannot know which "should" is from RFC 2119 and which "should" to replace.

## When you write a sentence

- Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement.
- Do not omit words to make a sentence shorter (rule 4.2). Keep the nouns, the verbs, the subjects, and the articles. Use no contractions.
- When a noun can have an article, put "the", "a", "an", "this", or "these" before the noun (rule 4.5). Do not put an article before a name with a number, for example "rule 5.1".
- Use words, for example "then", "but", and "because", to connect descriptive sentences that have related topics (rule 4.4).
- Use the same terms and the same words for the same type of step (rule 9.4).
- When a statement follows a verb, for example "make sure" or "show", write "that" after the verb (GR-1).
- When "with" can have two meanings in a sentence, write a different sentence (GR-2).
- Make sure that each pronoun, for example "it", "they", or "this", is for one item only (GR-3 and GR-4). If a pronoun can be for two items, write the noun again.
- When a word in a different language has the same letters as an English word, use the English meaning (GR-5).
- Use no Latin abbreviations, for example "e.g." or "etc." (GR-6).
- Use words that do not tell the sex of a person, for example "they" (GR-7).
- Use the possessive form, for example "the user's file", only when the sentence is clear (GR-8). If you are not sure, write "of".
- Write words in their American English form (rule 1.14). Do not change the letters of quoted text.

## When you write a procedure or a rule

These rules are applicable to procedural text: numbered steps, rule bullets, and safety instructions. The type of text gives the word limit of each sentence, not the mood of the sentence.

- Each sentence in procedural text has a maximum of 20 words (rule 5.1). This limit is also applicable to a sentence that is not an instruction.
- Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction. When you change a "should" in an instruction, write the imperative.
- Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence.
- A step can have a second sentence that gives the result of its action or a limit (rule 5.2).
- When the reader must know a condition first, put the condition at the start of the sentence (rule 5.4). Then write a comma. A part of a sentence that tells a time, for example "Before you commit", is a condition.

## When you write a note

- A note gives only information (rule 5.5). It contains no instruction, no requirement, and no limit.
- Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note.
- Put each instruction in a step or a rule, not in a note. An agent does not always obey a note.
- Put information that prevents damage in a safety instruction, not in a note.
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

## When you write a heading, a bold label, a list, or a table

- Headings, bold labels in lists, and the cells in the first row of a table are titles.
- A title can be a noun phrase. It uses only approved words, technical nouns, and technical verbs. It uses no "-ing" form that rule 3.5 does not permit.
- The text after a bold label is a full STE sentence. A table body cell that gives an instruction or a fact is also a full STE sentence. A cell that only gives a term, a value, or a definition of a term can be a noun phrase. A cell that gives the definition of a technical verb can be a phrase that completes the sentence "To <term> is to ...".
- A list item is a full STE sentence, or it completes the sentence before the list (rule 4.3).
- Use a vertical list for complex text (rule 4.3). Put a colon at the end of the sentence before the list. Make sure that each item agrees with that sentence.
- Do not put instructions and descriptive text in one list (rule 4.3).
- Some safety instructions tell the reader not to do an action. In a list of safety instructions, write "do not" in each of these items (rule 4.3).

## When you count words

- In a vertical list, the colon stops a sentence (rule 8.4). The sentence before the colon and each list item are each one sentence. Each one has the limit of its text type.
- A colon also stops a sentence when a table or a code block follows the colon. A colon in the middle of a line does not stop a sentence.
- Text in parentheses counts as 1 word in its sentence (rule 8.5). It is also a sentence with its own word count.
- Each of these items counts as 1 word (rule 8.6):
  - A number, or a number with its unit.
  - An abbreviation, or a name that contains letters and numbers.
  - Quoted text. In Agent instructions, a code span, a file path, a command, and a URL are quoted text.
  - A title that a sentence gives, for example the heading of a different section.
  - The name of a person, a group, an organization, or a country.
- A word with hyphens counts as 1 word (rule 8.7).
- Each word of a multi-word noun counts as 1 word. For example, "pull request" counts as 2 words.
- Step numbers are not words.
- A heading is a title, not a sentence. Do not count the words of a heading.

This table gives examples. In each example, the sentence and its word count obey the rules in this section.

| Sentence | Words |
|---|---|
| If the pull request is not merged, stop. | 8 |
| 1. Open the pull request. | 4 |
| Write the end-of-run report. | 4 |
| Before you commit, run `git status --porcelain`. | 5 |
| When the user says "cut a release", use this skill. | 8 |
| Run the check (step 3) again. | 5 |
| CAUTION: Do not push with `--force`. | 6 |
| Make sure that the branch has no changes: `git status` gives no output. | 12 |
| Read references/review.md first. | 3 |
| Do a maximum of 3 review rounds. | 7 |

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

## When you write a step with a risk

A step has a risk when the step can cause data loss or makes a change that the reader cannot undo. Examples are a step that pushes with `--force` and a step that deletes a branch. A rule bullet with a risk is also a step for this section.

- Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item.
- A safety instruction does not replace a condition. The safety instruction tells the risk. But the safety instruction does not make the reader wait until the user approves the step. When the user must approve a step, start that step with that condition. A task or a project file can tell you that the user must approve a step.
- Start the safety instruction with the signal word CAUTION. The signal word CAUTION is for a risk of damage.
- Do not use the signal word WARNING. It is for a risk of injury to persons.
- After CAUTION, write the instruction or the condition first (rule 7.2).
- Then tell the risk or the possible result in a second sentence (rule 7.3).

## When you write a step that persons other than the user can see

A step that persons other than the user can see and that the reader can undo has no risk of the type in "When you write a step with a risk". Examples are a step that opens a pull request and a step that pushes a tag.

- Write a condition at the start of that step, for example "When the user approves this step, ...". When a heading above the step gives the same condition, also write the condition in the step. Other persons see the result of that step before the reader can undo that step.

## When you add emphasis

- Use no emphasis other than the signal word CAUTION. Emphasis does not keep a neutral and direct tone. Examples of emphasis are "IMPORTANT", "CRITICAL", and other words in capital letters. Abbreviations, names, examples, for example "Use CAN or a condition.", and the modal verbs CAN, CANNOT, MUST, and WILL are not emphasis. Words, for example "always" and "never", are not emphasis when they are not in capital letters. Bold labels are titles, not emphasis. The bold terms in `SKILL.md` are also not emphasis.
