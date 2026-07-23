import React from 'react';
import { Listing, Booking } from '../types';
import { Coins, Plus, Eye, CheckCircle2, TrendingUp, Sparkles, MapPin, Building, Phone, Calendar, ArrowUpRight } from 'lucide-react';

interface ProviderDashboardProps {
  listings: Listing[];
  bookings: Booking[];
  onOpenAddModal: () => void;
  onDeleteListing: (id: string) => void;
}

export default function ProviderDashboard({ listings, bookings, onOpenAddModal, onDeleteListing }: ProviderDashboardProps) {
  // Owner's listings are custom ones (isCustom === true)
  const myListings = listings.filter(l => l.isCustom);
  const myListingsIds = myListings.map(l => l.id);

  // Bookings made on owner's listings
  const receivedBookings = bookings.filter(b => myListingsIds.includes(b.listingId));

  // Calc earnings
  const totalEarned = receivedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-6">
      
      {/* Introduction and Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-l from-pi-dark to-purple-950 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden border border-purple-900">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-pi-gold/10 rounded-full blur-2xl" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-pi-purple/20 rounded-full blur-xl" />

        <div className="relative space-y-1.5 max-w-lg">
          <div className="flex items-center gap-1.5 bg-pi-gold/25 text-pi-gold px-2.5 py-1 rounded-full text-xs font-bold w-fit">
            <Sparkles className="h-3 w-3" />
            <span>نظام إعلاني مجاني بالكامل</span>
          </div>
          <h2 className="text-xl font-extrabold md:text-2xl">لوحة تحكم المزود وصاحب الخدمة</h2>
          <p className="text-xs text-purple-200 leading-relaxed">
            أضف فندقك أو مطعمك مجاناً وبدون أي رسوم اشتراك، واستقبل مدفوعاتك مباشرة بعملة Pi الرقمية المعتمدة فور قيام السياح بالحجز.
          </p>
        </div>
        
        <button
          onClick={onOpenAddModal}
          className="relative shrink-0 flex items-center justify-center gap-2 bg-pi-gold text-pi-dark font-extrabold hover:bg-pi-gold-hover transition-all py-3 px-5 rounded-2xl text-sm shadow-lg shadow-pi-gold/10 active:scale-95"
        >
          <Plus className="h-4.5 w-4.5 stroke-[3]" />
          <span>أضف إعلانك المجاني الآن</span>
        </button>
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
            <span className="text-xs font-semibold text-gray-400 block">إعلاناتك الإشهارية المباشرة</span>
            <span className="text-2xl font-black font-mono text-gray-800">{myListings.length}</span>
            <span className="text-[10px] text-gray-500 block">إعلانات مجانية دون عمولة</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Received bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 block">حجوزات السياح المستلمة</span>
            <span className="text-2xl font-black font-mono text-emerald-600">{receivedBookings.length}</span>
            <span className="text-[10px] text-gray-500 block">مدفوعة ومؤكدة بالكامل</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid for Provider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Active Listings (5/12 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm md:text-base">إعلاناتك النشطة ({myListings.length})</h3>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500 space-y-3">
              <Building className="h-8 w-8 mx-auto text-gray-300" />
              <p className="text-xs leading-relaxed max-w-xs mx-auto">
                لم تقم بإضافة أي إعلان مجاني لفندقك أو مطعمك بعد. اضغط على الزر بالأعلى لنشر أول إعلان لك واستقبال الحجوزات!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map(listing => (
                <div key={listing.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex gap-3 shadow-xs items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={listing.image} alt={listing.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1">{listing.title}</h4>
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
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 py-1.5 px-2.5 rounded-lg transition-colors shrink-0"
                  >
                    حذف الإعلان
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Received Bookings (7/12 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm md:text-base">طلبات الحجز المستلمة من السياح ({receivedBookings.length})</h3>

          {receivedBookings.length === 0 ? (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500 space-y-3">
              <Coins className="h-8 w-8 mx-auto text-gray-300" />
              <p className="text-xs leading-relaxed max-w-sm mx-auto">
                في انتظار حجز السياح لعروضك المنشورة. عند حجز أي مستخدم لإعلاناتك، ستظهر تفاصيل الدفع وبيانات التواصل الخاصة بهم هنا فوراً للتنسيق!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedBookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500">حجز على إعلانك:</h4>
                      <span className="text-sm font-black text-gray-900">{booking.listingTitle}</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>π {booking.totalPrice} مدفوعة</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400">العميل السائح:</span>
                      <p className="font-bold text-gray-800">{booking.touristName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400">تاريخ الوصول المطلوب:</span>
                      <div className="flex items-center gap-1 font-semibold text-gray-800">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{booking.bookingDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400">رقم الهاتف للتنسيق:</span>
                      <a
                        href={`tel:${booking.touristPhone}`}
                        className="font-bold text-pi-purple hover:underline flex items-center gap-1"
                        dir="ltr"
                      >
                        <Phone className="h-3.5 w-3.5 text-pi-purple shrink-0" />
                        <span>{booking.touristPhone}</span>
                      </a>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 p-2.5 rounded-lg text-[10px] flex items-center justify-between font-mono">
                    <span className="text-gray-400">إمضاء المعاملة الرقمي (Tx Hash):</span>
                    <span className="text-gray-500 max-w-[200px] md:max-w-xs truncate">{booking.txHash}</span>
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
