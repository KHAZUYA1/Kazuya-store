// js/admin.js
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from './firebase.js';

const newsForm = document.getElementById('news-form');
const listContainer = document.getElementById('admin-news-list');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// 1. FUNGSI BACA DATA (REALTIME)
function loadAdminData() {
    const q = query(collection(db, "buletin"), orderBy("tanggal", "desc"));
    
    // onSnapshot mendengarkan perubahan database secara langsung
    onSnapshot(q, (snapshot) => {
        listContainer.innerHTML = "";
        
        if (snapshot.empty) {
            listContainer.innerHTML = "<p class='text-center text-gray-400'>Belum ada data berita.</p>";
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            // Render Item List
            const itemHTML = `
                <div class="flex flex-col md:flex-row gap-4 border p-4 rounded-lg hover:bg-slate-50 transition items-start">
                    <img src="${data.imageUrl || 'https://via.placeholder.com/100'}" class="w-24 h-24 object-cover rounded bg-gray-200">
                    <div class="flex-grow">
                        <h3 class="font-bold text-lg text-[#0f172a]">${data.judul}</h3>
                        <p class="text-xs text-blue-600 font-bold mb-2"><i class="far fa-calendar-alt"></i> ${data.tanggal}</p>
                        <p class="text-sm text-gray-600 line-clamp-2">${data.deskripsi}</p>
                    </div>
                    <div class="flex flex-row md:flex-col gap-2 min-w-[100px]">
                        <button onclick="window.editNews('${id}', '${encodeURIComponent(JSON.stringify(data))}')" 
                            class="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 w-full">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="window.deleteNews('${id}')" 
                            class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 w-full">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
            listContainer.innerHTML += itemHTML;
        });
    });
}

// 2. FUNGSI SIMPAN (TAMBAH / UPDATE)
newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ambil value dari form
    const id = document.getElementById('doc-id').value;
    const newData = {
        judul: document.getElementById('judul').value,
        tanggal: document.getElementById('tanggal').value,
        imageUrl: document.getElementById('imageUrl').value,
        videoUrl: document.getElementById('videoUrl').value,
        deskripsi: document.getElementById('deskripsi').value
    };

    btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Proses...';

    try {
        if (id) {
            // MODE EDIT (Update)
            await updateDoc(doc(db, "buletin", id), newData);
            alert("Berita berhasil diperbarui!");
        } else {
            // MODE TAMBAH (Add)
            await addDoc(collection(db, "buletin"), newData);
            alert("Berita baru berhasil ditambahkan!");
        }
        resetForm();
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan: " + error.message);
    } finally {
        btnSave.innerHTML = '<i class="fas fa-save mr-2"></i>SIMPAN';
    }
});

// 3. FUNGSI DELETE (HAPUS)
window.deleteNews = async (id) => {
    if (confirm("Yakin ingin menghapus berita ini?")) {
        try {
            await deleteDoc(doc(db, "buletin", id));
        } catch (error) {
            alert("Gagal menghapus: " + error.message);
        }
    }
};

// 4. FUNGSI EDIT (ISI FORM)
window.editNews = (id, dataString) => {
    const data = JSON.parse(decodeURIComponent(dataString));
    
    document.getElementById('doc-id').value = id;
    document.getElementById('judul').value = data.judul;
    document.getElementById('tanggal').value = data.tanggal;
    document.getElementById('imageUrl').value = data.imageUrl;
    document.getElementById('videoUrl').value = data.videoUrl || '';
    document.getElementById('deskripsi').value = data.deskripsi;
    
    btnSave.innerHTML = '<i class="fas fa-check mr-2"></i>UPDATE DATA';
    btnSave.classList.replace('bg-green-600', 'bg-blue-600');
    btnCancel.classList.remove('hidden');
    
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 5. RESET FORM
function resetForm() {
    newsForm.reset();
    document.getElementById('doc-id').value = '';
    btnSave.innerHTML = '<i class="fas fa-save mr-2"></i>SIMPAN';
    btnSave.classList.replace('bg-blue-600', 'bg-green-600');
    btnCancel.classList.add('hidden');
}

btnCancel.addEventListener('click', resetForm);

// Jalankan saat load
loadAdminData();