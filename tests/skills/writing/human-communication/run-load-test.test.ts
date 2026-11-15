import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { LoadRequest } from "../../engineering/eval-lib.ts";
import { HERE } from "./eval-lib.ts";
import { loadSetup } from "./run-load-test.ts";

describe("the load test", () => {
    it("has the 20 requests of the eval plan, and each must load", () => {
        const requests = JSON.parse(
            readFileSync(join(HERE, "load-requests.json"), "utf8"),
        ) as LoadRequest[];
        expect(requests).toHaveLength(20);
        expect(requests.every((request) => request.should_trigger)).toBe(true);
    });

    it("adds the pointer to AGENTS.md only in the pointer configuration", () => {
        const pointer = loadSetup("pointer").steps ?? [];
        const description = loadSetup("description").steps ?? [];
        const agents = (steps: string[]) =>
            steps.filter((step) => step.includes("AGENTS.md"));
        expect(agents(description)).toEqual([]);
        expect(agents(pointer)).toHaveLength(1);
        expect(agents(pointer)[0]).toContain("references/agents-md-pointer.md");
    });

    it("refuses an unknown configuration", () => {
        expect(() => loadSetup("other")).toThrow(/description, pointer/);
    });
});
