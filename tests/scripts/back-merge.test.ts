import { describe, expect, it } from "vitest";
import {
    conflictError,
    mergeDecision,
    prAction,
} from "../../scripts/back-merge.ts";

describe("prAction", () => {
    it("creates a PR when no back-merge PR is open", () => {
        expect(prAction([])).toEqual({ kind: "create" });
    });

    it("updates the open back-merge PR", () => {
        expect(prAction([12])).toEqual({ kind: "update", number: 12 });
    });
});

describe("mergeDecision", () => {
    it("waits while GitHub still computes mergeability", () => {
        expect(mergeDecision("UNKNOWN", true)).toBe("wait");
    });

    it("reports a conflict and never auto-merges it", () => {
        expect(mergeDecision("CONFLICTING", true)).toBe("conflict");
        expect(mergeDecision("CONFLICTING", false)).toBe("conflict");
    });

    it("turns on auto-merge when the repo owner merged into main", () => {
        expect(mergeDecision("MERGEABLE", true)).toBe("auto-merge");
    });

    it("leaves the PR to the develop rule when someone else merged", () => {
        expect(mergeDecision("MERGEABLE", false)).toBe("leave");
    });
});

describe("conflictError", () => {
    it("gives the 4 fix steps as one workflow error annotation", () => {
        expect(conflictError("1.2.1", 12)).toBe(
            "::error::The back-merge PR #12 from main into develop has a conflict. Fix it:%0A" +
                "1. Run git fetch, then make bugfix/back-merge-v1.2.1 from origin/develop.%0A" +
                "2. Run git merge origin/main and fix the conflict.%0A" +
                "3. Open a PR into develop.%0A" +
                "4. Close the automatic PR #12.",
        );
    });
});
