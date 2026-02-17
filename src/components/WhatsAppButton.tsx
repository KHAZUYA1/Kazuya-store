import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 1. LOGIKA SCROLL PINTAR
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Jika di paling atas (Hero), sembunyikan tombol agar bersih
      if (currentScrollY < 100) {
        setIsVisible(false);
        setShowLabel(false);
      } 
      // Jika Scroll ke BAWAH -> Sembunyikan (Biar fokus baca)
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setShowLabel(false);
      } 
      // Jika Scroll ke ATAS -> Munculkan (User mau aksi)
      else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 2. LOGIKA AUTO-GREETING (Muncul sapaan setelah 3 detik)
  useEffect(() => {
    // Munculkan balon sapaan setelah 3 detik
    const timerShow = setTimeout(() => {
      if (window.scrollY > 100) setShowLabel(true);
    }, 3000);

    // Hilangkan balon sapaan otomatis setelah 10 detik (biar gak ganggu)
    const timerHide = setTimeout(() => {
      setShowLabel(false);
    }, 10000);

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <div 
      className={`fixed right-6 z-[100] flex flex-col items-end gap-2 transition-all duration-500 ease-in-out ${
        isVisible ? 'bottom-8 opacity-100 translate-y-0' : '-bottom-20 opacity-0 translate-y-10'
      }`}
    >
      
      {/* --- BALON CHAT (GREETING) --- */}
      <div 
        className={`relative transition-all duration-500 origin-bottom-right ${
          showLabel ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-10 pointer-events-none'
        }`}
      >
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-4 rounded-2xl rounded-tr-none shadow-2xl border border-slate-100 dark:border-slate-700 max-w-[250px] relative">
          
          {/* Tombol Close Kecil */}
          <button 
            onClick={() => setShowLabel(false)}
            className="absolute -top-2 -left-2 bg-slate-200 dark:bg-slate-700 p-1 rounded-full text-slate-500 hover:text-red-500 transition-colors"
          >
            <X size={12} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WA" 
                className="w-5 h-5"
              />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Support</span>
              <span className="text-xs font-bold">Admin Gerbang Digital</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Halo! 👋 Ada yang bisa kami bantu jelaskan soal Produk Digital atau Paket Bisnis?
          </p>
        </div>
        {/* Panah Balon */}
        <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 translate-x-[-15px] translate-y-[-10px] border-b border-r border-slate-100 dark:border-slate-700"></div>
      </div>

      {/* --- TOMBOL UTAMA (BULAT) --- */}
      <a
        href="https://wa.me/6282270189045?text=Halo%20Admin,%20saya%20tertarik%20dengan%20Gerbang%20Digital..."
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowLabel(true)} // Munculkan label saat di-hover (Desktop)
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 active:scale-90 z-50"
      >
        {/* Ping Animation */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping group-hover:animate-none"></span>
        
        {/* Icon */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="Chat" 
          className="w-8 h-8 md:w-9 md:h-9 drop-shadow-md z-10 transition-transform duration-500 group-hover:rotate-[360deg]"
        />

        {/* Badge Notifikasi */}
        <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
          1
        </span>
      </a>

    </div>
  );
};

export default WhatsAppButton;