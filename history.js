import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function loadHistory() {
  const history = document.getElementById("history");

  if (!auth.currentUser) return;

  history.innerHTML = "";

  const q = query(
    collection(db, "images"),
    where("user", "==", auth.currentUser.email)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Invalid/old image URLs ko skip karo
    if (
      !data.imageUrl ||
      !data.imageUrl.startsWith("http")
    ) {
      return;
    }

    const img = document.createElement("img");


    img.src = data.imageUrl;
    img.width = 120;
    img.height = 120;
    img.style.margin = "5px";
    img.style.objectFit = "cover";
    img.style.cursor = "pointer";
    const favoriteBtn = document.createElement("button");

favoriteBtn.innerText = "⭐ Favorite";

favoriteBtn.style.display = "block";
favoriteBtn.style.margin = "5px auto";
favoriteBtn.style.padding = "7px 12px";
favoriteBtn.style.border = "none";
favoriteBtn.style.borderRadius = "8px";
favoriteBtn.style.cursor = "pointer";

favoriteBtn.addEventListener("click", () => {
    favoriteBtn.innerText = "⭐ Favorited!";
});
    const downloadBtn = document.createElement("button");

downloadBtn.innerText = "⬇️ Download";

downloadBtn.style.display = "block";
downloadBtn.style.margin = "5px auto 15px";
downloadBtn.style.padding = "7px 12px";
downloadBtn.style.border = "none";
downloadBtn.style.borderRadius = "8px";
downloadBtn.style.cursor = "pointer";

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = data.imageUrl;
    link.download = "aditya-ai-image.jpg";
    link.target = "_blank";
    link.click();
});

    img.addEventListener("click", () => {
      const outputImage = document.getElementById("outputImage");
      outputImage.src = data.imageUrl;
      outputImage.style.display = "block";
    });
history.appendChild(favoriteBtn);
history.appendChild(downloadBtn);
    history.prepend(img);
  });
}