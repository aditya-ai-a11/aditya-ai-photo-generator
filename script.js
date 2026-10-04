import { auth, db } from "./firebase.js";
import { loadHistory } from "./history.js";

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
const progressBar = document.getElementById("progressBar");
const clearBtn = document.getElementById("clearBtn");
const style = document.getElementById("style");
const size = document.getElementById("size");
const button = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const copyBtn = document.getElementById("copyBtn");
const promptInput = document.getElementById("prompt");
const imageCountText = document.getElementById("imageCount");
const outputImage = document.getElementById("outputImage");
const status = document.getElementById("status");
const downloadBtn = document.getElementById("downloadBtn");
const themeBtn = document.getElementById("themeBtn");
const loader = document.getElementById("loader");
const spinner = document.querySelector(".spinner");

let imageCount = 0;


// ===============================
// GENERATE IMAGE
// ===============================

button.addEventListener("click", async function () {

  const prompt = promptInput.value.trim();

  const finalPrompt = `${prompt}, ${style.value}, ${size.value}`;

  if (prompt === "") {
    alert("Please enter a prompt!");
    return;
  }

  button.disabled = true;
  button.innerText = "Generating...";

  status.innerText = "Generating image...";

  loader.style.display = "block";
  spinner.style.display = "block";

  progressContainer.style.display = "block";
  progressBar.style.width = "10%";

  let progress = 10;

  const progressInterval = setInterval(() => {
    if (progress < 90) {
      progress += 10;
      progressBar.style.width = progress + "%";
    }
  }, 300);


  try {

    const response = await fetch(
      "https://aditya-ai-photo-generator.onrender.com/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          prompt: finalPrompt
        })
      }
    );


    if (!response.ok) {

      const errorText = await response.text();

      throw new Error(errorText || "Image generation failed");

    }


    const data = await response.json();

    console.log("Response =", data);
    console.log("Image URL =", data.imageUrl);


    if (!data.imageUrl) {
      throw new Error("Image URL not received from server");
    }


    outputImage.src = data.imageUrl;

    outputImage.style.display = "block";

    downloadBtn.style.display = "inline-block";


    outputImage.onload = function () {

      console.log("IMAGE LOADED");

      status.innerText = "Image Generated!";

    };


    outputImage.onerror = function () {

      console.log("IMAGE FAILED");

      status.innerText = "Image could not be loaded.";

    };


    // Add image to visible history

    const history = document.getElementById("history");

    const img = document.createElement("img");

    img.src = data.imageUrl;

    img.width = 120;
    img.height = 120;

    img.style.margin = "5px";
    img.style.objectFit = "cover";
    img.style.cursor = "pointer";

    history.prepend(img);


    img.addEventListener("click", function () {

      outputImage.src = img.src;
      outputImage.style.display = "block";

    });


    // Counter

    imageCount++;

    imageCountText.innerText =
      "🖼️ Images Generated: " + imageCount;


    document.getElementById("promptText").innerText =
      "📝 Prompt: " + finalPrompt;


    // Save history only when logged in

    if (auth.currentUser) {

      try {

        const user = auth.currentUser;

        await addDoc(collection(db, "images"), {

          user: user.email,

          prompt: finalPrompt,

          imageUrl: data.imageUrl,

          createdAt: serverTimestamp()

        });

        console.log("Image history saved!");

        await loadHistory();

      } catch (error) {

        console.error(
          "Error saving history:",
          error
        );

      }

    }


  } catch (error) {

    console.error("Generate Error:", error);

    alert("Image generation failed: " + error.message);

    status.innerText = "Generation failed.";

  }


  clearInterval(progressInterval);

  progressBar.style.width = "100%";

  setTimeout(() => {

    progressContainer.style.display = "none";
    progressBar.style.width = "0%";

  }, 500);


  loader.style.display = "none";
  spinner.style.display = "none";

  button.disabled = false;
  button.innerText = "Generate Image";

});


// ===============================
// DOWNLOAD IMAGE
// ===============================

downloadBtn.addEventListener("click", function () {

  const link = document.createElement("a");

  link.href = outputImage.src;

  link.download = 'AI-Image-${Date.now()}.png';

  link.click();

});


