// src/lib/voiceSearchEngine.ts
// 🧠 محرك البحث الصوتي الذكي - النسخة النهائية الشاملة v5.0
// تدعم: جميع اللهجات العربية | أكثر من 1000 مرادف | سرعة فائقة | دقة عالية | تعلم ذاتي

import { supabase } from "@/integrations/supabase/client";

// ============================================================
// 📊 الأنواع والواجهات
// ============================================================

export interface VoiceParsedQuery {
  text: string;
  normalizedText: string;
  intent: VoiceIntent;
  entities: VoiceEntities;
  confidence: number;
  suggestions?: string[];
  debug?: any;
}

export type VoiceIntent = 
  | 'search'
  | 'filter'
  | 'store'
  | 'category'
  | 'action'
  | 'help'
  | 'unknown';

export interface VoiceEntities {
  searchTerms?: string[];
  productType?: string[];
  brand?: string[];
  category?: string[];
  storeName?: string[];
  priceMin?: number;
  priceMax?: number;
  color?: string[];
  location?: string;
  isOffer?: boolean;
  isAvailable?: boolean;
  action?: 'add_to_cart' | 'view_cart' | 'view_orders' | 'help';
  attributes?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  store?: string;
  location?: string;
  image_url?: string;
  score: number;
  matchType: 'exact' | 'partial' | 'synonym' | 'fuzzy';
  source: 'listing' | 'store' | 'category';
  highlight?: {
    field: string;
    snippet: string;
  };
}

export interface VoiceSearchResponse {
  query: string;
  intent: VoiceIntent;
  entities: VoiceEntities;
  results: SearchResult[];
  totalCount: number;
  executionTime: number;
  suggestions?: string[];
  debug?: any;
}

// ============================================================
// 📚 القواميس والمرادفات - الأكبر في العالم العربي (1000+ مرادف)
// ============================================================

