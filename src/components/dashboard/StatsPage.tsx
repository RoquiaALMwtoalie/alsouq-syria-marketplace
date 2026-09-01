// src/components/dashboard/StatsPage.tsx
import { useState, useMemo } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import { 
  Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, 
  RefreshCw, X, Filter, DollarSign, ShoppingCart, TrendingUp, 
  TrendingDown, Calendar, Award, Users, Package, Clock,
  Eye, Download, BarChart3, PieChart as PieChartIcon,
  CheckCircle2, Sparkles, Rocket, Zap, Target, Crown,
  ArrowUpRight, ArrowDownRight, Medal, Star, Gift, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyOrders, useMyListings } from "@/lib/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

const COLORS = ['#2a655f', '#3a8a82', '#4a9f95', '#5ab5a8', '#6acbbb', '#7ad8ca', '#2a655f', '#3a8a82'];

function buildRevenueChart(rows: any[], lang: "ar" | "en") {
  const labels = lang === "ar"
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      m: labels[d.getMonth()] ?? String(d.getMonth() + 1),
      revenue: 0,
      orders: 0,
    };
  });
  for (const row of rows) {
    const d = new Date(row.created_at);
    const item = months.find((month) => month.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (item) {
      item.revenue += Number(row.total) || 0;
      item.orders += 1;
    }
  }
  return months;
}

