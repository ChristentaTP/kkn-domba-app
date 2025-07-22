// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-Fbdguxr1z7nxoYmYtE6mfFhOgEuRIvI",
  authDomain: "kkn-domba-app.firebaseapp.com",
  projectId: "kkn-domba-app",
  storageBucket: "kkn-domba-app.firebasestorage.app",
  messagingSenderId: "392033724710",
  appId: "1:392033724710:web:cf5e3fd2fadbda2f38b9e7"
};

//Cek apakah sudah ada app Firebase yang diinisialisasi
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
