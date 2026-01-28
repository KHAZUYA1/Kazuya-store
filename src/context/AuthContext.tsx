import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth"; 
import { auth } from "../lib/firebase";
import Swal from "sweetalert2";

// 1. Definisikan Interface dengan Jelas
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean; // PENTING: Untuk mencegah build error di Vercel
  loginAdmin: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Default true saat inisialisasi

  useEffect(() => {
    // 2. Monitor status login secara real-time
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(!!currentUser);
      setLoading(false); // Selesai mengecek status
    });
    return () => unsubscribe();
  }, []);

  const loginAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Login Admin',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-input1" class="swal2-input" placeholder="Email Admin" style="margin: 0;">
          <input id="swal-input2" type="password" class="swal2-input" placeholder="Password" style="margin: 0;">
        </div>
      `,
      focusConfirm: false,
      background: '#1e293b', // Warna slate-800 agar sesuai tema Mas
      color: '#ffffff',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const email = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const pass = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!email || !pass) {
           Swal.showValidationMessage('Harap isi semua kolom!');
        }
        return [email, pass];
      }
    });

    if (formValues) {
      try {
        await signInWithEmailAndPassword(auth, formValues[0], formValues[1]);
        Swal.fire({ title: "Sukses", text: "Selamat datang kembali, Admin!", icon: "success", timer: 2000 });
      } catch (error) {
        Swal.fire("Gagal", "Akses ditolak. Periksa email & password Anda.", "error");
      }
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      Swal.fire({ title: "Logout", text: "Sesi admin telah diakhiri.", icon: "success", timer: 2000 });
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginAdmin, logoutAdmin }}>
      {/* 3. Hanya tampilkan konten jika Firebase sudah selesai mengecek status user */}
      {!loading ? children : (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-white font-mono uppercase tracking-widest z-[9999]">
           Menghubungkan Server Gerbang Digital...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};