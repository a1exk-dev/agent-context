Blocking checklist:
1. "Put procedure steps in the sequence of the task, with the necessary conditions first. (blocking)" - none
2. "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section. In each file, put each new pointer in a section, also a pointer whose condition you change. In the heading of that section, give the condition where the rule or the pointer is applicable, for example "Before a commit". If no heading gives that condition, add a heading. A topic heading, for example "Branches", gives no condition. (blocking)" - none
3. "Write each pointer as a sentence that gives the file and the condition to read it. When the heading of a pointer gives the condition, also put the condition in the pointer. A pointer with no condition is a problem in the self-check. (blocking)" - none
4. "In each pointer, give the path of its target. Words such as "that file" give no path. (blocking)" - none

File size: skills/writing/agent-instructions/references/plain-language-rules.md has 7,195 bytes. Limit: loading-rules.md and agent-skills-spec.md give no limit for a reference file of a Skill.

Pointer conditions in the sections under review (heading "When you put the text in sections and lists"):
- Line 33: "In reference files, `docs/agents/` files, and files that load in each session, put each rule in a section." This sentence is a rule, not a pointer.
- Line 34: "In the glossary and `MEMORY.md`, copy the format of the entries that the file has." This sentence is a rule, not a pointer.
- Line 45: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." This sentence is a rule, not a pointer.

Pointers that name no file: none.

- Rule: "Add one short cause to a rule in each of these conditions:" - "The rule is not usual for the agent. (advisory)"
- Text: "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers. (advisory)"
- Problem: In skills/writing/agent-instructions/references/plain-language-rules.md line 45, the changed rule limits where an author puts a pointer, which is not the usual work of an agent, but the rule gives no cause.
- Correction: Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file. Make no sequences of pointers, because an agent can stop before it reads the last file of a sequence. (advisory)
