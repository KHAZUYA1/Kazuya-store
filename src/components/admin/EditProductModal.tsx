import { useState, useRef, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import type { Product } from '../../types';

// IMPORT EDITOR WORD (VERSI BARU - ANTI CRASH)
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// IMPORT SWEETALERT2 (Wajib install: npm install sweetalert2)
import Swal from 'sweetalert2';

// 1. DEFINISI KATEGORI
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

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal = ({ product, onClose, onSuccess }: EditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // 2. STATE INITIALIZATION
  const [formData, setFormData] = useState({ 
    ...product,
    description: product.description || '', 
    images: product.images || [], 
    videoUrl: product.videoUrl || '',
    paymentLink: product.paymentLink || '',
    isVisible: product.isVisible ?? true, 
    isBestSeller: product.isBestSeller || false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Upload failed", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal upload foto utama!',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `products/gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (error) {
      console.error("Gallery upload failed", error);
    } finally {
      setUploading(false);
    }
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
        category: formData.category,
        image: formData.image,
        images: formData.images || [], 
        description: formData.description || '',
        videoUrl: formData.videoUrl || "",
        paymentLink: formData.paymentLink || "",
        isBestSeller: formData.isBestSeller || false,
        isVisible: formData.isVisible
      });
      
      // ✅ OPSI B: SWEETALERT2 (Sesuai Request)
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data produk telah diperbarui.',
        background: '#1e293b', // Warna background dark mode
        color: '#fff', // Warna teks putih
        confirmButtonColor: '#0891b2' // Warna tombol cyan
      });
      
      onSuccess(); 
      onClose();
      
    } catch (error) {
      console.error("Update error", error);
      
      // Error alert juga kita bikin estetik sekalian
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444' // Warna merah
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 shadow-2xl">
        <div className="sticky top-0 bg-[#1e293b] z-10 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">✏️ Edit Produk Lengkap</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* FOTO UTAMA */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Foto Utama (Cover)</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Img</div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} className="hidden" accept="image/*" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition">
                {uploading ? "Uploading..." : "Ganti Foto Utama"}
              </button>
            </div>
          </div>

          {/* GALERI FOTO */}
          <div className="p-4 bg-black/20 rounded-xl border border-gray-700/50">
            <label className="block text-sm font-bold text-cyan-400 mb-3">📸 Galeri Foto (Slide)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-gray-600">
                  <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={uploading} className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-500 transition gap-1">
                <span className="text-2xl">+</span><span className="text-[10px]">Tambah</span>
              </button>
            </div>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" accept="image/*" multiple />
          </div>

          {/* INPUT FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Nama Produk</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required />
            </div>
            <div>
              <label className="text-xs text-gray-400">Harga (Rp)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none">
                    <option value="" disabled>Pilih Kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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
            <button type="submit" disabled={loading || uploading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg transition disabled:opacity-50">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;