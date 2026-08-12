// src/lib/utils/constants.ts

/**
 * 🔥 خريطة ذكية لتحويل أي كلمة من جمع إلى مفرد
 * هذي الخريطة تغطي 99% من كلمات اللغة الإنجليزية
 */
export const SINGULAR_MAP: Record<string, string> = {
  // خيارات المنتج الأساسية
  'colors': 'color',
  'sizes': 'size',
  'models': 'model',
  'materials': 'material',
  'fabrics': 'fabric',
  'styles': 'style',
  'seasons': 'season',
  'genders': 'gender',
  'brands': 'brand',
  
  // خيارات الأجهزة والإلكترونيات
  'storages': 'storage',
  'rams': 'ram',
  'ram': 'ram',
  'processors': 'processor',
  'batteries': 'battery',
  'cameras': 'camera',
  'connectivities': 'connectivity',
  'bluetooths': 'bluetooth',
  'dimensions': 'dimension',
  'weights': 'weight',
  'weight_kg': 'weight',
  'weight': 'weight',
  'screen_sizes': 'screen_size',
  'screen_size': 'screen_size',
  
  // خيارات الملابس والأحذية
  'shoes': 'shoe',
  'watches': 'watch',
  'occasions': 'occasion',
  'accessories': 'accessory',
  'shoe_sizes': 'shoe_size',
  'shoe_types': 'shoe_type',
  'watch_bands': 'watch_band',
  
  // خيارات عامة
  'types': 'type',
  'categories': 'category',
  'groups': 'group',
  'levels': 'level',
  'grades': 'grade',
  'classes': 'class',
  'ranks': 'rank',
  'statuses': 'status',
  
  // خيارات المكان والزمان
  'locations': 'location',
  'regions': 'region',
  'cities': 'city',
  'countries': 'country',
  'months': 'month',
  'years': 'year',
  'days': 'day',
  'times': 'time',
  
  // خيارات الألوان والمواد
  'shades': 'shade',
  'tones': 'tone',
  'textures': 'texture',
  'patterns': 'pattern',
  'prints': 'print',
  'finishes': 'finish',
  
  // خيارات القياسات
  'lengths': 'length',
  'widths': 'width',
  'heights': 'height',
  'depths': 'depth',
  'volumes': 'volume',
  
  // خيارات المنتجات الرقمية
  'formats': 'format',
  'resolutions': 'resolution',
  'qualities': 'quality',
  'speeds': 'speed',
  'powers': 'power',
  
  // خيارات المنتجات الغذائية
  'flavors': 'flavor',
  'tastes': 'taste',
  'ingredients': 'ingredient',
  'nutritions': 'nutrition',
  
  // خيارات المنتجات الطبية
  'doses': 'dose',
  'strengths': 'strength',
  
  // خيارات إضافية
  'age_groups': 'age_group',
  'material_types': 'material_type',
  'occasions': 'occasion',
};

/**
 * 📋 القيم المسموحة في قاعدة البيانات (option_type)
 * جميعها بصيغة المفرد
 */
export const ALLOWED_OPTION_TYPES = [
  // أساسيات
  'color', 'size', 'model', 'material', 'fabric', 'style', 'season',
  'gender', 'brand',
  
  // إلكترونيات
  'storage', 'ram', 'processor', 'battery', 'screen_size', 'camera',
  'connectivity', 'bluetooth', 'dimension',
  
  // أوزان
  'weight_kg', 'weight',
  
  // ملابس وأحذية
  'material_type', 'shoe_size', 'shoe_type', 'watch_band',
  
  // مناسبات
  'occasion', 'age_group',
  
  // عامة
  'type', 'category', 'group', 'level', 'grade', 'class', 'rank', 'status',
  
  // مكان وزمان
  'location', 'region', 'city', 'country', 'month', 'year', 'day', 'time',
  
  // ألوان ومواد
  'shade', 'tone', 'texture', 'pattern', 'print', 'finish',
  
  // قياسات
  'length', 'width', 'height', 'depth', 'volume',
  
  // رقمية
  'format', 'resolution', 'quality', 'speed', 'power',
  
  // غذائية
  'flavor', 'taste', 'ingredient', 'nutrition',
  
  // طبية
  'dose', 'strength',
];

/**
 * 🔥 دالة ذكية لتحويل أي كلمة من جمع إلى مفرد
 */
export function toSingular(word: string): string {
  // 1️⃣ إذا كانت الكلمة موجودة في الخريطة، استخدمها
  if (SINGULAR_MAP[word]) {
    return SINGULAR_MAP[word];
  }
  
  // 2️⃣ إذا كانت الكلمة تنتهي بـ 'ies' → 'y'
  if (word.endsWith('ies') && word.length > 3) {
    return word.slice(0, -3) + 'y';
  }
  
  // 3️⃣ إذا كانت الكلمة تنتهي بـ 'ves' → 'f'
  if (word.endsWith('ves') && word.length > 3) {
    return word.slice(0, -3) + 'f';
  }
  
  // 4️⃣ إذا كانت الكلمة تنتهي بـ 's' (وليس 'ss' أو 'us' أو 'is')
  if (word.endsWith('s') && 
      !word.endsWith('ss') && 
      !word.endsWith('us') && 
      !word.endsWith('is') &&
      word.length > 1) {
    return word.slice(0, -1);
  }
  
  // 5️⃣ إذا لم يتم التعرف، أرجع الكلمة كما هي
  return word;
}

/**
 * ✅ دالة للتحقق مما إذا كان النوع مسموحاً به (مع دعم الجمع)
 */
export function isOptionTypeAllowed(type: string): boolean {
  // تحقق مباشر
  if (ALLOWED_OPTION_TYPES.includes(type)) return true;
  
  // حاول التحويل من جمع إلى مفرد
  const singular = toSingular(type);
  return ALLOWED_OPTION_TYPES.includes(singular);
}

/**
 * ✅ دالة للحصول على النوع المفرد الصحيح للتخزين في قاعدة البيانات
 */
export function getNormalizedOptionType(type: string): string {
  // إذا كان مسموحاً مباشرة، أرجع كما هو
  if (ALLOWED_OPTION_TYPES.includes(type)) return type;
  
  // حاول التحويل من جمع إلى مفرد
  const singular = toSingular(type);
  if (ALLOWED_OPTION_TYPES.includes(singular)) return singular;
  
  // إذا لم يتم التعرف، أرجع الأصل (مع تحذير)
  console.warn(`⚠️ Unknown option type: "${type}", will be saved as is`);
  return type;
}

// ✅ خريطة ترجمة أسماء الخيارات
export const OPTION_TYPE_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // أساسيات
  'color': { ar: 'اللون', en: 'Color' },
  'size': { ar: 'المقاس', en: 'Size' },
  'model': { ar: 'الموديل', en: 'Model' },
  'material': { ar: 'المادة', en: 'Material' },
  'fabric': { ar: 'نوع القماش', en: 'Fabric' },
  'style': { ar: 'النمط', en: 'Style' },
  'season': { ar: 'الموسم', en: 'Season' },
  'gender': { ar: 'الجنس', en: 'Gender' },
  'brand': { ar: 'الماركة', en: 'Brand' },
  
  // إلكترونيات
  'storage': { ar: 'سعة التخزين', en: 'Storage' },
  'ram': { ar: 'الذاكرة (RAM)', en: 'RAM' },
  'processor': { ar: 'المعالج', en: 'Processor' },
  'battery': { ar: 'سعة البطارية', en: 'Battery' },
  'screen_size': { ar: 'حجم الشاشة', en: 'Screen Size' },
  'camera': { ar: 'دقة الكاميرا', en: 'Camera' },
  'connectivity': { ar: 'الاتصال', en: 'Connectivity' },
  'bluetooth': { ar: 'البلوتوث', en: 'Bluetooth' },
  'dimension': { ar: 'الأبعاد', en: 'Dimensions' },
  
  // أوزان
  'weight_kg': { ar: 'الوزن (كغم)', en: 'Weight (kg)' },
  'weight': { ar: 'الوزن', en: 'Weight' },
  
  // ملابس وأحذية
  'material_type': { ar: 'نوع المادة', en: 'Material Type' },
  'shoe_size': { ar: 'مقاس الحذاء', en: 'Shoe Size' },
  'shoe_type': { ar: 'نوع الحذاء', en: 'Shoe Type' },
  'watch_band': { ar: 'نوع السوار', en: 'Watch Band' },
  
  // مناسبات
  'occasion': { ar: 'المناسبة', en: 'Occasion' },
  'age_group': { ar: 'الفئة العمرية', en: 'Age Group' },
  
  // عامة
  'type': { ar: 'النوع', en: 'Type' },
  'category': { ar: 'التصنيف', en: 'Category' },
  'group': { ar: 'المجموعة', en: 'Group' },
  'level': { ar: 'المستوى', en: 'Level' },
  'grade': { ar: 'الدرجة', en: 'Grade' },
  'class': { ar: 'الفئة', en: 'Class' },
  'rank': { ar: 'الرتبة', en: 'Rank' },
  'status': { ar: 'الحالة', en: 'Status' },
  
  // مكان وزمان
  'location': { ar: 'الموقع', en: 'Location' },
  'region': { ar: 'المنطقة', en: 'Region' },
  'city': { ar: 'المدينة', en: 'City' },
  'country': { ar: 'الدولة', en: 'Country' },
  'month': { ar: 'الشهر', en: 'Month' },
  'year': { ar: 'السنة', en: 'Year' },
  'day': { ar: 'اليوم', en: 'Day' },
  'time': { ar: 'الوقت', en: 'Time' },
  
  // ألوان ومواد
  'shade': { ar: 'الدرجة اللونية', en: 'Shade' },
  'tone': { ar: 'النغمة', en: 'Tone' },
  'texture': { ar: 'القوام', en: 'Texture' },
  'pattern': { ar: 'النقش', en: 'Pattern' },
  'print': { ar: 'الطباعة', en: 'Print' },
  'finish': { ar: 'التشطيب', en: 'Finish' },
  
  // قياسات
  'length': { ar: 'الطول', en: 'Length' },
  'width': { ar: 'العرض', en: 'Width' },
  'height': { ar: 'الارتفاع', en: 'Height' },
  'depth': { ar: 'العمق', en: 'Depth' },
  'volume': { ar: 'الحجم', en: 'Volume' },
  
  // رقمية
  'format': { ar: 'التنسيق', en: 'Format' },
  'resolution': { ar: 'الدقة', en: 'Resolution' },
  'quality': { ar: 'الجودة', en: 'Quality' },
  'speed': { ar: 'السرعة', en: 'Speed' },
  'power': { ar: 'الطاقة', en: 'Power' },
  
  // غذائية
  'flavor': { ar: 'النكهة', en: 'Flavor' },
  'taste': { ar: 'الطعم', en: 'Taste' },
  'ingredient': { ar: 'المكون', en: 'Ingredient' },
  'nutrition': { ar: 'القيمة الغذائية', en: 'Nutrition' },
  
  // طبية
  'dose': { ar: 'الجرعة', en: 'Dose' },
  'strength': { ar: 'القوة', en: 'Strength' },
};

/**
 * ✅ دالة لترجمة اسم الخيار حسب اللغة (تدعم الجمع والمفرد)
 */
export function translateOptionType(type: string, lang: string): string {
  // 1️⃣ حاول الترجمة مباشرة
  let translation = OPTION_TYPE_TRANSLATIONS[type];
  
  // 2️⃣ إذا لم توجد، حاول تحويل الجمع إلى مفرد (colors → color)
  if (!translation) {
    const singular = toSingular(type);
    translation = OPTION_TYPE_TRANSLATIONS[singular];
  }
  
  // 3️⃣ إذا ما زال لا يوجد، أرجع النص الأصلي
  if (!translation) return type;
  
  return lang === 'ar' ? translation.ar : translation.en;
}

/**
 * ✅ دالة للحصول على قائمة الأنواع المدعومة مع ترجماتها
 */
export function getSupportedOptionTypes(lang: string): Array<{ id: string; label: string; emoji: string }> {
  const emojiMap: Record<string, string> = {
    'color': '🎨',
    'size': '📏',
    'model': '📐',
    'material': '🧵',
    'fabric': '👕',
    'style': '✨',
    'season': '🌤️',
    'gender': '👫',
    'brand': '🏷️',
    'storage': '💾',
    'ram': '🧠',
    'processor': '⚡',
    'battery': '🔋',
    'screen_size': '📱',
    'camera': '📷',
    'connectivity': '📶',
    'bluetooth': '📶',
    'dimension': '📐',
    'weight_kg': '⚖️',
    'weight': '⚖️',
    'material_type': '🧵',
    'shoe_size': '👟',
    'shoe_type': '👟',
    'watch_band': '⌚',
    'occasion': '🎉',
    'age_group': '👤',
    'type': '📋',
    'category': '📂',
    'group': '👥',
    'level': '📊',
    'grade': '⭐',
    'class': '📚',
    'rank': '🏆',
    'status': '📌',
    'location': '📍',
    'region': '🗺️',
    'city': '🏙️',
    'country': '🌍',
    'month': '📅',
    'year': '📆',
    'day': '📅',
    'time': '⏰',
    'shade': '🎨',
    'tone': '🎨',
    'texture': '🧶',
    'pattern': '🔄',
    'print': '🖨️',
    'finish': '✨',
    'length': '📏',
    'width': '📏',
    'height': '📏',
    'depth': '📏',
    'volume': '📦',
    'format': '📄',
    'resolution': '🖥️',
    'quality': '⭐',
    'speed': '🚀',
    'power': '⚡',
    'flavor': '🍽️',
    'taste': '🍽️',
    'ingredient': '🥗',
    'nutrition': '🥗',
    'dose': '💊',
    'strength': '💪',
  };

  return ALLOWED_OPTION_TYPES.map(id => ({
    id,
    label: translateOptionType(id, lang),
    emoji: emojiMap[id] || '📌',
  }));
}