// src/lib/i18n.tsx
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Lang = "ar" | "en";
export type Currency = "SYP" | "USD" | "EUR" | "TRY";

type Dict = Record<string, { ar: string; en: string }>;

export const t_dict: Dict = {
  brand: { ar: "السوق لعندك", en: "AlSouq Leindak" },
  tagline: { ar: "السوق لعندك - كل شي بتحتاجه بلحظتها", en: "AlSouq Leindak - Everything you need, instantly" },
  search_placeholder: { ar: "ابحث عن متجر أو منتج...", en: "Search stores or products..." },
  home: { ar: "الرئيسية", en: "Home" },
  categories: { ar: "الأقسام", en: "Categories" },
  nearby: { ar: "قريب مني", en: "Nearby" },
  offers: { ar: "العروض", en: "Offers" },
  favorites: { ar: "المفضلة", en: "Favorites" },
  cart: { ar: "السلة", en: "Cart" },
  messages: { ar: "الرسائل", en: "Messages" },
  login: { ar: "تسجيل الدخول", en: "Login" },
  register: { ar: "إنشاء حساب", en: "Register" },
  logout: { ar: "خروج", en: "Logout" },
  profile: { ar: "الملف الشخصي", en: "Profile" },
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  store_dashboard: { ar: "لوحة التحكم بمتجرك", en: "Your store dashboard" },
  ai_insights: { ar: "سوقي AI", en: "Souqi AI" },
  reports: { ar: "التقارير", en: "Reports" },
  list_business: { ar: "اشترك معنا كبائع", en: "Join as a seller" },
  all_governorates: { ar: "كل المحافظات", en: "All Governorates" },
  hero_title: { ar: "كل ما تحتاجه في سوريا، بمكان واحد", en: "Everything you need in Syria, in one place" },
  hero_sub: { ar: "تسوّق، احجز، اكتشف — من المتاجر والمطاعم إلى العقارات والخدمات.", en: "Shop, book, and discover — from stores and restaurants to real estate and services." },
  explore: { ar: "استكشف", en: "Explore" },
  popular_categories: { ar: "أقسام رائجة", en: "Popular Categories" },
  featured_stores: { ar: "متاجر مميزة", en: "Featured Stores" },
  top_rated: { ar: "الأعلى تقييماً", en: "Top Rated" },
  new_listings: { ar: "أحدث الإعلانات", en: "New Listings" },
  customer_reviews: { ar: "آراء العملاء", en: "Customer Reviews" },
  view_all: { ar: "عرض الكل", en: "View all" },
  book_now: { ar: "احجز الآن", en: "Book now" },
  order_now: { ar: "اطلب الآن", en: "Order now" },
  contact: { ar: "تواصل", en: "Contact" },
  call: { ar: "اتصال", en: "Call" },
  whatsapp: { ar: "واتساب", en: "WhatsApp" },
  message: { ar: "مراسلة", en: "Message" },
  location: { ar: "الموقع", en: "Location" },
  reviews: { ar: "التقييمات", en: "Reviews" },
  gallery: { ar: "المعرض", en: "Gallery" },
  services: { ar: "الخدمات", en: "Services" },
  products: { ar: "المنتجات", en: "Products" },
  working_hours: { ar: "أوقات العمل", en: "Working hours" },
  description: { ar: "الوصف", en: "Description" },
  price: { ar: "السعر", en: "Price" },
  rating: { ar: "التقييم", en: "Rating" },
  filters: { ar: "الفلاتر", en: "Filters" },
  sort: { ar: "ترتيب", en: "Sort" },
  most_popular: { ar: "الأكثر شعبية", en: "Most popular" },
  highest_rated: { ar: "الأعلى تقييماً", en: "Highest rated" },
  cheapest: { ar: "الأرخص", en: "Cheapest" },
  newest: { ar: "الأحدث", en: "Newest" },
  results: { ar: "نتيجة", en: "results" },
  add_review: { ar: "أضف تقييمك", en: "Add review" },
  submit: { ar: "إرسال", en: "Submit" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  save: { ar: "حفظ", en: "Save" },
  add: { ar: "إضافة", en: "Add" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  view: { ar: "عرض", en: "View" },
  from: { ar: "من", en: "from" },
  per_night: { ar: "/ليلة", en: "/night" },
  available: { ar: "متاح", en: "Available" },
  orders: { ar: "الطلبات", en: "Orders" },
  bookings: { ar: "الحجوزات", en: "Bookings" },
  customers: { ar: "العملاء", en: "Customers" },
  statistics: { ar: "الإحصائيات", en: "Statistics" },
  settings: { ar: "الإعدادات", en: "Settings" },
  overview: { ar: "نظرة عامة", en: "Overview" },
  revenue: { ar: "الإيرادات", en: "Revenue" },
  total_orders: { ar: "إجمالي الطلبات", en: "Total orders" },
  new_customers: { ar: "عملاء جدد", en: "New customers" },
  conversion: { ar: "التحويل", en: "Conversion" },
  pending: { ar: "قيد الانتظار", en: "Pending" },
  accepted: { ar: "مقبول", en: "Accepted" },
  rejected: { ar: "مرفوض", en: "Rejected" },
  completed: { ar: "مكتمل", en: "Completed" },
  cancelled: { ar: "ملغى", en: "Cancelled" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  name: { ar: "الاسم", en: "Name" },
  phone: { ar: "الهاتف", en: "Phone" },
  forgot_password: { ar: "نسيت كلمة المرور؟", en: "Forgot password?" },
  no_account: { ar: "لا تملك حساباً؟", en: "Don't have an account?" },
  have_account: { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
  send_message: { ar: "أرسل رسالة", en: "Send message" },
  type_message: { ar: "اكتب رسالتك...", en: "Type your message..." },
  chat: { ar: "المحادثة", en: "Chat" },
  ai_desc: { ar: "رؤى ذكية عن السوق السوري", en: "Smart insights into the Syrian market" },
  become_seller: { ar: "أصبح بائعاً", en: "Become a seller" },
  store_name: { ar: "اسم المتجر", en: "Store name" },
  store_description: { ar: "وصف المتجر", en: "Store description" },
  store_phone: { ar: "رقم المتجر", en: "Store phone" },
  full_name: { ar: "الاسم الكامل", en: "Full name" },
  continue_as_guest: { ar: "المتابعة كزائر", en: "Continue as guest" },
  sign_in_required: { ar: "يجب تسجيل الدخول للمتابعة", en: "Please sign in to continue" },
  products_tab: { ar: "المنتجات", en: "Products" },
  stores_tab: { ar: "المتاجر", en: "Stores" },
  visit_store: { ar: "زيارة المتجر", en: "Visit store" },
  banners: { ar: "الإعلانات", en: "Banners" },
  banner_title: { ar: "العنوان", en: "Title" },
  banner_subtitle: { ar: "العنوان الفرعي", en: "Subtitle" },
  banner_image: { ar: "رابط الصورة", en: "Image URL" },
  banner_link: { ar: "رابط الوجهة", en: "Link URL" },
  active: { ar: "فعّال", en: "Active" },
  admin_panel: { ar: "لوحة الأدمن", en: "Admin panel" },
  become_seller_desc: { ar: "أنشئ متجرك وابدأ البيع الآن", en: "Set up your store and start selling" },
  add_to_cart: { ar: "أضف للسلة", en: "Add to cart" },
  more: { ar: "المزيد", en: "More" },
};

export function useT() {
  const { lang } = useApp();
  return (k: keyof typeof t_dict) => t_dict[k]?.[lang] ?? String(k);
}

type AppState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  cart: { id: string; qty: number; item?: any }[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  user: { 
    id: string; 
    name: string; 
    email: string; 
    avatar_url?: string | null;
    phone?: string | null;
  } | null;
  roles: string[];
  authLoading: boolean;
  logout: () => Promise<void>;
  // ✅ NEW: دالة لتحديث بيانات المستخدم
  updateUser: (data: Partial<{ name: string; email: string; avatar_url: string | null; phone: string | null }>) => void;
};

const AppCtx = createContext<AppState | null>(null);

const rates: Record<Currency, number> = { SYP: 1, USD: 1 / 13000, EUR: 1 / 14000, TRY: 1 / 400 };
const symbols: Record<Currency, string> = { SYP: "ل.س", USD: "$", EUR: "€", TRY: "₺" };

export function formatPrice(sypAmount: number, currency: Currency, lang: Lang) {
  const val = sypAmount * rates[currency];
  const locale = lang === "ar" ? "ar-SY" : "en-US";
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: currency === "SYP" ? 0 : 2,
  }).format(val);
  return currency === "SYP" ? `${formatted} ${symbols[currency]}` : `${symbols[currency]}${formatted}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/" });
  const [lang, setLangState] = useState<Lang>("ar");
  const [currency, setCurrency] = useState<Currency>("SYP");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; qty: number; item?: any }[]>([]);
  const [user, setUser] = useState<AppState["user"]>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ تحميل البيانات من localStorage فقط على العميل (متصفح)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') as Lang | null;
      if (savedLang && ['ar', 'en'].includes(savedLang)) {
        setLangState(savedLang);
      }
      
      const savedCurrency = localStorage.getItem('currency') as Currency | null;
      if (savedCurrency && ['SYP', 'USD', 'EUR', 'TRY'].includes(savedCurrency)) {
        setCurrency(savedCurrency);
      }
      
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
      
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch (e) {}
      }
      
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  // ✅ حفظ اللغة عند تغييرها
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }, [lang]);

  // ✅ حفظ العملة عند تغييرها
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency);
    }
  }, [currency]);

  // ✅ حفظ الثيم عند تغييره
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // ✅ حفظ المفضلة عند تغييرها
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // ✅ حفظ السلة عند تغييرها
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // ✅ تأثير اللغة على HTML
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // ✅ تأثير الثيم على HTML
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // ✅ دالة تحديث المستخدم (NEW)
  const updateUser = useCallback((data: Partial<{ name: string; email: string; avatar_url: string | null; phone: string | null }>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      
      // ✅ تحديث localStorage
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('app_user') || '{}');
          localStorage.setItem('app_user', JSON.stringify({
            ...stored,
            ...data,
          }));
        } catch (e) {}
      }
      
      return updated;
    });
  }, []);

  // ✅ جلب بيانات المستخدم
  useEffect(() => {
    async function hydrate(u: User | null) {
      if (!u) { 
        setUser(null); 
        setRoles([]); 
        setAuthLoading(false); 
        return; 
      }
      
      // ✅ جلب profile و roles معاً (Parallel loading)
      const [{ data: profile }, { data: rolesData }] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url, phone").eq("id", u.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.id),
      ]);
      
      // ✅ تعيين البيانات دفعة واحدة
      setUser({
        id: u.id,
        email: u.email ?? "",
        name: profile?.full_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "User",
        avatar_url: profile?.avatar_url ?? null,
        phone: profile?.phone ?? null,
      });
      setRoles((rolesData ?? []).map((r) => r.role as string));
      setAuthLoading(false);
    }
    
    // ✅ جلسة المستخدم مع تحميل فوري
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        hydrate(data.session.user);
      } else {
        setAuthLoading(false);
      }
    });
    
    // ✅ مراقبة تغييرات المصادقة
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        hydrate(session.user);
      } else {
        setUser(null);
        setRoles([]);
        setAuthLoading(false);
      }
    });
    
    return () => sub.subscription.unsubscribe();
  }, []);

  // ✅ دوال السلة والمفضلة
  const addToCart = (item: any) => {
    if (!item) return;
    setCart((c) => {
      const ex = c.find((x) => x.id === item.id);
      if (ex) {
        return c.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1, item } : x));
      }
      return [...c, { id: item.id, qty: 1, item }];
    });
  };

  const removeFromCart = (id: string) => {
    if (!id) return;
    setCart((c) => c.filter((x) => x.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  // ✅ قيمة الـ Context
  const value: AppState = {
    lang,
    setLang: setLangState,
    currency,
    setCurrency,
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    favorites,
    toggleFavorite,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    user,
    roles,
    authLoading,
    logout: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      setUser(null);
      setRoles([]);
      setFavorites([]);
      setCart([]);
      navigate({ to: "/auth/$mode", params: { mode: "login" }, replace: true });
    },
    // ✅ NEW: دالة تحديث المستخدم
    updateUser,
  };
  
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}