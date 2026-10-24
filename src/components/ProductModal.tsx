'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Heart,
  MessageCircle,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductModal() {
  const {
    profile,
    activeProductModal,
    setActiveProductModal,
    wishlist,
    toggleWishlist,
    formatCurrency
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!activeProductModal) return null;
  const product = activeProductModal;
  const isWishlisted = wishlist.includes(product.id);

  // Gallery array
  const imageList = (product.images && product.images.length > 0) ? product.images : [product.image];
  const currentImage = imageList[activeImageIndex] || imageList[0];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);

    if (!isWishlisted) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E29F', '#FFFFFF'],
      });
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hi ${profile.shopName}, I am interested in purchasing "${product.title}" (SKU: ${product.sku}) priced at ${formatCurrency(product.price)}. Could you please share more pictures, video call viewing, or store trial appointment?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} at ${profile.shopName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        setActiveProductModal(null);
        setActiveImageIndex(0);
      }}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 border border-brand-gold/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveProductModal(null);
            setActiveImageIndex(0);
          }}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-neutral-950/80 hover:bg-neutral-950 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Multi-Image Carousel Stage */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-neutral-950 border border-white/10 select-none group">
          <img
            key={activeImageIndex}
            src={currentImage}
            alt={`${product.title} angle ${activeImageIndex + 1}`}
            className="w-full h-full object-cover animate-in fade-in duration-300"
          />

          {/* Left/Right Carousel Nav Arrows */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-neutral-950/80 hover:bg-neutral-950 text-white border border-white/15 flex items-center justify-center transition active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-neutral-950/80 hover:bg-neutral-950 text-white border border-white/15 flex items-center justify-center transition active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Angle Counter Pill */}
              <div className="absolute top-3 left-3 z-20 bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white/90 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                {activeImageIndex + 1} / {imageList.length} Photos
              </div>
            </>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isWishlisted
                ? 'bg-red-600/20 border-red-500 text-red-500 scale-105'
                : 'bg-neutral-950/70 border-white/20 text-white hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Thumbnail Strip for Multi-Image Slider */}
        {imageList.length > 1 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-brand-gold scale-105 shadow-gold'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details Header */}
        <div className="flex items-center justify-between text-xs text-brand-gold font-medium mb-1">
          <span>{product.category} • {product.purity}</span>
          <span className="font-mono text-neutral-400">SKU: {product.sku}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 leading-snug">
          {product.title}
        </h2>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-white font-sans">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-xs text-emerald-400 font-medium bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            ● In Stock & Ready for In-Store Trial
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Spec Table */}
        <div className="bg-neutral-950/80 border border-white/10 rounded-xl p-3 mb-5 text-xs">
          <table className="w-full">
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-1.5 text-neutral-400">Precious Metal</td>
                <td className="py-1.5 text-white font-medium text-right">{product.purity}</td>
              </tr>
              {product.goldWeight !== undefined && product.goldWeight > 0 && (
                <tr>
                  <td className="py-1.5 text-neutral-400">Net Gold Weight</td>
                  <td className="py-1.5 text-brand-gold font-medium text-right">{product.goldWeight} gms</td>
                </tr>
              )}
              {product.otherWeight !== undefined && product.otherWeight > 0 && (
                <tr>
                  <td className="py-1.5 text-neutral-400">Stone / Other Weight</td>
                  <td className="py-1.5 text-neutral-300 font-medium text-right">{product.otherWeight} gms</td>
                </tr>
              )}
              <tr>
                <td className="py-1.5 text-neutral-400">Gross Weight (Total)</td>
                <td className="py-1.5 text-white font-semibold text-right">{product.grossWeight || product.weight}</td>
              </tr>
              {product.otherCost !== undefined && product.otherCost > 0 && (
                <tr>
                  <td className="py-1.5 text-neutral-400">Stone / Embellishment Cost</td>
                  <td className="py-1.5 text-emerald-400 font-medium text-right">+{formatCurrency(product.otherCost)}</td>
                </tr>
              )}
              <tr>
                <td className="py-1.5 text-neutral-400">Hallmarking</td>
                <td className="py-1.5 text-emerald-400 font-medium text-right flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% BIS Hallmarked
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-neutral-400">Store Pickup & Trial</td>
                <td className="py-1.5 text-white text-right">{profile.city} Boutique</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-[#25D366] hover:bg-[#1eb956] text-white py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Direct WhatsApp Order</span>
          </button>

          <a
            href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
            className="bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-xl flex items-center justify-center transition"
            title="Call Showroom"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            onClick={handleShare}
            className="bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-xl flex items-center justify-center transition"
            title="Share Design"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
