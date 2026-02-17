import { useEffect, useState, useRef } from 'react';
import { getDocs, query, orderBy, limit } from 'firebase/firestore';
import { productsCollection } from '../lib/firebase';
import type { Product } from "../types"; 
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; 
import { handleDeleteProduct } from '../utils/adminActions'; 
import EditProductModal from './admin/EditProductModal'; 
import TiltCard from './TiltCard'; 
import RevealOnScroll from './RevealOnScroll';

// ==========================================
// 1. KAMUS MINI (INTERNAL DICTIONARY)
// ==========================================
const localDict: Record<string, any> = {
  id: {
    curatedBadge: "Premium On-Demand",
    curatedTitle: "Curated Selection: Miliki Aset Digital Premium Secara Spesifik",
    curatedDesc: "Kami memahami bahwa setiap visi membutuhkan alat yang berbeda. Jika belum memerlukan paket bundling, Anda dapat memilih koleksi aset digital kami secara mandiri. Tetap dengan standar kualitas profesional dan akses penuh selamanya.",
    curatedExplore: "JELAJAHI KATALOG",
    searchPlaceholder: "Cari produk impianmu...",
    buyNow: "Beli Sekarang",
    chatAdmin: "Chat",
    details: "Rincian Produk",
    starSeller: "STAR SELLER",
    loadMore: "Lihat Lainnya",
    noProduct: "Produk tidak ditemukan",
    loading: "Memuat Katalog..."
  },
  en: {
    curatedBadge: "Premium On-Demand",
    curatedTitle: "Curated Selection: Acquire Premium Digital Assets Specifically",
    curatedDesc: "We understand that every vision requires different tools. If you don't need a bundling package yet, you can choose our digital asset collection independently. Still with professional quality standards and full access forever.",
    curatedExplore: "EXPLORE CATALOG",
    searchPlaceholder: "Search your dream products...",
    buyNow: "Buy Now",
    chatAdmin: "Chat",
    details: "Product Details",
    starSeller: "STAR SELLER",
    loadMore: "Load More",
    noProduct: "No products found",
    loading: "Loading Catalog..."
  }
};

