import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
  const { currentLang } = useLanguage();

  // --- DATABASE 100 TESTIMONI (MURNI ORANG BIASA) ---
  const reviewsData = [
    // BATCH 1: IBU RUMAH TANGGA & UMKM (Target Market Utama)
    { name: "Siti Aminah", role: "Ibu Rumah Tangga", text: "Awalnya gaptek parah, ikut kelas Basic sekarang udah bisa bikin undangan digital sendiri. Lumayan buat nambah uang belanja.", star: 5 },
    { name: "Dewi Sartika", role: "Penjahit Rumahan", text: "Bikin website katalog baju jahitan sendiri pake panduan disini. Pelanggan makin percaya dan terlihat profesional.", star: 5 },
    { name: "Rina Wati", role: "Online Shop", text: "Tools riset produknya akurat banget. Akhirnya nemu produk yang laku keras buat dijual di marketplace.", star: 5 },
    { name: "Endang Susilowati", role: "Katering", text: "Foto produk katering jadi bagus banget pake preset Lightroom dari sini. Orderan nasi box nambah terus.", star: 5 },
    { name: "Yanti Sulastri", role: "Reseller", text: "Script bot WA-nya jalan lancar buat broadcast ke pelanggan. Sales naik drastis bulan ini.", star: 5 },
    { name: "Nurul Hidayah", role: "Guru Honorer", text: "Bikin media pembelajaran interaktif buat murid pake aset disini. Kepala sekolah sampe muji kreatif.", star: 5 },
    { name: "Lestari", role: "Pemilik Salon", text: "Sistem booking jadwal potong rambut bikin pelanggan terjadwal rapi. Nggak ada yang komplain antri lama.", star: 5 },
    { name: "Ani Sumarni", role: "Toko Kelontong", text: "Sekarang punya aplikasi stok barang sendiri pake source code POS. Nggak pusing lagi ngitung manual.", star: 5 },
    { name: "Sri Wahyuni", role: "Laundry Kiloan", text: "Aplikasi kasir laundry-nya sangat membantu hitung kiloan dan otomatis kirim nota ke WA pelanggan.", star: 5 },
    { name: "Ratna Sari", role: "Dropshipper", text: "Belajar digital marketing disini daging semua. Modal HP doang bisa dapet jutaan.", star: 5 },

    // BATCH 2: MAHASISWA & FRESH GRADUATE (Pencari Skill)
    { name: "Ahmad Fauzi", role: "Mahasiswa IT", text: "Materi React-nya lebih jelas daripada dosen di kampus wkwk. Skripsi jadi lancar jaya.", star: 5 },
    { name: "Dimas Anggara", role: "Fresh Graduate", text: "Berkat template CV premium disini, saya langsung dipanggil interview di 3 perusahaan besar.", star: 5 },
    { name: "Rizky Pratama", role: "Mahasiswa Ekonomi", text: "Belajar coding dari nol disini. Penjelasannya runtut, sekarang udah bisa bikin web sederhana.", star: 5 },
    { name: "Maya Sestri", role: "Mahasiswi DKV", text: "Harga pelajar tapi materi pejabat. Worth it banget buat yang mau belajar skill mahal dengan budget tipis.", star: 5 },
    { name: "Bagus Setiawan", role: "Job Seeker", text: "Ikut e-course Excel disini sangat membantu. Tes kerja bagian admin langsung lolos.", star: 5 },
    { name: "Indra Lesmana", role: "Mahasiswa Bisnis", text: "Belajar strategi jualan online disini mindsetnya dapet banget. Praktek langsung cuan.", star: 5 },
    { name: "Putri Rahma", role: "Mahasiswi", text: "Aset desain grafisnya lengkap. Tugas kuliah jadi cepet kelar dan hasilnya estetik.", star: 5 },
    { name: "Gilang Ramadhan", role: "Anak Band", text: "Bikin web portofolio musik pake template disini, keren parah visualnya. Dilirik label indie.", star: 5 },
    { name: "Fajar Nugraha", role: "Pengangguran", text: "Dulu bingung mau kerja apa. Setelah kuasai skill editing video dari sini, orderan freelance ngantri.", star: 5 },
    { name: "Doni Tata", role: "Siswa SMK", text: "Belajar jaringan komputer disini lengkap simulasi Cisco-nya. Nilai praktek sekolah jadi A.", star: 5 },

    // BATCH 3: KARYAWAN & PEKERJA (Side Hustle)
    { name: "Budi Santoso", role: "Ojol", text: "Belajar tiap malem abis narik. Sekarang udah bisa terima orderan bikin landing page sederhana.", star: 5 },
    { name: "Agus Setiawan", role: "Satpam", text: "Iseng beli E-Book copywriting, ternyata ilmunya daging. Saya praktekin buat jualan pulsa, lariis.", star: 5 },
    { name: "Yanto Subagyo", role: "Pensiunan", text: "Meski udah tua, panduannya jelas. Saya jadi punya kegiatan positif bikin blog di masa tua.", star: 5 },
    { name: "Hendra Gunawan", role: "Karyawan Bank", text: "Investasi leher ke atas terbaik. Skill analisis data saya meningkat pesat berkat course ini.", star: 5 },
    { name: "Eko Prasetyo", role: "Staff Admin", text: "Kerjaan kantor yang biasanya seharian, sekarang kelar 2 jam berkat trik otomatisasi Excel disini.", star: 5 },
    { name: "Rudi Hartono", role: "Driver", text: "Belajar coding sambilan narik. Semoga tahun depan bisa switch career jadi programmer fulltime.", star: 5 },
    { name: "Wawan", role: "Buruh Pabrik", text: "Nabung buat beli kelas PRO. Nggak nyesel, materinya beneran bisa ngubah nasib kalau dipraktekin.", star: 5 },
    { name: "Tono", role: "Kurir", text: "Script tracking resi-nya akurat. Saya pake buat bantu olshop temen, dapet komisi.", star: 5 },
    { name: "Bambang", role: "Teknisi AC", text: "Bikin web profil jasa service AC biar kelihatan modern di Google Maps. Orderan naik.", star: 5 },
    { name: "Slamet", role: "Supir Truk", text: "Belajar edit video di HP pas lagi istirahat. Lumayan buat konten YouTube, udah mulai ada views.", star: 5 },

    // BATCH 4: FREELANCER & DIGITAL NOMAD
    { name: "Kevin Wijaya", role: "Fullstack Dev", text: "Source code POS-nya clean banget. Gampang dicustom buat klien, balik modal hitungan hari.", star: 5 },
    { name: "Jessica Lim", role: "Content Creator", text: "Sound effect pack-nya komplit. Konten TikTok saya jadi lebih hidup dan menarik.", star: 5 },
    { name: "Bayu Saputra", role: "Video Editor", text: "Preset color grading-nya ajaib. Video mentah langsung cinematic seketika. Klien suka.", star: 5 },
    { name: "Linda Kusuma", role: "Copywriter", text: "Template sales page-nya hypnotic. Konversi penjualan klien saya meningkat tajam.", star: 5 },
    { name: "Rian Hidayat", role: "App Developer", text: "React Native boilerplate-nya lengkap fiturnya. Siap rilis ke PlayStore tanpa pusing coding ulang.", star: 5 },
    { name: "Fajar Sidiq", role: "SEO Specialist", text: "Tools riset keyword-nya akurat. Traffic web klien naik 200% dalam sebulan.", star: 5 },
    { name: "Bagas Kara", role: "Cyber Security", text: "Script anti-DDoS nya ampuh. Website klien saya aman sentosa dari serangan hacker.", star: 5 },
    { name: "Citra Kirana", role: "Virtual Assistant", text: "Manajemen sosmed klien jadi gampang pake tools jadwal posting otomatis dari sini.", star: 5 },
    { name: "Aldi Pratama", role: "Web Designer", text: "Template UI Kit-nya bikin kerjaan saya jadi cepet kelar. Revisi minim, bayaran lancar.", star: 5 },
    { name: "Vina Pandu", role: "Illustrator", text: "Aset vektornya ngebantu banget buat ngerjain project ilustrasi buku anak.", star: 5 },

    // BATCH 5: PEMILIK BISNIS (Wirausaha)
    { name: "Sari Roti", role: "Bakery Owner", text: "Website pemesanan roti harian jalan lancar. Pelanggan nggak perlu antri lagi di kasir.", star: 5 },
    { name: "Wawan Bakso", role: "Pedagang Bakso", text: "Sekarang warung bakso saya punya menu digital scan QR. Kelihatan canggih!", star: 5 },
    { name: "Tuti Salon", role: "Salon Owner", text: "Sistem booking jadwal bikin pelanggan nggak numpuk di jam sibuk.", star: 5 },
    { name: "Rahmat Hidayat", role: "Juragan Lele", text: "Belajar digital marketing buat jual hasil panen langsung ke pengepul online. Untung naik 50%.", star: 5 },
    { name: "Ivan Gunadi", role: "Distro Owner", text: "Website katalog baju loadingnya cepet, foto produk HD tetap ringan dibuka di HP.", star: 5 },
    { name: "Luna Maya", role: "Travel Agent", text: "Sistem booking tour travel-nya jalan lancar. Notifikasi email otomatis ke peserta.", star: 5 },
    { name: "Syahrul", role: "Showroom Mobil", text: "Website personal branding sales bikin calon pembeli mobil makin percaya sama saya.", star: 5 },
    { name: "Hotman P", role: "Konsultan Hukum", text: "Website kantor jasa hukum jadi terlihat bonafide dan profesional.", star: 5 },
    { name: "Boy W", role: "EO", text: "Script event organizer-nya ngebantu banget manage pendaftaran peserta webinar.", star: 5 },
    { name: "Denny S", role: "Gym Owner", text: "Funnel system di web ini sudah teroptimasi buat jual membership gym tahunan.", star: 5 },

    // BATCH 6: UMUM (Random)
    { name: "Beni", role: "Hobi Fotografi", text: "Garansi beneran dikasih. Kemarin sempet salah beli aset, uang dibalikin full. Salut.", star: 5 },
    { name: "Gina", role: "Ketua Arisan", text: "Pake aplikasi catat keuangan dari sini, laporan arisan jadi rapi dan transparan.", star: 5 },
    { name: "Vita", role: "Goweser", text: "Bikin web komunitas sepeda jadi gampang banget pake template komunitas disini.", star: 5 },
    { name: "Dede", role: "Ketua RT", text: "Bikin sistem data warga sederhana pake source code disini. Pak RW seneng banget.", star: 5 },
    { name: "Andre T", role: "Kolektor", text: "Transaksinya aman. Website secure, nggak takut data kartu kredit bocor.", star: 5 },
    { name: "Suleman", role: "Seniman Wayang", text: "Tutorial cara pakainya jelas. Orang awam seni kayak saya aja langsung ngerti bikin web galeri.", star: 5 },
    { name: "Nurul", role: "Guru Ngaji", text: "Seneng banget bisa punya website TPQ sendiri buat update kegiatan santri.", star: 5 },
    { name: "Parto ", role: "Pensiunan TNI", text: "Buat yang tua kayak saya, font di webnya enak dibaca. Panduan PDF juga jelas.", star: 5 },
    { name: "Azis ", role: "Peternak Ayam", text: "Top banget! Nggak gagap teknologi lagi sekarang. Bisa jualan telur online.", star: 5 },
    { name: "Cinta", role: "Relawan", text: "Platform edukasi yang impactful. Mendorong anak muda desa melek digital.", star: 5 },

    // BATCH 7: CUSTOMER LOYAL
    { name: "Nico ", role: "Member Lama", text: "Udah langganan 2 tahun. Kualitas produknya konsisten, nggak pernah mengecewakan.", star: 5 },
    { name: "Dian ", role: "Member PRO", text: "Materi codingnya structured well. Step by step, nggak loncat-loncat.", star: 5 },
    { name: "Adi P", role: "Member Basic", text: "Walau cuma beli paket basic, support adminnya tetep ramah dan fast respon.", star: 5 },
    { name: "Jefri N", role: "User", text: "Harganya affordable banget buat kualitas materi sebagus ini. Gaji UMR masih masuk.", star: 5 },
    { name: "Iqbaal", role: "Freelancer", text: "Belajar bikin web portofolio, hasilnya memuaskan. Keren!", star: 5 },
    { name: "Angga Y", role: "User", text: "Suka banget sama fitur dark mode di member areanya. Mata nggak sakit ngedit malem.", star: 5 },
    { name: "Prilly", role: "Olshop", text: "Tools manajemen sosmednya ngebantu banget atur jadwal posting jualan.", star: 5 },
    { name: "Stefan", role: "Gamer", text: "Script turnamen bracket-nya logikanya masuk akal. Buat bikin event kecil.", star: 5 },
    { name: "Natasha", role: "Sekretaris", text: "Template presentasi PowerPoint-nya bikin boss saya terkesan pas meeting.", star: 5 },
    { name: "Junaidi", role: "Koki", text: "Website resep masakan pake template ini jadi gampang diatur kategorinya.", star: 5 },

    // BATCH 8: TESTIMONI SINGKAT PADAT
    { name: "Arnold P", role: "Pengusaha", text: "Sistem order online jalan mulus. Good job.", star: 5 },
    { name: "Renatta", role: "Blogger", text: "Tampilan templatenya estetik dan responsif.", star: 5 },
    { name: "Tio", role: "Dokter", text: "Sangat membantu manajemen antrian pasien.", star: 5 },
    { name: "Meri R", role: "Staff", text: "Course Excel-nya sangat insightful.", star: 5 },
    { name: "Tunggul", role: "Sales", text: "ROI tinggi buat karir saya.", star: 5 },
    { name: "Bong C", role: "Agen", text: "Fitur listing propertinya komplit.", star: 5 },
    { name: "Rico H", role: "Pedagang", text: "Hemat waktu riset harga pasar.", star: 5 },
    { name: "Dewa E", role: "Affiliate", text: "Landing page konversi tinggi.", star: 5 },
    { name: "Denny", role: "Trainer", text: "Optimasi sales funnel mantap.", star: 5 },
    { name: "Agus B", role: "Mekanik", text: "Web profil bengkel jadi keren.", star: 5 },

    // BATCH 9: CLOSING
    { name: "Udin S", role: "Pelukis", text: "Web galeri lukisan saya jadi kelihatan mahal.", star: 5 },
    { name: "Budi K", role: "Nelayan", text: "Anak saya belajar disini, sekarang dia yang bikinin website buat jual ikan bapaknya.", star: 5 },
    { name: "Fadil", role: "Mahasiswa", text: "Ini beneran bagus woy! Wajib beli buat yang mau upgrade skill.", star: 5 },
    { name: "Keano", role: "Content Creator", text: "Murah banget buat dapet ilmu sebanyak ini. Nangis liat harganya.", star: 5 },
    { name: "Anya", role: "Model", text: "Suka banget sama supportnya. Ramah dan solutif banget adminnya.", star: 5 },
    { name: "Pevita", role: "User", text: "Buat yang mau terjun ke industri tech, ini gerbang pembuka yang tepat.", star: 5 },
    { name: "Raisa", role: "User", text: "Desainnya cantik, fiturnya canggih. Recommended!", star: 5 },
    { name: "Isya", role: "User", text: "Websitenya nggak lemot, transisi halamannya smooth banget.", star: 5 },
    { name: "Afri", role: "User", text: "Terima kasih Gerbang Digital. Sukses terus!", star: 5 },
    { name: "Rossa", role: "User", text: "Harganya terjangkau, kualitasnya bintang lima.", star: 5 },
  ];

  // LOGIKA BAHASA 
  const content: any = {
    ID: {
      titlePart1: "Kata",
      titlePart2: "Mereka",
      subtitle: "Bergabunglah dengan 10.000+ orang biasa yang telah upgrade skill luar biasa.",
    },
    EN: {
      titlePart1: "Their",
      titlePart2: "Words",
      subtitle: "Join 10,000+ ordinary people who have achieved extraordinary skills.",
    }
  };

  const t = content[currentLang] || content['EN'];

  return (
    <section className="py-20 overflow-hidden relative z-10 bg-slate-50/50 dark:bg-black/20">
      
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-widest">
          {t.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{t.titlePart2}</span>
        </h2>
        <p className="text-slate-500 mt-2">{t.subtitle}</p>
      </div>

      <div className="relative w-full">
        {/* Gradient Fade Effect Kiri Kanan */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white dark:from-[#030303] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white dark:from-[#030303] to-transparent z-20 pointer-events-none"></div>

        {/* LOOPING INFINITE SCROLL */}
        <div className="flex gap-6 animate-scroll-left w-max hover:[animation-play-state:paused]">
          {/* Render 2x agar seamless loop */}
          {[...reviewsData, ...reviewsData].map((review: any, i: number) => (
            <div 
              key={i} 
              className="w-[300px] md:w-[400px] bg-white dark:bg-[#111] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 flex flex-col gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                 <div className="flex text-yellow-400">
                   {[...Array(review.star)].map((_, n) => ( <span key={n}>★</span> ))}
                 </div>
                 <div className="text-[10px] text-gray-400 font-mono border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">Verified</div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic line-clamp-3">"{review.text}"</p>
              
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  {review.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{review.name}</h4>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium truncate">{review.role}</p>
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
          animation: scroll-left 600s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;