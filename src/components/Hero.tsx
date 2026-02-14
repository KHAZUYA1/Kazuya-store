import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext'; 
import { db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

// Import Komponen Penawaran
import GerbangDigitalComplete from './GerbangDigitalComplete';

interface HeroData {
  youtubeUrl: string;
  carouselImages: { image: string; title: string; }[];
}

const Hero = () => {
  const { currentLang } = useLanguage(); 
  
  // @ts-ignore
  const { isDark } = useTheme(); 
  
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  // KAMUS MINI HERO
  const content: any = {
    ID: {
      title1: "Bebaskan",
      typewriter: ["Potensi Digital", "Bisnis Online", "Kreativitas", "Impianmu"],
      subtitle: "Solusi eksklusif untuk percepatan bisnis digital Anda dengan layanan profesional.",
      ctaButton: "Ambil Penawaran",
      galleryTitle: "Galeri & Layanan"
    },
    EN: {
      title1: "Unleash",
      typewriter: ["Digital Potential", "Online Business", "Creativity", "Your Dreams"],
      subtitle: "Exclusive solutions to accelerate your digital business with professional services.",
      ctaButton: "Get Offer",
      galleryTitle: "Gallery & Services"
    }
  };

  const t = content[currentLang] || content['ID'];

  // STATE LAINNYA (TYPEWRITER DLL)
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const words = t.typewriter || ["Digital Potential"]; 

  const [isPaused, setIsPaused] = useState(false); 
  const [activeIndex, setActiveIndex] = useState<number | null>(null); 
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "content", "hero_sections");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setHeroData(docSnap.data() as HeroData);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchHeroData();
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
    let videoId = "";
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    } else {
      videoId = url;
    }
    // Tambahkan parameter rel=0 agar tidak menampilkan video channel lain
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3`;
  };

  // Efek Typewriter
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      if (!fullText) return;
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed]);

  // Efek Auto Scroll Gallery
  useEffect(() => {
    if (isPaused || isLightboxOpen || loading) return; 
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, isLightboxOpen, loading]);

  // Lightbox Handlers
  const openLightbox = (imgUrl: string, e: React.MouseEvent) => { e.stopPropagation(); setLightboxImage(imgUrl); setIsLightboxOpen(true); setZoomLevel(1.5); setPosition({ x: 0, y: 0 }); setIsPaused(true); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setIsLightboxOpen(false); setIsPaused(false); setZoomLevel(1); setPosition({ x: 0, y: 0 }); document.body.style.overflow = 'auto'; };
  const handleStart = (e: any) => { if (zoomLevel <= 1) return; setIsDragging(true); const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY; setStartPos({ x: clientX - position.x, y: clientY - position.y }); };
  const handleMove = (e: any) => { if (!isDragging || zoomLevel <= 1) return; e.preventDefault(); const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX; const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY; setPosition({ x: clientX - startPos.x, y: clientY - startPos.y }); };
  const handleEnd = () => setIsDragging(false);

  if (loading) return (<div className="min-h-screen bg-white dark:bg-[#080808] flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>);

  return (
    <>
      {/* WRAPPER UTAMA HERO */}
      <section id="top" className="relative w-full min-h-screen bg-white dark:bg-[#080808] transition-colors overflow-hidden">
        
        {/* Background Gradients (Opsional - Memberi kesan modern) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-16 flex flex-col gap-16 md:gap-24">
          
          {/* =========================================
              BAGIAN 1: SPLIT SCREEN (TEXT & VIDEO)
             ========================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* KIRI: Text Hero */}
            {/* Mobile: Order 2 (Tampil di bawah video) atau Order 1 (Tampil di atas video).
                Saran: Untuk Branding, Text di atas (order-1), Video di bawah (order-2) di Mobile.
                Tapi jika ingin video duluan, tukar order-nya.
                Di sini saya set Text dahulu agar terbaca. */}
            <div className="order-1 lg:order-1 space-y-6 text-center lg:text-left z-10">
              
              {/* Badge kecil (opsional) */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 backdrop-blur-sm mb-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                  🚀 {currentLang === 'ID' ? 'Platform Digital Terbaik' : 'Best Digital Platform'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                {t.title1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                  {text}<span className="text-slate-900 dark:text-white animate-pulse">|</span>
                </span>
              </h1>
              
              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t.subtitle}
              </p>
              
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  🔥 {t.ctaButton}
                </button>
                {/* Tombol kedua (Opsional - misal: Lihat Galeri) */}
                <button 
                  onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  {t.galleryTitle} ↓
                </button>
              </div>
            </div>

            {/* KANAN: Video Container */}
            <div className="order-2 lg:order-2 w-full flex justify-center relative group">
               {/* Efek Glow di belakang video (Desktop Only) */}
               <div className="hidden lg:block absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               
               {/* Container Video */}
               <div className="relative w-full aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 z-10">
                 {/* Mobile: Negative margin agar mentok layar */}
                 <div className="md:hidden absolute inset-0 -mx-4 w-[calc(100%+2rem)] h-full bg-black"></div> 
                 
                 <iframe
                   className="absolute top-0 left-0 w-full h-full"
                   src={getEmbedUrl(heroData?.youtubeUrl || "")}
                   title="Gerbang Digital Video"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   allowFullScreen
                 ></iframe>
               </div>
            </div>

          </div>

          {/* =========================================
              BAGIAN 2: PENAWARAN (GERBANG DIGITAL COMPLETE)
              Ditaruh di sini agar alurnya:
              Hero (Interest) -> Penawaran (Desire/Action) -> Gallery (Proof)
             ========================================= */}
          <div id="pricing-section" className="w-full scroll-mt-24">
             {/* Divider Halus */}
             <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12"></div>
             
             {/* Komponen Penawaran */}
             <GerbangDigitalComplete isDarkMode={isDark} lang={currentLang} />
          </div>

          {/* =========================================
              BAGIAN 3: GALERI CAROUSEL
             ========================================= */}
          <div className="w-full space-y-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center px-2 gap-4">
              <div>
                <span className="text-blue-500 font-bold tracking-widest text-sm uppercase block mb-1">Portfolio</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-2xl md:text-3xl">{t.galleryTitle}</h3>
              </div>
              
              {/* Indikator Geser (Mobile) */}
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                 {isPaused && <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">PAUSED</span>}
                 <span className="hidden md:inline">Drag or Scroll to explore →</span>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => !isLightboxOpen && setIsPaused(false)}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 hide-scrollbar px-2 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
            >
              {(heroData?.carouselImages || []).map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveIndex(index)} 
                  className={`
                    snap-center shrink-0 
                    w-[85vw] sm:w-[350px] md:w-[400px] 
                    aspect-video rounded-2xl md:rounded-3xl overflow-hidden relative 
                    border transition-all duration-500 group 
                    ${activeIndex === index 
                      ? "border-blue-500 scale-[1.02] shadow-2xl shadow-blue-500/10 ring-2 ring-blue-500/20" 
                      : "border-slate-200 dark:border-white/10 opacity-80 hover:opacity-100"
                    }
                  `}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Tombol Zoom (Hover Only) */}
                  <button 
                    onClick={(e) => openLightbox(item.image, e)} 
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                  >
                    🔍
                  </button>
                  
                  {/* Judul Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h4 className="text-white font-bold text-lg md:text-xl tracking-tight leading-tight line-clamp-2 drop-shadow-md">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTBOX COMPONENT (Tetap sama, hanya styling minor) */}
      {isLightboxOpen && lightboxImage && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center select-none touch-none animate-in fade-in duration-200" onMouseMove={handleMove} onMouseUp={handleEnd} onTouchMove={handleMove} onTouchEnd={handleEnd}>
          <div className="absolute top-6 right-6 z-[160] flex items-center gap-4">
            <button onClick={closeLightbox} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white font-bold transition-colors">✕</button>
          </div>
          <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-move p-4">
            <img src={lightboxImage} alt="Zoom" onMouseDown={handleStart} onTouchStart={handleStart} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`, cursor: isDragging ? 'grabbing' : 'grab' }} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" draggable="false" />
          </div>
          <div className="absolute bottom-10 px-6 py-2 bg-black/50 rounded-full text-white/70 text-sm pointer-events-none backdrop-blur-sm">
            Drag to pan • Pinch / Scroll to zoom
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;