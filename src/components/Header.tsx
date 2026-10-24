'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Heart, Search, MessageCircle, Settings, Phone, Sparkles } from 'lucide-react';

export default function Header() {
  const { profile, wishlist, setIsWishlistOpen, setIsAdminAuthOpen, searchQuery, setSearchQuery } = useStore();

  const handleWhatsApp = () => {
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = `Hello ${profile.shopName}, I am visiting your official website catalog and would like to explore your designs.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 rounded-full border border-brand-gold/60 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center text-brand-gold font-serif text-xl shadow-gold flex-shrink-0 group-hover:scale-105 transition-transform">
            ⚜
          </div>
          <div>
            <h1 className="font-cinzel font-bold tracking-[0.14em] text-base sm:text-lg text-white uppercase leading-tight line-clamp-1 group-hover:text-brand-goldLight transition-colors">
              {profile.shopName}
            </h1>
            <p className="text-[10px] font-cinzel tracking-[0.25em] text-brand-gold font-semibold uppercase line-clamp-1">
              {profile.tagline || 'FINE HANDCRAFTED JEWELLERY'}
            </p>
          </div>
        </Link>

        {/* Action icons & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Catalog Nav Pill */}
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-1.5 text-xs font-cinzel font-semibold tracking-wider text-brand-goldLight hover:text-white bg-brand-gold/10 hover:bg-brand-gold/25 border border-brand-gold/40 px-3.5 py-1.5 rounded-full transition shadow-sm uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Catalog Archive</span>
          </Link>
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 flex items-center justify-center text-neutral-300 hover:text-brand-goldLight transition active:scale-95"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-neutral-900 animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Quick WhatsApp Chat */}
          <button
            onClick={handleWhatsApp}
            className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1eb956] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-md active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </button>

          {/* Direct Phone Call */}
          <a
            href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition sm:hidden"
            aria-label="Call Store"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Admin Access Settings Gear */}
          <button
            onClick={() => setIsAdminAuthOpen(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-gold/20 border border-white/10 hover:border-brand-gold/40 flex items-center justify-center text-neutral-400 hover:text-brand-gold transition active:scale-95"
            title="Shop Admin Settings"
            aria-label="Admin Portal"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
