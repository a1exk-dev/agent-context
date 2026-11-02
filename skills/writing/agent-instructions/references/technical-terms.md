# Technical nouns and verbs

## When SKILL.md is not in your context window

If `SKILL.md` of this skill is not in your context window, read `SKILL.md` before you use this file. `SKILL.md` defines the terms and the tiers.

## When you must find the text of a rule from its rule number

To find the text of a rule from its rule number, read `ste-rules.md`.

## When you find the sources of technical words

- This file gives the base list of technical nouns (TN) and technical verbs (TV).
- The base list contains only terms and meanings that we wrote. It has no table that gives approved words for words that are not approved.

## When you add a word to the base list

- Add a noun to the base list only if both items are correct:
  - The noun is in a word group of rule 1.5. Most projects use the noun in Agent instructions, or this skill uses the noun in its reference files. The base list is applicable in all projects that install this skill.
  - No approved STE word has the same meaning (rule 1.6).
- Add a verb to the base list only if this item is correct:
  - No approved STE verb gives the same instruction (rule 1.12).
- When you select a noun for the base list, use a maximum of 3 words (rule 1.9). Do not add a word that only persons in one area know (rule 1.10). Do not add a word that only a small group of persons knows.
- Do not add an entry for a platform file name or a command. The word rules are not applicable to file paths, code spans, and commands (rule 8.6).
- Do not add a term of one platform only, for example "hook" or "slash command". The base list is applicable to all target platforms.

## Word groups in the base list

| Word group | Rule | Title |
|---|---|---|
| 11 | 1.5 | Professional roles, persons, groups, and organizations |
| 15 | 1.5 | Documents, parts of documents, standards, and guidelines |
| 19 | 1.5 | Computer science, information technology, and communication technology |
| 21 | 1.5 | Law and regulations |
| 2a | 1.12 | Computer processes: input and output |
| 2b | 1.12 | Computer processes: user interface and applications |
| 2c | 1.12 | Computer processes: system operations |

## When the glossary gives a base-list word a different meaning

Use the project meaning, because the user controls the terms of the project. In the "Base-list words with a project meaning" part of the end-of-run report, give each base-list word that has a project meaning.

Examples of these words are "rule" and "skill". A project can give the name Rule to a type of file. A project can give the name Skill to a type of folder.

## When you write the word "rule" or the term Rule

When you write the word "rule" or the term Rule, obey the case for the term Rule in `source-conflicts.md`. That case replaces the first sentence of "When the glossary gives a base-list word a different meaning" for the word "rule". Also give "rule" in the "Base-list words with a project meaning" part.

## When you write "skill" or "Skill"

When you write "skill" or "Skill", obey the case for the term Skill in `source-conflicts.md`.

## When a word is not approved, not in the base list, and not in the glossary

When no different sentence with approved words is clear, do these steps. When `ste-rules.md` tells you to do these steps, also do them. In all other conditions, do not do these steps. Many warnings hide the important warnings.

1. Add a warning.
2. If an approved STE word has the same meaning, recommend that word.
3. If no approved STE word has the same meaning, do one of these steps:
   - If the project has a glossary, recommend an entry in the format of that glossary.
   - If the project has no glossary, recommend a new `GLOSSARY.md` with a short structure: the term and its definition.

Obey these rules for the recommended word and the glossary entry:

- Until the user approves the glossary entry, do not write that entry. Until the user approves the change, do not replace a word in the glossary or in a different project file. The user controls the terms of the project.
- When the user tells you to add a term to the glossary, the user approves that term.
- Until the user approves the recommended word, use that word only in your new text. If step 2 recommends no word, keep the word that is not approved. A clear sentence is more important than an approved word. Before you keep a word that is not approved, read "When your text contains a known word that is not approved" in `ste-rules.md`. Do not keep a word that the list in that section of `ste-rules.md` gives. A command in a code span is permitted.
- Do not put a word that is not approved in a code span. A code span does not replace these steps. The word rules are not applicable to code spans.
- If the entries are in alphabetical order, put the new entry in that order. If the entries are not in alphabetical order, put the new entry after the last entry.

