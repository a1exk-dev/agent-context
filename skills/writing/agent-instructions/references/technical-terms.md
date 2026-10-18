# Technical nouns and verbs

## When you find the sources of technical words

- This file gives the base list of technical nouns (TN) and technical verbs (TV).
- When the project has a `CONTEXT.md` file, its terms are also technical nouns.
- These terms are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`.
- If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report.
- To find the text of a rule from its rule number, read `ste-rules.md`.
- The list contains only terms and meanings that we wrote. It has no table that gives approved words for words that are not approved.

## When you add a word to the base list

- When the edit job changes this skill, add a noun to the base list only in these 2 conditions (rules 1.5 and 1.6):
  - Most projects use the noun in Agent instructions.
  - No approved STE word has the same meaning.
- Add a verb to the base list when no approved STE verb gives the same instruction (rule 1.12).
- Each noun has a maximum of 3 words (rule 1.9). It is not a regional word, slang, or jargon (rule 1.10).
- Platform file names and commands have no entry, because a path and a code span count as 1 word.
- The term "rule" has the meaning "a requirement in a text" in this list. A project can also give the name Rule to a type of file. Then the `CONTEXT.md` meaning is correct for that file.
- Terms of one platform only are also not in the list, for example "hook" or "slash command".
- Each table row has 5 columns: term, type, word group, definition, and the words that this list does not permit.
- The type is TN or TV. The word group of a TN is a number from rule 1.5. The word group of a TV is a number and a letter from rule 1.12.
- The last column helps you obey rule 1.11: use one term for each item. Each word in that column is in quotation marks, because the column gives the words only as examples.

## Word groups in this list

| Word group | Rule | Title |
|---|---|---|
| 11 | 1.5 | Professional roles, persons, groups, and organizations |
| 15 | 1.5 | Documents, parts of documents, standards, and guidelines |
| 19 | 1.5 | Computer science, information technology, and communication technology |
| 21 | 1.5 | Law and regulations |
| 2a | 1.12 | Computer processes: input and output |
| 2b | 1.12 | Computer processes: user interface and applications |
| 2c | 1.12 | Computer processes: system operations |

## When CONTEXT.md gives a different meaning

When the project `CONTEXT.md` gives a base-list word a different meaning, use the project meaning. The report gives the name of each word of this type.

## When a word is not in the base list or in CONTEXT.md

When a word is not an approved word, not in this list, and not in `CONTEXT.md`, add a warning. This rule is also applicable to a word that the user or a different project file uses.

1. If an approved STE word has the same meaning, recommend that word.
2. If no word has the same meaning, recommend a `CONTEXT.md` entry in the format of the project.
3. If the project has no `CONTEXT.md`, recommend a new `CONTEXT.md` with a short structure: the term and its definition.
4. Do not write the recommended word or the `CONTEXT.md` entry until the user gives approval. Until then, use an approved word or a different sentence. A command in a code span is permitted. Do not put a different word in a code span to avoid these steps. When the user tells you to add a term to `CONTEXT.md`, the user gives approval for that term. If the entries are in alphabetical order, put the new entry in that order. If not, put it after the last entry.

This list uses model knowledge to find approved words. Do these steps only for a word that model knowledge tells you is not approved.

## Base list

### Agent terms

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| agent | TN | 19 | Software that uses an AI model and tools to do tasks | "assistant", "bot" |
| main agent | TN | 19 | The agent that the user starts and that starts subagents | "parent agent", "orchestrator" |
| subagent | TN | 19 | An agent that a different agent starts for one task | "sub-agent", "worker", "child agent" |
| model | TN | 19 | The AI model that an agent uses | "LLM" (in prose) |
| model knowledge | TN | 19 | The facts that a model knows without a file | "training data" |
| prompt | TN | 19 | Text that a person or an agent gives to a model as input | "query" |
| session | TN | 19 | The time from when an agent starts to when it stops | "conversation", "chat", "thread" |
| context window | TN | 19 | All the text that a model can use at one time | "context" (alone) |
| token | TN | 19 | A unit of text that a model counts | |
| tool | TN | 19 | Software that an agent calls to read or change its environment | "function", "action" |
| tool call | TN | 19 | One time that an agent uses a tool | |
| platform | TN | 19 | An agent product that reads Agent instructions, for example Codex | "harness", "client" |
| skill | TN | 19 | A folder with a `SKILL.md` file that an agent loads when a task makes it necessary | "plugin" |
| frontmatter | TN | 19 | The YAML block at the top of a Markdown file | "header", "metadata block" |
| entry file | TN | 19 | An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md` | "memory file", "rules file" |
| reference file | TN | 19 | A file that an agent reads only in a stated condition | |
| pointer | TN | 19 | A sentence that tells the agent which file to read and when | "link" (with this meaning), "import" |
| dry run | TN | 19 | A test that reads files and changes no file, Git data, or external service | "simulation" |
| read-only | TN | 19 | A limit that lets an agent read files but not change them | |

