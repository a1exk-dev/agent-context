import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checks } from "./assertions.ts";
import { HERE, readEvals, readMessages } from "./eval-lib.ts";

describe("evals.json", () => {
    const evals = readEvals("");

    it("holds the 8 tests of the spec with their calls", () => {
        expect(evals.map((ev) => [ev.id, ev.call])).toEqual([
            [1, "/wtf"],
            [2, "/wtf"],
            [3, "/wtf"],
            [4, "/wtf"],
            [5, "/wtf Q2"],
            [6, "/wtf"],
            [7, "/wtf the first message, about the 0.4.0 release"],
            [8, "/wtf only shorter"],
        ]);
    });

    it("gives each test a message and a fact list", () => {
        for (const ev of evals) {
            expect(readMessages(ev).every((text) => text.trim())).toBe(true);
            expect(ev.facts.length).toBeGreaterThan(0);
        }
    });

    it("gives test 7 two messages in the session", () => {
        expect(readEvals("7")[0]?.messages).toHaveLength(2);
    });

    it("gives test 8 only the single-method statement of the spec", () => {
        const own = readEvals("8")[0]?.assertions.filter(
            (s) => !s.id.startsWith("W"),
        );
        expect(own?.map((s) => [s.id, s.grader])).toEqual([["8.1", "llm"]]);
    });

    it("names only script checks that exist", () => {
        for (const ev of evals)
            for (const statement of ev.assertions)
                if (statement.grader === "script")
                    expect(checks).toHaveProperty(statement.check ?? "");
    });

    it("gives each test the 3 script and 6 llm statements of the spec", () => {
        for (const ev of evals) {
            const common = ev.assertions.filter((s) => s.id.startsWith("W"));
            expect(common.map((s) => s.grader)).toEqual([
                ...Array(3).fill("script"),
                ...Array(6).fill("llm"),
            ]);
        }
    });
});

describe("grader.md", () => {
    it("holds the text of each llm statement", () => {
        const grader = readFileSync(join(HERE, "grader.md"), "utf8");
        for (const statement of readEvals("").flatMap((ev) => ev.assertions))
            if (statement.grader === "llm")
                expect(grader).toContain(statement.text);
    });
});