## Base list

### Agent terms

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| agent | TN | 19 | Software that uses an AI model and tools to do tasks | "assistant", "bot" |
| main agent | TN | 19 | The agent that the user starts and that starts subagents | "parent agent", "orchestrator" |
| subagent | TN | 19 | An agent that a different agent starts for one task | "sub-agent", "worker", "child agent" |
| model | TN | 19 | The AI model that an agent uses | "LLM" in a sentence |
| model knowledge | TN | 19 | The facts that a model knows without a file | "training data" |
| prompt | TN | 19 | Text that a person or an agent gives to a model as input | "query" |
| session | TN | 19 | The time from when an agent starts to when it stops | "conversation", "chat", "thread" |
| context window | TN | 19 | All the text that a model can use at one time | "context" alone |
| token | TN | 19 | A unit of text that a model counts | |
| tool | TN | 19 | Software that an agent calls to read or change its environment | "function", "action" for a tool |
| check | TN | 19 | One time that a reviewer, a reader, a script, or a platform examines a file | |
| copy | TN | 19 | A file or a folder with the same data as a different file or folder | |
| absolute path | TN | 19 | A path that gives each folder from the top folder to the file or folder | "full path" |
| tool call | TN | 19 | One time that an agent uses a tool | |
| package | TN | 19 | Software that a script installs and uses, for example an npm package | "library", "dependency" |
| platform | TN | 19 | An agent product that reads Agent instructions, for example Codex | "harness", "client" |
| skill | TN | 19 | A folder with a `SKILL.md` file and the other files that the skill uses | "plugin" |
| frontmatter | TN | 19 | The YAML block at the top of a Markdown file | "header", "metadata block" |
| entry file | TN | 19 | An Agent instruction that a platform loads at the start of each session, for example `AGENTS.md` | "memory file", "rules file" |
| subagent definition | TN | 19 | A file that tells a platform how to start a subagent | |
| reference file | TN | 19 | A file that an agent reads only in the condition that a pointer gives | |
| pointer | TN | 19 | A sentence that tells an agent which file to read and when to read that file | "link" with this meaning, "import" |
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
| issue | TN | 19 | One record of a task or a problem in a project, for example on GitHub | "ticket", "bug report" |
| label | TN | 19 | A name that you attach to an issue or a pull request | |
| file | TN | 19 | A unit of data that has a name and that is on a disk | "document" for a file |
| file size | TN | 19 | The number of bytes in a file | |
| folder | TN | 19 | A container for files | "directory", "dir" |
| path | TN | 19 | The location of a file or a folder | |
| command | TN | 19 | A line of text that a shell runs | |
| script | TN | 19 | A file of commands that a shell or a program runs | |
| shell | TN | 19 | The program that runs commands, for example Bash | "terminal", "console" |
| code block | TN | 19 | Text between two lines of three backticks in Markdown | "snippet" |
| code span | TN | 19 | Text between two backticks in Markdown | "inline code" |
| heading | TN | 19 | A Markdown line that starts with `#` | "header" |
| URL | TN | 19 | The location of a web page | "address", "link" for the location |
| placeholder | TN | 19 | Text in angle brackets that the author replaces, for example `<name>` | "variable" |
| external service | TN | 19 | A system on a different computer that the agent can change, for example GitHub | |
| structured output | TN | 19 | Output in a specified data format, for example JSON | |

