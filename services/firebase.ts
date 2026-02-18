
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABBLfFlFdvLdCSTmN34ICwUfIiyoILCkM",
  authDomain: "attendance-tracker-21895.firebaseapp.com",
  projectId: "attendance-tracker-21895",
  storageBucket: "attendance-tracker-21895.firebasestorage.app",
  messagingSenderId: "334074579828",
  appId: "1:334074579828:web:aee4a53fd0deec8901ba21",
  measurementId: "G-788TH27EFE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
