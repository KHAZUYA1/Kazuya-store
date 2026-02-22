import { useState, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
// Hapus import storage karena tidak dipakai
import { db } from '../../lib/firebase';
import type { Product } from '../../types';

// IMPORT EDITOR WORD (VERSI BARU - ANTI CRASH)
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// IMPORT SWEETALERT2
import Swal from 'sweetalert2';

// 1. DEFINISI KATEGORI (DIUBAH MENJADI OBJECT)
// Key adalah nilai yang disimpan di DB, Value adalah teks tampilan di UI
const CATEGORIES: Record<string, string> = {
  "semua": "🏠 Semua",
  "streaming": "🎬 Streaming",
  "gaming": "🎮 Gaming",
  "code": "💻 Source Code",
  "automotive": "🚗 Otomotif",
  "lifestyle": "👟 Gaya Hidup",
  "business": "💼 Bisnis",
  "health": "🥗 Kesehatan",
  "it-software": "🖥️ IT & Software",
  "teaching": "📚 Pendidikan",
  "marketing": "📈 Marketing",
  "design": "🎨 Desain",
  "finance": "💰 Keuangan",
  "photo-video": "📸 Foto & Video",
  "development": "⚙️ Development",
  "music": "🎵 Musik",
  "other": "📦 Lainnya"
};

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal = ({ product, onClose, onSuccess }: EditModalProps) => {
  const [loading, setLoading] = useState(false);
  
  // State sementara untuk input link galeri baru
  const [tempGalleryUrl, setTempGalleryUrl] = useState('');

  // 2. STATE INITIALIZATION
  // Lakukan normalisasi awal jika kategori lama masih memakai format dengan emoji
  const normalizeCategory = (catStr: string) => {
      if (!catStr) return '';
      const safeCat = catStr.toLowerCase();
      if (safeCat.includes('pendidikan') || safeCat.includes('teaching')) return 'teaching';
      if (safeCat.includes('desain') || safeCat.includes('design')) return 'design';
      if (safeCat.includes('foto') || safeCat.includes('video')) return 'photo-video';
      if (safeCat.includes('web') || safeCat.includes('code')) return 'code';
      if (safeCat.includes('produk digital') || safeCat.includes('software')) return 'it-software';
      if (safeCat.includes('ev') || safeCat.includes('auto')) return 'automotive';
      if (safeCat.includes('bisnis') || safeCat.includes('business')) return 'business';
      if (safeCat.includes('lainnya') || safeCat.includes('other')) return 'other';
      return catStr; // Kembalikan string asli jika tidak ada yang cocok
  };

  const [formData, setFormData] = useState({ 
    ...product,
    image: product.image || '', // Pastikan string kosong jika null
    description: product.description || '', 
    images: product.images || [], 
    videoUrl: product.videoUrl || '',
    paymentLink: product.paymentLink || '',
    category: normalizeCategory(product.category), // Normalisasi nilai kategori awal
    isVisible: product.isVisible ?? true, 
    isBestSeller: product.isBestSeller || false,
    fakePrice: product.fakePrice || 0 // NEW: Load fakePrice lama atau 0
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
      [name]: (name === 'price' || name === 'fakePrice') ? Number(value) : value
    }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  // LOGIKA BARU: Tambah gambar ke galeri dari Link
  const handleAddGalleryImage = () => {
    if (!tempGalleryUrl) return;
    
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), tempGalleryUrl]
    }));
    setTempGalleryUrl(''); // Reset input
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productRef = doc(db, "products", product.id);
      
      await updateDoc(productRef, {
        name: formData.name,
        price: formData.price,
        fakePrice: formData.fakePrice || 0, // NEW: Update fakePrice
        category: formData.category,
        image: formData.image, // URL Text
        images: formData.images || [], 
        description: formData.description || '',
        videoUrl: formData.videoUrl || "",
        paymentLink: formData.paymentLink || "",
        isBestSeller: formData.isBestSeller || false,
        isVisible: formData.isVisible
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data produk telah diperbarui.',
        background: '#1e293b', 
        color: '#fff', 
        confirmButtonColor: '#0891b2'
      });
      
      onSuccess(); 
      onClose();
      
    } catch (error) {
      console.error("Update error", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
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
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 shadow-2xl custom-scrollbar">
        <div className="sticky top-0 bg-[#1e293b] z-10 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">✏️ Edit Produk (Link URL)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* FOTO UTAMA (LINK URL) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Foto Utama (Link URL)</label>
            <div className="flex gap-4 items-start">
              {/* Preview Box */}
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center">No Img</div>
                )}
              </div>
              
              {/* Input Link */}
              <div className="flex-1">
                <input 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none mb-2" 
                  placeholder="Paste link gambar utama disini..." 
                />
                 <p className="text-[10px] text-gray-500">*Ganti link di atas untuk mengubah foto cover.</p>
              </div>
            </div>
          </div>

          {/* GALERI FOTO (LINK URL) */}
          <div className="p-4 bg-black/20 rounded-xl border border-gray-700/50">
            <label className="block text-sm font-bold text-cyan-400 mb-3">📸 Galeri Foto (Slide)</label>
            
            {/* Input Tambah Galeri */}
            <div className="flex gap-2 mb-4">
                <input 
                  value={tempGalleryUrl} 
                  onChange={(e) => setTempGalleryUrl(e.target.value)}
                  className="flex-1 bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none text-sm" 
                  placeholder="Paste link gambar tambahan..." 
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
            <div className="grid grid-cols-4 gap-3">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-gray-600">
                  <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Err')} />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* INPUT FIELDS (HARGA DIUPDATE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Nama Produk</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required />
            </div>
            
            {/* HARGA */}
            <div className="space-y-2">
                <div>
                   <label className="text-xs text-gray-400">Harga Jual (Rp)</label>
                   <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required />
                </div>
                
                {/* NEW: Input Harga Coret */}
                <div>
                   <label className="text-xs text-red-400">Harga Coret / Asli (Opsional)</label>
                   <input name="fakePrice" type="number" value={formData.fakePrice} onChange={handleChange} className="w-full bg-black/30 border border-red-500/50 rounded p-2 text-gray-400 line-through focus:border-red-500 outline-none" placeholder="0" />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none">
                    <option value="" disabled>Pilih Kategori</option>
                    {/* Render opsi kategori dengan memisahkan value dan label */}
                    {Object.entries(CATEGORIES).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                </select>
             </div>
             <div>
                <label className="text-xs text-gray-400">Video URL (YouTube)</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" />
             </div>
          </div>

          <div>
             <label className="text-xs text-gray-400">Link Pembayaran (Lynk.id / WA)</label>
             <input name="paymentLink" value={formData.paymentLink} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" />
          </div>

          {/* EDITOR WORD */}
          <div>
             <label className="text-xs text-gray-400 mb-2 block">Deskripsi Lengkap (Word Editor)</label>
             <div className="bg-white text-black rounded-lg overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  value={formData.description || ''} 
                  onChange={handleDescriptionChange}
                  modules={modules}
                  className="h-64 mb-10 text-black" 
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
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;