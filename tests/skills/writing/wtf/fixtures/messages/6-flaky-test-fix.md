The flaky test is `retries the upload after a 503` in `test/upload.test.ts`: the mock server's second response races the retry timer because `backoffMs` reads `Date.now()` before the fake timers are installed, so the first delay is computed against real time and the assertion on `calls.length` sees 1 instead of 2 in about one run of 20. Moving `vi.useFakeTimers()` into `beforeEach`, ahead of the client construction, pins it:

```diff
-  const client = makeClient(server.url);
-  beforeEach(() => vi.useFakeTimers());
+  let client: Client;
+  beforeEach(() => {
+    vi.useFakeTimers();
+    client = makeClient(server.url);
+  });
```

I looped it 200 times locally with no failure. To confirm on your machine before I commit:

```sh
for i in $(seq 1 200); do npx vitest run test/upload.test.ts || break; done
```

Shall I commit the fix?
