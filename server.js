import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const pollinationsUrl =
      'https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}';

    const imageResponse = await fetch(pollinationsUrl);

    if (!imageResponse.ok) {
      throw new Error(
        'Pollinations image failed: ${imageResponse.status}'
      );
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "aditya-ai-generator"
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return res.json({
      imageUrl: uploadResult.secure_url
    });

  } catch (err) {
    console.error("Generate Error:", err);

    return res.status(500).json({
      error: err.message,
      http_code: err.http_code || null,
      details: err.error?.message || null
    });
  }
});

app.get("/cloudinary-test", (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Found" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Found" : "Missing",
  });
});

app.get("/", (req, res) => {
  res.send("AI Photo Generator Server Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});