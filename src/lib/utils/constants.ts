// src/lib/utils/constants.ts

/**
 * 🔥 خريطة المفرد → الجمع (للتوحيد على الجمع)
 * ⚠️ النظام موحّد على الجمع — هذه الخريطة للتحويل من مفرد إلى جمع
 */
export const PLURAL_MAP: Record<string, string> = {
  // أساسيات
  'color': 'colors',
  'size': 'sizes',
  'model': 'models',
  'material': 'materials',
  'fabric': 'fabrics',
  'style': 'styles',
  'season': 'seasons',
  'gender': 'genders',
  'brand': 'brands',
  
  // إلكترونيات
  'storage': 'storages',
  'ram': 'rams',
  'processor': 'processors',
  'battery': 'batteries',
  'screen_size': 'screen_sizes',
  'camera': 'cameras',
  'connectivity': 'connectivities',
  'bluetooth': 'bluetooths',
  'dimension': 'dimensions',
  
  // أوزان
  'weight': 'weights',
  
  // ملابس وأحذية
  'material_type': 'material_types',
  'shoe_size': 'shoe_sizes',
  'shoe_type': 'shoe_types',
  'watch_band': 'watch_bands',
  
  // مناسبات
  'occasion': 'occasions',
  'age_group': 'age_groups',
  
  // عامة
  'type': 'types',
  'category': 'categories',
  'group': 'groups',
  'level': 'levels',
  'grade': 'grades',
  'class': 'classes',
  'rank': 'ranks',
  'status': 'statuses',
  
  // مكان وزمان
  'location': 'locations',
  'region': 'regions',
  'city': 'cities',
  'country': 'countries',
  'month': 'months',
  'year': 'years',
  'day': 'days',
  'time': 'times',
  
  // ألوان ومواد
  'shade': 'shades',
  'tone': 'tones',
  'texture': 'textures',
  'pattern': 'patterns',
  'print': 'prints',
  'finish': 'finishes',
  
  // قياسات
  'length': 'lengths',
  'width': 'widths',
  'height': 'heights',
  'depth': 'depths',
  'volume': 'volumes',
  
  // رقمية
  'format': 'formats',
  'resolution': 'resolutions',
  'quality': 'qualities',
  'speed': 'speeds',
  'power': 'powers',
  
  // غذائية
  'flavor': 'flavors',
  'taste': 'tastes',
  'ingredient': 'ingredients',
  'nutrition': 'nutritions',
  
  // طبية
  'dose': 'doses',
  'strength': 'strengths',
};

/**
 * 📋 القيم المسموحة في قاعدة البيانات (option_type)
 * ✅ موحّدة على الجمع فقط
 */
export const ALLOWED_OPTION_TYPES = [
  // أساسيات
  'colors',
  'sizes',
  'models',
  'materials',
  'fabrics',
  'styles',
  'seasons',
  'genders',
  'brands',
  
  // إلكترونيات
  'storages',
  'rams',
  'processors',
  'batteries',
  'screen_sizes',
  'cameras',
  'connectivities',
  'bluetooths',
  'dimensions',
  
  // أوزان
  'weight_kg',
  'weights',
  
  // ملابس وأحذية
  'material_types',
  'shoe_sizes',
  'shoe_types',
  'watch_bands',
  
  // مناسبات
  'occasions',
  'age_groups',
  
  // عامة
  'types',
  'categories',
  'groups',
  'levels',
  'grades',
  'classes',
  'ranks',
  'statuses',
  
  // مكان وزمان
  'locations',
  'regions',
  'cities',
  'countries',
  'months',
  'years',
  'days',
  'times',
  
  // ألوان ومواد
  'shades',
  'tones',
  'textures',
  'patterns',
  'prints',
  'finishes',
  
  // قياسات
  'lengths',
  'widths',
  'heights',
  'depths',
  'volumes',
  
  // رقمية
  'formats',
  'resolutions',
  'qualities',
  'speeds',
  'powers',
  
  // غذائية
  'flavors',
  'tastes',
  'ingredients',
  'nutritions',
  
  // طبية
  'doses',
  'strengths',
];

/**
 * 🔥 دالة toSingular — ترجع المفتاح كما هو
 * ✅ النظام موحّد على الجمع — لا نحتاج تحويل
 */
export function toSingular(word: string): string {
  return word;
}

/**
 * 🔥 دالة toPlural — تحوّل المفرد للجمع (احتياطي)
 * تُستخدم إذا احتجنا تحويل مفتاح مفرد إلى جمع
 */
export function toPlural(word: string): string {
  // إذا موجودة بالخريطة
  if (PLURAL_MAP[word]) {
    return PLURAL_MAP[word];
  }
  
  // إذا كانت الكلمة أصلًا جمع (موجودة في ALLOWED_OPTION_TYPES)
  if (ALLOWED_OPTION_TYPES.includes(word)) {
    return word;
  }
  
  // إذا ما لقيناها، أرجعها كما هي
  return word;
}

/**
 * ✅ دالة للتحقق مما إذا كان النوع مسموحاً به
 */
export function isOptionTypeAllowed(type: string): boolean {
  // تحقق مباشر
  if (ALLOWED_OPTION_TYPES.includes(type)) return true;
  
  // حاول التحويل من مفرد إلى جمع
  const plural = toPlural(type);
  return ALLOWED_OPTION_TYPES.includes(plural);
}

/**
 * ✅ دالة للحصول على النوع الصحيح للتخزين في قاعدة البيانات
 * ✅ ترجع الجمع دائمًا
 */
export function getNormalizedOptionType(type: string): string {
  // إذا كان جمعاً مسموحاً، أرجع كما هو
  if (ALLOWED_OPTION_TYPES.includes(type)) return type;
  
  // حاول التحويل من مفرد إلى جمع
  const plural = toPlural(type);
  if (ALLOWED_OPTION_TYPES.includes(plural)) return plural;
  
  // إذا لم يتم التعرف، أرجع الأصل (مع تحذير)
  console.warn(`⚠️ Unknown option type: "${type}", will be saved as is`);
  return type;
}

// ✅ خريطة ترجمة أسماء الخيارات (الجمع فقط)
export const OPTION_TYPE_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // أساسيات
  'colors': { ar: 'الألوان', en: 'Colors' },
  'sizes': { ar: 'المقاسات', en: 'Sizes' },
  'models': { ar: 'الموديلات', en: 'Models' },
  'materials': { ar: 'الخامات', en: 'Materials' },
  'fabrics': { ar: 'الأقمشة', en: 'Fabrics' },
  'styles': { ar: 'الأنماط', en: 'Styles' },
  'seasons': { ar: 'المواسم', en: 'Seasons' },
  'genders': { ar: 'الفئات الجنسية', en: 'Genders' },
  'brands': { ar: 'الماركات', en: 'Brands' },
  
  // إلكترونيات
  'storages': { ar: 'سعات التخزين', en: 'Storages' },
  'rams': { ar: 'سعات الذاكرة', en: 'RAMs' },
  'processors': { ar: 'المعالجات', en: 'Processors' },
  'batteries': { ar: 'البطاريات', en: 'Batteries' },
  'screen_sizes': { ar: 'أحجام الشاشات', en: 'Screen Sizes' },
  'cameras': { ar: 'الكاميرات', en: 'Cameras' },
  'connectivities': { ar: 'أنواع الاتصال', en: 'Connectivities' },
  'bluetooths': { ar: 'البلوتوث', en: 'Bluetooths' },
  'dimensions': { ar: 'الأبعاد', en: 'Dimensions' },
  
  // أوزان
  'weight_kg': { ar: 'الوزن (كغم)', en: 'Weight (kg)' },
  'weights': { ar: 'الأوزان', en: 'Weights' },
  
  // ملابس وأحذية
  'material_types': { ar: 'أنواع المواد', en: 'Material Types' },
  'shoe_sizes': { ar: 'مقاسات الأحذية', en: 'Shoe Sizes' },
  'shoe_types': { ar: 'أنواع الأحذية', en: 'Shoe Types' },
  'watch_bands': { ar: 'أنواع السوار', en: 'Watch Bands' },
  
  // مناسبات
  'occasions': { ar: 'المناسبات', en: 'Occasions' },
  'age_groups': { ar: 'الفئات العمرية', en: 'Age Groups' },
  
  // عامة
  'types': { ar: 'الأنواع', en: 'Types' },
  'categories': { ar: 'التصنيفات', en: 'Categories' },
  'groups': { ar: 'المجموعات', en: 'Groups' },
  'levels': { ar: 'المستويات', en: 'Levels' },
  'grades': { ar: 'الدرجات', en: 'Grades' },
  'classes': { ar: 'الفئات', en: 'Classes' },
  'ranks': { ar: 'الرتب', en: 'Ranks' },
  'statuses': { ar: 'الحالات', en: 'Statuses' },
  
  // مكان وزمان
  'locations': { ar: 'المواقع', en: 'Locations' },
  'regions': { ar: 'المناطق', en: 'Regions' },
  'cities': { ar: 'المدن', en: 'Cities' },
  'countries': { ar: 'الدول', en: 'Countries' },
  'months': { ar: 'الأشهر', en: 'Months' },
  'years': { ar: 'السنوات', en: 'Years' },
  'days': { ar: 'الأيام', en: 'Days' },
  'times': { ar: 'الأوقات', en: 'Times' },
  
  // ألوان ومواد
  'shades': { ar: 'الدرجات', en: 'Shades' },
  'tones': { ar: 'النغمات', en: 'Tones' },
  'textures': { ar: 'الأقوام', en: 'Textures' },
  'patterns': { ar: 'النقوش', en: 'Patterns' },
  'prints': { ar: 'الطبعات', en: 'Prints' },
  'finishes': { ar: 'التشطيبات', en: 'Finishes' },
  
  // قياسات
  'lengths': { ar: 'الأطوال', en: 'Lengths' },
  'widths': { ar: 'العروض', en: 'Widths' },
  'heights': { ar: 'الارتفاعات', en: 'Heights' },
  'depths': { ar: 'الأعماق', en: 'Depths' },
  'volumes': { ar: 'الأحجام', en: 'Volumes' },
  
  // رقمية
  'formats': { ar: 'التنسيقات', en: 'Formats' },
  'resolutions': { ar: 'الدقات', en: 'Resolutions' },
  'qualities': { ar: 'الجودات', en: 'Qualities' },
  'speeds': { ar: 'السرعات', en: 'Speeds' },
  'powers': { ar: 'الطاقات', en: 'Powers' },
  
  // غذائية
  'flavors': { ar: 'النكهات', en: 'Flavors' },
  'tastes': { ar: 'الأطعمة', en: 'Tastes' },
  'ingredients': { ar: 'المكونات', en: 'Ingredients' },
  'nutritions': { ar: 'القيم الغذائية', en: 'Nutritions' },
  
  // طبية
  'doses': { ar: 'الجرعات', en: 'Doses' },
  'strengths': { ar: 'القوى', en: 'Strengths' },
};

