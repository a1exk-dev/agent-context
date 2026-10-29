# ASD-STE100 rules

ASD-STE100 is tier 2. If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report. This file gives the rules of Issue 9 in words that we wrote, with their rule numbers. ASD publishes the standard at https://www.asd-ste100.org/STE_downloads.html.

## When you use STE for text

- These rules are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages.
- STE is applicable to all text in natural language: body text, headings, list items, table cells, and the frontmatter `description`.
- The word rules are not applicable to text that the author cannot change (rule 8.6). This text is user phrases in quotation marks, names, code spans, file paths, commands, URLs, and code in code blocks.
- The punctuation rules are also not applicable to code in code blocks.
- A prompt that an agent reads as an instruction is not in this group. A prompt in a code block is also not in this group. Write it by all STE rules. An example is the text that a Skill gives to a subagent.
- The general recommendations GR-2, GR-3, and GR-4 are not STE rules. This Skill makes them rules.

## When you select a word

Always replace these words. This list gives no replacement words, because a table of replacements is a part of the dictionary.

- "should", "may", "might", "would", "shall", "could" (for a possibility) (script check)

## When you select a technical noun

- When you select a technical noun, use a noun from the glossary or the base list in `technical-terms.md` (rule 1.8).
- When the glossary and the base list have no noun for an item, do the steps in "When a word is not in the base list or in the glossary" in `technical-terms.md`.
- Use one technical noun for each item, and one item for each technical noun (rule 1.11).

## When you write a multi-word noun

- A multi-word noun has a maximum of 3 words (rule 2.1).
- When a technical noun has more than 3 words, write it in full the first time (rule 2.2). After that, you can use a shorter form or an abbreviation.
- Do not connect more than 3 words with hyphens to make one noun (rule 2.2). (script check)

## When you write a verb

- A past participle after "be", "become", or "stay" is an adjective (rule 3.3). It is not the passive voice. An example is "The file is closed."
- Do not write "can", "must", or "will" together with "be" and a past participle (rule 3.4).
- Use the active voice (rule 3.6). You can use the passive voice only when you do not know the actor. "You" or "we" can be the subject.
- The only modal verbs are CAN, CANNOT, MUST, and WILL. CAN also shows that the reader is permitted to do an action. Change a "should" or a "may" to MUST, CAN, or a condition that you write in the sentence.
- Do not use RFC 2119 "SHOULD" or "MAY". They add a second system of meanings, and agents read that system differently. Also, a self-check cannot know which "should" is from RFC 2119 and which "should" to replace. (script check)

## When you write a sentence

- Write short and clear sentences (rule 4.1). Give the action or the fact, not a general statement.
- Each sentence has a maximum of 25 words. This limit is applicable to all text. (script check)
- Do not omit words when the omission changes the meaning of the sentence (rule 4.2).
- Use the same terms and the same words for the same type of step (rule 9.4).
- Use the same term for the same item each time (rule 6.2).
- When "with" can have two meanings in a sentence, write a different sentence (GR-2).
- Make sure that each pronoun, for example "it", "they", or "this", refers to one item only (GR-3 and GR-4). If it can refer to two items, write the noun again.

## When you write a procedure or a rule

- Write each instruction in the imperative (rule 5.3). Do not write "must" before an imperative. Use "must" only for a condition or for a safety instruction.
- Write one instruction in each sentence (rule 5.2). When 2 actions occur at the same time, you can write them in one sentence.
- A step can have a second sentence that gives the result of its action or a limit (rule 5.2).

## When you write a note

- A note gives only information (rule 5.5). It contains no instruction, no requirement, and no limit.
- Make sure that the procedure is correct without its notes. To examine a note, read the procedure without the note.
- Put each instruction in a step or a rule, not in a note. An agent does not always obey a note.
- Put information that prevents damage in a CAUTION, not in a note.
- When the user tells you to write a "note" that gives an instruction, write a rule. Give this change in the Summary part.

## When you write a safety list

- In a safety list, write "do not" in each item that tells the reader not to do an action (rule 4.3).

## When you count words

- In a vertical list, the colon stops a sentence (rule 8.4). The sentence before the colon and each list item are each one sentence.
- A colon also stops a sentence when a table or a code block follows it. A colon in the middle of a line does not stop a sentence.
- Text in parentheses counts as 1 word in its sentence (rule 8.5). It is also a sentence with its own word count.
- Each of these items counts as 1 word (rule 8.6):
  - A number, or a number with its unit.
  - An abbreviation, or an identifier with letters and digits.
  - Quoted text. In Agent instructions, a code span, a file path, a command, and a URL are quoted text.
  - A title, a heading, or a label.
- A name counts as its number of words, for example "Claude Code" counts as 2 words. This rule is stricter than rule 8.6, which counts a name as 1 word.
- A hyphenated word counts as 1 word (rule 8.7).
- Each word of a multi-word noun counts as 1 word. For example, "pull request" counts as 2 words.
- Step numbers are not words.
- A heading is a title, not a sentence. Do not count the words of a heading.

This table gives examples. In each example, the sentence and its word count obey the rules in this section.

| Sentence | Words |
|---|---|
| If the pull request is not merged, stop. | 8 |
| 1. Open the pull request. | 4 |
| Write the end-of-run report. | 4 |
| Run `git status --porcelain` before you commit. | 5 |
| When the user says "cut a release", use this skill. | 8 |
| Run the check (in the container) again. | 5 |
| CAUTION: Do not push with `--force`. | 6 |
| Make sure that the branch has no changes: `git status` gives no output. | 12 |
| Read references/review.md first. | 3 |
| Do a maximum of 3 review rounds. | 7 |

## When you write punctuation

- You can use all English punctuation marks, but not the semicolon (rule 8.1). (script check)

## Before a step with a risk

- A step has a risk when it can cause data loss or makes a change that you cannot undo. Examples are a step that pushes with `--force` and a step that deletes a branch.
- A rule bullet with a risk is also a step for this section.
- A step that other persons can see, but that you can undo, has no risk of this type. Examples are a pull request and a pushed tag. Write a condition at the start of that step, for example "When the user gives approval, ...". Also write it when a heading above the step gives a condition.
- Put a safety instruction directly before each step with a risk (rule 7.1). In a list, the safety instruction is a different item.
- A CAUTION does not replace a condition. A task or a project file can make approval of the user necessary for a step. Then start that step with the condition.
- Start the safety instruction with the signal word CAUTION. A caution is for a risk of damage.
- Do not use the signal word WARNING. It is for a risk of injury to persons. A warning in the end-of-run report is a different item. (script check)
- After CAUTION, write the instruction or the condition first (rule 7.2).
- Then tell the risk or the possible result in a second sentence (rule 7.3).
- Use no other emphasis. Do not write these words in capital letters: "IMPORTANT", "CRITICAL", "MUST", "NEVER", "ALWAYS", "SHOULD", "MAY", "NOTE", and "WARNING". Words such as "always" and "never" are not emphasis when they are not in capital letters. (script check)

## When you write a word in capital letters

- A word in capital letters is not emphasis when the text gives it as an example, for example "Use CAN or a condition."
