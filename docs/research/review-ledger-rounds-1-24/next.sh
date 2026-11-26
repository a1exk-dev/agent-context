#!/bin/sh
# prints and pops the next queue item
Q=/private/tmp/claude-501/-Users-alexk-Projects-agent-context/21bed514-5716-445b-809d-dd17536e9108/scratchpad/review.wPp6/queue-22.txt
head -1 $Q; sed -i '' 1d $Q; echo "left: $(wc -l < $Q)"
