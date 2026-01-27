import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

interface HeroData {
  youtubeUrl: string;
  carouselImages: { image: string; title: string; }[];
}

const Hero = () => {
  // 1. Ambil status bahasa (Gunakan currentLang sesuai sistem Mas)
  const { currentLang } = useLanguage(); 
  
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. KAMUS MINI (Semua teks Hero ada di sini)
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
    },
    JP: {
      title1: "解き放つ",
      typewriter: ["デジタルの可能性", "オンラインビジネス", "創造性", "あなたの夢"],
      subtitle: "プロフェッショナルなサービスでデジタルビジネスを加速させる独占ソリューション。",
      ctaButton: "オファーを入手",
      galleryTitle: "ギャラリー＆サービス"
    },
    KR: {
      title1: "해방하다",
      typewriter: ["디지털 잠재력", "온라인 비즈니스", "창의성", "당신의 꿈"],
      subtitle: "전문 서비스로 디지털 비즈니스를 가속화하는 독점 솔루션.",
      ctaButton: "제안 받기",
      galleryTitle: "갤러리 및 서비스"
    },
    CN: {
      title1: "释放",
      typewriter: ["数字潜力", "在线业务", "创造力", "你的梦想"],
      subtitle: "通过专业服务加速您的数字业务的独家解决方案。",
      ctaButton: "获取优惠",
      galleryTitle: "画廊与服务"
    },
    MY: {
      title1: "Serlahkan",
      typewriter: ["Potensi Digital", "Perniagaan Online", "Kreativiti", "Impian Anda"],
      subtitle: "Penyelesaian eksklusif untuk mempercepatkan perniagaan digital anda dengan perkhidmatan profesional.",
      ctaButton: "Dapatkan Tawaran",
      galleryTitle: "Galeri & Perkhidmatan"
    },
    VN: {
      title1: "Giải phóng",
      typewriter: ["Tiềm năng số", "Kinh doanh Online", "Sự sáng tạo", "Giấc mơ của bạn"],
      subtitle: "Các giải pháp độc quyền để tăng tốc doanh nghiệp kỹ thuật số của bạn với các dịch vụ chuyên nghiệp.",
      ctaButton: "Nhận ưu đãi",
      galleryTitle: "Thư viện & Dịch vụ"
    },
    TH: {
      title1: "ปลดปล่อย",
      typewriter: ["ศักยภาพดิจิทัล", "ธุรกิจออนไลน์", "ความคิดสร้างสรรค์", "ความฝันของคุณ"],
      subtitle: "โซลูชันพิเศษเพื่อเร่งธุรกิจดิจิทัลของคุณด้วยบริการระดับมืออาชีพ",
      ctaButton: "รับข้อเสนอ",
      galleryTitle: "แกลเลอรี & บริการ"
    },
    RU: {
      title1: "Раскройте",
      typewriter: ["Цифровой потенциал", "Онлайн Бизнес", "Творчество", "Твои Мечты"],
      subtitle: "Эксклюзивные решения для ускорения вашего цифрового бизнеса с профессиональными услугами.",
      ctaButton: "Получить предложение",
      galleryTitle: "Галерея и Услуги"
    }
  };

  // 3. Pilih teks berdasarkan bahasa aktif
  const t = content[currentLang] || content['ID'];

  // --- TYPEWRITER CONFIG ---
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  // Gunakan kata-kata dari kamus mini (t.typewriter)
  const words = t.typewriter; 

  // --- CAROUSEL & LIGHTBOX STATES ---
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

  // FUNGSI PINTAR EKSTRAK ID YOUTUBE
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
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3`;
  };

  // LOGIKA TYPEWRITER
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      
      // Reset jika ganti bahasa di tengah jalan agar tidak error
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

  // LOGIKA AUTO SCROLL
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

  const openLightbox = (imgUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImage(imgUrl);
    setIsLightboxOpen(true);
    setZoomLevel(1.5);
    setPosition({ x: 0, y: 0 });
    setIsPaused(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsPaused(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'auto';
  };

  const handleStart = (e: any) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (e: any) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - startPos.x, y: clientY - startPos.y });
  };

  const handleEnd = () => setIsDragging(false);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#080808] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <section id="top" className="relative pt-32 pb-16 px-4 md:px-6 w-full min-h-screen bg-white dark:bg-[#080808] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1 space-y-6">
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight">
                {/* TEXT JUDUL DINAMIS */}
                {t.title1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                  {text}<span className="text-slate-900 dark:text-white animate-pulse">|</span>
                </span>
              </h1>
              {/* SUBJUDUL DINAMIS */}
              <p className="text-slate-600 dark:text-slate-300 text-lg md:max-w-md">
                {t.subtitle}
              </p>
              <div className="pt-4">
                {/* TOMBOL DINAMIS */}
                <button 
                  onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 hover:scale-105 transition-all text-lg"
                >
                  🔥 {t.ctaButton}
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-screen -mx-4 md:mx-0 md:w-full aspect-video md:rounded-[3rem] shadow-2xl overflow-hidden border-y md:border border-white/10 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={getEmbedUrl(heroData?.youtubeUrl || "")}
                  title="Gerbang Digital Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>

          <div className="w-full z-10 space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                {/* JUDUL GALERI DINAMIS */}
                <h3 className="text-slate-900 dark:text-white font-bold text-xl uppercase tracking-tighter">{t.galleryTitle}</h3>
              </div>
              {isPaused && <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full animate-pulse">PAUSED</span>}
            </div>

            <div 
              ref={scrollRef} 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => !isLightboxOpen && setIsPaused(false)}
              className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar px-2 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
            >
              {(heroData?.carouselImages || []).map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveIndex(index)}
                  className={`snap-center shrink-0 w-[85vw] md:w-[480px] aspect-video rounded-3xl overflow-hidden relative border transition-all duration-500 group ${activeIndex === index ? "border-blue-500 scale-[1.02] shadow-xl" : "border-gray-200 dark:border-white/10 opacity-70"}`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button onClick={(e) => openLightbox(item.image, e)} className="absolute top-4 right-4 p-3 rounded-full bg-black/40 text-white backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-opacity">🔍</button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h4 className="text-white font-black text-2xl tracking-tight">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {isLightboxOpen && lightboxImage && (
        <div 
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center select-none touch-none"
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <div className="absolute top-5 right-5 z-[160] flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-white">➖</button>
              <span className="text-white font-mono text-xs w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-white">➕</button>
            </div>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button onClick={closeLightbox} className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-xl text-white font-bold">✕</button>
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-move">
            <img 
              src={lightboxImage} 
              alt="Zoom"
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }} 
              className="max-w-full max-h-full object-contain transition-transform duration-75 ease-out" 
              draggable="false"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;