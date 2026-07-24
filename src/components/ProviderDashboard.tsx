import React, { useState } from 'react';
import { Listing, Booking } from '../types';
import { Coins, Plus, CheckCircle2, TrendingUp, Sparkles, MapPin, Building, Phone, Calendar, Trash2, RotateCcw, ShieldAlert, Filter, Layers } from 'lucide-react';

interface ProviderDashboardProps {
  listings: Listing[];
  bookings: Booking[];
  onOpenAddModal?: () => void;
  onDeleteListing: (id: string) => void;
  onDeleteBooking?: (id: string) => void;
  onResetListings?: () => void;
  language?: 'ar' | 'en';
}

export default function ProviderDashboard({
  listings,
  bookings,
  onOpenAddModal,
  onDeleteListing,
  onDeleteBooking,
  onResetListings,
  language = 'ar'
}: ProviderDashboardProps) {
  const [viewMode, setViewMode] = useState<'all' | 'custom'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hotel' | 'restaurant'>('all');

  // Filter listings based on view mode and category
  const filteredListings = listings.filter(l => {
    const matchesMode = viewMode === 'all' || l.isCustom;
    const matchesCategory = categoryFilter === 'all' || l.type === categoryFilter;
    return matchesMode && matchesCategory;
  });

  // Calculate earnings and counts
  const customListingsCount = listings.filter(l => l.isCustom).length;
  const totalEarned = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* Introduction and Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-l from-pi-dark to-purple-950 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden border border-purple-900">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-pi-gold/10 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-pi-purple/20 rounded-full blur-xl" />

        <div className="relative space-y-1.5 max-w-xl">
          <div className="flex items-center gap-1.5 bg-pi-gold/25 text-pi-gold px-2.5 py-1 rounded-full text-xs font-bold w-fit">
            <Sparkles className="h-3 w-3" />
            <span>لوحة التحكم والإدارة الشاملة</span>
          </div>
          <h2 className="text-xl font-extrabold md:text-2xl">إدارة الإعلانات والحجوزات بالتطبيق</h2>
          <p className="text-xs text-purple-200 leading-relaxed">
            من هنا يمكنك التحكم الكامل في التطبيق: إضافة إعلانات جديدة، حذف الإعلانات، متابعة الحجوزات، وإدارة محتوى المنصة بكل سهولة وبدون قيود.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 relative shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-2 bg-pi-gold text-pi-dark font-extrabold hover:bg-pi-gold-hover transition-all py-3 px-5 rounded-2xl text-sm shadow-lg shadow-pi-gold/10 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 stroke-[3]" />
            <span>إضافة إعلان جديد</span>
          </button>

          {onResetListings && (
            <button
              onClick={onResetListings}
              title="إعادة ضبط العروض إلى البيانات الافتراضية"
              className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold transition-all py-3 px-3.5 rounded-2xl text-xs border border-white/15 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">إعادة الضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Pi Earned */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 block">إجمالي أرباح Pi المستلمة</span>
            <span className="text-2xl font-black font-mono text-pi-purple">π {totalEarned.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <TrendingUp className="h-3 w-3" />
              <span>مضمونة بالبلوكشين</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-pi-purple">
            <Coins className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Active ads */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 block">إجمالي الإعلانات في المنصة</span>
            <span className="text-2xl font-black font-mono text-gray-800">{listings.length}</span>
            <span className="text-[10px] text-gray-500 block">({customListingsCount} إعلانات مضافة من قبلك)</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Received bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 block">إجمالي الحجوزات المسجلة</span>
            <span className="text-2xl font-black font-mono text-emerald-600">{bookings.length}</span>
            <span className="text-[10px] text-gray-500 block">حجوزات مؤكدة ومدفوعة</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Control Switchers */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-pi-purple" />
          <span className="text-xs font-bold text-gray-700">نطاق الإدارة:</span>
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'all' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              جميع إعلانات التطبيق ({listings.length})
            </button>
            <button
              onClick={() => setViewMode('custom')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'custom' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              إعلاناتي المضافة فقط ({customListingsCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-700">التصنيف:</span>
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setCategoryFilter('hotel')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'hotel' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              فنادق
            </button>
            <button
              onClick={() => setCategoryFilter('restaurant')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'restaurant' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              مطاعم
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid for Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Manage Listings (6/12 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm md:text-base">
              قائمة الإعلانات المنشورة ({filteredListings.length})
            </h3>
            <button
              onClick={onOpenAddModal}
              className="text-xs font-bold text-pi-purple hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>إضافة جديد</span>
            </button>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500 space-y-3">
              <Building className="h-8 w-8 mx-auto text-gray-300" />
              <p className="text-xs leading-relaxed max-w-xs mx-auto">
                لا توجد إعلانات مطابقة للتصفية الحالية. يمكنك إضافة إعلان جديد بسهولة بالنقر على زر الإضافة!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredListings.map(listing => (
                <div key={listing.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex gap-3 shadow-xs items-center justify-between group hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={listing.image} alt={listing.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
                          {listing.type === 'hotel' ? 'فندق' : 'مطعم'}
                        </span>
                        <h4 className="text-xs font-extrabold text-gray-900 truncate">{listing.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{listing.city}</span>
                        <span className="mx-1">•</span>
                        <span className="text-pi-purple font-mono font-bold">π {listing.price}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteListing(listing.id)}
                    className="text-xs font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 py-2 px-3 rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Manage Bookings (6/12 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm md:text-base">
              طلبات الحجز المستلمة في التطبيق ({bookings.length})
            </h3>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500 space-y-3">
              <Coins className="h-8 w-8 mx-auto text-gray-300" />
              <p className="text-xs leading-relaxed max-w-sm mx-auto">
                لا توجد حجوزات مسجلة حالياً. عند قيام أي مستخدم بالحجز من متصفح Pi Browser، ستظهر تفاصيل العملية ورقم الهاتف هنا فوراً.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400">اسم العرض:</h4>
                      <span className="text-xs font-black text-gray-900">{booking.listingTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span>π {booking.totalPrice}</span>
                      </div>
                      {onDeleteBooking && (
                        <button
                          onClick={() => onDeleteBooking(booking.id)}
                          title="إلغاء/حذف الحجز"
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-gray-400 text-[10px]">العميل:</span>
                      <p className="font-bold text-gray-800">{booking.touristName}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-gray-400 text-[10px]">تاريخ الحجز:</span>
                      <div className="flex items-center gap-1 font-semibold text-gray-800">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{booking.bookingDate}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-gray-400 text-[10px]">الهاتف:</span>
                      <a
                        href={`tel:${booking.touristPhone}`}
                        className="font-bold text-pi-purple hover:underline flex items-center gap-1"
                        dir="ltr"
                      >
                        <Phone className="h-3 w-3 text-pi-purple shrink-0" />
                        <span>{booking.touristPhone}</span>
                      </a>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 p-2 rounded-lg text-[10px] flex items-center justify-between font-mono">
                    <span className="text-gray-400">معرف المعاملة:</span>
                    <span className="text-gray-500 max-w-[180px] truncate">{booking.txHash}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

