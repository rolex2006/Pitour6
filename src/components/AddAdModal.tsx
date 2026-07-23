import React, { useState } from 'react';
import { Listing } from '../types';
import { X, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { PRESET_IMAGES, POPULAR_CITIES } from '../data';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (listing: Omit<Listing, 'id' | 'rating' | 'reviewsCount'>) => void;
}

const COMMON_AMENITIES = [
  'إنترنت مجاني',
  'مسبح خارجي',
  'موقف سيارات',
  'خدمة غرف 24 ساعة',
  'مكيف هواء',
  'إطلالة بانورامية',
  'ألعاب أطفال',
  'نادي رياضي',
  'فطور مجاني',
  'جلسات عائلية',
  'موسيقى هادئة'
];

export default function AddAdModal({ isOpen, onClose, onAdd }: AddAdModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'hotel' | 'restaurant'>('hotel');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !price || !description || !contact) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة!');
      return;
    }

    const imageUrl = useCustomImage ? (customImageUrl || PRESET_IMAGES[0].url) : selectedImage;
    
    onAdd({
      title,
      type,
      city,
      price: parseFloat(price) || 1,
      description,
      contact,
      image: imageUrl,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['خدمة ممتازة']
    });

    // Reset Form
    setTitle('');
    setType('hotel');
    setCity('');
    setPrice('');
    setDescription('');
    setContact('');
    setSelectedAmenities([]);
    onClose();
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-pi-purple">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">إضافة إعلان مجاني جديد</h2>
              <p className="text-xs text-gray-500">أعلن عن فندقك أو مطعمك مجاناً واستقبل المدفوعات بعملة Pi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع الإعلان الإشهاري</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('hotel')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  type === 'hotel'
                    ? 'border-pi-purple bg-purple-50 text-pi-purple'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>🏨 فندق / منتجع سياحي</span>
              </button>
              <button
                type="button"
                onClick={() => setType('restaurant')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  type === 'restaurant'
                    ? 'border-pi-purple bg-purple-50 text-pi-purple'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>🍴 مطعم / مقهى راقي</span>
              </button>
            </div>
          </div>

          {/* Title and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الفندق أو المطعم *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: فندق قصر الضيافة أو مطعم اللقمة الشهي"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pi-purple focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المدينة / الموقع الجغرافي *</label>
              <select
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pi-purple focus:outline-hidden bg-white"
              >
                <option value="">اختر المدينة</option>
                {POPULAR_CITIES.filter(c => c !== 'الكل').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="أخرى">مدينة أخرى</option>
              </select>
              {city === 'أخرى' && (
                <input
                  type="text"
                  placeholder="اكتب اسم المدينة هنا"
                  onChange={e => setCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-pi-purple focus:outline-hidden"
                />
              )}
            </div>
          </div>

          {/* Price and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                السعر بعملة Pi (π) * 
                <span className="text-xs font-normal text-gray-400 mr-1">({type === 'hotel' ? 'لليلة الواحدة' : 'للوجبة/الشخص'})</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="مثال: 4.5"
                  className="w-full rounded-xl border border-gray-200 pr-10 pl-4 py-3 text-sm font-mono focus:border-pi-purple focus:outline-hidden"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pi-gold font-bold">π</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف / الواتساب للتواصل *</label>
              <input
                type="tel"
                required
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="مثال: +966 50 123 4567"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pi-purple focus:outline-hidden text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">وصف تفصيلي للخدمة والمكان *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اكتب نبذة جذابة عن فندقك أو مطعمك، المأكولات المقدمة، مميزات الغرف، أو أي عروض خاصة للسياح..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pi-purple focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Image Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">صورة الإعلان الرئيسية</label>
            <div className="flex gap-4 mb-3 border-b border-gray-100 pb-3">
              <button
                type="button"
                onClick={() => setUseCustomImage(false)}
                className={`pb-1 text-sm font-bold transition-all border-b-2 ${!useCustomImage ? 'text-pi-purple border-pi-purple' : 'text-gray-400 border-transparent'}`}
              >
                اختر من الصور المميزة المقترحة
              </button>
              <button
                type="button"
                onClick={() => setUseCustomImage(true)}
                className={`pb-1 text-sm font-bold transition-all border-b-2 ${useCustomImage ? 'text-pi-purple border-pi-purple' : 'text-gray-400 border-transparent'}`}
              >
                أدخل رابط صورة مخصصة
              </button>
            </div>

            {!useCustomImage ? (
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:opacity-90"
                    style={{ borderColor: selectedImage === img.url ? '#8A3BFF' : 'transparent' }}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {selectedImage === img.url && (
                      <div className="absolute inset-0 bg-pi-purple/30 flex items-center justify-center">
                        <div className="bg-pi-purple text-white p-0.5 rounded-full">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/my-hotel-image.jpg"
                  className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 text-sm focus:border-pi-purple focus:outline-hidden text-left"
                  dir="ltr"
                />
                <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الخدمات والمميزات المتاحة</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-pi-purple text-white border-pi-purple shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
            
            {/* Custom Amenity input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أضف ميزة أخرى مخصصة..."
                value={customAmenity}
                onChange={e => setCustomAmenity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                className="flex-1 rounded-xl border border-gray-100 px-4 py-2.5 text-xs focus:border-pi-purple focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="rounded-xl bg-gray-100 text-gray-700 px-4 py-2.5 text-xs font-bold hover:bg-gray-200 transition-all"
              >
                إضافة ميزة
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-pi-purple py-3 text-sm font-bold text-white transition-all hover:bg-pi-purple-hover hover:shadow-lg hover:shadow-pi-purple/15 active:scale-[0.98]"
            >
              نشر الإعلان مجاناً بالكامل
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
