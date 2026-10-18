// Git Flow test for PRs into main. Run by the source-branch job in check.yml.

import { nextVersion } from "./release-version.ts";

export function isAllowedSource(
    headRef: string,
    headRepo: string,
    repo: string,
): boolean {
    return (
        headRepo === repo &&
        (/^release\/\d+\.\d+\.\d+$/.test(headRef) ||
            /^hotfix\/.+$/.test(headRef))
    );
}

if (import.meta.main) {
    const headRef = process.env.HEAD_REF ?? "";
    const headRepo = process.env.HEAD_REPO ?? "";
    const repo = process.env.GITHUB_REPOSITORY ?? "";
    if (!isAllowedSource(headRef, headRepo, repo)) {
        console.log(
            `::error::PRs into main must come from release/X.Y.Z or hotfix/<name> in ${repo}, got ${headRepo}:${headRef}`,
        );
        process.exitCode = 1;
    } else {
        // Fail on a bad version before the merge, not in the release job after it.
        const tags = (await Bun.$`git tag --list ${"v*"}`.text())
            .split("\n")
            .filter(Boolean);
        try {
            console.log(`${headRef} merges as v${nextVersion(headRef, tags)}`);
        } catch (error) {
            console.log(`::error::${(error as Error).message}`);
            process.exitCode = 1;
        }
    }
}
