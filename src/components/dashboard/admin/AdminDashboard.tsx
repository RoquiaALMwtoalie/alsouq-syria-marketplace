// src/components/dashboard/admin/AdminDashboard.tsx - الكود المصحح بالكامل

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Store, ShieldCheck, Image as ImageIcon, Megaphone, Tags,
  Search, X, Bell, Truck, Sparkles, TrendingUp, Users, Settings,
  Activity, ArrowUp, ArrowDown, CircleDot, Zap, Clock,
  Rocket, Gem, Crown, Star, Flame, Award, Target, Compass,
  Tag, AlertTriangle, ChevronRight, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp, useT } from "@/lib/i18n";
import {
  useAllListingsAdmin,
  useAdminAllStores,
  useAllSellerApplications,
} from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ===== استيراد المكونات المقسمة =====
import { AdminOverview } from "./AdminOverview";
import { AdminListings } from "./AdminListings";
import { AdminStores } from "./AdminStores";
import { SellerApplicationsAdmin } from "./SellerApplicationsAdmin";
import { BannersAdminPage } from "./BannersAdminPage";
import { AnnouncementsAdmin } from "./AnnouncementsAdmin";
import { CategoriesAdmin } from "./CategoriesAdmin";
import { AdminNotifications } from "./AdminNotifications";
import { AdminDeliveryCompanies } from "./AdminDeliveryCompanies";
import { AdminPromoCodes } from "./AdminPromoCodes";
import { AdminComplaints } from "./AdminComplaints";

interface AdminDashboardProps {
  notificationButton: React.ReactNode;
}

// ✅ تعريف الأيقونات بدون ألوان إضافية (تستخدم لون واحد فقط)
const NAV_ICONS: Record<string, { 
  icon: any; 
  animation: string;
}> = {
  overview: {
    icon: LayoutDashboard,
    animation: "animate-float"
  },
  listings: {
    icon: Package,
    animation: "animate-pulse-slow"
  },
  stores: {
    icon: Store,
    animation: "animate-spin-slow"
  },
  delivery: {
    icon: Truck,
    animation: "animate-bounce-slow"
  },
  promo: {
    icon: Tag,
    animation: "animate-spin-slow"
  },
  complaints: {
    icon: AlertTriangle,
    animation: "animate-pulse-slow"
  },
  applications: {
    icon: ShieldCheck,
    animation: "animate-float"
  },
  banners: {
    icon: ImageIcon,
    animation: "animate-pulse-slow"
  },
  announcements: {
    icon: Megaphone,
    animation: "animate-bounce-slow"
  },
  categories: {
    icon: Tags,
    animation: "animate-spin-slow"
  },
  notifications: {
    icon: Bell,
    animation: "animate-float"
  },
};

// ✅ مؤشرات حيوية متحركة
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
  </span>
);

