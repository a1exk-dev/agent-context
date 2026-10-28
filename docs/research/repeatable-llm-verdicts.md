# Research: repeatable verdicts of LLM reviewers and graders

<!-- cspell:ignore Zheng Haldar Hockenmaier Atil Schroeder Doughty Chiang Krippendorff Krippendorff's Ragas DeepEval promptfoo CheckEval SEEval SummaC SummEval Topical Likert Qwen Deepseek Mistral TARa TARr omega's Prometheus Rocktäschel Thakur MTBench DevBench Vicuna EMNLP BEIS anomalyco nondeterministically -->

Question (issue #123): Which techniques make an LLM judge give the same pass/fail verdict on the same input across reruns? For each technique: the measured effect on agreement, the cost, and whether it works on Claude Code, Codex, and OpenCode without sampling settings.

Use: the 3 reviewer subagents of the `agent-instructions` Skill (`skills/writing/agent-instructions/references/review.md`: loading, ASD-STE100, ISO 24495-1) and the output-test grader (`tests/skills/writing/agent-instructions/grader.md`). Their findings differ on each run of the same unchanged file. The goal is the same pass/fail verdict in N of N reruns on unchanged input. The finding text can differ. The operator already decided that the Skill can ship a TypeScript script for countable checks.

Four kinds of agreement occur in the sources. This file keeps them apart:

- **Rerun self-consistency**: the same judge, the same prompt, the same input, several runs. This is the goal.
- **Human agreement**: the judge against human labels. Most papers measure only this.
- **Inter-evaluator agreement**: different judge models against each other.
- **Order consistency**: the same judge before and after a swap of the 2 answers in a pairwise prompt.

Sources, read on 2026-10-28:

- Model providers:
  - Anthropic: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) ("Grade your evaluations", "Tips for LLM-based grading"); [Increase output consistency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency); [Claude Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) and [Claude Sonnet 5.5 migration guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide) (sampling parameters); [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (engineering post by Anthropic).
  - OpenAI: [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) ("LLM-as-a-judge and model graders"); [Graders](https://developers.openai.com/api/docs/guides/graders) ("Model grader constraints", "Design tips"); [Advanced usage](https://developers.openai.com/api/docs/guides/advanced-usage) (seed).
  - Thinking Machines: [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/) (the research post that owns the claim).
- Papers (arXiv PDFs, version in brackets):
  - Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", [arXiv 2306.05685](https://arxiv.org/abs/2306.05685).
  - Liu et al., "G-Eval", [arXiv 2303.16634](https://arxiv.org/abs/2303.16634).
  - Kim et al., "Prometheus", [arXiv 2310.08491](https://arxiv.org/abs/2310.08491).
  - Wang P. et al., "Large Language Models are not Fair Evaluators", [arXiv 2305.17926](https://arxiv.org/abs/2305.17926).
  - Chiang and Lee, "A Closer Look into Automatic Evaluation Using Large Language Models", [arXiv 2310.05657](https://arxiv.org/abs/2310.05657).
  - Lee Y. et al., "CheckEval" (v3, 2025-10-31), [arXiv 2403.18771](https://arxiv.org/abs/2403.18771).
  - Cook et al., "TICKing All the Boxes", [arXiv 2410.03608](https://arxiv.org/abs/2410.03608).
  - Lee N. et al., "Evaluating the Consistency of LLM Evaluators", [arXiv 2412.00543](https://arxiv.org/abs/2412.00543).
  - Schroeder and Wood-Doughty, "Can You Trust LLM Judgments? Reliability of LLM-as-a-Judge", [arXiv 2412.12509](https://arxiv.org/abs/2412.12509).
  - Haldar and Hockenmaier, "Rating Roulette: Self-Inconsistency in LLM-As-A-Judge Frameworks" (Findings of EMNLP 2025), [arXiv 2510.27106](https://arxiv.org/abs/2510.27106).
  - Shi et al., "Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge", [arXiv 2406.07791](https://arxiv.org/abs/2406.07791).
  - Atil et al., "Non-Determinism of 'Deterministic' LLM Settings" (v5), [arXiv 2408.04667](https://arxiv.org/abs/2408.04667).
  - Wang X. et al., "Self-Consistency Improves Chain of Thought Reasoning", [arXiv 2203.11171](https://arxiv.org/abs/2203.11171).
  - Tam et al., "Let Me Speak Freely?", [arXiv 2408.02442](https://arxiv.org/abs/2408.02442).
- Eval frameworks: Inspect AI docs source `docs/model-graded.qmd` and `docs/multiple-scorers.qmd` in [UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) (`main`); [Ragas Aspect Critic](https://github.com/explodinggradients/ragas/blob/main/docs/concepts/metrics/available_metrics/aspect_critic.md); [DeepEval DAG](https://deepeval.com/docs/metrics-dag); [promptfoo llm-rubric](https://github.com/promptfoo/promptfoo/blob/main/site/docs/configuration/expected-outputs/model-graded/llm-rubric.md).
- Platforms: Claude Code [Subagents](https://code.claude.com/docs/en/sub-agents) ("Supported frontmatter fields", "Choose an effort level"); Codex [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) ("Custom agent file schema") and a GitHub code search of [openai/codex](https://github.com/openai/codex) for `temperature`; OpenCode `packages/web/src/content/docs/agents.mdx` in [anomalyco/opencode](https://github.com/anomalyco/opencode) (`dev`), section "Temperature".

## Summary

| # | Technique | Measured effect | Cost | Works on all 3 without sampling settings |
| - | - | - | - | - |
| 1 | Countable checks in code | Code graders are "Reproducible" (Anthropic). No LLM variance remains. | Near zero tokens. One script run. | Yes, if the agent can run the script. |
| 2 | Closed rule list, specific rules | No direct rerun number. Longer criterion text gave a "generally" higher self-consistency (Lee N.). Vague rubrics "produce inconsistent judgments" (Anthropic, no number). | More prompt tokens. | Yes (prompt only). |
| 3 | Pass rule on blocking findings only | No direct study. Arithmetic: a verdict that fails on any of many noisy items flips often. | Zero calls. Less work per finding. | Yes (prompt and script). |
| 4 | Binary per-rule questions | Inter-evaluator α 0.09 → 0.48 (all models), 0.05 → 0.67 (large models) (CheckEval). Rerun self-consistency of a binary scale was lower than of interval scales for 4 of 5 models (Lee N.). Mixed. | More output tokens. | Yes. |
| 5 | Narrower scope per call | No rerun number. Anthropic recommends one isolated judge per dimension. CheckEval uses one call per dimension. | More calls (one per group). | Yes. Codex runs at most 3 at once. |
| 6 | Fixed report form | Format errors 0 to 3.8 % (Zheng). Shorter outputs are more stable (Atil, correlation). No direct verdict number. | Low. | Yes, in the prompt. API structured outputs are not available through the subagent tools. |
| 7 | Evidence before the verdict | Human agreement up: GPT-4 52.7 % → 56.5 %, ChatGPT 44.4 % → 52.6 % (Wang P.). Rerun self-consistency: no gain (Qwen 3 0.788 → 0.780, Rating Roulette). | More output tokens. | Yes. |
| 8 | Majority vote of k calls | Human agreement up (Qwen 3 79.4 → 80.6, Rating Roulette). No direct rerun number for the vote itself. Arithmetic: per-call 90 % → 97.2 % for k = 3. | k times the calls and tokens. | Yes. Codex cap 3 at once. |
| 9 | Reference answers and few-shot anchors | Order consistency 65.0 % → 77.5 % (GPT-4, Zheng). Rerun self-consistency: no gain (Rating Roulette). | Zheng: prompts 4 times more expensive. | Yes. |
| 10 | Stronger model | Rerun stability: Claude-3-Haiku 0.89 vs Claude-3.5-Sonnet 0.96 (Shi). α 0.33 vs 0.79 (Rating Roulette). One counter-example (Lee N.). | Higher price per token. | Partly: Claude Code and Codex take a model per spawn. OpenCode `task` does not. |
| 11 | Position swap | Order consistency only. Not applicable to single-file review. | 2 times the calls. | Yes, but not useful here. |
| 12 | Temperature 0 or seed | Not deterministic: 80 unique completions of 1000 (Thinking Machines). Lower human agreement (Rating Roulette). | n/a | No. Out of scope, and current Claude models reject it. |

The main result: no prompt technique has a measured effect on rerun self-consistency that makes a verdict repeat N of N times. The strongest evidence is for 2 structural changes. First, move each countable check into code, because code gives the same result each time. Second, make the verdict depend on few, specific, binary decisions with a quoted location, and confirm each blocking decision with a majority of independent calls. Reasoning before the verdict and few-shot examples help human agreement, but Rating Roulette measured no gain in rerun self-consistency from them. Sampling settings are not available to a Skill on all 3 platforms, and temperature 0 does not give identical outputs.

## 1. Split countable checks into code

- Effect: Anthropic lists code-based graders as "Fast", "Cheap", "Objective", "Reproducible", and "Easy to debug". It lists model-based graders as "Non-deterministic" ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), "Types of graders for agents"). It recommends "choosing deterministic graders where possible, LLM graders where necessary or for additional flexibility" (same post, "Design the eval harness and graders"). The Anthropic docs rank code-based grading as "Fastest and most reliable" ([develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), "Grade your evaluations").
- Inspect AI has a `cascade()` scorer: cheap scorers run first, and "an expensive stage such as a grader model only runs on samples that cheaper scorers did not settle". It warns that "earlier scorers should not be prone to false positives" (`docs/multiple-scorers.qmd`, "Cascading Scorers").
- Measured number: none needed. A pure function on the same file gives the same output. The repeatability is by construction, not by measurement.
- Cost: one script run. No model tokens.
- Platforms: works on all 3, because each platform can run a shell command. The open question is how the script runs on the machine of the operator (see "Open points").
- Limit: Anthropic notes code graders are "Brittle to valid variations" and "Lacking in nuance". So the script must handle only checks with a countable definition.

## 2. Closed rule lists and specific rules

- Effect on rerun self-consistency: Lee N. et al. tested 3 criterion lengths (none, a phrase, a paragraph). "The effect of criterion granularity does not have a clear pattern, but generally, there is an upward slope with increasing granularity, suggesting a more detailed definition of an evaluation can assist in more consistent evaluations" ([arXiv 2412.00543](https://arxiv.org/abs/2412.00543), Section 3.1, Figure 1; 5 samples at temperature 1.0, 7B models and GPT-3.5). Weak: a figure, no single number.
- Rating Roulette found that self-reliability "depends heavily on the metric". On SummEval, Fluency had low self-reliability for all judges, while Coherence and Consistency were high ([arXiv 2510.27106](https://arxiv.org/abs/2510.27106), Section 4, Figure 4). So a vague criterion such as "fluency" is less repeatable than a concrete one. Indirect for our rules.
- Provider guidance (no number): "vague rubrics produce inconsistent judgments" ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), "Collect tasks for the initial eval dataset"). "Have detailed, clear rubrics", with the example "If it does not, the answer is automatically graded as 'incorrect'" ([develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), "Tips for LLM-based grading"). OpenAI: "Ensure eval rubrics are clear and detailed" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices), "LLM-as-a-judge and model graders").
- A closed list also stops new rules. The current reviewer prompt already says "Do not make a new rule". No source measures this part alone.
- Cost: longer prompts.
- Platforms: prompt only, so all 3.

## 3. Pass rule on blocking findings only

- No source measures this technique. The evidence is indirect.
- Arithmetic: Anthropic defines pass^k as "the probability that all k trials succeed", for example "(0.75)³ ≈ 42%" ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), "How to think about non-determinism in evaluations for agents"). The same arithmetic applies to a verdict "fail if any finding". Assume 20 independent items, and each item gives a false finding in 5 % of runs. Then a clean file passes in 0.95^20 ≈ 36 % of runs. A verdict that counts only a few blocking rules has fewer noisy items, so it flips less often. This is a calculation with an independence assumption, not a measurement.
- Hard cases flip most often. Shi et al.: position consistency rises with the answer quality gap, and pairs "of similar quality are difficult to judge" ([arXiv 2406.07791](https://arxiv.org/abs/2406.07791), Section 3, Figure 2). Schroeder and Wood-Doughty: SQuAD, with many correct answers, had lower omega reliability than BBH, because of "difficulty in distinguishing the best answer among multiple highly accurate responses" ([arXiv 2412.12509](https://arxiv.org/abs/2412.12509), Section 6, Table 2). So borderline style items are the noisy ones. A pass rule that puts them in warnings removes most flips.
- A way out: "give the LLM a way out, like providing an instruction to return 'Unknown' when it doesn't have enough information" (Anthropic, same post, "Design the eval harness and graders"). For a verdict, "Unknown" can map to a warning, not to a block.
- OpenAI's human-eval advice: "Include a pass/fail threshold in addition to the numerical score" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices), "Human evals").
- Cost: none. It reduces the work after each round.
- Platforms: all 3.

## 4. Binary per-rule questions instead of Likert scales

- For: CheckEval asks about 25 yes/no questions per dimension. Inter-evaluator agreement (Krippendorff α, models of one size group as raters) on SummEval rose from G-Eval 0.09 to CheckEval 0.48 for all models, and from 0.05 to 0.67 for large models ([arXiv 2403.18771](https://arxiv.org/abs/2403.18771), Table 2). Appendix C.3, Table 13: a binary conversion of G-Eval's Likert scores reached only α 0.11 (all) and 0.32 (large). So the gain comes from the decomposed checklist, not only from the 2-value output. This is inter-evaluator agreement at temperature 0, not rerun self-consistency.
- For: TICK yes/no checklists raised exact agreement of an LLM judge with human preferences from 46.4 % to 52.2 %, and human inter-annotator α from 0.194 to 0.256 ([arXiv 2410.03608](https://arxiv.org/abs/2410.03608), abstract, Table 6). Human agreement only.
- Against: Lee N. et al. measured rerun self-consistency (5 samples, temperature 1.0). "Compared to the interval scales, the 5-P Likert scale and the binary scale had a negative impact on Self-Consistency with the exception of Mistral-Instruct" ([arXiv 2412.00543](https://arxiv.org/abs/2412.00543), Section 3.1, Figure 1). Caution: Krippendorff α on a binary label with a skewed distribution is low even when raw agreement is high, as Rating Roulette explains (Section 3.3). The models were 7B models and GPT-3.5.
- Rating Roulette, binary SummaC labels, 3 runs: α 0.326 (Llama 3.1 70B), 0.628 (DeepSeek-R1 distill), 0.788 (Qwen 3 32B) (Table 1). So a binary question alone does not give N of N.
- Provider guidance: OpenAI "Use pairwise comparison or pass/fail for more reliability" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)). Anthropic shows both "correct"/"incorrect" and 1 to 5 as "empirical or specific" outputs. Ragas Aspect Critic is a binary metric. OpenAI's "Produce a smooth score, not a pass/fail stamp" tip is for reinforcement fine-tuning graders, not for eval verdicts ([Graders](https://developers.openai.com/api/docs/guides/graders), "Design tips").
- Result: the evidence for binary questions is about agreement between models and with humans. For rerun self-consistency it is mixed. Use binary questions because the verdict is binary and a script can count them, not because a study shows that they repeat.
- Cost: more output tokens, one answer per question.
- Platforms: all 3.

## 5. Narrower scope per call

- Provider guidance (no number): "create clear, structured rubrics to grade each dimension of a task, and then grade each dimension with an isolated LLM-as-judge rather than using one to grade all dimensions" ([Demystifying evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), "Design the eval harness and graders"). OpenAI: workflows "involve multiple underlying model interactions, which you can evaluate in isolation" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices), "Workflow architectures").
- Papers: CheckEval and Rating Roulette prompt each dimension separately ("We prompted each LLM judge to evaluate each metric ... independently per run", Rating Roulette, Section 3.2). CheckEval names "evaluation dimensions [that] encompass multiple distinct fine-grained criteria" as one cause of low agreement (Section 5.2). No paper isolates the per-call scope as a variable for rerun self-consistency.
- Atil et al.: longer outputs are less stable. They found "a strong/moderate negative correlation between the output length and TARa@10" ([arXiv 2408.04667](https://arxiv.org/abs/2408.04667), Section 7). A call with fewer rules writes a shorter report. Correlation only.
- DeepEval DAG uses "One or more focused calls as the graph executes". Its FAQ says the judgement nodes "still use an LLM, so their outputs can vary". It gives no reliability data ([DeepEval DAG](https://deepeval.com/docs/metrics-dag)).
- Cost: one call per rule group. Calls run in parallel, but Codex V2 allows 3 subagents at the same time (see `docs/research/parallel-subagents.md` on `research/parallel-subagents`).
- Platforms: all 3.

## 6. Fixed report forms

- Provider guidance: "Precisely define the output format you want using JSON, XML, or custom templates" and "Constrain with examples" ([Increase output consistency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)). For guaranteed schema conformance the page points to API Structured Outputs. Prefill is "not supported on Claude 4.6 and later models".
- Frameworks: Inspect AI extracts the grade with a pattern that "matches the last `GRADE: X` in the grader's output", so an earlier `GRADE` in the reasoning does not win (`docs/model-graded.qmd`, "Grading Robustness"). promptfoo asks for `{"reason": ..., "pass": true}`. OpenAI's score model grader returns `result` and `steps` ([Graders](https://developers.openai.com/api/docs/guides/graders), "Score model grader outputs").
- Measured: Zheng et al. report wrong output formats ("Error") of 0 % to 3.8 % ([arXiv 2306.05685](https://arxiv.org/abs/2306.05685), Table 2). Tam et al.: JSON mode can help classification accuracy ("JSON-mode performs competitively, and in some cases, surpasses") but strict formats hurt reasoning tasks ([arXiv 2408.02442](https://arxiv.org/abs/2408.02442), Section 4). Accuracy, not rerun consistency. No source measures the effect of a report form on verdict repeatability.
- What a form does for this goal: a script can parse the verdict and the findings. The parse is deterministic. A form also lets the script match findings across runs (rule id plus line), which technique 8 needs.
- Cost: low.
- Platforms: in the prompt only. API structured outputs cannot be set through `Agent`, `spawn_agent`, or `task`. On Opus 5.5, forced `tool_choice` is "rejected" ([Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)). So the main agent or the script must check the form and reject a report that does not match.

## 7. Quote evidence before the verdict

- Human agreement, for: Wang P. et al., Table 4. "Vanilla" gives the conclusion first. "EC (k = 1)" gives the evidence first. GPT-4 52.7 % → 56.5 %, kappa 0.24 → 0.29. ChatGPT 44.4 % → 52.6 %, kappa 0.06 → 0.23 ([arXiv 2305.17926](https://arxiv.org/abs/2305.17926), Section 4.3). Chiang and Lee: "asking the LLM to explain its own ratings consistently improves the correlation" (Table 1: ChatGPT coherence r 0.45 for auto-CoT score only, 0.557 for rate-explain, 0.635 for analyze-rate) ([arXiv 2310.05657](https://arxiv.org/abs/2310.05657)). G-Eval: without CoT the average Spearman ρ fell from 0.514 to 0.500 ([arXiv 2303.16634](https://arxiv.org/abs/2303.16634), Table 1). Zheng et al.: math grading failure 14/20 default, 6/20 CoT, 3/20 reference (Table 4).
- Rerun self-consistency, against: Rating Roulette, Appendix C.2, Table 5. Self-reliability on SummaC: Qwen 3 0.7883 default, 0.7796 with CoT; DeepSeek-R1 0.6278 → 0.6132. The authors "found [that] to not be the case" that CoT or few-shot "led to any reliability or agreement gains" (Section 5.1).
- Risk: reasoning can copy an error. Zheng et al., Figure 15: GPT-4 with a CoT prompt "exactly copied Assistant B's answer (which contains arithmetic errors)".
- Provider guidance: Anthropic "Encourage reasoning: Use a grader model with thinking on" ([develop-tests](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)). OpenAI "reasoning before scoring improves eval performance" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)). Both are about accuracy.
- A quote has a second use: a script can check that each quoted text is in the file. A finding with a quote that is not in the file is then dropped by code, in the same way on each run. No source measures this filter. It is a design inference.
- Cost: more output tokens per finding.
- Platforms: all 3. Current Claude models think by default ("adaptive thinking is always on" on Opus 5.5, migration guide), so a subagent reasons before it writes in any case.

## 8. Majority vote of k calls

- Rerun self-consistency of one call: Rating Roulette on MT-Bench, "Qwen 3 gave the same judgment on all 3 runs for only 61.3% of cases" (Section 4). Shi et al. measured "repetition stability" at temperature 1 over 3 trials: above 0.95 for Claude-3.5-Sonnet, GPT-4, and Llama-3.3-70B, 0.89 for Claude-3-Haiku, 0.75 for Llama-3.1-8B (Table 2). The per-call stability is high for strong models, but not 1.
- Effect of the vote, human agreement: Rating Roulette, Table 2, balanced accuracy on SummaC, single run vs majority of 3: Llama 3.1 59.1 → 61.4, DeepSeek-R1 69.8 → 72.3, Qwen 3 79.4 → 80.6. "For Deepseek-R1 and Qwen 3, taking the majority vote gives a higher balanced accuracy than the maximum accuracy achieved by a single run". Wang P. et al., Table 4: MEC k = 1, 3, 6 gives GPT-4 accuracy 56.5 %, 58.7 %, 60.9 %. Wang X. et al. (self-consistency): GSM8K +17.9 % accuracy ([arXiv 2203.11171](https://arxiv.org/abs/2203.11171), abstract). Lee N. et al., Tables 3 and 4: self-consistency decoding raised correlation with GPT-4 (GPT-3.5 harmlessness 0.44 → 0.51).
- Effect of the vote on rerun self-consistency: no source measures it. Arithmetic: if one call gives the usual verdict with probability p, and calls are independent, a 2-of-3 vote gives it with p³ + 3p²(1 − p). For p = 0.9 this is 0.972. Over 5 reruns: 0.9⁵ ≈ 0.59 for one call, 0.972⁵ ≈ 0.87 for the vote. Calls of the same model on the same text are not fully independent, so the real gain is smaller.
- Frameworks: Inspect AI `model_graded_qa(model=[...])` uses `multi_scorer()` with a "majority" reducer: "A grade wins only when more than half of the panel returns it" (`docs/model-graded.qmd`, "Multiple Models"). Inspect also says "setting temperature=0 reduces, but does not always eliminate, run-to-run disagreement" and tells users to "Run multiple epochs and inspect grade variance" ("Reproducible Grading"). Ragas Aspect Critic: "The `strictness` parameter plays a crucial role in maintaining consistency in predictions, with an ideal range typically falling from 2 to 4" ([Ragas](https://github.com/explodinggradients/ragas/blob/main/docs/concepts/metrics/available_metrics/aspect_critic.md)). Anthropic lists "Multi-judge consensus" as a model-based method.
- Cost: k times the calls, tokens, and wall time. Wang P. et al., Table 4: GPT-4 cost $2.00 for k = 1 and $6.38 for k = 6 (with calibration). With 3 reviewers and k = 3, one file needs 9 subagents per round. On Codex V2 this is 3 groups of 3.
- Platforms: all 3. Each call must be a new subagent with an empty context, as `review.md` already requires.

## 9. Reference answers and few-shot anchors

- Order consistency: Zheng et al., Table 12, few-shot vs zero-shot: GPT-4 65.0 % → 77.5 %, Claude-v1 23.8 % → 63.7 %, GPT-3.5 46.2 % → 55.0 %. The authors warn "high consistency may not imply high accuracy" and "the longer prompts make API calls 4× more expensive" (Section 3.4). Order consistency is not rerun consistency.
- Rerun self-consistency: Rating Roulette, Table 5, few-shot: Qwen 3 0.7883 → 0.7804. No gain.
- Reference answers: Zheng et al., Table 4, math failure 14/20 → 3/20 with a reference answer. Prometheus, Table 6: correlation with GPT-4 0.860 → 0.642 without the reference answer ([arXiv 2310.08491](https://arxiv.org/abs/2310.08491), Section 6.1, "Training Ablation"). This is a trained judge, and the metric is correlation, not rerun consistency.
- Provider guidance: OpenAI "Provide few-shot examples of great, fair, and poor answers in the prompt" and "run multiple candidate responses and ground truths through your LLM judge to ensure grading is stable" ([Graders](https://developers.openai.com/api/docs/guides/graders), "Design tips"). Anthropic: "Provide examples of the output you want" ([Increase output consistency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency)).
- For rule review, an anchor is a pass example and a fail example for each blocking rule. They define the boundary that technique 3 says is the noisy part. No source measures this for rule review.
- Cost: more prompt tokens.
- Platforms: all 3.

## 10. Stronger model or more reasoning effort

- For: Shi et al., Table 2, repetition stability on MT-Bench: Claude-3-Haiku 0.89, Claude-3-Sonnet 0.93, Claude-3.5-Sonnet 0.96, Llama-3.1-8B 0.75, Llama-3.3-70B 0.96. Rating Roulette: SummaC α 0.33 (Llama 3.1) to 0.79 (Qwen 3) and "it gets better for newer and larger models" (Section 4). Atil et al.: "when the LLM is more accurate it becomes more deterministic for multiple choice selections" (Section 7, few-shot setting).
- Against: Lee N. et al. "strong proprietary models are not necessarily consistent evaluators": GPT-3.5 had lower self-consistency than Mistral-7B (abstract, Section 3.3). Schroeder and Wood-Doughty saw an inverse ranking for 3 small models (Section 6).
- Provider guidance: OpenAI "Use the most capable model to grade if you can" ([Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)).
- Cost: a higher price per token.
- Platforms: Claude Code `Agent` can pass a model and, from v2.1.292, an `effort` per call ([Subagents](https://code.claude.com/docs/en/sub-agents), "Choose an effort level"). Codex: "Explicit spawn values override" the default subagent model and reasoning effort ([Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)). OpenCode: a subagent uses its agent config or "the model of the primary agent that invoked the subagent" (`agents.mdx`, "Model"). The `task` tool has no model parameter. So a Skill cannot select a model on all 3. By default, all 3 use the model of the main agent.

## 11. Position swap

- Zheng et al.: "call a judge twice by swapping the order of two answers and only declare a win when an answer is preferred in both orders" (Section 3.4). Wang P. et al.: Balanced Position Calibration, GPT-4 accuracy 58.7 % → 62.5 % with MEC (Table 4). Both are for pairwise comparison.
- The reviewers and the grader judge one file or one run, not 2 answers. So this technique is not applicable. No source tests a change in the order of rules or sections for single-answer review.

## 12. Sampling settings: out of scope and not enough

- Temperature 0 is not deterministic. Thinking Machines: Qwen3-235B at temperature 0, 1000 completions, 80 unique. The cause is batch size, which "nondeterministically varies" with server load, and the user does not control it. With batch-invariant kernels all 1000 were identical ([post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/), "Experiments"). Atil et al.: at temperature 0 with a fixed seed, GPT-4o TARa@10 (same parsed answer in all 10 runs) was 50.0 % on college math and 99.6 % on logical deduction (Table 2). "None of the LLMs consistently delivers repeatable accuracy across all tasks" (abstract).
- Removing sampling can hurt: Rating Roulette, Table 2, "No Sampling" gave lower balanced accuracy than the majority vote (Qwen 3 79.2 vs 80.6). "There is a trade-off between self-reliability and performance" (Section 5.1). Schroeder and Wood-Doughty got omega 1.0 at temperature 0 only with greedy decoding on their own GPUs (Table 2).
- Providers: Claude Opus 5.5 and Sonnet 5.5 return a 400 error for `temperature`, `top_p`, and `top_k`. "If you were using `temperature = 0` for determinism, note that it never guaranteed identical outputs on prior models" ([Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)). OpenAI: "Chat Completions are non-deterministic by default"; `seed` gives "(mostly) deterministic outputs" ([Advanced usage](https://developers.openai.com/api/docs/guides/advanced-usage)). OpenAI graders: "`temperature` changes not supported for reasoning models" ([Graders](https://developers.openai.com/api/docs/guides/graders)). Inspect AI notes that the Responses API "does not accept `seed`".
- Platforms:

  | Platform | Subagent definition | Per-spawn parameters | Temperature |
  | - | - | - | - |
  | Claude Code | Frontmatter has `model` and `effort`, among others. No sampling field. | `Agent`: model, effort. | Not settable. Current Claude models reject it. |
  | Codex | Custom agent TOML: `model`, `model_reasoning_effort`, `model_reasoning_summary`, `model_verbosity`. | Model and reasoning effort. | Not settable. GitHub code search found no `temperature` setting in `openai/codex`. |
  | OpenCode | Agent config has `temperature`. "If no temperature is specified, OpenCode uses model-specific defaults; typically 0 for most models". | `task`: no sampling parameter. | Only in `opencode.json` or an agent file. |

- A Skill can use only `name` and `description` frontmatter and must work on all 3 (`MEMORY.md`). It cannot ship an agent definition. So sampling control is out. The OpenCode field also cannot help with Claude 5.5 models, because the API rejects the parameter. How OpenCode handles that case was not checked.

## Implications for the agent-instructions Skill

Define the verdict first. A round passes when it has no blocking finding after the filters below. The finding text, the warnings, and the order of findings can differ between runs. The script, not the main agent, computes the verdict from the reports.

### Move into the TypeScript script

The script must not contain ASD-STE100 dictionary content or ISO text (`MEMORY.md`, "ASD-STE100 content stays outside the repo" and "ISO standard text stays outside agent reads"). Each item below is a count or a pattern from our own rule files.

- Loading reviewer:
  - File size and line limits from `loading-rules.md` ("When you examine the file size": the 32 KiB entry-file total, 20,000 bytes for `SKILL.md`) and from `agent-skills-spec.md` (less than 500 lines).
  - The frontmatter checks of `agent-skills-spec.md`: `name` pattern and length, `description` length (1 to 1024 characters), allowed top-level fields, folder name equal to `name`.
  - The list of pointer sentences: each sentence that names a file path. The script gives the list, and the LLM judges only whether each sentence has a condition.
  - `@path` imports outside the permitted exception.
- ASD-STE100 reviewer:
  - Sentence split and word count with the rules of "When you count words" in `ste-rules.md`. This replaces the numbered-word list that the reviewer now writes by hand.
  - The length limits (20 words for procedural text, 25 for descriptive text and notes). The LLM gives only the text type of each sentence. The script applies the limit.
  - Emphasis that the rules forbid, for example bold or capital-letter words other than CAUTION.
- ISO 24495-1 reviewer:
  - The `_Avoid_` terms of the glossary. `MEMORY.md` records that this reviewer reported "Rule file" against "Rule" 2 times. A script finds each avoided term in the same way on each run.
- All reviewers: check that each quoted Text field occurs in the file (technique 7). Drop a finding whose quote is not in the file. Check the report form, and match findings across runs by rule id and line.
- Grader (`grader.md`):
  - Statement 7: word counts and the longest sentences.
  - Statement 6: emphasis hits outside code blocks.
  - Statement 9.2: the line count of each `##` section of the starting `AGENTS.md`.
  - Statements 1, 3, 4, and 10.2: the order of `Agent`/`Task` starts, `message.id` groups, and the count of report writes per tool call. These come from `transcript.jsonl` and are countable.
  - `LIMIT_HIT` and `INCOMPLETE` files, and the `summary` counts in `grading.json`.

### Change the LLM reviewers

1. Give each rule in the rule files a stable id and a class: blocking or advisory (techniques 2 and 3). Make the plain-language checks advisory unless a check names a concrete defect. Rating Roulette found the lowest self-reliability on the least concrete criterion.
2. Tell each reviewer to answer a closed checklist: for each rule id, "yes" with a quote and a line, or "no" (technique 4). Allow "unknown", and treat it as a warning (technique 3).
3. Use a fixed report form that ends with one line per blocking finding in a fixed pattern (technique 6). The script parses only this part.
4. Keep the quote before the rule decision (technique 7). It helps accuracy, and the script can check it. Do not expect it to fix rerun variance.
5. Confirm each blocking finding with a vote (technique 8). The lower-cost form: after one review, start 2 new subagents for each blocking finding, each with only that rule, that quote, and the file. Keep the finding when 2 of 3 say "yes". This removes false blocks. It does not find a blocking problem that the first review missed. The full form runs each reviewer 3 times and keeps a finding when 2 of 3 runs report the same rule id on the same line. It costs 9 subagents per file per round, in groups of 3 on Codex.
6. Add one pass example and one fail example to each blocking rule (technique 9).
7. Split a reviewer into smaller calls only when its rule list is long (technique 5). The ASD-STE100 reviewer has the most rules and is the first candidate.

### Change the grader

- Let the script grade each countable statement.
- Give each remaining statement, or a small group of related statements, to its own grader call with a binary answer, a quote from the run record, and a fixed JSON form.
- Use a 2-of-3 vote for each LLM-graded statement whose result decides a pass. The current rule "Start a fresh grader subagent for each run" (`MEMORY.md`) stays, and the vote multiplies those subagents by 3.

## Open points

- No source measures rerun self-consistency for rule-based review of instruction files. Most numbers here are human agreement or inter-evaluator agreement. The project must measure its own baseline: run each reviewer 5 times on unchanged fixture files, and count the runs that give the same verdict (TARa@N in the sense of Atil et al.). Then measure again after each change.
- The independence assumption of the vote arithmetic is not true for runs of one model on one text. The real gain of a 2-of-3 vote is not known.
- The text type of a sentence (procedural, descriptive, note) stays an LLM decision. If it is not stable, the script length check inherits the variance. Measure it separately.
- How the TypeScript script runs on the machine of the operator is open. See "How does a TypeScript script that a Skill ships run on the user's machine?" (#21) and the `MEMORY.md` entry "Skills and Rules use no script to do their work", which the operator decision for this Skill changes.
- The cost of the full vote (9 subagents per file per round) against the lower-cost confirmation vote is not measured. The usage limits on all 3 platforms can make the full vote impractical for multi-file edits.
- How OpenCode handles its `temperature` default with models that reject sampling parameters was not checked. It does not change the result, because a Skill cannot set it.
