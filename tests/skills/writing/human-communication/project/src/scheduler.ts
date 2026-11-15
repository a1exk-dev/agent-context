import { fetchWithRetry } from "./fetch.ts";

export type Job = { name: string; at: string; url: string };

const jobs: Job[] = [];

export function schedule(job: Job): void {
    jobs.push(job);
}

// Runs each task whose time is now, one after the other.
export async function runDue(now: string): Promise<string[]> {
    const done: string[] = [];
    for (const job of jobs.filter((item) => item.at === now)) {
        await fetchWithRetry(job.url);
        done.push(job.name);
    }
    return done;
}
