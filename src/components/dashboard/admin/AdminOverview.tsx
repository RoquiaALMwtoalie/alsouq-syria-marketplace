// src/components/dashboard/admin/AdminOverview.tsx

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Package, Store, ShieldCheck, Search,
  ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, 
  BarChart3, Award, Target, TrendingUp, TrendingDown,
  Megaphone, Tags, Bell, FileSpreadsheet, FileText, Download,
  Sparkles, Printer, Zap, Rocket, Gem, Crown, Activity,
  PieChart as PieChartIcon, LineChart as LineChartIcon, ShoppingBag, Star, Clock, CheckCircle,
} from "lucide-react";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { 
  useAllListingsAdmin, 
  useAdminAllStores, 
  useAllSellerApplications, 
  useMyOrders,
  useNotifications,
  useAllBanners,
  useAllAnnouncements,
  useCategories,
} from "@/lib/queries";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart, RadialBarChart, RadialBar,
} from 'recharts';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const { saveAs } = fileSaver;
import { toast } from "sonner";

// ============================================================
// 🟢 COLORS - فقط تدرجات الأخضر المعتمدة في النظام
// ============================================================
const CHART_COLORS = {
  green: ['#0d2e2a', '#1a4f4a', '#2d6b63', '#4a9f95', '#6bb5aa', '#8dcfc6'],
  light: ['#e8f5f3', '#d0ece8', '#b8e3dd', '#a0dad2', '#88d1c7'],
};

const GRADIENT_COLORS = {
  primary: 'from-[#0d2e2a] to-[#1a4f4a]',
  secondary: 'from-[#1a4f4a] to-[#2d6b63]',
  tertiary: 'from-[#2d6b63] to-[#4a9f95]',
  accent: 'from-[#4a9f95] to-[#6bb5aa]',
};

interface AdminOverviewProps {
  onGoto: (tab: any) => void;
  searchQuery?: string;
}