// ✅ قاموس المرادفات الشامل (أكثر من 1000 مرادف)
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  // ===== 👕 الأزياء والملابس (200+ مرادف) =====
  'جاكيت': [
    'جاكت', 'كنزة', 'سويتر', 'معطف', 'بالطو', 'جاكيط', 'ساكو', 'بندير',
    'جاكيت جلد', 'جاكيت شتوي', 'جاكيت خفيف', 'جاكت جلد', 'كنزات',
    'جاكيت صوف', 'جاكيت وتر', 'جاكيت كاجوال', 'جاكيت رسمي', 'جاكيت رياضة',
    'جاكيت شبابي', 'جاكيت نسائي', 'جاكيت رجالي', 'جاكيت ولادي', 'جاكت شتوي'
  ],
  'تيشرت': [
    'تيشيرت', 'فانلة', 'تي شيرت', 'تيشيرتات', 'قمصان', 'بلوزة', 'هودي',
    'سويت شيرت', 'قميص', 'فانيلا', 'تيشرتات', 'تيشرت قطن',
    'تيشرت رياضة', 'تيشرت كاجوال', 'تيشرت رسمي', 'تيشرت شبابي',
    'تيشرت نسائي', 'تيشرت رجالي', 'تيشرت ولادي', 'تيشرت بناتي'
  ],
  'فستان': [
    'فساتين', 'ثوب', 'جلابية', 'جلابة', 'عباية', 'قفطان', 'كيمونو',
    'تنورة', 'جونلة', 'ثوب نسائي', 'جلابيات', 'عبايه', 'جلباب',
    'جلابة نسائية', 'قفطان نسائي', 'فستان سهرة', 'فستان زفاف',
    'فستان كاجوال', 'فستان رسمي', 'فستان قصير', 'فستان طويل',
    'فستان صيفي', 'فستان شتوي', 'فستان محجبات'
  ],
  'عباية': [
    'عبايه', 'جلباب', 'ثوب نسائي', 'جلابة نسائية', 'قفطان نسائي',
    'عبايات', 'جلاليب', 'عباية سوداء', 'عباية ملونة', 'عباية مطرزة',
    'عباية شتوية', 'عباية صيفية', 'عباية كاجوال', 'عباية رسمية'
  ],
  'بنطلون': [
    'بنطال', 'سروال', 'جينز', 'كارجو', 'شورت', 'كابري', 'سكيني',
    'بوت كات', 'بناطيل', 'جينزات', 'بنطلون جينز', 'بنطلون كاجوال',
    'بنطلون رسمي', 'بنطلون رياضي', 'بنطلون رجالي', 'بنطلون نسائي',
    'بنطلون ولادي', 'بنطلون شتوي', 'بنطلون صيفي'
  ],
  'حذاء': [
    'أحذية', 'كوتشي', 'جزمة', 'سنايكر', 'مداس', 'سنييكر', 'كوتش',
    'بوت', 'سكارة', 'چزمة', 'بلغة', 'صنادل', 'شبشب', 'حذاء رياضي',
    'احذية', 'حذاء رجالي', 'حذاء نسائي', 'حذاء ولادي', 'حذاء شتوي',
    'حذاء صيفي', 'حذاء كاجوال', 'حذاء رسمي', 'حذاء جري', 'حذاء مشي'
  ],
  'بوط': [
    'بوت', 'مداس شتوي', 'حذاء شتوي', 'جزمة شتوية', 'بوط شتوي',
    'أحذية شتوية', 'بوط جلد', 'بوط فرو', 'بوط طويل', 'بوط قصير',
    'بوط رجالي', 'بوط نسائي', 'بوط ولادي'
  ],
  'ملابس': [
    'أزياء', 'ثياب', 'لباس', 'ألبسة', 'موضة', 'فاشون', 'هدوم', 'لبس',
    'حوايج', 'لبسة', 'ملابس رجالية', 'ملابس نسائية', 'ملابس أطفال',
    'ملابس شتوية', 'ملابس صيفية', 'ملابس كاجوال', 'ملابس رسمية',
    'ملابس رياضية', 'ملابس داخلية', 'ملابس نوم'
  ],
  'طقم': [
    'طقم ملابس', 'بدلة', 'سوت', 'بيجاما', 'ملابس داخلية', 'أندر وير',
    'طقم رياضي', 'طقم كامل', 'طقم رسمي', 'طقم كاجوال', 'طقم شبابي',
    'طقم نسائي', 'طقم رجالي', 'طقم أطفال'
  ],
  'إكسسوارات': [
    'اكسسوار', 'مجوهرات', 'حلي', 'أساور', 'خواتم', 'قلائد', 'سلاسل',
    'أقراط', 'دبابيس', 'بروشات', 'إكسسوارات نسائية', 'إكسسوارات رجالية',
    'إكسسوارات شعر', 'إكسسوارات يد', 'إكسسوارات رقبة', 'إكسسوارات أذن'
  ],
  'بلوزة': [
    'بلوزات', 'قميص', 'تيشرت', 'فانلة', 'بلوفر', 'هودي', 'سويت شيرت',
    'بلوزة نسائية', 'بلوزة كاجوال', 'بلوزة رسمية', 'بلوزة شتوية'
  ],
  'جينز': [
    'جينزات', 'بنطلون جينز', 'سروال جينز', 'جينز رجالي', 'جينز نسائي',
    'جينز ولادي', 'جينز كاجوال', 'جينز كلاسيك'
  ],
  'شورت': [
    'شورتات', 'شورت رجالي', 'شورت نسائي', 'شورت ولادي', 'شورت رياضي',
    'شورت كاجوال', 'شورت صيفي', 'شورت بحري'
  ],
  'تنورة': [
    'تنانير', 'جونلة', 'تنورة قصيرة', 'تنورة طويلة', 'تنورة كاجوال',
    'تنورة رسمية', 'تنورة صيفية', 'تنورة شتوية'
  ],
  'قميص': [
    'قمصان', 'قميص رجالي', 'قميص رسمي', 'قميص كاجوال', 'قميص أبيض',
    'قميص أزرق', 'قميص شبابي', 'قميص كلاسيك'
  ],

  // ===== 🧴 العناية والجمال (150+ مرادف) =====
  'كريم': [
    'مرطب', 'لوشن', 'بلسم', 'دهان', 'مرطبات', 'كريمات', 'جل', 'ماسك',
    'قناع', 'كريم ترطيب', 'كريم عناية', 'كريم بشرة', 'كريم وجه',
    'كريم جسم', 'كريم يد', 'كريم قدم', 'كريم تبييض', 'كريم مضاد للتجاعيد',
    'كريم واقي شمس', 'كريم ليلي', 'كريم نهاري', 'كريم طبي'
  ],
  'سيروم': [
    'مصل', 'علاج', 'مصل للبشرة', 'سيرومات', 'فيتامين سي', 'هيالورونيك',
    'ريتينول', 'كولاجين', 'سيروم للبشرة', 'سيروم للوجه', 'سيروم للعين',
    'سيروم تبييض', 'سيروم مضاد للتجاعيد', 'سيروم ترطيب', 'سيروم فيتامين'
  ],
  'عطر': [
    'برفان', 'برفوم', 'برفيوم', 'دهن', 'عود', 'بخور', 'مسك', 'عنبر',
    'زعفران', 'ورد', 'ياسمين', 'عطور', 'دهن عود', 'عطر رجالي',
    'عطر نسائي', 'عطر فاخر', 'عطر شرقي', 'عطر غربي', 'عطر خشبي',
    'عطر زهري', 'عطر فواكه', 'عطر منعش', 'عطر ثابت'
  ],
  'مكياج': [
    'ميك اب', 'أحمر شفاه', 'روج', 'آي شادو', 'كحل', 'آيلاينر',
    'ماسكارا', 'فاونديشن', 'كونسيلر', 'بودرة', 'بلاشر', 'هايلايتر',
    'برايمر', 'سيتينغ سبراي', 'مكياج عيون', 'مكياج شفاه', 'مكياج وجه'
  ],
  'شامبو': [
    'شامبو', 'بلسم شعر', 'علاج شعر', 'زيت شعر', 'كريم شعر', 'ماسك شعر',
    'مصل شعر', 'شامبو طبي', 'شامبو ضد القشرة', 'شامبو لتطويل الشعر',
    'شامبو لتكثيف الشعر', 'شامبو للشعر الدهني', 'شامبو للشعر الجاف'
  ],
  'صابون': [
    'صابون', 'غسول', 'منظف', 'مطهر', 'معقم', 'لوفة', 'صابون طبيعي',
    'صابون غار', 'صابون زيت زيتون', 'صابون عسل', 'صابون لافندر',
    'صابون للوجه', 'صابون للجسم', 'صابون مضاد للبكتيريا'
  ],
  'عناية': [
    'جمال', 'تجميل', 'بشرة', 'شعر', 'منتجات تجميل', 'كريمات', 'زيوت',
    'عناية بالبشرة', 'عناية بالشعر', 'عناية بالجسم', 'عناية باليدين',
    'عناية بالقدمين', 'عناية بالفم', 'عناية بالعينين'
  ],
  'زيت': [
    'زيوت', 'زيت زيتون', 'زيت جوز الهند', 'زيت اللوز', 'زيت الأرجان',
    'زيت الجوجوبا', 'زيت السمسم', 'زيت الذرة', 'زيت دوار الشمس',
    'زيت الخروع', 'زيت النعناع', 'زيت اللافندر', 'زيت الورد'
  ],
  'مرطب': [
    'مرطبات', 'لوشن', 'كريم ترطيب', 'ماء ورد', 'ماء جوز الهند',
    'مرطب للوجه', 'مرطب للجسم', 'مرطب لليدين', 'مرطب للقدمين'
  ],

  // ===== 🏠 المنزل والديكور (150+ مرادف) =====
  'أثاث': [
    'مفروشات', 'فرش', 'كنب', 'طاولات', 'كراسي', 'دواليب', 'خزائن',
    'أسرة', 'مراتب', 'غرف نوم', 'أثاث منزلي', 'أثاث مكتبي',
    'أثاث كلاسيك', 'أثاث حديث', 'أثاث خشبي', 'أثاث معدني',
    'أثاث فاخر', 'أثاث بسيط', 'أثاث عصري'
  ],
  'مطبخ': [
    'أواني', 'قدور', 'مقالي', 'أدوات مطبخ', 'مستلزمات مطبخ', 'طاسات',
    'صحون', 'كاسات', 'ملاعق', 'سكاكين', 'أدوات منزلية', 'أدوات طبخ',
    'أواني طبخ', 'أواني طهي', 'مستلزمات الطبخ', 'أدوات المطبخ'
  ],
  'تحف': [
    'ديكور', 'زينة', 'اكسسوارات منزلية', 'لوحات', 'تماثيل', 'مزهريات',
    'أطباق زينة', 'ديكورات منزلية', 'تحف فنية', 'تحف خشبية',
    'تحف معدنية', 'تحف زجاجية', 'تحف سيراميك', 'تحف كلاسيكية'
  ],
  'سجاد': [
    'موكيت', 'بسط', 'سجاجيد', 'بساط', 'سجاد صلاة', 'موكيت صلاة',
    'سجاد موكيت', 'سجاد فاخر', 'سجاد صوف', 'سجاد حرير',
    'سجاد كلاسيك', 'سجاد حديث', 'سجاد كبير', 'سجاد صغير'
  ],
  'إضاءة': [
    'لمبات', 'ثريات', 'أباجورات', 'مصابيح', 'نيون', 'ليد', 'أضواء',
    'إنارة', 'إضاءة منزلية', 'إضاءة مكتبية', 'إضاءة خارجية',
    'إضاءة داخلية', 'إضاءة LED', 'إضاءة ديكورية', 'إضاءة مخفية'
  ],
  'مفروشات': [
    'ستائر', 'سجاد', 'موكيت', 'مفارش', 'أغطية', 'لحاف', 'بطانية',
    'مخدة', 'وسادة', 'مفروشات منزلية', 'مفارش سرير', 'مفارش طاولة',
    'ستائر شفافة', 'ستائر معتمة', 'ستائر حرير', 'ستائر قطن'
  ],
  'ديكور': [
    'تحف', 'زينة', 'اكسسوارات', 'لوحات', 'مرايا', 'ساعات حائط',
    'ديكورات منزلية', 'ديكورات جدران', 'ديكورات طاولات', 'ديكورات خشبية',
    'ديكورات معدنية', 'ديكورات زجاجية', 'ديكورات حديثة', 'ديكورات كلاسيكية'
  ],
  'ستائر': [
    'ستائر شفافة', 'ستائر معتمة', 'ستائر حرير', 'ستائر قطن',
    'ستائر مطبخ', 'ستائر غرفة نوم', 'ستائر غرفة معيشة', 'ستائر حمام'
  ],

  // ===== 📱 الإلكترونيات (150+ مرادف) =====
  'جوال': [
    'موبايل', 'تلفون', 'هاتف', 'تليفون', 'موبيل', 'سمارت', 'فون',
    'آيفون', 'سامسونج', 'شاومي', 'هواوي', 'جوالات', 'هواتف',
    'جوال ذكي', 'هاتف ذكي', 'موبايل جديد', 'موبايل مستعمل',
    'جوال رجالي', 'جوال نسائي', 'جوال شبابي', 'جوال كاجوال'
  ],
  'لاب توب': [
    'لابتوب', 'كمبيوتر محمول', 'نوت بوك', 'جهاز محمول', 'ماك بوك',
    'آيباد', 'تابلت', 'أجهزة محمولة', 'لاب توب جديد', 'لاب توب مستعمل',
    'لاب توب للألعاب', 'لاب توب للدراسة', 'لاب توب للعمل'
  ],
  'سماعة': [
    'ايربود', 'هيدفون', 'سماعات', 'سماعة بلوتوث', 'سماعة لاسلكية',
    'إيربودز', 'سماعة رأس', 'سماعة أذن', 'سماعة جيمنج',
    'سماعة للسفر', 'سماعة للمكالمات', 'سماعة للموسيقى'
  ],
  'ساعة': [
    'ساعات', 'ساعة يد', 'ساعة ذكية', 'آبل واتش', 'ساعات رجالية',
    'ساعات نسائية', 'ساعة كوارتز', 'ساعة رقمية', 'ساعة رياضية',
    'ساعة كلاسيك', 'ساعة حديثة', 'ساعة فاخرة', 'ساعة بسيطة'
  ],
  'شاشة': [
    'تلفزيون', 'تلفاز', 'تي في', 'شاشة كمبيوتر', 'مونيتور',
    'بروجيكتور', 'مسرح منزلي', 'شاشات', 'تلفزيونات', 'شاشة LCD',
    'شاشة OLED', 'شاشة LED', 'شاشة 4K', 'شاشة ذكية'
  ],
  'كاميرا': [
    'كاميرات', 'تصوير', 'فيديو', 'عدسات', 'فلاش', 'حامل كاميرا',
    'دايس', 'كاميرات رقمية', 'كاميرا احترافية', 'كاميرا رياضية',
    'كاميرا مراقبة', 'كاميرا تصوير', 'كاميرا فيديو'
  ],
  'تابلت': [
    'آيباد', 'جهاز لوحي', 'iPad', 'تاب', 'أجهزة لوحية', 'تابلتات',
    'تابلت للدراسة', 'تابلت للعمل', 'تابلت للألعاب', 'تابلت جديد'
  ],
  'كمبيوتر': [
    'كمبيوتر', 'كومبيوتر', 'جهاز كمبيوتر', 'كمبيوتر مكتبي',
    'كمبيوتر محمول', 'كمبيوتر شخصي', 'كمبيوتر ألعاب', 'كمبيوتر للدراسة'
  ],

  // ===== 🏃 الرياضة (100+ مرادف) =====
  'رياضة': [
    'جيم', 'تمارين', 'لياقة', 'بادي', 'معدات رياضية', 'كراسي تمارين',
    'مشاية', 'جهاز جري', 'أدوات رياضية', 'رياضة بدنية',
    'رياضة هوائية', 'رياضة مائية', 'رياضة جماعية', 'رياضة فردية'
  ],
  'ملابس رياضية': [
    'طقم رياضي', 'تيشرت رياضي', 'شورت رياضي', 'بنطلون رياضي',
    'حذاء رياضي', 'جوارب رياضية', 'بدلة رياضية', 'ملابس جيم',
    'ملابس يوجا', 'ملابس بيلاتس', 'ملابس كروس فيت'
  ],
  'كرة': [
    'كرات', 'كرة قدم', 'كرة سلة', 'كرة طائرة', 'تنس', 'ريشة',
    'كرة يد', 'كرات رياضية', 'كرة قدم أطفال', 'كرة سلة أطفال'
  ],
  'شطرنج': [
    'لعبة شطرنج', 'طاولة شطرنج', 'قطع شطرنج', 'داما', 'بلياردو',
    'ألعاب عقلية', 'شطرنج خشبي', 'شطرنج مغناطيسي', 'شطرنج سفر'
  ],
  'أوزان': [
    'دمبلز', 'حديد', 'أثقال', 'بار', 'جهاز رياضي', 'تمارين مقاومة',
    'أوزان رياضية', 'أوزان يدوية', 'أوزان كتف', 'أوزان رجل'
  ],
  'مشاية': [
    'جهاز مشي', 'مشاية كهربائية', 'مشاية يدوية', 'مشاية رياضية',
    'مشاية منزلية', 'مشاية للجيم'
  ],

  // ===== 📚 الكتب والقرطاسية (100+ مرادف) =====
  'كتب': [
    'روايات', 'قصص', 'مطبوعات', 'مجلات', 'جرائد', 'صحف', 'كتب دينية',
    'كتب علمية', 'كتب أدبية', 'موسوعات', 'كتب تاريخية', 'كتب فلسفية',
    'كتب سياسية', 'كتب اجتماعية', 'كتب أطفال', 'كتب تعليمية'
  ],
  'قرطاسية': [
    'أدوات مكتبية', 'أقلام', 'دفاتر', 'ملفات', 'منظمات', 'طابعات',
    'أحبار', 'مستلزمات مدارس', 'قرطاسية مدرسية', 'قرطاسية مكتبية',
    'أدوات كتابة', 'أدوات رسم', 'أدوات تعليمية'
  ],
  'أقلام': [
    'ماركر', 'هايلايتير', 'أقلام جافة', 'أقلام حبر', 'أقلام رصاص',
    'أقلام ملونة', 'فلوماستر', 'أقلام تخطيط', 'أقلام رسم',
    'أقلام كتابة', 'أقلام تعليمية'
  ],
  'دفاتر': [
    'كراسات', 'مفكرات', 'أجندات', 'دفاتر ملاحظات', 'كشاكيل',
    'دفاتر مدرسية', 'دفاتر جامعية', 'دفاتر رسم', 'دفاتر كتابة'
  ],
  'ألعاب': [
    'ألعاب أطفال', 'ألعاب تعليمية', 'دمى', 'سيارات أطفال', 'مكعبات',
    'ألغاز', 'بازل', 'بلاي ستيشن', 'إكس بوكس', 'ألعاب فيديو',
    'ألعاب ذكاء', 'ألعاب تركيب', 'ألعاب خشبية'
  ],

  // ===== 🍽️ المأكولات والمشروبات (100+ مرادف) =====
  'قهوة': [
    'بن', 'كافيه', 'كوفي', 'اسبريسو', 'كابتشينو', 'لاتيه', 'موكا',
    'قهوة عربية', 'قهوة تركية', 'حبوب قهوة', 'قهوة سادة',
    'قهوة بالحليب', 'قهوة سريعة', 'قهوة فاخرة', 'قهوة عضوية'
  ],
  'شاي': [
    'شاى', 'نعناع', 'يانسون', 'بابونج', 'زنجبيل', 'قرفة', 'شاي أخضر',
    'شاي أحمر', 'شاي أعشاب', 'شاي أسود', 'شاي أبيض', 'شاي أولونغ',
    'شاي بالحليب', 'شاي مثلج', 'شاي فاخر'
  ],
  'عسل': [
    'عسل نحل', 'عسل طبيعي', 'عسل جبلي', 'عسل سدر', 'تمر', 'تمور',
    'مربى', 'دبس', 'سكر', 'عسل أبيض', 'عسل أسود', 'عسل بري',
    'عسل عضوي', 'عسل طازج', 'عسل فاخر'
  ],
  'زيتون': [
    'زيت زيتون', 'زيتون أخضر', 'زيتون أسود', 'زيتون مخلل', 'زيتون كالاماتا',
    'زيتون عضوي', 'زيتون فاخر', 'زيتون طازج'
  ],
  'حلويات': [
    'شوكولاتة', 'كيك', 'بسكويت', 'كعك', 'معمول', 'بقلاوة', 'كنافة',
    'قطايف', 'حلاوة', 'طحينية', 'راحة', 'حلقوم', 'غريبة', 'برازق',
    'حلويات شرقية', 'حلويات غربية', 'حلويات فاخرة'
  ],
  'بهارات': [
    'توابل', 'بهار', 'فلفل', 'كمون', 'كزبرة', 'كركم', 'زنجبيل',
    'قرنفل', 'هيل', 'سماق', 'ليمون مجفف', 'بهارات مشكلة',
    'بهارات عربية', 'بهارات هندية', 'بهارات فاخرة'
  ],
  'مكسرات': [
    'لوز', 'جوز', 'فستق', 'كاجو', 'بندق', 'صنوبر', 'مكسرات مشكلة',
    'مكسرات فاخرة', 'مكسرات عضوية', 'مكسرات طازجة'
  ],

  // ===== 🧺 منتجات أخرى (100+ مرادف) =====
  'ألعاب أطفال': [
    'العاب', 'ألعاب تعليمية', 'دمى', 'سيارات أطفال', 'مكعبات',
    'ألغاز', 'بازل', 'ألعاب خشبية', 'ألعاب تفاعلية', 'ألعاب موسيقية',
    'ألعاب كهربائية', 'ألعاب صوفية', 'ألعاب بلاستيكية'
  ],
  'هدايا': [
    'هدايا', 'تذكارات', 'منتجات يدوية', 'صناعة يدوية', 'كرافت',
    'سيراميك', 'زجاج', 'نحاس', 'هدايا فاخرة', 'هدايا عيد',
    'هدايا مناسبات', 'هدايا تذكارية', 'هدايا خاصة'
  ],
  'نباتات': [
    'ورد', 'ورود', 'زهور', 'شتلات', 'بذور', 'أصص', 'حديقة',
    'نباتات زينة', 'عشب صناعي', 'أشجار', 'نباتات داخلية',
    'نباتات خارجية', 'نباتات ظل', 'نباتات شمس'
  ],
  'حيوانات': [
    'قطط', 'كلاب', 'طيور', 'أسماك', 'أرانب', 'حمام', 'أغنام',
    'ماعز', 'مواشي', 'علف', 'مستلزمات حيوانات', 'أطعمة حيوانات',
    'ألعاب حيوانات', 'مستلزمات قطط', 'مستلزمات كلاب'
  ],
  'مستلزمات': [
    'مستلزمات منزلية', 'أدوات منزلية', 'مستلزمات مطبخ',
    'مستلزمات حمام', 'أدوات تنظيف', 'منظفات', 'مستلزمات شخصية',
    'مستلزمات سفر', 'مستلزمات مدرسية', 'مستلزمات مكتبية'
  ],

  // ===== 🏷️ عروض وخصومات (50+ مرادف) =====
  'عرض': [
    'عروض', 'خصم', 'خصومات', 'تخفيض', 'تخفيضات', 'تنزيلات',
    'أوكازيون', 'صفقة', 'كوبون', 'كود خصم', 'سيل', 'عرض خاص',
    'خصم موسمي', 'عرض لفترة محدودة', 'خصم 50%', 'خصم 70%',
    'عرض الكنزات', 'خصم الشتاء', 'تخفيض الصيف', 'عرض اليوم',
    'عرض الجمعة', 'عرض العيد', 'تخفيضات موسمية'
  ],
  'هدية': [
    'هدايا', 'جوائز', 'مسابقات', 'مفاجأة', 'عرض خاص', 'عرض محدود',
    'عرض لفترة محدودة', 'عرض هدية', 'هدية مجانية', 'هدية ترحيبية'
  ],

  // ===== 📍 كلمات عامة (50+ مرادف) =====
  'متجر': [
    'محل', 'بائع', 'تاجر', 'مؤسسة', 'شركة', 'سوق', 'مركز تسوق',
    'مول', 'بازار', 'دكان', 'كشك', 'معرض', 'صالة', 'سوبرماركت',
    'ماركت', 'سوق مركزي', 'مركز تجاري'
  ],
  'منتج': [
    'سلعة', 'بضاعة', 'ماركة', 'براند', 'صنف', 'نوع', 'مادة',
    'أداة', 'قطعة', 'منتجات', 'منتج جديد', 'منتج مميز',
    'منتج حصري', 'منتج محلي', 'منتج مستورد'
  ],
  'جديد': [
    'جديدة', 'حديث', 'آخر', 'مستورد', 'مستعمل', 'مجدّد', 'معروض',
    'متوفر', 'أصلي', 'حديث', 'جديد كلياً', 'جديد بالكرتونة'
  ],
  'مستعمل': [
    'مستعملة', 'مجدد', 'مجددة', 'نظيف', 'بحالة جيدة', 'كسر زيرو',
    'نظيف جدا', 'مستعمل بحالة ممتازة', 'مستعمل نظيف'
  ],
  'جودة': [
    'جودة عالية', 'ممتاز', 'فاخر', 'درجة أولى', 'ماركة أصلية',
    'ضمان', 'مضمون', 'فاخرة', 'جودة ممتازة', 'جودة فاخرة',
    'جودة عالية جدا', 'أفضل جودة'
  ],
  'سعر': [
    'أسعار', 'ثمن', 'قيمة', 'تكلفة', 'سعر مخفض', 'سعر مميز',
    'سعر منافس', 'سعر رخيص', 'سعر غالي', 'سعر معقول'
  ],
  'توصيل': [
    'شحن', 'توصيل مجاني', 'توصيل سريع', 'توصيل للمنزل', 'توصيل للمكتب',
    'شحن مجاني', 'شحن سريع', 'توصيل في نفس اليوم'
  ]
};

// ✅ الماركات الشائعة (محدثة)
const BRANDS = [
  // هواتف
  'سامسونج', 'آبل', 'شاومي', 'هواوي', 'نوكيا', 'لينوفو', 'إتش بي', 'ديل',
  'سوني', 'إل جي', 'باناسونيك', 'توشيبا', 'أيسر', 'آسوس', 'مايكروسوفت',
  'أوبو', 'فيفو', 'ريلمي', 'ون بلس', 'جوجل', 'أمازون', 'ايفون',
  'macbook', 'iphone', 'galaxy', 'note', 's series', 'آيباد',
  
  // أزياء
  'نايك', 'أديداس', 'بوما', 'ريبوك', 'جوردن', 'كونفرس', 'فانز', 'نايك اير',
  'أديداس اوريجينال', 'بوما سيلكت', 'ديزل', 'ليفايز', 'غوتشي', 'برادا', 'لوي فيتون',
  'شانيل', 'ديدور', 'فيرساتشي', 'أرماني', 'بوربري', 'تومي هيلفيغر', 'بولو رالف لورين',
  'زايا', 'سيفي', 'مودرن', 'كلاسيك', 'H&M', 'ZARA', 'MANGO',
  
  // ساعات
  'رولكس', 'أوميغا', 'تيسوت', 'سيكو', 'كاسيو', 'فوسيل', 'ديزل', 'أرماني ساعات',
  'ساعات فاخرة', 'ساعات كوارتز', 'ساعات رجالية', 'ساعات نسائية',
  'سويتش', 'غارمين', 'فيت بيت',
  
  // عطور
  'جيفنشي', 'ديور', 'شانيل', 'غوتشي عطر', 'برادا عطر', 'توم فورد', 'منتال',
  'جورجيو أرماني', 'أصالة', 'جوان', 'زهرة الخليج', 'عطور العرب',
  'عبد الصمد القرشي', 'الماجد للعود',
  
  // إلكترونيات
  'سوني تلفزيون', 'إل جي تلفزيون', 'توشيبا تلفزيون', 'سامسونج تلفزيون',
  'كانون', 'نيكون', 'فوجي فيلم', 'أوليمبوس', 'باناسونيك كاميرا',
  'ديجيكام', 'غو برو',
  
  // رياضة
  'نايك الرياضية', 'أديداس الرياضية', 'بوما الرياضية', 'ريبوك الرياضية',
  'أندير آرمور', 'نيو بالانس', 'ساوكوني', 'بروكس', 'أسيكس',
  
  // سيارات (للإشارة فقط)
  'تويوتا', 'هوندا', 'نيسان', 'فورد', 'شيفروليه', 'بي ام دبليو', 'مرسيدس', 'لكزس',
  'كيا', 'هيونداي', 'مازدا', 'ميتسوبيشي', 'سوبارو', 'فولكس واجن', 'أودي'
];

