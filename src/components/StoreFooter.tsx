'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { MapPin, Phone, Clock, Mail, ShieldCheck, Sparkles, RefreshCw, Truck } from 'lucide-react';

export default function StoreFooter() {
  const { profile } = useStore();

  return (
    <footer className="mt-16 border-t border-white/10 bg-neutral-950/90 text-neutral-400 text-xs relative z-10">
      {/* 4 Pillars of Trust */}
      <div className="border-b border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm">100% BIS 916</h4>
              <p className="text-[11px] text-neutral-400">Govt. Certified Hallmarked Gold</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm">Certified Gems</h4>
              <p className="text-[11px] text-neutral-400">IGI & SGL Lab Certified Diamonds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm">Lifetime Exchange</h4>
              <p className="text-[11px] text-neutral-400">100% Transparent Buyback Policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs sm:text-sm">Insured Delivery</h4>
              <p className="text-[11px] text-neutral-400">Secure Direct-to-Door Shipments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Store Information */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-brand-gold text-lg font-serif">⚜</span>
            <span className="font-serif font-bold text-white text-base tracking-wider uppercase">
              {profile.shopName}
            </span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed mb-4">
            {profile.tagline}. Crafting bespoke luxury jewellery, bridal heritage ornaments, and contemporary solitaires with unwavering trust.
          </p>
          <div className="text-[11px] text-brand-gold font-medium">
            Authorized BIS License & Bullion Dealer
          </div>
        </div>

        <div>
          <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase mb-3">
            Flagship Boutique Visit
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <span>{profile.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{profile.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition">
                {profile.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase mb-3">
            Directions & Video Consultation
          </h4>
          <p className="text-xs text-neutral-400 mb-3">
            Experience our private bridal lounge or request a live video showcase with our head gemologist.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={profile.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(profile.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 text-brand-goldLight border border-brand-gold/40 px-3.5 py-1.5 rounded-lg text-xs font-medium transition"
            >
              Get Store Directions →
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 px-4 text-center text-[10px] text-neutral-500">
        © {new Date().getFullYear()} {profile.shopName}. All Rights Reserved. Handcrafted for Local Luxury Retail.
      </div>
    </footer>
  );
}