### Software terms

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| project | TN | 19 | The files and the repository of one product | "workspace" |
| repository | TN | 19 | A folder with a history that Git records | "repo", "codebase" |
| branch | TN | 19 | A line of commits in a repository | |
| commit | TN | 19 | One recorded change in a repository | "revision", "changeset" |
| tag | TN | 19 | A name that Git gives to one commit, for example `v1.2.0` | |
| pull request | TN | 19 | A request to merge one branch into a different branch | "PR", "merge request" |
| issue | TN | 19 | One item in an issue tracker | "ticket", "bug report" |
| label | TN | 19 | A name that you attach to an issue or a pull request | |
| file | TN | 19 | A unit of data on a disk that has a name | "document" (for a file) |
| file size | TN | 19 | The number of bytes in a file | |
| folder | TN | 19 | A container for files | "directory", "dir" |
| path | TN | 19 | The location of a file or a folder | |
| command | TN | 19 | A line of text that a shell runs | |
| script | TN | 19 | A file of commands that a shell or a program runs | |
| shell | TN | 19 | The program that runs commands, for example Bash | "terminal", "console" |
| code block | TN | 19 | Text between two fence lines in Markdown | "snippet" |
| code span | TN | 19 | Text between two backticks in Markdown | "inline code" |
| heading | TN | 19 | A Markdown line that starts with `#` | "header" |
| URL | TN | 19 | The location of a web page | "address", "link" (for the location) |
| placeholder | TN | 19 | Text in angle brackets that the author replaces, for example `<name>` | "variable" |
| external service | TN | 19 | A system on a different computer that the agent can change, for example GitHub | |
| structured output | TN | 19 | Output in a fixed data format, for example JSON | |

### Terms for text

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| text | TN | 15 | The words of a file or of a part of a file | "content", "copy" |
| sentence | TN | 15 | A group of words that starts with a capital letter and stops with a period, a colon, or a question mark | |
| term | TN | 21 | A word or words with one specified meaning | "keyword" |
| rule | TN | 21 | A requirement in a text that tells the reader what to do or not to do | "guideline", "directive" |
| section | TN | 15 | The part of a file from one heading to the next heading with the same number of `#` characters | "chapter" |
| list | TN | 15 | Items that are written one below the other, each with a bullet or a number | |
| table | TN | 15 | Data in rows and columns | "grid", "matrix" |
| title | TN | 15 | A heading, a bold label in a list, or a cell in the first row of a table | |
| note | TN | 15 | Text that gives information only, not an instruction | "tip", "hint" |
| description | TN | 15 | The frontmatter field that tells an agent when to load a Skill | "summary" |
| template | TN | 15 | Text with placeholders that the author copies and completes | "boilerplate" |
| quoted text | TN | 15 | Text in quotation marks, or text that the author copies from a source | |
| report | TN | 15 | The text that an agent gives when it stops a task | "output" (for a report) |

These words are also TN in word group 15. They have the meaning that they have in grammar:

- word
- noun
- verb
- adjective
- article
- pronoun
- phrase
- imperative
- passive voice
- modal verb
- mood
- part of speech
- paragraph
- punctuation
- colon
- semicolon
- hyphen
- contraction
- abbreviation
- infinitive
- simple present
- simple past
- simple future
- past participle
- perfect tense
- progressive tense
- active voice
- modifier
- comparative form
- subject
- possessive form

### Roles

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| user | TN | 11 | The person who gives a task to an agent | "human" |
| author | TN | 11 | The agent or person who writes an Agent instruction | "writer" |
| reader | TN | 11 | The agent that reads an Agent instruction and obeys it | "consumer" |
| reviewer | TN | 11 | An agent that examines a text and gives findings | "checker", "auditor" |

### Names

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| Codex | TN | 19 | The agent platform from OpenAI | |
| OpenCode | TN | 19 | The open-source agent platform OpenCode | |
| Claude Code | TN | 19 | The agent platform from Anthropic | |
| Git | TN | 19 | The version control program | |
| GitHub | TN | 19 | The service that keeps Git repositories | |
| Markdown | TN | 19 | The text format of Agent instructions | |
| YAML | TN | 19 | The data format of frontmatter | |
| JSON | TN | 19 | A data format for structured data | |

### Verbs

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| commit | TV | 2b | Record a change in a repository | "check in" |
| push | TV | 2a | Send commits to a remote repository | "publish", "upload" |
| merge | TV | 2b | Put the commits of one branch into a different branch | |
| install | TV | 2c | Put software on a computer and make it ready to operate | "set up" |
| run | TV | 2c | Make a command, a script, or a test operate until it stops | "execute", "invoke" |
| load | TV | 2a | Read a file into the context window | "import" |
| call | TV | 2b | Use a tool | "invoke", "trigger" |
| save | TV | 2a | Write data to a file | "store", "persist" |
| delete | TV | 2b | Remove a file, a branch, or an issue permanently | "purge" |
| copy | TV | 2b | Make one more item with the same data | "duplicate" |
| edit | TV | 2b | Change the text of a file | "modify", "update" |
| search | TV | 2b | Use a program to find text, files, or tools | "grep" (in prose) |
| undo | TV | 2b | Cancel the result of a previous change | "revert" (in prose) |
