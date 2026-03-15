import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LogOut, LayoutDashboard, MessageCircle, ArrowUp } from 'lucide-react'; // Tambah Icon

// Import Komponen Ringan
import Navbar from './components/Navbar';
import Hero from './components/Hero'; 
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CustomCursor from './components/CustomCursor';
import RunningText from './components/RunningText';
import ScrollProgress from './components/ScrollProgress'; 
import TrustedStats from './components/TrustedStats'; 
import FomoNotification from './components/FomoNotification';
import Testimonials from './components/Testimonials'; 
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';

// 🔥 LAZY LOAD
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MemberArea = lazy(() => import('./pages/MemberArea'));
const MemberLogin = lazy(() => import('./pages/MemberLogin'));
const Register = lazy(() => import('./pages/Register'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- KOMPONEN KONTROL ELEMEN MELAYANG ---
const FloatingElements = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Sembunyikan elemen bawaan (Fomo, WA) jika di halaman khusus
  const isHidden = user || 
    location.pathname.startsWith('/kazuya01') || 
    location.pathname.startsWith('/member') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register');

  if (isHidden) return null;

  return (
    <>
      <FomoNotification />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  );
};

// --- ✅ UPDATE: KOMPONEN TOMBOL NAVIGASI PENGGUNA (ADMIN & MEMBER) ---
const UserFloatingNavigation = () => {
  const { user, isAdmin, logoutAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading || !user) return null;

  // 1. TAMPILAN KHUSUS ADMIN (Sisi Kiri Bawah)
  if (isAdmin) {
    // Sembunyikan jika sedang di dalam dashboard admin
    if (location.pathname.startsWith('/kazuya01')) return null;

    return (
      <div className="fixed bottom-10 left-8 z-[80] flex flex-col-reverse gap-4 items-center animate-fade-in-up">
          <button onClick={logoutAdmin} title="Logout Admin" className="w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-400 border border-red-500/30 shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300">
             <LogOut size={20} />
          </button>
          <a href="/kazuya01" title="Ke Dashboard Admin" className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 hover:scale-110 transition-all duration-300">
             <LayoutDashboard size={24} />
          </a>
      </div>
    );
  }

  // 2. ✅ TAMPILAN KHUSUS MEMBER (Sisi Kanan Bawah)
  // Muncul jika sudah login tapi BUKAN admin
  return (
    <div className="fixed bottom-10 right-8 z-[80] flex flex-col gap-4 items-center animate-fade-in-up">
       {/* Tombol Logout Member */}
       <button 
          onClick={logoutAdmin} 
          className="flex items-center gap-2 px-5 py-3 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 rounded-full font-bold text-xs shadow-xl hover:bg-red-500 hover:text-white transition-all duration-300 group"
       >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>KELUAR AKUN</span>
       </button>

       {/* Tombol WA Bantuan (Hanya muncul di member area) */}
       {location.pathname.startsWith('/member') && (
         <a 
            href="https://wa.me/628971768100" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-full font-bold text-xs shadow-lg hover:bg-emerald-600 transition-all"
         >
            <MessageCircle size={16} />
            <span>BANTUAN MENTOR</span>
         </a>
       )}
    </div>
  );
};

const HomeContent = () => {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <div id="top"></div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white dark:to-[#030303]"></div>
      </div>

      <div className="relative z-10 min-h-screen text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        <RunningText />
        <Navbar />
        <Hero />
        <TrustedStats /> 
        <div id="catalog" className="scroll-mt-24"><ProductList /></div>
        <div id="testimonials" className="scroll-mt-24"><Testimonials /></div>
        <div id="faq" className="scroll-mt-24"><FAQ /></div>
        <div id="contact" className="scroll-mt-24"><Footer /></div>
        <FloatingElements />
        {/* Gunakan komponen navigasi baru di sini */}
        <UserFloatingNavigation />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/kazuya01" element={<AdminDashboard />} />
                <Route path="/member" element={<MemberArea />} />
                <Route path="/member-area" element={<MemberArea />} />
                <Route path="/login" element={<MemberLogin />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;