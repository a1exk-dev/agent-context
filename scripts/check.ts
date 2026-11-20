// Repo checks for Skills, Rules, and Agent instructions. Run with
// `bun run check:repo`. scripts/check-allow-list.json gives the permitted hits
// of the agent-instructions check script.

import { Buffer } from "node:buffer";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, readlinkSync } from "node:fs";
import { join, relative } from "node:path";

export type RepoFile = { path: string; text: string };
export type Finding = { level: "error" | "warning"; message: string };
export type ParseYaml = (text: string) => unknown;

export function checkRepo(files: RepoFile[], parseYaml: ParseYaml): Finding[] {
    const findings: Finding[] = [];
    const error = (message: string) =>
        findings.push({ level: "error", message });
    const warning = (message: string) =>
        findings.push({ level: "warning", message });
    const names: string[] = [];

    for (const file of files) {
        const parts = file.path.split("/");
        if (parts[0] === "rules" && file.path.endsWith(".md")) {
            // Rules load into every session, so keep each one small.
            const size = Buffer.byteLength(file.text);
            if (size > 3072) error(`${file.path}: ${size} bytes (max 3072)`);
            else if (size > 2048)
                warning(`${file.path}: ${size} bytes (aim for 2048)`);
            continue;
        }
        if (parts[0] !== "skills" || parts.at(-1) !== "SKILL.md") continue;
        if (parts.length === 3) {
            // Category folders hold Skills, they are not Skills themselves.
            error(`${file.path}: category folders must not contain SKILL.md`);
            continue;
        }
        if (parts.length !== 4) continue;

        const folder = parts[2];
        const lines = file.text.split(/\r?\n/);
        const end = lines.indexOf("---", 1);
        if (lines[0] !== "---" || end === -1) {
            error(`${file.path}: missing frontmatter`);
            continue;
        }
        const frontmatter = parseMapping(
            lines.slice(1, end).join("\n"),
            parseYaml,
        );
        if (!frontmatter) {
            error(`${file.path}: invalid frontmatter YAML`);
            continue;
        }
        const name = frontmatter.name;
        if (typeof name === "string") names.push(name);
        if (name !== folder) {
            error(
                `${file.path}: name '${name}' does not match folder '${folder}'`,
            );
        }
        if (
            typeof name !== "string" ||
            !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) ||
            name.length > 64
        ) {
            error(`${file.path}: invalid name '${name}'`);
        }
        const description = frontmatter.description;
        if (
            typeof description !== "string" ||
            description.length < 1 ||
            description.length > 1024
        ) {
            error(`${file.path}: description must be 1-1024 characters`);
        }
        // About 5,000 tokens: Claude Code keeps only that much of a Skill after compaction.
        const size = Buffer.byteLength(file.text);
        if (size > 20000) {
            error(
                `${file.path}: ${size} bytes (max 20000), move detail into references/`,
            );
        }
    }

    const dupes = [
        ...new Set(names.filter((name, i) => names.indexOf(name) !== i)),
    ];
    if (dupes.length > 0)
        error(`duplicate skill names: ${dupes.sort().join(", ")}`);
    return findings;
}

// Each Skill has agents/openai.yaml, the Codex metadata file. The fields and
// limits follow the openai_yaml.md reference of the OpenAI skill-creator Skill.
export function checkOpenaiYaml(
    files: RepoFile[],
    parseYaml: ParseYaml,
): Finding[] {
    const findings: Finding[] = [];
    const error = (path: string, problem: string) =>
        findings.push({ level: "error", message: `${path}: ${problem}` });
    const paths = new Map(files.map((file) => [file.path, file.text]));

    for (const file of files) {
        const parts = file.path.split("/");
        if (parts[0] !== "skills" || parts.length !== 4) continue;
        if (parts[3] !== "SKILL.md") continue;
        const name = parts[2];
        const path = `skills/${parts[1]}/${name}/agents/openai.yaml`;
        const text = paths.get(path);
        if (text === undefined) {
            error(path, "missing, each Skill needs agents/openai.yaml");
            continue;
        }
        const yaml = parseMapping(text, parseYaml);
        if (!yaml) {
            error(path, "invalid YAML");
            continue;
        }
        const ui = (yaml.interface ?? {}) as Record<string, unknown>;
        const policy = (yaml.policy ?? {}) as Record<string, unknown>;
        if (typeof ui.display_name !== "string" || ui.display_name === "")
            error(path, "interface.display_name must be a string");
        const short = ui.short_description;
        if (typeof short !== "string" || short.length < 25 || short.length > 64)
            error(path, "interface.short_description must be 25-64 characters");
        const prompt = ui.default_prompt;
        if (typeof prompt !== "string" || !prompt.includes(`$${name}`))
            error(path, `interface.default_prompt must mention $${name}`);
        if (typeof policy.allow_implicit_invocation !== "boolean")
            error(
                path,
                "policy.allow_implicit_invocation must be true or false",
            );
    }
    return findings;
}

// Each Skill has a symbolic link in .claude/skills/ for Claude Code and in
// .agents/skills/ for Codex and OpenCode, so agents in this repo load it.
// readLink gives the target of a symbolic link, or undefined when the path
// is not a symbolic link.
export function checkSkillLinks(
    files: RepoFile[],
    readLink: (path: string) => string | undefined,
): Finding[] {
    const findings: Finding[] = [];
    for (const file of files) {
        const parts = file.path.split("/");
        if (parts[0] !== "skills" || parts.length !== 4) continue;
        if (parts[3] !== "SKILL.md") continue;
        const target = `../../skills/${parts[1]}/${parts[2]}`;
        for (const folder of [".claude/skills", ".agents/skills"]) {
            const path = `${folder}/${parts[2]}`;
            if (readLink(path) !== target)
                findings.push({
                    level: "error",
                    message: `${path}: must be a symbolic link to ${target}`,
                });
        }
    }
    return findings;
}

