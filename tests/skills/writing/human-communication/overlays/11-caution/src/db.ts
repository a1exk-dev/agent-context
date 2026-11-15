// Opens the local SQLite database. The scheduler saves each Job and its last
// run in it.

import { Database } from "bun:sqlite";

export const DB_PATH = "data/app.db";

export function openDb(): Database {
    return new Database(DB_PATH, { create: true });
}
