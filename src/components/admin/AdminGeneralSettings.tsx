import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminGeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    whatsapp: '',
    footerText: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "content", "general_settings"));
      if (docSnap.exists()) setFormData(docSnap.data() as any);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "content", "general_settings"), formData);
      alert("✅ Pengaturan Umum Disimpan!");
    } catch (e) { alert("Gagal menyimpan"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-white space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold border-b border-slate-600 pb-4">⚙️ Pengaturan Umum</h2>
      <div className="grid gap-4">
        <div>
            <label className="block text-blue-400 font-bold mb-1">Nama Toko</label>
            <input value={formData.siteName} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-600 rounded" placeholder="Gerbang Digital" />
        </div>
        <div>
            <label className="block text-green-400 font-bold mb-1">WhatsApp Admin (62...)</label>
            <input value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-600 rounded" placeholder="62812345678" />
        </div>
        <div>
            <label className="block text-gray-400 font-bold mb-1">Teks Footer</label>
            <input value={formData.footerText} onChange={(e) => setFormData({...formData, footerText: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-600 rounded" placeholder="© 2026 Gerbang Digital" />
        </div>
      </div>
      <button onClick={handleSave} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold mt-4">
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
};

export default AdminGeneralSettings;