// --- HELPER: Ubah Link Youtube ---
const getEmbedUrl = (url: string) => {
  if (!url) return null;
  let videoId = "";
  if (url.includes('v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('shorts/')) {
    videoId = url.split('shorts/')[1].split('?')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&fs=1` : null;
};

const getCategoryLabel = (cat: string, t: any) => {
    const map: Record<string, string> = {
        'streaming': 'catStreaming', 'gaming': 'catGaming', 'code': 'catCode',
        'automotive': 'catAuto', 'lifestyle': 'catLifestyle', 'business': 'catBusiness',
        'health': 'catHealth', 'it-software': 'catIT', 'teaching': 'catTeaching',
        'marketing': 'catMarketing', 'design': 'catDesign', 'finance': 'catFinance',
        'photo-video': 'catPhoto', 'development': 'catDev', 'music': 'catMusic', 'other': 'catOther'
    };
    const key = map[cat] || 'catOther'; 
    return t(key); 
};

// --- KOMPONEN CARD CONTENT ---
const ProductCardContent = ({ p, isAdmin, t, onEdit, onDelete, isDesktop, langText }: any) => {
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
            
            <div className="relative h-36 md:h-56 bg-gray-200 dark:bg-gray-900 overflow-hidden">
                {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover" loading="lazy" alt={p.name} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-700 text-4xl font-bold">?</div>
                )}
                
                {p.isBestSeller && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded shadow-lg">⭐ Best</div>
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

// --- KOMPONEN LIGHTBOX GALLERY ---
const LightboxGallery = ({ image, onClose }: { image: string, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
            <button className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-3 font-bold z-50">✕</button>
            <img src={image} className="max-w-full max-h-full object-contain" alt="Zoom" />
        </div>
    );
};

// --- KOMPONEN MODAL DETAIL ---
const ProductModal = ({ p, onClose, langText }: { p: Product; onClose: () => void; langText: any }) => {
    const { t } = useLanguage(); 
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const safeVideoUrl = p.videoUrl ? getEmbedUrl(p.videoUrl) : null;
    const mediaItems = [];
    if (safeVideoUrl) mediaItems.push({ type: 'video', url: safeVideoUrl });
    if (p.image) mediaItems.push({ type: 'image', url: p.image });
    if (p.images && Array.isArray(p.images)) {
        p.images.forEach((img) => { if (img && img !== p.image) mediaItems.push({ type: 'image', url: img }); });
    }

    const handleChatWA = () => {
        const message = `Halo Admin, saya ingin tanya-tanya mengenai produk: ${p.name}`;
        window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleDirectBuy = () => {
        if (p.paymentLink) window.open(p.paymentLink, '_blank');
        else window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(`Halo, saya mau beli: ${p.name}`)}`, '_blank');
    };

    const hasDiscount = p && p.fakePrice && p.fakePrice > p.price;

    return (
        <>
            {lightboxImage && <LightboxGallery image={lightboxImage} onClose={() => setLightboxImage(null)} />}

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
                <div className="relative bg-[#1e293b] w-full max-w-md h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-700">
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-lg border border-white/20">✕</button>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24 bg-[#0f172a]">
                        <div className="w-full aspect-square bg-black relative">
                             <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                                {mediaItems.map((item, index) => (
                                    <div key={index} className="min-w-full w-full h-full snap-center flex items-center justify-center bg-black">
                                        {item.type === 'video' ? (
                                             <iframe src={item.url} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                                        ) : (
                                            <img src={item.url} className="w-full h-full object-cover" onClick={() => setLightboxImage(item.url)} alt="" />
                                        )}
                                    </div>
                                ))}
                             </div>
                             {p.isBestSeller && <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg z-10">⭐ {langText.starSeller}</div>}
                        </div>

                        <div className="p-4 bg-[#1e293b] border-b border-gray-700">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-cyan-400 font-bold text-2xl font-mono">Rp {p.price.toLocaleString('id-ID')}</span>
                                {hasDiscount && (
                                    <span className="text-gray-500 text-sm line-through decoration-red-500">Rp {p.fakePrice?.toLocaleString('id-ID')}</span>
                                )}
                            </div>
                            <h1 className="text-white text-lg font-medium leading-snug break-words">{p.name}</h1>
                        </div>

                        <div className="p-4 bg-[#0f172a] min-h-[300px]">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">{langText.details}</h3>
                            <div className="prose prose-sm prose-invert text-gray-300 max-w-none break-words [&_img]:max-w-full [&_img]:rounded-lg">
                                <div dangerouslySetInnerHTML={{ __html: p.description || '<p>...</p>' }} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 p-3 flex gap-3 z-40">
                        <button onClick={handleChatWA} className="flex flex-col items-center justify-center px-4 text-gray-400 hover:text-white transition bg-gray-800 rounded-lg py-1">
                            <span className="text-xl">💬</span>
                            <span className="text-[10px]">{langText.chatAdmin}</span>
                        </button>
                        <button onClick={handleDirectBuy} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg py-3 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">{langText.buyNow}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- PRODUCT LIST UTAMA ---
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
    
    // Gunakan 'language' atau 'locale' sesuai yang diekspor context Anda
    // Jika masih merah, ganti 'language' menjadi 'locale'
    const { language, t, category } = useLanguage() as any; 

    // Ambil data dari kamus mini berdasarkan bahasa aktif
    const langText = localDict[language] || localDict['id'];

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

    useEffect(() => {
        let result = products;
        if (category !== 'all') result = result.filter(p => p.category === category);
        if (search) {
            const keyword = search.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(keyword) || (p.category && p.category.toLowerCase().includes(keyword)));
        }
        if (!isAdmin) result = result.filter(p => p.isVisible !== false);
        setFilteredProducts(result);
    }, [search, products, isAdmin, category]); 

    const onEdit = (p: Product) => setEditingProduct(p);
    const onDelete = (id: string) => handleDeleteProduct(id, () => setProducts(prev => prev.filter(p => p.id !== id)));

    return (
        <section className="py-6 md:py-10" id="catalog">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* HEADER BERUBAH BAHASA OTOMATIS */}
                <div className="mb-12 text-center px-4 max-w-3xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                            {langText.curatedBadge}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                        {langText.curatedTitle}
                    </h2>
                    
                    <p className="text-base text-gray-400 leading-relaxed font-medium">
                        {langText.curatedDesc}
                    </p>

                    <div className="mt-8 flex justify-center items-center gap-4">
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gray-700"></div>
                        <div className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">{langText.curatedExplore}</div>
                        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gray-700"></div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 md:mb-8 max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="text-gray-400">🔍</span></div>
                    <input type="text" placeholder={langText.searchPlaceholder} className="w-full pl-12 pr-5 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white shadow-sm dark:shadow-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">{langText.loading}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">{langText.noProduct}</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {filteredProducts.slice(0, visibleCount).map((p, index) => {
                            const content = (
                                <div key={p.id} onClick={() => setSelectedProduct(p)} className="h-full cursor-pointer">
                                    {isDesktop ? (
                                        <TiltCard className="h-full">
                                            <ProductCardContent p={p} isAdmin={isAdmin} t={t} onEdit={onEdit} onDelete={onDelete} isDesktop={isDesktop} langText={langText} />
                                        </TiltCard>
                                    ) : (
                                        <ProductCardContent p={p} isAdmin={isAdmin} t={t} onEdit={onEdit} onDelete={onDelete} isDesktop={isDesktop} langText={langText} />
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

                {!loading && visibleCount < filteredProducts.length && (
                    <div className="flex justify-center mt-8 md:mt-12">
                        <button onClick={() => setVisibleCount(prev => prev + 12)} className="group relative px-8 py-3 rounded-full bg-slate-800 text-white font-bold hover:shadow-cyan-500/30 transition-all text-xs md:text-base">
                            ⬇️ {langText.loadMore} ({filteredProducts.length - visibleCount})
                        </button>
                    </div>
                )}
            </div>
            
            {selectedProduct && <ProductModal p={selectedProduct} onClose={() => setSelectedProduct(null)} langText={langText} />}
            {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={fetchData} />}
        </section>
    );
};

export default ProductList;