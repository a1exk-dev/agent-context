import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { keepOutputs, readEvals } from "./eval-lib.ts";

describe("keepOutputs", () => {
    const made: string[] = [];
    afterEach(() => {
        for (const dir of made.splice(0))
            rmSync(dir, { recursive: true, force: true });
    });
    const dir = (prefix: string) => {
        const path = mkdtempSync(join(tmpdir(), prefix));
        made.push(path);
        return path;
    };

    it("copies each changed file to outputs/files and deletes the run folder", () => {
        const root = dir("hc-run-");
        const work = join(root, "project");
        mkdirSync(join(work, "docs"), { recursive: true });
        writeFileSync(join(work, "docs/setup.md"), "# Setup\n");
        writeFileSync(join(work, "README.md"), "# Readme\n");
        const outputs = join(dir("hc-out-"), "outputs");

        const files = keepOutputs(
            root,
            work,
            ["docs/setup.md", "deleted.md"],
            outputs,
        );

        expect(files).toEqual({ "docs/setup.md": "# Setup\n" });
        expect(readFileSync(join(outputs, "files/docs/setup.md"), "utf8")).toBe(
            "# Setup\n",
        );
        expect(existsSync(join(outputs, "files/README.md"))).toBe(false);
        expect(existsSync(root)).toBe(false);
    });
});

describe("readEvals", () => {
    it("gives each test the common statements, without the statements it skips", () => {
        const tests = readEvals("");
        const german = tests.find((ev) => ev.name === "08-other-language");
        const chat = tests.find((ev) => ev.name === "01-chat-answer");
        const ids = (ev: typeof chat) =>
            (ev?.assertions ?? []).map((statement) => statement.id);
        expect(ids(chat).slice(0, 6)).toEqual([
            "U1",
            "U2",
            "U3",
            "U4",
            "U5",
            "U6",
        ]);
        expect(ids(german)).not.toContain("U2");
        expect(ids(german)).toContain("U3");
    });
});
