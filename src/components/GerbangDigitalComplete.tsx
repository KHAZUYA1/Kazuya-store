import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../lib/firebase'; 
import { 
  AlertTriangle, CheckCircle, XCircle, ShieldCheck, Lock, 
  ArrowRight, PlayCircle, Crown, Star, Zap 
} from 'lucide-react'; 
import PaymentHandler from './PaymentHandler'; 

interface Props {
  isDarkMode: boolean;
  lang: string;
}

// --- DATABASE COPYWRITING LENGKAP ---
const texts = {
  id: {
    manifestoTitle: "KEDAULATAN DI ERA DIGITAL",
    manifestoBody: `Membangun bisnis di atas 'tanah sewaan' adalah keberanian yang naif.

Mengapa harus terus membayar biaya langganan bulanan untuk sekadar menumpang, jika hari ini Anda bisa memiliki fondasinya sendiri?

Jangan biarkan kendala teknis menjadi tembok penghalang. Bagi kami, teknologi bukanlah monster yang rumit, melainkan pintu gerbang peluang yang selama ini belum Anda temukan kuncinya.

Masa depan tidak seharusnya ditebus dengan biaya belajar yang mencekik atau janji manis hasil instan.

Inilah jalan tengah yang selama ini disembunyikan: Sebuah akses kepemilikan aset murni. Tanpa biaya langganan yang membebani, tanpa risiko teknis yang menghantui.

Berhentilah menjadi penumpang. Jadilah Tuan Rumah di kerajaan digital Anda sendiri.`,

    hookTag: "⚠️ PERINGATAN: ZONA NYAMAN ANDA SEDANG RUNTUH",
    hookTitle: "Jangan Sampai Bisnis Anda Mati Karena Masih 'Numpang'.",
    hookSub: "Pilih Mana: Jadi Pemilik Aset atau Terus Membayar Sewa Seumur Hidup?",
    hookDesc: "Era bakar uang untuk sewa platform sudah berakhir. Kami tidak menjual mimpi omset miliaran yang tidak masuk akal. Kami memberikan KUNCI INFRASTRUKTUR. Dari nol putaran, hingga Anda memiliki Aset Digital sendiri yang 100% di bawah kendali Anda.",
    
    probTitle: "Realita Pahit Pebisnis Pemula",
    prob1: "Jebakan Biaya Langganan",
    prob1Desc: "Banyak platform bagus, tapi membebankan biaya bulanan yang mencekik. Jika telat bayar, bisnis Anda tutup. Di sini, Anda BAYAR SEKALI, MILIK SELAMANYA.",
    prob2: "Janji Manis Tanpa Aset",
    prob2Desc: "Banyak mentor pamer angka fantastis, tapi tidak mengajarkan cara membangun 'Rumahnya'. Saat tren berubah, mereka selamat, Anda yang bingung.",
    prob3: "Merasa Gaptek?",
    prob3Desc: "Merasa teknologi itu rumit? Itu karena Anda disuruh belajar bahasa mesin. Di sini, kami berikan 'Barang Jadinya'. Tinggal pakai, ganti nama, langsung jalan.",
    probFooter: "Berhenti membangun istana di tanah orang lain. Mulai bangun fondasi Anda sendiri.",

    solTitle: "Jalan Pintas Menuju",
    solBrand: "KEPEMILIKAN TOTAL",
    solDesc: "Bukan sekadar kursus. Ini adalah Serah Terima Jabatan. Kami berikan Skill + Alat Perang + Strategi dalam satu paket kepemilikan.",
    solList: [
      "Anti-Ribet untuk Pemula: Panduan bahasa manusia. Tanpa istilah teknis yang bikin pusing.",
      "Full Ownership (Hak Milik): Source code, database, dan sistem 100% milik Anda. Tidak ada biaya sewa bulanan ke kami.",
      "Gudang Senjata (Arsenal): Ratusan Source Code siap pakai. Hemat waktu coding bertahun-tahun.",
      "Real Business Skill: Strategi jualan yang membumi, logis, dan terbukti. Bukan angin surga."
    ],

    stackTitle: "Investasi Leher ke Atas (Tanpa Risiko)",
    stackList: [
      { item: "Materi Bootcamp Full Stack (Nol s/d Mahir)", value: "Rp 20.000.000" },
      { item: "E-Book Strategi Bisnis Digital Logis", value: "Rp 10.000.000" },
      { item: "Modul UI/UX Design Professional", value: "Rp 5.000.000" },
      { item: "100+ Aset Source Code Siap Jual", value: "Rp 15.000.000" },
      { item: "Lisensi Produk Digital (PLR) Resellable", value: "Rp 2.500.000" },
    ],
    stackTotalLabel: "NILAI ASLI ASET:",
    stackTotalValue: "Rp 52.500.000",
    stackBridge: "Tapi kami tidak meminta harga tersebut. Kami ingin mencetak partner, bukan memeras siswa.",

    priceTitle: "Ambil Kunci Akses Anda",
    
    freeTitle: "RAGU? SILAKAN BUKTIKAN DULU.",
    freeSub: "Masuk ke Member Area. Cek sendiri kualitas materinya. Kami transparan, tidak ada yang ditutupi.",
    freeBtn: "COBA AKSES GRATIS (LIMITED)",

    p1Name: "PAKET STARTER",
    p1Sub: "Untuk Pemula yang Ingin Coba-Coba", 
    p1Price: "Rp 149.000", 
    p1Feat: [
        "Akses Materi Dasar & Mindset Bisnis", 
        "Modul Pengenalan Aset Digital", 
        "Akses Grup Komunitas", 
        "Tanpa Source Code Premium"
    ],
    p1Btn: "AMBIL PAKET HEMAT",
    
    p2Name: "PAKET BUILDER",
    p2Sub: "Fokus Skill Teknis (Tanpa Strategi Bisnis)", 
    p2Price: "Rp 560.000", 
    p2Feat: [
        "Materi Lengkap (Coding + Design)", 
        "Akses Video Pembelajaran Full", 
        "Support Grup Teknis", 
        "Tanpa Strategi Bisnis & Aset VIP"
    ],
    p2Btn: "AMBIL PAKET BUILDER",
    
    p3Name: "PAKET BUSINESS OWNER (VIP)",
    p3Badge: "🔥 PILIHAN PARA 'BOSS'",
    p3Sub: "Skill + Aset Lengkap + Strategi Cuan",
    p3Strike: "Rp 1.890.000", 
    p3Price: "Rp 890.000", 
    p3Feat: [
      "FULL AKSES: Coding + Desain + Bisnis",
      "Ratusan Source Code Premium (Hak Milik)",
      "E-Book Strategi Bisnis Tanpa Basa-Basi",
      "MENTORING & GRUP VIP (Dibimbing Sampai Bisa)",
      "Update Aset Terbaru Seumur Hidup"
    ],
    p3Btn: "AMBIL KEPEMILIKAN SEKARANG 🚀",

    guaranteeTitle: "GARANSI 100% UANG KEMBALI",
    guaranteeDesc: "Kami fair. Jika materi ini isinya sampah, tidak bermanfaat, atau tidak sesuai janji dalam 30 hari, uang Anda kembali utuh. Tanpa drama.",
    closingHead: "Jangan Menyesal di Kemudian Hari",
    closingText: "Peluang untuk memiliki aset digital dengan harga semurah ini tidak akan datang dua kali.\n\nAnda bisa tetap menjadi penonton yang membayar tiket,\natau menjadi PEMILIK PANGGUNG hari ini juga.",
    finalBtn: "SAYA SIAP JADI PEMILIK ASET 🚀"
  },
  en: {
    manifestoTitle: "DIGITAL SOVEREIGNTY",
    manifestoBody: `Building a business on 'rented land' is a naive form of bravery.

Why keep paying monthly subscription fees just to be a tenant, when today you can own the foundation yourself?

Don't let technical hurdles become a wall. To us, technology isn't a complex monster, but a gateway to opportunities you haven't found the key to yet.

The future shouldn't be paid for with suffocating learning costs or sweet promises of instant results.

This is the middle ground that has been hidden: Direct access to pure asset ownership. No burdensome subscription fees, no haunting technical risks.

Stop being a passenger. Become the Host of your own digital kingdom.`,

    hookTag: "⚠️ WARNING: YOUR COMFORT ZONE IS COLLAPSING",
    hookTitle: "Don't Let Your Business Die Because You're Still 'Renting'.",
    hookSub: "Choose: Be an Asset Owner or a Lifetime Renter?",
    hookDesc: "The era of burning money on platform fees is over. We don't sell unrealistic billion-dollar dreams. We provide the INFRASTRUCTURE KEYS. From zero to having your own Digital Assets that are 100% under your control.",

    probTitle: "The Harsh Reality of Beginners",
    prob1: "The Subscription Trap",
    prob1Desc: "Many great platforms charge suffocating monthly fees. If you're late to pay, your business shuts down. Here, you PAY ONCE, OWN FOREVER.",
    prob2: "Sweet Promises, No Assets",
    prob2Desc: "Many mentors show off fantastic numbers but don't teach you how to build the 'House'. When trends change, they survive while you're left confused.",
    prob3: "Feeling Tech-Phobic?",
    prob3Desc: "Think technology is complicated? That's because you're told to learn machine language. Here, we give you the 'Finished Product'. Just use it, rename it, and run.",
    probFooter: "Stop building castles on someone else's land. Start building your own foundation.",

    solTitle: "The Shortcut to",
    solBrand: "TOTAL OWNERSHIP",
    solDesc: "Not just a course. This is a Handover of Power. We provide Skills + Tools + Strategy in one ownership package.",
    solList: [
      "Beginner-Friendly: Human-language guides. No confusing technical jargon.",
      "Full Ownership: Source code, database, and system are 100% yours. No monthly fees to us.",
      "The Arsenal: Hundreds of ready-to-use Source Codes. Save years of coding time.",
      "Real Business Skill: Down-to-earth, logical, and proven sales strategies. No fluff."
    ],

    stackTitle: "Risk-Free Investment",
    stackList: [
      { item: "Full Stack Bootcamp Material (Zero to Hero)", value: "$1,500" },
      { item: "Logical Digital Business Strategy E-Book", value: "$750" },
      { item: "Professional UI/UX Design Module", value: "$350" },
      { item: "100+ Ready-to-Sell Source Code Assets", value: "$1,000" },
      { item: "Resellable Digital Product License (PLR)", value: "$200" },
    ],
    stackTotalLabel: "REAL ASSET VALUE:",
    stackTotalValue: "$3,800",
    stackBridge: "But we aren't asking for that price. We want to create partners, not exploit students.",

    priceTitle: "Claim Your Access Key",
    
    freeTitle: "NOT SURE? PROVE IT YOURSELF.",
    freeSub: "Enter the Member Area. Check the quality yourself. We are transparent, nothing is hidden.",
    freeBtn: "TRY FREE ACCESS (LIMITED)",

    p1Name: "STARTER PACK",
    p1Sub: "For Beginners Starting Out", 
    p1Price: "IDR 149K", 
    p1Feat: [
        "Basic Mindset & Material Access", 
        "Digital Asset Intro Module", 
        "Community Group Access", 
        "No Premium Source Code"
    ],
    p1Btn: "GET STARTER PACK",
    
    p2Name: "BUILDER PACK",
    p2Sub: "Technical Skills Focus (No Business Strategy)", 
    p2Price: "IDR 560K", 
    p2Feat: [
        "Complete Material (Coding + Design)", 
        "Full Video Learning Access", 
        "Technical Support Group", 
        "No Business Strategy & VIP Assets"
    ],
    p2Btn: "GET BUILDER PACK",
    
    p3Name: "BUSINESS OWNER (VIP)",
    p3Badge: "🔥 THE 'BOSS' CHOICE",
    p3Sub: "Skill + Full Assets + Pro Strategy",
    p3Strike: "IDR 1,890K", 
    p3Price: "IDR 890K", 
    p3Feat: [
      "FULL ACCESS: Coding + Design + Business",
      "Hundreds of Premium Source Codes",
      "No-Nonsense Business Strategy E-Book",
      "VIP MENTORING (Guided until successful)",
      "Lifetime Updates for New Assets"
    ],
    p3Btn: "CLAIM OWNERSHIP NOW 🚀",

    guaranteeTitle: "100% MONEY BACK GUARANTEE",
    guaranteeDesc: "We are fair. If this material is trash, useless, or doesn't meet our promise within 30 days, you get a full refund. No drama.",
    closingHead: "Don't Regret Later",
    closingText: "The chance to own digital assets at this price won't come twice.\n\nYou can remain a spectator paying for a ticket,\nor become the STAGE OWNER today.",
    finalBtn: "I'M READY TO BE AN ASSET OWNER 🚀"
  }
};