function readLinkTarget(path: string): string | undefined {
    try {
        return readlinkSync(path);
    } catch {
        return undefined;
    }
}

// The Docker image and CI must run the same Bun, so both pins must match.
export function checkBunPin(
    packageJson: string,
    dockerfile: string,
): Finding[] {
    const pin = (JSON.parse(packageJson) as { packageManager?: unknown })
        .packageManager;
    const tag = /^FROM\s+oven\/bun:(\S+)/m.exec(dockerfile)?.[1];
    if (pin === `bun@${tag}`) return [];
    return [
        {
            level: "error",
            message: `Dockerfile: oven/bun tag '${tag}' differs from packageManager '${pin}' in package.json`,
        },
    ];
}

// The check script of the agent-instructions Skill. The repo obeys the rules
// that this Skill ships.
const instructionScript = join(
    import.meta.dirname,
    "../skills/writing/agent-instructions/scripts/check.ts",
);

// One permitted hit of the check script. The repo check ignores each finding
// with the same path, rule, and text. `rule` is the rule number, or the
// heading of the rule section when the rule has no number.
export type AllowedHit = {
    path: string;
    rule: string;
    text: string;
    cause: string;
};

type InstructionFinding = {
    rule: string | null;
    heading: string;
    text: string;
    path: string;
    line: number;
    problem: string;
};

// Runs the check script on the Agent instructions of the project in `root`.
// Repo files use the GLOSSARY.md of the project. Shipped files run in other
// projects, so they use no glossary. Third-party Skills in .claude/skills/ are
// not checked. The check script runs on the runtime of this process, so
// `bun run check` runs it on Bun.
export function checkInstructions(
    root: string,
    allowList: AllowedHit[],
): Finding[] {
    const glossary = existsSync(join(root, "GLOSSARY.md"))
        ? "GLOSSARY.md"
        : "none";
    const repoFiles = [
        ...["AGENTS.md", "CLAUDE.md", "GLOSSARY.md", "MEMORY.md"].filter(
            (path) => existsSync(join(root, path)),
        ),
        ...markdownFiles(root, "docs/agents"),
    ];
    const shippedFiles = [
        ...markdownFiles(root, "skills"),
        ...markdownFiles(root, "rules"),
    ];
    return [
        ...runInstructionScript(root, repoFiles, glossary),
        ...runInstructionScript(root, shippedFiles, "none"),
    ]
        .map((finding) => ({
            ...finding,
            rule: finding.rule ?? finding.heading,
        }))
        .filter(
            (finding) =>
                !allowList.some(
                    (hit) =>
                        hit.path === finding.path &&
                        hit.rule === finding.rule &&
                        hit.text === finding.text,
                ),
        )
        .map((finding) => ({
            level: "error",
            message: `${finding.path}:${finding.line}: ${finding.problem} [${finding.rule}] "${finding.text}"`,
        }));
}

function runInstructionScript(
    root: string,
    files: string[],
    glossary: string,
): InstructionFinding[] {
    if (files.length === 0) return [];
    const run = spawnSync(
        process.execPath,
        [instructionScript, ...files, "--project", ".", "--glossary", glossary],
        { cwd: root, encoding: "utf8" },
    );
    if (run.status !== 0 && run.status !== 1)
        throw new Error(`The check script did not run: ${run.stderr}`);
    return (JSON.parse(run.stdout) as { findings: InstructionFinding[] })
        .findings;
}

// Gives the path of each Markdown file under `folder`, relative to `root`.
function markdownFiles(root: string, folder: string): string[] {
    if (!existsSync(join(root, folder))) return [];
    return readdirSync(join(root, folder), {
        recursive: true,
        withFileTypes: true,
    })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => relative(root, join(entry.parentPath, entry.name)))
        .sort();
}

function parseMapping(
    text: string,
    parseYaml: ParseYaml,
): Record<string, unknown> | undefined {
    let value: unknown;
    try {
        value = parseYaml(text);
    } catch {
        return undefined;
    }
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return undefined;
    return value as Record<string, unknown>;
}

function readRepoFiles(): RepoFile[] {
    return ["skills", "rules"].flatMap((root) =>
        readdirSync(root, { recursive: true, withFileTypes: true })
            .filter(
                (entry) =>
                    entry.isFile() &&
                    (entry.name.endsWith(".md") ||
                        entry.name === "openai.yaml"),
            )
            .map((entry) => join(entry.parentPath, entry.name))
            .sort()
            .map((path) => ({ path, text: readFileSync(path, "utf8") })),
    );
}

if (import.meta.main) {
    process.chdir(join(import.meta.dir, ".."));
    const repoFiles = readRepoFiles();
    const findings = [
        ...checkRepo(repoFiles, Bun.YAML.parse),
        ...checkOpenaiYaml(repoFiles, Bun.YAML.parse),
        ...checkSkillLinks(repoFiles, readLinkTarget),
        ...checkBunPin(
            readFileSync("package.json", "utf8"),
            readFileSync("Dockerfile", "utf8"),
        ),
        ...checkInstructions(
            ".",
            JSON.parse(
                readFileSync("scripts/check-allow-list.json", "utf8"),
            ) as AllowedHit[],
        ),
    ];
    for (const { level, message } of findings)
        console.error(`${level}: ${message}`);
    process.exit(findings.some((finding) => finding.level === "error") ? 1 : 0);
}
