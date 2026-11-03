import { describe, expect, it } from "vitest";
import { releaseNotes } from "../../scripts/release-notes.ts";

describe("releaseNotes", () => {
    it("gives the body of the entry without its heading", () => {
        const changelog = [
            "# Changelog",
            "",
            "## [1.3.0] - 2026-11-01",
            "",
            "### Added",
            "",
            "- Add the search option ([#7](https://example.com/7))",
        ].join("\n");
        expect(releaseNotes(changelog, "1.3.0")).toBe(
            [
                "### Added",
                "",
                "- Add the search option ([#7](https://example.com/7))",
            ].join("\n"),
        );
    });

    it("stops at the next level-2 heading", () => {
        const changelog = [
            "# Changelog",
            "",
            "## Unreleased",
            "",
            "- Add the export option",
            "",
            "## [1.3.0] - 2026-11-01",
            "",
            "### Fixed",
            "",
            "- Fix the search order",
            "",
            "## [1.2.0] - 2026-09-01",
            "",
            "_Initial release._",
        ].join("\n");
        expect(releaseNotes(changelog, "1.3.0")).toBe(
            ["### Fixed", "", "- Fix the search order"].join("\n"),
        );
    });

    it("gives nothing when the version has no entry", () => {
        const changelog = [
            "# Changelog",
            "",
            "## [1.2.0] - 2026-09-01",
            "",
            "_Initial release._",
        ].join("\n");
        expect(releaseNotes(changelog, "1.3.0")).toBeUndefined();
    });

    it("gives nothing when CHANGELOG.md is missing", () => {
        expect(releaseNotes(undefined, "1.3.0")).toBeUndefined();
    });
});
