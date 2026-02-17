import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Smartphone, Monitor, Save, Plus, Trash2, Edit, X } from 'lucide-react';

// Tipe data Slide
interface SlideItem {
  image: string;
  title: string;
}

const AdminHeroManager = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoOrientation, setVideoOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [modalForm, setModalForm] = useState<SlideItem>({ image: '', title: '' });

  // 1. Ambil Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "content", "hero_sections");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setYoutubeUrl(data.youtubeUrl || '');
          setVideoOrientation(data.videoOrientation || 'landscape'); // Ambil orientasi
          setSlides(data.carouselImages || []);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  // 2. Simpan ke Firebase
  const saveToFirebase = async (newUrl: string, newOrientation: string, newSlides: SlideItem[]) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "content", "hero_sections"), {
        youtubeUrl: newUrl,
        videoOrientation: newOrientation, // Simpan orientasi
        carouselImages: newSlides
      });
      setYoutubeUrl(newUrl);
      // @ts-ignore
      setVideoOrientation(newOrientation);
      setSlides(newSlides);
      alert("✅ Data Hero & Carousel berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Tombol Simpan Video & Orientasi
  const handleSaveVideoSettings = () => saveToFirebase(youtubeUrl, videoOrientation, slides);

  // Handler Simpan Slide (Modal)
  const handleSaveModal = async () => {
    if (!modalForm.image || !modalForm.title) return alert("Isi lengkap dulu!");
    let updated = [...slides];
    if (editIndex !== null) updated[editIndex] = modalForm;
    else updated.push(modalForm);
    
    await saveToFirebase(youtubeUrl, videoOrientation, updated);
    setIsModalOpen(false);
  };

  // Handler Hapus Slide
  const handleDelete = async (index: number) => {
    if (confirm("Hapus slide ini?")) {
      const updated = slides.filter((_, i) => i !== index);
      await saveToFirebase(youtubeUrl, videoOrientation, updated);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in text-white max-w-5xl mx-auto">
      
      {/* SECTION 1: SETTING VIDEO UTAMA */}
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
          🎬 Setting Video Utama
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input URL */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-400">Link YouTube Video</label>
            <input 
              value={youtubeUrl} 
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste Link YouTube di sini..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 focus:border-blue-500 outline-none text-white transition-all"
            />
            <p className="text-xs text-slate-500">Contoh: https://youtube.com/watch?v=dQw4w9WgXcQ</p>
          </div>

          {/* Pilihan Orientasi */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-400">Orientasi Tampilan Video</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Pilihan Landscape */}
              <button
                onClick={() => setVideoOrientation('landscape')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  videoOrientation === 'landscape' 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                    : 'border-slate-600 bg-slate-900 text-slate-500 hover:border-slate-500'
                }`}
              >
                <Monitor size={32} />
                <span className="font-bold text-sm">Landscape (16:9)</span>
                <span className="text-[10px] opacity-60">Cocok untuk Desktop/PC</span>
              </button>

              {/* Pilihan Portrait */}
              <button
                onClick={() => setVideoOrientation('portrait')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  videoOrientation === 'portrait' 
                    ? 'border-pink-500 bg-pink-500/10 text-pink-400' 
                    : 'border-slate-600 bg-slate-900 text-slate-500 hover:border-slate-500'
                }`}
              >
                <Smartphone size={32} />
                <span className="font-bold text-sm">Portrait (9:16)</span>
                <span className="text-[10px] opacity-60">Cocok untuk HP/TikTok Style</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Simpan Video */}
        <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
          <button 
            onClick={handleSaveVideoSettings} 
            disabled={loading} 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save size={20} />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan Video'}
          </button>
        </div>
      </div>

      {/* SECTION 2: CAROUSEL GAMBAR */}
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-green-400 flex items-center gap-3">
              🖼️ Gambar Carousel
            </h3>
            <p className="text-slate-400 text-sm mt-1">Upload gambar portofolio atau layanan Anda di sini.</p>
          </div>
          <button 
            onClick={() => { setEditIndex(null); setModalForm({image:'', title:''}); setIsModalOpen(true); }} 
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} /> Tambah Slide Baru
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {slides.map((item, index) => (
            <div key={index} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 group relative hover:border-blue-500/50 transition-all shadow-lg hover:shadow-2xl">
              {/* Gambar */}
              <div className="relative aspect-video overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button 
                    onClick={() => { setEditIndex(index); setModalForm(item); setIsModalOpen(true); }} 
                    className="p-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-transform hover:scale-110" 
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(index)} 
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-transform hover:scale-110" 
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Judul */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <p className="font-bold text-white line-clamp-1" title={item.title}>{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{item.image}</p>
              </div>
            </div>
          ))}

          {/* Tombol Tambah (Placeholder jika kosong) */}
          {slides.length === 0 && (
            <div 
              onClick={() => { setEditIndex(null); setModalForm({image:'', title:''}); setIsModalOpen(true); }}
              className="border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center h-48 cursor-pointer hover:border-green-500 hover:bg-slate-700/30 transition-all group"
            >
              <div className="p-4 rounded-full bg-slate-700 group-hover:bg-green-500/20 group-hover:text-green-400 mb-3 transition-colors">
                <Plus size={32} />
              </div>
              <p className="font-bold text-slate-400 group-hover:text-green-400">Belum ada slide</p>
              <p className="text-xs text-slate-600">Klik untuk menambahkan</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL POPUP (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editIndex !== null ? <Edit size={20} className="text-yellow-500" /> : <Plus size={20} className="text-green-500" />}
                {editIndex !== null ? 'Edit Slide' : 'Tambah Slide Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {/* Body Modal */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">Judul Slide</label>
                <input 
                  placeholder="Contoh: Jasa Pembuatan Website" 
                  value={modalForm.title} 
                  onChange={e => setModalForm({...modalForm, title: e.target.value})}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none text-white placeholder-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">URL Gambar</label>
                <input 
                  placeholder="Paste link gambar di sini..." 
                  value={modalForm.image} 
                  onChange={e => setModalForm({...modalForm, image: e.target.value})}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none text-white placeholder-slate-600"
                />
                {modalForm.image && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-700 h-32 w-full bg-black/50 flex items-center justify-center">
                    <img src={modalForm.image} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveModal} 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroManager;