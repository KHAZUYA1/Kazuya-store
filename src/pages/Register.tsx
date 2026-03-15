import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Context Bahasa

const Register = () => {
  const { currentLang } = useLanguage(); // ✅ Ambil bahasa yang sedang aktif
  
  const [formData, setFormData] = useState({ nama: '', email: '', wa: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // --- KAMUS BAHASA LOKAL ---
  const text = {
    ID: {
      title: "Buat Akun Gerbang Digital",
      sub: "Daftar sekarang untuk mengakses Modul Gratis.",
      namePlaceholder: "Nama Lengkap",
      emailPlaceholder: "Email Aktif (Wajib)",
      waPlaceholder: "Nomor WhatsApp (Contoh: 0812...)",
      passPlaceholder: "Buat Password (Minimal 6 Karakter)",
      confirmPlaceholder: "Ulangi Password Anda",
      btnText: "DAFTAR SEKARANG",
      btnLoading: "Memproses Data...",
      errNotMatch: "Pendaftaran Gagal: Konfirmasi Password tidak cocok!",
      msgSuccess: "Pendaftaran Berhasil! Silakan cek Inbox atau folder Spam Email Anda untuk klik link verifikasi.",
      msgFail: "Gagal mendaftar: ",
      haveAccount: "Sudah punya akun?",
      loginHere: "Login di sini"
    },
    EN: {
      title: "Create Digital Account",
      sub: "Register now to access Free Modules.",
      namePlaceholder: "Full Name",
      emailPlaceholder: "Active Email (Required)",
      waPlaceholder: "WhatsApp Number (Example: +62812...)",
      passPlaceholder: "Create Password (Min. 6 Characters)",
      confirmPlaceholder: "Repeat Your Password",
      btnText: "REGISTER NOW",
      btnLoading: "Processing Data...",
      errNotMatch: "Registration Failed: Passwords do not match!",
      msgSuccess: "Registration Successful! Please check your Inbox or Spam folder to click the verification link.",
      msgFail: "Registration Failed: ",
      haveAccount: "Already have an account?",
      loginHere: "Login here"
    }
  };

  // Tentukan kamus mana yang dipakai (Default ID)
  const lang = currentLang === 'EN' ? 'EN' : 'ID';
  const t = text[lang];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    // Validasi Password Cocok
    if (formData.password !== confirmPassword) {
      setMessage(t.errNotMatch);
      setLoading(false);
      return; 
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nama: formData.nama,
        email: formData.email,
        wa: formData.wa,
        role: "member", 
        status_bayar: "belum", 
        createdAt: new Date().toISOString()
      });

      setMessage(t.msgSuccess);
      setIsSuccess(true);
      
      setFormData({ nama: '', email: '', wa: '', password: '' });
      setConfirmPassword(''); 

    } catch (error: any) {
      console.error("Error pendaftaran:", error);
      setMessage(t.msgFail + error.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 mt-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{t.sub}</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-start gap-2 ${isSuccess ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="text" required placeholder={t.namePlaceholder} value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="email" required placeholder={t.emailPlaceholder} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="text" required placeholder={t.waPlaceholder} value={formData.wa} onChange={(e) => setFormData({...formData, wa: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="password" required placeholder={t.passPlaceholder} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="password" required placeholder={t.confirmPlaceholder} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all flex justify-center items-center gap-2 mt-4 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? t.btnLoading : <>{t.btnText} <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          {t.haveAccount} <a href="/login" className="text-blue-600 font-bold hover:underline">{t.loginHere}</a>
        </p>
      </div>
    </div>
  );
};

export default Register;