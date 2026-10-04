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

    img.addEventListener("click", () => {
      const outputImage = document.getElementById("outputImage");
      outputImage.src = data.imageUrl;
      outputImage.style.display = "block";
    });

    history.prepend(img);
  });
}