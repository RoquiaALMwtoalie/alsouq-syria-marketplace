// supabase/functions/ai-assistant/index.ts
// 🤖 المساعد الذكي المتقدم - نظام بحث شامل ومتكامل في كل جداول قاعدة البيانات

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// 📋 الواجهات والأنماط
// ============================================================

interface SearchResult {
  type: 'product' | 'store' | 'category' | 'governorate' | 'brand' | 'listing' | 'profile' | 'order' | 'service' | 'promo' | 'announcement' | 'banner' | 'review';
  id: string;
  title: string;
  price?: number;
  oldPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  image?: string;
  score: number;
  link: string;
  extra?: string;
  inStock?: boolean;
  isOffer?: boolean;
  storeName?: string;
  location?: string;
  icon?: string;
  brand?: string;
  categoryName?: string;
  views?: number;
  favorites?: number;
  createdAt?: string;
  source?: string;
  status?: string;
  quantity?: number;
  total?: number;
  code?: string;
  expiresAt?: string;
  sortOrder?: number;
}

interface ConversationContext {
  lastQuery?: string;
  lastResults?: SearchResult[];
  lastProductId?: string;
  lastProductTitle?: string;
  lastAction?: 'search' | 'details' | 'confirm' | 'unknown' | 'filter' | 'compare';
  conversationHistory?: { role: string; content: string }[];
  lastProductData?: any;
  userId?: string;
  lang?: string;
  searchCount?: number;
  lastCategory?: string;
  lastStoreId?: string;
  lastOrderId?: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    category?: string;
    brand?: string;
    inStock?: boolean;
    isOffer?: boolean;
    minRating?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  };
  userPreferences?: {
    preferredPriceRange?: { min: number; max: number };
    preferredLocation?: string;
    preferredBrands?: string[];
    preferredCategories?: string[];
    preferredStore?: string;
  };
}

// ============================================================
// 📚 القواميس الذكية المتقدمة - موسوعة شاملة
// ============================================================

