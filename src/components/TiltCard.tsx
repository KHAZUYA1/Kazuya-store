import React, { useRef, useState, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = "" }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // --- SENSOR DETEKSI LAYAR ---
  useEffect(() => {
    // Fungsi pengecekan
    const checkMobile = () => {
        // Jika layar < 768px (HP/Tablet Portrait), matikan efeknya
        if (window.innerWidth < 768) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    };

    checkMobile(); // Cek saat pertama load
    window.addEventListener('resize', checkMobile); // Cek saat layar diputar/ubah ukuran
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- JIKA DI HP (DISABLED) ---
  // Langsung kembalikan div polos tanpa Event Listener & Rumus 3D
  if (disabled) {
      return <div className={className}>{children}</div>;
  }

  // --- JIKA DI DESKTOP ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25; 
    const y = (e.clientY - top - height / 2) / 25; 
    setRotate({ x: -y, y: x });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setRotate({ x: 0, y: 0 }); }}
      className={`transition-transform duration-200 ease-out relative ${className}`}
      style={{
        transform: isHovering 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare effect (Kilatan Cahaya) */}
      {isHovering && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-40 mix-blend-overlay"
          style={{ transform: `translateX(${rotate.y * 1.5}px) translateY(${rotate.x * 1.5}px)` }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;