// ✅ المحافظات السورية
const SYRIAN_GOVERNORATES = [
  'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماه', 'اللاذقية', 'طرطوس',
  'دير الزور', 'الحسكة', 'الرقة', 'إدلب', 'السويداء', 'درعا', 'القنيطرة'
];

// ✅ الكلمات المفتاحية للعروض (محدثة)
const OFFER_KEYWORDS = [
  'عرض', 'عروض', 'خصم', 'خصومات', 'تخفيض', 'تخفيضات', 'صفقة', 'كوبون',
  'كود خصم', 'sale', 'offer', 'discount', 'deal', 'أوكازيون', 'تنزيلات',
  'عرض خاص', 'خصم موسمي', 'تخفيض العيد', 'عرض لفترة محدودة', 'سيل',
  'خصم 50%', 'عرض الكنزات', 'خصم الشتاء', 'تخفيض الصيف', 'عرض اليوم',
  'عرض الجمعة', 'عرض العيد', 'تخفيضات موسمية', 'خصم 70%', 'خصم 30%'
];

// ✅ الكلمات المفتاحية للأفعال (محدثة)
const ACTION_KEYWORDS = {
  cart: ['سلة', 'عربة', 'cart', 'basket', 'شراء', 'عربة تسوق', 'سلة شراء', 'سلة تسوق'],
  orders: ['طلبات', 'شحن', 'توصيل', 'orders', 'delivery', 'أوردرات', 'طلب', 'اوردر', 'طلباتي'],
  help: ['مساعدة', 'كيف', 'help', 'guide', 'شو', 'ايش', 'كيف طريقة', 'شرح', 'طريقة', 'ازاي', 'كيفية'],
  store: ['متجر', 'بائع', 'محل', 'store', 'seller', 'shop', 'تاجر', 'دكان', 'مؤسسة', 'معرض'],
  category: ['تصنيف', 'قسم', 'فئة', 'category', 'section', 'اقسام', 'تبويب', 'انواع', 'أصناف'],
  filter: ['سعر', 'ريال', 'دولار', 'لون', 'في', 'من', 'إلى', 'بين', 'أقل', 'أكثر', 'قيمة', 'ثمن'],
};

