import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// --- KOMPONEN KONTROL ELEMEN MELAYANG ---
const FloatingElements = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // ✅ UPDATE: Sembunyikan elemen jika di halaman rahasia '/kazuya01'
  const isHidden = user || location.pathname.startsWith('/kazuya01') || location.pathname.startsWith('/member');

  if (isHidden) return null;

  return (
    <>
      <FomoNotification />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  );
};

// --- KOMPONEN TOMBOL ADMIN (HANYA MUNCUL SETELAH LOGIN) ---
const AdminFloatingButtons = () => {
  const { user, logoutAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (location.pathname.startsWith('/member')) return null;

  // Jika belum login, TIDAK ADA TOMBOL APAPUN (Sesuai request hidden)
  if (!user) {
    return null; 
  }

  // Jika SUDAH LOGIN, Tampilkan Menu Logout & Tombol ke Dashboard
  return (
    <div className="fixed bottom-10 left-8 z-[80] flex flex-col-reverse gap-4 items-center animate-fade-in-up">
       <button onClick={logoutAdmin} className="group relative w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-400 border border-red-500/30 shadow-lg hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 hover:scale-110">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
       </button>
       
       {/* ✅ UPDATE: Link menuju rute rahasia */}
       <a href="/kazuya01" className="group relative w-12 h-12 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20 hover:scale-110 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
       </a>
    </div>
  );
};

const HomeContent = () => {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <div id="top"></div>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white dark:to-[#030303]"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
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
        <AdminFloatingButtons />
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
                
                {/* ✅ UPDATE: RUTE RAHASIA ADMIN */}
                <Route path="/kazuya01" element={<AdminDashboard />} />

                <Route path="/member" element={<MemberArea />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;