import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { installHost, keepOutputs, readEvals } from "./eval-lib.ts";
import { PERMISSION_TOOL } from "./question-host.ts";

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

    it("copies questions.jsonl of the question host to outputs", () => {
        const root = dir("hc-run-");
        const work = join(root, "project");
        mkdirSync(join(root, "host"));
        mkdirSync(work);
        writeFileSync(join(root, "host/questions.jsonl"), '{"questions":[]}\n');
        const outputs = join(dir("hc-out-"), "outputs");

        keepOutputs(root, work, [], outputs);

        expect(readFileSync(join(outputs, "questions.jsonl"), "utf8")).toBe(
            '{"questions":[]}\n',
        );
        expect(existsSync(root)).toBe(false);
    });
});

describe("installHost", () => {
    const made: string[] = [];
    afterEach(() => {
        for (const dir of made.splice(0))
            rmSync(dir, { recursive: true, force: true });
    });

    it("writes the host, its hook, and its settings outside the project folder", () => {
        const root = mkdtempSync(join(tmpdir(), "hc-run-"));
        made.push(root);
        mkdirSync(join(root, "project"));

        const args = installHost(root, ["debug", "yes"]);

        const host = join(root, "host");
        const flag = (name: string) => args[args.indexOf(name) + 1];
        expect(flag("--permission-prompt-tool")).toBe(PERMISSION_TOOL);
        expect(flag("--settings")).toBe(join(host, "settings.json"));
        expect(flag("--mcp-config")).toBe(join(host, "mcp.json"));
        expect(
            JSON.parse(readFileSync(join(host, "answers.json"), "utf8")),
        ).toEqual(["debug", "yes"]);
        const settings = JSON.parse(
            readFileSync(join(host, "settings.json"), "utf8"),
        );
        const [entry] = settings.hooks.PreToolUse;
        expect(entry.matcher).toBe("AskUserQuestion");
        expect(entry.hooks[0].command).toContain(
            join(host, "question-host.ts"),
        );
        const mcp = JSON.parse(readFileSync(join(host, "mcp.json"), "utf8"));
        expect(mcp.mcpServers["question-host"].args).toEqual([
            join(host, "question-host.ts"),
            "mcp",
        ]);
        expect(existsSync(join(host, "question-host.ts"))).toBe(true);
        expect(readdirSync(join(root, "project"))).toEqual([]);
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

    it("gives only the tests with questions the question statements, after the common statements", () => {
        const tests = readEvals("1,12");
        const ids = (name: string) =>
            (tests.find((ev) => ev.name === name)?.assertions ?? []).map(
                (statement) => statement.id,
            );
        expect(ids("12-tabbed").slice(0, 12)).toEqual([
            "U1",
            "U2",
            "U3",
            "U4",
            "U5",
            "U6",
            "Q1",
            "Q2",
            "Q3",
            "Q4",
            "Q5",
            "Q6",
        ]);
        expect(ids("01-chat-answer").some((id) => id.startsWith("Q"))).toBe(
            false,
        );
    });
});