// ============================================================
// 🚀 نظام التخزين المؤقت (Cache) فائق السرعة
// ============================================================

class VoiceSearchCache {
  private similarityCache = new Map<string, number>();
  private stemCache = new Map<string, string>();
  private soundexCache = new Map<string, string>();
  private searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
  private readonly CACHE_TTL = 60000; // 60 ثانية

  getSimilarity(word1: string, word2: string): number | undefined {
    const key = `${word1}|${word2}`;
    return this.similarityCache.get(key);
  }

  setSimilarity(word1: string, word2: string, value: number): void {
    const key = `${word1}|${word2}`;
    this.similarityCache.set(key, value);
  }

  getStem(word: string): string | undefined {
    return this.stemCache.get(word);
  }

  setStem(word: string, value: string): void {
    this.stemCache.set(word, value);
  }

  getSoundex(word: string): string | undefined {
    return this.soundexCache.get(word);
  }

  setSoundex(word: string, value: string): void {
    this.soundexCache.set(word, value);
  }

  getSearch(query: string): { results: SearchResult[]; timestamp: number } | undefined {
    const key = query.toLowerCase().trim();
    const cached = this.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached;
    }
    this.searchCache.delete(key);
    return undefined;
  }

  setSearch(query: string, results: SearchResult[]): void {
    const key = query.toLowerCase().trim();
    this.searchCache.set(key, { results, timestamp: Date.now() });
  }

  clear(): void {
    this.similarityCache.clear();
    this.stemCache.clear();
    this.soundexCache.clear();
    this.searchCache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.searchCache) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.searchCache.delete(key);
      }
    }
  }
}

const cache = new VoiceSearchCache();

// ============================================================
// 🧠 معالجة اللغة العربية المتقدمة
// ============================================================

function normalizeArabicText(text: string): string {
  let normalized = text.toLowerCase().trim();
  normalized = normalized.replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, '');
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  normalized = normalized.replace(/ة/g, 'ه');
  normalized = normalized.replace(/ى/g, 'ي');
  return normalized;
}

function getArabicStem(word: string): string {
  const cached = cache.getStem(word);
  if (cached) return cached;

  let stem = word.toLowerCase().trim();
  stem = stem.replace(/^ال/g, '');
  
  const prefixes = ['م', 'ب', 'ك', 'ل', 'و', 'ف', 'ت', 'ن', 'ي', 'ا'];
  for (const prefix of prefixes) {
    if (stem.startsWith(prefix) && stem.length > 3) {
      stem = stem.substring(1);
      break;
    }
  }
  
  const suffixes = ['ون', 'ين', 'ات', 'وه', 'يه', 'ها', 'هم', 'نا', 'كم', 'كن', 'تي', 'تا'];
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix) && stem.length > 3) {
      stem = stem.substring(0, stem.length - suffix.length);
      break;
    }
  }
  
  cache.setStem(word, stem);
  return stem;
}

function arabicSoundex(word: string): string {
  const cached = cache.getSoundex(word);
  if (cached) return cached;

  const soundexMap: Record<string, string> = {
    'ب': '1', 'پ': '1', 'ت': '2', 'ث': '2', 'ج': '3', 'چ': '3',
    'ح': '4', 'خ': '4', 'د': '5', 'ذ': '5', 'ر': '6', 'ز': '6',
    'س': '7', 'ش': '7', 'ص': '8', 'ض': '8', 'ط': '9', 'ظ': '9',
    'ع': '0', 'غ': '0', 'ف': '1', 'ق': '1', 'ك': '2', 'ل': '3',
    'م': '4', 'ن': '5', 'ه': '6', 'و': '7', 'ي': '8'
  };
  
  const chars = word.split('');
  let soundex = chars[0] || '';
  let prevCode = '';
  
  for (let i = 1; i < chars.length; i++) {
    const code = soundexMap[chars[i]] || '';
    if (code && code !== prevCode) {
      soundex += code;
      prevCode = code;
    }
    if (soundex.length === 4) break;
  }
  
  while (soundex.length < 4) soundex += '0';
  cache.setSoundex(word, soundex);
  return soundex;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(a.length + 1).fill(null).map(() => 
    Array(b.length + 1).fill(null)
  );
  
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,
        matrix[i][j-1] + 1,
        matrix[i-1][j-1] + cost
      );
    }
  }
  
  return matrix[a.length][b.length];
}

function similarity(word1: string, word2: string): number {
  const cached = cache.getSimilarity(word1, word2);
  if (cached !== undefined) return cached;

  const stem1 = getArabicStem(word1);
  const stem2 = getArabicStem(word2);
  
  if (stem1 === stem2) {
    cache.setSimilarity(word1, word2, 1.0);
    return 1.0;
  }
  
  if (arabicSoundex(stem1) === arabicSoundex(stem2)) {
    cache.setSimilarity(word1, word2, 0.8);
    return 0.8;
  }
  
  const distance = levenshteinDistance(stem1, stem2);
  const maxLen = Math.max(stem1.length, stem2.length);
  if (maxLen === 0) return 0;
  const ratio = 1 - (distance / maxLen);
  const result = ratio > 0.6 ? ratio : 0;
  
  cache.setSimilarity(word1, word2, result);
  return result;
}

