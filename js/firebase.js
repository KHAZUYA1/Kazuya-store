// js/firebase.js - VERSI DEBUGGING
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// --- PASTE CONFIG ASLI ANDA DI BAWAH INI ---
// Pastikan tidak ada typo dan tanda kutipnya benar
const firebaseConfig = {
    apiKey: "AIzaSyA6XJ88lrRNLfhaGhGuW8KTzq1AlfyA8K4",
    authDomain: "websij-connect.firebaseapp.com",
    projectId: "websij-connect",
    storageBucket: "websij-connect.firebasestorage.app",
    messagingSenderId: "842875142110",
    appId: "1:842875142110:web:3328ee5fa900e180b7274f",
    measurementId: "G-X82FHHQZC7"
};


console.log("1. Mencoba menghubungkan ke Firebase...", firebaseConfig.projectId);

// Initialize Firebase
let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("2. Firebase Berhasil Diinisialisasi! ✅");
} catch (e) {
    console.error("FATAL: Gagal Inisialisasi Firebase ❌", e);
}

// Fungsi Get News dengan Log
export async function getNews() {
  console.log("3. Sedang mencoba mengambil data berita...");
  const newsList = [];
  try {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    
    console.log(`4. Data ditemukan! Jumlah berita: ${querySnapshot.size}`);
    
    querySnapshot.forEach((doc) => {
      console.log(" - Berita:", doc.data());
      newsList.push({ id: doc.id, ...doc.data() });
    });
    
    return newsList;
  } catch (error) {
    console.error("ERROR SAAT MENGAMBIL BERITA ❌:", error);
    // Cek apakah error karena Index
    if (error.message.includes("indexes")) {
        console.warn("⚠️ ANDA PERLU MEMBUAT INDEX DI FIREBASE CONSOLE. Cek link di error merah.");
    }
    return [];
  }
}

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc };