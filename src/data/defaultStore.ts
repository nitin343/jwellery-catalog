import { StoreProfile, Product } from '@/types/store';

export const INITIAL_STORE_PROFILE: StoreProfile = {
  id: 'shop-aurora',
  shopName: 'AURORA HERITAGE JEWELLERS',
  tagline: 'Handcrafted 22K Hallmarked Gold, Uncut Polki & Certified Diamond Heirloom Collections',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'contact@aurorajewellers.com',
  address: 'Shop 14, Royal Palace Market, M.G. Road, Bangalore - 560001',
  city: 'Bangalore',
  openingHours: 'Mon - Sun: 10:30 AM - 8:30 PM',
  currency: '₹',
  theme: 'imperial-gold',
  adminPin: '1234',
  instagramUrl: 'https://instagram.com',
  mapsUrl: 'https://maps.google.com',
  bannerAnnouncement: '✨ Exclusive Festive Showcase: 0% Making Charges on Select Polki & Diamond Sets ✨',
  heroBadge: '✦ ROYAL ATELIER • BESPOKE 2026 ✦',
  heroHeadline: 'PURE GOLD.',
  heroHeadlineHighlight: 'BORN FOR ROYALTY.',
  heroSubtitle: 'Curated 22K BIS Hallmarked pure gold jewellery, uncut Polki chokers, and certified solitaire diamonds with personal in-store and WhatsApp viewing.',
  heroFeaturedProductIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
  trustBadge1Title: '100% BIS 916',
  trustBadge1Subtitle: 'Hallmarked Pure Gold',
  trustBadge2Title: 'LIVE IBJA RATE',
  trustBadge2Subtitle: 'Zero Hidden Markup',
  trustBadge3Title: 'IGI CERTIFIED',
  trustBadge3Subtitle: 'Solitaire Diamonds',
  goldRates: {
    gold24k: 14258,
    gold22k: 13070,
    gold18k: 10694,
    silver: 220,
    autoRefresh: true,
    adjustProductPrices: true,
    lastUpdated: 'Live Market Rate'
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'The Maharani Nizam Polki Choker',
    category: 'Necklaces',
    price: 345000,
    originalPrice: 380000,
    goldWeight: 24,
    otherWeight: 4,
    otherCost: 25000,
    grossWeight: '28.00 gms',
    weight: '28.00 gms',
    purity: '22K BIS 916 Gold',
    makingChargesPct: 12,
    discountPct: 50,
    discountTarget: 'making',
    includeGst: true,
    sku: 'JW-NK-801',
    description: 'Royal uncut Polki diamonds framed in 22K yellow gold with natural Burmese rubies and cascading natural South Sea pearl drops. A generational bridal heirloom.',
    image: '/images/necklace.jpg',
    images: ['/images/necklace.jpg', '/images/earrings.jpg', '/images/ring.jpg'],
    isFeatured: true,
    inStock: true,
    tags: ['Bridal', 'Bestseller', 'Polki', '22K Gold']
  },
  {
    id: 'prod-2',
    title: 'Imperial Solitaire Diamond Ring',
    category: 'Rings',
    price: 185000,
    originalPrice: 210000,
    goldWeight: 3.8,
    otherWeight: 1.0,
    otherCost: 85000,
    grossWeight: '4.80 gms',
    weight: '4.80 gms',
    purity: '18K Rose Gold & Platinum',
    makingChargesPct: 15,
    includeGst: true,
    sku: 'JW-RG-412',
    description: '1.25 Carat brilliant round-cut lab-certified diamond (VVS1 / E-Color) in a micro-pavé 6-prong platinum and 18K rose gold band. Includes IGI certificate.',
    image: '/images/ring.jpg',
    images: ['/images/ring.jpg', '/images/pendant.jpg', '/images/earrings.jpg'],
    isFeatured: true,
    inStock: true,
    tags: ['Solitaire', 'Diamond', 'Certified', 'Engagement']
  },
  {
    id: 'prod-3',
    title: 'Royal Emerald Filigree Jhumkas',
    category: 'Earrings',
    price: 142000,
    originalPrice: 155000,
    goldWeight: 22.5,
    otherWeight: 3.9,
    otherCost: 18000,
    grossWeight: '26.40 gms',
    weight: '26.40 gms',
    purity: '22K BIS 916 Gold',
    makingChargesPct: 14,
    includeGst: true,
    sku: 'JW-ER-305',
    description: 'Exquisite hand-carved Zambian emerald drops surrounded by intricate floral filigree jaali and seed pearls. Features a traditional screw-back clasp.',
    image: '/images/earrings.jpg',
    images: ['/images/earrings.jpg', '/images/necklace.jpg', '/images/bangles.jpg'],
    isFeatured: true,
    inStock: true,
    tags: ['Heritage', 'Emerald', 'Traditional', 'Jhumka']
  },
  {
    id: 'prod-4',
    title: 'Rajwada Handcrafted Floral Kadas',
    category: 'Bangles',
    price: 295000,
    originalPrice: 320000,
    goldWeight: 48.0,
    otherWeight: 4.3,
    otherCost: 15000,
    grossWeight: '52.30 gms',
    weight: '52.30 gms',
    purity: '22K BIS 916 Gold',
    makingChargesPct: 10,
    includeGst: true,
    sku: 'JW-BG-210',
    description: 'Pair of heavy antique-finish 22K gold kadas with embossed floral vines and cabochon ruby inlays. Fitted with a secure hinge-lock mechanism for comfort.',
    image: '/images/bangles.jpg',
    images: ['/images/bangles.jpg', '/images/necklace.jpg', '/images/ring.jpg'],
    isFeatured: true,
    inStock: true,
    tags: ['Antique', 'Pair', 'Bestseller', 'Kada']
  },
  {
    id: 'prod-5',
    title: 'Sapphire Teardrop Halo Pendant',
    category: 'Pendants',
    price: 98000,
    originalPrice: 115000,
    goldWeight: 5.5,
    otherWeight: 1.7,
    otherCost: 35000,
    grossWeight: '7.20 gms',
    weight: '7.20 gms',
    purity: '18K Diamond Gold (75.0%)',
    makingChargesPct: 12,
    includeGst: true,
    sku: 'JW-PD-109',
    description: 'Deep royal blue pear-cut natural Ceylon sapphire accented by a double halo of brilliant micro-cut diamonds on an 18K white gold Italian link chain.',
    image: '/images/pendant.jpg',
    images: ['/images/pendant.jpg', '/images/ring.jpg', '/images/necklace.jpg'],
    isFeatured: true,
    inStock: true,
    tags: ['Sapphire', 'Pendant', 'Modern Luxury']
  }
];

