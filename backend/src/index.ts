import express = require("express");
import cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Next dev server

app.post("/generate", (req, res) => {
  // Accept both shapes: senderUrl/recipientUrl OR senderProfileUrl/recipientProfileUrl
  const {
    senderUrl,
    recipientUrl,
    senderProfileUrl,
    recipientProfileUrl,
    problem,
    solution,
  } = req.body || {};

  if (!(problem && solution && (senderUrl || senderProfileUrl) && (recipientUrl || recipientProfileUrl))) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  return res.json({
    messages: [
      "Hola María, vi tu post sobre IA y me pareció súper interesante.",
      "Hola María, felicitaciones por tu charla en el evento de innovación.",
      "Hola María, fui el primero en likear tu post sobre IA generativa."
    ]
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
