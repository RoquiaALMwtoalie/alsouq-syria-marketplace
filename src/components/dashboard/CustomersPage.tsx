// src/components/dashboard/CustomersPage.tsx
import { useState, useMemo } from "react";
import { 
  Search, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, 
  RefreshCw, X, Filter, Users, User, Phone, ShoppingCart, DollarSign,
  TrendingUp, Award
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useSellerCustomers } from "@/lib/queries";
import { toast } from "sonner";
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

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c: any) => {
        const name = (c.full_name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(q) || phone.includes(q);
      });
    }

    // ترتيب حسب الخيار
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
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #3b82f6; color: white; padding: 12px; text-align: right; }
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

  return (
    <div className="space-y-5">
      {/* ===== العنوان ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            {app.lang === "ar" ? "العملاء" : "Customers"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? `إدارة جميع العملاء (${filteredCustomers.length} من ${rows.length})`
              : `Manage all customers (${filteredCustomers.length} of ${rows.length})`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500/50"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== إحصائيات سريعة ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { key: 'orders', label: app.lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { key: 'spend', label: app.lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spend', value: formatPrice(stats.totalSpend, app.currency, app.lang), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'avg', label: app.lang === 'ar' ? 'متوسط الطلبات' : 'Avg Orders', value: stats.avgOrders, icon: Award, color: 'text-orange-600', bg: 'bg-orange-500/10' },
        ].map((stat) => (
          <div key={stat.key} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== أفضل عميل ===== */}
      {stats.topCustomer && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/30 p-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Award className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {app.lang === 'ar' ? '🏆 أفضل عميل' : '🏆 Best Customer'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {stats.topCustomer.full_name || (app.lang === 'ar' ? 'عميل' : 'Customer')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? 'إجمالي الإنفاق: ' : 'Total Spend: '}
                {formatPrice(stats.topCustomer.spend || 0, app.currency, app.lang)}
                {' • '}
                {stats.topCustomer.orders || 0} {app.lang === 'ar' ? 'طلب' : 'orders'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== البحث والفلترة ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "بحث عن عميل..." : "Search customers..."}
            className="ps-9 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: any) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "ترتيب حسب" : "Sort by"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orders">{app.lang === "ar" ? "عدد الطلبات" : "Orders"}</SelectItem>
            <SelectItem value="spend">{app.lang === "ar" ? "الإنفاق" : "Spend"}</SelectItem>
            <SelectItem value="name">{app.lang === "ar" ? "الاسم" : "Name"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: any) => {
            setSortOrder(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <SelectValue placeholder={app.lang === "ar" ? "ترتيب" : "Order"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{app.lang === "ar" ? "تنازلي" : "Descending"}</SelectItem>
            <SelectItem value="asc">{app.lang === "ar" ? "تصاعدي" : "Ascending"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{app.lang === "ar" ? "عدد" : "Show"}</span>
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent>
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
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700"
        >
          <X className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== جدول العملاء ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-slate-50/50 dark:bg-slate-800/30">
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-slate-300" />
                      <p className="font-medium">{app.lang === "ar" ? "لا يوجد عملاء" : "No customers"}</p>
                      <p className="text-sm">{app.lang === "ar" ? "سيظهر العملاء هنا عند إجراء أول طلب" : "Customers will appear here after their first order"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedCustomers.map((c: any, index: number) => {
                const rank = (page - 1) * limit + index + 1;
                const rankColor = rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-orange-400' : 'text-slate-400';
                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
                
                return (
                  <TableRow key={c.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <TableCell className="font-semibold text-slate-900 dark:text-white text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {c.full_name || (app.lang === "ar" ? "عميل" : "Customer")}
                        {rank <= 3 && <span className="text-lg">{rankEmoji}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300 text-center font-mono" dir="ltr">
                      {c.phone || "—"}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-white text-center">
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200/30">
                        {c.orders || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 dark:text-emerald-400 text-center">
                      {formatPrice(c.spend || 0, app.currency, app.lang)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 text-center">
                      {c.last_order ? new Date(c.last_order).toLocaleDateString(
                        app.lang === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-bold ${rankColor}`}>
                        {rankEmoji}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
              >
                <span className="text-xs">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
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
                          ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300"
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
                      className="h-8 min-w-[32px] p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs"
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
              >
                <span className="text-xs">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {app.lang === "ar"
              ? `عرض ${paginatedCustomers.length} من ${filteredCustomers.length} عميل (إجمالي ${rows.length})`
              : `Showing ${paginatedCustomers.length} of ${filteredCustomers.length} customers (total ${rows.length})`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
              {sortBy === "orders" ? (app.lang === "ar" ? "الطلبات" : "Orders") :
               sortBy === "spend" ? (app.lang === "ar" ? "الإنفاق" : "Spend") :
               (app.lang === "ar" ? "الاسم" : "Name")}
              {sortOrder === "desc" ? " ↓" : " ↑"}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/30">
                🔍 {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}