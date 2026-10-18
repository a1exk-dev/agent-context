// The version that a merge into main gets. Used by the source-branch job
// before the merge and by the release job after it.

type Semver = [number, number, number];

export function nextVersion(headRef: string, tags: string[]): string {
    const latest = latestTag(tags);
    const release = /^release\/(\d+)\.(\d+)\.(\d+)$/.exec(headRef);
    if (release) {
        const version: Semver = [
            Number(release[1]),
            Number(release[2]),
            Number(release[3]),
        ];
        if (latest && compare(version, latest) <= 0) {
            throw new Error(
                `${headRef} must be above the latest tag v${latest.join(".")}`,
            );
        }
        return version.join(".");
    }
    // Hotfix branch names hold no version, so a hotfix bumps the patch.
    if (/^hotfix\/.+$/.test(headRef)) {
        if (!latest) {
            throw new Error(
                "No v<semver> tag on main; merge a release/X.Y.Z first",
            );
        }
        return [latest[0], latest[1], latest[2] + 1].join(".");
    }
    throw new Error(
        `${headRef} is not a release/X.Y.Z or hotfix/<name> branch`,
    );
}

function latestTag(tags: string[]): Semver | undefined {
    return tags
        .map((tag) => /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag))
        .filter((match) => match !== null)
        .map(
            (match): Semver => [
                Number(match[1]),
                Number(match[2]),
                Number(match[3]),
            ],
        )
        .sort(compare)
        .at(-1);
}

// Semver order: major, then minor, then patch, each as a number.
function compare(a: Semver, b: Semver): number {
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}
