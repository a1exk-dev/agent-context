# New Changelog policy and new Settings

Read this file when the project has no Changelog policy. Also read this file when a name in the Setting table has no Setting. The Setting table and the default Changelog policy are in `SKILL.md` of this skill. If `SKILL.md` is not in your context window, read it before you use this file.

## When you ask a question in this file

- Ask with the question tool of the platform. Ask only one question in each tool call, because one answer can change the next answer.
- Give the default value as the first answer. Tell the Operator that the default value is the recommended answer.
- If the platform has no question tool, or the question tool gives an error, the Operator cannot give an answer. Then do the step of the section that is for no answer.

## When the Changelog policy is not there

Do these steps before the Create, Write, or Review job:

1. Find the answers for the new Changelog policy in the prompt. The prompt can tell you to "use the default changelog policy". The prompt can also give a value for each name in the table.
2. If the prompt gives one of these answers, go to step 6. Do not ask a question, because the prompt gives the answers.
3. Show the default Changelog policy to the Operator in a code block. Then the Operator can see the default values before the answer.
4. Ask the Operator one question with the answers `Use defaults` and `Choose each setting`. Give `Use defaults` as the first answer, and tell the Operator that it is the recommended answer.

   When the Operator cannot give an answer in steps 4 to 6, do not write a file, and do not do the job. The changelog does not change. Only the Operator selects the values of a new Changelog policy. In the report, give each name in the table that has no answer. Tell the Operator to give a value for each of these names, or to tell you to "use the default changelog policy". Then stop.
5. When the Operator answers `Choose each setting`, ask one question for each name in the table, in the sequence of the table. For `Release branches`, the Operator can also give a different value as text.
6. Make sure that each name in the table has a value from the Values column. The answer `Use defaults` and the words "use the default changelog policy" give the default values. If a name has no value, or its value is not in that column, ask the question of step 5 for that name. For example, `release/*, x y` is not a list of branch prefixes, so ask the `Release branches` question again.
7. If the folder `docs/agents/` is not there, make the folder.
8. Write the Changelog policy file. Write the title `# Changelog policy`, a blank line, and one Setting for each name in the sequence of the table. Use the values of step 6.
9. Do not stage or commit the Changelog policy. The Operator approves it in the Commit review, together with the change to the changelog. In the report, give the new file next to the changelog.
10. Do the job with the new Changelog policy.

## When a Setting is not in the Changelog policy

When the Changelog policy has no incorrect line and a name in the table has no Setting, do these steps:

1. For each name that has no Setting, ask the Operator one question.
2. If the Operator cannot give an answer, use the default value.
3. Add one Setting for each of these names to the Changelog policy, in the sequence of the table. Use the answer of the Operator or the default value. Do not change the other lines. Then the next job asks no question about these Settings.
4. Do not stage or commit the Changelog policy. In the report, give the change to the Changelog policy and each Setting that you added.
5. Do the job with the changed Changelog policy.
