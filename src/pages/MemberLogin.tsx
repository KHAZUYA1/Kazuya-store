import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Context Bahasa

const MemberLogin = () => {
  const { currentLang } = useLanguage(); // ✅ Ambil bahasa aktif

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- KAMUS BAHASA LOKAL ---
  const text = {
    ID: {
      title: "Portal Member",
      sub: "Silakan login untuk mengakses Modul & Aset Anda.",
      emailPlaceholder: "Email Terdaftar",
      passPlaceholder: "Password",
      btnText: "MASUK",
      btnLoading: "Mengecek Data...",
      errUnverified: "Email Anda belum diverifikasi! Silakan cek Inbox/Spam email Anda dan klik link verifikasi.",
      errAdmin: "Akun Admin terdeteksi. Silakan gunakan halaman Admin Login.",
      errNotFound: "Data akun tidak ditemukan di database.",
      errWrong: "Email atau Password salah!",
      noAccount: "Belum memiliki akun?",
      regHere: "Daftar sekarang"
    },
    EN: {
      title: "Member Portal",
      sub: "Please login to access your Modules & Assets.",
      emailPlaceholder: "Registered Email",
      passPlaceholder: "Password",
      btnText: "LOGIN",
      btnLoading: "Checking Data...",
      errUnverified: "Your email is not verified! Please check your Inbox/Spam and click the verification link.",
      errAdmin: "Admin account detected. Please use the Admin Login page.",
      errNotFound: "Account data not found in the database.",
      errWrong: "Incorrect Email or Password!",
      noAccount: "Don't have an account?",
      regHere: "Register now"
    }
  };

  const lang = currentLang === 'EN' ? 'EN' : 'ID';
  const t = text[lang];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError(t.errUnverified);
        setLoading(false);
        return; 
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.role === "admin") {
           setError(t.errAdmin);
           setLoading(false);
           return;
        }

        window.location.href = "/member-area"; 
      } else {
        setError(t.errNotFound);
      }

    } catch (err: any) {
      console.error("Error login:", err);
      setError(t.errWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">G</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{t.sub}</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl mb-6 text-sm font-bold bg-red-100 text-red-700 border border-red-200 flex items-start gap-2">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="email" 
              required 
              placeholder={t.emailPlaceholder} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" 
              required 
              placeholder={t.passPlaceholder} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 md:hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? t.btnLoading : <>{t.btnText} <LogIn size={18} /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.noAccount} <br className="md:hidden" />
              <a href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1">{t.regHere}</a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;