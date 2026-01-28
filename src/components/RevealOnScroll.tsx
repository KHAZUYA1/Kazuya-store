import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
}

const RevealOnScroll = ({ children, delay = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Cek Mobile
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);

    // Jika Mobile, langsung tampil (Bypass animasi biar tajam & cepat)
    if (mobileCheck) {
        setIsVisible(true);
        return; 
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, 
        rootMargin: '50px', 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isMobile ? '0ms' : `${delay}ms`,
      }}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 transform-none filter-none' // ✅ PERBAIKAN: Hapus total transform & filter
          : 'opacity-0 translate-y-8 blur-[2px]'    // 💨 EFEK: Blur sedikit saat bergerak
      }`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;