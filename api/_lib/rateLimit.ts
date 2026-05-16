type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; retryAfter: 0 }
  | { ok: false; retryAfter: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

// Best-effort: prevents the map from growing unbounded across many distinct keys
// on a long-lived warm instance.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}, WINDOW_MS).unref?.();
