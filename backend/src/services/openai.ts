// src/services/openai.ts
type OpenAIResponse = {
    choices?: { message?: { content?: string } }[];
  };
  
  export async function generateJson(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ messages: string[] }> {
    const key = process.env.OPENAI_API_KEY || "";
    if (!key) throw new Error("OPENAI_API_KEY missing");
  
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
  
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Eres un generador de icebreakers para LinkedIn, preciso y conciso." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 350
        })
      });
  
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`OpenAI ${res.status}: ${txt}`);
      }
  
      const data = (await res.json().catch(() => ({}))) as OpenAIResponse;
      const content = data?.choices?.[0]?.message?.content || "{}";
  
      let parsed: any = {};
      try { parsed = JSON.parse(content); } catch { parsed = {}; }
  
      const arr = Array.isArray(parsed?.messages) ? parsed.messages : [];
      const messages = arr.filter((s: any) => typeof s === "string" && s.trim()).slice(0, 3);
  
      if (messages.length !== 3) throw new Error("Model did not return 3 messages");
      return { messages };
    } finally {
      clearTimeout(timeout);
    }
  }
  