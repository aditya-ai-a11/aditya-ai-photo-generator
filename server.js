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
      'https://aditya-ai-photo-generator.onrender.com/image?prompt=${encodeURIComponent(prompt)}';

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

app.get("/image", async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).send("Prompt is required");
    }

    const pollinationsUrl =
      'https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux';

    const response = await fetch(pollinationsUrl, {
      headers: {
        Authorization: 'Bearer ${process.env.POLLINATIONS_API_KEY}'
      }
    });

    if (!response.ok) {
      throw new Error('Pollinations error: ${response.status}');
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.set(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );

    res.send(buffer);

  } catch (err) {
    console.error("Image Error:", err);

    res.status(500).send("Image generation failed");
  }
});

app.get("/", (req, res) => {
  res.send("AI Photo Generator Server Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});