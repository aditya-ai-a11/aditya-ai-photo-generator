import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUPtK3wAEX3EnAvgBL8QF8csL3woZhV50",
  authDomain: "aditya-ai-photo-generator.firebaseapp.com",
  projectId: "aditya-ai-photo-generator",
  storageBucket: "aditya-ai-photo-generator.firebasestorage.app",
  messagingSenderId: "357265344108",
  appId: "1:357265344108:web:c19aaee0be05a824d5fa49",
  measurementId: "G-2SX7E3G5LW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);