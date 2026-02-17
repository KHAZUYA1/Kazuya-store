export interface Product {
  id: string;
  name: string;
  price: number;
  fakePrice?: number; // <--- Tambahkan baris ini agar error hilang
  category: string;
  image: string;
  images?: string[];
  description?: string;
  videoUrl?: string;
  paymentLink?: string;
  isVisible?: boolean;
  isBestSeller?: boolean;
  timestamp?: any;
}