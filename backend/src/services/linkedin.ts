import { getCache, setCache } from "../utils/mcache";
import { normalizeRealtimeLinkedIn, NormalizedProfile } from "./linkedin-normalize";

export async function rawLinkedInApiCall(url: string): Promise<any> {
  const HOST = process.env.REALTIME_LI_API_HOST || "realtime-linkedin-bulk-data.p.rapidapi.com";
  const KEY = process.env.REALTIME_LI_API_KEY || "";
  if (!KEY) throw new Error("REALTIME_LI_API_KEY is missing in environment");

  const cacheKey = `li:raw:${url}`;
  const ttlMs = Number(process.env.LI_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000);

  const cached = getCache<any>(cacheKey);
  if (cached) {
    console.log(`[cache] HIT ${cacheKey}`);
    return cached;
  }

  console.log(`[cache] MISS ${cacheKey} → fetching RapidAPI`);
  const res = await fetch(`https://${HOST}/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": KEY,
      "x-rapidapi-host": HOST,
    },
    body: JSON.stringify({ links: [url] }),
  });

  const json = await res.json().catch(() => ({}));
  setCache(cacheKey, json, ttlMs);
  return json;
}

export async function fetchAndNormalizeProfile(url: string): Promise<NormalizedProfile> {
  const cacheKey = `li:norm:${url}`;
  const ttlMs = Number(process.env.LI_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000);

  const cached = getCache<NormalizedProfile>(cacheKey);
  if (cached) {
    console.log(`[cache] HIT ${cacheKey}`);
    return cached;
  }

  const raw = await rawLinkedInApiCall(url);
  const norm = normalizeRealtimeLinkedIn(raw);
  setCache(cacheKey, norm, ttlMs);
  return norm;
}
