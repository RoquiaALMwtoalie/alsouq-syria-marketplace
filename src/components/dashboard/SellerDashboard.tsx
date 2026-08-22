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
  Area, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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
// 🎨 COLORS - الألوان الزيتية الأصلية (نفس لون البنر)
// ============================================================
const COLORS = {
  primary: '#0d2e2a',      // الزيتي الغامق
  primaryLight: '#1a4f4a', // زيتي فاتح
  primaryMedium: '#2d6b63', // زيتي متوسط
  accent: '#4a9f95',       // الزيتي المائل للفيروزي
  accentLight: '#6bb5aa',  // فاتح
  accentLighter: '#8dcfc6', // أفتح
};

const CHART_COLORS = ['#0d2e2a', '#1a4f4a', '#2d6b63', '#4a9f95', '#6bb5aa', '#8dcfc6'];
const PREMIUM_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#73C6B6'
];

// ألوان متدرجة للرادار
const RADAR_COLORS = {
  stroke: COLORS.primary,
  fill: 'rgba(13, 46, 42, 0.15)',
  grid: '#e2e8f0'
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
  
  // ===== جلب بيانات المتجر من الـ Database =====
  const { data: profile } = useProfile(app.user?.id) as { data: any };
  
  // ===== State للسلايدر =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const totalSlides = 5;

  // ===== Auto-play للسلايدر =====
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);

  // ===== دوال التنقل في السلايدر =====
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

  // ===== دالة التحقق من حالة المتجر =====
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

  const currentlyOpen = isStoreOpen(profile);
  const storeStatus = isStoreActive && isStoreOnline;

  // ===== جلب البيانات من API (Database) =====
  const { data: sellerOrdersRaw = [] } = useMyOrders(app.user?.id);
  const { data: sellerListings = [] } = useMyListings(app.user?.id);
  const { data: sellerCustomers = [] } = useSellerCustomers(app.user?.id);
  const { data: cats = [] } = useCategories();
  
  // ===== تصفية الطلبات الخاصة بالبائع =====
  const sellerOrders = sellerOrdersRaw.filter((row: any) => row.seller_id === app.user?.id);

  // ✅✅✅ حساب عدد الطلبات لكل عميل (مصحح)
  const customerOrderCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    sellerOrders.forEach((order: any) => {
      // جلب ID العميل من الطلب
      const customerId = order.buyer_id || order.customer_id || order.user_id;
      if (customerId) {
        counts[customerId] = (counts[customerId] || 0) + 1;
      }
    });
    return counts;
  }, [sellerOrders]);

  // ✅✅✅ دمج بيانات العملاء مع عدد الطلبات (مصحح)
  const customersWithOrders = useMemo(() => {
    return sellerCustomers.map((customer: any) => {
      const customerId = customer.id || customer.user_id;
      const orderCount = customerOrderCounts[customerId] || 0;
      
      // ✅ اسم العميل
      const displayName = 
        customer.full_name || 
        customer.name || 
        customer.user?.full_name || 
        customer.user?.name ||
        customer.email?.split('@')[0] ||
        (app.lang === "ar" ? "عميل" : "Customer");
      
      // ✅ رقم الهاتف
      const phone = 
        customer.phone || 
        customer.user?.phone || 
        customer.user?.phone_number ||
        '';
      
      // ✅ الصورة
      const avatar = 
        customer.avatar_url || 
        customer.user?.avatar_url || 
        customer.user?.avatar ||
        '';
      
      return {
        ...customer,
        display_name: displayName,
        phone_number: phone,
        avatar_url: avatar,
        total_orders: orderCount,
      };
    });
  }, [sellerCustomers, customerOrderCounts, app.lang]);

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
    return getFilteredData(customersWithOrders, ['display_name', 'email', 'phone_number', 'city', 'address'], searchQuery);
  }, [customersWithOrders, searchQuery]);

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

  // ===== البيانات المحسوبة من الـ Database =====
  const totalRevenue = sellerOrders.reduce((sum: number, row: any) => sum + (Number(row.total) || 0), 0);
  const totalOrders = sellerOrders.length;
  const totalCustomers = customersWithOrders.length; // ✅ استخدام العملاء مع الطلبات
  const totalProducts = sellerListings.length;
  
  // ===== حالات الطلبات المختلفة =====
  const completedOrders = sellerOrders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
  const pendingOrders = sellerOrders.filter((o: any) => o.status === 'pending').length;
  const cancelledOrders = sellerOrders.filter((o: any) => o.status === 'cancelled').length;
  const acceptedOrders = sellerOrders.filter((o: any) => o.status === 'accepted').length;
  const rejectedOrders = sellerOrders.filter((o: any) => o.status === 'rejected').length;
  const processingOrders = sellerOrders.filter((o: any) => o.status === 'processing').length;
  
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // ===== أحدث 5 طلبات (مع رقم طلب واضح) =====
  const recentOrders = useMemo(() => 
    sellerOrders
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
    [sellerOrders]
  );

  // ===== أفضل 5 منتجات =====
