import { getNews } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. BAGIAN UI & ANIMASI (Supaya Web Tidak Kosong) ---
    try {
        // Inisialisasi AOS agar elemen yang hidden jadi muncul
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: true,
                duration: 800,
                offset: 50
            });
        }
    } catch (e) {
        console.warn("Library AOS belum siap, animasi dilewati.");
    }

    // Logic Navbar (Agar header berubah warna saat scroll)
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-[#0f172a]/95', 'backdrop-blur-lg', 'shadow-lg');
                navbar.classList.remove('bg-transparent', 'py-3');
            } else {
                navbar.classList.remove('bg-[#0f172a]/95', 'backdrop-blur-lg', 'shadow-lg');
                navbar.classList.add('bg-transparent', 'py-3');
            }
        });
    }

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. BAGIAN DATA FIREBASE (Supaya Loading Berhenti) ---
    const container = document.getElementById('bulletin-container');
    
    if (container) {
        // Tampilkan status loading yang rapi
        container.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <i class="fas fa-circle-notch fa-spin text-3xl text-blue-500 mb-3"></i>
                <p class="text-slate-500 animate-pulse">Sedang sinkronisasi data...</p>
            </div>
        `;

        try {
            console.log("Memulai request ke Firebase...");
            const news = await getNews();
            console.log("Data diterima:", news);

            if (news.length === 0) {
                container.innerHTML = `<div class="col-span-3 text-center text-slate-400 py-10">Belum ada berita yang dipublish.</div>`;
            } else {
                container.innerHTML = ''; // Hapus loading
                
                news.forEach((item, index) => {
                    // Format Tanggal (Safety Check)
                    let dateStr = "Baru saja";
                    try {
                        if (item.date && item.date.toDate) {
                            dateStr = item.date.toDate().toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            });
                        }
                    } catch (err) { console.warn("Format tanggal invalid", err); }

                    // Render Kartu Berita
                    container.innerHTML += `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col h-full" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="h-48 overflow-hidden bg-gray-200 relative group">
                             <img src="${item.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="${item.title}">
                             <div class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow z-10 uppercase">
                                ${item.category || 'News'}
                             </div>
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <div class="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                <i class="far fa-calendar-alt"></i> ${dateStr}
                            </div>
                            <h3 class="font-bold text-lg text-slate-800 mb-3 leading-snug hover:text-blue-600 transition">${item.title}</h3>
                            <p class="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">${item.content}</p>
                     <a href="detail.html?id=${item.id}" class="text-amber-500 text-sm font-bold uppercase tracking-wider hover:underline mt-auto inline-flex items-center">
    Baca Selengkapnya <i class="fas fa-arrow-right ml-2"></i>
</a>
                        </div>
                    </div>
                    `;
                });
            }
        } catch (error) {
            console.error("Error Firebase:", error);
            container.innerHTML = `
                <div class="col-span-3 text-center py-10 bg-red-50 rounded-lg border border-red-100">
                    <p class="text-red-500 font-bold">Gagal memuat berita</p>
                    <p class="text-xs text-red-400 mt-1">Pastikan koneksi internet lancar</p>
                </div>
            `;
        }
    }
});