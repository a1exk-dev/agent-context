import { spawnSync } from "node:child_process";
import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { scriptStatements } from "./assertions.ts";

const script = join(import.meta.dirname, "grade.ts");

type Statement = { id: string; text: string; grader: string };
type File = { path: string; before: string | null; after: string | null };

const statement = (id: string, grader = "script"): Statement => ({
    id,
    text: `Statement ${id}.`,
    grader,
});

// A sentence of 26 words, one more than the limit of the check script.
const long =
    "Run the full test suite with make test before you push a branch, and read each failure in the log before you change the code again.";

const agents = (rules: string) =>
    `# Agent rules\n\n## Before a commit\n\n${rules}\n`;

// The unified diff of one file, as `changes.diff` gives it.
function diff({ path, before, after }: File): string {
    const folder = mkdtempSync(join(tmpdir(), "grade-diff-"));
    const side = (name: string, text: string | null) => {
        const file = join(folder, name);
        writeFileSync(file, text ?? "");
        return file;
    };
    const result = spawnSync(
        "diff",
        [
            "-u",
            "--label",
            before === null ? "/dev/null" : `a/${path}`,
            "--label",
            after === null ? "/dev/null" : `b/${path}`,
            side("before", before),
            side("after", after),
        ],
        { encoding: "utf8" },
    );
    rmSync(folder, { recursive: true });
    return `diff --git a/${path} b/${path}\n${result.stdout}`;
}

// Saves a run folder of one output test, as the eval runners save it.
function runFolder(
    statements: Statement[],
    files: File[],
    options: { limitHit?: boolean } = {},
): string {
    const evalDir = join(
        mkdtempSync(join(tmpdir(), "grade-")),
        "eval-03-edit-agents-md",
    );
    const runDir = join(evalDir, "with_skill", "run-1");
    const outputs = join(runDir, "outputs");
    mkdirSync(join(outputs, "files"), { recursive: true });
    writeFileSync(
        join(evalDir, "eval_metadata.json"),
        JSON.stringify({
            eval_id: 3,
            eval_name: "03-edit-agents-md",
            prompt: "Add a rule to AGENTS.md.",
            setup: { overlay: null, remove: [] },
            assertions: statements,
            known_mistakes: null,
        }),
    );
    writeFileSync(join(outputs, "changes.diff"), files.map(diff).join(""));
    for (const file of files) {
        if (file.after === null) continue;
        const path = join(outputs, "files", file.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, file.after);
    }
    writeFileSync(join(outputs, "report.md"), "Done.\n");
    writeFileSync(join(runDir, "transcript.jsonl"), "");
    if (options.limitHit) writeFileSync(join(runDir, "LIMIT_HIT"), "");
    return runDir;
}

function grade(step: "script" | "merge", runDir: string) {
    const result = spawnSync(process.execPath, [script, step, runDir], {
        encoding: "utf8",
    });
    return {
        code: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

describe("grade script, script step", () => {
    it("grades no statement of a run that hit the usage limit", () => {
        const runDir = runFolder(
            [statement("7")],
            [{ path: "AGENTS.md", before: null, after: agents(long) }],
            { limitHit: true },
        );
        const result = grade("script", runDir);
        expect(result.code).toBe(1);
        expect(result.stderr).toMatch(/LIMIT_HIT/);
        expect(readJson(join(runDir, "script-grading.json"))).toEqual({
            status: "LIMIT_HIT",
        });
    });

    it("fails statement 7 for a 26-word sentence on an added line", () => {
        const runDir = runFolder(
            [statement("7")],
            [
                {
                    path: "AGENTS.md",
                    before: agents("Use pnpm."),
                    after: agents(`Use pnpm.\n\n${long}`),
                },
            ],
        );
        expect(grade("script", runDir).code).toBe(0);
        const grading = readJson(join(runDir, "script-grading.json"));
        expect(grading.status).toBe("graded");
        expect(grading.script).toEqual([
            {
                id: "7",
                text: "Statement 7.",
                passed: false,
                evidence: expect.stringContaining(
                    `AGENTS.md:7: The sentence has 26 words. "${long}"`,
                ),
            },
        ]);
    });

    it("passes statement 7 when the 26-word sentence is on an unchanged line", () => {
        const runDir = runFolder(
            [statement("7")],
            [
                {
                    path: "AGENTS.md",
                    before: agents(long),
                    after: agents(`${long}\n\nUse pnpm.`),
                },
            ],
        );
        expect(grade("script", runDir).code).toBe(0);
        const grading = readJson(join(runDir, "script-grading.json"));
        expect(grading.script).toEqual([
            {
                id: "7",
                text: "Statement 7.",
                passed: true,
                evidence: "No sentence over 25 words on an added line.",
            },
        ]);
    });
});

describe("grade script, merge step", () => {
    const statements = [
        statement("7"),
        statement("3.1", "llm"),
        statement("4.1", "llm"),
        statement("8b", "advisory"),
    ];
    const files = [
        {
            path: "AGENTS.md",
            before: agents("Use pnpm."),
            after: agents("Use pnpm.\n\nRun `make test`."),
        },
    ];
    const yes = { item: "Item", answer: "yes", quote: "Use pnpm." };
    const no = { item: "Item", answer: "no", quote: "Run `make test`." };

    function merged(confirmers: Record<string, { agrees: boolean }[]>) {
        const runDir = runFolder(statements, files);
        grade("script", runDir);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({
                statements: [
                    { id: "3.1", checklist: [yes, no] },
                    { id: "4.1", checklist: [yes] },
                    { id: "8b", checklist: [no] },
                ],
            }),
        );
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify(confirmers),
        );
        const result = grade("merge", runDir);
        return { ...result, runDir };
    }

    it("shows an advisory statement but leaves it out of the pass count", () => {
        const result = merged({
            "3.1": [{ agrees: true }, { agrees: false }],
        });
        expect(result.code).toBe(0);
        const grading = readJson(join(result.runDir, "grading.json"));
        expect(grading.passed).toEqual(["7", "4.1"]);
        expect(grading.failed).toEqual(["3.1"]);
        expect(grading.advisory).toEqual(["8b"]);
        expect(
            grading.expectations.find(
                (item: { id: string }) => item.id === "8b",
            ),
        ).toEqual({
            id: "8b",
            text: "Statement 8b.",
            grader: "advisory",
            passed: false,
            evidence: 'no: Item "Run `make test`."',
        });
        expect(grading.summary).toEqual({
            passed: 2,
            failed: 1,
            total: 3,
            pass_rate: 2 / 3,
        });
    });

    it("passes a failed LLM statement when no confirmer agrees", () => {
        const result = merged({
            "3.1": [{ agrees: false }, { agrees: false }],
        });
        const grading = readJson(join(result.runDir, "grading.json"));
        expect(grading.failed).toEqual([]);
        expect(grading.summary.passed).toBe(3);
    });

    it("stops when a failed LLM statement has no confirmer answers", () => {
        const result = merged({});
        expect(result.code).toBe(2);
        expect(result.stderr).toMatch(/3\.1/);
    });
});

describe("script statements", () => {
    it("has one function for each script statement id in evals.json", () => {
        const evals: { assertions: Statement[] }[] = readJson(
            join(import.meta.dirname, "evals.json"),
        ).evals;
        const ids = new Set(
            evals.flatMap((ev) =>
                ev.assertions
                    .filter((item) => item.grader === "script")
                    .map((item) => item.id),
            ),
        );
        expect(Object.keys(scriptStatements).toSorted()).toEqual(
            [...ids].toSorted(),
        );
    });
});
