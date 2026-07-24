import React, { useState, useEffect } from 'react';
import { Listing, Booking, PlatformSettings } from '../types';
import { Coins, ShieldCheck, Sparkles, CheckCircle2, X, Loader2, AlertTriangle, ArrowRight, Wallet, Check } from 'lucide-react';
import { PI_CONFIG, initPiSDK, approvePaymentOnServer, completePaymentOnServer } from '../lib/piNetwork';

interface PiWalletPaymentModalProps {
  listing: Listing | null;
  bookingDetails?: { date: string; guests: number };
  settings: PlatformSettings;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
  language?: 'ar' | 'en';
}

export default function PiWalletPaymentModal({
  listing,
  bookingDetails,
  settings,
  isOpen,
  onClose,
  onPaymentSuccess,
  language = 'ar'
}: PiWalletPaymentModalProps) {
  if (!isOpen || !listing) return null;

  const [touristName, setTouristName] = useState('');
  const [touristPhone, setTouristPhone] = useState('');
  
  // Modal flow steps: 'form' -> 'pending_payment' -> 'wallet_active' -> 'success' | 'cancelled' | 'error'
  const [step, setStep] = useState<'form' | 'pending_payment' | 'wallet_active' | 'success' | 'cancelled' | 'error'>('form');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Created Booking state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId?: string;
    txid?: string;
    amount?: number;
    status?: string;
    timestamp?: string;
  } | null>(null);

  const guestsCount = bookingDetails?.guests || 1;
  const bookingDate = bookingDetails?.date || new Date().toISOString().split('T')[0];
  const totalPrice = parseFloat((listing.price * guestsCount).toFixed(2));
  
  // Commission split calculation
  const platformFee = parseFloat((totalPrice * (settings.commissionPercentage / 100)).toFixed(2));
  const providerAmount = parseFloat((totalPrice - platformFee).toFixed(2));

  // Initialize Pi SDK on mount
  useEffect(() => {
    initPiSDK();
  }, []);

  // Step 1: Submit Form -> Create Booking in "Pending Payment" status
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName || !touristPhone) return;

    setErrorMessage('');
    
    // 1. Create booking in Pending Payment state
    const bookingId = 'bk_' + Date.now();
    const newBooking: Booking = {
      id: bookingId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.image,
      listingType: listing.type,
      touristName,
      touristPhone,
      bookingDate,
      quantity: guestsCount,
      totalPrice,
      platformFee,
      providerAmount,
      status: 'pending', // Pending Payment
      paymentStatus: 'pending_payment',
      txHash: '',
      network: PI_CONFIG.sandbox ? 'testnet' : 'mainnet',
      createdAt: new Date().toISOString()
    };

    setActiveBooking(newBooking);
    setStep('pending_payment');
    setStatusMessage(language === 'en' ? 'Booking created in Pending Payment status. Launching Pi Wallet...' : 'تم إنشاء الحجز بنجاح بانتظار الدفع. جاري فتح محفظة باي التستنت...');

    // 2. Open Pi Wallet payment
    setTimeout(() => {
      triggerPiWalletPayment(newBooking);
    }, 800);
  };

  // Step 2: Open Official Pi Payment SDK Screen
  const triggerPiWalletPayment = async (booking: Booking) => {
    setStep('wallet_active');
    const PiObj = (window as any).Pi;

    // Check if official Pi SDK createPayment is available
    if (PiObj && typeof PiObj.createPayment === 'function') {
      try {
        await PiObj.createPayment(
          {
            amount: booking.totalPrice,
            memo: `Pi Tour Booking ${booking.id} - ${booking.listingTitle}`,
            metadata: {
              bookingId: booking.id,
              listingId: booking.listingId,
              touristPhone: booking.touristPhone,
              touristName: booking.touristName,
              network: PI_CONFIG.sandbox ? 'testnet' : 'mainnet'
            }
          },
          {
            // Server approval callback
            onReadyForServerApproval: async (paymentId: string) => {
              console.log('[Pi Testnet SDK] Payment Approval callback triggered:', paymentId);
              setStatusMessage(language === 'en' ? 'Waiting for Testnet server approval (onReadyForServerApproval)...' : 'جاري معالجة الموافقة من خادم التستنت (onReadyForServerApproval)...');
              
              try {
                await approvePaymentOnServer(paymentId, booking.id, booking.totalPrice);
                console.log('[Pi Testnet SDK] Server approval successful for paymentId:', paymentId);
              } catch (err: any) {
                console.error('[Pi Testnet SDK] Server approval error:', err);
                handlePaymentError(err.message || 'Server approval failed');
              }
            },

            // Server completion callback
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              console.log('[Pi Testnet SDK] Payment Completion callback triggered:', paymentId, txid);
              setStatusMessage(language === 'en' ? 'Verifying Testnet transaction completion (onReadyForServerCompletion)...' : 'جاري التأكد وإكمال المعاملة عبر خادم التستنت (onReadyForServerCompletion)...');

              try {
                const completionRes = await completePaymentOnServer(paymentId, txid, booking.id, booking.totalPrice);
                
                if (completionRes.success) {
                  // Only after successful confirmation, set booking to Confirmed ('paid')
                  const timestamp = new Date().toISOString();
                  const confirmedBooking: Booking = {
                    ...booking,
                    status: 'paid',
                    paymentStatus: 'completed',
                    txHash: txid,
                    paymentId: paymentId,
                    paidAt: timestamp
                  };

                  setPaymentDetails({
                    paymentId,
                    txid,
                    amount: booking.totalPrice,
                    status: 'COMPLETED',
                    timestamp
                  });

                  finishPaymentSuccess(confirmedBooking);
                } else {
                  handlePaymentError('Payment completion failed on server');
                }
              } catch (err: any) {
                console.error('[Pi Testnet SDK] Server completion error:', err);
                handlePaymentError(err.message || 'Server completion failed');
              }
            },

            // User cancelled in Pi Wallet
            onCancel: (paymentId: string) => {
              console.log('[Pi Testnet SDK] Payment cancelled by user inside wallet:', paymentId);
              handlePaymentCancelled(booking, paymentId);
            },

            // Error inside Pi Wallet
            onError: (error: any, payment: any) => {
              console.error('[Pi Testnet SDK] Payment error in wallet:', error, payment);
              handlePaymentError(error?.message || 'Payment error inside Pi Wallet');
            }
          }
        );
      } catch (err: any) {
        console.warn('[Pi Testnet SDK] Payment execution error:', err);
        handlePaymentError(err.message || 'Could not open Pi Wallet Payment screen');
      }
    } else {
      // Browser preview mode outside Pi Browser: Interactive Pi Wallet Testnet Sandbox UI
      console.log('[Pi Testnet] Outside Pi Browser - presenting interactive Testnet Wallet Sandbox screen');
    }
  };

  // Simulate Pi Wallet Testnet confirmation (For Browser Preview & Testing)
  const handleSimulatedConfirmInTestnet = async () => {
    if (!activeBooking) return;
    setStep('pending_payment');
    
    const simulatedPaymentId = 'pi_testnet_pay_' + Math.random().toString(36).substring(2, 9);
    const simulatedTxid = '0x_pi_tx_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);

    try {
      // 1. Trigger official onReadyForServerApproval callback to backend
      setStatusMessage(language === 'en' ? 'Executing backend approval (onReadyForServerApproval)...' : 'جاري إرسال موافقة الدفع للموافقات الخافية (onReadyForServerApproval)...');
      await approvePaymentOnServer(simulatedPaymentId, activeBooking.id, activeBooking.totalPrice);

      // 2. Trigger official onReadyForServerCompletion callback to backend
      setStatusMessage(language === 'en' ? 'Executing backend completion (onReadyForServerCompletion)...' : 'جاري تأكيد إكمال المعاملة عبر خادم التستنت (onReadyForServerCompletion)...');
      const completionRes = await completePaymentOnServer(simulatedPaymentId, simulatedTxid, activeBooking.id, activeBooking.totalPrice);

      if (completionRes.success) {
        const timestamp = new Date().toISOString();
        const confirmedBooking: Booking = {
          ...activeBooking,
          status: 'paid',
          paymentStatus: 'completed',
          txHash: simulatedTxid,
          paymentId: simulatedPaymentId,
          paidAt: timestamp
        };

        setPaymentDetails({
          paymentId: simulatedPaymentId,
          txid: simulatedTxid,
          amount: activeBooking.totalPrice,
          status: 'COMPLETED',
          timestamp
        });

        finishPaymentSuccess(confirmedBooking);
      } else {
        handlePaymentError('Server completion failed');
      }
    } catch (err: any) {
      console.error('[Simulated Testnet] Error:', err);
      handlePaymentError(err.message || 'Failed to complete payment on Testnet server');
    }
  };

  // Handle Payment Success
  const finishPaymentSuccess = (confirmedBooking: Booking) => {
    setCompletedBooking(confirmedBooking);
    setStep('success');
    onPaymentSuccess(confirmedBooking);
  };

  // Handle Payment Cancellation
  const handlePaymentCancelled = (booking: Booking, paymentId?: string) => {
    const cancelledBooking: Booking = {
      ...booking,
      status: 'cancelled',
      paymentStatus: 'cancelled'
    };
    setActiveBooking(cancelledBooking);
    setStep('cancelled');
    setErrorMessage(
      language === 'en'
        ? 'Payment was cancelled inside Pi Wallet. Your booking remains pending or cancelled.'
        : 'تم إلغاء عملية الدفع داخل محفظة Pi. لم يتم خصم أي رصيد وبقي الحجز غير مؤكد.'
    );
  };

  // Handle Payment Error
  const handlePaymentError = (msg: string) => {
    if (activeBooking) {
      setActiveBooking({
        ...activeBooking,
        status: 'cancelled',
        paymentStatus: 'failed'
      });
    }
    setStep('error');
    setErrorMessage(msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pi-gold/20 text-pi-dark rounded-xl">
              <Coins className="h-5 w-5 text-pi-gold" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {language === 'en' ? 'Pi Network Secure Payment' : 'بوابة الدفع الآمنة بعملة Pi Network'}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-gray-500 font-mono font-bold">
                  {PI_CONFIG.sandbox ? 'Pi Testnet Network' : 'Pi Mainnet Network'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: Tourist Info Form */}
        {step === 'form' && (
          <form onSubmit={handleInitiatePayment} className="space-y-4 text-xs">
            
            {/* Service & Price Summary Box */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-900 text-sm">{listing.title}</span>
                <span className="text-xs font-bold text-gray-500">📍 {listing.city}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 border-t border-purple-100 pt-2">
                <span>تاريخ الحجز: <strong className="text-gray-800">{bookingDate}</strong></span>
                <span>العدد/الكمية: <strong className="text-gray-800">{guestsCount}</strong></span>
              </div>
            </div>

            {/* Tourist Form Inputs */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {language === 'en' ? 'Tourist Full Name' : 'اسم السائح (صاحب الحجز)'} *
                </label>
                <input
                  type="text"
                  required
                  value={touristName}
                  onChange={(e) => setTouristName(e.target.value)}
                  placeholder="مثال: علي الحامد"
                  className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {language === 'en' ? 'Phone / WhatsApp' : 'رقم الهاتف للتأكيد والتواصل'} *
                </label>
                <input
                  type="tel"
                  required
                  value={touristPhone}
                  onChange={(e) => setTouristPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pi-purple font-mono"
                />
              </div>
            </div>

            {/* Price Split Breakdown */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>المبلغ المستحق لصاحب الخدمة ({100 - settings.commissionPercentage}%):</span>
                <span className="font-mono font-bold text-gray-800">π {providerAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>عمولة المنصة ({settings.commissionPercentage}%):</span>
                <span className="font-mono font-bold text-emerald-600">π {platformFee}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-black text-sm text-gray-900">
                <span>الإجمالي المطلوب الخصم من المحفظة:</span>
                <span className="font-mono text-pi-purple text-lg">π {totalPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pi-purple hover:bg-pi-purple-hover text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-pi-purple/15 cursor-pointer flex items-center justify-center gap-2"
            >
              <Wallet className="h-4 w-4 text-pi-gold" />
              <span>
                {language === 'en'
                  ? 'Create Booking & Pay on Pi Testnet'
                  : 'إنشاء الحجز والدفع عبر محفظة باي التستنت'}
              </span>
            </button>
          </form>
        )}

        {/* STEP 2: Pending Payment Loading State */}
        {step === 'pending_payment' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-pi-purple animate-spin mx-auto" />
            <div className="space-y-1">
              <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full">
                حالة الحجز: بانتظار الدفع (Pending Payment)
              </span>
              <h4 className="font-extrabold text-base text-gray-900 mt-2">جاري المعالجة والربط بمحفظة Pi Testnet...</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">{statusMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 3: Active Wallet Interaction (Pi Testnet Wallet Overlay for standard browser or Pi Browser) */}
        {step === 'wallet_active' && activeBooking && (
          <div className="space-y-4 py-2">
            
            {/* Status Header */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  حالة الحجز: بانتظار التأكيد من المحفظة (Pending Payment)
                </span>
                <span className="font-mono text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                  {activeBooking.id}
                </span>
              </div>
            </div>

            {/* Official Pi Testnet Wallet Display Card */}
            <div className="bg-gradient-to-br from-purple-900 via-pi-purple to-indigo-950 text-white p-5 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pi-gold via-yellow-300 to-pi-gold"></div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-yellow-300 bg-black/30 px-2.5 py-1 rounded-full border border-yellow-300/30">
                    Official Pi Testnet Wallet
                  </span>
                  <h4 className="text-base font-black mt-2">تأكيد معاملة الدفع (Pi Payment)</h4>
                </div>
                <Coins className="h-8 w-8 text-pi-gold" />
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl space-y-2 border border-white/15 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">الخدمة / المحل:</span>
                  <span className="font-bold text-white">{activeBooking.listingTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">الاسم والشبكة:</span>
                  <span className="font-mono text-yellow-300 font-bold">Testnet Sandbox</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/15">
                  <span className="text-purple-100 font-extrabold">مبلغ الاقتطاع من المحفظة:</span>
                  <span className="text-xl font-black text-yellow-300 font-mono">π {activeBooking.totalPrice}</span>
                </div>
              </div>

              <p className="text-[11px] text-purple-200 text-center leading-relaxed">
                اضغط لتأكيد المعاملة واقتطاع المبلغ من محفظة باي التستنت، أو إلغاء المعاملة.
              </p>
            </div>

            {/* Testnet Controls */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleSimulatedConfirmInTestnet}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>تأكيد وإتمام الدفع في محفظة باي التستنت (Confirm Payment)</span>
              </button>

              <button
                onClick={() => handlePaymentCancelled(activeBooking)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-500" />
                <span>إلغاء المعاملة من داخل المحفظة (Cancel Payment)</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Success Screen */}
        {step === 'success' && completedBooking && (
          <div className="py-3 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-md">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                حالة الحجز: مؤكد ومدفوع (Confirmed & Paid)
              </span>
              <h4 className="text-lg font-black text-gray-900 mt-1">تم الدفع وتأكيد الحجز بنجاح! 🎉</h4>
              <p className="text-xs text-gray-500">تم تسجيل المعاملة بنجاح عبر شبكة Pi Testnet وتأكيد الحجز.</p>
            </div>

            {/* Saved Payment & Booking Details Box */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-right space-y-2.5 font-mono">
              <div className="flex justify-between items-center text-gray-600 border-b border-gray-200 pb-2">
                <span>رقم الحجز (Booking ID):</span>
                <span className="text-gray-900 font-bold">{completedBooking.id}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>رقم المعاملة (Testnet TxID):</span>
                <span className="text-pi-purple font-bold truncate max-w-[180px]">{completedBooking.txHash}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>معرف الدفع (Payment ID):</span>
                <span className="text-gray-800 font-bold truncate max-w-[180px]">{completedBooking.paymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>حالة المعاملة (Payment Status):</span>
                <span className="text-emerald-600 font-bold uppercase">{completedBooking.paymentStatus || 'completed'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 border-t border-gray-200 pt-2">
                <span>المبلغ الاجمالي (Amount):</span>
                <span className="text-emerald-700 font-black text-sm">π {completedBooking.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500 text-[10px]">
                <span>التاريخ والوقت:</span>
                <span>{new Date(completedBooking.paidAt || completedBooking.createdAt).toLocaleString('ar-SA')}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer shadow-md"
            >
              متابعة واستعراض تفاصيل الحجز
            </button>
          </div>
        )}

        {/* STEP 5: Cancelled Screen */}
        {step === 'cancelled' && (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                حالة الحجز: ملغى (Cancelled)
              </span>
              <h4 className="text-base font-black text-gray-900 mt-2">تم إلغاء عملية الدفع</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                {errorMessage || 'تم إلغاء المعاملة داخل محفظة باي. لم يتم خصم أي رصيد ولم يكتمل الحجز.'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('form')}
                className="flex-1 bg-pi-purple hover:bg-pi-purple-hover text-white font-extrabold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Error Screen */}
        {step === 'error' && (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <X className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-red-100 text-red-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                حالة الدفع: فشلت المعاملة (Failed)
              </span>
              <h4 className="text-base font-black text-gray-900 mt-2">حدث خطأ أثناء تنفيذ الدفع</h4>
              <p className="text-xs text-red-600 max-w-sm mx-auto leading-relaxed bg-red-50 p-2.5 rounded-xl border border-red-100 font-mono">
                {errorMessage}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('form')}
                className="flex-1 bg-pi-purple hover:bg-pi-purple-hover text-white font-extrabold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
