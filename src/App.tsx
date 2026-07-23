import React, { useState, useEffect } from 'react';
import { Listing, Booking } from './types';
import { INITIAL_LISTINGS, POPULAR_CITIES } from './data';
import ListingCard from './components/ListingCard';
import AddAdModal from './components/AddAdModal';
import PiWalletPaymentModal from './components/PiWalletPaymentModal';
import MyBookingsTab from './components/MyBookingsTab';
import ProviderDashboard from './components/ProviderDashboard';
import { 
  Compass, 
  Calendar, 
  Building, 
  Search, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Coins, 
  ShieldCheck, 
  Users, 
  Info,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // State initialization with localStorage
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('pitour_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('pitour_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'bookings' | 'provider'>('browse');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'restaurant'>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedListingToBook, setSelectedListingToBook] = useState<Listing | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pi Network Auth State & Logic
  const [piUser, setPiUser] = useState<any>(() => {
    const saved = localStorage.getItem('pi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const authenticatePi = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const PiObj = (window as any).Pi;
      if (!PiObj) {
        throw new Error("لم يتم تحميل مكتبة Pi SDK بشكل كامل. يرجى فتح التطبيق من داخل متصفح Pi Browser الرسمي.");
      }

      // Treat Pi.init(...) as a Promise; await it fully before calling Pi.authenticate(...)
      await PiObj.init({ version: "2.0", sandbox: true });

      const scopes = ["username"];
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment detected:", payment);
      };

      const authResult = await PiObj.authenticate(scopes, onIncompletePaymentFound);
      const accessToken = authResult.accessToken;

      // Send returned access token to the backend for verification
      const verifyResponse = await fetch("/api/authenticate-pi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "لم نتمكن من التحقق من صحة جلسة Pi عبر الخادم.");
      }

      const data = await verifyResponse.json();
      if (data.success && data.user) {
        setPiUser(data.user);
        localStorage.setItem("pi_user", JSON.stringify(data.user));
      } else {
        throw new Error("استجابة غير صالحة من نظام التحقق في الخادم.");
      }
    } catch (err: any) {
      console.error("Pi authentication failure:", err);
      setAuthError(err.message || "حدث خطأ أثناء الاتصال بشبكة Pi Network.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Automatically trigger authentication on mount
    if (!piUser) {
      authenticatePi();
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pitour_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('pitour_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handler to add custom free ad
  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'rating' | 'reviewsCount'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: 'L' + Math.floor(100000 + Math.random() * 900000),
      rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)), // random rating between 4.5 and 5.0
      reviewsCount: Math.floor(1 + Math.random() * 20),
      isCustom: true // marked as custom for provider dashboard filter
    };

    setListings([newListing, ...listings]);
    setActiveTab('provider'); // Redirect to dashboard to see active ads!
  };

  // Handler to delete custom listing
  const handleDeleteListing = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان مجدداً؟ لن تظهر أرباح هذا الإعلان لاحقاً.')) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  // Handler for successful booking
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    
    // Redirect after brief delay
    setTimeout(() => {
      setActiveTab('bookings');
    }, 500);
  };

  // Filter listings based on search and selected city/type
  const filteredListings = listings.filter(l => {
    const matchesCity = selectedCity === 'الكل' || l.city === selectedCity;
    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-right font-sans antialiased pb-12" dir="rtl">
      
      {/* Top Notification Bar */}
      <div className="bg-pi-dark text-white text-[11px] md:text-xs font-semibold py-2.5 px-4 text-center border-b border-purple-950 flex items-center justify-center gap-1.5 flex-wrap">
        <span className="bg-pi-gold text-pi-dark px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse">جديد</span>
        <span>المنصة متصلة بشبكة Pi Network الاختبارية (Sandbox Net). يمكنك استخدام أي عبارة مرور تجريبية لمحاكاة الدفع والدخول.</span>
      </div>

      {/* Primary Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pi-purple to-purple-600 text-white shadow-md shadow-pi-purple/15 relative overflow-hidden group">
              <span className="font-mono text-xl font-black text-pi-gold transition-transform group-hover:rotate-12">π</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-1">
                <span>باي تور</span>
                <span className="text-pi-purple text-xs font-semibold font-mono bg-purple-50 px-1.5 py-0.5 rounded-md">PiTour</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-medium">سياحة وحجوزات ذكية بعملة Pi</p>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => { setActiveTab('browse'); setSelectedCity('الكل'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'browse'
                  ? 'bg-purple-50 text-pi-purple'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span>تصفح العروض</span>
            </button>
            
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                activeTab === 'bookings'
                  ? 'bg-purple-50 text-pi-purple'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4.5 w-4.5" />
              <span>حجوزاتي السياحية</span>
              {bookings.length > 0 && (
                <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-pi-purple text-[10px] font-bold text-white shadow-xs">
                  {bookings.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('provider')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'provider'
                  ? 'bg-purple-50 text-pi-purple'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building className="h-4.5 w-4.5" />
              <span>لوحة المزود (أعلن مجاناً)</span>
            </button>
          </nav>

          {/* Call to action (Add Free Listing) */}
          <div className="hidden md:flex items-center gap-3">
            {piUser ? (
              <div className="flex items-center gap-2.5 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1.5">
                <div className="h-7 w-7 rounded-lg bg-pi-purple text-pi-gold flex items-center justify-center text-xs font-black shadow-xs">
                  π
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 font-bold leading-none">مرحباً</p>
                  <p className="text-xs text-pi-purple font-black leading-none mt-0.5">@{piUser.username || piUser.uid}</p>
                </div>
                <button 
                  onClick={() => {
                    setPiUser(null);
                    localStorage.removeItem('pi_user');
                  }}
                  className="text-[10px] text-red-500 hover:text-red-600 font-extrabold mr-1.5 hover:underline cursor-pointer"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={authenticatePi}
                disabled={authLoading}
                className="rounded-xl border border-pi-purple/30 bg-purple-50/50 hover:bg-purple-100/50 py-2.5 px-4 text-xs font-bold text-pi-purple transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <div className="h-4.5 w-4.5 rounded-full bg-pi-purple text-pi-gold flex items-center justify-center text-[10px] font-black">π</div>
                <span>{authLoading ? 'جاري الاتصال...' : 'تسجيل دخول Pi'}</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-xl bg-pi-purple py-2.5 px-4 text-xs font-bold text-white transition-all hover:bg-pi-purple-hover hover:shadow-md hover:shadow-pi-purple/10 active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-pi-gold" />
              <span>أضف إعلانك مجاناً</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-600"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 shadow-inner">
            <button
              onClick={() => { setActiveTab('browse'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-right ${
                activeTab === 'browse' ? 'bg-purple-50 text-pi-purple' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span>تصفح الفنادق والمطاعم</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-right ${
                activeTab === 'bookings' ? 'bg-purple-50 text-pi-purple' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4.5 w-4.5" />
                <span>حجوزاتي السياحية</span>
              </div>
              {bookings.length > 0 && (
                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-pi-purple text-[10px] font-bold text-white">
                  {bookings.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => { setActiveTab('provider'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-right ${
                activeTab === 'provider' ? 'bg-purple-50 text-pi-purple' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building className="h-4.5 w-4.5" />
              <span>لوحة أصحاب الفنادق والمطاعم</span>
            </button>

            {piUser ? (
              <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-pi-purple text-pi-gold flex items-center justify-center text-sm font-black">
                    π
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold leading-none">الحساب المرتبط</p>
                    <p className="text-xs text-pi-purple font-black leading-tight mt-1">@{piUser.username || piUser.uid}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setPiUser(null);
                    localStorage.removeItem('pi_user');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-extrabold hover:underline cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => { authenticatePi(); setIsMobileMenuOpen(false); }}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 border border-pi-purple/30 bg-purple-50/50 hover:bg-purple-100/50 py-3 px-4 rounded-xl text-sm font-bold text-pi-purple transition-all cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full bg-pi-purple text-pi-gold flex items-center justify-center text-[11px] font-black">π</div>
                <span>{authLoading ? 'جاري الاتصال بـ Pi...' : 'تسجيل الدخول بـ Pi Network'}</span>
              </button>
            )}

            <button
              onClick={() => { setIsAddModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-pi-purple hover:bg-pi-purple-hover text-white py-3 px-4 rounded-xl text-sm font-bold"
            >
              <Sparkles className="h-4 w-4 text-pi-gold" />
              <span>نشر إعلان مجاني جديد</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 flex-1 w-full">
        
        {/* Auth Error / Info Alert */}
        {authError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-right text-amber-950 mb-6 relative">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black">تنبيه متعلق بحساب Pi Network</h4>
              <p className="text-xs font-medium leading-relaxed">
                {authError}. للتمتع بكافة مزايا الدفع وتأكيد الحجوزات الآمنة، يرجى تشغيل التطبيق من داخل متصفح <strong>Pi Browser</strong> الرسمي.
              </p>
              <button
                onClick={authenticatePi}
                className="text-[11px] font-bold text-pi-purple hover:underline pt-1 block cursor-pointer"
              >
                إعادة المحاولة الآن
              </button>
            </div>
            <button 
              onClick={() => setAuthError(null)}
              className="absolute left-3 top-3 text-amber-500 hover:text-amber-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* TAB 1: BROWSE HOTELS & RESTAURANTS */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* Hero Section Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-pi-dark text-white p-6 md:p-12 shadow-md border border-purple-950">
              {/* Decorative elements */}
              <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-r from-pi-purple/20 to-transparent pointer-events-none" />
              <div className="absolute right-10 bottom-10 w-44 h-44 bg-pi-gold/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3.5 py-1 text-xs font-bold text-pi-gold backdrop-blur-xs">
                  <Coins className="h-3.5 w-3.5" />
                  <span>أول منصة حجز سياحية مدعومة بـ Pi Network في الوطن العربي</span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-white">
                  سافر، تذوق، واقضِ أجمل الأوقات.. <br />
                  <span className="text-pi-gold">وادفع بعملة Pi بكل سهولة!</span>
                </h2>
                
                <p className="text-xs md:text-sm text-purple-100 leading-relaxed font-light">
                  نوفر لأصحاب الفنادق والمطاعم مساحة مجانية بالكامل لعرض خدماتهم السياحية مجاناً دون أي عمولات تذكر. ونمنح السياح ورواد مجتمع Pi الفرصة لحجز العروض المتميزة باستغلال رصيدهم الرقمي.
                </p>

                <div className="pt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 border border-white/10 text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>ضمان وعقود ذكية آمنة</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 border border-white/10 text-xs">
                    <Users className="h-4 w-4 text-pi-gold" />
                    <span>أكثر من 10,000+ مستخدم نشط</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Panel */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ابحث باسم الفندق، المطعم، المدينة أو الوصف..."
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-3.5 pl-4 pr-11 text-sm focus:border-pi-purple focus:bg-white focus:outline-hidden transition-all placeholder-gray-400 font-medium"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Service Type Toggle (Hotel / Restaurant) */}
                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 self-start lg:self-auto gap-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      filterType === 'all' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    عرض الكل
                  </button>
                  <button
                    onClick={() => setFilterType('hotel')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      filterType === 'hotel' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span>🏨 الفنادق والمنتجعات</span>
                  </button>
                  <button
                    onClick={() => setFilterType('restaurant')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      filterType === 'restaurant' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span>🍴 المطاعم الفاخرة</span>
                  </button>
                </div>

              </div>

              {/* City Pill Filter */}
              <div className="space-y-2 pt-2.5 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 block">اختر المدينة أو الوجهة السياحية:</span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedCity === city
                          ? 'bg-pi-purple text-white border-pi-purple shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid of Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    العروض السياحية المتوفرة ({filteredListings.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">انقر للحجز الفوري بواسطة رصيد محفظة Pi الخاصة بك</p>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-16 text-center shadow-xs flex flex-col items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-3 border border-gray-100">
                    <Search className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-base">لم نجد أي عروض مطابقة</h4>
                  <p className="text-xs text-gray-500 max-w-sm mt-1.5 leading-relaxed">
                    لا توجد إعلانات مطابقة لبحثك في "{selectedCity !== 'الكل' ? selectedCity : ''}" حالياً. يمكنك تصفح وجهات أخرى أو إضافة إعلانك بنفسك مجاناً!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onBook={setSelectedListingToBook}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Platform Educational Banner */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <div className="h-9 w-9 bg-pi-purple/10 text-pi-purple rounded-xl flex items-center justify-center mb-1 font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-gray-900 text-sm">نشر مجاني بالكامل</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  بصفتك صاحب فندق، شقة أو مطعم، يمكنك نشر إعلانك في ثوانٍ مجاناً بدون أي تكاليف أو وسيط مالي.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="h-9 w-9 bg-pi-purple/10 text-pi-purple rounded-xl flex items-center justify-center mb-1 font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-gray-900 text-sm">دفع بـ Pi Network</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  يقوم السائح بتحويل قيمة الحجز بعملة Pi مباشرة لمحفظتك من خلال واجهة دفع Sandbox الآمنة والموثقة بالكامل.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="h-9 w-9 bg-pi-purple/10 text-pi-purple rounded-xl flex items-center justify-center mb-1 font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-gray-900 text-sm">تنسيق مباشر ومستمر</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  بعد نجاح الحجز، يظهر رقم الهاتف والواتساب للطرفين لترتيب موعد الوصول وتأكيد التفاصيل دون أي تدخل منا.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY BOOKINGS HISTORY */}
        {activeTab === 'bookings' && (
          <MyBookingsTab bookings={bookings} />
        )}

        {/* TAB 3: PROVIDER DASHBOARD (FREE ADS) */}
        {activeTab === 'provider' && (
          <ProviderDashboard
            listings={listings}
            bookings={bookings}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteListing={handleDeleteListing}
          />
        )}

      </main>

      {/* Footer copyright info */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-gray-100 text-center space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 تطبيق باي تور (PiTour). جميع الحقوق محفوظة لرواد شبكة Pi Network والمطورين.</p>
          <div className="flex gap-4">
            <span className="hover:text-pi-purple cursor-pointer">شروط الاستخدام مجاناً</span>
            <span>•</span>
            <span className="hover:text-pi-purple cursor-pointer">سياسة أمان الدفع</span>
            <span>•</span>
            <span className="hover:text-pi-purple cursor-pointer">تطبيق Pi Browser SDK</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: ADD FREE ADVERTISEMENT */}
      <AddAdModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddListing}
      />

      {/* MODAL 2: PI WALLET TRANSACTION PROCESSOR */}
      <PiWalletPaymentModal
        isOpen={selectedListingToBook !== null}
        listing={selectedListingToBook}
        onClose={() => setSelectedListingToBook(null)}
        onSuccess={handleBookingSuccess}
      />

    </div>
  );
}
