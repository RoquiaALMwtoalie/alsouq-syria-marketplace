// src/components/dashboard/SellerDashboard.tsx

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, Calendar as CalendarIcon, Users, Star, BarChart3, Settings,
  ShoppingCart, DollarSign, Store, Clock, CheckCircle2, XCircle, TrendingUp,
  TrendingDown, Award, Target, Zap, Eye, Download, RefreshCw,
  UserPlus, AlertCircle, MoreVertical, Search,
  Filter, ArrowUpRight, ArrowDownRight, X, FileSpreadsheet, FileText,
  Sparkles, Rocket, Gem, Crown, Flame, Bell, BellRing, Shield,
  MapPin, Globe, Calendar, Building, Phone, Mail, Heart, Star as StarIcon,
  Play, Pause, ChevronLeft, ChevronRight,
  TrendingUp as TrendingUpIcon, Users as UsersIcon, ShoppingBag as ShoppingBagIcon,
  DollarSign as DollarSignIcon, Package as PackageIcon, Zap as ZapIcon,
  Crown as CrownIcon, Gift, BadgePercent, Trophy, Clock as ClockIcon,
  Coffee, Smile, ThumbsUp, ArrowRight as ArrowRightIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyOrders, useMyListings, useSellerCustomers, useCategories, useProfile } from "@/lib/queries";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

// ===== استيراد مكونات الصفحات =====
import { ProductsPage } from "./ProductsPage";
import { OrdersPage } from "./OrdersPage";
import { BookingsPage } from "./BookingsPage";
import { CustomersPage } from "./CustomersPage";
import { StatsPage } from "./StatsPage";
import { SettingsPage } from "./SettingsPage";

// ============================================================
// 🟢 COLORS - تدرجات الأخضر المعتمدة في النظام
// ============================================================
const CHART_COLORS = ['#0d2e2a', '#1a4f4a', '#2d6b63', '#4a9f95', '#6bb5aa', '#8dcfc6'];
const CHART_GRADIENTS = {
  revenue: 'from-[#0d2e2a] to-[#1a4f4a]',
  orders: 'from-[#1a4f4a] to-[#2d6b63]',
  customers: 'from-[#2d6b63] to-[#4a9f95]',
  products: 'from-[#4a9f95] to-[#6bb5aa]',
};

interface SellerDashboardProps {
  // notificationButton removed
}

export function SellerDashboard({}: SellerDashboardProps) {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = useState(false);
  
  // ===== جلب بيانات المتجر =====
  const { data: profile } = useProfile(app.user?.id) as { data: any };
  
  // ===== ✅ ✅ ✅ State للسلايدر =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const totalSlides = 5;

  // ===== ✅ ✅ ✅ Auto-play للسلايدر =====
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);

  // ===== ✅ ✅ ✅ دوال التنقل في السلايدر =====
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

  // ===== حالة المتجر =====
  const isStoreActive = profile?.store_active !== false;
  const isStoreOnline = profile?.store_online !== false;
  const storeName = profile?.store_name || (app.lang === "ar" ? "متجرك" : "Your Store");
  const storeLogo = profile?.store_logo_url || "";
  const storeCover = profile?.store_cover_url || "";
  const storePhone = profile?.store_phone || profile?.phone || "";
  const storeAddress = profile?.store_address || "";
  const governorate = profile?.governorate?.name_ar || profile?.governorate?.name_en || "";
  const opensAt = profile?.store_opens_at ? profile.store_opens_at.slice(0, 5) : "";
  const closesAt = profile?.store_closes_at ? profile.store_closes_at.slice(0, 5) : "";
// ✅ ✅ ✅ نسخة محسّنة من الدالة (مثل الموجودة في store.$id.tsx)
const isStoreOpen = (store: any): boolean => {
  if (!store || store.store_online === false) return false;
  if (!store.store_opens_at || !store.store_closes_at) return true;
  
  try {
    const opens = store.store_opens_at.slice(0, 5);
    const closes = store.store_closes_at.slice(0, 5);
    
    if (!opens || !closes || opens.length < 5 || closes.length < 5) return true;
    
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    
    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);
    
    if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) return true;
    
    const o = oh * 60 + om;
    const c = ch * 60 + cm;
    
    if (o <= c) {
      return cur >= o && cur <= c;
    } else {
      return cur >= o || cur <= c;
    }
  } catch (error) {
    console.error('❌ [Store] Error checking store status:', error);
    return true;
  }
};

