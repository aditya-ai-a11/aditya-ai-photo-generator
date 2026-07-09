const clearBtn = document.getElementById("clearBtn");
const style = document.getElementById("style");
const size = document.getElementById("size");
const button = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const copyBtn = document.getElementById("copyBtn");
const promptInput = document.getElementById("prompt");
let imageCount = 0;
const imageCountText = document.getElementById("imageCount");
const outputImage = document.getElementById("outputImage");
const status = document.getElementById("status");
const downloadBtn = document.getElementById("downloadBtn");
const themeBtn = document.getElementById("themeBtn");

// Generate Image
button.addEventListener("click", async function () {

    const prompt = promptInput.value;
    const finalPrompt = `${prompt}, ${style.value}, ${size.value}`;

    if (prompt === "") {
        alert("Please enter a prompt!");
        return;
    }

    status.innerText = "Generating image...";
    button.disabled = true;
button.innerText = "Generating...";
    document.getElementById("loader").style.display = "block";
    document.querySelector(".spinner").style.display = "block";

    const response = await fetch("https://aditya-ai-photo-generator.onrender.com/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: finalPrompt
        })
    });

    const imageBlob = await response.blob();

outputImage.src = URL.createObjectURL(imageBlob);
const history = document.getElementById("history");

const img = document.createElement("img");
img.src = outputImage.src;
history.prepend(img);
img.addEventListener("click", function () {
    outputImage.src = img.src;
});
outputImage.style.display = "block";

downloadBtn.style.display = "inline-block";
document.getElementById("loader").style.display = "none";
document.querySelector(".spinner").style.display = "none";
button.disabled = false;
button.innerText = "Generate Image";
status.innerText = "Image Generated!";
document.getElementById("promptText").innerText = "📝 Prompt: " + finalPrompt;
});

// Download Image
downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = outputImage.src;
    link.download = "image.jpg";
    link.click();
});

// Dark / Light Mode
themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerText = "☀️ Light Mode";
    } else {
        themeBtn.innerText = "🌙 Dark Mode";
    }
});
clearBtn.addEventListener("click", function () {
    outputImage.src = "";
    outputImage.style.display = "none";

    status.innerText = "";

    downloadBtn.style.display = "none";
});
outputImage.addEventListener("click", function () {
    if (outputImage.requestFullscreen) {
        outputImage.requestFullscreen();
    }
});
const prompts = [
    "A cute white cat",
    "A futuristic sports car",
    "A cyberpunk city at night",
    "A fantasy castle",
    "A dragon flying in the sky",
    "A lion wearing sunglasses",
    "An astronaut on the moon",
    "A beautiful waterfall",
    "A samurai in anime style",
    "A robot playing guitar"
];

randomBtn.addEventListener("click", function () {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    promptInput.value = random;
});
copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(promptInput.value);

    copyBtn.innerText = "✅ Copied!";

    setTimeout(() => {
        copyBtn.innerText = "📋 Copy Prompt";
    }, 2000);
});

promptInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        button.click();
    }
});