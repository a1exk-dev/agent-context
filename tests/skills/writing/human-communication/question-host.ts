// The question host of the human-communication output tests. `claude -p`
// offers AskUserQuestion only when the run has a permission host
// (docs/research/question-tools.md, section 1). The runner copies this file
// alone into the host folder of the temporary run folder, next to
// answers.json, so it imports only `node:` built-ins. It has 2 entry points:
//
//   bun question-host.ts hook <host-dir>   PreToolUse hook on AskUserQuestion
//   bun question-host.ts mcp               stdio MCP server for
//                                          --permission-prompt-tool
//
// The hook saves each call input to <host-dir>/questions.jsonl and answers
// each question with the next answer of <host-dir>/answers.json. The MCP
// tool `prompt` allows each tool call with its input unchanged, so the
// answers of the hook stay in the input.

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";

type Question = { question?: string; options?: { label?: string }[] };
type CallInput = { questions?: Question[] } & Record<string, unknown>;

export const SERVER = "question-host";
export const TOOL = "prompt";
// The value of --permission-prompt-tool.
export const PERMISSION_TOOL = `mcp__${SERVER}__${TOOL}`;

function savedCalls(path: string): CallInput[] {
    if (!existsSync(path)) return [];
    return readFileSync(path, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as CallInput);
}

// Reads the stdin text of the PreToolUse hook, saves the call input, and
// gives the stdout text that allows the call with its answers. The answers
// go to the questions in order, over all calls of the run. When the list has
// no answer left, a question gets the label of its first option.
export function answerHook(stdin: string, dir: string): string {
    const event = JSON.parse(stdin) as { tool_input?: CallInput };
    const input = event.tool_input ?? {};
    const log = join(dir, "questions.jsonl");
    const answers = JSON.parse(
        readFileSync(join(dir, "answers.json"), "utf8"),
    ) as string[];
    let used = savedCalls(log).reduce(
        (sum, call) => sum + (call.questions?.length ?? 0),
        0,
    );
    appendFileSync(log, `${JSON.stringify(input)}\n`);
    const given: Record<string, string> = {};
    for (const item of input.questions ?? []) {
        given[item.question ?? ""] =
            answers[used] ?? item.options?.[0]?.label ?? "";
        used++;
    }
    return JSON.stringify({
        hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "allow",
            updatedInput: { ...input, answers: given },
        },
    });
}

// A JSON-RPC message of the MCP client. `arguments` of `tools/call` hold
// the tool name, the input, and the tool use id of the call to allow.
type Request = {
    jsonrpc?: string;
    id?: number | string;
    method?: string;
    params?: { name?: string; arguments?: Record<string, unknown> };
};

// Gives the JSON-RPC response of the MCP server for one message, or null for
// a notification.
export function mcpResponse(message: Request): unknown {
    if (message.id === undefined) return null;
    const reply = (result: unknown) => ({
        jsonrpc: "2.0",
        id: message.id,
        result,
    });
    switch (message.method) {
        case "initialize":
            return reply({
                protocolVersion: "2025-06-18",
                capabilities: { tools: {} },
                serverInfo: { name: SERVER, version: "1.0.0" },
            });
        case "tools/list":
            return reply({
                tools: [
                    {
                        name: TOOL,
                        description:
                            "Permission prompt of the eval runs. Allows each tool call.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                tool_name: { type: "string" },
                                input: { type: "object" },
                                tool_use_id: { type: "string" },
                            },
                        },
                    },
                ],
            });
        case "tools/call": {
            const decision = {
                behavior: "allow",
                updatedInput: message.params?.arguments?.input ?? {},
            };
            return reply({
                content: [{ type: "text", text: JSON.stringify(decision) }],
            });
        }
        case "ping":
            return reply({});
        default:
            return {
                jsonrpc: "2.0",
                id: message.id,
                error: { code: -32601, message: `No method ${message.method}` },
            };
    }
}

async function serveMcp(): Promise<void> {
    for await (const line of createInterface({ input: process.stdin })) {
        if (!line.trim()) continue;
        const response = mcpResponse(JSON.parse(line) as Request);
        if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
    }
}

async function main(argv: string[]): Promise<void> {
    const [mode, dir] = argv;
    if (mode === "mcp") return await serveMcp();
    if (mode === "hook" && dir) {
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
        process.stdout.write(answerHook(Buffer.concat(chunks).toString(), dir));
        return;
    }
    console.error("Usage: question-host.ts hook <host-dir> | mcp");
    process.exitCode = 2;
}

if (import.meta.main) await main(process.argv.slice(2));
