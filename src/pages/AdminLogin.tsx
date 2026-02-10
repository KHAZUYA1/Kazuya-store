import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const { loginAdmin } = useAuth(); // Ambil fungsi login dari context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Panggil fungsi login (akan trigger popup Google atau Email login sesuai setting Anda)
      await loginAdmin(); 
      // Jika berhasil, AuthContext akan otomatis update state 'user'
      // dan AdminDashboard akan otomatis me-render dashboard.
    } catch (err) {
      setError('Gagal login. Pastikan Anda adalah admin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 w-full max-w-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Access</h2>
          <p className="text-slate-400 text-sm mt-2">Masuk untuk mengelola Gerbang Digital</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        {/* Tombol Login Simpel (Pemicu Google Auth) */}
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-pulse">Memproses...</span>
          ) : (
            <>
              <User size={20} /> MASUK SEBAGAI ADMIN
            </>
          )}
        </button>

        <p className="text-center text-slate-600 text-xs mt-8">
          Hanya personnel berwenang yang diizinkan lewat titik ini.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;