import { Listing, CategoryType, Review, AppNotification, PlatformSettings } from './types';

export interface CategoryInfo {
  id: CategoryType;
  labelAr: string;
  labelEn: string;
  iconName: string;
  unitAr: string;
  unitEn: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'hotel', labelAr: 'فنادق', labelEn: 'Hotels', iconName: 'Hotel', unitAr: '/ ليلة', unitEn: '/ night' },
  { id: 'apartment', labelAr: 'شقق مفروشة', labelEn: 'Apartments', iconName: 'Building', unitAr: '/ يوم', unitEn: '/ day' },
  { id: 'restaurant', labelAr: 'مطاعم', labelEn: 'Restaurants', iconName: 'Utensils', unitAr: '/ وجبة', unitEn: '/ meal' },
  { id: 'attraction', labelAr: 'معالم سياحية', labelEn: 'Attractions', iconName: 'Compass', unitAr: '/ تذكرة', unitEn: '/ ticket' },
  { id: 'car_rental', labelAr: 'تأجير سيارات', labelEn: 'Car Rentals', iconName: 'Car', unitAr: '/ يوم', unitEn: '/ day' },
  { id: 'tour_guide', labelAr: 'مرشدون سياحيون', labelEn: 'Tour Guides', iconName: 'UserCheck', unitAr: '/ جولة', unitEn: '/ tour' },
  { id: 'agency', labelAr: 'وكالات سفر', labelEn: 'Travel Agencies', iconName: 'Plane', unitAr: '/ باقة', unitEn: '/ package' },
  { id: 'transport', labelAr: 'مواصلات', labelEn: 'Transport', iconName: 'Bus', unitAr: '/ رحلة', unitEn: '/ trip' },
  { id: 'activity', labelAr: 'أنشطة وفعاليات', labelEn: 'Activities', iconName: 'Sparkles', unitAr: '/ شخص', unitEn: '/ person' },
  { id: 'cruise', labelAr: 'رحلات بحرية', labelEn: 'Cruises', iconName: 'Ship', unitAr: '/ رحلة', unitEn: '/ cruise' },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  commissionPercentage: 5, // 5% platform commission
  requireAdApproval: false,
  platformWalletAddress: 'GBPI...TOUR...PLATFORM...WALLET'
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'فندق ريتز كارلتون الرياض',
    titleEn: 'The Ritz-Carlton Riyadh',
    type: 'hotel',
    description: 'تجربة ضيافة ملكية فاخرة في قلب العاصمة الرياض. يتميز الفندق بحدائقه الواسعة ومسبحه الداخلي المصمم على طراز الواحات، بالإضافة إلى خدمات استثنائية تناسب الباحثين عن الرفاهية الكاملة.',
    descriptionEn: 'A luxury royal hospitality experience in the heart of Riyadh. Features lush gardens, an indoor oasis-style pool, and world-class fine dining.',
    city: 'الرياض',
    cityEn: 'Riyadh',
    price: 12,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200'
    ],
    amenities: ['مسبح مغلق', 'سبا فاخر', 'إنترنت مجاني', 'مواقف سيارات', 'خدمة غرف 24 ساعة', 'إطلالة حديقة'],
    contact: '+966 11 802 8020',
    reviewsCount: 148,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 24.6653,
    lng: 46.6267
  },
  {
    id: '2',
    title: 'شقق ذا روز فيو الفندقية - دبي',
    titleEn: 'The Rose View Luxury Apartments - Dubai',
    type: 'apartment',
    description: 'شقق مفروشة بديكورات مودرن فاخرة مع إطلالة بانورامية على برج خليفة ونافورة دبي. تشمل مطبخاً مجهزاً بالكامل وصالة معيشة واسعة تناسب العائلات.',
    descriptionEn: 'Modern furnished luxury apartment with panoramic views of Burj Khalifa and Dubai Fountain. Fully equipped kitchen and spacious living room for families.',
    city: 'دبي',
    cityEn: 'Dubai',
    price: 9.5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200'
    ],
    amenities: ['إطلالة برج خليفة', 'مطبخ مجهز', 'غسالة ملابس', 'مسبح بالسطح', 'نادي رياضي', 'أمن 24 ساعة'],
    contact: '+971 4 388 9000',
    reviewsCount: 88,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 25.1972,
    lng: 55.2744
  },
  {
    id: '3',
    title: 'منتجع وسبا موفنبيك جدة',
    titleEn: 'Mövenpick Resort & Spa Jeddah',
    type: 'hotel',
    description: 'استمتع بإطلالة ساحرة ومباشرة على ساحل البحر الأحمر بمدينة جدة. يوفر المنتجع غرفاً عصرية، ومطاعم متنوعة تقدم أشهى المأكولات البحرية والعالمية مع أجواء عائلية مريحة للغاية.',
    descriptionEn: 'Enjoy stunning Red Sea coastal views in Jeddah. Modern rooms, diverse seafood restaurants, and family-friendly amenities.',
    city: 'جدة',
    cityEn: 'Jeddah',
    price: 8.5,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200',
    amenities: ['شاطئ خاص', 'مسبح خارجي', 'مركز ألعاب أطفال', 'نادي صحي', 'بوفيه مفتوح'],
    contact: '+966 12 667 6655',
    reviewsCount: 95,
    isFeatured: false,
    status: 'approved',
    isActive: true,
    lat: 21.5433,
    lng: 39.1728
  },
  {
    id: '4',
    title: 'مطعم لوسين الأرمني الفاخر',
    titleEn: 'Lusin Fine Armenian Restaurant',
    type: 'restaurant',
    description: 'يقدم مطعم لوسين تجربة طعام أرمنية فريدة مع لمسة عصرية. يشتهر بتقديم الأطباق التقليدية مثل المانتي والكباب بالكرز والتبولة في أجواء راقية ودافئة تناسب العائلات والأصدقاء.',
    descriptionEn: 'Offers a unique Armenian culinary experience with a modern twist. Famous for Cherry Kebab, Manti, and elegant ambient seating.',
    city: 'الرياض',
    cityEn: 'Riyadh',
    price: 1.8,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    amenities: ['جلسات داخلية وخارجية', 'موسيقى هادئة', 'أطباق خاصة للفيجن', 'مواقف سيارات مجانية'],
    contact: '+966 9200 02690',
    reviewsCount: 312,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 24.6970,
    lng: 46.6853
  },
  {
    id: '5',
    title: 'جولة الحِجر التاريخية بالعُلا',
    titleEn: 'Hegra Historic Guided Tour - AlUla',
    type: 'attraction',
    description: 'استكشف أول موقع للتراث العالمي لليونسكو في المملكة العربية السعودية. جولة إرشادية بين المقابر النبطية المنحوتة في الصخور والواحات الصحراوية الساحرة.',
    descriptionEn: 'Discover Saudi Arabia’s first UNESCO World Heritage site. Guided tours through ancient Nabataean rock-cut tombs and stunning desert oases.',
    city: 'العُلا',
    cityEn: 'AlUla',
    price: 3.5,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&q=80&w=1200',
    amenities: ['مرشد سياحي معتمد', 'حافلات مكيفة', 'وجبات خفيفة ومشروبات', 'تصوير احترافي'],
    contact: '+966 9200 25000',
    reviewsCount: 165,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 26.8014,
    lng: 37.9575
  },
  {
    id: '6',
    title: 'خدمة التأجير الفاخر - مرسيدس S-Class',
    titleEn: 'Luxury Car Rental - Mercedes S-Class',
    type: 'car_rental',
    description: 'تأجير سيارات فارهة بالسائق أو بدون سائق لتنقلات رجال الأعمال والسياحة الفاخرة بين المدن والمطارات برحلات مريحة وآمنة.',
    descriptionEn: 'Premium luxury car rental with or without chauffeur for VIP business travelers and tourists between airports and cities.',
    city: 'جدة',
    cityEn: 'Jeddah',
    price: 4.2,
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
    amenities: ['سائق محترف خبير', 'تأمين شامل', 'إنترنت بالسيارة', 'توصيل للمطار مجاناً'],
    contact: '+966 50 123 4567',
    reviewsCount: 74,
    isFeatured: false,
    status: 'approved',
    isActive: true,
    lat: 21.5169,
    lng: 39.2192
  },
  {
    id: '7',
    title: 'المرشد السياحي المعتمد د. طارق المغربي',
    titleEn: 'Certified Tour Guide - Dr. Tariq Al-Maghribi',
    type: 'tour_guide',
    description: 'مرشد سياحي يتحدث العربية والإنجليزية والفرنسية، متخصص في التاريخ الأندلسي والمعالم التاريخية في مراكش وفاس وطنجة مع برنامج مخصص حسب طلب السائح.',
    descriptionEn: 'Multilingual certified tour guide specializing in Andalusian history and heritage sites across Marrakech, Fes, and Tangier.',
    city: 'مراكش',
    cityEn: 'Marrakech',
    price: 2.0,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    amenities: ['يتحدث 3 لغات', 'برنامج مخصص', 'مرونة بالوقت', 'مساعدة بالحجوزات'],
    contact: '+212 612-345678',
    reviewsCount: 92,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 31.6295,
    lng: -7.9811
  },
  {
    id: '8',
    title: 'رحلة يخوت بحرية في شرم الشيخ والغروب',
    titleEn: 'Red Sea Sunset Yacht Cruise - Sharm El Sheikh',
    type: 'cruise',
    description: 'رحلة بحرية فاخرة على متن يخت ملكي في خليج نعمة ومحمية رأس محمد. تشمل الغوص بين الشعب المرجانية الملونة، وبوفيه مأكولات بحرية طازجة مع الاستمتاع بآ آفق الغروب الساحر.',
    descriptionEn: 'Luxury sunset yacht cruise in Naama Bay and Ras Mohammed Reserve. Includes coral reef snorkeling, seafood buffet, and sunset viewing.',
    city: 'شرم الشيخ',
    cityEn: 'Sharm El Sheikh',
    price: 3.2,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
    amenities: ['معدات غوص كاملة', 'بوفيه بحري طازج', 'مشروبات باردة دافئة', 'طاقم مدرب للحماية'],
    contact: '+20 106 789 0123',
    reviewsCount: 118,
    isFeatured: true,
    status: 'approved',
    isActive: true,
    lat: 27.9158,
    lng: 34.3299
  },
  {
    id: '9',
    title: 'تجربة الطيران الشراعي والتخييم الصحراوي',
    titleEn: 'Desert Paragliding & Camping Adventure',
    type: 'activity',
    description: 'مغامرة مشوقة تحلق في سماء الصحراء الذهبية ثم تقضي أمسية بدوية ساحرة تحت النجوم مع شواء طازج وعزف عود وحكايات تراثية عربية.',
    descriptionEn: 'Thrilling desert paragliding followed by an authentic Bedouin starry night camping, BBQ dinner, and live traditional music.',
    city: 'الرياض',
    cityEn: 'Riyadh',
    price: 2.5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200',
    amenities: ['مدرب طيران معتمد', 'عشاء شواء فاخر', 'معدات تخييم كاملة', 'نقل بدفع رباعي'],
    contact: '+966 55 987 6543',
    reviewsCount: 56,
    isFeatured: false,
    status: 'approved',
    isActive: true,
    lat: 24.8000,
    lng: 46.7000
  },
  {
    id: '10',
    title: 'وكالة فرسان السفر والسياحة الدولية',
    titleEn: 'Fursan International Travel Agency',
    type: 'agency',
    description: 'باقات تنظيم رحلات متكاملة تشمل تذاكر الطيران، التأشيرات السياحية، حجز الفنادق الفاخرة والتنقلات مع دعم ومتابعة على مدار الساعة.',
    descriptionEn: 'Comprehensive travel packages including flight ticketing, tourist visa assistance, luxury hotel stays, and 24/7 dedicated support.',
    city: 'القاهرة',
    cityEn: 'Cairo',
    price: 5.0,
    rating: 4.75,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200',
    amenities: ['استخراج تأشيرات', 'استقبال في المطار', 'تذاكر طيران مخفضة', 'دعم 24/7'],
    contact: '+20 2 2790 0000',
    reviewsCount: 84,
    isFeatured: false,
    status: 'approved',
    isActive: true,
    lat: 30.0444,
    lng: 31.2357
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    listingId: '1',
    userName: 'أحمد الغامدي',
    rating: 5,
    comment: 'تجربة إقامة خيالية بالريتز. الخدمة والدفع بعملة Pi كانتا بسلاسة وسرعة فائقة!',
    date: '2026-07-20'
  },
  {
    id: 'r2',
    listingId: '1',
    userName: 'سارة خالد',
    rating: 5,
    comment: 'فندق فخم جداً والأجواء هادئة، أنصح بالحجز من خلال تطبيق باي تور.',
    date: '2026-07-18'
  },
  {
    id: 'r3',
    listingId: '4',
    userName: 'محمد المري',
    rating: 4,
    comment: 'الطعام الأرمني ممتاز ولذيذ للغاية، والدفع المباشر بالباي ورك يسهل التجربة.',
    date: '2026-07-15'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'مرحباً بك في منصة باي تور 🌴',
    titleEn: 'Welcome to Pi Tour Marketplace 🌴',
    message: 'أول منصة سياحية وحجوزات يدعمها مجتمع Pi Network بالكامل.',
    messageEn: 'The first complete tourism and booking marketplace powered by Pi Network.',
    date: '2026-07-23',
    read: false,
    type: 'system'
  },
  {
    id: 'n2',
    title: 'شبكة الدفع الاختبارية جاهزة ⚡',
    titleEn: 'Pi Testnet Payment Ready ⚡',
    message: 'يمكنك الآن اختبار الحجز والدفع المباشر بعملة Pi بسهولة.',
    messageEn: 'You can test booking and direct Pi payments smoothly.',
    date: '2026-07-22',
    read: true,
    type: 'payment'
  }
];

export const POPULAR_CITIES = ['الكل', 'الرياض', 'جدة', 'دبي', 'مراكش', 'القاهرة', 'العُلا', 'شرم الشيخ'];

export const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600', label: 'فندق فاخر كلاسيكي' },
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600', label: 'شقة مفروشة مودرن' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=600', label: 'منتجع شاطئي' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600', label: 'مطعم راقي دافئ' },
  { url: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&q=80&w=600', label: 'معلم سياحي وتراثي' },
  { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600', label: 'سيارة فاخرة' },
  { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600', label: 'يخت ورحلة بحرية' },
  { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600', label: 'تخييم وصحراء' }
];