export const SHOP_PRESETS: { [key: string]: { profile: Partial<StoreProfile>; label: string } } = {
  aurora: {
    label: 'Aurora Heritage (Gold, Polki & Diamonds)',
    profile: {
      shopName: 'AURORA HERITAGE JEWELLERS',
      tagline: 'Handcrafted 22K Hallmarked Gold, Uncut Polki & Certified Diamond Heirloom Collections',
      theme: 'imperial-gold',
      bannerAnnouncement: '✨ Exclusive Festive Showcase: 0% Making Charges on Select Polki & Diamond Sets ✨'
    }
  },
  zaveri: {
    label: 'Zaveri & Sons (Antique Rajasthani & Bridal)',
    profile: {
      shopName: 'ZAVERI & SONS GOLDSMITHS',
      tagline: 'Preserving Royal Rajputana & Temple Gold Artistry Since 1952',
      theme: 'royal-emerald',
      bannerAnnouncement: '👑 Royal Bridal Bookings Open: Free Consultation with Master Goldsmiths 👑'
    }
  },
  solitaire: {
    label: 'Luxe Solitaires (Modern Diamonds & Platinum)',
    profile: {
      shopName: 'LUXE SOLITAIRES & FINE GEMS',
      tagline: 'IGI & GIA Certified Solitaires, Contemporary Platinum & Fine Diamonds',
      theme: 'rose-gold',
      bannerAnnouncement: '💎 Certified Solitaire Festival: Complimentary Custom 3D Cad Design 💎'
    }
  }
};

export const CATEGORIES = [
  'All',
  'Necklaces',
  'Rings',
  'Earrings',
  'Bangles',
  'Pendants',
  'Bridal'
];
