'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Calculator, TrendingUp, Sparkles } from 'lucide-react';

export default function GoldRateTicker() {
  const { profile, formatCurrency, setIsCalculatorOpen } = useStore();
  const rates = profile.goldRates;

  return (
    <div className="w-full bg-gradient-to-r from-neutral-950 via-[#181d19] to-neutral-950 border-b border-brand-gold/20 py-1.5 px-3 text-xs text-brand-goldLight select-none z-30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Live ticker badges */}
        <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full inline-block ${rates.autoRefresh !== false ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
            <span className={`text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded ${
              rates.autoRefresh !== false
                ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/80 border border-amber-500/30 text-amber-300'
            }`}>
              {rates.autoRefresh !== false ? 'Live Bullion' : "Today's Rate"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">22K Gold:</span>
            <strong className="text-white font-semibold">{formatCurrency(rates.gold22k)}/g</strong>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-neutral-400">24K Pure:</span>
            <strong className="text-white font-semibold">{formatCurrency(rates.gold24k)}/g</strong>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-neutral-400">18K Hallmarked:</span>
            <strong className="text-white font-semibold">{formatCurrency(rates.gold18k)}/g</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Silver (Fine):</span>
            <strong className="text-white font-semibold">{formatCurrency(rates.silver)}/g</strong>
          </div>
        </div>

        {/* Right: Gold Price Calculator Trigger */}
        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="flex items-center gap-1.5 bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-goldLight border border-brand-gold/40 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-sm flex-shrink-0 cursor-pointer active:scale-95"
        >
          <Calculator className="w-3 h-3 text-brand-gold" />
          <span>Rate Calculator</span>
        </button>
      </div>
    </div>
  );
}
