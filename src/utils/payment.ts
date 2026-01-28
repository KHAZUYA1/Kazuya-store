import Swal from "sweetalert2";
// PERBAIKAN: Gunakan 'import type' karena Product bukan variabel
import type { Product } from "../types"; 

export const processPayment = async (p: Product) => {
    await Swal.fire({
        title: 'Metode Pembayaran',
        html: `
        <div class="grid grid-cols-1 gap-3 mt-4 text-left">
            <div id="pay-qris" class="flex items-center gap-4 p-4 rounded-xl border border-gray-600 bg-gray-800/50 hover:bg-yellow-900/20 hover:border-yellow-500 cursor-pointer transition-all group relative overflow-hidden">
                <div class="absolute right-0 top-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">INSTANT</div>
                <div class="w-10 h-10 rounded-full bg-yellow-600/20 text-yellow-400 flex items-center justify-center text-xl">⚡</div>
                <div><h4 class="font-bold text-white">Scan QRIS</h4><p class="text-xs text-gray-400">DANA, GoPay, OVO, ShopeePay</p></div>
            </div>
            <div id="pay-manual" class="flex items-center gap-4 p-4 rounded-xl border border-gray-600 bg-gray-800/50 hover:bg-blue-900/20 hover:border-blue-500 cursor-pointer transition-all group">
                <div class="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl">🏦</div>
                <div><h4 class="font-bold text-white">Transfer Bank</h4><p class="text-xs text-gray-400">BCA / Mandiri (Chat Admin)</p></div>
            </div>
        </div>`,
        showConfirmButton: false, showCloseButton: true, background: '#1e293b', color: '#fff',
        didOpen: () => {
            const btnQris = document.getElementById('pay-qris');
            const btnManual = document.getElementById('pay-manual');
            
            if(btnQris) btnQris.onclick = () => confirmCheckout(p, 'qris');
            if(btnManual) btnManual.onclick = () => confirmCheckout(p, 'manual');
        }
    });
};

const confirmCheckout = (p: Product, method: 'qris' | 'manual') => {
    Swal.close();
    if (method === 'qris') {
        Swal.fire({
            title: 'Scan QRIS', background: '#fff', color: '#000',
            html: `<div class="flex flex-col items-center gap-3"><div class="p-2 border-2 border-black rounded-lg"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" class="w-64 h-64 object-contain" alt="QRIS"></div><div class="text-center"><p class="text-sm text-gray-600">Total: Rp ${p.price}</p></div></div>`,
            confirmButtonText: '✅ Sudah Bayar', confirmButtonColor: '#25D366'
        }).then((res) => {
            if(res.isConfirmed) window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(`Halo, saya sudah bayar QRIS untuk ${p.name} (Rp ${p.price}). Bukti terlampir.`)}`, '_blank');
        });
    } else {
        window.open(`https://wa.me/6282270189045?text=${encodeURIComponent(`Halo, saya mau beli ${p.name} via Transfer BCA.`)}`, '_blank');
    }
};