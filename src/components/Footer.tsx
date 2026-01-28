import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { currentLang, t } = useLanguage();

  // --- LOGIKA BAHASA: HANYA ID & EN ---
  // (Penting agar bule/orang asing bacanya bahasa Inggris, bukan error)
  const activeLang = currentLang === 'ID' ? 'ID' : 'EN';

  // --- KAMUS LOKAL (PENGGANTI MODAL_CONTENT YANG LAMA) ---
  // Isinya adalah teks hukum yang WAJIB ADA agar iklan lolos review.
  const localContent = {
    ID: {
      closeBtn: "Tutup",
      modal: {
        order: {
          title: "📝 Cara Order",
          body: (
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <li>Pilih kategori produk yang Anda inginkan (Top Up, Script, atau E-Course).</li>
              <li>Masukkan <strong>ID Akun / No. WhatsApp</strong> Anda dengan benar.</li>
              <li>Pilih metode pembayaran (QRIS, E-Wallet, atau Virtual Account).</li>
              <li>Klik tombol <strong>"Beli Sekarang"</strong>.</li>
              <li>Lakukan pembayaran sesuai nominal yang tertera.</li>
              <li>Produk akan masuk otomatis dalam hitungan detik!</li>
            </ol>
          )
        },
        // [ZONA ANTI-BANNED] Kebijakan Privasi (Wajib untuk Meta Ads)
        privacy: {
          title: "🛡️ Kebijakan Privasi",
          body: (
            <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <p>Kami sangat menghargai privasi Anda. Data yang kami kumpulkan hanya digunakan untuk:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Memproses pesanan Anda.</li>
                <li>Menghubungi Anda jika terjadi kendala transaksi.</li>
                <li>Mengirimkan bukti pembelian.</li>
              </ul>
              <p>Kami <strong>TIDAK AKAN</strong> menyebarluaskan atau menjual data pribadi Anda kepada pihak ketiga manapun.</p>
            </div>
          )
        },
        // [ZONA ANTI-BANNED] Kebijakan Refund (Wajib untuk Meta Ads)
        refund: {
          title: "💸 Kebijakan Refund",
          body: (
            <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <p>Pengembalian dana (Refund) dapat dilakukan apabila:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Produk tidak masuk lebih dari 24 jam karena kesalahan sistem.</li>
                <li>Stok produk habis setelah Anda melakukan pembayaran.</li>
              </ul>
              <p className="text-red-500 font-bold mt-2 text-xs">*Refund TIDAK BERLAKU jika Anda salah memasukkan ID/Nomor HP.</p>
            </div>
          )
        }
      }
    },
    EN: {
      closeBtn: "Close",
      modal: {
        order: {
          title: "📝 How to Order",
          body: (
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <li>Select the product category you want (Top Up, Script, or E-Course).</li>
              <li>Enter your <strong>Account ID / WhatsApp No.</strong> correctly.</li>
              <li>Choose a payment method (QRIS, E-Wallet, or Virtual Account).</li>
              <li>Click the <strong>"Buy Now"</strong> button.</li>
              <li>Make the payment according to the stated amount.</li>
              <li>The product will arrive automatically in seconds!</li>
            </ol>
          )
        },
        // [ANTI-BANNED ZONE] Privacy Policy (English)
        privacy: {
          title: "🛡️ Privacy Policy",
          body: (
            <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <p>We highly value your privacy. The data we collect is only used to:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Process your order.</li>
                <li>Contact you in case of transaction issues.</li>
                <li>Send proof of purchase.</li>
              </ul>
              <p>We will <strong>NEVER</strong> share or sell your personal data to any third party.</p>
            </div>
          )
        },
        // [ANTI-BANNED ZONE] Refund Policy (English)
        refund: {
          title: "💸 Refund Policy",
          body: (
            <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <p>Refunds can be requested if:</p>
              <ul className="list-disc list-inside ml-2">
                <li>The product has not arrived for more than 24 hours due to a system error.</li>
                <li>The product stock runs out after you have made a payment.</li>
              </ul>
              <p className="text-red-500 font-bold mt-2 text-xs">*Refunds DO NOT APPLY if you enter the wrong ID/Phone Number.</p>
            </div>
          )
        }
      }
    }
  };

  // Pilih konten berdasarkan bahasa (ID atau EN)
  const activeContent = localContent[activeLang];

  // --- STATE DATA FOOTER ---
  const [footerData, setFooterData] = useState({
    siteName: 'KAZUYA',
    whatsapp: '6282270189045',
    footerText: 'Hak Cipta Dilindungi.',
    email: 'pamungkas.blue@gmail.com',
    instagramUrl: 'https://instagram.com/kazuya_store',
    address: 'Bandung, Indonesia'
  });

  // --- STATE MODAL (POP-UP) ---
  const [activeModal, setActiveModal] = useState<'order' | 'privacy' | 'refund' | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const docRef = doc(db, "content", "general_settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFooterData(prev => ({
            ...prev,
            siteName: data.siteName || prev.siteName,
            whatsapp: data.whatsapp || prev.whatsapp,
            footerText: data.footerText || prev.footerText,
            email: data.email || prev.email,
            instagramUrl: data.instagramUrl || prev.instagramUrl
          }));
        }
      } catch (error) { console.error("Gagal load footer:", error); }
    };
    fetchFooterData();
  }, []);

  const socialIconClass = "w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-slate-700 hover:border-blue-500";

  return (
    <>
      <footer className="mt-32 pt-16 pb-10 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#030303] z-50 relative transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            
            {/* KOLOM 1: Logo & Medsos */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                  {footerData.siteName.charAt(0)}
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                  {footerData.siteName}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {t('footerDesc')}
              </p>
              
              <div className="flex gap-3 mt-6">
                 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
                 <a href={footerData.instagramUrl} target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>
                 </a>
                 <a href="#" target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </a>
                 <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                 </a>
                 <a href="#" target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                 </a>
              </div>
            </div>

            {/* KOLOM 2: Layanan */}
            <div>
              <h4 className="footer-title-bold">{t('footerService')}</h4>
              <ul className="space-y-4">
                <li className="footer-item-group"><button className="footer-item-label"><span className="text-cyan-500">💎</span> {t('servTopUp')}</button></li>
                <li className="footer-item-group"><button className="footer-item-label"><span className="text-cyan-500">💻</span> {t('servCode')}</button></li>
                <li className="footer-item-group"><button className="footer-item-label"><span className="text-cyan-500">🎓</span> {t('servCourse')}</button></li>
              </ul>
            </div>

            {/* KOLOM 3: Bantuan */}
            <div>
              <h4 className="footer-title-bold">{t('footerHelp')}</h4>
              <ul className="space-y-4">
                {/* 1. Cara Order */}
                <li className="footer-item-group">
                    <button 
                        onClick={() => setActiveModal('order')} 
                        className="footer-item-label hover:text-blue-500 transition text-left"
                    >
                        📌 {t('helpOrder')}
                    </button>
                </li>
                
                {/* 2. Kebijakan Privasi */}
                <li className="footer-item-group">
                    <button 
                        onClick={() => setActiveModal('privacy')}
                        className="footer-item-label hover:text-blue-500 transition text-left"
                    >
                        🛡️ {t('helpPrivacy')}
                    </button>
                </li>
                
                {/* 3. Kebijakan Refund */}
                <li className="footer-item-group">
                    <button 
                        onClick={() => setActiveModal('refund')}
                        className="footer-item-label hover:text-blue-500 transition text-left"
                    >
                        💸 {t('helpRefund')}
                    </button>
                </li>
                
                {/* 4. Konfirmasi Bayar */}
                <li className="footer-item-group">
                    <a 
                        href={`https://wa.me/${footerData.whatsapp}?text=Halo%20Admin,%20saya%20mau%20konfirmasi%20pembayaran`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="footer-item-label hover:text-green-500 transition"
                    >
                        📞 {t('helpConfirm')}
                    </a>
                </li>
              </ul>
            </div>

            {/* KOLOM 4: Kontak */}
            <div>
              <h4 className="footer-title-bold">{t('footerContact')}</h4>
              <ul className="space-y-4">
                <li className="footer-item-group"><div className="footer-item-label"><span className="text-cyan-500 text-lg">📍</span> {t('Bandung') || footerData.address}</div></li>
                <li className="footer-item-group"><a href={`https://wa.me/${footerData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="footer-item-label hover:text-green-500 transition"><span className="text-cyan-500 text-lg">📱</span> {footerData.whatsapp.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '+$1 $2-$3-$4')}</a></li>
                <li className="footer-item-group"><a href={`mailto:${footerData.email}`} className="footer-item-label hover:text-blue-500 transition"><span className="text-cyan-500 text-lg">✉️</span> {footerData.email}</a></li>
              </ul>
              <div className="mt-6 p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{t('footerHours')}</p>
                 <p className="text-sm font-bold text-slate-900 dark:text-white">{t('daysOpen')}</p>
                 <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">09:00 - 23:00 WIB</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">{footerData.footerText}</p>
            <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-[10px] font-bold tracking-wider uppercase animate-pulse">● {t('systemActive')}</div>
          </div>
        </div>
      </footer>

      {/* --- MODAL POP-UP (Konten Dinamis ID/EN) --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Gelap */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setActiveModal(null)}
            ></div>
            
            {/* Konten Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-200 dark:border-white/10">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {activeContent.modal[activeModal].title}
                    </h3>
                    <button 
                        onClick={() => setActiveModal(null)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {/* Body Modal */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {activeContent.modal[activeModal].body}
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end">
                    <button 
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition"
                    >
                        {activeContent.closeBtn}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Footer;