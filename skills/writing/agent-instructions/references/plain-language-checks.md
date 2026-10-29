# Plain-language checks

These checks are tier 3. If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report. The checks are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`, `CHANGELOG.md`, and commit messages.

The checks come from ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*. The ISO page for the standard is https://www.iso.org/standard/78907.html.

The checks are in four groups. Each group agrees with one of the four principles of the standard. These principles agree with the plain-language definition of the International Plain Language Federation: https://www.iplfederation.org/plain-language-definitions/. All four principles are applicable to an agent reader. The ISO rules that tell you to add images are not applicable.

## When you select the text

- The agent that loads the file is the only reader. Make no changes for a person.
- Each Agent instruction tells when it is applicable. The description of a Skill tells when the Skill is applicable.
- Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file.
- Files that load in each session contain only short rules and pointers with a condition. Move long text to files that load only when a task makes them necessary.
- Keep only the text that the agent cannot find without help. Examples are project facts, decisions, special instructions of the user, and corrections of incorrect agent work.
- In the edit job, remove text only in the changed part. When the user tells you that an agent did not obey a rule, do not remove that rule. The user wants agents to obey that rule. You can correct the text of that rule. You can also move that rule.
- Remove each instruction that tells the agent to do an action that it does without an instruction. Remove text that the agent can read in the code or in the Git history. Also remove text that the agent can read in a pointer target.
- Add one short cause to a rule in each of these conditions:
  - The rule changes the usual work of the agent.
  - The rule is not usual for the agent.
  - To obey the rule, the agent must make a decision.
- Examine only the rules that you add or change for these conditions.
- A file gives the cause when it tells why the rule is necessary. A command or a setting in a file does not give the cause. If no file gives the cause and the user does not give it, add a warning. Do not speak to the user about the cause.

## When you put the text in sections and lists

- Put procedure steps in the sequence of the task, with the necessary conditions first.
- In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. The heading of that section gives the condition where the rule is applicable, for example "Before a commit". A topic heading, for example "Branches", gives no condition.
- In the glossary and `MEMORY.md`, copy the format of the entries that the file has. This rule replaces the heading rules of this section for these files.
- When you add a rule and no heading gives its condition, add a heading for the rule. Use the level of the other condition headings. If the file has only a level 1 heading, use level 2. Put the new section after the last section of the file. Put a new rule in a section after the last rule of that section. Do not change the headings of the other rules.
- Do not write the condition of the heading again in each rule of the section. A pointer sentence is different, because it gives its condition.
- No section template is necessary.
- Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span.
- Each other heading gives the condition or the topic of its section.
- Use no headings that are applicable to all subjects, for example "Notes" or "Other".
- Each pointer tells when to read its target. A pointer with no condition is a problem in the self-check.
- A pointer target is one step from the file that has the pointer. Make no sequences of pointers.
- When the file does not load in each session, find a pointer to it in a different Agent instruction. If you find no pointer, add a warning.

## When you select the words and the tone

- For words that the reader knows, and for clear, short sentences and paragraphs, obey the rules in `ste-rules.md`.
- When the project has a glossary, use each project term with its meaning in that file.
- Do not use the word of a glossary term with a different meaning. This rule is also applicable when you write the word in lowercase letters.
- Use one term for each item: the project term, not a different word with the same meaning.
- Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. When the project has a glossary, also make sure that the file agrees with the glossary.
- Use no images and no Mermaid diagrams. Show a sequence or a structure as a numbered list or a table. You can also use a tree with indents in a code block.
- Use a neutral and direct tone. Write no text that tells the agent about a punishment or a reward. Write no text that tells the agent good things about itself.
- Do not tell the agent that it is an expert. Write a sentence about the work of the agent only when the sentence gives a correct fact.

## When you test the text

- When you do the self-check or the reader test, read `review.md`.
- During the write job or the edit job, the self-check examines the text.
- After the self-check, the reader test examines the text with new readers.
- After agents use the file, the edit job examines the text again. A report that an agent did not obey an instruction becomes a reader-test task.
