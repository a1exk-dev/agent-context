#!/bin/sh
# usage: setup-full.sh <round>  — copies files, runs check, writes 24 prompts
n=$1; cd /Users/alexk/Projects/agent-context
R=/private/tmp/claude-501/-Users-alexk-Projects-agent-context/21bed514-5716-445b-809d-dd17536e9108/scratchpad/review.wPp6; S=skills/writing/agent-instructions
mkdir -p $R/round-$n/$S/references $R/round-$n/loading $R/round-$n/ste $R/round-$n/iso
cp $S/SKILL.md $R/round-$n/$S/; cp $S/references/*.md $R/round-$n/$S/references/
node $S/scripts/check.ts $PWD/$S/SKILL.md $PWD/$S/references/*.md --project $PWD --glossary $PWD/GLOSSARY.md > $R/round-$n/check.json
for f in SKILL.md references/agent-skills-spec.md references/end-of-run-report.md references/loading-rules.md references/plain-language-rules.md references/review.md references/ste-rules.md references/technical-terms.md; do
 b=$(basename $f .md); for c in loading ste iso; do sh $R/prompts/gen.sh $n $c $f all > $R/prompts/r$n-$c-$b.txt; done; done
python3 -c "import json;print(len(json.load(open('$R/round-$n/check.json'))['findings']),'script findings')"
