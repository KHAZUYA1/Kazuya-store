import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Import Firebase
import { db } from '../lib/firebase'; // Pastikan path ini sesuai
import { 
  AlertTriangle, CheckCircle, XCircle, ShieldCheck, Lock, 
  ArrowRight, PlayCircle 
} from 'lucide-react'; 
import PaymentHandler from './PaymentHandler'; 

interface Props {
  isDarkMode: boolean;
  lang: string;
}

// --- DATABASE COPYWRITING ---
const texts = {
  id: {
    hookTag: "⚠️ PERINGATAN: GELOMBANG PHK & AI SUDAH DIMULAI",
    hookTitle: "Revolusi AI & Otomasi Sedang Terjadi.",
    hookSub: "Anda di Pihak Mana: Pengendali Teknologi atau Korban Perubahan Zaman?",
    hookDesc: "Dunia berubah cepat. Skill lama Anda mungkin tidak lagi berharga. Kami tidak hanya memberi Anda 'Source Code', tapi PETA JALAN (Roadmap) lengkap: Dari belajar coding nol, strategi bisnis digital miliaran, hingga cara bertahan dan cuan di era gempuran AI.",
    
    probTitle: "Mengapa Banyak Orang Gagal Memulai?",
    prob1: "Biaya Belajar Tak Masuk Akal",
    prob1Desc: "Kuliah IT butuh 4 tahun. Bootcamp coding Rp 20 Juta. Kursus bisnis Rp 15 Juta. Di sini, Anda dapat semuanya tanpa bikin kantong jebol.",
    prob2: "Hanya Teori, Minim Strategi",
    prob2Desc: "Banyak yang jualan tutorial coding, tapi lupa mengajarkan CARA JUALANNYA. Akibatnya? Punya skill tapi dompet tetap kosong.",
    prob3: "Gaptek & Takut Coding",
    prob3Desc: "Merasa coding itu bahasa alien? Kami patahkan mitos itu. Dengan bantuan AI dan panduan kami, orang awam pun bisa bikin aplikasi canggih.",
    probFooter: "Pilihan Anda: Adaptasi sekarang dengan teknologi, atau tertinggal selamanya.",

    solTitle: "Hancurkan Semua Batasan Itu Bersama",
    solBrand: "GERBANG DIGITAL",
    solDesc: "Satu-satunya ekosistem 'Survival Kit' Digital. Kami gabungkan Skill Teknis (Coding) + Senjata Perang (Source Code) + Strategi Bisnis (E-Book & Mentoring) dalam satu tempat.",
    solList: [
      "Zero to Hero Coding: Diajarkan bahasa manusia, bukan bahasa robot. Gaptek pun bisa paham dalam 1 Bulan.",
      "Business Mastery: Bukan cuma bisa bikin web, tapi bisa MENJUALNYA. Kami bongkar strategi bisnis & marketing langit yang sudah terbukti menghasilkan miliaran.",
      "Senjata Lengkap (Source Code): Jangan mulai dari kertas kosong. Kami berikan ratusan source code siap pakai. Tinggal edit, ganti nama, lalu jual/pakai sendiri.",
      "Future-Proof Skill: Bekali diri Anda dengan skill yang anti-krisis dan tidak mudah digantikan oleh robot."
    ],

    stackTitle: "Berapa Nilai Investasi Leher ke Atas Ini?",
    stackList: [
      { item: "Materi Bootcamp Full Stack (Nol s/d Mahir)", value: "Rp 20.000.000" },
      { item: "E-Book Strategi Bisnis Digital Miliaran", value: "Rp 10.000.000" },
      { item: "Modul UI/UX Figma Master", value: "Rp 5.000.000" },
      { item: "100+ Source Code Premium Siap Jual", value: "Rp 15.000.000" },
      { item: "Bonus Produk Digital (PLR) Resellable", value: "Rp 2.500.000" },
    ],
    stackTotalLabel: "TOTAL NILAI ASLI:",
    stackTotalValue: "Rp 52.500.000",
    stackBridge: "Tapi Anda tidak perlu membayar seharga mobil bekas untuk masa depan Anda.",

    priceTitle: "Pilih Jalur Sukses Anda",
    
    freeTitle: "RAGU BELI KUCING DALAM KARUNG?",
    freeSub: "Coba akses Member Area GRATIS. Lihat materinya, coba demo aplikasinya. Tidak ada risiko.",
    freeBtn: "COBA AKSES GRATIS (LIMITED)",

    p1Name: "PAKET STARTER",
    p1Sub: "Solusi Hemat untuk Pemula (Budget Terbatas)", 
    p1Price: "Rp 149.000", 
    p1Feat: [
        "Akses Materi Dasar Coding & Mindset", 
        "Modul Pengenalan Bisnis Digital", 
        "Akses Grup Komunitas Member", 
        "Tanpa Bonus Source Code Premium"
    ],
    p1Btn: "AMBIL PAKET HEMAT",
    
    p2Name: "PAKET BUILDER",
    p2Sub: "Fokus Skill Teknis (Tanpa Strategi Bisnis)", 
    p2Price: "Rp 560.000", 
    p2Feat: [
        "Materi Lengkap (Coding + UI/UX)", 
        "Akses Video Pembelajaran Full", 
        "Support Grup Diskusi Teknis", 
        "Tanpa Strategi Bisnis & Source Code VIP"
    ],
    p2Btn: "AMBIL PAKET BUILDER",
    
    p3Name: "PAKET BUSINESS OWNER (VIP)",
    p3Badge: "🔥 SOLUSI TERLENGKAP",
    p3Sub: "Skill + Produk + Strategi Cuan (All-in-One)",
    p3Strike: "Rp 1.890.000", 
    p3Price: "Rp 890.000", 
    p3Feat: [
      "FULL AKSES: Materi Coding + Desain + Bisnis",
      "Ratusan Source Code Premium (Tinggal Jual)",
      "E-Book Strategi Bisnis & Marketing Miliaran",
      "MENTORING & GRUP VIP (Dibimbing Sampai Bisa)",
      "Update Materi AI Terbaru Seumur Hidup"
    ],
    p3Btn: "GABUNG KELAS VIP SEKARANG 🚀",

    guaranteeTitle: "GARANSI 100% UANG KEMBALI",
    guaranteeDesc: "Kami tidak butuh uang Anda jika materi ini tidak bermanfaat. Jika dalam 30 hari Anda merasa materi ini tidak sesuai janji, tidak lengkap, atau Anda tidak paham sama sekali setelah mengikuti panduan, klaim garansi Anda. Uang kembali 100%.",
    closingHead: "Pilihan Ada di Tangan Anda",
    closingText: "Anda bisa menutup halaman ini dan kembali menjalani rutinitas lama yang berisiko tergerus zaman.\n\nATAU...\n\nAnda ambil keputusan berani hari ini. Klik tombol di bawah, pelajari skill mahal ini, manfaatkan source code-nya, dan bangun kerajaan bisnis digital Anda sendiri.",
    finalBtn: "SAYA SIAP MENGAMANKAN MASA DEPAN 🚀"
  },
  en: {
    hookTag: "⚠️ WARNING: THE AI ERA IS HERE",
    hookTitle: "Don't Let Yourself Become Obsolete.",
    hookSub: "Either You Master Digital & AI, or You Get Replaced by Those Who Do.",
    hookDesc: "We don't just sell code. We provide a SURVIVAL MAP. From zero coding skills to building a Billion-Rupiah Tech Business. Secure your future now.",
    
    probTitle: "The Harsh Truth",
    prob1: "Adapt or Die",
    prob1Desc: "Old businesses are collapsing. Bootcamp costs $2000+. Here, you get everything without breaking the bank.",
    prob2: "Learning Alone is Slow",
    prob2Desc: "Tutorials teach code, but forget to teach SALES. We give you both: Technical Skills + Business Strategy.",
    prob3: "Tech-Phobia?",
    prob3Desc: "Thinking technology is 'hard' is just a mindset block. With our guide & AI, even beginners can build apps.",
    probFooter: "Your competitors are already using AI to steal your market share.",

    solTitle: "The Fast Track to",
    solBrand: "DIGITAL DOMINATION",
    solDesc: "A complete ecosystem. Coding Skills + Source Code Weaponry + Billionaire Business Strategy in one place.",
    solList: [
      "Zero-Tech to Hero: Step-by-step guidance for beginners. No jargon.",
      "Business Mastery: Not just building apps, but SELLING them. We reveal proven marketing strategies.",
      "Complete Arsenal: Hundreds of Ready-to-Sell Source Codes. Save 90% of your time.",
      "Future-Proof Skills: Master skills that AI cannot replace."
    ],

    stackTitle: "What You Actually Get",
    stackList: [
      { item: "Full Stack Bootcamp Material", value: "$2,000" },
      { item: "Billionaire Business Strategy E-Book", value: "$1,500" },
      { item: "UI/UX Figma Master Module", value: "$500" },
      { item: "100+ Premium Source Codes", value: "$1,000" },
      { item: "Resellable Digital Products Bonus", value: "$250" },
    ],
    stackTotalLabel: "REAL VALUE:",
    stackTotalValue: "$5,250",
    stackBridge: "But you don't need to pay the price of a used car for your future.",

    priceTitle: "Choose Your Path",
    
    freeTitle: "NOT SURE YET?",
    freeSub: "Try our Member Area for FREE. Watch Module 1 & 2, check the demos. No risk.",
    freeBtn: "TRY FREE ACCESS",

    p1Name: "STARTER PACK",
    p1Sub: "Budget Friendly Option",
    p1Price: "IDR 149K", 
    p1Feat: ["Basic Mindset & Coding", "Digital Business Intro", "Community Group Access", "No Premium Source Code"],
    p1Btn: "GET STARTER",
    
    p2Name: "BUILDER PACK",
    p2Sub: "Focus on Technical Skills",
    p2Price: "IDR 560K", 
    p2Feat: ["Complete Coding Material", "Video Learning Access", "Tech Support Group", "No Business Strategy"],
    p2Btn: "GET BUILDER",
    
    p3Name: "BUSINESS OWNER (VIP)",
    p3Badge: "🔥 BEST SELLER",
    p3Sub: "Skill + Product + Strategy",
    p3Strike: "IDR 1.890K", 
    p3Price: "IDR 890K", 
    p3Feat: ["FULL ACCESS Strategy & Codes", "Ready-to-Sell Products", "Billionaire Strategy E-Book", "VIP MENTORING", "Lifetime Updates"],
    p3Btn: "JOIN VIP CLASS NOW 🚀",

    guaranteeTitle: "100% MONEY BACK GUARANTEE",
    guaranteeDesc: "If it's not useful within 30 days, get 100% refund.",
    closingHead: "The Choice is Yours",
    closingText: "Take action today. Don't let AI take your place. Build your digital empire now.",
    finalBtn: "I AM READY TO CHANGE 🚀"
  }
};

