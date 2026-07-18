import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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

        res.set("Content-Type", "image/png");
        res.send(Buffer.from(imageBuffer));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating image");
    }
});

app.get("/", (req, res) => {
    res.send("AI Photo Generator Server Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});