#!/usr/bin/env python3
"""Run the agent-instructions output tests with `claude -p`.

Each run starts from a fresh copy of project/ in a temporary folder outside
this repository, so no CLAUDE.md or AGENTS.md of this repository loads.
`--setting-sources project,local` keeps user skills and user memory out.

Usage:
  run_evals.py --out <iteration-dir> [--ids 1,3] [--configs with_skill,without_skill]
               [--jobs 5] [--model claude-opus-5-5] [--timeout 3600]
"""

import argparse
import json
import os
import shutil
import subprocess
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
SKILL = REPO / "skills" / "writing" / "agent-instructions"
SKILL_DIR = ".claude/skills/agent-instructions"
FORCE_SKILL = "Use the agent-instructions skill for this task."
LIMIT_TEXT = "hit your session limit"


def sh(cwd, *args):
    return subprocess.run(args, cwd=cwd, check=True, capture_output=True, text=True).stdout


def prepare(ev, config):
    work = Path(tempfile.mkdtemp(prefix=f"ai-eval-{ev['id']:02d}-{config}-")) / "project"
    shutil.copytree(HERE / "project", work)
    overlay = ev["setup"].get("overlay")
    if overlay:
        shutil.copytree(HERE / overlay, work, dirs_exist_ok=True)
    for rel in ev["setup"].get("remove", []):
        (work / rel).unlink()
    if config == "with_skill":
        shutil.copytree(SKILL, work / SKILL_DIR)
    sh(work, "git", "init", "-q", "-b", "develop")
    sh(work, "git", "add", "-A")
    sh(work, "git", "-c", "user.name=eval", "-c", "user.email=eval@example.com",
       "-c", "commit.gpgsign=false", "commit", "-q", "-m", "start")
    return work, sh(work, "git", "rev-parse", "HEAD").strip()


def render(events):
    """Turn stream-json events into a readable run record."""
    lines, names = [], {}
    for e in events:
        parent = e.get("parent_tool_use_id")
        who = f"[subagent {names.get(parent, parent)}] " if parent else ""
        if e.get("type") == "assistant":
            for c in e["message"].get("content", []):
                if c.get("type") == "text" and c["text"].strip():
                    lines.append(f"{who}TEXT:\n{c['text'].strip()}\n")
                elif c.get("type") == "tool_use":
                    inp = c.get("input", {})
                    if c["name"] in ("Agent", "Task"):
                        names[c["id"]] = inp.get("description", c["id"])
                    body = json.dumps(inp, ensure_ascii=False, indent=1)
                    lines.append(f"{who}TOOL CALL {c['name']} (id {c['id']}):\n{body[:6000]}\n")
        elif e.get("type") == "user":
            content = e.get("message", {}).get("content", [])
            for c in content if isinstance(content, list) else []:
                if c.get("type") == "tool_result":
                    out = c.get("content")
                    if isinstance(out, list):
                        out = "\n".join(x.get("text", "") for x in out if isinstance(x, dict))
                    lines.append(f"{who}TOOL RESULT (for {c.get('tool_use_id')}):\n{str(out)[:4000]}\n")
        elif e.get("type") == "result":
            lines.append(f"FINAL RESULT:\n{e.get('result', '')}\n")
    return "\n".join(lines)


def run(ev, config, out_root, model, timeout):
    run_dir = out_root / f"eval-{ev['name']}" / config / "run-1"
    outputs = run_dir / "outputs"
    outputs.mkdir(parents=True, exist_ok=True)
    work, start_commit = prepare(ev, config)
    cmd = ["claude", "-p", ev["prompt"], "--output-format", "stream-json", "--verbose",
           "--setting-sources", "project,local", "--permission-mode", "bypassPermissions",
           "--model", model]
    if config == "with_skill":
        cmd += ["--append-system-prompt", FORCE_SKILL]
    if ev.get("disallowed_tools"):
        cmd += ["--disallowedTools", *ev["disallowed_tools"]]
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    start = time.time()
    try:
        proc = subprocess.run(cmd, cwd=work, env=env, capture_output=True, text=True, timeout=timeout)
        raw, err = proc.stdout, proc.stderr
    except subprocess.TimeoutExpired as exc:
        raw = exc.stdout.decode() if isinstance(exc.stdout, bytes) else (exc.stdout or "")
        err = "timeout"
    duration = time.time() - start
    (run_dir / "transcript.jsonl").write_text(raw)
    if err:
        (run_dir / "stderr.txt").write_text(err)
    events = []
    for line in raw.splitlines():
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            pass
    (run_dir / "transcript.md").write_text(render(events))
    result = next((e for e in reversed(events) if e.get("type") == "result"), {})
    (outputs / "report.md").write_text(result.get("result", ""))
    sh(work, "git", "add", "-A")
    diff = sh(work, "git", "diff", "--cached", start_commit, "--", ".", f":(exclude){SKILL_DIR}")
    (outputs / "changes.diff").write_text(diff)
    for rel in sh(work, "git", "diff", "--cached", "--name-only", start_commit, "--", ".", f":(exclude){SKILL_DIR}").split():
        src = work / rel
        if src.is_file():
            dst = outputs / "files" / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
    usage = result.get("usage", {})
    tokens = sum(usage.get(k, 0) for k in ("input_tokens", "output_tokens",
                                             "cache_read_input_tokens", "cache_creation_input_tokens"))
    (run_dir / "timing.json").write_text(json.dumps({
        "total_tokens": tokens, "duration_ms": int(duration * 1000),
        "total_duration_seconds": round(duration, 1), "cost_usd": result.get("total_cost_usd"),
        "work_dir": str(work)}, indent=2))
    (run_dir.parents[1] / "eval_metadata.json").write_text(json.dumps({
        "eval_id": ev["id"], "eval_name": ev["name"], "prompt": ev["prompt"],
        "assertions": ev["assertions"], "known_mistakes": ev.get("known_mistakes")}, indent=2))
    limit = LIMIT_TEXT in raw
    if limit:
        (run_dir / "LIMIT_HIT").write_text("The run hit the usage limit. Do not grade it.\n")
    return f"{ev['name']}/{config}: {duration:.0f}s, result={'yes' if result else 'no'}{', LIMIT HIT' if limit else ''}"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--ids", default="")
    ap.add_argument("--configs", default="with_skill,without_skill")
    ap.add_argument("--jobs", type=int, default=5)
    ap.add_argument("--model", default="claude-opus-5-5")
    ap.add_argument("--timeout", type=int, default=3600)
    args = ap.parse_args()
    evals = json.loads((HERE / "evals.json").read_text())["evals"]
    ids = {int(i) for i in args.ids.split(",") if i}
    jobs = [(ev, c) for ev in evals if not ids or ev["id"] in ids for c in args.configs.split(",")]
    with ThreadPoolExecutor(args.jobs) as pool:
        for line in pool.map(lambda j: run(*j, args.out, args.model, args.timeout), jobs):
            print(line, flush=True)


if __name__ == "__main__":
    main()
