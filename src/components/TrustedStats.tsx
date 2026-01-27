import { useEffect, useState, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';
import { useLanguage } from '../context/LanguageContext';

interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

const TrustedStats = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Ambil status bahasa aktif
  const { currentLang } = useLanguage(); 

  // 2. KAMUS MINI: Terjemahkan label statistik di sini
  const content: any = {
    ID: {
      stats: [
        { id: 1, label: "Produk Premium", value: 150, suffix: "+", icon: "📦" },
        { id: 2, label: "Transaksi Sukses", value: 2500, suffix: "+", icon: "🔥" },
        { id: 3, label: "Pelanggan Puas", value: 99, suffix: "%", icon: "⭐" },
        { id: 4, label: "Support 24/7", value: 24, suffix: " Jam", icon: "🕒" },
      ]
    },
    EN: {
      stats: [
        { id: 1, label: "Premium Products", value: 150, suffix: "+", icon: "📦" },
        { id: 2, label: "Successful Trans", value: 2500, suffix: "+", icon: "🔥" },
        { id: 3, label: "Happy Clients", value: 99, suffix: "%", icon: "⭐" },
        { id: 4, label: "24/7 Support", value: 24, suffix: " Hrs", icon: "🕒" },
      ]
    },
    JP: {
        stats: [
            { id: 1, label: "プレミアム商品", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "取引成功数", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "顧客満足度", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "24時間サポート", value: 24, suffix: " 時間", icon: "🕒" },
        ]
    },
    KR: {
        stats: [
            { id: 1, label: "프리미엄 제품", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "성공적인 거래", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "고객 만족도", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "24/7 지원", value: 24, suffix: " 시간", icon: "🕒" },
        ]
    },
    CN: {
        stats: [
            { id: 1, label: "优质产品", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "成功交易", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "客户满意度", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "24/7 支持", value: 24, suffix: " 小时", icon: "🕒" },
        ]
    },
    MY: {
        stats: [
            { id: 1, label: "Produk Premium", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "Transaksi Berjaya", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "Pelanggan Puas", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "Sokongan 24/7", value: 24, suffix: " Jam", icon: "🕒" },
        ]
    },
    VN: {
        stats: [
            { id: 1, label: "Sản phẩm cao cấp", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "Giao dịch thành công", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "Khách hàng hài lòng", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "Hỗ trợ 24/7", value: 24, suffix: " Giờ", icon: "🕒" },
        ]
    },
    TH: {
        stats: [
            { id: 1, label: "สินค้าพรีเมียม", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "ธุรกรรมสำเร็จ", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "ลูกค้าพอใจ", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "ซัพพอร์ต 24/7", value: 24, suffix: " ชม.", icon: "🕒" },
        ]
    },
    RU: {
        stats: [
            { id: 1, label: "Премиум товары", value: 150, suffix: "+", icon: "📦" },
            { id: 2, label: "Успешных сделок", value: 2500, suffix: "+", icon: "🔥" },
            { id: 3, label: "Довольных клиентов", value: 99, suffix: "%", icon: "⭐" },
            { id: 4, label: "Поддержка 24/7", value: 24, suffix: " ч.", icon: "🕒" },
        ]
    }
  };

  // 3. Pilih data statistik berdasarkan bahasa aktif
  const statsData: StatItem[] = content[currentLang]?.stats || content['ID'].stats;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={containerRef} className="py-12 relative z-20">
      <div className="container mx-auto px-6">
        
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors duration-300">
            
            <div className="absolute inset-0 border-2 border-transparent rounded-3xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none"></div>

            {statsData.map((stat, index) => (
              <CounterItem key={stat.id} stat={stat} play={hasAnimated} delay={index * 150} />
            ))}
          </div>
        </RevealOnScroll>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

const CounterItem = ({ stat, play, delay }: { stat: StatItem; play: boolean; delay: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!play) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easeProgress * stat.value);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const timeoutId = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [play, stat.value, delay]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2">
      <div className="text-3xl md:text-4xl mb-2 animate-bounce">{stat.icon}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 font-mono">
          {count.toLocaleString('id-ID')}
        </span>
        <span className="text-lg font-bold text-cyan-600 dark:text-cyan-500">{stat.suffix}</span>
      </div>
      <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-gray-400 uppercase tracking-widest transition-colors duration-300">
        {stat.label}
      </p>
    </div>
  );
};

export default TrustedStats;