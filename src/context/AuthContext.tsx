import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth"; 
import { auth } from "../lib/firebase";
import Swal from "sweetalert2";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginAdmin: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ KUNCI ADMIN UTAMA MAS YUDA
const MASTER_ADMIN_EMAIL = "pamungkas.blue@gmail.com";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // ✅ Cek apakah email yang login adalah email Mas Yuda
      setIsAdmin(currentUser?.email === MASTER_ADMIN_EMAIL);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Admin Gatekeeper',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-input1" class="swal2-input" placeholder="Email Admin" style="margin: 0;">
          <input id="swal-input2" type="password" class="swal2-input" placeholder="Password" style="margin: 0;">
        </div>
      `,
      focusConfirm: false,
      background: '#0f172a',
      color: '#ffffff',
      confirmButtonColor: '#0ea5e9',
      preConfirm: () => {
        const email = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const pass = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!email || !pass) {
           Swal.showValidationMessage('Harap isi email & password!');
        }
        return [email, pass];
      }
    });

    if (formValues) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formValues[0], formValues[1]);
        // Validasi tambahan setelah login
        if (userCredential.user.email !== MASTER_ADMIN_EMAIL) {
           await signOut(auth); // Langsung logout jika bukan email master
           throw new Error("Anda bukan Admin resmi!");
        }
        Swal.fire({ title: "Akses Diterima", icon: "success", timer: 1500 });
      } catch (error: any) {
        Swal.fire("Gagal", error.message || "Email atau Password salah!", "error");
      }
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Refresh & balik ke home
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginAdmin, logoutAdmin }}>
      {!loading ? children : (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-cyan-500 z-[9999]">
           Loading System...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};