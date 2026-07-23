import React, { useState, useEffect } from 'react';
import { Listing, Booking } from '../types';
import { X, Calendar, User, Phone, CheckCircle, Wallet, ShieldCheck, RefreshCw, Sparkles, Coins } from 'lucide-react';

interface PiWalletPaymentModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function PiWalletPaymentModal({ isOpen, listing, onClose, onSuccess }: PiWalletPaymentModalProps) {
  const [step, setStep] = useState<'input' | 'wallet_auth' | 'processing' | 'success'>('input');
  const [quantity, setQuantity] = useState(1);
  const [touristName, setTouristName] = useState('');
  const [touristPhone, setTouristPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isSimulatingPassphrase, setIsSimulatingPassphrase] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setQuantity(1);
      setTouristName('');
      setTouristPhone('');
      setBookingDate(new Date().toISOString().split('T')[0]);
      setPassphrase('');
      setTxHash('');
    }
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const totalPrice = parseFloat((listing.price * quantity).toFixed(2));

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName || !touristPhone || !bookingDate) {
      alert('الرجاء إدخال بيانات الحجز المطلوبة!');
      return;
    }
    setStep('wallet_auth');
  };

  const handleGeneratePassphrase = () => {
    setIsSimulatingPassphrase(true);
    setTimeout(() => {
      const words = [
        'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 
        'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa', 'quebec', 'romeo', 
        'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray'
      ];
      // pick 24 random words or shuffle
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      setPassphrase(shuffled.join(' '));
      setIsSimulatingPassphrase(false);
    }, 600);
  };

  const handlePay = () => {
    if (!passphrase.trim() || passphrase.split(' ').length < 12) {
      alert('الرجاء إدخال عبارة مرور محفظة Pi صالحة (12 أو 24 كلمة) لمحاكاة الدفع بنجاح!');
      return;
    }
    
    setStep('processing');
    
    // Simulate Pi Blockchain validation
    setTimeout(() => {
      // Generate realistic transaction hash
      const randomHex = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const hash = `0xpi_${randomHex}`;
      setTxHash(hash);
      
      const newBooking: Booking = {
        id: 'B' + Math.floor(100000 + Math.random() * 900000),
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.image,
        listingType: listing.type,
        touristName,
        touristPhone,
        bookingDate,
        quantity,
        totalPrice,
        status: 'paid',
        txHash: hash,
        createdAt: new Date().toISOString()
      };
      
      onSuccess(newBooking);
      setStep('success');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 flex flex-col transition-all">
        
        {/* Step 1: Booking Details Input */}
        {step === 'input' && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pi-purple/10 text-pi-purple">
                  <Coins className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">تأكيد حجز الخدمة السياحية</h3>
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
              {/* Short Listing Overview */}
              <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <img src={listing.image} alt={listing.title} className="h-16 w-20 rounded-xl object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{listing.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{listing.city}</p>
                  <p className="text-xs font-bold text-pi-purple mt-1">π {listing.price} {listing.type === 'hotel' ? 'لليلة' : 'للوجبة/الشخص'}</p>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {listing.type === 'hotel' ? 'عدد الليالي المطلوبة' : 'عدد الوجبات / الأشخاص'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg font-bold hover:bg-gray-50 text-gray-600"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-base font-bold font-mono text-gray-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg font-bold hover:bg-gray-50 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tourist Info Form */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم العميل بالكامل *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={touristName}
                      onChange={e => setTouristName(e.target.value)}
                      placeholder="أدخل اسمك الكريم"
                      className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 text-sm focus:border-pi-purple focus:outline-hidden"
                    />
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الجوال *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={touristPhone}
                        onChange={e => setTouristPhone(e.target.value)}
                        placeholder="0501234567"
                        className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 text-sm focus:border-pi-purple focus:outline-hidden text-left"
                        dir="ltr"
                      />
                      <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">تاريخ الوصول *</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={e => setBookingDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-pi-purple focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>تكلفة الحجز الأساسية</span>
                  <span>{quantity} × π {listing.price}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>رسوم شبكة Pi (مجانية)</span>
                  <span className="text-emerald-600">π 0.00</span>
                </div>
                <hr className="border-purple-100" />
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-900">المبلغ الإجمالي المستحق</span>
                  <span className="text-pi-purple text-lg font-mono">π {totalPrice}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-pi-purple py-3 text-center text-sm font-bold text-white transition-all hover:bg-pi-purple-hover hover:shadow-lg hover:shadow-pi-purple/15 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                <span>متابعة لخطوة الدفع بـ Pi Network</span>
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Simulated Pi Wallet Authentication */}
        {step === 'wallet_auth' && (
          <div className="flex flex-col bg-pi-dark text-white p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pi-gold text-pi-dark font-extrabold font-mono text-lg">
                  π
                </div>
                <span className="text-sm font-extrabold tracking-wider">PI BROWSER SANDBOX</span>
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 text-gray-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Wallet Interface Graphic */}
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="h-7 w-7 text-pi-gold" />
              </div>
              <h4 className="text-base font-bold">بوابة الدفع الآمنة لـ Pi Network</h4>
              <p className="text-xs text-gray-300 px-4 leading-relaxed">
                يرجى إدخال عبارة المرور (Passphrase) الخاصة بمحفظتك لتأكيد إرسال π {totalPrice} إلى مزود الخدمة.
              </p>
            </div>

            {/* Input Passphrase */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-300">عبارة المرور للمحفظة (24 كلمة)</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassphrase}
                    disabled={isSimulatingPassphrase}
                    className="text-xs font-bold text-pi-gold hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${isSimulatingPassphrase ? 'animate-spin' : ''}`} />
                    <span>توليد محفظة تجريبية (موصى به)</span>
                  </button>
                </div>
                <textarea
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder="اكتب أو الصق الكلمات الـ 24 الخاصة بمحفظتك هنا لإجراء محاكاة صحيحة..."
                  className="w-full h-24 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-xs font-mono text-white placeholder-gray-400 focus:outline-hidden focus:border-pi-gold focus:ring-1 focus:ring-pi-gold leading-relaxed"
                  dir="ltr"
                />
              </div>

              {/* Payment Details Card */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">المستلم:</span>
                  <span className="font-semibold text-gray-200">سياحة باي للتطوير المجاني</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">القيمة:</span>
                  <span className="font-bold text-pi-gold">π {totalPrice}</span>
                </div>
              </div>

              {/* Confirmation Button */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handlePay}
                  className="flex-1 rounded-xl bg-pi-gold py-3 text-center text-sm font-bold text-pi-dark transition-all hover:bg-pi-gold-hover hover:shadow-lg active:scale-[0.98]"
                >
                  تأكيد الدفع وإمضاء المعاملة
                </button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 rounded-xl border border-white/20 text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors"
                >
                  تعديل البيانات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Blockchain Processing */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-pi-purple/20 border-t-pi-purple animate-spin" />
              <div className="absolute font-mono text-lg font-extrabold text-pi-purple">π</div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-base font-bold text-gray-900">جاري تسجيل المعاملة على شبكة Pi Blockchain...</h4>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                يتم الآن توقيع العقد الذكي للحجز بالكتلة الحالية، ونقل π {totalPrice} من محفظة العميل إلى خزانة الضمان الآمنة للمزود.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Success Screen */}
        {step === 'success' && (
          <div className="flex flex-col p-6 text-center space-y-6">
            {/* Celebration graphic */}
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 relative">
              <CheckCircle className="h-9 w-9 text-emerald-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 bg-pi-gold rounded-full p-1 text-[8px] font-bold text-pi-dark flex items-center gap-0.5">
                <Sparkles className="h-2 w-2" />
                <span>مؤكد</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-gray-900">تم الحجز والدفع بنجاح!</h4>
              <p className="text-xs text-gray-500">تم حجز {listing.title} وتوثيق الدفع بعملة Pi.</p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-right space-y-2.5">
              <div className="flex justify-between items-center text-gray-600">
                <span>رقم الحجز:</span>
                <span className="font-bold text-gray-900">#{txHash.slice(5, 11).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>المبلغ المدفوع:</span>
                <span className="font-extrabold text-pi-purple font-mono">π {totalPrice} Pi Coins</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>الاسم المسجل:</span>
                <span className="font-medium text-gray-900">{touristName}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>رقم المعاملة (Tx Hash):</span>
                <span className="font-mono text-[10px] text-gray-400 max-w-[200px] truncate text-left" dir="ltr">
                  {txHash}
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
            >
              عرض ححوزاتي والانتقال للملف
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
