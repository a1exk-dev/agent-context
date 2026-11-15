import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { answerHook, mcpResponse, TOOL } from "./question-host.ts";

const made: string[] = [];
afterEach(() => {
    for (const dir of made.splice(0))
        rmSync(dir, { recursive: true, force: true });
});

function hostDir(answers: string[]): string {
    const dir = mkdtempSync(join(tmpdir(), "hc-host-"));
    made.push(dir);
    writeFileSync(join(dir, "answers.json"), JSON.stringify(answers));
    return dir;
}

const question = (text: string, labels: string[]) => ({
    header: "Q",
    question: text,
    multiSelect: false,
    options: labels.map((label) => ({ label, description: "" })),
});

const hookInput = (questions: unknown[]) =>
    JSON.stringify({
        hook_event_name: "PreToolUse",
        tool_name: "AskUserQuestion",
        tool_input: { questions },
    });

describe("answerHook", () => {
    it("saves each call and answers from the answers list in order", () => {
        const dir = hostDir(["debug", "logs/app.log", "yes"]);
        const first = [
            question("Q1 of 3 Which log level?", [
                "info (Recommended)",
                "debug",
            ]),
            question("Q2 of 3 Which log file?", ["logs/app.log", "stdout"]),
        ];
        const second = [question("Q3 of 3 Rotate logs?", ["no", "yes"])];

        const out1 = JSON.parse(answerHook(hookInput(first), dir));
        const out2 = JSON.parse(answerHook(hookInput(second), dir));

        expect(out1.hookSpecificOutput).toEqual({
            hookEventName: "PreToolUse",
            permissionDecision: "allow",
            updatedInput: {
                questions: first,
                answers: {
                    "Q1 of 3 Which log level?": "debug",
                    "Q2 of 3 Which log file?": "logs/app.log",
                },
            },
        });
        expect(out2.hookSpecificOutput.updatedInput.answers).toEqual({
            "Q3 of 3 Rotate logs?": "yes",
        });
        const saved = readFileSync(join(dir, "questions.jsonl"), "utf8")
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
        expect(saved).toEqual([{ questions: first }, { questions: second }]);
    });

    it("answers with the first option when the answers list has no answer left", () => {
        const dir = hostDir([]);
        const out = JSON.parse(
            answerHook(
                hookInput([
                    question("Q1 of 1 Which CI?", [
                        "GitHub Actions (Recommended)",
                        "None",
                    ]),
                ]),
                dir,
            ),
        );
        expect(out.hookSpecificOutput.updatedInput.answers).toEqual({
            "Q1 of 1 Which CI?": "GitHub Actions (Recommended)",
        });
    });
});

describe("mcpResponse", () => {
    it("lists the permission tool", () => {
        const response = mcpResponse({
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list",
        }) as { result: { tools: { name: string }[] } };
        expect(response.result.tools.map((tool) => tool.name)).toEqual([TOOL]);
    });

    it("allows each tool call with its input unchanged", () => {
        const input = {
            questions: [question("Q1 of 1 Which CI?", ["a", "b"])],
            answers: { "Q1 of 1 Which CI?": "a" },
        };
        const response = mcpResponse({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: TOOL,
                arguments: { tool_name: "AskUserQuestion", input },
            },
        }) as { id: number; result: { content: { text: string }[] } };
        expect(response.id).toBe(2);
        expect(JSON.parse(response.result.content[0]?.text ?? "")).toEqual({
            behavior: "allow",
            updatedInput: input,
        });
    });

    it("gives no response to a notification", () => {
        expect(
            mcpResponse({
                jsonrpc: "2.0",
                method: "notifications/initialized",
            }),
        ).toBeNull();
    });
});