### Terms for text

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| text | TN | 15 | The words of a file or of a part of a file | "content", "copy" for text |
| sentence | TN | 15 | Words up to a period, a question mark, or a colon that "When you count words" in `ste-rules.md` gives. | |
| term | TN | 21 | A word or words with one specified meaning | "keyword" |
| rule | TN | 21 | A requirement in a text that tells the reader what to do or not to do | "guideline", "directive" |
| section | TN | 15 | The part of a file from one heading to the next heading with the same number of `#` characters or fewer | "chapter" |
| list | TN | 15 | Items that are written one below the other, each with a bullet or a number | |
| table | TN | 15 | Data in rows and columns | "grid", "matrix" |
| title | TN | 15 | A heading, a bold label, or a cell in the first row of a table | |
| note | TN | 15 | Text that gives information only, not an instruction | "tip", "hint" |
| description | TN | 15 | The frontmatter field that tells an agent when to load a skill | "summary" for this field |
| template | TN | 15 | Text with placeholders that the author copies and completes | "boilerplate" |
| quoted text | TN | 15 | Text in quotation marks, text that the author copies from a source, a code span, a file path, a command, or a URL | |
| bullet | TN | 15 | The mark at the start of an item in a Markdown list, for example `-` | |
| rule bullet | TN | 15 | A list item that starts with a bullet and gives an instruction or a rule | |
| emphasis | TN | 15 | Words in capital letters or other marks that tell the reader that a text is more important, for example "IMPORTANT" | |
| backtick | TN | 15 | The character that starts and stops a code span in Markdown | |
| base list | TN | 15 | The tables and the list of technical nouns and technical verbs in the "Base list" section of this file | |
| word group | TN | 15 | One of the groups of technical words in rule 1.5 or rule 1.12 | |
| word count | TN | 15 | The number of words in a sentence | |
| entry | TN | 15 | One item of a glossary, of `MEMORY.md`, or of a list, for example a term and its definition | |
| definition | TN | 15 | The text that tells the meaning of a term | |
| character | TN | 19 | One letter, digit, or mark in a text | |
| feature | TN | 19 | A file name, a folder, a frontmatter field, or a line format that a platform reads | |
| case | TN | 15 | One problem in which two sources do not agree | |
| bold label | TN | 15 | Bold text at the start of a list item | |
| report | TN | 15 | The text that an agent gives at the end of a task or of a check | "output" for a report |
| cell | TN | 19 | One box of a table, in one row and one column | |
| file layout | TN | 15 | The files that contain the text of a task, and the text in each file | |

A list item with no period and a table body cell that gives an instruction or a fact are also sentences.

Word group 15 also contains these TN, with the meaning that each TN has in grammar:

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
- comma
- semicolon
- hyphen
- period
- question mark
- quotation mark
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
- singular form
- plural form
- grammar
- parenthesis

### Roles

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| user | TN | 11 | The person who gives a task to an agent | "human" |
| author | TN | 11 | The agent that uses this skill to write or edit an Agent instruction | "writer" |
| reader | TN | 11 | The agent that reads an Agent instruction and obeys it | "consumer" |
| reviewer | TN | 11 | An agent that examines a text and gives findings | "checker", "auditor" |

### Names

| Term | Type | Word group | Definition | Do not use |
|---|---|---|---|---|
| Codex | TN | 19 | The agent platform from OpenAI | |
| OpenCode | TN | 19 | The agent platform that has the name OpenCode | |
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
| call | TV | 2b | Send a request to a tool and get its result | "invoke", "trigger" |
| save | TV | 2a | Write data to a file on a disk, so that the data stays after the session | "store", "persist" |
| delete | TV | 2b | Remove a file, a branch, or an issue permanently | "purge" |
| copy | TV | 2b | Make one more item with the same data | "duplicate" |
| edit | TV | 2b | Change the text of a file that the project has, and keep that file | "modify", "update" |
| search | TV | 2b | Use a program to find text, files, or tools | "grep" in a sentence |
| undo | TV | 2b | Cancel the result of a previous change | "revert" in a sentence |

## When you write or read an entry of the base list

- Each table row has 5 columns: term, type, word group, definition, and the words that are not permitted.
- The type is TN or TV. The word group of a TN is a number from rule 1.5. The word group of a TV is a number and a letter from rule 1.12.
- In a TN row, the definition is a noun phrase that tells what the term is. In a TV row, the definition completes the sentence "To <term> is to ...".
- The last column helps you obey rule 1.11, which tells you to use one term for each item. Each word that the base list does not permit is in quotation marks, because the column gives only examples. The words after the quotation marks give the limit of that example.
