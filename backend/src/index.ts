import express = require("express");
import cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  res.json({
    messages: [
      "Hola María, vi tu post sobre IA y me pareció súper interesante.",
      "Hola María, felicitaciones por tu charla en el evento de innovación.",
      "Hola María, fui el primero en likear tu post sobre IA generativa."
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
