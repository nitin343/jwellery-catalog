'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Calculator, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GoldCalculatorModal() {
  const { profile, formatCurrency, isCalculatorOpen, setIsCalculatorOpen } = useStore();
  const [weight, setWeight] = useState<number>(10);
  const [karat, setKarat] = useState<'22k' | '24k' | '18k'>('22k');
  const [makingPct, setMakingPct] = useState<number>(12);
  const [includeGst, setIncludeGst] = useState<boolean>(true);

  if (!isCalculatorOpen) return null;

  const rates = profile.goldRates;
  const ratePerGram = karat === '24k' ? rates.gold24k : karat === '22k' ? rates.gold22k : rates.gold18k;
  const rawGoldValue = weight * ratePerGram;
  const makingCharges = (rawGoldValue * makingPct) / 100;
  const subtotal = rawGoldValue + makingCharges;
  const gst = includeGst ? (subtotal * 3) / 100 : 0;
  const totalCost = subtotal + gst;

  const handleWhatsAppInquiry = () => {
    const msg = `Hello ${profile.shopName}, I calculated an estimate on your website calculator:\n- Purity: ${karat.toUpperCase()} Gold\n- Weight: ${weight} gms\n- Rate: ${formatCurrency(ratePerGram)}/g\n- Making: ${makingPct}%\n- Estimated Total: ${formatCurrency(totalCost)}\nCould you please confirm today's quotation and store availability?`;
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-brand-gold/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                Live Gold & Jewellery Calculator
              </h3>
              <p className="text-xs text-neutral-400">
                Transparent bullion estimate based on today's official rates
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Karat selection tabs */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">Select Gold Purity</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '22k', label: '22K (91.6% BIS)', rate: rates.gold22k },
              { id: '24k', label: '24K (99.9% Pure)', rate: rates.gold24k },
              { id: '18k', label: '18K (Diamond)', rate: rates.gold18k },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setKarat(tab.id as any)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  karat === tab.id
                    ? 'bg-brand-gold/20 border-brand-gold text-brand-goldLight shadow-sm'
                    : 'bg-neutral-800/60 border-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-semibold">{tab.label}</div>
                <div className="text-[11px] text-white/90 font-medium">{formatCurrency(tab.rate)}/g</div>
              </button>
            ))}
          </div>
        </div>

        {/* Weight input with quick increment pills */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-neutral-300">Net Gold Weight (Grams)</label>
            <div className="flex items-center gap-1.5">
              {[5, 10, 20, 50].map(val => (
                <button
                  key={val}
                  onClick={() => setWeight(val)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition ${
                    weight === val
                      ? 'bg-brand-gold text-neutral-950 font-bold border-brand-gold'
                      : 'bg-neutral-800 border-white/10 text-neutral-300 hover:border-brand-gold/40'
                  }`}
                >
                  {val}g
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.1"
              value={weight}
              onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white text-base font-semibold outline-none transition"
              placeholder="e.g. 14.5"
            />
            <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-medium">grams</span>
          </div>
        </div>

        {/* Making charges & GST options */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Making Charges ({makingPct}%)
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={makingPct}
              onChange={(e) => setMakingPct(parseInt(e.target.value))}
              className="w-full accent-brand-gold"
            />
            <div className="text-[10px] text-neutral-400 text-right">{makingPct}% making</div>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer mt-2 text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={includeGst}
                onChange={(e) => setIncludeGst(e.target.checked)}
                className="w-4 h-4 rounded accent-brand-gold"
              />
              <span>Include 3% Govt. GST</span>
            </label>
          </div>
        </div>

        {/* Calculation Breakdown Receipt Box */}
        <div className="bg-neutral-950/80 border border-brand-gold/20 rounded-xl p-4 mb-4 text-xs space-y-2">
          <div className="flex justify-between text-neutral-400">
            <span>Gold Bullion Cost ({weight}g × {formatCurrency(ratePerGram)})</span>
            <span className="text-white font-medium">{formatCurrency(rawGoldValue)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Artisan Making Charges ({makingPct}%)</span>
            <span className="text-white font-medium">{formatCurrency(makingCharges)}</span>
          </div>
          {includeGst && (
            <div className="flex justify-between text-neutral-400">
              <span>Government GST (3%)</span>
              <span className="text-white font-medium">{formatCurrency(gst)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 flex justify-between items-baseline text-sm font-bold">
            <span className="text-brand-goldLight">Estimated Total Cost:</span>
            <span className="text-lg text-white font-serif tracking-wide">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        {/* WhatsApp Call to action */}
        <div className="flex gap-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 bg-[#25D366] hover:bg-[#1eb956] text-white py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Lock Estimate on WhatsApp</span>
          </button>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="bg-white/10 hover:bg-white/15 text-white py-2.5 px-4 rounded-xl font-medium text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
