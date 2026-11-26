#!/bin/sh
# usage: mkconfirm.sh <round> <class> [<keep numbers comma list> <suffix>]
R=/private/tmp/claude-501/-Users-alexk-Projects-agent-context/21bed514-5716-445b-809d-dd17536e9108/scratchpad/review.wPp6
python3 - "$R/round-$1/confirm-$2.txt" "$R/prompts/r$1-confirm-$2$4.txt" "$3" <<'PY'
import sys,re
src,dst,keep=sys.argv[1],sys.argv[2],sys.argv[3]
t=open(src).read()
head,body=t.split("Findings:\n",1)
items=re.split(r"(?m)^(?=\d+\. File:)",body); items=[i for i in items if i.strip()]
if keep: ks=set(keep.split(",")); items=[i for i in items if i.split(".")[0] in ks]
pre="Check class: confirmer\nThis task is read-only. Only read files. Do not edit, make, move, or delete files.\nDo not run commands that change files, Git data, or external services.\n\n"
post='\nRead each file under review from the disk.\nAlso read the files that the pointers in these files identify.\nFor each finding, decide whether the text in the file does not obey the rule.\nIf a file that a pointer identifies already gives what the rule asks for, answer "no".\nGive one line for each finding in this form:\n<number>. <"yes" if the text does not obey the rule, or "no">: <one sentence that gives the cause>\nGive only these lines. Do not give the work to a subagent.\n'
open(dst,"w").write(pre+head+"Findings:\n"+"".join(items).rstrip("\n")+"\n"+post)
PY
