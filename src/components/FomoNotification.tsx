import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FomoNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", location: "", action: "", product: "", time: "" });
  
  const { currentLang } = useLanguage();

  // --- KAMUS DATA ---
  const content: any = {
    ID: {
      names: [
        "Budi", "Siti", "Andi", "Rina", "Eko", "Dian", "Fajar", "Maya", "Rezky", "Putri", 
        "Kevin", "Bayu", "Citra", "Dewi", "Gilang", "Hendra", "Indah", "Joko", "Kartika", "Lukman",
        "Sarah", "Dimas", "Nadia", "Rian", "Agus", "Lina", "Tono", "Wawan", "Ratna", "Hesti",
        "Ilham", "Yusuf", "Aulia", "Bagas", "Cindi", "Doni", "Endang", "Farhan", "Gita", "Hadi",
        "Intan", "Jamal", "Kiki", "Laras", "Miko", "Nisa", "Oscar", "Pandu", "Qori", "Rizal"
      ],
      locations: [
        "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", "Bali", "Semarang", "Yogya", 
        "Malang", "Bekasi", "Tangerang", "Bogor", "Depok", "Palembang", "Pekanbaru", "Batam",
        "Solo", "Cirebon", "Lampung", "Padang", "Pontianak", "Samarinda", "Balikpapan", "Manado"
      ],
      textFrom: "dari",
      textJust: "Baru saja",
      textTime: "menit lalu",
      
      transactions: [
        // --- 🔥 PAKET PRO (SANGAT SERING MUNCUL - DOMINAN) ---
        { product: "Paket PRO (VIP)", action: "join" },
        { product: "Paket PRO (VIP)", action: "mendaftar" },
        { product: "Paket PRO (VIP)", action: "membeli" },
        { product: "Paket PRO (VIP)", action: "checkout" },
        { product: "Paket PRO (VIP)", action: "mengamankan slot" },
        { product: "Paket PRO (VIP)", action: "upgrade ke" },
        { product: "Paket PRO (VIP)", action: "bergabung di" },
        { product: "Paket PRO (VIP)", action: "transfer untuk" },

        // --- 🔥 PAKET PREMIUM (SERING MUNCUL) ---
        { product: "Paket PREMIUM", action: "upgrade ke" },
        { product: "Paket PREMIUM", action: "membeli" },
        { product: "Paket PREMIUM", action: "mendaftar" },
        { product: "Paket PREMIUM", action: "checkout" },
        { product: "Paket PREMIUM", action: "join" },

        // --- 🔥 PAKET BASIC (SERING MUNCUL) ---
        { product: "Paket BASIC", action: "membeli" },
        { product: "Paket BASIC", action: "mendaftar" },
        { product: "Paket BASIC", action: "join" },
        { product: "Paket BASIC", action: "checkout" },

        // --- AKSES MEMBER ---
        { product: "Akses Member Area", action: "login ke" },
        { product: "Akses Member Area", action: "masuk ke" },

        // --- PRODUK SATUAN (PELENGKAP - JARANG MUNCUL) ---
        { product: "Source Code POS Kasir", action: "mendownload" },
        { product: "Script Bot WhatsApp", action: "checkout" },
        { product: "Source Code Web Undangan", action: "membeli" },
        { product: "Source Code Aplikasi Laundry", action: "mendownload" },
        { product: "Script Top Up Game Otomatis", action: "membeli" },
        { product: "Source Code Absensi Wajah AI", action: "checkout" },
        { product: "Web E-Commerce Toko Online", action: "membeli" },
        { product: "Script Sistem HRIS Payroll", action: "membeli" },
        { product: "Source Code Company Profile", action: "mendownload" },
        { product: "E-Book Copywriting", action: "membeli" },
        { product: "Panduan SEO Website", action: "mendownload" },
        { product: "E-Course Jago Freelance", action: "mendaftar" },
        { product: "Tutorial CapCut Mastery", action: "akses" },
        { product: "Kelas React JS Mastery", action: "join" },
        { product: "E-Course Laravel Full Stack", action: "checkout" },
        { product: "E-Book Jago Jualan", action: "membeli" },
        { product: "Template UI Kit Figma", action: "mendownload" },
        { product: "Bundle 1000+ Font", action: "membeli" },
        { product: "Template PPT Pitch Deck", action: "checkout" },
        { product: "Preset Lightroom", action: "membeli" },
        { product: "Jasa Pembuatan Website", action: "konsultasi" }
      ]
    },
    EN: {
      names: [
        "James", "Olivia", "Robert", "Emma", "Michael", "Sophia", "David", "Charlotte", "John", "Amelia",
        "William", "Ava", "Richard", "Emily", "Joseph", "Mia", "Thomas", "Harper", "Charles", "Evelyn",
        "Daniel", "Abigail", "Matthew", "Ella", "Anthony", "Scarlett", "Donald", "Grace", "Mark", "Chloe"
      ],
      locations: [
        "New York", "London", "Singapore", "Sydney", "Los Angeles", "Toronto", "Berlin", "Tokyo",
        "Dubai", "Paris", "Amsterdam", "Hong Kong", "Kuala Lumpur", "Melbourne", "Chicago", "San Francisco"
      ],
      textFrom: "from",
      textJust: "Just",
      textTime: "mins ago",
      transactions: [
        // --- PLANS DOMINANT ---
        { product: "PRO Plan (VIP)", action: "joined" },
        { product: "PRO Plan (VIP)", action: "purchased" },
        { product: "PRO Plan (VIP)", action: "checked out" },
        { product: "PRO Plan (VIP)", action: "secured spot in" },
        { product: "PREMIUM Plan", action: "upgraded to" },
        { product: "PREMIUM Plan", action: "purchased" },
        { product: "PREMIUM Plan", action: "joined" },
        { product: "BASIC Plan", action: "purchased" },
        { product: "BASIC Plan", action: "registered for" },
        
        // --- PRODUCTS ---
        { product: "Cloud POS Source Code", action: "purchased" },
        { product: "WhatsApp Gateway Script", action: "checked out" },
        { product: "Laundry App Code", action: "downloaded" },
        { product: "E-Commerce Web Code", action: "purchased" },
        { product: "HRIS System Script", action: "purchased" },
        { product: "Freelance Mastery Course", action: "registered" },
        { product: "React JS Class", action: "joined" },
        { product: "Laravel Full Stack", action: "checked out" },
        { product: "Copywriting E-Book", action: "purchased" },
        { product: "Figma UI Kit", action: "downloaded" },
        { product: "Premium Font Bundle", action: "purchased" }
      ]
    }
  };

  const t = content[currentLang] || content['EN'];

  useEffect(() => {
    // FIX TIPE DATA: Gunakan 'any' untuk menghindari error TypeScript browser vs node
    let timeoutId: any; 

    const triggerNotification = () => {
      // 1. Generate Data Acak
      const currentNames = t.names;
      const currentLocations = t.locations;
      const currentTransactions = t.transactions;

      const randomName = currentNames[Math.floor(Math.random() * currentNames.length)];
      const randomLocation = currentLocations[Math.floor(Math.random() * currentLocations.length)];
      
      // Karena item Paket diduplikasi di array, kemungkinan terpilihnya lebih besar
      const randomTransaction = currentTransactions[Math.floor(Math.random() * currentTransactions.length)];
      
      const randomTime = Math.floor(Math.random() * 59) + 1; 

      setData({
        name: randomName,
        location: randomLocation,
        action: randomTransaction.action,
        product: randomTransaction.product,
        time: `${randomTime} ${t.textTime}`
      });

      // 2. Tampilkan Notifikasi
      setVisible(true);

      // 3. Sembunyikan setelah 6 detik
      setTimeout(() => {
        setVisible(false);
      }, 6000);

      // 4. JADWALKAN Notifikasi Berikutnya (Random 45s - 120s)
      const minDelay = 45000; 
      const maxDelay = 120000; 
      const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

      timeoutId = setTimeout(triggerNotification, nextDelay);
    };

    // Muncul pertama kali setelah 10 detik
    const initialDelay = setTimeout(triggerNotification, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, [currentLang, t]); 

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-[90] transition-all duration-700 transform cubic-bezier(0.34, 1.56, 0.64, 1) ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-[320px] hover:scale-105 transition-transform cursor-pointer group border-l-4 border-l-blue-500">
        
        {/* ICON (Shopping Bag) */}
        <div className="relative shrink-0">
           <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
           </div>
           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
             <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
             </svg>
           </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="flex flex-col">
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-0.5">
            <span className="font-bold text-slate-900 dark:text-white">{data.name}</span> {t.textFrom} {data.location}
          </p>
          <p className="text-[11px] leading-tight text-slate-800 dark:text-gray-200 font-bold line-clamp-2">
            {t.textJust} {data.action} <span className="text-blue-600 dark:text-blue-400">{data.product}</span>
          </p>
          <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
             <span>⏱️</span> {data.time}
          </p>
        </div>

        {/* CLOSE BUTTON */}
        <button 
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FomoNotification;