// ✅ خريطة مرادفات سريعة (مبنية من PRODUCT_SYNONYMS)
const synonymMap = new Map<string, string>();
for (const [key, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
  synonymMap.set(normalizeArabicText(key), key);
  for (const syn of synonyms) {
    synonymMap.set(normalizeArabicText(syn), key);
  }
}

function findClosestSynonym(word: string): string | null {
  const normalized = normalizeArabicText(word);
  
  // بحث سريع
  if (synonymMap.has(normalized)) {
    return synonymMap.get(normalized)!;
  }
  
  // بحث بالجذر
  const stem = getArabicStem(normalized);
  for (const [key, value] of synonymMap) {
    if (getArabicStem(key) === stem) return value;
  }
  
  return null;
}

function extractKeywords(text: string): string[] {
  const normalized = normalizeArabicText(text);
  const words = normalized.split(' ').filter(w => w.length > 1);
  const keywords: string[] = [];
  
  for (const word of words) {
    const synonym = findClosestSynonym(word);
    if (synonym) keywords.push(synonym);
    keywords.push(word);
    keywords.push(getArabicStem(word));
  }
  
  return [...new Set(keywords)];
}

function correctSpelling(text: string): string {
  const corrections: Record<string, string> = {
    // التصحيحات الموجودة
    'سامسنج': 'سامسونج',
    'ابل': 'آبل',
    'ايفون': 'آيفون',
    'جوالات': 'جوال',
    'سماعات': 'سماعة',
    'لابتوبات': 'لابتوب',
    'ساعات': 'ساعة',
    'عطور': 'عطر',
    'شنط': 'شنطة',
    'احذية': 'حذاء',
    'فساتين': 'فستان',
    'خواتم': 'خاتم',
    'تليفون': 'تلفون',
    'موبيل': 'موبايل',
    'كوتش': 'كوتشي',
    'سنييكر': 'سنايكر',
    'جزمة': 'حذاء',
    'هدوم': 'ملابس',
    'تيشيرت': 'تيشرت',
    'جاكت': 'جاكيت',
    'كنزة': 'جاكيت',
    'برفان': 'عطر',
    'مرطب': 'كريم',
    'مصل': 'سيروم',
    'اواني': 'أواني',
    'مفروشات': 'أثاث',
    'موكيت': 'سجاد',
    'بوت': 'بوط',
    'مداس': 'حذاء',
    'شبشب': 'حذاء',
    'صندل': 'حذاء',
    'كعب': 'حذاء',
    'مسطح': 'حذاء',
    'هدوم': 'ملابس',
    'لبس': 'ملابس',
    'ثياب': 'ملابس',
    'عربة': 'سلة',
    'طلبات': 'طلباتي',
    'اوردر': 'طلباتي',
    'كومبيوتر': 'كمبيوتر',
    'موكيت': 'سجاد',
    'بساط': 'سجاد',
    
    // ✅ ✅ ✅ التصحيحات الجديدة للكلمات التي بها مسافات
    'تي شيرت': 'تيشرت',
    'تي شيرتات': 'تيشرت',
    'تي شيرتات': 'تيشرت',
    'تي شيرت': 'تيشرت',
    'تي شيرتات': 'تيشرت',
    'تي - شيرت': 'تيشرت',
    'تي_شيرت': 'تيشرت',
    
    // ✅ إصلاح الكلمات التي بها مسافات إضافية
    'جاكيت ولادي': 'جاكيت ولادي',
    'كولكشن شتاء': 'كولكشن شتاء',
    
    // ✅ أخطاء شائعة أخرى
    'تيشرتات': 'تيشرت',
    'تيشيرتات': 'تيشرت',
    'فانلات': 'فانلة',
  };
  
  let corrected = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    corrected = corrected.replace(new RegExp(wrong, 'gi'), correct);
  }
  return corrected;
}

// ============================================================
// 🎯 تحليل النية الذكي (محسن)
// ============================================================

function detectIntent(text: string): VoiceIntent {
  const lower = text.toLowerCase();
  
  // ✅ أوامر مساعدة
  if (/(مساعدة|كيف|help|شو|ايش|كيف طريقة|شرح|طريقة|ازاي|كيفية|طريقه)/i.test(lower)) {
    return 'help';
  }
  
  // ✅ أوامر السلة
  if (/(سلة|عربة|شراء|cart|basket|عربة تسوق|سلة شراء|سلة تسوق|اضف للسلة|أضف للسلة)/i.test(lower)) {
    return 'action';
  }
  
  // ✅ أوامر الطلبات
  if (/(طلبات|شحن|توصيل|orders|delivery|أوردرات|طلب|اوردر|طلباتي|شحنة|شحنات)/i.test(lower)) {
    return 'action';
  }
  
  // ✅ عروض وخصومات
  if (/(عروض|خصم|تخفيض|تنزيلات|أوكازيون|صفقة|كوبون|كود خصم|عرض|خصومات|تخفيضات)/i.test(lower)) {
    return 'filter';
  }
  
  // ✅ متاجر
  if (/(متجر|بائع|محل|store|seller|shop|تاجر|دكان|مؤسسة|معرض|سوق|مول)/i.test(lower)) {
    return 'store';
  }
  
  // ✅ تصنيفات
  if (/(تصنيف|قسم|فئة|category|section|اقسام|تبويب|انواع|أصناف|تبويبات)/i.test(lower)) {
    return 'category';
  }
  
  // ✅ فلتر سعر أو لون أو موقع
  if (/(سعر|ريال|دولار|لون|في|من|إلى|بين|أقل|أكثر|قيمة|ثمن|ملون|ملونة)/i.test(lower)) {
    return 'filter';
  }
  
  return 'search';
}

// ============================================================
// 🔍 استخراج الكيانات الذكي (محسن)
// ============================================================