export function StatsPage() {
  const app = useApp();
  const t = useT();
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useMyOrders(app.user?.id);
  const { data: listings = [], refetch: refetchListings } = useMyListings(app.user?.id);

  // ===== State للبحث والفلترة =====
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<"all" | "3months" | "6months" | "year">("all");

  // ===== فلترة الطلبات حسب الوقت =====
  const filteredOrders = useMemo(() => {
    let result = orders;

    if (timeRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      if (timeRange === "3months") {
        startDate.setMonth(now.getMonth() - 3);
      } else if (timeRange === "6months") {
        startDate.setMonth(now.getMonth() - 6);
      } else if (timeRange === "year") {
        startDate.setFullYear(now.getFullYear() - 1);
      }
      result = result.filter((o: any) => new Date(o.created_at) >= startDate);
    }

    return result;
  }, [orders, timeRange]);

  // ===== إحصائيات =====
  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;
    const pendingOrders = filteredOrders.filter((o: any) => o.status === 'pending').length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    const totalProducts = listings.length;

    const sortedOrders = [...filteredOrders].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const growth = sortedOrders.length > 0 ? 
      ((sortedOrders[sortedOrders.length - 1]?.total || 0) - (sortedOrders[0]?.total || 0)) / (sortedOrders[0]?.total || 1) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      avgOrderValue,
      completionRate,
      totalProducts,
      growth: Math.round(growth * 10) / 10,
    };
  }, [filteredOrders, listings]);

  // ===== بيانات الرسوم البيانية =====
  const revenueChart = useMemo(() => {
    return buildRevenueChart(filteredOrders, app.lang);
  }, [filteredOrders, app.lang]);

  // ===== توزيع الطلبات حسب الحالة =====
  const orderStatusData = useMemo(() => {
    const statuses = ['pending', 'accepted', 'completed', 'rejected', 'cancelled'];
    const labels: any = {
      pending: app.lang === 'ar' ? 'قيد المعالجة' : 'Pending',
      accepted: app.lang === 'ar' ? 'مقبولة' : 'Accepted',
      completed: app.lang === 'ar' ? 'مكتملة' : 'Completed',
      rejected: app.lang === 'ar' ? 'مرفوضة' : 'Rejected',
      cancelled: app.lang === 'ar' ? 'ملغية' : 'Cancelled',
    };
    return statuses.map((s) => ({
      name: labels[s] || s,
      value: filteredOrders.filter((o: any) => o.status === s).length,
      color: s === 'pending' ? '#f59e0b' : s === 'accepted' ? '#10b981' : s === 'completed' ? '#3b82f6' : s === 'rejected' ? '#ef4444' : '#6b7280',
    }));
  }, [filteredOrders, app.lang]);

  // ===== المنتجات الأكثر مبيعاً =====
  const topProducts = useMemo(() => {
    const map: { [key: string]: any } = {};
    filteredOrders.forEach((o: any) => {
      const id = o.listing_id || 'unknown';
      if (!map[id]) {
        map[id] = { 
          id, 
          name: app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || `منتج ${id.slice(0, 4)}`,
          quantity: 0, 
          revenue: 0,
          orders: 0,
        };
      }
      map[id].quantity += Number(o.quantity) || 1;
      map[id].revenue += Number(o.total) || 0;
      map[id].orders += 1;
    });
    return Object.values(map)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders, app.lang]);

  // ===== المبيعات اليومية =====
  const dailySales = useMemo(() => {
    const map: { [key: string]: any } = {};
    filteredOrders.forEach((o: any) => {
      const date = new Date(o.created_at);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[key]) {
        map[key] = { date: key, revenue: 0, orders: 0 };
      }
      map[key].revenue += Number(o.total) || 0;
      map[key].orders += 1;
    });
    return Object.entries(map)
      .slice(-7)
      .map(([k, v]) => ({ date: k, revenue: Math.round(v.revenue), orders: v.orders }));
  }, [filteredOrders]);

  // ===== تصدير إلى Excel =====
  const exportToExcel = () => {
    const exportData = filteredOrders.map((o: any) => ({
      'رقم الطلب': String(o.id).slice(0, 8),
      'المنتج': app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—',
      'الكمية': o.quantity || 1,
      'الإجمالي': formatPrice(Number(o.total) || 0, app.currency, app.lang),
      'الحالة': o.status || '—',
      'التاريخ': new Date(o.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الإحصائيات');
    
    ws['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 20 },
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الإحصائيات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  // ===== تصدير إلى Word =====
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #2a655f; padding-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
          .stat-card { background: #f8fafc; padding: 16px; border-radius: 12px; border-right: 4px solid #2a655f; }
          .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
          .stat-card .label { font-size: 12px; color: #94a3b8; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير الإحصائيات</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${timeRange !== 'all' ? ` | المدة: ${timeRange}` : ''}
        </p>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="value">${formatPrice(stats.totalRevenue, app.currency, app.lang)}</div>
            <div class="label">${app.lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${stats.totalOrders}</div>
            <div class="label">${app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${stats.completionRate}%</div>
            <div class="label">${app.lang === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate'}</div>
          </div>
          <div class="stat-card">
            <div class="value">${formatPrice(stats.avgOrderValue, app.currency, app.lang)}</div>
            <div class="label">${app.lang === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</div>
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

    filteredOrders.slice(0, 20).forEach((o: any, index: number) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${String(o.id).slice(0, 8)}</td>
          <td>${app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—'}</td>
          <td>${o.quantity || 1}</td>
          <td>${formatPrice(Number(o.total) || 0, app.currency, app.lang)}</td>
          <td>${o.status || '—'}</td>
          <td>${new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي الطلبات: ${filteredOrders.length} | تم التصدير من لوحة البائع
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الإحصائيات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ===== حالة التحميل =====
  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {app.lang === "ar" ? "⏳ جاري تحميل الإحصائيات..." : "⏳ Loading analytics..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== العنوان ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#3a8a82]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <BarChart3 className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {app.lang === "ar" ? "الإحصائيات" : "Analytics"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {filteredOrders.length}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
               <Wallet className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
              <span className="text-[#2a655f] font-medium">{formatPrice(stats.totalRevenue, app.currency, app.lang)}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "إيرادات" : "revenue"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
              <ShoppingCart className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{stats.totalOrders}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "طلب" : "orders"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/50">
              <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-purple-600 font-medium">{stats.completionRate}%</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "إنجاز" : "completed"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredOrders.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredOrders.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchOrders();
              refetchListings();
            }}
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== بطاقات الإحصائيات ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          
          { 
            key: 'orders', 
            label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', 
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'text-[#3a8a82]',
            bg: 'bg-[#3a8a82]/10'
          },
          { 
            key: 'completion', 
            label: app.lang === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate', 
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-500/10'
          },
          { 
            key: 'avg', 
            label: app.lang === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value', 
            value: formatPrice(stats.avgOrderValue, app.currency, app.lang),
            icon: Award,
            color: 'text-orange-600',
            bg: 'bg-orange-500/10'
          },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{stat.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== إحصائيات إضافية ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { 
            key: 'completed', 
            label: app.lang === 'ar' ? 'الطلبات المكتملة' : 'Completed Orders', 
            value: stats.completedOrders,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10'
          },
          { 
            key: 'pending', 
            label: app.lang === 'ar' ? 'الطلبات المعلقة' : 'Pending Orders', 
            value: stats.pendingOrders,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-500/10'
          },
          { 
            key: 'products', 
            label: app.lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products', 
            value: stats.totalProducts,
            icon: Package,
            color: 'text-rose-600',
            bg: 'bg-rose-500/10'
          },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden text-center"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative">
              <div className={`h-7 w-7 rounded-lg ${stat.bg} flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== الفلترة ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={app.lang === "ar" ? "🔍 بحث في الإحصائيات..." : "🔍 Search analytics..."}
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
          />
        </div>

        <Select
          value={timeRange}
          onValueChange={(value: any) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[150px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "المدة" : "Period"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#2a655f]/10">{app.lang === "ar" ? "كل الوقت" : "All time"}</SelectItem>
            <SelectItem value="3months" className="hover:bg-[#2a655f]/10">📅 {app.lang === "ar" ? "آخر 3 شهور" : "Last 3 months"}</SelectItem>
            <SelectItem value="6months" className="hover:bg-[#2a655f]/10">📅 {app.lang === "ar" ? "آخر 6 شهور" : "Last 6 months"}</SelectItem>
            <SelectItem value="year" className="hover:bg-[#2a655f]/10">📅 {app.lang === "ar" ? "آخر سنة" : "Last year"}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setTimeRange("all");
          }}
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== الرسوم البيانية ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ===== رسم الإيرادات ===== */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <TrendingUp className="h-4 w-4 text-[#2a655f] animate-pulse" />
                </div>
                {app.lang === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? 'تطور الإيرادات خلال الأشهر الماضية' : 'Revenue trend over the past months'}
              </p>
            </div>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
              {app.lang === "ar" ? "آخر 6 شهور" : "Last 6 months"}
            </Badge>
          </div>
          <div className="h-[240px]">
            {revenueChart.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2a655f" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#2a655f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis dataKey="m" fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(42,101,95,0.15)',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                    formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2a655f" 
                    fill="url(#revenueGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#2a655f', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="h-10 w-10 text-slate-300" />
                  <p>{app.lang === 'ar' ? 'لا توجد بيانات كافية' : 'Insufficient data'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== توزيع الطلبات ===== */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#2a655f]/10">
                <PieChartIcon className="h-4 w-4 text-[#2a655f]" />
              </div>
              {app.lang === 'ar' ? 'توزيع الطلبات' : 'Order Distribution'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === 'ar' ? 'حسب الحالة' : 'By status'}
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(42,101,95,0.15)',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <PieChartIcon className="h-10 w-10 text-slate-300" />
                  <p>{app.lang === 'ar' ? 'لا توجد طلبات' : 'No orders'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== أفضل المنتجات ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#2a655f]/10">
                <Award className="h-4 w-4 text-[#2a655f] animate-bounce" />
              </div>
              {app.lang === 'ar' ? '🏆 أفضل المنتجات مبيعاً' : '🏆 Best Selling Products'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === 'ar' ? 'المنتجات الأعلى إيراداً' : 'Top revenue products'}
            </p>
          </div>
          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0">
            {topProducts.length} {app.lang === "ar" ? "منتج" : "products"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {topProducts.length > 0 ? (
            topProducts.map((product: any, index: number) => (
              <div 
                key={product.id} 
                className={cn(
                  "p-3 rounded-xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg group",
                  index === 0 
                    ? "border-amber-400 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-950/10" 
                    : "border-[#2a655f]/20 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 group-hover:scale-110",
                    index === 0 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30" 
                      : "bg-[#2a655f]/10 text-[#2a655f]"
                  )}>
                    #{index + 1}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[100px] group-hover:text-[#2a655f] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3 text-[#2a655f]" />
                      {product.orders || 0} {app.lang === 'ar' ? 'طلب' : 'orders'}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-1 text-center">
                  {formatPrice(product.revenue || 0, app.currency, app.lang)}
                </p>
                {index === 0 && (
                  <div className="flex justify-center mt-1">
                    <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center py-8 text-sm text-slate-500">
              <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2">
                <Package className="h-6 w-6 text-[#2a655f]/40" />
              </div>
              {app.lang === 'ar' ? 'لا توجد منتجات مبيعة' : 'No products sold yet'}
            </div>
          )}
        </div>
      </div>

      {/* ===== المبيعات اليومية ===== */}
      {dailySales.length > 0 && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <Calendar className="h-4 w-4 text-[#2a655f]" />
                </div>
                {app.lang === 'ar' ? 'المبيعات اليومية' : 'Daily Sales'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}
              </p>
            </div>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0">
              {dailySales.reduce((sum, d) => sum + d.orders, 0)} {app.lang === "ar" ? "طلب" : "orders"}
            </Badge>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <defs>
                  <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a655f" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#2a655f" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="date" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(42,101,95,0.15)',
                    background: 'rgba(255,255,255,0.95)'
                  }}
                  formatter={(v: any) => formatPrice(v, app.currency, app.lang)}
                />
                <Bar dataKey="revenue" fill="url(#dailyGradient)" radius={[4,4,0,0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 pt-4">
        <span className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
          {app.lang === "ar"
            ? `إجمالي الطلبات: ${filteredOrders.length} | إجمالي الإيرادات: ${formatPrice(stats.totalRevenue, app.currency, app.lang)}`
            : `Total orders: ${filteredOrders.length} | Total revenue: ${formatPrice(stats.totalRevenue, app.currency, app.lang)}`}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
            <Calendar className="h-3 w-3 mr-1" />
            {timeRange === "all" ? (app.lang === "ar" ? "كل الوقت" : "All time") :
             timeRange === "3months" ? (app.lang === "ar" ? "آخر 3 شهور" : "Last 3 months") :
             timeRange === "6months" ? (app.lang === "ar" ? "آخر 6 شهور" : "Last 6 months") :
             (app.lang === "ar" ? "آخر سنة" : "Last year")}
          </Badge>
          <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            {stats.growth > 0 ? '+' : ''}{stats.growth}%
          </Badge>
        </div>
      </div>
    </div>
  );
}

// ✅ إضافة CSS للحركات
const style = document.createElement('style');
style.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-slide {
    animation: slide 1.5s ease-in-out infinite;
  }
`;
document.head.appendChild(style);