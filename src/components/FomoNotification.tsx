import { useState, useEffect } from 'react';

// --- DATABASE NAMA ---
const names = [
  "Budi", "Siti", "Andi", "Rina", "Eko", "Dian", "Fajar", "Maya", "Rezky", "Putri", 
  "Kevin", "Bayu", "Citra", "Dewi", "Gilang", "Hendra", "Indah", "Joko", "Kartika", "Lukman"
];

const locations = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", "Bali", "Semarang", "Yogya", 
  "Malang", "Bekasi", "Tangerang", "Bogor"
];

// --- DATABASE PRODUK (SAFE FOR ADS - WHITE HAT) ---
// Hapus: Netflix, Spotify, Canva Pro, Youtube Premium
// Ganti: Source Code, E-Course, Template, Jasa
const transactions = [
  // === KATEGORI: SOURCE CODE (Aman) ===
  { product: "Source Code Website Undangan", action: "membeli" },
  { product: "Script Bot WhatsApp Gateway", action: "checkout" },
  { product: "Source Code POS Kasir Cloud", action: "membeli" },
  { product: "Source Code Aplikasi Laundry", action: "mendownload" },
  { product: "Template Website Company Profile", action: "membeli" },
  { product: "Script Top Up Game Otomatis", action: "membeli" },
  { product: "Web E-Commerce Toko Online", action: "membeli" },
  { product: "Source Code Absensi Wajah AI", action: "checkout" },

  // === KATEGORI: TOP UP GAMES (Aman jika legal) ===
  { product: "366 Diamonds Mobile Legends", action: "top up" },
  { product: "Weekly Diamond Pass MLBB", action: "top up" },
  { product: "1050 VP Valorant", action: "top up" },
  { product: "Welkin Moon Genshin Impact", action: "top up" },
  { product: "60 UC PUBG Mobile", action: "top up" },

  // === KATEGORI: E-COURSE & E-BOOK (Sangat Aman untuk Ads) ===
  { product: "E-Book Jago Freelance", action: "membeli" },
  { product: "Kelas React JS Mastery", action: "mendaftar" },
  { product: "E-Course Laravel Full Stack", action: "checkout" },
  { product: "Panduan SEO Website", action: "mendownload" },
  { product: "E-Book Copywriting", action: "membeli" },
  { product: "Tutorial Video Editing CapCut", action: "akses" },

  // === KATEGORI: ASET DESAIN & JASA (Aman) ===
  { product: "Template UI/UX Figma", action: "mendownload" },
  { product: "Bundle 1000+ Font Premium", action: "membeli" },
  { product: "Template PPT Pitch Deck", action: "checkout" },
  { product: "Preset Lightroom Aesthetic", action: "membeli" },
  { product: "Jasa Install VPS Linux", action: "memesan" },
  { product: "Jasa Setup Landing Page", action: "memesan" }
];

const FomoNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", location: "", action: "", product: "", time: "" });

  useEffect(() => {
    const showRandomNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomTransaction = transactions[Math.floor(Math.random() * transactions.length)];
      const randomTime = Math.floor(Math.random() * 45) + 1;

      setData({
        name: randomName,
        location: randomLocation,
        action: randomTransaction.action,
        product: randomTransaction.product,
        time: `${randomTime} menit lalu`
      });

      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    const initialTimer = setTimeout(showRandomNotification, 3000);
    const intervalTimer = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 10000 + 8000); 

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-[90] transition-all duration-700 transform cubic-bezier(0.34, 1.56, 0.64, 1) ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-[320px] hover:scale-105 transition-transform cursor-pointer">
        <div className="relative shrink-0">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
           </div>
           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
             </svg>
           </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-0.5">
            <span className="font-bold text-slate-900 dark:text-white">{data.name}</span> dari {data.location}
          </p>
          <p className="text-[11px] leading-tight text-slate-800 dark:text-gray-200 font-bold line-clamp-2">
            Baru saja {data.action} <span className="text-indigo-600 dark:text-indigo-400">{data.product}</span>
          </p>
          <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
             <span>⏱️</span> {data.time}
          </p>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FomoNotification;