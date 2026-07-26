// src/components/dashboard/RecentOrders.tsx
import { useState, useMemo } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, RefreshCw, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyOrders } from "@/lib/queries";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

function statusStyle(s: string) {
  return {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  }[s] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
}

const statusLabels: any = {
  pending: "قيد المعالجة",
  accepted: "مقبولة",
  completed: "مكتملة",
  rejected: "مرفوضة",
  cancelled: "ملغية",
};

interface RecentOrdersProps {
  full?: boolean;
}

export function RecentOrders({ full = false }: RecentOrdersProps) {
  const app = useApp();
  const t = useT();
  const { data: rows = [], isLoading, refetch } = useMyOrders(app.user?.id);

  // ===== State للبحث والفلترة والـ Pagination =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "completed" | "rejected" | "cancelled">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(full ? 10 : 5);

  // ===== فلترة الطلبات =====
  const filteredOrders = useMemo(() => {
    let result = rows;

    // فلترة حسب الحالة
    if (filterStatus !== "all") {
      result = result.filter((o: any) => o.status === filterStatus);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o: any) => {
        const id = String(o.id).toLowerCase();
        const title = (app.lang === "ar" ? o.listings?.title_ar : o.listings?.title_en || o.listings?.title_ar) || "";
        return id.includes(q) || title.toLowerCase().includes(q);
      });
    }

    return result;
  }, [rows, searchQuery, filterStatus, app.lang]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, page, limit]);

  // ===== إحصائيات =====
  const stats = {
    total: rows.length,
    pending: rows.filter((o: any) => o.status === "pending").length,
    accepted: rows.filter((o: any) => o.status === "accepted").length,
    completed: rows.filter((o: any) => o.status === "completed").length,
    rejected: rows.filter((o: any) => o.status === "rejected").length,
    cancelled: rows.filter((o: any) => o.status === "cancelled").length,
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
    const exportData = filteredOrders.map((o: any) => ({
      'رقم الطلب': String(o.id).slice(0, 8),
      'المنتج': app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar),
      'العميل': String(o.buyer_id).slice(0, 8),
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
      { wch: 20 }, // العميل
      { wch: 12 }, // الكمية
      { wch: 18 }, // الإجمالي
      { wch: 15 }, // الحالة
      { wch: 20 }, // التاريخ
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الطلبات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
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
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-accepted { color: #10b981; font-weight: bold; }
          .status-completed { color: #3b82f6; font-weight: bold; }
          .status-rejected { color: #ef4444; font-weight: bold; }
          .status-cancelled { color: #6b7280; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير الطلبات</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${filterStatus !== 'all' ? ` | الحالة: ${statusLabels[filterStatus] || filterStatus}` : ''}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>رقم الطلب</th>
              <th>المنتج</th>
              <th>العميل</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredOrders.forEach((o: any, index: number) => {
      const statusClass = `status-${o.status}`;
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${String(o.id).slice(0, 8)}</td>
          <td>${app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—'}</td>
          <td>${String(o.buyer_id).slice(0, 8)}</td>
          <td>${o.quantity || 1}</td>
          <td>${formatPrice(Number(o.total) || 0, app.currency, app.lang)}</td>
          <td class="${statusClass}">${statusLabels[o.status] || o.status}</td>
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
    saveAs(blob, `الطلبات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ===== عرض البيانات =====
  const displayOrders = full ? paginatedOrders : paginatedOrders.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* ===== العنوان ===== */}
      {full && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {app.lang === "ar" ? "الطلبات" : "Orders"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {app.lang === "ar"
                ? `إدارة جميع الطلبات (${filteredOrders.length} من ${rows.length})`
                : `Manage all orders (${filteredOrders.length} of ${rows.length})`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={filteredOrders.length === 0}
              className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToWord}
              disabled={filteredOrders.length === 0}
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
      )}

      {!full && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">
              {app.lang === "ar" ? "آخر الطلبات" : "Recent Orders"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "آخر 5 طلبات تمت" : "Last 5 orders"}
            </p>
          </div>
        </div>
      )}

      {/* ===== إحصائيات سريعة ===== */}
      {full && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { key: 'pending', label: app.lang === 'ar' ? 'قيد المعالجة' : 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
            { key: 'accepted', label: app.lang === 'ar' ? 'مقبولة' : 'Accepted', value: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
            { key: 'completed', label: app.lang === 'ar' ? 'مكتملة' : 'Completed', value: stats.completed, color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { key: 'rejected', label: app.lang === 'ar' ? 'مرفوضة' : 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-500/10' },
            { key: 'cancelled', label: app.lang === 'ar' ? 'ملغية' : 'Cancelled', value: stats.cancelled, color: 'text-gray-600', bg: 'bg-gray-500/10' },
          ].map((stat) => (
            <div key={stat.key} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
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
            placeholder={app.lang === "ar" ? "بحث عن طلب..." : "Search orders..."}
            className="ps-9 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "جميع الحالات" : "All status"}</SelectItem>
            <SelectItem value="pending">{app.lang === "ar" ? "قيد المعالجة" : "Pending"}</SelectItem>
            <SelectItem value="accepted">{app.lang === "ar" ? "مقبولة" : "Accepted"}</SelectItem>
            <SelectItem value="completed">{app.lang === "ar" ? "مكتملة" : "Completed"}</SelectItem>
            <SelectItem value="rejected">{app.lang === "ar" ? "مرفوضة" : "Rejected"}</SelectItem>
            <SelectItem value="cancelled">{app.lang === "ar" ? "ملغية" : "Cancelled"}</SelectItem>
          </SelectContent>
        </Select>

        {full && (
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
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
            setPage(1);
          }}
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700"
        >
          <X className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== جدول الطلبات ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-slate-50/50 dark:bg-slate-800/30">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  #ID
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[150px]">
                  {app.lang === "ar" ? "المنتج" : "Item"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[120px]">
                  {app.lang === "ar" ? "العميل" : "Customer"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  {app.lang === "ar" ? "الكمية" : "Qty"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الإجمالي" : "Total"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "التاريخ" : "Date"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[60px]">
                  {app.lang === "ar" ? "عرض" : "View"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && displayOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-medium">{app.lang === "ar" ? "لا توجد طلبات" : "No orders"}</p>
                      <p className="text-sm">{app.lang === "ar" ? "جميع الطلبات ستظهر هنا" : "All orders will appear here"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {displayOrders.map((o: any) => (
                <TableRow key={o.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <TableCell className="font-mono text-xs text-slate-500 text-center">
                    #{String(o.id).slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white text-right">
                    {app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar) || '—'}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300 text-right">
                    {String(o.buyer_id).slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-center text-slate-600 dark:text-slate-300">
                    {o.quantity || 1}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-600 dark:text-emerald-400 text-center">
                    {formatPrice(Number(o.total) || 0, app.currency, app.lang)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusStyle(o.status)}>
                      {statusLabels[o.status] || o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString(
                      app.lang === 'ar' ? 'ar-SA' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/10">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ===== Pagination ===== */}
        {full && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredOrders.length === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد طلبات" : "No orders"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredOrders.length)} من ${filteredOrders.length} طلب`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredOrders.length)} of ${filteredOrders.length} orders`}
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
        {full && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {app.lang === "ar"
                ? `عرض ${displayOrders.length} من ${filteredOrders.length} طلب (إجمالي ${rows.length})`
                : `Showing ${displayOrders.length} of ${filteredOrders.length} orders (total ${rows.length})`}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                {filterStatus === "all" ? (app.lang === "ar" ? "جميع" : "All") : statusLabels[filterStatus] || filterStatus}
              </Badge>
              {searchQuery && (
                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/30">
                  🔍 {searchQuery}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}