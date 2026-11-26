import sys,subprocess,re
# usage: sections.py <old file> <new file>  -> prints headings of sections whose lines changed in new file
old,new=sys.argv[1],sys.argv[2]
d=subprocess.run(['diff',old,new],capture_output=True,text=True).stdout
lines=open(new).read().split('\n')
changed=set()
for m in re.finditer(r'^(\d+)(?:,(\d+))?([acd])(\d+)(?:,(\d+))?$',d,re.M):
    a,b=int(m.group(4)),int(m.group(5) or m.group(4))
    if m.group(3)=='d': a=b=max(1,a)
    for i in range(a,b+1): changed.add(i)
heads=[]
for i in sorted(changed):
    h=None
    for j in range(i-1,-1,-1):
        if lines[j].startswith('#') and not lines[j].startswith('#!'):
            h=lines[j].lstrip('#').strip(); break
    if h and h not in heads: heads.append(h)
print('; '.join('"%s"'%h for h in heads))
