# Review loop ledger: agent-instructions Skill, from develop 8c10724

Branch: bugfix/agent-instructions-review-findings
Setup: one reviewer per file and class; confirmers per class across files (2, plus a third for splits).
Standing rejects of script findings (same text each round): bold terms of "Terms in this skill" (1.8), example paths of other projects (pointer target does not exist), STE words MUST/WARNING named in capitals, the shared start text of each reference file (duplicate sentence).

## Round 1 (all sections of 8 files, 24 reviewers, 6 confirmers)

- Script findings: 60, all rejected (standing rejects).
- Blocking: 27 (STE 17, ISO 10, loading 0). Confirmed 16 (STE 14, ISO 2). Not confirmed 11.
- Advisory: see reports; put in warnings, not corrected.
- Fixed (sentence, rule):
  - SKILL.md step 8 "For a list file, start no loading reviewer in the self-check." (5.3)
  - SKILL.md step 9 "When the job changes only list files, do no reader test. Then go to step 11." (5.2)
  - agent-skills-spec.md "Select the Skills folder of the project first, ..." (1.11)
  - agent-skills-spec.md "Use the name of the folder of the Skill." (1.11)
  - plain-language-rules.md "Put a pointer to each pointer target directly in the file that has the pointer." (1.11)
  - plain-language-rules.md "... did not obey an instruction, do not remove that instruction ..." (1.11)
  - review.md out-of-scope task bullet: "the new or changed rules do not change it ... these rules" (1.11)
  - review.md "A reviewer reviews the glossary and `MEMORY.md` only when the job changed them" (GR-3/4)
  - review.md item 4 "Item 5 gives the findings that you do not correct. For each other finding, ..." (ISO sequence)
  - ste-rules.md "A multi-word noun with a glossary term ..." (1.11); same term in technical-terms.md "When a word is not in the base list or in the glossary"
  - ste-rules.md "In a list, the colon stops a sentence" (1.11)
  - ste-rules.md "A prompt ... is not text that the author cannot change ..." (GR-3/4)
  - technical-terms.md "Do not add a platform file path or a command to the base list. A file path and a command each count as 1 word." (1.11, two findings)
  - technical-terms.md skill row "A folder with a `SKILL.md` file. An agent loads the skill only when a task makes the skill necessary" (GR-3/4)
  - technical-terms.md new section "When you write the word rule"; pointer in ste-rules.md changed to it (ISO section condition)

## Round 2 (changed sections of 6 files, 3 reviewers, 6 confirmers)

- Script findings: 60, all rejected (standing rejects).
- Blocking: 2 (STE 1, ISO 1). Confirmed 0. Not confirmed 2 (votes 1 of 3 each).
- Advisory: 6, warnings.
- Fixed: none. Round passed.

## Round 3 (full round again, all 8 files, 24 reviewers)

- Script findings: 60, all rejected (standing rejects).
- Blocking: 21 (STE 12, ISO 9, loading 0). Confirmed 10 (STE 9, ISO 1). Not confirmed 11. Advisory 42, dropped 3.
- Recurring not confirmed: review.md "their file" (3rd time, 1 of 3 again); ste-rules.md "for it" pointer (2nd time).
- Fixed (sentence, rule):
  - agent-skills-spec.md "Some platforms and scripts read only the first line of a value." (1.11)
  - loading-rules.md "Write each extraction candidate in the Extraction candidates part" (1.11)
  - plain-language-rules.md "Put the pointer to each pointer target in the first file that the agent reads, for example the entry file or the `SKILL.md` file." (4.2)
  - review.md "Do these steps ..." for "After the last review round", plus 3 references "do the steps in" (1.11)
  - review.md "... with the rule of that finding." (GR-3/4)
  - review.md "An example of this type of finding is ..." (4.2)
  - technical-terms.md "The base list contains ...", "the base list does not permit", "in the base list" (1.11, 3 findings)
  - end-of-run-report.md tier item: "When you write this item, find the known cases in that table." (ISO pointer condition)

## Round 4 (changed sections of 6 files, 3 reviewers, 3 confirmers)

- Script findings: 60, all rejected (standing rejects).
- Blocking: 1 (ISO). Not confirmed (1 of 3). It also fell under the tie-break (new rule on a sentence changed in round 3).
- Advisory: 9, dropped 1. Fixed: none. Round passed.

## Round 5 (full round, all 8 files, 24 reviewers)

- Script findings: 60, all rejected (standing rejects).
- Blocking: 23 (STE 19, ISO 4). Confirmed 15 (STE 15, ISO 0). Not confirmed 8. Advisory 30, dropped 5.
- The 4 ISO findings all repeat earlier rejected findings (end-of-run "that table", ste-rules "for it" pointer, technical-terms colon pointer x2): 0 of 2 votes each.
- Fixed: end-of-run-report "extraction candidate" x2, "file-size limit", "base-list term" (+ template heading); loading-rules "In the old place of the moved section"; plain-language-rules "cases" x2, glossary meaning sentence; technical-terms heading/word->term, imperatives x3, 3 base-list definitions (pronoun).

## Round 6 (changed sections of 4 files, 3 reviewers)

- Script findings: 60, all rejected. Blocking: 1 (ISO, repeat "that table" pointer, 4th time). Confirmed 2 of 2 this time. Advisory 2.
- Fixed: end-of-run-report.md "When you write this item, find the known cases in the table in "When two sources do not agree" in `SKILL.md`." (ISO pointer path)

## Round 7 (changed section of end-of-run-report.md, 3 reviewers)

- Script findings: 60, rejected. Blocking: 1 (STE, pronoun "it" in old text of the same section). Confirmed 2 of 2. Advisory 1.
- Fixed: end-of-run-report.md "also when you found that file type during the edit job." (GR-3/4)

## Round 8 (changed section of end-of-run-report.md, 3 reviewers)

- Script findings: 60, rejected. Blocking: 2 (STE 1 repeat of round 1 "correction" wording, ISO 1 "that section"). Confirmed 0 (0 of 2 each). Advisory 1. Fixed: none. Round passed.

## Round 9 (full round, all 8 files, 24 reviewers)

- Script findings: 60, rejected. Blocking: 12 (STE 8, ISO 4). Confirmed 7 (STE 6, ISO 1). Not confirmed 5. Advisory 29, dropped 7.
- Fixed 6: SKILL.md "the files of Cursor" (1.11); agent-skills-spec "folder of the Skill" x2 (1.11), description sentence split (GR-3/4); review.md table headers "Rules" and "Item" (1.11); review.md item 12 "After reader-test round 1, correct ..." (ISO sequence).
- Rejected after confirmation 1: review.md "Instruction files:" label (1.11). Cause: tests/skills/writing/agent-instructions/process.ts:66 parses this label, and grade.test.ts:398 tests it. A rename needs a code change. Operator decision.

## Round 10 (changed sections of 3 files, 3 reviewers)

- Script findings: 60, rejected. Blocking: 3 (STE). Confirmed 2, not confirmed 1. Advisory 2.
- Fixed: agent-skills-spec "Put the known problem next to the step ..." (GR-3/4; repeat of round 5, now 2 of 3); review.md "do not change the out-of-scope task" (GR-3/4).
- No reviewer examined these 2 corrections (pause after round 10).

## Round 11 (changed sections of 2 files, 3 reviewers)

- Blocking: 0. Advisory 1. Round passed (first round with zero blocking findings).

## Round 12 (full round, all 8 files, 24 reviewers)

- Script findings: 60, rejected. Blocking: 8 (STE 3, ISO 5). Confirmed 4 (STE 2, ISO 2). Not confirmed 4. Advisory 25, dropped 5.
- Fixed: agent-skills-spec heading "When you select the Skills folder of the project" (+ its pointer and body sentence) (1.11); technical-terms heading "When a technical noun is not in the base list or in the glossary" (+ 2 pointers in ste-rules) (1.11); review.md "read the file in the Report requirements line" (ISO pointer path; 5th time, now confirmed); review.md reader-test steps 5 and 6 swapped: "Use the reader prompt below ... dry run" first (ISO sequence).

## Round 13 (changed sections of 4 files, 3 reviewers)

- Script findings: 60, rejected. Blocking: 2 (STE 1, ISO 1). Confirmed 1 (STE). ISO not confirmed (0 of 2; also under the tie-break). Advisory 11.
- Fixed: review.md reader prompt "Copy each quote from the instruction files word for word." (1.11)

## Round 14 (changed section of review.md, 3 reviewers)

- Script findings: 60, rejected. Blocking: 2 (STE). Confirmed 1, but rejected: review.md confirmer prompt label "Report:" (1.11). Cause: tests/skills/writing/agent-instructions/process.ts:68 parses this label (grade.test.ts:404). Operator decision, together with "Instruction files:". Other finding not confirmed (0 of 2, repeat of round 10). Advisory 5. Fixed: none. Round passed.

## Round 15 (full round, all 8 files, 24 reviewers)

- Script findings: 60, rejected. Blocking: 10 (STE 7, ISO 3). Confirmed 6 (STE 5, ISO 1). Not confirmed 4 (ISO pointer "for it" in ste-rules 6th time, ISO review.md step order, STE "its" cause, STE "a correction" 1 of 3). Advisory 40, dropped 7.
- Fixed: SKILL.md step 7 "in the folder of a Skill" (1.11); SKILL.md step 8 "the self-check that `references/review.md` gives" (ISO pointer path); plain-language-rules "The rules are not applicable" (GR-3/4; allow-list text updated x2) and glossary-meaning sentence (GR-1); review.md item 4 "For example, a rule can permit quoted text." (4.2); review.md limit section "a session where you are a subagent, and an output test" (4.2).
- After the fixes, the check script gives 59 findings: the duplicate-sentence finding of plain-language-rules.md line 3 went away.

