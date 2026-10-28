# New Commit policy and new Settings

Read this file when the project has no Commit policy. Also read this file when a name in the Setting table has no Setting. The Setting table and the sections that this file refers to are in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

## When a Setting is not in the Commit policy

When the Commit policy has no incorrect line and a name in the table has no Setting, do these steps:

1. For each name that has no Setting, ask the Operator one question with the question tool of the platform. Give the default value as the first answer. Tell the Operator that the default value is the recommended answer.
2. If the platform has no question tool, or the question tool gives an error, use the default value. In these conditions, the Operator cannot give an answer.
3. Add one Setting for each of these names to the Commit policy, in the sequence of the table. Use the answer of the Operator or the default value. Then, at the next commit, you do not ask a question about these Settings.
4. Stage only `docs/agents/commit-policy.md`. Commit it alone with the message `chore: update commit policy`, as the sections "When you write the commit message" and "When you commit" tell you. Then the change to the Commit policy is not in a commit of the task. The `Commit approval` Setting of the changed Commit policy is applicable to this commit.

   When you stop after this step and before the commit, do not stage the task files. An example of this stop is a Commit review that has no answer. Only the Commit policy stays staged. When the Operator answers `Commit` later, commit the Commit policy first. Then do step 5.
5. Then stage the task files as the section "When you stage files" tells you. Then commit the task files.

## When the Commit policy is not there

Before the first `git add`, do these steps:

1. Find the answers for the new Commit policy in the prompt. The prompt can tell you to "use the default commit policy". The prompt can also give a value for each name in the table.
2. If the prompt gives one of these answers, go to step 6. Do not ask a question, because the prompt gives the answers.
3. Show the default Commit policy to the Operator in a code block. Write the title `# Commit policy`, a blank line, and one Setting for each name in the sequence of the table. Use the default values. Then the Operator can see the default values before the answer.
4. Ask the Operator one question with the answers `Use defaults` and `Choose each setting`. Give `Use defaults` as the first answer. Tell the Operator that `Use defaults` is the recommended answer.

   When you cannot use a question tool in steps 4 to 6, do not write, stage, or commit a file. Only the Operator selects the values of a new Commit policy. These values give all commit decisions of the project. In your report, give each name in the table that has no answer. Tell the Operator to give a value for each of these names, or to tell you to "use the default commit policy". Then stop.
5. When the Operator answers `Choose each setting`, ask one question for each name in the table, in the sequence of the table. Ask only one question in each tool call, because the answer to one Setting can change the next answer. Give the default value as the first answer. Tell the Operator that the default value is the recommended answer. For a list, a number, or a footer token, the Operator can also give a different value as text.
6. Make sure that each name in the table has a value from the Values column. The answer `Use defaults` and the words "use the default commit policy" give the default values. If a name has no value, ask the question of step 5 for that name. When the value is not in that column, also ask that question.
7. If the folder `docs/agents/` is not there, make the folder.
8. Write the file `docs/agents/commit-policy.md`. Write the title `# Commit policy`, a blank line, and one Setting for each name in the sequence of the table. Use the values of step 6.
9. Stage only `docs/agents/commit-policy.md`. Commit it alone with the message `chore: add commit policy`, as the sections "When you write the commit message" and "When you commit" tell you. Then the new Commit policy is not in a commit of the task. The `Commit approval` Setting of the new Commit policy is applicable to this commit.

   When you stop after this step and before the commit, do not stage the task files. An example of this stop is a Commit review that has no answer. The Commit policy must be in a commit alone. Only the Commit policy stays staged. When the Operator answers `Commit` later, commit the Commit policy first. Then do step 10.
10. After this commit, stage the task files as the section "When you stage files" tells you. Then commit the task files.
