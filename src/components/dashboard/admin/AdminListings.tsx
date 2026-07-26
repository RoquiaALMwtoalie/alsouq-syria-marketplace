// src/components/dashboard/admin/AdminListings.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import {
  useAllListingsAdmin,
  useSetListingStatus,
  useAdminDeleteListing,
  useSetListingFeatured,
} from "@/lib/queries";
import { toast } from "sonner";
import { 
  CheckCircle2, XCircle, Clock, Trash2, Flame, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Package, Store, DollarSign,
  Eye, Sparkles, Layers
} from "lucide-react";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const { saveAs } = fileSaver;
export function AdminListings() {
  const app = useApp();
  const [status, setStatus] = useState<"pending" | "published" | "archived" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data: rows = [], isLoading, refetch } = useAllListingsAdmin(status === "all" ? undefined : status);
  const setStatusMut = useSetListingStatus();
  const del = useAdminDeleteListing();
  const setFeatured = useSetListingFeatured();

  // ✅ فلترة حسب البحث
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase().trim();
    return rows.filter((r: any) => {
      const title = (app.lang === "ar" ? r.title_ar : r.title_en) || "";
      const storeName = r.profiles?.store_name || r.profiles?.full_name || "";
      return title.toLowerCase().includes(q) || storeName.toLowerCase().includes(q);
    });
  }, [rows, searchQuery, app.lang]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredRows.length / limit);
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, limit]);

  // ✅ إحصائيات
  const stats = {
    total: rows.length,
    pending: rows.filter((r: any) => r.status === "pending").length,
    published: rows.filter((r: any) => r.status === "published").length,
    archived: rows.filter((r: any) => r.status === "archived").length,
    featured: rows.filter((r: any) => r.is_featured === true).length,
  };

  // ✅ تغيير الصفحة
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ تصدير إلى Excel
  const exportToExcel = () => {
    const exportData = filteredRows.map((r: any) => ({
      'اسم المنتج': app.lang === "ar" ? r.title_ar : (r.title_en || r.title_ar),
      'المتجر': r.profiles?.store_name || r.profiles?.full_name || '—',
      'السعر': `${r.price} ${r.currency}`,
      'التصنيف': r.categories?.[app.lang === "ar" ? "name_ar" : "name_en"] || '—',
      'الحالة': r.status === 'pending' ? 'قيد المراجعة' : r.status === 'published' ? 'منشور' : 'مؤرشف',
      'رائج': r.is_featured ? 'نعم' : 'لا',
      'تاريخ الإضافة': new Date(r.created_at).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    
    ws['!cols'] = [
      { wch: 30 }, // اسم المنتج
      { wch: 25 }, // المتجر
      { wch: 15 }, // السعر
      { wch: 20 }, // التصنيف
      { wch: 18 }, // الحالة
      { wch: 12 }, // رائج
      { wch: 20 }, // تاريخ الإضافة
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  // ✅ تصدير إلى Word
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
          .status-published { color: #10b981; font-weight: bold; }
          .status-archived { color: #ef4444; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير المنتجات</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${status !== 'all' ? ` | الحالة: ${status}` : ''}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المنتج</th>
              <th>المتجر</th>
              <th>السعر</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>رائج</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredRows.forEach((r: any, index: number) => {
      const statusClass = r.status === 'pending' ? 'status-pending' : r.status === 'published' ? 'status-published' : 'status-archived';
      const statusText = r.status === 'pending' ? 'قيد المراجعة' : r.status === 'published' ? 'منشور' : 'مؤرشف';
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${app.lang === "ar" ? r.title_ar : (r.title_en || r.title_ar)}</td>
          <td>${r.profiles?.store_name || r.profiles?.full_name || '—'}</td>
          <td>${r.price} ${r.currency}</td>
          <td>${r.categories?.[app.lang === "ar" ? "name_ar" : "name_en"] || '—'}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${r.is_featured ? '✅ نعم' : '—'}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي المنتجات: ${filteredRows.length} | تم التصدير من لوحة التحكم
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            {app.lang === "ar" ? "إدارة المنتجات" : "Products"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? `إدارة جميع المنتجات (${filteredRows.length} من ${rows.length})`
              : `Manage all products (${filteredRows.length} of ${rows.length})`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredRows.length === 0}
            className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredRows.length === 0}
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

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { 
            key: "total", 
            label: app.lang === "ar" ? "إجمالي المنتجات" : "Total Products", 
            value: stats.total,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-500/10"
          },
          { 
            key: "pending", 
            label: app.lang === "ar" ? "قيد المراجعة" : "Pending", 
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-500/10"
          },
          { 
            key: "published", 
            label: app.lang === "ar" ? "منشورة" : "Published", 
            value: stats.published,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10"
          },
          { 
            key: "archived", 
            label: app.lang === "ar" ? "مؤرشفة" : "Archived", 
            value: stats.archived,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-500/10"
          },
          { 
            key: "featured", 
            label: app.lang === "ar" ? "رائجة" : "Featured", 
            value: stats.featured,
            icon: Flame,
            color: "text-orange-600",
            bg: "bg-orange-500/10"
          },
        ].map((stat) => (
          <div
            key={stat.key}
            className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "بحث عن منتج..." : "Search products..."}
            className="ps-9 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <Select value={status} onValueChange={(v: any) => {
          setStatus(v);
          setPage(1);
        }}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">{app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="published">{app.lang === "ar" ? "منشور" : "Published"}</SelectItem>
            <SelectItem value="archived">{app.lang === "ar" ? "مؤرشف" : "Archived"}</SelectItem>
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
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
            setStatus("pending");
            setPage(1);
          }}
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ✅ Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-slate-50/50 dark:bg-slate-800/30">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[200px]">
                  {app.lang === "ar" ? "المنتج" : "Product"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "المتجر" : "Store"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "السعر" : "Price"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[240px]">
                  {app.lang === "ar" ? "إجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-slate-300" />
                      <p className="font-medium">{app.lang === "ar" ? "لا توجد منتجات" : "No products"}</p>
                      <p className="text-sm">{app.lang === "ar" ? "جميع المنتجات تمت مراجعتها" : "All products have been reviewed"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedRows.map((r: any) => (
                <TableRow key={r.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {r.cover_url && (
                        <img
                          src={r.cover_url}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {app.lang === "ar" ? r.title_ar : (r.title_en || r.title_ar)}
                          {r.is_featured && (
                            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                          {r.categories?.[app.lang === "ar" ? "name_ar" : "name_en"] ?? "—"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center">
                    {r.profiles?.store_name || r.profiles?.full_name || "—"}
                  </TableCell>
                  <TableCell className="font-bold text-[#2563eb] text-center">
                    {formatPrice(r.price, r.currency, app.lang)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        r.status === "published"
                          ? "default"
                          : r.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        r.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                        r.status === "published" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      }
                    >
                      {r.status === "pending" ? (app.lang === "ar" ? "قيد المراجعة" : "Pending") :
                       r.status === "published" ? (app.lang === "ar" ? "منشور" : "Published") :
                       (app.lang === "ar" ? "مؤرشف" : "Archived")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant={r.is_featured ? "default" : "ghost"}
                        className={
                          r.is_featured
                            ? "bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8 px-3"
                            : "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700"
                        }
                        onClick={() =>
                          setFeatured.mutate(
                            { id: r.id, is_featured: !r.is_featured },
                            {
                              onSuccess: () =>
                                toast.success(
                                  app.lang === "ar"
                                    ? r.is_featured
                                      ? "أُزيل من الرائج"
                                      : "أُضيف للرائج"
                                    : r.is_featured
                                    ? "Removed from trending"
                                    : "Added to trending"
                                ),
                            }
                          )
                        }
                        title={app.lang === "ar" ? "الأكثر رواجاً" : "Trending"}
                      >
                        <Flame className="h-3.5 w-3.5" />
                      </Button>
                      {r.status !== "published" && (
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-8 px-3"
                          onClick={() =>
                            setStatusMut.mutate(
                              { id: r.id, status: "published" },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    app.lang === "ar" ? "✅ تمت الموافقة" : "✅ Approved"
                                  ),
                              }
                            )
                          }
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "موافقة" : "Approve"}
                        </Button>
                      )}
                      {r.status !== "archived" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50"
                          onClick={() =>
                            setStatusMut.mutate(
                              { id: r.id, status: "archived" },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    app.lang === "ar" ? "❌ تم الرفض" : "❌ Rejected"
                                  ),
                              }
                            )
                          }
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "رفض" : "Reject"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl h-8 px-2"
                        onClick={() => {
                          if (
                            confirm(
                              app.lang === "ar"
                                ? "⚠️ هل أنت متأكد من حذف هذا المنتج نهائياً؟"
                                : "⚠️ Are you sure you want to delete this product permanently?"
                            )
                          )
                            del.mutate(r.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredRows.length === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد منتجات" : "No products"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} من ${filteredRows.length} منتج`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} of ${filteredRows.length} products`}
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
                title={app.lang === "ar" ? "الصفحة الأولى" : "First page"}
              >
                <span className="text-xs">«</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "السابق" : "Previous"}
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
                title={app.lang === "ar" ? "التالي" : "Next"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "الصفحة الأخيرة" : "Last page"}
              >
                <span className="text-xs">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Footer */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {app.lang === "ar"
              ? `عرض ${paginatedRows.length} من ${filteredRows.length} منتج (إجمالي ${rows.length})`
              : `Showing ${paginatedRows.length} of ${filteredRows.length} products (total ${rows.length})`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
              {status === "pending" && (app.lang === "ar" ? "قيد المراجعة" : "Pending")}
              {status === "published" && (app.lang === "ar" ? "منشور" : "Published")}
              {status === "archived" && (app.lang === "ar" ? "مؤرشف" : "Archived")}
              {status === "all" && (app.lang === "ar" ? "الكل" : "All")}
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