import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext'; // ✅ Perbaikan: Hapus 'useLanguage'
import { ThemeProvider } from './context/ThemeContext';
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
import CTASection from './components/CTASection'; 
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
// ✅ Perbaikan: Baris import 'handleAddProduct' sudah DIHAPUS total dari sini

// --- KOMPONEN KONTROL ELEMEN MELAYANG ---
const FloatingElements = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Sembunyikan jika user Login (Admin Mode) ATAU sedang di halaman /admin
  const isAdminActive = user || location.pathname.startsWith('/admin');

  if (isAdminActive) return null;

  return (
    <>
      <FomoNotification />   {/* Bawah Kiri */}
      <ScrollToTop />        {/* Bawah Kiri (di atas Fomo) */}
      <WhatsAppButton />     {/* Bawah Kanan */}
    </>
  );
};

// --- KOMPONEN TOMBOL ADMIN (YANG SUDAH DIPERCANTIK) ---
const AdminFloatingButtons = () => {
  const { user, loginAdmin, logoutAdmin, loading } = useAuth();

  if (loading) return null;
  
  // --- KONDISI 1: BELUM LOGIN (TOMBOL LOGIN KEREN) ---
  if (!user) {
    return (
      <button 
        onClick={loginAdmin} 
        className="fixed bottom-10 left-8 z-[80] group" // Pindah ke Kiri Bawah
        title="Admin Login"
      >
        {/* Efek Glow/Cahaya di belakang */}
        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[10px] opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        {/* Tombol Utama */}
        <div className="relative w-12 h-12 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-white">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
           </svg>
        </div>

        {/* Tooltip Keren */}
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
          Admin Access
        </span>
      </button>
    );
  }

  // --- KONDISI 2: SUDAH LOGIN (MENU ADMIN EKSKLUSIF) ---
  return (
    <div className="fixed bottom-10 left-8 z-[80] flex flex-col-reverse gap-4 items-center animate-fade-in-up">
       
       {/* 1. Tombol LOGOUT (Paling Bawah) */}
       <button 
          onClick={logoutAdmin} 
          className="group relative w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-400 border border-red-500/30 shadow-lg hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 hover:scale-110"
       >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          
          {/* Tooltip Logout */}
          <span className="absolute left-14 bg-black/80 text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Logout
          </span>
       </button>

       {/* 2. Tombol DASHBOARD (Di Atasnya) */}
       <a 
          href="/admin" 
          className="group relative w-12 h-12 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20 hover:scale-110 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300"
       >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          
          {/* Tooltip Dashboard */}
          <span className="absolute left-14 bg-cyan-900/90 text-cyan-200 text-[10px] font-bold px-2 py-1 rounded border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm whitespace-nowrap">
            Buka Dashboard
          </span>
       </a>

       {/* 3. Indikator Status (Paling Atas) */}
       <div className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur tracking-widest uppercase shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Admin
       </div>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={
                  <>
                    <CustomCursor />
                    <ScrollProgress />
                    <div id="top"></div>

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
                      <div id="cta" className="scroll-mt-24"><CTASection /></div>
                      <div id="contact" className="scroll-mt-24"><Footer /></div>
                      
                      {/* LOGIK KONTROL FLOATING DI SINI */}
                      <FloatingElements />

                      {/* Tombol Gembok Admin Tetap Ada Untuk Logout & Masuk Dashboard */}
                      <AdminFloatingButtons />
                    </div>
                  </>
              } />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;