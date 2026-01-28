import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, flags } from "../constants/dictionary";
import type { LanguageCode } from "../constants/dictionary";

interface LanguageContextType {
  currentLang: LanguageCode;
  category: string;
  setLang: (lang: LanguageCode) => void;
  setCategory: (cat: string) => void;
  t: (key: string) => string;
  flags: typeof flags;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLang, setLangState] = useState<LanguageCode>('ID');
  const [category, setCategoryState] = useState('all');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as LanguageCode;
    // Kita cek manual ketersediaan key di translations
    // @ts-ignore
    if (savedLang && translations[savedLang]) {
      setLangState(savedLang);
    } else {
      setLangState('ID');
    }
  }, []);

  const setLang = (lang: LanguageCode) => {
    setLangState(lang);
    localStorage.setItem('lang', lang);
  };

  const setCategory = (cat: string) => {
    setCategoryState(cat);
  };

  // --- FUNGSI PENERJEMAH (FIXED TYPE ERROR) ---
  const t = (key: string): string => {
    // Trik: Ubah ke 'any' agar TypeScript tidak rewel soal index signature
    const dict = translations as any;
    
    // 1. Ambil kamus bahasa saat ini
    const targetDict = dict[currentLang];

    // 2. Cek apakah kamus ada dan kuncinya ada
    if (!targetDict || !targetDict[key]) {
        // Coba cari di Inggris (EN)
        const fallbackEN = dict['EN']?.[key];
        // Coba cari di Indonesia (ID)
        const fallbackID = dict['ID']?.[key];
        
        // Kembalikan yang ketemu, atau kembalikan key aslinya jika tidak ada sama sekali
        return fallbackEN || fallbackID || key;
    }

    // 3. Jika ada, kembalikan terjemahan
    return targetDict[key];
  };

  return (
    <LanguageContext.Provider value={{ currentLang, category, setLang, setCategory, t, flags }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};