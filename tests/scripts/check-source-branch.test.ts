import { describe, expect, it } from "vitest";
import { isAllowedSource } from "../../scripts/check-source-branch.ts";

const repo = "a1exk-dev/agent-context";

describe("isAllowedSource", () => {
    it("passes a release/X.Y.Z branch from this repo", () => {
        expect(isAllowedSource("release/1.2.0", repo, repo)).toBe(true);
    });

    it("passes a hotfix/<name> branch from this repo", () => {
        expect(isAllowedSource("hotfix/x", repo, repo)).toBe(true);
    });

    it("fails a release branch without a full X.Y.Z version", () => {
        expect(isAllowedSource("release/1.2", repo, repo)).toBe(false);
    });

    it("fails a feature branch", () => {
        expect(isAllowedSource("feature/x", repo, repo)).toBe(false);
    });

    it("fails a release branch from a fork", () => {
        expect(
            isAllowedSource("release/1.2.0", "someone/agent-context", repo),
        ).toBe(false);
    });
});
