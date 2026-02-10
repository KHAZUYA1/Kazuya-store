import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Import Firebase
import { db } from '../lib/firebase'; // Pastikan path firebase benar
import { 
  PlayCircle, Lock, ExternalLink, Star, 
  TrendingUp, ShieldAlert, Zap, X, CheckCircle,
  FileCode, BookOpen, Gift, Crown, ArrowRight, ArrowLeft // ✅ Tambah icon ArrowLeft
} from 'lucide-react';
import PaymentHandler from '../components/PaymentHandler';

const MemberArea = () => {
  
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: "", url: "" });

  // --- 1. STATE UNTUK MENYIMPAN LINK DARI DATABASE ---
  const [paymentLinks, setPaymentLinks] = useState({
    basic: '',    // Fallback kosong
    premium: '',
    pro: '' 
  });

  // --- 2. AMBIL LINK DARI FIREBASE SAAT LOADING ---
  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        const docRef = doc(db, "content", "payment_links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentLinks(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Gagal memuat link pembayaran:", error);
      }
    };
    fetchPaymentLinks();
  }, []);

  // --- FUNGSI KLIK BAYAR (UPDATED) ---
  const handleBuy = (planName: string, type: 'basic' | 'premium' | 'pro') => {
    
    // Ambil URL berdasarkan tipe paket
    const url = paymentLinks[type];

    // Cek jika URL kosong (Admin belum input link)
    if (!url) {
      alert("Mohon maaf, pendaftaran sedang ditutup sementara atau Admin belum mengatur link pembayaran.");
      return;
    }

    setSelectedPlan({ name: planName, url: url });
    setIsPayOpen(true);
    if (selectedModule) setSelectedModule(null);
  };

  const scrollToOffer = () => {
     const offerSection = document.getElementById('special-offer');
     if (offerSection) offerSection.scrollIntoView({ behavior: 'smooth' });
  };

  // --- DATABASE KURIKULUM ---
  const curriculum = [
    // --- FASE 1: PONDASI (GRATIS) ---
    { 
      id: 1, 
      title: "Mindset: Kenapa 99% Orang Gagal di Digital (Dan Cara Masuk 1%)", 
      desc: "Membongkar mitos 'harus pinter matematika' untuk sukses di teknologi.",
      type: "video", duration: "10:05", isFree: true 
    },
    { 
      id: 2, 
      title: "Instalasi 'Senjata Perang' Rahasia Para Developer Senior", 
      desc: "Tools gratisan yang dipakai startup unicorn, tapi jarang diketahui pemula.",
      type: "video", duration: "15:20", isFree: true 
    },
    
    // --- FASE 2: TEKNIS RAHASIA (CODING JALAN PINTAS) ---
    { 
      id: 3, 
      title: "Blue Ocean Coding: Membuat Web Tanpa Menghafal Rumus Rumit", 
      desc: "Teknik 'Copy-Paste-Modif' yang membuat Anda terlihat jenius di mata klien.",
      longDesc: "Di modul ini, Anda akan belajar cara 'curang' (legal) membuat website sekelas startup tanpa mengetik kode dari nol. Kami berikan template rahasia yang tinggal Anda pakai.",
      type: "video", duration: "25:00", isFree: false 
    },
    { 
      id: 4, 
      title: "Rahasia Database Google: Simpan Data Pengguna Gratis Seumur Hidup", 
      desc: "Jangan bayar server mahal. Pakai fasilitas raksasa teknologi ini secara cuma-cuma.",
      longDesc: "Tahukah Anda Google punya celah fitur yang bisa kita manfaatkan sebagai database gratisan unlimited? Hemat biaya server Rp 5 Juta/tahun dengan trik ini.",
      type: "video", duration: "30:10", isFree: false 
    },
    { 
      id: 5, 
      title: "Mesin Kasir Otomatis: Terima Uang 24 Jam Tanpa Admin Manual", 
      desc: "Sistem yang bekerja mengumpulkan uang saat Anda tidur (Auto-Verify).",
      longDesc: "Integrasi Payment Gateway otomatis. Biarkan sistem memverifikasi transfer dan mengirim produk digital ke pembeli jam 3 pagi saat Anda tidur nyenyak.",
      type: "video", duration: "28:30", isFree: false 
    },
    { 
      id: 6, 
      title: "Teknik 'Global Launch': Website Online ke Seluruh Dunia dalam 3 Detik", 
      desc: "Cara membuat website Anda bisa diakses dari Amerika sampai Eropa tanpa biaya hosting.",
      type: "video", duration: "14:15", isFree: false 
    },

    // --- FASE 3: STRATEGI BISNIS & MARKETING ---
    { 
      id: 7, 
      title: "STRATEGI 'GHOST MARKET': Menjual Produk Digital Tanpa Perang Harga", 
      desc: "Cara menemukan pembeli yang rela bayar mahal dan setia pada Anda.",
      longDesc: "Bongkar strategi marketing 'Hantu'. Bagaimana cara menjual Source Code seharga Rp 500rb tapi terasa murah bagi pembeli.",
      type: "strategy", duration: "45:00", isFree: false 
    },
    { 
      id: 8, 
      title: "TRAFFIC HACK: Cara Mendatangkan 10.000 Pengunjung Tanpa Iklan Berbayar", 
      desc: "Teknik SEO & Organic Marketing yang disembunyikan agensi digital mahal.",
      type: "strategy", duration: "40:00", isFree: false 
    },
    { 
      id: 9, 
      title: "FOMO ENGINEERING: Psikologi Membuat Orang 'Takut Kehabisan' Saat Beli", 
      desc: "Copywriting hipnotis yang memaksa otak reptil manusia untuk segera transfer.",
      type: "strategy", duration: "35:00", isFree: false 
    },

    // --- FASE 4: EXPANSION & AI ---
    { 
      id: 10, 
      title: "AI SURVIVAL KIT: Coding & Nulis Konten 10x Lebih Cepat", 
      desc: "Biarkan robot yang bekerja keras, Anda yang terima bayarannya.",
      type: "ai", duration: "35:00", isFree: false 
    },
    { 
      id: 11, 
      title: "APP CONVERSION: Mengubah Website Jadi Aplikasi Android (APK) dalam 1 Klik", 
      desc: "Jual jasa pembuatan aplikasi Android dengan modal website yang sudah Anda buat.",
      type: "video", duration: "20:00", isFree: false 
    },

    // --- FASE 5: ASET DIGITAL & SOURCE CODE (THE TREASURE) ---
    { 
      id: 12, 
      title: "SOURCE CODE: 'Marketplace Engine' Seharga Rp 50 Juta", 
      desc: "Full Source Code toko online mirip Tokopedia/Shopee. Siap pakai & siap jual.",
      longDesc: "Anda mendapatkan File Project Utuh. Tinggal ganti logo, ganti warna, langsung jadi milik Anda. Bisa dijual ke klien seharga puluhan juta.",
      type: "source_code", duration: "DOWNLOAD", isFree: false 
    },
    { 
      id: 13, 
      title: "SOURCE CODE: 'SaaS Starter Kit' (Aplikasi Berlangganan)", 
      desc: "Template bisnis software berlangganan. Passive income bulanan yang nyata.",
      type: "source_code", duration: "DOWNLOAD", isFree: false 
    },
    { 
      id: 14, 
      title: "SOURCE CODE: 'Company Profile Premium' (5 Varian)", 
      desc: "Lima desain website perusahaan mewah. Jual Rp 5 Juta/web sangat mudah.",
      type: "source_code", duration: "DOWNLOAD", isFree: false 
    },
    { 
      id: 15, 
      title: "ASSET PACK: 1000+ UI/UX Element Design Premium", 
      desc: "Koleksi tombol, form, dan layout siap tempel. Desain web jadi secepat kilat.",
      type: "asset", duration: "ZIP FILE", isFree: false 
    },

    // --- FASE 6: BONUS EKSKLUSIF ---
    { 
      id: 16, 
      title: "E-BOOK: 'Kitab Hitam Digital Marketing' (PDF)", 
      desc: "Rangkuman strategi jualan senilai Rp 10 Juta yang kami pakai sehari-hari.",
      type: "ebook", duration: "PDF", isFree: false 
    },
    { 
      id: 17, 
      title: "LIFETIME UPDATE: Akses Materi Baru Selamanya", 
      desc: "Teknologi berubah, kami update materinya. Anda tidak perlu bayar lagi.",
      type: "bonus", duration: "VIP", isFree: false 
    },
    { 
      id: 18, 
      title: "PRIVILEGE CIRCLE: Akses Jalur Pribadi ke Mentor", 
      desc: "Mentoring tanya jawab sepuasnya jika ada kendala error atau strategi buntu.",
      type: "bonus", duration: "WHATSAPP", isFree: false 
    },
  ];

  const getIcon = (type: string, isFree: boolean) => {
     if (isFree) return <PlayCircle size={32} />;
     switch(type) {
        case 'source_code': return <FileCode size={28} />;
        case 'ebook': return <BookOpen size={28} />;
        case 'bonus': return <Gift size={28} />;
        case 'asset': return <Crown size={28} />;
        case 'ai': return <Zap size={28} />;
        default: return <Lock size={28} />;
     }
  };

  const getBadgeColor = (type: string) => {
     switch(type) {
        case 'source_code': return "bg-blue-100 text-blue-800 border-blue-200";
        case 'strategy': return "bg-purple-100 text-purple-800 border-purple-200";
        case 'ai': return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case 'bonus': return "bg-pink-100 text-pink-800 border-pink-200";
        default: return "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300";
     }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans relative">
      
      {/* --- MODAL POPUP PREVIEW (TEASER) --- */}
      {selectedModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-scale-up">
            
            <button 
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition z-10"
            >
              <X size={20} />
            </button>

            <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <Lock size={48} className="text-slate-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3]" />
               <div className="z-10 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm">
                  <Lock size={16} /> KONTEN PREMIUM (VIP)
               </div>
            </div>

            <div className="p-8">
               <h3 className="text-xl font-black mb-4 leading-tight">
                 {selectedModule.title}
               </h3>
               <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed font-medium">
                 {selectedModule.longDesc || selectedModule.desc}
               </p>

               <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 rounded-xl mb-6">
                  <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-2 flex items-center gap-2">
                    <CheckCircle size={16} /> Termasuk Dalam Paket PRO:
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-1 font-medium">
                    <li>• Akses Materi Seumur Hidup</li>
                    <li>• Source Code Boleh Dijual Ulang (Syarat Berlaku)</li>
                    <li>• Grup Support VIP</li>
                  </ul>
               </div>

               {/* TOMBOL BAYAR DINAMIS (MODAL) */}
               <button 
                 onClick={() => handleBuy("PAKET BUSINESS OWNER (VIP)", "pro")}
                 className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-xl shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
               >
                 🔥 AMBIL AKSES SEKARANG
               </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER MEMBER AREA */}
      <div className="bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             {/* ✅ TOMBOL KEMBALI KE HOME */}
             <button 
                onClick={() => window.location.href = '/'}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Kembali ke Halaman Utama"
             >
                <ArrowLeft size={24} />
             </button>

             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg">G</div>
                <div className="hidden sm:block">
                    <h1 className="font-black text-xl leading-none tracking-tight">Member Area</h1>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akses Terbatas (Trial)</span>
                </div>
             </div>
          </div>
          
          <button 
            onClick={scrollToOffer}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs md:text-sm font-bold px-4 md:px-6 py-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition border border-white/20 whitespace-nowrap"
          >
             🔓 BUKA SEMUA
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        
        {/* SECTION 1: WELCOME BANNER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-[2px] shadow-2xl mb-12 transform hover:scale-[1.01] transition duration-500">
           <div className="bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover rounded-[22px] p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="relative z-10 text-white">
                  <div className="inline-flex items-center gap-2 bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black mb-5 shadow-lg">
                     <Star size={16} fill="currentColor" /> EKSKLUSIF CALON SULTAN
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight tracking-tight">
                     Intip "Gudang Senjata"<br/>Yang Akan Anda Miliki.
                  </h2>
                  <p className="text-slate-200 mb-8 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
                    Di bawah ini adalah daftar lengkap Modul, Source Code, dan Aset Digital yang akan menjadi milik Anda sepenuhnya. Tanpa basa-basi akademis.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={scrollToOffer} className="flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-6 py-4 rounded-xl hover:bg-blue-50 transition shadow-xl text-sm md:text-base">
                        <ExternalLink size={20} /> Amankan Akses Sekarang
                    </button>
                  </div>
              </div>
           </div>
        </div>

        {/* SECTION 2: KURIKULUM LIST */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
                <TrendingUp className="text-blue-600 dark:text-blue-400" size={32} />
                Kurikulum Lengkap
            </h3>
            <span className="text-sm font-bold bg-green-100 text-green-700 border border-green-200 px-4 py-2 rounded-lg shadow-sm">
               ✅ Modul 1-2 Gratis
            </span>
        </div>
        
        <div className="grid gap-4">
          {curriculum.map((item) => (
            <div 
              key={item.id} 
              className={`relative overflow-hidden group rounded-2xl border-2 transition-all duration-300 ${
                item.isFree 
                  ? 'bg-white dark:bg-[#1a1a1a] border-green-500/50 hover:border-green-500 shadow-lg' 
                  : 'bg-slate-50 dark:bg-[#111] border-slate-200 dark:border-slate-800 opacity-95 hover:opacity-100'
              }`}
            >
              <div className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                  
                  {/* Icon & Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                       item.isFree 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' 
                        : 'bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-500 border border-slate-100 dark:border-slate-700'
                    }`}>
                       {getIcon(item.type, item.isFree)}
                    </div>
                    <div>
                       <h4 className={`font-black text-base md:text-lg mb-1 leading-snug ${item.isFree ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                         {item.title}
                       </h4>
                       <p className={`text-sm font-medium leading-relaxed ${item.isFree ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {item.desc}
                       </p>
                       <div className="flex flex-wrap gap-2 mt-3">
                          <span className={`text-[10px] font-bold border px-2 py-1 rounded-md flex items-center gap-1 ${getBadgeColor(item.type)}`}>
                             {item.duration.includes(":") ? `⏱ ${item.duration} Menit` : `📦 ${item.duration}`}
                          </span>
                       </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                     {item.isFree ? (
                        <button className="w-full md:w-auto px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2">
                           <PlayCircle size={18} /> TONTON
                        </button>
                     ) : (
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 w-full p-3 md:p-0 rounded-lg md:bg-transparent">
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-100 px-2 py-1 rounded-md border border-red-200">
                              <Lock size={12} /> LOCKED
                           </div>
                           <button 
                              onClick={() => setSelectedModule(item)}
                              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                           >
                              Intip Isi <ExternalLink size={12}/>
                           </button>
                        </div>
                     )}
                  </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* --- SECTION 3: PENAWARAN KHUSUS (HARGA CORET & SOLUSI ALTERNATIF) --- */}
        <div id="special-offer" className="mt-16 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center p-8 md:p-12 transform hover:scale-[1.01] transition duration-500">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
           
           <ShieldAlert size={56} className="text-red-500 mx-auto mb-4 animate-pulse" />
           
           <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              Dapatkan Akses Penuh (Paket PRO)
           </h3>
           <p className="text-slate-400 text-sm mb-8">
              Total Nilai Asli (Value) Semua Modul: <span className="text-slate-300 font-bold">Rp 50.000.000+</span>
           </p>

           <div className="mb-8">
               <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wide">Harga Normal:</p>
               <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                  <span className="text-2xl md:text-3xl text-slate-500 line-through font-bold decoration-red-500 decoration-2">
                     Rp 1.890.000
                  </span>
                  <span className="hidden md:inline text-slate-600">👉</span>
                  <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 filter drop-shadow-lg">
                     Rp 890.000
                  </span>
               </div>
               <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-4 py-1 mt-3">
                  <p className="text-green-400 text-xs md:text-sm font-bold animate-pulse">
                     ⚡ Hemat Rp 1.000.000 Khusus Hari Ini!
                  </p>
               </div>
           </div>
           
           <div className="flex flex-col gap-4 max-w-md mx-auto mb-10">
              {/* TOMBOL BAYAR PRO (DINAMIS) */}
              <button 
                onClick={() => handleBuy("PAKET BUSINESS OWNER (VIP)", "pro")}
                className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:scale-105 transition-all text-xl tracking-wide flex items-center justify-center gap-2"
              >
                 AMBIL PAKET PRO SEKARANG <ArrowRight strokeWidth={3} />
              </button>
              <p className="text-xs text-slate-400 font-bold">
                 *Akses Seumur Hidup. Sekali Bayar. Garansi Uang Kembali.
              </p>
           </div>

           {/* --- SOLUSI ALTERNATIF (DOWNSELL DINAMIS) --- */}
           <div className="border-t border-slate-700 pt-8 mt-8">
              <p className="text-slate-300 font-bold mb-4 text-sm md:text-base">
                 💰 Budget Belum Cukup untuk PRO? <br/>
                 <span className="font-normal text-slate-400 text-xs">Tenang, Anda tetap bisa mulai belajar dengan opsi hemat:</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                 <button 
                    onClick={() => handleBuy("PAKET STARTER (BASIC)", "basic")}
                    className="px-6 py-3 rounded-xl border border-slate-600 hover:border-white hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
                 >
                    📦 Ambil Paket BASIC (Rp 149rb)
                 </button>
                 <button 
                    onClick={() => handleBuy("PAKET BUILDER (PREMIUM)", "premium")}
                    className="px-6 py-3 rounded-xl border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-400 transition-all text-xs font-bold flex items-center gap-2"
                 >
                    🚀 Ambil Paket PREMIUM (Rp 560rb)
                 </button>
              </div>
           </div>

        </div>

      </div>

      {/* --- PAYMENT HANDLER (MODAL LOADING KE MIDTRANS) --- */}
      <PaymentHandler 
        isOpen={isPayOpen} 
        onClose={() => setIsPayOpen(false)}
        planName={selectedPlan.name}
        paymentUrl={selectedPlan.url}
      />

    </div>
  );
};

export default MemberArea;