# Research: methods that reduce false positives of LLM reviewers

<!-- cspell:ignore Bugbot Greptile uReview Atlassian ModernBERT Frömmgen Kharatyan CriticGPT McAleese FSBS Dhuliawala Manakul SelfCheckGPT Kamoi Verga PoLL ProcessBench Husain Reflexion Madaan Ragas LLM4FPM IRIS CodeQL Haiku Qwen Mistral Llama TPR TNR dedup -->

Question (issue #249, map #246): What do published practices for LLM reviewers and LLM judges say about false positives? Which methods reduce them? For each method: the evidence, the effect size, the cost, and the source.

A false positive is a finding for a problem that the text does not have. A nitpick is a finding that is true but not worth a change. Most industry sources count the two together as "noise".

Use: the self-check of the agent-instructions Skill (`skills/writing/agent-instructions/references/review.md`). In each review round, 3 reviewers examine the Review target. For each reviewer with findings for a Blocking rule, 2 Confirmers answer "yes" or "no" for each finding. A finding counts when 1 or more of the 2 Confirmers answer "yes". In practice, the rounds did not converge (map #246, "Why this map exists").

Related research in this folder: `repeatable-llm-verdicts.md` (issue #123) covers the same verdict for the same input across reruns. This file covers wrong findings. This file does not repeat the sources of that file, except where a number answers this question.

Sources, read on 2026-11-19:

- Industry tools with data:
  - Anthropic: [Code Review for Claude Code](https://claude.com/blog/code-review) (blog, 2026-03-09) and [its docs](https://code.claude.com/docs/en/code-review). The `code-review` plugin, [`plugins/code-review/commands/code-review.md`](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-review/commands/code-review.md) in `anthropics/claude-plugins-official`. [`anthropics/claude-code-security-review`](https://github.com/anthropics/claude-code-security-review) (`findings_filter.py`, `prompts.py`).
  - Cursor: [Building a better Bugbot](https://cursor.com/blog/building-bugbot) (2026-01-15).
  - Greptile: [How to make LLMs shut up](https://greptile.com/blog/make-llms-shut-up) (2024-12-18).
  - Google Research: [Resolving code review comments with ML](https://research.google/blog/resolving-code-review-comments-with-ml/) (2023-05-23).
  - Uber: [uReview](https://www.uber.com/blog/ureview/) (2025-08-12).
  - Atlassian: [ML classifier for comment quality](https://www.atlassian.com/blog/atlassian-engineering/ml-classifier-improving-quality) (2025-08-25).
- Vendor guidance: Anthropic [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) and [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). OpenAI [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) and [Graders](https://developers.openai.com/api/docs/guides/graders). Inspect AI [Multiple scorers](https://inspect.aisi.org.uk/multiple-scorers.html). Ragas [`_aspect_critic.py`](https://github.com/explodinggradients/ragas/blob/main/src/ragas/metrics/_aspect_critic.py).
- Practitioner write-up with data: Hamel Husain, [Creating a LLM-as-a-Judge That Drives Business Results](https://hamel.dev/blog/posts/llm-judge/).
- Papers (arXiv):
  - McAleese et al., "LLM Critics Help Catch LLM Bugs" (CriticGPT), [2407.00215](https://arxiv.org/abs/2407.00215).
  - Dhuliawala et al., "Chain-of-Verification Reduces Hallucination", [2309.11495](https://arxiv.org/abs/2309.11495).
  - Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet", [2310.01798](https://arxiv.org/abs/2310.01798).
  - Kamoi et al., "When Can LLMs Actually Correct Their Own Mistakes?", [2406.01297](https://arxiv.org/abs/2406.01297).
  - Verga et al., "Replacing Judges with Juries" (PoLL), [2404.18796](https://arxiv.org/abs/2404.18796).
  - Jung et al., "Trust or Escalate", [2407.18370](https://arxiv.org/abs/2407.18370).
  - Zheng C. et al., "ProcessBench", [2412.06559](https://arxiv.org/abs/2412.06559).
  - Madaan et al., "Self-Refine", [2303.17651](https://arxiv.org/abs/2303.17651).
  - Shinn et al., "Reflexion", [2303.11366](https://arxiv.org/abs/2303.11366).
  - Chen et al., "LLM4FPM", [2411.03079](https://arxiv.org/abs/2411.03079).

## Main result

No source measures false positives for rule-based review of instruction text. The evidence comes from code review, from LLM judges, and from critics of math and code. In these sources, 5 methods have data:

1. A separate verification pass for each finding, with "not certain" counted as "no". Anthropic, Cursor, and the CoVe paper use it.
2. A narrow, fixed scope of what to report, with an explicit list of what not to report. Pre-existing problems and nitpicks are on that list in each tool.
3. Agreement of independent passes before a finding counts (k of n). Cursor used a majority of 8 passes. No source keeps a finding when only 1 pass of 2 reports it.
4. A threshold that the team calibrates against human labels or developer feedback. A severity score that the LLM gives itself, with no calibration, failed in the one test that a source reports (Greptile).
5. A fixed stop rule, and a gate that depends on external evidence. Self-correction rounds with only LLM feedback change correct answers into wrong answers about as often as the reverse (Huang et al.).

The current Confirmer rule of `review.md` is the opposite of method 1 and method 3. A finding counts when 1 of 2 Confirmers says "yes". So the vote keeps more findings than one Confirmer alone keeps.

## How common false positives are

| Source | Measurement | Value |
| - | - | - |
| Greptile, before its filter | Share of comments of its reviewer | "~19% were good, 2% were flat-out incorrect, and 79% were nits" |
| CriticGPT, Figure 7 (values read from a bar chart) | Critiques with a nitpick or a hallucinated bug, human-detected bugs | Human ~28 %, Human+CriticGPT ~46 %, CriticGPT ~62 %, ChatGPT ~72 % |
| ProcessBench, Table 5 | Accuracy on correct math solutions (1 minus this value is the false-positive rate) | GPT-4o 91.2 % (GSM8K), 76.6 % (MATH). Llama-3-8B-Instruct 7.8 % (GSM8K) |
| Huang et al., §3.1 | Prompt "Review the answer carefully and report any serious problems you find" on answers | Correct-to-incorrect changes up to 39.8 % (GPT-3.5, CommonSenseQA) |

The CriticGPT authors write: "Although our method reduces the rate of nitpicks and hallucinated bugs, their absolute rate is still quite high" (§5). So a reviewer that must find problems reports problems in correct text. A strong model reports fewer, but not zero.

## Summary of the methods

| # | Method | Evidence and effect size | Cost | Main sources |
| - | - | - | - | - |
| 1 | Verify each finding in a separate pass, and drop each finding that the verifier does not confirm | Anthropic Code Review: "less than 1% of findings are marked incorrect". CoVe: hallucinated answers 2.95 → 0.68, correct answers 0.59 → 0.38 | One more call for each finding. Code Review costs "$15–25" for each review | Anthropic blog and plugin, Cursor, CoVe |
| 2 | Narrow scope and a fixed list of what not to report | Greptile: 79 % of comments were nits before its filter. No source isolates the list as a variable | Prompt text only | Anthropic plugin, security-review action, Greptile |
| 3 | k of n agreement of independent passes | Cursor: resolution rate 52 % → over 70 % (with other changes). PoLL: κ 0.763 against 0.627 for one GPT-4 judge | n times the calls | Cursor, PoLL, Inspect AI, Ragas |
| 4 | A threshold, calibrated against labels or feedback | Google: target precision 50 %, 52 % of comments addressed. Greptile: LLM severity scores "nearly random". Trust or Escalate: 55.7 % coverage with a 90 % agreement guarantee | Labelled examples. Lower recall | Google, Greptile, Uber, Atlassian, Trust or Escalate, Husain |
| 5 | Fixed stop rule and external evidence for the gate | Huang: GPT-4 GSM8K 95.5 → 91.5 → 89.0 over 2 self-correction rounds. Self-Refine: gains fall per round | Fewer rounds. A real run costs one session | Huang, Kamoi, Self-Refine, Anthropic, CriticGPT |

## 1. A separate verification pass for each finding

Tools:

- Anthropic Code Review runs 4 stages: find, verify, rank, and post. "The agents look for bugs in parallel, verify bugs to filter out false positives, and rank bugs by severity." Result: "less than 1% of findings are marked incorrect". PRs with fewer than 50 changed lines get findings in 31 % of cases, with 0.5 issues on average. Cost: "generally average $15–25" and about 20 minutes ([blog](https://claude.com/blog/code-review)).
- The Anthropic `code-review` plugin runs 4 parallel reviewers. Then one validation subagent checks each issue. The command tells the agent to "Filter out any issues that were not validated in step 5". The prompt also says: "If you are not certain an issue is real, do not flag it. False positives erode trust and waste reviewer time." On 2025-12-06, commit `9babb8dbbf` replaced a confidence score (method 4) with this validation step.
- Cursor Bugbot had "a separate validator model" that checked for false positives, after the vote of method 3 ([post](https://cursor.com/blog/building-bugbot)).

Papers:

- Chain-of-Verification (CoVe) checks claims with separate questions. In the factored variant, the verifier does not see the draft. Table 1, Llama 65B, Wikidata list questions: precision 0.17 → 0.36 (two-step). Hallucinated answers 2.95 → 0.68. Correct answers also fell, 0.59 → 0.38. So the verifier removes some true items. CoVe checks the model's own text, not the findings of a critic. It applies here by analogy.
- Verga et al. found that a GPT-4 judge "is over-reasoning and injecting too much background knowledge into determining the correctness of an answer" (§4.3). A "don't overthink" instruction raised GPT-4 κ on NQ from 0.627 to 0.725 (Table 3).

Cost: one verifier call for each finding, or for each group of findings. The verifier drops some true findings, as CoVe shows.

Direction of the default: each source above drops a finding when the verifier does not confirm it. The plugin also says "do not flag" when the agent is "not certain". LLM4FPM, a filter for static-analysis warnings, counts an "unknown" verdict as a false positive and drops the warning. It removed "over 85% false positives" on 8 real projects.

## 2. Narrow scope and a fixed list of what not to report

- Anthropic Code Review looks for correctness only by default, not style or test coverage ([docs](https://code.claude.com/docs/en/code-review)).
- The `code-review` plugin lists what is not a finding: pre-existing issues, code that appears buggy but is correct, pedantic nitpicks, issues that a linter catches, and general quality concerns that `CLAUDE.md` does not require.
- `claude-code-security-review` drops whole categories with regular expressions in `HardExclusionRules` (`findings_filter.py`), for example DoS and rate-limiting findings. Its prompt says: "Better to miss some theoretical issues than flood the report with false positives." The repository gives no numbers.
- Greptile measured 79 % nits before its filter. It tried changes to the prompt and few-shot examples first. Few-shot examples made the results worse.
- Anthropic recommends one isolated judge for each dimension ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), "Step 5"). `repeatable-llm-verdicts.md`, section 2, gives the CheckEval and Rating Roulette data: vague criteria give less stable verdicts.

Effect size: no source isolates the exclusion list. The tools combine it with methods 1, 3, and 4.

Cost: prompt text. A team must keep the list current.

No source gives a tie-break for 2 rules that ask for opposite corrections of one sentence. The nearest practice is a narrow scope: each tool reports only one class of problem by default.

## 3. Agreement of independent passes (k of n)

- Cursor Bugbot at launch ran 8 parallel passes, each with the diff in a different order. A majority vote dropped bugs that only one pass found. "When several passes independently flagged the same issue, we treated it as a stronger signal that the bug was real." Over 40 experiments, the resolution rate rose "from 52% to over 70%". This number includes other changes, so it does not isolate the vote. Later, Cursor moved to an agentic design.
- PoLL: a panel of 3 smaller models (Command R, Claude 3 Haiku, GPT-3.5) with a max vote. Cohen's κ against humans on NQ / TQA / HPQA: 0.763 / 0.906 / 0.867. One GPT-4 judge: 0.627 / 0.841 / 0.830 (Table 1). The panel is "seven to eight times less expensive" (§4.5). This is total agreement, not the false-positive rate alone.
- Inspect AI: `model_graded_qa` with several graders uses a majority by default. "a grade must be returned by more than half of the graders." Inspect also has `at_least` (k of n). It has no unanimous reducer.
- Ragas Aspect Critic: `strictness` is "The number of times self consistency checks is made. Final judgement is made using majority vote." The code makes the number odd "to avoid tie".
- OpenAI: "One way to aggregate multiple reviewers is to take consensus votes" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)).

No source uses "1 of n" to keep a finding. All sources keep a finding only when a majority, or all of the passes, agree.

Arithmetic for this repo (an assumption of independent Confirmers, not a measurement): a Confirmer answers "yes" for a false finding with probability q, and for a true finding with probability p.

| Rule | False finding kept | True finding kept | Example, q = 0.3 and p = 0.9 |
| - | - | - | - |
| 1 of 2 "yes" (current) | 1 − (1 − q)² | 1 − (1 − p)² | 51 % false kept, 99 % true kept |
| 1 Confirmer | q | p | 30 % false kept, 90 % true kept |
| 2 of 2 "yes" | q² | p² | 9 % false kept, 81 % true kept |
| 2 of 3 "yes" | 3q² − 2q³ | 3p² − 2p³ | 22 % false kept, 97 % true kept |

Calls of one model on one text are not fully independent. So the real gain is smaller than the table shows.

Cost: n times the calls. For the change from 1 of 2 to 2 of 2, the cost stays the same. Recall falls.

## 4. A threshold, calibrated against labels or feedback

Thresholds with calibration worked:

- Google calibrated its comment-resolution model "for a target precision of 50%". At that precision, "the model addresses 52% of comments". Google added heuristics from "not helpful" feedback.
- Uber uReview: a second prompt gives each comment a confidence score. Uber sets the thresholds per assistant, language, and category. A classifier suppresses categories that developers did not value. Developers address 65 % of comments, against a human baseline of 51 %.
- Atlassian trained a ModernBERT ranker on whether the author changed the commented code. A/B tests set the threshold. The code resolution rate reached 40–45 %, against a human benchmark of about 45 %.
- Greptile embedded the upvoted and downvoted comments of each team. It blocked a new comment similar to 3 or more downvoted comments. The address rate went "from 19% to 55+%" in 2 weeks.

A threshold without calibration failed:

- Greptile first asked an LLM judge for a severity score from 1 to 10 and dropped scores below 7. The scores were "nearly random".
- The Anthropic `code-review` plugin used a 0–100 score with a cut at 80 until 2025-12-06. Anthropic replaced it with the validation step of method 1. The plugin gives no reason and no numbers.
- `claude-code-security-review` tells the model to report only findings above 0.7 confidence (">80% confident of actual exploitability" in `prompts.py`). It gives no numbers.

Calibration methods with guarantees:

- Trust or Escalate: the judge gives a verdict only when its confidence is above a threshold that 500 labelled items set. Else it abstains. On TL;DR, at a 90 % agreement target: coverage 55.7 %, guarantee met in 90.8 % of runs (Table 2). Confidence comes from the agreement of 5 simulated annotators. This cut the calibration error of GPT-4-turbo from 0.217 to 0.095 (Table 1).
- Hamel Husain: treat the judge "as a binary classifier", and report the true positive rate and the true negative rate separately. "a judge that always predicts Pass still has 95% agreement while detecting none of the errors". He reached "> 90% agreement" with the domain expert in 3 iterations. He uses 30 to 50 examples of each label in each set.
- Anthropic: "LLM-as-judge graders should be closely calibrated with human experts", and "give the LLM a way out" with "Unknown" ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)). OpenAI: "validate agreement against your human labels before optimizing for cost or latency".

Cost: a labelled set (Husain: about 100 examples for each failure mode, a minimum of 60 for useful confidence intervals). An abstain option lowers coverage: Trust or Escalate gave a verdict for only 55.7 % of items.

## 5. A fixed stop rule and external evidence for the gate

Rounds with only LLM feedback:

- Huang et al. asked the model to "report any serious problems you find" in its answer, then to correct it. Accuracy fell (Table 3): GPT-4 GSM8K 95.5 → 91.5 → 89.0 over 2 rounds. GPT-3.5 CommonSenseQA 75.8 → 38.1 → 41.8. After 2 rounds on GPT-3.5 GSM8K, 8.8 % of answers changed from correct to incorrect, and 7.6 % from incorrect to correct (Figure 1). "The fundamental issue is that LLMs cannot properly judge the correctness of their reasoning."
- Kamoi et al. (survey): "no prior work demonstrates successful self-correction with feedback from prompted LLMs", except for tasks that suit it. "self-correction works well in tasks that can use reliable external feedback". "the bottleneck is in the feedback generation".
- Self-Refine stops at a fixed step or at a stop signal in the feedback, with "a maximum of 4 iterations". "the marginal improvement naturally decreases with more iterations". Constrained Generation: +11.3, +6.4, +3.0 points per round (Figure 4). Sentiment Reversal does not show this decrease.
- Reflexion stops when the evaluator passes, or after "3 consecutive failed attempts" on HotPotQA.
- Anthropic: an evaluator-optimizer loop fits "when we have clear evaluation criteria, and when iterative refinement provides measurable value". Agents need "stopping conditions (such as a maximum number of iterations)" ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

External evidence:

- CriticGPT: teams of a human and CriticGPT wrote fewer nitpicks and hallucinated bugs than CriticGPT alone (about 34 % against 47 % on inserted bugs, Figure 7, values read from a bar chart). A length penalty in its search (FSBS) moves the critic between more found bugs and fewer false claims, with no retraining (§3.4).
- Anthropic Code Review counts a finding as incorrect when a developer marks it. Google, Uber, Atlassian, and Greptile measure whether a developer acted on the comment. Each tool uses the developer's action, not a second LLM, as the measure of a false positive.

No source gives the rule "stop when a round gives no new finding". The sources use a maximum number of rounds, or a pass from an evaluator.

Cost: a fixed maximum costs nothing, but it leaves the remaining findings open. A real run in a session costs one session, but it gives external evidence.

## What each method would change in the review process

This section maps each method to `review.md`. It does not decide. The Operator decides on later tickets of map #246.

| Method | What it would change in `review.md` | What the change costs |
| - | - | - |
| 1. Verify each finding, "not certain" counts as "no" | The Confirmer prompt would tell the Confirmer to answer "no" when it is not certain. Today a missing answer line counts as "yes" ("When a reviewer has blocking findings", item 3). That rule would flip to "no" | Fewer confirmed blocking findings. Some true findings drop |
| 2. Narrow scope and a "do not report" list | Reviewers would report only findings in the `Changes:` line. Today round 1 reviews all sections, and findings outside the changes become warnings. The "do not report" list could name pre-existing text, findings that a pointer target solves, and style choices. The list could also give an order between rules, for a sentence that 2 rules push in opposite directions | Prompt text. Findings in unchanged text need a different place, for example a backlog issue |
| 3. k of n agreement | The Confirmer vote would change from 1 of 2 "yes" to 2 of 2 "yes", or to 2 of 3 "yes" | 2 of 2: same number of Confirmers, lower recall. 2 of 3: one more Confirmer for each reviewer with blocking findings |
| 4. Calibrated threshold | Each Blocking rule would get labelled pass and fail examples. The project would measure the true positive rate and the true negative rate of each reviewer and each Confirmer. Rules with a low true negative rate would become Advisory rules. A "not certain" answer would map to a warning | A labelled set of 30 to 50 examples of each label for each rule that stays blocking. One measurement run before each change to a rule |
| 5. Stop rule and external evidence | A fixed maximum of rounds, for example the Operator's current preference of 2. The gate would add one real run in a session as external evidence, as the manual run M10 did in the work of #91 | Remaining findings stay open as warnings. A real run costs one session for each change |

## Open points

- No source measures false positives of LLM review against written rules for instruction text. The project can measure its own rate: label 30 to 50 findings for each Blocking rule as true or false, then compute the rate for each reviewer and each Confirmer.
- The vote arithmetic assumes independent Confirmers. Calls of one model on one text are not independent, so the real gain of 2 of 2 is not known.
- Cursor's gain from 52 % to over 70 % includes other changes. No source isolates the effect of the majority vote.
- The Anthropic plugin changed from a confidence threshold to a validation step without published numbers. The reason for the change is not public.
- No source gives a tie-break for 2 rules that ask for opposite corrections of one sentence.
