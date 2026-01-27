import { useState, useEffect } from 'react'; // <--- TAMBAH INI
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
        content_name: 'Klik Tombol Lynk CTA Bawah',
        currency: 'IDR',
        value: 0 
      });
      console.log("Pixel Fired: Lead");
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

  const t = content[currentLang] || content['ID'];

  // --- CONTENT KARTU (Disimpan di variabel agar rapi) ---
  const CardContent = (
    <div className="relative bg-slate-100 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 text-center transition-all duration-500">
      
      {/* Background Effects (Bisa dimatikan di HP jika mau lebih ringan lagi, tapi ini CSS murni jadi aman) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-10 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
          {t.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">{t.titlePart2}</span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed transition-colors">
          {t.subtitle}
        </p>

        {/* 3 POIN UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2 transition-colors">{t.webTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t.webDesc}</p>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2 transition-colors">{t.bookTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{t.bookDesc}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 border border-blue-200 dark:border-cyan-500/30 p-6 rounded-2xl hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(37,99,235,0.05)] dark:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-blue-600 dark:text-cyan-400 font-bold text-lg mb-2 transition-colors">{t.courseTitle}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm transition-colors">{t.courseDesc}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
          <a 
            href="https://lynk.id/yudapamungkas" 
            target="_blank"
            rel="noreferrer"
            onClick={handleTrackLead}
            className="px-10 py-5 bg-blue-600 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg uppercase tracking-wider group"
          >
            <span className="group-hover:animate-bounce">🔥</span> {t.button}
          </a>
        </div>

        <p className="text-sm text-slate-500 mt-6 transition-colors">
          {t.limitedSlot}
        </p>
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
            // Di Mobile, langsung tampilkan kontennya (Tanpa efek blur/muncul)
            <div>
                {CardContent}
            </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;