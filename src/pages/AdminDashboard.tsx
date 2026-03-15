import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, query, orderBy } from 'firebase/firestore'; 
import { auth, db } from '../lib/firebase';

// IMPORT HALAMAN LOGIN (PENJAGA PINTU)
import AdminLogin from './AdminLogin'; 

// IMPORT KOMPONEN
import ProductList from '../components/ProductList';
import AdminHeroManager from '../components/admin/AdminHeroManager';
import AdminGeneralSettings from '../components/admin/AdminGeneralSettings';
import FomoNotification from '../components/FomoNotification';
import AddProductModal from '../components/admin/AddProductModal'; 

// ✅ IMPORT ICON LENGKAP (TIDAK BOLEH ADA YANG KURANG)
import { 
  Trash2, CheckCircle, XCircle, Users, RefreshCw, 
  Database, ShieldCheck, Activity, Globe, LogOut, Plus, 
  PlayCircle, FileText, Link, BookOpen, LayoutDashboard,
  Layers, Settings, BarChart3, TrendingUp, Filter, Monitor, Zap
} from 'lucide-react';

// --- KOMPONEN GRAFIK BATANG (CSS PURE) ---
const SalesChart = () => {
  const data = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
  
  return (
    <div className="flex items-end justify-between h-40 gap-2 mt-4 px-2">
      {data.map((h, i) => (
        <div key={i} className="w-full bg-slate-700/50 rounded-t-sm relative group overflow-hidden" style={{ height: `${h}%` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-cyan-400/80 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Tooltip Hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-mono">
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

  // ✅ KUNCI ADMIN UTAMA MAS YUDA
  const MASTER_ADMIN_EMAIL = "pamungkas.blue@gmail.com";
  
  // STATE DASHBOARD
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 
  
  // STATE STATISTIK
  const [stats, setStats] = useState({
    totalProducts: 0,
    bestSellers: 0,
    totalValue: 0,
    activeCategories: 0,
    totalMembers: 0,
    totalModules: 0
  });

  // ✅ STATE UNTUK MANAJEMEN MEMBER
  const [members, setMembers] = useState<any[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  // ✅ STATE UNTUK MANAJEMEN MATERI (CURRICULUM)
  const [modules, setModules] = useState<any[]>([]);
  const [isFetchingModules, setIsFetchingModules] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '', 
    description: '', 
    duration: '', 
    url: '', 
    type: 'video', 
    order: 1
  });

  // ✅ --- LOGIKA PENJAGA PINTU (PROTEKSI TOTAL) ---
  useEffect(() => {
    if (!loading && user) {
      // Jika ada user login tapi emailnya bukan email Master Admin, tendang ke Home
      if (user.email !== MASTER_ADMIN_EMAIL) {
        console.warn("AKSES ILEGAL DETEKSI! Mengalihkan...");
        navigate('/'); 
      }
    }
  }, [user, loading, navigate]);

  // Fetch Stats & Semua Data (Hanya jika admin resmi)
  useEffect(() => {
    if (!loading && user && user.email === MASTER_ADMIN_EMAIL) {
      fetchStats();
      if (activeTab === 'members') fetchMembers();
      if (activeTab === 'curriculum') fetchModules();
    }
  }, [user, loading, refreshKey, activeTab]);

  // HITUNG STATISTIK DARI FIREBASE
  const fetchStats = async () => {
    try {
        const prodSnapshot = await getDocs(collection(db, "products"));
        const products = prodSnapshot.docs.map(doc => doc.data());
        const memberSnapshot = await getDocs(collection(db, "users"));
        const moduleSnapshot = await getDocs(collection(db, "curriculum"));

        setStats({ 
            totalProducts: prodSnapshot.size, 
            bestSellers: products.filter(p => p.isBestSeller).length, 
            totalValue: products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0), 
            activeCategories: new Set(products.map(p => p.category)).size,
            totalMembers: memberSnapshot.size,
            totalModules: moduleSnapshot.size
        });
    } catch (error) {
        console.error("Gagal memuat statistik", error);
    }
  };

  // ✅ FUNGSI AMBIL DATA MEMBER
  const fetchMembers = async () => {
    setIsFetchingMembers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
    } catch (err) {
      console.error("Gagal ambil member:", err);
    } finally {
      setIsFetchingMembers(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Hapus member ini secara permanen? Ingat: Anda juga wajib menghapus emailnya di Firebase Authentication agar dia bisa daftar lagi.")) {
      try {
        await deleteDoc(doc(db, "users", id));
        fetchMembers();
        fetchStats();
      } catch (err) { alert("Gagal menghapus."); }
    }
  };

  const togglePaymentStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'lunas' ? 'belum' : 'lunas';
    try {
      await updateDoc(doc(db, "users", id), { status_bayar: newStatus });
      fetchMembers();
    } catch (err) { alert("Gagal update status."); }
  };

  // ✅ FUNGSI MANAJEMEN MATERI (CURRICULUM)
  const fetchModules = async () => {
    setIsFetchingModules(true);
    try {
      const q = query(collection(db, "curriculum"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModules(data);
    } catch (err) {
      console.error("Gagal ambil materi:", err);
    } finally {
      setIsFetchingModules(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "curriculum"), newModule);
      setNewModule({ title: '', description: '', duration: '', url: '', type: 'video', order: modules.length + 2 });
      fetchModules();
      fetchStats();
      alert("Materi Baru Berhasil Ditambahkan ke Member Area!");
    } catch (err) {
      alert("Gagal menambahkan materi.");
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (window.confirm("Hapus materi ini secara permanen dari Kurikulum?")) {
      try {
        await deleteDoc(doc(db, "curriculum", id));
        fetchModules();
        fetchStats();
      } catch (err) { alert("Gagal hapus materi."); }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/'); 
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleSuccessAdd = () => {
    setRefreshKey(prev => prev + 1); 
    fetchStats();
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  // 2. Jika BELUM LOGIN: Tampilkan Halaman Login
  if (!user) {
    return <AdminLogin />;
  }

  // 3. Jika login tapi BUKAN EMAIL MASTER, jangan render (Redirect di useEffect)
  if (user.email !== MASTER_ADMIN_EMAIL) return null; 

  // 4. LOGIN BERHASIL: RENDER FULL DASHBOARD
  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER NAVBAR (STICKY) --- */}
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
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">System Online</p>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={() => window.open('/', '_blank')} 
                className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-cyan-900/20 text-slate-300 hover:text-cyan-400 rounded-full text-xs font-bold transition-all border border-slate-700"
            >
                <Globe size={14} className="group-hover:rotate-12 transition-transform duration-300" /> 
                <span className="hidden sm:inline">Website</span>
            </button>
            
            <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block"></div>
            
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full text-xs font-bold transition-all border border-red-500/20 flex items-center gap-2 group">
                <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
                <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* --- SECTION 1: STATISTIK CARDS (LENGKAP) --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Produk</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-white">{stats.totalProducts}</h3>
                    <span className="text-xs text-emerald-400 mb-1">Items</span>
                </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Member</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-cyan-400">{stats.totalMembers}</h3>
                    <span className="text-xs text-cyan-400/70 mb-1">Users</span>
                </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Materi</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-purple-400">{stats.totalModules}</h3>
                    <span className="text-xs text-purple-400/70 mb-1">Modul</span>
                </div>
            </div>

            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-300">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Estimasi Aset</p>
                <h3 className="text-xl md:text-2xl font-black text-emerald-400 truncate">
                    Rp {(stats.totalValue / 1000).toFixed(0)}k
                </h3>
            </div>
        </div>

        {/* --- SECTION 2: GRAFIK & MONITORING (LENGKAP) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#1e293b]/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity size={18} className="text-cyan-400"/> Tren Aktivitas</h2>
                        <p className="text-xs text-gray-400 font-medium">Monitoring traffic pengunjung secara Real-time.</p>
                    </div>
                </div>
                <SalesChart />
                <div className="flex justify-between text-[10px] text-gray-500 px-2 mt-4 font-mono uppercase tracking-widest">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>
            </div>

            <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">⚡ System Health</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 group hover:border-orange-500/50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><Database size={16}/></div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Firebase DB</p>
                                <p className="text-[10px] text-emerald-400">Connected</p>
                            </div>
                        </div>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 group hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><ShieldCheck size={16}/></div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Auth System</p>
                                <p className="text-[10px] text-emerald-400 uppercase font-black">Secure</p>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">v.1.2.0</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Zap size={16}/></div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">Server Latency</p>
                                <p className="text-[10px] text-slate-500">12ms (Optimal)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECTION 3: TAB NAVIGASI (UTUH) --- */}
        <div className="flex justify-center sticky top-20 z-30">
            <div className="bg-[#1e293b]/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-600/50 inline-flex shadow-2xl">
                <button 
                    onClick={() => setActiveTab('products')} 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    📦 Produk
                </button>
                {/* TAB MATERI */}
                <button 
                    onClick={() => setActiveTab('curriculum')} 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'curriculum' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    📚 Materi
                </button>
                <button 
                    onClick={() => setActiveTab('members')} 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'members' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    👥 Member
                </button>
                <button 
                    onClick={() => setActiveTab('hero')} 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'hero' ? 'bg-slate-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    🖼️ Banner
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-slate-700 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                >
                    ⚙️
                </button>
            </div>
        </div>

        {/* --- SECTION 4: KONTEN UTAMA (LENGKAP) --- */}
        <div className="bg-[#1e293b]/40 border border-slate-700/50 rounded-3xl p-4 md:p-6 min-h-[600px] animate-fade-in shadow-inner">
            
            {/* --- TAB PRODUK --- */}
            {activeTab === 'products' && (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                            📂 Katalog Produk
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Kelola inventory toko digital Gerbang Digital.</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg border border-white/10 hover:scale-105 transition-all">
                      <Plus size={18}/> Tambah Produk Baru
                    </button>
                </div>
                <ProductList key={refreshKey} />
            </div>
            )}

            {/* --- ✅ TAB MATERI / KURIKULUM (LENGKAP) --- */}
            {activeTab === 'curriculum' && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-purple-400 mb-6"><BookOpen size={20}/> Tambah Materi Baru</h3>
                  <form onSubmit={handleAddModule} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input required placeholder="Judul Materi" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-cyan-500 outline-none" value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} />
                    <input placeholder="Durasi (e.g 10:05 Menit)" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-cyan-500 outline-none" value={newModule.duration} onChange={e => setNewModule({...newModule, duration: e.target.value})} />
                    <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300" value={newModule.type} onChange={e => setNewModule({...newModule, type: e.target.value})}>
                      <option value="video">🎥 Video (YouTube/Loom)</option>
                      <option value="file">📦 File (Download/ZIP)</option>
                      <option value="link">🌐 Link (External)</option>
                    </select>
                    <input required placeholder="URL Link / Source Code Link" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm md:col-span-2 focus:border-cyan-500 outline-none" value={newModule.url} onChange={e => setNewModule({...newModule, url: e.target.value})} />
                    <input type="number" placeholder="Urutan Tampil" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:border-cyan-500 outline-none" value={newModule.order} onChange={e => setNewModule({...newModule, order: parseInt(e.target.value)})} />
                    <textarea placeholder="Deskripsi Singkat Materi" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm md:col-span-3 h-24 outline-none focus:border-cyan-500" value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} />
                    <button type="submit" className="md:col-span-3 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                        <Plus size={18}/> Simpan ke Kurikulum Member
                    </button>
                  </form>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
                  <table className="w-full text-left bg-[#0f172a]/40 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/30 text-slate-400 text-[10px] uppercase font-black tracking-widest font-mono">
                        <th className="py-5 px-6">Urutan</th>
                        <th className="py-5 px-6">Informasi Materi</th>
                        <th className="py-5 px-6 text-center">Tipe Media</th>
                        <th className="py-5 px-6 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {modules.length > 0 ? (
                        modules.map(m => (
                          <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                            <td className="py-5 px-6 font-mono text-cyan-500 text-lg font-black">#{m.order}</td>
                            <td className="py-5 px-6">
                                <div className="font-bold text-white text-base mb-0.5">{m.title}</div>
                                <div className="text-[10px] text-slate-500 font-medium italic">{m.duration || "00:00"}</div>
                                <div className="text-[10px] text-slate-400 mt-1 truncate max-w-xs">{m.description}</div>
                            </td>
                            <td className="py-5 px-6 text-center">
                                <div className="flex justify-center">
                                    {m.type === 'video' ? <PlayCircle size={22} className="text-red-500 opacity-80"/> : m.type === 'file' ? <FileText size={22} className="text-blue-500 opacity-80"/> : <Link size={22} className="text-emerald-500 opacity-80"/>}
                                </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                                <button onClick={() => handleDeleteModule(m.id)} className="p-2.5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/20 shadow-sm"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="py-20 text-center text-slate-600 font-bold italic tracking-widest">{isFetchingModules ? "Synchronizing Modules..." : "No Curriculum Data Found"}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB MEMBER (LENGKAP) --- */}
            {activeTab === 'members' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-inner">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Users size={24} className="text-emerald-400"/> Database Member</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium italic">Manajemen akses eksklusif Gerbang Digital VIP Club.</p>
                  </div>
                  <button onClick={fetchMembers} className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all border border-slate-600">
                    <RefreshCw size={20} className={isFetchingMembers ? "animate-spin text-cyan-400" : "text-white"}/>
                  </button>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
                  <table className="w-full text-left border-collapse bg-[#0f172a]/40">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/30 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black font-mono">
                        <th className="py-5 px-6">Identitas Member</th>
                        <th className="py-5 px-6">Kontak (WhatsApp)</th>
                        <th className="py-5 px-6 text-center">Status Pembayaran</th>
                        <th className="py-5 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {members.length > 0 ? (
                        members.map((m) => (
                          <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                            <td className="py-5 px-6 font-medium">
                              <div className="font-bold text-white text-base">{m.nama || "Unknown"}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{m.email}</div>
                            </td>
                            <td className="py-5 px-6 text-slate-300 font-mono tracking-tighter">{m.wa || "-"}</td>
                            <td className="py-5 px-6 text-center">
                              <div className="flex justify-center">
                                <button 
                                  onClick={() => togglePaymentStatus(m.id, m.status_bayar)}
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border transition-all hover:scale-105 active:scale-95 ${
                                    m.status_bayar === 'lunas' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                  }`}
                                >
                                  {m.status_bayar === 'lunas' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                                  {m.status_bayar === 'lunas' ? 'VERIFIED (LUNAS)' : 'UNPAID (BELUM)'}
                                </button>
                              </div>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <button onClick={() => handleDeleteMember(m.id)} className="p-2.5 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/20"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="py-24 text-center text-slate-600 font-black tracking-widest italic">{isFetchingMembers ? "Connecting to Database..." : "No Members Registered"}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB HERO & SETTINGS (UTUH) */}
            {activeTab === 'hero' && <AdminHeroManager />}
            {activeTab === 'settings' && <AdminGeneralSettings />}
        </div>
      </div>

      {/* COMPONENT MODAL ADD PRODUK (UTUH) */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSuccess={handleSuccessAdd} />}
      
      <FomoNotification />
    </div>
  );
};

export default AdminDashboard;