'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Heart, MessageCircle, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistModal() {
  const {
    profile,
    products,
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    setActiveProductModal,
    formatCurrency
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));
  const totalValue = savedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleInquireAll = () => {
    const listText = savedProducts
      .map((p, idx) => `${idx + 1}. ${p.title} (SKU: ${p.sku}) - ${formatCurrency(p.price)}`)
      .join('\n');
    const msg = `Hello ${profile.shopName}, I have saved ${savedProducts.length} designs in my wishlist:\n\n${listText}\n\nEstimated Total: ${formatCurrency(totalValue)}\n\nPlease let me know if these are in stock for a store trial or video consultation.`;
    const cleanPhone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 border border-brand-gold/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              Saved Wishlist ({savedProducts.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedProducts.length === 0 ? (
          <div className="text-center py-10">
            <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3 stroke-1" />
            <p className="text-sm text-neutral-300 font-medium mb-1">Your wishlist is empty</p>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-5">
              Tap the heart icon on any jewellery piece in the catalog to curate your favorite designs.
            </p>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-goldLight border border-brand-gold/40 text-xs font-semibold px-4 py-2 rounded-full transition"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div>
            {/* List */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 mb-4">
              {savedProducts.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-neutral-950/80 border border-white/5 hover:border-brand-gold/30 p-2.5 rounded-xl transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover cursor-pointer bg-neutral-900"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setActiveProductModal(item);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs font-semibold text-white truncate cursor-pointer hover:text-brand-goldLight"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setActiveProductModal(item);
                      }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-brand-gold font-medium">
                      {formatCurrency(item.price)}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {item.sku} • {item.weight}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-neutral-950/90 border border-brand-gold/20 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Wishlist Value:</span>
              <span className="text-sm font-bold text-white font-sans">{formatCurrency(totalValue)}</span>
            </div>

            {/* Batch Inquiry Button */}
            <button
              onClick={handleInquireAll}
              className="w-full bg-[#25D366] hover:bg-[#1eb956] text-white py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire All on WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
