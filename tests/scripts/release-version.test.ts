import { describe, expect, it } from "vitest";
import { nextVersion } from "../../scripts/release-version.ts";

describe("nextVersion", () => {
    it("gives the release version when no tag exists", () => {
        expect(nextVersion("release/0.1.0", [])).toBe("0.1.0");
    });

    it("fails a release equal to the latest tag", () => {
        expect(() =>
            nextVersion("release/1.2.0", ["v1.1.0", "v1.2.0"]),
        ).toThrow("release/1.2.0 must be above the latest tag v1.2.0");
    });

    it("gives the release version when it is above the latest tag", () => {
        expect(nextVersion("release/1.10.0", ["v1.9.0", "v1.2.0"])).toBe(
            "1.10.0",
        );
    });

    it("fails a release below the latest tag", () => {
        expect(() =>
            nextVersion("release/1.9.0", ["v1.10.0", "v1.2.0"]),
        ).toThrow("release/1.9.0 must be above the latest tag v1.10.0");
    });

    it("bumps the patch of the latest tag for a hotfix", () => {
        expect(nextVersion("hotfix/x", ["v1.1.0", "v1.2.0"])).toBe("1.2.1");
        expect(nextVersion("hotfix/y", ["v1.2.0", "v1.2.1"])).toBe("1.2.2");
    });

    it("fails a hotfix when no tag exists", () => {
        expect(() => nextVersion("hotfix/x", [])).toThrow(
            "No v<semver> tag on main; merge a release/X.Y.Z first",
        );
    });

    it("fails any other head ref", () => {
        for (const ref of ["feature/x", "release/1.2", "develop"]) {
            expect(() => nextVersion(ref, ["v1.2.0"])).toThrow(
                `${ref} is not a release/X.Y.Z or hotfix/<name> branch`,
            );
        }
    });
});
