// src/components/dashboard/admin/AdminOverview.tsx
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Package, Store, ShieldCheck, Search,
  ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, 
  BarChart3, Award, Target, TrendingUp, TrendingDown,
  Megaphone, Tags, Bell, FileSpreadsheet, FileText, Download,
  Sparkles, Printer
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
  useAdminAllStores as useAdminAllStoresQuery
} from "@/lib/queries";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const { saveAs } = fileSaver;
import { toast } from "sonner";

// ============================================================
// COLORS
// ============================================================
const CHART_COLORS = {
  blue: ['#3b82f6', '#60a5fa', '#93bbfc', '#bfdbfe'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
  green: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  orange: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  red: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  teal: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
  indigo: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  pink: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
};

interface AdminOverviewProps {
  onGoto: (tab: any) => void;
  searchQuery?: string;
}

export function AdminOverview({ onGoto, searchQuery = "" }: AdminOverviewProps) {
  const app = useApp();
  const { data: pending = [] } = useAllListingsAdmin("pending");
  const { data: all = [] } = useAllListingsAdmin();
  const { data: stores = [] } = useAdminAllStores();
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
      { name: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: pendingCount, color: CHART_COLORS.orange[0] },
      { name: app.lang === 'ar' ? 'مؤرشف' : 'Archived', value: archived, color: CHART_COLORS.red[0] },
    ];
  }, [all, app.lang]);

  const storeStatusData = useMemo(() => {
    const active = stores.filter((s: any) => s.store_active !== false).length;
    const banned = stores.filter((s: any) => s.store_active === false).length;
    return [
      { name: app.lang === 'ar' ? 'نشط' : 'Active', value: active, color: CHART_COLORS.green[0] },
      { name: app.lang === 'ar' ? 'محظور' : 'Banned', value: banned, color: CHART_COLORS.red[0] },
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

  // ===== إحصائيات سريعة من الداتابيز =====
  const quickStats = [
    { 
      label: app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', 
      value: formatPrice(totalRevenue, app.currency, app.lang),
      icon: DollarSign,
      change: `${growthData.isPositive ? '+' : ''}${growthData.growth}%`,
      changeType: growthData.isPositive ? 'up' : 'down',
      color: 'text-[#3b82f6]',
      bg: 'bg-[#3b82f6]/10'
    },
    { 
      label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', 
      value: totalOrders,
      icon: ShoppingCart,
      change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round((totalOrders / (sellerOrdersRaw.length || 1)) * 100) : 0}%`,
      changeType: totalOrders > 0 ? 'up' : 'down',
      color: 'text-[#8b5cf6]',
      bg: 'bg-[#8b5cf6]/10'
    },
    { 
      label: app.lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', 
      value: stores.length + all.length,
      icon: Users,
      change: `${stores.length > 0 ? '+' : ''}${stores.length > 0 ? Math.round((stores.length / (all.length || 1)) * 100) : 0}%`,
      changeType: stores.length > 0 ? 'up' : 'down',
      color: 'text-[#10b981]',
      bg: 'bg-[#10b981]/10'
    },
    { 
      label: app.lang === 'ar' ? 'متوسط الطلب' : 'Avg Order', 
      value: formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang),
      icon: Target,
      change: `${totalOrders > 0 ? '+' : ''}${totalOrders > 0 ? Math.round(((totalRevenue / totalOrders) / (totalRevenue / (totalOrders || 1))) * 100) : 0}%`,
      changeType: totalOrders > 0 ? 'up' : 'down',
      color: 'text-[#f59e0b]',
      bg: 'bg-[#f59e0b]/10'
    },
  ];

  // ===== إحصائيات إضافية من الداتابيز =====
  const additionalStats = [
    {
      label: app.lang === 'ar' ? 'البنرات النشطة' : 'Active Banners',
      value: activeBanners.length,
      icon: LayoutDashboard,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      label: app.lang === 'ar' ? 'الإعلانات النشطة' : 'Active Announcements',
      value: activeAnnouncements.length,
      icon: Megaphone,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      label: app.lang === 'ar' ? 'التصنيفات' : 'Categories',
      value: categories.length,
      icon: Tags,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/20'
    },
    {
      label: app.lang === 'ar' ? 'الإشعارات غير المقروءة' : 'Unread Notifications',
      value: unreadNotifications.length,
      icon: Bell,
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-950/20'
    },
  ];

  // ===== ✅ دوال التصدير =====

  // تصدير نظرة عامة إلى Excel
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
    
    ws['!cols'] = [
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `نظرة_عامة_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Excel" : "✅ Overview exported to Excel");
  };

  // تصدير نظرة عامة إلى Word
  const exportOverviewToWord = () => {
    const now = new Date().toLocaleDateString('ar-SA');
    
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 30px; background: #f8fafc; }
          .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0; opacity: 0.8; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 30px; }
          .stat-card { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #3b82f6; }
          .stat-card .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
          .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; margin: 4px 0; }
          .stat-card .change { font-size: 13px; }
          .stat-card .change.up { color: #10b981; }
          .stat-card .change.down { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #1e293b; color: white; padding: 12px; text-align: right; }
          td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right; }
          tr:hover { background: #f8fafc; }
          .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
          .badge-green { background: #dcfce7; color: #166534; }
          .badge-yellow { background: #fef3c7; color: #92400e; }
          .badge-red { background: #fee2e2; color: #991b1b; }
          .badge-blue { background: #dbeafe; color: #1e40af; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 تقرير نظرة عامة</h1>
          <p>${now} | لوحة تحكم سوريا كونكت</p>
        </div>

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
      htmlContent += `
        <div class="stat-card">
          <div class="label">${stat.label}</div>
          <div class="value">${stat.value}</div>
          <div class="change ${changeClass}">${stat.change}</div>
        </div>
      `;
    });

    htmlContent += `
        </div>

        <h2 style="margin-top: 30px; color: #1e293b; font-size: 18px;">📋 إحصائيات المنصة</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${app.lang === 'ar' ? 'المؤشر' : 'Indicator'}</th>
              <th>${app.lang === 'ar' ? 'القيمة' : 'Value'}</th>
              <th>${app.lang === 'ar' ? 'الحالة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
    `;

    const tableData = [
      { label: app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products', value: all.length, badge: 'badge-blue', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'منتجات بانتظار الموافقة' : 'Pending Products', value: pending.length, badge: 'badge-yellow', status: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending' },
      { label: app.lang === 'ar' ? 'إجمالي المتاجر' : 'Total Stores', value: stores.length, badge: 'badge-blue', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'طلبات بائعين جديدة' : 'Seller Applications', value: pendingApps.length, badge: 'badge-yellow', status: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending' },
      { label: app.lang === 'ar' ? 'البنرات النشطة' : 'Active Banners', value: activeBanners.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'الإعلانات النشطة' : 'Active Announcements', value: activeAnnouncements.length, badge: 'badge-green', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'التصنيفات' : 'Categories', value: categories.length, badge: 'badge-blue', status: app.lang === 'ar' ? 'نشط' : 'Active' },
      { label: app.lang === 'ar' ? 'الإشعارات غير المقروءة' : 'Unread Notifications', value: unreadNotifications.length, badge: unreadNotifications.length > 0 ? 'badge-red' : 'badge-green', status: unreadNotifications.length > 0 ? app.lang === 'ar' ? 'غير مقروءة' : 'Unread' : app.lang === 'ar' ? 'مقروءة' : 'Read' },
    ];

    tableData.forEach((item, index) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.label}</td>
          <td><strong>${item.value}</strong></td>
          <td><span class="badge ${item.badge}">${item.status}</span></td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>

        <div class="footer">
          تم التصدير من لوحة تحكم سوريا كونكت | ${now}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `نظرة_عامة_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Word" : "✅ Overview exported to Word");
  };

  return (
    <div className="space-y-6">
      
      {/* ===== العنوان مع أزرار التصدير ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {searchQuery.trim() ? (
              <span className="flex items-center gap-3">
                <span>{app.lang === "ar" ? 'نتائج البحث' : 'Search Results'}</span>
                <Badge className="bg-[#2563eb] text-white text-sm px-3 py-1">
                  {searchResults.total} {app.lang === 'ar' ? 'نتيجة' : 'results'}
                </Badge>
              </span>
            ) : (
              app.lang === "ar" ? "نظرة عامة" : "Overview"
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchQuery.trim() ? (
              <span>{app.lang === 'ar' ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"`}</span>
            ) : (
              app.lang === "ar" ? "إحصائيات وتحليلات المنصة" : "Platform statistics & analytics"
            )}
          </p>
        </div>

        {/* ✅ أزرار التصدير الاحترافية */}
        {!searchQuery.trim() && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportOverviewToExcel}
                className="rounded-lg h-9 px-4 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Excel</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportOverviewToWord}
                className="rounded-lg h-9 px-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Word</span>
              </Button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg h-9 px-3 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1.5 text-xs font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              {app.lang === 'ar' ? 'تقرير لحظي' : 'Live Report'}
            </Badge>
          </div>
        )}
      </div>

      {/* ===== عرض نتائج البحث ===== */}
      {searchQuery.trim() && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'products', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, color: 'text-[#db2777]', bg: 'bg-[#db2777]/10' },
            { key: 'stores', label: app.lang === 'ar' ? 'المتاجر' : 'Stores', count: searchResults.stores, icon: Store, color: 'text-[#059669]', bg: 'bg-[#059669]/10' },
            { key: 'applications', label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications', count: searchResults.applications, icon: ShieldCheck, color: 'text-[#7c3aed]', bg: 'bg-[#7c3aed]/10' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === 'products') onGoto('listings');
                else if (item.key === 'stores') onGoto('stores');
                else if (item.key === 'applications') onGoto('applications');
              }}
              className={`bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 text-center hover:shadow-md transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.count}</p>
                </div>
              </div>
              {item.count > 0 && (
                <div className="mt-1 text-xs text-[#2563eb] font-medium">
                  {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ===== إذا لم يتم العثور على نتائج ===== */}
      {searchQuery.trim() && searchResults.total === 0 && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-slate-400" />
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
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {stat.changeType === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
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
                color: 'from-yellow-500 to-orange-500',
                bg: 'bg-yellow-50 dark:bg-yellow-950/20',
                to: 'listings'
              },
              { 
                label: app.lang === 'ar' ? 'طلبات بائعين جديدة' : 'Seller Applications', 
                value: pendingApps.length, 
                icon: ShieldCheck,
                color: 'from-blue-500 to-indigo-600',
                bg: 'bg-blue-50 dark:bg-blue-950/20',
                to: 'applications'
              },
              { 
                label: app.lang === 'ar' ? 'إجمالي المتاجر' : 'Total Stores', 
                value: stores.length, 
                icon: Store,
                color: 'from-emerald-500 to-teal-600',
                bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                to: 'stores'
              },
              { 
                label: app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products', 
                value: all.length, 
                icon: LayoutDashboard,
                color: 'from-violet-500 to-purple-600',
                bg: 'bg-violet-50 dark:bg-violet-950/20',
                to: 'listings'
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onGoto(item.to as any)}
                className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-all hover:scale-[1.02] text-start group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition`}>
                    <item.icon className={`h-6 w-6 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (item.value / (all.length || 1)) * 100)}%` }} />
                </div>
              </button>
            ))}
          </div>

          {/* ===== الرسوم البيانية ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#3b82f6]" />
                    {app.lang === 'ar' ? "تحليل المبيعات" : "Sales Analytics"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === 'ar' ? "الإيرادات والطلبات الشهرية" : "Monthly revenue & orders"}
                  </p>
                </div>
              </div>
              <div className="h-[260px]">
                {monthlySalesData.length > 0 && monthlySalesData.some(d => d.revenue > 0 || d.orders > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlySalesData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
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
                        stroke="#3b82f6" 
                        strokeWidth={2.5} 
                        fill="url(#revenueGradient)"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="orders" 
                        name={app.lang === 'ar' ? "الطلبات" : "Orders"} 
                        fill="#8b5cf6" 
                        radius={[4,4,0,0]} 
                        barSize={24} 
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

            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-[#10b981]" />
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
                      >
                        {productStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(v: any) => v}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
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
            
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#14b8a6]" />
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
                      >
                        {storeStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
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

            <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#f59e0b]" />
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
                        <linearGradient id="sellerGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
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
                          border: 'none', 
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                          background: 'rgba(255,255,255,0.95)'
                        }}
                        formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#sellerGradient)" 
                        radius={[0, 4, 4, 0]} 
                        barSize={20}
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

          {/* ===== إحصائيات إضافية (كلها من الداتابيز) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {additionalStats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}