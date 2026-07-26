// UI-only visual metadata for categories, keyed by DB slug.
// All listings/reviews/messages now come from Supabase — no mock listings here.

export type CategoryUI = {
  slug: string;
  ar: string;
  en: string;
  icon: string;
  color: string;
  image: string;
};

// All hero overlays share a system-blue gradient to keep the brand consistent;
// only the underlying photo changes per category.
const BLUE = "from-primary via-primary/70 to-primary-glow";

export const categoryUI: CategoryUI[] = [
  { slug: "offers",      ar: "عروض",             en: "Offers",          icon: "BadgePercent", color: BLUE, image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1600&q=80" },
  { slug: "fashion",     ar: "أزياء",            en: "Fashion",         icon: "Shirt",        color: BLUE, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80" },
  { slug: "electronics", ar: "إلكترونيات",       en: "Electronics",     icon: "Smartphone",   color: BLUE, image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1600&q=80" },
  { slug: "shopping",    ar: "تسوق",             en: "Shopping",        icon: "ShoppingBag",  color: BLUE, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80" },
  { slug: "home",        ar: "منزل ومطبخ",       en: "Home & Kitchen",  icon: "Home",         color: BLUE, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" },
  { slug: "clothing",    ar: "ألبسة",            en: "Clothing",        icon: "Shirt",        color: BLUE, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" },
  { slug: "shoes",       ar: "أحذية",            en: "Shoes",           icon: "Footprints",   color: BLUE, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80" },
  { slug: "craftsmen",   ar: "حرفيون",           en: "Craftsmen",       icon: "Hammer",       color: BLUE, image: "https://images.unsplash.com/photo-1581092919535-88f27a29ff0d?auto=format&fit=crop&w=1600&q=80" },
  { slug: "accessories", ar: "إكسسوارات",        en: "Accessories",     icon: "Watch",        color: BLUE, image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1600&q=80" },
  { slug: "beauty",      ar: "مستحضرات تجميل",   en: "Beauty",          icon: "Sparkles",     color: BLUE, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80" },
  { slug: "health",      ar: "صحة وطب",          en: "Health",          icon: "Stethoscope",  color: BLUE, image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80" },
  { slug: "gifts",       ar: "هدايا",            en: "Gifts",           icon: "Gift",         color: BLUE, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80" },
  { slug: "flowers",     ar: "زهور",             en: "Flowers",         icon: "Flower2",      color: BLUE, image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1600&q=80" },
  { slug: "books-music", ar: "كتب وموسيقى",      en: "Books & Music",   icon: "BookOpen",     color: BLUE, image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80" },
  { slug: "sports",      ar: "رياضة",            en: "Sports",          icon: "Dumbbell",     color: BLUE, image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80" },
  { slug: "toys",        ar: "ألعاب",            en: "Toys",            icon: "Gamepad2",     color: BLUE, image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1600&q=80" },
  { slug: "handmade",    ar: "حرف يدوية",        en: "Handmade",        icon: "Palette",      color: BLUE, image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1600&q=80" },
  { slug: "services",    ar: "خدمات",            en: "Services",        icon: "Wrench",       color: BLUE, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80" },
  { slug: "food",        ar: "طعام",             en: "Food",            icon: "Utensils",     color: BLUE, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" },
];


export function getCategoryUI(slug: string | null | undefined): CategoryUI | undefined {
  if (!slug) return undefined;
  return categoryUI.find((c) => c.slug === slug);
}

// Dashboard charts (visual demo data only — real KPIs come from listings/orders)
export const chartRevenue = [
  { m: "Jan", v: 12 }, { m: "Feb", v: 18 }, { m: "Mar", v: 22 },
  { m: "Apr", v: 27 }, { m: "May", v: 31 }, { m: "Jun", v: 29 },
  { m: "Jul", v: 34 }, { m: "Aug", v: 38 }, { m: "Sep", v: 42 },
  { m: "Oct", v: 47 }, { m: "Nov", v: 52 }, { m: "Dec", v: 58 },
];

export const chartCategory = [
  { name: "Fashion", value: 42 },
  { name: "Electronics", value: 31 },
  { name: "Home", value: 24 },
  { name: "Beauty", value: 18 },
  { name: "Sports", value: 22 },
  { name: "Food", value: 15 },
];

// Back-compat aliases (some pages still import these names)
export const categories = categoryUI.map((c) => ({ id: c.slug, ar: c.ar, en: c.en, icon: c.icon, color: c.color, image: c.image, sub: [] as { id: string; ar: string; en: string }[] }));

export const governorates = [
  { id: "damascus", ar: "دمشق", en: "Damascus" },
  { id: "rif-dimashq", ar: "ريف دمشق", en: "Rural Damascus" },
  { id: "aleppo", ar: "حلب", en: "Aleppo" },
  { id: "homs", ar: "حمص", en: "Homs" },
  { id: "hama", ar: "حماة", en: "Hama" },
  { id: "latakia", ar: "اللاذقية", en: "Latakia" },
  { id: "tartus", ar: "طرطوس", en: "Tartus" },
  { id: "idlib", ar: "إدلب", en: "Idlib" },
  { id: "daraa", ar: "درعا", en: "Daraa" },
  { id: "sweida", ar: "السويداء", en: "As Suwayda" },
  { id: "raqqa", ar: "الرقة", en: "Raqqa" },
  { id: "deir-ez-zor", ar: "دير الزور", en: "Deir ez-Zor" },
  { id: "hasakah", ar: "الحسكة", en: "Hasakah" },
] as const;

// Demo AI insights (visual only)
export const aiInsights = [
  { period_ar: "آخر 30 يوم", period_en: "Last 30 days", trend: "up" as const, change: "+34%", title_ar: "نمو الأزياء", title_en: "Fashion growth" },
  { period_ar: "آخر 7 أيام", period_en: "Last 7 days", trend: "up" as const, change: "+22%", title_ar: "طلب الإلكترونيات", title_en: "Electronics demand" },
  { period_ar: "آخر 30 يوم", period_en: "Last 30 days", trend: "up" as const, change: "+18%", title_ar: "المنزل والمطبخ", title_en: "Home & Kitchen" },
  { period_ar: "آخر 30 يوم", period_en: "Last 30 days", trend: "up" as const, change: "-4%", title_ar: "الكتب", title_en: "Books" },
];

// Demo dashboard orders
export type DemoOrder = { id: string; customer_ar: string; customer_en: string; item_ar: string; item_en: string; total: number; status: string };
export const orders: DemoOrder[] = [
  { id: "#1042", customer_ar: "أحمد المصري", customer_en: "Ahmad Al Masri", item_ar: "سماعة لاسلكية", item_en: "Wireless headphones", total: 350000, status: "pending" },
  { id: "#1041", customer_ar: "ليلى حداد", customer_en: "Layla Haddad", item_ar: "فستان صيفي", item_en: "Summer dress", total: 180000, status: "accepted" },
  { id: "#1040", customer_ar: "خالد عساف", customer_en: "Khaled Assaf", item_ar: "طلب مطعم", item_en: "Restaurant order", total: 120000, status: "completed" },
  { id: "#1039", customer_ar: "رنا سليم", customer_en: "Rana Salim", item_ar: "أحذية رياضية", item_en: "Sneakers", total: 220000, status: "completed" },
  { id: "#1038", customer_ar: "سامر جابر", customer_en: "Samer Jaber", item_ar: "لعبة أطفال", item_en: "Kids toy", total: 90000, status: "rejected" },
];
