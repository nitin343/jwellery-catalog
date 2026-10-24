'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function CategoryFilter() {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useStore();

  const getCountForCategory = (cat: string) => {
    if (cat === 'All') return products.length;
    if (cat === 'Bridal') return products.filter(p => p.tags && p.tags.includes('Bridal')).length;
    return products.filter(p => p.category === cat).length;
  };

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 pt-4 pb-2 z-10 relative">
      {/* Search Input Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by jewellery design, 22k gold, solitaire, SKU (e.g. JW-NK-801)..."
          className="w-full bg-neutral-900/90 border border-white/10 focus:border-brand-gold/60 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills & Sort dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Horizontal Category scroll pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const count = getCountForCategory(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-brand-gold/20 text-brand-goldLight border border-brand-gold shadow-sm font-semibold'
                    : 'bg-neutral-900/70 border border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-neutral-500 text-[11px] sm:hidden">
            Designs: <strong className="text-neutral-300">{products.length}</strong>
          </span>
          <div className="flex items-center gap-1.5 bg-neutral-900/80 border border-white/10 rounded-lg px-2.5 py-1">
            <SlidersHorizontal className="w-3 h-3 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-neutral-300 text-xs outline-none cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900 text-white">Featured First</option>
              <option value="price-low" className="bg-neutral-900 text-white">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900 text-white">Price: High to Low</option>
              <option value="name" className="bg-neutral-900 text-white">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
