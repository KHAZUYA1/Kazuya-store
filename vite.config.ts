import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <--- Plugin WAJIB untuk Tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Masukkan kembali ke sini agar CSS tampil lagi
  ],
  build: {
    // Membagi library besar menjadi potongan kecil agar tidak lemot
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        },
      },
    },
    // Menaikkan batas peringatan ukuran file agar tidak muncul warna kuning
    chunkSizeWarningLimit: 1000,
  },
  // Menggunakan Esbuild untuk menghapus console.log otomatis
  esbuild: {
  },
});