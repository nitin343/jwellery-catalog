'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ThreeCanvas from '@/components/ThreeCanvas';
import GoldRateTicker from '@/components/GoldRateTicker';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import WishlistModal from '@/components/WishlistModal';
import GoldCalculatorModal from '@/components/GoldCalculatorModal';
import AdminPanel from '@/components/AdminPanel';
import MobileBottomNav from '@/components/MobileBottomNav';
import StoreFooter from '@/components/StoreFooter';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function HomePage() {
  const { products, activeCategory, searchQuery, sortBy } = useStore();

  // Filter & sort logic
  const filteredProducts = products.filter(item => {
    let matchesCategory = true;
    if (activeCategory === 'Bridal') {
      matchesCategory = !!(item.tags && item.tags.includes('Bridal'));
    } else if (activeCategory !== 'All') {
      matchesCategory = item.category === activeCategory;
    }

    let matchesSearch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const text = `${item.title} ${item.category} ${item.sku} ${item.purity} ${item.description || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      matchesSearch = text.includes(q);
    }

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="relative min-h-screen">
      {/* 3D Particle Canvas Background */}
      <ThreeCanvas />

      {/* Bullion Ticker */}
      <GoldRateTicker />

      {/* Main Header */}
      <Header />

      {/* Hero Showcase */}
      <HeroSection />

      {/* Curated Home Showcase (Shows only a few top masterpieces) */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-goldLight text-[10px] sm:text-xs font-cinzel font-bold tracking-widest uppercase mb-1.5">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>Royal Atelier Highlights</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-cinzel font-bold text-white tracking-[0.06em] uppercase">
              Curated Masterpieces
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Handpicked bridal sets and solitaire creations from our master craftsmen.
            </p>
          </div>

          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#FCE9A6] via-[#D4AF37] to-[#B89028] text-neutral-950 font-cinzel font-bold text-xs tracking-wider px-5 py-2.5 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 uppercase flex-shrink-0"
          >
            <span>View Full Catalog ({products.length})</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Top 4 Curated Products Grid: 1 card per row on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-sm sm:max-w-none mx-auto">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Grand Portal Banner into Complete Catalog */}
        <div className="mt-10 rounded-2xl border border-brand-gold/40 bg-gradient-to-r from-neutral-950 via-[#18201D] to-neutral-950 p-6 sm:p-10 text-center relative overflow-hidden shadow-luxury">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <span className="text-brand-gold text-2xl font-serif mb-2">⚜</span>
            <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white uppercase tracking-wider mb-2">
              Explore Our Full Salon Archive
            </h3>
            <p className="text-xs text-neutral-300 font-sans mb-6 font-light leading-relaxed">
              Browse our complete catalog with dedicated category filtering, live search, and paginated browsing for all {products.length} exclusive BIS 916 gold and certified diamond designs.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2.5 bg-brand-gold text-neutral-950 hover:bg-brand-goldLight font-cinzel font-bold text-xs sm:text-sm tracking-wider px-8 py-3.5 rounded-full shadow-gold-lg transition-all duration-300 hover:scale-105 active:scale-95 uppercase"
            >
              <span>Open Pure Catalog Salon</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Store Footer & Visiting Info */}
      <StoreFooter />

      {/* Interactive Overlays & Modals */}
      <ProductModal />
      <WishlistModal />
      <GoldCalculatorModal />
      <AdminPanel />

      {/* Mobile Ergonomic Bottom Bar */}
      <MobileBottomNav />
    </div>
  );
}
