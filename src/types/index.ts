export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;       // Foto Utama (Cover)
  images?: string[];   // <--- WAJIB ADA (Untuk Galeri Foto Banyak)
  subtitle?: string;
  description?: string;
  timestamp: number;   // Bisa number atau object Firestore Timestamp
  isVisible: boolean;
  isBestSeller: boolean;
  paymentLink?: string; 
  videoUrl?: string;
}