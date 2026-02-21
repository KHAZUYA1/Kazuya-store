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

// --- HELPER: Ubah Link Youtube ---
const getEmbedUrl = (url: string) => {
  if (!url) return null;
  let videoId = "";
  if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
  else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
  else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&fs=1` : null;
};

// --- HELPER: Label Kategori Menggunakan Dictionary ---
const getCategoryLabel = (cat: string, t: any) => {
    const map: Record<string, string> = {
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
        'other': 'catOther'
    };
    // Mengambil kunci dari map, jika tidak ada pakai 'catOther'
    const key = map[cat] || 'catOther';
    // Menerjemahkan kunci tersebut menggunakan fungsi t()
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
            
            <div className="relative h-36 md:h-56 bg-gray-200 dark:bg-gray-900 overflow-hidden">
                {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover" loading="lazy" alt={p.name} />
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

// --- PRODUCT MODAL COMPONENT ---
const ProductModal = ({ p, onClose, t }: { p: Product; onClose: () => void; t: any }) => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const safeVideoUrl = p.videoUrl ? getEmbedUrl(p.videoUrl) : null;
    const mediaItems = [];
    if (safeVideoUrl) mediaItems.push({ type: 'video', url: safeVideoUrl });
    if (p.image) mediaItems.push({ type: 'image', url: p.image });
    if (p.images && Array.isArray(p.images)) {
        p.images.forEach((img) => { if (img && img !== p.image) mediaItems.push({ type: 'image', url: img }); });
    }

    const handleChatWA = () => {
        // Menggunakan t('waAsk') dari dictionary
        const message = `${t('waAsk')} ${p.name}`;
        window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleDirectBuy = () => {
        if (p.paymentLink) window.open(p.paymentLink, '_blank');
        else {
            // Menggunakan t('waBuy') dari dictionary
            const message = `${t('waBuy')} ${p.name}`;
            window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const hasDiscount = p && p.fakePrice && p.fakePrice > p.price;

    return (
        <>
            {lightboxImage && (
                <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-3 font-bold z-50">✕</button>
                    <img src={lightboxImage} className="max-w-full max-h-full object-contain" alt="Zoom" />
                </div>
            )}

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
                <div className="relative bg-white dark:bg-[#1e293b] w-full max-w-md h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-lg border border-white/20">✕</button>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24 bg-gray-50 dark:bg-[#0f172a]">
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
                             {/* Menggunakan t('bestLabel') */}
                             {p.isBestSeller && <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg z-10"> {t('bestLabel')}</div>}
                        </div>

                        <div className="p-4 bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-2xl font-mono">Rp {p.price.toLocaleString('id-ID')}</span>
                                {hasDiscount && (
                                    <span className="text-gray-400 text-sm line-through decoration-red-500">Rp {p.fakePrice?.toLocaleString('id-ID')}</span>
                                )}
                            </div>
                            <h1 className="text-slate-900 dark:text-white text-lg font-medium leading-snug break-words">{p.name}</h1>
                            
                            <div className="flex gap-2 mt-3">
                                <span className="bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300 text-[10px] px-2 py-1 rounded border border-slate-300 dark:border-gray-600">
                                    {getCategoryLabel(p.category, t)}
                                </span>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-1 rounded border border-green-300 dark:border-green-900/50">
                                    {/* Menggunakan t('guarantee') */}
                                    {t('guarantee')}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-[#0f172a] min-h-[300px]">
                            {/* Menggunakan t('details') */}
                            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">{t('details')}</h3>
                            <div className="prose prose-sm dark:prose-invert text-slate-700 dark:text-gray-300 max-w-none break-words [&_img]:max-w-full [&_img]:rounded-lg">
                                <div dangerouslySetInnerHTML={{ __html: p.description || '<p>...</p>' }} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-gray-700 p-3 flex gap-3 z-40">
                        <button onClick={handleChatWA} className="flex flex-col items-center justify-center px-4 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg py-1">
                            <span className="text-xl">💬</span>
                            {/* Menggunakan t('chatAdmin') */}
                            <span className="text-[10px]">{t('chatAdmin')}</span>
                        </button>
                        {/* Menggunakan t('buyNow') */}
                        <button onClick={handleDirectBuy} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg py-3 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">{t('buyNow')}</button>
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
    
    // 🔥 MENGGUNAKAN HOOK USELANGUAGE DENGAN BENAR
    // Kita panggil fungsi 't' yang sudah pintar mendeteksi bahasa dari Dictionary
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
                            {/* Memanggil Dictionary: curatedBadge */}
                            {t('curatedBadge')}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                        {/* Memanggil Dictionary: curatedTitle */}
                        {t('curatedTitle')}
                    </h2>
                    
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {/* Memanggil Dictionary: curatedDesc */}
                        {t('curatedDesc')}
                    </p>

                    <div className="mt-8 flex justify-center items-center gap-4">
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
                        <div className="text-gray-400 dark:text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">
                            {/* Memanggil Dictionary: curatedExplore */}
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
                                            {/* Kirim fungsi t ke komponen anak */}
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
                            {/* Memanggil Dictionary: loadMore */}
                            ⬇️ {t('loadMore')} ({filteredProducts.length - visibleCount})
                        </button>
                    </div>
                )}
            </div>
            
            {/* Kirim fungsi t ke Modal */}
            {selectedProduct && <ProductModal p={selectedProduct} onClose={() => setSelectedProduct(null)} t={t} />}
            {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={fetchData} />}
        </section>
    );
};

export default ProductList;