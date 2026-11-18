Three questions for the cache ticket #41.

❓ **Q1** — **Where does the cache live?** The service runs as 3 replicas behind the load balancer, so an in-process LRU gives each replica its own view of the data; Redis is already in the stack for sessions.

➡️ Redis, keyed by `tenant:resource:id`, so all 3 replicas see one cache. Do you agree with Redis?

❓ **Q2** — **Do writes invalidate or update?** On a write, the handler can either drop the key (the next read repopulates it from Postgres) or write the new value through. Write-through saves the miss but races with a concurrent read that loaded the old row before the commit and lands after it — the stale value then sits there for the full TTL of 10 minutes. Invalidate-on-write has the same race, but the window is one read, not one TTL.

➡️ Invalidate: delete the key after the commit, never write the value through, and accept one extra Postgres read per write. Do you agree with invalidate-on-write?

❓ **Q3** — **What is the TTL?** 10 minutes matches the session TTL, but the pricing data changes at most once a day.

➡️ 10 minutes for all keys at 1.0.0; per-resource TTLs wait for a measured need. Do you agree with one TTL of 10 minutes?