const GerbangDigitalComplete: React.FC<Props> = ({ isDarkMode, lang }) => {
  const t = (lang === 'EN') ? texts.en : texts.id;

  const bgBase = isDarkMode ? "bg-slate-900/80" : "bg-white/90";
  const textMain = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-300" : "text-slate-700"; 
  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-md";

  // --- LOGIKA PEMBAYARAN DINAMIS ---
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: "", url: "" });
  
  // State untuk Link dari Firebase
  const [paymentLinks, setPaymentLinks] = useState({
    basic: '',
    premium: '',
    pro: ''
  });

  // --- AMBIL LINK DARI FIREBASE SAAT LOAD ---
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(db, "content", "payment_links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentLinks(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching payment links:", error);
      }
    };
    fetchLinks();
  }, []);

  // --- FUNGSI KLIK BAYAR ---
  const handleBuy = (planName: string, type: 'basic' | 'premium' | 'pro') => {
    const url = paymentLinks[type];

    if (!url) {
      alert("⚠️ Link pembayaran belum disetting oleh Admin.");
      return;
    }

    setSelectedPlan({ name: planName, url: url });
    setIsPayOpen(true);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-grid');
    if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="pricing-section" className={`w-full max-w-7xl mx-auto font-sans transition-colors duration-300 ${bgBase} backdrop-blur-xl rounded-[2.5rem] border border-slate-500/20 p-6 lg:p-16 my-16 shadow-2xl`}>

      {/* 1. HERO HOOK */}
      <div className="text-center mb-16 lg:mb-24 max-w-5xl mx-auto">
        <div className="inline-block bg-red-600/90 text-white text-xs lg:text-sm font-bold px-6 py-2 rounded-full mb-8 animate-pulse border border-red-500 shadow-lg tracking-wider">
          {t.hookTag}
        </div>
        <h2 className="text-3xl lg:text-6xl font-black mb-8 leading-tight">
          {t.hookTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 block mt-3">
            {t.hookSub}
          </span>
        </h2>
        <p className={`text-base lg:text-xl leading-relaxed max-w-4xl mx-auto font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
          {t.hookDesc}
        </p>
      </div>

      {/* 2. PROBLEM */}
      <div className="text-center mb-10">
        <h3 className="text-2xl lg:text-3xl font-bold">{t.probTitle}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16">
        {[
          { icon: <XCircle size={48}/>, title: t.prob1, desc: t.prob1Desc, color: "text-red-500" },
          { icon: <AlertTriangle size={48}/>, title: t.prob2, desc: t.prob2Desc, color: "text-yellow-500" },
          { icon: <Lock size={48}/>, title: t.prob3, desc: t.prob3Desc, color: "text-gray-500" }
        ].map((item, i) => (
          <div key={i} className={`p-8 lg:p-10 rounded-3xl border ${cardBg} flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
            <div className={`mb-6 ${item.color} p-5 bg-white/5 rounded-full`}>{item.icon}</div>
            <h4 className="font-bold text-xl mb-4">{item.title}</h4>
            <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                {item.desc}
            </p>
          </div>
        ))}
        <div className="col-span-1 md:col-span-3 mt-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
           <p className="text-base lg:text-lg font-bold text-red-500 flex items-center justify-center gap-3">
             <AlertTriangle size={24} /> {t.probFooter}
           </p>
        </div>
      </div>

      {/* 3. SOLUSI & STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-24">
        {/* KIRI: SOLUSI */}
        <div className={`p-10 lg:p-12 rounded-[2.5rem] border border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-transparent flex flex-col justify-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-2xl lg:text-4xl font-black mb-6 relative z-10">
            {t.solTitle} <br/><span className="text-blue-500 text-3xl lg:text-5xl mt-2 block">{t.solBrand}</span>
          </h3>
          <p className={`text-base lg:text-lg mb-8 italic relative z-10 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>"{t.solDesc}"</p>
          <div className="space-y-6 relative z-10">
            {t.solList.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition backdrop-blur-sm">
                <CheckCircle size={28} className="text-green-500 shrink-0 mt-1"/>
                <span className={`text-sm lg:text-lg font-bold ${textMain}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: STACK */}
        <div className={`p-10 lg:p-12 rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-300 bg-slate-50'} flex flex-col justify-center`}>
           <h3 className="text-xl lg:text-3xl font-bold text-center mb-10">{t.stackTitle}</h3>
           <div className="space-y-6 mb-10">
              {t.stackList.map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-sm lg:text-lg border-b border-gray-500/20 pb-4">
                    <span className={`text-left font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.item}</span>
                    <span className="font-black whitespace-nowrap ml-4 text-right">{item.value}</span>
                 </div>
              ))}
           </div>
           <div className="text-center bg-slate-500/10 p-8 rounded-3xl mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">{t.stackTotalLabel}</p>
              <p className="text-4xl lg:text-6xl font-black text-slate-400 line-through decoration-red-500 decoration-4">{t.stackTotalValue}</p>
           </div>
           <p className="text-center text-base lg:text-xl text-blue-500 italic font-medium">"{t.stackBridge}"</p>
        </div>
      </div>

      {/* 4. PRICING */}
      <div className="text-center mb-16">
        <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tight">{t.priceTitle}</h3>
      </div>

      {/* 🔥 FREE TIER BANNER */}
      <div className="max-w-4xl mx-auto mb-12 transform hover:scale-[1.02] transition-transform duration-300">
         <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-1 p-[2px]">
            <div className={`rounded-[22px] p-6 md:p-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} flex flex-col md:flex-row items-center justify-between gap-6`}>
               <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-green-200">
                     <CheckCircle size={14} /> FREE ACCESS
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">{t.freeTitle}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">{t.freeSub}</p>
               </div>
               <button 
                  onClick={() => window.location.href='/member'}
                  className="whitespace-nowrap px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 animate-pulse"
               >
                  <PlayCircle size={20} /> {t.freeBtn}
               </button>
            </div>
         </div>
      </div>

      {/* PRICING GRID */}
      <div id="pricing-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-24 relative px-2">
        
        {/* BASIC (DOWNSELL OPTION 1) */}
        <div className={`rounded-[2rem] p-8 lg:p-10 border ${cardBg} opacity-90 hover:opacity-100 transition duration-300 h-full flex flex-col justify-between`}>
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xl lg:text-2xl mb-2">{t.p1Name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 font-bold">{t.p1Sub}</p>
            <div className="text-4xl lg:text-5xl font-black mb-8 text-slate-900 dark:text-white">{t.p1Price}</div>
            <ul className="space-y-4 mb-8 text-left">
               {t.p1Feat.map((f, i) => (
                 <li key={i} className="flex gap-3 text-sm lg:text-base font-bold text-slate-700 dark:text-slate-300">
                   <span className={i < 3 ? "text-green-600" : "text-slate-400"}>•</span> {f}
                 </li>
               ))}
            </ul>
          </div>
          <button 
            // ✅ LINK DINAMIS (BASIC)
            onClick={() => handleBuy(t.p1Name, 'basic')}
            className={`w-full py-4 rounded-xl border font-bold text-slate-800 dark:text-white ${isDarkMode ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
          >
            {t.p1Btn}
          </button>
        </div>

        {/* PREMIUM (DOWNSELL OPTION 2) */}
        <div className={`rounded-[2rem] p-8 lg:p-10 border ${cardBg} opacity-90 hover:opacity-100 transition duration-300 h-full flex flex-col justify-between`}>
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xl lg:text-2xl mb-2">{t.p2Name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 font-bold">{t.p2Sub}</p>
            <div className="text-4xl lg:text-5xl font-black mb-8 text-slate-900 dark:text-white">{t.p2Price}</div>
            <ul className="space-y-4 mb-8 text-left">
               {t.p2Feat.map((f, i) => (
                 <li key={i} className="flex gap-3 text-sm lg:text-base font-bold text-slate-700 dark:text-slate-300">
                   <span className={i < 3 ? "text-green-600" : "text-slate-400"}>•</span> {f}
                 </li>
               ))}
            </ul>
          </div>
          <button 
            // ✅ LINK DINAMIS (PREMIUM)
            onClick={() => handleBuy(t.p2Name, 'premium')}
            className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700"
          >
            {t.p2Btn}
          </button>
        </div>

        {/* PRO (VIP) - HARGA CORET BARU */}
        <div className={`relative rounded-[2.5rem] p-10 lg:p-12 border-2 border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.2)] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} transform lg:-translate-y-8 z-10 flex flex-col justify-between h-full`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm lg:text-base font-bold px-10 py-3 rounded-full shadow-lg whitespace-nowrap tracking-wide">
            {t.p3Badge}
          </div>
          <div>
            <div className="text-center mb-8 mt-6">
               <h4 className="font-black text-blue-600 dark:text-blue-400 text-2xl lg:text-3xl">{t.p3Name}</h4>
               <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 mb-4 font-black">{t.p3Sub}</p>
               <div className="flex flex-col items-center justify-center gap-1">
                 <span className="text-sm lg:text-base text-slate-500 line-through font-bold">{t.p3Strike}</span>
                 <span className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white">{t.p3Price}</span>
               </div>
            </div>
            <ul className="space-y-6 mb-12 text-left">
              {t.p3Feat.map((f, i) => (
                <li key={i} className="flex gap-4 items-start text-sm lg:text-lg font-bold text-slate-800 dark:text-slate-100">
                   <CheckCircle size={28} className="text-blue-500 shrink-0 mt-0.5"/> <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <button 
            // ✅ LINK DINAMIS (PRO)
            onClick={() => handleBuy(t.p3Name, 'pro')}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-cyan-500/50 hover:scale-105 transition animate-pulse text-lg lg:text-xl tracking-wide flex items-center justify-center gap-2"
          >
            {t.p3Btn} <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* 5. CLOSING */}
      <div className="text-center border-t border-slate-500/20 pt-16">
        <div className="inline-block p-8 rounded-[2rem] bg-green-500/5 border border-green-500/20 mb-12 max-w-4xl mx-auto">
           <div className="flex items-center justify-center gap-4 mb-4">
              <ShieldCheck size={48} className="text-green-500" />
              <h4 className="font-bold text-2xl lg:text-3xl text-green-600">{t.guaranteeTitle}</h4>
           </div>
           <p className={`text-base lg:text-xl leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.guaranteeDesc}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl lg:text-5xl font-black mb-8">{t.closingHead}</h3>
          <p className={`whitespace-pre-line text-xl lg:text-2xl mb-12 leading-relaxed font-medium italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
             "{t.closingText}"
          </p>
          <button 
            onClick={scrollToPricing}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.7)] hover:scale-105 transition-all duration-300 text-lg md:text-2xl animate-pulse flex items-center gap-3 mx-auto"
          >
             {t.finalBtn} <ArrowRight size={24} />
          </button>
        </div>
      </div>

      <PaymentHandler 
        isOpen={isPayOpen} 
        onClose={() => setIsPayOpen(false)}
        planName={selectedPlan.name}
        paymentUrl={selectedPlan.url}
      />

    </div>
  );
};

export default GerbangDigitalComplete;