// src/components/dashboard/SellerDashboard.tsx
import { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Calendar as CalendarIcon, Users, Star, BarChart3, Settings,
  ShoppingCart, DollarSign, Store, Clock, CheckCircle2, XCircle, TrendingUp,
  TrendingDown, Award, Target, Zap, Eye, Download, RefreshCw,
  UserPlus, AlertCircle, ChevronRight, MoreVertical, Search,
  Filter, ArrowUpRight, ArrowDownRight, X, FileSpreadsheet, FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyOrders, useMyListings, useSellerCustomers, useCategories } from "@/lib/queries";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

// ===== استيراد مكونات الصفحات =====
import { ProductsPage } from "./ProductsPage";
import { RecentOrders } from "./RecentOrders";
import { BookingsPage } from "./BookingsPage";
import { CustomersPage } from "./CustomersPage";
import { StatsPage } from "./StatsPage";
import { SettingsPage } from "./SettingsPage";

interface SellerDashboardProps {
  notificationButton: React.ReactNode;
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626'];

export function SellerDashboard({ notificationButton }: SellerDashboardProps) {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = useState(false);

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

  // ===== فلترة الحجوزات =====
  const filteredBookings = useMemo(() => {
    const bookings = sellerOrders.filter((o: any) => o.type === 'booking' || o.is_booking === true);
    return getFilteredData(bookings, ['id', 'product_name', 'customer_name', 'status'], searchQuery);
  }, [sellerOrders, searchQuery]);

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
      bookings: filteredBookings.length,
      reviews: filteredReviews.length,
      total: filteredListings.length + filteredOrders.length + filteredCustomers.length + filteredBookings.length + filteredReviews.length
    };
  }, [filteredListings, filteredOrders, filteredCustomers, filteredBookings, filteredReviews]);

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
      { tab: 'bookings', count: filteredBookings.length, label: app.lang === 'ar' ? 'الحجوزات' : 'Bookings' },
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
  const completedOrders = sellerOrders.filter((o: any) => o.status === 'completed').length;
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
    { name: app.lang === 'ar' ? 'مكتمل' : 'Completed', value: completedOrders, color: '#10b981' },
    { name: app.lang === 'ar' ? 'قيد المعالجة' : 'Pending', value: pendingOrders, color: '#f59e0b' },
    { name: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: cancelledOrders, color: '#ef4444' },
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

  // ===== قائمة التبويب =====