const GerbangDigitalComplete: React.FC<Props> = ({ isDarkMode, lang }) => {
  const t = (lang === 'EN') ? texts.en : texts.id;

  const bgBase = isDarkMode ? "bg-slate-900/95 md:bg-slate-900/80" : "bg-white/95 md:bg-white/90";
  const textMain = isDarkMode ? "text-white" : "text-slate-900";
  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm md:shadow-md";

  // State untuk Manifesto / Filosofi agar responsif tema
  const manifestoBg = isDarkMode ? "bg-[#0A0A0A] border-white/10" : "bg-slate-50 border-slate-200 shadow-inner";
  const manifestoTitleColor = isDarkMode ? "text-white" : "text-slate-900";
  const manifestoBodyColor = isDarkMode ? "text-slate-300" : "text-slate-700";

  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: "", url: "" });
  
  const [paymentLinks, setPaymentLinks] = useState({
    basic: '',
    premium: '',
    pro: ''
  });

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
    <div id="pricing-section" className={`w-full max-w-7xl mx-auto font-sans transition-colors duration-300 ${bgBase} md:backdrop-blur-xl rounded-none md:rounded-[2.5rem] border-y md:border border-slate-500/20 p-4 lg:p-16 my-8 md:my-16 shadow-none md:shadow-2xl`}>

      {/* 0. MANIFESTO - SEKARANG DYNAMIC THEME */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 mb-16 lg:mb-24 border transition-colors duration-500 ${manifestoBg}`}>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-xs font-bold tracking-widest uppercase mb-6">
                <Crown size={14} /> {lang === 'ID' ? 'FILOSOFI KAMI' : 'OUR PHILOSOPHY'}
             </div>
             <h2 className={`text-2xl md:text-5xl font-black mb-8 tracking-tight leading-tight ${manifestoTitleColor}`}>
                {t.manifestoTitle}
             </h2>
             <div className="space-y-6">
                <p className={`whitespace-pre-line text-base md:text-xl font-medium leading-relaxed italic ${manifestoBodyColor}`}>
                    "{t.manifestoBody}"
                </p>
             </div>
             <div className="mt-10">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto rounded-full"></div>
             </div>
          </div>
      </div>

      {/* 1. HERO HOOK */}
      <div className="text-center mb-10 lg:mb-24 max-w-5xl mx-auto pt-4 md:pt-0">
        <div className="inline-block bg-red-600/90 text-white text-[10px] lg:text-sm font-bold px-4 py-1.5 rounded-full mb-6 md:animate-pulse border border-red-500 shadow-lg tracking-wider">
          {t.hookTag}
        </div>
        <h2 className={`text-2xl lg:text-6xl font-black mb-6 leading-tight ${textMain}`}>
          {t.hookTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 block mt-2">
            {t.hookSub}
          </span>
        </h2>
        <p className={`text-sm lg:text-xl leading-relaxed max-w-4xl mx-auto font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
          {t.hookDesc}
        </p>
      </div>

      {/* 2. PROBLEM */}
      <div className={`text-center mb-8 ${textMain}`}>
        <h3 className="text-xl lg:text-3xl font-bold">{t.probTitle}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-16">
        {[
          { icon: <XCircle size={40}/>, title: t.prob1, desc: t.prob1Desc, color: "text-red-500" },
          { icon: <AlertTriangle size={40}/>, title: t.prob2, desc: t.prob2Desc, color: "text-yellow-500" },
          { icon: <Lock size={40}/>, title: t.prob3, desc: t.prob3Desc, color: isDarkMode ? "text-slate-400" : "text-gray-500" }
        ].map((item, i) => (
          <div key={i} className={`p-6 lg:p-10 rounded-3xl border ${cardBg} flex flex-col items-center text-center md:hover:border-red-500/30 transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-2xl`}>
            <div className={`mb-4 ${item.color} p-4 bg-white/5 rounded-full`}>{item.icon}</div>
            <h4 className={`font-bold text-lg mb-3 ${textMain}`}>{item.title}</h4>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                {item.desc}
            </p>
          </div>
        ))}
        <div className="col-span-1 md:col-span-3 mt-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
           <p className="text-sm lg:text-lg font-bold text-red-500 flex items-center justify-center gap-2">
             <AlertTriangle size={20} /> {t.probFooter}
           </p>
        </div>
      </div>

      {/* 3. SOLUSI & STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        <div className={`p-8 lg:p-12 rounded-3xl md:rounded-[2.5rem] border border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-transparent flex flex-col justify-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className={`text-xl lg:text-4xl font-black mb-4 relative z-10 ${textMain}`}>
            {t.solTitle} <br/><span className="text-blue-500 text-2xl lg:text-5xl mt-2 block">{t.solBrand}</span>
          </h3>
          <p className={`text-sm lg:text-lg mb-6 italic relative z-10 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>"{t.solDesc}"</p>
          <div className="space-y-4 relative z-10">
            {t.solList.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5"/>
                <span className={`text-xs lg:text-lg font-bold ${textMain}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 lg:p-12 rounded-3xl md:rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-300 bg-slate-50'} flex flex-col justify-center`}>
           <h3 className={`text-lg lg:text-3xl font-bold text-center mb-8 ${textMain}`}>{t.stackTitle}</h3>
           <div className="space-y-4 mb-8">
              {t.stackList.map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-xs lg:text-lg border-b border-gray-500/20 pb-3">
                    <span className={`text-left font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.item}</span>
                    <span className={`font-black whitespace-nowrap ml-2 text-right ${textMain}`}>{item.value}</span>
                 </div>
              ))}
           </div>
           <div className="text-center bg-slate-500/10 p-6 rounded-2xl mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{t.stackTotalLabel}</p>
              <p className="text-3xl lg:text-6xl font-black text-slate-400 line-through decoration-red-500 decoration-2 md:decoration-4">{t.stackTotalValue}</p>
           </div>
        </div>
      </div>

      {/* =========================================
          🔥 UPDATE: 4. PRICING (DITAMBAHKAN ID)
          ========================================= */}
      <div id="kunci-akses" className={`text-center mb-10 scroll-mt-32 ${textMain}`}>
        <h3 className="text-2xl lg:text-5xl font-black uppercase tracking-tight">{t.priceTitle}</h3>
      </div>

      {/* FREE TIER BANNER */}
      <div className="max-w-4xl mx-auto mb-10 md:hover:scale-[1.02] transition-transform duration-300">
         <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-[2px]">
            <div className={`rounded-[22px] p-6 md:p-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} flex flex-col md:flex-row items-center justify-between gap-6`}>
               <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-green-200">
                      <CheckCircle size={14} /> FREE ACCESS
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">{t.freeTitle}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs md:text-base">{t.freeSub}</p>
               </div>
               <button 
                  onClick={() => window.location.href='/member'}
                  className="w-full md:w-auto px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10 md:animate-pulse whitespace-normal md:whitespace-nowrap text-center"
               >
                  <PlayCircle size={20} className="shrink-0" /> {t.freeBtn}
               </button>
            </div>
         </div>
      </div>

      {/* PRICING GRID */}
      <div id="pricing-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end mb-24 relative px-2">
        
        {/* BASIC */}
        <div className={`rounded-3xl md:rounded-[2rem] p-6 lg:p-10 border ${cardBg} h-full flex flex-col justify-between`}>
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg lg:text-2xl mb-1">{t.p1Name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 font-bold">{t.p1Sub}</p>
            <div className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 dark:text-white">{t.p1Price}</div>
            <ul className="space-y-3 mb-8 text-left">
               {t.p1Feat.map((f, i) => (
                 <li key={i} className="flex gap-3 text-xs lg:text-base font-bold text-slate-700 dark:text-slate-300">
                   <span className={i < 3 ? "text-green-600" : "text-slate-400"}>•</span> {f}
                 </li>
               ))}
            </ul>
          </div>
          <button 
            onClick={() => handleBuy(t.p1Name, 'basic')}
            className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95"
          >
            {t.p1Btn}
          </button>
        </div>

        {/* PREMIUM */}
        <div className={`rounded-3xl md:rounded-[2rem] p-6 lg:p-10 border ${cardBg} h-full flex flex-col justify-between`}>
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg lg:text-2xl mb-1">{t.p2Name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 font-bold">{t.p2Sub}</p>
            <div className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 dark:text-white">{t.p2Price}</div>
            <ul className="space-y-3 mb-8 text-left">
               {t.p2Feat.map((f, i) => (
                 <li key={i} className="flex gap-3 text-xs lg:text-base font-bold text-slate-700 dark:text-slate-300">
                   <span className={i < 3 ? "text-green-600" : "text-slate-400"}>•</span> {f}
                 </li>
               ))}
            </ul>
          </div>
          <button 
            onClick={() => handleBuy(t.p2Name, 'premium')}
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
          >
            {t.p2Btn}
          </button>
        </div>

        {/* PRO (VIP) */}
        <div className={`relative rounded-3xl md:rounded-[2.5rem] p-8 lg:p-12 border-2 border-yellow-500 shadow-none md:shadow-[0_0_60px_rgba(234,179,8,0.2)] ${isDarkMode ? 'bg-slate-800' : 'bg-white'} transform lg:-translate-y-8 z-10 flex flex-col justify-between h-full`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs lg:text-base font-bold px-6 lg:px-10 py-2 lg:py-3 rounded-full shadow-lg whitespace-nowrap tracking-wide">
            {t.p3Badge}
          </div>
          <div>
            <div className="text-center mb-6 mt-4">
               <h4 className="font-black text-blue-600 dark:text-blue-400 text-xl lg:text-3xl">{t.p3Name}</h4>
               <p className="text-xs lg:text-base text-slate-600 dark:text-slate-300 mb-4 font-black">{t.p3Sub}</p>
               <div className="flex flex-col items-center justify-center gap-1">
                 <span className="text-xs lg:text-base text-slate-500 line-through font-bold">{t.p3Strike}</span>
                 <span className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white">{t.p3Price}</span>
               </div>
            </div>
            <ul className="space-y-4 mb-10 text-left">
              {t.p3Feat.map((f, i) => (
                <li key={i} className="flex gap-3 items-start text-xs lg:text-lg font-bold text-slate-800 dark:text-slate-100">
                   <CheckCircle size={24} className="text-blue-500 shrink-0 mt-0.5"/> <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => handleBuy(t.p3Name, 'pro')}
            className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg md:hover:scale-105 transition md:animate-pulse text-lg lg:text-xl tracking-wide flex items-center justify-center gap-2"
          >
            {t.p3Btn} <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* 5. CLOSING */}
      <div className="text-center border-t border-slate-500/20 pt-10">
        <div className="inline-block p-6 rounded-3xl bg-green-500/5 border border-green-500/20 mb-8 max-w-4xl mx-auto">
           <div className="flex items-center justify-center gap-3 mb-2">
              <ShieldCheck size={32} className="text-green-500" />
              <h4 className="font-bold text-xl lg:text-3xl text-green-600">{t.guaranteeTitle}</h4>
           </div>
           <p className={`text-sm lg:text-xl leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.guaranteeDesc}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <h3 className={`text-xl lg:text-5xl font-black mb-6 ${textMain}`}>{t.closingHead}</h3>
          <p className={`whitespace-pre-line text-lg lg:text-2xl mb-8 leading-relaxed font-medium italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              "{t.closingText}"
          </p>
          <button 
            onClick={scrollToPricing}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full shadow-lg md:hover:scale-105 transition-all duration-300 text-lg md:text-2xl flex items-center justify-center gap-3 mx-auto"
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