const SMART_SYNONYMS: Record<string, string[]> = {
  // ملابس وإكسسوارات
  'جاكيت': ['معطف', 'بالطو', 'سترة', 'jacket', 'coat', 'outerwear', 'جاكت', 'جاكيتات', 'سترة شتوية', 'معطف شتوي', 'جاكيت جلد', 'جاكيت قطن'],
  'طوق': ['قلادة', 'سلسلة', 'pendant', 'necklace', 'choker', 'طوقيات', 'طوق ذهب', 'طوق فضي', 'سلسلة رقبة', 'قلادة ذهب', 'قلادة فضة', 'طوق رجالي', 'طوق نسائي'],
  'قميص': ['بلوزة', 'شيرت', 'shirt', 'blouse', 'تي شيرت', 'قمصان', 'قميص رجالي', 'قميص نسائي', 'بلوزة نسائية', 'قميص كاجوال', 'قميص رسمي'],
  'بنطلون': ['سروال', 'جينز', 'pants', 'jeans', 'trousers', 'بناطيل', 'بنطلون جينز', 'سروال جينز', 'بنطلون رجالي', 'بنطلون نسائي', 'بنطلون كارجو'],
  'فستان': ['ثوب', 'dress', 'gown', 'لباس', 'فساتين', 'فستان سهرة', 'فستان زفاف', 'ثوب نسائي', 'فستان طويل', 'فستان قصير', 'فستان محجب'],
  'حذاء': ['جزمة', 'كوتشي', 'shoe', 'sneaker', 'boot', 'sandals', 'أحذية', 'حذاء رياضي', 'جزمة شتوية', 'كوتشي رجالي', 'حذاء رسمي', 'حذاء كاجوال'],
  'شنطة': ['حقيبة', 'bag', 'backpack', 'handbag', 'purse', 'شنط', 'شنطة يد', 'حقيبة ظهر', 'شنطة سفر', 'شنطة كتف', 'حقيبة نسائية'],
  'ساعة': ['ساعات', 'ساعة يد', 'watch', 'smartwatch', 'wearable', 'ساعة ذكية', 'ساعة رجالية', 'ساعة نسائية', 'ساعة رياضية', 'ساعة كلاسيك'],
  'خاتم': ['خواتم', 'خاتم زواج', 'خاتم خطوبة', 'ring', 'wedding ring', 'engagement ring', 'خاتم ذهب', 'خاتم فضة', 'خاتم ألماس'],
  'سوار': ['اساور', 'سوار يد', 'bracelet', 'سوار ذهب', 'سوار فضة', 'سوار رجالي', 'سوار نسائي', 'سوار كريستال'],
  'نظارة': ['نظارات', 'glasses', 'sunglasses', 'نظارة شمسية', 'نظارة طبية', 'نظارة رجالية', 'نظارة نسائية'],
  'حزام': ['belts', 'belt', 'حزام جلد', 'حزام رجالي', 'حزام نسائي'],
  
  // إلكترونيات
  'جوال': ['موبايل', 'هاتف', 'تلفون', 'فون', 'سمارت', 'mobile', 'phone', 'smartphone', 'ios', 'android', 'جوالات', 'هواتف', 'موبايلات', 'آيفون', 'جالاكسي'],
  'سماعة': ['سماعات', 'أذن', 'هيدفون', 'ايربود', 'earphone', 'headphone', 'airpods', 'بلوتوث', 'سماعة لاسلكية', 'سماعة رأس', 'سماعة ستيريو'],
  'لابتوب': ['كمبيوتر محمول', 'نوت بوك', 'laptop', 'notebook', 'pc', 'macbook', 'لابتوبات', 'كمبيوتر', 'لاب توب', 'لابتوب جيمنج'],
  'تلفزيون': ['شاشة', 'تلفاز', 'tv', 'television', 'screen', 'led', 'oled', 'تلفزيونات', 'شاشات', 'تلفزيون ذكي', 'شاشة 4k'],
  'كاميرا': ['تصوير', 'camera', 'dslr', 'mirrorless', 'كاميرات', 'آلة تصوير', 'كاميرا احترافية', 'كاميرا مراقبة', 'كاميرا رياضية'],
  'تابلت': ['tablet', 'ipad', 'لوحي', 'تابلتات', 'جهاز لوحي', 'آيباد', 'تابلت سامسونج'],
  'شاحن': ['charger', 'شواحن', 'كابل', 'cable', 'usb', 'شاحن جوال', 'شاحن لاسلكي', 'باور بنك', 'شاحن سريع'],
  'بطارية': ['battery', 'بطاريات', 'بطارية جوال', 'power bank', 'بنك طاقة', 'بطارية خارجية', 'بطارية لابتوب'],
  'شاشة': ['monitor', 'screen', 'display', 'شاشة كمبيوتر', 'شاشة عرض', 'شاشة تلفزيون', 'شاشة ألعاب'],
  'بروجيكتور': ['projector', 'جهاز عرض', 'بروجكتر', 'عرض صور', 'جهاز بروجيكتور', 'بروجيكتور 4k'],
  'طابعة': ['printer', 'طباعة', 'طابعة ألوان', 'طابعة ليزر', 'طابعة حبر', 'طابعة صور'],
  'ماسح ضوئي': ['scanner', 'سكانر', 'ماسح', 'سكانر ضوئي'],
  'راوتر': ['router', 'واي فاي', 'مودم', 'انترنت', 'راوتر لاسلكي', 'راوتر 5g'],
  
  // منزل ومطبخ
  'أثاث': ['مفروشات', 'furniture', 'sofa', 'طاولة', 'كرسي', 'خزانة', 'سرير', 'أثاث منزلي', 'غرفة نوم', 'مجلس', 'كنبة', 'دولاب'],
  'ثلاجة': ['براد', 'refrigerator', 'fridge', 'freezer', 'ثلاجات', 'برادات', 'ثلاجة عرض', 'ثلاجة منزلية', 'فريزر'],
  'غسالة': ['غسالة ملابس', 'washer', 'washing machine', 'dryer', 'غسالات', 'نشافة', 'غسالة أوتوماتيك', 'غسالة صحون', 'غسالة فل اوتوماتيك'],
  'فرن': ['بوتاجاز', 'oven', 'stove', 'cooker', 'microwave', 'أفران', 'فرن كهربائي', 'فرن غاز', 'بوتاجاز غاز', 'فرن ميكروويف'],
  'مكيف': ['تكييف', 'air conditioner', 'ac', 'cooler', 'heater', 'مكيفات', 'تكييفات', 'مكيف شباك', 'مكيف سبليت', 'مكيف مركزي'],
  'مكنسة': ['مكنسة كهربائية', 'vacuum', 'مكينة', 'مكانس', 'مكنسة روبوت', 'مكانس كهربائية', 'مكنسة تنظيف', 'مكنسة غسيل'],
  'ديكور': ['ديكورات', 'تحف', 'زينة', 'decor', 'ornaments', 'ديكور منزلي', 'إكسسوارات منزلية', 'براويز', 'مرايا'],
  'إضاءة': ['أضواء', 'لمبات', 'lights', 'lamps', 'chandelier', 'ثريات', 'إضاءات', 'مصباح', 'لمبة led', 'نور', 'أباجورة'],
  'أواني': ['قدور', 'مقالي', 'صحون', 'كؤوس', 'cookware', 'pots', 'pans', 'dishes', 'أواني مطبخ', 'أدوات مطبخ', 'طقم أواني'],
  'ثلاجة': ['براد', 'فريزر', 'refrigerator', 'freezer', 'ثلاجة', 'فريزر', 'براد عرض'],
  'غسالة صحون': ['dishwasher', 'غسالة صحون', 'جلاية', 'غسالة أطباق', 'جلاية صحون'],
  'شفاط': ['hood', 'exhaust', 'شفاط مطبخ', 'مروحة مطبخ', 'شفاط هواء'],
  'خلاط': ['blender', 'mixer', 'خلاط كهربائي', 'مطحنة', 'خلاط طعام'],
  'عصارة': ['juicer', 'عصارة فواكه', 'عصارة برتقال', 'عصارة كهربائية'],
  
  // جمال وعناية
  'عطر': ['برفان', 'برفوم', 'perfume', 'fragrance', 'oud', 'دهن عود', 'musk', 'عطور', 'بخور', 'عطر نسائي', 'عطر رجالي', 'عطر شرقي', 'عطر غربي'],
  'مكياج': ['makeup', 'cosmetics', 'foundation', 'lipstick', 'ميك اب', 'أحمر شفاه', 'كريم أساس', 'ماسكارا', 'آيلاينر', 'كونسيلر', 'بودرة', 'بلاشر'],
  'كريم': ['مرطب', 'lotion', 'cream', 'moisturizer', 'skincare', 'كريمات', 'عناية بالبشرة', 'كريم ترطيب', 'كريم مضاد تجاعيد', 'كريم واقي شمس'],
  'شامبو': ['shampoo', 'بلسم', 'conditioner', 'شامبو شعر', 'غسول شعر', 'شامبو طبيعي', 'شامبو للشعر', 'شامبو ضد القشرة'],
  'صابون': ['soap', 'صابون طبيعي', 'صابون غار', 'صابونيات', 'صابون يدوي', 'صابونة', 'صابون سائل'],
  'ماسك': ['mask', 'قناع', 'ماسك للوجه', 'قناع طبيعي', 'ماسك ترطيب', 'قناع للبشرة', 'ماسك طين'],
  'زيت شعر': ['زيت للشعر', 'hair oil', 'زيت أرجان', 'زيت جوز الهند', 'زيت خروع', 'زيت لترطيب الشعر', 'زيت نمو الشعر'],
  'مصل': ['serum', 'مصل للوجه', 'مصل ترطيب', 'مصل مضاد تجاعيد', 'مصل فيتامين سي'],
  'تونر': ['toner', 'مقوي', 'تونر للبشرة', 'مقوي للوجه', 'ماء ورد'],
  
  // طعام وشراب
  'عسل': ['عسل نحل', 'honey', 'natural honey', 'organic honey', 'عسل طبيعي', 'عسل جبلي', 'عسل سدر', 'عسل زهور', 'عسل ملكي'],
  'زيت': ['زيت زيتون', 'زيوت', 'oil', 'olive oil', 'cooking oil', 'زيت غذائي', 'زيت زيتون بكر', 'زيت نباتي', 'زيت ذرة', 'زيت دوار الشمس'],
  'قهوة': ['بن', 'كافيه', 'coffee', 'beans', 'espresso', 'arabica', 'قهوة عربية', 'بون', 'قهوة مختصة', 'قهوة تركية', 'قهوة سريعة', 'قهوة مثلجة'],
  'شاي': ['شاي أخضر', 'tea', 'green tea', 'black tea', 'herbal', 'شاي أسود', 'شاي أعشاب', 'شاي كرك', 'شاي لاتيه', 'شاي بالحليب', 'شاي بالنعناع'],
  'تمر': ['تمور', 'dates', 'date palm', 'medjool', 'تمر فاخر', 'تمور مكتوبة', 'تمر سكري', 'تمر مجدول', 'تمر برحي', 'تمر خلاص'],
  'توابل': ['بهارات', 'spices', 'بهار', 'فلفل', 'كمون', 'كزبرة', 'زعتر', 'بهارات مشكلة', 'توابل طعام', 'فلفل أسود', 'هيل', 'قرنفل'],
  'مكسرات': ['nuts', 'لوز', 'جوز', 'فستق', 'كاجو', 'مكسرات طبيعية', 'مكسرات محمصة', 'فستق حلبي', 'جوز عين الجمل'],
  'حلويات': ['sweets', 'حلا', 'شوكولاتة', 'حلويات شرقية', 'كنافة', 'بسبوسة', 'معمول', 'حلويات عربية', 'شوكولاتة يدوية', 'كيك'],
  'مربى': ['jam', 'preserves', 'مربى فراولة', 'مربى مشمش', 'مربى تين', 'مربى منزلية'],
  'زعتر': ['thyme', 'زعتر بري', 'زعتر أخضر', 'زعتر فلسطيني', 'زعتر خلطة', 'زعتر وزيت'],
  
  // رياضة
  'معدات رياضية': ['gym', 'fitness', 'workout', 'exercise', 'dumbbell', 'أدوات رياضية', 'نادي رياضي', 'معدات جيم', 'مشاية', 'دراجة تمارين'],
  'كرة': ['ball', 'football', 'soccer', 'basketball', 'كرة قدم', 'كرة سلة', 'كرات', 'كرة طائرة', 'كرة يد', 'كرة تنس'],
  'ملابس رياضية': ['رياضي', 'sports wear', 'training', 'track suit', 'بدلة رياضية', 'طقم رياضي', 'ملابس جيم', 'تيشيرت رياضي', 'بنطلون رياضي'],
  'أحذية رياضية': ['sneakers', 'running shoes', 'حذاء رياضي', 'كوتشي رياضة', 'حذاء جري', 'حذاء كرة قدم', 'حذاء كرة سلة'],
  'مكملات غذائية': ['supplements', 'protein', 'مكملات', 'بروتين', 'فيتامينات', 'مكملات رياضية', 'بودرة بروتين'],
  
  // خدمات
  'طبيب': ['doctor', 'دكتور', 'طبيبة', 'عيادة', 'استشاري', 'معالج', 'طبيب عام', 'طبيب أسنان', 'طبيب عيون', 'طبيب جلدية', 'طبيب أطفال'],
  'محامي': ['lawyer', 'attorney', 'محاماة', 'مستشار قانوني', 'محامي شركات', 'محامي دعوى', 'محامي عقود', 'محامي جنائي'],
  'مهندس': ['engineer', 'مقاول', 'بناء', 'تشطيب', 'مكتب هندسي', 'مهندس معماري', 'مهندس مدني', 'مهندس كهرباء', 'مهندس ميكانيك'],
  'معلم': ['teacher', 'tutor', 'مدرسة', 'تعليم', 'دروس خصوصية', 'مدرس خصوصي', 'معلم لغة', 'معلم رياضيات', 'معلم علوم'],
  'مصور': ['photographer', 'تصوير', 'مصور فوتوغرافي', 'مصور حفلات', 'مصور فني', 'تصوير احترافي', 'مصور زفاف'],
  'مصمم': ['designer', 'تصميم', 'مصمم جرافيك', 'مصمم ديكور', 'مصمم أزياء', 'تصميم داخلي', 'مصمم مواقع'],
  'مقاول': ['contractor', 'بناء', 'تشطيب', 'مقاول بناء', 'مقاول ديكور', 'مقاول ترميم', 'مقاول عام'],
  'سباك': ['plumber', 'سباكة', 'عمال سباكة', 'صحي', 'تركيب مواسير', 'إصلاح سباكة'],
  'كهربائي': ['electrician', 'كهرباء', 'تركيب كهرباء', 'فني كهرباء', 'إصلاح كهرباء'],
  'حداد': ['blacksmith', 'حدادة', 'فني حدادة', 'تركيب حديد', 'أبواب حديد'],
  'نجار': ['carpenter', 'نجارة', 'أثاث خشب', 'تركيب خشب', 'مطبخ خشب', 'أبواب خشب'],
  
  // سيارات ومركبات
  'سيارة': ['car', 'vehicle', 'سيدان', 'دفع رباعي', 'سيارة جديدة', 'سيارة مستعملة', 'سيارة للبيع', 'سيارة موديل حديث'],
  'دراجة': ['bicycle', 'bike', 'دراجة هوائية', 'دراجة نارية', 'سكوتر', 'دراجة كهربائية', 'دراجة جبلية', 'دراجة سباق'],
  'قطع غيار': ['spare parts', 'accessories', 'قطع سيارات', 'اكسسوارات سيارات', 'زينة سيارات', 'قطع غيار سيارات'],
  'زيوت سيارات': ['motor oil', 'engine oil', 'زيت محرك', 'زيت قير', 'زيت فرامل', 'زيوت تشحيم'],
  
  // عقارات
  'شقة': ['apartment', 'flat', 'شقة للبيع', 'شقة للإيجار', 'شقة مفروشة', 'شقة سكنية', 'استوديو', 'شقة دوبلكس', 'شقة فاخرة'],
  'فيلا': ['villa', 'منزل', 'بيت', 'فيلا للبيع', 'منزل للايجار', 'قصر', 'فيلا سكنية', 'فيلا فاخرة', 'فيلا خاصة'],
  'أرض': ['land', 'plot', 'أرض للبيع', 'قطعة أرض', 'أرض سكنية', 'أرض زراعية', 'مزرعة', 'أرض استثمارية'],
  'محل': ['shop', 'store', 'محل تجاري', 'دكان', 'متجر', 'محل للإيجار', 'محل للبيع', 'محل في مول'],
  'مكتب': ['office', 'مكتب للايجار', 'مكتب للبيع', 'مساحة مكتبية', 'مكتب إداري', 'مكتب تجاري'],
  
  // حيوانات
  'قط': ['cat', 'قطة', 'قطط', 'قط شيرازي', 'قط صغير', 'قطط للتبني', 'قطط للبيع', 'قط هيمالايان'],
  'كلب': ['dog', 'جرو', 'كلاب', 'كلب صغير', 'كلب للبيع', 'كلب حراسة', 'كلب أليف', 'كلب جيرمن شيبرد'],
  'طيور': ['birds', 'طائر', 'ببغاء', 'كناري', 'حمام', 'طيور زينة', 'طيور مغردة', 'عصافير'],
  'طعام حيوانات': ['pet food', 'طعام قطط', 'طعام كلاب', 'أكل حيوانات', 'غذاء حيوانات', 'علف', 'وجبات جافة'],
  'مستلزمات حيوانات': ['pet supplies', 'أدوات حيوانات', 'أسرة حيوانات', 'ألعاب حيوانات', 'نقل حيوانات'],
  'سمك': ['fish', 'aquarium', 'أسماك', 'أحواض سمك', 'سمك زينة', 'سمك ذهبي', 'سمك استوائي'],
  
  // ألعاب وترفيه
  'لعبة': ['toy', 'game', 'ألعاب أطفال', 'ألعاب تعليمية', 'ألعاب فيديو', 'بلاي ستيشن', 'إكس بوكس', 'ألعاب ذكاء', 'ألعاب تركيب'],
  'ألعاب فيديو': ['video games', 'ps5', 'ps4', 'xbox', 'nintendo', 'ألعاب الكترونية', 'ألعاب كمبيوتر', 'ألعاب محمولة'],
  'دمية': ['doll', 'باربي', 'دمى', 'عرائس', 'ألعاب بنات', 'دمية قطيفة', 'دمية كبيرة'],
  
  // كتب وقرطاسية
  'كتاب': ['book', 'رواية', 'مجلة', 'كتاب تعليمي', 'كتاب ديني', 'قصص', 'مكتبة', 'كتب', 'كتاب طبخ', 'كتاب تنمية بشرية'],
  'قرطاسية': ['stationery', 'أدوات مكتبية', 'دفتر', 'قلم', 'ألوان', 'ممحاة', 'مسطرة', 'ورق', 'مجلدات'],
  'أدوات مكتبية': ['office supplies', 'طابعة', 'ورق', 'مجلد', 'ملفات', 'قرطاسية مكتبية', 'أقلام', 'دفاتر'],
  
  // أزهار ونباتات
  'ورد': ['flowers', 'زهور', 'باقة ورد', 'ورود طبيعية', 'زهور حمراء', 'ورد جوري', 'زهور بيضاء', 'ورد أحمر'],
  'نباتات': ['plants', 'نبتة', 'شتلات', 'نباتات منزلية', 'شجرة', 'ورود', 'زهور منزلية', 'نباتات ظل', 'نباتات زينة'],
  'شتلات': ['seedlings', 'شتلة', 'زراعة', 'نباتات زراعية', 'فواكه', 'خضار', 'زراعة منزلية'],
  
  // أدوات ومعدات
  'معدات': ['equipment', 'tools', 'معدات صناعية', 'معدات كهرباء', 'معدات سباكة', 'معدات نجارة', 'آلات'],
  'أدوات': ['tools', 'عدة', 'أدوات يدوية', 'أدوات كهربائية', 'مطرقة', 'مفك', 'منشار', 'مثقاب'],
  'كهرباء': ['electrical', 'أسلاك', 'مفاتيح', 'فيش', 'مصابيح', 'لوحات كهرباء', 'موتورات'],
  'سباكة': ['plumbing', 'مواسير', 'محابس', 'خلاطات', 'مراحيض', 'مغاسل', 'أنابيب'],
};

const CATEGORY_MAPPING: Record<string, string[]> = {
  'إلكترونيات': ['جوال', 'لابتوب', 'تلفزيون', 'سماعة', 'كاميرا', 'ساعة', 'شاحن', 'بطارية', 'تابلت', 'شاشة', 'طابعة', 'بروجيكتور', 'راوتر', 'ماسح ضوئي'],
  'ملابس': ['جاكيت', 'قميص', 'بنطلون', 'فستان', 'حذاء', 'شنطة', 'تي شيرت', 'بلوزة', 'طوق', 'قلادة', 'خاتم', 'سوار', 'نظارة', 'حزام'],
  'أحذية': ['حذاء', 'جزمة', 'كوتشي', 'صندل', 'حذاء رياضي', 'حذاء رسمي', 'حذاء نسائي', 'حذاء رجالي', 'حذاء أطفال', 'حذاء كاجوال'],
  'منزل ومطبخ': ['أثاث', 'ثلاجة', 'غسالة', 'فرن', 'مكيف', 'أواني', 'ديكور', 'إضاءة', 'مكنسة', 'أدوات منزلية', 'مطبخ', 'غسالة صحون', 'شفاط', 'خلاط', 'عصارة'],
  'جمال وعناية': ['عطر', 'مكياج', 'كريم', 'شامبو', 'صابون', 'عناية بالبشرة', 'مستحضرات تجميل', 'زيت شعر', 'ماسك', 'مصل', 'تونر'],
  'طعام وشراب': ['عسل', 'زيت', 'قهوة', 'شاي', 'تمر', 'توابل', 'بهارات', 'أغذية طبيعية', 'مكسرات', 'حلويات', 'مربى', 'زعتر'],
  'رياضة': ['معدات رياضية', 'كرة', 'ملابس رياضية', 'أحذية رياضية', 'نادي رياضي', 'تمارين', 'جيم', 'مكملات غذائية'],
  'خدمات': ['طبيب', 'محامي', 'مهندس', 'معلم', 'مصور', 'مصمم', 'مقاول', 'مكتب هندسي', 'عيادة', 'استشاري', 'سباك', 'كهربائي', 'حداد', 'نجار'],
  'هدايا': ['طوق', 'سلسلة', 'خاتم', 'ساعة', 'عطر', 'قميص', 'فستان', 'شنطة', 'حقيبة', 'سوار', 'مجوهرات', 'دمية', 'كتاب'],
  'مستلزمات طبية': ['طبيب', 'عيادة', 'مستشفى', 'علاج', 'صحة', 'طبي', 'أدوية', 'مستلزمات صحية', 'أجهزة طبية'],
  'مستلزمات أطفال': ['طفل', 'بيبي', 'حفاضات', 'رضاعة', 'لعبة', 'سرير طفل', 'عربة أطفال', 'ملابس أطفال', 'أغذية أطفال', 'حليب أطفال'],
  'مستلزمات حيوانات': ['حيوان', 'قط', 'كلب', 'طعام حيوانات', 'مستلزمات قطط', 'مستلزمات كلاب', 'طائر', 'سمك', 'مستلزمات طيور'],
  'أدوات ومعدات': ['معدات', 'أدوات', 'مطرقة', 'مفك', 'كهرباء', 'سباكة', 'نجارة', 'آلات', 'معدات صناعية', 'عدد يدوية'],
  'كتب وقرطاسية': ['كتاب', 'دفتر', 'قرطاسية', 'مكتبة', 'رواية', 'مجلة', 'أدوات مكتبية', 'قلم', 'ألوان', 'ورق', 'مجلدات'],
  'أزهار': ['ورد', 'زهور', 'نباتات', 'تنسيق زهور', 'باقة ورد', 'ورود طبيعية', 'نباتات منزلية', 'شتلات'],
  'سيارات': ['سيارة', 'دراجة', 'قطع غيار', 'اكسسوارات سيارات', 'سيارة جديدة', 'سيارة مستعملة', 'زيوت سيارات', 'معدات سيارات'],
  'عقارات': ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب', 'منزل', 'استوديو', 'مزرعة', 'عقار تجاري', 'عقار سكني'],
  'ألعاب وترفيه': ['لعبة', 'ألعاب فيديو', 'بلاي ستيشن', 'إكس بوكس', 'ألعاب أطفال', 'ألعاب تعليمية', 'دمية', 'ألعاب تركيب'],
  'مستلزمات منزلية': ['أثاث', 'ديكور', 'إضاءة', 'أواني', 'مفروشات', 'ستائر', 'سجاد', 'موكيت', 'مطبخ', 'حمام'],
  'مجوهرات': ['طوق', 'خاتم', 'سوار', 'ساعة', 'ذهب', 'فضة', 'ألماس', 'مجوهرات نسائية', 'مجوهرات رجالية', 'أحجار كريمة'],
};

const POPULAR_BRANDS = [
  // إلكترونيات
  'سامسونج', 'آبل', 'شاومي', 'هواوي', 'نوكيا', 'لينوفو', 'إتش بي', 'ديل',
  'سوني', 'إل جي', 'باناسونيك', 'توشيبا', 'أيسر', 'آسوس', 'مايكروسوفت',
  'أوبو', 'فيفو', 'ريلمي', 'ون بلس', 'جوجل', 'أمازون', 'آيفون', 'macbook', 
  'iphone', 'galaxy', 'note', 'samsung', 'apple', 'oppo', 'vivo', 'xiaomi',
  'realme', 'oneplus', 'google', 'pixel', 'huawei', 'nokia', 'lenovo',
  'hp', 'dell', 'sony', 'lg', 'panasonic', 'toshiba', 'acer', 'asus',
  'microsoft', 'surface', 'kindle', 'fire', 'echo', 'alexa',
  
  // ملابس وأحذية
  'نايك', 'أديداس', 'بوما', 'ريبوك', 'أندر آرمور', 'غوتشي', 'برادا', 
  'لويس فيتون', 'شانيل', 'ديور', 'فيرساتشي', 'أرماني', 'دولتشي', 'غابانا',
  'nike', 'adidas', 'puma', 'reebok', 'under armour',
  'gucci', 'prada', 'louis vuitton', 'chanel', 'dior', 'versace', 'armani',
  'zara', 'h&m', 'pull&bear', 'bershka', 'stradivarius', 'mango',
  'tommy hilfiger', 'calvin klein', 'ralph lauren', 'levis',
  
  // عطور
  'توم فورد', 'شانيل', 'ديور', 'جيفنشي', 'كلوي', 'أو دي', 'جيرلان', 'ميسون',
  'tom ford', 'chanel', 'dior', 'givenchy', 'chloe', 'guerlain', 'maison',
  'arabian oud', 'swiss arabian', 'rasasi', 'ajmal', 'amouage',
  
  // ساعات
  'رولكس', 'أوميغا', 'تاغ هوير', 'سواتش', 'شوبارد', 'بريتلينغ', 'لونجين',
  'rolex', 'omega', 'tag heuer', 'swatch', 'chopard', 'breitling', 'longines',
  'casio', 'seiko', 'citizen', 'fossil', 'michael kors', 'armani',
  
  // سيارات
  'تويوتا', 'هوندا', 'نيسان', 'مرسيدس', 'بي إم دبليو', 'أودي', 'فولكس فاجن',
  'تسلا', 'فورد', 'شيفروليه', 'هيونداي', 'كيا', 'ميتسوبيشي', 'سوبارو',
  'toyota', 'honda', 'nissan', 'mercedes', 'bmw', 'audi', 'volkswagen',
  'tesla', 'ford', 'chevrolet', 'hyundai', 'kia', 'mitsubishi', 'subaru',
  
  // أثاث
  'ايكيا', 'ikea', 'home center', 'saco', 'pottery barn', 'crate & barrel',
  'west elm', 'rh', 'restoration hardware',
  
  // جمال
  'لوريال', 'loreal', 'ميبيلين', 'maybelline', 'نيتروجينا', 'neutrogena',
  'لا مير', 'la mer', 'استي لودر', 'estee lauder', 'كلينيك', 'clinique',
  'مورفي', 'morphe', 'جيفري ستار', 'jeffree star', 'هودا بيوتي', 'huda beauty',
  'nyx', 'mac', 'sephora', 'ulta',
  
  // طعام
  'نسكافيه', 'nescafe', 'ستاربكس', 'starbucks', 'كوفي', 'coffee',
  'الأحساء', 'التمر', 'dates', 'باجة', 'paja', 'سعودي',
];

const SYRIAN_GOVERNORATES = [
  'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماه', 'اللاذقية', 'طرطوس',
  'دير الزور', 'الحسكة', 'الرقة', 'إدلب', 'السويداء', 'درعا', 'القنيطرة',
];

const OFFER_KEYWORDS = ['عرض', 'عروض', 'خصم', 'خصومات', 'تخفيض', 'تخفيضات', 'صفقة', 'كوبون', 'كود خصم', 'sale', 'offer', 'discount', 'deal', 'promotion', 'عرض خاص', 'خصم كبير', 'تخفيضات موسمية'];

// ============================================================
// 🔧 دوال المعالجة الأساسية
// ============================================================

function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  normalized = normalized.replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, '');
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  normalized = normalized.replace(/ة/g, 'ه');
  normalized = normalized.replace(/ى/g, 'ي');
  normalized = normalized.replace(/ئ/g, 'ي');
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ء/g, '');
  normalized = normalized.replace(/\s+/g, ' ');
  return normalized;
}

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[،،،.؟؟!()"']/g, '')
    .replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '')
    .split(' ')
    .filter(w => w.length > 1);
}

function correctText(text: string): string {
  let corrected = text.trim();
  
  const corrections: Record<string, string> = {
    'بدي': 'ابحث عن',
    'بدي طوق': 'طوق',
    'بدي جاكيت': 'جاكيت',
    'بديجاكيت': 'جاكيت',
    'بدي': 'ابحث عن',
    'عايز': 'ابحث عن',
    'عايز طوق': 'طوق',
    'دور': 'ابحث عن',
    'دور على': 'ابحث عن',
    'ابحث': 'ابحث عن',
    'حابب': 'ابحث عن',
    'نفسي': 'ابحث عن',
    'اريد': 'ابحث عن',
    'طوقيات': 'طوق',
    'طوقة': 'طوق',
    'جوالات': 'جوال',
    'سماعات': 'سماعة',
    'لابتوبات': 'لابتوب',
    'ساعات': 'ساعة',
    'عطور': 'عطر',
    'شنط': 'شنطة',
    'احذية': 'حذاء',
    'فساتين': 'فستان',
    'خواتم': 'خاتم',
    'قلادات': 'طوق',
    'سلاسل': 'سلسلة',
    'سامسنج': 'سامسونج',
    'ابل': 'آبل',
    'ايفون': 'آيفون',
    'معطف': 'جاكيت',
    'بالطو': 'جاكيت',
    'سترة': 'جاكيت',
    'موبايل': 'جوال',
    'هاتف': 'جوال',
    'تلفون': 'جوال',
    'براد': 'ثلاجة',
    'بوتاجاز': 'فرن',
    'برفان': 'عطر',
    'حقيبة': 'شنطة',
    'ليرة': 'SYP',
    'ليرات': 'SYP',
    'اقلمن': 'اقل من',
    'اقل': 'اقل من',
    'اكتر': 'اكثر من',
    'اقل من': 'اقل من',
    'اكثر من': 'اكثر من',
    'الاكتر': 'الأكثر',
    'الاقل': 'الأقل',
    'السعر': 'سعر',
    'الاسعار': 'أسعار',
    'غالي': 'سعر مرتفع',
    'رخيص': 'سعر منخفض',
    'عندك': 'عندك',
    'وين': 'أين',
    'شو': 'ما',
    'ايش': 'ما',
    'شنو': 'ما',
    'تفاصيل': 'تفاصيل المنتج',
    'معلومات': 'تفاصيل المنتج',
    'تفاصيل المنتج': 'تفاصيل المنتج',
    'عرض المنتج': 'تفاصيل المنتج',
    'بدي كم': 'كم سعر',
    'كم سعر': 'كم سعر',
    'سعره': 'سعر',
    'بكم': 'سعر',
    'بكم سعر': 'سعر',
  };
  
  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  }
  
  corrected = corrected.replace(/(.)\1{2,}/g, '$1$1');
  corrected = corrected.replace(/[أإآ]/g, 'ا');
  corrected = corrected.replace(/ة/g, 'ه');
  corrected = corrected.replace(/ى/g, 'ي');
  corrected = corrected.replace(/\s+/g, ' ');
  
  return corrected;
}

function extractSearchTerms(text: string): string[] {
  const tokens = tokenize(text);
  const stopWords = ['ابحث', 'عن', 'دور', 'على', 'عندك', 'بدي', 'عايز', 'أريد', 'أحتاج', 'شو', 'شنو', 'ايش', 'من', 'الى', 'في', 'مع', 'عند', 'ال', 'و', 'ب', 'ك', 'ل', 'ماذا', 'كيف'];
  return tokens.filter(w => w.length > 1 && !stopWords.includes(w));
}

function expandSynonyms(terms: string[]): string[] {
  const expanded = [...terms];
  for (const term of terms) {
    for (const [key, synonyms] of Object.entries(SMART_SYNONYMS)) {
      if (synonyms.some(s => s.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase().includes(s.toLowerCase()))) {
        expanded.push(key);
        expanded.push(...synonyms);
      }
    }
    for (const [category, items] of Object.entries(CATEGORY_MAPPING)) {
      if (items.some(i => i.toLowerCase().includes(term.toLowerCase()))) {
        expanded.push(category);
        expanded.push(...items);
      }
    }
  }
  return [...new Set(expanded)];
}

function extractPriceWithFilter(text: string): { min?: number; max?: number; currency?: string; hasPriceFilter: boolean } {
  const result: { min?: number; max?: number; currency?: string; hasPriceFilter: boolean } = { hasPriceFilter: false };
  
  const patterns = [
    { regex: /(اقل|أقل|تحت|less than|under|دون|أقل من)\s*(\d+)/i, type: 'max' },
    { regex: /(اكثر|أكثر|فوق|more than|over|above|اعلى|أكثر من)\s*(\d+)/i, type: 'min' },
    { regex: /(من|بين|between)\s*(\d+)\s*(إلى|و|to|and|-)\s*(\d+)/i, type: 'between' },
    { regex: /(بسعر|بـ|سعر|سعره|price|for|at|يساوي|قيمته|بكم)\s*(\d+)/i, type: 'exact' },
    { regex: /(بحدود|حوالي|تقريباً|approx|around)\s*(\d+)/i, type: 'approx' },
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      result.hasPriceFilter = true;
      
      if (pattern.type === 'max') {
        result.max = parseInt(match[2]);
      } else if (pattern.type === 'min') {
        result.min = parseInt(match[2]);
      } else if (pattern.type === 'between') {
        const nums = text.match(/\d+/g);
        if (nums && nums.length >= 2) {
          result.min = parseInt(nums[0]);
          result.max = parseInt(nums[1]);
        }
      } else if (pattern.type === 'exact') {
        const nums = text.match(/\d+/g);
        if (nums && nums.length >= 1) {
          const price = parseInt(nums[0]);
          result.min = Math.max(0, price - 100);
          result.max = price + 100;
        }
      } else if (pattern.type === 'approx') {
        const nums = text.match(/\d+/g);
        if (nums && nums.length >= 1) {
          const price = parseInt(nums[0]);
          result.min = Math.max(0, price - 200);
          result.max = price + 200;
        }
      }
      break;
    }
  }
  
  if (text.toLowerCase().includes('دولار') || text.toLowerCase().includes('usd')) {
    result.currency = 'USD';
  } else if (text.toLowerCase().includes('ليرة') || text.toLowerCase().includes('syp')) {
    result.currency = 'SYP';
  }
  
  return result;
}

function extractLocation(text: string): string | null {
  const normalized = normalizeText(text);
  for (const gov of SYRIAN_GOVERNORATES) {
    if (normalized.includes(normalizeText(gov))) {
      return gov;
    }
  }
  
  const locationAliases: Record<string, string> = {
    'دمشق': 'دمشق',
    'الشام': 'دمشق',
    'حلب': 'حلب',
    'حلب الشهباء': 'حلب',
    'حمص': 'حمص',
    'حماه': 'حماه',
    'حماة': 'حماه',
    'اللاذقية': 'اللاذقية',
    'لاذقية': 'اللاذقية',
    'طرطوس': 'طرطوس',
    'دير الزور': 'دير الزور',
    'ديرالزور': 'دير الزور',
    'الحسكة': 'الحسكة',
    'الرقة': 'الرقة',
    'إدلب': 'إدلب',
    'ادلب': 'إدلب',
    'السويداء': 'السويداء',
    'درعا': 'درعا',
    'القنيطرة': 'القنيطرة',
  };
  
  for (const [alias, gov] of Object.entries(locationAliases)) {
    if (normalized.includes(normalizeText(alias))) {
      return gov;
    }
  }
  
  return null;
}

function extractBrands(text: string): string[] {
  const brands: string[] = [];
  const normalized = normalizeText(text);
  for (const brand of POPULAR_BRANDS) {
    if (normalized.includes(normalizeText(brand))) {
      brands.push(brand);
    }
  }
  
  const complexBrands = ['سامسونج جالاكسي', 'آيفون', 'ماك بوك', 'إتش بي', 'إل جي', 'سوني', 'تويوتا', 'مرسيدس'];
  for (const brand of complexBrands) {
    if (normalized.includes(normalizeText(brand))) {
      brands.push(brand);
    }
  }
  
  return [...new Set(brands)];
}

function isOfferQuery(text: string): boolean {
  const lower = text.toLowerCase();
  for (const keyword of OFFER_KEYWORDS) {
    if (lower.includes(keyword)) return true;
  }
  return false;
}

function isGreeting(text: string): boolean {
  const greetings = ['السلام', 'اهلا', 'مرحبا', 'هلا', 'صباح', 'مساء', 'hello', 'hi', 'hey', 'وعليكم السلام', 'السلام عليكم', 'أهلاً', 'هلا والله', 'مرحب', 'أهلا'];
  const lower = text.toLowerCase().trim();
  for (const g of greetings) {
    if (lower.includes(g) && lower.length < 50) return true;
  }
  return false;
}

function isHelpRequest(text: string): boolean {
  const helps = ['مساعدة', 'كيف', 'طريقة', 'help', 'guide', 'how', 'ماذا', 'ايش', 'شنو', 'شرح', 'ارشاد', 'تعليمات', 'دليل', 'الاوامر', 'الأوامر'];
  const lower = text.toLowerCase();
  for (const h of helps) {
    if (lower.includes(h)) return true;
  }
  return false;
}

function isCategoryRequest(text: string): boolean {
  const cats = ['تصنيفات', 'اقسام', 'فئات', 'categories', 'sections', 'browse', 'explore', 'استعراض', 'تصفح', 'الأقسام', 'شو في اقسام', 'جميع التصنيفات'];
  const lower = text.toLowerCase();
  for (const c of cats) {
    if (lower.includes(c)) return true;
  }
  return false;
}

function isDetailRequest(text: string): boolean {
  const details = ['تفاصيل', 'معلومات', 'عرض', 'details', 'info', 'about', 'المنتج', 'عرض المنتج', 'شو تفاصيل', 'اخبرني عن', 'اعرض لي', 'تعريف'];
  const lower = text.toLowerCase();
  for (const d of details) {
    if (lower.includes(d)) return true;
  }
  return false;
}

function isConfirmation(text: string): boolean {
  const confirms = ['نعم', 'تمام', 'موافق', 'ok', 'yes', 'yeah', 'حسنا', 'ايوه', 'اكيد', 'طيب', 'باشا', 'حاضر', 'اه'];
  const lower = text.toLowerCase().trim();
  for (const c of confirms) {
    if (lower === c || lower.startsWith(c)) return true;
  }
  return false;
}

function isOrderRequest(text: string): boolean {
  const orderWords = ['طلبي', 'طلباتي', 'أوردر', 'order', 'طلبية', 'شحن', 'توصيل', 'تتبع', 'طلب', 'طلبات', 'الطلبات'];
  const lower = text.toLowerCase();
  for (const word of orderWords) {
    if (lower.includes(word)) return true;
  }
  return false;
}

function isStoreRequest(text: string): boolean {
  const storeWords = ['متجر', 'محل', 'دكان', 'store', 'shop', 'مول', 'مركز تجاري', 'متاجر', 'المتاجر'];
  const lower = text.toLowerCase();
  for (const word of storeWords) {
    if (lower.includes(word)) return true;
  }
  return false;
}

function isServiceRequest(text: string): boolean {
  const serviceWords = ['خدمة', 'خدمات', 'صيانة', 'تصليح', 'تنظيف', 'نقل', 'توصيل', 'service', 'repair', 'maintenance', 'تركيب', 'برمجة'];
  const lower = text.toLowerCase();
  for (const word of serviceWords) {
    if (lower.includes(word)) return true;
  }
  return false;
}

function extractProductTypeWithContext(text: string): string[] {
  const types: string[] = [];
  const normalized = normalizeText(text);
  for (const [key, keywords] of Object.entries(SMART_SYNONYMS)) {
    for (const keyword of keywords) {
      if (normalized.includes(normalizeText(keyword)) || normalized.includes(normalizeText(key))) {
        types.push(key);
        break;
      }
    }
  }
  return [...new Set(types)];
}

function extractCategoryFromQuery(text: string): string[] {
  const categories: string[] = [];
  const normalized = normalizeText(text);
  for (const [category, items] of Object.entries(CATEGORY_MAPPING)) {
    for (const item of items) {
      if (normalized.includes(normalizeText(item)) || normalized.includes(normalizeText(category))) {
        categories.push(category);
        break;
      }
    }
  }
  return [...new Set(categories)];
}

function detectSortOrder(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('الأرخص') || lower.includes('اقل سعر') || lower.includes('cheapest') || lower.includes('price low') || lower.includes('اقل ثمن')) {
    return 'price_asc';
  }
  if (lower.includes('الأغلى') || lower.includes('اعلى سعر') || lower.includes('expensive') || lower.includes('price high') || lower.includes('اعلى ثمن')) {
    return 'price_desc';
  }
  if (lower.includes('الأفضل') || lower.includes('top rated') || lower.includes('اعلى تقييم') || lower.includes('best') || lower.includes('الافضل')) {
    return 'rating';
  }
  if (lower.includes('الأحدث') || lower.includes('newest') || lower.includes('جديد') || lower.includes('حديث') || lower.includes('احدث')) {
    return 'newest';
  }
  if (lower.includes('الأكثر مشاهدة') || lower.includes('popular') || lower.includes('الرائج') || lower.includes('الاكثر شعبية')) {
    return 'popular';
  }
  return null;
}

function generateSmartSuggestions(query: string, results: SearchResult[], isArabic: boolean): string[] {
  const suggestions: string[] = [];
  const normalized = normalizeText(query);
  const productTypes = extractProductTypeWithContext(query);
  const categories = extractCategoryFromQuery(query);
  
  for (const type of productTypes) {
    const related = SMART_SYNONYMS[type] || [];
    for (const syn of related.slice(0, 3)) {
      if (!suggestions.includes(syn) && !normalized.includes(normalizeText(syn))) {
        suggestions.push(syn);
      }
    }
  }
  
  for (const cat of categories) {
    const items = CATEGORY_MAPPING[cat] || [];
    for (const item of items.slice(0, 3)) {
      if (!suggestions.includes(item) && !normalized.includes(normalizeText(item))) {
        suggestions.push(item);
      }
    }
  }
  
  if (results.length > 0) {
    const topResults = results.filter(r => r.type === 'product').slice(0, 3);
    for (const result of topResults) {
      const words = result.title.split(' ');
      for (const word of words) {
        if (word.length > 3 && !suggestions.includes(word) && !normalized.includes(normalizeText(word))) {
          suggestions.push(word);
        }
      }
      if (result.brand && !suggestions.includes(result.brand) && !normalized.includes(normalizeText(result.brand))) {
        suggestions.push(result.brand);
      }
      if (result.categoryName && !suggestions.includes(result.categoryName) && !normalized.includes(normalizeText(result.categoryName))) {
        suggestions.push(result.categoryName);
      }
    }
  }
  
  const general = isArabic ? 
    ['جوالات', 'سماعات', 'لابتوبات', 'ساعات', 'عطور', 'ملابس', 'أحذية', 'إلكترونيات', 'أثاث', 'عروض', 'هدايا'] : 
    ['phones', 'headphones', 'laptops', 'watches', 'perfume', 'clothes', 'shoes', 'electronics', 'furniture', 'offers', 'gifts'];
  
  for (const g of general) {
    if (!suggestions.includes(g) && suggestions.length < 12) {
      suggestions.push(g);
    }
  }
  
  const popularCategories = isArabic ? 
    ['إلكترونيات', 'ملابس', 'أحذية', 'منزل ومطبخ', 'جمال وعناية', 'طعام وشراب', 'خدمات', 'سيارات', 'عقارات', 'مجوهرات'] :
    ['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Beauty & Care', 'Food & Beverages', 'Services', 'Cars', 'Real Estate', 'Jewelry'];
  
  for (const cat of popularCategories) {
    if (!suggestions.includes(cat) && suggestions.length < 12) {
      suggestions.push(cat);
    }
  }
  
  return suggestions.slice(0, 12);
}

function detectUserIntent(text: string, context: ConversationContext, isArabic: boolean): { 
  intent: 'search' | 'details' | 'confirm' | 'help' | 'greeting' | 'browse_categories' | 'unknown' | 'orders' | 'store' | 'service' | 'compare' | 'filter';
  extractedQuery?: string;
  productId?: string;
  confidence: number;
} {
  const lower = text.toLowerCase().trim();
  let confidence = 0.5;
  
  if (isGreeting(text) && lower.length < 50) {
    return { intent: 'greeting', confidence: 0.98 };
  }
  
  if (isHelpRequest(text)) {
    return { intent: 'help', confidence: 0.98 };
  }
  
  if (isCategoryRequest(text)) {
    return { intent: 'browse_categories', confidence: 0.95 };
  }
  
  if (isOrderRequest(text)) {
    return { intent: 'orders', confidence: 0.92 };
  }
  
  if (isStoreRequest(text)) {
    return { intent: 'store', confidence: 0.88 };
  }
  
  if (isServiceRequest(text)) {
    return { intent: 'service', confidence: 0.88 };
  }
  
  if (isConfirmation(text)) {
    if (context.lastResults && context.lastResults.length > 0) {
      return { intent: 'confirm', extractedQuery: context.lastQuery, confidence: 0.92 };
    }
  }
  
  if (isDetailRequest(text)) {
    if (context.lastProductId) {
      return { intent: 'details', productId: context.lastProductId, confidence: 0.95 };
    }
    if (context.lastResults && context.lastResults.length > 0) {
      const firstProduct = context.lastResults.find(r => r.type === 'product');
      if (firstProduct) {
        return { intent: 'details', productId: firstProduct.id, confidence: 0.92 };
      }
    }
    return { intent: 'search', extractedQuery: text, confidence: 0.6 };
  }
  
  if (lower.includes('مقارنة') || lower.includes('compare') || lower.includes('قارن') || lower.includes('أفضل')) {
    return { intent: 'compare', extractedQuery: text, confidence: 0.88 };
  }
  
  if (lower.includes('فلتر') || lower.includes('filter') || lower.includes('تصفية') || lower.includes('ترتيب')) {
    return { intent: 'filter', extractedQuery: text, confidence: 0.85 };
  }
  
  return { intent: 'search', extractedQuery: text, confidence: 0.8 };
}

function calculateRelevanceScore(
  item: any,
  originalTerms: string[],
  expandedTerms: string[],
  productTypes: string[],
  brands: string[],
  location: string | null,
  priceFilter: { min?: number; max?: number },
  isArabic: boolean,
  sortOrder: string | null = null
): { score: number; matchType: string; details: string[] } {
  let score = 0;
  const details: string[] = [];
  let matchType = 'fuzzy';
  
  const title = isArabic ? item.title_ar : (item.title_en || item.title_ar);
  const desc = isArabic ? item.description_ar : (item.description_en || '');
  const titleLower = title?.toLowerCase() || '';
  const descLower = desc?.toLowerCase() || '';
  
  for (const term of originalTerms) {
    if (titleLower === term.toLowerCase()) {
      score += 60;
      matchType = 'exact';
      details.push(`تطابق تام في العنوان: ${term}`);
      break;
    }
  }
  
  if (score < 50) {
    for (const term of originalTerms) {
      if (titleLower.includes(term.toLowerCase())) {
        score += 35;
        if (matchType === 'fuzzy') matchType = 'partial';
        details.push(`تطابق جزئي في العنوان: ${term}`);
        break;
      }
    }
  }
  
  if (score < 60) {
    for (const term of expandedTerms) {
      if (titleLower.includes(term.toLowerCase()) && !originalTerms.some(t => titleLower.includes(t.toLowerCase()))) {
        score += 25;
        if (matchType === 'fuzzy') matchType = 'synonym';
        details.push(`تطابق مرادف: ${term}`);
        break;
      }
    }
  }
  
  for (const term of originalTerms) {
    if (descLower.includes(term.toLowerCase())) {
      score += 15;
      details.push(`تطابق في الوصف: ${term}`);
      break;
    }
  }
  
  for (const type of productTypes) {
    if (titleLower.includes(type.toLowerCase()) || descLower.includes(type.toLowerCase())) {
      score += 25;
      details.push(`نوع المنتج: ${type}`);
      break;
    }
  }
  
  for (const brand of brands) {
    if (titleLower.includes(brand.toLowerCase()) || descLower.includes(brand.toLowerCase())) {
      score += 20;
      details.push(`الماركة: ${brand}`);
      break;
    }
  }
  
  if (location && item.governorates?.name_ar === location) {
    score += 15;
    details.push(`الموقع: ${location}`);
  }
  
  if (item.rating) {
    if (item.rating >= 4.5) { score += 15; details.push('تقييم ممتاز'); }
    else if (item.rating >= 4) { score += 10; details.push('تقييم جيد جداً'); }
    else if (item.rating >= 3) { score += 5; details.push('تقييم جيد'); }
  }
  
  const popularity = Math.min((item.views || 0) / 100, 8) + Math.min((item.favorites_count || 0) / 50, 8);
  if (popularity > 0) { 
    score += popularity; 
    if (popularity > 6) details.push('منتج مشهور');
    else if (popularity > 3) details.push('منتج رائج');
  }
  
  if (item.is_offer && item.discount_percent) {
    const discountScore = Math.min(item.discount_percent / 8, 12);
    score += discountScore;
    if (discountScore > 6) details.push(`عرض مميز خصم ${item.discount_percent}%`);
    else if (discountScore > 3) details.push(`خصم ${item.discount_percent}%`);
  }
  
  if (item.created_at) {
    const daysOld = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 3) { score += 8; details.push('جديد اليوم'); }
    else if (daysOld < 7) { score += 6; details.push('جديد هذا الأسبوع'); }
    else if (daysOld < 30) { score += 4; details.push('حديث'); }
  }
  
  if (priceFilter.min !== undefined && item.price >= priceFilter.min) { 
    score += 8; 
    details.push('سعر ضمن النطاق المطلوب'); 
  }
  if (priceFilter.max !== undefined && item.price <= priceFilter.max) { 
    score += 8; 
    details.push('سعر ضمن النطاق المطلوب'); 
  }
  
  if (sortOrder) {
    switch (sortOrder) {
      case 'price_asc':
        if (item.price) score += Math.max(0, 10 - (item.price / 100000));
        break;
      case 'price_desc':
        if (item.price) score += Math.min(10, item.price / 100000);
        break;
      case 'rating':
        if (item.rating) score += item.rating * 3;
        break;
      case 'newest':
        if (item.created_at) {
          const daysOld = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
          score += Math.max(0, 15 - daysOld);
        }
        break;
      case 'popular':
        score += Math.min(15, (item.views || 0) / 50 + (item.favorites_count || 0) / 25);
        break;
    }
  }
  
  return { score: Math.min(Math.round(score), 100), matchType, details };
}

// ============================================================
// 📂 دوال البحث في قاعدة البيانات بالكامل
// ============================================================

async function searchAllTables(
  query: string,
  supabaseClient: any,
  lang: 'ar' | 'en',
  filters?: ConversationContext['filters']
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const isArabic = lang === 'ar';
  
  const correctedQuery = correctText(query);
  const originalTerms = tokenize(correctedQuery);
  const expandedTerms = expandSynonyms(originalTerms);
  const brands = extractBrands(correctedQuery);
  const priceFilter = extractPriceWithFilter(correctedQuery);
  const location = extractLocation(correctedQuery);
  const isOffer = isOfferQuery(correctedQuery);
  const productTypes = extractProductTypeWithContext(correctedQuery);
  const categories = extractCategoryFromQuery(correctedQuery);
  const sortOrder = detectSortOrder(correctedQuery) || filters?.sortBy || null;
  
  console.log('Search Query:', correctedQuery);
  console.log('Original Terms:', originalTerms);
  console.log('Expanded Terms:', expandedTerms);
  console.log('Brands:', brands);
  console.log('Price Filter:', priceFilter);
  console.log('Location:', location);
  console.log('Product Types:', productTypes);
  console.log('Categories:', categories);
  console.log('Sort Order:', sortOrder);
  
  // ==========================================================
  // 1️⃣ البحث في المنتجات (listings)
  // ==========================================================
  let productQuery = supabaseClient
    .from('listings')
    .select(`
      id, title_ar, title_en, price, old_price, discount_percent,
      is_offer, cover_url, description_ar, description_en,
      category_id, governorate_id, rating, favorites_count, views, created_at,
      is_available, currency, kind, status, delivery_method,
      categories:category_id (id, name_ar, name_en, slug, icon),
      governorates:governorate_id (id, name_ar, name_en, slug),
      profiles:owner_id (id, store_name, store_logo_url, store_active)
    `)
    .eq('status', 'published')
    .eq('is_available', true);
  
  let searchConditions: string[] = [];
  const allSearchTerms = [...originalTerms, ...expandedTerms];
  
  for (const term of allSearchTerms) {
    if (term.length > 1) {
      if (isArabic) {
        searchConditions.push(`title_ar.ilike.%${term}%`);
        searchConditions.push(`description_ar.ilike.%${term}%`);
      } else {
        searchConditions.push(`title_en.ilike.%${term}%`);
        searchConditions.push(`description_en.ilike.%${term}%`);
      }
    }
  }
  
  if (searchConditions.length > 0) {
    productQuery = productQuery.or(searchConditions.join(','));
  }
  
  if (productTypes.length > 0) {
    const typePattern = productTypes.join('|');
    if (isArabic) {
      productQuery = productQuery.or(`title_ar.ilike.%${typePattern}%,description_ar.ilike.%${typePattern}%`);
    } else {
      productQuery = productQuery.or(`title_en.ilike.%${typePattern}%,description_en.ilike.%${typePattern}%`);
    }
  }
  
  if (brands.length > 0) {
    const brandPattern = brands.join('|');
    if (isArabic) {
      productQuery = productQuery.or(`title_ar.ilike.%${brandPattern}%,description_ar.ilike.%${brandPattern}%`);
    } else {
      productQuery = productQuery.or(`title_en.ilike.%${brandPattern}%,description_en.ilike.%${brandPattern}%`);
    }
  }
  
  if (filters?.minPrice !== undefined) productQuery = productQuery.gte('price', filters.minPrice);
  if (filters?.maxPrice !== undefined) productQuery = productQuery.lte('price', filters.maxPrice);
  if (priceFilter.min !== undefined) productQuery = productQuery.gte('price', priceFilter.min);
  if (priceFilter.max !== undefined) productQuery = productQuery.lte('price', priceFilter.max);
  
  if (isOffer || filters?.isOffer) productQuery = productQuery.eq('is_offer', true);
  
  if (location || filters?.location) {
    const locationName = location || filters?.location;
    if (locationName) {
      productQuery = productQuery.eq('governorates.name_ar', locationName);
    }
  }
  
  if (filters?.category) {
    productQuery = productQuery.eq('categories.name_ar', filters.category);
  }
  
  if (filters?.minRating) {
    productQuery = productQuery.gte('rating', filters.minRating);
  }
  
  if (filters?.brand) {
    const brandPattern = filters.brand;
    if (isArabic) {
      productQuery = productQuery.or(`title_ar.ilike.%${brandPattern}%,description_ar.ilike.%${brandPattern}%`);
    } else {
      productQuery = productQuery.or(`title_en.ilike.%${brandPattern}%,description_en.ilike.%${brandPattern}%`);
    }
  }
  
  if (sortOrder) {
    switch (sortOrder) {
      case 'price_asc':
        productQuery = productQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        productQuery = productQuery.order('price', { ascending: false });
        break;
      case 'rating':
        productQuery = productQuery.order('rating', { ascending: false });
        break;
      case 'newest':
        productQuery = productQuery.order('created_at', { ascending: false });
        break;
      case 'popular':
        productQuery = productQuery.order('views', { ascending: false });
        break;
    }
  } else {
    productQuery = productQuery.order('created_at', { ascending: false });
  }
  
  const { data: products } = await productQuery.limit(100);
  
  if (products) {
    for (const item of products) {
      const title = isArabic ? item.title_ar : (item.title_en || item.title_ar);
      const desc = isArabic ? item.description_ar : (item.description_en || '');
      
      const relevance = calculateRelevanceScore(
        item, originalTerms, expandedTerms, productTypes, brands, location, 
        priceFilter, isArabic, sortOrder
      );
      
      if (relevance.score > 5) {
        let categoryName = '';
        if (item.categories) {
          categoryName = isArabic ? item.categories.name_ar : (item.categories.name_en || item.categories.name_ar);
        }
        
        results.push({
          type: 'product',
          id: item.id,
          title: title || item.title_ar || 'منتج',
          price: item.price,
          oldPrice: item.old_price,
          discountPercent: item.discount_percent,
          rating: item.rating,
          description: desc,
          image: item.cover_url,
          score: relevance.score,
          link: `/listing/${item.id}`,
          inStock: item.is_available,
          isOffer: item.is_offer,
          storeName: item.profiles?.store_name,
          location: item.governorates?.name_ar,
          views: item.views,
          favorites: item.favorites_count,
          categoryName: categoryName,
          brand: brands.length > 0 ? brands[0] : undefined,
          extra: item.is_offer && item.discount_percent ? `خصم ${item.discount_percent}%` : 
                 item.rating && item.rating >= 4.5 ? 'ممتاز' :
                 item.rating && item.rating >= 4 ? 'جيد جداً' : undefined,
        });
      }
    }
  }
  
  // ==========================================================
  // 2️⃣ البحث في المتاجر (profiles)
  // ==========================================================
  let storeQuery = supabaseClient
    .from('profiles')
    .select(`
      id, store_name, store_description, store_logo_url, store_cover_url,
      governorate_id, rating, is_featured, store_active, store_online,
      governorates:governorate_id (id, name_ar, name_en, slug)
    `)
    .eq('store_active', true)
    .not('store_name', 'is', null);
  
  const storeTerms = [...originalTerms, ...expandedTerms];
  const storeConditions = storeTerms.map(t => `store_name.ilike.%${t}%`).join(',');
  if (storeTerms.length > 0) storeQuery = storeQuery.or(storeConditions);
  
  if (location) storeQuery = storeQuery.eq('governorates.name_ar', location);
  if (filters?.location) storeQuery = storeQuery.eq('governorates.name_ar', filters.location);
  
  const { data: stores } = await storeQuery.limit(30);
  
  if (stores) {
    for (const store of stores) {
      let score = 30;
      const storeName = store.store_name || '';
      const storeDesc = store.store_description || '';
      
      for (const term of originalTerms) {
        if (storeName.toLowerCase().includes(term.toLowerCase())) score += 35;
        if (storeDesc.toLowerCase().includes(term.toLowerCase())) score += 15;
      }
      for (const term of expandedTerms) {
        if (storeName.toLowerCase().includes(term.toLowerCase()) && !originalTerms.some(t => storeName.toLowerCase().includes(t.toLowerCase()))) {
          score += 20;
        }
      }
      if (location && store.governorates?.name_ar === location) score += 20;
      if (store.is_featured) score += 15;
      if (store.rating && store.rating >= 4) score += 15;
      if (store.rating && store.rating >= 4.5) score += 10;
      if (store.store_online) score += 5;
      
      if (score > 20) {
        results.push({
          type: 'store',
          id: store.id,
          title: storeName,
          description: storeDesc,
          image: store.store_logo_url || store.store_cover_url,
          score: Math.min(Math.round(score), 100),
          link: `/store/${store.id}`,
          rating: store.rating,
          location: store.governorates?.name_ar,
          extra: location && store.governorates?.name_ar === location ? 'في منطقتك' : 
                 store.is_featured ? 'متجر مميز' :
                 store.store_online ? 'متصل الآن' : undefined,
        });
      }
    }
  }
  
  // ==========================================================
  // 3️⃣ البحث في التصنيفات (categories)
  // ==========================================================
  let categoryQuery = supabaseClient
    .from('categories')
    .select('id, name_ar, name_en, slug, image_url, icon, sort_order, parent_id, is_featured')
    .eq('active', true);
  
  let categoryConditions: string[] = [];
  for (const term of [...originalTerms, ...expandedTerms]) {
    if (term.length > 1) {
      categoryConditions.push(`name_ar.ilike.%${term}%`);
      categoryConditions.push(`name_en.ilike.%${term}%`);
    }
  }
  
  if (categoryConditions.length > 0) {
    categoryQuery = categoryQuery.or(categoryConditions.join(','));
  }
  
  if (categories.length > 0) {
    const catPattern = categories.join('|');
    categoryQuery = categoryQuery.or(`name_ar.ilike.%${catPattern}%,name_en.ilike.%${catPattern}%`);
  }
  
  const { data: categoriesData } = await categoryQuery.limit(20);
  
  if (categoriesData) {
    for (const cat of categoriesData) {
      let score = 30;
      const nameAr = cat.name_ar || '';
      const nameEn = cat.name_en || '';
      const name = isArabic ? nameAr : (nameEn || nameAr);
      
      for (const term of originalTerms) {
        if (nameAr.toLowerCase().includes(term.toLowerCase()) || nameEn.toLowerCase().includes(term.toLowerCase())) {
          score += 45;
        }
      }
      
      for (const term of expandedTerms) {
        if (nameAr.toLowerCase().includes(term.toLowerCase()) || nameEn.toLowerCase().includes(term.toLowerCase())) {
          score += 25;
        }
      }
      
      if (cat.is_featured) score += 10;
      
      if (score > 30) {
        results.push({
          type: 'category',
          id: cat.id,
          title: name || cat.name_ar || 'تصنيف',
          image: cat.image_url,
          score: Math.min(Math.round(score), 100),
          link: `/category/${cat.slug || cat.id}`,
          icon: cat.icon || '📂',
          sortOrder: cat.sort_order,
        });
      }
    }
  }
  
  // ==========================================================
  // 4️⃣ البحث في المحافظات (governorates)
  // ==========================================================
  let govQuery = supabaseClient
    .from('governorates')
    .select('id, name_ar, name_en, slug, sort_order')
    .limit(10);
  
  if (location) {
    govQuery = govQuery.ilike('name_ar', `%${location}%`);
    const { data: govs } = await govQuery;
    if (govs) {
      for (const gov of govs) {
        results.push({
          type: 'governorate',
          id: gov.id,
          title: isArabic ? gov.name_ar : (gov.name_en || gov.name_ar),
          score: 85,
          link: `/governorate/${gov.slug || gov.id}`,
          icon: '📍',
          sortOrder: gov.sort_order,
        });
      }
    }
  } else {
    const { data: govs } = await govQuery;
    if (govs) {
      for (const gov of govs) {
        const name = isArabic ? gov.name_ar : (gov.name_en || gov.name_ar);
        let score = 50;
        for (const term of originalTerms) {
          if (name.toLowerCase().includes(term.toLowerCase())) {
            score += 30;
          }
        }
        results.push({
          type: 'governorate',
          id: gov.id,
          title: name,
          score: Math.min(score, 100),
          link: `/governorate/${gov.slug || gov.id}`,
          icon: '📍',
          sortOrder: gov.sort_order,
        });
      }
    }
  }
  
  // ==========================================================
  // 5️⃣ البحث في الإعلانات (announcements)
  // ==========================================================
  if (originalTerms.length > 0 || expandedTerms.length > 0) {
    let announcementQuery = supabaseClient
      .from('announcements')
      .select('id, text_ar, text_en, link_url, sort_order, active')
      .eq('active', true);
    
    const announcementConditions: string[] = [];
    for (const term of [...originalTerms, ...expandedTerms]) {
      if (term.length > 1) {
        announcementConditions.push(`text_ar.ilike.%${term}%`);
        announcementConditions.push(`text_en.ilike.%${term}%`);
      }
    }
    
    if (announcementConditions.length > 0) {
      announcementQuery = announcementQuery.or(announcementConditions.join(','));
    }
    
    const { data: announcements } = await announcementQuery.limit(5);
    
    if (announcements) {
      for (const ann of announcements) {
        const text = isArabic ? ann.text_ar : (ann.text_en || ann.text_ar);
        if (text) {
          let score = 40;
          for (const term of originalTerms) {
            if (text.toLowerCase().includes(term.toLowerCase())) {
              score += 30;
            }
          }
          results.push({
            type: 'announcement',
            id: ann.id,
            title: text.length > 100 ? text.substring(0, 100) + '...' : text,
            description: text,
            score: Math.min(Math.round(score), 100),
            link: ann.link_url || '#',
            icon: '📢',
            sortOrder: ann.sort_order,
          });
        }
      }
    }
  }
  
  // ==========================================================
  // 6️⃣ البحث في العروض الترويجية (promo_codes)
  // ==========================================================
  if (originalTerms.length > 0 || isOffer) {
    let promoQuery = supabaseClient
      .from('promo_codes')
      .select('id, code, label, description, type, value, min_order, max_discount, is_active, expires_at')
      .eq('is_active', true);
    
    if (isOffer) {
      promoQuery = promoQuery.eq('is_active', true);
    }
    
    const promoConditions: string[] = [];
    for (const term of [...originalTerms, ...expandedTerms]) {
      if (term.length > 1) {
        promoConditions.push(`label.ilike.%${term}%`);
        promoConditions.push(`description.ilike.%${term}%`);
        promoConditions.push(`code.ilike.%${term}%`);
      }
    }
    
    if (promoConditions.length > 0) {
      promoQuery = promoQuery.or(promoConditions.join(','));
    }
    
    const { data: promos } = await promoQuery.limit(5);
    
    if (promos) {
      for (const promo of promos) {
        let score = 30;
        for (const term of originalTerms) {
          if (promo.label?.toLowerCase().includes(term.toLowerCase()) || 
              promo.code?.toLowerCase().includes(term.toLowerCase()) ||
              promo.description?.toLowerCase().includes(term.toLowerCase())) {
            score += 35;
          }
        }
        
        if (score > 20) {
          results.push({
            type: 'promo',
            id: promo.id,
            title: `${promo.code || 'كود'} - ${promo.label || 'عرض'}`,
            description: `${promo.type === 'percentage' ? `${promo.value}%` : `${promo.value} SYP`} خصم`,
            score: Math.min(Math.round(score), 100),
            link: `/promo/${promo.id}`,
            icon: '🎫',
            extra: promo.expires_at ? `ينتهي ${new Date(promo.expires_at).toLocaleDateString()}` : undefined,
            code: promo.code,
          });
        }
      }
    }
  }
  
  // ==========================================================
  // 7️⃣ البحث في البانرات (banners)
  // ==========================================================
  if (originalTerms.length > 0) {
    let bannerQuery = supabaseClient
      .from('banners')
      .select('id, title_ar, title_en, subtitle_ar, subtitle_en, link_url, sort_order, active')
      .eq('active', true);
    
    const bannerConditions: string[] = [];
    for (const term of [...originalTerms, ...expandedTerms]) {
      if (term.length > 1) {
        bannerConditions.push(`title_ar.ilike.%${term}%`);
        bannerConditions.push(`title_en.ilike.%${term}%`);
        bannerConditions.push(`subtitle_ar.ilike.%${term}%`);
        bannerConditions.push(`subtitle_en.ilike.%${term}%`);
      }
    }
    
    if (bannerConditions.length > 0) {
      bannerQuery = bannerQuery.or(bannerConditions.join(','));
    }
    
    const { data: banners } = await bannerQuery.limit(5);
    
    if (banners) {
      for (const banner of banners) {
        const title = isArabic ? banner.title_ar : (banner.title_en || banner.title_ar);
        const subtitle = isArabic ? banner.subtitle_ar : (banner.subtitle_en || banner.subtitle_ar);
        if (title) {
          let score = 30;
          for (const term of originalTerms) {
            if (title.toLowerCase().includes(term.toLowerCase()) || 
                (subtitle && subtitle.toLowerCase().includes(term.toLowerCase()))) {
              score += 35;
            }
          }
          results.push({
            type: 'banner',
            id: banner.id,
            title: title,
            description: subtitle || '',
            score: Math.min(Math.round(score), 100),
            link: banner.link_url || '#',
            icon: '📸',
            sortOrder: banner.sort_order,
          });
        }
      }
    }
  }
  
  results.sort((a, b) => b.score - a.score);
  
  const uniqueResults: SearchResult[] = [];
  const seen = new Set<string>();
  for (const result of results) {
    const key = `${result.type}-${result.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(result);
    }
  }
  
  return uniqueResults.slice(0, 200);
}

// ============================================================
// 📝 بناء الردود الاحترافية المختصرة
// ============================================================

function buildSearchResponse(
  results: SearchResult[],
  query: string,
  isArabic: boolean,
  suggestions: string[],
  total: number,
  filters?: ConversationContext['filters']
): string {
  const correctedQuery = correctText(query);
  const displayQuery = correctedQuery !== query ? correctedQuery : query;
  
  if (results.length === 0) {
    let response = isArabic 
      ? `لا توجد نتائج لـ "${displayQuery}"`
      : `No results for "${displayQuery}"`;
    
    if (suggestions.length > 0) {
      response += isArabic
        ? `\n\nاقتراحات: ${suggestions.slice(0, 4).join('، ')}`
        : `\n\nSuggestions: ${suggestions.slice(0, 4).join(', ')}`;
    }
    return response;
  }
  
  const products = results.filter(r => r.type === 'product');
  const stores = results.filter(r => r.type === 'store');
  const categories = results.filter(r => r.type === 'category');
  const governorates = results.filter(r => r.type === 'governorate');
  const promos = results.filter(r => r.type === 'promo');
  const announcements = results.filter(r => r.type === 'announcement');
  
  let response = '';
  
  let countParts = [];
  if (products.length > 0) countParts.push(`${products.length} منتج`);
  if (stores.length > 0) countParts.push(`${stores.length} متجر`);
  if (categories.length > 0) countParts.push(`${categories.length} تصنيف`);
  if (governorates.length > 0) countParts.push(`${governorates.length} محافظة`);
  if (promos.length > 0) countParts.push(`${promos.length} عرض`);
  if (announcements.length > 0) countParts.push(`${announcements.length} إعلان`);
  
  response += isArabic
    ? `نتائج "${displayQuery}" (${countParts.join('، ')})\n\n`
    : `Results for "${displayQuery}" (${countParts.join(', ')})\n\n`;
  
  if (products.length > 0) {
    products.slice(0, 5).forEach((item, index) => {
      let priceText = '';
      if (item.price) {
        if (item.isOffer && item.oldPrice) {
          priceText = `${item.oldPrice.toLocaleString()} → ${item.price.toLocaleString()} SYP`;
        } else {
          priceText = `${item.price.toLocaleString()} SYP`;
        }
      }
      
      let extraInfo = [];
      if (item.location) extraInfo.push(item.location);
      if (item.storeName) extraInfo.push(item.storeName);
      if (item.discountPercent && item.discountPercent > 0) {
        extraInfo.push(`خصم ${item.discountPercent}%`);
      }
      if (item.rating && item.rating >= 4) {
        extraInfo.push(`تقييم ${item.rating.toFixed(1)}`);
      }
      if (item.brand) extraInfo.push(item.brand);
      
      response += `${index + 1}. ${item.title}`;
      if (priceText) response += ` - ${priceText}`;
      if (extraInfo.length > 0) response += ` (${extraInfo.join('، ')})`;
      response += `\n   ${item.link}\n\n`;
    });
    
    if (products.length > 5) {
      response += isArabic 
        ? `... و ${products.length - 5} منتج آخر\n\n`
        : `... and ${products.length - 5} more products\n\n`;
    }
  }
  
  if (stores.length > 0) {
    stores.slice(0, 3).forEach((item) => {
      let info = [];
      if (item.location) info.push(item.location);
      if (item.rating) info.push(`تقييم ${item.rating.toFixed(1)}`);
      if (item.extra) info.push(item.extra);
      
      response += `متجر: ${item.title}`;
      if (info.length > 0) response += ` (${info.join('، ')})`;
      response += `\n   ${item.link}\n\n`;
    });
  }
  
  if (categories.length > 0) {
    const catNames = categories.slice(0, 3).map(c => c.title).join('، ');
    response += isArabic
      ? `تصنيفات: ${catNames}\n\n`
      : `Categories: ${catNames}\n\n`;
  }
  
  if (governorates.length > 0) {
    const govNames = governorates.slice(0, 3).map(g => g.title).join('، ');
    response += isArabic
      ? `محافظات: ${govNames}\n\n`
      : `Governorates: ${govNames}\n\n`;
  }
  
  if (promos.length > 0) {
    const promoInfo = promos.slice(0, 2).map(p => p.code || p.title).join('، ');
    response += isArabic
      ? `عروض: ${promoInfo}\n\n`
      : `Offers: ${promoInfo}\n\n`;
  }
  
  if (suggestions.length > 0) {
    response += isArabic
      ? `اقتراحات: ${suggestions.slice(0, 4).join('، ')}\n\n`
      : `Suggestions: ${suggestions.slice(0, 4).join(', ')}\n\n`;
  }
  
  response += isArabic
    ? `اكتب "تفاصيل" لعرض معلومات المنتج | "مساعدة" للأوامر`
    : `Type "details" for product info | "help" for commands`;
  
  return response;
}

function buildProductDetailsResponse(product: any, isArabic: boolean): string {
  const title = isArabic ? product.title_ar : (product.title_en || product.title_ar);
  const desc = isArabic ? product.description_ar : (product.description_en || '');
  
  let response = `${title}\n`;
  response += `${'─'.repeat(30)}\n\n`;
  
  if (product.price) {
    let priceText = `${product.price.toLocaleString()} SYP`;
    if (product.old_price) {
      priceText += ` (كان ${product.old_price.toLocaleString()} SYP`;
      if (product.discount_percent) {
        priceText += `، خصم ${product.discount_percent}%`;
      }
      priceText += `)`;
    }
    response += `السعر: ${priceText}\n`;
  }
  
  if (product.rating) {
    response += `التقييم: ${product.rating.toFixed(1)}/5\n`;
  }
  
  if (desc) {
    response += `\n${desc}\n`;
  }
  
  let info = [];
  if (product.governorates?.name_ar) info.push(`الموقع: ${product.governorates.name_ar}`);
  if (product.profiles?.store_name) info.push(`المتجر: ${product.profiles.store_name}`);
  if (product.is_available !== undefined) {
    info.push(`الحالة: ${product.is_available ? 'متوفر' : 'غير متوفر'}`);
  }
  
  if (info.length > 0) {
    response += `\n${info.join(' | ')}`;
  }
  
  response += `\n\n${product.id ? `/listing/${product.id}` : ''}`;
  
  return response;
}

function buildGreetingResponse(isArabic: boolean): string {
  return isArabic
    ? `مرحباً بك في السوق لعندك

أنا مساعدك الذكي، جاهز لمساعدتك في البحث عن المنتجات والمتاجر والتصنيفات.

مثال: "ابحث عن جوال سامسونج" أو "عروض في دمشق"

ماذا تريد أن تبحث عنه؟`
    : `Welcome to Souq Le3ndak

I'm your smart assistant, ready to help you search for products, stores, and categories.

Example: "Search Samsung phones" or "Offers in Damascus"

What would you like to search for?`;
}

function buildHelpResponse(isArabic: boolean): string {
  return isArabic
    ? `الأوامر المدعومة:

• بحث: "ابحث عن [اسم المنتج]"
• سعر: "اقل من 500000" أو "اكثر من 100000"
• موقع: "في دمشق" أو "في حلب"
• تفاصيل: "تفاصيل" لعرض آخر منتج
• تصنيفات: "عرض التصنيفات"
• متاجر: "متاجر في [المدينة]"
• عروض: "عروض" أو "خصومات"
• طلباتي: "طلبياتي"
• مساعدة: "مساعدة"

تحدث بشكل طبيعي وأنا سأفهمك`
    : `Supported commands:

• Search: "Search for [product name]"
• Price: "Under 500000" or "Over 100000"
• Location: "In Damascus" or "In Aleppo"
• Details: "Details" to view last product
• Categories: "Show categories"
• Stores: "Stores in [city]"
• Offers: "Offers" or "Discounts"
• My orders: "My orders"
• Help: "Help"

Speak naturally and I'll understand you`;
}

function buildCategoriesResponse(categories: any[], isArabic: boolean): string {
  if (!categories || categories.length === 0) {
    return isArabic ? 'لا توجد تصنيفات حالياً' : 'No categories found';
  }
  
  let response = isArabic ? 'التصنيفات المتاحة:\n\n' : 'Available Categories:\n\n';
  
  categories.slice(0, 15).forEach((cat, index) => {
    const name = isArabic ? cat.name_ar : (cat.name_en || cat.name_ar);
    response += `${index + 1}. ${name}`;
    if (cat.is_featured) response += ' (مميز)';
    response += `\n   /category/${cat.slug || cat.id}\n\n`;
  });
  
  if (categories.length > 15) {
    response += isArabic 
      ? `... و ${categories.length - 15} تصنيف آخر`
      : `... and ${categories.length - 15} more categories`;
  }
  
  return response;
}

function buildOrderResponse(orders: any[], isArabic: boolean): string {
  if (!orders || orders.length === 0) {
    return isArabic 
      ? 'لا توجد طلبات حالياً'
      : 'No orders found';
  }
  
  let response = isArabic
    ? `طلباتي (${orders.length})\n\n`
    : `My Orders (${orders.length})\n\n`;
  
  orders.slice(0, 5).forEach((order, index) => {
    response += `${index + 1}. طلب #${order.id?.substring(0, 8) || 'N/A'}`;
    if (order.total) response += ` - ${order.total.toLocaleString()} SYP`;
    if (order.status) response += ` (${order.status})`;
    response += `\n   ${new Date(order.created_at).toLocaleDateString()}`;
    if (order.tracking_number) response += ` | تتبع: ${order.tracking_number}`;
    response += `\n   /order/${order.id}\n\n`;
  });
  
  if (orders.length > 5) {
    response += isArabic 
      ? `... و ${orders.length - 5} طلب آخر`
      : `... and ${orders.length - 5} more orders`;
  }
  
  return response;
}

function buildStoreResponse(stores: any[], isArabic: boolean): string {
  if (!stores || stores.length === 0) {
    return isArabic 
      ? 'لا توجد متاجر مطابقة'
      : 'No matching stores found';
  }
  
  let response = isArabic
    ? `المتاجر (${stores.length})\n\n`
    : `Stores (${stores.length})\n\n`;
  
  stores.slice(0, 5).forEach((store, index) => {
    response += `${index + 1}. ${store.store_name}`;
    if (store.governorates?.name_ar) response += ` (${store.governorates.name_ar})`;
    if (store.rating) response += ` - تقييم ${store.rating.toFixed(1)}`;
    if (store.is_featured) response += ' - مميز';
    response += `\n   /store/${store.id}\n\n`;
  });
  
  return response;
}

// ============================================================
// 🔧 دوال مساعدة إضافية
// ============================================================

function extractFilters(text: string): ConversationContext['filters'] {
  const filters: ConversationContext['filters'] = {};
  const lower = text.toLowerCase();
  
  const priceMatch = text.match(/(?:اقل|أقل|تحت|under|less than)\s*(\d+)/i);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1]);
  }
  
  const priceMinMatch = text.match(/(?:اكثر|أكثر|فوق|over|more than|above)\s*(\d+)/i);
  if (priceMinMatch) {
    filters.minPrice = parseInt(priceMinMatch[1]);
  }
  
  const location = extractLocation(text);
  if (location) {
    filters.location = location;
  }
  
  const ratingMatch = text.match(/(?:تقييم|rating)\s*(?:اكثر من|اكبر من|أعلى من|>=|≥|more than)\s*(\d+)/i);
  if (ratingMatch) {
    filters.minRating = parseInt(ratingMatch[1]);
  }
  
  if (isOfferQuery(text)) {
    filters.isOffer = true;
  }
  
  if (text.toLowerCase().includes('متوفر') || text.toLowerCase().includes('in stock')) {
    filters.inStock = true;
  }
  
  const categories = extractCategoryFromQuery(text);
  if (categories.length > 0) {
    filters.category = categories[0];
  }
  
  const brands = extractBrands(text);
  if (brands.length > 0) {
    filters.brand = brands[0];
  }
  
  const sortOrder = detectSortOrder(text);
  if (sortOrder) {
    filters.sortBy = sortOrder as any;
  }
  
  return filters;
}

// ============================================================
// 🎯 الدالة الرئيسية
// ============================================================

serve(async (req) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, userId, lang = "ar" } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "الرسائل مطلوبة" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
    const isArabic = lang === "ar";

    console.log("Assistant Query:", lastUserMessage);

    const context: ConversationContext = {
      conversationHistory: messages,
      userId: userId,
      lang: lang,
      filters: {},
    };
    
    const allMessages = messages.filter(m => m.role === "user");
    if (allMessages.length > 1) {
      context.lastQuery = allMessages[allMessages.length - 2]?.content || "";
      context.searchCount = (context.searchCount || 0) + 1;
    }
    
    const intentResult = detectUserIntent(lastUserMessage, context, isArabic);
    console.log("Intent:", intentResult.intent, "Confidence:", intentResult.confidence);

    let reply = "";
    let results: SearchResult[] = [];
    let totalResults = 0;
    let suggestions: string[] = [];

    switch (intentResult.intent) {
      case 'greeting':
        reply = buildGreetingResponse(isArabic);
        break;

      case 'help':
        reply = buildHelpResponse(isArabic);
        break;

      case 'browse_categories': {
        const { data: allCategories } = await supabaseClient
          .from('categories')
          .select('id, name_ar, name_en, slug, is_featured, sort_order')
          .eq('active', true)
          .order('sort_order', { ascending: true })
          .limit(30);
        
        reply = buildCategoriesResponse(allCategories || [], isArabic);
        break;
      }

      case 'orders': {
        if (userId) {
          const { data: userOrders } = await supabaseClient
            .from('orders')
            .select('id, total, status, created_at, tracking_number, quantity')
            .eq('buyer_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
          
          reply = buildOrderResponse(userOrders || [], isArabic);
        } else {
          reply = isArabic 
            ? 'يرجى تسجيل الدخول لعرض طلباتك'
            : 'Please login to view your orders';
        }
        break;
      }

      case 'store': {
        let storeQuery = supabaseClient
          .from('profiles')
          .select(`
            id, store_name, store_description, store_logo_url,
            governorate_id, rating, is_featured, store_active,
            governorates:governorate_id (name_ar, name_en)
          `)
          .eq('store_active', true)
          .not('store_name', 'is', null);
        
        const searchTerms = extractSearchTerms(lastUserMessage);
        if (searchTerms.length > 0) {
          const conditions = searchTerms.map(t => `store_name.ilike.%${t}%`).join(',');
          storeQuery = storeQuery.or(conditions);
        }
        
        const location = extractLocation(lastUserMessage);
        if (location) {
          storeQuery = storeQuery.eq('governorates.name_ar', location);
        }
        
        const { data: stores } = await storeQuery.limit(20);
        reply = buildStoreResponse(stores || [], isArabic);
        break;
      }

      case 'details': {
        const productId = intentResult.productId || context.lastProductId;
        
        if (productId) {
          const { data: product, error } = await supabaseClient
            .from('listings')
            .select(`
              id, title_ar, title_en, price, old_price, discount_percent,
              is_offer, is_available, description_ar, description_en,
              rating, governorate_id,
              governorates:governorate_id (name_ar),
              profiles:owner_id (store_name)
            `)
            .eq('id', productId)
            .single();
          
          if (!error && product) {
            reply = buildProductDetailsResponse(product, isArabic);
            break;
          }
        }
        
        if (context.lastQuery) {
          const searchResult = await searchAllTables(context.lastQuery, supabaseClient, lang as 'ar' | 'en');
          if (searchResult.length > 0) {
            const firstProduct = searchResult.find(r => r.type === 'product');
            if (firstProduct) {
              const { data: product } = await supabaseClient
                .from('listings')
                .select(`
                  id, title_ar, title_en, price, old_price, discount_percent,
                  is_offer, is_available, description_ar, description_en,
                  rating, governorate_id,
                  governorates:governorate_id (name_ar),
                  profiles:owner_id (store_name)
                `)
                .eq('id', firstProduct.id)
                .single();
              
              if (product) {
                reply = buildProductDetailsResponse(product, isArabic);
                break;
              }
            }
          }
        }
        
        reply = isArabic
          ? 'لم أجد المنتج المطلوب. يرجى إعادة المحاولة'
          : 'Product not found. Please try again';
        break;
      }

      case 'confirm': {
        if (context.lastResults && context.lastResults.length > 0) {
          reply = buildSearchResponse(
            context.lastResults, 
            context.lastQuery || '', 
            isArabic, 
            generateSmartSuggestions(context.lastQuery || '', context.lastResults, isArabic),
            context.lastResults.length,
            context.filters
          );
        } else {
          reply = isArabic ? 'ماذا تريد البحث عنه؟' : 'What would you like to search for?';
        }
        break;
      }

      case 'compare': {
        if (context.lastResults && context.lastResults.length > 1) {
          const products = context.lastResults.filter(r => r.type === 'product').slice(0, 3);
          if (products.length > 1) {
            reply = isArabic
              ? `مقارنة المنتجات\n${'─'.repeat(30)}\n\n`
              : `Product Comparison\n${'─'.repeat(30)}\n\n`;
            
            products.forEach((p, i) => {
              reply += `${i + 1}. ${p.title}\n`;
              if (p.price) reply += `   السعر: ${p.price.toLocaleString()} SYP\n`;
              if (p.rating) reply += `   التقييم: ${p.rating.toFixed(1)}/5\n`;
              if (p.location) reply += `   الموقع: ${p.location}\n`;
              if (p.storeName) reply += `   المتجر: ${p.storeName}\n`;
              if (p.isOffer) reply += `   عرض خاص\n`;
              if (p.inStock) reply += `   متوفر\n`;
              reply += `   ${p.link}\n\n`;
            });
            
            reply += isArabic
              ? `اكتب "تفاصيل [رقم]" لعرض معلومات المنتج`
              : `Type "details [number]" to view product info`;
          } else {
            reply = isArabic
              ? 'لا يوجد منتجات كافية للمقارنة'
              : 'Not enough products to compare';
          }
        } else {
          reply = isArabic
            ? 'لا يوجد منتجات للمقارنة'
            : 'No products to compare';
        }
        break;
      }

      case 'filter': {
        const extractedFilters = extractFilters(lastUserMessage);
        filters = { ...context.filters, ...extractedFilters };
        context.filters = filters;
        
        if (context.lastQuery) {
          results = await searchAllTables(context.lastQuery, supabaseClient, lang as 'ar' | 'en', filters);
          totalResults = results.length;
          suggestions = generateSmartSuggestions(context.lastQuery, results, isArabic);
          context.lastResults = results;
          reply = buildSearchResponse(results, context.lastQuery, isArabic, suggestions, totalResults, filters);
        } else {
          reply = isArabic
            ? `تم تطبيق الفلاتر\n\nاكتب ما تريد البحث عنه مع الفلاتر`
            : `Filters applied\n\nType what you want to search with filters`;
        }
        break;
      }

      default: {
        results = await searchAllTables(lastUserMessage, supabaseClient, lang as 'ar' | 'en');
        totalResults = results.length;
        suggestions = generateSmartSuggestions(lastUserMessage, results, isArabic);
        
        context.lastResults = results;
        context.lastQuery = lastUserMessage;
        
        const firstProduct = results.find(r => r.type === 'product');
        if (firstProduct) {
          context.lastProductId = firstProduct.id;
          context.lastProductTitle = firstProduct.title;
        }
        
        reply = buildSearchResponse(results, lastUserMessage, isArabic, suggestions, totalResults, context.filters);
      }
    }

    console.log("Response length:", reply.length);

    if (userId) {
      try {
        await supabaseClient
          .from("ai_chat_history")
          .insert({
            user_id: userId,
            user_message: lastUserMessage,
            ai_response: reply,
            language: lang,
            created_at: new Date().toISOString(),
          });
        console.log("Chat saved");
      } catch (historyError) {
        console.warn("Error saving chat:", historyError);
      }
    }

    return new Response(
      JSON.stringify({ 
        reply,
        results: results.slice(0, 5),
        total: totalResults,
        suggestions: suggestions.slice(0, 4),
        filters: context.filters
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Assistant Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ داخلي",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});