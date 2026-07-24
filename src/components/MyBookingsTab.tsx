import React, { useState } from 'react';
import { Booking } from '../types';
import { Coins, Calendar, Phone, MapPin, CheckCircle2, Clock, Printer, Building, AlertCircle } from 'lucide-react';

interface MyBookingsTabProps {
  bookings: Booking[];
  language?: 'ar' | 'en';
}

export default function MyBookingsTab({ bookings, language = 'ar' }: MyBookingsTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const handlePrint = (booking: Booking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>إيصال حجز باي تور - ${booking.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #512da8; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #512da8; }
            .details { margin: 30px 0; background: #f9f9f9; padding: 20px; border-radius: 12px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total { font-size: 20px; font-weight: bold; color: #512da8; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌴 باي تور - Pi Tour Marketplace</div>
            <h3>إيصال حجز مؤكد ومسدد بعملة Pi</h3>
          </div>
          <div class="details">
            <div class="row"><span>رقم الحجز:</span><strong>${booking.id}</strong></div>
            <div class="row"><span>الخدمة / الفندق:</span><strong>${booking.listingTitle}</strong></div>
            <div class="row"><span>اسم السائح:</span><strong>${booking.touristName}</strong></div>
            <div class="row"><span>الهاتف:</span><strong>${booking.touristPhone}</strong></div>
            <div class="row"><span>تاريخ الوصول:</span><strong>${booking.bookingDate}</strong></div>
            <div class="row"><span>الكمية / الضيوف:</span><strong>${booking.quantity}</strong></div>
            <div class="row total"><span>الإجمالي المدفوع:</span><strong>π ${booking.totalPrice}</strong></div>
            <div class="row"><span>معرف المعاملة:</span><small>${booking.txHash}</small></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">
            {language === 'en' ? 'My Bookings History' : 'سجل حجوزاتي وسفرياتي بالباي'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            متابعة حالة جميع الحجوزات المؤكدة والمدفوعة بعملة Pi Network
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'all' ? 'bg-white text-pi-purple shadow-2xs' : 'text-gray-600'
            }`}
          >
            جميع الحجوزات ({bookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'paid' ? 'bg-white text-pi-purple shadow-2xs' : 'text-gray-600'
            }`}
          >
            مؤكدة ومدفوعة ({bookings.filter(b => b.status === 'paid').length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <Calendar className="h-10 w-10 text-gray-300 mx-auto" />
          <h3 className="font-extrabold text-sm text-gray-700">لا توجد حجوزات في هذا القسم</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            تصفح القائمة الرئيسية للفنادق، المطاعم والرحلات، واحجز مباشرة بمحفظة باي!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs hover:border-purple-200 transition-all space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <img src={booking.listingImage} alt="thumb" className="w-14 h-14 object-cover rounded-2xl shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-pi-purple bg-purple-50 px-2 py-0.5 rounded-full">
                    {booking.listingType}
                  </span>
                  <h4 className="text-sm font-extrabold text-gray-900 truncate mt-1">{booking.listingTitle}</h4>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-base font-black text-pi-purple font-mono block">π {booking.totalPrice}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    مدفوعة بالكامل
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50/70 p-2.5 rounded-xl space-y-0.5">
                  <span className="text-gray-400 text-[10px]">تاريخ الحجز:</span>
                  <p className="font-bold text-gray-800 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-pi-purple" />
                    <span>{booking.bookingDate}</span>
                  </p>
                </div>

                <div className="bg-gray-50/70 p-2.5 rounded-xl space-y-0.5">
                  <span className="text-gray-400 text-[10px]">الكمية / الضيوف:</span>
                  <p className="font-bold text-gray-800">{booking.quantity}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => handlePrint(booking)}
                  className="flex items-center gap-1 text-gray-600 hover:text-pi-purple font-bold cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>طباعة الإيصال</span>
                </button>

                <a
                  href={`tel:${booking.touristPhone}`}
                  className="flex items-center gap-1 text-pi-purple font-bold hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>تواصل مع الخدمة</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
