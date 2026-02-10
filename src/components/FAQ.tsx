import { useState, useEffect } from 'react'; 
import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { currentLang } = useLanguage(); 

  // --- 1. STATE DETEKSI LAYAR (Hybrid Logic) ---
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
      const checkScreen = () => setIsDesktop(window.innerWidth > 768);
      checkScreen(); 
      window.addEventListener('resize', checkScreen);
      return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- 2. KONTEN FAQ BARU (Fokus Edukasi & Gerbang Digital) ---
  const content: any = {
    ID: {
      title: "Pertanyaan Umum",
      subtitle: "Jawaban atas keraguan Anda untuk melangkah ke Gerbang Digital.",
      faqData: [
        {
          q: "Saya gaptek total, apakah bisa mengikuti?",
          a: "Sangat bisa! Kurikulum Gerbang Digital dirancang dengan metode 'Zero to Hero'. Kami mengajarkan dari konsep paling dasar menggunakan bahasa manusia (bukan bahasa teknis rumit), sehingga pemula pun bisa paham dalam waktu singkat."
        },
        {
          q: "Apakah ada Garansi Uang Kembali?",
          a: "YA, 100% GARANSI. Jika dalam 30 hari Anda merasa materi yang diberikan tidak bermanfaat, tidak bisa diakses, atau tidak sesuai dengan penawaran, silakan klaim garansi. Uang Anda kami kembalikan utuh tanpa potongan."
        },
        {
          q: "Bagaimana sistem belajarnya?",
          a: "Pembelajaran dilakukan secara online melalui Member Area (Video E-Course kualitas HD) yang bisa diakses kapan saja (Lifetime). Untuk Paket PRO, Anda juga akan dimasukkan ke Grup VIP untuk tanya jawab intensif."
        },
        {
          q: "Apakah Source Code boleh dijual ulang?",
          a: "Khusus untuk Paket PRO, kami menyertakan bonus produk PLR (Private Label Rights) yang BOLEH Anda jual kembali dan keuntungan 100% milik Anda. Namun untuk materi video utama, dilarang keras membajak atau menjual ulang."
        },
        {
          q: "Apakah butuh laptop spesifikasi tinggi?",
          a: "Tidak perlu. Untuk memulai belajar coding web (HTML/CSS/JS/React) dan bisnis digital, laptop standar dengan RAM 4GB sudah cukup. Yang penting adalah kemauan belajar Anda."
        }
      ]
    },
    EN: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to your doubts before entering the Digital Gateway.",
      faqData: [
        {
          q: "I'm a total beginner (non-tech), can I join?",
          a: "Absolutely! The Gerbang Digital curriculum is designed with a 'Zero to Hero' method. We teach from the very basics using human language (not complex jargon), so beginners can understand quickly."
        },
        {
          q: "Is there a Money Back Guarantee?",
          a: "YES, 100% GUARANTEE. If within 30 days you feel the material is not useful, inaccessible, or not as promised, please claim the guarantee. We will refund your money in full."
        },
        {
          q: "How does the learning system work?",
          a: "Learning is done online via the Member Area (HD Video E-Course) which can be accessed anytime (Lifetime). For the PRO Package, you will also be added to the VIP Group for intensive Q&A."
        },
        {
          q: "Can the Source Codes be resold?",
          a: "Specifically for the PRO Package, we include PLR (Private Label Rights) bonus products that you CAN resell and keep 100% of the profit. However, the main video course material is strictly prohibited from piracy or resale."
        },
        {
          q: "Do I need a high-spec laptop?",
          a: "No. To start learning web coding (HTML/CSS/JS/React) and digital business, a standard laptop with 4GB RAM is sufficient. The most important thing is your willingness to learn."
        }
      ]
    },
    // ... Bahasa lain disesuaikan konteksnya (Generic Translation) ...
    JP: {
        title: "よくある質問",
        subtitle: "デジタルゲートウェイに参加する前の疑問にお答えします。",
        faqData: [
            { q: "初心者でも参加できますか？", a: "もちろんです！「ゼロからヒーローへ」のメソッドで設計されており、専門用語を使わずに基礎から教えます。" },
            { q: "返金保証はありますか？", a: "はい、100％返金保証があります。30日以内に満足いただけない場合は、全額返金いたします。" },
            { q: "学習システムはどのようになっていますか？", a: "メンバーエリア（HDビデオコース）を通じてオンラインで行われ、いつでもアクセス可能です（生涯アクセス）。PROパッケージにはVIPグループサポートが含まれます。" },
            { q: "ソースコードは転売できますか？", a: "PROパッケージのPLRボーナス製品は転売可能です。ただし、メインのコース教材の転売は禁止されています。" },
            { q: "ハイスペックなPCが必要ですか？", a: "いいえ、標準的なノートPC（RAM 4GB）で十分です。" }
        ]
    },
    KR: {
        title: "자주 묻는 질문",
        subtitle: "디지털 관문에 들어서기 전 궁금한 점을 해결해 드립니다.",
        faqData: [
            { q: "완전 초보자도 할 수 있나요?", a: "물론입니다! '제로 투 히어로' 방식으로 설계되어 기초부터 알기 쉽게 가르칩니다." },
            { q: "환불 보장이 되나요?", a: "네, 100% 환불 보장됩니다. 30일 이내에 만족하지 못하시면 전액 환불해 드립니다." },
            { q: "학습은 어떻게 진행되나요?", a: "언제든지 접속 가능한 멤버십 사이트(HD 영상 강의)를 통해 온라인으로 진행됩니다. PRO 패키지는 VIP 그룹 지원이 포함됩니다." },
            { q: "소스 코드를 재판매할 수 있나요?", a: "PRO 패키지의 PLR 보너스 제품은 재판매가 가능합니다. 단, 메인 강의 자료는 재판매가 금지됩니다." },
            { q: "고사양 노트북이 필요한가요?", a: "아니요, 표준 노트북(RAM 4GB)이면 충분합니다." }
        ]
    },
    CN: {
        title: "常见问题",
        subtitle: "加入数字之门之前的疑问解答。",
        faqData: [
            { q: "我是完全的新手，可以参加吗？", a: "当然！我们的课程采用“从零到英雄”的方法设计，使用通俗易懂的语言从基础教起。" },
            { q: "有退款保证吗？", a: "是的，100%退款保证。如果在30天内您不满意，我们将全额退款。" },
            { q: "学习系统是如何运作的？", a: "通过会员专区（高清视频课程）在线进行，随时可访问（终身）。PRO套餐包含VIP群组支持。" },
            { q: "源代码可以转售吗？", a: "PRO套餐中的PLR赠品可以转售。但主要课程视频严禁盗版或转售。" },
            { q: "需要高配置电脑吗？", a: "不需要。标准的笔记本电脑（4GB内存）就足够了。" }
        ]
    },
    MY: {
        title: "Soalan Lazim",
        subtitle: "Jawapan untuk keraguan anda sebelum menyertai Gerbang Digital.",
        faqData: [
            { q: "Saya baru belajar, bolehkah saya sertai?", a: "Sudah tentu! Kurikulum kami direka dengan kaedah 'Zero to Hero'. Kami mengajar dari asas menggunakan bahasa mudah faham." },
            { q: "Adakah jaminan wang dikembalikan?", a: "YA, Jaminan 100%. Jika dalam 30 hari anda tidak berpuas hati, wang anda akan dikembalikan sepenuhnya." },
            { q: "Bagaimana sistem pembelajarannya?", a: "Pembelajaran dalam talian melalui Kawasan Ahli (Video HD) yang boleh diakses bila-bila masa (Seumur Hidup). Pakej PRO mendapat akses Kumpulan VIP." },
            { q: "Bolehkah Kod Sumber dijual semula?", a: "Khusus untuk Pakej PRO, produk bonus PLR BOLEH dijual semula. Namun, materi video utama dilarang dijual semula." },
            { q: "Adakah memerlukan laptop spesifikasi tinggi?", a: "Tidak. Laptop standard (RAM 4GB) sudah memadai untuk bermula." }
        ]
    },
    VN: {
        title: "Câu hỏi thường gặp",
        subtitle: "Giải đáp thắc mắc của bạn trước khi tham gia Cổng Kỹ Thuật Số.",
        faqData: [
            { q: "Tôi là người mới bắt đầu, tôi có thể tham gia không?", a: "Tất nhiên! Giáo trình được thiết kế theo phương pháp 'Zero to Hero', dạy từ cơ bản bằng ngôn ngữ dễ hiểu." },
            { q: "Có đảm bảo hoàn tiền không?", a: "CÓ, đảm bảo hoàn tiền 100%. Nếu trong vòng 30 ngày bạn không hài lòng, chúng tôi sẽ hoàn tiền đầy đủ." },
            { q: "Hệ thống học tập hoạt động như thế nào?", a: "Học trực tuyến qua Khu vực Thành viên (Video HD) có thể truy cập bất cứ lúc nào (Trọn đời). Gói PRO bao gồm hỗ trợ Nhóm VIP." },
            { q: "Mã nguồn có thể bán lại được không?", a: "Riêng Gói PRO có các sản phẩm thưởng PLR CÓ THỂ bán lại. Tuy nhiên, tài liệu khóa học chính bị nghiêm cấm bán lại." },
            { q: "Tôi có cần máy tính cấu hình cao không?", a: "Không. Một máy tính xách tay tiêu chuẩn (RAM 4GB) là đủ để bắt đầu." }
        ]
    },
    TH: {
        title: "คำถามที่พบบ่อย",
        subtitle: "คำตอบสำหรับข้อสงสัยของคุณก่อนเข้าร่วม Gerbang Digital",
        faqData: [
            { q: "ฉันเป็นมือใหม่ สามารถเรียนได้ไหม?", a: "ได้แน่นอน! หลักสูตรถูกออกแบบมาแบบ 'Zero to Hero' สอนตั้งแต่พื้นฐานด้วยภาษาที่เข้าใจง่าย" },
            { q: "มีการรับประกันคืนเงินหรือไม่?", a: "ใช่ รับประกันคืนเงิน 100% หากภายใน 30 วันคุณไม่พอใจ เราจะคืนเงินให้เต็มจำนวน" },
            { q: "ระบบการเรียนเป็นอย่างไร?", a: "เรียนออนไลน์ผ่าน Member Area (วิดีโอ HD) เข้าดูได้ตลอดชีพ แพ็คเกจ PRO จะได้เข้ากลุ่ม VIP ด้วย" },
            { q: "ซอร์สโค้ดสามารถนำไปขายต่อได้หรือไม่?", a: "สำหรับแพ็คเกจ PRO สินค้าโบนัส PLR สามารถขายต่อได้ แต่ห้ามนำเนื้อหาหลักของคอร์สไปขายต่อเด็ดขาด" },
            { q: "ต้องใช้คอมพิวเตอร์สเปคสูงไหม?", a: "ไม่จำเป็น โน้ตบุ๊กมาตรฐาน (RAM 4GB) ก็เพียงพอสำหรับการเริ่มต้น" }
        ]
    },
    RU: {
        title: "Часто задаваемые вопросы",
        subtitle: "Ответы на ваши сомнения перед входом в Digital Gateway.",
        faqData: [
            { q: "Я новичок, могу ли я участвовать?", a: "Конечно! Учебная программа построена по методу «С нуля до героя». Мы учим с азов простым языком." },
            { q: "Есть ли гарантия возврата денег?", a: "ДА, 100% гарантия. Если в течение 30 дней вы не будете удовлетворены, мы вернем деньги полностью." },
            { q: "Как проходит обучение?", a: "Обучение проходит онлайн через Личный кабинет (HD видео), доступ навсегда. Пакет PRO включает доступ к VIP группе." },
            { q: "Можно ли перепродавать исходный код?", a: "В пакете PRO бонусные продукты PLR МОЖНО перепродавать. Однако основные материалы курса перепродавать запрещено." },
            { q: "Нужен ли мощный ноутбук?", a: "Нет. Достаточно стандартного ноутбука (4 ГБ ОЗУ)." }
        ]
    }
  };

  const t = content[currentLang] || content['ID'];

  // --- CONTENT TITLE ---
  const TitleContent = (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
        {t.title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        {t.subtitle}
      </p>
    </div>
  );

  return (
    <section id="faq" className="py-24 relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Title */}
        {isDesktop ? (
            <RevealOnScroll>{TitleContent}</RevealOnScroll>
        ) : (
            <div>{TitleContent}</div>
        )}

        <div className="space-y-4">
          {t.faqData.map((item: any, index: number) => {
            const FaqItem = (
                <div 
                    className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                    openIndex === index 
                        ? 'bg-white/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                        : 'bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-500/30'
                    }`}
                >
                    <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                    <span className={`text-base md:text-lg font-bold transition-colors ${
                        openIndex === index ? 'text-blue-500' : 'text-slate-800 dark:text-gray-200'
                    }`}>
                        {item.q}
                    </span>
                    
                    <span className={`transform transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180 text-blue-500' : 'text-gray-400'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                    </button>

                    <div 
                    className={`px-6 text-sm md:text-base text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out overflow-hidden ${
                        openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    >
                    {item.a}
                    </div>
                </div>
            );

            return isDesktop ? (
                <RevealOnScroll key={index} delay={index * 100}>
                    {FaqItem}
                </RevealOnScroll>
            ) : (
                <div key={index}>
                    {FaqItem}
                </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;