// ✅ ===== سلايدر النظام مع اسم "السوق لعندك" ثابت =====
const SystemSlider = ({ isRTL }: { isRTL: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: "🏛️",
      title_ar: "السوق لعندك",
      title_en: "Souqi",
      subtitle_ar: "نظام إدارة السوق الذكي",
      subtitle_en: "Smart Marketplace Management System",
      desc_ar: "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام",
      desc_en: "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment",
      gradient: "from-[#0d2e2a] to-[#1a4f4a]",
      image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg",
    },
    {
      icon: "🛡️",
      title_ar: "السوق لعندك",
      title_en: "Souqi",
      subtitle_ar: "أمان وحماية متكاملة",
      subtitle_en: "Complete Security & Protection",
      desc_ar: "نظام حماية المشتري والبائع مع توثيق الهوية ومراقبة الطلبات لحماية جميع الأطراف",
      desc_en: "Buyer and seller protection system with identity verification and order monitoring",
      gradient: "from-[#1a4f4a] to-[#0d2e2a]",
      image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/42430876-ai-generated-8793863_1920.jpg",
    },
    {
      icon: "📊",
      title_ar: "السوق لعندك",
      title_en: "Souqi",
      subtitle_ar: "تحليلات وتقارير فورية",
      subtitle_en: "Real-time Analytics & Reports",
      desc_ar: "لوحة تحكم متقدمة تعرض مؤشرات الأداء والإحصائيات لحظياً لاتخاذ قرارات ذكية",
      desc_en: "Advanced dashboard displaying real-time KPIs and statistics for smart decision making",
      gradient: "from-[#0d2e2a] to-[#2d6b63]",
      image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/mohamed_hassan-systems-icons-3334262_1920.jpg",
    },
    {
      icon: "🚀",
      title_ar: "السوق لعندك",
      title_en: "Souqi",
      subtitle_ar: "توصيل ذكي ومتكامل",
      subtitle_en: "Smart Integrated Delivery",
      desc_ar: "نظام توصيل متطور يدعم شركات متعددة وتتبع الطلبات في الوقت الفعلي",
      desc_en: "Advanced delivery system supporting multiple companies and real-time order tracking",
      gradient: "from-[#2d6b63] to-[#0d2e2a]",
      image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/regencygirl123-present-8440034_1920.jpg",
    },
    {
      icon: "💎",
      title_ar: "السوق لعندك",
      title_en: "Souqi",
      subtitle_ar: "تجربة مستخدم فريدة",
      subtitle_en: "Unique User Experience",
      desc_ar: "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية",
      desc_en: "Modern, responsive user interfaces with full Arabic and English language support",
      gradient: "from-[#0d2e2a] to-[#1a4f4a]",
      image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/gonghuimin468-happy-holidays-3040029_1920.jpg",
    },
  ];

  // ✅ التنقل التلقائي
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] shadow-2xl shadow-[#0d2e2a]/30 border border-emerald-500/20 group min-h-[280px]">
      
      {/* ✅ ✅ ✅ صورة الخلفية (تظهر كاملة مع خلفية) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0d2e2a]">
        <img 
          src={current.image} 
          alt={current.title_ar}
          className="w-full h-full object-contain object-center transition-transform duration-1000 group-hover:scale-105"
        />
      </div>
      
      {/* ✅ تراكب شفاف عشان النصوص تبقى مقروءة */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/70 to-[#1a4f4a]/50 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/60 to-transparent" />

      {/* ✅ خلفية متحركة */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>

      {/* ✅ زوايا زخرفية */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse delay-1000" />

      {/* ✅ المحتوى */}
      <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 z-10">
        
        {/* ✅ الأيقونة الكبيرة */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="h-20 w-20 md:h-28 md:w-28 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl md:text-7xl shadow-2xl shadow-emerald-500/20 animate-float group-hover:scale-110 transition-transform duration-500">
              {current.icon}
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-emerald-500/0 blur-xl animate-pulse" />
          </div>
        </div>

        {/* ✅ النصوص */}
        <div className="flex-1 text-center md:text-right">
          <h1 className={`text-2xl md:text-4xl font-extrabold text-white mb-1 tracking-tight drop-shadow-lg ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.title_ar : current.title_en}
          </h1>
          <h2 className={`text-lg md:text-2xl font-bold text-emerald-300/90 mb-2 tracking-tight drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.subtitle_ar : current.subtitle_en}
          </h2>
          <p className={`text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.desc_ar : current.desc_en}
          </p>
          
          {/* ✅ شارات إضافية */}
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
              ✨ {isRTL ? "منصة متكاملة" : "Integrated Platform"}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 text-xs">
              🚀 {isRTL ? "تحديثات لحظية" : "Real-time Updates"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
              🔒 {isRTL ? "آمن ومحمي" : "Secure & Protected"}
            </span>
          </div>
          
          {/* ✅ نقاط التقدم */}
          <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentSlide === index
                    ? "w-10 bg-emerald-400 shadow-lg shadow-emerald-500/50"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
            <span className="text-[10px] text-white/40 ml-2 font-mono">
              {currentSlide + 1}/{slides.length}
            </span>
          </div>
        </div>

        {/* ✅ أزرار التحكم */}
        <div className="flex-shrink-0 flex flex-row md:flex-col gap-2">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      {/* ✅ شريط سفلي متحرك */}
      <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-shimmer" />
    </div>
  );
};

export function AdminDashboard({ notificationButton }: AdminDashboardProps) {
  const app = useApp();
  const [tab, setTab] = useState<
    "overview" | "listings" | "stores" | "delivery" | "promo" | "complaints" | "applications" | "banners" | "announcements" | "categories" | "notifications"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ ✅ ✅ قراءة التاب من الـ URL عند تحميل الصفحة
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    
    if (tabFromUrl) {
      const validTabs = [
        "overview", "listings", "stores", "delivery", 
        "promo", "complaints", "applications", "banners", 
        "announcements", "categories", "notifications"
      ];
      
      if (validTabs.includes(tabFromUrl)) {
        console.log(`📌 [AdminDashboard] Setting tab from URL: ${tabFromUrl}`);
        setTab(tabFromUrl as any);
      }
    }
  }, []);

  // ✅ تحديث الوقت الحقيقي
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isRTL = app.lang === 'ar';

  // ===== فلترة البيانات حسب البحث =====
  const getFilteredData = (data: any[], searchFields: string[], searchTerm: string) => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase().trim();
    return data.filter((item: any) => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(q);
      });
    });
  };

  // ===== جلب البيانات =====
  const { data: allListings = [] } = useAllListingsAdmin();
  const { data: allStores = [] } = useAdminAllStores();
  const { data: allApplications = [] } = useAllSellerApplications();

  // ===== فلترة المنتجات =====
  const filteredListings = useMemo(() => {
    return getFilteredData(allListings, ['title_ar', 'title_en', 'description_ar', 'description_en', 'id'], searchQuery);
  }, [allListings, searchQuery]);

  // ===== فلترة المتاجر =====
  const filteredStores = useMemo(() => {
    return getFilteredData(allStores, ['store_name', 'store_description', 'full_name', 'email', 'phone'], searchQuery);
  }, [allStores, searchQuery]);

  // ===== فلترة طلبات البائعين =====
  const filteredApplications = useMemo(() => {
    return getFilteredData(allApplications, ['store_name', 'store_description', 'user_id', 'id', 'status'], searchQuery);
  }, [allApplications, searchQuery]);

  // ===== حساب عدد النتائج في كل قسم =====
  const searchResults = useMemo(() => {
    return {
      products: filteredListings.length,
      stores: filteredStores.length,
      applications: filteredApplications.length,
      total: filteredListings.length + filteredStores.length + filteredApplications.length
    };
  }, [filteredListings, filteredStores, filteredApplications]);

  // ===== تحديد التبويب الأنسب للبحث =====
  const getBestTab = () => {
    const results = [
      { tab: 'listings', count: filteredListings.length, label: app.lang === 'ar' ? 'المنتجات' : 'Products' },
      { tab: 'stores', count: filteredStores.length, label: app.lang === 'ar' ? 'المتاجر' : 'Stores' },
      { tab: 'applications', count: filteredApplications.length, label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications' },
    ];
    results.sort((a, b) => b.count - a.count);
    return results[0];
  };

  // ===== دالة البحث =====
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchResultsPage(true);
      const bestTab = getBestTab();
      if (bestTab.count > 0) {
        setTab(bestTab.tab as any);
      }
    }
  };

  // ===== مسح البحث =====
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResultsPage(false);
  };

  // ===== عرض نتائج البحث =====
  const showSearchResults = searchQuery.trim().length > 0 && showSearchResultsPage;

  // ===== قائمة التبويب =====
  const nav = [
    { id: "overview" as const, label: app.lang === 'ar' ? "نظرة عامة" : "Overview", iconKey: "overview" },
    { id: "listings" as const, label: app.lang === 'ar' ? "المنتجات" : "Products", iconKey: "listings" },
    { id: "stores" as const, label: app.lang === 'ar' ? "المتاجر" : "Stores", iconKey: "stores" },
    { id: "delivery" as const, label: app.lang === 'ar' ? "شركات التوصيل" : "Delivery Companies", iconKey: "delivery" },
    { id: "promo" as const, label: app.lang === 'ar' ? "أكواد الخصم" : "Promo Codes", iconKey: "promo" },
    { id: "complaints" as const, label: app.lang === 'ar' ? "الشكاوى" : "Complaints", iconKey: "complaints" },
    { id: "applications" as const, label: app.lang === 'ar' ? "طلبات البائعين" : "Seller applications", iconKey: "applications" },
    { id: "banners" as const, label: app.lang === 'ar' ? "البنرات" : "Banners", iconKey: "banners" },
    { id: "announcements" as const, label: app.lang === 'ar' ? "شريط الإعلانات" : "Announcements", iconKey: "announcements" },
    { id: "categories" as const, label: app.lang === 'ar' ? "التصنيفات" : "Categories", iconKey: "categories" },
    { id: "notifications" as const, label: app.lang === 'ar' ? "الإشعارات" : "Notifications", iconKey: "notifications" },
  ];

  // ✅ الحصول على أيقونة التبويب النشط
  const getIconConfig = (iconKey: string) => {
    return NAV_ICONS[iconKey] || NAV_ICONS.overview;
  };

  // ✅ الوقت المنسق
  const formattedTime = currentTime.toLocaleTimeString(app.lang === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 shadow-lg shadow-[#0d2e2a]/5 transition-all duration-300">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#0d2e2a] to-transparent animate-pulse" />
        
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0d2e2a]/50 to-transparent animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                  {app.lang === 'ar' ? "لوحة الأدمن" : "Admin Panel"}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                  {app.lang === 'ar' ? 'تحكم كامل في المنصة' : 'Full Platform Control'}
                </p>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d2e2a]/5 border border-[#0d2e2a]/10">
              <Clock className="h-3.5 w-3.5 text-[#0d2e2a]" />
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{formattedTime}</span>
              <LiveIndicator />
            </div>

            <div className="relative hidden md:block group">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-300 group-focus-within:text-[#0d2e2a]`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 text-sm focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 focus:bg-white dark:focus:bg-slate-800/50 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-[#0d2e2a]/10`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {notificationButton}
            
            {/* ✅ صورة الأدمن مع الاسم */}
            <div className="relative group flex items-center gap-3">
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {app.user?.name || 'Admin'}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">
                  {app.lang === 'ar' ? 'مدير النظام' : 'System Administrator'}
                </span>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-[#0d2e2a]/20 group-hover:ring-[#0d2e2a]/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
                {app.user?.avatar_url ? (
                  <AvatarImage src={app.user.avatar_url} alt={app.user.name || 'Admin'} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white text-sm font-bold">
                    {app.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* ===== المحتوى ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 relative z-0">
        
        {/* ✅ ===== سلايدر النظام (ياخذ مكان عنوان التاب) ===== */}
        <div className="mb-6">
          <SystemSlider isRTL={isRTL} />
        </div>

        {/* ✅ ===== ترحيب صغير تحت السلايدر ===== */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{app.lang === 'ar' ? "مرحباً بعودتك" : "Welcome back"}, {app.user?.name || "Admin"}</span>
              <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
              <span className="text-xs text-[#0d2e2a] dark:text-[#4a9f95] flex items-center gap-1 group cursor-pointer hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-3 w-3 animate-spin-slow" />
                {app.lang === 'ar' ? 'لوحة تحكم ذكية' : 'Smart Dashboard'}
              </span>
            </p>
          </div>
        </div>

        {/* ===== عرض نتائج البحث ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-6 animate-in slide-in-from-top-5 duration-300">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'listings', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package },
                { key: 'stores', label: app.lang === 'ar' ? 'المتاجر' : 'Stores', count: searchResults.stores, icon: Store },
                { key: 'applications', label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications', count: searchResults.applications, icon: ShieldCheck },
              ].map((item) => {
                const isActive = tab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setTab(item.key as any);
                      setShowSearchResultsPage(false);
                    }}
                    className={cn(
                      "group relative overflow-hidden bg-white dark:bg-[#1e293b] rounded-2xl border p-5 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                      isActive 
                        ? "border-[#0d2e2a] shadow-lg shadow-[#0d2e2a]/20 ring-2 ring-[#0d2e2a]/10" 
                        : "border-slate-200/60 dark:border-slate-700/60 hover:border-[#0d2e2a]/30 hover:shadow-md"
                    )}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0d2e2a]/0 via-[#0d2e2a]/5 to-[#0d2e2a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      "bg-gradient-to-br from-[#0d2e2a]/5 to-transparent"
                    )} />
                    <div className="relative flex items-center justify-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                        isActive ? "bg-[#0d2e2a] shadow-lg shadow-[#0d2e2a]/30" : "bg-[#0d2e2a]/10"
                      )}>
                        <item.icon className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "text-white" : "text-[#0d2e2a]"
                        )} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.count}</p>
                      </div>
                    </div>
                    {item.count > 0 && (
                      <div className="relative mt-2 text-xs text-[#0d2e2a] font-medium group-hover:translate-x-1 transition-transform duration-300">
                        {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {searchResults.total === 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30 p-16 text-center">
                <div className="h-24 w-24 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <Search className="h-12 w-12 text-[#0d2e2a]/40" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {app.lang === 'ar' 
                    ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` 
                    : `No results match "${searchQuery}"`}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 rounded-xl border-[#0d2e2a]/30 hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/50 transition-all duration-300 text-[#0d2e2a] hover:scale-105"
                  onClick={clearSearch}
                >
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ===== TABS NAVIGATION ===== */}
        {!showSearchResults && (
          <div className="mb-6 animate-in slide-in-from-top-5 duration-300">
            <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 shadow-xl shadow-[#0d2e2a]/5 overflow-hidden relative">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#0d2e2a] to-transparent animate-shimmer" />
              
              <div className="hidden md:flex items-center p-2 gap-1 overflow-x-auto">
                {nav.map((n) => {
                  const iconConfig = getIconConfig(n.iconKey);
                  const Icon = iconConfig.icon;
                  const isActive = tab === n.id;
                  
                  return (
                    <button
                      key={n.id}
                      onClick={() => setTab(n.id)}
                      className={`
                        group relative flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 text-center justify-center
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30 scale-[1.02]' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/20 hover:text-slate-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                        isActive ? "bg-white/20" : "bg-[#0d2e2a]/10"
                      )}>
                        <Icon 
                          className={cn(
                            "h-4 w-4 transition-all duration-500",
                            isActive ? "text-white" : "text-[#0d2e2a]",
                            iconConfig.animation,
                            "group-hover:scale-110 group-hover:rotate-12"
                          )}
                        />
                      </div>
                      <span className="font-medium">{n.label}</span>
                      {isActive && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full bg-white/60 animate-pulse" />
                      )}
                      {!isActive && (
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0d2e2a]/0 via-[#0d2e2a]/5 to-[#0d2e2a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="md:hidden p-3">
                <div className="grid grid-cols-3 gap-2">
                  {nav.map((n) => {
                    const iconConfig = getIconConfig(n.iconKey);
                    const Icon = iconConfig.icon;
                    const isActive = tab === n.id;
                    
                    return (
                      <button
                        key={n.id}
                        onClick={() => setTab(n.id)}
                        className={`
                          group flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30 scale-[1.02]' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/20'
                          }
                        `}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          isActive ? "bg-white/20" : "bg-[#0d2e2a]/10"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5 transition-all duration-300",
                            isActive ? "text-white" : "text-[#0d2e2a]",
                            iconConfig.animation
                          )} />
                        </div>
                        <span className="text-[9px] leading-tight text-center max-w-full break-words">
                          {n.label}
                        </span>
                        {isActive && (
                          <span className="h-1 w-6 rounded-full bg-white/60 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== المحتوى ===== */}
        <div className="relative z-0">
          {tab === "overview" && <AdminOverview onGoto={setTab} searchQuery={showSearchResults ? searchQuery : ""} />}
          {tab === "listings" && <AdminListings />}
          {tab === "stores" && <AdminStores />}
          {tab === "delivery" && <AdminDeliveryCompanies />}
          {tab === "promo" && <AdminPromoCodes />}
          {tab === "complaints" && <AdminComplaints />}
          {tab === "applications" && <SellerApplicationsAdmin />}
          {tab === "banners" && <BannersAdminPage />}
          {tab === "announcements" && <AnnouncementsAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "notifications" && <AdminNotifications />}
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-12 pt-6 border-t border-[#0d2e2a]/10 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-4">
            <span>{app.lang === 'ar' ? '© 2024 جميع الحقوق محفوظة' : '© 2024 All rights reserved'}</span>
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="flex items-center gap-1">
              <LiveIndicator />
              {app.lang === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System operational'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#0d2e2a]/60">v2.0.0</span>
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span>{app.lang === 'ar' ? 'مدعوم من' : 'Powered by'} <span className="text-[#0d2e2a] font-medium hover:text-[#1a4f4a] transition-colors duration-300">Souqi</span></span>
            <Zap className="h-3 w-3 text-[#0d2e2a] animate-pulse" />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;