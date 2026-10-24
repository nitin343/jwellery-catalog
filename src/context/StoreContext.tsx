'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreProfile, Product, GoldRates, ThemeType } from '@/types/store';
import { INITIAL_STORE_PROFILE, INITIAL_PRODUCTS, SHOP_PRESETS } from '@/data/defaultStore';

interface StoreContextType {
  profile: StoreProfile;
  products: Product[];
  wishlist: string[];
  activeCategory: string;
  searchQuery: string;
  sortBy: string;
  activeProductModal: Product | null;
  categories: string[];
  isWishlistOpen: boolean;
  isCalculatorOpen: boolean;
  isAdminAuthOpen: boolean;
  isAdminPanelOpen: boolean;
  
  // Actions
  setProfile: (profile: StoreProfile) => void;
  updateProfile: (updates: Partial<StoreProfile>) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleWishlist: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setActiveProductModal: (product: Product | null) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsCalculatorOpen: (open: boolean) => void;
  setIsAdminAuthOpen: (open: boolean) => void;
  setIsAdminPanelOpen: (open: boolean) => void;
  updateGoldRates: (rates: Partial<GoldRates>, autoRecalculateCatalog?: boolean) => void;
  fetchLiveMarketRates: (force?: boolean) => Promise<void>;
  recalculateAllProductPrices: (customRates?: GoldRates) => number;
  applyShopPreset: (presetKey: string) => void;
  exportStoreJson: () => void;
  importStoreJson: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  formatCurrency: (amount: number) => string;
  calculateJewelleryPrice: (
    params: {
      goldWeight: number;
      purity: string;
      customPurityPct?: number;
      makingChargesPct: number;
      otherCost?: number;
      discountPct?: number;
      discountTarget?: 'making' | 'gold' | 'total';
      includeGst?: boolean;
    },
    customRates?: GoldRates
  ) => {
    ratePerGram: number;
    rawGoldValue: number;
    makingCharges: number;
    otherCost: number;
    discountAmount: number;
    subtotal: number;
    gstAmount: number;
    finalSellingPrice: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bangles', 'Pendants', 'Bridal'];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<StoreProfile>(INITIAL_STORE_PROFILE);
  const [products, setProductsState] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategoriesState] = useState<string[]>(DEFAULT_CATEGORIES);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('aurora_profile_v2');
      if (savedProfile) setProfileState(JSON.parse(savedProfile));

      const savedProducts = localStorage.getItem('aurora_products_v2');
      if (savedProducts) {
        const parsed: Product[] = JSON.parse(savedProducts);
        // Normalize each product to ensure multi-image array exists
        const normalized = parsed.map(p => ({
          ...p,
          images: (p.images && p.images.length > 0) ? p.images : (INITIAL_PRODUCTS.find(x => x.id === p.id)?.images || [p.image])
        }));
        setProductsState(normalized);
      } else {
        setProductsState(INITIAL_PRODUCTS);
      }

