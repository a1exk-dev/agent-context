// The release notes of a version: the body of its `## [X.Y.Z]` entry in
// CHANGELOG.md, or nothing when the file or the entry is missing. Used by
// the release job.

export function releaseNotes(
    changelog: string | undefined,
    version: string,
): string | undefined {
    const lines = changelog?.split("\n") ?? [];
    const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
    if (start === -1) {
        return undefined;
    }
    const body = lines.slice(start + 1);
    const end = body.findIndex((line) => line.startsWith("## "));
    return body
        .slice(0, end === -1 ? undefined : end)
        .join("\n")
        .trim();
}
