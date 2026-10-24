'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Eye,
  Flame,
  Scale
} from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const { profile, products, setActiveProductModal, formatCurrency } = useStore();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Touch vs Laptop / PC mouse pointer detection
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Mobile Touch Swipe & 3D Interactive Animation State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    // Only enable mouse tilt if primary input is fine pointer (mouse/trackpad on computer/laptop)
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints > 0);
    setIsTouchDevice(!hasFinePointer || (isTouch && window.innerWidth < 1024));
  }, []);

  // 3D Tilt & Specular Light tracking
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Admin-selected carousel products from store profile, fallback to first 4 products
  const featuredItems = useMemo(() => {
    if (profile.heroFeaturedProductIds && profile.heroFeaturedProductIds.length > 0) {
      const selected = profile.heroFeaturedProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is typeof products[0] => Boolean(p));
      if (selected.length > 0) return selected;
    }
    return products.slice(0, 4);
  }, [profile.heroFeaturedProductIds, products]);

  // Auto-cycle through items every 6 seconds unless user is interacting
  useEffect(() => {
    if (featuredItems.length <= 1 || isHovered || isSwiping) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % featuredItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredItems.length, isHovered, isSwiping]);

  const activeItem = featuredItems[activeHeroIndex] || products[0];

  // 3D Parallax Tilt Handler (FOR LAPTOP / COMPUTER WITH MOUSE)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.45
    });
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  // 3D TOUCH SWIPE HANDLERS (SPECIALLY CRAFTED FOR MOBILE DEVICES)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    const clampedDiff = Math.max(-90, Math.min(90, diff));
    setTouchDeltaX(clampedDiff);
  };

  const handleTouchEnd = () => {
    if (touchDeltaX < -35) {
      // Swiped left -> next 3D piece
      setActiveHeroIndex((prev) => (prev + 1) % featuredItems.length);
    } else if (touchDeltaX > 35) {
      // Swiped right -> prev 3D piece
      setActiveHeroIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsSwiping(false);
  };

  const handleWhatsAppConsultation = () => {
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hi ${profile.shopName}, I would like to book a private VIP jewellery viewing or video consultation for ${activeItem?.title || 'your collection'}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExploreCatalog = () => {
    router.push('/catalog');
  };

  return (
    <section className="relative px-3 sm:px-6 pt-4 sm:pt-6 pb-4 max-w-7xl mx-auto z-10">
      {/* Outer Shell with Deep Luxury Glass & Gold Mesh Accent */}
      <div className="relative rounded-3xl border border-brand-gold/30 bg-gradient-to-br from-[#121614]/95 via-[#0c100e]/95 to-neutral-950 p-6 sm:p-12 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        
        {/* Background Ambient Glows & 3D Lighting Mesh */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-brand-gold/20 via-amber-500/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-emerald-600/15 via-brand-gold/10 to-transparent blur-[120px] pointer-events-none" />
        
        {/* Subtle Luxury Geometric Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================
              LEFT COLUMN: PUNCHY LUXURY ADVERTISEMENT EDITORIAL
             ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* 3D Holographic Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-goldLight text-[11px] sm:text-xs font-cinzel font-bold tracking-[0.2em] uppercase mb-5 shadow-gold backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span>{profile.heroBadge || '✦ ROYAL ATELIER • BESPOKE 2026 ✦'}</span>
            </div>

            {/* High-Impact Headline: Royal Roman Lapidary Jewellery Typography */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-cinzel font-bold text-white tracking-[0.12em] sm:tracking-[0.15em] leading-[1.18] mb-5 uppercase">
              {profile.heroHeadline || 'PURE GOLD.'}
              {profile.heroHeadlineHighlight !== undefined && profile.heroHeadlineHighlight !== '' ? (
                <>
                  <br />
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E5BF55] to-[#B88E28] drop-shadow-[0_4px_28px_rgba(212,175,55,0.45)]">
                    {profile.heroHeadlineHighlight}
                  </span>
                </>
              ) : null}
            </h1>

            {/* Crisp 1-Line Subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 font-sans tracking-wide leading-relaxed mb-8 max-w-lg font-light">
              {profile.heroSubtitle || 'Curated 22K BIS Hallmarked pure gold jewellery, uncut Polki chokers, and certified solitaire diamonds with personal in-store and WhatsApp viewing.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
              <button
                onClick={handleExploreCatalog}
                className="flex-1 sm:flex-none group relative overflow-hidden bg-gradient-to-r from-[#FCE9A6] via-[#D4AF37] to-[#B89028] text-neutral-950 font-cinzel font-bold tracking-wider px-7 py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer uppercase"
              >
                {/* Button Light Shimmer Streak */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleWhatsAppConsultation}
                className="flex-1 sm:flex-none bg-neutral-900/80 hover:bg-neutral-800 text-white border border-brand-gold/40 hover:border-brand-gold font-cinzel font-semibold tracking-wider px-6 py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition backdrop-blur-md active:scale-95 shadow-sm uppercase"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Private VIP Viewing</span>
              </button>
            </div>

            {/* 3 Pillars of Trust (Responsive Micro Glass Badges) */}
            <div className="w-full pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-neutral-300">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-2.5 flex flex-row sm:flex-col lg:flex-row items-center sm:items-start lg:items-center gap-3 sm:gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <div>
                  <div className="text-white font-cinzel font-bold text-xs tracking-wider">
                    {profile.trustBadge1Title || '100% BIS 916'}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {profile.trustBadge1Subtitle || 'Hallmarked Pure Gold'}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-2.5 flex flex-row sm:flex-col lg:flex-row items-center sm:items-start lg:items-center gap-3 sm:gap-2 text-left">
                <Scale className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-cinzel font-bold text-xs tracking-wider">
                    {profile.trustBadge2Title || 'LIVE IBJA RATE'}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {profile.trustBadge2Subtitle || 'Zero Hidden Markup'}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-2.5 flex flex-row sm:flex-col lg:flex-row items-center sm:items-start lg:items-center gap-3 sm:gap-2 text-left">
                <Award className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <div>
                  <div className="text-white font-cinzel font-bold text-xs tracking-wider">
                    {profile.trustBadge3Title || 'IGI CERTIFIED'}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {profile.trustBadge3Subtitle || 'Solitaire Diamonds'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: INTERACTIVE 3D LUXURY SHOWCASE STAGE
             ======================================================== */}
          {activeItem && (
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Mobile 3D Swipe Hint */}
              <div className="sm:hidden flex items-center justify-center gap-1.5 text-[10px] text-brand-gold font-cinzel tracking-wider uppercase mb-2">
                <span>✦ Swipe 3D Piece ⇆ ✦</span>
              </div>

              {/* 3D Perspective Stage Container */}
              <div
                style={{ perspective: '1200px' }}
                className="w-full flex justify-center"
              >
                <div
                  ref={cardRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setActiveProductModal(activeItem)}
                  style={{
                    transform: isTouchDevice
                      ? `rotateY(${touchDeltaX * 0.22}deg) scale(${isSwiping ? 0.97 : 1})`
                      : isHovered
                        ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1)`
                        : 'none',
                    transformStyle: 'preserve-3d',
                    transition: isSwiping ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  className="group relative w-full aspect-square max-w-[380px] rounded-3xl overflow-hidden border-2 border-brand-gold/50 bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-[0_30px_70px_-15px_rgba(212,175,55,0.35)] cursor-pointer select-none touch-pan-y"
                >
                  
                  {/* Dynamic Specular Light Glare (ONLY ON LAPTOP / DESKTOP WITH MOUSE) */}
                  {!isTouchDevice && (
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 mix-blend-screen"
                      style={{
                        opacity: glarePos.opacity,
                        background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0.4) 35%, transparent 70%)`
                      }}
                    />
                  )}

                  {/* 3D Showcase Jewellery Image */}
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* 3D Floating Chip 1: Purity & Live Benchmark (Top-Right Depth Tag) */}
                  <div
                    style={{ transform: !isTouchDevice ? 'translateZ(40px)' : 'none' }}
                    className="absolute top-3.5 right-3.5 z-20 bg-neutral-950/85 backdrop-blur-md border border-brand-gold/60 text-brand-goldLight px-3 py-1.5 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{activeItem.purity || '22K BIS 916'}</span>
                  </div>

                  {/* 3D Floating Chip 2: Quick Inspect Button (Center on hover - Desktop only) */}
                  {!isTouchDevice && (
                    <div
                      style={{ transform: 'translateZ(55px)' }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                    >
                      <div className="bg-brand-gold text-neutral-950 px-4 py-2 rounded-full font-cinzel font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-2xl scale-95 group-hover:scale-100 transition-transform uppercase">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect 3D Piece</span>
                      </div>
                    </div>
                  )}

                  {/* Glassmorphic Lower Overlay with Title & Dynamic Price */}
                  <div 
                    style={{ transform: !isTouchDevice ? 'translateZ(25px)' : 'none' }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent p-5 pt-12 flex flex-col justify-end z-20"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-gold font-cinzel font-semibold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Masterpiece Feature • {activeItem.category}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-cinzel font-bold text-white leading-snug mb-2 group-hover:text-brand-goldLight transition line-clamp-1 tracking-wide">
                      {activeItem.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400">Live Auto-Calculated Price</span>
                        <span className="text-lg sm:text-xl font-extrabold text-white font-sans tracking-tight">
                          {formatCurrency(activeItem.price)}
                        </span>
                      </div>

                      <span className="text-xs text-brand-goldLight flex items-center gap-1 bg-brand-gold/15 hover:bg-brand-gold/30 border border-brand-gold/40 px-3 py-1.5 rounded-full backdrop-blur-md font-semibold transition">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Pedestal Interactive Thumbnails */}
              <div className="flex items-center justify-center gap-2.5 mt-4">
                {featuredItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeHeroIndex === idx
                        ? 'border-brand-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                        : 'border-white/10 opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                    title={item.title}
                  >
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
