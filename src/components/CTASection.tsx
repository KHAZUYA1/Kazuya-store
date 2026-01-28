import { useState, useEffect } from 'react';
import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from '../context/LanguageContext';

const CTASection = () => {
  const { currentLang } = useLanguage();
  
  // --- STATE UNTUK DETEKSI LAYAR ---
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
      const checkScreen = () => setIsDesktop(window.innerWidth > 768);
      checkScreen(); 
      window.addEventListener('resize', checkScreen);
      return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleTrackLead = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Klik Tombol Lynk CTA Bawah',
        currency: 'IDR',
        value: 0 
      });
    }
  };

    const content: any = {
    ID: {
      titlePart1: "Siap Meledakkan",
      titlePart2: "Omset Digital Anda?",
      subtitle: "Kami menyediakan solusi eksklusif untuk percepatan bisnis Anda:",
      webTitle: "Website Custom",
      webDesc: "Jasa pembuatan website profesional sesuai kebutuhan brand Anda.",
      bookTitle: "E-Book Strategi",
      bookDesc: 'Panduan "jalan pintas" khusus untuk melangkah ke gerbang digital.',
      courseTitle: "E-Course Premium",
      courseDesc: "Strategi goal bisnis digital tembus omset ratusan juta/bulan.",
      button: "SEGERA AMBIL PELUANG SEKARANG",
      limitedSlot: "*Slot terbatas untuk pendampingan intensif"
    },
    EN: {
      titlePart1: "Ready to Explode",
      titlePart2: "Your Digital Revenue?",
      subtitle: "We provide exclusive solutions to accelerate your business:",
      webTitle: "Custom Website",
      webDesc: "Professional website creation services tailored to your brand needs.",
      bookTitle: "Strategy E-Book",
      bookDesc: 'Special "shortcut" guide to step into the digital gateway.',
      courseTitle: "Premium E-Course",
      courseDesc: "Digital business goal strategies to break hundreds of millions/month.",
      button: "GRAB THE OPPORTUNITY NOW",
      limitedSlot: "*Limited slots for intensive mentoring"
    },
    JP: {
      titlePart1: "爆発させる準備は",
      titlePart2: "できていますか？",
      subtitle: "ビジネスを加速させるための特別なソリューションを提供します：",
      webTitle: "カスタムウェブサイト",
      webDesc: "ブランドのニーズに合わせたプロフェッショナルなウェブサイト制作。",
      bookTitle: "戦略Eブック",
      bookDesc: "デジタルゲートウェイへの「近道」ガイド。",
      courseTitle: "プレミアムEコース",
      courseDesc: "月間数億ルピアの売上を突破するためのデジタルビジネス戦略。",
      button: "今すぐチャンスを掴む",
      limitedSlot: "*集中メンタリングの枠は限られています"
    },
    KR: {
      titlePart1: "디지털 수익을",
      titlePart2: "폭발시킬 준비가 되셨나요?",
      subtitle: "귀하의 비즈니스를 가속화하기 위한 독점 솔루션을 제공합니다:",
      webTitle: "맞춤형 웹사이트",
      webDesc: "브랜드 요구에 맞춘 전문 웹사이트 제작 서비스.",
      bookTitle: "전략 E-북",
      bookDesc: "디지털 관문으로 나아가기 위한 특별한 '지름길' 가이드.",
      courseTitle: "프리미엄 E-코스",
      courseDesc: "월 수억 루피아 매출을 달성하기 위한 디지털 비즈니스 전략.",
      button: "지금 기회를 잡으세요",
      limitedSlot: "*집중 멘토링을 위한 슬롯 제한"
    },
    CN: {
      titlePart1: "准备好引爆",
      titlePart2: "您的数字收入了吗？",
      subtitle: "我们要提供独家解决方案以加速您的业务：",
      webTitle: "定制网站",
      webDesc: "根据您的品牌需求量身定制的专业网站制作服务。",
      bookTitle: "战略电子书",
      bookDesc: "步入数字大门的特别“捷径”指南。",
      courseTitle: "高级电子课程",
      courseDesc: "突破数亿印尼盾月收入的数字业务战略。",
      button: "立即抓住机会",
      limitedSlot: "*强化辅导名额有限"
    },
    MY: {
      titlePart1: "Sedia Meletupkan",
      titlePart2: "Pendapatan Digital Anda?",
      subtitle: "Kami menyediakan penyelesaian eksklusif untuk mempercepatkan perniagaan anda:",
      webTitle: "Laman Web Tersuai",
      webDesc: "Perkhidmatan pembuatan laman web profesional mengikut keperluan jenama anda.",
      bookTitle: "E-Buku Strategi",
      bookDesc: 'Panduan "jalan pintas" khas untuk melangkah ke gerbang digital.',
      courseTitle: "E-Kursus Premium",
      courseDesc: "Strategi bisnes digital untuk menembusi pendapatan ratusan juta/bulan.",
      button: "REBUT PELUANG SEKARANG",
      limitedSlot: "*Slot terhad untuk bimbingan intensif"
    },
    VN: {
      titlePart1: "Sẵn sàng bùng nổ",
      titlePart2: "Doanh thu kỹ thuật số?",
      subtitle: "Chúng tôi cung cấp các giải pháp độc quyền để tăng tốc doanh nghiệp của bạn:",
      webTitle: "Website Tùy chỉnh",
      webDesc: "Dịch vụ thiết kế website chuyên nghiệp phù hợp với nhu cầu thương hiệu của bạn.",
      bookTitle: "E-Book Chiến lược",
      bookDesc: "Hướng dẫn 'đường tắt' đặc biệt để bước vào cổng kỹ thuật số.",
      courseTitle: "Khóa học Cao cấp",
      courseDesc: "Chiến lược kinh doanh kỹ thuật số để đạt doanh thu hàng trăm triệu/tháng.",
      button: "NẮM BẮT CƠ HỘI NGAY",
      limitedSlot: "*Số lượng chỗ có hạn cho hướng dẫn chuyên sâu"
    },
    TH: {
      titlePart1: "พร้อมที่จะระเบิด",
      titlePart2: "รายได้ดิจิทัลของคุณหรือยัง?",
      subtitle: "เรานำเสนอโซลูชันพิเศษเพื่อเร่งธุรกิจของคุณ:",
      webTitle: "เว็บไซต์ตามสั่ง",
      webDesc: "บริการสร้างเว็บไซต์ระดับมืออาชีพที่ปรับให้เข้ากับแบรนด์ของคุณ",
      bookTitle: "อีบุ๊คกลยุทธ์",
      bookDesc: "คู่มือ 'ทางลัด' พิเศษเพื่อก้าวสู่ประตูดิจิทัล",
      courseTitle: "คอร์สเรียนพรีเมียม",
      courseDesc: "กลยุทธ์ธุรกิจดิจิทัลเพื่อทำยอดขายทะลุหลักร้อยล้าน/เดือน",
      button: "คว้าโอกาสทันที",
      limitedSlot: "*มีจำนวนจำกัดสำหรับการให้คำปรึกษาแบบเข้มข้น"
    },
    RU: {
      titlePart1: "Готовы взорвать",
      titlePart2: "Ваш цифровой доход?",
      subtitle: "Мы предоставляем эксклюзивные решения для ускорения вашего бизнеса:",
      webTitle: "Кастомный сайт",
      webDesc: "Профессиональные услуги по созданию сайтов под ваш бренд.",
      bookTitle: "Стратегия E-Book",
      bookDesc: "Специальный гид-«короткий путь» для входа в цифровой мир.",
      courseTitle: "Премиум E-курс",
      courseDesc: "Стратегии цифрового бизнеса для достижения оборота в сотни миллионов.",
      button: "ИСПОЛЬЗУЙТЕ ШАНС СЕЙЧАС",
      limitedSlot: "*Ограниченное количество мест для интенсивного наставничества"
    }
  };


  // Fallback ke ID jika bahasa lain belum didefinisikan di atas (seperti JP, KR, dll demi menyingkat kode di sini)
  // Pastikan Anda menyalin object content lengkap Anda sebelumnya jika bahasa lain penting.
  const t = content[currentLang] || content['ID'];

  // --- CONTENT KARTU (OPTIMASI PERFORMA) ---
  const CardContent = (
    <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl md:rounded-[3rem] p-6 md:p-16 overflow-hidden shadow-lg md:shadow-2xl border border-gray-200 dark:border-white/10 text-center transition-all">
      
      {/* --- OPTIMASI 1: MATIKAN EFEK BERAT DI MOBILE --- */}
      {/* Efek Blur & Pulse hanya muncul di Desktop (md:block), di Mobile hilang (hidden) */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* --- OPTIMASI 2: NOISE TEXTURE HANYA DI DESKTOP --- */}
      <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        {/* Title: Ukuran font disesuaikan agar tidak terlalu besar di HP */}
        <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          {t.titlePart1} <span className="text-blue-600 dark:text-blue-400">{t.titlePart2}</span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-xl leading-relaxed">
          {t.subtitle}
        </p>

        {/* 3 POIN UTAMA: Layout Grid Sederhana */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left mt-6">
          {/* Card 1 */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 md:p-6 rounded-xl">
            <div className="text-2xl md:text-3xl mb-2">💻</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base md:text-lg mb-1">{t.webTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">{t.webDesc}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 md:p-6 rounded-xl">
            <div className="text-2xl md:text-3xl mb-2">📖</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base md:text-lg mb-1">{t.bookTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">{t.bookDesc}</p>
          </div>

          {/* Card 3 (Premium) */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/30 p-4 md:p-6 rounded-xl">
            <div className="text-2xl md:text-3xl mb-2">🚀</div>
            <h3 className="text-blue-600 dark:text-cyan-400 font-bold text-base md:text-lg mb-1">{t.courseTitle}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm">{t.courseDesc}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6 md:pt-8">
          <a 
            href="https://lynk.id/yudapamungkas" 
            target="_blank"
            rel="noreferrer"
            onClick={handleTrackLead}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl md:rounded-full shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-base md:text-lg uppercase tracking-wider"
          >
            🔥 {t.button}
          </a>
        </div>

        <p className="text-xs md:text-sm text-slate-400 mt-4">
          {t.limitedSlot}
        </p>
      </div>
    </div>
  );

  return (
    // Padding vertical dikurangi di mobile (py-12) agar area scroll lebih pendek
    <section id="cta" className="py-12 md:py-24 relative overflow-hidden z-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* LOGIC HYBRID: Desktop pakai RevealOnScroll, Mobile langsung Render Static */}
        {isDesktop ? (
            <RevealOnScroll>
                {CardContent}
            </RevealOnScroll>
        ) : (
            // Di Mobile: Langsung render tanpa animasi scroll apapun
            <div>
                {CardContent}
            </div>
        )}
      </div>
    </section>
  );
}

export default CTASection;