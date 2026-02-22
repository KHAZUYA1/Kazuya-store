import { useEffect, useState } from 'react';
import { getDocs, query, orderBy, limit } from 'firebase/firestore';
import { productsCollection } from '../lib/firebase';
import type { Product } from "../types"; 
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; 
import { handleDeleteProduct } from '../utils/adminActions'; 
import EditProductModal from './admin/EditProductModal'; 
import TiltCard from './TiltCard'; 
import RevealOnScroll from './RevealOnScroll';

// --- HELPER 1: Ubah Link Youtube ---
const getEmbedUrl = (url: string) => {
  if (!url) return null;
  let videoId = "";
  if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
  else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
  else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&fs=1` : null;
};

// --- HELPER 2: Deteksi Video MP4/Firebase 🔥 ---
const isNativeVideo = (url: string) => {
  if (!url) return false;
  // Cek apakah URL mengandung ekstensi video (berguna untuk link Firebase)
  return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.webm') || url.toLowerCase().includes('.ogg');
};

// --- HELPER 3: Label Kategori Menggunakan Dictionary (SUDAH DIPERBAIKI) 🔥 ---
const getCategoryLabel = (cat: string, t: any) => {
    if (!cat) return t('catOther');

    // 1. Ubah teks dari database jadi huruf kecil semua agar aman (Case Insensitive)
    const safeCat = cat.toLowerCase().trim();

    const map: Record<string, string> = {
        // --- Mapping Asli (English) ---
        'streaming': 'catStreaming', 
        'gaming': 'catGaming', 
        'code': 'catCode',
        'automotive': 'catAuto', 
        'lifestyle': 'catLifestyle', 
        'business': 'catBusiness',
        'health': 'catHealth', 
        'it-software': 'catIT', 
        'teaching': 'catTeaching',
        'marketing': 'catMarketing', 
        'design': 'catDesign', 
        'finance': 'catFinance',
        'photo-video': 'catPhoto', 
        'development': 'catDev', 
        'music': 'catMusic', 
        'other': 'catOther',

        // --- TAMBAHAN MAPPING BAHASA INDONESIA (Sesuai Form Database) ---
        'pendidikan': 'catTeaching',   // Pendidikan -> teaching
        'desain': 'catDesign',         // Desain -> design
        'foto & video': 'catPhoto',    // Foto & Video -> photo-video
        'web programming': 'catCode',  // Web Programming -> code
        'produk digital': 'catIT',     // Produk Digital -> it-software
        'ev technology': 'catAuto',    // EV Technology -> automotive
        'e-book': 'catTeaching',       // E-book -> teaching
        'lainnya': 'catOther'          // Lainnya -> other
    };

    // Cari key di map, kalau masih tidak ketemu juga baru jadikan 'catOther'
    const key = map[safeCat] || 'catOther';
    return t(key); 
};

// --- PRODUCT CARD COMPONENT ---
const ProductCardContent = ({ p, isAdmin, t, onEdit, onDelete, isDesktop }: any) => {
    const cardStyle = isDesktop 
        ? "glass-panel hover:-translate-y-2 hover:shadow-cyan-500/20" 
        : "bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none"; 
    
    const hasDiscount = p && p.fakePrice && p.fakePrice > p.price;

    return (
        <div className={`group ${cardStyle} rounded-xl md:rounded-3xl overflow-hidden transition-all duration-300 relative cursor-pointer h-full border dark:border-white/5 ${p.isVisible === false ? 'opacity-50 grayscale border-red-500' : ''}`}>
            {isAdmin && (
                <div className="absolute top-2 left-2 z-30 flex gap-2">
                    <button className="bg-black/60 text-white p-1.5 rounded-lg hover:bg-yellow-500 transition" onClick={(e) => { e.stopPropagation(); onEdit(p); }}>✏️</button>
                    <button className="bg-black/60 text-white p-1.5 rounded-lg hover:bg-red-600 transition" onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}>🗑️</button>
                </div>
            )}
            
            {/* THUMBNAIL AREA 🔥 */}
            <div className="relative h-36 md:h-56 bg-gray-200 dark:bg-gray-900 overflow-hidden">
                {p.image ? (
                    // Jika thumbnail-nya ternyata video MP4, putar videonya (muted)
                    isNativeVideo(p.image) ? (
                        <video src={p.image} className="w-full h-full object-cover pointer-events-none" autoPlay muted loop playsInline />
                    ) : (
                        <img src={p.image} className="w-full h-full object-cover" loading="lazy" alt={p.name} />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700 text-4xl font-bold">?</div>
                )}
                
                {p.isBestSeller && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded shadow-lg">
                        {t('bestLabel')}
                    </div>
                )}
                
                {isDesktop && <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-0 dark:opacity-100 transition-opacity"></div>}
                
                <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white uppercase tracking-widest bg-cyan-600 px-2 py-0.5 rounded-md shadow-md">
                    {getCategoryLabel(p.category, t)}
                </span>
            </div>

            <div className="p-3 md:p-5 flex flex-col h-[calc(100%-9rem)] md:h-[calc(100%-14rem)] justify-between">
                <div>
                    <h3 className={`font-bold text-sm md:text-lg text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2 ${isDesktop ? 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' : ''}`}>
                        {p.name}
                    </h3>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                    {hasDiscount && (
                        <p className="text-[10px] text-gray-400 line-through decoration-red-500">
                            Rp {p.fakePrice.toLocaleString('id-ID')}
                        </p>
                    )}
                    <p className="font-black text-sm md:text-xl text-cyan-600 dark:text-cyan-400 font-mono">
                        Rp {p.price.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- PRODUCT MODAL COMPONENT (DIOPTIMASI UNTUK DEKSTOP & SUPER CEPAT DI HP) ---
const ProductModal = ({ p, onClose, t }: { p: Product; onClose: () => void; t: any }) => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // 🔥 LOGIKA MEDIA (Tetap Sama & Cepat) 🔥
    const ytEmbedUrl = p.videoUrl ? getEmbedUrl(p.videoUrl) : null;
    const mediaItems: {type: string, url: string}[] = [];

    if (p.videoUrl) {
        if (ytEmbedUrl) mediaItems.push({ type: 'youtube', url: ytEmbedUrl });
        else mediaItems.push({ type: 'native_video', url: p.videoUrl });
    }
    if (p.image) {
        mediaItems.push({ type: isNativeVideo(p.image) ? 'native_video' : 'image', url: p.image });
    }
    if (p.images && Array.isArray(p.images)) {
        p.images.forEach((url) => { 
            if (url && url !== p.image) {
                mediaItems.push({ type: isNativeVideo(url) ? 'native_video' : 'image', url: url });
            } 
        });
    }

    const handleChatWA = () => {
        const message = `${t('waAsk')} ${p.name}`;
        window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleDirectBuy = () => {
        if (p.paymentLink) window.open(p.paymentLink, '_blank');
        else {
            const message = `${t('waBuy')} ${p.name}`;
            window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const hasDiscount = p && p.fakePrice && p.fakePrice > p.price;

    return (
        <>
            {/* LIGHTBOX ZOOM GAMBAR */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold z-50 hover:bg-red-700 transition">✕</button>
                    <img src={lightboxImage} className="max-w-full max-h-full object-contain" alt="Zoom" />
                </div>
            )}

            {/* BACKGROUND MODAL */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-6 animate-fade-in">
                
                {/* CONTAINER MODAL: Mobile (Lebar HP), Desktop (Lebar Penuh Max-5xl, Split 2 Kolom) */}
                <div className="relative bg-white dark:bg-[#0f172a] w-full md:max-w-5xl lg:max-w-6xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-800">
                    
                    {/* TOMBOL CLOSE (Di Desktop pindah ke dalam area putih/gelap agar elegan) */}
                    <button onClick={onClose} className="absolute top-4 right-4 z-[60] bg-black/50 md:bg-gray-100 md:dark:bg-gray-800 md:text-gray-600 md:dark:text-white text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-lg border border-white/20 md:border-transparent hover:bg-red-500 hover:text-white">
                        ✕
                    </button>

                    {/* KOLOM KIRI: MEDIA (Mobile: Kotak Atas, Desktop: Lebar 50% Tinggi Full) */}
                    <div className="w-full aspect-square md:aspect-auto md:w-1/2 md:h-full bg-black relative flex-shrink-0 z-10 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col">
                         <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                            {mediaItems.map((item, index) => (
                                <div key={index} className="min-w-full w-full h-full snap-center flex items-center justify-center bg-[#050505]">
                                    {item.type === 'youtube' ? (
                                         <iframe src={item.url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                                    ) : item.type === 'native_video' ? (
                                         <video src={item.url} className="w-full h-full object-contain bg-black" controls autoPlay playsInline></video>
                                    ) : (
                                        <img src={item.url} className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-500" onClick={() => setLightboxImage(item.url)} alt="Media" loading="lazy" />
                                    )}
                                </div>
                            ))}
                         </div>
                         
                         {/* Indikator geser (Desktop Only Feature: Memandu user untuk scroll galeri) */}
                         {mediaItems.length > 1 && (
                            <div className="hidden md:flex absolute bottom-4 left-0 right-0 justify-center gap-2 pointer-events-none">
                                <span className="bg-black/60 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                                    Geser untuk melihat {mediaItems.length} media ➔
                                </span>
                            </div>
                         )}

                         {p.isBestSeller && <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-black px-3 py-1.5 rounded-md shadow-lg z-10 uppercase tracking-wide">⭐ {t('bestLabel')}</div>}
                    </div>

                    {/* KOLOM KANAN: KONTEN DETAIL (Mobile: Bawah, Desktop: Lebar 50% Bisa di-Scroll) */}
                    <div className="w-full md:w-1/2 flex flex-col h-[calc(100%-100vw)] md:h-full relative bg-white dark:bg-[#0f172a]">
                        
                        {/* Area Text yang bisa di-scroll terpisah */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 md:pb-32">
                            
                            {/* Header: Harga & Judul */}
                            <div className="p-5 md:p-8 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col gap-1 mb-3">
                                    {hasDiscount && (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded">Diskon</span>
                                            <span className="text-gray-400 text-sm line-through decoration-red-500">Rp {p.fakePrice?.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    <span className="text-cyan-600 dark:text-cyan-400 font-black text-3xl md:text-4xl font-mono tracking-tight">
                                        Rp {p.price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                
                                <h1 className="text-slate-900 dark:text-white text-xl md:text-3xl font-bold leading-snug break-words mb-4">
                                    {p.name}
                                </h1>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-gray-700 font-medium flex items-center gap-1">
                                        📁 {getCategoryLabel(p.category, t)}
                                    </span>
                                    <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-3 py-1.5 rounded-md border border-green-200 dark:border-green-900/50 font-medium flex items-center gap-1">
                                        🛡️ {t('guarantee')}
                                    </span>
                                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-900/50 font-medium flex items-center gap-1 hidden md:flex">
                                        ⚡ Akses Instan
                                    </span>
                                </div>
                            </div>

                            {/* Body: Deskripsi Produk */}
                            <div className="p-5 md:p-8">
                                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-4 h-[2px] bg-cyan-500 rounded-full"></span> 
                                    {t('details')}
                                </h3>
                                <div className="prose prose-sm md:prose-base dark:prose-invert text-slate-700 dark:text-gray-300 max-w-none break-words [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-4 [&_img]:border [&_img]:border-gray-200 dark:[&_img]:border-gray-800">
                                    <div dangerouslySetInnerHTML={{ __html: p.description || '<p>Tidak ada deskripsi.</p>' }} />
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM CTA: Fixed di bagian bawah layar Kanan (Desktop) atau Bawah HP (Mobile) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 md:p-6 flex gap-3 md:gap-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                            <button onClick={handleChatWA} className="flex flex-col md:flex-row md:px-6 items-center justify-center px-4 text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition rounded-xl py-2 md:py-3 border border-gray-200 dark:border-gray-700 gap-1 md:gap-2">
                                <span className="text-xl md:text-2xl">💬</span>
                                <span className="text-[10px] md:text-sm font-semibold">{t('chatAdmin')}</span>
                            </button>
                            <button onClick={handleDirectBuy} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm md:text-lg rounded-xl py-3 md:py-4 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                                🚀 {t('buyNow')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- PRODUCT LIST MAIN COMPONENT ---
const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [visibleCount, setVisibleCount] = useState(12);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
    const { isAdmin } = useAuth(); 
    
    const { t, category } = useLanguage() as any; 

    useEffect(() => {
        const checkScreen = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const q = query(productsCollection, orderBy("timestamp", "desc"), limit(100));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            data.sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0));
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) { console.error("Error:", error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Filter Logic
    const currentCategory = category || 'all';

    useEffect(() => {
        let result = products;
        if (currentCategory !== 'all') result = result.filter(p => p.category === currentCategory);
        if (search) {
            const keyword = search.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(keyword) || (p.category && p.category.toLowerCase().includes(keyword)));
        }
        if (!isAdmin) result = result.filter(p => p.isVisible !== false);
        setFilteredProducts(result);
    }, [search, products, isAdmin, currentCategory]); 

    const onEdit = (p: Product) => setEditingProduct(p);
    const onDelete = (id: string) => handleDeleteProduct(id, () => setProducts(prev => prev.filter(p => p.id !== id)));

    return (
        <section className="py-6 md:py-10" id="catalog">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* HEADER KATALOG */}
                <div className="mb-12 text-center px-4 max-w-3xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-cyan-600 dark:text-cyan-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                            {t('curatedBadge')}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                        {t('curatedTitle')}
                    </h2>
                    
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {t('curatedDesc')}
                    </p>

                    <div className="mt-8 flex justify-center items-center gap-4">
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
                        <div className="text-gray-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">
                            {t('curatedExplore')}
                        </div>
                        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"></div>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="mb-6 md:mb-8 max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">🔍</div>
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')} 
                        className="w-full pl-12 pr-5 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white shadow-sm" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">{t('loading')}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">{t('noProduct')}</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {filteredProducts.slice(0, visibleCount).map((p, index) => {
                            const content = (
                                <div key={p.id} onClick={() => setSelectedProduct(p)} className="h-full cursor-pointer">
                                    {isDesktop ? (
                                        <TiltCard className="h-full">
                                            <ProductCardContent p={p} isAdmin={isAdmin} t={t} onEdit={onEdit} onDelete={onDelete} isDesktop={isDesktop} />
                                        </TiltCard>
                                    ) : (
                                        <ProductCardContent p={p} isAdmin={isAdmin} t={t} onEdit={onEdit} onDelete={onDelete} isDesktop={isDesktop} />
                                    )}
                                </div>
                            );

                            return isDesktop ? (
                                <RevealOnScroll key={p.id} delay={index * 50}>{content}</RevealOnScroll>
                            ) : (
                                <div key={p.id} className="mb-2">{content}</div>
                            );
                        })}
                    </div>
                )}

                {/* LOAD MORE */}
                {!loading && visibleCount < filteredProducts.length && (
                    <div className="flex justify-center mt-8 md:mt-12">
                        <button onClick={() => setVisibleCount(prev => prev + 12)} className="px-8 py-3 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all text-xs md:text-base">
                            ⬇️ {t('loadMore')} ({filteredProducts.length - visibleCount})
                        </button>
                    </div>
                )}
            </div>
            
            {selectedProduct && <ProductModal p={selectedProduct} onClose={() => setSelectedProduct(null)} t={t} />}
            {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={fetchData} />}
        </section>
    );
};

export default ProductList;