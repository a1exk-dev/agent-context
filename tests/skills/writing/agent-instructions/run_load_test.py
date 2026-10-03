#!/usr/bin/env python3
"""Run the agent-instructions load test with Claude Code or OpenCode.

Each request runs in a fresh copy of project/ with the skill in
.claude/skills/. A run counts as a load when the agent calls the Skill tool
for agent-instructions or reads its SKILL.md. A request is correct when the
load rate is on the right side of 0.5.

Usage:
  run_load_test.py --out <result.json> [--runs 3] [--jobs 5] [--platform claude|opencode]
"""

import argparse
import json
import os
import shutil
import subprocess
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
SKILL = HERE.parents[3] / "skills" / "writing" / "agent-instructions"
MAX_TOOL_CALLS = 8
LIMIT_TEXT = "hit your session limit"


def loaded(call):
    inp = call.get("input", {})
    if call.get("name", "").lower() == "skill":
        return "agent-instructions" in str(inp.get("skill", inp.get("name", "")))
    return "agent-instructions/SKILL.md" in str(inp.get("file_path", inp.get("filePath", "")))


def run_once(query, model, timeout, platform="claude"):
    work = Path(tempfile.mkdtemp(prefix="ai-load-")) / "project"
    shutil.copytree(HERE / "project", work)
    shutil.copytree(SKILL, work / ".claude" / "skills" / "agent-instructions")
    cmd = ["claude", "-p", query, "--output-format", "stream-json", "--verbose",
           "--setting-sources", "project,local", "--model", model]
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    if platform == "opencode":
        from run_opencode_evals import environment
        cmd = ["opencode", "run", "--pure", "--dir", str(work),
               "--model", model, "--format", "json", query]
        env = environment(model, no_subagents=True, force_skill=False)
        env["PWD"] = str(work)
    proc = subprocess.Popen(cmd, cwd=work, env=env, stdout=subprocess.PIPE,
                            stderr=subprocess.DEVNULL, text=True)
    calls, start, hit, limit = [], time.time(), False, False
    valid = False
    watchdog = threading.Timer(timeout, proc.kill)
    watchdog.start()
    try:
        for line in proc.stdout:
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            limit = limit or LIMIT_TEXT in line
            if event.get("type") == "error":
                raise RuntimeError(f"provider error for {query}: {event}")
            if event.get("type") == "assistant":
                for c in event["message"].get("content", []):
                    if c.get("type") == "tool_use":
                        calls.append(c["name"])
                        hit = hit or loaded(c)
            if event.get("type") == "tool_use":
                part = event["part"]
                call = {"name": part["tool"], "input": part["state"].get("input", {})}
                calls.append(call["name"])
                hit = hit or loaded(call)
            done = event.get("type") == "result" or (
                event.get("type") == "step_finish" and event["part"].get("reason") == "stop")
            if hit or done or len(calls) >= MAX_TOOL_CALLS:
                valid = True
                break
    finally:
        watchdog.cancel()
        proc.kill()
        proc.wait()
        shutil.rmtree(work.parent, ignore_errors=True)
    if limit:
        raise RuntimeError(f"usage limit hit for: {query}")
    if not valid:
        raise RuntimeError(f"incomplete load-test run after {time.time() - start:.0f}s: {query}")
    return hit, calls


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--runs", type=int, default=3)
    ap.add_argument("--jobs", type=int, default=5)
    ap.add_argument("--platform", choices=("claude", "opencode"), default="claude")
    ap.add_argument("--model")
    ap.add_argument("--timeout", type=int, default=180)
    args = ap.parse_args()
    model = args.model or ("openai/gpt-6-astra" if args.platform == "opencode" else "claude-opus-5-5")
    requests = json.loads((HERE / "load-requests.json").read_text())
    jobs = [(r, i) for r in requests for i in range(args.runs)]
    with ThreadPoolExecutor(args.jobs) as pool:
        outcomes = list(pool.map(lambda j: run_once(j[0]["query"], model, args.timeout, args.platform), jobs))
    results = []
    for r in requests:
        runs = [o for (req, _), o in zip(jobs, outcomes) if req is r]
        rate = sum(hit for hit, _ in runs) / len(runs)
        correct = rate >= 0.5 if r["should_trigger"] else rate < 0.5
        results.append({**r, "load_rate": rate, "correct": correct,
                        "first_tools": [calls[:3] for _, calls in runs]})
    summary = {"correct": sum(x["correct"] for x in results), "total": len(results)}
    args.out.write_text(json.dumps({"platform": args.platform, "model": model,
                                    "summary": summary, "results": results}, indent=2))
    print(f"{summary['correct']}/{summary['total']} correct")
    for x in results:
        mark = "ok  " if x["correct"] else "FAIL"
        print(f"{mark} rate={x['load_rate']:.2f} expect={x['should_trigger']}: {x['query'][:80]}")


if __name__ == "__main__":
    main()
