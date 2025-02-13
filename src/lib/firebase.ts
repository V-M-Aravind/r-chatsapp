import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "r-chatsapp.firebaseapp.com",
  projectId: "r-chatsapp",
  storageBucket: "r-chatsapp.firebasestorage.app",
  messagingSenderId: "1060569681847",
  appId: "1:1060569681847:web:04e74ce6a92d3d73e46232",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
