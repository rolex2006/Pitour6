import React from 'react';
import { Listing } from '../types';
import { CATEGORIES } from '../data';
import { 
  MapPin, Star, Phone, Bed, Utensils, Heart, Building, 
  Compass, Car, UserCheck, Plane, Bus, Sparkles, Ship 
} from 'lucide-react';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  onBook: (listing: Listing) => void;
  onSelect: (listing: Listing) => void;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  language?: 'ar' | 'en';
}

export default function ListingCard({
  listing,
  onBook,
  onSelect,
  isOwner,
  onDelete,
  isFavorite,
  onToggleFavorite,
  language = 'ar'
}: ListingCardProps) {

  const categoryObj = CATEGORIES.find(c => c.id === listing.type) || CATEGORIES[0];
  const unitText = language === 'en' ? categoryObj.unitEn : categoryObj.unitAr;
  const categoryLabel = language === 'en' ? categoryObj.labelEn : categoryObj.labelAr;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-pi-purple/30 hover:shadow-lg">
      
      {/* Listing Image with Badges */}
      <div 
        onClick={() => onSelect(listing)} 
        className="relative h-56 w-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          src={listing.image}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-pi-gold" />
          <span>{categoryLabel}</span>
        </div>

        {/* Favorite & Owner badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isOwner ? (
            <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {language === 'en' ? 'Your Free Ad' : 'إعلانك مجاني'}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(listing.id);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-xs transition-all hover:bg-white hover:text-red-500 cursor-pointer shadow-sm"
            >
              <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Price Tag in Pi */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-2xl bg-pi-dark/90 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-xs">
          <span className="text-pi-gold font-mono font-black text-base">π {listing.price}</span>
          <span className="text-xs font-light text-gray-300">{unitText}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        {/* City & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-pi-purple" />
            <span className="font-semibold text-gray-700">
              {language === 'en' && listing.cityEn ? listing.cityEn : listing.city}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800">{listing.rating}</span>
            <span className="text-gray-400">({listing.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(listing)} 
          className="text-base font-extrabold text-gray-900 line-clamp-1 group-hover:text-pi-purple transition-colors cursor-pointer"
        >
          {language === 'en' && listing.titleEn ? listing.titleEn : listing.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {language === 'en' && listing.descriptionEn ? listing.descriptionEn : listing.description}
        </p>

        {/* Amenities Highlights */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-purple-50/70 px-2 py-0.5 text-[11px] font-semibold text-pi-purple border border-purple-100"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="rounded-lg bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-100">
              +{listing.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          {isOwner ? (
            <button
              onClick={() => onDelete && onDelete(listing.id)}
              className="w-full rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              {language === 'en' ? 'Delete Ad' : 'حذف الإعلان'}
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <a
                href={`tel:${listing.contact}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-pi-purple transition-colors border border-gray-100 shrink-0"
                title="اتصال بالمزود"
              >
                <Phone className="h-4 w-4" />
              </a>
              <button
                onClick={() => onSelect(listing)}
                className="flex-1 rounded-xl bg-pi-purple py-2.5 text-center text-xs font-extrabold text-white transition-all hover:bg-pi-purple-hover hover:shadow-md hover:shadow-pi-purple/10 active:scale-[0.98] cursor-pointer"
              >
                {language === 'en' ? 'Book with Pi Wallet' : 'احجز الآن بعملة Pi'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
