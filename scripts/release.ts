// Tags and releases a merge into main. Run by the release job in release.yml.

import { appendFileSync } from "node:fs";
import { nextVersion } from "./release-version.ts";

const headRef = process.env.HEAD_REF ?? "";
const mergeSha = process.env.MERGE_SHA ?? "";
const tags = (await Bun.$`git tag --list ${"v*"}`.text())
    .split("\n")
    .filter(Boolean);
try {
    const version = nextVersion(headRef, tags);
    await Bun.$`gh release create ${`v${version}`} --target ${mergeSha} --generate-notes`;
    // The back-merge job reads the version from this job output.
    appendFileSync(process.env.GITHUB_OUTPUT ?? "", `version=${version}\n`);
} catch (error) {
    console.log(`::error::${(error as Error).message}`);
    process.exitCode = 1;
}
