// Makes the tables of the local database when they do not exist.

import { mkdirSync } from "node:fs";
import { openDb } from "./db.ts";

mkdirSync("data", { recursive: true });
openDb().run(
    "CREATE TABLE IF NOT EXISTS jobs (name TEXT PRIMARY KEY, at TEXT, url TEXT, last_run TEXT)",
);
