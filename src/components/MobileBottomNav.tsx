'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Search, Calculator, Heart, Settings } from 'lucide-react';

export default function MobileBottomNav() {
  const router = useRouter();
  const {
    wishlist,
    setIsWishlistOpen,
    setIsCalculatorOpen,
    setIsAdminAuthOpen,
    setActiveCategory,
  } = useStore();

  const scrollToSearch = () => {
    const searchEl = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchEl) {
      searchEl.focus();
    } else {
      router.push('/catalog');
    }
  };

  const handleCatalogNav = () => {
    setActiveCategory('All');
    router.push('/catalog');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-lg border-t border-brand-gold/30 py-1.5 px-3 flex items-center justify-around sm:hidden shadow-2xl">
      <button
        onClick={handleCatalogNav}
        className="flex flex-col items-center justify-center text-neutral-400 hover:text-brand-goldLight text-[10px] gap-0.5 active:scale-95 transition"
      >
        <ShoppingBag className="w-4 h-4 text-brand-gold" />
        <span>Catalog</span>
      </button>

      <button
        onClick={scrollToSearch}
        className="flex flex-col items-center justify-center text-neutral-400 hover:text-brand-goldLight text-[10px] gap-0.5 active:scale-95 transition"
      >
        <Search className="w-4 h-4 text-neutral-300" />
        <span>Search</span>
      </button>

      <button
        onClick={() => setIsCalculatorOpen(true)}
        className="flex flex-col items-center justify-center text-brand-goldLight text-[10px] gap-0.5 active:scale-95 transition"
      >
        <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-sm">
          <Calculator className="w-3.5 h-3.5" />
        </div>
        <span>Gold Calc</span>
      </button>

      <button
        onClick={() => setIsWishlistOpen(true)}
        className="relative flex flex-col items-center justify-center text-neutral-400 hover:text-brand-goldLight text-[10px] gap-0.5 active:scale-95 transition"
      >
        <Heart className="w-4 h-4 text-neutral-300" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span>Wishlist</span>
      </button>

      <button
        onClick={() => setIsAdminAuthOpen(true)}
        className="flex flex-col items-center justify-center text-neutral-400 hover:text-brand-goldLight text-[10px] gap-0.5 active:scale-95 transition"
      >
        <Settings className="w-4 h-4 text-neutral-400" />
        <span>Admin</span>
      </button>
    </nav>
  );
}
