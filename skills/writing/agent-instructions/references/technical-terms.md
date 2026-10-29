# Technical nouns and verbs

## When you find the sources of technical words

- This file gives the base list of technical nouns and technical verbs.
- When the project has a glossary, its terms are also technical nouns.
- These terms are applicable only to Agent instructions. They are not applicable to text for persons, for example `README.md`.
- If `SKILL.md` of this skill is not in your context window, read it before you use this file. It defines the terms, the tiers, and the end-of-run report.
- To find the text of a rule from its rule number, read `ste-rules.md`.
- The list contains only terms and meanings that we wrote. It has no table that gives approved words for words that are not approved.

## When you add a word to the base list

- When the edit job changes this skill, add a word to the base list only when most projects use the word in Agent instructions.
- Platform file names and commands have no entry, because a path and a code span count as 1 word.
- The term "rule" has the meaning "a requirement in a text" in this list. A project can also give the name Rule to a type of file. Then the glossary meaning is correct for that file.
- Terms of one platform only are also not in the list, for example "hook" or "slash command".
- Each table row has 3 columns: term, definition, and the words that this list does not permit.
- The last column helps you obey rule 1.11: use one term for each item. Each word in that column is in quotation marks, because the column gives the words only as examples.

## When the glossary gives a different meaning

When the glossary gives a base-list word a different meaning, use the project meaning. The report gives the name of each word of this type.

## When a word is not in the base list or in the glossary

When a technical noun is not in the base list and not in the glossary, add a warning. This rule is also applicable to a technical noun that the user or a different project file uses.

1. If the project has a glossary, recommend a glossary entry in the format of the project.
2. If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition.
3. Do not write the term or the glossary entry until the user gives approval. Until then, use a term from the base list or the glossary, or write a different sentence. A command in a code span is permitted. Do not put a different word in a code span to avoid these steps. When the user tells you to add a term to the glossary, the user gives approval for that term. If the entries are in alphabetical order, put the new entry in that order. If not, put it after the last entry.

## Base list

### Agent terms

| Term | Definition | Do not use |
|---|---|---|
| agent | Software that uses an AI model and tools to do tasks | "assistant", "bot" |
| main agent | The agent that the user starts and that starts subagents | "parent agent", "orchestrator" |
| subagent | An agent that a different agent starts for one task | "sub-agent", "worker", "child agent" |
| model | The AI model that an agent uses | "LLM" (in prose) |
| model knowledge | The facts that a model knows without a file | "training data" |
| prompt | Text that a person or an agent gives to a model as input | "query" |
| session | The time from when an agent starts to when it stops | "conversation", "chat", "thread" |
| context window | All the text that a model can use at one time | "context" (alone) |
| token | A unit of text that a model counts | |
| tool | Software that an agent calls to read or change its environment | "function", "action" |
| tool call | One time that an agent uses a tool | |
| platform | An agent product that reads Agent instructions, for example Codex | "harness", "client" |
| skill | A folder with a `SKILL.md` file that an agent loads when a task makes it necessary | "plugin" |
| frontmatter | The YAML block at the top of a Markdown file | "header", "metadata block" |
| entry file | An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md` | "memory file", "rules file" |
| reference file | A file that an agent reads only in a stated condition | |
| pointer | A sentence that tells the agent which file to read and when | "link" (with this meaning), "import" |
| dry run | A test that reads files and changes no file, Git data, or external service | "simulation" |
| read-only | A limit that lets an agent read files but not change them | |

### Software terms

| Term | Definition | Do not use |
|---|---|---|
| project | The files and the repository of one product | "workspace" |
| repository | A folder with a history that Git records | "repo", "codebase" |
| branch | A line of commits in a repository | |
| commit | One recorded change in a repository | "revision", "changeset" |
| tag | A name that Git gives to one commit, for example `v1.2.0` | |
| pull request | A request to merge one branch into a different branch | "PR", "merge request" |
| issue | One item in an issue tracker | "ticket", "bug report" |
| label | A name that you attach to an issue or a pull request | |
| file | A unit of data on a disk that has a name | "document" (for a file) |
| file size | The number of bytes in a file | |
| folder | A container for files | "directory", "dir" |
| path | The location of a file or a folder | |
| command | A line of text that a shell runs | |
| script | A file of commands that a shell or a program runs | |
| shell | The program that runs commands, for example Bash | "terminal", "console" |
| code block | Text between two fence lines in Markdown | "snippet" |
| code span | Text between two backticks in Markdown | "inline code" |
| heading | A Markdown line that starts with `#` | "header" |
| URL | The location of a web page | "address", "link" (for the location) |
| placeholder | Text in angle brackets that the author replaces, for example `<name>` | "variable" |
| external service | A system on a different computer that the agent can change, for example GitHub | |
| structured output | Output in a fixed data format, for example JSON | |

### Terms for text

| Term | Definition | Do not use |
|---|---|---|
| text | The words of a file or of a part of a file | "content", "copy" |
| sentence | A group of words that starts with a capital letter and stops with a period or a question mark. "When you count words" in `ste-rules.md` tells when a colon stops a sentence | |
| term | A word or words with one specified meaning | "keyword" |
| rule | A requirement in a text that tells the reader what to do or not to do | "guideline", "directive" |
| section | The part of a file from one heading to the next heading with the same number of `#` characters | "chapter" |
| list | Items that are written one below the other, each with a bullet or a number | |
| table | Data in rows and columns | "grid", "matrix" |
| title | A heading, a bold label in a list, or a cell in the first row of a table | |
| note | Text that gives information only, not an instruction | "tip", "hint" |
| description | The frontmatter field that tells an agent when to load a Skill | "summary" |
| template | Text with placeholders that the author copies and completes | "boilerplate" |
| quoted text | Text in quotation marks, or text that the author copies from a source | |
| report | The text that an agent gives when it stops a task | "output" (for a report) |

These words are also technical nouns. They have the meaning that they have in grammar:

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

| Term | Definition | Do not use |
|---|---|---|
| user | The person who gives a task to an agent | "human" |
| author | The agent or person who writes an Agent instruction | "writer" |
| reader | The agent that reads an Agent instruction and obeys it | "consumer" |
| reviewer | An agent that examines a text and gives findings | "checker", "auditor" |

### Names

| Term | Definition | Do not use |
|---|---|---|
| Codex | The agent platform from OpenAI | |
| OpenCode | The open-source agent platform OpenCode | |
| Claude Code | The agent platform from Anthropic | |
| Git | The version control program | |
| GitHub | The service that keeps Git repositories | |
| Markdown | The text format of Agent instructions | |
| YAML | The data format of frontmatter | |
| JSON | A data format for structured data | |

### Verbs

| Term | Definition | Do not use |
|---|---|---|
| commit | Record a change in a repository | "check in" |
| push | Send commits to a remote repository | "publish", "upload" |
| merge | Put the commits of one branch into a different branch | |
| install | Put software on a computer and make it ready to operate | "set up" |
| run | Make a command, a script, or a test operate until it stops | "execute", "invoke" |
| load | Read a file into the context window | "import" |
| call | Use a tool | "invoke", "trigger" |
| save | Write data to a file | "store", "persist" |
| delete | Remove a file, a branch, or an issue permanently | "purge" |
| copy | Make one more item with the same data | "duplicate" |
| edit | Change the text of a file | "modify", "update" |
| search | Use a program to find text, files, or tools | "grep" (in prose) |
| undo | Cancel the result of a previous change | "revert" (in prose) |
