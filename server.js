import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    console.log("Prompt:", prompt);

    const imageUrl =
      'https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&key=${process.env.POLLINATIONS_API_KEY}';

    return res.json({
      imageUrl
    });

  } catch (err) {
    console.error("Generate Error:", err);

    return res.status(500).json({
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("AI Photo Generator Server Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});