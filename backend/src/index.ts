// src/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import express = require("express");
import cors = require("cors");
import { rawLinkedInApiCall } from "./services/linkedin";

const app = express();

// logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Ruta que querés
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
