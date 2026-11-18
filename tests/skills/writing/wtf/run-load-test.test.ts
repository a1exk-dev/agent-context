import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { requestResult, requestsFor } from "./run-load-test.ts";

describe("the load requests", () => {
    it("give each platform the plain requests and its own call form", () => {
        const calls = { claude: "/wtf", codex: "$wtf", opencode: "@wtf" };
        for (const [platform, call] of Object.entries(calls)) {
            const requests = requestsFor(platform as keyof typeof calls);
            const loads = requests.filter((r) => r.should_trigger);
            expect(loads.map((r) => r.query)).toEqual([call]);
            expect(requests.length - loads.length).toBeGreaterThanOrEqual(10);
        }
    });
});

describe("requestResult", () => {
    const plain = {
        query: "explain that again, simpler",
        should_trigger: false,
    };
    const call = { query: "/wtf", should_trigger: true };

    it("is correct only when no run of a plain request loads wtf", () => {
        expect(requestResult(plain, [false, false, false]).correct).toBe(true);
        expect(requestResult(plain, [false, true, false]).correct).toBe(false);
    });

    it("is correct only when each run of the call form loads wtf", () => {
        expect(requestResult(call, [true, true, true]).correct).toBe(true);
        expect(requestResult(call, [true, false, true]).correct).toBe(false);
    });
});

describe("the runner", () => {
    const run = (...args: string[]) =>
        spawnSync(
            "bun",
            [join(import.meta.dirname, "run-load-test.ts"), ...args],
            { encoding: "utf8" },
        );

    it("refuses more than 5 runs at the same time", () => {
        const result = run("--out", "unused.json", "--jobs", "6");
        expect(result.status).toBe(2);
        expect(result.stderr).toContain("--jobs must be 1 to 5");
    });

    it("refuses an unknown platform", () => {
        const result = run("--out", "unused.json", "--platform", "cursor");
        expect(result.status).toBe(2);
        expect(result.stderr).toContain("claude, codex, opencode");
    });
});
