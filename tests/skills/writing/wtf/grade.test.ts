import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { GradeError, mergeStep, scriptStep } from "./grade.ts";

const STATE = { head: "main", commits: [], status: [], staged: [] };
const MESSAGE = "Round 1 is at group 7 of 14.";
const W1 = {
    id: "W1",
    text: 'The rewrite has no "What I changed" note.',
    grader: "script",
    check: "noChangeNote",
};
const W3 = {
    id: "W3",
    text: "The run changes no file.",
    grader: "script",
    check: "noChangedFile",
};
const W9 = {
    id: "W9",
    text: "The rewrite is clearer than the original.",
    grader: "llm",
};

const transcript = (text: string) =>
    JSON.stringify({
        type: "assistant",
        message: { content: [{ type: "text", text }] },
    });

describe("grade.ts", () => {
    let out = "";
    afterEach(() => rmSync(out, { recursive: true, force: true }));

    // Writes a run folder with one copy turn and the turn of the call.
    function runFolder(
        options: { copy?: string; rewrite?: string; after?: unknown } = {},
    ): string {
        out = mkdtempSync(join(tmpdir(), "wtf-grade-"));
        const evalDir = join(out, "eval-01-review-status");
        const runDir = join(evalDir, "with_skill", "run-1");
        mkdirSync(join(runDir, "copy-1", "outputs"), { recursive: true });
        mkdirSync(join(runDir, "outputs"), { recursive: true });
        writeFileSync(
            join(runDir, "copy-1", "outputs", "report.md"),
            options.copy ?? MESSAGE,
        );
        writeFileSync(
            join(runDir, "transcript.jsonl"),
            transcript(options.rewrite ?? "Review round 1: file 7 of 14."),
        );
        writeFileSync(
            join(runDir, "outputs", "git-before.json"),
            JSON.stringify(STATE),
        );
        writeFileSync(
            join(runDir, "outputs", "git-after.json"),
            JSON.stringify(options.after ?? STATE),
        );
        writeFileSync(
            join(evalDir, "eval_metadata.json"),
            JSON.stringify({ messages: [MESSAGE], assertions: [W1, W3, W9] }),
        );
        return runDir;
    }
    const read = (runDir: string, name: string) =>
        JSON.parse(readFileSync(join(runDir, name), "utf8"));

    it("grades the script statements and lists the llm statements", () => {
        const runDir = runFolder({
            rewrite: "The rewrite.\n\n*What I changed: shorter text.*",
        });
        expect(scriptStep(runDir)).toBe(0);
        const grading = read(runDir, "script-grading.json");
        expect(grading.status).toBe("graded");
        expect(
            grading.script.map((s: { id: string; passed: boolean }) => [
                s.id,
                s.passed,
            ]),
        ).toEqual([
            ["W1", false],
            ["W3", true],
        ]);
        expect(grading.llm).toEqual([{ ...W9, list: null }]);
    });

    it("saves the word counts of the messages and the rewrite", () => {
        const runDir = runFolder({ rewrite: "Round 1: file 7." });
        scriptStep(runDir);
        expect(read(runDir, "script-grading.json").words).toEqual({
            messages: [8],
            rewrite: 4,
        });
    });

    it("does not count a run whose copy turn changed the message", () => {
        const runDir = runFolder({ copy: "Round 1 is at file 7 of 14." });
        expect(scriptStep(runDir)).toBe(1);
        expect(read(runDir, "script-grading.json")).toEqual({
            status: "COPY_CHANGED",
            problems: ["Turn 1 changed the message: 'group' became 'file'."],
        });
    });

    it("does not grade a run with LIMIT_HIT in a copy turn", () => {
        const runDir = runFolder();
        writeFileSync(join(runDir, "copy-1", "LIMIT_HIT"), "");
        expect(scriptStep(runDir)).toBe(1);
        expect(read(runDir, "script-grading.json")).toEqual({
            status: "LIMIT_HIT",
        });
    });

    it("fails an llm statement when 1 of 2 confirmers agrees", () => {
        const runDir = runFolder();
        scriptStep(runDir);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({
                statements: [
                    {
                        id: "W9",
                        checklist: [
                            { item: "clearer", answer: "no", quote: "x" },
                        ],
                    },
                ],
            }),
        );
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify({ W9: [{ agrees: true }, { agrees: false }] }),
        );
        mergeStep(runDir);
        expect(read(runDir, "grading.json").failed).toEqual(["W9"]);
    });

    it("refuses to merge a run that does not count", () => {
        const runDir = runFolder({ copy: "Other text." });
        scriptStep(runDir);
        expect(() => mergeStep(runDir)).toThrow(GradeError);
    });
});
