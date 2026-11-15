// Fetches a URL and tries again when the request fails.

const MAX_TRIES = 3;
const DELAY_MS = 500;

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

export async function fetchWithRetry(url: string): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            lastError = new Error(`HTTP ${response.status}`);
        } catch (error) {
            lastError = error;
        }
        if (attempt < MAX_TRIES) await wait(DELAY_MS * attempt);
    }
    throw lastError;
}
