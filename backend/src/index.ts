// src/index.ts
import * as dotenv from "dotenv";
import { fetchAndNormalizeProfile } from "./services/linkedin";
dotenv.config();

import express = require("express");
import cors = require("cors");
import { rawLinkedInApiCall } from "./services/linkedin";
import generateIcebreakersLLM from "./services/generation";

const app = express();

// logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// RAW: respuesta tal cual de la API
app.get("/debug/linkedin/raw", async (req, res) => {
    try {
      const url = String(req.query.url || "");
      if (!url) return res.status(400).json({ error: "Missing ?url=" });
      const data = await rawLinkedInApiCall(url);
      res.json(data);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e?.message || "error" });
    }
  });

  // NORMALIZADO: perfil + última publicación
app.get("/debug/linkedin/normalized", async (req, res) => {
    try {
      const url = String(req.query.url || "");
      if (!url) return res.status(400).json({ error: "Missing ?url=" });
      const profile = await fetchAndNormalizeProfile(url);
      res.json(profile);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e?.message || "error" });
    }
  });


  /**
 * Body esperado:
 * {
 *   "senderUrl": "https://www.linkedin.com/in/...",
 *   "recipientUrl": "https://www.linkedin.com/in/...",
 *   "problem": "...",
 *   "solution": "..."
 * }
 */
app.post("/generate", async (req, res) => {
    try {
      const { senderUrl, recipientUrl, problem, solution } = req.body || {};
  
      // Validación mínima
      if (!senderUrl || !recipientUrl || !problem || !solution) {
        return res.status(400).json({ error: "Missing required fields: senderUrl, recipientUrl, problem, solution" });
      }
  
      // Normalizar perfíl emisor y destinatario (reutiliza tu normalizador actual)
      const [sender, recipient] = await Promise.all([
        fetchAndNormalizeProfile(String(senderUrl)),
        fetchAndNormalizeProfile(String(recipientUrl)),
      ]);
  
      // Generar mensajes con OpenAI
      const messages = await generateIcebreakersLLM({ sender, recipient, problem, solution });
  
      res.json({ messages });
    } catch (e: any) {
      console.error(e);
      // Diferenciá errores de OpenAI (429/500) si querés, por ahora devolvemos 502
      res.status(502).json({ error: "llm_generation_failed", detail: e?.message });
    }
  });
  



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
