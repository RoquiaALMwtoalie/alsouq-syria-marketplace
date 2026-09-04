// src/components/dashboard/admin/AdminDashboard.tsx - الكود الكامل المُصحح (بدون تمرير نهائياً)

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
// 🎨 ZOOQ BRAND COLORS - نفس ألوان SellerDashboard
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  oliveGlow: 'rgba(42,101,95,0.2)',
  oliveGlowStrong: 'rgba(42,101,95,0.35)',
  
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  pinkGlow: 'rgba(249,168,212,0.25)',
  pinkGlowStrong: 'rgba(249,168,212,0.4)',
  
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
  fuchsiaGlow: 'rgba(216,27,96,0.2)',
  fuchsiaGlowStrong: 'rgba(194,24,91,0.35)',
  
  glowOlive: 'rgba(42,101,95,0.15)',
  glowPink: 'rgba(249,168,212,0.2)',
  glowPinkStrong: 'rgba(249,168,212,0.35)',
};

// ✅ تعريف الأيقونات مع ألوان زهرية وزيتية
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
    color: "text-[#f9a8d4]"
  },
  stores: {
    icon: Store,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  delivery: {
    icon: Truck,
    animation: "animate-bounce-slow",
    color: "text-[#f9a8d4]"
  },
  promo: {
    icon: Tag,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  complaints: {
    icon: AlertTriangle,
    animation: "animate-pulse-slow",
    color: "text-[#f9a8d4]"
  },
  applications: {
    icon: ShieldCheck,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
  banners: {
    icon: ImageIcon,
    animation: "animate-pulse-slow",
    color: "text-[#f9a8d4]"
  },
  announcements: {
    icon: Megaphone,
    animation: "animate-bounce-slow",
    color: "text-[#2a655f]"
  },
  categories: {
    icon: Tags,
    animation: "animate-spin-slow",
    color: "text-[#f9a8d4]"
  },
  notifications: {
    icon: Bell,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
};

// ✅ مؤشرات حيوية متحركة - وردية
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f9a8d4] opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,0.8)]" />
  </span>
);

