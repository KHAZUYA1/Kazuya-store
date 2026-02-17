import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

interface PaymentProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  paymentUrl: string;
}

const PaymentHandler: React.FC<PaymentProps> = ({ isOpen, onClose, planName, paymentUrl }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      // Cegah user scroll saat modal terbuka
      document.body.style.overflow = 'hidden';

      // Step 1: Animasi enkripsi (0.7 detik)
      const timer1 = setTimeout(() => setStep(2), 700);
      
      // Step 2: Redirect otomatis (Total 1.5 detik)
      const timer2 = setTimeout(() => {
        document.body.style.overflow = 'unset';
        window.location.href = paymentUrl;
      }, 1500);

      // Cleanup: Jika user menekan tombol "Kembali", timer otomatis dibatalkan
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        document.body.style.overflow = 'unset';
      };
    } else {
      setStep(1);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, paymentUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4">
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden animate-scale-up">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 animate-loading-bar"></div>

        <div className="text-center space-y-6">
          
          {/* ICON ANIMASI */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {step === 1 && (
              <div className="absolute inset-0 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            )}
            {step === 2 && (
              <div className="absolute inset-0 border-4 border-green-200 border-t-green-500 rounded-full animate-ping"></div>
            )}
            <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-4 z-10">
               {step === 1 ? <Lock size={32} className="text-blue-500" /> : <ShieldCheck size={32} className="text-green-500" />}
            </div>
          </div>

          {/* TEKS PROSES */}
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
              {step === 1 ? "Menghubungkan..." : "Mengarahkan ke Pembayaran"}
            </h3>
            <p className="text-sm text-slate-500 font-medium line-clamp-1">
              {step === 1 
                ? "Enkripsi SSL 256-bit..." 
                : `Order: ${planName}`
              }
            </p>
          </div>

          {/* BADGE KEPERCAYAAN */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left space-y-3">
             <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Official Payment Gateway</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Keamanan Transaksi Terjamin</span>
             </div>
          </div>

          {/* TOMBOL KEMBALI / BATAL */}
          <button 
            onClick={onClose}
            className="group flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali & Pilih Produk Lain
          </button>

          <p className="text-[10px] text-slate-400 animate-pulse">
            Otomatis dialihkan dalam beberapa detik...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentHandler;