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

// --- KOMPONEN CARD CONTENT (SUDAH DIPERBAIKI WARNANYA) ---
const ProductCardContent = ({ p, isAdmin, t, onEdit, onDelete, isDesktop }: any) => {
    // UPDATED: Logic styling untuk Dark/Light mode
    const cardStyle = isDesktop 
        ? "glass-panel hover:-translate-y-2 hover:shadow-cyan-500/20" 
        : "bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none"; 

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
                
                {p.images && p.images.length > 0 && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-20">
                        📸 +{p.images.length}
                    </div>
                )}
                
                {p.isBestSeller && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded shadow-lg">⭐ Best</div>
                )}
                
                {/* Gradient hanya muncul di Desktop Dark Mode agar teks terbaca */}
                {isDesktop && <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-0 dark:opacity-100 transition-opacity"></div>}
                
                <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white uppercase tracking-widest bg-cyan-600 px-2 py-0.5 rounded-md shadow-md">
                    {getCategoryLabel(p.category, t)}
                </span>
            </div>

            <div className="p-3 md:p-5 flex flex-col h-[calc(100%-9rem)] md:h-[calc(100%-14rem)] justify-between">
                <div>
                    {/* UPDATED: Text Color menyesuaikan mode */}
                    <h3 className={`font-bold text-sm md:text-lg text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2 ${isDesktop ? 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' : ''}`}>
                        {p.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{p.subtitle || 'Kazuya Digital'}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Harga</p>
                    {/* UPDATED: Warna Harga */}
                    <p className="font-black text-sm md:text-xl text-cyan-600 dark:text-cyan-400 font-mono">Rp {p.price.toLocaleString('id-ID')}</p>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN LIGHTBOX GALLERY ---
const LightboxGallery = ({ image, onClose }: { image: string, onClose: () => void }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef<HTMLImageElement>(null);

    const handleZoom = (delta: number) => {
        setScale(prev => {
            const newScale = Math.max(1, Math.min(prev + delta, 5));
            if (newScale === 1) setPosition({ x: 0, y: 0 });
            return newScale;
        });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        handleZoom(e.deltaY < 0 ? 0.2 : -0.2);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div 
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
        >
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button onClick={() => handleZoom(-0.5)} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20">➖</button>
                <button onClick={() => handleZoom(0.5)} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20">➕</button>
                <button onClick={onClose} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-bold px-4">✕ Tutup</button>
            </div>
            <div 
                className={`transition-transform duration-100 ease-out w-full h-full flex items-center justify-center ${isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            >
                <img 
                    ref={imgRef} src={image} className="max-w-full max-h-full object-contain select-none" 
                    style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
                    draggable={false} alt="Zoom Preview"
                    onClick={(e) => { if(scale===1) { e.stopPropagation(); handleZoom(1); } }} 
                />
            </div>
        </div>
    );
};

// --- KOMPONEN MODAL DETAIL (UPDATED TOMBOL TENGAH) ---
const ProductModal = ({ p, onClose }: { p: Product; onClose: () => void }) => {
    const { t } = useLanguage(); 
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const safeVideoUrl = p.videoUrl ? getEmbedUrl(p.videoUrl) : null;
    const mediaItems = [];
    
    if (safeVideoUrl) mediaItems.push({ type: 'video', url: safeVideoUrl });
    if (p.image) mediaItems.push({ type: 'image', url: p.image });
    
    if (p.images && Array.isArray(p.images)) {
        p.images.forEach((img) => {
             if (img && img !== p.image) mediaItems.push({ type: 'image', url: img });
        });
    }

    const slide = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth; // Scroll selebar layar elemen
            sliderRef.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    const handleDirectBuy = () => {
        if (p.paymentLink) window.open(p.paymentLink, '_blank');
        else window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(`Halo, saya mau beli: ${p.name}`)}`, '_blank');
    };

    return (
        <>
            {lightboxImage && <LightboxGallery image={lightboxImage} onClose={() => setLightboxImage(null)} />}

            <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4">
                <div className="absolute inset-0 bg-black/95 md:bg-black/80 md:backdrop-blur-md animate-fade-in" onClick={onClose}></div>

                <div className="relative w-full h-[95vh] md:h-[90vh] md:max-w-6xl bg-white dark:bg-[#0f172a] rounded-t-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-3 border-t md:border border-gray-200 dark:border-white/10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-3 right-3 z-[60] p-2 bg-black/60 text-white rounded-full border border-white/10 hover:bg-red-600 transition">✕</button>

                    {/* MEDIA SECTION (KIRI) */}
                    <div className={`relative bg-black w-full lg:col-span-2 transition-all duration-300 group ${isExpanded ? 'h-0 opacity-0 lg:h-full lg:opacity-100' : 'h-[40vh] lg:h-full'}`}>
                        
                        {/* SLIDER CONTAINER (Support Swipe Mobile) */}
                        <div ref={sliderRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth">
                            {mediaItems.length > 0 ? mediaItems.map((item, index) => (
                                <div key={index} className="min-w-full w-full h-full snap-center flex items-center justify-center bg-black relative">
                                    {/* Blur Background */}
                                    <div className="hidden md:block absolute inset-0 opacity-20 blur-3xl scale-125 pointer-events-none">
                                        {item.type === 'image' && <img src={item.url} className="w-full h-full object-cover" alt="" />}
                                    </div>
                                    
                                    {/* Main Content */}
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        {item.type === 'video' ? (
                                            <iframe src={item.url} className="w-full h-full md:aspect-video md:h-auto md:max-w-4xl shadow-2xl" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullScreen></iframe>
                                        ) : (
                                            <div className="relative w-full h-full group/img cursor-pointer" onClick={() => setLightboxImage(item.url)}>
                                                <img src={item.url} className="w-full h-full object-contain" alt={p.name} />
                                                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm opacity-70 group-hover/img:opacity-100 transition">🔍 Zoom & Geser</div>
                                                {mediaItems.length > 1 && <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-mono">{index + 1} / {mediaItems.length}</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">🖼️</div>
                            )}
                        </div>

                        {/* TOMBOL NAVIGASI SLIDE (Tengah Kiri & Kanan) */}
                        {mediaItems.length > 1 && (
                            <>
                                {/* Tombol KIRI */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); slide('left'); }} 
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg transition-all hover:scale-110 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Tombol KANAN */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); slide('right'); }} 
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg transition-all hover:scale-110 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* CONTENT SECTION (KANAN) */}
                    <div className={`flex flex-col bg-white dark:bg-[#0f172a] relative z-20 overflow-hidden transition-all duration-300 ${isExpanded ? 'h-full lg:col-span-1' : 'flex-1 lg:h-full lg:col-span-1'}`}>
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e293b] flex justify-between items-center shrink-0">
                            <span className="text-cyan-600 dark:text-cyan-400 text-[10px] md:text-xs font-bold uppercase border border-cyan-500/30 px-2 py-0.5 rounded">{getCategoryLabel(p.category, t)}</span>
                            <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-500/30">{isExpanded ? '⬇️ Kecilkan' : '⬆️ Baca Detail'}</button>
                        </div>
                        <div className="flex-1 px-5 py-6 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f172a]">
                            <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{p.name}</h2>
                            {p.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">"{p.subtitle}"</p>}
                            <div className="prose prose-base prose-slate dark:prose-invert text-gray-700 dark:text-gray-200 leading-relaxed text-base">
                                <div dangerouslySetInnerHTML={{ __html: p.description || '...' }} />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e293b] flex items-center gap-3">
                            <div>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Harga</span>
                                <div className="text-lg md:text-2xl font-black text-slate-900 dark:text-white font-mono">Rp {p.price.toLocaleString('id-ID')}</div>
                            </div>
                            <button onClick={handleDirectBuy} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm md:text-base rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">Beli Sekarang</button>
                        </div>
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
    
    // STATE UNTUK EDIT MODAL
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
    const { isAdmin } = useAuth(); 
    const { t, category } = useLanguage(); 

    useEffect(() => {
        const checkScreen = () => setIsDesktop(window.innerWidth > 768);
        checkScreen(); 
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
        } catch (error) { console.error("Error loading products:", error); } 
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

    // HANDLER EDIT: Buka Modal Baru
    const onEdit = (p: Product) => {
        setEditingProduct(p);
    };

    const onDelete = (id: string) => handleDeleteProduct(id, () => setProducts(prev => prev.filter(p => p.id !== id)));

    return (
        <section className="py-6 md:py-10" id="catalog">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Search Bar - UPDATED COLORS */}
                <div className="mb-6 md:mb-8 max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><span className="text-gray-400">🔍</span></div>
                    <input type="text" placeholder={t('searchPlaceholder')} className="w-full pl-12 pr-5 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-slate-900 dark:text-white shadow-sm dark:shadow-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">Loading Catalog...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">{t('noProduct')}</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {filteredProducts.slice(0, visibleCount).map((p, index) => {
                            const content = (
                                <div onClick={() => setSelectedProduct(p)} className="h-full">
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

                {!loading && visibleCount < filteredProducts.length && (
                    <div className="flex justify-center mt-8 md:mt-12">
                        <button onClick={() => setVisibleCount(prev => prev + 12)} className="group relative px-6 py-2 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold border border-white/10 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 text-xs md:text-base cursor-pointer">
                            ⬇️ Lihat Lainnya ({filteredProducts.length - visibleCount})
                        </button>
                    </div>
                )}
            </div>
            
            {/* Modal Detail Produk (untuk Pembeli) */}
            {selectedProduct && <ProductModal p={selectedProduct} onClose={() => setSelectedProduct(null)} />}

            {/* MODAL EDIT PRODUK (BARU - untuk Admin) */}
            {editingProduct && (
                <EditProductModal 
                    product={editingProduct} 
                    onClose={() => setEditingProduct(null)} 
                    onSuccess={() => {
                        fetchData(); // Refresh data setelah edit
                    }}
                />
            )}
        </section>
    );
};

export default ProductList;