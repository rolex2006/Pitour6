import React, { useState } from 'react';
import { Listing, Booking, PlatformSettings } from '../types';
import { CATEGORIES } from '../data';
import { 
  ShieldAlert, Settings, Coins, Building, CheckCircle2, XCircle, 
  Trash2, Eye, Star, Filter, Layers, Plus, RotateCcw, Lock, Unlock, 
  TrendingUp, Sparkles, Check, RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  listings: Listing[];
  bookings: Booking[];
  settings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onToggleListingActive: (id: string) => void;
  onToggleListingFeatured: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onDeleteBooking: (id: string) => void;
  onResetData?: () => void;
  language: 'ar' | 'en';
}

export default function AdminDashboard({
  listings,
  bookings,
  settings,
  onUpdateSettings,
  onApproveListing,
  onRejectListing,
  onToggleListingActive,
  onToggleListingFeatured,
  onDeleteListing,
  onDeleteBooking,
  onResetData,
  language
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'settings'>('overview');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Passcode verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Metrics Calculations
  const totalVolumeInPi = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalCommissionInPi = bookings.reduce((sum, b) => sum + (b.platformFee || b.totalPrice * (settings.commissionPercentage / 100)), 0);
  const pendingApprovalsCount = listings.filter(l => l.status === 'pending').length;

  const filteredListings = listings.filter(l => {
    const matchesCategory = filterType === 'all' || l.type === filterType;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 text-center">
        <div className="h-16 w-16 bg-pi-purple/10 text-pi-purple rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="h-8 w-8 text-pi-purple" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            {language === 'en' ? 'Admin Control Panel' : 'لوحة الإدارة الإدارية لمنصة Pi Tour'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'en' ? 'Enter passcode to access app settings and moderation' : 'أدخل رمز المرور للوصول المباشر للوحة الإدارة والتحكم الكامل بالخدمات والعمولات'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder={language === 'en' ? 'Enter passcode (default: 1234)' : 'أدخل رمز المرور (الافتراضي: 1234)'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-center text-sm font-mono font-bold bg-gray-50 p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-pi-purple"
            />
          </div>
          {authError && (
            <p className="text-xs text-red-500 font-bold">
              {language === 'en' ? 'Invalid passcode! Try 1234' : 'رمز المرور غير صحيح! الرمز الافتراضي هو 1234'}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-pi-purple text-white font-extrabold py-3.5 rounded-2xl text-sm hover:bg-pi-purple-hover transition-all shadow-md shadow-pi-purple/10 cursor-pointer"
          >
            {language === 'en' ? 'Access Admin Dashboard' : 'دخول لوحة التحكم الإدارية'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pi-dark via-pi-purple to-purple-950 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 bg-pi-gold/20 text-pi-gold px-3 py-1 rounded-full text-xs font-bold w-fit">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Platform Administrator' : 'المشرف الإداري العام'}</span>
          </div>
          <h2 className="text-2xl font-black">
            {language === 'en' ? 'Pi Tour Marketplace Admin' : 'لوحة التحكم المركزية لمنصة باي تور'}
          </h2>
          <p className="text-xs text-purple-200 leading-relaxed">
            إدارة كافة الإعلانات، الموافقة على الخدمات، تغيير نسبة عمولة المنصة، متابعة حجم المعاملات والمحفظة الرقمية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onResetData && (
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{language === 'en' ? 'Reset App Data' : 'إعادة ضبط البيانات'}</span>
            </button>
          )}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>{language === 'en' ? 'Lock Panel' : 'قفل اللوحة'}</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{language === 'en' ? 'Overview & Revenue' : 'الإحصائيات والأرباح'}</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'listings' ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>{language === 'en' ? 'Manage Listings' : 'إدارة الإعلانات والخدمات'}</span>
          {pendingApprovalsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bookings' ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Coins className="h-4 w-4" />
          <span>{language === 'en' ? 'Bookings & Transactions' : 'الحجوزات والمدفوعات'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-pi-purple text-white shadow-xs' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>{language === 'en' ? 'Commission & System' : 'عمولة المنصة والإعدادات'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-400 block">{language === 'en' ? 'Total Volume in Pi' : 'إجمالي حجم التداولات بالحجوزات'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-pi-purple font-mono">π {totalVolumeInPi.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-gray-400 block">{bookings.length} {language === 'en' ? 'transactions' : 'معاملة حجز ناجحة'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-400 block">{language === 'en' ? 'Platform Revenue (Commission)' : 'أرباح المنصة المكتسبة'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-600 font-mono">π {totalCommissionInPi.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-emerald-600 block">نسبة العمولة الحالية: {settings.commissionPercentage}%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-400 block">{language === 'en' ? 'Active Listings' : 'إجمالي الخدمات المنشورة'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-800 font-mono">{listings.length}</span>
              </div>
              <span className="text-[10px] text-gray-400 block">عبر {CATEGORIES.length} تصنيفات سياحية</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-400 block">{language === 'en' ? 'Pending Approvals' : 'إعلانات بانتظار الموافقة'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-500 font-mono">{pendingApprovalsCount}</span>
              </div>
              <span className="text-[10px] text-gray-400 block">مراجعة سريعة فورية</span>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by title or city...' : 'بحث في الإعلانات حسب الاسم أو المدينة...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-48 text-xs font-bold bg-gray-50 p-2.5 rounded-xl border border-gray-200"
            >
              <option value="all">جميع التصنيفات ({listings.length})</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{language === 'en' ? c.labelEn : c.labelAr}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-bold">
                  <tr>
                    <th className="p-3.5">الخدمة / الإعلان</th>
                    <th className="p-3.5">التصنيف</th>
                    <th className="p-3.5">السعر بالباي</th>
                    <th className="p-3.5">المدينة</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {filteredListings.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3.5 font-bold flex items-center gap-2.5">
                        <img src={item.image} alt="thumb" className="w-10 h-10 object-cover rounded-xl shrink-0" />
                        <div>
                          <div className="font-extrabold text-gray-900">{item.title}</div>
                          {item.isCustom && <span className="text-[10px] text-pi-purple font-semibold">مضاف من صاحب خدمة</span>}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-600">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold font-mono text-pi-purple">π {item.price}</td>
                      <td className="p-3.5 text-gray-600">{item.city}</td>
                      <td className="p-3.5">
                        {item.status === 'pending' ? (
                          <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                            معلق
                          </span>
                        ) : item.isActive !== false ? (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                            نشط ومقبول
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200">
                            معطل
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.status === 'pending' && (
                            <button
                              onClick={() => onApproveListing(item.id)}
                              title="قبول الإعلان"
                              className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-100 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onToggleListingActive(item.id)}
                            title={item.isActive !== false ? "تعطيل الإعلان" : "تفعيل الإعلان"}
                            className="bg-gray-100 text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                          >
                            {item.isActive !== false ? <Unlock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-gray-400" />}
                          </button>
                          <button
                            onClick={() => onToggleListingFeatured(item.id)}
                            title="مميز بالرئيسية"
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              item.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:text-amber-500'
                            }`}
                          >
                            <Star className={`h-4 w-4 ${item.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => onDeleteListing(item.id)}
                            title="حذف النهائي"
                            className="bg-red-50 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-extrabold text-sm text-gray-900 flex justify-between items-center">
              <span>{language === 'en' ? 'Complete Transactions Log' : 'سجل كافة الحجوزات المنجزة'}</span>
              <span className="text-xs font-mono text-pi-purple">{bookings.length} {language === 'en' ? 'bookings' : 'حجز'}</span>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                {language === 'en' ? 'No bookings recorded yet' : 'لا توجد حجوزات مسجلة حتى الآن'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-bold">
                    <tr>
                      <th className="p-3.5">معرف الحجز</th>
                      <th className="p-3.5">العنوان / الخدمة</th>
                      <th className="p-3.5">اسم السائح</th>
                      <th className="p-3.5">الهاتف</th>
                      <th className="p-3.5">الإجمالي (π)</th>
                      <th className="p-3.5">عمولة المنصة</th>
                      <th className="p-3.5">صافي المزود</th>
                      <th className="p-3.5">التاريخ</th>
                      <th className="p-3.5 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/60">
                        <td className="p-3.5 font-mono text-gray-400">{b.id}</td>
                        <td className="p-3.5 font-bold text-gray-900">{b.listingTitle}</td>
                        <td className="p-3.5">{b.touristName}</td>
                        <td className="p-3.5 font-mono">{b.touristPhone}</td>
                        <td className="p-3.5 font-bold font-mono text-pi-purple">π {b.totalPrice}</td>
                        <td className="p-3.5 font-bold font-mono text-emerald-600">π {(b.platformFee || b.totalPrice * 0.05).toFixed(2)}</td>
                        <td className="p-3.5 font-bold font-mono text-gray-700">π {(b.providerAmount || b.totalPrice * 0.95).toFixed(2)}</td>
                        <td className="p-3.5 text-gray-500">{b.bookingDate}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => onDeleteBooking(b.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="حذف الحجز"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-6 max-w-xl">
          <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">
            {language === 'en' ? 'Platform Commission & Wallet Setup' : 'إعدادات نسبة العمولة ومحفظة الاستقبال'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {language === 'en' ? 'Platform Commission Percentage (%)' : 'نسبة اقتطاع المنصة (%)'}
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={settings.commissionPercentage}
                onChange={(e) => onUpdateSettings({ ...settings, commissionPercentage: Number(e.target.value) })}
                className="w-full text-sm font-mono font-bold bg-gray-50 p-3 rounded-xl border border-gray-200"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                عند قيام السائح بالحجز، تقتطع المنصة تلقائياً هذه النسبة وتصل المتبقي لصاحب الفندق أو الخدمة.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {language === 'en' ? 'Platform Wallet Address for Commissions' : 'عنوان محفظة المنصة الرئيسية المعتمدة'}
              </label>
              <input
                type="text"
                value={settings.platformWalletAddress}
                onChange={(e) => onUpdateSettings({ ...settings, platformWalletAddress: e.target.value })}
                className="w-full text-xs font-mono bg-gray-50 p-3 rounded-xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
