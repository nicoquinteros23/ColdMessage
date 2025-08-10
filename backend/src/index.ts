// src/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import express = require("express");
import cors = require("cors");
import { rawLinkedInApiCall } from "./services/linkedin";


const app = express();


// Middleware de logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/debug/linkedin", async (req, res) => {
    try {
      const url = String(req.query.url || "");
      if (!url) return res.status(400).json({ error: "Missing ?url=" });
  
      const apiResponse = await rawLinkedInApiCall(url);
      res.json(apiResponse);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || "error" });
    }
  });

// /generate seguirá orquestando después con OpenAI, por ahora puede quedar tu mock o vacío
app.post("/generate", (_req, res) => {
  res.json({ messages: [] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