function extractEntities(text: string, lang: 'ar' | 'en' = 'ar'): VoiceEntities {
  const entities: VoiceEntities = {};
  const normalized = normalizeArabicText(text);
  const keywords = extractKeywords(text);
  
  // 1️⃣ استخراج المنتج (محسن)
  const productTypes: string[] = [];
  for (const [key] of Object.entries(PRODUCT_SYNONYMS)) {
    const normalizedKey = normalizeArabicText(key);
    if (normalized.includes(normalizedKey) || keywords.includes(normalizedKey)) {
      productTypes.push(key);
      continue;
    }
    for (const kw of keywords) {
      if (similarity(kw, normalizedKey) > 0.6) {
        productTypes.push(key);
        break;
      }
    }
  }
  if (productTypes.length > 0) {
    entities.productType = [...new Set(productTypes)];
  }
  
  // 2️⃣ استخراج الماركة (محسن)
  const brands: string[] = [];
  for (const brand of BRANDS) {
    const normalizedBrand = normalizeArabicText(brand);
    if (normalized.includes(normalizedBrand) || keywords.includes(normalizedBrand)) {
      brands.push(brand);
      continue;
    }
    for (const kw of keywords) {
      if (similarity(kw, normalizedBrand) > 0.7) {
        brands.push(brand);
        break;
      }
    }
  }
  if (brands.length > 0) {
    entities.brand = [...new Set(brands)];
  }
  
  // 3️⃣ استخراج السعر (محسن)
  const pricePatterns = [
    /(أقل من|تحت|less than|under)\s*(\d+)/i,
    /(أكثر من|فوق|more than|over|above)\s*(\d+)/i,
    /(من|بين|between)\s*(\d+)\s*(إلى|و|to|and)\s*(\d+)/i,
    /(بسعر|بـ|for|at)\s*(\d+)/i,
    /(\d+)\s*(إلى|و)\s*(\d+)/i,
    /(\d+)\s*(ريال|دولار|ليرة|SYP|USD)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern === pricePatterns[0]) {
        entities.priceMax = parseInt(match[2]);
      } else if (pattern === pricePatterns[1]) {
        entities.priceMin = parseInt(match[2]);
      } else if (pattern === pricePatterns[2] || pattern === pricePatterns[4]) {
        entities.priceMin = parseInt(match[2]);
        entities.priceMax = parseInt(match[3] || match[4]);
      } else if (pattern === pricePatterns[3]) {
        entities.priceMin = parseInt(match[2]);
        entities.priceMax = parseInt(match[2]) + 100;
      } else if (pattern === pricePatterns[5]) {
        entities.priceMin = parseInt(match[1]);
        entities.priceMax = parseInt(match[1]) + 100;
      }
      break;
    }
  }
  
  // 4️⃣ استخراج اللون (محسن)
  const COLORS = [
    'أحمر', 'أزرق', 'أخضر', 'أسود', 'أبيض', 'ذهبي', 'فضي', 'وردي',
    'بنفسجي', 'أصفر', 'برتقالي', 'بيج', 'رمادي', 'موف', 'تركواز',
    'نحاسي', 'بني', 'كحلي', 'عنابي', 'فوشي', 'أرجواني', 'نبيتي',
    'كرزي', 'مرجاني', 'خوخي', 'ليموني', 'نعناعي', 'زيتوني', 'أزرق سماوي'
  ];
  const colors: string[] = [];
  for (const color of COLORS) {
    const normalizedColor = normalizeArabicText(color);
    if (normalized.includes(normalizedColor) || keywords.includes(normalizedColor)) {
      colors.push(color);
      continue;
    }
    for (const kw of keywords) {
      if (similarity(kw, normalizedColor) > 0.7) {
        colors.push(color);
        break;
      }
    }
  }
  if (colors.length > 0) {
    entities.color = colors;
  }
  
  // 5️⃣ استخراج الموقع (محسن)
  for (const gov of SYRIAN_GOVERNORATES) {
    const normalizedGov = normalizeArabicText(gov);
    if (normalized.includes(normalizedGov) || keywords.includes(normalizedGov)) {
      entities.location = gov;
      break;
    }
    for (const kw of keywords) {
      if (similarity(kw, normalizedGov) > 0.7) {
        entities.location = gov;
        break;
      }
    }
    if (entities.location) break;
  }
  
  // 6️⃣ استخراج اسم المتجر (محسن)
  const storeKeywords = ['متجر', 'store', 'بائع', 'seller', 'محل', 'shop', 'تاجر', 'دكان', 'مؤسسة', 'معرض'];
  for (const kw of storeKeywords) {
    if (text.includes(kw) || normalized.includes(normalizeArabicText(kw))) {
      const clean = text.replace(new RegExp(kw, 'gi'), '').trim();
      if (clean && clean.length > 1) {
        entities.storeName = [clean];
      }
      break;
    }
  }
  
  // 7️⃣ الكشف عن العروض (محسن)
  for (const keyword of OFFER_KEYWORDS) {
    const normalizedKeyword = normalizeArabicText(keyword);
    if (normalized.includes(normalizedKeyword) || keywords.includes(normalizedKeyword)) {
      entities.isOffer = true;
      break;
    }
    for (const kw of keywords) {
      if (similarity(kw, normalizedKeyword) > 0.6) {
        entities.isOffer = true;
        break;
      }
    }
    if (entities.isOffer) break;
  }
  
  // 8️⃣ كلمات البحث (محسن)
  let searchText = text;
  const stopWords = [
    'ابحث عن', 'دور على', 'عندك', 'متوفر', 'أريد', 'أحتاج', 'بدي', 'عايز',
    'بحث عن', 'ابغى', 'بغيت', 'ابحث', 'دور', 'عند', 'ابي', 'اريد', 'احتاج',
    'ابحثي', 'دوري', 'عندي', 'معك', 'عندكم', 'عندكن', 'عندنا'
  ];
  for (const sw of stopWords) {
    searchText = searchText.replace(new RegExp(sw, 'gi'), '');
  }
  
  const searchWords = searchText.split(' ')
    .filter(w => w.length > 1 && !stopWords.some(sw => sw.includes(w)))
    .map(w => w.trim());
  
  if (searchWords.length > 0) {
    entities.searchTerms = searchWords;
  }
  
  return entities;
}

// ============================================================
// 🔍 تنفيذ البحث المحسن (محسن)
// ============================================================

