import React, { useState, useEffect } from 'react';
import { Listing, Booking, Review, AppNotification, PlatformSettings, CategoryType } from './types';
import { INITIAL_LISTINGS, INITIAL_REVIEWS, INITIAL_NOTIFICATIONS, INITIAL_SETTINGS, CATEGORIES, POPULAR_CITIES } from './data';
import ListingCard from './components/ListingCard';
import ListingDetailModal from './components/ListingDetailModal';
import AddAdModal from './components/AddAdModal';
import PiWalletPaymentModal from './components/PiWalletPaymentModal';
import MyBookingsTab from './components/MyBookingsTab';
import ProviderDashboard from './components/ProviderDashboard';
import AdminDashboard from './components/AdminDashboard';
import MapViewComponent from './components/MapViewComponent';
import NotificationsModal from './components/NotificationsModal';
import { PI_CONFIG, initPiSDK } from './lib/piNetwork';
import { 
  Compass, Calendar, Building, Search, MapPin, Sparkles, 
  Coins, ShieldCheck, Users, Menu, X, Heart, Bell, Globe, 
  Map as MapIcon, ShieldAlert, Plus, RefreshCw, Star, Layers
} from 'lucide-react';

export default function App() {
  // Language & Localization ('ar' default, 'en' secondary)
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('pitour_lang') as 'ar' | 'en') || 'ar';
  });

  // State initialization with localStorage
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('pitour_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('pitour_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('pitour_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pitour_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('pitour_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('pitour_favorites');
    return saved ? JSON.parse(saved) : ['1', '5'];
  });

  // Active Main View Tab
  const [activeTab, setActiveTab] = useState<'browse' | 'map' | 'favorites' | 'bookings' | 'provider' | 'admin'>('browse');

  // Filters
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [selectedListingToBook, setSelectedListingToBook] = useState<Listing | null>(null);
  const [bookingParams, setBookingParams] = useState<{ date: string; guests: number }>({
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 1
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pi Network Auth State
  const [piUser, setPiUser] = useState<any>(() => {
    const saved = localStorage.getItem('pi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pitour_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('pitour_listings', JSON.stringify(listings));
    // Optionally sync with backend
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listings)
    }).catch(() => {});
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('pitour_bookings', JSON.stringify(bookings));
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookings)
    }).catch(() => {});
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('pitour_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('pitour_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pitour_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pitour_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Pi Auth Flow
  const authenticatePi = async () => {
    setAuthLoading(true);
    try {
      const PiObj = (window as any).Pi;
      if (PiObj && typeof PiObj.authenticate === 'function') {
        initPiSDK();
        const authResult = await PiObj.authenticate(['username'], (p: any) => console.log('Incomplete payment:', p));
        if (authResult?.user) {
          setPiUser(authResult.user);
          localStorage.setItem('pi_user', JSON.stringify(authResult.user));
        }
      } else {
        // Fallback testnet user profile for browser previews
        const testUser = { uid: 'pi_pioneer_99', username: 'Pioneer_Explorer' };
        setPiUser(testUser);
        localStorage.setItem('pi_user', JSON.stringify(testUser));
      }
    } catch (e) {
      console.warn('Pi auth fallback:', e);
      const testUser = { uid: 'pi_pioneer_99', username: 'Pioneer_Explorer' };
      setPiUser(testUser);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!piUser) {
      authenticatePi();
    }
  }, []);

  // Handlers
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
    // Add Notification
    setNotifications(prev => [
      {
        id: 'n_' + Date.now(),
        title: 'تم نشر إعلانك المجاني بنجاح 🚀',
        titleEn: 'Your Free Ad Published Successfully 🚀',
        message: `تم إضافة "${newListing.title}" إلى المنصة وهو متاح الآن للسياح للحجز بالباي.`,
        messageEn: `"${newListing.title}" was published and available for tourists.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'listing'
      },
      ...prev
    ]);
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleApproveListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'approved', isActive: true } : l));
  };

  const handleRejectListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected', isActive: false } : l));
  };

  const handleToggleListingActive = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const handleToggleListingFeatured = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, isFeatured: !l.isFeatured } : l));
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleAddReview = (newRev: Omit<Review, 'id' | 'date'>) => {
    const fullRev: Review = {
      ...newRev,
      id: 'r_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [fullRev, ...prev]);
  };

  const handlePaymentSuccess = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    setNotifications(prev => [
      {
        id: 'n_' + Date.now(),
        title: 'تأكيد حجز جديد بعملة باي ⚡',
        titleEn: 'New Pi Booking Confirmed ⚡',
        message: `تم الحجز بنجاح لـ ${booking.listingTitle} بخصم π ${booking.totalPrice} من محفظتك.`,
        messageEn: `Successfully booked ${booking.listingTitle} for π ${booking.totalPrice}.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'payment'
      },
      ...prev
    ]);
  };

  const handleResetData = () => {
    if (confirm(language === 'en' ? 'Reset to default marketplace data?' : 'هل تريد إعادة ضبط بيانات المنصة للافتراضي؟')) {
      localStorage.clear();
      setListings(INITIAL_LISTINGS);
      setBookings([]);
      setReviews(INITIAL_REVIEWS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSettings(INITIAL_SETTINGS);
      setFavorites(['1', '5']);
      window.location.reload();
    }
  };

  // Filter listings
  const filteredListings = listings.filter(l => {
    if (l.isActive === false) return false;
    const matchesCity = selectedCity === 'الكل' || l.city === selectedCity || l.cityEn === selectedCity;
    const matchesCategory = selectedCategory === 'all' || l.type === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      l.title.toLowerCase().includes(query) || 
      (l.titleEn && l.titleEn.toLowerCase().includes(query)) ||
      l.city.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query);

    return matchesCity && matchesCategory && matchesSearch;
  });

  const favoriteListings = listings.filter(l => favorites.includes(l.id));
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('browse')} 
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-pi-dark to-pi-purple flex items-center justify-center text-white shadow-md shadow-pi-purple/20 group-hover:scale-105 transition-transform">
                <Compass className="h-6 w-6 text-pi-gold stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-pi-purple to-purple-900 bg-clip-text text-transparent block tracking-tight">
                  Pi Tour
                </span>
                <span className="text-[10px] font-extrabold text-amber-600 block -mt-1 tracking-wider uppercase">
                  Marketplace 🌴
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'browse' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>{language === 'en' ? 'Explore' : 'استكشف العروض'}</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'map' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapIcon className="h-4 w-4 text-emerald-600" />
                <span>{language === 'en' ? 'Interactive Map' : 'خريطة المعالم'}</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 relative ${
                  activeTab === 'favorites' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{language === 'en' ? 'Favorites' : 'المفضلة'}</span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 relative ${
                  activeTab === 'bookings' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 text-pi-purple" />
                <span>{language === 'en' ? 'My Bookings' : 'حجوزاتي'}</span>
                {bookings.length > 0 && (
                  <span className="bg-pi-purple text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {bookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('provider')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'provider' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building className="h-4 w-4 text-amber-500" />
                <span>{language === 'en' ? 'Providers Portal' : 'لوحة أصحاب الخدمات'}</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'bg-white text-pi-purple shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
                <span>{language === 'en' ? 'Admin' : 'الإدارة'}</span>
              </button>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Add Free Ad Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-pi-gold to-amber-400 hover:from-amber-400 hover:to-pi-gold text-pi-dark font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-pi-gold/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span className="hidden sm:inline">{language === 'en' ? 'Post Free Ad' : 'إضافة إعلان مجاني'}</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="تغيير اللغة Switch Language"
              >
                <Globe className="h-4 w-4 text-pi-purple" />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Pi User Badge */}
              <div className="hidden md:flex items-center gap-2 bg-purple-50 border border-purple-100 p-1.5 px-3 rounded-2xl">
                <div className="h-7 w-7 rounded-full bg-pi-purple text-white text-xs font-bold flex items-center justify-center font-mono">
                  π
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-gray-900 block leading-tight">
                    {piUser?.username || 'Pioneer User'}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold block">
                    {language === 'en' ? 'Pi Wallet Connected' : 'محفظة Pi متصلة'}
                  </span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white p-4 space-y-2 animate-in slide-in-from-top-2">
            <button
              onClick={() => { setActiveTab('browse'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'browse' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <Compass className="h-4 w-4" />
              <span>استكشف كافة العروض</span>
            </button>
            <button
              onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'map' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <MapIcon className="h-4 w-4 text-emerald-500" />
              <span>خريطة المعالم التفاعلية</span>
            </button>
            <button
              onClick={() => { setActiveTab('favorites'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'favorites' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span>المفضلة ({favorites.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'bookings' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <Calendar className="h-4 w-4" />
              <span>حجوزاتي المؤكدة ({bookings.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('provider'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'provider' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <Building className="h-4 w-4 text-amber-500" />
              <span>لوحة أصحاب الفنادق والخدمات</span>
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2.5 ${activeTab === 'admin' ? 'bg-pi-purple text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              <span>لوحة الإدارة الإدارية</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* TAB 1: BROWSE / HOME */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* HERO BANNER SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pi-dark via-pi-purple to-purple-950 text-white p-6 sm:p-10 md:p-12 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-pi-gold/20 backdrop-blur-xs text-pi-gold border border-pi-gold/30 px-3.5 py-1.5 rounded-full text-xs font-black">
                  <Sparkles className="h-3.5 w-3.5 text-pi-gold" />
                  <span>{language === 'en' ? 'First Tourism Marketplace on Pi Network' : 'أول سوق سياحي حر يدعم الدفع المباشر بالباي'}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  {language === 'en' 
                    ? 'Book Hotels, Rent Cars & Explore Tours with Pi' 
                    : 'احجز أفضل الفنادق، المطاعم والرحلات مجاناً وبدون عمولات بأمان'}
                </h1>

                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-xl">
                  {language === 'en'
                    ? 'A complete tourism ecosystem where business owners list services for free, and pioneers book with Pi Wallet.'
                    : 'منصة تجمع الفنادق، الشقق المفروشة، المطاعم، المرشدين السياحيين، وتأجير السيارات. أعلن عن خدماتك مجاناً واستقبل الحجوزات بعملة Pi.'}
                </p>

                {/* Hero Search Bar */}
                <div className="pt-2">
                  <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 w-full text-gray-800">
                      <Search className="h-5 w-5 text-pi-purple shrink-0" />
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Search hotels, cities, tours...' : 'ابحث عن فندق، شقة، مطعم، أو مدينة...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs sm:text-sm font-semibold bg-transparent focus:outline-none placeholder-gray-400 py-2"
                      />
                    </div>

                    <button
                      onClick={() => {}}
                      className="w-full sm:w-auto bg-pi-gold hover:bg-pi-gold-hover text-pi-dark font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      {language === 'en' ? 'Search Now' : 'بحث سريع'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Decorative Background Effects */}
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pi-purple/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-pi-gold/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* CATEGORIES GRID (10 Categories) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-pi-purple" />
                  <span>{language === 'en' ? 'Tourism Categories' : 'تصنيفات الخدمات السياحية المتاحة'}</span>
                </h3>
                <span className="text-xs font-bold text-gray-400">10 {language === 'en' ? 'Categories' : 'تصنيفات'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-3 rounded-2xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-pi-purple text-white border-pi-purple shadow-md shadow-pi-purple/20'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="h-5 w-5 text-pi-gold" />
                  <span className="text-xs font-bold">{language === 'en' ? 'All' : 'جميع العروض'}</span>
                </button>

                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-pi-purple text-white border-pi-purple shadow-md shadow-pi-purple/20'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Building className="h-5 w-5 text-pi-purple opacity-90" />
                    <span className="text-[11px] font-bold truncate max-w-[85px]">
                      {language === 'en' ? cat.labelEn : cat.labelAr}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CITIES FILTER CHIPS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold text-gray-400 shrink-0 ml-1">📍 {language === 'en' ? 'City:' : 'المدينة:'}</span>
              {POPULAR_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    selectedCity === city
                      ? 'bg-pi-gold text-pi-dark border-pi-gold shadow-xs'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* FEATURED SERVICES LISTINGS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {language === 'en' ? 'Featured Tourism Services' : 'أبرز الحجوزات والخدمات المتاحة'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {filteredListings.length} {language === 'en' ? 'services found' : 'عرض متاح يدعم الدفع المباشر بالباي'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('map')}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MapIcon className="h-4 w-4 text-emerald-600" />
                    <span className="hidden sm:inline">{language === 'en' ? 'View Map' : 'عرض الخريطة'}</span>
                  </button>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                  <Search className="h-10 w-10 text-gray-300 mx-auto" />
                  <h4 className="font-extrabold text-sm text-gray-800">لم نجد نتائج مطابقة لبحثك</h4>
                  <p className="text-xs text-gray-400">جرب تغيير المدينة أو اختيار تصنيف آخر</p>
                  <button
                    onClick={() => { setSelectedCity('الكل'); setSelectedCategory('all'); setSearchQuery(''); }}
                    className="bg-purple-50 text-pi-purple text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-100 cursor-pointer"
                  >
                    إلغاء تصفية البحث
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onSelect={(item) => setSelectedListingDetail(item)}
                      onBook={(item) => setSelectedListingToBook(item)}
                      isFavorite={favorites.includes(listing.id)}
                      onToggleFavorite={handleToggleFavorite}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
              <h2 className="text-lg font-black text-gray-900">
                {language === 'en' ? 'Interactive Tourism Map' : 'خريطة المعالم والفنادق التفاعلية'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                تصفح أماكن الفنادق، المعالم والمطاعم مباشرة على الخريطة مع إمكانية الحجز الفوري
              </p>
            </div>

            <MapViewComponent
              listings={listings}
              onSelectListing={(item) => setSelectedListingDetail(item)}
              language={language}
            />
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span>{language === 'en' ? 'Saved Favorites' : 'العروض المحفوظة بالمفضلة'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                الخدمات والفنادق التي قمت بحفظها للرجوع إليها سريعاً
              </p>
            </div>

            {favoriteListings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                <Heart className="h-10 w-10 text-gray-300 mx-auto" />
                <h4 className="font-extrabold text-sm text-gray-800">قائمة المفضلة فارغة حالياً</h4>
                <p className="text-xs text-gray-400">انقر على أيقونة القلب في أي إعلان لحفظه هنا</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteListings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={(item) => setSelectedListingDetail(item)}
                    onBook={(item) => setSelectedListingToBook(item)}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <MyBookingsTab bookings={bookings} language={language} />
        )}

        {/* TAB 5: PROVIDER DASHBOARD */}
        {activeTab === 'provider' && (
          <ProviderDashboard
            listings={listings}
            bookings={bookings}
            onDeleteListing={handleDeleteListing}
            onDeleteBooking={handleDeleteBooking}
            onResetListings={handleResetData}
            language={language}
          />
        )}

        {/* TAB 6: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            listings={listings}
            bookings={bookings}
            settings={settings}
            onUpdateSettings={setSettings}
            onApproveListing={handleApproveListing}
            onRejectListing={handleRejectListing}
            onToggleListingActive={handleToggleListingActive}
            onToggleListingFeatured={handleToggleListingFeatured}
            onDeleteListing={handleDeleteListing}
            onDeleteBooking={handleDeleteBooking}
            onResetData={handleResetData}
            language={language}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-pi-purple text-white flex items-center justify-center text-xs font-black">
              π
            </div>
            <span className="font-extrabold text-sm text-gray-900">Pi Tour Tourism Marketplace</span>
          </div>
          <p className="text-xs text-gray-400">
            {language === 'en' 
              ? 'Powered by Pi Network Ecosystem • Free Advertising Platform for Tourism Businesses' 
              : 'منصة تسويق وحجوزات سياحية حرة تدعم الدفع الفوري بمحفظة باي نيتورك بالكامل'}
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <ListingDetailModal
        listing={selectedListingDetail}
        isOpen={!!selectedListingDetail}
        onClose={() => setSelectedListingDetail(null)}
        onBook={(listing, date, guests) => {
          setSelectedListingDetail(null);
          setBookingParams({ date, guests });
          setSelectedListingToBook(listing);
        }}
        isFavorite={selectedListingDetail ? favorites.includes(selectedListingDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        reviews={reviews}
        onAddReview={handleAddReview}
        language={language}
      />

      <AddAdModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddListing={handleAddListing}
        language={language}
      />

      <PiWalletPaymentModal
        listing={selectedListingToBook}
        bookingDetails={bookingParams}
        settings={settings}
        isOpen={!!selectedListingToBook}
        onClose={() => setSelectedListingToBook(null)}
        onPaymentSuccess={handlePaymentSuccess}
        language={language}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        language={language}
      />

    </div>
  );
}
