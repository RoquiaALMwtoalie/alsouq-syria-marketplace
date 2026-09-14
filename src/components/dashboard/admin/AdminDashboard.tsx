// src/components/dashboard/admin/AdminDashboard.tsx - الأزرار زيتي فقط

import { useState, useMemo, useEffect, useCallback } from "react";
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

// ============================================================
// 🎨 ZOOQ BRAND COLORS - زيتي فقط
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  oliveGlow: 'rgba(42,101,95,0.2)',
  oliveGlowStrong: 'rgba(42,101,95,0.35)',
};

// ✅ تعريف الأيقونات - زيتي فقط
const NAV_ICONS: Record<string, { 
  icon: any; 
  animation: string;
  color: string;
}> = {
  overview: {
    icon: LayoutDashboard,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
  listings: {
    icon: Package,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  stores: {
    icon: Store,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  delivery: {
    icon: Truck,
    animation: "animate-bounce-slow",
    color: "text-[#2a655f]"
  },
  promo: {
    icon: Tag,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  complaints: {
    icon: AlertTriangle,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  applications: {
    icon: ShieldCheck,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
  banners: {
    icon: ImageIcon,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  announcements: {
    icon: Megaphone,
    animation: "animate-bounce-slow",
    color: "text-[#2a655f]"
  },
  categories: {
    icon: Tags,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  notifications: {
    icon: Bell,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
};

// ✅ مؤشرات حيوية متحركة - زيتية
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a655f] opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,0.8)]" />
  </span>
);

// ✅ ===== سلايدر النظام - زيتي فقط - محسّن للموبايل - بدون badge و stat =====
const SystemSlider = ({ isRTL }: { isRTL: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const totalSlides = 5;

  const slides = [
    {
      id: 1,
      icon: "🏛️",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "نظام إدارة السوق الذكي",
      subtitle_en: "Smart Marketplace Management System",
      desc_ar: "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام",
      desc_en: "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment",
    },
    {
      id: 2,
      icon: "🛡️",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "أمان وحماية متكاملة",
      subtitle_en: "Complete Security & Protection",
      desc_ar: "نظام حماية المشتري والبائع مع توثيق الهوية ومراقبة الطلبات لحماية جميع الأطراف",
      desc_en: "Buyer and seller protection system with identity verification and order monitoring",
    },
    {
      id: 3,
      icon: "📊",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "تحليلات وتقارير فورية",
      subtitle_en: "Real-time Analytics & Reports",
      desc_ar: "لوحة تحكم متقدمة تعرض مؤشرات الأداء والإحصائيات لحظياً لاتخاذ قرارات ذكية",
      desc_en: "Advanced dashboard displaying real-time KPIs and statistics for smart decision making",
    },
    {
      id: 4,
      icon: "🚀",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "توصيل ذكي ومتكامل",
      subtitle_en: "Smart Integrated Delivery",
      desc_ar: "نظام توصيل متطور يدعم شركات متعددة وتتبع الطلبات في الوقت الفعلي",
      desc_en: "Advanced delivery system supporting multiple companies and real-time order tracking",
    },
    {
      id: 5,
      icon: "💎",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "تجربة مستخدم فريدة",
      subtitle_en: "Unique User Experience",
      desc_ar: "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية",
      desc_en: "Modern, responsive user interfaces with full Arabic and English language support",
    },
  ];

  // ✅ Auto-play للسلايدر
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const current = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] shadow-xl shadow-[#2a655f]/20 border-2 border-[#2a655f]/30 group min-h-[100px] sm:min-h-[100px] md:min-h-[105px]">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>
      
      <div className="absolute -top-20 -right-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse delay-1000" />
      
      <div className="relative px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 flex items-center gap-2.5 sm:gap-3 md:gap-3.5 z-10">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg shadow-[#2a655f]/20 animate-float group-hover:scale-110 transition-transform duration-500">
              {current.icon}
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2a655f]/30 to-[#3a8a82]/30 blur-lg animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-right w-full min-w-0">
          <h1 className={`text-sm sm:text-sm md:text-lg font-bold text-white mb-0.5 tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.title_ar : current.title_en}
          </h1>
          <h2 className={`text-xs sm:text-xs md:text-base font-bold text-[#e8f0ee] mb-0.5 tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.subtitle_ar : current.subtitle_en}
          </h2>
          <p className={`text-[10px] sm:text-[11px] md:text-xs text-[#e8f0ee]/80 max-w-2xl leading-relaxed hidden sm:block ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.desc_ar : current.desc_en}
          </p>
        </div>
        
        {/* ✅ أزرار التنقل */}
        <div className="flex-shrink-0 flex flex-row sm:flex-col gap-1.5 sm:gap-1.5">
          <button
            onClick={prevSlide}
            className="h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" />
          </button>
          <button
            onClick={nextSlide}
            className="h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" />
          </button>
        </div>
      </div>
      
      {/* ✅ المؤشرات (dots) */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              currentSlide === index
                ? "w-4 bg-white shadow-lg shadow-white/30"
                : "w-1 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
        <span className="text-[7px] text-white/60 ml-1 font-mono font-bold">
          {currentSlide + 1}/{totalSlides}
        </span>
      </div>
      
      <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

export function AdminDashboard({ notificationButton }: AdminDashboardProps) {
  const app = useApp();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<
    "overview" | "listings" | "stores" | "delivery" | "promo" | "complaints" | "applications" | "banners" | "announcements" | "categories" | "notifications"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ منع المتصفح من تذكر موضع التمرير
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // ✅ منع التمرير غير المرغوب عند تغيير التاب
  useEffect(() => {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [tab]);

  // ✅ دالة تغيير التاب مع تحديث الـ URL - بدون تمرير
  const handleTabChange = useCallback((newTab: any) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    if (newTab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', newTab);
    }
    window.history.pushState({}, '', url.toString());
  }, []);

  // ✅ قراءة التاب من الـ URL عند تحميل الصفحة
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
        setTab(tabFromUrl as any);
      }
    }
  }, []);

  // ✅ الاستماع لتغيرات الـ URL - بدون تمرير
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl) {
        const validTabs = [
          "overview", "listings", "stores", "delivery", 
          "promo", "complaints", "applications", "banners", 
          "announcements", "categories", "notifications"
        ];
        if (validTabs.includes(tabFromUrl)) {
          setTab(tabFromUrl as any);
        }
      } else {
        setTab('overview');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
        handleTabChange(bestTab.tab);
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
    <div className={`min-h-screen bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-lg shadow-[#2a655f]/10">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" />
        
        <div className="mx-auto max-w-7xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className={`flex items-center gap-2 sm:gap-4 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative shrink-0">
                <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2a655f]/20 to-transparent animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-[#2a655f] dark:text-[#3a8a82] text-sm sm:text-lg group-hover:text-[#3a8a82] transition-colors truncate">
                    {app.lang === 'ar' ? "لوحة الأدمن" : "Admin Panel"}
                  </span>
                  <Badge className="text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 bg-[#2a655f]/20 text-[#2a655f] dark:text-[#2a655f] border-0 animate-pulse shrink-0">
                    🟢 {app.lang === "ar" ? "نشط" : "Active"}
                  </Badge>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#2a655f] dark:text-[#3a8a82] -mt-0.5 font-semibold truncate">
                  {app.lang === 'ar' ? 'تحكم كامل في المنصة' : 'Full Platform Control'}
                </p>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 sm:gap-3 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 border-2 border-[#2a655f]/20">
              <Clock className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{formattedTime}</span>
              <LiveIndicator />
            </div>

            <div className="relative hidden md:block group">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f] transition-colors duration-300 group-focus-within:text-[#2a655f]`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 focus:bg-white dark:focus:bg-slate-800/50 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-[#2a655f]/20`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[#2a655f] hover:text-[#3a8a82] transition-colors duration-200`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {notificationButton}
            
            {/* ✅ صورة الأدمن مع الاسم */}
            <div className="relative group flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {app.user?.name || 'Admin'}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#2a655f] dark:text-[#3a8a82] font-semibold">
                  {app.lang === 'ar' ? 'مدير النظام' : 'System Administrator'}
                </span>
              </div>
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-[#2a655f]/40 group-hover:ring-[#2a655f]/60 transition-all duration-300 group-hover:scale-105 cursor-pointer shrink-0">
                {app.user?.avatar_url ? (
                  <AvatarImage src={app.user.avatar_url} alt={app.user.name || 'Admin'} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs sm:text-sm font-bold">
                    {app.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#2a655f] border-2 border-white dark:border-slate-900 animate-pulse shadow-[0_0_12px_rgba(42,101,95,0.8)]" />
            </div>
          </div>
        </div>
      </header>

      {/* ===== المحتوى ===== */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 relative z-0">
        
        {/* ✅ ===== سلايدر النظام - زيتي فقط ===== */}
        {!showSearchResults && (
          <div className="mb-4 sm:mb-6">
            <SystemSlider isRTL={isRTL} />
          </div>
        )}

        {/* ===== عرض نتائج البحث ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-4 sm:mb-6 animate-in slide-in-from-top-5 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {[
                { key: 'listings', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package },
                { key: 'stores', label: app.lang === 'ar' ? 'المتاجر' : 'Stores', count: searchResults.stores, icon: Store },
                { key: 'applications', label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications', count: searchResults.applications, icon: ShieldCheck },
              ].map((item) => {
                const isActive = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleTabChange(item.key as any);
                      setShowSearchResultsPage(false);
                    }}
                    className={`bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-2.5 sm:p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${isActive ? 'ring-2 ring-[#2a655f] border-[#2a655f] shadow-lg shadow-[#2a655f]/20' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-[#2a655f]/20 shrink-0`}>
                        <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-[#2a655f]' : 'text-[#2a655f]'}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{item.label}</p>
                        <p className="text-base sm:text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]">{item.count}</p>
                      </div>
                    </div>
                    {item.count > 0 && (
                      <div className="mt-1 text-[9px] sm:text-[10px] text-[#2a655f] font-medium hover:underline transition-all">
                        {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {searchResults.total === 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-8 sm:p-12 text-center shadow-lg">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="h-8 w-8 sm:h-10 sm:w-10 text-[#2a655f]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.lang === 'ar' ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"`}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                  onClick={clearSearch}
                >
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ===== TABS NAVIGATION - زيتي فقط - محسّن للموبايل ===== */}
        {!showSearchResults && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-xl shadow-[#2a655f]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" />
              
              {/* ✅ Desktop Tabs - زيتي فقط */}
              <div className="hidden md:flex items-center p-1.5 gap-1.5 overflow-x-auto">
                {nav.map((n) => {
                  const iconConfig = getIconConfig(n.iconKey);
                  const Icon = iconConfig.icon;
                  const isActive = tab === n.id;
                  
                  return (
                    <button
                      key={n.id}
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTabChange(n.id);
                      }}
                      className={`
                        relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 whitespace-nowrap flex-1 text-center justify-center group
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-xl shadow-[#2a655f]/40 scale-[1.03] border-2 border-[#2a655f]/50' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 hover:text-[#2a655f] dark:hover:text-[#2a655f]'
                        }
                      `}
                    >
                      <div className={`relative transition-all duration-500 ${isActive ? 'scale-110 animate-pulse' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                        <Icon 
                          className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#2a655f] group-hover:text-[#2a655f]'}`}
                        />
                        {isActive && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white/60 animate-ping" />
                        )}
                      </div>
                      <span className={`font-bold ${isActive ? 'text-white' : 'group-hover:text-[#2a655f]'}`}>
                        {n.label}
                      </span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ✅ Mobile Tabs - أفقي قابل للسحب مع scroll snap */}
              <div className="md:hidden p-2.5">
                <div 
                  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {nav.map((n) => {
                    const iconConfig = getIconConfig(n.iconKey);
                    const Icon = iconConfig.icon;
                    const isActive = tab === n.id;
                    
                    return (
                      <button
                        key={n.id}
                        type="button"
                        tabIndex={-1}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleTabChange(n.id);
                        }}
                        className={`
                          relative flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl 
                          text-[10px] font-bold transition-all duration-300 shrink-0 min-w-[85px] snap-start
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/40 border-2 border-[#2a655f]/50 scale-[1.02]' 
                            : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20'
                          }
                        `}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-[#2a655f]'}`} />
                        <span className="leading-tight text-center whitespace-nowrap">
                          {n.label}
                        </span>
                        {isActive && (
                          <span className="absolute -bottom-0.5 h-1 w-6 rounded-full bg-white/70 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* ✅ مؤشر بصري إنه في scroll */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-[8px] text-[#2a655f]/60 font-semibold">
                    {app.lang === 'ar' ? 'اسحب للمزيد' : 'Swipe for more'}
                  </span>
                  <ChevronLeft className="h-3 w-3 text-[#2a655f]/60 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== المحتوى ===== */}
        <div className="relative z-0">
          {tab === "overview" && <AdminOverview onGoto={handleTabChange} searchQuery={showSearchResults ? searchQuery : ""} />}
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
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t-2 border-[#2a655f]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <span className="text-[#2a655f] dark:text-[#3a8a82] font-medium">{app.lang === 'ar' ? '© 2024 جميع الحقوق محفوظة' : '© 2024 All rights reserved'}</span>
            <span className="h-1 w-1 rounded-full bg-[#2a655f]/50" />
            <span className="flex items-center gap-1 text-[#2a655f] dark:text-[#3a8a82]">
              <LiveIndicator />
              {app.lang === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System operational'}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <span className="text-[#2a655f]">v2.0.0</span>
            <span className="h-1 w-1 rounded-full bg-[#2a655f]/50" />
            <span>{app.lang === 'ar' ? 'مدعوم من' : 'Powered by'} <span className="text-[#2a655f] dark:text-[#3a8a82] font-bold hover:text-[#3a8a82] transition-colors duration-300">Zooq</span></span>
            <Zap className="h-3 w-3 text-[#2a655f] animate-pulse" />
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
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        /* ✅ إخفاء scrollbar للتابات على الموبايل */
        .md\\:hidden .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;