// src/lib/voiceSearchEngine.ts
// 🧠 محرك البحث الصوتي الذكي - نسخة احترافية جداً

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
  | 'search'        // بحث عن منتجات
  | 'filter'        // تصفية نتائج
  | 'store'         // بحث عن متاجر
  | 'category'      // تصفح تصنيف
  | 'action'        // إجراء (سلة، طلبات)
  | 'help'          // مساعدة
  | 'unknown';

export interface VoiceEntities {
  // الأساسية
  searchTerms?: string[];          // كلمات البحث
  productType?: string[];          // نوع المنتج
  brand?: string[];                // الماركة
  category?: string[];             // التصنيف
  storeName?: string[];            // اسم المتجر
  
  // الفلاتر
  priceMin?: number;
  priceMax?: number;
  color?: string[];
  location?: string;               // المحافظة
  isOffer?: boolean;
  isAvailable?: boolean;
  
  // الإجراءات
  action?: 'add_to_cart' | 'view_cart' | 'view_orders' | 'help';
  
  // متقدم
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
  score: number;           // 0-100
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
// 📚 القواميس والمرادفات
// ============================================================

// ✅ قاموس المرادفات الذكي للمنتجات
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  'جوال': ['موبايل', 'هاتف', 'تلفون', 'فون', 'سمارت', 'mobile', 'phone', 'smartphone'],
  'سماعة': ['سماعات', 'أذن', 'هيدفون', 'ايربود', 'earphone', 'headphone', 'airpods'],
  'لابتوب': ['كمبيوتر محمول', 'نوت بوك', 'laptop', 'notebook', 'pc'],
  'ساعة': ['ساعات', 'ساعة يد', 'watch', 'smartwatch', 'wearable'],
  'عطر': ['برفان', 'برفوم', 'perfume', 'fragrance', 'oud', 'دهن عود'],
  'شنطة': ['حقيبة', 'bag', 'backpack', 'handbag'],
  'حذاء': ['جزمة', 'كوتشي', 'sneaker', 'shoe', 'boot'],
  'فستان': ['ثوب', 'لباس', 'dress', 'gown'],
  'خاتم': ['خواتم', 'ring', 'jewelry'],
  'سلسلة': ['قلادة', 'necklace', 'chain'],
  'عسل': ['عسل نحل', 'honey', 'natural honey'],
  'زيت': ['زيت زيتون', 'زيوت', 'oil', 'olive oil'],
  'قهوة': ['بن', 'كافيه', 'coffee', 'beans'],
  'شاي': ['شاي أخضر', 'tea', 'green tea'],
  'مكيف': ['تكييف', 'air conditioner', 'ac', 'cooler'],
  'ثلاجة': ['براد', 'refrigerator', 'fridge'],
  'غسالة': ['غسالة ملابس', 'washer', 'washing machine'],
  'فرن': ['بوتاجاز', 'oven', 'stove'],
  'تلفزيون': ['شاشة', 'تلفاز', 'tv', 'television', 'screen'],
  'أثاث': ['مفروشات', 'furniture', 'sofa', 'طاولة', 'كرسي'],
};

// ✅ أسماء الماركات الشائعة
const BRANDS = [
  'سامسونج', 'آبل', 'شاومي', 'هواوي', 'نوكيا', 'لينوفو', 'إتش بي', 'ديل',
  'سوني', 'إل جي', 'باناسونيك', 'توشيبا', 'أيسر', 'آسوس', 'مايكروسوفت',
  'أوبو', 'فيفو', 'ريلمي', 'ون بلس', 'جوجل', 'أمازون', 'آبل',
  'ايفون', 'macbook', 'iphone', 'galaxy', 'note', 's series'
];

// ✅ المحافظات السورية
const SYRIAN_GOVERNORATES = [
  'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماه', 'اللاذقية', 'طرطوس',
  'دير الزور', 'الحسكة', 'الرقة', 'إدلب', 'السويداء', 'درعا', 'القنيطرة'
];

// ✅ الكلمات المفتاحية للعروض
const OFFER_KEYWORDS = ['عرض', 'عروض', 'خصم', 'خصومات', 'تخفيض', 'تخفيضات', 'صفقة', 'كوبون', 'كود خصم', 'sale', 'offer', 'discount', 'deal'];

// ============================================================
// 🔧 دوال المعالجة الأساسية
// ============================================================

/**
 * ✅ تطبيع النص (إزالة التشكيل، توحيد الحروف)
 */
function normalizeArabicText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // إزالة التشكيل (الحركات)
  normalized = normalized.replace(/َ|ً|ُ|ٌ|ِ|ٍ|ْ|ّ/g, '');
  
  // توحيد الألف
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  
  // توحيد التاء المربوطة
  normalized = normalized.replace(/ة/g, 'ه');
  
  // توحيد الياء والألف المقصورة
  normalized = normalized.replace(/ى/g, 'ي');
  
  return normalized;
}

/**
 * ✅ تصحيح إملائي بسيط
 */
function correctSpelling(text: string): string {
  const corrections: Record<string, string> = {
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
  };
  
  let corrected = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    corrected = corrected.replace(new RegExp(wrong, 'gi'), correct);
  }
  
  return corrected;
}

// ============================================================
// 🎯 تحليل النية
// ============================================================

function detectIntent(text: string): VoiceIntent {
  const lower = text.toLowerCase();
  
  // ✅ إجراءات
  if (/\b(سلة|عربة|شراء|add to cart|cart|basket)\b/i.test(lower)) {
    return 'action';
  }
  if (/\b(طلبات|شحن|توصيل|orders|delivery)\b/i.test(lower)) {
    return 'action';
  }
  if (/\b(مساعدة|كيف|help|guide)\b/i.test(lower)) {
    return 'help';
  }
  
  // ✅ متاجر
  if (/\b(متجر|بائع|محل|مؤسسة|store|seller|shop)\b/i.test(lower)) {
    return 'store';
  }
  
  // ✅ تصنيفات
  if (/\b(تصنيف|قسم|فئة|category|section)\b/i.test(lower)) {
    return 'category';
  }
  
  // ✅ تصفية (تحتوي على سعر، لون، موقع)
  if (/\b(سعر|ريال|دولار|لون|أحمر|أزرق|أسود|في|من|إلى|بين|أقل|أكثر)\b/i.test(lower)) {
    return 'filter';
  }
  
  // ✅ البحث الافتراضي
  return 'search';
}

// ============================================================
// 🔍 استخراج الكيانات المتقدمة
// ============================================================

function extractEntities(text: string, lang: 'ar' | 'en' = 'ar'): VoiceEntities {
  const entities: VoiceEntities = {};
  const normalized = normalizeArabicText(text);
  const lower = text.toLowerCase();
  
  // ==========================================================
  // 1️⃣ استخراج المنتج / النوع
  // ==========================================================
  const productTypes: string[] = [];
  for (const [key, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
    const allTerms = [key, ...synonyms];
    for (const term of allTerms) {
      if (normalized.includes(term.toLowerCase()) || text.includes(term)) {
        productTypes.push(key);
        break;
      }
    }
  }
  if (productTypes.length > 0) {
    entities.productType = [...new Set(productTypes)];
  }
  
  // ==========================================================
  // 2️⃣ استخراج الماركة
  // ==========================================================
  const brands: string[] = [];
  for (const brand of BRANDS) {
    if (text.includes(brand) || normalized.includes(brand.toLowerCase())) {
      brands.push(brand);
    }
  }
  if (brands.length > 0) {
    entities.brand = [...new Set(brands)];
  }
  
  // ==========================================================
  // 3️⃣ استخراج السعر
  // ==========================================================
  const pricePatterns = [
    /(أقل من|تحت|less than|under)\s*(\d+)/i,
    /(أكثر من|فوق|more than|over|above)\s*(\d+)/i,
    /(من|بين|between)\s*(\d+)\s*(إلى|و|to|and)\s*(\d+)/i,
    /(بسعر|بـ|for|at)\s*(\d+)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern === pricePatterns[0]) {
        entities.priceMax = parseInt(match[2]);
      } else if (pattern === pricePatterns[1]) {
        entities.priceMin = parseInt(match[2]);
      } else if (pattern === pricePatterns[2]) {
        entities.priceMin = parseInt(match[2]);
        entities.priceMax = parseInt(match[4]);
      } else if (pattern === pricePatterns[3]) {
        entities.priceMin = parseInt(match[2]);
        entities.priceMax = parseInt(match[2]) + 100;
      }
      break;
    }
  }
  
  // ==========================================================
  // 4️⃣ استخراج اللون
  // ==========================================================
  const COLORS = ['أحمر', 'أزرق', 'أخضر', 'أسود', 'أبيض', 'ذهبي', 'فضي', 'وردي', 'بنفسجي', 'أصفر', 'برتقالي'];
  const colors: string[] = [];
  for (const color of COLORS) {
    if (text.includes(color) || normalized.includes(color)) {
      colors.push(color);
    }
  }
  if (colors.length > 0) {
    entities.color = colors;
  }
  
  // ==========================================================
  // 5️⃣ استخراج الموقع (المحافظة)
  // ==========================================================
  for (const gov of SYRIAN_GOVERNORATES) {
    if (text.includes(gov) || normalized.includes(gov)) {
      entities.location = gov;
      break;
    }
  }
  
  // ==========================================================
  // 6️⃣ استخراج اسم المتجر
  // ==========================================================
  const storeMatch = text.match(/(?:متجر|store|محل|shop)\s*["']?([\w\s]+)["']?/i);
  if (storeMatch) {
    entities.storeName = [storeMatch[1].trim()];
  }
  
  // ==========================================================
  // 7️⃣ الكشف عن العروض
  // ==========================================================
  for (const keyword of OFFER_KEYWORDS) {
    if (text.includes(keyword)) {
      entities.isOffer = true;
      break;
    }
  }
  
  // ==========================================================
  // 8️⃣ استخراج كلمات البحث العامة
  // ==========================================================
  let searchText = text;
  const stopWords = ['ابحث عن', 'دور على', 'عندك', 'متوفر', 'أريد', 'أحتاج', 'بدي', 'عايز', 'بحث عن'];
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
// 🔍 تنفيذ البحث في قاعدة البيانات
// ============================================================

async function executeSearch(
  entities: VoiceEntities,
  intent: VoiceIntent,
  lang: 'ar' | 'en' = 'ar'
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  // ==========================================================
  // 1️⃣ البحث في المنتجات (listings)
  // ==========================================================
  if (intent === 'search' || intent === 'filter') {
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
      .eq('is_available', true);
    
    // ✅ فلتر حسب النوع
    if (entities.productType && entities.productType.length > 0) {
      const productType = entities.productType[0];
      if (lang === 'ar') {
        query = query.or(`title_ar.ilike.%${productType}%,description_ar.ilike.%${productType}%`);
      } else {
        query = query.or(`title_en.ilike.%${productType}%,description_en.ilike.%${productType}%`);
      }
    }
    
    // ✅ فلتر حسب الماركة
    if (entities.brand && entities.brand.length > 0) {
      const brand = entities.brand[0];
      if (lang === 'ar') {
        query = query.or(`title_ar.ilike.%${brand}%,description_ar.ilike.%${brand}%`);
      } else {
        query = query.or(`title_en.ilike.%${brand}%,description_en.ilike.%${brand}%`);
      }
    }
    
    // ✅ فلتر حسب السعر
    if (entities.priceMin !== undefined) {
      query = query.gte('price', entities.priceMin);
    }
    if (entities.priceMax !== undefined) {
      query = query.lte('price', entities.priceMax);
    }
    
    // ✅ فلتر حسب العروض
    if (entities.isOffer === true) {
      query = query.eq('is_offer', true);
    }
    
    // ✅ فلتر حسب الموقع
    if (entities.location) {
      query = query.eq('governorates.name_ar', entities.location);
    }
    
    // ✅ كلمات البحث العامة
    if (entities.searchTerms && entities.searchTerms.length > 0) {
      const searchTerm = entities.searchTerms.join(' ');
      if (lang === 'ar') {
        query = query.or(`title_ar.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%`);
      } else {
        query = query.or(`title_en.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%`);
      }
    }
    
    // ✅ تنفيذ الاستعلام
    const { data: listings, error } = await query.limit(50);
    
    if (!error && listings) {
      for (const item of listings) {
        let score = 50;
        
        const title = lang === 'ar' ? item.title_ar : item.title_en;
        const desc = lang === 'ar' ? item.description_ar : item.description_en;
        
        if (entities.productType && entities.productType.some(p => title?.includes(p))) {
          score += 25;
        }
        if (entities.brand && entities.brand.some(b => title?.includes(b))) {
          score += 20;
        }
        if (entities.searchTerms && entities.searchTerms.some(t => title?.includes(t))) {
          score += 15;
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
  
  // ==========================================================
  // 2️⃣ البحث في المتاجر (profiles)
  // ==========================================================
  if (intent === 'store' || intent === 'search') {
    let query = supabase
      .from('profiles')
      .select(`
        id, store_name, store_description, store_logo_url,
        store_cover_url, store_active, governorate_id,
        governorates:governorate_id (name_ar, name_en)
      `)
      .eq('store_active', true)
      .not('store_name', 'is', null);
    
    if (entities.storeName && entities.storeName.length > 0) {
      const storeName = entities.storeName[0];
      query = query.ilike('store_name', `%${storeName}%`);
    }
    
    if (entities.location) {
      query = query.eq('governorates.name_ar', entities.location);
    }
    
    if (entities.searchTerms && entities.searchTerms.length > 0) {
      const searchTerm = entities.searchTerms.join(' ');
      query = query.or(`store_name.ilike.%${searchTerm}%,store_description.ilike.%${searchTerm}%`);
    }
    
    const { data: stores, error } = await query.limit(20);
    
    if (!error && stores) {
      for (const store of stores) {
        let score = 40;
        
        if (entities.storeName && entities.storeName.some(n => store.store_name?.includes(n))) {
          score += 30;
        }
        if (entities.location && store.governorates?.name_ar === entities.location) {
          score += 20;
        }
        
        results.push({
          id: store.id,
          title: store.store_name || 'متجر',
          description: store.store_description,
          location: store.governorates?.name_ar || store.governorates?.name_en,
          image_url: store.store_logo_url || store.store_cover_url,
          score: Math.min(score, 100),
          matchType: score > 70 ? 'exact' : 'partial',
          source: 'store',
        });
      }
    }
  }
  
  // ==========================================================
  // 3️⃣ البحث في التصنيفات (categories)
  // ==========================================================
  if (intent === 'category' || intent === 'search') {
    let query = supabase
      .from('categories')
      .select('id, name_ar, name_en, slug, image_url, icon')
      .eq('active', true);
    
    if (entities.productType && entities.productType.length > 0) {
      const productType = entities.productType[0];
      if (lang === 'ar') {
        query = query.ilike('name_ar', `%${productType}%`);
      } else {
        query = query.ilike('name_en', `%${productType}%`);
      }
    }
    
    if (entities.searchTerms && entities.searchTerms.length > 0) {
      const searchTerm = entities.searchTerms.join(' ');
      query = query.or(`name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%`);
    }
    
    const { data: categories, error } = await query.limit(10);
    
    if (!error && categories) {
      for (const cat of categories) {
        let score = 50;
        const name = lang === 'ar' ? cat.name_ar : cat.name_en;
        
        if (entities.productType && entities.productType.some(p => name?.includes(p))) {
          score += 30;
        }
        if (entities.searchTerms && entities.searchTerms.some(t => name?.includes(t))) {
          score += 20;
        }
        
        results.push({
          id: cat.id,
          title: name || cat.name_ar || cat.name_en,
          image_url: cat.image_url,
          score: Math.min(score, 100),
          matchType: score > 70 ? 'exact' : 'partial',
          source: 'category',
        });
      }
    }
  }
  
  // ✅ ترتيب النتائج حسب الدرجة
  results.sort((a, b) => b.score - a.score);
  
  return results;
}

// ============================================================
// 🎯 الدالة الرئيسية للبحث الصوتي
// ============================================================

export async function processVoiceSearch(
  text: string,
  lang: 'ar' | 'en' = 'ar'
): Promise<VoiceSearchResponse> {
  const startTime = Date.now();
  
  console.log('🎤 [VoiceEngine] Processing:', text);
  
  // ✅ 1. تنظيف النص وتصحيحه
  const corrected = correctSpelling(text);
  const normalized = normalizeArabicText(corrected);
  
  // ✅ 2. استخراج النية
  const intent = detectIntent(corrected);
  
  // ✅ 3. استخراج الكيانات
  const entities = extractEntities(corrected, lang);
  
  console.log('🎯 Intent:', intent);
  console.log('📊 Entities:', entities);
  
  // ✅ 4. حساب الثقة
  let confidence = 0.5;
  if (intent !== 'unknown') confidence += 0.2;
  if (Object.keys(entities).length > 0) confidence += 0.3;
  if (entities.productType || entities.brand) confidence += 0.2;
  confidence = Math.min(confidence, 1);
  
  // ✅ 5. تنفيذ البحث
  let results: SearchResult[] = [];
  let suggestions: string[] = [];
  
  if (intent === 'help') {
    suggestions = [
      lang === 'ar'
        ? '💡 يمكنك قول: "ابحث عن جوال سامسونج"، "عروض السلة"، "متاجر في دمشق"'
        : '💡 You can say: "search Samsung phones", "show offers", "stores in Damascus"',
    ];
  } else if (intent === 'action') {
    if (entities.action === 'add_to_cart' || text.includes('أضف')) {
      suggestions = [lang === 'ar' ? '🛒 تم توجيهك إلى صفحة المنتج لإضافته للسلة' : '🛒 Redirecting to product page'];
    } else {
      suggestions = [lang === 'ar' ? '🛒 تم توجيهك إلى السلة' : '🛒 Redirecting to cart'];
    }
  } else {
    results = await executeSearch(entities, intent, lang);
    
    if (results.length < 3 && entities.productType) {
      const productType = entities.productType[0];
      suggestions = [
        lang === 'ar'
          ? `💡 حاول البحث عن "${productType}" بدون كلمات إضافية`
          : `💡 Try searching for "${productType}" without extra words`,
      ];
    }
  }
  
  // ✅ 6. بناء الرد
  return {
    query: text,
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
    },
  };
}

// ============================================================
// 🗣️ تحويل النتائج إلى نص صوتي (TTS)
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

export default {
  processVoiceSearch,
  getVoiceResponse,
  detectIntent,
  extractEntities,
};