// src/services/linkedin.ts
export async function rawLinkedInApiCall(url: string): Promise<any> {
    const HOST = process.env.REALTIME_LI_API_HOST || "realtime-linkedin-bulk-data.p.rapidapi.com";
    const KEY = process.env.REALTIME_LI_API_KEY || "";
    if (!KEY) throw new Error("REALTIME_LI_API_KEY is missing in environment");
  
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
    return json;
  }
  