const topProducts = useMemo(() => {
  // ✅ خريطة المنتجات من sellerListings
  const productMap: { [key: string]: any } = {};
  sellerListings.forEach((listing: any) => {
    productMap[listing.id] = listing;
  });

  // ✅ خريطة لترتيب المنتجات حسب الإيرادات
  const revenueMap: { [key: string]: { id: string; name: string; quantity: number; revenue: number } } = {};
  
  sellerOrders.forEach((order: any) => {
    // ✅ جلب product_id من الطلب
    const productId = order.product_id || order.listing_id;
    if (!productId) return;
    
    // ✅ جلب المنتج من الخريطة
    const product = productMap[productId];
    if (!product) return;
    
    // ✅ جلب اسم المنتج (دائماً title_ar)
    const productName = product.title_ar || `منتج ${String(productId).slice(-6)}`;
    
    if (!revenueMap[productId]) {
      revenueMap[productId] = {
        id: productId,
        name: productName,
        quantity: 0,
        revenue: 0,
      };
    }
    
    revenueMap[productId].quantity += Number(order.quantity) || 1;
    revenueMap[productId].revenue += Number(order.total) || 0;
  });
  
  // ✅ ترتيب حسب الإيرادات وأخذ أول 5
  return Object.values(revenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}, [sellerOrders, sellerListings]);
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

  // ===== بيانات العملاء للتوزيع =====
  const customerData = useMemo(() => {
    const map: { [key: string]: number } = {};
    customersWithOrders.forEach((c: any) => {
      const city = c.city || c.address || (app.lang === 'ar' ? 'غير محدد' : 'Unknown');
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }, [customersWithOrders, app.lang]);

  // ===== بيانات التقييمات =====
  const reviewData = useMemo(() => {
    const ratings = [5, 4, 3, 2, 1];
    return ratings.map(r => {
      const count = sellerOrders.filter((o: any) => Math.floor(Number(o.rating) || 0) === r).length;
      return { name: `${r}⭐`, value: count };
    });
  }, [sellerOrders]);

  // ===== بيانات الأداء =====
  const performanceData = useMemo(() => [
    { subject: app.lang === 'ar' ? 'المبيعات' : 'Sales', value: totalOrders > 0 ? Math.min(Math.round((totalRevenue / 1000) * 10), 100) : 0 },
    { subject: app.lang === 'ar' ? 'العملاء' : 'Customers', value: totalCustomers > 0 ? Math.min(Math.round(totalCustomers * 2), 100) : 0 },
    { subject: app.lang === 'ar' ? 'الجودة' : 'Quality', value: completionRate },
    { subject: app.lang === 'ar' ? 'السرعة' : 'Speed', value: pendingOrders > 0 ? Math.min(Math.round((completedOrders / totalOrders) * 100), 100) : 0 },
    { subject: app.lang === 'ar' ? 'التقييم' : 'Rating', value: sellerOrders.filter((o: any) => o.rating > 0).length > 0 ? Math.min(Math.round((sellerOrders.reduce((sum: number, o: any) => sum + Number(o.rating || 0), 0) / sellerOrders.filter((o: any) => o.rating > 0).length) * 20), 100) : 0 },
  ], [totalRevenue, totalOrders, totalCustomers, completionRate, pendingOrders, completedOrders, sellerOrders]);

  // ===== بيانات السلايدر =====
  const sliderData = useMemo(() => [
    {
      id: 1,
      icon: "🏛️",
      title: app.lang === "ar" ? "السوق لعندك" : "Souqi",
      subtitle: app.lang === "ar" ? "نظام إدارة السوق الذكي" : "Smart Marketplace Management System",
      description: app.lang === "ar" 
        ? "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام" 
        : "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment",
      color: `from-[${COLORS.primary}] to-[${COLORS.primaryLight}]`,
      badge: app.lang === "ar" ? "🏛️ منصة متكاملة" : "🏛️ Integrated Platform",
      stat: `${totalOrders} ${app.lang === "ar" ? 'طلب' : 'orders'}`,
      gradient: `from-[${COLORS.primary}]/40 to-[${COLORS.primaryLight}]/40`,
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
      color: `from-[${COLORS.primaryLight}] to-[${COLORS.primary}]`,
      badge: app.lang === "ar" ? "🛡️ حماية متقدمة" : "🛡️ Advanced Security",
      stat: `100% ${app.lang === "ar" ? 'آمن' : 'Secure'}`,
      gradient: `from-[${COLORS.primaryLight}]/40 to-[${COLORS.primary}]/40`,
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
      color: `from-[${COLORS.primary}] to-[${COLORS.primaryMedium}]`,
      badge: `📊 ${app.lang === "ar" ? 'تحليلات لحظية' : 'Real-time Analytics'}`,
      stat: `${totalOrders > 0 ? Math.round(totalOrders * 1.2) : 0} ${app.lang === "ar" ? 'زيارة' : 'visits'}`,
      gradient: `from-[${COLORS.primary}]/40 to-[${COLORS.primaryMedium}]/40`,
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
      color: `from-[${COLORS.primaryMedium}] to-[${COLORS.primary}]`,
      badge: app.lang === "ar" ? "🚚 توصيل سريع" : "🚚 Fast Delivery",
      stat: `${totalOrders} ${app.lang === "ar" ? 'تم التوصيل' : 'delivered'}`,
      gradient: `from-[${COLORS.primaryMedium}]/40 to-[${COLORS.primary}]/40`,
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
      color: `from-[${COLORS.primary}] to-[${COLORS.primaryLight}]`,
      badge: app.lang === "ar" ? "✨ تجربة فاخرة" : "✨ Luxury Experience",
      stat: `${totalProducts > 0 ? totalProducts : 0} ${app.lang === "ar" ? 'منتج' : 'products'}`,
      gradient: `from-[${COLORS.primary}]/40 to-[${COLORS.primaryLight}]/40`,
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
    cancelled: app.lang === 'ar' ? "ملغي" : "Cancelled",
    accepted: app.lang === 'ar' ? "مقبول" : "Accepted",
    rejected: app.lang === 'ar' ? "مرفوض" : "Rejected",
    processing: app.lang === 'ar' ? "قيد التجهيز" : "Processing"
  };

  const statusBadge: any = {
    completed: <CheckCircle2 className="h-3 w-3 text-[#00B894]" />,
    pending: <Clock className="h-3 w-3 text-[#FF9F43]" />,
    cancelled: <XCircle className="h-3 w-3 text-[#FF6B6B]" />,
    accepted: <CheckCircle2 className="h-3 w-3 text-[#FDCB6E]" />,
    rejected: <XCircle className="h-3 w-3 text-[#E17055]" />,
    processing: <Clock className="h-3 w-3 text-[#74B9FF]" />
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
        h1 { color: ${COLORS.primary}; text-align: center; border-bottom: 2px solid ${COLORS.primary}; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
        .stat-card { background: #f8fafc; padding: 16px; border-radius: 12px; border-right: 4px solid ${COLORS.primary}; }
        .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
        .stat-card .label { font-size: 12px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: ${COLORS.primary}; color: white; padding: 12px; text-align: right; }
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

  // ============================================================
  // 🚀 CHARTS SECTION - الألوان الزيتية الأصلية
  // ============================================================
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* 1. مخطط المبيعات */}
      {showSales && (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FF6B6B]/10 to-[#4ECDC4]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#45B7D1]/10 to-[#96CEB4]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '📈 تحليل المبيعات المتقدم' : '📈 Advanced Sales Analytics'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'الإيرادات والطلبات مع مؤشرات النمو الشهرية' : 'Revenue & orders with monthly growth indicators'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-white bg-[#0d2e2a] rounded-full shadow-lg animate-pulse">
                ↑ +12.5%
              </span>
              <span className="px-3 py-1 text-xs font-bold text-[#4ECDC4] bg-[#4ECDC4]/10 rounded-full border border-[#4ECDC4]/20">
                <Zap className="w-3 h-3 inline mr-1" />
                {app.lang === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>
          </div>
          
          <div className="h-[240px] relative">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.3}/>
                      <stop offset="50%" stopColor="#1a4f4a" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="#2d6b63" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation={isRTL ? 'left' : 'right'} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      background: 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px'
                    }}
                    formatter={(v: any) => typeof v === 'number' ? v.toLocaleString() : v}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} 
                    iconType="circle"
                    iconSize={8}
                  />
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0d2e2a" 
                    strokeWidth={3} 
                    fill="url(#revenueGrad)"
                    dot={{ fill: '#0d2e2a', r: 5, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#1a4f4a', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    filter="url(#glow)"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="orders" 
                    fill="#4a9f95" 
                    radius={[6,6,0,0]} 
                    barSize={28}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد بيانات مبيعات' : '📭 No sales data'}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t-2 border-[#0d2e2a]/20">
            {[
              { label: app.lang === 'ar' ? '🏆 أعلى إيراد' : '🏆 Peak Revenue', value: monthlyData.length > 0 ? formatPrice(Math.max(...monthlyData.map(d => d.revenue)), app.currency, app.lang) : formatPrice(0, app.currency, app.lang), color: 'text-[#0d2e2a]' },
              { label: app.lang === 'ar' ? '📊 متوسط الطلبات' : '📊 Avg Orders', value: monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.orders, 0) / monthlyData.length) : 0, color: 'text-[#1a4f4a]' },
              { label: app.lang === 'ar' ? '📈 معدل النمو' : '📈 Growth Rate', value: `+${monthlyData.length > 1 ? Math.round(((monthlyData[monthlyData.length-1].revenue - monthlyData[0].revenue) / (monthlyData[0].revenue || 1)) * 100) : 0}%`, color: 'text-[#4a9f95]' },
            ].map((item, i) => (
              <div key={i} className="text-center p-2 rounded-xl bg-[#0d2e2a]/5 border border-[#0d2e2a]/10 hover:scale-105 transition-transform duration-300">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Radar Chart - الألوان الزيتية */}
      {showSales && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#FFEAA7]/20 to-[#DDA0DD]/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '⭐ مؤشرات الأداء' : '⭐ Performance Score'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'تقييم شامل لأداء متجرك في 5 مجالات' : 'Comprehensive store rating across 5 areas'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="7" fill="none" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="url(#performanceGrad)" 
                    strokeWidth="7" 
                    fill="none"
                    strokeDasharray={`${(completionRate / 100) * 213.6} 213.6`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="performanceGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0d2e2a" />
                      <stop offset="50%" stopColor="#1a4f4a" />
                      <stop offset="100%" stopColor="#4a9f95" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800 dark:text-white">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            {performanceData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData} outerRadius={70}>
                  <PolarGrid stroke={RADAR_COLORS.grid} strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 8 }}
                    axisLine={false}
                  />
                  <Radar 
                    name={app.lang === 'ar' ? 'الأداء' : 'Performance'} 
                    dataKey="value" 
                    stroke={RADAR_COLORS.stroke} 
                    fill={RADAR_COLORS.fill} 
                    fillOpacity={0.6}
                    strokeWidth={2}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.98)',
                      padding: '8px 12px'
                    }}
                    formatter={(v: any) => `${v}%`}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد بيانات أداء' : '📭 No performance data'}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2 relative">
            {[
              { label: app.lang === 'ar' ? '💰 المبيعات' : '💰 Sales', value: `${performanceData[0]?.value || 0}%`, color: '#FF6B6B' },
              { label: app.lang === 'ar' ? '🏅 الجودة' : '🏅 Quality', value: `${performanceData[2]?.value || 0}%`, color: '#4ECDC4' },
              { label: app.lang === 'ar' ? '⭐ التقييم' : '⭐ Rating', value: `${performanceData[4]?.value || 0}%`, color: '#45B7D1' },
              { label: app.lang === 'ar' ? '⚡ السرعة' : '⚡ Speed', value: `${performanceData[3]?.value || 0}%`, color: '#96CEB4' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 border-2 border-[#0d2e2a]/10">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. توزيع الفئات - Pie Chart */}
      {showCategory && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#96CEB4]/20 to-[#FFEAA7]/20 rounded-full blur-3xl animate-pulse delay-500" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '📊 توزيع الفئات' : '📊 Category Distribution'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'توزيع الإيرادات حسب فئات المنتجات' : 'Revenue distribution by product categories'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[220px] relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {categoryData.map((_, i) => (
                      <linearGradient key={i} id={`pieColor_${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={PREMIUM_COLORS[i % PREMIUM_COLORS.length]} stopOpacity={1}/>
                        <stop offset="100%" stopColor={PREMIUM_COLORS[(i + 3) % PREMIUM_COLORS.length]} stopOpacity={0.7}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie 
                    data={categoryData} 
                    cx="50%" 
                    cy="45%" 
                    innerRadius={35} 
                    outerRadius={75} 
                    paddingAngle={3} 
                    dataKey="value"
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  >
                    {categoryData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={`url(#pieColor_${i})`} 
                        stroke="#0d2e2a" 
                        strokeWidth={2.5}
                        className="hover:opacity-80 transition-opacity duration-300 cursor-pointer hover:scale-105"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.98)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} 
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-3 animate-spin-slow">
                    <PieChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد بيانات' : '📭 No data'}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-3 pt-3 border-t-2 border-[#0d2e2a]/20">
            {categoryData.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-[#0d2e2a]/10 hover:scale-105 transition-transform duration-300">
                <span
                  className="w-3 h-3 rounded-full shadow-md"
                  style={{ backgroundColor: PREMIUM_COLORS[i % PREMIUM_COLORS.length] }}
                />
                <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate max-w-[60px] font-medium">
                  {item.name}
                </span>
                <span className="text-[10px] font-bold text-[#0d2e2a] dark:text-white">
                  {formatPrice(item.value, app.currency, app.lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. اتجاه الطلبات - Bar Chart */}
      {showOrders && (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#85C1E9]/20 to-[#F8C471]/20 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '📈 اتجاه الطلبات الشهرية' : '📈 Monthly Order Trends'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'عدد الطلبات خلال الأشهر الماضية' : 'Order count over past months'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-[#0d2e2a] bg-[#0d2e2a]/10 rounded-full border border-[#0d2e2a]/20">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +{monthlyData.length > 1 ? Math.round(((monthlyData[monthlyData.length-1]?.orders || 0) - (monthlyData[0]?.orders || 0)) / ((monthlyData[0]?.orders || 1)) * 100) : 0}%
              </span>
              <span className="px-3 py-1 text-xs font-bold text-white bg-[#0d2e2a] rounded-full shadow-lg">
                {totalOrders} {app.lang === 'ar' ? 'طلب' : 'orders'}
              </span>
            </div>
          </div>
          
          <div className="h-[200px] relative">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="ordersBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.9}/>
                      <stop offset="50%" stopColor="#1a4f4a" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#2d6b63" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.98)'
                    }}
                    formatter={(v: any) => `${v} ${app.lang === 'ar' ? 'طلب' : 'orders'}`}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="url(#ordersBarGrad)" 
                    radius={[6,6,0,0]} 
                    barSize={32}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-3 animate-spin-slow">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد بيانات' : '📭 No data'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. توزيع العملاء */}
      {showCustomers && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#BB8FCE]/20 to-[#F7DC6F]/20 rounded-full blur-3xl animate-pulse delay-500" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '👥 توزيع العملاء حسب المدينة' : '👥 Customer Distribution by City'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'توزيع العملاء حسب المدينة' : 'Customer distribution by city'}
                  </p>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-bold text-[#0d2e2a] bg-[#0d2e2a]/10 rounded-full border border-[#0d2e2a]/20">
              {totalCustomers} {app.lang === 'ar' ? 'عميل' : 'customers'}
            </span>
          </div>
          
          <div className="h-[200px] relative">
            {customerData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="customerBarGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.9}/>
                      <stop offset="50%" stopColor="#1a4f4a" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#4a9f95" stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" opacity={0.2} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.98)'
                    }}
                    formatter={(v: any) => `${v} ${app.lang === 'ar' ? 'عميل' : 'customers'}`}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#customerBarGrad)"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد بيانات' : '📭 No data'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. إحصائيات العملاء */}
      {showCustomers && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#F1948A]/20 to-[#98D8C8]/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '📊 إحصائيات العملاء' : '📊 Customer Insights'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'مؤشرات الأداء الرئيسية للعملاء' : 'Key customer performance indicators'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 relative">
            {[
              { label: app.lang === 'ar' ? '👥 إجمالي العملاء' : '👥 Total Customers', value: totalCustomers, icon: '👥', color: 'bg-[#0d2e2a]/10' },
              { label: app.lang === 'ar' ? '📦 متوسط الطلبات' : '📦 Avg Orders', value: totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : 0, icon: '📦', color: 'bg-[#1a4f4a]/10' },
              { label: app.lang === 'ar' ? '🎯 نسبة التحويل' : '🎯 Conversion', value: `${completionRate}%`, icon: '🎯', color: 'bg-[#2d6b63]/10' },
              { label: app.lang === 'ar' ? '💰 قيمة العميل' : '💰 Customer Value', value: totalCustomers > 0 ? formatPrice(totalRevenue / totalCustomers, app.currency, app.lang) : formatPrice(0, app.currency, app.lang), icon: '💰', color: 'bg-[#4a9f95]/10' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-xl p-3 text-center hover:scale-105 transition-all duration-300 border-2 border-[#0d2e2a]/20 shadow-md hover:shadow-xl`}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. توزيع التقييمات */}
      {showReviews && (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-gradient-to-br from-[#FFEAA7]/20 to-[#DDA0DD]/20 rounded-full blur-3xl animate-pulse delay-300" />
          
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    {app.lang === 'ar' ? '⭐ توزيع التقييمات' : '⭐ Reviews Distribution'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {app.lang === 'ar' ? 'توزيع تقييمات العملاء حسب عدد النجوم' : 'Customer ratings distribution by star count'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-[#0d2e2a] bg-[#0d2e2a]/10 rounded-full border border-[#0d2e2a]/20">
                ★ {reviewData.length > 0 ? (reviewData.reduce((sum, d) => sum + d.value, 0) > 0 ?
                  (reviewData.reduce((sum, d, i) => sum + d.value * (5 - i), 0) / reviewData.reduce((sum, d) => sum + d.value, 0)).toFixed(1) : '0.0') : '0.0'}
              </span>
              <span className="px-3 py-1 text-xs font-bold text-[#6bb5aa] bg-[#6bb5aa]/10 rounded-full border border-[#6bb5aa]/20">
                {reviewData.reduce((sum, d) => sum + d.value, 0)} {app.lang === 'ar' ? 'تقييم' : 'reviews'}
              </span>
            </div>
          </div>
          
          <div className="h-[200px] relative">
            {reviewData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reviewData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <defs>
                    {reviewData.map((_, i) => (
                      <linearGradient key={i} id={`reviewBar_${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PREMIUM_COLORS[i % PREMIUM_COLORS.length]} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={PREMIUM_COLORS[(i + 3) % PREMIUM_COLORS.length]} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '2px solid #0d2e2a', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      background: 'rgba(255,255,255,0.98)'
                    }}
                    formatter={(v: any) => `${v} ${app.lang === 'ar' ? 'تقييم' : 'reviews'}`}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[6,6,0,0]} 
                    barSize={40}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  >
                    {reviewData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={`url(#reviewBar_${i})`}
                        className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">{app.lang === 'ar' ? '📭 لا توجد تقييمات' : '📭 No reviews'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );

  // ============================================================
  // ✅ RENDER
  // ============================================================
  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 shadow-lg shadow-[#0d2e2a]/5">
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
        
        {/* ===== SLIDER ===== */}
        {!showSearchResults && (
          <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] shadow-2xl shadow-[#0d2e2a]/30 border border-[#4a9f95]/20 group min-h-[280px] mb-6">
            <div className="absolute inset-0 overflow-hidden bg-[#0d2e2a]">
              <img 
                src={sliderData[currentSlide]?.image || "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg"} 
                alt={sliderData[currentSlide]?.title || "Souqi"}
                className="w-full h-full object-contain object-center transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/70 to-[#1a4f4a]/50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/60 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
            </div>
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#4a9f95]/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#4a9f95]/10 blur-3xl animate-pulse delay-1000" />
            
            <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 z-10">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-20 w-20 md:h-28 md:w-28 rounded-3xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-5xl md:text-7xl shadow-2xl shadow-[#4a9f95]/20 animate-float group-hover:scale-110 transition-transform duration-500">
                    {sliderData[currentSlide]?.icon || "🏛️"}
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#4a9f95]/30 to-[#4a9f95]/0 blur-xl animate-pulse" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h1 className={`text-2xl md:text-4xl font-bold text-white mb-1 tracking-tight drop-shadow-lg ${isRTL ? 'font-arabic' : ''}`}>
                  {sliderData[currentSlide]?.title || "السوق لعندك"}
                </h1>
                <h2 className={`text-lg md:text-2xl font-bold text-[#4a9f95]/90 mb-2 tracking-tight drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
                  {sliderData[currentSlide]?.subtitle || "نظام إدارة السوق الذكي"}
                </h2>
                <p className={`text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
                  {sliderData[currentSlide]?.description || ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs">
                    {sliderData[currentSlide]?.badge || "✨ منصة متكاملة"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#4a9f95]/20 backdrop-blur-sm border border-[#4a9f95]/20 text-[#4a9f95] text-xs">
                    {sliderData[currentSlide]?.stat || "🚀 تحديثات لحظية"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs">
                    🔒 {app.lang === 'ar' ? 'آمن ومحمي' : 'Secure & Protected'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        currentSlide === index
                          ? "w-10 bg-[#4a9f95] shadow-lg shadow-[#4a9f95]/50"
                          : "w-1.5 bg-white/30 hover:bg-white/50"
                      )}
                    />
                  ))}
                  <span className="text-[10px] text-white/40 ml-2 font-mono">
                    {currentSlide + 1}/{totalSlides}
                  </span>
                </div>
              </div>
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
            <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-[#4a9f95]/50 to-transparent animate-shimmer" />
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

        {/* ===== SEARCH RESULTS ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { key: 'products', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, color: 'text-[#0d2e2a]', bg: 'bg-[#0d2e2a]/10' },
                { key: 'orders', label: app.lang === 'ar' ? 'الطلبات' : 'Orders', count: searchResults.orders, icon: ShoppingCart, color: 'text-[#1a4f4a]', bg: 'bg-[#1a4f4a]/10' },
                { key: 'customers', label: app.lang === 'ar' ? 'العملاء' : 'Customers', count: searchResults.customers, icon: Users, color: 'text-[#2d6b63]', bg: 'bg-[#2d6b63]/10' },
                { key: 'reviews', label: app.lang === 'ar' ? 'التقييمات' : 'Reviews', count: searchResults.reviews, icon: Star, color: 'text-[#4a9f95]', bg: 'bg-[#4a9f95]/10' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setTab(item.key as any);
                    setShowSearchResultsPage(false);
                  }}
                  className={`bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${
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
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-12 text-center shadow-lg">
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

        {/* ===== CONTENT ===== */}
        {!showSearchResults && (
          <div className="space-y-6">
            
            {/* ===== OVERVIEW ===== */}
            {tab === 'overview' && (
              <div>
                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { 
                      label: app.lang === 'ar' ? "💰 إجمالي الإيرادات" : "💰 Total Revenue", 
                      value: formatPrice(totalRevenue, app.currency, app.lang), 
                      icon: DollarSign, 
                      change: '+12.5%', 
                      color: 'text-[#0d2e2a]', 
                      bg: 'bg-[#0d2e2a]/10',
                      gradient: 'from-[#0d2e2a] to-[#1a4f4a]',
                    },
                    { 
                      label: app.lang === 'ar' ? "📦 إجمالي الطلبات" : "📦 Total Orders", 
                      value: totalOrders, 
                      icon: ShoppingCart, 
                      change: '+8.2%', 
                      color: 'text-[#1a4f4a]', 
                      bg: 'bg-[#1a4f4a]/10',
                      gradient: 'from-[#1a4f4a] to-[#2d6b63]',
                    },
                    { 
                      label: app.lang === 'ar' ? "👥 العملاء" : "👥 Customers", 
                      value: totalCustomers, 
                      icon: Users, 
                      change: '+5.3%', 
                      color: 'text-[#2d6b63]', 
                      bg: 'bg-[#2d6b63]/10',
                      gradient: 'from-[#2d6b63] to-[#4a9f95]',
                    },
                    { 
                      label: app.lang === 'ar' ? "📦 المنتجات" : "📦 Products", 
                      value: totalProducts, 
                      icon: Package, 
                      change: '+2.1%', 
                      color: 'text-[#4a9f95]', 
                      bg: 'bg-[#4a9f95]/10',
                      gradient: 'from-[#4a9f95] to-[#6bb5aa]',
                    },
                  ].map((stat, i) => (
                    <div key={i} className="group bg-white dark:bg-[#1e293b] rounded-xl p-5 border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
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
                        <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-[#0d2e2a]/20`}>
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

                {/* المنتجات والطلبات والعملاء */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* ===== أفضل المنتجات ===== */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
                    <div className={`px-5 py-4 border-b-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#0d2e2a] animate-pulse" />
                          {app.lang === 'ar' ? "📦 أفضل المنتجات" : "📦 Top Products"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {app.lang === 'ar' ? "الأكثر مبيعاً حسب الإيرادات" : "Best selling by revenue"}
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
                      {topProducts.map((product: any, idx: number) => (
                        <div key={idx} className={`px-5 py-3 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/20 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${['from-[#0d2e2a] to-[#1a4f4a]', 'from-[#1a4f4a] to-[#2d6b63]', 'from-[#2d6b63] to-[#4a9f95]', 'from-[#4a9f95] to-[#6bb5aa]', 'from-[#0d2e2a] to-[#2d6b63]'][idx]} flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300 border-2 border-[#0d2e2a]/30`}>
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

                  {/* ===== آخر الطلبات - رقم الطلب واضح ===== */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
                    <div className={`px-5 py-4 border-b-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-[#1a4f4a] animate-bounce-slow" />
                          {app.lang === 'ar' ? "📋 آخر الطلبات" : "📋 Recent Orders"}
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
                              <div className="h-8 w-8 rounded-lg bg-[#0d2e2a]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-[#0d2e2a]/20">
                                {/* ✅ رقم الطلب واضح مع إمكانية عرضه كامل */}
                                <span className="text-xs font-bold text-[#0d2e2a]" title={order.id}>
                                  #{String(order.id).slice(0, 8)}
                                </span>
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

                  {/* ===== العملاء - مع عدد الطلبات الحقيقي ===== */}
                  <div className="space-y-4">
                    <div className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 p-5 shadow-lg hover:shadow-2xl hover:shadow-[#2d6b63]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2d6b63]/5 blur-3xl animate-pulse" />
                      </div>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-3 w-3 text-[#2d6b63]" />
                            {app.lang === 'ar' ? "👥 العملاء" : "👥 Customers"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2d6b63] transition-colors">{totalCustomers}</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#2d6b63]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-[#2d6b63]/20">
                          <Users className="h-6 w-6 text-[#2d6b63]" />
                        </div>
                      </div>
                    </div>

                    {/* ✅ قائمة العملاء مع عدد الطلبات الحقيقي من قاعدة البيانات */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#0d2e2a]/30 dark:border-[#0d2e2a]/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
                      <div className={`px-4 py-3 border-b-2 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <UserPlus className="h-3 w-3 text-[#2d6b63]" />
                            {app.lang === 'ar' ? "👤 أحدث العملاء" : "👤 Recent Customers"}
                          </h3>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] text-[#2d6b63] hover:text-[#4a9f95] hover:bg-[#2d6b63]/10 transition-all"
                          onClick={() => setTab('customers')}
                        >
                          {app.lang === 'ar' ? "عرض الكل" : "View all"} 
                          <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[260px] overflow-y-auto">
                        {customersWithOrders.slice(0, 5).map((customer: any, idx: number) => (
                          <div key={idx} className={`px-4 py-3 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/20 transition-colors ${isRTL ? 'text-right' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {/* صورة العميل */}
                              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-[#0d2e2a]/20 group-hover:ring-[#0d2e2a]/50 transition-all duration-300">
                                {customer.avatar_url ? (
                                  <AvatarImage src={customer.avatar_url} alt={customer.display_name} className="object-cover" />
                                ) : (
                                  <AvatarFallback className="bg-gradient-to-br from-[#2d6b63] to-[#4a9f95] text-white text-sm font-bold">
                                    {customer.display_name?.charAt(0).toUpperCase() || 'ع'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {customer.display_name}
                                  </p>
                                  {customer.is_online && (
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                                  {customer.phone_number && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {customer.phone_number}
                                    </span>
                                  )}
                                  {customer.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate max-w-[80px]">{customer.email}</span>
                                    </span>
                                  )}
                                  {customer.city && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {customer.city}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                {/* ✅ عدد الطلبات الحقيقي من قاعدة البيانات */}
                                <p className="text-sm font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                                  {customer.total_orders || 0}
                                </p>
                                <p className="text-[8px] text-slate-400 uppercase tracking-wider">
                                  {app.lang === 'ar' ? 'طلبات' : 'orders'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {customersWithOrders.length === 0 && (
                          <div className="px-4 py-6 text-center">
                            <div className="h-12 w-12 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-2">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {app.lang === 'ar' ? 'لا يوجد عملاء حتى الآن' : 'No customers yet'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ===== CHARTS SECTION ===== */}
                <ChartsSection showSales={true} showCategory={true} showCustomers={true} />
              </div>
            )}

            {/* ===== PRODUCTS ===== */}
            {tab === 'products' && (
              <div className="space-y-6">
                <ProductsPage />
              </div>
            )}

            {/* ===== ORDERS ===== */}
            {tab === 'orders' && (
              <div className="space-y-6">
                <OrdersPage />
              </div>
            )}

            {/* ===== CUSTOMERS ===== */}
            {tab === 'customers' && (
              <div className="space-y-6">
                <CustomersPage />
              </div>
            )}

            {/* ===== STATS ===== */}
            {tab === 'stats' && (
              <div className="space-y-6">
                <StatsPage />
                <ChartsSection showSales={true} showCategory={true} showOrders={true} showCustomers={true} showReviews={true} />
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {tab === 'settings' && (
              <div className="space-y-6">
                <SettingsPage />
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

export default SellerDashboard;