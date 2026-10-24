'use client';

import React, { useRef, useState } from 'react';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { Heart, MessageCircle, Eye, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductCard({ product }: { product: Product }) {
  const { profile, wishlist, toggleWishlist, setActiveProductModal, formatCurrency } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Gallery images support (falls back to [product.image] if images array empty)
  const imageList = (product.images && product.images.length > 0) ? product.images : [product.image];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Mouse position for Apple-style dynamic radial spotlight
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);

    // If adding to wishlist, trigger elegant gold confetti burst
    if (!isWishlisted) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 22,
        spread: 45,
        origin: { x, y },
        colors: ['#D4AF37', '#F5E29F', '#FFFFFF', '#E6CA65'],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.8,
        shapes: ['circle'],
        disableForReducedMotion: true,
      });
    }
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hi ${profile.shopName}, I want to order / inquire about: "${product.title}" (SKU: ${product.sku}) listed at ${formatCurrency(product.price)}. Please share availability and current store viewing options.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      onClick={() => setActiveProductModal(product)}
      className="group relative rounded-2xl p-[1px] transition-all duration-500 ease-out cursor-pointer select-none w-full h-full flex flex-col"
      style={{
        background: isHovered
          ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.45), rgba(255, 255, 255, 0.05) 40%, transparent 80%)`
          : 'rgba(255, 255, 255, 0.07)',
      }}
    >
      {/* Inner Card Surface with Apple-style Matte Glass */}
      <div className="relative rounded-[15px] bg-[#121614]/95 backdrop-blur-xl overflow-hidden flex flex-col h-full w-full border border-white/5 group-hover:border-transparent transition-all duration-500">
        
        {/* Subtle interior spotlight sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.08), transparent 70%)`,
          }}
        />

        {/* Product Image Carousel Stage */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
          <img
            key={currentImgIndex}
            src={imageList[currentImgIndex]}
            alt={`${product.title} angle ${currentImgIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106 animate-in fade-in"
            loading="lazy"
          />

          {/* Navigation Arrows for Multi-Image Items */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-neutral-950/70 hover:bg-neutral-950 text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                aria-label="Previous angle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-neutral-950/70 hover:bg-neutral-950 text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                aria-label="Next angle"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-2 left-0 right-0 z-20 flex items-center justify-center gap-1 pointer-events-none">
                {imageList.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      currentImgIndex === idx
                        ? 'w-4 bg-brand-gold shadow-sm'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Tag Pill */}
          {product.tags && product.tags[0] && (
            <div className="absolute top-2.5 left-2.5 z-20">
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-brand-gold/40 text-brand-goldLight text-[10px] font-cinzel font-bold tracking-widest uppercase shadow-md">
                {product.tags[0]}
              </span>
            </div>
          )}

          {/* Tactile Wishlist Heart Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 active:scale-75 ${
              isWishlisted
                ? 'bg-red-500/20 border-red-500/80 text-red-400 shadow-md scale-105'
                : 'bg-neutral-950/60 border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:scale-110'
            }`}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${
                isWishlisted ? 'fill-current text-red-500' : ''
              }`}
            />
          </button>

          {/* Quick View Floating Pill on Hover */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
            <span className="bg-neutral-950/90 text-brand-goldLight border border-brand-gold/40 text-[11px] font-cinzel font-semibold tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xl backdrop-blur-md uppercase">
              <Eye className="w-3 h-3" /> Quick View
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 relative z-10">
          {/* Karat purity & Weight */}
          <div className="flex items-center justify-between text-[11px] font-medium text-brand-gold mb-1.5">
            <span className="font-cinzel text-[10px] tracking-wider uppercase font-semibold">{product.purity || '22K BIS Hallmarked'}</span>
            <span className="text-neutral-400 text-[10px] font-mono">{product.weight}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-brand-goldLight transition-colors line-clamp-2 leading-snug mb-1.5 tracking-wide min-h-[2.5rem] flex items-center">
            {product.title}
          </h3>

          {/* SKU Reference */}
          <div className="text-[10px] text-neutral-500 font-mono mb-3">
            SKU: {product.sku}
          </div>

          {/* Price & Savings */}
          <div className="mt-auto pt-2 border-t border-white/5 flex items-baseline gap-2 flex-wrap mb-3 min-h-[1.75rem]">
            <span className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-neutral-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Tactile WhatsApp Order Button */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-neutral-950 border border-[#25D366]/35 hover:border-[#25D366] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95 group/btn"
          >
            <MessageCircle className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Order on WhatsApp</span>
            <ArrowUpRight className="w-3 h-3 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
