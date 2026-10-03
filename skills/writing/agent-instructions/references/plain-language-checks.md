# Plain-language checks

These checks are tier 3. They come from ISO 24495-1:2023, *Plain language — Part 1: Governing principles and guidelines*. The catalog page is https://www.iso.org/standard/78907.html.

The checks are in groups under four principles. We give the principles in our own words. They follow the plain-language definition of the International Plain Language Federation: https://www.iplfederation.org/plain-language-definitions/. All four principles apply to an agent reader. Rules about images do not apply.

## The reader gets what it needs

- The agent that loads the file is the only reader. Make no changes for a human reader. STE keeps the text easy to review.
- Each Agent instruction states when it applies. A Skill states it in its description. Each section of a file that loads in every session states it as a condition, for example "Before X, ...".
- Use the narrowest real condition. Text with no condition is permitted only when it applies to every task in the scope of the file.
- Files that load in every session hold only short rules and conditional pointers. Move detail to files that load on demand.
- Keep only what the agent cannot find alone. Examples are project facts, decisions, special preferences, and corrections of agent behavior.
- Remove defaults. Remove what the agent can read from the code, the Git history, or a file that a pointer names.
- When a rule changes an agent default, surprises the agent, or needs judgment, add one short reason.

## The reader finds what it needs

- Put procedure steps in task order, with the prerequisites first.
- In reference files and files that load in every session, put each rule under a heading. The heading names the situation where the rule applies, for example "Before a commit". A topic heading, for example "Branches", does not name a situation.
- When you add a rule and no heading names its situation, add a heading for the rule.
- No section template is necessary.
- Use a numbered list for steps in sequence. Use bullets for rules in no sequence. Use a table to compare items or to give reference data. Put each command, path pattern, or template in a code block.
- Each other heading names the situation or the topic of its section. Use no heading below level 3.
- Use no catch-all headings, for example "Notes" or "Other".
- Each pointer states when to read its target. A pointer with no condition fails the self-check.
- A pointer target is one level from the file that points to it. Make no chains of pointers.

## The reader understands what it reads

- The STE check covers familiar words and clear, short sentences and paragraphs.
- The project `CONTEXT.md` is the source of project terms. Use each term with its meaning in the glossary.
- Use one term for each concept: the glossary term, not a synonym.
- Make sure that the file has no contradiction in itself or with the files that it points to directly. Without a `CONTEXT.md`, check the consistency in the file only.
- Use no images and no Mermaid diagrams. Show a flow or a structure as a numbered list, a table, or an indented tree in a code block.
- Use a neutral and direct tone. Use no threats, rewards, flattery, or emotional pressure.
- Write a role sentence only if it states a real fact about the job.

## The reader can use what it reads

- During the write job or the edit job, the self-check evaluates the text.
- After the self-check, the reader test evaluates the text with fresh readers.
- After the file is in use, the edit job evaluates the text again. A report of incorrect agent behavior becomes a reader-test task.
