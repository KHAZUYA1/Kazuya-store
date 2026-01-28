import { useState, useEffect } from 'react'; // <--- Tambah useEffect
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

  const content: any = {
    ID: {
      title: "Paling Sering Ditanyakan",
      subtitle: "Informasi lengkap seputar layanan dan produk digital kami.",
      faqData: [
        {
          q: "Bagaimana cara melakukan pembelian?",
          a: "Sangat mudah! Pilih produk yang Anda inginkan (Source Code, E-Book, atau Top Up), klik tombol 'Beli', dan Anda akan diarahkan ke WhatsApp Admin. Produk dikirim segera setelah pembayaran."
        },
        {
          q: "Apakah Source Code mendapatkan garansi?",
          a: "Ya! Kami memberikan garansi file berfungsi sesuai demo. Jika ada error saat instalasi, tim kami siap membantu memberikan panduan dasar."
        },
        {
          q: "Apakah Top Up Game disini aman?",
          a: "100% Aman & Legal. Kami menggunakan jalur resmi (Official Distributor), jadi akun game Anda bebas dari resiko banned atau minus."
        },
        {
          q: "Apakah produk Source Code boleh dijual ulang?",
          a: "Tergantung lisensi produk. Sebagian besar Source Code kami adalah 'Developer License' yang boleh Anda gunakan untuk project klien, namun tidak untuk dijual ulang secara mentah."
        },
        {
          q: "Apakah menyediakan jasa Custom Website?",
          a: "Tentu! Selain menjual Source Code jadi, kami juga menerima jasa pembuatan website custom sesuai permintaan Anda. Hubungi Admin untuk konsultasi."
        }
      ]
    },
    EN: {
      title: "Frequently Asked Questions",
      subtitle: "Complete information about our services and digital products.",
      faqData: [
        {
          q: "How do I make a purchase?",
          a: "It's easy! Select the product you want (Source Code, E-Book, or Top Up), click the 'Buy' button, and you will be directed to Admin WhatsApp. Products are sent immediately after payment."
        },
        {
          q: "Do Source Codes come with a warranty?",
          a: "Yes! We guarantee the file works as per the demo. If there are errors during installation, our team is ready to help provide basic guidance."
        },
        {
          q: "Is Game Top Up here safe?",
          a: "100% Safe & Legal. We use official channels (Official Distributors), so your game account is free from the risk of being banned or minus."
        },
        {
          q: "Can Source Code products be resold?",
          a: "Depends on the product license. Most of our Source Codes are 'Developer License' which you can use for client projects, but not for raw resale."
        },
        {
          q: "Do you provide Custom Website services?",
          a: "Of course! Besides selling ready-made Source Codes, we also accept custom website creation services according to your request. Contact Admin for consultation."
        }
      ]
    },
    JP: {
        title: "よくある質問",
        subtitle: "当社のサービスおよびデジタル製品に関する完全な情報。",
        faqData: [
            {
                q: "購入方法は？",
                a: "簡単です！希望の商品（ソースコード、Eブック、またはチャージ）を選択し、「購入」ボタンをクリックすると、管理者のWhatsAppに誘導されます。お支払い後、すぐに商品が送信されます。"
            },
            {
                q: "ソースコードには保証がありますか？",
                a: "はい！デモ通りに動作することを保証します。インストール中にエラーが発生した場合は、基本的なガイダンスを提供する準備ができています。"
            },
            {
                q: "ゲームのチャージは安全ですか？",
                a: "100％安全で合法的です。公式ルート（正規販売代理店）を使用しているため、ゲームアカウントがBANされたりマイナスになったりするリスクはありません。"
            },
            {
                q: "ソースコード製品を再販できますか？",
                a: "製品ライセンスによります。当社のソースコードのほとんどは「開発者ライセンス」であり、クライアントのプロジェクトに使用できますが、そのまま再販することはできません。"
            },
            {
                q: "カスタムウェブサイト制作サービスを提供していますか？",
                a: "もちろんです！既製のソースコードの販売に加えて、ご要望に応じたカスタムウェブサイト制作サービスも承っております。ご相談は管理者までお問い合わせください。"
            }
        ]
    },
    KR: {
        title: "자주 묻는 질문",
        subtitle: "당사의 서비스 및 디지털 제품에 대한 전체 정보입니다.",
        faqData: [
            {
                q: "구매는 어떻게 하나요?",
                a: "아주 쉽습니다! 원하는 제품(소스 코드, E-Book 또는 충전)을 선택하고 '구매' 버튼을 클릭하면 관리자 WhatsApp으로 연결됩니다. 결제 후 즉시 제품이 발송됩니다."
            },
            {
                q: "소스 코드에 보증이 제공되나요?",
                a: "네! 데모와 같이 파일이 작동함을 보증합니다. 설치 중 오류가 발생하면 저희 팀이 기본적인 안내를 도와드립니다."
            },
            {
                q: "게임 충전은 안전한가요?",
                a: "100% 안전하고 합법적입니다. 공식 채널(공식 유통업체)을 사용하므로 게임 계정이 금지되거나 마이너스가 될 위험이 없습니다."
            },
            {
                q: "소스 코드 제품을 재판매할 수 있나요?",
                a: "제품 라이선스에 따라 다릅니다. 대부분의 소스 코드는 '개발자 라이선스'로 클라이언트 프로젝트에 사용할 수 있지만 원본 상태로 재판매할 수는 없습니다."
            },
            {
                q: "맞춤형 웹사이트 서비스를 제공하나요?",
                a: "물론입니다! 기성 소스 코드 판매 외에도 귀하의 요청에 따라 맞춤형 웹사이트 제작 서비스도 제공합니다. 상담은 관리자에게 문의하세요."
            }
        ]
    },
    CN: {
        title: "常见问题",
        subtitle: "有关我们服务和数字产品的完整信息。",
        faqData: [
            {
                q: "如何购买？",
                a: "非常简单！选择您想要的产品（源代码、电子书或充值），点击“购买”按钮，您将被引导至管理员WhatsApp。付款后立即发送产品。"
            },
            {
                q: "源代码有保修吗？",
                a: "是的！我们保证文件按演示运行。如果在安装过程中出现错误，我们的团队随时准备提供基本指导。"
            },
            {
                q: "这里游戏充值安全吗？",
                a: "100%安全合法。我们使用官方渠道（官方分销商），因此您的游戏帐户没有被封禁或扣分的风险。"
            },
            {
                q: "源代码产品可以转售吗？",
                a: "取决于产品许可证。我们的大部分源代码都是“开发人员许可证”，您可以将其用于客户项目，但不能按原样转售。"
            },
            {
                q: "您提供定制网站服务吗？",
                a: "当然！除了销售现成的源代码外，我们还接受根据您的要求定制网站制作服务。联系管理员进行咨询。"
            }
        ]
    },
     MY: {
        title: "Soalan Lazim",
        subtitle: "Maklumat lengkap mengenai perkhidmatan dan produk digital kami.",
        faqData: [
            {
                q: "Bagaimana cara membuat pembelian?",
                a: "Sangat mudah! Pilih produk yang anda mahukan (Kod Sumber, E-Buku, atau Tambah Nilai), klik butang 'Beli', dan anda akan diarahkan ke WhatsApp Admin. Produk dihantar sejurus selepas pembayaran."
            },
            {
                q: "Adakah Kod Sumber mempunyai jaminan?",
                a: "Ya! Kami menjamin fail berfungsi seperti demo. Sekiranya terdapat ralat semasa pemasangan, pasukan kami bersedia membantu memberikan panduan asas."
            },
            {
                q: "Adakah Tambah Nilai Permainan di sini selamat?",
                a: "100% Selamat & Sah. Kami menggunakan saluran rasmi (Pengedar Rasmi), jadi akaun permainan anda bebas dari risiko disekat atau tolak."
            },
            {
                q: "Bolehkah produk Kod Sumber dijual semula?",
                a: "Bergantung pada lesen produk. Sebilangan besar Kod Sumber kami adalah 'Lesen Pembangun' yang boleh anda gunakan untuk projek pelanggan, tetapi tidak untuk dijual semula secara mentah."
            },
            {
                q: "Adakah anda menyediakan perkhidmatan Laman Web Tersuai?",
                a: "Tentu! Selain menjual Kod Sumber siap, kami juga menerima perkhidmatan pembuatan laman web tersuai mengikut permintaan anda. Hubungi Admin untuk rundingan."
            }
        ]
    },
    VN: {
        title: "Câu hỏi thường gặp",
        subtitle: "Thông tin đầy đủ về các dịch vụ và sản phẩm kỹ thuật số của chúng tôi.",
        faqData: [
            {
                q: "Làm thế nào để mua hàng?",
                a: "Rất dễ dàng! Chọn sản phẩm bạn muốn (Mã nguồn, E-Book hoặc Nạp tiền), nhấp vào nút 'Mua' và bạn sẽ được chuyển đến WhatsApp Admin. Sản phẩm được gửi ngay sau khi thanh toán."
            },
            {
                q: "Mã nguồn có được bảo hành không?",
                a: "Có! Chúng tôi đảm bảo tệp hoạt động như bản demo. Nếu có lỗi trong quá trình cài đặt, đội ngũ của chúng tôi sẵn sàng trợ giúp cung cấp hướng dẫn cơ bản."
            },
            {
                q: "Nạp tiền game ở đây có an toàn không?",
                a: "An toàn & Hợp pháp 100%. Chúng tôi sử dụng các kênh chính thức (Nhà phân phối chính thức), vì vậy tài khoản trò chơi của bạn không có nguy cơ bị cấm hoặc bị trừ tiền."
            },
            {
                q: "Sản phẩm Mã nguồn có được bán lại không?",
                a: "Tùy thuộc vào giấy phép sản phẩm. Hầu hết các Mã nguồn của chúng tôi là 'Giấy phép nhà phát triển' mà bạn có thể sử dụng cho các dự án của khách hàng, nhưng không được bán lại nguyên trạng."
            },
            {
                q: "Bạn có cung cấp dịch vụ Website Tùy chỉnh không?",
                a: "Tất nhiên! Ngoài việc bán Mã nguồn có sẵn, chúng tôi còn nhận dịch vụ làm website theo yêu cầu của bạn. Liên hệ Admin để được tư vấn."
            }
        ]
    },
    TH: {
        title: "คำถามที่พบบ่อย",
        subtitle: "ข้อมูลครบถ้วนเกี่ยวกับบริการและผลิตภัณฑ์ดิจิทัลของเรา",
        faqData: [
            {
                q: "ฉันจะสั่งซื้อได้อย่างไร?",
                a: "ง่ายมาก! เลือกสินค้าที่คุณต้องการ (ซอร์สโค้ด, E-Book หรือเติมเงิน) คลิกปุ่ม 'ซื้อ' แล้วคุณจะถูกส่งไปยัง WhatsApp ของแอดมิน สินค้าจะถูกส่งทันทีหลังจากชำระเงิน"
            },
            {
                q: "ซอร์สโค้ดมีการรับประกันหรือไม่?",
                a: "ใช่! เรารับประกันว่าไฟล์จะทำงานได้ตามตัวอย่าง หากมีข้อผิดพลาดระหว่างการติดตั้ง ทีมงานของเราพร้อมที่จะช่วยให้คำแนะนำเบื้องต้น"
            },
            {
                q: "เติมเกมที่นี่ปลอดภัยหรือไม่?",
                a: "ปลอดภัยและถูกกฎหมาย 100% เราใช้ช่องทางที่เป็นทางการ (ตัวแทนจำหน่ายอย่างเป็นทางการ) ดังนั้นบัญชีเกมของคุณจึงปราศจากความเสี่ยงที่จะถูกแบนหรือติดลบ"
            },
            {
                q: "สินค้าซอร์สโค้ดสามารถนำไปขายต่อได้หรือไม่?",
                a: "ขึ้นอยู่กับใบอนุญาตของสินค้า ซอร์สโค้ดส่วนใหญ่ของเราเป็น 'ใบอนุญาตสำหรับนักพัฒนา' ซึ่งคุณสามารถใช้สำหรับโปรเจกต์ของลูกค้าได้ แต่ไม่สามารถนำไปขายต่อแบบดิบๆ ได้"
            },
            {
                q: "คุณให้บริการเว็บไซต์ตามสั่งหรือไม่?",
                a: "แน่นอน! นอกจากการขายซอร์สโค้ดสำเร็จรูปแล้ว เรายังรับบริการทำเว็บไซต์ตามสั่งตามความต้องการของคุณ ติดต่อแอดมินเพื่อขอคำปรึกษา"
            }
        ]
    },
    RU: {
        title: "Часто задаваемые вопросы",
        subtitle: "Полная информация о наших услугах и цифровых продуктах.",
        faqData: [
            {
                q: "Как сделать покупку?",
                a: "Это очень просто! Выберите нужный товар (Исходный код, E-Book или Пополнение), нажмите кнопку «Купить», и вы будете перенаправлены в WhatsApp администратора. Товар отправляется сразу после оплаты."
            },
            {
                q: "Есть ли гарантия на Исходный код?",
                a: "Да! Мы гарантируем, что файл работает так же, как в демо. Если возникнут ошибки при установке, наша команда готова помочь с базовыми инструкциями."
            },
            {
                q: "Безопасно ли пополнять игры здесь?",
                a: "100% безопасно и легально. Мы используем официальные каналы (официальный дистрибьютор), поэтому ваш игровой аккаунт защищен от риска бана или минуса."
            },
            {
                q: "Можно ли перепродавать Исходный код?",
                a: "Зависит от лицензии продукта. Большинство наших исходных кодов имеют «Лицензию разработчика», которую вы можете использовать для проектов клиентов, но не для перепродажи в чистом виде."
            },
            {
                q: "Предоставляете ли вы услуги по созданию кастомных сайтов?",
                a: "Конечно! Помимо продажи готовых исходных кодов, мы также принимаем заказы на создание сайтов по вашему запросу. Свяжитесь с администратором для консультации."
            }
        ]
    }
  };

  const t = content[currentLang] || content['ID'];

  // --- CONTENT TITLE (Dibuat Variabel biar Rapi) ---
  const TitleContent = (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
        {t.title.split(' ').slice(0, -1).join(' ')} <span className="text-cyan-500">{t.title.split(' ').slice(-1)}</span>
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        {t.subtitle}
      </p>
    </div>
  );

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* HYBRID TITLE: Desktop pakai Animasi, Mobile Langsung Muncul */}
        {isDesktop ? (
            <RevealOnScroll>{TitleContent}</RevealOnScroll>
        ) : (
            <div>{TitleContent}</div>
        )}

        <div className="space-y-4">
          {t.faqData.map((item: any, index: number) => {
            // --- ITEM KONTEN FAQ ---
            const FaqItem = (
                <div 
                    className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                    openIndex === index 
                        ? 'bg-white/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'bg-white/5 border-gray-200 dark:border-white/10 hover:border-cyan-500/30'
                    }`}
                >
                    <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                    <span className={`text-lg font-bold transition-colors ${
                        openIndex === index ? 'text-cyan-500' : 'text-slate-800 dark:text-gray-200'
                    }`}>
                        {item.q}
                    </span>
                    
                    <span className={`transform transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180 text-cyan-500' : 'text-gray-400'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                    </button>

                    <div 
                    className={`px-6 text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    >
                    {item.a}
                    </div>
                </div>
            );

            // --- HYBRID RENDER ITEM ---
            return isDesktop ? (
                <RevealOnScroll key={index} delay={index * 100}>
                    {FaqItem}
                </RevealOnScroll>
            ) : (
                // Mobile: Render langsung div-nya (pake key di sini)
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