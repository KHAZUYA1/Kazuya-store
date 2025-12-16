// js/auth_login.js
import { auth, db, signInWithEmailAndPassword, doc, getDoc } from "./firebase.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = loginForm.querySelector('button');

    try {
        btn.innerHTML = "Memproses...";
        btn.disabled = true;

        // 1. Login ke Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Cek Role di Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role === 'admin') {
                alert("Login Admin Berhasil!");
                window.location.href = "admin.html"; // Redirect ke Dashboard Admin
            } else {
                alert("Login Berhasil!");
                window.location.href = "index.html"; // Atau ke halaman profile karir (misal: career.html)
            }
        } else {
            // Jika user login tapi data tidak ada di Firestore (kasus jarang)
            alert("Data user tidak ditemukan.");
        }

    } catch (error) {
        console.error(error);
        alert("Login Gagal: Password atau Email salah.");
        btn.innerHTML = "MASUK";
        btn.disabled = false;
    }
});