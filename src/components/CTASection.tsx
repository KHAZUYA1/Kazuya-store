import { useState, useEffect } from 'react'; 
import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from '../context/LanguageContext';

const CTASection = () => {
  const { currentLang } = useLanguage();
  
  // --- 1. STATE UNTUK DETEKSI LAYAR (Hybrid Logic) ---
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
      const checkScreen = () => setIsDesktop(window.innerWidth > 768);
      checkScreen(); // Cek awal
      window.addEventListener('resize', checkScreen);
      return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // FUNGSI PELACAK KLIK (PIXEL LEAD)
  const handleTrackLead = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Klik Tombol CTA Akhir',
        currency: 'IDR',
        value: 0 
      });
      console.log("Pixel Fired: Lead");
    }
  };

  // --- 2. COPYWRITING BARU (Gerbang Digital Concept) ---
  const content: any = {
    ID: {
      titlePart1: "Jangan Biarkan",
      titlePart2: "Masa Depan Tertinggal",
      subtitle: "Saatnya mengambil kendali penuh atas aset digital Anda. Bergabunglah dengan ekosistem pembelajaran paling lengkap:",
      webTitle: "Coding Mastery",
      webDesc: "Kuasai skill coding modern dari nol sampai mahir tanpa perlu kuliah IT.",
      bookTitle: "Business Strategy",
      bookDesc: "Blueprint rahasia memonetisasi skill coding menjadi mesin penghasilan.",
      courseTitle: "Full Ecosystem",
      courseDesc: "Akses ratusan source code premium, tools, dan komunitas eksklusif.",
      button: "GABUNG GERBANG DIGITAL SEKARANG",
      limitedSlot: "⚠️ Peringatan: Harga akan naik setelah kuota promo habis."
    },
    EN: {
      titlePart1: "Don't Let Your",
      titlePart2: "Future Fall Behind",
      subtitle: "It's time to take full control of your digital assets. Join the most complete learning ecosystem:",
      webTitle: "Coding Mastery",
      webDesc: "Master modern coding skills from zero to hero without an IT degree.",
      bookTitle: "Business Strategy",
      bookDesc: "Secret blueprint to monetize coding skills into income machines.",
      courseTitle: "Full Ecosystem",
      courseDesc: "Access hundreds of premium source codes, tools, and exclusive community.",
      button: "JOIN GERBANG DIGITAL NOW",
      limitedSlot: "⚠️ Warning: Price will increase after promo quota ends."
    },
    // ... (Bahasa lain bisa disesuaikan atau pakai default EN sementara) ...
    JP: { titlePart1: "未来を", titlePart2: "取り残さないで", subtitle: "デジタル資産を完全にコントロールする時が来ました。", webTitle: "コーディング習得", webDesc: "IT学位なしでゼロからプロへ。", bookTitle: "ビジネス戦略", bookDesc: "スキルを収益化する青写真。", courseTitle: "完全なエコシステム", courseDesc: "ソースコードとコミュニティへのアクセス。", button: "今すぐ参加する", limitedSlot: "⚠️ 警告：プロモ終了後、価格が上昇します。" },
    KR: { titlePart1: "미래가", titlePart2: "뒤처지게 하지 마세요", subtitle: "디지털 자산을 완전히 통제할 때입니다.", webTitle: "코딩 마스터리", webDesc: "IT 학위 없이 제로에서 프로까지.", bookTitle: "비즈니스 전략", bookDesc: "기술을 수익화하는 청사진.", courseTitle: "풀 에코시스템", courseDesc: "소스 코드 및 커뮤니티 액세스.", button: "지금 가입하세요", limitedSlot: "⚠️ 경고: 프로모션 종료 후 가격 인상." },
    CN: { titlePart1: "不要让", titlePart2: "未来落后", subtitle: "是时候完全掌控您的数字资产了。", webTitle: "编程精通", webDesc: "无需IT学位，从零到精通。", bookTitle: "商业策略", bookDesc: "将技能转化为收入的蓝图。", courseTitle: "完整生态系统", courseDesc: "访问源代码和社区。", button: "立即加入", limitedSlot: "⚠️ 警告：促销结束后价格将上涨。" },
    MY: { titlePart1: "Jangan Biarkan", titlePart2: "Masa Depan Tertinggal", subtitle: "Masa untuk mengawal aset digital anda sepenuhnya.", webTitle: "Penguasaan Koding", webDesc: "Kuasai koding moden tanpa ijazah IT.", bookTitle: "Strategi Bisnes", bookDesc: "Rahsia menukar skil menjadi pendapatan.", courseTitle: "Ekosistem Lengkap", courseDesc: "Akses kod sumber dan komuniti.", button: "SERTAI SEKARANG", limitedSlot: "⚠️ Amaran: Harga akan naik selepas kuota tamat." },
    VN: { titlePart1: "Đừng để", titlePart2: "Tương lai bị bỏ lại", subtitle: "Đã đến lúc kiểm soát hoàn toàn tài sản kỹ thuật số của bạn.", webTitle: "Thành thạo Coding", webDesc: "Từ con số 0 đến chuyên gia không cần bằng IT.", bookTitle: "Chiến lược Kinh doanh", bookDesc: "Bản thiết kế kiếm tiền từ kỹ năng.", courseTitle: "Hệ sinh thái đầy đủ", courseDesc: "Truy cập mã nguồn và cộng đồng.", button: "THAM GIA NGAY", limitedSlot: "⚠️ Cảnh báo: Giá sẽ tăng sau khi khuyến mãi kết thúc." },
    TH: { titlePart1: "อย่าปล่อยให้", titlePart2: "อนาคตถูกทิ้งไว้ข้างหลัง", subtitle: "ถึงเวลาควบคุมสินทรัพย์ดิจิทัลของคุณอย่างเต็มที่", webTitle: "ความเชี่ยวชาญด้านโค้ด", webDesc: "เก่งโค้ดได้โดยไม่ต้องจบไอที", bookTitle: "กลยุทธ์ธุรกิจ", bookDesc: "พิมพ์เขียวสร้างรายได้จากทักษะ", courseTitle: "ระบบนิเวศเต็มรูปแบบ", courseDesc: "เข้าถึงซอร์สโค้ดและชุมชน", button: "เข้าร่วมทันที", limitedSlot: "⚠️ คำเตือน: ราคาจะปรับขึ้นหลังหมดโปรโมชั่น" },
    RU: { titlePart1: "Не дайте", titlePart2: "Будущему отстать", subtitle: "Пришло время взять под контроль свои цифровые активы.", webTitle: "Мастерство Кодинга", webDesc: "Освойте кодинг с нуля без диплома IT.", bookTitle: "Бизнес Стратегия", bookDesc: "Схема превращения навыков в доход.", courseTitle: "Полная Экосистема", courseDesc: "Доступ к исходным кодам и сообществу.", button: "ПРИСОЕДИНЯЙТЕСЬ СЕЙЧАС", limitedSlot: "⚠️ Предупреждение: Цена вырастет после окончания промо." }
  };

  const t = content[currentLang] || content['ID'];

  // --- CONTENT KARTU ---
  const CardContent = (
    <div className="relative bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-black rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-500">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-red-500/10 dark:bg-red-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
          {t.titlePart1} <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400">
            {t.titlePart2}
          </span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto transition-colors">
          {t.subtitle}
        </p>

        {/* 3 POIN UTAMA (ICON BARU) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm">
            <div className="text-3xl mb-3 p-3 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-lg">💻</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{t.webTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.webDesc}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm">
            <div className="text-3xl mb-3 p-3 bg-green-100 dark:bg-green-900/30 w-fit rounded-lg">📈</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{t.bookTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.bookDesc}</p>
          </div>

          {/* Card 3 (Highlight) */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg">
            <div className="text-3xl mb-3 p-3 bg-red-100 dark:bg-red-900/50 w-fit rounded-lg">🚀</div>
            <h3 className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">{t.courseTitle}</h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{t.courseDesc}</p>
          </div>
        </div>

        {/* BUTTON ACTION */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8">
          <a 
            href="https://lynk.id/yudapamungkas" 
            target="_blank" 
            rel="noreferrer"
            onClick={handleTrackLead}
            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-lg uppercase tracking-wider group"
          >
            {t.button} <span className="group-hover:translate-x-1 transition-transform">👉</span>
          </a>
          
          <p className="text-xs md:text-sm text-red-500 dark:text-red-400 font-semibold animate-pulse mt-2">
            {t.limitedSlot}
          </p>
        </div>

      </div>
    </div>
  );

  return (
    <section id="cta" className="py-24 relative overflow-hidden z-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        {/* LOGIC HYBRID: Desktop pakai RevealOnScroll, Mobile langsung Render */}
        {isDesktop ? (
            <RevealOnScroll>
                {CardContent}
            </RevealOnScroll>
        ) : (
            // Di Mobile, langsung tampilkan kontennya (Tanpa efek blur/muncul yang berat)
            <div>
                {CardContent}
            </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;