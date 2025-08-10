// src/services/generation.ts
import { buildPrompt } from "./prompt";
import { generateJson } from "./openai";

type MiniPost = { text: string };
type MiniProfile = {
  name?: string;
  headline?: string;
  latestPosts?: MiniPost[];
};

function pruneProfile(p?: MiniProfile): MiniProfile {
  const out: MiniProfile = {};
  if (p?.name) out.name = p.name;
  const hl = (p?.headline || "").slice(0, 120).trim();
  if (hl) out.headline = hl;

  if (Array.isArray(p?.latestPosts)) {
    const posts = p.latestPosts
      .slice(0, 3)
      .map((x) => ({ text: String(x.text || "").slice(0, 400).trim() }))
      .filter((x) => x.text);
    if (posts.length) out.latestPosts = posts;
  }
  return out;
}

const generateIcebreakersLLM = async (input: {
  sender: MiniProfile;
  recipient: MiniProfile;
  problem: string;
  solution: string;
  tone?: string;
  maxChars?: number;
  goal?: string;
  category?: string;
  language?: string;
  temperature?: number;
  rewriteIndex?: number;
}): Promise<string[] | string> => {
  const cleanInput = {
    sender: pruneProfile(input.sender),
    recipient: pruneProfile(input.recipient),
    problem: String(input.problem || "").slice(0, 500).trim(),
    solution: String(input.solution || "").slice(0, 500).trim(),
    tone: input.tone || "neutral",
    maxChars: input.maxChars || 280,
    goal: input.goal || "conversation",
    category: input.category || "auto",
    language: input.language || "auto",
  };

  const prompt = buildPrompt(cleanInput);
  if ((process.env.LOG_PROMPTS || "").toLowerCase() === "true") {
    console.log("\n--- Prompt to OpenAI ---\n", prompt, "\n------------------------\n");
  }

  const { messages } = await generateJson(prompt);
  const three = (messages || []).filter((s) => typeof s === "string" && s.trim()).slice(0, 3);
  if (three.length !== 3) throw new Error("Model did not return 3 valid messages");
  return three;
};

export default generateIcebreakersLLM; 