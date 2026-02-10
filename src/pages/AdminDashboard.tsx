import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore'; 
import { auth, db } from '../lib/firebase';

// IMPORT HALAMAN LOGIN (PENJAGA PINTU)
import AdminLogin from './AdminLogin'; 

// IMPORT KOMPONEN
import ProductList from '../components/ProductList';
import AdminHeroManager from '../components/admin/AdminHeroManager';
import AdminGeneralSettings from '../components/admin/AdminGeneralSettings';
import FomoNotification from '../components/FomoNotification';
import AddProductModal from '../components/admin/AddProductModal'; 

// --- KOMPONEN GRAFIK BATANG (CSS PURE) ---
const SalesChart = () => {
  const data = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
  
  return (
    <div className="flex items-end justify-between h-40 gap-2 mt-4 px-2">
      {data.map((h, i) => (
        <div key={i} className="w-full bg-slate-700/50 rounded-t-sm relative group overflow-hidden" style={{ height: `${h}%` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-cyan-400/80 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Tooltip Hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
            {h * 10} Sales
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  // Ambil state auth dan loading dari context
  const { user, isAdmin, loading } = useAuth(); 
  const navigate = useNavigate();
  
  // STATE DASHBOARD
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 
  
  // STATE STATISTIK
  const [stats, setStats] = useState({
    totalProducts: 0,
    bestSellers: 0,
    totalValue: 0,
    activeCategories: 0
  });

  // Fetch Stats hanya jika user sudah login & admin
  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin, refreshKey]);

  // HITUNG STATISTIK DARI FIREBASE
  const fetchStats = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => doc.data());
        
        const total = products.length;
        const best = products.filter(p => p.isBestSeller).length;
        const value = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        const cats = new Set(products.map(p => p.category)).size;

        setStats({ 
            totalProducts: total, 
            bestSellers: best, 
            totalValue: value, 
            activeCategories: cats 
        });
    } catch (error) {
        console.error("Gagal memuat statistik", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      // Setelah logout, otomatis komponen ini akan re-render dan menampilkan <AdminLogin /> karena user null
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleSuccessAdd = () => {
    setRefreshKey(prev => prev + 1); 
    fetchStats();
  };

  // --- LOGIKA PENJAGA PINTU (GATEKEEPER) ---

  // 1. Loading State (Agar tidak berkedip)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // 2. Jika BELUM LOGIN: Tampilkan Halaman Login (Jangan Redirect)
  if (!user) {
    return <AdminLogin />;
  }

  // 3. Jika Login tapi BUKAN ADMIN (Opsional: Tendang ke Home atau Tampilkan Pesan)
  // Untuk keamanan ekstra, kita anggap null dulu
  if (!isAdmin) return null; 

  // 4. Jika SUDAH LOGIN & ADMIN: Tampilkan Dashboard Penuh
  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER NAVBAR --- */}
      <div className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 animate-pulse"></div>
                <div className="relative w-9 h-9 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl border border-slate-600 flex items-center justify-center text-lg shadow-inner">🛡️</div>
            </div>
            <div>
                <h1 className="font-bold text-sm md:text-lg leading-tight text-white tracking-tight">Admin Console</h1>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-medium">System Online</p>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={() => window.open('/', '_blank')} 
                className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-cyan-900/20 text-slate-300 hover:text-cyan-400 rounded-full text-xs font-bold transition-all border border-slate-700 hover:border-cyan-500/50"
            >
                <span className="group-hover:rotate-12 transition-transform duration-300">🌐</span> 
                <span className="hidden sm:inline">Lihat Website</span>
                <span className="inline sm:hidden">Web</span>
            </button>
            
            <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block"></div>
            
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full text-xs font-bold transition-all border border-red-500/20 flex items-center gap-2 group">
                <span className="group-hover:-translate-x-0.5 transition-transform">🚪</span> 
                <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* --- SECTION 1: STATISTIK CARDS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">📦</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Produk</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-white">{stats.totalProducts}</h3>
                    <span className="text-xs text-emerald-400 mb-1">Items</span>
                </div>
                <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%]"></div>
                </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">⭐</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Best Seller</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-yellow-400">{stats.bestSellers}</h3>
                    <span className="text-xs text-yellow-400/70 mb-1">Populer</span>
                </div>
                <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[40%]"></div>
                </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">💰</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Estimasi Aset</p>
                <h3 className="text-xl md:text-2xl font-black text-emerald-400 truncate">
                    Rp {(stats.totalValue / 1000).toFixed(0)}k
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Total nilai katalog</p>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">🏷️</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Kategori Aktif</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-purple-400">{stats.activeCategories}</h3>
                    <span className="text-xs text-purple-400/70 mb-1">Jenis</span>
                </div>
                <div className="flex gap-1 mt-3">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: GRAFIK & MONITORING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRAFIK PENJUALAN (KIRI - LEBAR) */}
            <div className="lg:col-span-2 bg-[#1e293b]/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-lg font-bold text-white">📈 Tren Aktivitas</h2>
                        <p className="text-xs text-gray-400">Monitoring traffic pengunjung & penjualan (Real-time)</p>
                    </div>
                    <select className="bg-slate-800 text-xs border border-slate-600 rounded px-2 py-1 text-gray-300 outline-none">
                        <option>7 Hari Terakhir</option>
                        <option>30 Hari Terakhir</option>
                    </select>
                </div>
                
                <SalesChart />
                
                <div className="flex justify-between text-[10px] text-gray-500 px-2 mt-2 font-mono">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>
            </div>

            {/* MONITORING SYSTEM (KANAN - KECIL) */}
            <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    ⚡ System Health
                </h2>
                
                {/* Status Items */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">🔥</div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Firebase DB</p>
                                <p className="text-[10px] text-emerald-400">Connected</p>
                            </div>
                        </div>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">☁️</div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Storage</p>
                                <p className="text-[10px] text-gray-400">34% Used</p>
                            </div>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[34%]"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">🔒</div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Auth System</p>
                                <p className="text-[10px] text-emerald-400">Secure</p>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500">v.1.0.4</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-700/30">
                    <p className="text-[10px] text-center text-gray-500">Last Sync: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>

        {/* --- SECTION 3: TAB NAVIGASI --- */}
        <div className="flex justify-center sticky top-20 z-30">
            <div className="bg-[#1e293b]/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-600/50 inline-flex shadow-2xl">
                <button 
                    onClick={() => setActiveTab('products')} 
                    className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    📦 Produk
                </button>
                <button 
                    onClick={() => setActiveTab('hero')} 
                    className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'hero' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    🖼️ Banner
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/30' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    ⚙️ Setting
                </button>
            </div>
        </div>

        {/* --- SECTION 4: KONTEN UTAMA --- */}
        <div className="bg-[#1e293b]/40 border border-slate-700/50 rounded-3xl p-4 md:p-6 min-h-[500px] animate-fade-in">
            
            {activeTab === 'products' && (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                           📂 Katalog Produk
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Kelola inventory toko digital Anda dengan mudah.</p>
                    </div>
                    {/* TOMBOL ADD PRODUK */}
                    <button 
                        onClick={() => setShowAddModal(true)} 
                        className="group w-full md:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10"
                    >
                        <span className="text-xl leading-none font-light group-hover:rotate-90 transition-transform duration-300">+</span> 
                        Tambah Produk Baru
                    </button>
                </div>

                <ProductList key={refreshKey} />
            </div>
            )}

            {activeTab === 'hero' && <AdminHeroManager />}
            {activeTab === 'settings' && <AdminGeneralSettings />}
        </div>
      </div>

      {/* COMPONENT MODAL BARU */}
      {showAddModal && (
        <AddProductModal 
            onClose={() => setShowAddModal(false)} 
            onSuccess={handleSuccessAdd} 
        />
      )}
      
      <FomoNotification />
    </div>
  );
};

export default AdminDashboard;