import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from "./firebase.js";

// Ambil elemen wadah yang tadi kita buat di HTML
const authButtonsContainer = document.getElementById('auth-buttons');
const mobileMenuContainer = document.getElementById('mobile-menu'); // Kita juga akan update menu HP

// Fungsi ini berjalan otomatis setiap kali status user berubah (Login/Logout)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // === KONDISI: USER SUDAH LOGIN ===
        
        // Cek datanya di database (apakah dia ADMIN atau USER biasa?)
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        let role = 'user';
        let namaUser = 'User';

        if (docSnap.exists()) {
            const data = docSnap.data();
            role = data.role;
            namaUser = data.name || 'User';
        }

        // Tentukan link tujuan dashboard
        let dashboardLink = (role === 'admin') ? 'admin.html' : 'career.html'; // Nanti kita buat career.html
        let labelLink = (role === 'admin') ? 'Dashboard Admin' : 'Lowongan Saya';

        // 1. Update Tampilan Desktop
        authButtonsContainer.innerHTML = `
            <span class="text-white text-xs mr-2">Halo, ${namaUser}</span>
            <a href="${dashboardLink}" class="text-white hover:text-amber-400 text-sm font-bold mr-3">${labelLink}</a>
            <button id="btn-logout" class="px-4 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition text-sm">
                Logout
            </button>
        `;

        // 2. Update Tampilan Mobile (Menu HP)
        // Kita tambahkan tombol logout di menu bawah
        const logoutMobile = document.createElement('a');
        logoutMobile.className = "block py-3 px-6 text-red-500 font-bold hover:bg-slate-800 cursor-pointer border-t border-slate-700";
        logoutMobile.innerHTML = "Logout System";
        logoutMobile.addEventListener('click', processLogout);
        
        // Hapus tombol login lama di mobile jika ada, ganti dengan menu dashboard
        // (Untuk simplifikasi, kita append saja dulu)
        mobileMenuContainer.appendChild(logoutMobile);

        // Aktifkan tombol Logout Desktop
        document.getElementById('btn-logout').addEventListener('click', processLogout);

    } else {
        // === KONDISI: BELUM LOGIN (GUEST) ===
        
        // Tampilkan Tombol Login / Daftar
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="px-5 py-2 bg-amber-500 text-[#0f172a] font-bold rounded-full hover:bg-amber-400 transition shadow-lg">
                Login / Daftar
            </a>
        `;
    }
});

// Fungsi Logout
function processLogout() {
    const confirmLogout = confirm("Yakin ingin keluar?");
    if (confirmLogout) {
        signOut(auth).then(() => {
            alert("Berhasil Logout");
            window.location.href = "index.html"; // Refresh ke halaman utama
        }).catch((error) => {
            console.error("Error logout:", error);
        });
    }
}