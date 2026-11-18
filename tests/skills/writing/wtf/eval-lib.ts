// The tests of evals.json for the wtf output tests, and their messages.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readEvalsIn } from "../../engineering/eval-lib.ts";
import type { Statement } from "../human-communication/eval-lib.ts";

export const HERE = dirname(fileURLToPath(import.meta.url));

// `messages` are the paths of the messages that the copy turns put in the
// session, in sequence. `call` is the last turn of a run with the Skill.
// `question` is the question that the message asks the Operator, or null.
// The grader reads `question` and `facts` from eval_metadata.json.
export type Eval = {
    id: number;
    name: string;
    messages: string[];
    call: string;
    question: string | null;
    facts: string[];
    assertions: Statement[];
};

// Reads the tests with the given ids, or all tests with no ids. Each test
// gets the common statements first.
export const readEvals = (ids: string): Eval[] => readEvalsIn<Eval>(HERE, ids);

// The text of each message of the test, in sequence.
export const readMessages = (ev: Eval): string[] =>
    ev.messages.map((path) => readFileSync(join(HERE, path), "utf8"));