// ✅ ===== سلايدر النظام - نفس تصميم SellerDashboard بدون صور =====
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
      badge_ar: "🏛️ منصة متكاملة",
      badge_en: "🏛️ Integrated Platform",
      stat_ar: "🚀 تحديثات لحظية",
      stat_en: "🚀 Real-time Updates",
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
      badge_ar: "🛡️ حماية متقدمة",
      badge_en: "🛡️ Advanced Security",
      stat_ar: "🔒 آمن ومحمي",
      stat_en: "🔒 Secure & Protected",
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
      badge_ar: "📊 تحليلات لحظية",
      badge_en: "📊 Real-time Analytics",
      stat_ar: "📈 نمو متزايد",
      stat_en: "📈 Growing",
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
      badge_ar: "🚚 توصيل سريع",
      badge_en: "🚚 Fast Delivery",
      stat_ar: "📦 توصيل فوري",
      stat_en: "📦 Instant Delivery",
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
      badge_ar: "✨ تجربة متميزة",
      badge_en: "✨ Premium Experience",
      stat_ar: "⭐ تقييم عالي",
      stat_en: "⭐ High Rating",
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
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#f9a8d4] to-[#fbcfe8] shadow-xl shadow-[#f9a8d4]/20 border-2 border-[#f9a8d4]/40 group min-h-[90px] md:min-h-[105px]">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>
      
      <div className="absolute -top-20 -right-20 h-32 w-32 rounded-full bg-[#f9a8d4]/20 blur-2xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-[#f9a8d4]/20 blur-2xl animate-pulse delay-1000" />
      
      <div className="relative px-3 py-2.5 md:px-5 md:py-3.5 flex flex-col md:flex-row items-center gap-2 md:gap-3.5 z-10">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xl md:text-3xl shadow-lg shadow-[#f9a8d4]/20 animate-float group-hover:scale-110 transition-transform duration-500">
              {current.icon}
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#f9a8d4]/30 to-[#fbcfe8]/30 blur-lg animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-right">
          <h1 className={`text-sm md:text-lg font-bold text-[#2a655f] mb-0.5 tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.title_ar : current.title_en}
          </h1>
          <h2 className={`text-xs md:text-base font-bold text-[#1a4f4a] mb-0.5 tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.subtitle_ar : current.subtitle_en}
          </h2>
          <p className={`text-[10px] md:text-xs text-[#1a4f4a]/80 max-w-2xl leading-relaxed hidden sm:block ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.desc_ar : current.desc_en}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1 justify-center md:justify-start">
            <span className="px-2 py-0.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 text-[#2a655f] text-[9px] font-bold">
              {isRTL ? current.badge_ar : current.badge_en}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#2a655f]/20 backdrop-blur-sm border border-[#2a655f]/30 text-[#2a655f] text-[9px] font-bold">
              {isRTL ? current.stat_ar : current.stat_en}
            </span>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex flex-row md:flex-col gap-1.5">
          <button
            onClick={prevSlide}
            className="h-6 w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={nextSlide}
            className="h-6 w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              currentSlide === index
                ? "w-4 bg-[#2a655f] shadow-lg shadow-[#2a655f]/30"
                : "w-1.5 bg-[#2a655f]/30 hover:bg-[#2a655f]/50"
            )}
          />
        ))}
        <span className="text-[7px] text-[#2a655f]/50 ml-1 font-mono">
          {currentSlide + 1}/{totalSlides}
        </span>
      </div>
      
      <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f]/20 to-transparent" />
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

  // ✅ ✅ ✅ منع التمرير غير المرغوب عند تغيير التاب ✅ ✅ ✅
  useEffect(() => {
    // منع أي عنصر من أخذ الفوكس تلقائياً (مثل Dialog, Input, ImageInput)
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
        console.log(`📌 [AdminDashboard] Setting tab from URL: ${tabFromUrl}`);
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
    <div className={`min-h-screen bg-gradient-to-br from-white via-[#f9a8d4]/5 to-[#2a655f]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#f9a8d4]/5 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#f9a8d4]/30 dark:border-[#2a655f]/30 shadow-lg shadow-[#f9a8d4]/10">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#2a655f] animate-pulse" />
        
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#f9a8d4]/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#f9a8d4]/20 to-transparent animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2a655f] dark:text-[#f9a8d4] text-lg group-hover:text-[#f9a8d4] transition-colors">
                    {app.lang === 'ar' ? "لوحة الأدمن" : "Admin Panel"}
                  </span>
                  <Badge className="text-[8px] px-1.5 py-0.5 bg-[#f9a8d4]/20 text-[#f9a8d4] dark:text-[#f9a8d4] border-0 animate-pulse">
                    🟢 {app.lang === "ar" ? "نشط" : "Active"}
                  </Badge>
                </div>
                <p className="text-[10px] text-[#2a655f] dark:text-[#f9a8d4] -mt-0.5 font-semibold">
                  {app.lang === 'ar' ? 'تحكم كامل في المنصة' : 'Full Platform Control'}
                </p>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/10 border-2 border-[#f9a8d4]/20">
              <Clock className="h-3.5 w-3.5 text-[#f9a8d4]" />
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{formattedTime}</span>
              <LiveIndicator />
            </div>

            <div className="relative hidden md:block group">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-[#f9a8d4] transition-colors duration-300 group-focus-within:text-[#2a655f]`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-xl border-2 border-[#f9a8d4]/30 dark:border-[#2a655f]/30 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2a655f] focus:ring-2 focus:ring-[#f9a8d4]/20 focus:bg-white dark:focus:bg-slate-800/50 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-[#f9a8d4]/20`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[#f9a8d4] hover:text-[#2a655f] transition-colors duration-200`}
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
                <span className="text-[9px] text-[#f9a8d4] dark:text-[#fbcfe8] font-semibold">
                  {app.lang === 'ar' ? 'مدير النظام' : 'System Administrator'}
                </span>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-[#f9a8d4]/40 group-hover:ring-[#2a655f]/60 transition-all duration-300 group-hover:scale-105 cursor-pointer">
                {app.user?.avatar_url ? (
                  <AvatarImage src={app.user.avatar_url} alt={app.user.name || 'Admin'} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white text-sm font-bold">
                    {app.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#f9a8d4] border-2 border-white dark:border-slate-900 animate-pulse shadow-[0_0_12px_rgba(249,168,212,0.8)]" />
            </div>
          </div>
        </div>
      </header>

      {/* ===== المحتوى ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 relative z-0">
        
        {/* ✅ ===== سلايدر النظام - نفس تصميم SellerDashboard ===== */}
        {!showSearchResults && (
          <div className="mb-6">
            <SystemSlider isRTL={isRTL} />
          </div>
        )}

        {/* ===== PAGE HEADER ===== */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {showSearchResults ? (
                <span className="flex items-center gap-3">
                  <span>{app.lang === 'ar' ? 'نتائج البحث' : 'Search Results'}</span>
                  <Badge className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white text-sm px-3 py-1 shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30">
                    {searchResults.total} {app.lang === 'ar' ? 'نتيجة' : 'results'}
                  </Badge>
                </span>
              ) : (
                nav.find(n => n.id === tab)?.label || (app.lang === 'ar' ? "نظرة عامة" : "Overview")
              )}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
              {showSearchResults ? (
                <span>
                  {app.lang === 'ar' ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"`}
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <span className="text-base md:text-lg font-bold bg-gradient-to-r from-[#2a655f] to-[#d81b60] bg-clip-text text-transparent">
                    {app.lang === 'ar' ? `مرحبا بك في ذوق يا ${app.user?.name || 'مدير'}` : `Welcome to Zooq, ${app.user?.name || 'Admin'}`}
                  </span>
                  <span className="text-xl md:text-2xl animate-bounce text-[#d81b60]">❤️</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ===== عرض نتائج البحث ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-6 animate-in slide-in-from-top-5 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    className={`bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#f9a8d4]/30 dark:border-[#2a655f]/30 p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${isActive ? 'ring-2 ring-[#f9a8d4] border-[#f9a8d4] shadow-lg shadow-[#f9a8d4]/20' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-[#f9a8d4]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-[#f9a8d4]/20`}>
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-[#2a655f]' : 'text-[#f9a8d4]'}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                        <p className="text-lg font-bold text-[#2a655f] dark:text-[#f9a8d4]">{item.count}</p>
                      </div>
                    </div>
                    {item.count > 0 && (
                      <div className="mt-1 text-[10px] text-[#2a655f] font-medium hover:underline transition-all">
                        {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {searchResults.total === 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#f9a8d4]/30 dark:border-[#2a655f]/30 p-12 text-center shadow-lg">
                <div className="h-20 w-20 rounded-full bg-[#f9a8d4]/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="h-10 w-10 text-[#f9a8d4]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.lang === 'ar' ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"`}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-xl border-2 border-[#f9a8d4]/30 text-[#2a655f] hover:bg-[#f9a8d4]/10"
                  onClick={clearSearch}
                >
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ===== TABS NAVIGATION - مُصحح بالكامل (بدون تمرير) ===== */}
        {!showSearchResults && (
          <div className="mb-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#d81b60]/40 dark:border-[#d81b60]/30 shadow-xl shadow-[#d81b60]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#d81b60] to-[#2a655f] animate-pulse" />
              
              {/* ✅ Desktop Tabs */}
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
                          ? 'bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#fbcfe8] text-white shadow-xl shadow-[#2a655f]/40 scale-[1.03] border-2 border-[#2a655f]/50' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-[#f9a8d4]/10 dark:hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] dark:hover:text-[#f9a8d4]'
                        }
                      `}
                    >
                      <div className={`relative transition-all duration-500 ${isActive ? 'scale-110 animate-pulse' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                        <Icon 
                          className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#d81b60] dark:text-[#d81b60] group-hover:text-[#d81b60]'}`}
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

              {/* ✅ Mobile Tabs */}
              <div className="md:hidden p-3">
                <div className="grid grid-cols-4 gap-1.5">
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
                          relative flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-500
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#fbcfe8] text-white shadow-xl shadow-[#2a655f]/40 scale-[1.03] border-2 border-[#2a655f]/50' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-[#f9a8d4]/10 dark:hover:bg-[#f9a8d4]/20'
                          }
                        `}
                      >
                        <div className={`transition-all duration-500 ${isActive ? 'scale-110 animate-pulse' : ''}`}>
                          <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#d81b60] dark:text-[#d81b60]'}`} />
                        </div>
                        <span className="text-[8px] leading-tight text-center max-w-full break-words font-bold">
                          {n.label}
                        </span>
                        {isActive && (
                          <span className="h-0.5 w-6 rounded-full bg-white/60 animate-pulse" />
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
        <div className="mt-12 pt-6 border-t-2 border-[#f9a8d4]/20 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-4">
            <span className="text-[#2a655f] dark:text-[#f9a8d4] font-medium">{app.lang === 'ar' ? '© 2024 جميع الحقوق محفوظة' : '© 2024 All rights reserved'}</span>
            <span className="h-1 w-1 rounded-full bg-[#f9a8d4]/50" />
            <span className="flex items-center gap-1 text-[#2a655f] dark:text-[#f9a8d4]">
              <LiveIndicator />
              {app.lang === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System operational'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#f9a8d4]">v2.0.0</span>
            <span className="h-1 w-1 rounded-full bg-[#f9a8d4]/50" />
            <span>{app.lang === 'ar' ? 'مدعوم من' : 'Powered by'} <span className="text-[#2a655f] dark:text-[#f9a8d4] font-bold hover:text-[#f9a8d4] transition-colors duration-300">Zooq</span></span>
            <Zap className="h-3 w-3 text-[#f9a8d4] animate-pulse" />
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
      `}</style>
    </div>
  );
}

export default AdminDashboard;