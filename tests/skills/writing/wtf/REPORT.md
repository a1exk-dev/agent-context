# Eval report: wtf Skill

This report gives the results of [Run the full eval matrix and the reviewers on the complete wtf Skill](https://github.com/a1exk-dev/agent-context/issues/239). The test plan is in the section "Testing Decisions" of [Spec: wtf Skill](https://github.com/a1exk-dev/agent-context/issues/234). The runs occurred on 2026-11-18 with Claude Code 2.1.327, OpenCode 2.3.0, and the model `claude-opus-5-5`.

## Result

- The self-check of the agent-instructions Skill ran 3 review rounds and 2 reader-test rounds. The build corrected each confirmed blocking finding in a changed section.
- The output tests stopped after 5 rounds, as the stop rule tells. In round 5, 3 statements are still false. The section "Statements that are still false" gives them.
- The load test is correct on Claude Code: 11 of 11 requests. On OpenCode 2, 10 of 11 requests are correct. The plain request "wtf does that mean?" loaded `wtf`. On Codex, the load test did not run, because Codex has no login.
- With the Skill, a rewrite has 1.31 times the words of the original. The baseline rewrite has 1.73 times the words. The baseline lost facts in 5 of 8 tests. The Skill lost 1 fact in 1 test.

## Self-check of the agent-instructions Skill

The 4 Review targets are the `wtf` Skill, the agent-instructions Skill, `MEMORY.md`, and `GLOSSARY.md`. Round 1 examined all 11 Markdown files. Rounds 2 and 3 examined only the changed sections.

| Round | Files | Confirmed blocking findings in changed sections | Corrected in |
|---|---|---|---|
| 1 | 11 | 9 in `wtf/SKILL.md`, 2 in `MEMORY.md`, 2 in `agent-skills-spec.md` | `24deb69` |
| 2 | 3 | 5 in `wtf/SKILL.md`, 2 in `MEMORY.md` | `24deb69` |
| 3 | 2 | 2 in `wtf/SKILL.md` | `24deb69` |

The description of `wtf` agrees with the Tier 1 Blocking rule "When ..., use this skill.". The loading reviewer gave "none" for this rule in round 1 and in round 2. The description starts with "When the Operator calls this Skill by name ..., use this Skill.".

The main corrections:

- `wtf/SKILL.md`: step 1 no longer sends an agent without the human-communication Skill past steps 2 and 3. Step 3 gives the paths of the glossary. "skill" is now "Skill", as `GLOSSARY.md` writes it.
- `MEMORY.md`: the exception for a Manual-only Skill is an instruction, and the entry names OpenCode 2 as the target version.
- `agent-skills-spec.md`: the cause of `agents/openai.yaml` is now "Codex does not read `disable-model-invocation` in the frontmatter".

These findings did not cause a change:

- 31 confirmed blocking findings are in sections that the build did not change, for example the MEMORY.md entry "ASD-STE100 content stays outside the repo". The edit job does not change these sections.
- The check script reports "rules" in `wtf/SKILL.md` as a breach of rule 6.2. Rule 6.2 permits "rule" in lowercase with its base-list meaning. The check script does not have this exception. A later rewrite removed the word.
- The check script reports "user" in the new sentence of `agent-skills-spec.md`. The agent-instructions Skill defines "user" in its own terms and uses it in each file.
- The build rejected the advisory finding to add a user phrase to the description. A Manual-only Skill must not load on a phrase.
- `docs/research/agent-platforms.md` tells that OpenCode does not read `disable-model-invocation`. `MEMORY.md` and the spec tell that OpenCode 2 reads it. The OpenCode 2 load test agrees with `MEMORY.md`: OpenCode 2 attached `wtf` for no plain request.

### Reader test

The reader test examined `wtf/SKILL.md`, `MEMORY.md`, and `agent-skills-spec.md`.

- Round 1 found 2 problems in `wtf/SKILL.md`. For `/wtf Q2`, the reader rewrote all 3 questions. For a request to make `README.md` shorter, the reader used `wtf`. The correction tells the agent to rewrite only the named part, and to use `wtf` only for a message.
- Round 2 showed the correct steps for the 2 typical tasks and the out-of-scope task. The script still reported 2 types of problems: the readers used the new, more exact sentences in place of the tested quotes, and the out-of-scope reader used the new exclusion sentences. These problems do not show a wrong step.
- No reviewer and no reader examined the corrections after reader round 2 and after the output-test rounds. The output tests examine these corrections.

## Output tests

Each test ran in a 2-turn `claude -p` session. The runner installed only `wtf`. Each run got a fresh grader, and each "no" got 2 Confirmers.

| Round | Tests | Skill version | Tests with each statement true |
|---|---|---|---|
| 1 | 8 run, 2 graded | before the reader test | 1 of 2 |
| 2 | 1 to 8 | `24deb69` | 6 of 8 |
| 3 | 7, 8 | round 2 + 3 rules | 2 of 2 |
| 4 | 1 to 8 | same as round 3 | 5 of 8 |
| 5 | 1 to 8 | `2cc5c5f` | 5 of 8 |

Round 1 graded only tests 1 and 2, because the reader test changed the Skill before the other graders started.

The script check for a change note failed round 2 of test 8 in error. The rewrite kept the label "**Changes:**" over the file changes of the original message. Commit `f822bf6` corrects the check.

### Statements in round 5

W1 to W3 are the script statements: no change note, no check question, and no changed file. W4 to W9 are the `llm` statements: the context line, the facts, the required parts, the question at the end, the length, and the clarity.

| Test | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | Own statements |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 Review status | true | true | true | false | true | true | true | true | true | - |
| 2 Glossary rename | true | true | true | true | false | true | true | true | true | - |
| 3 Identity key | true | true | true | true | true | true | true | true | true | - |
| 4 Outbound retention | true | true | true | true | true | true | true | true | true | - |
| 5 Grilling round, Q2 | true | true | true | true | true | true | true | true | true | 5.1 true |
| 6 Diff and command | true | true | true | true | true | true | true | true | true | 6.1 true |
| 7 Earlier message | true | true | true | true | true | true | true | true | true | 7.1 true |
| 8 Only shorter | true | true | true | true | true | true | true | true | false | 8.1 true, 8.2 true |

### Statements that are still false

After 5 rounds, these 3 statements are false. Each statement was true in one or more earlier rounds.

- Test 1, W4: the context line gives the task and the progress ("It is at group 7 of 14 files"), but not the decision that unchanged lines go to warnings. W4 was true in rounds 2 and 4.
- Test 2, W5: the rewrite drops the recommendation "Yes, I'd rename it" and says "The decision is whether to rename your glossary file". W5 was true in rounds 2 and 4.
- Test 8, W9: the heading "**Rename touches:**" drops "(tracked files that mention `CONTEXT.md`)". W9 was true in round 3.

Each of these failures occurred in 1 of the last 3 runs of its test. The rounds show the variance of single runs more than a gap in the Skill text.

## Baseline compared with the Skill

The baseline ran each test once without the Skill. Its last turn was "I don't understand your last message. Write it again more clearly." The baseline column gives the grader verdict, with no Confirmers. The Skill column gives round 5.

| Test | Words of the original | Words of the baseline | Words with the Skill | Facts kept, baseline | Facts kept, Skill |
|---|---|---|---|---|---|
| 1 | 110 | 262 | 137 | 12 of 12 | 12 of 12 |
| 2 | 258 | 301 | 278 | 5 of 14 | 13 of 14 |
| 3 | 151 | 310 | 243 | 9 of 9 | 9 of 9 |
| 4 | 172 | 259 | 250 | 10 of 10 | 10 of 10 |
| 5 | 107 (Q2 only) | 356 | 190 | 6 of 8 | 8 of 8 |
| 6 | 132 | 280 | 210 | 4 of 7 | 7 of 7 |
| 7 | 69 | 140 | 120 | 0 of 6 | 6 of 6 |
| 8 | 258 | 270 | 222 | 8 of 8 | 8 of 8 |
| Total | 1,257 | 2,178 | 1,650 | 54 of 74 | 73 of 74 |

- Length: the baseline rewrite is 1.73 times the original. The rewrite with the Skill is 1.31 times the original. The baseline was 2 or more times longer in 4 tests, and the Skill in no test.
- Facts: the baseline kept 73 % of the facts, and the Skill kept 99 %.
- In tests 2, 5, 6, and 7, the baseline agent told the Operator that it only copied the message, or it corrected a fact. In test 7 it did not rewrite the message. The Skill runs did not do this.
- In test 6 of the baseline, the first copy turn refused to copy the message, because the sample project has no test file. The second run copied the message.

## Load tests

Each request ran 3 times in a fresh, empty project, with one turn.

| Platform | Correct requests | Result |
|---|---|---|
| Claude Code | 11 of 11 | No plain request loaded `wtf`. `/wtf` loaded `wtf` in 3 of 3 runs. |
| OpenCode 2 | 10 of 11 | `@wtf` loaded `wtf` in 3 of 3 runs. "wtf does that mean?" loaded `wtf` in 2 of 3 runs, and in 3 of 3 runs of a second test. The 9 other plain requests did not load `wtf`. |
| Codex | not run | `codex login status` gives "Not logged in". |

On OpenCode 2, the wrong loads are not loads by the platform. OpenCode did not attach `wtf`, and the agent did not call the skill tool. The empty project has only `.opencode/skills/wtf/`, and the request names "wtf". The agent looked at the project, and it read `.opencode/skills/wtf/SKILL.md` as a file. `load-decision.ts` counts each read of `SKILL.md` as a load. The spec does not give this rule. The `wtf` Skill text cannot stop this read.

## Defaults of this run

The Operator did not answer these points before the run. The run used these defaults:

- Codex had no login. The Codex load test did not run.
- The output tests install only `wtf`, not `human-communication`.
- The example "2 times the length" for "not near" in `grader.md` stays. No reviewer examined `grader.md`, and the graders used the example as a limit.
- The OpenCode runner uses the model `anthropic/claude-opus-5-5`.
- Each load-test run is one turn in a fresh project.

## Manual checklist for the Operator

Do these 2 checks, and read each rewrite.

1. Codex: run `codex login`. In a project that has `wtf` in `.agents/skills/wtf/`, ask a question that gives a long answer. Then send `$wtf`. Make sure that the rewrite starts with a context line of 1 or 2 sentences, keeps each fact, and adds no note about the changes.
2. OpenCode 2: in a project that has `wtf` in `.opencode/skills/wtf/`, ask a question that gives a grilling round with 2 or more questions. Then type `@wtf`, select `wtf` in the autocomplete, and add `Q2`. Make sure that the rewrite covers only Q2 and ends with the Q2 question.

After `codex login`, also run the Codex load test:

```sh
bun tests/skills/writing/wtf/run-load-test.ts --platform codex --out /tmp/wtf-load/codex.json
```

## Open points

- Decide if a read of `SKILL.md` while the agent looks at an empty project counts as a wrong load on OpenCode 2. Else, give the load-test project other files, so that the Skill folder is not the only content.
- The check script of the agent-instructions Skill does not have the exception of rule 6.2 for "rule" in lowercase.
- `docs/research/agent-platforms.md` tells that OpenCode does not read `disable-model-invocation`. Correct it for OpenCode 2, or record why it stays.

## Round after the code review

The code review of the branch found rules in `wtf/SKILL.md` that the spec does not ask for. Commit `fb7f3ac` removes them:

- The word-for-word list of what the rewrite keeps: facts as the message gives them, the time of each action, and the words of a shorter label. The spec rule "facts and required parts win" covers these items.
- "Use this Skill only for a message of yours", "put the recommended answer before the question", and "Add no new part other than the context line".

`SKILL.md` keeps "Add no note about the changes", "Ask no question about whether the rewrite is clear", and "Ask no question that the message did not ask". These sentences repeat the spec decisions "no change note", "no check question", and "ends with the original question only when the message asked one".

Statement 8.2 is gone, because the spec asks only for the single-method statement in test 8. W8 in `grader.md` no longer gives "2 times the words" as an example, because the spec sets no length band. The default "The example '2 times the length' ... stays" in "Defaults of this run" is therefore no longer true.

### Review of the final SKILL.md

The 3 reviewers of the agent-instructions Skill examined only `wtf/SKILL.md`, after the removals.

| Round | Sections | Confirmed blocking findings | Result |
|---|---|---|---|
| 1 | All | 1 of 2 | `fb7f3ac` corrects the finding. |
| 2 | "When you write the rewrite" | 0 | The round passes. |
| 3 | "When you write the rewrite" and "When you give the rewrite", after `1d53081` | 0 | The round passes. |

- The confirmed finding: "An agent without this Skill often writes a rewrite that is about 3 times longer than the message." The baseline of this report is 1.73 times the original. The sentence now says "much longer".
- The Confirmers rejected the finding about "the part" in step 4 of `SKILL.md`. Steps 2 and 4 use "part of the message" for the same item.
- The author rejected 2 advisory findings. The section "When you write the rewrite" stays in `SKILL.md`, because each run uses it and the file has 4,535 bytes. The description gets no user phrase, because a Manual-only Skill must not load on a phrase.
- In round 3, the author rejected 3 advisory findings, because the Operator permitted no other rule change.
- No reader test examined the changes.

### Output tests, round 1

One round ran the 8 tests with the Skill, with no baseline. Each run got a fresh grader, and each "no" got 2 Confirmers. In test 6, the copy turn refused 2 times to copy the message, because the sample project has no test file. The third run counts.

| Test | Words of the original | Words with the Skill | Confirmed false statements |
|---|---|---|---|
| 1 Review status | 110 | 155 | none |
| 2 Glossary rename | 258 | 314 | none |
| 3 Identity key | 151 | 270 | W8 |
| 4 Outbound retention | 172 | 223 | W5 |
| 5 Grilling round, Q2 | 107 (Q2 only) | 209 | W8, W9, 5.1 |
| 6 Diff and command | 132 | 174 | none |
| 7 Earlier message | 69 | 142 | W7, W8 |
| 8 Only shorter | 258 | 236 | none |
| Total | 1,257 | 1,723 | 7 in 4 tests |

- 4 of 8 tests have each statement true. Round 5 had 5 of 8. The false statements of round 5 (test 1 W4, test 2 W5, test 8 W9) are now true.
- The rewrite has 1.37 times the words of the original. Round 5 had 1.31 times.
- Test 4, W5: the rewrite drops the recommendation "Yes" and asks a neutral question. The removed rule "put the recommended answer before the question" covered this case.
- Test 7, W7: the rewrite ends with "Do you approve this order?", but the message asked no question. The removed rule "Add no new part other than the context line" named a new question as an example.
- W8 failed in tests 3, 5, and 7, at 1.8 to 2.1 times the original. Without the example in `grader.md`, the graders judged these lengths as "much longer".
- Test 5, 5.1: the context line repeats the Q1 decision. Test 5, W9: the rewrite does not tell that "invalidate-on-write" is the first choice.

The round shows a regression in 3 tests. The removed rules prevented 2 of the failures.

### Output tests, round 2

The Operator decided on 2026-11-18 to restore the 2 rules in a short form. Commit `1d53081` adds these sentences to `SKILL.md`:

- "When the message gives a recommended answer, keep the recommended answer."
- "Ask no new question that the message did not ask, for example "Do you approve?"."

Round 2 ran the 8 tests with the Skill in the same way as round 1. In test 6, the copy turn refused 1 time. The second run counts.

| Test | Words of the original | Words with the Skill | Confirmed false statements |
|---|---|---|---|
| 1 Review status | 110 | 157 | W4 |
| 2 Glossary rename | 258 | 311 | none |
| 3 Identity key | 151 | 235 | none |
| 4 Outbound retention | 172 | 277 | none |
| 5 Grilling round, Q2 | 107 (Q2 only) | 208 | W8, W9 |
| 6 Diff and command | 132 | 245 | W5, W8, W9 |
| 7 Earlier message | 69 | 117 | none |
| 8 Only shorter | 258 | 220 | none |
| Total | 1,257 | 1,770 | 6 in 3 tests |

- 5 of 8 tests have each statement true, the same number as in round 5.
- The restored rules worked in this run. Test 4 keeps the recommendation, and test 7 adds no question.
- The rewrite has 1.41 times the words of the original.
- Test 1, W4: the context line gives the task and the progress, but not the decision that the findings in unchanged lines go to warnings. W4 also failed in round 5.
- Test 5, W8 and W9: the rewrite has 1.9 times the words of Q2. It calls the first choice "Delete" but asks "Do you agree with invalidate-on-write?". Its context line says "Q1 picked Redis", but Q1 only recommends Redis. The Confirmers rejected 5.1.
- Test 6, W5, W8, and W9: the rewrite starts with "One correction first: ... I did not run the test 200 times". It corrects a fact of the message, and it drops the race of the mock server. The sample project has no test file, so the agent did not trust the message.

Test 6 is the only test where the agent corrects the message. The sample project of test 6 does not have the files that the message names. The same project makes the copy turn of test 6 refuse the message in some runs.

The round data is in `wtf-evals-review/` in the scratchpad of the session: `iteration-1/` and `iteration-2/` for the runs, and `review-rounds/` for the reviews.

## Round after the writing instructions for the case without human-communication

Commit `19aacf5` adds 5 writing instructions to step 1 of `SKILL.md`. An agent obeys them when its list of Skills does not have the human-communication Skill. The instructions are our own words for a part of ASD-STE100 and ISO 24495-1: result first, 25 words maximum, active voice, one term for each item, and no "should", "may", "might", or "would".

### Review of SKILL.md

The 3 reviewers of the agent-instructions Skill examined `wtf/SKILL.md` in 2 rounds.

| Round | Sections | Confirmed blocking findings | Result |
|---|---|---|---|
| 1 | All | 1 of 2 | Item 1 of "When you give the rewrite" now says "give only the task in the context line". |
| 2 | Item 1 of "When you give the rewrite" | 1 of 1 | The sentence before it is now also in the imperative: "In the context line, give the task and the decision of the message." |

No reviewer examined the round 2 correction. Statement W4 of the output tests examines the context line.

### Output tests

One round ran the 8 tests with the Skill, as in round 2 of "Round after the code review". The runner installs only `wtf`, so each run used the new writing instructions. In test 3, the first copy turn changed its message. The second run counts.

| Test | Words of the original | Words, round 2 | Words, this round | Confirmed false, round 2 | Confirmed false, this round |
|---|---|---|---|---|---|
| 1 Review status | 110 | 157 | 158 | W4 | none |
| 2 Glossary rename | 258 | 311 | 323 | none | none |
| 3 Identity key | 151 | 235 | 232 | none | none |
| 4 Outbound retention | 172 | 277 | 262 | none | none |
| 5 Grilling round, Q2 | 107 (Q2 only) | 208 | 178 | W8, W9 | 5.1 |
| 6 Diff and command | 132 | 245 | 201 | W5, W8, W9 | W5, W9 |
| 7 Earlier message | 69 | 117 | 141 | none | W8 |
| 8 Only shorter | 258 | 220 | 211 | none | none |
| Total | 1,257 | 1,770 | 1,706 | 6 in 3 tests | 5 in 3 tests |

- 5 of 8 tests have each statement true, the same number as in round 2.
- The rewrite has 1.36 times the words of the original. Round 2 had 1.41 times.
- Outside code, the rewrites of round 2 had 8 instances of "should", "may", "might", "would", or "could". This round has 2. Each of the 2 is in "Should I go ahead with that branch?", the question of the message. No rewrite in the 2 rounds has a sentence of more than 25 words.
- Test 1, W4: the context line is now true.
- Test 5, 5.1: the context line repeats the Q1 decision: "Q1 put the cache in Redis, so all 3 replicas share one cache." The example of the context line in `SKILL.md` also names the result of Q1.
- Test 6, W5 and W9: the rewrite again starts with "Correction first: ... I did not loop the test 200 times", and it drops the race of the mock server. The sample project has no test file.
- Test 7, W8: the rewrite has 141 words for a message of 69 words. It adds explanations of terms, for example "the version label on a commit".
