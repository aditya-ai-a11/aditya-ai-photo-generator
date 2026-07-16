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

    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.width = 120;
    img.style.margin = "5px";

    history.prepend(img);
  });
}