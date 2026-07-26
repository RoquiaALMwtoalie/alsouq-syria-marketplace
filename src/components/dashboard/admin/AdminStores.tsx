// src/components/dashboard/admin/AdminStores.tsx
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp, useT } from "@/lib/i18n";
import { useAdminAllStores, useSetStoreActive, useSetStoreFeatured } from "@/lib/queries";
import { toast } from "sonner";
import { 
  CheckCircle2, XCircle, Flame, Store, Eye, 
  Search, Filter, ChevronDown, RefreshCw,
  Store as StoreIcon, Users, Package, TrendingUp,
  FileSpreadsheet, FileText, ChevronLeft, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const { saveAs } = fileSaver;

export function AdminStores() {
  const app = useApp();
  const { data: stores = [], isLoading, refetch } = useAdminAllStores();
  const setActive = useSetStoreActive();
  const setFeatured = useSetStoreFeatured();

  // ✅ State للبحث والفلترة والـ Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "banned" | "featured">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ فلترة المتاجر
  const filteredStores = useMemo(() => {
    let result = stores;

    // ✅ فلترة حسب الحالة
    if (filterStatus === "active") {
      result = result.filter((s: any) => s.store_active !== false);
    } else if (filterStatus === "banned") {
      result = result.filter((s: any) => s.store_active === false);
    } else if (filterStatus === "featured") {
      result = result.filter((s: any) => s.is_featured === true);
    }

    // ✅ فلترة حسب البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s: any) => {
        return (
          s.store_name?.toLowerCase().includes(q) ||
          s.full_name?.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.store_description?.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [stores, searchQuery, filterStatus]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredStores.length / limit);
  const paginatedStores = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredStores.slice(start, end);
  }, [filteredStores, page, limit]);

  // ✅ إحصائيات
  const stats = {
    total: stores.length,
    active: stores.filter((s: any) => s.store_active !== false).length,
    banned: stores.filter((s: any) => s.store_active === false).length,
    featured: stores.filter((s: any) => s.is_featured === true).length,
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
    const exportData = filteredStores.map((s: any) => ({
      'اسم المتجر': s.store_name || s.full_name || '—',
      'المالك': s.full_name || '—',
      'الهاتف': s.phone || '—',
      'عدد المنتجات': s.listing_count || 0,
      'الحالة': s.store_active === false ? 'محظور' : 'نشط',
      'رائج': s.is_featured ? 'نعم' : 'لا',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المتاجر');
    
    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
    ];
    ws['!cols'] = colWidths;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المتاجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
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
          .status-active { color: #10b981; font-weight: bold; }
          .status-banned { color: #ef4444; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير المتاجر</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${filterStatus !== 'all' ? ` | الفلتر: ${filterStatus}` : ''}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المتجر</th>
              <th>المالك</th>
              <th>الهاتف</th>
              <th>عدد المنتجات</th>
              <th>الحالة</th>
              <th>رائج</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredStores.forEach((s: any, index: number) => {
      const statusClass = s.store_active === false ? 'status-banned' : 'status-active';
      const statusText = s.store_active === false ? 'محظور' : 'نشط';
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${s.store_name || s.full_name || '—'}</td>
          <td>${s.full_name || '—'}</td>
          <td>${s.phone || '—'}</td>
          <td>${s.listing_count || 0}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${s.is_featured ? '✅ نعم' : '—'}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي المتاجر: ${filteredStores.length} | تم التصدير من لوحة التحكم
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المتاجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-blue-600" />
            {app.lang === "ar" ? "المتاجر" : "Stores"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? `إدارة جميع المتاجر (${filteredStores.length} من ${stores.length})`
              : `Manage all stores (${filteredStores.length} of ${stores.length})`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredStores.length === 0}
            className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredStores.length === 0}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { 
            key: "total", 
            label: app.lang === "ar" ? "إجمالي المتاجر" : "Total Stores", 
            value: stats.total,
            icon: Store,
            color: "text-blue-600",
            bg: "bg-blue-500/10"
          },
          { 
            key: "active", 
            label: app.lang === "ar" ? "نشطة" : "Active", 
            value: stats.active,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10"
          },
          { 
            key: "banned", 
            label: app.lang === "ar" ? "محظورة" : "Banned", 
            value: stats.banned,
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
            placeholder={app.lang === "ar" ? "بحث عن متجر..." : "Search stores..."}
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
              <SelectValue placeholder={app.lang === "ar" ? "جميع المتاجر" : "All stores"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "جميع المتاجر" : "All stores"}</SelectItem>
            <SelectItem value="active">{app.lang === "ar" ? "نشطة فقط" : "Active only"}</SelectItem>
            <SelectItem value="banned">{app.lang === "ar" ? "محظورة فقط" : "Banned only"}</SelectItem>
            <SelectItem value="featured">{app.lang === "ar" ? "رائجة فقط" : "Featured only"}</SelectItem>
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
            setFilterStatus("all");
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
                  {app.lang === "ar" ? "المتجر" : "Store"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الهاتف" : "Phone"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  {app.lang === "ar" ? "المنتجات" : "Products"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[220px]">
                  {app.lang === "ar" ? "إجراء" : "Action"}
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
              {!isLoading && paginatedStores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Store className="h-12 w-12 text-slate-300" />
                      <p>{app.lang === "ar" ? "لا توجد متاجر تطابق البحث" : "No stores match your search"}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterStatus("all");
                        }}
                        className="mt-2"
                      >
                        {app.lang === "ar" ? "مسح البحث" : "Clear search"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedStores.map((s: any) => (
                <TableRow key={s.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {s.store_logo_url && (
                        <img
                          src={s.store_logo_url}
                          className="h-11 w-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <Link
                            to="/store/$id"
                            params={{ id: s.id }}
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {s.store_name || s.full_name || "—"}
                          </Link>
                          {s.is_featured && (
                            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                          {s.store_description || s.full_name || ""}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Link
                            to="/store/$id"
                            params={{ id: s.id }}
                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <Eye className="h-3 w-3" />
                            {app.lang === "ar" ? "عرض المتجر" : "View store"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300 font-mono text-center" dir="ltr">
                    {s.phone || "—"}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white text-center">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200/30 font-mono">
                      {s.listing_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {s.store_active === false ? (
                      <Badge
                        variant="destructive"
                        className="bg-rose-500/10 text-rose-600 border-rose-500/20"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        {app.lang === "ar" ? "محظور" : "Banned"}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {app.lang === "ar" ? "نشط" : "Active"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant={s.is_featured ? "default" : "ghost"}
                        className={
                          s.is_featured
                            ? "bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8 px-3"
                            : "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700"
                        }
                        onClick={() =>
                          setFeatured.mutate(
                            { id: s.id, is_featured: !s.is_featured },
                            {
                              onSuccess: () =>
                                toast.success(
                                  app.lang === "ar"
                                    ? s.is_featured
                                      ? "أُزيل من الرائج"
                                      : "أُضيف للرائج"
                                    : s.is_featured
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
                      {s.store_active === false ? (
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-8 px-3"
                          onClick={() =>
                            setActive.mutate(
                              { id: s.id, active: true },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    app.lang === "ar" ? "تم التفعيل" : "Activated"
                                  ),
                              }
                            )
                          }
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "تفعيل" : "Unban"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50"
                          onClick={() => {
                            if (
                              confirm(
                                app.lang === "ar"
                                  ? "هل أنت متأكد من حظر هذا المتجر؟"
                                  : "Are you sure you want to ban this store?"
                              )
                            )
                              setActive.mutate(
                                { id: s.id, active: false },
                                {
                                  onSuccess: () =>
                                    toast.success(
                                      app.lang === "ar" ? "تم الحظر" : "Banned"
                                    ),
                                }
                              );
                          }}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "حظر" : "Ban"}
                        </Button>
                      )}
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
              {filteredStores.length === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد متاجر" : "No stores"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} من ${filteredStores.length} متجر`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} of ${filteredStores.length} stores`}
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
              ? `عرض ${paginatedStores.length} من ${filteredStores.length} متجر (إجمالي ${stores.length})`
              : `Showing ${paginatedStores.length} of ${filteredStores.length} stores (total ${stores.length})`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
              {filterStatus === "all" && (app.lang === "ar" ? "جميع" : "All")}
              {filterStatus === "active" && (app.lang === "ar" ? "نشطة" : "Active")}
              {filterStatus === "banned" && (app.lang === "ar" ? "محظورة" : "Banned")}
              {filterStatus === "featured" && (app.lang === "ar" ? "رائجة" : "Featured")}
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