const nav = [
  { id: "overview" as const, label: app.lang === 'ar' ? "نظرة عامة" : "Overview", icon: LayoutDashboard },
  { id: "products" as const, label: app.lang === 'ar' ? "المنتجات" : "Products", icon: Package },
  { id: "orders" as const, label: app.lang === 'ar' ? "الطلبات" : "Orders", icon: ShoppingCart },
  { id: "bookings" as const, label: app.lang === 'ar' ? "الحجوزات" : "Bookings", icon: CalendarIcon },
  { id: "customers" as const, label: app.lang === 'ar' ? "العملاء" : "Customers", icon: Users },
  { id: "stats" as const, label: app.lang === 'ar' ? "الإحصائيات" : "Analytics", icon: BarChart3 },
  { id: "settings" as const, label: app.lang === 'ar' ? "الإعدادات" : "Settings", icon: Settings },
];

  const statusLabels: any = {
    completed: app.lang === 'ar' ? "مكتمل" : "Completed",
    pending: app.lang === 'ar' ? "قيد المعالجة" : "Pending",
    cancelled: app.lang === 'ar' ? "ملغي" : "Cancelled"
  };

  const statusBadge: any = {
    completed: <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
    pending: <Clock className="h-3 w-3 text-amber-500" />,
    cancelled: <XCircle className="h-3 w-3 text-rose-500" />
  };

  const isRTL = app.lang === 'ar';

  // ===== دوال التصدير =====
  
  // تصدير البيانات إلى Excel
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
    
    ws['!cols'] = [
      { wch: 15 }, // رقم الطلب
      { wch: 25 }, // المنتج
      { wch: 12 }, // الكمية
      { wch: 18 }, // الإجمالي
      { wch: 15 }, // الحالة
      { wch: 20 }, // التاريخ
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `تقرير_المبيعات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير التقرير إلى Excel" : "✅ Report exported to Excel");
  };

  // تصدير البيانات إلى Word
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
          .stat-card { background: #f8fafc; padding: 16px; border-radius: 12px; border-right: 4px solid #3b82f6; }
          .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .stat-card .label { font-size: 12px; color: #94a3b8; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #3b82f6; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير المبيعات</h1>
        <p style="text-align: center; color: #64748b;">
          البائع: ${app.user?.name || 'بائع'} | تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
        </p>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="value">${formatPrice(totalRevenue, app.currency, app.lang)}</div>
            <div class="label">${app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${totalOrders}</div>
            <div class="label">${app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${totalCustomers}</div>
            <div class="label">${app.lang === 'ar' ? 'العملاء' : 'Customers'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${completionRate}%</div>
            <div class="label">${app.lang === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate'}</div>
          </div>
        </div>

        <h2>📋 تفاصيل الطلبات</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>رقم الطلب</th>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
        <div class="footer">
          إجمالي الطلبات: ${sellerOrders.length} | تم التصدير من لوحة البائع
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `تقرير_المبيعات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير التقرير إلى Word" : "✅ Report exported to Word");
  };

  // ===== مكون الرسوم البيانية =====
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
      
      {showSales && (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#2563eb]" />
                {app.lang === 'ar' ? "تحليل المبيعات" : "Sales Analytics"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "الإيرادات والطلبات الشهرية" : "Monthly revenue & orders"}
              </p>
            </div>
          </div>
          <div className="h-[220px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation={isRTL ? 'left' : 'right'} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', background: 'white' }}
                    formatter={(v: any) => typeof v === 'number' ? v.toLocaleString() : v}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#g1)" />
                  <Bar yAxisId="right" dataKey="orders" fill="#7c3aed" radius={[4,4,0,0]} barSize={24} />
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

      {showCategory && (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#db2777]" />
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
                  <Pie data={categoryData} cx="50%" cy="45%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                    {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
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

      {showOrders && (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-[#7c3aed]" />
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
                    <Pie data={orderStatusData} cx="50%" cy="45%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                      {orderStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip 
                      formatter={(v: any) => v}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
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

          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
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
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', background: 'white' }}
                    />
                    <Bar dataKey="orders" fill="#7c3aed" radius={[4,4,0,0]} barSize={30} />
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

      {showCustomers && (
        <>
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-[#059669]" />
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
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', background: 'white' }}
                    />
                    <Bar dataKey="value" fill="#059669" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-[#059669]" />
                {app.lang === 'ar' ? "إحصائيات العملاء" : "Customer Stats"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "نظرة عامة" : "Overview"}
              </p>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{totalCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'متوسط الطلبات لكل عميل' : 'Avg orders/customer'}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{app.lang === 'ar' ? 'نسبة التحويل' : 'Conversion Rate'}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{completionRate}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {showReviews && (
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-[#f59e0b]" />
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
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', background: 'white' }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4,4,0,0]} barSize={40}>
                    {reviewData.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#10b981' : index === 1 ? '#34d399' : index === 2 ? '#fbbf24' : index === 3 ? '#f59e0b' : '#ef4444'} />
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
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg">
                {app.lang === 'ar' ? "لوحة البائع" : "Seller Panel"}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative hidden md:block">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {notificationButton}
            <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarFallback className="bg-[#2563eb] text-white text-xs">
                {app.user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 relative z-0">
        
        {/* ===== PAGE HEADER ===== */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {showSearchResults ? (
                <span className="flex items-center gap-3">
                  <span>{app.lang === 'ar' ? 'نتائج البحث' : 'Search Results'}</span>
                  <Badge className="bg-[#2563eb] text-white text-sm px-3 py-1">
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
                <span>{app.lang === 'ar' ? "مرحباً بعودتك" : "Welcome back"}, {app.user?.name || "Seller"}</span>
              )}
            </p>
          </div>
          
          {/* ===== أزرار التصدير ===== */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={sellerOrders.length === 0}
              className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              {app.lang === 'ar' ? "Excel" : "Excel"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToWord}
              disabled={sellerOrders.length === 0}
              className="rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500/50"
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
                { key: 'products', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, color: 'text-[#db2777]', bg: 'bg-[#db2777]/10' },
                { key: 'orders', label: app.lang === 'ar' ? 'الطلبات' : 'Orders', count: searchResults.orders, icon: ShoppingCart, color: 'text-[#7c3aed]', bg: 'bg-[#7c3aed]/10' },
                { key: 'customers', label: app.lang === 'ar' ? 'العملاء' : 'Customers', count: searchResults.customers, icon: Users, color: 'text-[#059669]', bg: 'bg-[#059669]/10' },
                { key: 'bookings', label: app.lang === 'ar' ? 'الحجوزات' : 'Bookings', count: searchResults.bookings, icon: CalendarIcon, color: 'text-[#d97706]', bg: 'bg-[#d97706]/10' },
                { key: 'reviews', label: app.lang === 'ar' ? 'التقييمات' : 'Reviews', count: searchResults.reviews, icon: Star, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setTab(item.key as any);
                    setShowSearchResultsPage(false);
                  }}
                  className={`bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 text-center hover:shadow-md transition-all hover:scale-[1.02] group ${
                    tab === item.key ? 'ring-2 ring-[#2563eb] border-[#2563eb]' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{item.count}</p>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <div className="mt-1 text-[10px] text-[#2563eb] font-medium">
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* ... باقي تفاصيل البحث ... */}
            </div>

            {searchResults.total === 0 && (
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
                <Button variant="outline" className="mt-4" onClick={clearSearch}>
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}

       {/* ===== TABS NAVIGATION - نسخة متجاوبة ===== */}
{!showSearchResults && (
  <div className="mb-6">
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      {/* ✅ Desktop: عرض أفقي */}
      <div className="hidden md:flex items-center p-1.5 gap-2 overflow-x-auto">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`
              flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 text-center justify-center
              ${tab === n.id 
                ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <n.icon className={`h-4 w-4 transition-all duration-300 ${tab === n.id ? 'scale-110' : ''}`} />
            <span>{n.label}</span>
            {tab === n.id && (
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" />
            )}
          </button>
        ))}
      </div>

      {/* ✅ Mobile: شبكة 2x4 مع أيقونات فقط */}
      <div className="md:hidden p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`
                flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-300
                ${tab === n.id 
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <n.icon className={`h-5 w-5 transition-all duration-300 ${tab === n.id ? 'scale-110' : ''}`} />
         <span className="text-[8px] leading-tight text-center max-w-full break-words">
  {n.label}
</span>
              {tab === n.id && (
                <span className="h-1 w-4 rounded-full bg-white/60 animate-pulse" />
              )}
            </button>
          ))}
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
                {/* ✅ بطاقات الإحصائيات - تظهر فقط في النظرة العامة */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { 
                      label: app.lang === 'ar' ? "إجمالي الإيرادات" : "Total Revenue", 
                      value: formatPrice(totalRevenue, app.currency, app.lang), 
                      icon: DollarSign, 
                      change: '+12.5%', 
                      color: 'text-[#2563eb]', 
                      bg: 'bg-[#2563eb]/10' 
                    },
                    { 
                      label: app.lang === 'ar' ? "إجمالي الطلبات" : "Total Orders", 
                      value: totalOrders, 
                      icon: ShoppingCart, 
                      change: '+8.2%', 
                      color: 'text-[#7c3aed]', 
                      bg: 'bg-[#7c3aed]/10' 
                    },
                    { 
                      label: app.lang === 'ar' ? "العملاء" : "Customers", 
                      value: totalCustomers, 
                      icon: Users, 
                      change: '+5.3%', 
                      color: 'text-[#059669]', 
                      bg: 'bg-[#059669]/10' 
                    },
                    { 
                      label: app.lang === 'ar' ? "المنتجات" : "Products", 
                      value: totalProducts, 
                      icon: Package, 
                      change: '+2.1%', 
                      color: 'text-[#db2777]', 
                      bg: 'bg-[#db2777]/10' 
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===== باقي محتوى النظرة العامة ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* المنتجات */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className={`px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#db2777]" />
                          {app.lang === 'ar' ? "المنتجات" : "Products"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {app.lang === 'ar' ? "الأكثر مبيعاً" : "Best selling"}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-[#2563eb] hover:text-[#1d4ed8]"
                        onClick={() => setTab('products')}
                      >
                        {app.lang === 'ar' ? "عرض الكل" : "View all"} 
                        <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
                      {topProducts.slice(0, 5).map((product: any, idx: number) => (
                        <div key={idx} className={`px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="h-8 w-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] font-bold text-xs">
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
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {formatPrice(product.revenue || 0, app.currency, app.lang)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* الطلبات */}
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className={`px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-[#7c3aed]" />
                          {app.lang === 'ar' ? "الطلبات" : "Orders"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {app.lang === 'ar' ? "آخر 5 طلبات" : "Last 5 orders"}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-[#2563eb] hover:text-[#1d4ed8]"
                        onClick={() => setTab('orders')}
                      >
                        {app.lang === 'ar' ? "عرض الكل" : "View all"} 
                        <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
                      {recentOrders.map((order: any, idx: number) => (
                        <div key={idx} className={`px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-500">#{String(order.id).slice(0, 4)}</span>
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
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
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
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-3 w-3 text-[#059669]" />
                            {app.lang === 'ar' ? "العملاء" : "Customers"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCustomers}</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#059669]/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#059669]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {app.lang === 'ar' ? "نسبة الإنجاز" : "Completion Rate"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionRate}%` }} />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : ''}>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {app.lang === 'ar' ? "متوسط قيمة الطلب" : "Avg Order Value"}
                          </p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatPrice(avgOrderValue, app.currency, app.lang)}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                          <Target className="h-6 w-6 text-[#2563eb]" />
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
            {tab === 'orders' && (
              <div className="space-y-6">
                <RecentOrders />
                <ChartsSection showOrders={true} />
              </div>
            )}

            {/* ===== تبويب الحجوزات ===== */}
            {tab === 'bookings' && (
              <div className="space-y-6">
                <BookingsPage />
                <ChartsSection showSales={true} />
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
    </div>
  );
}