import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");const clearBtn = document.getElementById("clearBtn");
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
    progressContainer.style.display = "block";
progressBar.style.width = "10%";

let progress = 10;

const progressInterval = setInterval(() => {
    if (progress < 90) {
        progress += 10;
        progressBar.style.width = progress + "%";
    }
}, 300);
    button.disabled = true;
button.innerText = "Generating...";
    document.getElementById("loader").style.display = "block";
    document.querySelector(".spinner").style.display = "block";
    progressContainer.style.display = "block";
progressBar.style.width = "10%";

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
    clearInterval(progressInterval);
progressBar.style.width = "100%";

setTimeout(() => {
    progressContainer.style.display = "none";
    progressBar.style.width = "0%";
}, 500);
    progressBar.style.width = "100%";

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
setTimeout(() => {
    progressContainer.style.display = "none";
    progressBar.style.width = "0%";
}, 500);
imageCount++;
imageCountText.innerText = imageCount;
document.getElementById("promptText").innerText = "📝 Prompt: " + finalPrompt;
try {
    await addDoc(collection(db, "images"), {
        user: auth.currentUser.email,
        prompt: finalPrompt,
        createdAt: serverTimestamp()
    });
    console.log("Image history saved!");
} catch (e) {
    console.error("Error saving history:", e);
}
});

// Download Image
downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = outputImage.src;
    link.download = `AI-Image-${Date.now()}.png`;
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
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const provider = new GoogleAuthProvider();

loginBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert(error.message);
    }
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        document.getElementById("userProfile").style.display = "block";
document.getElementById("userName").innerText = user.displayName;
document.getElementById("userPhoto").src = user.photoURL;

        document.getElementById("userName").innerText = user.displayName;
document.getElementById("userPhoto").src = user.photoURL;
        alert("Welcome " + user.displayName);
    } else {
        document.getElementById("userProfile").style.display = "none";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
});