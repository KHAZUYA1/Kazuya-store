const RunningText = () => {
  return (
    <div className="bg-blue-600 dark:bg-blue-900 text-white text-xs font-bold py-2 overflow-hidden relative z-[60]">
      {/* Container Animasi */}
      <div className="whitespace-nowrap animate-marquee flex gap-10">
        
        {/* KONTEN TEKS (Bisa diubah sesuai keinginan) */}
        <span className="mx-4 flex items-center gap-2">
           🔥 PROMO SPESIAL: Diskon 50% Untuk Semua Source Code!
        </span>
        <span className="mx-4 flex items-center gap-2">
           ⚡ Gratis Mentoring & Update Materi Seumur Hidup!"
        </span>
        <span className="mx-4 flex items-center gap-2">
           📢 Maintenance Server: Jam 00:00 - 02:00 WIB
        </span>
        <span className="mx-4 flex items-center gap-2">
           💎 Beli Custom website Gratis Hosting!
        </span>

        {/* DUPLIKAT (Agar looping mulus tidak putus) */}
        <span className="mx-4 flex items-center gap-2">
           🔥 PROMO SPESIAL: Diskon 50% Untuk Semua Source Code!
        </span>
        <span className="mx-4 flex items-center gap-2">
           ⚡ E-book cheat khusus bisnis digital dan pendampingan grup ekslusif
        </span>
      </div>

      {/* CSS Animasi Manual */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* Berhenti saat di-hover mouse */
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default RunningText;