// src/components/dashboard/CustomersPage.tsx
import { useState, useMemo, useEffect } from "react";
import { 
  Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, 
  RefreshCw, X, Filter, Users, User, Phone, ShoppingCart, DollarSign,
  TrendingUp, Award, Sparkles, Rocket, Crown, Star, Medal,
  ArrowUpRight, ArrowDownRight, Target, Zap, Shield, Heart, Wallet,
  Clock,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useSellerCustomers } from "@/lib/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
  fuchsiaGlow: 'rgba(216,27,96,0.2)',
};

export function CustomersPage() {
  const app = useApp();
  const t = useT();
  const { data: rows = [], isLoading, refetch } = useSellerCustomers(app.user?.id);

  // ===== State للبحث والفلترة والـ Pagination =====
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ============================================================
  // ✅ منع التمرير التلقائي عند تحميل المكون
  // ============================================================
  useEffect(() => {
    // ✅ حفظ موضع التمرير الحالي
    const currentScroll = window.scrollY;
    
    // ✅ منع أي تمرير تلقائي لمدة 300ms
    let isBlocking = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const preventScroll = () => {
      if (isBlocking) {
        window.scrollTo({ top: currentScroll, behavior: 'instant' });
      }
    };
    
    // ✅ إضافة مستمعين للأحداث
    window.addEventListener('scroll', preventScroll, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: true });
    window.addEventListener('touchmove', preventScroll, { passive: true });
    
    // ✅ تنفيذ فوري
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: 'instant' });
    });
    
    // ✅ إلغاء الحظر بعد 300ms
    timeoutId = setTimeout(() => {
      isBlocking = false;
      // ✅ استعادة الموضع النهائي
      window.scrollTo({ top: currentScroll, behavior: 'instant' });
    }, 300);
    
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // ===== فلترة العملاء =====
  const filteredCustomers = useMemo(() => {
    let result = rows;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c: any) => {
        const name = (c.full_name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(q) || phone.includes(q);
      });
    }

    return result;
  }, [rows, searchQuery]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredCustomers.length / limit);
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, page, limit]);

  // ===== إحصائيات =====
  const stats = {
    total: rows.length,
    totalOrders: rows.reduce((sum: number, c: any) => sum + (c.orders || 0), 0),
    totalSpend: rows.reduce((sum: number, c: any) => sum + (c.spend || 0), 0),
    avgOrders: rows.length > 0 ? Math.round((rows.reduce((sum: number, c: any) => sum + (c.orders || 0), 0) / rows.length) * 10) / 10 : 0,
    topCustomer: rows.length > 0 ? rows.reduce((a: any, b: any) => (a.spend || 0) > (b.spend || 0) ? a : b) : null,
  };

  // ===== تغيير الصفحة =====
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // ===== تصدير إلى Excel =====
  const exportToExcel = () => {
    const exportData = filteredCustomers.map((c: any) => ({
      'الاسم': c.full_name || '—',
      'رقم الهاتف': c.phone || '—',
      'عدد الطلبات': c.orders || 0,
      'إجمالي الإنفاق': formatPrice(c.spend || 0, app.currency, app.lang),
      'آخر طلب': c.last_order ? new Date(c.last_order).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US') : '—',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'العملاء');
    
    ws['!cols'] = [
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `العملاء_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
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
          h1 { color: #2a655f; text-align: center; border-bottom: 2px solid #f9a8d4; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
          .badge-gold { background: #fef3c7; color: #92400e; }
          .badge-silver { background: #f1f5f9; color: #475569; }
          .badge-bronze { background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير العملاء</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>عدد الطلبات</th>
              <th>إجمالي الإنفاق</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredCustomers.forEach((c: any, index: number) => {
      const badge = index === 0 ? '<span class="badge badge-gold">🥇</span>' : 
                     index === 1 ? '<span class="badge badge-silver">🥈</span>' : 
                     index === 2 ? '<span class="badge badge-bronze">🥉</span>' : '';
      
      htmlContent += `
        <tr>
          <td>${index + 1} ${badge}</td>
          <td>${c.full_name || '—'}</td>
          <td>${c.phone || '—'}</td>
          <td>${c.orders || 0}</td>
          <td>${formatPrice(c.spend || 0, app.currency, app.lang)}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي العملاء: ${filteredCustomers.length} | تم التصدير من لوحة البائع
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `العملاء_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ===== حالة التحميل المحسنة =====
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {app.lang === "ar" ? "⏳ جاري تحميل العملاء..." : "⏳ Loading customers..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ===== العنوان ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="relative min-w-0">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
              </div>
            </div>
            <span className="truncate">{app.lang === "ar" ? "العملاء" : "Customers"}</span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 animate-pulse shrink-0">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2a655f] animate-pulse" />
              <span className="text-[#2a655f] font-medium text-[10px] sm:text-xs">{stats.totalOrders}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{app.lang === "ar" ? "طلب" : "orders"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors">
              <Wallet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[10px] sm:text-xs">{formatPrice(stats.totalSpend, app.currency, app.lang)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">{app.lang === "ar" ? "إنفاق" : "spend"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs"
          >
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
            Word
          </Button>
         
        </div>
      </div>

      {/* ===== إحصائيات سريعة ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers', value: stats.total, icon: Users, gradient: 'from-[#2a655f] to-[#1a4f4a]' },
          { key: 'orders', label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, gradient: 'from-[#1a4f4a] to-[#3a8a82]' },
          { key: 'spend', label: app.lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spend', value: formatPrice(stats.totalSpend, app.currency, app.lang), icon: Wallet, gradient: 'from-emerald-500 to-teal-500' },
          { key: 'avg', label: app.lang === 'ar' ? 'متوسط الطلبات' : 'Avg Orders', value: stats.avgOrders, icon: Award, gradient: 'from-[#3a8a82] to-[#4a9f95]' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-2.5 sm:p-4"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-slate-100/50 dark:bg-slate-700/20 blur-3xl animate-pulse" />
            </div>
            <div className="flex items-center justify-between relative">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{stat.value}</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
                <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`} 
                style={{ width: `100%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== أفضل عميل ===== */}
      {stats.topCustomer && (
        <div className="bg-gradient-to-r from-[#2a655f]/10 via-[#2a655f]/5 to-[#f9a8d4]/10 dark:from-[#2a655f]/20 dark:via-[#2a655f]/10 dark:to-[#f9a8d4]/20 rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 group-hover:scale-110 transition-transform duration-500">
                <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#f9a8d4] flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-[#2a655f] animate-pulse border-2 border-white">
                🏆
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-[#2a655f] dark:text-[#f9a8d4] font-medium flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse text-[#f9a8d4]" />
                {app.lang === 'ar' ? 'أفضل عميل' : 'Best Customer'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#2a655f] transition-colors truncate">
                {stats.topCustomer.full_name || (app.lang === 'ar' ? 'عميل' : 'Customer')}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-emerald-500" />
                  {formatPrice(stats.topCustomer.spend || 0, app.currency, app.lang)}
                </span>
                <span className="w-px h-3 bg-slate-300 dark:bg-slate-600" />
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3 text-[#2a655f]" />
                  {stats.topCustomer.orders || 0} {app.lang === 'ar' ? 'طلب' : 'orders'}
                </span>
              </p>
            </div>
            <div className="shrink-0">
              <Badge className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-2 border-white/30 shadow-lg shadow-[#2a655f]/30 animate-pulse text-[10px] sm:text-xs">
                ⭐ VIP
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ✅ SEARCH & FILTERS - محسّن للموبايل */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm">
        
        {/* ✅ الصف الأول: البحث */}
        <div className="relative group mb-3">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "🔍 بحث عن عميل..." : "🔍 Search customers..."}
            className="ps-9 pe-9 h-10 sm:h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setPage(1); }}
              className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
              aria-label={app.lang === "ar" ? "مسح البحث" : "Clear search"}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ✅ الصف الثاني: الفلاتر في Grid متجاوب */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2">
          
          {/* Limit */}
          <div className="col-span-1 md:col-span-3">
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] sm:text-xs text-slate-400 shrink-0">{app.lang === "ar" ? "عدد" : "Show"}</span>
                  <SelectValue placeholder="10" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700">
                <SelectItem value="6" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">6</SelectItem>
                <SelectItem value="10" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">10</SelectItem>
                <SelectItem value="20" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">20</SelectItem>
                <SelectItem value="50" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">50</SelectItem>
                <SelectItem value="100" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear All Button */}
          <div className="col-span-1 md:col-span-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group text-xs"
            >
              <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
              {app.lang === "ar" ? "مسح الكل" : "Clear all"}
            </Button>
          </div>
        </div>

        {/* ✅ عداد النتائج */}
        {searchQuery && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" 
                ? `📊 ${filteredCustomers.length} نتيجة من أصل ${rows.length}`
                : `📊 ${filteredCustomers.length} of ${rows.length} results`}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="text-[11px] sm:text-xs text-[#2a655f] hover:text-[#d81b60] font-medium transition-colors"
            >
              {app.lang === "ar" ? "إعادة تعيين" : "Reset"}
            </button>
          </div>
        )}
      </div>

      {/* ===== جدول العملاء ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[180px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2 justify-end">
                    <User className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "الاسم" : "Name"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "رقم الهاتف" : "Phone"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "الطلبات" : "Orders"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Wallet className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "الإنفاق" : "Spend"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "آخر طلب" : "Last Order"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[60px]">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {app.lang === "ar" ? "الترتيب" : "Rank"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center">
                        <Users className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {app.lang === "ar" ? "لا يوجد عملاء" : "No customers"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {app.lang === "ar" ? "سيظهر العملاء هنا عند إجراء أول طلب" : "Customers will appear here after their first order"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((c: any, index: number) => {
                  const rank = (page - 1) * limit + index + 1;
                  const rankColor = rank === 1 ? 'text-[#2a655f]' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-[#f9a8d4]' : 'text-slate-400';
                  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
                  const rankBg = rank === 1 ? 'bg-[#2a655f]/10' : rank === 2 ? 'bg-slate-300/10' : rank === 3 ? 'bg-[#f9a8d4]/20' : 'bg-slate-100/30';
                  
                  return (
                    <TableRow 
                      key={c.id} 
                      className="border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60"
                    >
                      <TableCell className="font-semibold text-slate-900 dark:text-white text-right border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="group-hover:text-[#2a655f] transition-colors">
                            {c.full_name || (app.lang === "ar" ? "عميل" : "Customer")}
                          </span>
                          {rank <= 3 && (
                            <span className="text-lg animate-bounce">{rankEmoji}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300 text-center font-mono border-r-2 border-slate-200/60 dark:border-slate-700/60" dir="ltr">
                        {c.phone || "—"}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                          {c.orders || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-[#2a655f] dark:text-slate-300 text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        {formatPrice(c.spend || 0, app.currency, app.lang)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        {c.last_order ? new Date(c.last_order).toLocaleDateString(
                          app.lang === 'ar' ? 'ar-SA' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${rankBg} ${rankColor} font-bold text-sm transition-all duration-300 group-hover:scale-110`}>
                          {rankEmoji}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-start w-full sm:w-auto">
              {filteredCustomers.length === 0 ? (
                <span>{app.lang === "ar" ? "لا يوجد عملاء" : "No customers"}</span>
              ) : (
                <span className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" />
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} من ${filteredCustomers.length} عميل`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} of ${filteredCustomers.length} customers`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={`h-8 min-w-[30px] sm:min-w-[32px] p-0 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300 ${
                        page === pageNum
                          ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105"
                          : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="text-slate-400 text-sm px-1">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                      className="h-8 min-w-[30px] sm:min-w-[32px] p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all duration-300"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
              {app.lang === "ar"
                ? `عرض ${paginatedCustomers.length} من ${filteredCustomers.length}`
                : `Showing ${paginatedCustomers.length} of ${filteredCustomers.length}`}
            </Badge>
            <span className="text-[10px] text-[#d81b60]">
              {app.lang === "ar" ? `إجمالي ${rows.length}` : `Total ${rows.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {searchQuery && (
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
                <Search className="h-3 w-3 mr-1 text-[#d81b60]" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ إضافة CSS للحركات (في نهاية الملف)
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