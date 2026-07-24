import React, { useState } from 'react';
import { Listing, Review } from '../types';
import { CATEGORIES } from '../data';
import { 
  X, Star, MapPin, Phone, Heart, Share2, Calendar, Users, 
  Sparkles, Check, Send, ChevronRight, ChevronLeft, Building, 
  Bed, Utensils, Compass, Car, UserCheck, Plane, Bus, Ship, ShieldCheck 
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (listing: Listing, date: string, guests: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  language: 'ar' | 'en';
}

export default function ListingDetailModal({
  listing,
  isOpen,
  onClose,
  onBook,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  language
}: ListingDetailModalProps) {
  if (!isOpen || !listing) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [guestsCount, setGuestsCount] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
  const listingReviews = reviews.filter(r => r.listingId === listing.id);
  const categoryObj = CATEGORIES.find(c => c.id === listing.type) || CATEGORIES[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    onAddReview({
      listingId: listing.id,
      userName,
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    setShowReviewForm(false);
  };

  const unitText = language === 'en' ? categoryObj.unitEn : categoryObj.unitAr;
  const totalCalculatedPrice = (listing.price * guestsCount).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 md:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-pi-gold/20 text-pi-dark font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-pi-gold" />
              {language === 'en' ? categoryObj.labelEn : categoryObj.labelAr}
            </span>
            <span className="text-xs text-gray-400">• {listing.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200/60 text-gray-600 transition-all cursor-pointer"
              title="مشاركة"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className="p-2 rounded-full hover:bg-gray-200/60 text-gray-600 transition-all cursor-pointer"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Main Gallery */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 group">
            <img
              src={images[activeImageIndex]}
              alt={listing.title}
              className="h-full w-full object-cover transition-all duration-300"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition-all cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-pi-purple scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Info Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                {language === 'en' && listing.titleEn ? listing.titleEn : listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1 font-bold text-gray-800">
                  <MapPin className="h-4 w-4 text-pi-purple" />
                  {language === 'en' && listing.cityEn ? listing.cityEn : listing.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {listing.rating} ({listingReviews.length || listing.reviewsCount} {language === 'en' ? 'reviews' : 'تقييم'})
                </span>
                <span>•</span>
                <a
                  href={`tel:${listing.contact}`}
                  className="flex items-center gap-1 font-semibold text-pi-purple hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{listing.contact}</span>
                </a>
              </div>
            </div>

            <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-100 shrink-0 text-center md:text-left">
              <span className="text-xs text-gray-500 block font-medium">{language === 'en' ? 'Price per unit' : 'سعر الوحدة الحالية'}</span>
              <div className="flex items-baseline justify-center md:justify-end gap-1 mt-0.5">
                <span className="text-2xl font-black text-pi-purple font-mono">π {listing.price}</span>
                <span className="text-xs font-semibold text-gray-500">{unitText}</span>
              </div>
            </div>
          </div>

          {/* Description & Amenities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-gray-900">
                  {language === 'en' ? 'About this Service' : 'عن الخدمة والعرض'}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                  {language === 'en' && listing.descriptionEn ? listing.descriptionEn : listing.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-extrabold text-gray-900">
                  {language === 'en' ? 'Amenities & Features' : 'المميزات والتسهيلات المتاحة'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {listing.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Preview Location */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-extrabold text-gray-900 flex items-center justify-between">
                  <span>{language === 'en' ? 'Location Map' : 'خريطة الموقع والتنقل'}</span>
                  <span className="text-[10px] text-gray-400 font-mono">GPS: {listing.lat || 24.7136}, {listing.lng || 46.6753}</span>
                </h3>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <iframe
                    title="Map Location"
                    className="w-full h-full border-0 filter grayscale-[20%] opacity-90"
                    src={`https://maps.google.com/maps?q=${listing.lat || 24.7136},${listing.lng || 46.6753}&z=14&output=embed`}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">
                    📍 {listing.city}
                  </div>
                </div>
              </div>

            </div>

            {/* Booking Card Box */}
            <div className="lg:col-span-5 bg-gradient-to-b from-purple-50/70 to-white p-5 rounded-3xl border border-purple-100 shadow-sm space-y-4 h-fit">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <span className="text-xs font-bold text-gray-700">{language === 'en' ? 'Direct Pi Booking' : 'الحجز المباشر بالباي'}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {language === 'en' ? 'Instant Confirmation' : 'تأكيد فوري'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-pi-purple" />
                    <span>{language === 'en' ? 'Booking Date' : 'تاريخ الوصول أو الخدمة'}</span>
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-white p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-pi-purple" />
                    <span>{language === 'en' ? 'Quantity / Guests' : 'العدد (الضيوف / الليالي / التذاكر)'}</span>
                  </label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden p-1">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-10 h-9 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-gray-900 font-mono">
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(guestsCount + 1)}
                      className="w-10 h-9 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-100 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>π {listing.price} × {guestsCount}</span>
                    <span>π {totalCalculatedPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{language === 'en' ? 'Platform Fee (0%)' : 'رسوم المنصة على السائح'}</span>
                    <span className="text-emerald-600 font-bold">{language === 'en' ? 'Free (0%)' : 'مجاناً (0%)'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-extrabold text-sm text-gray-900">
                    <span>{language === 'en' ? 'Total Pi Amount:' : 'الإجمالي المطلوب بالباي:'}</span>
                    <span className="text-xl font-mono text-pi-purple font-black">π {totalCalculatedPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onBook(listing, bookingDate, guestsCount);
                    onClose();
                  }}
                  className="w-full bg-pi-gold text-pi-dark hover:bg-pi-gold-hover font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md shadow-pi-gold/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{language === 'en' ? 'Pay Now with Pi Wallet' : 'تأكيد الحجز والدفع بمحفظة Pi'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <h3 className="text-base font-extrabold text-gray-900">
                  {language === 'en' ? 'Ratings & Customer Reviews' : 'تقييمات وآراء العملاء بالسحابة'}
                </h3>
                <span className="text-xs font-bold text-gray-400">({listingReviews.length})</span>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-bold text-pi-purple hover:underline cursor-pointer"
              >
                {showReviewForm 
                  ? (language === 'en' ? 'Cancel Review' : 'إلغاء التقييم') 
                  : (language === 'en' ? '+ Write Review' : '+ اكتب تقييمك الآن')}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {language === 'en' ? 'Your Name' : 'اسمك الكريم'}
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={language === 'en' ? 'e.g. John' : 'مثال: عبد الله السالم'}
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {language === 'en' ? 'Rating' : 'التقييم (1 - 5 نجوم)'}
                    </label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-gray-200 font-bold text-amber-600"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5 ممتاز جداً</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5 جيد جداً</option>
                      <option value={3}>⭐⭐⭐ 3/5 متوسط</option>
                      <option value={2}>⭐⭐ 2/5 سيئ</option>
                      <option value={1}>⭐ 1/5 سيئ جداً</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {language === 'en' ? 'Your Review / Experience' : 'رأيك وتجربتك بالتفصيل'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={language === 'en' ? 'Share your experience...' : 'اكتب انطباعك عن الخدمة وسهولة الحجز بالباي...'}
                    className="w-full text-xs bg-white p-2.5 rounded-xl border border-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-pi-purple text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-pi-purple-hover cursor-pointer"
                >
                  {language === 'en' ? 'Post Review' : 'إرسال التقييم'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {listingReviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">
                {language === 'en' ? 'No reviews yet. Be the first to leave a review!' : 'لا توجد تقييمات مكتوبة بعد لهذا العرض. كن أول من يشارك رأيه!'}
              </p>
            ) : (
              <div className="space-y-3">
                {listingReviews.map((rev) => (
                  <div key={rev.id} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