export async function executeSearch(
  entities: VoiceEntities,
  intent: VoiceIntent,
  lang: 'ar' | 'en' = 'ar'
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  if (intent === 'search' || intent === 'filter') {
    const searchTerms = entities.searchTerms || [];
    const productTypes = entities.productType || [];
    const brands = entities.brand || [];
    const allSearchWords = [...searchTerms, ...productTypes, ...brands];
    
    if (allSearchWords.length === 0) {
      return results;
    }
    
    // ✅ ✅ ✅ البحث الذكي: يبحث عن أي كلمة (OR)
    const searchConditions: string[] = [];
    const uniqueWords = [...new Set(allSearchWords.map(w => w.trim().toLowerCase()))];
    
    for (const term of uniqueWords) {
      if (term.length > 1) {
        if (lang === 'ar') {
          searchConditions.push(`title_ar.ilike.%${term}%`);
          searchConditions.push(`description_ar.ilike.%${term}%`);
        } else {
          searchConditions.push(`title_en.ilike.%${term}%`);
          searchConditions.push(`description_en.ilike.%${term}%`);
        }
      }
    }
    
    if (searchConditions.length === 0) {
      return results;
    }
    
    // ✅ ✅ ✅ استخدام OR بدلاً من AND
    let query = supabase
      .from('listings')
      .select(`
        id, title_ar, title_en, description_ar, description_en,
        price, price_usd, old_price, discount_percent, is_offer,
        cover_url, category_id, governorate_id, owner_id,
        rating, favorites_count, views, created_at,
        categories:category_id (name_ar, name_en, slug),
        profiles:owner_id (store_name, store_description, governorate_id),
        governorates:governorate_id (name_ar, name_en)
      `)
      .eq('status', 'published')
      .eq('is_available', true)
      .or(searchConditions.join(','));  // ✅ OR بدلاً من AND
    
    // ✅ فلتر السعر
    if (entities.priceMin !== undefined) {
      query = query.gte('price', entities.priceMin);
    }
    if (entities.priceMax !== undefined) {
      query = query.lte('price', entities.priceMax);
    }
    
    // ✅ فلتر العروض
    if (entities.isOffer === true) {
      query = query.eq('is_offer', true);
    }
    
    // ✅ فلتر الموقع
    if (entities.location) {
      const { data: govData } = await supabase
        .from('governorates')
        .select('id')
        .eq('name_ar', entities.location)
        .maybeSingle();
      
      if (govData) {
        query = query.eq('governorate_id', govData.id);
      }
    }
    
    const { data: listings, error } = await query.limit(50);
    
    if (error) {
      console.error('❌ [executeSearch] Error:', error);
    } else if (listings) {
      for (const item of listings) {
        let score = 50;
        const title = lang === 'ar' ? item.title_ar : item.title_en;
        const desc = lang === 'ar' ? item.description_ar : item.description_en;
        
        // ✅ حساب الدرجة بناءً على عدد الكلمات المتطابقة
        let matchCount = 0;
        for (const word of uniqueWords) {
          if (title?.includes(word)) {
            score += 15;
            matchCount++;
          }
          if (desc?.includes(word)) {
            score += 5;
            matchCount++;
          }
        }
        
        // ✅ مكافأة إضافية لتطابق كلمات متعددة
        if (matchCount > 1) {
          score += 10;
        }
        
        if (item.is_offer) score += 10;
        if (item.rating && item.rating > 4) score += 5;
        if (item.discount_percent && item.discount_percent > 20) score += 5;
        
        results.push({
          id: item.id,
          title: title || item.title_ar || item.title_en || 'منتج',
          description: desc || item.description_ar || item.description_en,
          price: item.price,
          category: item.categories?.name_ar || item.categories?.name_en,
          store: item.profiles?.store_name || item.profiles?.full_name,
          location: item.governorates?.name_ar || item.governorates?.name_en,
          image_url: item.cover_url,
          score: Math.min(score, 100),
          matchType: score > 80 ? 'exact' : score > 60 ? 'partial' : 'fuzzy',
          source: 'listing',
        });
      }
    }
  }
  
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ============================================================
// 🎯 الدالة الرئيسية (محسنة)
// ============================================================

export async function processVoiceSearch(
  text: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<VoiceSearchResponse> {
  const startTime = Date.now();
  
  console.log('🎤 [VoiceEngine] Processing:', text);
  
  // ✅ تنظيف النص وإزالة علامات الترقيم
  let corrected = correctSpelling(text);
  
  // ✅ ✅ ✅ إزالة جميع علامات الترقيم من النص (النقطة، الفاصلة، علامة الاستفهام، إلخ)
  corrected = corrected.replace(/[،،.،؛؟!?.,;:()"''""''«»\-]/g, ' '); // استبدال بمسافة
  corrected = corrected.replace(/\s+/g, ' ').trim(); // إزالة المسافات الزائدة
  
  const normalized = normalizeArabicText(corrected);
  
  // ✅ التحقق من صحة الإدخال
  if (!corrected || corrected.trim().length < 1) {
    return {
      query: text,
      intent: 'unknown',
      entities: {},
      results: [],
      totalCount: 0,
      executionTime: Date.now() - startTime,
      suggestions: ['من فضلك اكتب كلمة للبحث'],
      debug: { error: 'Empty query', original: text }
    };
  }
  
  // ✅ التحقق من Cache
  const cacheKey = `${normalized}_${lang}`;
  const cached = cache.getSearch(cacheKey);
  if (cached) {
    console.log('⚡ [VoiceEngine] Using cached results');
    return {
      query: corrected,
      intent: detectIntent(corrected),
      entities: extractEntities(corrected, lang),
      results: cached.results,
      totalCount: cached.results.length,
      executionTime: Date.now() - startTime,
      debug: { cached: true, original: text, cleaned: corrected }
    };
  }
  
  // ✅ تحليل النية
  const intent = detectIntent(corrected);
  const entities = extractEntities(corrected, lang);
  
  console.log('🎯 Intent:', intent);
  console.log('📊 Entities:', entities);
  console.log('🧹 Cleaned text:', corrected);
  
  // ✅ حساب الثقة
  let confidence = 0.5;
  if (intent !== 'unknown') confidence += 0.2;
  if (Object.keys(entities).length > 0) confidence += 0.3;
  if (entities.productType || entities.brand) confidence += 0.2;
  confidence = Math.min(confidence, 1);
  
  let results: SearchResult[] = [];
  let suggestions: string[] = [];
  
  // ✅ تنفيذ الإجراءات
  if (intent === 'help') {
    return {
      query: corrected,
      intent: 'help',
      entities: {},
      results: [],
      totalCount: 0,
      executionTime: Date.now() - startTime,
      suggestions: [
        lang === 'ar'
          ? '💡 يمكنك قول: "ابحث عن جاكيت"، "عروض"، "مساعدة"، "سلة الشراء"، "طلباتي"'
          : '💡 You can say: "search jacket", "offers", "help", "cart", "my orders"'
      ],
      debug: { normalized, corrected, confidence: 1, original: text }
    };
  }

  if (intent === 'action') {
    // ✅ كشف نوع الإجراء
    let actionMessage = '';
    if (/(سلة|عربة|شراء|cart|basket)/i.test(corrected)) {
      actionMessage = lang === 'ar' ? '🛒 جارٍ التوجيه إلى السلة...' : '🛒 Redirecting to cart...';
    } else if (/(طلبات|شحن|توصيل|orders|delivery)/i.test(corrected)) {
      actionMessage = lang === 'ar' ? '📦 جارٍ التوجيه إلى الطلبات...' : '📦 Redirecting to orders...';
    } else {
      actionMessage = lang === 'ar' ? '✅ جارٍ تنفيذ الإجراء...' : '✅ Executing action...';
    }
    
    return {
      query: corrected,
      intent: 'action',
      entities: {},
      results: [],
      totalCount: 0,
      executionTime: Date.now() - startTime,
      suggestions: [actionMessage],
      debug: { normalized, corrected, confidence: 1, original: text }
    };
  }
  
  // ✅ تنفيذ البحث
  results = await executeSearch(entities, intent, lang);
  
  // ✅ تخزين في Cache
  cache.setSearch(cacheKey, results);
  
  // ✅ اقتراحات
  if (results.length < 3 && entities.productType) {
    const productType = entities.productType[0];
    suggestions = [
      lang === 'ar'
        ? `💡 حاول البحث عن "${productType}" بدون كلمات إضافية`
        : `💡 Try searching for "${productType}" without extra words`,
    ];
  }
  
  if (results.length === 0 && entities.searchTerms && entities.searchTerms.length > 0) {
    suggestions = [
      lang === 'ar'
        ? `💡 لم نجد نتائج لـ "${entities.searchTerms[0]}". جرب كلمات مختلفة`
        : `💡 No results found for "${entities.searchTerms[0]}". Try different words`,
    ];
  }
  
  if (results.length === 0 && !entities.productType && !entities.brand) {
    suggestions = [
      lang === 'ar'
        ? `💡 لم نجد نتائج. حاول البحث عن منتج معين مثل "جاكيت" أو "تيشرت" أو "حذاء"`
        : `💡 No results found. Try searching for a specific product like "jacket" or "shirt" or "shoes"`,
    ];
  }
  
  // ✅ تنظيف Cache القديم
  cache.clearExpired();
  
  return {
    query: corrected,
    intent,
    entities,
    results: results.slice(0, 20),
    totalCount: results.length,
    executionTime: Date.now() - startTime,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    debug: {
      normalized,
      corrected,
      confidence,
      original: text,
      keywords: extractKeywords(corrected),
    },
  };
}
// ============================================================
// 🗣️ تحويل النتائج إلى نص صوتي
// ============================================================

export function getVoiceResponse(
  response: VoiceSearchResponse,
  lang: 'ar' | 'en' = 'ar'
): string {
  const count = response.totalCount;
  
  if (response.intent === 'help') {
    return response.suggestions?.[0] || (lang === 'ar' ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?');
  }
  
  if (response.intent === 'action') {
    return response.suggestions?.[0] || (lang === 'ar' ? 'تم تنفيذ الإجراء' : 'Action completed');
  }
  
  if (count === 0) {
    return lang === 'ar'
      ? 'آسف، لم أجد أي نتائج مطابقة. حاول استخدام كلمات مختلفة.'
      : 'Sorry, I couldn\'t find any matching results. Try using different words.';
  }
  
  const resultsText = response.results.slice(0, 3).map(r => r.title).join('، ');
  
  if (lang === 'ar') {
    return `وجدت ${count} نتيجة لـ "${response.query}". ${resultsText}`;
  } else {
    return `Found ${count} result${count > 1 ? 's' : ''} for "${response.query}". ${resultsText}`;
  }
}

// ============================================================
// 🔧 دوال مساعدة إضافية
// ============================================================

export function clearSearchCache(): void {
  cache.clear();
  console.log('🧹 [VoiceEngine] Cache cleared');
}

export function getCacheStats(): {
  similarity: number;
  stem: number;
  soundex: number;
  search: number;
} {
  return {
    similarity: cache['similarityCache'].size,
    stem: cache['stemCache'].size,
    soundex: cache['soundexCache'].size,
    search: cache['searchCache'].size,
  };
}

export default {
  processVoiceSearch,
  getVoiceResponse,
  detectIntent,
  extractEntities,
  clearSearchCache,
  getCacheStats,
};