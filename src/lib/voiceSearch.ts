// src/lib/voiceSearch.ts

// ✅ دوال مساعدة للبحث الصوتي

export interface VoiceSearchResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

// ✅ تحويل النص الصوتي إلى استعلام بحث ذكي
export function parseVoiceQuery(text: string): {
  type: "product" | "store" | "category" | "general";
  query: string;
  filters?: Record<string, any>;
} {
  const lower = text.toLowerCase().trim();
  
  // ✅ الكلمات المفتاحية للبحث عن متاجر
  const storeKeywords = ["متجر", "store", "بائع", "seller", "محل", "shop", "مؤسسة", "company"];
  const isStoreSearch = storeKeywords.some(keyword => lower.includes(keyword));
  
  // ✅ الكلمات المفتاحية للبحث عن تصنيفات
  const categoryKeywords = ["تصنيف", "category", "قسم", "section", "فئة", "type"];
  const isCategorySearch = categoryKeywords.some(keyword => lower.includes(keyword));
  
  // ✅ الكلمات المفتاحية للبحث عن عروض
  const offerKeywords = ["عرض", "offer", "خصم", "discount", "تخفيض", "sale", "صفقة", "deal"];
  const isOfferSearch = offerKeywords.some(keyword => lower.includes(keyword));
  
  // ✅ استخراج النص النقي (إزالة الكلمات المفتاحية)
  let cleanQuery = text;
  
  // ✅ إزالة كلمات البحث عن المتاجر
  storeKeywords.forEach(keyword => {
    cleanQuery = cleanQuery.replace(new RegExp(keyword, "gi"), "").trim();
  });
  
  // ✅ إزالة كلمات البحث عن التصنيفات
  categoryKeywords.forEach(keyword => {
    cleanQuery = cleanQuery.replace(new RegExp(keyword, "gi"), "").trim();
  });
  
  // ✅ إزالة كلمات البحث عن العروض
  offerKeywords.forEach(keyword => {
    cleanQuery = cleanQuery.replace(new RegExp(keyword, "gi"), "").trim();
  });
  
  // ✅ تحديد نوع البحث
  let type: "product" | "store" | "category" | "general" = "general";
  
  if (isStoreSearch) {
    type = "store";
  } else if (isCategorySearch) {
    type = "category";
  } else if (isOfferSearch) {
    type = "product";
  }
  
  return {
    type,
    query: cleanQuery || text,
    filters: {
      isOffer: isOfferSearch || undefined,
    }
  };
}

// ✅ الكلمات المفتاحية العربية للبحث الصوتي
export const voiceSearchKeywords = {
  ar: {
    store: ["متجر", "بائع", "محل", "مؤسسة", "شركة", "سوبرماركت"],
    category: ["تصنيف", "قسم", "فئة", "نوع"],
    offer: ["عرض", "خصم", "تخفيض", "صفقة", "كوبون", "كود"],
    help: ["مساعدة", "كيف", "طريقة", "شرح"],
    cart: ["سلة", "عربة", "شراء"],
    orders: ["طلبات", "شحن", "توصيل"],
  },
  en: {
    store: ["store", "seller", "shop", "company", "supermarket"],
    category: ["category", "section", "type", "kind"],
    offer: ["offer", "discount", "sale", "deal", "coupon", "code"],
    help: ["help", "how", "method", "explain"],
    cart: ["cart", "basket", "buy"],
    orders: ["orders", "shipping", "delivery"],
  }
};

// ✅ دالة التعرف على الأوامر الصوتية
export function detectVoiceCommand(text: string, lang: "ar" | "en" = "ar"): {
  command: "search" | "store" | "category" | "offer" | "cart" | "orders" | "help" | "unknown";
  query: string;
} {
  const lower = text.toLowerCase().trim();
  const keywords = lang === "ar" ? voiceSearchKeywords.ar : voiceSearchKeywords.en;
  
  // ✅ التحقق من الأوامر
  if (keywords.cart.some(k => lower.includes(k))) {
    return { command: "cart", query: "" };
  }
  
  if (keywords.orders.some(k => lower.includes(k))) {
    return { command: "orders", query: "" };
  }
  
  if (keywords.help.some(k => lower.includes(k))) {
    return { command: "help", query: "" };
  }
  
  if (keywords.store.some(k => lower.includes(k))) {
    const clean = keywords.store.reduce((acc, kw) => acc.replace(new RegExp(kw, "gi"), ""), text).trim();
    return { command: "store", query: clean || "all" };
  }
  
  if (keywords.category.some(k => lower.includes(k))) {
    const clean = keywords.category.reduce((acc, kw) => acc.replace(new RegExp(kw, "gi"), ""), text).trim();
    return { command: "category", query: clean || "all" };
  }
  
  if (keywords.offer.some(k => lower.includes(k))) {
    const clean = keywords.offer.reduce((acc, kw) => acc.replace(new RegExp(kw, "gi"), ""), text).trim();
    return { command: "offer", query: clean || "all" };
  }
  
  // ✅ البحث العادي
  return { command: "search", query: text };
}

export default {
  parseVoiceQuery,
  detectVoiceCommand,
  voiceSearchKeywords,
};