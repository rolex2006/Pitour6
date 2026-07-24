import React, { useState } from 'react';
import { Listing, CategoryType } from '../types';
import { CATEGORIES } from '../data';
import { MapPin, Star, Building, Sparkles, X, ChevronRight } from 'lucide-react';

interface MapViewComponentProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  language: 'ar' | 'en';
}

export default function MapViewComponent({
  listings,
  onSelectListing,
  language
}: MapViewComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePin, setActivePin] = useState<Listing | null>(listings[0] || null);

  const filtered = listings.filter(l => selectedCategory === 'all' || l.type === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Category filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all' ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
          }`}
        >
          {language === 'en' ? 'All Map Pins' : 'جميع المعالم'} ({listings.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.id ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            {language === 'en' ? cat.labelEn : cat.labelAr}
          </button>
        ))}
      </div>

      {/* Map View Frame */}
      <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-gray-200 bg-slate-900 shadow-md">
        
        {/* Embedded Map iFrame */}
        <iframe
          title="Interactive Tourism Map"
          className="w-full h-full border-0 filter opacity-85 hover:opacity-100 transition-opacity"
          src={`https://maps.google.com/maps?q=${activePin?.lat || 24.7136},${activePin?.lng || 46.6753}&z=12&output=embed`}
          loading="lazy"
        />

        {/* Floating Pins Overlay List */}
        <div className="absolute top-4 right-4 max-w-xs w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 max-h-72 overflow-y-auto space-y-2">
          <span className="text-[11px] font-extrabold text-gray-500 block px-1">
            {language === 'en' ? 'Interactive Locations' : 'المواقع الخريطة المتاحة (' + filtered.length + ')'}
          </span>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActivePin(item)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                activePin?.id === item.id 
                  ? 'bg-purple-50 border-pi-purple shadow-xs' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img src={item.image} alt="thumb" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-0.5">
                    <span>📍 {item.city}</span>
                    <span className="font-bold text-pi-purple font-mono">π {item.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Pin Card Popup at Bottom */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:max-w-md bg-white rounded-2xl p-3.5 shadow-2xl border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <img src={activePin.image} alt="active" className="w-16 h-16 object-cover rounded-xl shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="bg-pi-gold/20 text-pi-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activePin.city}
              </span>
              <h4 className="text-xs font-black text-gray-900 truncate mt-1">{activePin.title}</h4>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="text-pi-purple font-mono font-bold">π {activePin.price}</span>
                <span className="text-amber-500 font-bold flex items-center gap-0.5 text-[10px]">
                  <Star className="h-3 w-3 fill-amber-400" />
                  {activePin.rating}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectListing(activePin)}
              className="bg-pi-purple hover:bg-pi-purple-hover text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              {language === 'en' ? 'View & Book' : 'عرض واحجز'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
