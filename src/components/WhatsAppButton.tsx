const WhatsAppButton = () => {
  return (
    /* Posisi dinaikkan ke bottom-48 (~192px) agar benar-benar bersih dari area FOMO */
    <div className="fixed bottom-48 right-6 z-[75] flex flex-col items-end group">
      
      {/* 1. LABEL INFO (Glassmorphism Premium) */}
      <div className="mb-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ada Pertanyaan?</span>
            <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">Admin Gerbang Digital</span>
          </div>
        </div>
      </div>

      {/* 2. TOMBOL UTAMA (3D Glass Glow) */}
      <div className="relative">
        {/* Efek Aura Hijau di Belakang */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full blur-2xl opacity-30 animate-pulse group-hover:opacity-60 transition-opacity"></div>
        
        <a
          href="https://wa.me/6282270189045"
          target="_blank"
          rel="noreferrer"
          className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(37,211,102,0.4)] border-2 border-white/50 dark:border-white/10 hover:scale-115 hover:-rotate-12 transition-all duration-300 active:scale-95 overflow-hidden"
        >
          {/* Logo WhatsApp High Quality (Vector SVG) */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp" 
            className="w-9 h-9 drop-shadow-lg"
          />
          
          {/* Efek Cahaya Bergerak (Shine Effect) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine transition-all"></div>
        </a>

        {/* Badge Notifikasi Angka 1 (Animated) */}
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xl animate-bounce">
          1
        </span>
      </div>
    </div>
  );
};

export default WhatsAppButton;