# Technical nouns and verbs

## Sources of technical words

- This file gives the base list of technical nouns (TN) and technical verbs (TV).
- When the project has a `CONTEXT.md` file, its terms are also technical nouns.
- The list holds only our own terms and meanings. It has no table that gives approved words for words that are not approved.

## Rules for the base list

- A term is in the base list when most projects use it in Agent instructions and no approved STE word has the same meaning (rule 1.12).
- Platform file names have no entry, because a path counts as 1 word.
- The term "rule" is not in the list, because its meaning is different in each project.
- Terms of one platform only are also not in the list, for example hook or slash command.
- Each entry has 5 columns: term, type, category, definition, and the words that you must not use for the term.
- The type is TN or TV. The category is a number from rule 1.5 or rule 1.12.
- The last column supports rule 1.11: use one term for each item.

## When CONTEXT.md gives a different meaning

When the project `CONTEXT.md` gives a base-list word a different meaning, the project meaning wins. The report names each word of this type.

## When a word is in neither source

When a word is not an approved word, not in this list, and not in `CONTEXT.md`, add a warning.

1. If an approved STE word fits, propose that word.
2. If no word fits, propose a `CONTEXT.md` entry in the format of the project.
3. If the project has no `CONTEXT.md`, propose a new `CONTEXT.md` with a simple form: the term and its definition.
4. Write nothing until the user says yes. The loading reviewer then checks the result.

This list uses model knowledge to find approved words. Each report contains the word-choice warning that `SKILL.md` gives.

## Base list

Category 19 is computer science and information technology (rule 1.5). Category 2 is computer processes (rule 1.12).

### Agent terms

| Term | Type | Category | Definition | Do not use |
|---|---|---|---|---|
| agent | TN | 19 | Software that uses an AI model and tools to do tasks | assistant, bot |
| subagent | TN | 19 | An agent that another agent starts for one task | sub-agent, worker, child agent |
| model | TN | 19 | The AI model that an agent uses | LLM (in prose) |
| prompt | TN | 19 | Text that a person or an agent gives to a model as input | query |
| session | TN | 19 | One run of an agent, from start to stop | conversation, chat, thread |
| context window | TN | 19 | All the text that a model can use at one time | context (alone) |
| token | TN | 19 | A unit of text that a model counts | |
| tool | TN | 19 | Software that an agent calls to read or change its environment | function, action |
| tool call | TN | 19 | One use of a tool by an agent | |
| platform | TN | 19 | An agent product that reads Agent instructions, for example Codex | harness, client |
| skill | TN | 19 | A folder with a `SKILL.md` file that an agent loads when a task needs it | plugin |
| frontmatter | TN | 19 | The YAML block at the top of a Markdown file | header, metadata block |
| entry file | TN | 19 | An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md` | memory file, rules file |
| reference file | TN | 19 | A file that an agent reads only when a stated condition applies | |
| pointer | TN | 19 | A sentence that tells the agent which file to read and when | link (in this sense), import |

### Software terms

| Term | Type | Category | Definition | Do not use |
|---|---|---|---|---|
| repository | TN | 19 | A folder whose history Git records | repo, codebase |
| branch | TN | 19 | A line of commits in a repository | |
| commit | TN | 19 | One recorded change in a repository | revision, changeset |
| pull request | TN | 19 | A request to merge one branch into another | PR, merge request |
| issue | TN | 19 | One item in an issue tracker | ticket, bug report |
| label | TN | 19 | A name that you attach to an issue or pull request | tag |
| file | TN | 19 | A named unit of data on a disk | document (for a file) |
| folder | TN | 19 | A container for files | directory, dir |
| path | TN | 19 | The location of a file or folder | |
| command | TN | 19 | A line of text that a shell runs | |
| script | TN | 19 | A file of commands that a shell or program runs | |
| shell | TN | 19 | The program that runs commands, for example Bash | terminal, console |
| code block | TN | 19 | Text between two fence lines in Markdown | snippet |
| code span | TN | 19 | Text between two backticks in Markdown | inline code |
| heading | TN | 19 | A Markdown line that starts with `#` | header, title |
| URL | TN | 19 | The location of a web page | address, link (for the address) |
| placeholder | TN | 19 | Text in angle brackets that the author replaces, for example `<name>` | variable |

### Names

| Term | Type | Category | Definition | Do not use |
|---|---|---|---|---|
| Codex | TN | 19 | The agent platform from OpenAI | |
| OpenCode | TN | 19 | The open-source agent platform OpenCode | |
| Claude Code | TN | 19 | The agent platform from Anthropic | |
| Git | TN | 19 | The version control program | |
| GitHub | TN | 19 | The service that hosts Git repositories | |
| Markdown | TN | 19 | The text format of Agent instructions | |
| YAML | TN | 19 | The data format of frontmatter | |
| JSON | TN | 19 | A data format for structured data | |

### Verbs

| Term | Type | Category | Definition | Do not use |
|---|---|---|---|---|
| commit | TV | 2 | Record a change in a repository | check in |
| push | TV | 2 | Send commits to a remote repository | publish, upload |
| merge | TV | 2 | Join one branch into another | |
| install | TV | 2 | Put software on a computer so that it can operate | set up |
| run | TV | 2 | Make a command, script, or test operate until it stops | execute, invoke |
| load | TV | 2 | Read a file into the context window | import, include |
| call | TV | 2 | Use a tool | invoke, trigger |
| save | TV | 2 | Write data to a file | store, persist |
| delete | TV | 2 | Remove a file, branch, or issue permanently | erase, purge |
| copy | TV | 2 | Make one more item with the same data | duplicate |
