import React, { useState } from 'react';
import { Listing, CategoryType } from '../types';
import { CATEGORIES, PRESET_IMAGES } from '../data';
import { X, Plus, Sparkles, Building, Image as ImageIcon, MapPin, Phone, ShieldCheck, Check } from 'lucide-react';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: Listing) => void;
  language?: 'ar' | 'en';
}

export default function AddAdModal({
  isOpen,
  onClose,
  onAddListing,
  language = 'ar'
}: AddAdModalProps) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [type, setType] = useState<CategoryType>('hotel');
  const [city, setCity] = useState('الرياض');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [amenitiesText, setAmenitiesText] = useState('إنترنت مجاني, مواقف سيارات, خدمة 24/7');
  const [ownerName, setOwnerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description || !contact) return;

    const amenitiesList = amenitiesText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const newListing: Listing = {
      id: 'ad_' + Date.now(),
      title,
      titleEn: titleEn || title,
      type,
      city,
      price: parseFloat(price) || 1.0,
      rating: 5.0, // New listing gets default 5 stars
      image: imageUrl || PRESET_IMAGES[0].url,
      images: [imageUrl || PRESET_IMAGES[0].url],
      description,
      descriptionEn: description,
      amenities: amenitiesList.length > 0 ? amenitiesList : ['خدمات متكاملة'],
      contact,
      reviewsCount: 0,
      isCustom: true,
      isFeatured: false,
      status: 'approved',
      isActive: true,
      lat: 24.7136,
      lng: 46.6753,
      ownerName: ownerName || 'صاحب الخدمة',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddListing(newListing);
    onClose();

    // Reset Form
    setTitle('');
    setTitleEn('');
    setPrice('');
    setDescription('');
    setContact('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 md:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-purple-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pi-gold text-pi-dark rounded-xl">
              <Plus className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                {language === 'en' ? 'Publish Free Tourism Ad' : 'نشر إعلان مجاني جديد على المنصة'}
              </h2>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <Check className="h-3 w-3" />
                {language === 'en' ? '100% Free - Zero listing fees' : 'مجاني 100% بدون أي عمولات نشر أو اشتراك'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 md:p-6 space-y-4 text-xs">
          
          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-800 block">
              {language === 'en' ? 'Select Category' : 'اختر تصنيف الخدمة السياحية'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setType(cat.id)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    type === cat.id 
                      ? 'bg-pi-purple text-white border-pi-purple shadow-xs' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {language === 'en' ? cat.labelEn : cat.labelAr}
                </button>
              ))}
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'Service Title (Arabic)' : 'اسم الخدمة أو الفندق/المطعم (بالعربية)'} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: فندق قصر اليمامة الفاخر"
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'Service Title (English)' : 'اسم الخدمة (بالإنجليزية - اختياري)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Al Yamama Palace Hotel"
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple"
              />
            </div>
          </div>

          {/* City & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'City / Location' : 'المدينة أو المنطقة'} *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="الرياض / جدة / دبي / مراكش..."
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'Price in Pi Coin (π)' : 'السعر المطلوبة بعملة باي (π)'} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثال: 5.5"
                  className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-mono font-bold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-pi-purple font-mono">π</span>
              </div>
            </div>
          </div>

          {/* Contact & Owner Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'Phone / WhatsApp' : 'رقم الواتساب أو الهاتف للتنسيق'} *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+966 50 000 0000"
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                {language === 'en' ? 'Owner / Business Name' : 'اسم صاحب الإعلان أو المنشأة'}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="مثال: شركة النخيل للسياحة"
                className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              {language === 'en' ? 'Detailed Description' : 'وصف شامل للخدمة والمزايا المقدمة للسياح'} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل الخدمة، أوقات العمل، الخدمات المشمولة..."
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              {language === 'en' ? 'Amenities (Comma separated)' : 'المميزات والتسهيلات (افصل بينهم بفاصلة)'}
            </label>
            <input
              type="text"
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              placeholder="إنترنت مجاني, مسبح, بوفيه, مواقف سيارات"
              className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple"
            />
          </div>

          {/* Image Selection or Custom URL */}
          <div className="space-y-2">
            <label className="font-bold text-gray-800 block">
              {language === 'en' ? 'Photo Gallery Selection' : 'اختر صورة من المعرض أو ضع رابط صورة خاص بك'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    imageUrl === preset.url ? 'border-pi-purple scale-105 shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-[11px] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pi-gold hover:bg-pi-gold-hover text-pi-dark font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md shadow-pi-gold/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>{language === 'en' ? 'Publish Free Ad Now' : 'نشر الإعلان الفوري مجاناً'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
