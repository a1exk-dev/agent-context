#!/usr/bin/env python3
"""Run the same output tests on OpenCode and export all reviewer/reader sessions.

Usage: run_opencode_evals.py --out <iteration-dir> [--ids 1,3] [--jobs 5]
Each eval runs its reviewers and readers sequentially. Run graders separately.
"""

import argparse
import json
import os
import shutil
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from run_evals import FORCE_SKILL, HERE, SKILL_DIR, prepare, sh


def environment(model, no_subagents=False, force_skill=True):
    config = {
        "$schema": "https://opencode.ai/config.json",
        "model": model,
        "share": "disabled",
        "instructions": [],
        "skills": {"paths": [SKILL_DIR]},
        "permission": {"*": "allow", "task": "deny" if no_subagents else "allow"},
        "agent": {
            "build": {"prompt": FORCE_SKILL if force_skill else ""},
            "general": {"model": model},
            "explore": {"model": model},
        },
    }
    return {
        **os.environ,
        "OPENCODE_DISABLE_EXTERNAL_SKILLS": "1",
        "OPENCODE_DISABLE_CLAUDE_CODE_SKILLS": "1",
        "OPENCODE_CONFIG_CONTENT": json.dumps(config),
    }


def export_session(session_id, run_dir, work, seen, who=""):
    """Render visible text and tools, including child tools, without truncation."""
    if session_id in seen:
        return [], 0
    seen.add(session_id)
    export = run_dir / "sessions" / f"{session_id}.json"
    # OpenCode can truncate large exports on a pipe. Write straight to a file.
    with export.open("w") as stdout:
        subprocess.run(["opencode", "export", session_id], cwd=work,
                       stdout=stdout, stderr=subprocess.PIPE, check=True)
    raw = export.read_text()
    session = json.loads(raw)
    if Path(session["info"]["directory"]).resolve() != work.resolve():
        raise RuntimeError(f"Wrong project folder in session {session_id}")
    messages = [m for m in session["messages"] if m["info"]["role"] == "assistant"]
    errors = [m["info"]["error"] for m in messages if m["info"].get("error")]
    if errors or not messages or messages[-1]["info"].get("finish") != "stop":
        raise RuntimeError(f"Incomplete session {session_id}: {errors}")
    lines = []
    usage = session["info"].get("tokens", {})
    tokens = usage.get("input", 0) + usage.get("output", 0)
    tokens += sum(usage.get("cache", {}).values())
    for message in session["messages"]:
        if message["info"]["role"] != "assistant":
            continue
        for part in message["parts"]:
            if part["type"] == "text":
                lines.append(f"{who}TEXT:\n{part['text']}\n")
            elif part["type"] == "tool":
                state = part["state"]
                name = "Task" if part["tool"] == "task" else part["tool"]
                inp = state.get("input", {})
                lines.append(f"{who}TOOL CALL {name} (id {part['callID']}):\n"
                             + json.dumps(inp, ensure_ascii=False, indent=2) + "\n")
                child = state.get("metadata", {}).get("sessionId")
                if part["tool"] == "task" and child:
                    child_lines, child_tokens = export_session(
                        child, run_dir, work, seen,
                        f"[subagent {inp.get('description', child)}] ")
                    lines.extend(child_lines)
                    tokens += child_tokens
                lines.append(f"{who}TOOL RESULT (for {part['callID']}):\n"
                             f"{state.get('output', state.get('error', ''))}\n")
    return lines, tokens


def run(ev, out, model, timeout):
    run_dir = out / f"eval-{ev['name']}" / "with_skill" / "run-1"
    outputs = run_dir / "outputs"
    outputs.mkdir(parents=True)
    (run_dir / "sessions").mkdir()
    work, start_commit = prepare(ev, "with_skill")
    (run_dir / "setup.json").write_text(json.dumps({
        "work_dir": str(work), "start_commit": start_commit, "model": model,
    }, indent=2))
    env = environment(model, bool(ev.get("disallowed_tools")))
    env["PWD"] = str(work)
    cmd = ["opencode", "run", "--pure", "--dir", str(work),
           "--model", model, "--format", "json", ev["prompt"]]
    start = time.time()
    try:
        with (run_dir / "transcript.jsonl").open("w") as stdout, \
                (run_dir / "stderr.txt").open("w") as stderr:
            proc = subprocess.run(cmd, cwd=work, env=env, stdout=stdout, stderr=stderr, timeout=timeout)
    except subprocess.TimeoutExpired:
        (run_dir / "INCOMPLETE").write_text("Run timed out. Do not grade.\n")
        return f"{ev['name']}: INCOMPLETE (timeout)"
    duration = time.time() - start
    return collect(ev, out, model, duration, work, start_commit, proc.returncode)


def collect(ev, out, model, duration, work, start_commit, returncode=0):
    run_dir = out / f"eval-{ev['name']}" / "with_skill" / "run-1"
    outputs = run_dir / "outputs"
    raw = (run_dir / "transcript.jsonl").read_text()
    events = [json.loads(line) for line in raw.splitlines() if line.startswith("{")]
    session_id = next((e.get("sessionID") for e in events if e.get("sessionID")), None)
    complete = any(e.get("type") == "step_finish" and e["part"].get("reason") == "stop"
                   for e in events)
    if returncode or not session_id or not complete:
        (run_dir / "INCOMPLETE").write_text("Run did not finish. Do not grade.\n")
        return f"{ev['name']}: INCOMPLETE (exit {returncode})"
    try:
        lines, tokens = export_session(session_id, run_dir, work, set())
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        (run_dir / "INCOMPLETE").write_text(f"{exc}\nDo not grade.\n")
        return f"{ev['name']}: INCOMPLETE ({exc})"
    (run_dir / "transcript.md").write_text("\n".join(lines))
    report = next((e["part"]["text"] for e in reversed(events) if e.get("type") == "text"), "")
    (outputs / "report.md").write_text(report)
    sh(work, "git", "add", "-A")
    args = ["--cached", start_commit, "--", ".", f":(exclude){SKILL_DIR}"]
    (outputs / "changes.diff").write_text(sh(work, "git", "diff", *args))
    for rel in sh(work, "git", "diff", "--name-only", *args).splitlines():
        src = work / rel
        if src.is_file():
            dst = outputs / "files" / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
    (run_dir / "timing.json").write_text(json.dumps({
        "total_tokens": tokens, "duration_ms": int(duration * 1000),
        "total_duration_seconds": round(duration, 1), "work_dir": str(work),
        "platform": "OpenCode", "model": model, "session_id": session_id,
    }, indent=2))
    (run_dir.parents[1] / "eval_metadata.json").write_text(json.dumps({
        "eval_id": ev["id"], "eval_name": ev["name"], "prompt": ev["prompt"],
        "assertions": ev["assertions"], "known_mistakes": ev.get("known_mistakes"),
    }, indent=2))
    return f"{ev['name']}/with_skill: {duration:.0f}s, model={model}, complete"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--ids", default="")
    ap.add_argument("--jobs", type=int, choices=range(1, 6), default=5)
    ap.add_argument("--model", default="openai/gpt-6-astra")
    ap.add_argument("--timeout", type=int, default=3600)
    args = ap.parse_args()
    ids = {int(i) for i in args.ids.split(",") if i}
    evals = json.loads((HERE / "evals.json").read_text())["evals"]
    evals = [ev for ev in evals if not ids or ev["id"] in ids]
    with ThreadPoolExecutor(args.jobs) as pool:
        for result in pool.map(lambda ev: run(ev, args.out, args.model, args.timeout), evals):
            print(result, flush=True)


if __name__ == "__main__":
    main()