// ✅ استخدمها
const currentlyOpen = isStoreOpen(profile);
  const storeStatus = isStoreActive && isStoreOnline;
  const currentlyOpen = isOpen();

  // ===== جلب البيانات من API =====
  const { data: sellerOrdersRaw = [] } = useMyOrders(app.user?.id);
  const { data: sellerListings = [] } = useMyListings(app.user?.id);
  const { data: sellerCustomers = [] } = useSellerCustomers(app.user?.id);
  const { data: cats = [] } = useCategories();
  
  // ===== تصفية الطلبات الخاصة بالبائع =====
  const sellerOrders = sellerOrdersRaw.filter((row: any) => row.seller_id === app.user?.id);

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

  // ===== فلترة المنتجات =====
  const filteredListings = useMemo(() => {
    return getFilteredData(sellerListings, ['title_ar', 'title_en', 'description_ar', 'description_en'], searchQuery);
  }, [sellerListings, searchQuery]);

  // ===== فلترة الطلبات =====
  const filteredOrders = useMemo(() => {
    return getFilteredData(sellerOrders, ['id', 'product_name', 'customer_name', 'status', 'total'], searchQuery);
  }, [sellerOrders, searchQuery]);

  // ===== فلترة العملاء =====
  const filteredCustomers = useMemo(() => {
    return getFilteredData(sellerCustomers, ['name', 'email', 'phone', 'city', 'address'], searchQuery);
  }, [sellerCustomers, searchQuery]);


  // ===== فلترة التقييمات =====
  const filteredReviews = useMemo(() => {
    const reviews = sellerOrders.filter((o: any) => o.rating && o.rating > 0);
    return getFilteredData(reviews, ['id', 'product_name', 'customer_name', 'rating', 'comment'], searchQuery);
  }, [sellerOrders, searchQuery]);

  // ===== حساب عدد النتائج في كل قسم =====
  const searchResults = useMemo(() => {
    return {
      products: filteredListings.length,
      orders: filteredOrders.length,
      customers: filteredCustomers.length,
    
      reviews: filteredReviews.length,
      total: filteredListings.length + filteredOrders.length + filteredCustomers.length + filteredReviews.length
    };
  }, [filteredListings, filteredOrders, filteredCustomers, filteredReviews]);

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

  // ===== تحديد التبويب الأنسب للبحث =====
  const getBestTab = () => {
    const results = [
      { tab: 'products', count: filteredListings.length, label: app.lang === 'ar' ? 'المنتجات' : 'Products' },
      { tab: 'orders', count: filteredOrders.length, label: app.lang === 'ar' ? 'الطلبات' : 'Orders' },
      { tab: 'customers', count: filteredCustomers.length, label: app.lang === 'ar' ? 'العملاء' : 'Customers' },
     
      { tab: 'reviews', count: filteredReviews.length, label: app.lang === 'ar' ? 'التقييمات' : 'Reviews' },
    ];
    results.sort((a, b) => b.count - a.count);
    return results[0];
  };

  // ===== مسح البحث =====
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResultsPage(false);
  };

  // ===== عرض نتائج البحث =====
  const showSearchResults = searchQuery.trim().length > 0 && showSearchResultsPage;

  // ===== البيانات المحسوبة =====
  const totalRevenue = sellerOrders.reduce((sum: number, row: any) => sum + (Number(row.total) || 0), 0);
  const totalOrders = sellerOrders.length;
  const totalCustomers = sellerCustomers.length;
  const totalProducts = sellerListings.length;
  const completedOrders = sellerOrders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
  const pendingOrders = sellerOrders.filter((o: any) => o.status === 'pending').length;
  const cancelledOrders = sellerOrders.filter((o: any) => o.status === 'cancelled').length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // ===== أحدث 5 طلبات =====
  const recentOrders = useMemo(() => 
    sellerOrders
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
    [sellerOrders]
  );

  // ===== أفضل 5 منتجات =====
  const topProducts = useMemo(() => {
    const map: { [key: string]: any } = {};
    sellerOrders.forEach((o: any) => {
      const id = o.product_id || 'unknown';
      if (!map[id]) map[id] = { id, name: o.product_name || `Product ${id}`, quantity: 0, revenue: 0 };
      map[id].quantity += Number(o.quantity) || 1;
      map[id].revenue += Number(o.total) || 0;
    });
    return Object.values(map).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5);
  }, [sellerOrders]);

  // ===== بيانات المبيعات الشهرية =====
  const monthlyData = useMemo(() => {
    const months: { [key: string]: any } = {};
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    sellerOrders.forEach((o: any) => {
      const date = new Date(o.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) {
        months[key] = { 
          name: app.lang === 'ar' ? arabicMonths[date.getMonth()] : date.toLocaleString('default', { month: 'short' }),
          revenue: 0, 
          orders: 0 
        };
      }
      months[key].revenue += Number(o.total) || 0;
      months[key].orders += 1;
    });
    return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
      .map(([k, v]) => ({ ...v, revenue: Math.round(v.revenue) }));
  }, [sellerOrders, app.lang]);

  // ===== توزيع الفئات =====
  const categoryData = useMemo(() => {
    const map: { [key: string]: number } = {};
    sellerOrders.forEach((o: any) => {
      const cat = o.product_category || (app.lang === 'ar' ? 'أخرى' : 'Other');
      map[cat] = (map[cat] || 0) + (Number(o.total) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sellerOrders, app.lang]);

  // ===== بيانات الطلبات حسب الحالة =====
  const orderStatusData = useMemo(() => [
    { name: app.lang === 'ar' ? 'مكتمل' : 'Completed', value: completedOrders, color: '#0d2e2a' },
    { name: app.lang === 'ar' ? 'قيد المعالجة' : 'Pending', value: pendingOrders, color: '#2d6b63' },
    { name: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: cancelledOrders, color: '#6bb5aa' },
  ], [completedOrders, pendingOrders, cancelledOrders, app.lang]);

  // ===== بيانات العملاء للتوزيع =====
  const customerData = useMemo(() => {
    const map: { [key: string]: number } = {};
    sellerCustomers.forEach((c: any) => {
      const city = c.city || (app.lang === 'ar' ? 'غير محدد' : 'Unknown');
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sellerCustomers, app.lang]);

  // ===== بيانات التقييمات =====
  const reviewData = useMemo(() => {
    const ratings = [5, 4, 3, 2, 1];
    return ratings.map(r => {
      const count = sellerOrders.filter((o: any) => Math.floor(Number(o.rating) || 0) === r).length;
      return { name: `${r}⭐`, value: count };
    });
  }, [sellerOrders]);

  // ===== ✅ ✅ ✅ بيانات السلايدر المتقدمة مع صور احترافية =====
// src/components/dashboard/seller/SellerDashboard.tsx

// ✅ ✅ ✅ استبدل `sliderData` بهذا الكود ✅ ✅ ✅

const sliderData = useMemo(() => [
  {
    id: 1,
    icon: "🏛️",
    title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
    subtitle: app.lang === "ar" ? "نظام إدارة السوق الذكي" : "Smart Marketplace Management System",
    description: app.lang === "ar" 
      ? "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام" 
      : "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment",
    color: "from-[#0d2e2a] to-[#1a4f4a]",
    badge: app.lang === "ar" ? "🏛️ منصة متكاملة" : "🏛️ Integrated Platform",
    stat: `${totalOrders} ${app.lang === "ar" ? 'طلب' : 'orders'}`,
    gradient: "from-[#0d2e2a]/40 to-[#1a4f4a]/40",
    emoji: "🏛️",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg",
  },
  {
    id: 2,
    icon: "🛡️",
    title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
    subtitle: app.lang === "ar" ? "أمان وحماية متكاملة" : "Complete Security & Protection",
    description: app.lang === "ar" 
      ? "نظام حماية المشتري والبائع مع توثيق الهوية ومراقبة الطلبات لحماية جميع الأطراف" 
      : "Buyer and seller protection system with identity verification and order monitoring",
    color: "from-[#1a4f4a] to-[#0d2e2a]",
    badge: app.lang === "ar" ? "🛡️ حماية متقدمة" : "🛡️ Advanced Security",
    stat: `100% ${app.lang === "ar" ? 'آمن' : 'Secure'}`,
    gradient: "from-[#1a4f4a]/40 to-[#0d2e2a]/40",
    emoji: "🛡️",
    isPositive: true,
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/42430876-ai-generated-8793863_1920.jpg",
  },
  {
    id: 3,
    icon: "📊",
    title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
    subtitle: app.lang === "ar" ? "تحليلات وتقارير فورية" : "Real-time Analytics & Reports",
    description: app.lang === "ar" 
      ? "لوحة تحكم متقدمة تعرض مؤشرات الأداء والإحصائيات لحظياً لاتخاذ قرارات ذكية" 
      : "Advanced dashboard displaying real-time KPIs and statistics for smart decision making",
    color: "from-[#0d2e2a] to-[#2d6b63]",
    badge: `📊 ${app.lang === "ar" ? 'تحليلات لحظية' : 'Real-time Analytics'}`,
    stat: `${totalOrders > 0 ? Math.round(totalOrders * 1.2) : 0} ${app.lang === "ar" ? 'زيارة' : 'visits'}`,
    gradient: "from-[#0d2e2a]/40 to-[#2d6b63]/40",
    emoji: "📊",
    isPositive: true,
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/mohamed_hassan-systems-icons-3334262_1920.jpg",
  },
  {
    id: 4,
    icon: "🚀",
    title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
    subtitle: app.lang === "ar" ? "توصيل ذكي ومتكامل" : "Smart Integrated Delivery",
    description: app.lang === "ar" 
      ? "نظام توصيل متطور يدعم شركات متعددة وتتبع الطلبات في الوقت الفعلي" 
      : "Advanced delivery system supporting multiple companies and real-time order tracking",
    color: "from-[#2d6b63] to-[#0d2e2a]",
    badge: app.lang === "ar" ? "🚚 توصيل سريع" : "🚚 Fast Delivery",
    stat: `${totalOrders} ${app.lang === "ar" ? 'تم التوصيل' : 'delivered'}`,
    gradient: "from-[#2d6b63]/40 to-[#0d2e2a]/40",
    emoji: "🚀",
    isPositive: true,
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/regencygirl123-present-8440034_1920.jpg",
  },
  {
    id: 5,
    icon: "💎",
    title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
    subtitle: app.lang === "ar" ? "تجربة مستخدم فريدة" : "Unique User Experience",
    description: app.lang === "ar" 
      ? "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية" 
      : "Modern, responsive user interfaces with full Arabic and English language support",
    color: "from-[#0d2e2a] to-[#1a4f4a]",
    badge: app.lang === "ar" ? "✨ تجربة فاخرة" : "✨ Luxury Experience",
    stat: `${totalProducts > 0 ? totalProducts : 0} ${app.lang === "ar" ? 'منتج' : 'products'}`,
    gradient: "from-[#0d2e2a]/40 to-[#1a4f4a]/40",
    emoji: "💎",
    description_extra: app.lang === "ar" 
      ? "💡 استمر في تطوير متجرك لجذب المزيد من العملاء" 
      : "💡 Keep developing your store to attract more customers",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/gonghuimin468-happy-holidays-3040029_1920.jpg",
  },
], [app.lang, totalOrders, totalProducts]);
  // ===== قائمة التبويب =====
  const nav = [
    { id: "overview" as const, label: app.lang === 'ar' ? "نظرة عامة" : "Overview", icon: LayoutDashboard, desc: app.lang === 'ar' ? 'لوحة التحكم الرئيسية' : 'Main Dashboard' },
    { id: "products" as const, label: app.lang === 'ar' ? "المنتجات" : "Products", icon: Package, desc: app.lang === 'ar' ? 'إدارة المنتجات' : 'Manage Products' },
    { id: "orders" as const, label: app.lang === 'ar' ? "الطلبات" : "Orders", icon: ShoppingCart, desc: app.lang === 'ar' ? 'متابعة الطلبات' : 'Track Orders' },
   
    { id: "customers" as const, label: app.lang === 'ar' ? "العملاء" : "Customers", icon: Users, desc: app.lang === 'ar' ? 'قاعدة العملاء' : 'Customer Base' },
    { id: "stats" as const, label: app.lang === 'ar' ? "الإحصائيات" : "Analytics", icon: BarChart3, desc: app.lang === 'ar' ? 'تحليل الأداء' : 'Performance Analysis' },
    { id: "settings" as const, label: app.lang === 'ar' ? "الإعدادات" : "Settings", icon: Settings, desc: app.lang === 'ar' ? 'تخصيص المتجر' : 'Store Settings' },
  ];

  const statusLabels: any = {
    completed: app.lang === 'ar' ? "مكتمل" : "Completed",
    pending: app.lang === 'ar' ? "قيد المعالجة" : "Pending",
    cancelled: app.lang === 'ar' ? "ملغي" : "Cancelled"
  };

  const statusBadge: any = {
    completed: <CheckCircle2 className="h-3 w-3 text-[#0d2e2a]" />,
    pending: <Clock className="h-3 w-3 text-[#2d6b63]" />,
    cancelled: <XCircle className="h-3 w-3 text-[#6bb5aa]" />
  };

  const isRTL = app.lang === 'ar';

  // ===== دوال التصدير =====
  const exportToExcel = () => {
    const exportData = sellerOrders.map((o: any) => ({
      'رقم الطلب': String(o.id).slice(0, 8),
      'المنتج': app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—',
      'الكمية': o.quantity || 1,
      'الإجمالي': formatPrice(Number(o.total) || 0, app.currency, app.lang),
      'الحالة': statusLabels[o.status] || o.status,
      'التاريخ': new Date(o.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 20 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `تقرير_المبيعات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير التقرير إلى Excel" : "✅ Report exported to Excel");
  };

  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; }
        h1 { color: #0d2e2a; text-align: center; border-bottom: 2px solid #0d2e2a; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 16px; border-radius: 12px; border-right: 4px solid #0d2e2a; }
        .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
        .stat-card .label { font-size: 12px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0d2e2a; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style></head>
      <body>
        <h1>📊 تقرير المبيعات</h1>
        <p style="text-align: center; color: #64748b;">البائع: ${app.user?.name || 'بائع'} | تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${formatPrice(totalRevenue, app.currency, app.lang)}</div><div class="label">${app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div></div>
          <div class="stat-card"><div class="value">${totalOrders}</div><div class="label">${app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</div></div>
          <div class="stat-card"><div class="value">${totalCustomers}</div><div class="label">${app.lang === 'ar' ? 'العملاء' : 'Customers'}</div></div>
          <div class="stat-card"><div class="value">${completionRate}%</div><div class="label">${app.lang === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate'}</div></div>
        </div>
        <h2>📋 تفاصيل الطلبات</h2>
        <table><thead><tr><th>#</th><th>رقم الطلب</th><th>المنتج</th><th>الكمية</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>
    `;
    sellerOrders.slice(0, 50).forEach((o: any, index: number) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${String(o.id).slice(0, 8)}</td>
          <td>${app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—'}</td>
          <td>${o.quantity || 1}</td>
          <td>${formatPrice(Number(o.total) || 0, app.currency, app.lang)}</td>
          <td>${statusLabels[o.status] || o.status}</td>
          <td>${new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">إجمالي الطلبات: ${sellerOrders.length} | تم التصدير من لوحة البائع</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `تقرير_المبيعات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير التقرير إلى Word" : "✅ Report exported to Word");
  };

  // ===== 🟢 مكون الرسوم البيانية المحسّن =====
  const ChartsSection = ({ 
    showSales = true, 
    showCategory = true, 
    showOrders = false, 
    showCustomers = false, 
    showReviews = false
  }: { 
    showSales?: boolean; 
    showCategory?: boolean; 
    showOrders?: boolean; 
    showCustomers?: boolean; 
    showReviews?: boolean;
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* ✅ مخطط المبيعات - بتدرجات الأخضر */}
      {showSales && (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''} relative`}>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#0d2e2a] animate-float" />
                {app.lang === 'ar' ? "تحليل المبيعات" : "Sales Analytics"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "الإيرادات والطلبات الشهرية" : "Monthly revenue & orders"}
              </p>
            </div>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20">
              <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
              +12.5%
            </Badge>
          </div>
          <div className="h-[220px] relative">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.3}/>
                      <stop offset="50%" stopColor="#1a4f4a" stopOpacity={0.1}/>
                      <stop offset="100%" stopColor="#2d6b63" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ordersGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a9f95" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#4a9f95" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation={isRTL ? 'left' : 'right'} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #0d2e2a/20', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                    formatter={(v: any) => typeof v === 'number' ? v.toLocaleString() : v}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0d2e2a" 
                    strokeWidth={2.5} 
                    fill="url(#revenueGreenGradient)"
                    dot={{ fill: '#0d2e2a', r: 4 }}
                    activeDot={{ r: 6, fill: '#1a4f4a' }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="orders" 
                    fill="#4a9f95" 
                    radius={[4,4,0,0]} 
                    barSize={24}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                {app.lang === 'ar' ? "لا توجد بيانات" : "No data available"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ مخطط توزيع الفئات - بتدرجات الأخضر */}
      {showCategory && (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#2d6b63]/5 blur-3xl animate-pulse delay-700" />
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#2d6b63] animate-spin-slow" />
              {app.lang === 'ar' ? "توزيع الفئات" : "Category Distribution"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === 'ar' ? "حسب الإيرادات" : "By revenue"}
            </p>
          </div>
          <div className="h-[220px] mt-2">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    cx="50%" 
                    cy="45%" 
                    innerRadius={40} 
                    outerRadius={70} 
                    paddingAngle={2} 
                    dataKey="value"
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  >
                    {categoryData.map((e, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #0d2e2a/20', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ حالة الطلبات - بتدرجات الأخضر */}
      {showOrders && (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1a4f4a]/5 blur-3xl animate-pulse delay-500" />
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-[#1a4f4a] animate-float" />
                {app.lang === 'ar' ? "حالة الطلبات" : "Order Status"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "توزيع الطلبات" : "Order distribution"}
              </p>
            </div>
            <div className="h-[220px] mt-2">
              {orderStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={orderStatusData} 
                      cx="50%" 
                      cy="45%" 
                      innerRadius={40} 
                      outerRadius={70} 
                      paddingAngle={2} 
                      dataKey="value"
                      animationDuration={2000}
                      animationEasing="ease-in-out"
                    >
                      {orderStatusData.map((e, i) => (
                        <Cell key={i} fill={e.color} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v: any) => v}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #0d2e2a/20', 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.95)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد طلبات" : "No orders"}
                </div>
              )}
            </div>
          </div>

          {/* ✅ اتجاه الطلبات - بتدرجات الأخضر */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#4a9f95]/5 blur-3xl animate-pulse delay-1000" />
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#4a9f95] animate-bounce-slow" />
                {app.lang === 'ar' ? "اتجاه الطلبات" : "Order Trends"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "الطلبات الشهرية" : "Monthly orders"}
              </p>
            </div>
            <div className="h-[220px] mt-2">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <defs>
                      <linearGradient id="ordersBarGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#2d6b63" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #0d2e2a/20', 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.95)'
                      }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="url(#ordersBarGreen)" 
                      radius={[4,4,0,0]} 
                      barSize={30}
                      animationDuration={2000}
                      animationEasing="ease-in-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ✅ توزيع العملاء - بتدرجات الأخضر */}
      {showCustomers && (
        <>
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse delay-300" />
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-[#0d2e2a] animate-float" />
                {app.lang === 'ar' ? "توزيع العملاء" : "Customer Distribution"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "حسب المدينة" : "By city"}
              </p>
            </div>
            <div className="h-[220px] mt-2">
              {customerData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerData} layout="vertical">
                    <defs>
                      <linearGradient id="customerBarGreen" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0d2e2a" />
                        <stop offset="100%" stopColor="#4a9f95" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #0d2e2a/20', 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.95)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#customerBarGreen)" 
                      radius={[0, 4, 4, 0]} 
                      barSize={24}
                      animationDuration={2000}
                      animationEasing="ease-in-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
                </div>
              )}
            </div>
          </div>

          {/* ✅ إحصائيات العملاء - بتدرجات الأخضر */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#2d6b63]/5 blur-3xl animate-pulse delay-900" />
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2d6b63] animate-bounce-slow" />
                {app.lang === 'ar' ? "إحصائيات العملاء" : "Customer Stats"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "نظرة عامة" : "Overview"}
              </p>
            </div>
            <div className="space-y-3 mt-4 relative">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d2e2a]/5 hover:bg-[#0d2e2a]/10 transition-colors">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</span>
                <span className="text-lg font-bold text-[#0d2e2a] dark:text-[#4a9f95]">{totalCustomers}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1a4f4a]/5 hover:bg-[#1a4f4a]/10 transition-colors">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'متوسط الطلبات لكل عميل' : 'Avg orders/customer'}</span>
                <span className="text-lg font-bold text-[#1a4f4a] dark:text-[#4a9f95]">
                  {totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#2d6b63]/5 hover:bg-[#2d6b63]/10 transition-colors">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'نسبة التحويل' : 'Conversion Rate'}</span>
                <span className="text-lg font-bold text-[#2d6b63] dark:text-[#4a9f95]">{completionRate}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ توزيع التقييمات - بتدرجات الأخضر */}
      {showReviews && (
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#4a9f95]/5 blur-3xl animate-pulse delay-500" />
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-[#4a9f95] animate-spin-slow" />
              {app.lang === 'ar' ? "توزيع التقييمات" : "Reviews Distribution"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === 'ar' ? "تقييمات العملاء" : "Customer ratings"}
            </p>
          </div>
          <div className="h-[220px] mt-2">
            {reviewData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewData}>
                  <defs>
                    <linearGradient id="reviewsBarGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#6bb5aa" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #0d2e2a/20', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#reviewsBarGreen)" 
                    radius={[4,4,0,0]} 
                    barSize={40}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  >
                    {reviewData.map((entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                {app.lang === 'ar' ? "لا توجد تقييمات" : "No reviews"}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER مع بطاقة المتجر ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 shadow-lg shadow-[#0d2e2a]/5">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-[#0d2e2a]/30 dark:ring-[#0d2e2a]/50 shadow-lg shadow-[#0d2e2a]/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                  {storeLogo ? (
                    <AvatarImage src={storeLogo} alt={storeName} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white text-lg font-bold">
                      {storeName.charAt(0).toUpperCase() || 'S'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 animate-pulse",
                  storeStatus && currentlyOpen ? "bg-emerald-500" : storeStatus ? "bg-amber-500" : "bg-red-500"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0d2e2a] dark:text-[#4a9f95] text-lg group-hover:text-[#1a4f4a] transition-colors">
                    {app.lang === 'ar' ? `لوحة متجر ${storeName}` : `${storeName} Dashboard`}
                  </span>
                  {storeStatus ? (
                    <Badge className={cn(
                      "text-[8px] px-1.5 py-0.5 border-0 animate-pulse",
                      currentlyOpen ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    )}>
                      {currentlyOpen ? (app.lang === "ar" ? "🟢 مفتوح" : "🟢 Open") : (app.lang === "ar" ? "🟡 مغلق" : "🟡 Closed")}
                    </Badge>
                  ) : (
                    <Badge className="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 border-0">
                      🔴 {app.lang === "ar" ? "غير نشط" : "Inactive"}
                    </Badge>
                  )}
                </div>
                {opensAt && closesAt && (
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3 text-[#0d2e2a]" />
                    <span dir="ltr">{opensAt} - {closesAt}</span>
                    <span className="w-0.5 h-3 bg-slate-300 dark:bg-slate-600" />
                    <MapPin className="h-3 w-3 text-[#0d2e2a]" />
                    <span className="truncate max-w-[120px]">{governorate || storeAddress || (app.lang === "ar" ? "جميع المحافظات" : "All governorates")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative hidden md:block">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-[#0d2e2a] dark:text-[#4a9f95]`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-lg border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d2e2a] transition-colors`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Avatar className="h-8 w-8 ring-2 ring-[#0d2e2a]/30 dark:ring-[#0d2e2a]/50">
              <AvatarFallback className="bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white text-xs">
                {app.user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 relative z-0">
        
    {/* ============================================================ */}
{/* ✅ ✅ ✅ سلايدر البائع - نفس تصميم الأدمن بالضبط */}
{/* ============================================================ */}
{!showSearchResults && (
  <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] shadow-2xl shadow-[#0d2e2a]/30 border border-emerald-500/20 group min-h-[280px] mb-6">
    
    {/* ✅ صورة الخلفية (تظهر كاملة) */}
    <div className="absolute inset-0 overflow-hidden bg-[#0d2e2a]">
      <img 
        src={sliderData[currentSlide]?.image || "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg"} 
        alt={sliderData[currentSlide]?.title || "Souqi"}
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
            {sliderData[currentSlide]?.icon || "🏛️"}
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-emerald-500/0 blur-xl animate-pulse" />
        </div>
      </div>

      {/* ✅ النصوص */}
      <div className="flex-1 text-center md:text-right">
        <h1 className={`text-2xl md:text-4xl font-extrabold text-white mb-1 tracking-tight drop-shadow-lg ${isRTL ? 'font-arabic' : ''}`}>
          {sliderData[currentSlide]?.title || "السوق لعندك"}
        </h1>
        <h2 className={`text-lg md:text-2xl font-bold text-emerald-300/90 mb-2 tracking-tight drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
          {sliderData[currentSlide]?.subtitle || "نظام إدارة السوق الذكي"}
        </h2>
        <p className={`text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
          {sliderData[currentSlide]?.description || ""}
        </p>
        
        {/* ✅ شارات إضافية */}
        <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
            {sliderData[currentSlide]?.badge || "✨ منصة متكاملة"}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 text-xs">
            {sliderData[currentSlide]?.stat || "🚀 تحديثات لحظية"}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
            🔒 {app.lang === 'ar' ? 'آمن ومحمي' : 'Secure & Protected'}
          </span>
        </div>
        
        {/* ✅ نقاط التقدم */}
        <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
          {Array.from({ length: totalSlides }).map((_, index) => (
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
            {currentSlide + 1}/{totalSlides}
          </span>
        </div>
      </div>

      {/* ✅ أزرار التحكم */}
      <div className="flex-shrink-0 flex flex-row md:flex-col gap-2">
        <button
          onClick={prevSlide}
          className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>

    {/* ✅ شريط سفلي متحرك */}
    <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-shimmer" />
  </div>
)}
        
        {/* ===== PAGE HEADER ===== */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {showSearchResults ? (
                <span className="flex items-center gap-3">
                  <span>{app.lang === 'ar' ? 'نتائج البحث' : 'Search Results'}</span>
                  <Badge className="bg-[#0d2e2a] text-white text-sm px-3 py-1 shadow-lg shadow-[#0d2e2a]/30">
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
                <span>{app.lang === 'ar' ? "مرحباً بعودتك" : "Welcome back"}, {app.user?.name || "Seller"} 👋</span>
              )}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={sellerOrders.length === 0}
              className="rounded-xl border-[#0d2e2a]/30 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 hover:border-[#0d2e2a]/50 transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              {app.lang === 'ar' ? "Excel" : "Excel"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToWord}
              disabled={sellerOrders.length === 0}
              className="rounded-xl border-[#0d2e2a]/30 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 hover:border-[#0d2e2a]/50 transition-all duration-300 hover:scale-105"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              {app.lang === 'ar' ? "Word" : "Word"}
            </Button>
          </div>
        </div>

        {/* ===== عرض نتائج البحث ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { key: 'products', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, color: 'text-[#0d2e2a]', bg: 'bg-[#0d2e2a]/10' },
                { key: 'orders', label: app.lang === 'ar' ? 'الطلبات' : 'Orders', count: searchResults.orders, icon: ShoppingCart, color: 'text-[#1a4f4a]', bg: 'bg-[#1a4f4a]/10' },
                { key: 'customers', label: app.lang === 'ar' ? 'العملاء' : 'Customers', count: searchResults.customers, icon: Users, color: 'text-[#2d6b63]', bg: 'bg-[#2d6b63]/10' },
                
                { key: 'reviews', label: app.lang === 'ar' ? 'التقييمات' : 'Reviews', count: searchResults.reviews, icon: Star, color: 'text-[#6bb5aa]', bg: 'bg-[#6bb5aa]/10' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setTab(item.key as any);
                    setShowSearchResultsPage(false);
                  }}
                  className={`bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${
                    tab === item.key ? 'ring-2 ring-[#0d2e2a] border-[#0d2e2a] shadow-lg shadow-[#0d2e2a]/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                      <p className="text-lg font-bold text-[#0d2e2a] dark:text-[#4a9f95]">{item.count}</p>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <div className="mt-1 text-[10px] text-[#0d2e2a] font-medium hover:underline transition-all">
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </div>
                  )}
                </button>
              ))}
            </div>

            {searchResults.total === 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-12 text-center shadow-lg">
                <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="h-10 w-10 text-[#0d2e2a]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.lang === 'ar' 
                    ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` 
                    : `No results match "${searchQuery}"`}
                </p>
                <Button variant="outline" className="mt-4 rounded-xl border-[#0d2e2a]/30 text-[#0d2e2a] hover:bg-[#0d2e2a]/10" onClick={clearSearch}>
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ===== TABS NAVIGATION ===== */}
        {!showSearchResults && (
          <div className="mb-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 shadow-xl shadow-[#0d2e2a]/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#0d2e2a] to-transparent animate-pulse" />
              
              <div className="hidden md:flex items-center p-1.5 gap-1.5 overflow-x-auto">
                {nav.map((n) => {
                  const isActive = tab === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setTab(n.id)}
                      className={`
                        relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 whitespace-nowrap flex-1 text-center justify-center group
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white shadow-xl shadow-[#0d2e2a]/40 scale-[1.03]' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 hover:text-[#0d2e2a] dark:hover:text-[#4a9f95]'
                        }
                      `}
                    >
                      <div className={`
                        relative transition-all duration-500
                        ${isActive ? 'scale-110 animate-pulse' : 'group-hover:scale-110 group-hover:rotate-6'}
                      `}>
                        <n.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#0d2e2a] dark:text-[#4a9f95] group-hover:text-[#0d2e2a]'}`} />
                        {isActive && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white/60 animate-ping" />
                        )}
                      </div>
                      <span className={`font-bold ${isActive ? 'text-white' : 'group-hover:text-[#0d2e2a]'}`}>
                        {n.label}
                      </span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="md:hidden p-3">
                <div className="grid grid-cols-4 gap-1.5">
                  {nav.map((n) => {
                    const isActive = tab === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setTab(n.id)}
                        className={`
                          relative flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-500
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white shadow-xl shadow-[#0d2e2a]/40 scale-[1.03]' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 hover:text-[#0d2e2a]'
                          }
                        `}
                      >
                        <div className={`transition-all duration-500 ${isActive ? 'scale-110 animate-pulse' : ''}`}>
                          <n.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#0d2e2a] dark:text-[#4a9f95]'}`} />
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

        {/* ===== المحتوى حسب التبويب ===== */}
        {!showSearchResults && (
          <div className="space-y-6">
            
            {/* ===== نظرة عامة ===== */}
            {tab === 'overview' && (
              <div>
                {/* ✅ بطاقات الإحصائيات - بتدرجات الأخضر */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { 
                      label: app.lang === 'ar' ? "إجمالي الإيرادات" : "Total Revenue", 
                      value: formatPrice(totalRevenue, app.currency, app.lang), 
                      icon: DollarSign, 
                      change: '+12.5%', 
                      color: 'text-[#0d2e2a]', 
                      bg: 'bg-[#0d2e2a]/10',
                      gradient: 'from-[#0d2e2a] to-[#1a4f4a]',
                    },
                    { 
                      label: app.lang === 'ar' ? "إجمالي الطلبات" : "Total Orders", 
                      value: totalOrders, 
                      icon: ShoppingCart, 
                      change: '+8.2%', 
                      color: 'text-[#1a4f4a]', 
                      bg: 'bg-[#1a4f4a]/10',
                      gradient: 'from-[#1a4f4a] to-[#2d6b63]',
                    },
                    { 
                      label: app.lang === 'ar' ? "العملاء" : "Customers", 
                      value: totalCustomers, 
                      icon: Users, 
                      change: '+5.3%', 
                      color: 'text-[#2d6b63]', 
                      bg: 'bg-[#2d6b63]/10',
                      gradient: 'from-[#2d6b63] to-[#4a9f95]',
                    },
                    { 
                      label: app.lang === 'ar' ? "المنتجات" : "Products", 
                      value: totalProducts, 
                      icon: Package, 
                      change: '+2.1%', 
                      color: 'text-[#4a9f95]', 
                      bg: 'bg-[#4a9f95]/10',
                      gradient: 'from-[#4a9f95] to-[#6bb5aa]',
                    },
                  ].map((stat, i) => (
                    <div key={i} className="group bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
                      </div>
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#0d2e2a] dark:group-hover:text-[#4a9f95] transition-colors">{stat.value}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <ArrowUpRight className="h-3 w-3 text-[#2d6b63] animate-bounce-slow" />
                            <span className="text-xs font-medium text-[#2d6b63]">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="mt-3 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`} 
                          style={{ width: `${Math.min(Math.abs(parseFloat(stat.change) || 0) * 4, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===== باقي محتوى النظرة العامة ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* المنتجات */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
                    <div className={`px-5 py-4 border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#0d2e2a] animate-pulse" />
                          {app.lang === 'ar' ? "المنتجات" : "Products"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {app.lang === 'ar' ? "الأكثر مبيعاً" : "Best selling"}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-[#0d2e2a] hover:text-[#1a4f4a] hover:bg-[#0d2e2a]/10 transition-all"
                        onClick={() => setTab('products')}
                      >
                        {app.lang === 'ar' ? "عرض الكل" : "View all"} 
                        <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
                      {topProducts.slice(0, 5).map((product: any, idx: number) => (
                        <div key={idx} className={`px-5 py-3 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/20 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${['from-[#0d2e2a] to-[#1a4f4a]', 'from-[#1a4f4a] to-[#2d6b63]', 'from-[#2d6b63] to-[#4a9f95]', 'from-[#4a9f95] to-[#6bb5aa]', 'from-[#0d2e2a] to-[#2d6b63]'][idx]} flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300`}>
                                #{idx + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {product.quantity || 0} {app.lang === 'ar' ? "وحدة" : "units"}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                              {formatPrice(product.revenue || 0, app.currency, app.lang)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* الطلبات */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
                    <div className={`px-5 py-4 border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-[#1a4f4a] animate-bounce-slow" />
                          {app.lang === 'ar' ? "الطلبات" : "Orders"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {app.lang === 'ar' ? "آخر 5 طلبات" : "Last 5 orders"}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-[#1a4f4a] hover:text-[#2d6b63] hover:bg-[#1a4f4a]/10 transition-all"
                        onClick={() => setTab('orders')}
                      >
                        {app.lang === 'ar' ? "عرض الكل" : "View all"} 
                        <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
                      {recentOrders.map((order: any, idx: number) => (
                        <div key={idx} className={`px-5 py-3 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/20 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="h-8 w-8 rounded-lg bg-[#0d2e2a]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xs font-bold text-[#0d2e2a]">#{String(order.id).slice(0, 4)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
                                  {order.product_name || (app.lang === 'ar' ? 'طلب' : 'Order')}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(order.created_at).toLocaleDateString(
                                    app.lang === 'ar' ? 'ar-SA' : 'en-US', 
                                    { month: 'short', day: 'numeric' }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <p className="text-sm font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                                {formatPrice(order.total, app.currency, app.lang)}
                              </p>
                              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} justify-end`}>
                                {statusBadge[order.status]}
                                <span className="text-[10px] font-medium text-slate-500 capitalize">
                                  {statusLabels[order.status] || (app.lang === 'ar' ? 'قيد المعالجة' : 'Pending')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* العملاء */}
                  <div className="space-y-4">
                    <div className="group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2d6b63]/5 blur-3xl animate-pulse" />
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-3 w-3 text-[#2d6b63]" />
                            {app.lang === 'ar' ? "العملاء" : "Customers"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2d6b63] transition-colors">{totalCustomers}</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#2d6b63]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Users className="h-6 w-6 text-[#2d6b63]" />
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#4a9f95]/5 blur-3xl animate-pulse delay-500" />
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {app.lang === 'ar' ? "نسبة الإنجاز" : "Completion Rate"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#4a9f95] transition-colors">{completionRate}%</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#4a9f95]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <CheckCircle2 className="h-6 w-6 text-[#4a9f95]" />
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#0d2e2a] to-[#4a9f95] rounded-full animate-pulse" style={{ width: `${completionRate}%` }} />
                      </div>
                    </div>

                    <div className="group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#6bb5aa]/5 blur-3xl animate-pulse delay-1000" />
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {app.lang === 'ar' ? "متوسط قيمة الطلب" : "Avg Order Value"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#6bb5aa] transition-colors">
                            {formatPrice(avgOrderValue, app.currency, app.lang)}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#6bb5aa]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Target className="h-6 w-6 text-[#6bb5aa]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ChartsSection showSales={true} showCategory={true} />
              </div>
            )}

            {/* ===== تبويب المنتجات ===== */}
            {tab === 'products' && (
              <div className="space-y-6">
                <ProductsPage />
                <ChartsSection showSales={true} showCategory={true} />
              </div>
            )}

            {/* ===== تبويب الطلبات ===== */}
{/* ===== تبويب الطلبات ===== */}
{tab === 'orders' && (
  <div className="space-y-6">
    <OrdersPage />  {/* ✅ الآن الأزرار رح تظهر */}
    <ChartsSection showOrders={true} />
  </div>
)}
           

            {/* ===== تبويب العملاء ===== */}
            {tab === 'customers' && (
              <div className="space-y-6">
                <CustomersPage />
                <ChartsSection showCustomers={true} />
              </div>
            )}

            {/* ===== تبويب الإحصائيات ===== */}
            {tab === 'stats' && (
              <div className="space-y-6">
                <StatsPage />
                <ChartsSection showSales={true} showCategory={true} showOrders={true} showCustomers={true} showReviews={true} />
              </div>
            )}

            {/* ===== تبويب الإعدادات ===== */}
            {tab === 'settings' && (
              <div className="space-y-6">
                <SettingsPage />
                <ChartsSection showSales={true} showCategory={true} />
              </div>
            )}

          </div>
        )}

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
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default SellerDashboard;