      const savedWishlist = localStorage.getItem('aurora_wishlist_v2');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCategories = localStorage.getItem('aurora_categories_v2');
      if (savedCategories) {
        setCategoriesState(JSON.parse(savedCategories));
      }
    } catch (e) {
      console.error('Error loading stored configuration', e);
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme || 'imperial-gold');
  }, [profile.theme]);

  const addCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      const updated = [...categories, trimmed];
      setCategoriesState(updated);
      localStorage.setItem('aurora_categories_v2', JSON.stringify(updated));
    }
  };

  const deleteCategory = (catToDelete: string) => {
    if (catToDelete === 'All') return;
    const updated = categories.filter(c => c !== catToDelete);
    setCategoriesState(updated);
    localStorage.setItem('aurora_categories_v2', JSON.stringify(updated));
    if (activeCategory === catToDelete) {
      setActiveCategory('All');
    }
  };

  const setProfile = (newProfile: StoreProfile) => {
    setProfileState(newProfile);
    localStorage.setItem('aurora_profile_v2', JSON.stringify(newProfile));
  };

  const updateProfile = (updates: Partial<StoreProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
  };

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
    localStorage.setItem('aurora_products_v2', JSON.stringify(newProducts));
  };

  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
  };

  const toggleWishlist = (id: string) => {
    let nextWishlist: string[];
    if (wishlist.includes(id)) {
      nextWishlist = wishlist.filter(item => item !== id);
    } else {
      nextWishlist = [...wishlist, id];
    }
    setWishlist(nextWishlist);
    localStorage.setItem('aurora_wishlist_v2', JSON.stringify(nextWishlist));
  };

  // Real-world dynamic jewellery price calculator
  const calculateJewelleryPrice = (
    params: {
      goldWeight: number;
      purity: string;
      customPurityPct?: number;
      makingChargesPct: number;
      otherCost?: number;
      discountPct?: number;
      discountTarget?: 'making' | 'gold' | 'total';
      includeGst?: boolean;
    },
    customRates?: GoldRates
  ) => {
    const {
      goldWeight = 0,
      purity = '22K',
      customPurityPct = 91.6,
      makingChargesPct = 0,
      otherCost = 0,
      discountPct = 0,
      discountTarget = 'making',
      includeGst = true,
    } = params;

    const rates = customRates || profile.goldRates;
    let ratePerGram = rates.gold22k;

    if (purity.includes('24K')) ratePerGram = rates.gold24k;
    else if (purity.includes('22K')) ratePerGram = rates.gold22k;
    else if (purity.includes('20K')) ratePerGram = rates.gold20k || Math.round(rates.gold24k * 0.833);
    else if (purity.includes('18K')) ratePerGram = rates.gold18k;
    else if (purity.includes('14K')) ratePerGram = rates.gold14k || Math.round(rates.gold24k * 0.585);
    else if (purity.includes('9K')) ratePerGram = rates.gold9k || Math.round(rates.gold24k * 0.375);
    else if (purity.toLowerCase().includes('custom')) {
      ratePerGram = Math.round(rates.gold24k * (customPurityPct / 100));
    }

    const rawGoldValue = goldWeight * ratePerGram;
    const makingCharges = (rawGoldValue * (makingChargesPct || 0)) / 100;
    const stoneAndOtherCost = otherCost || 0;

    let discountAmount = 0;
    if (discountPct > 0) {
      if (discountTarget === 'making') {
        discountAmount = (makingCharges * discountPct) / 100;
      } else if (discountTarget === 'gold') {
        discountAmount = (rawGoldValue * discountPct) / 100;
      } else if (discountTarget === 'total') {
        discountAmount = ((rawGoldValue + makingCharges + stoneAndOtherCost) * discountPct) / 100;
      }
    }

    const subtotal = Math.max(0, rawGoldValue + makingCharges + stoneAndOtherCost - discountAmount);
    const gstAmount = includeGst ? (subtotal * 3) / 100 : 0;
    const finalSellingPrice = Math.round(subtotal + gstAmount);

    return {
      ratePerGram,
      rawGoldValue,
      makingCharges,
      otherCost: stoneAndOtherCost,
      discountAmount,
      subtotal,
      gstAmount,
      finalSellingPrice,
    };
  };

  const recalculateAllProductPrices = (customRates?: GoldRates): number => {
    const ratesToUse = customRates || profile.goldRates;
    let adjustedCount = 0;

    setProductsState(prevProducts => {
      const updated = prevProducts.map(p => {
        if (!p.goldWeight || p.goldWeight <= 0) return p;

        const calc = calculateJewelleryPrice(
          {
            goldWeight: p.goldWeight,
            purity: p.purity || '22K',
            customPurityPct: p.customPurityPct || 91.6,
            makingChargesPct: p.makingChargesPct ?? 12,
            otherCost: p.otherCost || 0,
            discountPct: p.discountPct || 0,
            discountTarget: p.discountTarget || 'making',
            includeGst: p.includeGst ?? true,
          },
          ratesToUse
        );

        if (calc.finalSellingPrice > 0) {
          adjustedCount++;
          return {
            ...p,
            price: calc.finalSellingPrice,
            originalPrice: calc.discountAmount > 0
              ? Math.round((calc.rawGoldValue + calc.makingCharges + calc.otherCost) * (p.includeGst !== false ? 1.03 : 1))
              : p.originalPrice,
          };
        }
        return p;
      });

      localStorage.setItem('aurora_products_v2', JSON.stringify(updated));
      return updated;
    });

    return adjustedCount;
  };

  const updateGoldRates = (rates: Partial<GoldRates>, autoRecalculateCatalog?: boolean) => {
    const updatedRates: GoldRates = {
      ...profile.goldRates,
      ...rates,
      lastUpdated: rates.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateProfile({ goldRates: updatedRates });

    // Check if auto-adjustment is enabled (default is true unless adjustProductPrices is set to false)
    const shouldAdjust = autoRecalculateCatalog !== undefined
      ? autoRecalculateCatalog
      : updatedRates.adjustProductPrices !== false;

    if (shouldAdjust) {
      recalculateAllProductPrices(updatedRates);
    }
  };

  const fetchLiveMarketRates = async (force: boolean = false) => {
    // If auto-refresh/API sync is stopped (false) and not a force-triggered action, do not call API
    if (!force && profile.goldRates?.autoRefresh === false) {
      return;
    }

    try {
      const res = await fetch('/api/gold-rates');
      if (res.ok) {
        const data = await res.json();
        if (data?.rates) {
          const margin = profile.goldRates.cityMargin || 0;
          updateGoldRates({
            gold24k: data.rates.gold24k + margin,
            gold22k: data.rates.gold22k + Math.round(margin * 0.916),
            gold20k: data.rates.gold20k + Math.round(margin * 0.833),
            gold18k: data.rates.gold18k + Math.round(margin * 0.75),
            gold14k: data.rates.gold14k + Math.round(margin * 0.585),
            gold9k: data.rates.gold9k + Math.round(margin * 0.375),
            silver: data.rates.silver,
            autoRefresh: true, // Mark active when live rates succeed
            lastUpdated: data.rates.lastUpdated || 'Live IBJA Stream',
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Live API fetch error, using fallback calibration', e);
    }

    // Fallback benchmark if server is unreachable
    const base24k = 7880 + (profile.goldRates.cityMargin || 0);
    updateGoldRates({
      gold24k: base24k,
      gold22k: Math.round(base24k * 0.916),
      gold20k: Math.round(base24k * 0.833),
      gold18k: Math.round(base24k * 0.75),
      gold14k: Math.round(base24k * 0.585),
      gold9k: Math.round(base24k * 0.375),
      silver: 96,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  // Auto-fetch live rates on load & recurring hourly check (ONLY when autoRefresh !== false)
  useEffect(() => {
    if (profile.goldRates?.autoRefresh !== false) {
      fetchLiveMarketRates();
    }
    const interval = setInterval(() => {
      if (profile.goldRates?.autoRefresh !== false) {
        fetchLiveMarketRates();
      }
    }, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [profile.goldRates?.cityMargin, profile.goldRates?.autoRefresh]);

  const applyShopPreset = (presetKey: string) => {
    const preset = SHOP_PRESETS[presetKey];
    if (preset) {
      updateProfile(preset.profile);
    }
  };

  const exportStoreJson = () => {
    const bundle = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      profile,
      products
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${profile.shopName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_store_pack.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importStoreJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.products)) setProducts(data.products);
      return true;
    } catch (e) {
      console.error('Failed to parse store backup JSON', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setProfile(INITIAL_STORE_PROFILE);
    setProducts(INITIAL_PRODUCTS);
    setWishlist([]);
    localStorage.removeItem('aurora_profile_v2');
    localStorage.removeItem('aurora_products_v2');
    localStorage.removeItem('aurora_wishlist_v2');
  };

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);
    return `${profile.currency} ${formatted}`;
  };

  return (
    <StoreContext.Provider value={{
      profile,
      products,
      categories,
      wishlist,
      activeCategory,
      searchQuery,
      sortBy,
      activeProductModal,
      isWishlistOpen,
      isCalculatorOpen,
      isAdminAuthOpen,
      isAdminPanelOpen,
      setProfile,
      updateProfile,
      setProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleWishlist,
      addCategory,
      deleteCategory,
      setActiveCategory,
      setSearchQuery,
      setSortBy,
      setActiveProductModal,
      setIsWishlistOpen,
      setIsCalculatorOpen,
      setIsAdminAuthOpen,
      setIsAdminPanelOpen,
      updateGoldRates,
      fetchLiveMarketRates,
      recalculateAllProductPrices,
      applyShopPreset,
      exportStoreJson,
      importStoreJson,
      resetToDefaults,
      formatCurrency,
      calculateJewelleryPrice,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
