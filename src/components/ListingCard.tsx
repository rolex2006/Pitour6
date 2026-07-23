import React from 'react';
import { Listing } from '../types';
import { MapPin, Star, Phone, Bed, Utensils, Heart } from 'lucide-react';

interface ListingCardProps {
  key?: React.Key;
  listing: Listing;
  onBook: (listing: Listing) => void;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export default function ListingCard({ listing, onBook, isOwner, onDelete }: ListingCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-pi-purple/20 hover:shadow-md">
      
      {/* Listing Image with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={listing.image}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
          {listing.type === 'hotel' ? (
            <>
              <Bed className="h-3.5 w-3.5 text-pi-gold" />
              <span>فندق</span>
            </>
          ) : (
            <>
              <Utensils className="h-3.5 w-3.5 text-pi-gold" />
              <span>مطعم</span>
            </>
          )}
        </div>

        {/* Favorite & Owner actions */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isOwner ? (
            <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              إعلانك مجاني
            </div>
          ) : (
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 backdrop-blur-xs transition-all hover:bg-white hover:text-red-500"
            >
              <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Price Tag in Pi */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-pi-dark/90 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-xs">
          <span className="text-pi-gold font-mono">π {listing.price}</span>
          <span className="text-xs font-light text-gray-300">
            {listing.type === 'hotel' ? '/ ليلة' : '/ وجبة'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* City & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-pi-purple" />
            <span className="font-medium text-gray-700">{listing.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-pi-gold text-pi-gold" />
            <span className="font-bold text-gray-800">{listing.rating}</span>
            <span className="text-gray-400">({listing.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2.5 text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-pi-purple">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        {/* Amenities Highlights */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {listing.amenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-pi-purple border border-purple-100"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 border border-gray-100">
              +{listing.amenities.length - 3} إضافي
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          {/* Action button */}
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete && onDelete(listing.id)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                حذف الإعلان
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <a
                href={`tel:${listing.contact}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-pi-purple transition-colors border border-gray-100"
                title="اتصال بالخدمة"
              >
                <Phone className="h-4.5 w-4.5" />
              </a>
              <button
                onClick={() => onBook(listing)}
                className="flex-1 rounded-xl bg-pi-purple py-2.5 text-center text-sm font-bold text-white transition-all hover:bg-pi-purple-hover hover:shadow-md hover:shadow-pi-purple/10 active:scale-[0.98]"
              >
                احجز الآن بعملة Pi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
