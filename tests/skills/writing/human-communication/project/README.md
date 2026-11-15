# Scheduler

Scheduler runs Jobs at fixed times and fetches their input over HTTP.

## Usage

```ts
import { schedule } from "./src/scheduler.ts";

schedule({ name: "report", at: "02:00", url: "https://example.com/data" });
```