export function AdminOverview({ onGoto, searchQuery = "" }: AdminOverviewProps) {
  const app = useApp();
  const { data: pending = [] } = useAllListingsAdmin("pending");
  const { data: all = [] } = useAllListingsAdmin();
const { data: storesData } = useAdminAllStores();
const stores = storesData?.data || [];
  const { data: appsData } = useAllSellerApplications();
  const apps = appsData?.data || [];
  const { data: sellerOrdersRaw = [] } = useMyOrders();
  const { data: notifications = [] } = useNotifications(app.user?.id);
  const { data: banners = [] } = useAllBanners();
  const { data: announcements = [] } = useAllAnnouncements();
  const { data: categories = [] } = useCategories();
  
  const pendingApps = (apps as any[]).filter((a) => a.status === "pending");
  const activeBanners = banners.filter((b: any) => b.active !== false);
  const activeAnnouncements = announcements.filter((a: any) => a.active !== false);
  const unreadNotifications = notifications.filter((n: any) => !n.is_read);

  // فلترة البيانات حسب البحث
  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase().trim();
    return all.filter((p: any) => {
      const title = (app.lang === "ar" ? p.title_ar : p.title_en) || "";
      return title.toLowerCase().includes(q);
    });
  }, [all, searchQuery, app.lang]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase().trim();
    return stores.filter((s: any) => {
      return (s.store_name || "").toLowerCase().includes(q);
    });
  }, [stores, searchQuery]);

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const q = searchQuery.toLowerCase().trim();
    return apps.filter((a: any) => {
      return (a.store_name || "").toLowerCase().includes(q);
    });
  }, [apps, searchQuery]);

  // ===== بيانات حقيقية للرسوم البيانية =====
  const totalRevenue = sellerOrdersRaw.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const totalOrders = sellerOrdersRaw.length;

  // ===== حساب نسبة التغير الحقيقية =====
  const growthData = useMemo(() => {
    if (sellerOrdersRaw.length === 0) {
      return { growth: 0, isPositive: true };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthOrders = sellerOrdersRaw.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const lastMonthOrders = sellerOrdersRaw.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const currentTotal = currentMonthOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
    const lastTotal = lastMonthOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

    if (lastTotal === 0) return { growth: 100, isPositive: true };
    
    const growth = ((currentTotal - lastTotal) / lastTotal) * 100;
    return {
      growth: Math.round(growth * 10) / 10,
      isPositive: growth >= 0
    };
  }, [sellerOrdersRaw]);

  // ===== حساب إحصائيات الرسائل =====
  const unreadMessagesCount = useMemo(() => {
    return unreadNotifications.length;
  }, [unreadNotifications]);

  const monthlySalesData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const year = now.getFullYear() - (now.getMonth() - i < 0 ? 1 : 0);
      
      const monthOrders = sellerOrdersRaw.filter((o: any) => {
        const d = new Date(o.created_at);
        return d.getMonth() === monthIndex && d.getFullYear() === year;
      });
      
      const revenue = monthOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
      
      result.push({
        name: app.lang === 'ar' ? months[monthIndex] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex],
        revenue: Math.round(revenue),
        orders: monthOrders.length,
      });
    }
    return result;
  }, [sellerOrdersRaw, app.lang]);

  const productStatusData = useMemo(() => {
    const published = all.filter((p: any) => p.status === 'published').length;
    const pendingCount = all.filter((p: any) => p.status === 'pending').length;
    const archived = all.filter((p: any) => p.status === 'archived').length;
    return [
      { name: app.lang === 'ar' ? 'منشور' : 'Published', value: published, color: CHART_COLORS.green[0] },
      { name: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: pendingCount, color: CHART_COLORS.green[2] },
      { name: app.lang === 'ar' ? 'مؤرشف' : 'Archived', value: archived, color: CHART_COLORS.green[4] },
    ];
  }, [all, app.lang]);

  const storeStatusData = useMemo(() => {
    const active = stores.filter((s: any) => s.store_active !== false).length;
    const banned = stores.filter((s: any) => s.store_active === false).length;
    return [
      { name: app.lang === 'ar' ? 'نشط' : 'Active', value: active, color: CHART_COLORS.green[0] },
      { name: app.lang === 'ar' ? 'محظور' : 'Banned', value: banned, color: CHART_COLORS.green[4] },
    ];
  }, [stores, app.lang]);

  const topSellers = useMemo(() => {
    const sellerMap: { [key: string]: any } = {};
    sellerOrdersRaw.forEach((o: any) => {
      const sellerId = o.seller_id || 'unknown';
      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = { 
          name: o.seller_name || `بائع ${sellerId.slice(0, 4)}`, 
          revenue: 0, 
          orders: 0 
        };
      }
      sellerMap[sellerId].revenue += Number(o.total || 0);
      sellerMap[sellerId].orders += 1;
    });
    return Object.values(sellerMap)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sellerOrdersRaw]);

  const isRTL = app.lang === 'ar';

  const searchResults = {
    products: filteredAll.length,
    stores: filteredStores.length,
    applications: filteredApps.length,
    total: filteredAll.length + filteredStores.length + filteredApps.length
  };

  // ===== إحصائيات سريعة - كلها باللون الأخضر =====
  const quickStats = [
    { 
      label: app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', 
      value: formatPrice(totalRevenue, app.currency, app.lang),
      icon: DollarSign,
      change: `${growthData.isPositive ? '+' : ''}${growthData.growth}%`,
      changeType: growthData.isPositive ? 'up' : 'down',
      color: 'text-[#0d2e2a]',
      bg: 'bg-[#0d2e2a]/10',
      border: 'border-[#0d2e2a]/20',
      gradient: 'from-[#0d2e2a] to-[#1a4f4a]',
    },
    { 
      label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', 
      value: totalOrders,
      icon: ShoppingCart,
      change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round((totalOrders / (sellerOrdersRaw.length || 1)) * 100) : 0}%`,
      changeType: totalOrders > 0 ? 'up' : 'down',
      color: 'text-[#1a4f4a]',
      bg: 'bg-[#1a4f4a]/10',
      border: 'border-[#1a4f4a]/20',
      gradient: 'from-[#1a4f4a] to-[#2d6b63]',
    },
    { 
      label: app.lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', 
      value: stores.length + all.length,
      icon: Users,
      change: `${stores.length > 0 ? '+' : ''}${stores.length > 0 ? Math.round((stores.length / (all.length || 1)) * 100) : 0}%`,
      changeType: stores.length > 0 ? 'up' : 'down',
      color: 'text-[#2d6b63]',
      bg: 'bg-[#2d6b63]/10',
      border: 'border-[#2d6b63]/20',
      gradient: 'from-[#2d6b63] to-[#4a9f95]',
    },
    { 
      label: app.lang === 'ar' ? 'متوسط الطلب' : 'Avg Order', 
      value: formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang),
      icon: Target,
      change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round(((totalRevenue / totalOrders) / (totalRevenue / (totalOrders || 1))) * 100) : 0}%`,
      changeType: totalOrders > 0 ? 'up' : 'down',
      color: 'text-[#4a9f95]',
      bg: 'bg-[#4a9f95]/10',
      border: 'border-[#4a9f95]/20',
      gradient: 'from-[#4a9f95] to-[#6bb5aa]',
    },
  ];

  // ===== إحصائيات إضافية - كلها باللون الأخضر =====
  const additionalStats = [
    {
      label: app.lang === 'ar' ? 'البنرات النشطة' : 'Active Banners',
      value: activeBanners.length,
      icon: LayoutDashboard,
      gradient: 'from-[#0d2e2a] to-[#1a4f4a]',
      bg: 'bg-[#0d2e2a]/10',
    },
    {
      label: app.lang === 'ar' ? 'الإعلانات النشطة' : 'Active Announcements',
      value: activeAnnouncements.length,
      icon: Megaphone,
      gradient: 'from-[#1a4f4a] to-[#2d6b63]',
      bg: 'bg-[#1a4f4a]/10',
    },
    {
      label: app.lang === 'ar' ? 'التصنيفات' : 'Categories',
      value: categories.length,
      icon: Tags,
      gradient: 'from-[#2d6b63] to-[#4a9f95]',
      bg: 'bg-[#2d6b63]/10',
    },
    {
      label: app.lang === 'ar' ? 'الإشعارات غير المقروءة' : 'Unread Notifications',
      value: unreadNotifications.length,
      icon: Bell,
      gradient: 'from-[#4a9f95] to-[#6bb5aa]',
      bg: 'bg-[#4a9f95]/10',
    },
  ];

  // ===== ✅ دوال التصدير =====
  const exportOverviewToExcel = () => {
    const exportData = [
      {
        'المؤشر': app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
        'القيمة': formatPrice(totalRevenue, app.currency, app.lang),
        'التغير': `${growthData.isPositive ? '+' : ''}${growthData.growth}%`
      },
      {
        'المؤشر': app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
        'القيمة': totalOrders,
        'التغير': `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round((totalOrders / (sellerOrdersRaw.length || 1)) * 100) : 0}%`
      },
      {
        'المؤشر': app.lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
        'القيمة': stores.length + all.length,
        'التغير': `${stores.length > 0 ? '+' : ''}${stores.length > 0 ? Math.round((stores.length / (all.length || 1)) * 100) : 0}%`
      },
      {
        'المؤشر': app.lang === 'ar' ? 'متوسط الطلب' : 'Avg Order',
        'القيمة': formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang),
        'التغير': `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round(((totalRevenue / totalOrders) / (totalRevenue / (totalOrders || 1))) * 100) : 0}%`
      },
      {
        'المؤشر': app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products',
        'القيمة': all.length,
        'التغير': ''
      },
      {
        'المؤشر': app.lang === 'ar' ? 'المنتجات بانتظار الموافقة' : 'Pending Products',
        'القيمة': pending.length,
        'التغير': ''
      },
      {
        'المؤشر': app.lang === 'ar' ? 'إجمالي المتاجر' : 'Total Stores',
        'القيمة': stores.length,
        'التغير': ''
      },
      {
        'المؤشر': app.lang === 'ar' ? 'طلبات البائعين' : 'Seller Applications',
        'القيمة': pendingApps.length,
        'التغير': ''
      },
      {
        'المؤشر': app.lang === 'ar' ? 'البنرات النشطة' : 'Active Banners',
        'القيمة': activeBanners.length,
        'التغير': ''
      },
      {
        'المؤشر': app.lang === 'ar' ? 'الإعلانات النشطة' : 'Active Announcements',
        'القيمة': activeAnnouncements.length,
        'التغير': ''
      },
    ];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'نظرة عامة');
    ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `نظرة_عامة_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Excel" : "✅ Overview exported to Excel");
  };

  const exportOverviewToWord = () => {
    const now = new Date().toLocaleDateString('ar-SA');
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 30px; background: #f8fafc; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #0d2e2a, #1a4f4a); color: white; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0; opacity: 0.8; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #0d2e2a; }
        .stat-card .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
        .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; margin: 4px 0; }
        .stat-card .change { font-size: 13px; }
        .stat-card .change.up { color: #2d6b63; }
        .stat-card .change.down { color: #ef4444; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #0d2e2a; color: white; padding: 12px; text-align: right; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right; }
        tr:hover { background: #f8fafc; }
        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
        .badge-green { background: #d0ece8; color: #0d2e2a; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
      </style></head>
      <body>
        <div class="header"><h1>📊 تقرير نظرة عامة</h1><p>${now} | السوق لعندك</p></div>
        <div class="stats-grid">
    `;
    const statsItems = [
      { label: app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', value: formatPrice(totalRevenue, app.currency, app.lang), change: `${growthData.isPositive ? '+' : ''}${growthData.growth}%`, changeType: growthData.isPositive ? 'up' : 'down' },
      { label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: totalOrders, change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round((totalOrders / (sellerOrdersRaw.length || 1)) * 100) : 0}%`, changeType: totalOrders > 0 ? 'up' : 'down' },
      { label: app.lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: stores.length + all.length, change: `${stores.length > 0 ? '+' : ''}${stores.length > 0 ? Math.round((stores.length / (all.length || 1)) * 100) : 0}%`, changeType: stores.length > 0 ? 'up' : 'down' },
      { label: app.lang === 'ar' ? 'متوسط الطلب' : 'Avg Order', value: formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang), change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round(((totalRevenue / totalOrders) / (totalRevenue / (totalOrders || 1))) * 100) : 0}%`, changeType: totalOrders > 0 ? 'up' : 'down' },
    ];
    statsItems.forEach((stat) => {
      const changeClass = stat.changeType === 'up' ? 'up' : 'down';
      htmlContent += `<div class="stat-card"><div class="label">${stat.label}</div><div class="value">${stat.value}</div><div class="change ${changeClass}">${stat.change}</div></div>`;
    });
    htmlContent += `
        </div>
        <h2 style="margin-top: 30px; color: #1e293b; font-size: 18px;">📋 إحصائيات المنصة</h2>
        <table><thead><tr><th>#</th><th>${app.lang === 'ar' ? 'المؤشر' : 'Indicator'}</th><th>${app.lang === 'ar' ? 'القيمة' : 'Value'}</th><th>${app.lang === 'ar' ? 'الحالة' : 'Status'}</th></tr></thead><tbody>
    `;
    const tableData = [
      { label: app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products', value: all.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'منتجات بانتظار الموافقة' : 'Pending Products', value: pending.length, badge: 'badge-yellow', status: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending' },
      { label: app.lang === 'ar' ? 'إجمالي المتاجر' : 'Total Stores', value: stores.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'طلبات بائعين جديدة' : 'Seller Applications', value: pendingApps.length, badge: 'badge-yellow', status: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending' },
      { label: app.lang === 'ar' ? 'البنرات النشطة' : 'Active Banners', value: activeBanners.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'الإعلانات النشطة' : 'Active Announcements', value: activeAnnouncements.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'التصنيفات' : 'Categories', value: categories.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'الإشعارات غير المقروءة' : 'Unread Notifications', value: unreadNotifications.length, badge: unreadNotifications.length > 0 ? 'badge-red' : 'badge-green', status: unreadNotifications.length > 0 ? app.lang === 'ar' ? 'غير مقروءة' : 'Unread' : app.lang === 'ar' ? 'مقروءة' : 'Read' },
    ];
    tableData.forEach((item, index) => {
      htmlContent += `<tr><td>${index + 1}</td><td>${item.label}</td><td><strong>${item.value}</strong></td><td><span class="badge ${item.badge}">${item.status}</span></td></tr>`;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">تم التصدير من السوق لعندك | ${now}</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `نظرة_عامة_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Word" : "✅ Overview exported to Word");
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
      
      {/* ===== العنوان مع أزرار التصدير ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            {searchQuery.trim() ? (
              <span className="flex items-center gap-3">
                <span>{app.lang === "ar" ? 'نتائج البحث' : 'Search Results'}</span>
                <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white text-sm px-3 py-1 shadow-lg shadow-[#0d2e2a]/30">
                  {searchResults.total} {app.lang === 'ar' ? 'نتيجة' : 'results'}
                </Badge>
              </span>
            ) : (
              <>
                <span className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] bg-clip-text text-transparent">
                  {app.lang === "ar" ? "نظرة عامة" : "Overview"}
                </span>
                <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
                  <Activity className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
                  {app.lang === 'ar' ? 'مباشر' : 'Live'}
                </Badge>
              </>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {searchQuery.trim() ? (
              <span>{app.lang === 'ar' ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"`}</span>
            ) : (
              <>
                <span>{app.lang === "ar" ? "إحصائيات وتحليلات المنصة" : "Platform statistics & analytics"}</span>
                <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
                <span className="text-xs text-[#2d6b63] flex items-center gap-1">
                  <Zap className="h-3 w-3 animate-pulse" />
                  {app.lang === 'ar' ? 'تحديث لحظي' : 'Real-time'}
                </span>
              </>
            )}
          </p>
        </div>

        {/* ✅ أزرار التصدير */}
        {!searchQuery.trim() && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-[#0d2e2a]/20 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportOverviewToExcel}
                className="rounded-lg h-9 px-4 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:text-[#0d2e2a] gap-2 transition-all duration-300 hover:scale-105"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Excel</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportOverviewToWord}
                className="rounded-lg h-9 px-4 text-[#1a4f4a] hover:bg-[#1a4f4a]/10 hover:text-[#1a4f4a] gap-2 transition-all duration-300 hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Word</span>
              </Button>
              <div className="w-px h-6 bg-[#0d2e2a]/20" />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg h-9 px-3 text-slate-500 hover:bg-[#0d2e2a]/10 transition-all duration-300"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#0d2e2a]/30 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              {app.lang === 'ar' ? 'تقرير لحظي' : 'Live Report'}
            </Badge>
          </div>
        )}
      </div>

      {/* ===== عرض نتائج البحث ===== */}
      {searchQuery.trim() && (
        <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-top-5 duration-300">
          {[
            { key: 'products', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, gradient: 'from-[#0d2e2a] to-[#1a4f4a]' },
            { key: 'stores', label: app.lang === 'ar' ? 'المتاجر' : 'Stores', count: searchResults.stores, icon: Store, gradient: 'from-[#1a4f4a] to-[#2d6b63]' },
            { key: 'applications', label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications', count: searchResults.applications, icon: ShieldCheck, gradient: 'from-[#2d6b63] to-[#4a9f95]' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === 'products') onGoto('listings');
                else if (item.key === 'stores') onGoto('stores');
                else if (item.key === 'applications') onGoto('applications');
              }}
              className="group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-4 text-center hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-[#0d2e2a]/20 group-hover:scale-110 transition-all duration-300`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.count}</p>
                </div>
              </div>
              {item.count > 0 && (
                <div className="mt-2 text-xs text-[#2d6b63] font-medium group-hover:translate-x-1 transition-transform duration-300">
                  {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ===== إذا لم يتم العثور على نتائج ===== */}
      {searchQuery.trim() && searchResults.total === 0 && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#0d2e2a]/20 p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Search className="h-10 w-10 text-[#0d2e2a]/40" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {app.lang === 'ar' 
              ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` 
              : `No results match "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* ===== بطاقات الإحصائيات السريعة ===== */}
      {!searchQuery.trim() && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => (
              <div 
                key={i} 
                className="group bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-[#0d2e2a]/20 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
                </div>
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {stat.changeType === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-[#2d6b63] animate-bounce-slow" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.changeType === 'up' ? 'text-[#2d6b63]' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-3 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`} 
                    style={{ width: `${Math.min(Math.abs(parseFloat(stat.change) || 0) * 2, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ===== بطاقات حالة المنصة ===== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: app.lang === 'ar' ? 'منتجات بانتظار الموافقة' : 'Products Pending', 
                value: pending.length, 
                icon: Package,
                gradient: 'from-[#0d2e2a] to-[#1a4f4a]',
                bg: 'bg-[#0d2e2a]/10',
                to: 'listings',
                glow: 'shadow-[#0d2e2a]/20',
              },
              { 
                label: app.lang === 'ar' ? 'طلبات بائعين جديدة' : 'Seller Applications', 
                value: pendingApps.length, 
                icon: ShieldCheck,
                gradient: 'from-[#1a4f4a] to-[#2d6b63]',
                bg: 'bg-[#1a4f4a]/10',
                to: 'applications',
                glow: 'shadow-[#1a4f4a]/20',
              },
              { 
                label: app.lang === 'ar' ? 'إجمالي المتاجر' : 'Total Stores', 
                value: stores.length, 
                icon: Store,
                gradient: 'from-[#2d6b63] to-[#4a9f95]',
                bg: 'bg-[#2d6b63]/10',
                to: 'stores',
                glow: 'shadow-[#2d6b63]/20',
              },
              { 
                label: app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products', 
                value: all.length, 
                icon: LayoutDashboard,
                gradient: 'from-[#4a9f95] to-[#6bb5aa]',
                bg: 'bg-[#4a9f95]/10',
                to: 'listings',
                glow: 'shadow-[#4a9f95]/20',
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onGoto(item.to as any)}
                className="group bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-[#0d2e2a]/20 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all hover:scale-[1.02] text-start relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse`} />
                </div>
                <div className="flex items-center justify-between relative">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg ${item.glow}`}>
                    <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      <item.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`} 
                    style={{ width: `${Math.min(100, (item.value / (all.length || 1)) * 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-[#2d6b63] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {app.lang === 'ar' ? 'اضغط للعرض' : 'Click to view'} →
                </div>
              </button>
            ))}
          </div>

          {/* ===== الرسوم البيانية - كلها بتدرجات الأخضر ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ✅ مخطط المبيعات الشهرية */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''} relative`}>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4 text-[#0d2e2a] animate-float" />
                    {app.lang === 'ar' ? "تحليل المبيعات" : "Sales Analytics"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === 'ar' ? "الإيرادات والطلبات الشهرية" : "Monthly revenue & orders"}
                  </p>
                </div>
                <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20">
                  <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
                  {growthData.isPositive ? '+' : ''}{growthData.growth}%
                </Badge>
              </div>
              <div className="h-[260px] relative">
                {monthlySalesData.length > 0 && monthlySalesData.some(d => d.revenue > 0 || d.orders > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlySalesData}>
                      <defs>
                        <linearGradient id="revenueGradientGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d2e2a" stopOpacity={0.3}/>
                          <stop offset="50%" stopColor="#1a4f4a" stopOpacity={0.1}/>
                          <stop offset="100%" stopColor="#2d6b63" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="orderGradientGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4a9f95" stopOpacity={0.2}/>
                          <stop offset="100%" stopColor="#4a9f95" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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
                        name={app.lang === 'ar' ? "الإيرادات" : "Revenue"} 
                        stroke="#0d2e2a" 
                        strokeWidth={2.5} 
                        fill="url(#revenueGradientGreen)"
                        dot={{ fill: '#0d2e2a', r: 4 }}
                        activeDot={{ r: 6, fill: '#1a4f4a' }}
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="orders" 
                        name={app.lang === 'ar' ? "الطلبات" : "Orders"} 
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
                    {app.lang === 'ar' ? "لا توجد بيانات كافية" : "Insufficient data"}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ مخطط توزيع المنتجات */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#2d6b63]/5 blur-3xl animate-pulse delay-700" />
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-[#2d6b63] animate-spin-slow" />
                  {app.lang === 'ar' ? "توزيع المنتجات" : "Product Distribution"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {app.lang === 'ar' ? "حسب الحالة" : "By status"}
                </p>
              </div>
              <div className="h-[260px] mt-2">
                {productStatusData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={productStatusData} 
                        cx="50%" 
                        cy="45%" 
                        innerRadius={45} 
                        outerRadius={80} 
                        paddingAngle={3} 
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      >
                        {productStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
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
                    {app.lang === 'ar' ? "لا توجد منتجات" : "No products"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== صف ثاني من الرسوم ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ✅ حالة المتاجر */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1a4f4a]/5 blur-3xl animate-pulse delay-500" />
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#1a4f4a] animate-float" />
                  {app.lang === 'ar' ? "حالة المتاجر" : "Store Status"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {app.lang === 'ar' ? "نشط مقابل محظور" : "Active vs Banned"}
                </p>
              </div>
              <div className="h-[200px] mt-2">
                {storeStatusData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={storeStatusData} 
                        cx="50%" 
                        cy="45%" 
                        innerRadius={35} 
                        outerRadius={65} 
                        paddingAngle={3} 
                        dataKey="value"
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      >
                        {storeStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                        ))}
                      </Pie>
                      <Tooltip 
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
                    {app.lang === 'ar' ? "لا توجد متاجر" : "No stores"}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ أفضل البائعين */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#4a9f95]/5 blur-3xl animate-pulse delay-1000" />
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#4a9f95] animate-bounce-slow" />
                  {app.lang === 'ar' ? "أفضل البائعين" : "Top Sellers"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {app.lang === 'ar' ? "حسب الإيرادات" : "By revenue"}
                </p>
              </div>
              <div className="h-[200px] mt-2">
                {topSellers.length > 0 && topSellers.some((s: any) => s.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSellers} layout="vertical">
                      <defs>
                        <linearGradient id="sellerGradientGreen" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0d2e2a" />
                          <stop offset="50%" stopColor="#1a4f4a" />
                          <stop offset="100%" stopColor="#2d6b63" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 10, fill: '#94a3b8' }} 
                        axisLine={false} 
                        tickLine={false} 
                        width={80} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '1px solid #0d2e2a/20', 
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                          background: 'rgba(255,255,255,0.95)'
                        }}
                        formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#sellerGradientGreen)" 
                        radius={[0, 4, 4, 0]} 
                        barSize={20}
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    {app.lang === 'ar' ? "لا توجد مبيعات" : "No sales yet"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== إحصائيات إضافية - كلها بتدرجات الأخضر ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {additionalStats.map((stat, i) => (
              <div 
                key={i} 
                className="group bg-white dark:bg-[#1e293b] rounded-xl p-4 border border-[#0d2e2a]/20 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
                </div>
                <div className="flex items-center gap-3 relative">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#0d2e2a]/10`}>
                    <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-2 h-0.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`} 
                    style={{ width: `${Math.min(100, (stat.value / (all.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ===== شريط سفلي متحرك ===== */}
          <div className="relative w-full overflow-hidden rounded-xl border border-[#0d2e2a]/20 bg-gradient-to-r from-[#0d2e2a]/5 via-[#1a4f4a]/5 to-[#2d6b63]/5 p-3">
            <div className="flex items-center justify-center gap-6 animate-marquee-slow">
              <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <Rocket className="h-4 w-4 text-[#0d2e2a] animate-float" />
                {app.lang === 'ar' ? '🚀 السوق لعندك - منصة متكاملة' : '🚀 Souqi - Integrated Platform'}
              </span>
              <span className="text-[#0d2e2a]/20">|</span>
              <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <Gem className="h-4 w-4 text-[#2d6b63] animate-spin-slow" />
                {app.lang === 'ar' ? '💎 أداء عالي وسرعة فائقة' : '💎 High Performance & Speed'}
              </span>
              <span className="text-[#0d2e2a]/20">|</span>
              <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <ShieldCheck className="h-4 w-4 text-[#4a9f95] animate-pulse" />
                {app.lang === 'ar' ? '🛡️ آمن وموثوق' : '🛡️ Secure & Reliable'}
              </span>
            </div>
          </div>
        </>
      )}

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
        @keyframes marquee-slow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          animation: marquee-slow 20s linear infinite;
          width: 200%;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default AdminOverview;