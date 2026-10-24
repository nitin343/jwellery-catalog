'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ThreeCanvas from '@/components/ThreeCanvas';
import GoldRateTicker from '@/components/GoldRateTicker';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import WishlistModal from '@/components/WishlistModal';
import GoldCalculatorModal from '@/components/GoldCalculatorModal';
import AdminPanel from '@/components/AdminPanel';
import MobileBottomNav from '@/components/MobileBottomNav';
import StoreFooter from '@/components/StoreFooter';
import {
  Sparkles,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  Home,
  SlidersHorizontal
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function CatalogPage() {
  const { products, activeCategory, searchQuery, sortBy } = useStore();
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 whenever filter, search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const catalogEl = document.getElementById('catalog-grid-top');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Particle Canvas Background */}
      <ThreeCanvas />

      {/* Bullion Ticker */}
      <GoldRateTicker />

      {/* Main Header */}
      <Header />

      {/* Minimal Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-1 flex items-center gap-2 text-[11px] text-neutral-400 font-sans z-10 relative">
        <Link href="/" className="hover:text-brand-goldLight flex items-center gap-1 transition">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-brand-gold font-semibold uppercase tracking-wider font-cinzel">
          Catalog ({filteredProducts.length})
        </span>
      </div>

      {/* Filter / Search Bar */}
      <CategoryFilter />

      {/* Catalog Grid Anchor for Pagination Scrolling */}
      <div id="catalog-grid-top" className="scroll-mt-24" />

      {/* Main Product Showcase Grid with Scroll Animations */}
      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {currentProducts.length > 0 ? (
          <>
            {/* Products Grid: 1 card per row on mobile to hide height mismatch, 2-4 on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-sm sm:max-w-none mx-auto">
              {currentProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="h-full transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-400 font-sans">
                  Showing <span className="text-white font-semibold">{startIndex + 1}</span> –{' '}
                  <span className="text-white font-semibold">{endIndex}</span> of{' '}
                  <span className="text-brand-gold font-semibold">{filteredProducts.length}</span> creations
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none text-white transition active:scale-95"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition active:scale-95 border ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-[#FCE9A6] via-[#D4AF37] to-[#B89028] text-neutral-950 border-brand-gold font-bold shadow-gold'
                          : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none text-white transition active:scale-95"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-neutral-900/60 rounded-2xl border border-white/5 my-6 p-6">
            <PackageSearch className="w-12 h-12 text-brand-gold mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-white mb-1">No designs found matching your search</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try searching with different keywords or switch the category filter to "All".
            </p>
          </div>
        )}
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
