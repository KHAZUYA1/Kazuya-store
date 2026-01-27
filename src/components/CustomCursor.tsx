import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    // Menambahkan kelas ke elemen root saat komponen aktif
    document.documentElement.classList.add('gaming-cursor-active');
    return () => document.documentElement.classList.remove('gaming-cursor-active');
  }, []);

  // SVG Panah Gaming yang tajam & modern (Warna Biru Gerbang Digital)
  const gamingArrow = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiwzIEwyOCwxNSBMMTUsMTggTDExLDI5IEwyLDMgWiIgZmlsbD0iIzI1NjNlYiIgc3Ryb2tlPSIjMjJkM2VlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=`;

  // SVG Panah saat diarahkan ke tombol (Warna Cyan Terang)
  const gamingPointer = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiwzIEwyOCwxNSBMMTUsMTggTDExLDI5IEwyLDMgWiIgZmlsbD0iIzA4OTFiYiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=`;

  return (
    <style>{`
      /* Mengganti kursor global secara instan */
      .gaming-cursor-active, 
      .gaming-cursor-active body,
      .gaming-cursor-active div,
      .gaming-cursor-active section {
        cursor: url("${gamingArrow}"), auto !important;
      }

      /* Kursor khusus saat hover tombol, link, atau input */
      .gaming-cursor-active a, 
      .gaming-cursor-active button,
      .gaming-cursor-active input,
      .gaming-cursor-active [role="button"] {
        cursor: url("${gamingPointer}"), pointer !important;
      }

      /* Mematikan kursor pada mobile agar tidak ganggu */
      @media (max-width: 768px) {
        .gaming-cursor-active, 
        .gaming-cursor-active body {
          cursor: auto !important;
        }
      }
    `}</style>
  );
};

export default CustomCursor;