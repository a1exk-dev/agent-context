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
import { checks } from "./assertions.ts";
import { readEvals } from "./eval-lib.ts";
import { GradeError, mergeStep, scriptStep } from "./grade.ts";

const STATE = { head: "main", commits: [], status: [], staged: [] };

describe("grade.ts", () => {
    let out = "";
    afterEach(() => rmSync(out, { recursive: true, force: true }));

    // Writes a run folder with one text block and the given statements.
    function runFolder(
        assertions: unknown[],
        options: { text?: string; files?: Record<string, string> } = {},
    ): string {
        out = mkdtempSync(join(tmpdir(), "hc-grade-"));
        const evalDir = join(out, "eval-01-chat-answer");
        const runDir = join(evalDir, "with_skill", "run-1");
        mkdirSync(join(runDir, "outputs"), { recursive: true });
        const events = [
            {
                type: "assistant",
                message: {
                    content: [
                        {
                            type: "tool_use",
                            name: "Skill",
                            input: { skill: "human-communication" },
                        },
                        {
                            type: "text",
                            text:
                                options.text ??
                                "The retry stops after 3 tries.",
                        },
                    ],
                },
            },
        ];
        writeFileSync(
            join(runDir, "transcript.jsonl"),
            events.map((event) => JSON.stringify(event)).join("\n"),
        );
        for (const name of ["git-before.json", "git-after.json"])
            writeFileSync(join(runDir, "outputs", name), JSON.stringify(STATE));
        for (const [path, text] of Object.entries(options.files ?? {})) {
            mkdirSync(join(runDir, "outputs", "files", path, ".."), {
                recursive: true,
            });
            writeFileSync(join(runDir, "outputs", "files", path), text);
        }
        writeFileSync(
            join(evalDir, "eval_metadata.json"),
            JSON.stringify({ assertions, expect: {} }),
        );
        return runDir;
    }
    const read = (runDir: string, name: string) =>
        JSON.parse(readFileSync(join(runDir, name), "utf8"));

    const U1 = {
        id: "U1",
        text: "loaded",
        grader: "script",
        check: "skillLoadedFirst",
    };
    const U2 = { id: "U2", text: "STE", grader: "script", check: "steText" };
    const U3 = { id: "U3", text: "active voice", grader: "llm" };

    it("grades the script statements and lists the llm statements", () => {
        const runDir = runFolder([U1, U2, U3], { text: "You should retry." });
        expect(scriptStep(runDir)).toBe(0);
        const grading = read(runDir, "script-grading.json");
        expect(
            grading.script.map((item: { id: string; passed: boolean }) => [
                item.id,
                item.passed,
            ]),
        ).toEqual([
            ["U1", true],
            ["U2", false],
        ]);
        expect(grading.llm).toEqual([
            { id: "U3", text: "active voice", grader: "llm", list: null },
        ]);
    });

    it("reads the changed files of outputs/files", () => {
        const form = {
            id: "6.1",
            text: "form",
            grader: "script",
            check: "documentForm",
            args: { path: "docs/setup.md" },
        };
        const runDir = runFolder([form], {
            files: { "docs/setup.md": "# Setup\n\n## Install\n\n- Run it.\n" },
        });
        scriptStep(runDir);
        expect(read(runDir, "script-grading.json").script[0].passed).toBe(true);
    });

    it("stops on LIMIT_HIT", () => {
        const runDir = runFolder([U1]);
        writeFileSync(join(runDir, "LIMIT_HIT"), "");
        expect(scriptStep(runDir)).toBe(1);
    });

    it("fails an llm statement only when 1 of its 2 confirmers agrees", () => {
        const runDir = runFolder([U3]);
        scriptStep(runDir);
        writeFileSync(
            join(runDir, "llm-grading.json"),
            JSON.stringify({
                statements: [
                    {
                        id: "U3",
                        checklist: [
                            { item: "active voice", answer: "no", quote: "q" },
                        ],
                    },
                ],
            }),
        );
        expect(() => mergeStep(runDir)).toThrow(GradeError);
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify({ U3: [{ agrees: false }, { agrees: false }] }),
        );
        mergeStep(runDir);
        expect(read(runDir, "grading.json").passed).toEqual(["U3"]);
        writeFileSync(
            join(runDir, "confirmers.json"),
            JSON.stringify({ U3: [{ agrees: true }, { agrees: false }] }),
        );
        mergeStep(runDir);
        expect(read(runDir, "grading.json").failed).toEqual(["U3"]);
    });
});

describe("evals.json", () => {
    it("names an existing check for each script statement", () => {
        const missing = readEvals("")
            .flatMap((ev) => ev.assertions)
            .filter((s) => s.grader === "script" && !checks[s.check ?? ""])
            .map((s) => s.id);
        expect(missing).toEqual([]);
    });
});
