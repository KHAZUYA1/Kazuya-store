import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
  const { currentLang } = useLanguage();

  // KAMUS HANYA ID & EN
  const content: any = {
    ID: {
      titlePart1: "Kata",
      titlePart2: "Mereka",
      reviews: [
        { name: "Rizky Gaming", role: "Gamer MLBB", text: "Top up disini prosesnya kilat banget! 1 detik masuk, aman legal 100%.", star: 5 },
        { name: "Dimas Code", role: "Web Developer", text: "Source code POS-nya clean banget, gampang dicustom. Worth it parah!", star: 5 },
        { name: "Siti Online", role: "Content Creator", text: "E-Course CapCut-nya mudah dipahami. Sekarang konten saya jadi FYP terus.", star: 5 },
        { name: "Budi Santoso", role: "Freelancer", text: "Template UI Kit-nya bikin kerjaan saya jadi cepet kelar. Makasih min!", star: 4 },
        { name: "Aldi Store", role: "Owner PPOB", text: "Script bot WA-nya jalan lancar di hosting murah sekalipun. Mantap!", star: 5 },
        { name: "Putri Design", role: "UI/UX Designer", text: "Aset desainnya premium semua, lisensi aman buat client. Langganan terus ah.", star: 5 },
        { name: "Ahmad Fauzi", role: "Mahasiswa IT", text: "Harga diamond termurah dibanding toko sebelah. Pas banget buat kantong pelajar.", star: 5 },
        { name: "Sarah Olshop", role: "Bisnis Owner", text: "Landing page script-nya konversi tinggi. Omset naik 200% bulan ini.", star: 5 },
        { name: "Kevin YT", role: "YouTuber Pemula", text: "Belajar SEO YouTube disini daging semua materinya. Subscriber auto naik.", star: 5 },
        { name: "Eko Prasetyo", role: "Backend Dev", text: "Template Laravel-nya secure, struktur kodingannya rapi. Hemat waktu dev.", star: 4 },
        { name: "Tono Cell", role: "Reseller Topup", text: "Integrasi API-nya gampang, dokumentasi lengkap. Bisnis jadi auto pilot.", star: 5 },
        { name: "Linda MUA", role: "Influencer", text: "Filter IG assets-nya keren-keren. Followers pada nanya beli dimana.", star: 5 },
        { name: "Bayu Saputra", role: "Joki Game", text: "Selalu ambil promo event disini, cuan banyak buat dijual lagi ke pelanggan.", star: 5 },
        { name: "Jessica Agency", role: "Digital Agency", text: "Akun Canva Pro awet, garansi beneran dikasih kalau ada kendala.", star: 5 },
        { name: "Rian Startup", role: "App Developer", text: "React Native boilerplate-nya lengkap fiturnya. Siap rilis ke PlayStore.", star: 5 },
        { name: "Dewi Guru", role: "Pengajar Online", text: "Aset background Zoom-nya profesional, murid jadi lebih fokus.", star: 4 },
        { name: "Fajar Stream", role: "Live Streamer", text: "Overlay OBS pack-nya bikin tampilan live jadi kayak pro player.", star: 5 },
        { name: "Citra Penulis", role: "Blogger", text: "E-Book copywriting-nya ngebuka pikiran banget. Tulisan jadi lebih menjual.", star: 5 },
        { name: "Heru Dropship", role: "Marketplace Seller", text: "Tools riset produknya akurat. Nemu winning product jadi gampang.", star: 5 },
        { name: "Bagas Cyber", role: "Security Analyst", text: "Script anti-DDoS nya ampuh. Website klien saya aman sentosa.", star: 5 },
      ]
    },
    EN: {
      titlePart1: "Their",
      titlePart2: "Words",
      reviews: [
        { name: "Rizky Gaming", role: "MLBB Gamer", text: "Top up here is lightning fast! 1 second delivery, 100% legal & safe.", star: 5 },
        { name: "Dimas Code", role: "Web Developer", text: "The POS source code is very clean, easy to custom. Totally worth it!", star: 5 },
        { name: "Siti Online", role: "Content Creator", text: "The CapCut E-Course is easy to understand. My content is trending now.", star: 5 },
        { name: "Budi Santoso", role: "Freelancer", text: "The UI Kit template speeds up my work significantly. Thanks admin!", star: 4 },
        { name: "Aldi Store", role: "PPOB Owner", text: "WA bot script runs smoothly even on cheap hosting. Awesome!", star: 5 },
        { name: "Putri Design", role: "UI/UX Designer", text: "Premium design assets, safe license for clients. Subscribed!", star: 5 },
        { name: "Ahmad Fauzi", role: "IT Student", text: "Cheapest diamond prices compared to others. Perfect for students.", star: 5 },
        { name: "Sarah Olshop", role: "Business Owner", text: "The landing page script has high conversion. Revenue up 200% this month.", star: 5 },
        { name: "Kevin YT", role: "New YouTuber", text: "YouTube SEO course here is solid gold. Subscribers increasing automatically.", star: 5 },
        { name: "Eko Prasetyo", role: "Backend Dev", text: "Laravel template is secure, clean code structure. Saves dev time.", star: 4 },
        { name: "Tono Cell", role: "Topup Reseller", text: "API integration is easy, complete documentation. Business on auto pilot.", star: 5 },
        { name: "Linda MUA", role: "Influencer", text: "Cool IG Filter assets. Followers keep asking where I got them.", star: 5 },
        { name: "Bayu Saputra", role: "Game Jockey", text: "Always grabbing event promos here, big profit for resale.", star: 5 },
        { name: "Jessica Agency", role: "Digital Agency", text: "Canva Pro account lasts long, real warranty provided if issues arise.", star: 5 },
        { name: "Rian Startup", role: "App Developer", text: "React Native boilerplate has complete features. Ready for PlayStore.", star: 5 },
        { name: "Dewi Guru", role: "Online Teacher", text: "Zoom background assets are professional, students focus better.", star: 4 },
        { name: "Fajar Stream", role: "Live Streamer", text: "OBS overlay pack makes my stream look like a pro player.", star: 5 },
        { name: "Citra Writer", role: "Blogger", text: "Copywriting E-Book is mind-opening. My writing sells better now.", star: 5 },
        { name: "Heru Dropship", role: "Marketplace Seller", text: "Product research tools are accurate. Finding winning products is easy.", star: 5 },
        { name: "Bagas Cyber", role: "Security Analyst", text: "Anti-DDoS script works effectively. My client's website is safe.", star: 5 },
      ]
    }
  };

  // LOGIKA BARU: FALLBACK KE EN
  // Jika bahasa yang dipilih (JP, KR, dll) tidak ada di 'content', maka pakai 'EN'
  const t = content[currentLang] || content['EN'];
  
  // Ambil list review
  const reviewList = t.reviews;

  return (
    <section className="py-20 overflow-hidden relative z-10 bg-slate-50/50 dark:bg-black/20">
      
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest">
          {t.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t.titlePart2}</span>
        </h2>
      </div>

      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white dark:from-[#030303] to-transparent z-20"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white dark:from-[#030303] to-transparent z-20"></div>

        {/* LOOPING INFINITE SCROLL */}
        <div className="flex gap-6 animate-scroll-left w-max hover:[animation-play-state:paused]">
          {[...reviewList, ...reviewList].map((review: any, i: number) => (
            <div 
              key={i} 
              className="w-[300px] md:w-[400px] bg-white dark:bg-[#111] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 flex flex-col gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex text-yellow-400">
                {[...Array(review.star)].map((_, n) => ( <span key={n}>★</span> ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{review.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;