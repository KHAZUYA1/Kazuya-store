// src/components/ScrollToTop.tsx
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* bottom-32 diletakkan agar berada di atas notifikasi FOMO */
    <div className={`fixed bottom-32 left-8 z-[80] transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
    }`}>
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-xl hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-90 transition-all group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTop;