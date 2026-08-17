// ============================================================
// 🤖 AI SHOPPING ASSISTANT V3
// ============================================================
// Groq:
//   - فهم اللغة
//   - فهم النية
//   - المحافظة على سياق المحادثة
//   - صياغة الرد
//
// PostgreSQL / Supabase:
//   - المصدر الوحيد للمنتجات
//   - المصدر الوحيد للأسعار
//   - المصدر الوحيد للمتاجر
//   - المصدر الوحيد للطلبات
//   - المصدر الوحيد للمفضلة
//   - المصدر الوحيد للخصومات
//
// IMPORTANT:
// AI NEVER INVENTS MARKETPLACE DATA.
// ============================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

// ============================================================
// ENV
// ============================================================

const GROQ_API_KEY =
  Deno.env.get("GROQ_API_KEY");

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL");

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY",
  );

if (!GROQ_API_KEY) {
  throw new Error(
    "Missing GROQ_API_KEY",
  );
}

if (!SUPABASE_URL) {
  throw new Error(
    "Missing SUPABASE_URL",
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY",
  );
}


// ============================================================
// CLIENT
// ============================================================

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
  },
);


// ============================================================
// CONFIG
// ============================================================

const GROQ_ENDPOINT =
  "https://api.groq.com/openai/v1/chat/completions";

const MODEL =
  "llama-3.1-8b-instant";

const MAX_MESSAGES = 14;

const MAX_RESULTS = 10;

const MAX_RETRIES = 2;


// ============================================================
// CORS
// ============================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};


// ============================================================
// TYPES
// ============================================================

type Language =
  | "ar"
  | "en";

type Intent =
  | "product_search"
  | "store_search"
  | "category_search"
  | "governorate_search"
  | "delivery_search"
  | "my_orders"
  | "my_favorites"
  | "promo_codes"
  | "casual"
  | "unknown";

type SortType =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest"
  | "popular";


interface SearchPlan {

  intent: Intent;

  query: string | null;

  category: string | null;

  category_slug: string | null;

  governorate: string | null;

  governorate_slug: string | null;

  min_price: number | null;

  max_price: number | null;

  currency: string | null;

  offers_only: boolean;

  sort: SortType;

  limit: number;

  clarification_needed: boolean;

  clarification_question:
    | string
    | null;
}


// ============================================================
// NORMALIZATION
// ============================================================

function normalizeArabicText(
  value:
    | string
    | null
    | undefined,
): string {

  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .trim()

    .replace(
      /[ًٌٍَُِْـّ]/g,
      "",
    )

    .replace(
      /[إأآ]/g,
      "ا",
    )

    .replace(
      /ى/g,
      "ي",
    )

    .replace(
      /ة/g,
      "ه",
    )

    .replace(
      /ؤ/g,
      "و",
    )

    .replace(
      /ئ/g,
      "ي",
    )

    .replace(
      /ۀ/g,
      "ه",
    )

    .replace(
      /\s+/g,
      " ",
    );
}


function cleanSearchText(
  value:
    | string
    | null
    | undefined,
): string {

  return normalizeArabicText(
    value,
  )
    .replace(
      /[^\p{L}\p{N}\s\-_.]/gu,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}


// ============================================================
// SYNONYMS
// ============================================================

const SYNONYMS: Record<string, string[]> = {

  // 👕 ملابس وأزياء
  جاكيت: ["معطف", "جاكيتات", "coat", "jacket"],
  معطف: ["جاكيت", "جاكيتات", "coat"],
  تيشيرت: ["تيشرت", "قميص", "بلوزة", "t-shirt", "shirt"],
  قميص: ["تيشيرت", "تيشرت", "بلوزة", "shirt"],
  بلوزة: ["تيشيرت", "تيشرت", "قميص", "blouse"],
  بنطلون: ["سروال", "بانت", "جينز", "pants", "trousers"],
  سروال: ["بنطلون", "بانت", "جينز", "pants"],
  جينز: ["بنطلون", "سروال", "jeans"],
  فستان: ["فساتين", "دريس", "dress"],
  تنورة: ["تنانير", "سكيرت", "skirt"],
  بدلة: ["بدلات", "suit"],
  حذاء: ["شوز", "كوتشي", "جزمة", "بوط", "shoes", "shoe", "boots"],
  شوز: ["حذاء", "كوتشي", "جزمة", "بوط", "shoes"],
  بوط: ["حذاء", "كوتشي", "جزمة", "شوز", "boots"],
  جزمة: ["حذاء", "كوتشي", "بوط", "شوز", "boots"],
  كوتشي: ["حذاء", "سنييكرز", "sneakers"],
  شبشب: ["صندل", "slippers", "sandals"],
  صندل: ["شبشب", "sandals"],
  حزام: ["أحزمة", "belt"],
  ربطة_عنق: ["كرافتة", "كرافات", "tie"],
  كرافتة: ["ربطة_عنق", "tie"],

  // 📱 إلكترونيات
  جوال: ["موبايل", "هاتف", "تلفون", "smartphone", "mobile", "phone"],
  موبايل: ["جوال", "هاتف", "تلفون", "smartphone", "mobile"],
  هاتف: ["جوال", "موبايل", "تلفون", "phone"],
  تلفون: ["جوال", "موبايل", "هاتف", "phone"],
  لابتوب: ["لاب_توب", "حاسوب_محمول", "notebook", "laptop"],
  لاب_توب: ["لابتوب", "حاسوب_محمول", "laptop"],
  حاسوب: ["كمبيوتر", "desktop", "computer"],
  كمبيوتر: ["حاسوب", "computer"],
  شاشة: ["مونيتور", "monitor", "screen"],
  مونيتور: ["شاشة", "monitor"],
  طابعة: ["برينتر", "printer"],
  برينتر: ["طابعة", "printer"],
  سماعة: ["سماعات", "هيدفون", "headphones"],
  هيدفون: ["سماعة", "سماعات", "headphones"],
  كاميرا: ["آلة_تصوير", "camera"],
  تابلت: ["تاب", "آيباد", "tablet"],
  تاب: ["تابلت", "آيباد", "tablet"],
  آيباد: ["تابلت", "تاب", "ipad"],
  ساعة_ذكية: ["سمارت_ووتش", "ساعة_يد_ذكية", "smartwatch", "watch"],
  سمارت_ووتش: ["ساعة_ذكية", "smartwatch"],
  باور_بانك: ["باوربنك", "شاحن_متنقل", "powerbank"],
  شاحن: ["شواحن", "كابل", "charger"],
  كابل: ["كابلات", "سلك", "cable"],

  // 💎 مجوهرات
  طوق: ["قلادة", "عقد", "سلسلة", "necklace", "collar"],
  قلادة: ["طوق", "عقد", "سلسلة", "necklace"],
  عقد: ["طوق", "قلادة", "سلسلة", "necklace"],
  سلسلة: ["طوق", "قلادة", "عقد", "chain"],
  خاتم: ["خواتم", "دبلة", "ring"],
  دبلة: ["خاتم", "خواتم", "ring"],
  سوار: ["أساور", "برسيل", "bracelet"],
  برسيل: ["سوار", "أساور", "bracelet"],
  ساعة_يد: ["ساعة", "watch", "wristwatch"],
  ساعة: ["ساعة_يد", "watch"],
  نظارة: ["نظارات", "نظارة_شمسية", "glasses"],
  نظارات: ["نظارة", "نظارة_شمسية", "glasses"],
  نظارة_شمسية: ["نظارات_شمسية", "sunglasses"],
  نظارات_شمسية: ["نظارة_شمسية", "sunglasses"],
  أقراط: ["حلقان", "حلق", "earrings"],
  حلقان: ["أقراط", "حلق", "earrings"],

  // 🏠 أثاث ومنزل
  أثاث: ["موبيليا", "furniture"],
  طاولة: ["طاولات", "مكتب", "ترابيزة", "table", "desk"],
  ترابيزة: ["طاولة", "مكتب", "table"],
  مكتب: ["منضدة", "desk"],
  كرسي: ["كراسي", "مقعد", "chair"],
  مقعد: ["كرسي", "كراسي", "chair"],
  كنبة: ["كنب", "صوفا", "أريكة", "sofa"],
  أريكة: ["كنبة", "كنب", "صوفا", "sofa"],
  صوفا: ["كنبة", "كنب", "أريكة", "sofa"],
  دولاب: ["خزانة", "closet", "wardrobe"],
  خزانة: ["دولاب", "closet", "cabinet"],
  سرير: ["أسرة", "bed"],
  مرتبة: ["مراتب", "فرشة", "mattress"],
  فرشة: ["مراتب", "مرتبة", "mattress"],
  ستارة: ["ستائر", "ستاير", "curtain"],
  ستاير: ["ستارة", "ستائر", "curtains"],
  سجادة: ["سجاد", "بساط", "موكيت", "carpet"],
  سجاد: ["سجادة", "بساط", "carpet"],
  بساط: ["سجادة", "سجاد", "rug"],
  مرآة: ["مرايا", "mirror"],
  تحفة: ["تحف", "ديكور", "decor"],

  // 🍳 مطبخ
  ميكروويف: ["مايكروويف", "microwave"],
  مايكروويف: ["ميكروويف", "microwave"],
  ثلاجة: ["براد", "تلاجة", "refrigerator", "fridge"],
  براد: ["ثلاجة", "تلاجة", "fridge"],
  غسالة: ["غسالات", "غسالة_ملابس", "washing_machine", "washer"],
  نشافة: ["مجفف", "dryer"],
  مجفف: ["نشافة", "dryer"],
  مكيف: ["تكييف", "مكيف_هواء", "air_conditioner", "ac"],
  تكييف: ["مكيف", "مكيف_هواء", "air_conditioner"],
  خلاط: ["خلاطات", "مطحنة", "blender"],
  مطحنة: ["خلاط", "grinder"],
  قدر: ["حلة", "pot", "pan"],
  حلة: ["قدر", "pot"],
  طاسة: ["مقلاة", "طاوة", "frying_pan"],
  مقلاة: ["طاسة", "طاوة", "frying_pan"],
  صحون: ["أطباق", "جاط", "plates"],
  أطباق: ["صحون", "جاط", "plates"],
  كؤوس: ["كاسات", "كوب", "كوباية", "glasses"],
  كاسات: ["كؤوس", "كوب", "كوباية", "glasses"],
  كوب: ["كؤوس", "كاسات", "كوباية", "cup"],
  كوباية: ["كؤوس", "كاسات", "كوب", "cup"],

  // 🏃 رياضة
  دمبل: ["دمبلز", "أثقال", "dumbbell"],
  أثقال: ["دمبل", "weights"],
  بساط_رياضي: ["يوجا", "بساط_يوجا", "exercise_mat"],
  يوجا: ["بساط_رياضي", "yoga"],
  دراجة: ["بسكليت", "دراجة_هوائية", "bicycle"],
  بسكليت: ["دراجة", "دراجة_هوائية", "bike"],
  كرة_قدم: ["كرة_قدم", "football"],
  كرة_سلة: ["كرة_سلة", "basketball"],
  مضرب_تنس: ["مضرب", "tennis_racket"],
  مضرب: ["مضرب_تنس", "racket"],
  مايوه: ["بيكيني", "swimsuit"],
  بيكيني: ["مايوه", "bikini"],

  // 💄 جمال
  مكياج: ["ماكياج", "ميك_أب", "makeup"],
  ماكياج: ["مكياج", "makeup"],
  كريم: ["كريمات", "مرطب", "cream"],
  مرطب: ["كريم", "lotion"],
  عطر: ["عطور", "برفان", "perfume"],
  عطور: ["عطر", "برفان", "perfumes"],
  برفان: ["عطر", "عطور", "perfume"],
  شامبو: ["غسول_شعر", "shampoo"],
  غسول: ["شامبو", "wash"],
  صابون: ["صابونة", "soap"],
  صابونة: ["صابون", "soap"],
  مزيل_عرق: ["deodorant"],
  فرشاة_أسنان: ["فرشاة", "toothbrush"],

  // 🔧 أدوات
  عدة: ["أدوات", "tools"],
  أدوات: ["عدة", "tools"],
  شاكوش: ["مطرقة", "hammer"],
  مطرقة: ["شاكوش", "hammer"],
  مفك: ["مفكات", "screwdriver"],
  مفكات: ["مفك", "screwdrivers"],
  منشار: ["saw"],
  براغي: ["مسامير", "screws"],
  مسامير: ["براغي", "screws"],
  لاصق: ["غراء", "صمغ", "glue"],
  غراء: ["لاصق", "صمغ", "glue"],
  شريط_لاصق: ["شريط", "tape"],

  // 🎮 ألعاب
  لعبة: ["ألعاب", "game"],
  ألعاب: ["لعبة", "games"],
  بلايستيشن: ["سوني", "playstation"],
  إكس_بوكس: ["xbox"],
  سوني: ["بلايستيشن", "playstation"],
  ألعاب_فيديو: ["ألعاب", "video_games"],
  درون: ["طائرة_بدون_طيار", "drone"],
  طائرة_بدون_طيار: ["درون", "drone"],

  // 📚 كتب
  كتب: ["كتاب", "books"],
  كتاب: ["كتب", "book"],
  دفتر: ["دفاتر", "كراس", "notebook"],
  كراس: ["دفتر", "notebook"],
  قلم: ["أقلام", "pen"],
  أقلام: ["قلم", "pens"],
  قلم_رصاص: ["مرسم", "pencil"],
  مرسم: ["قلم_رصاص", "pencil"],
  ألوان: ["ألوان_مائية", "colors"],
  ألوان_مائية: ["ألوان", "watercolors"],
  مسطرة: ["مساطر", "ruler"],
  ممحاة: ["استيكة", "eraser"],

  // 🎵 موسيقى
  جيتار: ["قيثارة", "غيتار", "guitar"],
  قيثارة: ["جيتار", "غيتار", "guitar"],
  بيانو: ["piano"],
  طبلة: ["طبل", "درامز", "drum"],
  طبل: ["طبلة", "درامز", "drum"],
  درامز: ["طبلة", "طبل", "drums"],
  كمان: ["كمنجة", "violin"],
  كمنجة: ["كمان", "violin"],
  ناي: ["مزمار", "flute"],
  مزمار: ["ناي", "flute"],
  لوحة_فنية: ["لوحة", "painting"],
  لوحة: ["لوحة_فنية", "painting"],
  إطار: ["برواز", "frame"],
  برواز: ["إطار", "frame"],

  // 🌿 نباتات
  نبتة: ["نبات", "شجرة", "plant"],
  نبات: ["نبتة", "شجرة", "plant"],
  شجرة: ["نبتة", "نبات", "tree"],
  زهرة: ["زهور", "ورد", "flower"],
  زهور: ["زهرة", "ورد", "flowers"],
  ورد: ["زهرة", "زهور", "rose"],
  وعاء: ["أصيص", "pot"],
  أصيص: ["وعاء", "pot"],

  // 🧵 خياطة
  قماش: ["أقمشة", "نسيج", "fabric"],
  أقمشة: ["قماش", "نسيج", "fabrics"],
  نسيج: ["قماش", "أقمشة", "fabric"],
  خيط: ["خيوط", "thread"],
  خيوط: ["خيط", "threads"],
  إبرة: ["إبر", "needle"],
  إبر: ["إبرة", "needles"],
  زر: ["أزرار", "button"],
  أزرار: ["زر", "buttons"],
  سحاب: ["سوستة", "zipper"],
  سوستة: ["سحاب", "zipper"],

  // 📦 عام
  منتج: ["منتجات", "سلعة", "product"],
  منتجات: ["منتج", "سلعة", "products"],
  سلعة: ["منتج", "منتجات", "item"],
  جديد: ["جديدة", "new"],
  مستعمل: ["used", "second_hand"],
  عرض: ["عروض", "خصم", "تخفيض", "offer", "sale"],
  عروض: ["عرض", "خصم", "تخفيض", "offers"],
  خصم: ["عرض", "تخفيض", "discount"],
  تخفيض: ["عرض", "خصم", "sale", "discount"],
  هدية: ["هدايا", "gift"],
  هدايا: ["هدية", "gifts"],
};

function expandSynonyms(
  query:
    | string
    | null,
): string {

  if (!query) {
    return "";
  }

  const normalized =
    normalizeArabicText(
      query,
    );

  const words =
    normalized
      .split(/\s+/)
      .filter(Boolean);

  const expanded =
    new Set<string>();

  // IMPORTANT:
  // نحتفظ بالكلمات الأصلية
  // ونضيف المرادفات فقط.

  for (const word of words) {

    expanded.add(word);

    const synonyms =
      SYNONYMS[word];

    if (!synonyms) {
      continue;
    }

    for (
      const synonym
      of synonyms
    ) {

      expanded.add(
        normalizeArabicText(
          synonym,
        ),
      );
    }
  }

  return Array.from(
    expanded,
  ).join(" ");
}


// ============================================================
// INTENT FALLBACK
// ============================================================

function detectIntentFallback(
  text: string,
): Intent {

  const q =
    normalizeArabicText(
      text,
    );


  // ----------------------------------------------------------
  // ORDERS
  // ----------------------------------------------------------

  if (
    q.includes("طلباتي") ||
    q.includes("طلبي") ||
    q.includes("وين الطلب") ||
    q.includes("وين طلبي") ||
    q.includes("حاله الطلب") ||
    q.includes("orders") ||
    q.includes("my order")
  ) {

    return "my_orders";
  }


  // ----------------------------------------------------------
  // FAVORITES
  // ----------------------------------------------------------

  if (
    q.includes("مفضل") ||
    q.includes("المفضله") ||
    q.includes("المفضلة") ||
    q.includes("favorites") ||
    q.includes("favorite")
  ) {

    return "my_favorites";
  }


  // ----------------------------------------------------------
  // PROMO
  // ----------------------------------------------------------

  if (
    q.includes("كود خصم") ||
    q.includes("كوبون") ||
    q.includes("كوبونات") ||
    q.includes("خصم") ||
    q.includes("promo") ||
    q.includes("coupon")
  ) {

    return "promo_codes";
  }


  // ----------------------------------------------------------
  // DELIVERY
  // ----------------------------------------------------------

  if (
    q.includes("توصيل") ||
    q.includes("شحن") ||
    q.includes("شركة شحن") ||
    q.includes("delivery") ||
    q.includes("shipping")
  ) {

    return "delivery_search";
  }


  // ----------------------------------------------------------
  // STORE
  // ----------------------------------------------------------

  if (
    q.includes("متجر") ||
    q.includes("متاجر") ||
    q.includes("محل") ||
    q.includes("محلات") ||
    q.includes("store") ||
    q.includes("stores")
  ) {

    return "store_search";
  }


  // ----------------------------------------------------------
  // CATEGORY
  // ----------------------------------------------------------

  if (
    q.includes("تصنيف") ||
    q.includes("تصنيفات") ||
    q.includes("قسم") ||
    q.includes("اقسام") ||
    q.includes("categories") ||
    q.includes("category")
  ) {

    return "category_search";
  }


  // ----------------------------------------------------------
  // GOVERNORATE
  // ----------------------------------------------------------

  if (
    q.includes("محافظه") ||
    q.includes("محافظة") ||
    q.includes("محافظات") ||
    q.includes("governorate")
  ) {

    return "governorate_search";
  }


  // ----------------------------------------------------------
  // PRODUCT SEARCH
  // ----------------------------------------------------------

  // كلمات البحث عن منتج

  const productWords = [
    "بدي",
    "بديلي",
    "اريد",
    "أريد",
    "ابحث",
    "دورلي",
    "دورلي على",
    "لاقيل",
    "لقيلي",
    "جيبلي",
    "ورجيني",
    "عطيني",
    "شو عندك",
    "في عندك",
    "عندكم",
    "find",
    "search",
    "looking for",
    "show me",
  ];

  for (
    const word
    of productWords
  ) {

    if (
      q.includes(
        normalizeArabicText(word),
      )
    ) {

      return "product_search";
    }
  }


  // ----------------------------------------------------------
  // VERY IMPORTANT
  // ----------------------------------------------------------
  // إذا كانت الرسالة كلمة واحدة أو كلمتين
  // مثل:
  //
  // طوق
  // موبايل
  // لابتوب
  // شوز
  //
  // نعتبرها بحث منتج.

  const words =
    q.split(/\s+/)
      .filter(Boolean);

  if (
    words.length > 0 &&
    words.length <= 5
  ) {

    return "product_search";
  }


  return "unknown";
}


// ============================================================
// PLANNER PROMPT
// ============================================================

function buildPlannerPrompt(
  language: Language,
  conversation: any[],
): string {

  const languageInstruction =
    language === "ar"
      ? `
اكتب القيم النصية بالعربية عندما يكون
ذلك مناسباً.
`
      : `
Write textual values in English
when appropriate.
`;


  return `

أنت العقل الذي يفهم المستخدم
لمساعد التسوق الذكي "السوق لعندك".

مهمتك تحويل كلام المستخدم إلى
Search Plan JSON.

لا تجب على المستخدم.

${languageInstruction}


============================================================
أهم قاعدة
============================================================

حافظ على سياق المحادثة.

مثال:

المستخدم:
"بدي موبايل سامسونغ"

المساعد:
نتائج...

المستخدم:
"أرخص واحد"

يجب أن يكون:

intent = product_search
query = "موبايل سامسونغ"
sort = "price_asc"


مثال:

المستخدم:
"بدي شوز نايك"

المستخدم:
"عليه خصم؟"

يجب أن يكون:

intent = product_search
query = "شوز نايك"
offers_only = true


مثال:

المستخدم:
"بدي طوق"

المستخدم:
"أرخص"

يجب أن يبقى:

query = "طوق"
sort = "price_asc"


============================================================
INTENTS
============================================================

product_search
store_search
category_search
governorate_search
delivery_search
my_orders
my_favorites
promo_codes
casual
unknown


============================================================
PRODUCT SEARCH
============================================================

أي كلمة تشير إلى منتج
مثل:

طوق
موبايل
هاتف
لابتوب
شوز
حقيبة

هي product_search.

لا تحتاج عبارة "بدي".


============================================================
SORT
============================================================

أرخص:
price_asc

الأرخص:
price_asc

أغلى:
price_desc

الأفضل:
rating

احسن:
rating

الأحدث:
newest

الأكثر شعبية:
popular


============================================================
FILTERS
============================================================

عليه خصم
عليه عرض
في عرض
خصم

=> offers_only = true


تحت 300
=> max_price = 300


فوق 100
=> min_price = 100


بين 100 و300

=> min_price = 100
=> max_price = 300


============================================================
IMPORTANT
============================================================

لا تخترع:

category_slug
governorate_slug

إذا لم تكن متأكداً:
null


لا تخترع أسعار.


إذا كان المستخدم يقول:

"أرخص"

بعد بحث سابق،
لا تجعل query = "أرخص".

بل احتفظ بموضوع البحث السابق.


============================================================
OUTPUT
============================================================

JSON فقط:

{
  "intent": "product_search",
  "query": null,
  "category": null,
  "category_slug": null,
  "governorate": null,
  "governorate_slug": null,
  "min_price": null,
  "max_price": null,
  "currency": null,
  "offers_only": false,
  "sort": "relevance",
  "limit": 10,
  "clarification_needed": false,
  "clarification_question": null
}


============================================================
CONVERSATION
============================================================

${JSON.stringify(
  conversation.slice(-10),
)}

`;
}


// ============================================================
// GROQ
// ============================================================

async function callGroq(
  messages: any[],
  options: {
    json?: boolean;
    temperature?: number;
    maxTokens?: number;
  } = {},
) {

  let lastError:
    | unknown
    | null = null;


  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt++
  ) {

    try {

      const body: any = {

        model: MODEL,

        messages,

        temperature:
          options.temperature ??
          0.2,

        max_tokens:
          options.maxTokens ??
          900,
      };


      if (
        options.json
      ) {

        body.response_format = {
          type: "json_object",
        };
      }


      const response =
        await fetch(
          GROQ_ENDPOINT,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${GROQ_API_KEY}`,
            },

            body:
              JSON.stringify(
                body,
              ),
          },
        );


      if (
        !response.ok
      ) {

        const text =
          await response.text();


        if (
          response.status === 429 &&
          attempt < MAX_RETRIES
        ) {

          await sleep(
            parseRetryDelay(
              text,
            ),
          );

          continue;
        }


        throw new Error(
          `Groq API ${response.status}: ${text}`,
        );
      }


      return await response.json();

    } catch (
      error
    ) {

      lastError = error;


      if (
        attempt < MAX_RETRIES
      ) {

        await sleep(
          500 *
          (attempt + 1),
        );
      }
    }
  }


  throw lastError;
}


// ============================================================
// RETRY DELAY
// ============================================================

function parseRetryDelay(
  text: string,
): number {

  const ms =
    text.match(
      /try again in ([\d.]+)ms/i,
    );

  if (ms) {

    return Math.min(
      Math.ceil(
        Number(ms[1]),
      ),
      10000,
    );
  }


  const sec =
    text.match(
      /try again in ([\d.]+)s/i,
    );

  if (sec) {

    return Math.min(
      Math.ceil(
        Number(sec[1]) *
        1000,
      ),
      10000,
    );
  }


  return 1000;
}


// ============================================================
// SLEEP
// ============================================================

function sleep(
  ms: number,
) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms,
      ),
  );
}


// ============================================================
// SAFE JSON
// ============================================================

function parseJsonSafe(
  text: string,
) {

  try {

    return JSON.parse(
      text,
    );

  } catch {

    const start =
      text.indexOf("{");

    const end =
      text.lastIndexOf("}");


    if (
      start >= 0 &&
      end > start
    ) {

      try {

        return JSON.parse(
          text.slice(
            start,
            end + 1,
          ),
        );

      } catch {

        return null;
      }
    }


    return null;
  }
}


// ============================================================
// DEFAULT PLAN
// ============================================================

function defaultPlan(
  intent: Intent,
  text: string,
): SearchPlan {

  return {

    intent,

    query:
      intent ===
      "product_search"
        ? cleanSearchText(
            text,
          )
        : null,

    category: null,

    category_slug: null,

    governorate: null,

    governorate_slug: null,

    min_price: null,

    max_price: null,

    currency: null,

    offers_only: false,

    sort: "relevance",

    limit:
      MAX_RESULTS,

    clarification_needed:
      false,

    clarification_question:
      null,
  };
}


// ============================================================
// NORMALIZE PLAN
// ============================================================

function normalizePlan(
  plan: any,
  fallbackIntent: Intent,
  originalText: string,
): SearchPlan {

  const allowedSorts:
    SortType[] = [

    "relevance",
    "price_asc",
    "price_desc",
    "rating",
    "newest",
    "popular",
  ];


  let intent:
    Intent =
      plan?.intent ||
      fallbackIntent;


  let query:
    string | null =
      typeof plan?.query ===
      "string"

        ? cleanSearchText(
            plan.query,
          )

        : null;


  if (
    intent ===
      "product_search" &&
    !query
  ) {

    query =
      cleanSearchText(
        originalText,
      );
  }


  return {

    intent,

    query,

    category:
      typeof plan?.category ===
      "string"
        ? cleanSearchText(
            plan.category,
          )
        : null,

    category_slug:
      typeof plan?.category_slug ===
      "string"
        ? plan.category_slug
            .trim()
        : null,

    governorate:
      typeof plan?.governorate ===
      "string"
        ? cleanSearchText(
            plan.governorate,
          )
        : null,

    governorate_slug:
      typeof plan?.governorate_slug ===
      "string"
        ? plan.governorate_slug
            .trim()
        : null,

    min_price:
      typeof plan?.min_price ===
      "number"
        ? plan.min_price
        : null,

    max_price:
      typeof plan?.max_price ===
      "number"
        ? plan.max_price
        : null,

    currency:
      typeof plan?.currency ===
      "string"
        ? plan.currency.trim()
        : null,

    offers_only:
      plan?.offers_only === true,

    sort:
      allowedSorts.includes(
        plan?.sort,
      )
        ? plan.sort
        : "relevance",

    limit:
      Math.min(
        Math.max(
          Number(
            plan?.limit,
          ) ||
            MAX_RESULTS,
          1,
        ),
        MAX_RESULTS,
      ),

    clarification_needed:
      plan?.clarification_needed ===
      true,

    clarification_question:
      typeof plan?.clarification_question ===
      "string"
        ? plan.clarification_question
        : null,
  };
}


// ============================================================
// BUILD SEARCH PLAN
// ============================================================

async function buildSearchPlan(
  messages: any[],
  language: Language,
): Promise<SearchPlan> {

  const latestUser =
    [...messages]
      .reverse()
      .find(
        (m) =>
          m.role ===
          "user",
      );


  const latestText =
    latestUser?.content
      ?.toString() ??
    "";


  const fallbackIntent =
    detectIntentFallback(
      latestText,
    );


  try {

    const response =
      await callGroq(
        [
          {
            role:
              "system",

            content:
              buildPlannerPrompt(
                language,
                messages,
              ),
          },

          {
            role:
              "user",

            content:
              latestText,
          },
        ],
        {
          json: true,
          temperature: 0,
          maxTokens: 600,
        },
      );


    const content =
      response
        ?.choices?.[0]
        ?.message
        ?.content;


    const parsed =
      parseJsonSafe(
        content ?? "",
      );


    if (!parsed) {

      return defaultPlan(
        fallbackIntent,
        latestText,
      );
    }


    return normalizePlan(
      parsed,
      fallbackIntent,
      latestText,
    );

  } catch (
    error
  ) {

    console.error(
      "Planner failed:",
      error,
    );


    return defaultPlan(
      fallbackIntent,
      latestText,
    );
  }
}


// ============================================================
// CATEGORY RESOLUTION
// ============================================================

async function resolveCategory(
  plan: SearchPlan,
) {

  if (
    plan.category_slug
  ) {

    return plan.category_slug;
  }


  if (
    !plan.category
  ) {

    return null;
  }


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_categories_fuzzy",
      {
        p_query:
          plan.category,

        p_limit: 3,
      },
    );


  if (
    error ||
    !data?.length
  ) {

    return null;
  }


  return data[0]?.slug ??
    null;
}


// ============================================================
// GOVERNORATE RESOLUTION
// ============================================================

async function resolveGovernorate(
  plan: SearchPlan,
) {

  if (
    plan.governorate_slug
  ) {

    return plan.governorate_slug;
  }


  if (
    !plan.governorate
  ) {

    return null;
  }


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_governorates_fuzzy",
      {
        p_query:
          plan.governorate,
      },
    );


  if (
    error ||
    !data?.length
  ) {

    return null;
  }


  return data[0]?.slug ??
    null;
}


// ============================================================
// PRODUCT SEARCH
// ============================================================

async function searchProducts(
  plan: SearchPlan,
) {

  const categorySlug =
    await resolveCategory(
      plan,
    );

  const governorateSlug =
    await resolveGovernorate(
      plan,
    );

  // ✅ استخدم query الأصلي مباشرة بدون expandSynonyms
  const query = plan.query;

  console.log("🔍 Searching for:", query);

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_listings_smart",
      {
        p_query: query,  // <- استخدم query الأصلي
        p_category_slug: categorySlug,
        p_governorate_slug: governorateSlug,
        p_min_price: plan.min_price,
        p_max_price: plan.max_price,
        p_offers_only: plan.offers_only,
        p_sort: plan.sort,
        p_limit: plan.limit,
      },
    );

  console.log("🔍 SQL DATA LENGTH:", data?.length || 0);
  console.log("🔍 SQL DATA:", JSON.stringify(data));

  if (error) {
    throw error;
  }

  return data ?? [];
}

// ============================================================
// FALLBACK SEARCH
// ============================================================

async function fallbackProductSearch(
  plan: SearchPlan,
  firstResults: any[],
) {

  if (
    firstResults.length > 0
  ) {

    return firstResults;
  }


  if (
    !plan.query
  ) {

    return [];
  }


  const simplified =
    simplifyQuery(
      plan.query,
    );


  if (
    !simplified ||
    simplified ===
      plan.query
  ) {

    return [];
  }


  return await searchProducts(
    {
      ...plan,

      query:
        simplified,

      category_slug:
        null,

      governorate_slug:
        plan.governorate_slug,
    },
  );
}


// ============================================================
// SIMPLIFY QUERY
// ============================================================

function simplifyQuery(
  query: string,
): string {

  const normalized =
    normalizeArabicText(
      query,
    );


  const ignored =
    new Set([
      "بدي",
      "اريد",
      "أريد",
      "ابحث",
      "دورلي",
      "عن",
      "شي",
      "شيء",
      "منتج",
      "منتجات",
      "رخيص",
      "رخيصه",
      "رخيصة",
      "غالي",
      "غاليه",
      "غالية",
      "منيح",
      "حلو",
      "حلوه",
      "حلوة",
      "عندي",
      "عندك",
      "عندكم",
      "في",
    ]);


  return normalized
    .split(/\s+/)
    .filter(
      (word) =>
        word &&
        !ignored.has(word),
    )
    .slice(0, 6)
    .join(" ");
}


// ============================================================
// STORE SEARCH
// ============================================================

async function searchStores(
  plan: SearchPlan,
) {

  const governorateSlug =
    await resolveGovernorate(
      plan,
    );


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_stores_fuzzy",
      {
        p_query:
          plan.query
            ? expandSynonyms(
                plan.query,
              )
            : null,

        p_governorate_slug:
          governorateSlug,

        p_store_type:
          null,

        p_limit:
          plan.limit,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return data ?? [];
}


// ============================================================
// CATEGORY SEARCH
// ============================================================

async function searchCategories(
  plan: SearchPlan,
) {

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_categories_fuzzy",
      {
        p_query:
          plan.query,

        p_limit: 50,  // ← غيّر إلى 50 عشان تجيب كل التصنيفات
      },
    );

  if (
    error
  ) {

    throw error;
  }

  return data ?? [];
}

// ============================================================
// GOVERNORATES
// ============================================================

async function searchGovernorates(
  plan: SearchPlan,
) {

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_governorates_fuzzy",
      {
        p_query:
          plan.query,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return data ?? [];
}


// ============================================================
// DELIVERY
// ============================================================

async function searchDelivery(
  plan: SearchPlan,
) {

  const governorateSlug =
    await resolveGovernorate(
      plan,
    );


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_delivery_companies_fuzzy",
      {
        p_query:
          plan.query,

        p_governorate_slug:
          governorateSlug,

        p_limit:
          plan.limit,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return data ?? [];
}


// ============================================================
// ORDERS
// ============================================================

async function getMyOrders(
  userId:
    | string
    | null,
) {

  if (!userId) {

    return {
      rows: [],
      note:
        "user_not_logged_in",
    };
  }


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "get_user_orders",
      {
        p_user_id:
          userId,

        p_limit: 10,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return {
    rows:
      data ?? [],
  };
}


// ============================================================
// FAVORITES
// ============================================================

async function getMyFavorites(
  userId:
    | string
    | null,
) {

  if (!userId) {

    return {
      rows: [],
      note:
        "user_not_logged_in",
    };
  }


  const {
    data,
    error,
  } =
    await supabase.rpc(
      "get_user_favorites",
      {
        p_user_id:
          userId,

        p_limit: 10,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return {
    rows:
      data ?? [],
  };
}


// ============================================================
// PROMO
// ============================================================

async function getPromoCodes() {

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "search_active_promo_codes",
      {
        p_limit: 10,
      },
    );


  if (
    error
  ) {

    throw error;
  }


  return data ?? [];
}


// ============================================================
// EXECUTE PLAN
// ============================================================

async function executePlan(
  plan: SearchPlan,
  userId:
    | string
    | null,
) {

  switch (
    plan.intent
  ) {

    case "product_search": {

      let rows =
        await searchProducts(
          plan,
        );


      rows =
        await fallbackProductSearch(
          plan,
          rows,
        );


      return {
        type:
          "products",

        rows,
      };
    }


    case "store_search":

      return {
        type:
          "stores",

        rows:
          await searchStores(
            plan,
          ),
      };


    case "category_search":

      return {
        type:
          "categories",

        rows:
          await searchCategories(
            plan,
          ),
      };


    case "governorate_search":

      return {
        type:
          "governorates",

        rows:
          await searchGovernorates(
            plan,
          ),
      };


    case "delivery_search":

      return {
        type:
          "delivery",

        rows:
          await searchDelivery(
            plan,
          ),
      };


    case "my_orders":

      return {
        type:
          "orders",

        ...(await getMyOrders(
          userId,
        )),
      };


    case "my_favorites":

      return {
        type:
          "favorites",

        ...(await getMyFavorites(
          userId,
        )),
      };


    case "promo_codes":

      return {
        type:
          "promos",

        rows:
          await getPromoCodes(),
      };


    default:

      return {
        type:
          "none",

        rows: [],
      };
  }
}


// ============================================================
// FINAL RESPONSE PROMPT
// ============================================================

function buildResponsePrompt(
  language: Language,
  plan: SearchPlan,
  result: any,
  conversation: any[],
): string {

  const rows = Array.isArray(result?.rows) ? result.rows : [];
  const type = result?.type || "none";
  
  let itemsList = "";
  
  // ============================================================
  // ✅ بناء القائمة حسب النوع
  // ============================================================
  
  if (type === "products" || type === "product") {
    itemsList = rows.map((p: any) => {
      const title = p.title_ar || p.title_en || "منتج";
      const price = p.price ? `${p.price.toLocaleString()} ل.س` : "";
      const discount = p.is_offer ? ` - خصم ${p.discount_percent}%` : "";
      return `• ${title} - السعر: ${price}${discount}\n   الرابط: /listing/${p.id}`;
    }).join("\n\n");
  }
  
  // ============================================================
  // ✅ دعم المتاجر
  // ============================================================
  
  else if (type === "stores" || type === "store") {
    itemsList = rows.map((s: any) => {
      const name = s.store_name || s.name_ar || "متجر";
      return `• ${name}\n   الرابط: /store/${s.id}`;
    }).join("\n\n");
  }
  
  // ============================================================
  // ✅ دعم التصنيفات
  // ============================================================
  
  else if (type === "categories" || type === "category") {
    itemsList = rows.map((c: any) => {
      const name = c.name_ar || c.name_en || "تصنيف";
      return `• ${name}\n   الرابط: /category/${c.slug}`;
    }).join("\n\n");
  }
  
  // ============================================================
  // ✅ دعم المحافظات
  // ============================================================
  
  else if (type === "governorates" || type === "governorate") {
    itemsList = rows.map((g: any) => {
      const name = g.name_ar || g.name_en || "محافظة";
      return `• ${name}\n   الرابط: /governorate/${g.slug || g.id}`;
    }).join("\n\n");
  }

  const languageInstruction = language === "ar"
    ? `أجب بالعربية السورية الطبيعية. احكي بطريقة ودودة وطبيعية.`
    : `Answer in natural friendly English.`;

  const typeNames: Record<string, string> = {
    products: "منتجات",
    product: "منتجات",
    stores: "متاجر",
    store: "متاجر",
    categories: "تصنيفات",
    category: "تصنيفات",
    governorates: "محافظات",
    governorate: "محافظات",
  };

  return `
أنت مساعد التسوق الذكي "السوق لعندك".

${languageInstruction}

============================================================
تعليمات مهمة جداً:
============================================================

1. **نوع النتائج: ${typeNames[type] || "نتائج"}**

2. **النتائج الموجودة:**
${itemsList || "لا توجد نتائج"}

3. **إذا لم تكن هناك نتائج، قل "ما لقيت نتائج" واقترح تغيير البحث.**

4. **لا تختلق أي معلومات غير موجودة في DATA.**

5. **الروابط يجب أن تكون في سطر منفصل بهذا الشكل:**
   - للمنتج: /listing/{id}
   - للمتجر: /store/{id}
   - للتصنيف: /category/{slug}
   - للمحافظة: /governorate/{id}

============================================================
DATA
============================================================

${JSON.stringify(result, null, 2)}

============================================================
الرد المطلوب:
============================================================

${rows.length > 0 
  ? `اعرض النتائج مع الروابط في سطر منفصل لكل عنصر.`
  : `قل "ما لقيت نتائج مطابقة حالياً 🙏" واقترح تغيير كلمة البحث.`}
`;
}

// ============================================================
// FINAL RESPONSE
// ============================================================

async function generateFinalResponse(
  language: Language,
  plan: SearchPlan,
  result: any,
  messages: any[],
) {

  const response =
    await callGroq(
      [
        {
          role:
            "system",

          content:
            buildResponsePrompt(
              language,
              plan,
              result,
              messages,
            ),
        },

        {
          role:
            "user",

          content:
            [...messages]
              .reverse()
              .find(
                (m) =>
                  m.role ===
                  "user",
              )
              ?.content ??
            "",
        },
      ],
      {
        temperature:
          0.35,

        maxTokens:
          900,
      },
    );


  const reply =
    response
      ?.choices?.[0]
      ?.message
      ?.content
      ?.trim();


  return (
    reply ||
    fallbackResponse(
      language,
      result,
    )
  );
}


// ============================================================
// FALLBACK RESPONSE
// ============================================================

function fallbackResponse(
  language: Language,
  result: any,
) {

  const rows =
    Array.isArray(
      result?.rows,
    )
      ? result.rows
      : [];


  if (
    rows.length > 0
  ) {

    return language === "ar"

      ? `لقيتلك ${rows.length} نتيجة مناسبة 👍`

      : `I found ${rows.length} matching results.`;
  }


  return language === "ar"

    ? "ما لقيت نتائج مطابقة حالياً 🙏"

    : "I couldn't find matching results right now.";
}


// ============================================================
// AUTH
// ============================================================

async function getAuthenticatedUser(
  req: Request,
) {

  const authHeader =
    req.headers.get(
      "Authorization",
    );


  if (
    !authHeader
  ) {

    return null;
  }


  const token =
    authHeader.replace(
      /^Bearer\s+/i,
      "",
    );


  if (!token) {

    return null;
  }


  const {
    data,
    error,
  } =
    await supabase.auth.getUser(
      token,
    );


  if (
    error ||
    !data?.user
  ) {

    return null;
  }


  return data.user;
}


// ============================================================
// SAVE HISTORY
// ============================================================

async function saveHistory(
  userId:
    | string
    | null,

  userMessage:
    string,

  aiResponse:
    string,

  language:
    Language,
) {

  try {

    const {
      error,
    } =
      await supabase
        .from(
          "ai_chat_history",
        )
        .insert({

          user_id:
            userId,

          user_message:
            userMessage,

          ai_response:
            aiResponse,

          language,
        });


    if (
      error
    ) {

      console.error(
        "History save failed:",
        error,
      );
    }

  } catch (
    error
  ) {

    console.error(
      "History exception:",
      error,
    );
  }
}


// ============================================================
// SAFE MESSAGES
// ============================================================

function buildSafeMessages(
  messages: any[],
) {

  return messages
    .slice(
      -MAX_MESSAGES,
    )

    .map(
      (message: any) => ({

        role:
          message?.role ===
          "assistant"

            ? "assistant"

            : "user",

        content:
          String(
            message?.content ??
              "",
          ).slice(
            0,
            4000,
          ),
      }),
    );
}


// ============================================================
// MAIN
// ============================================================

Deno.serve(
  async (
    req,
  ) => {

    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    if (
      req.method ===
      "OPTIONS"
    ) {

      return new Response(
        null,
        {
          headers:
            CORS_HEADERS,
        },
      );
    }


    // --------------------------------------------------------
    // MAIN TRY
    // --------------------------------------------------------

    try {

      const body =
        await req.json();


      const messages =
        Array.isArray(
          body?.messages,
        )
          ? body.messages
          : [];


      if (
        !messages.length
      ) {

        return new Response(
          JSON.stringify({
            error:
              "messages array is required",
          }),

          {
            status:
              400,

            headers: {
              ...CORS_HEADERS,

              "Content-Type":
                "application/json",
            },
          },
        );
      }


      const language:
        Language =
        body?.lang ===
        "en"

          ? "en"

          : "ar";


      // ------------------------------------------------------
      // AUTH
      // ------------------------------------------------------

      const user =
        await getAuthenticatedUser(
          req,
        );


      const userId =
        user?.id ??
        null;


      // ------------------------------------------------------
      // SAFE MESSAGES
      // ------------------------------------------------------

      const safeMessages =
        buildSafeMessages(
          messages,
        );


      // ------------------------------------------------------
      // PLAN
      // ------------------------------------------------------

      const plan =
        await buildSearchPlan(
          safeMessages,
          language,
        );


      console.log(
        "🧠 PLAN:",
        JSON.stringify(
          plan,
        ),
      );


      // ------------------------------------------------------
      // CASUAL
      // ------------------------------------------------------

      if (
        plan.intent ===
        "casual"
      ) {

        const response =
          await callGroq(
            [
              {
                role:
                  "system",

                content:
                  language ===
                  "ar"

                    ? `
أنت مساعد ودود لمنصة
"السوق لعندك".

تكلم بالعربية السورية
الطبيعية.

كن لطيفاً ومختصراً.

إذا كان المستخدم يريد
منتجات أو متاجر أو طلبات،
فهو سيستخدم نظام البحث.

لا تخترع بيانات السوق.
`

                    : `
You are a friendly assistant
for "Al Souq Laandak".

Speak naturally.

Never invent marketplace data.
`,
              },

              ...safeMessages,
            ],

            {
              temperature:
                0.6,

              maxTokens:
                500,
            },
          );


        const reply =
          response
            ?.choices?.[0]
            ?.message
            ?.content
            ?.trim()

          ||

          (
            language ===
            "ar"

              ? "أهلاً وسهلاً 😊"

              : "Hello! 😊"
          );


        const lastUser =
          [...safeMessages]
            .reverse()
            .find(
              (m) =>
                m.role ===
                "user",
            );


        if (
          lastUser
        ) {

          await saveHistory(
            userId,
            lastUser.content,
            reply,
            language,
          );
        }


        return new Response(

          JSON.stringify({

            reply,

            results: [],

            plan,
          }),

          {

            status:
              200,

            headers: {

              ...CORS_HEADERS,

              "Content-Type":
                "application/json",
            },
          },
        );
      }


      // ------------------------------------------------------
      // DATABASE SEARCH
      // ------------------------------------------------------

      let result: any;


      try {

        result =
          await executePlan(
            plan,
            userId,
          );

      } catch (
        error
      ) {

        console.error(
          "❌ DATABASE SEARCH ERROR:",
          error,
        );


        result = {

          type:
            "error",

          rows: [],

          error:
            "database_search_failed",
        };
      }


      console.log(
        "🔎 RESULT:",
        JSON.stringify({
          type:
            result?.type,

          count:
            result?.rows
              ?.length ??
            0,
        }),
      );
console.log("🔍 FULL RESULT:", JSON.stringify(result));
console.log("🔍 FIRST ROW:", JSON.stringify(result?.rows?.[0] || "none"));

      // ------------------------------------------------------
      // FINAL AI RESPONSE
      // ------------------------------------------------------

      const reply =
        await generateFinalResponse(
          language,
          plan,
          result,
          safeMessages,
        );


      // ------------------------------------------------------
      // FRONTEND RESULTS
      // ------------------------------------------------------

      const frontendResults =
        Array.isArray(
          result?.rows,
        )

          ? result.rows

          : [];


      // ------------------------------------------------------
      // SAVE HISTORY
      // ------------------------------------------------------

      const lastUser =
        [...safeMessages]
          .reverse()
          .find(
            (m) =>
              m.role ===
              "user",
          );


      if (
        lastUser
      ) {

        await saveHistory(
          userId,
          lastUser.content,
          reply,
          language,
        );
      }


      // ------------------------------------------------------
      // RESPONSE
      // ------------------------------------------------------

      return new Response(

        JSON.stringify({

          reply,

          results:
            frontendResults,

          plan: {

            intent:
              plan.intent,

            query:
              plan.query,

            sort:
              plan.sort,

            offers_only:
              plan.offers_only,

            category:
              plan.category,

            governorate:
              plan.governorate,

            min_price:
              plan.min_price,

            max_price:
              plan.max_price,
          },
        }),

        {

          status:
            200,

          headers: {

            ...CORS_HEADERS,

            "Content-Type":
              "application/json",
          },
        },
      );

    } catch (
      error
    ) {

      console.error(
        "❌ AI ASSISTANT FATAL ERROR:",
        error,
      );


      return new Response(

        JSON.stringify({

          reply:
            "عذراً، صار عندي ضغط مؤقت بالمعالجة 🙏 جرب تسألني مرة ثانية.",

          results: [],
        }),

        {

          status:
            200,

          headers: {

            ...CORS_HEADERS,

            "Content-Type":
              "application/json",
          },
        },
      );
    }
  },
);