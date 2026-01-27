import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Tipe data Slide
interface SlideItem {
  image: string;
  title: string;
}

const AdminHeroManager = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
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
          setSlides(data.carouselImages || []);
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  // 2. Simpan ke Firebase
  const saveToFirebase = async (newUrl: string, newSlides: SlideItem[]) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "content", "hero_sections"), {
        youtubeUrl: newUrl,
        carouselImages: newSlides
      });
      setYoutubeUrl(newUrl);
      setSlides(newSlides);
      alert("✅ Data Hero & Carousel berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Tombol
  const handleSaveVideo = () => saveToFirebase(youtubeUrl, slides);

  const handleSaveModal = async () => {
    if (!modalForm.image || !modalForm.title) return alert("Isi lengkap dulu!");
    let updated = [...slides];
    if (editIndex !== null) updated[editIndex] = modalForm;
    else updated.push(modalForm);
    
    await saveToFirebase(youtubeUrl, updated);
    setIsModalOpen(false);
  };

  const handleDelete = async (index: number) => {
    if (confirm("Hapus slide ini?")) {
      const updated = slides.filter((_, i) => i !== index);
      await saveToFirebase(youtubeUrl, updated);
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in text-white">
      {/* SECTION VIDEO */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🎬 Setting Video Utama</h3>
        <div className="flex gap-4">
          <input 
            value={youtubeUrl} 
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Link YouTube (cth: https://youtube.com/...)"
            className="flex-1 p-3 rounded bg-slate-900 border border-slate-600 focus:border-blue-500 outline-none"
          />
          <button onClick={handleSaveVideo} disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold">
            {loading ? '...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* SECTION CAROUSEL */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold border-l-4 border-green-500 pl-3">🖼️ Gambar Carousel</h3>
          <button onClick={() => { setEditIndex(null); setModalForm({image:'', title:''}); setIsModalOpen(true); }} 
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-bold shadow-lg">
            + Tambah Slide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slides.map((item, index) => (
            <div key={index} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group relative">
              <img src={item.image} className="w-full h-40 object-cover" alt={item.title} />
              <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center gap-2">
                <button onClick={() => { setEditIndex(index); setModalForm(item); setIsModalOpen(true); }} className="p-2 bg-yellow-500 text-black rounded-full">✏️</button>
                <button onClick={() => handleDelete(index)} className="p-2 bg-red-600 text-white rounded-full">🗑️</button>
              </div>
              <div className="p-3">
                <p className="font-bold text-lg">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-xl font-bold">{editIndex !== null ? 'Edit Slide' : 'Tambah Slide'}</h3>
            <input 
              placeholder="Judul Layanan" 
              value={modalForm.title} 
              onChange={e => setModalForm({...modalForm, title: e.target.value})}
              className="w-full p-3 rounded bg-slate-800 border border-slate-600"
            />
            <input 
              placeholder="URL Gambar" 
              value={modalForm.image} 
              onChange={e => setModalForm({...modalForm, image: e.target.value})}
              className="w-full p-3 rounded bg-slate-800 border border-slate-600"
            />
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">Batal</button>
              <button onClick={handleSaveModal} className="px-6 py-2 bg-green-600 rounded font-bold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroManager;