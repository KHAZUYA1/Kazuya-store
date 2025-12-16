// js/auth_register.js
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from "./firebase.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        // 1. Buat akun di Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Simpan data user ke Firestore dengan role 'user'
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: "user", // Default role untuk pendaftar umum
            createdAt: new Date()
        });

        alert("Registrasi Berhasil! Silakan Login.");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
});