// ===============================
// DARK / LIGHT MODE
// ===============================

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.innerText = "🌙 Dark Mode";
  } else {
    themeBtn.innerText = "☀️ Light Mode";
  }
});



// ===============================
// CLEAR IMAGE
// ===============================

clearBtn.addEventListener("click", function () {

  outputImage.src = "";

  outputImage.style.display = "none";

  status.innerText = "";

  downloadBtn.style.display = "none";

});


// ===============================
// FULLSCREEN IMAGE
// ===============================

outputImage.addEventListener("click", function () {

  if (outputImage.requestFullscreen) {

    outputImage.requestFullscreen();

  }

});


// ===============================
// RANDOM PROMPT
// ===============================

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

  const random =
    prompts[Math.floor(Math.random() * prompts.length)];

  promptInput.value = random;

});


// ===============================
// COPY PROMPT
// ===============================

copyBtn.addEventListener("click", function () {

  navigator.clipboard.writeText(promptInput.value);

  copyBtn.innerText = "✅ Copied!";

  setTimeout(() => {

    copyBtn.innerText = "📋 Copy Prompt";

  }, 2000);

});


// ===============================
// ENTER KEY
// ===============================

promptInput.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {

    button.click();

  }

});


// ===============================
// GOOGLE LOGIN
// ===============================

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const provider = new GoogleAuthProvider();


loginBtn.addEventListener("click", async function () {

  try {

    await signInWithPopup(auth, provider);

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});


logoutBtn.addEventListener("click", async function () {

  try {

    await signOut(auth);

  } catch (error) {

    console.error(error);

  }

});


// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(auth, async function (user) {

  if (user) {

    loginBtn.style.display = "none";

    logoutBtn.style.display = "inline-block";

    document.getElementById("userProfile").style.display = "block";

    document.getElementById("userName").innerText =
      user.displayName || "User";

    document.getElementById("userPhoto").src =
      user.photoURL || "";

    await loadHistory();

  } else {

    document.getElementById("userProfile").style.display = "none";

    loginBtn.style.display = "inline-block";

    logoutBtn.style.display = "none";

  }

});
document.addEventListener("DOMContentLoaded", function () {

    const imageUpload = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");

    imageUpload.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            previewImage.style.display = "none";
            return;
        }

        const imageURL = URL.createObjectURL(file);

        previewImage.src = imageURL;
        previewImage.style.display = "block";
    });

});
const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const transformBtn = document.getElementById("transformBtn");
const imagePrompt = document.getElementById("imagePrompt");
const transformStatus = document.getElementById("transformStatus");

if (imageUpload) {
    imageUpload.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
    });
}

if (transformBtn) {
    transformBtn.addEventListener("click", function () {
        if (!imageUpload.files[0]) {
            transformStatus.innerText = "⚠️ Please select an image first.";
            return;
        }

        if (!imagePrompt.value.trim()) {
            transformStatus.innerText = "⚠️ Please enter a transformation prompt.";
            return;
        }

        transformStatus.innerText =
            "🪄 Image-to-Image feature is ready. Backend connection is next.";
    });
}
const enhanceInput = document.getElementById("enhanceInput");
const enhanceBtn = document.getElementById("enhanceBtn");
const enhancedResult = document.getElementById("enhancedResult");
const enhancedText = document.getElementById("enhancedText");
const copyEnhancedBtn = document.getElementById("copyEnhancedBtn");

enhanceBtn.addEventListener("click", function () {

    const idea = enhanceInput.value.trim();

    if (!idea) {
        enhancedText.innerText = "⚠️ Please enter an idea first.";
        enhancedResult.style.display = "block";
        return;
    }

    const enhancedPrompt =
        `${idea}, highly detailed, cinematic composition, realistic lighting, `
        + `sharp focus, professional photography, rich colors, beautiful background, `
        + `ultra detailed, high quality, 4K`;

    enhancedText.innerText = enhancedPrompt;
    enhancedResult.style.display = "block";
});

copyEnhancedBtn.addEventListener("click", async function () {

    await navigator.clipboard.writeText(enhancedText.innerText);

    copyEnhancedBtn.innerText = "✅ Copied!";

    setTimeout(() => {
        copyEnhancedBtn.innerText = "📋 Copy";
    }, 1500);
});