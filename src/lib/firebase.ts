// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // <--- 1. IMPORT STORAGE

// Config Firebase (Data Asli Mas Yuda)
const firebaseConfig = {
    apiKey: "AIzaSyDzo9T_RflcmM6vqaz7jAlmJs1S09UeWjQ",
    authDomain: "kazuya-store-db.firebaseapp.com",
    projectId: "kazuya-store-db",
    storageBucket: "kazuya-store-db.firebasestorage.app",
    messagingSenderId: "403441636994",
    appId: "1:403441636994:web:396be296ed5f515caac69b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export service agar bisa dipakai di component lain
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <--- 2. WAJIB EXPORT INI
export const productsCollection = collection(db, "products");