import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Save, Globe, MessageCircle, Type, CreditCard, Link, 
  CheckCircle, AlertCircle, Mail, Image as ImageIcon // ✅ Tambah icon Image
} from 'lucide-react';

const AdminGeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- STATE 1: DATA IDENTITAS (Updated: Ada Email & Logo) ---
  const [generalData, setGeneralData] = useState({
    siteName: '',
    email: '', 
    whatsapp: '',
    footerText: '',
    logoUrl: '' // ✅ Field Baru: Logo URL
  });

  // --- STATE 2: LINK PEMBAYARAN ---
  const [paymentLinks, setPaymentLinks] = useState({
    basic: '',
    premium: '',
    pro: ''
  });

  // 1. Fetch Data saat Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genSnap = await getDoc(doc(db, "content", "general_settings"));
        if (genSnap.exists()) {
            setGeneralData({ ...generalData, ...genSnap.data() });
        }

        const paySnap = await getDoc(doc(db, "content", "payment_links"));
        if (paySnap.exists()) setPaymentLinks(paySnap.data() as any);

      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Simpan Perubahan
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, "content", "general_settings"), generalData);
      await setDoc(doc(db, "content", "payment_links"), paymentLinks);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Gagal menyimpan pengaturan!");
      console.error(e);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in pb-10">
      
      {/* --- BAGIAN 1: IDENTITAS WEBSITE --- */}
      <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-4 mb-6">
          <Globe className="text-blue-400" /> Identitas Website
        </h2>
        
        <div className="grid gap-6">
          {/* Nama Toko */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-2">Nama Toko / Brand</label>
             <div className="relative">
                <Globe className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  value={generalData.siteName} 
                  onChange={(e) => setGeneralData({...generalData, siteName: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="Contoh: Gerbang Digital" 
                />
             </div>
          </div>

          {/* ✅ FIELD BARU: URL LOGO & PREVIEW */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-2">Link Gambar Logo (URL)</label>
             <div className="relative">
                <ImageIcon className="absolute left-4 top-3.5 text-purple-500" size={18} />
                <input 
                  value={generalData.logoUrl} 
                  onChange={(e) => setGeneralData({...generalData, logoUrl: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors" 
                  placeholder="Contoh: https://i.ibb.co/xyz123/logo.png" 
                />
             </div>
             {/* Fitur Pratinjau Logo */}
             {generalData.logoUrl && (
                <div className="mt-3 p-3 bg-slate-900 border border-slate-700 rounded-xl inline-block shadow-inner">
                  <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-wider">Preview Logo:</p>
                  <img src={generalData.logoUrl} alt="Preview Logo" className="h-10 w-auto object-contain drop-shadow-lg" />
                </div>
             )}
          </div>

          {/* Email Official */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-2">Email Official</label>
             <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-pink-500" size={18} />
                <input 
                  value={generalData.email} 
                  onChange={(e) => setGeneralData({...generalData, email: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pink-500 transition-colors" 
                  placeholder="Contoh: admin@gerbangdigital.com" 
                />
             </div>
          </div>

          {/* WhatsApp */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-2">Nomor WhatsApp Admin (Format: 62...)</label>
             <div className="relative">
                <MessageCircle className="absolute left-4 top-3.5 text-green-500" size={18} />
                <input 
                  value={generalData.whatsapp} 
                  onChange={(e) => setGeneralData({...generalData, whatsapp: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors" 
                  placeholder="Contoh: 62812345678" 
                />
             </div>
          </div>

          {/* Footer */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-2">Teks Footer (Copyright)</label>
             <div className="relative">
                <Type className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  value={generalData.footerText} 
                  onChange={(e) => setGeneralData({...generalData, footerText: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="Contoh: © 2026 Gerbang Digital Corp" 
                />
             </div>
          </div>
        </div>
      </div>

      {/* --- BAGIAN 2: PENGATURAN PEMBAYARAN (LINK) --- */}
      <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-4 mb-6">
          <CreditCard className="text-cyan-400" /> Link Pembayaran (Midtrans)
        </h2>
        
        <div className="space-y-6">
          {/* PAKET BASIC */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Link Paket STARTER (Basic)</label>
            <div className="relative">
              <Link className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="https://app.midtrans.com/payment-links/..."
                value={paymentLinks.basic}
                onChange={(e) => setPaymentLinks({...paymentLinks, basic: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* PAKET PREMIUM */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Link Paket BUILDER (Premium)</label>
            <div className="relative">
              <Link className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="https://app.midtrans.com/payment-links/..."
                value={paymentLinks.premium}
                onChange={(e) => setPaymentLinks({...paymentLinks, premium: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* PAKET PRO (VIP) */}
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30">
            <label className="block text-sm font-bold text-yellow-400 mb-2 flex items-center gap-2">
               👑 Link Paket BUSINESS OWNER (VIP)
            </label>
            <div className="relative">
              <Link className="absolute left-4 top-3.5 text-yellow-600" size={18} />
              <input 
                type="text" 
                placeholder="https://app.midtrans.com/payment-links/..."
                value={paymentLinks.pro}
                onChange={(e) => setPaymentLinks({...paymentLinks, pro: e.target.value})}
                className="w-full bg-slate-900 border border-yellow-500/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.1)]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Pastikan link ini aktif dan nominalnya sesuai (Rp 890.000)
            </p>
          </div>
        </div>
      </div>

      {/* --- TOMBOL SIMPAN --- */}
      <div className="sticky bottom-4 z-20 flex justify-end">
         <button 
           type="submit" 
           disabled={loading}
           className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loading ? 'Menyimpan...' : <><Save size={20} /> SIMPAN SEMUA PERUBAHAN</>}
         </button>
      </div>

      {/* Notifikasi Sukses */}
      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-50">
           <CheckCircle size={20} /> Data Berhasil Disimpan!
        </div>
      )}

    </form>
  );
};

export default AdminGeneralSettings;