## Round 16 (changed sections of 3 files, 3 reviewers)

- Script findings: 59, rejected (standing rejects). Blocking: 0. Advisory 1 (review.md:161 tie-break sentence). Fixed: none. Round passed.
- Repository check after round 15 fixes: docker `bun run check` exit 0, 757 tests.

## Round 17 (full round, all 8 files, 24 reviewers)

- Script findings: 59, rejected. Blocking: 8 (STE 6, ISO 2). Confirmed 3 (STE 2, ISO 1). Not confirmed 5. Advisory 47, dropped 2.
- Fixed: agent-skills-spec "The tier 1 rules are loading rules of Codex." (1.11); review.md reviewer prompt "each quote ... a different quote" (1.11; gen.sh synced); end-of-run-report "as "When you recommend text to move" in `references/loading-rules.md` tells you" (ISO pointer path).

## Round 18 (changed sections of 3 files, 3 reviewers)

- Script findings: 59, rejected. Blocking: 2 (STE 1, ISO 1), both on old text of the changed review.md section. Confirmed 1 (STE). ISO not confirmed (1 of 3). Advisory 3.
- Fixed: review.md "Remove the text in angle brackets at the start of these lines." (1.11: "label" is a base-list term for issues)

## Round 19 (changed section of review.md, 3 reviewers)

- Script findings: 59, rejected. Blocking: 2 (STE 1, ISO 1). Confirmed 1 (STE). ISO not confirmed (0 of 2; repeat of round 18). Advisory 3.
- Fixed: review.md reviewer prompt: statement "The ISO 24495-1 reviewer examines the conditions ..." replaced with 2 reviewer-only imperative lines (GR imperative); gen.sh synced.

## Round 20 (changed section of review.md, 3 reviewers)

- Script findings: 59, rejected. Blocking: 1 (STE). Confirmed 1 (2 of 2). Advisory 4.
- Fixed: review.md reviewer prompt "examine only the sections under review of the file of that report." (GR-3/4; gen.sh synced)

## Round 21 (changed section of review.md, 3 reviewers)

- Script findings: 59, rejected. Blocking: 4 (STE 2, ISO 2), all on old text of the changed section. Confirmed 1: ISO list-file step order (2 of 2; same finding got 1 of 3 in round 18 and 0 of 2 in round 19). Not confirmed 3 (0 of 2 each). Advisory 4.
- Fixed: review.md list-file paragraph moved to the start of "When you start the reviewers", now "Before you start the reviewers, find the list files ..." (ISO sequence).
- Not reviewed by a changed-section round: round 22 (2 full sets) covers it.

## Round 22 (measurement: 2 independent full sets A and B, 24 reviewers each, same text, no fixes)

- Script findings: 59 each. Blocking raised: A 14 (STE 12, ISO 2), B 11 (STE 10, ISO 1). Raised in both: 4 (SKILL.md "Skill folder", SKILL.md "put it", end-of-run-report "a correction", technical-terms "a bold label").
- Confirmed: A 6, B 7, both 1 ("Skill folder"). Union 12. Of the 4 raised in both, the votes agreed only on 1; the other 3 were confirmed in B and rejected in A.
- Estimate (Lincoln-Petersen): raw 14*11/4 ~ 38 blocking-grade findings in the text; confirmed 6*7/1 ~ 42 (very rough, overlap 1). One full set finds ~1/3 of the raw findings.
- Advisory: A 47, B 37. No fixes made (measurement round). Votes in votes-22.txt.
- After round 22 (Operator: "fix the findings, and run reviewers only for changed stuff"): fixed the 12 confirmed findings of A and B: SKILL.md "Prompt text in product code.", "In the folder of a Skill", "put the known problem where", "a quote that is not in the files"; review.md "reviewer report" x2, "In each finding, give one rule ..." (prompt; gen.sh synced), "the sections in the `Changes:` line"; ste-rules "a step that opens a pull request and a step that pushes a tag"; end-of-run-report "the text that a correction after review round 2 changed. When you did 2 review rounds, also give ..."; loading-rules "the entry-file layout"; technical-terms title row "bold text at the start of a list item".

## Round 23 (changed sections of 6 files, 3 reviewers)

- Script findings: 59, rejected. Blocking: 1 (STE). Confirmed (2 of 2). Advisory 9, dropped 2.
- Fixed: SKILL.md "quoted text that is not in the files" (1.11; base-list term; round-22 fix had "a quote").

## Round 24 (changed section of SKILL.md, 3 reviewers)

- Script findings: 59, rejected. Blocking: 1 (STE 4.2, SKILL.md:147 "A reader report without its 3 parts also gives exit code 2."). Not confirmed (1 of 3). Advisory 4. Fixed: none. Round passed.
- Side note from confirmer C (verified): check.ts readerQuotes gives exit code 2 only when part 2 or part 3 is missing, not part 1. The sentence is not accurate. Operator decision; not a rule finding.
