'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { ThemeType, Product, DiscountTarget } from '@/types/store';
import { SHOP_PRESETS } from '@/data/defaultStore';
import {
  X,
  Lock,
  Palette,
  Coins,
  Package,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Building,
  Check,
  Tag,
  Calculator,
  Image as ImageIcon,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AdminPanel() {
  const {
    profile,
    updateProfile,
    products,
    categories,
    addCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateGoldRates,
    fetchLiveMarketRates,
    recalculateAllProductPrices,
    calculateJewelleryPrice,
    applyShopPreset,
    exportStoreJson,
    importStoreJson,
    resetToDefaults,
    formatCurrency,
    isAdminAuthOpen,
    setIsAdminAuthOpen,
    isAdminPanelOpen,
    setIsAdminPanelOpen,
  } = useStore();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'brand' | 'rates' | 'catalog' | 'categories' | 'backup'>('overview');
  const [recalculateFeedback, setRecalculateFeedback] = useState<string | null>(null);

  const isApiLive = profile.goldRates.autoRefresh !== false;
  const isAutoAdjustPrices = profile.goldRates.adjustProductPrices !== false;
  
  // Custom Category State
  const [isTypingNewCategory, setIsTypingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Editing Product state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isManualPriceOverride, setIsManualPriceOverride] = useState(false);
  
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'Necklaces',
    purity: '22K BIS 916 Gold',
    customPurityPct: 91.6,
    goldWeight: 24,
    otherWeight: 4,
    otherCost: 0,
    grossWeight: '28.00 gms',
    makingChargesPct: 12,
    discountPct: 0,
    discountTarget: 'making' as DiscountTarget,
    includeGst: true,
    price: 0,
    originalPrice: 0,
    weight: '28.00 gms',
    sku: `JW-${Date.now().toString().slice(-4)}`,
    description: '',
    image: '/images/necklace.jpg',
    images: ['/images/necklace.jpg'],
    tags: ['New Launch']
  });

  // Real-time calculated price preview
  const livePriceCalculation = calculateJewelleryPrice({
    goldWeight: productForm.goldWeight || 0,
    purity: productForm.purity || '22K',
    customPurityPct: productForm.customPurityPct || 91.6,
    makingChargesPct: productForm.makingChargesPct || 0,
    otherCost: productForm.otherCost || 0,
    discountPct: productForm.discountPct || 0,
    discountTarget: (productForm.discountTarget || 'making') as DiscountTarget,
    includeGst: productForm.includeGst ?? true,
  });

  // Automatically sync selling price with live calculation unless manual override is enabled
  useEffect(() => {
    if (!isManualPriceOverride && livePriceCalculation.finalSellingPrice > 0) {
      setProductForm(prev => ({
        ...prev,
        price: livePriceCalculation.finalSellingPrice,
        originalPrice: livePriceCalculation.discountAmount > 0
          ? Math.round((livePriceCalculation.rawGoldValue + livePriceCalculation.makingCharges + livePriceCalculation.otherCost) * (productForm.includeGst ? 1.03 : 1))
          : undefined,
      }));
    }
  }, [
    productForm.goldWeight,
    productForm.otherWeight,
    productForm.otherCost,
    productForm.purity,
    productForm.customPurityPct,
    productForm.makingChargesPct,
    productForm.discountPct,
    productForm.discountTarget,
    productForm.includeGst,
    isManualPriceOverride,
    livePriceCalculation.finalSellingPrice,
    livePriceCalculation.rawGoldValue,
    livePriceCalculation.makingCharges,
    livePriceCalculation.otherCost,
    livePriceCalculation.discountAmount,
  ]);

  // Calculate statistics
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price || 0), 0);

  // 1. PIN Auth Check
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === (profile.adminPin || '1234')) {
      setIsAdminAuthOpen(false);
      setIsAdminPanelOpen(true);
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title) return;

    const mainImage = (productForm.images && productForm.images[0]) || productForm.image || '/images/necklace.jpg';
    const imagesList = (productForm.images && productForm.images.length > 0) ? productForm.images : [mainImage];
    const categoryName = productForm.category?.trim() || 'Necklaces';
    addCategory(categoryName);

    const finalSellingPrice = productForm.price || livePriceCalculation.finalSellingPrice || 10000;
    const grossDisplay = productForm.grossWeight || `${productForm.goldWeight || 0} gms`;

    const productPayload: Product = {
      id: productForm.id || `prod-${Date.now()}`,
      title: productForm.title,
      category: categoryName,
      purity: productForm.purity || '22K BIS 916 Gold',
      customPurityPct: productForm.customPurityPct,
      goldWeight: productForm.goldWeight,
      grossWeight: grossDisplay,
      weight: grossDisplay,
      makingChargesPct: productForm.makingChargesPct,
      discountPct: productForm.discountPct,
      discountTarget: productForm.discountTarget,
      includeGst: productForm.includeGst,
      price: finalSellingPrice,
      originalPrice: productForm.originalPrice,
      sku: productForm.sku || `JW-${Date.now().toString().slice(-4)}`,
      description: productForm.description || '',
      image: mainImage,
      images: imagesList,
      isFeatured: true,
      inStock: true,
      tags: [categoryName, productForm.purity?.split(' ')[0] || 'Gold']
    };

    if (productForm.id) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsEditingProduct(false);
  };

  // Multiple Image files reader for multi-photo slider
  const handleMultipleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let loadedImages: string[] = [];
    let count = 0;

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadedImages.push(event.target.result as string);
        }
        count++;
        if (count === fileList.length) {
          setProductForm(prev => {
            const currentImgs = prev.images || [];
            const merged = [...currentImgs, ...loadedImages];
            return {
              ...prev,
              image: merged[0] || prev.image || '/images/necklace.jpg',
              images: merged,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageFromList = (indexToRemove: number) => {
    setProductForm(prev => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        image: updated[0] || '/images/necklace.jpg',
        images: updated,
      };
    });
  };

  // -------------------------------------------------------------
  // RENDER PIN AUTH MODAL
  // -------------------------------------------------------------
  if (isAdminAuthOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <div className="w-full max-w-sm bg-neutral-900 border border-brand-gold/40 rounded-2xl p-6 shadow-2xl text-center relative">
          <button
            onClick={() => setIsAdminAuthOpen(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold mx-auto flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-serif font-bold text-white mb-1">Store Owner Access</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Enter your Store Security PIN (Default is <strong className="text-brand-goldLight">1234</strong>)
          </p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={8}
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full bg-neutral-950 border border-white/20 focus:border-brand-gold text-center text-2xl tracking-[0.5em] py-2.5 rounded-xl text-white outline-none mb-3"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-400 mb-3">Incorrect PIN. Try 1234</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-brand-goldLight text-neutral-950 font-bold py-2.5 rounded-xl text-xs transition shadow-gold"
            >
              Unlock Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  if (!isAdminPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-neutral-900 border border-brand-gold/40 rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                Store Customizer & Admin Suite
              </h2>
              <p className="text-[11px] text-neutral-400">
                Multi-brand configuration for <span className="text-brand-goldLight font-medium">{profile.shopName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-neutral-950/50 px-4 overflow-x-auto no-scrollbar gap-2 text-xs">
          {[
            { id: 'overview', label: '📊 Metrics & Presets', icon: TrendingUp },
            { id: 'brand', label: '🎨 Brand & Theme', icon: Palette },
            { id: 'rates', label: '💰 Bullion Rates', icon: Coins },
            { id: 'catalog', label: `📦 Catalog (${products.length})`, icon: Package },
            { id: 'categories', label: `🏷️ Categories (${categories.length - 1})`, icon: Tag },
            { id: 'backup', label: '💾 Backup & Deploy', icon: Download },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsEditingProduct(false);
              }}
              className={`py-3 px-3 flex items-center gap-1.5 whitespace-nowrap font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-brand-gold text-brand-goldLight'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: OVERVIEW & ONE-CLICK PRESET SWITCHER */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/10">
                  <div className="text-neutral-400 text-[11px] mb-1">Total Designs</div>
                  <div className="text-xl font-bold text-white">{products.length} Items</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/10">
                  <div className="text-neutral-400 text-[11px] mb-1">Est. Catalog Value</div>
                  <div className="text-xl font-bold text-brand-goldLight">{formatCurrency(totalInventoryValue)}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/10">
                  <div className="text-neutral-400 text-[11px] mb-1">Today's 22K Rate</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(profile.goldRates.gold22k)}/g</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/10">
                  <div className="text-neutral-400 text-[11px] mb-1">WhatsApp Channel</div>
                  <div className="text-xs font-semibold text-emerald-400 truncate mt-1">+{profile.whatsappNumber}</div>
                </div>
              </div>

              {/* Instant 1-Click Shop Preset Switcher for Demos */}
              <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-brand-gold/30 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-brand-gold" />
                  <h3 className="text-sm font-semibold text-white">
                    One-Click Client Demo Switcher (Instant Rebranding)
                  </h3>
                </div>
                <p className="text-neutral-400 text-[11px] mb-4">
                  Presenting to a new jewellery client? Click any preset below to instantly rebrand the site with their theme and style:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(SHOP_PRESETS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => applyShopPreset(key)}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-brand-gold/60 p-3 rounded-xl text-left transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white text-xs mb-1">{val.label}</div>
                        <div className="text-[10px] text-neutral-400 line-clamp-1">{val.profile.shopName}</div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-goldLight font-medium">
                        <span>Apply Brand Preset</span> →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRAND & THEME CUSTOMIZATION */}
          {activeTab === 'brand' && (
            <div className="space-y-5">
              {/* Luxury Color Theme Picker */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-2">
                  Luxury Brand Palette & Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'imperial-gold', label: 'Imperial Gold & Noir', color: '#D4AF37' },
                    { id: 'rose-gold', label: 'Rose Gold & Silk', color: '#E0A899' },
                    { id: 'royal-emerald', label: 'Emerald & Antique', color: '#10B981' },
                    { id: 'sapphire-platinum', label: 'Sapphire & Platinum', color: '#60A5FA' },
                    { id: 'ruby-noir', label: 'Ruby & Charcoal', color: '#EF4444' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => updateProfile({ theme: t.id as ThemeType })}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        profile.theme === t.id
                          ? 'border-white bg-white/10 text-white font-bold'
                          : 'border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-[11px]">{t.label}</span>
                      </div>
                      {profile.theme === t.id && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Store Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Showroom / Brand Name</label>
                  <input
                    type="text"
                    value={profile.shopName}
                    onChange={(e) => updateProfile({ shopName: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => updateProfile({ tagline: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">WhatsApp Phone (Orders Route Here!)</label>
                  <input
                    type="text"
                    value={profile.whatsappNumber}
                    onChange={(e) => updateProfile({ whatsappNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Calling Phone Display</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">Physical Store Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => updateProfile({ address: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Admin Security PIN</label>
                  <input
                    type="password"
                    maxLength={8}
                    value={profile.adminPin}
                    onChange={(e) => updateProfile({ adminPin: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">Top Announcement Banner</label>
                  <input
                    type="text"
                    value={profile.bannerAnnouncement}
                    onChange={(e) => updateProfile({ bannerAnnouncement: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                {/* HERO SECTION CUSTOMIZER */}
                <div className="sm:col-span-2 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      <h4 className="font-serif font-bold text-white text-sm">
                        Hero Section Copy & Advertisement Presence
                      </h4>
                    </div>
                    <span className="text-[10px] text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/30">
                      Live Storefront Sync
                    </span>
                  </div>

                  {/* One-Click High-Jewellery Copy Presets */}
                  <div className="mb-4 bg-neutral-950/70 border border-white/5 p-3 rounded-xl">
                    <div className="text-[10px] text-neutral-400 mb-2 font-medium uppercase tracking-wider">
                      ⚡ Quick One-Click Jewellery Copy Presets:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateProfile({
                          heroBadge: '✦ ROYAL ATELIER • BESPOKE 2026 ✦',
                          heroHeadline: 'PURE GOLD.',
                          heroHeadlineHighlight: 'BORN FOR ROYALTY.',
                          heroSubtitle: 'Curated 22K BIS Hallmarked pure gold jewellery, uncut Polki chokers, and certified solitaire diamonds with personal in-store and WhatsApp viewing.',
                        })}
                        className="text-left p-2 rounded-lg bg-white/[0.03] hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 transition group"
                      >
                        <div className="text-white font-cinzel font-bold text-xs group-hover:text-brand-goldLight">
                          👑 Imperial Gold & Royalty
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          "PURE GOLD. BORN FOR ROYALTY."
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProfile({
                          heroBadge: '💎 SOLITAIRES & CERTIFIED DIAMONDS 💎',
                          heroHeadline: 'ETERNAL DIAMONDS.',
                          heroHeadlineHighlight: 'CRAFTED FOR FOREVER.',
                          heroSubtitle: 'Natural conflict-free solitaires with IGI certification, set in handcrafted 18K white gold and pure platinum bands.',
                        })}
                        className="text-left p-2 rounded-lg bg-white/[0.03] hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 transition group"
                      >
                        <div className="text-white font-cinzel font-bold text-xs group-hover:text-brand-goldLight">
                          💎 Solitaires & Diamond Atelier
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          "ETERNAL DIAMONDS. CRAFTED FOR FOREVER."
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProfile({
                          heroBadge: '🦚 HERITAGE POLKI & JADAU 2026 🦚',
                          heroHeadline: 'TIMELESS HEIRLOOMS.',
                          heroHeadlineHighlight: 'THE BRIDAL LEGACY.',
                          heroSubtitle: 'Imperial Bikaner polki craftsmanship, Columbian emerald chokers, and South Sea pearl necklaces for generational celebration.',
                        })}
                        className="text-left p-2 rounded-lg bg-white/[0.03] hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 transition group"
                      >
                        <div className="text-white font-cinzel font-bold text-xs group-hover:text-brand-goldLight">
                          🦚 Heritage Polki & Bridal Heirloom
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          "TIMELESS HEIRLOOMS. THE BRIDAL LEGACY."
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateProfile({
                          heroBadge: '⚜ TEMPLE GOLDSMITH COLLECTION ⚜',
                          heroHeadline: 'SACRED CRAFTSMANSHIP.',
                          heroHeadlineHighlight: 'PURITY IN EVERY GRAIN.',
                          heroSubtitle: 'Hand-engraved antique temple jewellery and Nakashi bridal sets wrought in 22K hallmarked gold bullion.',
                        })}
                        className="text-left p-2 rounded-lg bg-white/[0.03] hover:bg-brand-gold/15 border border-white/10 hover:border-brand-gold/40 transition group"
                      >
                        <div className="text-white font-cinzel font-bold text-xs group-hover:text-brand-goldLight">
                          ⚜ Sacred Temple & Antique Gold
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          "SACRED CRAFTSMANSHIP. PURITY IN EVERY GRAIN."
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Headline & Badge Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 mb-1">
                        Hero Pill Badge (Top Accent Tag)
                      </label>
                      <input
                        type="text"
                        value={profile.heroBadge || ''}
                        onChange={(e) => updateProfile({ heroBadge: e.target.value })}
                        placeholder="e.g. ✦ ROYAL ATELIER • BESPOKE 2026 ✦"
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none font-cinzel"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Hero Headline (Line 1 - Crisp White)
                      </label>
                      <input
                        type="text"
                        value={profile.heroHeadline || ''}
                        onChange={(e) => updateProfile({ heroHeadline: e.target.value })}
                        placeholder="e.g. PURE GOLD."
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none font-cinzel font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Hero Headline Highlight (Line 2 - Shimmering Gold)
                      </label>
                      <input
                        type="text"
                        value={profile.heroHeadlineHighlight || ''}
                        onChange={(e) => updateProfile({ heroHeadlineHighlight: e.target.value })}
                        placeholder="e.g. BORN FOR ROYALTY."
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-brand-goldLight outline-none font-cinzel font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 mb-1">
                        Hero Subtitle Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={profile.heroSubtitle || ''}
                        onChange={(e) => updateProfile({ heroSubtitle: e.target.value })}
                        placeholder="e.g. Curated 22K BIS Hallmarked pure gold jewellery, uncut Polki chokers, and certified solitaire diamonds..."
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* 3 Pillars of Trust Inputs */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <label className="block text-white font-medium mb-2 text-xs">
                      🛡️ 3 Pillars of Trust Badges (Under Hero Headline)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-brand-gold font-semibold mb-1">Badge 1 (Purity)</div>
                        <input
                          type="text"
                          value={profile.trustBadge1Title || ''}
                          onChange={(e) => updateProfile({ trustBadge1Title: e.target.value })}
                          placeholder="100% BIS 916"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-white text-[11px] font-bold mb-1"
                        />
                        <input
                          type="text"
                          value={profile.trustBadge1Subtitle || ''}
                          onChange={(e) => updateProfile({ trustBadge1Subtitle: e.target.value })}
                          placeholder="Hallmarked Pure Gold"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-neutral-300 text-[10px]"
                        />
                      </div>

                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-emerald-400 font-semibold mb-1">Badge 2 (Rates)</div>
                        <input
                          type="text"
                          value={profile.trustBadge2Title || ''}
                          onChange={(e) => updateProfile({ trustBadge2Title: e.target.value })}
                          placeholder="LIVE IBJA RATE"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-white text-[11px] font-bold mb-1"
                        />
                        <input
                          type="text"
                          value={profile.trustBadge2Subtitle || ''}
                          onChange={(e) => updateProfile({ trustBadge2Subtitle: e.target.value })}
                          placeholder="Zero Hidden Markup"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-neutral-300 text-[10px]"
                        />
                      </div>

                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-brand-gold font-semibold mb-1">Badge 3 (Certification)</div>
                        <input
                          type="text"
                          value={profile.trustBadge3Title || ''}
                          onChange={(e) => updateProfile({ trustBadge3Title: e.target.value })}
                          placeholder="IGI CERTIFIED"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-white text-[11px] font-bold mb-1"
                        />
                        <input
                          type="text"
                          value={profile.trustBadge3Subtitle || ''}
                          onChange={(e) => updateProfile({ trustBadge3Subtitle: e.target.value })}
                          placeholder="Solitaire Diamonds"
                          className="w-full bg-neutral-900 border border-white/10 rounded px-2 py-1 text-neutral-300 text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* HERO 3D CAROUSEL IMAGES & FEATURED PRODUCTS SELECTOR */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-brand-gold" />
                        <h4 className="font-serif font-bold text-white text-sm">
                          3D Carousel Showcase Products (Hero Images)
                        </h4>
                      </div>
                      <span className="text-[11px] text-brand-gold font-semibold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                        {(profile.heroFeaturedProductIds || ['prod-1', 'prod-2', 'prod-3', 'prod-4']).length} in Carousel
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                      Select which products appear in the Hero 3D showcase carousel. Click any product below to toggle it on/off.
                      <br />
                      <span className="text-brand-goldLight">💻 Note:</span> The interactive 3D perspective tilt and light reflection automatically activate on laptops & computers with mouse, while touchscreen mobile devices display an optimized stable card.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 bg-neutral-950/80 rounded-xl border border-white/10">
                      {products.map(prod => {
                        const activeList = profile.heroFeaturedProductIds || ['prod-1', 'prod-2', 'prod-3', 'prod-4'];
                        const isFeatured = activeList.includes(prod.id);
                        return (
                          <div
                            key={prod.id}
                            onClick={() => {
                              let nextList: string[];
                              if (isFeatured) {
                                if (activeList.length <= 1) return; // Keep at least one
                                nextList = activeList.filter(id => id !== prod.id);
                              } else {
                                nextList = [...activeList, prod.id];
                              }
                              updateProfile({ heroFeaturedProductIds: nextList });
                            }}
                            className={`relative rounded-xl overflow-hidden border p-2 cursor-pointer transition flex flex-col justify-between ${
                              isFeatured
                                ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                                : 'border-white/10 bg-neutral-900/60 opacity-60 hover:opacity-100 hover:border-white/30'
                            }`}
                          >
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-1.5 bg-neutral-950">
                              <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                              <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                isFeatured ? 'bg-brand-gold text-neutral-950' : 'bg-neutral-900 text-neutral-500 border border-white/20'
                              }`}>
                                {isFeatured ? '✓' : '+'}
                              </div>
                            </div>
                            <div className="text-[11px] font-semibold text-white line-clamp-1">{prod.title}</div>
                            <div className="flex items-center justify-between text-[10px] text-brand-gold mt-1">
                              <span>{prod.category}</span>
                              <span className="font-bold text-white">{formatCurrency(prod.price)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BULLION RATES MANAGER & LIVE API SYNC */}
          {activeTab === 'rates' && (
            <div className="space-y-5">
                {/* 1. Header Banner & API Status */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isApiLive
                    ? 'bg-neutral-950 border-brand-gold/40'
                    : 'bg-amber-950/20 border-amber-500/40'
                }`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isApiLive ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
                      <h3 className="font-semibold text-white">
                        {isApiLive ? 'Live Bullion Stream (IBJA Indian Benchmark)' : 'Bullion Rates: Manual Mode (API Paused)'}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        isApiLive
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border-amber-500/40'
                      }`}>
                        {isApiLive ? 'API Active' : 'API Stopped'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      {isApiLive ? (
                        <>Official feed via SnapData.dev • Last sync: <strong className="text-brand-goldLight">{profile.goldRates.lastUpdated || 'Active'}</strong></>
                      ) : (
                        <>Live API calls are suspended. Your manually entered rates will not be overwritten.</>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pause / Resume Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isApiLive) {
                          updateGoldRates({ autoRefresh: false });
                        } else {
                          updateGoldRates({ autoRefresh: true });
                          fetchLiveMarketRates(true);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition font-semibold text-xs border active:scale-95 ${
                        isApiLive
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {isApiLive ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Stop API (Manual Mode)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume Live API Sync</span>
                        </>
                      )}
                    </button>

                    {/* Sync Now Button */}
                    <button
                      type="button"
                      onClick={() => fetchLiveMarketRates(true)}
                      className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/20 px-3 py-2 rounded-xl transition font-semibold text-xs active:scale-95"
                      title="Force instant fetch from SnapData IBJA"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Now</span>
                    </button>
                  </div>
                </div>

                {/* Feedback Toast if batch recalculated */}
                {recalculateFeedback && (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{recalculateFeedback}</span>
                    </div>
                    <button onClick={() => setRecalculateFeedback(null)} className="text-emerald-400 hover:text-white text-xs">
                      Dismiss
                    </button>
                  </div>
                )}

                {/* 2. DUAL TOGGLES CARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* TOGGLE 1: AUTO-ADJUST ALL PRODUCT PRICES */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isAutoAdjustPrices
                      ? 'bg-neutral-950 border-brand-gold/40'
                      : 'bg-neutral-950 border-white/10 opacity-90'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-white flex items-center gap-2 cursor-pointer">
                          <span>1. Auto-Adjust Catalog Prices</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => updateGoldRates({ adjustProductPrices: !isAutoAdjustPrices })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            isAutoAdjustPrices ? 'bg-brand-gold' : 'bg-neutral-800'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-neutral-950 font-bold transition-transform ${
                              isAutoAdjustPrices ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isAutoAdjustPrices
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-900 text-neutral-400 border border-white/10'
                        }`}>
                          {isAutoAdjustPrices ? '● Dynamic Repricing ON' : '🔒 Catalog Prices FROZEN (OFF)'}
                        </span>
                      </div>

                      <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                        {isAutoAdjustPrices
                          ? 'When gold rates change (via live API or manual edits), all product prices in your catalog immediately recalculate to reflect the new market price.'
                          : 'Product prices stay locked at their saved values. Modifying or syncing gold rates will NOT alter your existing catalog prices.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const count = recalculateAllProductPrices();
                        setRecalculateFeedback(`Successfully updated ${count} products with current gold rate (22K: ₹${profile.goldRates.gold22k}/g)!`);
                        setTimeout(() => setRecalculateFeedback(null), 4000);
                      }}
                      className="w-full bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-goldLight py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Apply Current Rates to All Products Now</span>
                    </button>
                  </div>

                  {/* TOGGLE 2: LIVE API HOURLY STREAM */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isApiLive
                      ? 'bg-neutral-950 border-emerald-500/30'
                      : 'bg-neutral-950 border-amber-500/30'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-bold text-white flex items-center gap-2 cursor-pointer">
                          <span>2. Live API Background Stream</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (isApiLive) {
                              updateGoldRates({ autoRefresh: false });
                            } else {
                              updateGoldRates({ autoRefresh: true });
                              fetchLiveMarketRates(true);
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            isApiLive ? 'bg-emerald-500' : 'bg-neutral-800'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-neutral-950 font-bold transition-transform ${
                              isApiLive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isApiLive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isApiLive ? '● Live API Sync Active' : '⏸ API Stopped / Manual Custom Mode'}
                        </span>
                      </div>

                      <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                        {isApiLive
                          ? 'Rates update automatically from SnapData.dev (India Bullion & Jewellers Association) on page load and hourly in the background.'
                          : 'No external API calls are made. You can enter custom 24K, 22K, and silver rates below and they will permanently persist.'}
                      </p>
                    </div>

                    <div className="text-[11px] text-neutral-400 bg-neutral-900/80 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                      {isApiLive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>SnapData official IBJA connection is healthy.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>Manual Mode active. Edit any rate box below.</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. CITY MARGIN SETTINGS */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-neutral-200 font-medium text-xs mb-1">
                        City / Local Sarafa Association Margin (+/- ₹ per gram)
                      </label>
                      <p className="text-[11px] text-neutral-400">
                        Adjusts all gold rates to match your local city association (e.g. Mumbai, Chennai, Delhi, Hyderabad).
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-400 text-xs font-semibold">₹</span>
                        <input
                          type="number"
                          value={profile.goldRates.cityMargin || 0}
                          onChange={(e) => updateGoldRates({ cityMargin: parseFloat(e.target.value) || 0 })}
                          placeholder="e.g. +25 or -10"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-brand-gold rounded-lg py-1.5 pl-7 pr-3 text-white text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. REAL-TIME RATES GRID (MANUAL / LIVE) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      {isApiLive ? 'Active Bullion Rates (IBJA + City Margin)' : 'Custom Shop Rates (Manual Input)'}
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {isApiLive ? 'Auto-synced with market' : '✍️ Changes save automatically'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                      <label className="block text-neutral-400 text-xs mb-1">24K Pure Gold (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold24k}
                        onChange={(e) => updateGoldRates({ gold24k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-brand-gold/40 bg-brand-gold/[0.02]">
                      <label className="block text-brand-goldLight font-medium text-xs mb-1">22K BIS 916 (₹/g) *</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold22k}
                        onChange={(e) => updateGoldRates({ gold22k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-brand-gold/50 rounded-lg p-2 text-white font-bold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                      <label className="block text-neutral-400 text-xs mb-1">20K Gold (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold20k || Math.round(profile.goldRates.gold24k * 0.833)}
                        onChange={(e) => updateGoldRates({ gold20k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                      <label className="block text-neutral-400 text-xs mb-1">18K Diamond Gold (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold18k}
                        onChange={(e) => updateGoldRates({ gold18k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                      <label className="block text-neutral-400 text-xs mb-1">14K Daily Wear (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold14k || Math.round(profile.goldRates.gold24k * 0.585)}
                        onChange={(e) => updateGoldRates({ gold14k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                      <label className="block text-neutral-400 text-xs mb-1">9K Modern Luxury (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.gold9k || Math.round(profile.goldRates.gold24k * 0.375)}
                        onChange={(e) => updateGoldRates({ gold9k: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 sm:col-span-2">
                      <label className="block text-neutral-400 text-xs mb-1">Fine Silver (₹/g)</label>
                      <input
                        type="number"
                        value={profile.goldRates.silver}
                        onChange={(e) => updateGoldRates({ silver: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg p-2 text-white font-semibold text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* TAB 4: CATALOG MANAGER & PRACTICAL JEWELLERY FORM */}
          {activeTab === 'catalog' && (
            <div>
              {!isEditingProduct ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Designs in Catalog</h3>
                    <button
                      onClick={() => {
                        const defaultNet = 24;
                        const defaultOther = 4;
                        const defaultGross = `${(defaultNet + defaultOther).toFixed(2)} gms`;
                        setProductForm({
                          title: '',
                          category: 'Necklaces',
                          purity: '22K BIS 916 Gold',
                          customPurityPct: 91.6,
                          goldWeight: defaultNet,
                          otherWeight: defaultOther,
                          otherCost: 0,
                          grossWeight: defaultGross,
                          makingChargesPct: 12,
                          discountPct: 0,
                          discountTarget: 'making',
                          includeGst: true,
                          price: 0,
                          weight: defaultGross,
                          sku: `JW-${Date.now().toString().slice(-4)}`,
                          description: '',
                          image: '/images/necklace.jpg',
                          images: ['/images/necklace.jpg'],
                          tags: ['New Launch']
                        });
                        setIsManualPriceOverride(false);
                        setIsEditingProduct(true);
                      }}
                      className="bg-brand-gold hover:bg-brand-goldLight text-neutral-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Design</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {products.map(p => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 bg-neutral-950 p-2.5 rounded-xl border border-white/5"
                      >
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">{p.title}</h4>
                          <p className="text-[11px] text-brand-gold">{p.category} • {formatCurrency(p.price)}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {p.sku} • {p.weight || `${p.goldWeight}g`} • {p.images?.length || 1} photo(s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const net = p.goldWeight ?? (parseFloat(p.weight) || 20);
                              const other = p.otherWeight ?? 0;
                              const gross = p.grossWeight || p.weight || `${(net + other).toFixed(2)} gms`;
                              setProductForm({
                                ...p,
                                goldWeight: net,
                                otherWeight: other,
                                otherCost: p.otherCost ?? 0,
                                grossWeight: gross,
                                weight: gross,
                              });
                              setIsManualPriceOverride(false);
                              setIsEditingProduct(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ========================================================
                   PRACTICAL JEWELLERY CREATION / EDITING FORM
                   ======================================================== */
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="font-bold text-brand-goldLight text-sm flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-brand-gold" />
                      <span>{productForm.id ? 'Edit Jewellery Piece' : 'Create New Jewellery Design (Auto-Priced)'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* 1. Design Title */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">1. Design Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Polki Choker or 1gm Gold Coin"
                        value={productForm.title || ''}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                      />
                    </div>

                    {/* 2. Category (Unrestricted) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-300 font-medium">2. Category *</label>
                        <button
                          type="button"
                          onClick={() => setIsTypingNewCategory(!isTypingNewCategory)}
                          className="text-[11px] text-brand-gold hover:text-brand-goldLight underline"
                        >
                          {isTypingNewCategory ? '← Pick Existing' : '+ Type Custom Category'}
                        </button>
                      </div>

                      {!isTypingNewCategory ? (
                        <select
                          value={productForm.category || 'Necklaces'}
                          onChange={(e) => {
                            if (e.target.value === '__new__') setIsTypingNewCategory(true);
                            else setProductForm({ ...productForm, category: e.target.value });
                          }}
                          className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                        >
                          {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="__new__" className="text-brand-gold font-bold">+ Type Custom Category...</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="e.g. Mangalsutra, Gold Coins, Silver Kadas..."
                            value={newCategoryName}
                            onChange={(e) => {
                              setNewCategoryName(e.target.value);
                              setProductForm({ ...productForm, category: e.target.value });
                            }}
                            className="flex-1 bg-neutral-950 border border-brand-gold/60 focus:border-brand-gold rounded-lg p-2 text-white outline-none text-xs"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCategoryName.trim()) {
                                addCategory(newCategoryName.trim());
                                setProductForm({ ...productForm, category: newCategoryName.trim() });
                                setIsTypingNewCategory(false);
                                setNewCategoryName('');
                              }
                            }}
                            className="bg-brand-gold text-neutral-950 px-2.5 py-2 rounded-lg font-bold text-xs hover:bg-brand-goldLight"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Precious Metal Purity (24K to 9K + Custom) */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">3. Gold Purity / Karat *</label>
                      <select
                        value={productForm.purity || '22K BIS 916 Gold'}
                        onChange={(e) => setProductForm({ ...productForm, purity: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                      >
                        <option value="24K Pure Gold (99.9%)">24K Pure Gold (99.9% Bullion / Coins)</option>
                        <option value="22K BIS 916 Gold">22K BIS 916 Gold (Standard Bridal)</option>
                        <option value="20K Traditional (83.3%)">20K Traditional Gold (83.3%)</option>
                        <option value="18K Diamond Gold (75.0%)">18K Diamond Gold (75.0% Solitaires)</option>
                        <option value="14K Daily Wear (58.5%)">14K Daily Wear (58.5%)</option>
                        <option value="9K Modern Luxury (37.5%)">9K Modern Luxury (37.5%)</option>
                        <option value="Custom Karat Purity">Custom Karat Purity %</option>
                      </select>

                      {productForm.purity?.includes('Custom') && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <label className="text-neutral-400 text-[11px]">Custom Purity %:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={productForm.customPurityPct || 91.6}
                            onChange={(e) => setProductForm({ ...productForm, customPurityPct: parseFloat(e.target.value) || 0 })}
                            className="w-24 bg-neutral-900 border border-brand-gold/40 rounded px-2 py-1 text-white text-xs outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* 4. Net Gold Weight (gms) */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">
                        4. Net Gold Weight (gms) * <span className="text-[10px] text-brand-gold">(Pure gold metal)</span>
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        required
                        placeholder="e.g. 24.000"
                        value={productForm.goldWeight ?? ''}
                        onChange={(e) => {
                          const net = parseFloat(e.target.value) || 0;
                          const other = productForm.otherWeight || 0;
                          const gross = parseFloat((net + other).toFixed(3));
                          setProductForm(prev => ({
                            ...prev,
                            goldWeight: net,
                            grossWeight: `${gross} gms`,
                            weight: `${gross} gms`,
                          }));
                        }}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white font-semibold outline-none"
                      />
                    </div>

                    {/* 5. Other / Stone Weight (gms) */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">
                        5. Other / Stone Weight (gms) <span className="text-[10px] text-neutral-400">(Stones, Pearls, Polki)</span>
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="e.g. 4.000"
                        value={productForm.otherWeight ?? ''}
                        onChange={(e) => {
                          const other = parseFloat(e.target.value) || 0;
                          const net = productForm.goldWeight || 0;
                          const gross = parseFloat((net + other).toFixed(3));
                          setProductForm(prev => ({
                            ...prev,
                            otherWeight: other,
                            grossWeight: `${gross} gms`,
                            weight: `${gross} gms`,
                          }));
                        }}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white font-semibold outline-none"
                      />
                    </div>

                    {/* 6. Gross Weight (Auto-Calculated) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-neutral-300 font-medium">
                          6. Gross Weight <span className="text-[10px] text-neutral-500">(Total on Scale)</span>
                        </label>
                        <span className="text-[10px] bg-brand-gold/15 text-brand-goldLight border border-brand-gold/30 px-2 py-0.5 rounded-full font-mono">
                          ⚡ Auto: Net + Other
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 28.00 gms"
                        value={productForm.grossWeight || `${((productForm.goldWeight || 0) + (productForm.otherWeight || 0)).toFixed(2)} gms`}
                        onChange={(e) => setProductForm(prev => ({ ...prev, grossWeight: e.target.value, weight: e.target.value }))}
                        className="w-full bg-neutral-950 border border-brand-gold/40 focus:border-brand-gold rounded-lg p-2.5 text-white font-semibold outline-none bg-neutral-950/70"
                      />
                    </div>

                    {/* 7. Other / Stone Cost (₹) */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">
                        7. Other / Stone Cost (₹) <span className="text-[10px] text-emerald-400">(Amount to add)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-neutral-400 font-semibold text-sm">₹</span>
                        <input
                          type="number"
                          step="1"
                          placeholder="e.g. 15000"
                          value={productForm.otherCost ?? ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, otherCost: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 pl-7 text-white font-semibold outline-none"
                        />
                      </div>
                    </div>

                    {/* 8. Making Charges (%) */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">
                        8. Making Charges (%) * <span className="text-[10px] text-neutral-500">(e.g. enter 12 for 12%)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="12"
                          value={productForm.makingChargesPct ?? ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, makingChargesPct: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white font-semibold outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-neutral-400 font-semibold">%</span>
                      </div>
                    </div>

                    {/* 9. Discount (%) - Optional */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">
                        9. Discount (%) <span className="text-[10px] text-neutral-500">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={productForm.discountPct ?? ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, discountPct: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-neutral-400 font-semibold">%</span>
                      </div>
                    </div>

                    {/* 10. Discount Category Target */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">10. Apply Discount On</label>
                      <select
                        value={productForm.discountTarget || 'making'}
                        onChange={(e) => setProductForm(prev => ({ ...prev, discountTarget: e.target.value as DiscountTarget }))}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                      >
                        <option value="making">On Making Charges Only (e.g. 50% Off Making)</option>
                        <option value="gold">On Gold Bullion Value</option>
                        <option value="total">On Total Bill Amount (Gold + Making + Other Cost)</option>
                      </select>
                    </div>

                    {/* 11. GST Option Toggle */}
                    <div className="sm:col-span-2 bg-neutral-950 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-neutral-300 text-xs">
                        <input
                          type="checkbox"
                          checked={productForm.includeGst ?? true}
                          onChange={(e) => setProductForm(prev => ({ ...prev, includeGst: e.target.checked }))}
                          className="w-4 h-4 rounded accent-brand-gold"
                        />
                        <span className="font-medium">11. Include 3% Government GST in Selling Price</span>
                      </label>
                      <span className="text-[11px] text-neutral-500">
                        {productForm.includeGst ? 'GST included (+3%)' : 'GST excluded'}
                      </span>
                    </div>

                    {/* 12. SYSTEM CALCULATED SELLING PRICE BREAKDOWN RECEIPT BOX */}
                    <div className="sm:col-span-2 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-brand-gold/40 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-brand-gold font-bold text-xs uppercase tracking-wider">
                          <Calculator className="w-3.5 h-3.5" />
                          <span>12. System Live Calculated Price Breakdown</span>
                        </div>
                        <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isManualPriceOverride}
                            onChange={(e) => setIsManualPriceOverride(e.target.checked)}
                            className="w-3.5 h-3.5 accent-brand-gold"
                          />
                          <span>Manual Price Override</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs py-2 border-y border-white/10 mb-3">
                        <div>
                          <div className="text-neutral-500 text-[10px]">Bullion ({formatCurrency(livePriceCalculation.ratePerGram)}/g)</div>
                          <div className="font-semibold text-white">{formatCurrency(livePriceCalculation.rawGoldValue)}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-[10px]">Making ({productForm.makingChargesPct || 0}%)</div>
                          <div className="font-semibold text-white">{formatCurrency(livePriceCalculation.makingCharges)}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-[10px]">Other / Stone Cost</div>
                          <div className="font-semibold text-brand-gold">+{formatCurrency(livePriceCalculation.otherCost)}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-[10px]">Discount Applied</div>
                          <div className="font-semibold text-emerald-400">-{formatCurrency(livePriceCalculation.discountAmount)}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-[10px]">GST (3%)</div>
                          <div className="font-semibold text-white">{formatCurrency(livePriceCalculation.gstAmount)}</div>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-neutral-300">Final Auto-Calculated Selling Price:</span>
                        {!isManualPriceOverride ? (
                          <span className="text-xl sm:text-2xl font-bold text-brand-goldLight font-sans">
                            {formatCurrency(livePriceCalculation.finalSellingPrice)}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-neutral-400">₹</span>
                            <input
                              type="number"
                              value={productForm.price || ''}
                              onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              className="w-32 bg-neutral-950 border border-brand-gold rounded px-2 py-1 text-white font-bold text-base outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 11. SKU Reference */}
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">11. SKU Reference Code</label>
                      <input
                        type="text"
                        value={productForm.sku || ''}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white font-mono outline-none"
                      />
                    </div>

                    {/* 12. MULTI-IMAGE SELECTOR (Multi-file upload for slider) */}
                    <div className="sm:col-span-2 bg-neutral-950 p-4 rounded-xl border border-white/10">
                      <label className="block text-neutral-300 font-medium mb-1">
                        12. Multi-Image Carousel Slider Photos <span className="text-[10px] text-neutral-500">(Front, Side, Hallmark, Model Wear)</span>
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mb-3">
                        {/* Multi-file uploader button */}
                        <label className="bg-neutral-900 hover:bg-neutral-800 border border-brand-gold/40 text-brand-goldLight px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold transition">
                          <ImageIcon className="w-4 h-4 text-brand-gold" />
                          <span>Select Multiple Images from Device (Slider)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleMultipleImageFiles}
                            className="hidden"
                          />
                        </label>

                        {/* Preset quick selector */}
                        <select
                          onChange={(e) => {
                            if (e.target.value && e.target.value !== 'custom') {
                              setProductForm(prev => {
                                const current = prev.images || [];
                                if (!current.includes(e.target.value)) {
                                  return { ...prev, image: current[0] || e.target.value, images: [...current, e.target.value] };
                                }
                                return prev;
                              });
                            }
                          }}
                          className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-neutral-300 text-xs outline-none"
                        >
                          <option value="">+ Add Studio Preset Angle...</option>
                          <option value="/images/necklace.jpg">Preset: Royal Polki Choker</option>
                          <option value="/images/ring.jpg">Preset: Diamond Solitaire Ring</option>
                          <option value="/images/earrings.jpg">Preset: Emerald Filigree Jhumkas</option>
                          <option value="/images/bangles.jpg">Preset: Handcrafted Floral Kadas</option>
                          <option value="/images/pendant.jpg">Preset: Sapphire Halo Pendant</option>
                        </select>
                      </div>

                      {/* Selected Image Thumbnails Strip with Delete Controls */}
                      {productForm.images && productForm.images.length > 0 && (
                        <div>
                          <div className="text-[11px] text-neutral-400 mb-2">
                            {productForm.images.length} Image(s) loaded for carousel slider:
                          </div>
                          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                            {productForm.images.map((img, idx) => (
                              <div key={idx} className="relative group/thumb w-16 h-16 rounded-lg overflow-hidden border border-brand-gold/40 flex-shrink-0 bg-neutral-900">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImageFromList(idx)}
                                  className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-80 hover:opacity-100"
                                  title="Remove image"
                                >
                                  &times;
                                </button>
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white font-mono">
                                  #{idx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 13. Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-300 font-medium mb-1">13. Design Description & Specifications</label>
                      <textarea
                        rows={2}
                        placeholder="Handcrafted by master artisans with certified stones, hallmarked bullion, etc."
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 focus:border-brand-gold rounded-lg p-2.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 pt-3">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-gold hover:bg-brand-goldLight text-neutral-950 font-bold py-3 rounded-xl transition text-xs sm:text-sm shadow-gold"
                    >
                      Save Design to Live Catalog
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl transition text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB: UNRESTRICTED CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white mb-1">Store Categories & Navigation</h3>
                <p className="text-neutral-400 text-[11px]">
                  Create unlimited custom categories with zero restrictions. Any category created here immediately appears as a filter pill on the home page.
                </p>
              </div>

              {/* Add New Category Input Box */}
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-brand-gold/30 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Mangalsutra, Silver Kadas, Men's Rings)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-white/10 focus:border-brand-gold rounded-lg px-3 py-2 text-white outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      addCategory(newCategoryName.trim());
                      setNewCategoryName('');
                    }
                  }}
                  className="bg-brand-gold hover:bg-brand-goldLight text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Existing Categories List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {categories.map(cat => {
                  const count = cat === 'All'
                    ? products.length
                    : cat === 'Bridal'
                    ? products.filter(p => p.tags && p.tags.includes('Bridal')).length
                    : products.filter(p => p.category === cat).length;

                  return (
                    <div
                      key={cat}
                      className="bg-neutral-950 border border-white/5 hover:border-brand-gold/40 p-3 rounded-xl flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-brand-gold" />
                        <div>
                          <span className="font-semibold text-white text-xs">{cat}</span>
                          <span className="text-[10px] text-neutral-500 block">({count} items)</span>
                        </div>
                      </div>

                      {cat !== 'All' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete category "${cat}"? Products in this category will remain safe in catalog.`)) {
                              deleteCategory(cat);
                            }
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & MULTI-SHOP DEPLOY */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-1">Export / Import Client Configuration</h3>
                <p className="text-neutral-400 text-[11px] mb-4">
                  Easily replicate this software for other local shops in 1 second by exporting their pack or importing a template.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={exportStoreJson}
                  className="bg-neutral-950 hover:bg-neutral-800 border border-brand-gold/40 p-4 rounded-xl text-left flex items-start gap-3 transition"
                >
                  <Download className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Download Store Data (JSON)</div>
                    <div className="text-[10px] text-neutral-400">Save complete profile, rates, and catalog as portable backup.</div>
                  </div>
                </button>

                <label className="bg-neutral-950 hover:bg-neutral-800 border border-white/10 p-4 rounded-xl text-left flex items-start gap-3 transition cursor-pointer">
                  <Upload className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Upload Client Pack (JSON)</div>
                    <div className="text-[10px] text-neutral-400">Instant one-click setup from a pre-made file.</div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const res = importStoreJson(evt.target?.result as string);
                          if (res) alert('Store configuration restored successfully!');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('Reset store back to factory sample defaults?')) {
                      resetToDefaults();
                    }
                  }}
                  className="text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs"
                >
                  Reset to Original Sample Data
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
