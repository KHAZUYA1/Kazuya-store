import { useState, useRef, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import type { Product } from '../../types';

// IMPORT EDITOR WORD
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// IMPORT SWEETALERT2
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
  
  // STATE FULL SCREEN
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // STATE DATA
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
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) { Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal upload foto utama!', background: '#1e293b', color: '#fff' }); } finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
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
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newUrls] }));
    } catch (error) { console.error("Gallery upload failed", error); } finally { setUploading(false); }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, index) => index !== indexToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateDoc(doc(db, "products", product.id), {
        ...formData, images: formData.images || [], description: formData.description || ''
      });
      await Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Produk diperbarui.', background: '#1e293b', color: '#fff', confirmButtonColor: '#0891b2' });
      onSuccess(); onClose();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan.', background: '#1e293b', color: '#fff', confirmButtonColor: '#ef4444' });
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        
        {/* HEADER FIXED */}
        <div className="sticky top-0 bg-[#1e293b] z-10 px-6 py-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white">✏️ Edit Produk Lengkap</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        {/* BODY SCROLLABLE */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* FOTO & GALERI */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Foto Utama</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-black rounded border border-gray-600 flex-shrink-0 overflow-hidden">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-gray-500 h-full flex items-center justify-center">No Img</div>}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-700 rounded text-white text-sm hover:bg-slate-600">{uploading ? "..." : "Ganti Foto"}</button>
              <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="p-4 bg-black/20 rounded-xl border border-gray-700/50">
            <label className="block text-sm font-bold text-cyan-400 mb-3">📸 Galeri Foto</label>
            <div className="grid grid-cols-4 gap-2">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-black rounded overflow-hidden border border-gray-600">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-600 w-6 h-6 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-600 rounded flex flex-col items-center justify-center text-gray-500 hover:text-white">+</button>
            </div>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" multiple />
          </div>

          {/* INPUT DATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-400">Nama Produk</label><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" required /></div>
            <div><label className="text-xs text-gray-400">Harga (Rp)</label><input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" required /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white">
                    <option value="" disabled>Pilih Kategori</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
             <div><label className="text-xs text-gray-400">Video URL (YouTube)</label><input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" /></div>
          </div>
          <div><label className="text-xs text-gray-400">Link Pembayaran</label><input name="paymentLink" value={formData.paymentLink} onChange={handleChange} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" /></div>

          {/* --- EDITOR WORD (PERBAIKAN CSS TINGGI & FULLSCREEN) --- */}
          <div>
             <div className="flex justify-between items-end mb-2">
                <label className="text-xs text-gray-400 block">Deskripsi Lengkap</label>
                <button type="button" onClick={() => setIsFullscreen(!isFullscreen)} className="text-[10px] bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded flex items-center gap-1 transition shadow border border-cyan-400">
                  {isFullscreen ? '↩️ Keluar Full Screen' : '⛶ Buka Full Screen'}
                </button>
             </div>
             
             {/* WADAH EDITOR */}
             <div className={
                isFullscreen 
                  ? "fixed inset-0 z-[100000] bg-white text-black flex flex-col w-screen h-screen p-0 animate-fade-in" // Full Screen Mentok
                  : "bg-white text-black rounded-lg overflow-hidden flex flex-col h-[400px] transition-all border border-gray-600" // Mode Normal
             }>
                {isFullscreen && (
                  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
                    <h3 className="font-bold text-lg text-gray-800">📝 Mode Edit Layar Penuh</h3>
                    <button type="button" onClick={() => setIsFullscreen(false)} className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-500 font-bold shadow">Tutup</button>
                  </div>
                )}

                {/* CSS INJECTION KHUSUS: MEMAKSA AREA KETIK PUTIH SAMPAI BAWAH */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <style>
                      {`
                        /* Memaksa container Quill mengisi sisa ruang */
                        .quill { height: 100% !important; display: flex; flex-direction: column; }
                        
                        /* Memaksa area ketik (putih) mengisi 100% tinggi, tidak cuma separuh */
                        .ql-container { flex: 1 !important; display: flex; flex-direction: column; overflow: hidden; height: 100% !important; }
                        
                        /* Membuat editor scrollable dan canvasnya putih full */
                        .ql-editor { flex: 1; overflow-y: auto; height: 100% !important; min-height: 100%; padding-bottom: 50px; background-color: white; }
                        
                        /* Toolbar tetap di atas */
                        .ql-toolbar { flex-shrink: 0; background: #f8f9fa; border-bottom: 1px solid #ddd; z-index: 10; }
                      `}
                    </style>
                    <ReactQuill 
                      theme="snow"
                      value={formData.description || ''} 
                      onChange={handleDescriptionChange}
                      modules={modules}
                      className="h-full flex flex-col" 
                    />
                </div>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-700/50 mt-4">
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))} className="w-5 h-5 cursor-pointer" />
                 <label className="text-white text-sm">Jadikan Best Seller ⭐</label>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))} className="w-5 h-5 cursor-pointer" />
                 <label className="text-white text-sm">Tampilkan Produk 👁️</label>
              </div>
          </div>

          <div className="pt-4 border-t border-gray-700 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition">Batal</button>
            <button type="submit" disabled={loading || uploading} className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg transition disabled:opacity-50">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;