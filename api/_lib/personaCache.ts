type Entry = { persona: string; expiresAt: number };

const TTL_MS = 60 * 60 * 1000; // 1h
const cache = new Map<string, Entry>();

export function rememberPersona(sessionId: string, persona: string) {
  cache.set(sessionId, { persona, expiresAt: Date.now() + TTL_MS });
}

export function recallPersona(sessionId: string): string | null {
  const e = cache.get(sessionId);
  if (!e) return null;
  if (e.expiresAt <= Date.now()) {
    cache.delete(sessionId);
    return null;
  }
  return e.persona;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cache) if (v.expiresAt <= now) cache.delete(k);
}, TTL_MS).unref?.();
