// src/components/dashboard/CustomersPage.tsx
import { useState, useMemo } from "react";
import { 
  Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, 
  RefreshCw, X, Filter, Users, User, Phone, ShoppingCart, DollarSign,
  TrendingUp, Award, Sparkles, Rocket, Crown, Star, Medal,
  ArrowUpRight, ArrowDownRight, Target, Zap, Shield, Heart
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

export function CustomersPage() {
  const app = useApp();
  const t = useT();
  const { data: rows = [], isLoading, refetch } = useSellerCustomers(app.user?.id);

  // ===== State للبحث والفلترة والـ Pagination =====
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"orders" | "spend" | "name">("orders");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ===== فلترة وترتيب العملاء =====
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

    result = [...result].sort((a: any, b: any) => {
      let aVal = a[sortBy] || 0;
      let bVal = b[sortBy] || 0;
      if (sortBy === 'name') {
        aVal = (a.full_name || '').toLowerCase();
        bVal = (b.full_name || '').toLowerCase();
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [rows, searchQuery, sortBy, sortOrder]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      { wch: 25 }, // الاسم
      { wch: 18 }, // رقم الهاتف
      { wch: 15 }, // عدد الطلبات
      { wch: 20 }, // إجمالي الإنفاق
      { wch: 20 }, // آخر طلب
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
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #2a655f; padding-bottom: 10px; }
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
                <Users className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {app.lang === "ar" ? "العملاء" : "Customers"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <ShoppingCart className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
              <span className="text-[#2a655f] font-medium">{stats.totalOrders}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "طلب" : "orders"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{formatPrice(stats.totalSpend, app.currency, app.lang)}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "إنفاق" : "spend"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== إحصائيات سريعة ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers', value: stats.total, icon: Users, color: 'text-[#2a655f]', bg: 'bg-[#2a655f]/10' },
          { key: 'orders', label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-[#3a8a82]', bg: 'bg-[#3a8a82]/10' },
          { key: 'spend', label: app.lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spend', value: formatPrice(stats.totalSpend, app.currency, app.lang), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'avg', label: app.lang === 'ar' ? 'متوسط الطلبات' : 'Avg Orders', value: stats.avgOrders, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className={`text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors`}>{stat.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== أفضل عميل ===== */}
      {stats.topCustomer && (
        <div className="bg-gradient-to-r from-[#2a655f]/10 via-[#2a655f]/5 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:via-[#2a655f]/10 dark:to-[#3a8a82]/20 rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                <Crown className="h-7 w-7 text-white animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                🏆
              </div>
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse" />
                {app.lang === 'ar' ? 'أفضل عميل' : 'Best Customer'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-[#2a655f] transition-colors">
                {stats.topCustomer.full_name || (app.lang === 'ar' ? 'عميل' : 'Customer')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  {formatPrice(stats.topCustomer.spend || 0, app.currency, app.lang)}
                </span>
                <span className="w-px h-3 bg-slate-300 dark:bg-slate-600" />
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3 text-[#2a655f]" />
                  {stats.topCustomer.orders || 0} {app.lang === 'ar' ? 'طلب' : 'orders'}
                </span>
              </p>
            </div>
            <div className="mr-auto">
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30 animate-pulse">
                ⭐ VIP
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* ===== البحث والفلترة ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "🔍 بحث عن عميل..." : "🔍 Search customers..."}
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: any) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "ترتيب حسب" : "Sort by"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="orders" className="hover:bg-[#2a655f]/10">{app.lang === "ar" ? "📦 عدد الطلبات" : "📦 Orders"}</SelectItem>
            <SelectItem value="spend" className="hover:bg-[#2a655f]/10">💰 {app.lang === "ar" ? "الإنفاق" : "Spend"}</SelectItem>
            <SelectItem value="name" className="hover:bg-[#2a655f]/10">👤 {app.lang === "ar" ? "الاسم" : "Name"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: any) => {
            setSortOrder(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <SelectValue placeholder={app.lang === "ar" ? "ترتيب" : "Order"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="desc" className="hover:bg-[#2a655f]/10">⬇️ {app.lang === "ar" ? "تنازلي" : "Descending"}</SelectItem>
            <SelectItem value="asc" className="hover:bg-[#2a655f]/10">⬆️ {app.lang === "ar" ? "تصاعدي" : "Ascending"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{app.lang === "ar" ? "عدد" : "Show"}</span>
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setSortBy("orders");
            setSortOrder("desc");
            setPage(1);
          }}
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== جدول العملاء ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[180px]">
                  {app.lang === "ar" ? "الاسم" : "Name"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[140px]">
                  {app.lang === "ar" ? "رقم الهاتف" : "Phone"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "الطلبات" : "Orders"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[140px]">
                  {app.lang === "ar" ? "الإنفاق" : "Spend"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "آخر طلب" : "Last Order"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[60px]">
                  {app.lang === "ar" ? "الترتيب" : "Rank"}
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
                  const rankColor = rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-400' : 'text-slate-400';
                  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
                  const rankBg = rank === 1 ? 'bg-amber-500/10' : rank === 2 ? 'bg-slate-300/10' : rank === 3 ? 'bg-orange-400/10' : 'bg-slate-100/30';
                  
                  return (
                    <TableRow 
                      key={c.id} 
                      className="border-slate-100 dark:border-slate-800 hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-colors duration-300 group"
                    >
                      <TableCell className="font-semibold text-slate-900 dark:text-white text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="group-hover:text-[#2a655f] transition-colors">
                            {c.full_name || (app.lang === "ar" ? "عميل" : "Customer")}
                          </span>
                          {rank <= 3 && (
                            <span className="text-lg animate-bounce">{rankEmoji}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300 text-center font-mono" dir="ltr">
                        {c.phone || "—"}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white text-center">
                        <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 group-hover:bg-[#2a655f]/20 transition-colors">
                          {c.orders || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-[#2a655f] dark:text-[#3a8a82] text-center group-hover:scale-110 transition-transform duration-300">
                        {formatPrice(c.spend || 0, app.currency, app.lang)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 text-center">
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
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredCustomers.length === 0 ? (
                <span>{app.lang === "ar" ? "لا يوجد عملاء" : "No customers"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} من ${filteredCustomers.length} عميل`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} of ${filteredCustomers.length} customers`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
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
                      className={`h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all ${
                        page === pageNum
                          ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25"
                          : "border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 hover:text-[#2a655f]"
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
                      className="h-8 min-w-[32px] p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 text-xs"
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-[#2a655f]/5">
          <span>
            {app.lang === "ar"
              ? `عرض ${paginatedCustomers.length} من ${filteredCustomers.length} عميل (إجمالي ${rows.length})`
              : `Showing ${paginatedCustomers.length} of ${filteredCustomers.length} customers (total ${rows.length})`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
              {sortBy === "orders" ? (app.lang === "ar" ? "📦 الطلبات" : "📦 Orders") :
               sortBy === "spend" ? (app.lang === "ar" ? "💰 الإنفاق" : "💰 Spend") :
               (app.lang === "ar" ? "👤 الاسم" : "👤 Name")}
              {sortOrder === "desc" ? " ↓" : " ↑"}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
                🔍 {searchQuery}
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