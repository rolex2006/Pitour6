import React from 'react';
import { Booking } from '../types';
import { Calendar, Bed, Utensils, Hash, CheckCircle, Shield, PhoneCall } from 'lucide-react';

interface MyBookingsTabProps {
  bookings: Booking[];
}

export default function MyBookingsTab({ bookings }: MyBookingsTabProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
          <Calendar className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-base font-bold text-gray-800">لا توجد حجوزات نشطة بعد</h3>
        <p className="mt-1.5 text-xs text-gray-500 max-w-sm leading-relaxed">
          تصفح الفنادق والمطاعم المتاحة واحجز رحلتك القادمة الآن باستخدام عملتك الرقمية Pi Network بكل سهولة وأمان!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">سجل الحجوزات المؤكدة ({bookings.length})</h3>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          <Shield className="h-3 w-3" />
          <span>المعاملات آمنة ومسجلة</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs transition-all hover:border-gray-200"
          >
            {/* Thumbnail */}
            <div className="relative h-24 w-full md:w-36 rounded-xl overflow-hidden bg-gray-50 shrink-0">
              <img src={booking.listingImage} alt={booking.listingTitle} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white">
                {booking.listingType === 'hotel' ? <Bed className="h-3 w-3" /> : <Utensils className="h-3 w-3" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{booking.listingTitle}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.listingType === 'hotel' ? 'حجز فندق' : 'حجز طاولة مطعم'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>تم الدفع والاستلام</span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs border-y border-gray-50 py-2.5">
                  <div>
                    <span className="text-gray-400 block">تاريخ الوصول:</span>
                    <span className="font-semibold text-gray-800">{booking.bookingDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">العدد المطلوب:</span>
                    <span className="font-semibold text-gray-800">
                      {booking.quantity} {booking.listingType === 'hotel' ? 'ليالي' : 'وجبات/أشخاص'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">المبلغ المدفوع:</span>
                    <span className="font-extrabold text-pi-purple font-mono">π {booking.totalPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">اسم النزيل:</span>
                    <span className="font-semibold text-gray-800 truncate block max-w-[100px]">{booking.touristName}</span>
                  </div>
                </div>
              </div>

              {/* Tx Hash footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-500 font-mono">
                  <Hash className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-400">معرف المعاملة:</span>
                  <span className="text-gray-600 truncate max-w-[180px] md:max-w-xs">{booking.txHash}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-pi-purple">
                  <PhoneCall className="h-3 w-3" />
                  <span>دعم العملاء متوفر</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
