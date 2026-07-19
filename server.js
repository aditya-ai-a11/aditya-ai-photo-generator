import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());
app.use(express.json());

// Image Generate
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  console.log("Prompt:", prompt);

  try {
    const response = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
    );

    if (!response.ok) {
      return res.status(500).send("Error generating image");
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

const uploadResult = await cloudinary.uploader.upload(
  `data:image/png;base64,${base64Image}`,
  {
    folder: "Aditya Ai",
  }
);

console.log(uploadResult.secure_url);

    res.json({
  imageUrl: uploadResult.secure_url,
});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
});

// Cloudinary Test
app.get("/cloudinary-test", (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Found" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Found" : "Missing",
  });
});

// Home
app.get("/", (req, res) => {
  res.send("AI Photo Generator Server Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});