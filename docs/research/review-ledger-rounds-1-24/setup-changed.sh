#!/bin/sh
# usage: setup-changed.sh <round>  — compares with previous round copies, writes 3 prompts
n=$1; p=$((n-1)); cd /Users/alexk/Projects/agent-context
R=/private/tmp/claude-501/-Users-alexk-Projects-agent-context/21bed514-5716-445b-809d-dd17536e9108/scratchpad/review.wPp6; S=skills/writing/agent-instructions; P=$PWD
mkdir -p $R/round-$n/$S/references $R/round-$n/loading $R/round-$n/ste $R/round-$n/iso
CH=""
for f in SKILL.md references/agent-skills-spec.md references/end-of-run-report.md references/loading-rules.md references/plain-language-rules.md references/review.md references/ste-rules.md references/technical-terms.md; do
  if ! cmp -s $S/$f $R/round-$p/$S/$f; then s=$(python3 $R/sections.py $R/round-$p/$S/$f $S/$f | tr '\n' ' ' | sed 's/ *$//; s/"; "/", "/g'); CH="$CH${CH:+; }$P/$S/$f: $s"; fi
done
cp $S/SKILL.md $R/round-$n/$S/; cp $S/references/*.md $R/round-$n/$S/references/
node $S/scripts/check.ts $P/$S/SKILL.md $P/$S/references/*.md --project $P --glossary $P/GLOSSARY.md > $R/round-$n/check.json
for c in loading ste iso; do sh $R/prompts/gen.sh $n $c SKILL.md x | python3 -c "
import sys;t=sys.stdin.read().split('\n')
print('\n'.join(('Changes: '+sys.argv[1]) if l.startswith('Changes: ') else l for l in t))" "$CH" > $R/prompts/r$n-$c.txt; done
echo "$CH"; python3 -c "import json;print(len(json.load(open('$R/round-$n/check.json'))['findings']),'script findings')"
