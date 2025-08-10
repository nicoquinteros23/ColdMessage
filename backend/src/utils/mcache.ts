// src/utils/mcache.ts
type Entry = { value: any; expiresAt: number };
const store = new Map<string, Entry>();

export function getCache<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return;
  if (Date.now() > hit.expiresAt) { store.delete(key); return; }
  return hit.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
