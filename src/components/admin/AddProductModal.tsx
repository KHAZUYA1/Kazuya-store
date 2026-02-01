import { useState, useMemo } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
// Hapus import storage karena tidak dipakai lagi
import { db } from '../../lib/firebase'; 

// IMPORT EDITOR WORD
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// IMPORT SWEETALERT2
import Swal from 'sweetalert2';

// DEFINISI KATEGORI
const CATEGORIES = [
  "🏠 Semua",
  "🎬 Streaming",
  "🎮 Gaming",
  "💻 Source Code",
  "🚗 Otomotif",
  "👟 Gaya Hidup",
  "💼 Bisnis",
  "🥗 Kesehatan",
  "🖥️ IT & Software",
  "📚 Pendidikan",
  "📈 Marketing",
  "🎨 Desain",
  "💰 Keuangan",
  "📸 Foto & Video",
  "⚙️ Development",
  "🎵 Musik",
  "📦 Lainnya"
];

interface AddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddProductModal = ({ onClose, onSuccess }: AddModalProps) => {
  const [loading, setLoading] = useState(false);
  
  // State untuk input link galeri sementara sebelum di-add
  const [tempGalleryUrl, setTempGalleryUrl] = useState('');

  // STATE INITIALIZATION
  const [formData, setFormData] = useState({ 
    name: '',
    price: 0,
    category: '',
    image: '', // Ini sekarang string URL manual
    images: [] as string[], 
    description: '',
    videoUrl: '',
    paymentLink: '',
    isVisible: true,
    isBestSeller: false
  });

  // CONFIG TOOLBAR
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'], 
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      [{ 'color': [] }, { 'background': [] }], 
      [{ 'align': [] }], 
      ['link', 'clean'] 
    ],
  }), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  // LOGIKA TAMBAH FOTO GALERI DARI LINK
  const handleAddGalleryImage = () => {
    if (!tempGalleryUrl) return;
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, tempGalleryUrl]
    }));
    setTempGalleryUrl(''); // Reset input sementara
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // SUBMIT DATA BARU
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Belum Lengkap',
            text: 'Nama dan Harga wajib diisi!',
            background: '#1e293b',
            color: '#fff'
        });
        return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        image: formData.image, // URL langsung dari input
        images: formData.images || [], 
        description: formData.description || '',
        videoUrl: formData.videoUrl || "",
        paymentLink: formData.paymentLink || "",
        isBestSeller: formData.isBestSeller || false,
        isVisible: formData.isVisible,
        timestamp: serverTimestamp()
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk baru telah ditambahkan.',
        background: '#1e293b', 
        color: '#fff', 
        confirmButtonColor: '#0891b2' 
      });
      
      onSuccess(); 
      onClose();
      
    } catch (error) {
      console.error("Add error", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat membuat produk.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 shadow-2xl">
        <div className="sticky top-0 bg-[#1e293b] z-10 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">➕ Tambah Produk Baru (Link)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* BAGIAN 1: FOTO UTAMA (LINK) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Foto Utama (Link URL)</label>
            <div className="flex gap-4 items-start">
              {/* Preview Box */}
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-1">No Preview</div>
                )}
              </div>
              
              {/* Input Link */}
              <div className="flex-1">
                <input 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none mb-2" 
                  placeholder="https://imgur.com/foto.jpg" 
                />
                <p className="text-[10px] text-gray-500">*Pastikan link berakhiran .jpg / .png / .webp agar gambar muncul.</p>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: GALERI FOTO (LINK) */}
          <div className="p-4 bg-black/20 rounded-xl border border-gray-700/50">
            <label className="block text-sm font-bold text-cyan-400 mb-3">📸 Galeri Foto (Slide)</label>
            
            {/* Input untuk tambah link galeri */}
            <div className="flex gap-2 mb-4">
                <input 
                  value={tempGalleryUrl} 
                  onChange={(e) => setTempGalleryUrl(e.target.value)}
                  className="flex-1 bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none text-sm" 
                  placeholder="Paste link gambar tambahan disini..." 
                />
                <button 
                  type="button" 
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2 bg-slate-700 hover:bg-cyan-600 text-white rounded-lg text-sm transition font-bold"
                >
                  + Add
                </button>
            </div>

            {/* Grid Preview Galeri */}
            {formData.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-gray-600">
                      <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                    </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500 text-xs italic text-center py-2">Belum ada foto galeri tambahan.</p>
            )}
          </div>

          {/* INPUT FIELDS LAINNYA (SAMA SEPERTI SEBELUMNYA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Nama Produk</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required placeholder="Contoh: Netflix Premium" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Harga (Rp)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required placeholder="Contoh: 35000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none">
                    <option value="" disabled className="bg-[#1e293b] text-gray-500">Pilih Kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1e293b] text-white">
                        {cat}
                      </option>
                    ))}
                </select>
             </div>
             <div>
                <label className="text-xs text-gray-400">Video URL (YouTube)</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" placeholder="https://youtube.com/..." />
             </div>
          </div>

          <div>
             <label className="text-xs text-gray-400">Link Pembayaran (Lynk.id / WA)</label>
             <input name="paymentLink" value={formData.paymentLink} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" placeholder="Kosongkan jika ingin auto ke WA" />
          </div>

          {/* EDITOR WORD */}
          <div>
             <label className="text-xs text-gray-400 mb-2 block">Deskripsi Lengkap (Word Editor)</label>
             <div className="bg-white text-black rounded-lg overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  value={formData.description} 
                  onChange={handleDescriptionChange}
                  modules={modules}
                  className="h-64 mb-10 text-black" 
                  placeholder="Tulis deskripsi produk yang menarik..."
                />
             </div>
          </div>

          {/* CHECKBOX SECTION */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-700/50 mt-4">
              
              {/* Checkbox Best Seller */}
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    name="isBestSeller" 
                    checked={formData.isBestSeller} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))} 
                    id="bestSeller" 
                    className="w-5 h-5 rounded border-gray-500 bg-black/30 text-cyan-600 focus:ring-cyan-500 cursor-pointer" 
                 />
                 <label htmlFor="bestSeller" className="text-white text-sm cursor-pointer font-medium select-none">
                    Jadikan Best Seller ⭐
                 </label>
              </div>

              {/* Checkbox Tampilkan Produk */}
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    name="isVisible" 
                    checked={formData.isVisible} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))} 
                    id="isVisible" 
                    className="w-5 h-5 rounded border-gray-500 bg-black/30 text-green-600 focus:ring-green-500 cursor-pointer" 
                 />
                 <label htmlFor="isVisible" className="text-white text-sm cursor-pointer font-medium select-none">
                    Tampilkan Produk 👁️
                 </label>
              </div>
              
          </div>

          <div className="pt-4 border-t border-gray-700 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg transition disabled:opacity-50">
                {loading ? "Menyimpan..." : "Buat Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;