/**
 * ✅ دالة لترجمة اسم الخيار حسب اللغة
 */
export function translateOptionType(type: string, lang: string): string {
  // 1️⃣ حاول الترجمة مباشرة (الجمع)
  let translation = OPTION_TYPE_TRANSLATIONS[type];
  
  // 2️⃣ إذا لم توجد، حاول التحويل من مفرد إلى جمع
  if (!translation) {
    const plural = toPlural(type);
    translation = OPTION_TYPE_TRANSLATIONS[plural];
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
    'colors': '🎨',
    'sizes': '📏',
    'models': '📐',
    'materials': '🧵',
    'fabrics': '👕',
    'styles': '✨',
    'seasons': '🌤️',
    'genders': '👫',
    'brands': '🏷️',
    'storages': '💾',
    'rams': '🧠',
    'processors': '⚡',
    'batteries': '🔋',
    'screen_sizes': '📱',
    'cameras': '📷',
    'connectivities': '📶',
    'bluetooths': '📶',
    'dimensions': '📐',
    'weight_kg': '⚖️',
    'weights': '⚖️',
    'material_types': '🧵',
    'shoe_sizes': '👟',
    'shoe_types': '👟',
    'watch_bands': '⌚',
    'occasions': '🎉',
    'age_groups': '👤',
    'types': '📋',
    'categories': '📂',
    'groups': '👥',
    'levels': '📊',
    'grades': '⭐',
    'classes': '📚',
    'ranks': '🏆',
    'statuses': '📌',
    'locations': '📍',
    'regions': '🗺️',
    'cities': '🏙️',
    'countries': '🌍',
    'months': '📅',
    'years': '📆',
    'days': '📅',
    'times': '⏰',
    'shades': '🎨',
    'tones': '🎨',
    'textures': '🧶',
    'patterns': '🔄',
    'prints': '🖨️',
    'finishes': '✨',
    'lengths': '📏',
    'widths': '📏',
    'heights': '📏',
    'depths': '📏',
    'volumes': '📦',
    'formats': '📄',
    'resolutions': '🖥️',
    'qualities': '⭐',
    'speeds': '🚀',
    'powers': '⚡',
    'flavors': '🍽️',
    'tastes': '🍽️',
    'ingredients': '🥗',
    'nutritions': '🥗',
    'doses': '💊',
    'strengths': '💪',
  };

  return ALLOWED_OPTION_TYPES.map(id => ({
    id,
    label: translateOptionType(id, lang),
    emoji: emojiMap[id] || '📌',
  }));
}