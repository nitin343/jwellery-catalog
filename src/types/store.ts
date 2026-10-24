export type ThemeType = 'imperial-gold' | 'rose-gold' | 'royal-emerald' | 'sapphire-platinum' | 'ruby-noir';

export type DiscountTarget = 'making' | 'gold' | 'total';

export interface GoldRates {
  gold24k: number; // per gram in local currency
  gold22k: number;
  gold20k?: number;
  gold18k: number;
  gold14k?: number;
  gold9k?: number;
  silver: number;
  cityMargin?: number; // +/- margin per gram for local city association
  autoRefresh?: boolean; // When true: live API sync active. When false: API stopped/paused for manual rates
  adjustProductPrices?: boolean; // When true: automatically re-adjust all product prices when gold rate changes. When false: freeze catalog prices
  lastUpdated: string;
}

export interface StoreProfile {
  id: string;
  shopName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  currency: string;
  theme: ThemeType;
  adminPin: string;
  instagramUrl: string;
  mapsUrl: string;
  goldRates: GoldRates;
  bannerAnnouncement: string;
  heroBadge?: string;
  heroHeadline?: string; // Line 1
  heroHeadlineHighlight?: string; // Line 2 (Gold gradient emphasis)
  heroSubtitle?: string;
  heroFeaturedProductIds?: string[]; // IDs of products displayed in the 3D showcase carousel
  trustBadge1Title?: string;
  trustBadge1Subtitle?: string;
  trustBadge2Title?: string;
  trustBadge2Subtitle?: string;
  trustBadge3Title?: string;
  trustBadge3Subtitle?: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  weight: string; // Display string (e.g. "48.60 gms")
  goldWeight?: number; // Pure gold weight in grams (used for live bullion calculations)
  otherWeight?: number; // Weight of stones/pearls/enamel in grams
  otherCost?: number; // Additional cost for stones/pearls/diamonds to add in INR
  grossWeight?: string; // Total weight including stones/pearls (auto-calculated: goldWeight + otherWeight)
  makingChargesPct?: number; // Making charges in % (e.g. 12%)
  discountPct?: number; // Optional discount %
  discountTarget?: DiscountTarget; // Where discount applies: 'making' | 'gold' | 'total'
  includeGst?: boolean; // 3% GST included in price
  purity: string; // 24K, 22K, 20K, 18K, 14K, 9K, or Custom
  customPurityPct?: number; // Custom purity percentage if chosen
  sku: string;
  description: string;
  image: string;
  images?: string[];
  isFeatured: boolean;
  inStock: boolean;
  tags: string[];
}
