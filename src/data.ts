import { Listing } from './types';

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'فندق ريتز كارلتون الرياض',
    type: 'hotel',
    description: 'تجربة ضيافة ملكية فاخرة في قلب العاصمة الرياض. يتميز الفندق بحدائقه الواسعة ومسبحه الداخلي المصمم على طراز الواحات، بالإضافة إلى خدمات استثنائية تناسب الباحثين عن الرفاهية الكاملة.',
    city: 'الرياض',
    price: 12,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    amenities: ['مسبح مغلق', 'سبا فاخر', 'إنترنت مجاني', 'مواقف سيارات', 'خدمة غرف 24 ساعة', 'إطلالة حديقة'],
    contact: '+966 11 802 8020',
    reviewsCount: 148
  },
  {
    id: '2',
    title: 'منتجع وسبا موفنبيك جدة',
    type: 'hotel',
    description: 'استمتع بإطلالة ساحرة ومباشرة على ساحل البحر الأحمر بمدينة جدة. يوفر المنتجع غرفاً عصرية، ومطاعم متنوعة تقدم أشهى المأكولات البحرية والعالمية مع أجواء عائلية مريحة للغاية.',
    city: 'جدة',
    price: 8.5,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200',
    amenities: ['شاطئ خاص', 'مسبح خارجي', 'مركز ألعاب أطفال', 'نادي صحي', 'بوفيه مفتوح'],
    contact: '+966 12 667 6655',
    reviewsCount: 95
  },
  {
    id: '3',
    title: 'فندق وأجنحة باب الشمس الصحراوي',
    type: 'hotel',
    description: 'ملاذ هادئ وفريد بين الكثبان الرملية الذهبية بدبي. يوفر تجربة سياحية صحراوية حقيقية مع لمسات عصرية فاخرة، بالإضافة إلى جولات ركوب الجمال وعروض حية تعكس التراث العربي الأصيل.',
    city: 'دبي',
    price: 15,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200',
    amenities: ['سفاري صحراوي', 'مسبح لامتناهي', 'رماية وسهام', 'مطعم بدوي خارجي', 'إنترنت لاسلكي'],
    contact: '+971 4 809 6100',
    reviewsCount: 210
  },
  {
    id: '4',
    title: 'رياد دار أنيكا - مراكش',
    type: 'hotel',
    description: 'رياد مغربي تقليدي ساحر يقع بالقرب من ساحة جامع الفناء الشهيرة في مراكش. يجمع الفندق بين فن العمارة الأندلسية العريقة وهدوء الرياض والضيافة المغربية الدافئة مع فناء داخلي مشجر ومسبح دافئ.',
    city: 'مراكش',
    price: 6,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
    amenities: ['فناء أندلسي', 'حمام مغربي', 'مسبح مدفأ', 'فطور مغربي مجاني', 'شرفة تطل على الأطلس'],
    contact: '+212 5243-85110',
    reviewsCount: 184
  },
  {
    id: '5',
    title: 'مطعم لوسين الأرمني الفاخر',
    type: 'restaurant',
    description: 'يقدم مطعم لوسين تجربة طعام أرمنية فريدة مع لمسة عصرية. يشتهر بتقديم الأطباق التقليدية مثل المانتي والكباب بالكرز والتبولة في أجواء راقية ودافئة تناسب العائلات والأصدقاء.',
    city: 'الرياض',
    price: 1.8,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    amenities: ['جلسات داخلية وخارجية', 'موسيقى هادئة', 'أطباق خاصة للفيجن', 'مواقف سيارات مجانية', 'مشروبات مبتكرة'],
    contact: '+966 9200 02690',
    reviewsCount: 312
  },
  {
    id: '6',
    title: 'مطعم صبحي كابر للمشويات المصرية',
    type: 'restaurant',
    description: 'أشهر مطاعم الأكل الشعبي والمشويات في القاهرة. يقدم الملوخية المصرية الشهيرة بطشة مميزة على الطاولة، بالإضافة إلى الطواجن المشكلة والكباب والنيفة الطازجة يومياً من مزارعهم الخاصة.',
    city: 'القاهرة',
    price: 0.9,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
    amenities: ['خدمة سريعة جداً', 'أجواء شعبية حيوية', 'مناسب للمجموعات الكبيرة', 'تيك أواي', 'طواجن طازجة'],
    contact: '+20 100 240 1000',
    reviewsCount: 540
  },
  {
    id: '7',
    title: 'مطعم فلوكة للمأكولات البحرية الطازجة',
    type: 'restaurant',
    description: 'استمتع بأشهى الأسماك والمأكولات البحرية المعدة على الطريقة الحجازية في جلسة بانورامية مذهلة على كورنيش جدة. يمكنك اختيار سمكتك بنفسك وطهيها بالطريقة التي تفضلها.',
    city: 'جدة',
    price: 1.5,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200',
    amenities: ['إطلالة مباشرة على البحر', 'اختيار السمك الحي', 'منطقة ألعاب أطفال', 'جلسات مكيفة وعائلية'],
    contact: '+966 12 699 1000',
    reviewsCount: 228
  }
];

export const POPULAR_CITIES = ['الكل', 'الرياض', 'جدة', 'دبي', 'مراكش', 'القاهرة'];

export const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600', label: 'فندق فاخر كلاسيكي' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=600', label: 'منتجع شاطئي' },
  { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600', label: 'غرفة فندقية مودرن' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600', label: 'رياد / بيت تاريخي بمسحب' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600', label: 'مطعم راقي دافئ' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600', label: 'صالة طعام شرقية' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600', label: 'بوفيه طعام بحري' },
  { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600', label: 'جناح فندقي هادئ' }
];
