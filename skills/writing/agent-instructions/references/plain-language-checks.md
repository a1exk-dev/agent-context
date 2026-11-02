# Plain-language checks

The checks are from ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*. The ISO page for the standard is https://www.iso.org/standard/78907.html.

The checks are in the sections from "When you select the text" to "When you write a pointer". The first three of these sections agree with three of the four principles of the standard. The self-check and the reader test of this skill agree with the fourth principle. All four principles are applicable to the reader.

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you select the text

- The agent that loads the file is the only reader. Do not change the text to help a person read it, because STE already keeps the text easy to examine.
- In each Agent instruction, tell when each rule is applicable. Give the condition in the heading of the section of the rule, or in the rule. Then the agent uses the rule only when the condition occurs. In some files, the condition must be in the heading, as "When you put the text in sections and lists" tells you. You can omit the condition only as the next rule tells you. In the description of a Skill, tell when the Skill is applicable.
- Use the condition that is applicable to the smallest number of tasks. A rule with no condition is permitted only when it is applicable to all tasks for its file.
- In files that the platform loads in each session, write only short rules and pointers. The agent reads these files in all tasks.
- Keep only the text that the agent cannot find without help. Examples are project facts, decisions, special instructions of the user, and corrections of incorrect agent work.
- In the edit job, remove the text only in the changed part. When the user tells you that an agent did not obey a rule, do not remove that rule. The user gave that rule so that agents obey it. You can correct the text of that rule. You can also move that rule.
- Remove each instruction that tells the agent to do an action that the agent does without an instruction. Remove the text that the agent can read in the code or in the Git history. Also remove the text that the agent can read in a pointer target.
- In each of these conditions, add one short cause to a rule:
  - The rule changes the usual work of the agent.
  - The rule is not usual for the agent.
  - To obey the rule, the agent must select one of two or more actions.
- For these conditions, examine only the rules that you add or change.
- A file gives the cause when it tells why the rule is necessary. A command, or a line that only gives a value, does not give the cause. If no file gives the cause and the user does not give it, add a warning.

## When you put the text in sections and lists

- Put procedure steps in the sequence of the task, with the necessary conditions first.
- In reference files, `docs/agents/` files, and files that the platform loads in each session, put each rule in a section. In the heading of that section, give the condition of the rule, for example "Before a commit". Then the agent uses the rule only when the condition occurs. A topic heading, for example "Branches", gives no condition. A rule that is applicable to all tasks for its file can be in a section with a topic heading.
- In the glossary and `MEMORY.md`, copy the format of the entries that each file has. This rule replaces the heading rules of this section for these files.
- The rule that starts with "In reference files" gives the files that must have each rule in a section. In these files, when you add a rule and no heading gives its condition, add a heading for the rule. Use the level of the other headings that give a condition. If the file has only a level 1 heading, use level 2. Put the new section after the last section of the file. When a heading gives the condition of a new rule, put the rule after the last rule of that section. Then the other rules do not move. Do not change the headings of the other rules.
- Do not write the condition of the heading again in each rule of the section. Write that condition again only in a pointer and in a step that persons other than the user can see. An example is a step that opens a pull request. An agent can read a pointer or a step without its heading.
- Do not use one template for the sections of all files. The conditions of the rules give the sections.
- Use a numbered list for steps in a sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each template and each command of more than one line in a code block. You can put a command of one line, a path, or a path pattern in a code span.
- In each heading of a section without rules, give the condition or the topic of its section.
- In each file, use only heading levels 1, 2, and 3. More levels make the structure of the file difficult to understand.
- Use no headings that are applicable to all topics, for example "Notes" or "Other". These headings give no condition and no topic.
- When the platform loads the file only through a pointer, find that pointer in a different Agent instruction. Without a pointer, no agent reads the file. If you find no pointer, add a warning.

## When you select the words and the tone

- When you select the words and write the sentences and the paragraphs, obey the rules in `ste-rules.md`.
- When the project has a glossary, use each project term with its meaning in that file.
- Do not give a different meaning to the word of a glossary term. This rule is also applicable when the word does not start with a capital letter. When you write the word "rule" or the term Rule, obey `source-conflicts.md`.
- Use one term for each item: the project term, not a different word with the same meaning.
- Make sure that all parts of the file agree. When the file has a pointer, also make sure that the file agrees with the pointer target. When the project has a glossary, also make sure that the file agrees with the glossary.
- Use no images and no Mermaid diagrams. The agent does not see the drawn diagram. Show a sequence or a structure as a numbered list or a table. You can also show the structure in a code block. Put each lower level of the structure farther to the right.
- Use a neutral and direct tone. Write no text that tells the agent about a punishment or a reward. Write no text that tells the agent good things about itself.
- Do not tell the agent that it is an expert. When a sentence about the work of the agent does not give a correct fact, do not write that sentence.

## When you write a pointer

- When you write a pointer, obey "When you write a pointer" in `loading-rules.md`.
- Write a pointer only to a file that has the text that the agent must read. Do not write a pointer to a file that only has a pointer to a different file. Each extra file is one more file that the agent must find and read.
