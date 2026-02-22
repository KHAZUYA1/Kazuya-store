import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const { t, currentLang, setLang, flags, setCategory } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [brandName, setBrandName] = useState("KAZUYA");
  const [logoUrl, setLogoUrl] = useState(""); // ✅ State baru untuk menyimpan URL Logo
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // --- EFFECT: SCROLL & FETCH DATA ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "content", "general_settings");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.siteName) setBrandName(data.siteName);
          if (data.logoUrl) setLogoUrl(data.logoUrl); // ✅ Ambil Logo URL dari Database
        }
      } catch (error) { console.error("Gagal memuat pengaturan:", error); }
    };

    fetchSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#top' },
    { name: 'Katalog', href: '#catalog' },
    { name: 'Testimoni', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'CTA', href: '#cta' },
    { name: 'Bantuan', href: '#contact' },
  ];

  const categories = [
    { id: 'streaming', icon: '🎬', key: 'catStreaming' }, 
    { id: 'gaming', icon: '🎮', key: 'catGaming' },
    { id: 'code', icon: '💻', key: 'catCode' }, 
    { id: 'automotive', icon: '🚗', key: 'catAuto' },
    { id: 'lifestyle', icon: '👟', key: 'catLifestyle' }, 
    { id: 'business', icon: '💼', key: 'catBusiness' },
    { id: 'health', icon: '🥗', key: 'catHealth' }, 
    { id: 'it-software', icon: '🖥️', key: 'catIT' },
    { id: 'teaching', icon: '📚', key: 'catTeaching' }, 
    { id: 'marketing', icon: '📈', key: 'catMarketing' },
    { id: 'design', icon: '🎨', key: 'catDesign' }, 
    { id: 'finance', icon: '💰', key: 'catFinance' },
    { id: 'photo-video', icon: '📸', key: 'catPhoto' },
    { id: 'development', icon: '⚙️', key: 'catDev' },
    { id: 'music', icon: '🎵', key: 'catMusic' }, 
    { id: 'other', icon: '📦', key: 'catOther' }
  ];

  const navigateTo = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilter = (cat: string) => {
    setCategory(cat);
    setIsMenuOpen(false);
    const element = document.getElementById('catalog');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. RUNNING TEXT BAR */}
      <div className={`fixed top-0 left-0 w-full h-10 bg-blue-600 z-[101] flex items-center transition-transform duration-500 ${
        scrolled ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="whitespace-nowrap flex animate-marquee text-white text-[10px] font-black uppercase tracking-widest">
          <span className="mx-4">🔥 PROMO SPESIAL: Diskon 50% Untuk Semua Produk Digital! • {brandName} Official Store • </span>
          <span className="mx-4">💎 E-book & Course dengan pendampingan intensif  • </span>
        </div>
      </div>

      {/* 2. NAVBAR UTAMA */}
      <nav className={`fixed left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? 'top-0 h-16 bg-white dark:bg-[#080808] shadow-xl' : 'top-10 h-20 bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO AREA */}
          <a href="#" className="flex items-center gap-3 group" onClick={(e) => navigateTo(e, '#top')}>
            
            {/* 🔥 LOGIKA LOGO DINAMIS 🔥 */}
            {logoUrl ? (
                // JIKA ADA URL LOGO -> TAMPILKAN GAMBAR
                <div className="relative w-10 h-10 transform group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={logoUrl} 
                    alt={`${brandName} Logo`} 
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => {
                        // Fallback jika gambar error/rusak, sembunyikan gambar
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
            ) : (
                // JIKA TIDAK ADA URL LOGO -> TAMPILKAN INISIAL HURUF (Fallback Lama)
                <div className="relative w-9 h-9 transform group-hover:rotate-12 transition-transform">
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg border border-white/20 shadow-xl">
                    {brandName.charAt(0).toUpperCase()}
                  </div>
                </div>
            )}
            
            {/* NAMA WEBSITE (Teks di sebelah logo) */}
            <span className="font-bold text-lg uppercase tracking-tighter transition-colors text-slate-900 dark:text-white">
              {brandName}
            </span>
          </a>

          {/* CONTROLS (KANAN) */}
          <div className="flex items-center gap-2">
            
            {/* TOMBOL MEMBER AREA (DESKTOP) */}
            <button 
               onClick={() => navigate('/member')}
               className="hidden md:flex items-center gap-2 px-4 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-transform mr-2"
            >
               <span>🚀</span> Member Area
            </button>

            {/* TEMA TOGGLE */}
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition border backdrop-blur-md
                bg-white/80 dark:bg-white/10 
                text-slate-900 dark:text-white
                border-slate-200 dark:border-white/10"
            >
              {isDark ? '🌞' : '🌙'}
            </button>

           {/* BAHASA TOGGLE */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)} 
                className="px-3 h-10 rounded-xl shadow-lg active:scale-90 transition border backdrop-blur-md text-xs font-black uppercase flex items-center gap-2
                  bg-white/80 dark:bg-white/10 
                  text-slate-900 dark:text-white
                  border-slate-200 dark:border-white/10"
              >
                <span>{flags[currentLang]}</span> 
                <span>{currentLang}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-32 rounded-2xl shadow-2xl border overflow-hidden z-[120] animate-fade-in
                  bg-white dark:bg-[#121212] 
                  border-slate-100 dark:border-white/10"
                >
                  {/* 🔥 FILTER DITERAPKAN DI SINI: HANYA ID & EN */}
                  {Object.entries(flags)
                    .filter(([code]) => code === 'ID' || code === 'EN')
                    .map(([code, flag]) => (
                    <button 
                      key={code} 
                      onClick={() => { setLang(code as any); setIsLangOpen(false); }} 
                      className="w-full p-3 flex items-center gap-3 transition-colors text-[10px] font-black uppercase text-left
                        text-slate-700 dark:text-white
                        hover:bg-blue-500 hover:text-white"
                    >
                      <span className="text-base">{flag}</span> {code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* HAMBURGER MENU BUTTON */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-12 h-12 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl border border-white/20 z-[110] active:scale-95 transition"
            >
              <div className="flex flex-col gap-1.5 transition-all">
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. SIDE-MENU RAMPIK (MOBILE) */}
      <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white dark:bg-[#080808] z-[105] shadow-[10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-8 px-6 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between mb-10">
            <span className="text-xs font-black text-blue-500 tracking-widest uppercase">{brandName} MENU</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6 mb-12">
            <p className="text-slate-400 font-black tracking-[0.4em] text-[8px] uppercase border-l-2 border-blue-500 pl-3">Navigation</p>
            <div className="flex flex-col gap-4 items-start">
              
              {/* TOMBOL MEMBER AREA (MOBILE) */}
              <button 
                  onClick={() => { navigate('/member'); setIsMenuOpen(false); }}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mb-2 active:scale-95 transition-transform"
              >
                  <span>🚀</span> Akses Member Area
              </button>

              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => navigateTo(e, link.href)} 
                  className="text-lg font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-all"
                >
                  {link.name}
                </a>
              ))}

              {isAdmin && <a href="/admin" className="text-[9px] font-black text-red-500 px-3 py-1.5 border border-red-500/20 rounded-lg mt-2 uppercase">🔒 Panel Admin</a>}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)} 
              className="w-full flex items-center justify-between text-slate-400 font-bold tracking-[0.3em] text-[8px] uppercase"
            >
              <span>Categories</span>
              <span className={`text-[10px] transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${isCategoryOpen ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                <button onClick={() => handleFilter('all')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs font-bold hover:text-blue-500 transition py-1">🏠 Semua</button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => handleFilter(cat.id)} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs font-bold hover:text-blue-500 transition py-1 text-left">
                    <span className="w-7 h-7 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-lg text-xs">{cat.icon}</span> {t(cat.key)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-auto pb-8">
            <p className="text-[7px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em] text-center">© 2026 {brandName} Digital Store</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;